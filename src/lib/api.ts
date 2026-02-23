const BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

function authHeaders() {
  return { "Content-Type": "application/json" };
}

export async function getJSON(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function postJSON(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
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
  const res = await fetch(`${BASE}${path}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    // strip HTML tags if any and limit length
    const cleaned = text.replace(/<[^>]*>/g, "").trim().slice(0, 200) || res.statusText;
    throw new Error(`HTTP ${res.status}: ${cleaned}`);
  }
  return res;
}
