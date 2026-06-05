"use client";

import { useState } from "react";
import ParentDashboard from "@/components/parent/ParentDashboard";
import ChatInterface from "@/components/chat/ChatInterface";
import type { ChildProfile, WeeklySummary } from "@/types";
import { Sparkles, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";

const DEMO_CHILDREN: ChildProfile[] = [
  {
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
  },
  {
    id: "demo-child-002",
    parent_id: "demo-parent-001",
    name: "Zara",
    age: 14,
    age_group: "14-16",
    grade: "Grade 9",
    curriculum: "british",
    language: "en",
    cultural_mode: "default",
    relational_register: "facilitator",
    emotional_framing: "feelings",
    avatar_id: "fox",
    vulnerability_tags: ["exam_stress"],
    vulnerability_notes: "Has mentioned feeling stressed about upcoming exams",
    daily_session_limit_minutes: 45,
    allowed_hours_start: "07:00",
    allowed_hours_end: "22:00",
    creative_studio_enabled: true,
    cross_session_memory_enabled: true,
    coaching_mode_only: true,
    parent_visibility: "full",
    created_at: new Date().toISOString(),
  },
];

const DEMO_SUMMARIES: Record<string, WeeklySummary> = {
  "demo-child-001": {
    id: "s-001",
    child_id: "demo-child-001",
    week_start: new Date().toISOString().split("T")[0],
    total_sessions: 5,
    total_minutes: 47,
    topics_explored: ["Fractions", "Volcanoes", "Creative writing"],
    longest_session_minutes: 15,
    safeguarding_flags_count: 0,
    struggles: ["Division with remainders"],
    strengths: ["Reading comprehension", "Science curiosity"],
    generated_summary: "Alex had a great week! Explored fractions, learned about volcanoes, and wrote a short story about a space adventure. Struggled a bit with division remainders but showed strong problem-solving persistence.",
  },
  "demo-child-002": {
    id: "s-002",
    child_id: "demo-child-002",
    week_start: new Date().toISOString().split("T")[0],
    total_sessions: 3,
    total_minutes: 32,
    topics_explored: ["Algebra", "Essay structure", "History - Industrial Revolution"],
    longest_session_minutes: 18,
    safeguarding_flags_count: 0,
    struggles: ["Quadratic equations"],
    strengths: ["Essay argumentation", "Historical analysis"],
    generated_summary: "Zara focused on exam prep this week. Strong essay skills — her arguments are well-structured. Quadratic equations need more practice. Coaching mode ensured she worked through problems independently.",
  },
};

export default function DemoPage() {
  const [view, setView] = useState<"dashboard" | "chat">("dashboard");
  const [chatChild, setChatChild] = useState<ChildProfile>(DEMO_CHILDREN[0]);

  const startChat = (child: ChildProfile) => {
    setChatChild(child);
    setView("chat");
  };

  if (view === "chat") {
    return (
      <div className="h-screen bg-cream flex flex-col">
        <div className="bg-primary-500 text-white text-sm py-2 px-4 font-medium flex items-center justify-between">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-1.5 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Back to Parent Dashboard
          </button>
          <span>Chatting as {chatChild.name} (age {chatChild.age}) — Demo Mode</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface childProfile={chatChild} curriculumContext={null} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Demo banner */}
      <div className="bg-primary-500 text-white text-center text-sm py-2 px-4 font-medium">
        Demo Mode — Explore the parent dashboard, then start a chat session with Alex (age 9) or Zara (age 14)
      </div>

      {/* Top bar */}
      <div className="bg-cream border-b border-border px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-charcoal-light">
            Welcome, <span className="font-medium text-charcoal">Demo Parent</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-charcoal-lighter bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">Demo Account</span>
          </div>
        </div>
      </div>

      {/* Start Learning Card */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="bg-primary-400 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-display text-lg font-bold">Ready to learn?</h2>
              <p className="text-primary-100 text-sm">Pick a child profile below and start a learning session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => startChat(DEMO_CHILDREN[0])} className="bg-white text-primary-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors">
              Chat as Alex (9)
            </button>
            <button onClick={() => startChat(DEMO_CHILDREN[1])} className="bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors">
              Chat as Zara (14)
            </button>
          </div>
        </div>
      </div>

      {/* Parent Dashboard */}
      <ParentDashboard children={DEMO_CHILDREN} summaries={DEMO_SUMMARIES} safeguardingAlerts={0} />
    </div>
  );
}
