// src/types.ts

export type Branch =
  | "Army"
  | "Navy"
  | "Air Force"
  | "Marines"
  | "Coast Guard"
  | "Space Force";

export interface Veteran {
  id: number;
  name: string;
}

export interface VeteranResource {
  resource_id: number;
  title: string;
  description: string;
  category: string;
  organization: string;
  contact_info: string;
  active: boolean;
}

export type ResourceFormData = Omit<VeteranResource, "resource_id">;

export type ServiceRequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface ServiceRequest {
  id: number;
  veteran_id: number;
  category: string;
  description: string;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  veteran_name?: string;
}

export interface ServiceRequestFormData {
  veteran_id: number;
  category: string;
  description: string;
  status: ServiceRequestStatus;
}

//  registration payload type
export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
  branch: Branch;
  email?: string;
}
