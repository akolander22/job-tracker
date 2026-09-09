import { useState } from "react";
import { api } from "../api/client";
import type { Stage } from "../types";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddJobModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    title: "", company: "", url: "", location: "",
    remote: "unknown", stage: "Applied" as Stage,
    contact_name: "", contact_email: "",
    salary_min: "", salary_max: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    // TODO: add validation (title + company are required)
    await api.createJob({
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : undefined,
      salary_max: form.salary_max ? Number(form.salary_max) : undefined,
    });
    onCreated();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", width: 400 }}>
        <h2>Add Job</h2>

        {/* Core fields */}
        <input placeholder="Title *" value={form.title} onChange={e => set("title", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />
        <input placeholder="Company *" value={form.company} onChange={e => set("company", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />
        <input placeholder="URL" value={form.url} onChange={e => set("url", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />
        <input placeholder="Location" value={form.location} onChange={e => set("location", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />

        {/* TODO: add salary fields, remote select, contact fields */}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}