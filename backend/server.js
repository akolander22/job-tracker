const express = require("express");
const cors = require("cors");
const { getAllJobs, getJobById, createJob, updateJob, appendNote, deleteJob } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// GET /jobs — board fetches this on load and after every mutation
app.get("/jobs", (req, res) => {
  res.json(getAllJobs());
});

// GET /jobs/:id — useful for detail panel later
app.get("/jobs/:id", (req, res) => {
  const job = getJobById(Number(req.params.id));
  if (!job) return res.status(404).json({ error: "Not found" });
  res.json(job);
});

// POST /jobs — create from manual entry or scraper
app.post("/jobs", (req, res) => {
  const job = createJob(req.body);
  res.status(201).json(job);
});

// PATCH /jobs/:id — update stage, notes, any field
app.patch("/jobs/:id", (req, res) => {
  const job = updateJob(Number(req.params.id), req.body);
  if (!job) return res.status(404).json({ error: "Not found" });
  res.json(job);
});

// POST /jobs/:id/notes — append a timestamped note
app.post("/jobs/:id/notes", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });
  const job = appendNote(Number(req.params.id), text);
  if (!job) return res.status(404).json({ error: "Not found" });
  res.json(job);
});

// DELETE /jobs/:id
app.delete("/jobs/:id", (req, res) => {
  const deleted = deleteJob(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Job tracker API running on :${PORT}`));