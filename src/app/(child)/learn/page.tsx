"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { ChildProfile } from "@/types";

/**
 * /learn — The child's entry point.
 *
 * This is what the parent bookmarks on the tablet/phone home screen.
 * The child opens it, taps their picture, and starts learning.
 * No passwords, no typing, no reading required.
 *
 * The parent must be logged in (session cookie exists).
 * If not, it redirects to /login.
 */

const AVATAR_COLORS = [
  "bg-primary-400",
  "bg-amber-400",
  "bg-sage-400",
  "bg-coral-400",
  "bg-primary-600",
];

const AVATAR_EMOJIS: Record<string, string> = {
  owl: "🦉",
  bird: "🐦",
  cat: "🐱",
  dog: "🐶",
  rabbit: "🐰",
  bear: "🐻",
  star: "⭐",
  rocket: "🚀",
  robot: "🤖",
  tree: "🌳",
};

export default function LearnPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }

      const childRes = await fetch("/api/children");
      const { children: data } = await childRes.json();

      if (!data?.length) {
        router.push("/onboarding");
        return;
      }

      setChildren(data);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSelectChild = (child: ChildProfile) => {
    router.push(`/chat?child=${child.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-primary-400" />
        </div>
      </div>
    );
  }

  // Single child — go straight to chat
  if (children.length === 1) {
    router.push(`/chat?child=${children[0].id}`);
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-4xl">{AVATAR_EMOJIS[children[0].avatar_id] || "🦉"}</span>
          </div>
          <p className="text-charcoal-light text-lg">
            Loading {children[0].name}&apos;s space...
          </p>
        </div>
      </div>
    );
  }

  // Multiple children — pick who's learning
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Big friendly header — no small text */}
        <div className="mb-10">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal">
            Who&apos;s learning today?
          </h1>
        </div>

        {/* Big, tappable child cards — designed for small fingers */}
        <div className="grid gap-4">
          {children.map((child, i) => (
            <button
              key={child.id}
              onClick={() => handleSelectChild(child)}
              className="flex items-center gap-5 bg-white rounded-2xl border-2 border-border p-6 hover:border-primary-300 hover:scale-[1.02] active:scale-[0.98] transition-all w-full"
            >
              {/* Big avatar — easy to tap */}
              <div
                className={`w-16 h-16 ${AVATAR_COLORS[i % AVATAR_COLORS.length]} rounded-2xl flex items-center justify-center shrink-0`}
              >
                <span className="text-3xl">
                  {AVATAR_EMOJIS[child.avatar_id] || child.name[0]}
                </span>
              </div>
              <div className="text-left">
                <div className="font-display text-2xl font-bold text-charcoal">
                  {child.name}
                </div>
                <div className="text-charcoal-lighter text-sm mt-0.5">
                  Age {child.age}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
