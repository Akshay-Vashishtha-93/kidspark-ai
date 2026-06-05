"use client";

import { useState } from "react";
import ParentDashboard from "@/components/parent/ParentDashboard";
import ChatInterface from "@/components/chat/ChatInterface";
import type { ChildProfile, WeeklySummary } from "@/types";
import { Sparkles, ArrowLeft, Copy, CheckCircle2, Link2, Shield, Clock, BookOpen, Eye, Star, ChevronRight } from "lucide-react";

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
    parent_visibility: "summary_only",
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

const AVATARS: Record<string, string> = {
  owl: "🦉", fox: "🦊", cat: "🐱", dog: "🐶", rabbit: "🐰",
  bear: "🐻", star: "⭐", rocket: "🚀", robot: "🤖", tree: "🌳",
};

export default function DemoPage() {
  const [view, setView] = useState<"landing" | "learn" | "dashboard" | "chat">("landing");
  const [chatChild, setChatChild] = useState<ChildProfile>(DEMO_CHILDREN[0]);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/demo`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startChat = (child: ChildProfile) => {
    setChatChild(child);
    setView("chat");
  };

  // ===== CHAT VIEW =====
  if (view === "chat") {
    return (
      <div className="h-screen bg-cream flex flex-col">
        <div className="bg-primary-500 text-white text-sm py-2 px-4 font-medium flex items-center justify-between">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-1.5 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Parent Dashboard
          </button>
          <span className="flex items-center gap-2">
            <span>{AVATARS[chatChild.avatar_id] || "🦉"}</span>
            {chatChild.name} (age {chatChild.age}) · {chatChild.curriculum.toUpperCase()} · {chatChild.grade}
            {chatChild.coaching_mode_only && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Coaching Mode</span>}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface childProfile={chatChild} curriculumContext={null} />
        </div>
      </div>
    );
  }

  // ===== LEARN VIEW (Child Entry) =====
  if (view === "learn") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <div className="bg-primary-500 text-white text-sm py-2 px-4 font-medium flex items-center justify-between">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-1.5 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Parent Dashboard
          </button>
          <span>Child&apos;s Learning Space — Shareable Link</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Who&apos;s learning today?</h2>
              <p className="text-charcoal-lighter text-sm mt-2">Tap your name to start!</p>
            </div>
            <div className="space-y-3">
              {DEMO_CHILDREN.map((c, i) => {
                const colors = ["bg-primary-100 text-primary-500", "bg-amber-100 text-amber-600"];
                return (
                  <button key={c.id} onClick={() => startChat(c)} className="w-full flex items-center gap-4 bg-white rounded-xl border border-border p-5 hover:border-primary-300 transition-colors hover:shadow-md">
                    <div className={`w-14 h-14 ${colors[i % 2]} rounded-xl flex items-center justify-center text-2xl`}>
                      {AVATARS[c.avatar_id] || "🦉"}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-charcoal text-lg">{c.name}</div>
                      <div className="text-sm text-charcoal-lighter">Age {c.age} · {c.grade}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-charcoal-lighter" />
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-charcoal-lighter mt-6">
              This is the page parents bookmark on their child&apos;s device. No login needed — uses the parent&apos;s session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD VIEW =====
  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-cream">
        {/* Demo banner */}
        <div className="bg-primary-500 text-white text-center text-sm py-2 px-4 font-medium">
          Demo Mode — Parent Dashboard · All controls, weekly summaries, shareable links, and safety settings
        </div>

        {/* Top bar */}
        <div className="bg-cream border-b border-border px-6 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-sm text-charcoal-light">
              Welcome, <span className="font-medium text-charcoal">Demo Parent</span>
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => setView("landing")} className="text-xs text-charcoal-lighter hover:text-charcoal">
                ← Back to landing
              </button>
              <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">Demo Account</span>
            </div>
          </div>
        </div>

        {/* Child Entry Point Card */}
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <div className="bg-primary-400 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-display text-lg font-bold">Ready to learn?</h2>
                <p className="text-primary-100 text-sm">Hand the device to your child or bookmark the link below on their tablet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setView("learn")} className="bg-white text-primary-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors">
                Start Learning
              </button>
              <button onClick={copyLink} className="bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-white/30 transition-colors flex items-center gap-2">
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 text-charcoal-lighter text-xs">
            <Link2 className="w-3.5 h-3.5" />
            <span>Child&apos;s bookmark link: <code className="bg-white px-2 py-0.5 rounded border border-border">/learn</code> — no login needed for the child, uses your session</span>
          </div>
        </div>

        {/* Parent Dashboard Component */}
        <ParentDashboard children={DEMO_CHILDREN} summaries={DEMO_SUMMARIES} safeguardingAlerts={0} />

        {/* Demo-only: Direct chat buttons */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-2xl border border-border p-6 mt-4">
            <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Try a Chat Session
            </h3>
            <p className="text-sm text-charcoal-lighter mb-4">Experience the AI learning companion firsthand. The AI adapts to each child&apos;s age, curriculum, and safety profile.</p>
            <div className="flex flex-wrap gap-3">
              {DEMO_CHILDREN.map((c) => (
                <button key={c.id} onClick={() => startChat(c)} className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl px-5 py-3 transition-colors">
                  <span className="text-xl">{AVATARS[c.avatar_id] || "🦉"}</span>
                  <div className="text-left">
                    <div className="font-semibold text-charcoal text-sm">Chat as {c.name}</div>
                    <div className="text-xs text-charcoal-lighter">Age {c.age} · {c.grade} · {c.coaching_mode_only ? "Coaching mode" : "Full help"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LANDING VIEW =====
  return (
    <div className="min-h-screen bg-cream">
      {/* Demo banner */}
      <div className="bg-primary-500 text-white text-center text-sm py-2 px-4 font-medium">
        Demo Mode — Explore KidSpark AI, the safe learning companion for children
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🦉</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal mb-4">
          The AI your child <span className="text-primary-500">deserves</span>
        </h1>
        <p className="text-lg text-charcoal-lighter max-w-2xl mx-auto mb-8">
          A learning companion that teaches — never gives answers. With 5-layer safety, parent controls, age-adaptive responses, and cultural sensitivity built in.
        </p>
        <button onClick={() => setView("dashboard")} className="bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
          Try the Demo →
        </button>
      </div>

      {/* Trust badges */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["COPPA Compliant", "No Ads, Ever", "Psychologist Reviewed", "Parent-Controlled"].map((badge) => (
            <span key={badge} className="bg-white border border-border rounded-full px-4 py-2 text-sm text-charcoal-light font-medium flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary-500" /> {badge}
            </span>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <BookOpen className="w-5 h-5" />, title: "Teaches, never answers", desc: "Hint-first architecture. The AI guides thinking through scaffolded questions — never provides copy-paste homework answers." },
            { icon: <Shield className="w-5 h-5" />, title: "5-layer safety system", desc: "Pre-filters, AI moderation, post-generation checks, safeguarding protocols, and pattern detection across sessions." },
            { icon: <Eye className="w-5 h-5" />, title: "Parent dashboard", desc: "Weekly summaries, topic reports, safety alerts. Visibility tiers from full transcripts to alerts-only based on child's age." },
            { icon: <Clock className="w-5 h-5" />, title: "Enforced session limits", desc: "Real time limits — not pop-up suggestions. When time is up, the app locks for 30 minutes. Offline activity suggestions." },
            { icon: <Star className="w-5 h-5" />, title: "Celebrates mistakes", desc: "Names the reasoning pattern, explains why it's tricky, celebrates the attempt. Never expresses disappointment." },
            { icon: <Sparkles className="w-5 h-5" />, title: "Cultural adaptation", desc: "Islamic modes (Gulf, Egypt, Levant), secular mode, elder-guide register. Code-switching support for bilingual children." },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl border border-border p-5">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-charcoal mb-1.5">{feature.title}</h3>
              <p className="text-sm text-charcoal-lighter leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button onClick={() => setView("dashboard")} className="bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors">
            Enter Parent Dashboard →
          </button>
          <p className="text-xs text-charcoal-lighter mt-3">No signup required for demo</p>
        </div>
      </div>
    </div>
  );
}
