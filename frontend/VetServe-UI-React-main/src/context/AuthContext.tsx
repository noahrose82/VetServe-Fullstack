import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../services/api";
import type { RegisterPayload } from "../types";

interface User {
  id: number;
  username: string;
  role: "admin" | "user";
  name: string;
  veteranId?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vetserve_token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        localStorage.removeItem("vetserve_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async (payload: RegisterPayload) => {
    try {
      const { token, user } = await authApi.register(payload);
      localStorage.setItem("vetserve_token", token);
      setUser(user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message ?? "Registration failed" };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { token, user } = await authApi.login({ username, password });
      localStorage.setItem("vetserve_token", token);
      setUser(user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message ?? "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("vetserve_token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};