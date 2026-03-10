const API_BASE = "http://localhost:8080";

interface SignupData {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

interface SigninData {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await res.text();
  let data: T & { message?: string };
  try {
    data = (text ? JSON.parse(text) : {}) as T & { message?: string };
  } catch {
    // Backend sent plain text (e.g. "Public Content.")
    data = { message: text } as T & { message?: string };
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data as T;
}

export function signup(data: SignupData) {
  return request<{ message: string }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signin(data: SigninData) {
  return request<AuthResponse>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function testEndpoint(path: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["x-access-token"] = token;
  return request<{ message?: string }>(`/api/test/${path}`, { headers });
}
