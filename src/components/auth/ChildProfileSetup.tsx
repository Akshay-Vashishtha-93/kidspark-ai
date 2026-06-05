"use client";

import { useState } from "react";
import {
  User,
  BookOpen,
  Globe,
  Shield,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import type { Curriculum, CulturalMode, RelationalRegister, EmotionalFraming } from "@/types";

interface ChildFormData {
  name: string;
  age: number;
  grade: string;
  curriculum: Curriculum;
  language: string;
  cultural_mode: CulturalMode;
  relational_register: RelationalRegister;
  emotional_framing: EmotionalFraming;
  vulnerability_tags: string[];
  vulnerability_notes: string;
  daily_session_limit_minutes: number;
  coaching_mode_only: boolean;
}

const STEPS = [
  { id: "basics", label: "About your child", icon: User },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "culture", label: "Cultural settings", icon: Globe },
  { id: "safety", label: "Safety & support", icon: Shield },
  { id: "review", label: "Review", icon: CheckCircle2 },
];

const CURRICULA: { value: Curriculum; label: string; countries: string }[] = [
  { value: "british", label: "British National Curriculum", countries: "UK, UAE, international schools" },
  { value: "cbse", label: "CBSE (India)", countries: "India" },
  { value: "uae_moe", label: "UAE Ministry of Education", countries: "UAE public schools" },
  { value: "us_common_core", label: "US Common Core", countries: "United States" },
  { value: "waec", label: "WAEC / JAMB", countries: "Nigeria, Ghana, West Africa" },
  { value: "ib_pyp", label: "IB Primary Years Programme", countries: "International schools" },
  { value: "ib_myp", label: "IB Middle Years Programme", countries: "International schools" },
  { value: "saudi_moe", label: "Saudi Ministry of Education", countries: "Saudi Arabia" },
  { value: "australian", label: "Australian Curriculum", countries: "Australia" },
];

const VULNERABILITY_OPTIONS = [
  { value: "anxiety", label: "Anxiety", description: "AI will be extra patient and avoid creating urgency" },
  { value: "adhd", label: "ADHD", description: "Shorter responses, more structure, quick action prompts" },
  { value: "autism", label: "Autism spectrum", description: "Clear literal language, no idioms, predictable interactions" },
  { value: "dyslexia", label: "Dyslexia", description: "Shorter sentences, numbered lists, no spelling correction" },
  { value: "trauma", label: "Trauma history", description: "Extra gentle, lower safeguarding thresholds" },
  { value: "cyberbullying", label: "Prior cyberbullying", description: "Heightened emotional safety, lower alert thresholds" },
  { value: "emotional_fragility", label: "Emotionally fragile", description: "Extra sensitivity, avoid anything that could feel critical" },
];

