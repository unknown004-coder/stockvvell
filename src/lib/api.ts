const BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export async function getJSON(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function postJSON(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function putJSON(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function del(path: string) {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res;
}
