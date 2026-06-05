"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter email and password."); return; }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error); setLoading(false); return; }

    // Check if parent has children
    const childRes = await fetch("/api/children");
    const childData = await childRes.json();

    if (childData.children?.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-primary-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="font-display text-2xl font-bold text-charcoal">KidSpark</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-charcoal mb-2 text-center">Welcome back</h1>
          <p className="text-charcoal-light text-center mb-8">Sign in to manage your children&apos;s learning</p>

          {error && <div className="bg-coral-50 border border-coral-200 text-coral-500 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-400 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-primary-500 transition-all disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-3 bg-primary-50 rounded-xl p-4">
            <Shield className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
            <p className="text-xs text-primary-700">Only parents should create accounts. Children use the app through your profile.</p>
          </div>
        </div>

        <p className="text-center text-charcoal-lighter text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary-500 font-medium hover:text-primary-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
