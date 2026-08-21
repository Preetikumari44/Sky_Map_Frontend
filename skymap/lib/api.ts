// Frontend API client for the buyer dashboard.
//
// IMPORTANT: This file contains NO backend logic. Every function below calls a
// REST endpoint that is expected to exist on the backend (see the TODO on each
// function). Until those routes are implemented, calls here will fail with a
// network/404 error — the UI is built to handle that via loading/error states.

import type {
  Property,
  PropertyDimensions,
  PropertyTour,
  User,
  VastuReportData,
} from "./types"

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed (${res.status})`, res.status)
  }
  return res.json() as Promise<T>
}

// ---- Auth ----------------------------------------------------------------
// TODO(backend): POST /api/auth/login -> { user: User, token: string }
export function login(email: string, password: string) {
  return request<{ user: User; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// TODO(backend): POST /api/auth/signup -> { user: User, token: string }
export function signup(name: string, email: string, password: string) {
  return request<{ user: User; token: string }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

// TODO(backend): POST /api/auth/logout -> { ok: true }
export function logout() {
  return request<{ ok: true }>("/api/auth/logout", { method: "POST" })
}

// TODO(backend): GET /api/auth/me -> User (401 if not logged in)
export function getCurrentUser() {
  return request<User>("/api/auth/me")
}

// ---- Dashboard: properties -------------------------------------------------
// TODO(backend): GET /api/user/properties -> Property[]
// Properties shared with the logged-in buyer by an agent/builder.
export function getUserProperties() {
  return request<Property[]>("/api/user/properties")
}

// TODO(backend): GET /api/user/properties/saved -> Property[]
export function getSavedProperties() {
  return request<Property[]>("/api/user/properties/saved")
}

// TODO(backend): POST /api/user/properties/:id/save -> { ok: true }
export function saveProperty(id: string) {
  return request<{ ok: true }>(`/api/user/properties/${id}/save`, { method: "POST" })
}

// TODO(backend): DELETE /api/user/properties/:id/save -> { ok: true }
export function unsaveProperty(id: string) {
  return request<{ ok: true }>(`/api/user/properties/${id}/save`, { method: "DELETE" })
}

// ---- Property detail --------------------------------------------------------
// TODO(backend): GET /api/property/:id -> Property
export function getProperty(id: string) {
  return request<Property>(`/api/property/${id}`)
}

// TODO(backend): GET /api/property/:id/tour -> PropertyTour
export function getPropertyTour(id: string) {
  return request<PropertyTour>(`/api/property/${id}/tour`)
}

// TODO(backend): GET /api/property/:id/vastu -> VastuReportData
export function getPropertyVastu(id: string) {
  return request<VastuReportData>(`/api/property/${id}/vastu`)
}

// TODO(backend): GET /api/property/:id/dimensions -> PropertyDimensions
export function getPropertyDimensions(id: string) {
  return request<PropertyDimensions>(`/api/property/${id}/dimensions`)
}

// ---- Account -----------------------------------------------------------------
// TODO(backend): PATCH /api/user/profile -> User
export function updateProfile(patch: Partial<Pick<User, "name" | "phone">>) {
  return request<User>("/api/user/profile", {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
}

// Generic fetcher for use with SWR: useSWR(path, fetcher)
export function fetcher<T>(path: string): Promise<T> {
  return request<T>(path)
}

export { ApiError }
