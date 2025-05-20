import { apiRequest } from "./queryClient";

export async function login(email: string, password: string) {
  return apiRequest("POST", "/api/auth/login", { email, password });
}

export async function logout() {
  return apiRequest("POST", "/api/auth/logout", {});
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    throw new Error("Failed to get current user");
  }
  
  return res.json();
}
