// ============================================
// KidSpark AI — Core Type Definitions
// ============================================

// --- Enums ---

export type Curriculum =
  | "british"
  | "cbse"
  | "uae_moe"
  | "us_common_core"
  | "waec"
  | "ib_pyp"
  | "ib_myp"
  | "saudi_moe"
  | "australian";

export type AgeGroup = "3-6" | "7-10" | "11-13" | "14-16";

export type CulturalMode = "default" | "islamic_gulf" | "islamic_egypt" | "islamic_levant" | "secular_strict";

export type RelationalRegister = "facilitator" | "elder_guide" | "peer_companion";

export type EmotionalFraming = "feelings" | "focus_energy";

export type ParentVisibility = "full" | "summary_drilldown" | "summary_only" | "alerts_only";

export type SessionStatus = "active" | "paused" | "ended" | "locked_cooldown";

export type SafeguardingSeverity = "scenario_a_abuse" | "scenario_b_crisis" | "scenario_c_parent_implicated" | "scenario_d_pattern";

export type MessageRole = "child" | "assistant" | "system";

// --- Core Models ---

export interface Parent {
  id: string;
  email: string;
  name: string;
  language: string;
  country: string;
  created_at: string;
  consent_logged_at: string;
  consent_version: string;
  secondary_safeguarding_contact_name: string;
  secondary_safeguarding_contact_phone: string;
  secondary_safeguarding_contact_relation: string;
}

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  age_group: AgeGroup;
  grade: string;
  curriculum: Curriculum;
  language: string;
  cultural_mode: CulturalMode;
  relational_register: RelationalRegister;
  emotional_framing: EmotionalFraming;
  avatar_id: string;

  // Vulnerability profile (F6.4)
  vulnerability_tags: string[];
  vulnerability_notes: string;

  // Session limits
  daily_session_limit_minutes: number;
  allowed_hours_start: string; // "08:00"
  allowed_hours_end: string;   // "21:00"

  // Feature toggles
  creative_studio_enabled: boolean;
  cross_session_memory_enabled: boolean;
  coaching_mode_only: boolean; // Academic integrity

  // Parent visibility
  parent_visibility: ParentVisibility;

  created_at: string;
}

export interface ChatSession {
  id: string;
  child_id: string;
  started_at: string;
  ended_at: string | null;
  status: SessionStatus;
  duration_minutes: number;
  topics: string[];
  safeguarding_flags: SafeguardingFlag[];
  curriculum_context: CurriculumContext | null;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  hint_level: number; // 0 = no hint context, 1 = first hint, 2 = deeper, 3 = explanation
  flagged: boolean;
  flag_reason: string | null;
}

export interface SafeguardingFlag {
  id: string;
  session_id: string;
  child_id: string;
  severity: SafeguardingSeverity;
  trigger_content: string;
  ai_response: string;
  status: "pending_review" | "reviewed" | "escalated" | "resolved";
  alerted_parent: boolean;
  alerted_secondary: boolean;
  created_at: string;
}

export interface CurriculumContext {
  curriculum: Curriculum;
  grade: string;
  subject: string;
  unit: string;
  learning_objectives: string[];
  methodology_notes: string; // e.g., "Use bar model for fractions, NOT cross-multiplication"
}

export interface WeeklySummary {
  id: string;
  child_id: string;
  week_start: string;
  total_sessions: number;
  total_minutes: number;
  topics_explored: string[];
  longest_session_minutes: number;
  safeguarding_flags_count: number;
  struggles: string[]; // Topics child found difficult
  strengths: string[]; // Topics child excelled at
  generated_summary: string; // Plain-language parent summary
}

// --- Session Timer ---

export interface SessionTimer {
  remaining_minutes: number;
  total_minutes: number;
  is_cooldown: boolean;
  cooldown_ends_at: string | null;
  break_reminder_shown: boolean;
}

// --- Curriculum Data Layer ---

export interface CurriculumSubject {
  id: string;
  curriculum: Curriculum;
  grade: string;
  subject: string;
  term: number;
  units: CurriculumUnit[];
}

export interface CurriculumUnit {
  id: string;
  name: string;
  order: number;
  learning_objectives: string[];
  methodology_notes: string;
  keywords: string[];
}

// --- UI State ---

export interface AppState {
  currentChild: ChildProfile | null;
  currentSession: ChatSession | null;
  sessionTimer: SessionTimer | null;
  isParentMode: boolean;
  direction: "ltr" | "rtl";
}
