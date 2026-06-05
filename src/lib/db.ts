import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "kidspark.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS parents (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'en',
      country TEXT NOT NULL DEFAULT 'US',
      secondary_safeguarding_contact_name TEXT NOT NULL DEFAULT '',
      secondary_safeguarding_contact_phone TEXT NOT NULL DEFAULT '',
      secondary_safeguarding_contact_relation TEXT NOT NULL DEFAULT '',
      consent_version TEXT NOT NULL DEFAULT '1.0',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS child_profiles (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age INTEGER NOT NULL CHECK (age >= 3 AND age <= 16),
      grade TEXT NOT NULL,
      curriculum TEXT NOT NULL DEFAULT 'british',
      language TEXT NOT NULL DEFAULT 'en',
      cultural_mode TEXT NOT NULL DEFAULT 'default',
      relational_register TEXT NOT NULL DEFAULT 'facilitator',
      emotional_framing TEXT NOT NULL DEFAULT 'feelings',
      avatar_id TEXT NOT NULL DEFAULT 'owl',
      vulnerability_tags TEXT NOT NULL DEFAULT '[]',
      vulnerability_notes TEXT NOT NULL DEFAULT '',
      daily_session_limit_minutes INTEGER NOT NULL DEFAULT 60,
      allowed_hours_start TEXT NOT NULL DEFAULT '08:00',
      allowed_hours_end TEXT NOT NULL DEFAULT '21:00',
      creative_studio_enabled INTEGER NOT NULL DEFAULT 1,
      cross_session_memory_enabled INTEGER NOT NULL DEFAULT 0,
      coaching_mode_only INTEGER NOT NULL DEFAULT 0,
      parent_visibility TEXT NOT NULL DEFAULT 'full',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      duration_minutes REAL NOT NULL DEFAULT 0,
      topics TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('child', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      hint_level INTEGER NOT NULL DEFAULT 0,
      flagged INTEGER NOT NULL DEFAULT 0,
      flag_reason TEXT
    );

    CREATE TABLE IF NOT EXISTS safeguarding_flags (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      child_id TEXT NOT NULL,
      severity TEXT NOT NULL,
      trigger_content TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_review',
      alerted_parent INTEGER NOT NULL DEFAULT 0,
      alerted_secondary INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS consent_log (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      action TEXT NOT NULL,
      terms_version TEXT NOT NULL,
      method TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Helper to generate IDs
export function generateId(): string {
  return crypto.randomUUID();
}
