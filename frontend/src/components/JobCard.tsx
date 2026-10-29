import { STAGES } from "../types";
import type { Job, Stage } from "../types";
import { getStaleness, STALENESS_COLORS } from "../utils/staleness";
import { api } from "../api/client";

interface Props {
  job: Job;
  onMove: (id: number, stage: Stage) => void;
  onUpdate: () => void;
}

export default function JobCard({ job, onMove, onUpdate }: Props) {
  const { level, days } = getStaleness(job.last_updated);
  const color = STALENESS_COLORS[level];

  const handleNoteAdd = async () => {
    const text = prompt("Add a note:");
    if (!text) return;
    await api.appendNote(job.id, text);
    onUpdate();
  };

  return (
    <div
      // TODO: add draggable="true" and onDragStart to enable drag-and-drop
      // draggable
      // onDragStart={e => e.dataTransfer.setData("jobId", String(job.id))}
      style={{
        background: "#fff",
        borderRadius: 6,
        padding: "0.75rem",
        marginBottom: "0.5rem",
        borderLeft: `4px solid ${color}`,  // staleness color stripe
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* Staleness badge — TODO: style this however you like */}
      <span style={{ float: "right", fontSize: "0.75em", color, fontWeight: 600 }}>
        {days}d
      </span>

      <div style={{ fontWeight: 600 }}>{job.title}</div>
      <div style={{ fontSize: "0.875em", color: "#475569" }}>{job.company}</div>

      {job.location && (
        <div style={{ fontSize: "0.75em", color: "#94a3b8" }}>{job.location} · {job.remote}</div>
      )}

      {/* Stage mover — simple select, drag-drop is the TODO */}
      <select
        value={job.stage}
        onChange={e => onMove(job.id, e.target.value as Stage)}
        style={{ marginTop: "0.5rem", width: "100%", fontSize: "0.8em" }}
      >
        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <button onClick={handleNoteAdd} style={{ marginTop: "0.5rem", fontSize: "0.75em" }}>
        + Note
      </button>

      {/* TODO: expand card on click to show full notes, salary, contact info */}
    </div>
  );
}