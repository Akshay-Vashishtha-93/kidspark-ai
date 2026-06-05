"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParentDashboard from "@/components/parent/ParentDashboard";
import type { ChildProfile, WeeklySummary } from "@/types";
import { LogOut, Plus, Sparkles, Link2, Copy, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [summaries, setSummaries] = useState<Record<string, WeeklySummary>>({});
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/login"); return; }
      const { user } = await meRes.json();
      if (!user) { router.push("/login"); return; }
      setParentName(user.name || user.email);

      const childRes = await fetch("/api/children");
      const { children: childData } = await childRes.json();

      if (!childData || childData.length === 0) {
        router.push("/onboarding");
        return;
      }

      setChildren(childData);

      const map: Record<string, WeeklySummary> = {};
      for (const child of childData) {
        map[child.id] = {
          id: `s-${child.id}`,
          child_id: child.id,
          week_start: new Date().toISOString().split("T")[0],
          total_sessions: 0,
          total_minutes: 0,
          topics_explored: [],
          longest_session_minutes: 0,
          safeguarding_flags_count: 0,
          struggles: [],
          strengths: [],
          generated_summary: `${child.name} hasn't used the app yet this week. Start a learning session!`,
        };
      }
      setSummaries(map);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const copyChildLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/learn`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center animate-pulse">
          <span className="text-primary-500 font-bold text-xl">K</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-cream border-b border-border px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-charcoal-light">
            Welcome, <span className="font-medium text-charcoal">{parentName}</span>
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/onboarding")} className="flex items-center gap-1.5 text-sm text-charcoal-light hover:text-charcoal">
              <Plus className="w-4 h-4" /> Add child
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-charcoal-lighter hover:text-charcoal transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
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
              <h2 className="text-white font-display text-lg font-bold">
                Ready to learn?
              </h2>
              <p className="text-primary-100 text-sm">
                Hand the device to your child or bookmark the link below on their tablet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/learn")}
              className="bg-white text-primary-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
            >
              Start Learning
            </button>
            <button
              onClick={copyChildLink}
              className="bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-white/30 transition-colors flex items-center gap-2"
            >
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

      {/* Parent Dashboard */}
      <ParentDashboard children={children} summaries={summaries} safeguardingAlerts={0} />
    </div>
  );
}
