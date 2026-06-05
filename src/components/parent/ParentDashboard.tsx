"use client";

import { useState } from "react";
import {
  Shield,
  Clock,
  BookOpen,
  AlertTriangle,
  Users,
  Settings,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ChildProfile, WeeklySummary } from "@/types";

interface ParentDashboardProps {
  children: ChildProfile[];
  summaries: Record<string, WeeklySummary>;
  safeguardingAlerts: number;
}

export default function ParentDashboard({
  children: childProfiles,
  summaries,
  safeguardingAlerts,
}: ParentDashboardProps) {
  const [selectedChild, setSelectedChild] = useState<string | null>(
    childProfiles[0]?.id || null
  );

  const activeChild = childProfiles.find((c) => c.id === selectedChild);
  const activeSummary = selectedChild ? summaries[selectedChild] : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Parent Nav */}
      <nav className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-charcoal">
                KidSpark
              </span>
              <span className="text-charcoal-lighter text-sm ml-2">
                Parent Dashboard
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-charcoal-light hover:text-charcoal transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Safeguarding Alert Banner */}
        {safeguardingAlerts > 0 && (
          <div className="bg-coral-50 border border-coral-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-coral-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-coral-500">
                {safeguardingAlerts} item{safeguardingAlerts > 1 ? "s" : ""}{" "}
                need your attention
              </h3>
              <p className="text-coral-400 text-sm mt-1">
                Our safety system flagged something in your child&apos;s recent
                sessions. Please review.
              </p>
              <button className="text-coral-500 text-sm font-semibold mt-2 hover:text-coral-600">
                Review Now &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Child Selector */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {childProfiles.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all shrink-0 ${
                selectedChild === child.id
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-border text-charcoal hover:border-primary-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  selectedChild === child.id
                    ? "bg-primary-400 text-white"
                    : "bg-cream-dark text-charcoal-light"
                }`}
              >
                {child.name[0]}
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{child.name}</div>
                <div className="text-xs text-charcoal-lighter">
                  Age {child.age} &middot; {child.grade}
                </div>
              </div>
            </button>
          ))}
          {childProfiles.length < 5 && (
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-charcoal-lighter text-charcoal-lighter hover:border-primary-300 hover:text-primary-400 transition-all shrink-0">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Add Child</span>
            </button>
          )}
        </div>

        {activeChild && (
          <>
            {/* Weekly Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Sessions this week"
                value={activeSummary?.total_sessions?.toString() || "0"}
                color="primary"
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Total time"
                value={`${Math.round(activeSummary?.total_minutes || 0)}m`}
                color="amber"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Topics explored"
                value={
                  activeSummary?.topics_explored?.length?.toString() || "0"
                }
                color="sage"
              />
              <StatCard
                icon={<Shield className="w-5 h-5" />}
                label="Safety flags"
                value={
                  activeSummary?.safeguarding_flags_count?.toString() || "0"
                }
                color={
                  (activeSummary?.safeguarding_flags_count || 0) > 0
                    ? "coral"
                    : "sage"
                }
              />
            </div>

            {/* Summary Text */}
            {activeSummary?.generated_summary && (
              <div className="bg-white rounded-xl border border-border p-6 mb-8">
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-400" />
                  Weekly Summary
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  {activeSummary.generated_summary}
                </p>

                {activeSummary.strengths.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-sage-500 mb-2">
                      Going well
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSummary.strengths.map((s) => (
                        <span
                          key={s}
                          className="bg-sage-50 text-sage-500 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeSummary.struggles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-amber-600 mb-2">
                      Needs more practice
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSummary.struggles.map((s) => (
                        <span
                          key={s}
                          className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <QuickAction
                icon={<Eye className="w-5 h-5" />}
                title="View Conversations"
                description={`See ${activeChild.name}'s recent chat topics and interactions`}
                visibility={activeChild.parent_visibility}
              />
              <QuickAction
                icon={<Clock className="w-5 h-5" />}
                title="Session Limits"
                description={`Currently set to ${activeChild.daily_session_limit_minutes} minutes/day`}
              />
              <QuickAction
                icon={<BookOpen className="w-5 h-5" />}
                title="Curriculum Settings"
                description={`${activeChild.curriculum.toUpperCase()} — ${activeChild.grade}`}
              />
              <QuickAction
                icon={<Shield className="w-5 h-5" />}
                title="Safety & Privacy"
                description="Review safety settings, feature toggles, and data controls"
              />
            </div>

            {/* Visibility Level Indicator */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                {activeChild.parent_visibility === "alerts_only" ? (
                  <EyeOff className="w-5 h-5 text-charcoal-lighter" />
                ) : (
                  <Eye className="w-5 h-5 text-primary-400" />
                )}
                Your Visibility Level
              </h3>
              <div className="space-y-3">
                <VisibilityOption
                  level="full"
                  label="Full access"
                  description="All conversation transcripts visible. Recommended for ages 3-7."
                  active={activeChild.parent_visibility === "full"}
                  recommended={activeChild.age <= 7}
                />
                <VisibilityOption
                  level="summary_drilldown"
                  label="Summaries with drill-down"
                  description="Topic summaries shown. Can view specific sessions if needed."
                  active={
                    activeChild.parent_visibility === "summary_drilldown"
                  }
                  recommended={activeChild.age >= 8 && activeChild.age <= 10}
                />
                <VisibilityOption
                  level="summary_only"
                  label="Summaries only"
                  description="Weekly summaries and topics. No conversation content."
                  active={activeChild.parent_visibility === "summary_only"}
                  recommended={activeChild.age >= 11 && activeChild.age <= 13}
                />
                <VisibilityOption
                  level="alerts_only"
                  label="Safety alerts only"
                  description="You'll only be notified if our safety system flags a concern."
                  active={activeChild.parent_visibility === "alerts_only"}
                  recommended={activeChild.age >= 14}
                />
              </div>
              <p className="text-xs text-charcoal-lighter mt-4">
                Safeguarding alerts are always sent regardless of visibility
                level.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "primary" | "amber" | "sage" | "coral";
}) {
  const styles = {
    primary: "bg-primary-50 text-primary-500",
    amber: "bg-amber-50 text-amber-500",
    sage: "bg-sage-50 text-sage-500",
    coral: "bg-coral-50 text-coral-500",
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles[color]} mb-3`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-charcoal">{value}</div>
      <div className="text-sm text-charcoal-lighter">{label}</div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  visibility,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  visibility?: string;
}) {
  return (
    <button className="bg-white rounded-xl border border-border p-5 text-left hover:border-primary-200 transition-colors group flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 group-hover:bg-primary-100 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-charcoal">{title}</h4>
          <p className="text-sm text-charcoal-lighter mt-0.5">{description}</p>
          {visibility && (
            <span className="inline-block mt-2 text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
              {visibility.replace("_", " ")}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-charcoal-lighter group-hover:text-primary-400 transition-colors mt-1" />
    </button>
  );
}

function VisibilityOption({
  level,
  label,
  description,
  active,
  recommended,
}: {
  level: string;
  label: string;
  description: string;
  active: boolean;
  recommended: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
        active
          ? "border-primary-300 bg-primary-50"
          : "border-border hover:border-primary-200"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
          active ? "border-primary-400" : "border-charcoal-lighter"
        }`}
      >
        {active && <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`font-medium text-sm ${
              active ? "text-primary-700" : "text-charcoal"
            }`}
          >
            {label}
          </span>
          {recommended && (
            <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-medium">
              Recommended for age
            </span>
          )}
        </div>
        <p className="text-xs text-charcoal-lighter mt-0.5">{description}</p>
      </div>
    </div>
  );
}