export default function ChildProfileSetup({
  onComplete,
  saving = false,
  error: externalError = null,
}: {
  onComplete: (data: ChildFormData) => void;
  saving?: boolean;
  error?: string | null;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ChildFormData>({
    name: "",
    age: 8,
    grade: "Year 3",
    curriculum: "british",
    language: "en",
    cultural_mode: "default",
    relational_register: "facilitator",
    emotional_framing: "feelings",
    vulnerability_tags: [],
    vulnerability_notes: "",
    daily_session_limit_minutes: 60,
    coaching_mode_only: false,
  });

  const update = (partial: Partial<ChildFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const getDefaultSessionLimit = (age: number) => {
    if (age <= 7) return 45;
    if (age <= 12) return 60;
    return 90;
  };

  const getDefaultVisibility = (age: number) => {
    if (age <= 7) return "full";
    if (age <= 10) return "summary_drilldown";
    if (age <= 13) return "summary_only";
    return "alerts_only";
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i <= step
                      ? "bg-primary-400 text-white"
                      : "bg-white border border-border text-charcoal-lighter"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      i < step ? "bg-primary-400" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-border p-8">
          {/* Step 1: Basics */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Tell us about your child
              </h2>
              <p className="text-charcoal-light mb-8">
                This helps us personalise the learning experience.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Child&apos;s first name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g., Ahmed, Emma, Sofia"
                    className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Age: {form.age}
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={16}
                    value={form.age}
                    onChange={(e) => {
                      const age = parseInt(e.target.value);
                      update({
                        age,
                        daily_session_limit_minutes: getDefaultSessionLimit(age),
                      });
                    }}
                    className="w-full accent-primary-400"
                  />
                  <div className="flex justify-between text-xs text-charcoal-lighter mt-1">
                    <span>3</span>
                    <span>16</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Language
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) => update({ language: e.target.value })}
                    className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic (العربية)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="pt">Portuguese (Português)</option>
                    <option value="fr">French (Français)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Curriculum */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                What curriculum does {form.name || "your child"} follow?
              </h2>
              <p className="text-charcoal-light mb-8">
                This ensures the AI teaches using the same methods and
                terminology as their school.
              </p>

              <div className="space-y-3">
                {CURRICULA.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => update({ curriculum: c.value })}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      form.curriculum === c.value
                        ? "border-primary-400 bg-primary-50"
                        : "border-border hover:border-primary-200"
                    }`}
                  >
                    <div className="font-medium text-charcoal">{c.label}</div>
                    <div className="text-sm text-charcoal-lighter mt-0.5">
                      {c.countries}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Grade / Year level
                </label>
                <input
                  type="text"
                  value={form.grade}
                  onChange={(e) => update({ grade: e.target.value })}
                  placeholder="e.g., Year 4, Class 5, Grade 6"
                  className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>
          )}

          {/* Step 3: Cultural Settings */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Cultural and values settings
              </h2>
              <p className="text-charcoal-light mb-8">
                How should the AI interact with {form.name || "your child"}?
                These settings shape the AI&apos;s personality, not just content
                filters.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    Cultural mode
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: "default" as const, label: "Default", description: "Neutral, respectful, multicultural awareness" },
                      { value: "islamic_gulf" as const, label: "Islamic (Gulf)", description: "Models adab, uses Islamic phrases, Gulf educational norms, conservative defaults" },
                      { value: "islamic_egypt" as const, label: "Islamic (Egypt/North Africa)", description: "Models adab with Egyptian warmth, North African cultural context" },
                      { value: "islamic_levant" as const, label: "Islamic (Levant)", description: "Models adab, Levantine cultural context" },
                      { value: "secular_strict" as const, label: "Secular (strict)", description: "No religious references, no spiritual language, purely academic" },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => update({ cultural_mode: mode.value })}
                        className={`w-full text-left p-4 rounded-xl border transition-colors ${
                          form.cultural_mode === mode.value
                            ? "border-primary-400 bg-primary-50"
                            : "border-border hover:border-primary-200"
                        }`}
                      >
                        <div className="font-medium text-charcoal">
                          {mode.label}
                        </div>
                        <div className="text-sm text-charcoal-lighter mt-0.5">
                          {mode.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    How should the AI relate to{" "}
                    {form.name || "your child"}?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: "elder_guide" as const, label: "Respected guide", description: "Speaks with gentle authority. Encourages respect for teachers and elders. Recommended for traditional or religious households." },
                      { value: "facilitator" as const, label: "Neutral facilitator", description: "Helpful and warm without being overly familiar. Balances guidance with encouraging thinking." },
                      { value: "peer_companion" as const, label: "Learning partner", description: "Casual and warm. Encourages independent thinking and questioning. Recommended for older children." },
                    ].map((reg) => (
                      <button
                        key={reg.value}
                        onClick={() =>
                          update({ relational_register: reg.value })
                        }
                        className={`w-full text-left p-4 rounded-xl border transition-colors ${
                          form.relational_register === reg.value
                            ? "border-primary-400 bg-primary-50"
                            : "border-border hover:border-primary-200"
                        }`}
                      >
                        <div className="font-medium text-charcoal">
                          {reg.label}
                        </div>
                        <div className="text-sm text-charcoal-lighter mt-0.5">
                          {reg.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Safety & Support */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Safety and support needs
              </h2>
              <p className="text-charcoal-light mb-8">
                This is optional but helps the AI be more sensitive to{" "}
                {form.name || "your child"}&apos;s needs. This information is
                never shared with anyone.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    Does {form.name || "your child"} have any of these? Select
                    all that apply.
                  </label>
                  <div className="space-y-2">
                    {VULNERABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const tags = form.vulnerability_tags.includes(
                            opt.value
                          )
                            ? form.vulnerability_tags.filter(
                                (t) => t !== opt.value
                              )
                            : [...form.vulnerability_tags, opt.value];
                          update({ vulnerability_tags: tags });
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-colors ${
                          form.vulnerability_tags.includes(opt.value)
                            ? "border-primary-400 bg-primary-50"
                            : "border-border hover:border-primary-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                              form.vulnerability_tags.includes(opt.value)
                                ? "border-primary-400 bg-primary-400"
                                : "border-charcoal-lighter"
                            }`}
                          >
                            {form.vulnerability_tags.includes(opt.value) && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-charcoal">
                              {opt.label}
                            </div>
                            <div className="text-sm text-charcoal-lighter">
                              {opt.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Daily session limit: {form.daily_session_limit_minutes}{" "}
                    minutes
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={15}
                    value={form.daily_session_limit_minutes}
                    onChange={(e) =>
                      update({
                        daily_session_limit_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-primary-400"
                  />
                  <div className="flex justify-between text-xs text-charcoal-lighter mt-1">
                    <span>15m</span>
                    <span>2h</span>
                  </div>
                  <p className="text-xs text-charcoal-lighter mt-2">
                    This is an enforced limit — not a suggestion. When time is
                    up, the app locks for 30 minutes.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <Heart className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">
                      Your visibility level:{" "}
                      {getDefaultVisibility(form.age).replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Based on {form.name || "your child"}&apos;s age (
                      {form.age}), we recommend this level. You can change it
                      anytime in the dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Review {form.name}&apos;s profile
              </h2>
              <p className="text-charcoal-light mb-8">
                You can change any of these settings later in the parent
                dashboard.
              </p>

              {externalError && (
                <div className="bg-coral-50 border border-coral-200 text-coral-500 rounded-xl px-4 py-3 mb-6 text-sm">
                  {externalError}
                </div>
              )}

              <div className="space-y-4">
                <ReviewRow label="Name" value={form.name} />
                <ReviewRow label="Age" value={`${form.age} years old`} />
                <ReviewRow label="Grade" value={form.grade} />
                <ReviewRow
                  label="Curriculum"
                  value={
                    CURRICULA.find((c) => c.value === form.curriculum)?.label ||
                    form.curriculum
                  }
                />
                <ReviewRow
                  label="Cultural mode"
                  value={form.cultural_mode.replace(/_/g, " ")}
                />
                <ReviewRow
                  label="AI personality"
                  value={form.relational_register.replace(/_/g, " ")}
                />
                <ReviewRow
                  label="Session limit"
                  value={`${form.daily_session_limit_minutes} minutes/day (enforced)`}
                />
                {form.vulnerability_tags.length > 0 && (
                  <ReviewRow
                    label="Support needs"
                    value={form.vulnerability_tags
                      .map(
                        (t) =>
                          VULNERABILITY_OPTIONS.find((o) => o.value === t)
                            ?.label || t
                      )
                      .join(", ")}
                  />
                )}
                <ReviewRow
                  label="Your visibility"
                  value={getDefaultVisibility(form.age).replace(/_/g, " ")}
                />
              </div>

              <div className="mt-8 p-4 bg-sage-50 rounded-xl border border-sage-200">
                <p className="text-sm text-sage-500">
                  <strong>Privacy note:</strong> Vulnerability information is
                  only used to adapt the AI&apos;s behaviour. It is never shared
                  with schools, teachers, or any third party.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 text-charcoal-light hover:text-charcoal transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={step === 0 && !form.name.trim()}
                className="flex items-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-500 transition-colors disabled:opacity-40"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onComplete(form)}
                disabled={saving}
                className="flex items-center gap-2 bg-primary-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-500 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {saving ? "Creating..." : "Create Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-charcoal-lighter">{label}</span>
      <span className="text-sm font-medium text-charcoal">{value}</span>
    </div>
  );
}
