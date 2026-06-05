"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) { setError("Please accept the terms to continue."); return; }
    if (!name.trim() || !email.trim() || !password.trim()) { setError("All fields are required."); return; }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/onboarding");
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
          <h1 className="font-display text-2xl font-bold text-charcoal mb-2 text-center">Create your parent account</h1>
          <p className="text-charcoal-light text-center mb-8">You&apos;ll set up your child&apos;s profile next</p>

          {error && <div className="bg-coral-50 border border-coral-200 text-coral-500 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Sarah, Khalid" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <button type="button" onClick={() => setConsentChecked(!consentChecked)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentChecked ? "bg-primary-400 border-primary-400" : "border-charcoal-lighter"}`}>
                {consentChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <span className="text-xs text-charcoal-light leading-relaxed">
                I am a parent or legal guardian. I consent to KidSpark processing my child&apos;s learning data. I can delete all data at any time.
              </span>
            </label>

            <button type="submit" disabled={loading || !consentChecked} className="w-full bg-primary-400 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-3 bg-primary-50 rounded-xl p-4">
            <Shield className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
            <p className="text-xs text-primary-700">Your child&apos;s data is encrypted, never sold, and deletable at any time. No ads.</p>
          </div>
        </div>

        <p className="text-center text-charcoal-lighter text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">Log in</Link>
        </p>
      </div>
    </div>
  );
}
