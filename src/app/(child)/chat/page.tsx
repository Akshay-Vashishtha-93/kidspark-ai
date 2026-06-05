"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import type { ChildProfile } from "@/types";
import { ChevronLeft, Users } from "lucide-react";

export default function ChatPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ChatPageInner />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="h-screen bg-cream flex items-center justify-center">
      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-primary-500 font-bold text-xl">K</span>
      </div>
    </div>
  );
}

function ChatPageInner() {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/login"); return; }

      const childRes = await fetch("/api/children");
      const { children: childData } = await childRes.json();

      if (!childData?.length) { router.push("/onboarding"); return; }

      setChildren(childData);
      const selected = childId ? childData.find((c: ChildProfile) => c.id === childId) : childData[0];
      if (selected) setChild(selected);
      setLoading(false);
    }
    load();
  }, [childId, router]);

  if (loading) return <Loading />;

  // Child selector for multiple children
  if (!child && children.length > 1) {
    return (
      <div className="h-screen bg-cream flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="font-display text-2xl font-bold text-center mb-6">Who&apos;s learning today?</h2>
          <div className="space-y-3">
            {children.map((c) => (
              <button key={c.id} onClick={() => setChild(c)} className="w-full flex items-center gap-4 bg-white rounded-xl border border-border p-5 hover:border-primary-300 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-lg">{c.name[0]}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-charcoal">{c.name}</div>
                  <div className="text-sm text-charcoal-lighter">Age {c.age} &middot; {c.grade}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!child) return null;

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-border px-4 py-2 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>
        {children.length > 1 && (
          <button onClick={() => setChild(null)} className="flex items-center gap-1.5 text-sm text-charcoal-lighter hover:text-charcoal">
            <Users className="w-4 h-4" /> Switch child
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface childProfile={child} curriculumContext={null} />
      </div>
    </div>
  );
}
