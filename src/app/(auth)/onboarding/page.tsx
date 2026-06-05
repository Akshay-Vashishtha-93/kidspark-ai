"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChildProfileSetup from "@/components/auth/ChildProfileSetup";
import { Shield, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";

type Step = "safeguarding" | "child_profile";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("safeguarding");
  const [safeguardingContact, setSafeguardingContact] = useState({ name: "", phone: "", relation: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSafeguardingSubmit = () => {
    if (!safeguardingContact.name.trim() || !safeguardingContact.phone.trim() || !safeguardingContact.relation) {
      setError("All fields are required. This is a child safety requirement.");
      return;
    }
    setError(null);
    setStep("child_profile");
  };

  const handleChildProfileComplete = async (childData: {
    name: string; age: number; grade: string; curriculum: string; language: string;
    cultural_mode: string; relational_register: string; emotional_framing: string;
    vulnerability_tags: string[]; vulnerability_notes: string;
    daily_session_limit_minutes: number; coaching_mode_only: boolean;
  }) => {
    setSaving(true);
    setError(null);

    try {
      // Save safeguarding contact
      const parentRes = await fetch("/api/parent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secondary_safeguarding_contact_name: safeguardingContact.name,
          secondary_safeguarding_contact_phone: safeguardingContact.phone,
          secondary_safeguarding_contact_relation: safeguardingContact.relation,
        }),
      });
      if (!parentRes.ok) throw new Error("Failed to save safeguarding contact");

      // Create child profile
      const age = childData.age;
      const getVis = (a: number) => a <= 7 ? "full" : a <= 10 ? "summary_drilldown" : a <= 13 ? "summary_only" : "alerts_only";

      const childRes = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...childData, parent_visibility: getVis(age) }),
      });
      if (!childRes.ok) throw new Error("Failed to create child profile");

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  if (step === "child_profile") {
    return <ChildProfileSetup onComplete={handleChildProfileComplete} saving={saving} error={error} />;
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-coral-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Emergency safeguarding contact</h1>
          <p className="text-charcoal-light max-w-sm mx-auto">This person will be contacted if our safety system detects a concern that cannot be shared with you.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Why is this required?</p>
                <p>In rare cases, a child may share something with the AI that suggests they need help from someone other than their primary guardian.</p>
              </div>
            </div>
          </div>

          {error && <div className="bg-coral-50 border border-coral-200 text-coral-500 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Contact name</label>
              <input type="text" value={safeguardingContact.name} onChange={(e) => setSafeguardingContact((s) => ({ ...s, name: e.target.value }))} placeholder="e.g., Grandmother, School counselor" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Phone number</label>
              <input type="tel" value={safeguardingContact.phone} onChange={(e) => setSafeguardingContact((s) => ({ ...s, phone: e.target.value }))} placeholder="+971 50 123 4567" className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Relationship to child</label>
              <select value={safeguardingContact.relation} onChange={(e) => setSafeguardingContact((s) => ({ ...s, relation: e.target.value }))} className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">Select relationship</option>
                <option value="grandparent">Grandparent</option>
                <option value="aunt_uncle">Aunt / Uncle</option>
                <option value="other_parent">Other parent / Co-parent</option>
                <option value="school_counselor">School counselor</option>
                <option value="family_friend">Trusted family friend</option>
                <option value="other">Other trusted adult</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 bg-sage-50 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-sage-400 mt-0.5 shrink-0" />
            <p className="text-xs text-sage-500">This information is encrypted and only used in child safety situations.</p>
          </div>

          <button onClick={handleSafeguardingSubmit} className="w-full mt-8 flex items-center justify-center gap-2 bg-primary-400 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-primary-500 transition-colors">
            Continue to child profile <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
