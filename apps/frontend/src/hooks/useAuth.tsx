"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  logout(): void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): User {
  const payload = JSON.parse(atob(token.split(".")[1])) as {
    id: string;
    email: string;
  };
  return { id: payload.id, email: payload.email };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
      api.setToken(stored);
    }
    try {
      setUser(parseJwt(stored!));
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ access_token: string }>("/auth/login", {
      email,
      password,
    });
    api.setToken(res.access_token);
    setToken(res.access_token);
    const parsed = parseJwt(res.access_token);
    setUser(parsed);
    localStorage.setItem("token", res.access_token);
    localStorage.setItem("user", JSON.stringify(parsed));
    router.replace("/dashboard");
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post<{ access_token: string }>(
      "/auth/register",
      data,
    );
    api.setToken(res.access_token);
    setToken(res.access_token);
    const parsed = parseJwt(res.access_token);
    setUser(parsed);
    localStorage.setItem("token", res.access_token);
    localStorage.setItem("user", JSON.stringify(parsed));
    router.replace("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
