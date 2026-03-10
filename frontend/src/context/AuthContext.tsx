import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthResponse } from "@/lib/api";

interface AuthState {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: AuthState | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((data: AuthResponse) => {
    const state: AuthState = {
      token: data.accessToken,
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    localStorage.setItem("auth", JSON.stringify(state));
    setUser(state);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
