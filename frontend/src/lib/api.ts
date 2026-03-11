export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

/** Client–server message flow: request + response for display */
export interface ClientServerMessage {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  responseStatus: number;
  responseBody: string;
  ok: boolean;
}

export async function testEndpointWithFlow(
  path: string,
  token?: string
): Promise<ClientServerMessage> {
  const url = `${API_BASE}/api/test/${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "x-access-token": token } : {}),
  };
  const res = await fetch(url, { method: "GET", headers });
  const text = await res.text();
  let body: string;
  try {
    body = text ? JSON.stringify(JSON.parse(text), null, 0) : "{}";
  } catch {
    body = text || "";
  }
  return {
    method: "GET",
    url,
    requestHeaders: headers,
    responseStatus: res.status,
    responseBody: body,
    ok: res.ok,
  };
}
