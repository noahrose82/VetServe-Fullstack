/// <reference types="vite/client" />

import type {
  Veteran,
  VeteranResource,
  ResourceFormData,
  ServiceRequest,
  ServiceRequestFormData,
  RegisterPayload,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

// ----------------------
// HELPERS
// ----------------------
function normalizeStatus(s: any): ServiceRequest["status"] {
  const v = String(s ?? "").toLowerCase();
  if (v === "open" || v === "pending") return "pending";
  if (v === "in progress" || v === "in_progress" || v === "in-progress") return "in_progress";
  if (v === "closed" || v === "completed" || v === "complete") return "completed";
  if (v === "cancelled" || v === "canceled") return "cancelled";
  return "pending";
}

function normalizeServiceRequest(raw: any): ServiceRequest {
  return {
    id: Number(raw.id),
    veteran_id: Number(raw.veteran_id ?? raw.veteranId ?? 0),
    category: String(raw.category ?? ""),
    description: String(raw.description ?? ""),
    status: normalizeStatus(raw.status),
    created_at: String(raw.created_at ?? raw.createdAt ?? new Date().toISOString()),
    updated_at: String(raw.updated_at ?? raw.updatedAt ?? raw.created_at ?? raw.createdAt ?? new Date().toISOString()),
  };
}

function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("vetserve_token");
  const headers = new Headers(init.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");

  return fetch(input, { ...init, headers });
}

async function parseError(res: Response, fallback: string) {
  const msg = await res.json().catch(() => ({} as any));
  return msg?.message ?? fallback;
}

// ----------------------
// AUTH
// ----------------------
export const authApi = {
  async register(payload: RegisterPayload): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await parseError(res, "Registration failed"));
    return res.json();
  },

  async login(payload: { username: string; password: string }): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await parseError(res, "Login failed"));
    return res.json();
  },

  async me(): Promise<any> {
    const res = await authFetch(`${API_BASE}/auth/me`, { method: "GET" });
    if (!res.ok) throw new Error(await parseError(res, "Failed to load current user"));
    return res.json();
  },
};

// ----------------------
// VETERANS
// ----------------------
export const veteransApi = {
  async getAll(): Promise<Veteran[]> {
    const res = await fetch(`${API_BASE}/veterans`);
    if (!res.ok) throw new Error("Failed to load veterans");

    const raw = await res.json();
    return (Array.isArray(raw) ? raw : []).map((v: any) => ({
      id: Number(v.id),
      name: `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim() || "Unknown",
    }));
  },
};

// ----------------------
// RESOURCES
// ----------------------
export const resourcesApi = {
  async getAll(): Promise<VeteranResource[]> {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error("Failed to load resources");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getById(id: number): Promise<VeteranResource> {
    const res = await fetch(`${API_BASE}/resources/${id}`);
    if (!res.ok) throw new Error("Failed to load resource");
    return res.json();
  },

  async create(data: ResourceFormData): Promise<VeteranResource> {
    const res = await fetch(`${API_BASE}/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create resource");
    return res.json();
  },

  async update(id: number, data: ResourceFormData): Promise<VeteranResource> {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update resource");
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/resources/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete resource");
  },
};

// ----------------------
// SERVICE REQUESTS
// ----------------------
export const serviceRequestsApi = {
  async getAll(limit = 10, offset = 0): Promise<{ data: ServiceRequest[]; total: number }> {
    const res = await fetch(`${API_BASE}/service-requests`);
    if (!res.ok) throw new Error("Failed to load service requests");

    const raw = await res.json();
    const all = (Array.isArray(raw) ? raw : []).map(normalizeServiceRequest);

    return { total: all.length, data: all.slice(offset, offset + limit) };
  },

  async getById(id: number): Promise<ServiceRequest> {
    const res = await fetch(`${API_BASE}/service-requests/${id}`);
    if (!res.ok) throw new Error("Failed to load service request");
    return normalizeServiceRequest(await res.json());
  },

  async create(data: ServiceRequestFormData): Promise<ServiceRequest> {
    const payload = {
      veteranId: data.veteran_id,
      category: data.category,
      description: data.description,
      status:
        data.status === "pending"
          ? "Open"
          : data.status === "in_progress"
          ? "In Progress"
          : data.status === "completed"
          ? "Closed"
          : "Cancelled",
    };

    const res = await fetch(`${API_BASE}/service-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create service request");
    return normalizeServiceRequest(await res.json());
  },

  async update(id: number, data: Partial<ServiceRequestFormData>): Promise<ServiceRequest> {
    const payload: any = {};
    if (data.veteran_id != null) payload.veteranId = data.veteran_id;
    if (data.category != null) payload.category = data.category;
    if (data.description != null) payload.description = data.description;
    if (data.status != null) {
      payload.status =
        data.status === "pending"
          ? "Open"
          : data.status === "in_progress"
          ? "In Progress"
          : data.status === "completed"
          ? "Closed"
          : "Cancelled";
    }

    const res = await fetch(`${API_BASE}/service-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update service request");
    return normalizeServiceRequest(await res.json());
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/service-requests/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete service request");
  },
};