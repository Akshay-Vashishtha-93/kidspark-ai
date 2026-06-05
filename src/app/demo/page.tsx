"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import type { ChildProfile } from "@/types";

const DEMO_CHILD: ChildProfile = {
  id: "demo-child-001",
  parent_id: "demo-parent-001",
  name: "Alex",
  age: 9,
  age_group: "7-10",
  grade: "Grade 4",
  curriculum: "british",
  language: "en",
  cultural_mode: "default",
  relational_register: "facilitator",
  emotional_framing: "feelings",
  avatar_id: "owl",
  vulnerability_tags: [],
  vulnerability_notes: "",
  daily_session_limit_minutes: 60,
  allowed_hours_start: "08:00",
  allowed_hours_end: "21:00",
  creative_studio_enabled: true,
  cross_session_memory_enabled: false,
  coaching_mode_only: false,
  parent_visibility: "full",
  created_at: new Date().toISOString(),
};

export default function DemoPage() {
  return (
    <div className="h-screen bg-cream flex flex-col">
      {/* Demo banner */}
      <div className="bg-primary-500 text-white text-center text-sm py-2 px-4 font-medium">
        Demo Mode — Meet Alex, age 9. Try asking a homework question, a creative prompt, or just say hi!
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface childProfile={DEMO_CHILD} curriculumContext={null} />
      </div>
    </div>
  );
}
