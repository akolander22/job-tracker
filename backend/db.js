// db.js — All database logic lives here.
// better-sqlite3 is synchronous — no async/await needed, easy to read.
// The scraper imports this same file to write jobs directly.

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, "jobs.db");
const db = new Database(DB_PATH);

// WAL mode lets reads happen while a write is in progress.
// Critical when scraper + server hit the DB at the same time.
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL,
    company       TEXT    NOT NULL,
    url           TEXT,
    source        TEXT,                        -- "linkedin", "indeed", "manual"
    stage         TEXT    NOT NULL DEFAULT 'Applied',
    applied_at    TEXT,                        -- "2025-04-10"
    last_updated  TEXT    NOT NULL,            -- bumped on every PATCH
    notes         TEXT    DEFAULT '',
    contact_name  TEXT,
    contact_email TEXT,
    salary_min    INTEGER,
    salary_max    INTEGER,
    location      TEXT,
    remote        TEXT    DEFAULT 'unknown',   -- "remote" | "hybrid" | "onsite" | "unknown"
    created_at    TEXT    NOT NULL
  );
`);

function getAllJobs() {
  return db.prepare(`SELECT * FROM jobs ORDER BY last_updated DESC`).all();
}

function getJobByUrl(url) {
  return db.prepare(`SELECT * FROM jobs WHERE url = ? ORDER BY id LIMIT 1`).get(url);
}

function getJobById(id) {
  return db.prepare(`SELECT * FROM jobs WHERE id = ?`).get(id);
}

function createJob(job) {
  const now = new Date().toISOString();
  const info = db.prepare(`
    INSERT INTO jobs (title, company, url, source, stage, applied_at, last_updated,
      notes, contact_name, contact_email, salary_min, salary_max, location, remote, created_at)
    VALUES (@title, @company, @url, @source, @stage, @applied_at, @last_updated,
      @notes, @contact_name, @contact_email, @salary_min, @salary_max, @location, @remote, @created_at)
  `).run({
    title: job.title, company: job.company,
    url: job.url ?? null, source: job.source ?? "manual",
    stage: job.stage ?? "Applied", applied_at: job.applied_at ?? now.split("T")[0],
    last_updated: now, notes: job.notes ?? "",
    contact_name: job.contact_name ?? null, contact_email: job.contact_email ?? null,
    salary_min: job.salary_min ?? null, salary_max: job.salary_max ?? null,
    location: job.location ?? null, remote: job.remote ?? "unknown",
    created_at: now,
  });
  return getJobById(info.lastInsertRowid);
}

function updateJob(id, fields) {
  const now = new Date().toISOString();
  const allowed = ["title","company","url","source","stage","applied_at",
    "notes","contact_name","contact_email","salary_min","salary_max","location","remote"];
  const updates = Object.keys(fields)
    .filter(k => allowed.includes(k))
    .map(k => `${k} = @${k}`)
    .join(", ");
  if (!updates) return getJobById(id);
  db.prepare(`UPDATE jobs SET ${updates}, last_updated = @last_updated WHERE id = @id`)
    .run({ ...fields, last_updated: now, id });
  return getJobById(id);
}

function appendNote(id, text) {
  const job = getJobById(id);
  if (!job) return null;
  const ts = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  const combined = job.notes ? `${job.notes}\n[${ts}] ${text}` : `[${ts}] ${text}`;
  return updateJob(id, { notes: combined });
}

function deleteJob(id) {
  return db.prepare(`DELETE FROM jobs WHERE id = ?`).run(id).changes > 0;
}

module.exports = { getAllJobs, getJobById, getJobByUrl, createJob, updateJob, appendNote, deleteJob };