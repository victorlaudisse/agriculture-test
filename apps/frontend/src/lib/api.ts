export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export class Api {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private resolveToken() {
    if (this.token) return this.token;
    if (typeof window === "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { cookies } = require("next/headers");
        return cookies().get("token")?.value ?? null;
      } catch {
        return null;
      }
    }
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] ?? null
    );
  }

  async get<T>(url: string): Promise<T> {
    const token = this.resolveToken();
    const res = await fetch(`${API_URL}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(url: string, body: any): Promise<T> {
    const token = this.resolveToken();
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const api = new Api();
