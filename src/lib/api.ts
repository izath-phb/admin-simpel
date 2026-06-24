import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  rt?: string;
  rw?: string;
  photo_url?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  coordinates: [number, number];
  status: "pending" | "verified" | "on_progress" | "resolved" | "rejected";
  imageUrl?: string;
  afterImageUrl?: string;
  adminNote?: string;
  rating?: number;
  created_at: string;
  logs: { status: string; note: string; timestamp: string }[];
  comments?: { id: string; user_name: string; content: string; created_at: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  progress: number;
  status: string;
  coordinates?: [number, number];
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  is_carousel: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_reports: number;
  pending_reports: number;
  verified_reports: number;
  on_progress_reports: number;
  resolved_reports: number;
  reports_today: number;
  total_projects: number;
  total_budget: number;
  avg_progress: number;
  blocked_users: number;
  chart_data: { month: string; count: number }[];
  recent_logs: { admin: string; action: string; target: string; timestamp: string }[];
}
