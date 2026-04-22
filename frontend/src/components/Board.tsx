import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Job, STAGES, Stage } from "../types";
import JobCard from "./JobCard";
import AddJobModal from "./AddJobModal";

export default function Board() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load jobs once on mount
  useEffect(() => {
    api.getJobs().then(data => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  // Group jobs by stage for column rendering
  const byStage = (stage: Stage) => jobs.filter(j => j.stage === stage);

  // Called after any mutation — re-fetches full list to stay in sync with DB
  const refresh = () => api.getJobs().then(setJobs);

  // Move a card to a new stage (called from drag-drop or a select inside the card)
  const moveJob = async (id: number, stage: Stage) => {
    await api.updateJob(id, { stage });
    refresh();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem", overflowX: "auto" }}>

      <button onClick={() => setShowModal(true)}>+ Add Job</button>

      {STAGES.map(stage => (
        <div
          key={stage}
          // TODO: wire onDrop here for drag-and-drop
          // onDragOver={e => e.preventDefault()}
          // onDrop={e => { const id = Number(e.dataTransfer.getData("jobId")); moveJob(id, stage); }}
          style={{ minWidth: 260, background: "#f1f5f9", borderRadius: 8, padding: "0.75rem" }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>
            {stage} <span style={{ fontSize: "0.8em", color: "#64748b" }}>({byStage(stage).length})</span>
          </h3>

          {byStage(stage).map(job => (
            <JobCard
              key={job.id}
              job={job}
              onMove={moveJob}
              onUpdate={refresh}
            />
          ))}
        </div>
      ))}

      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); refresh(); }}
        />
      )}
    </div>
  );
}