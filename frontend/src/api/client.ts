// All fetch calls go through here. One pattern, easy to trace.

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001";


async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getJobs:    ()               => request<Job[]>("/jobs"),
  getJob:     (id: number)     => request<Job>(`/jobs/${id}`),
  createJob:  (body: Partial<Job>) => request<Job>("/jobs", { method: "POST", body: JSON.stringify(body) }),
  updateJob:  (id: number, body: Partial<Job>) =>
    request<Job>(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  appendNote: (id: number, text: string) =>
    request<Job>(`/jobs/${id}/notes`, { method: "POST", body: JSON.stringify({ text }) }),
  deleteJob:  (id: number) => request<void>(`/jobs/${id}`, { method: "DELETE" }),
};