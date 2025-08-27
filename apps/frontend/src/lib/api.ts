export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export class Api {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${API_URL}${url}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const api = new Api();
