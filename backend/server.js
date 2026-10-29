const express = require("express");
const cors = require("cors");
const { getAllJobs, getJobById, getJobByUrl, createJob, updateJob, appendNote, deleteJob } = require("./db");

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
// A job whose URL is already on the board isn't added twice: you get the
// existing card back with 200 instead of 201.
app.post("/jobs", (req, res) => {
  if (!req.body.title || !req.body.company) {
    return res.status(400).json({ error: "title and company required" });
  }
  if (req.body.url) {
    const existing = getJobByUrl(req.body.url);
    if (existing) return res.status(200).json(existing);
  }
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