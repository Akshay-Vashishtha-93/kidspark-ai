"use client";

import Link from "next/link";
import {
  Shield,
  BookOpen,
  Users,
  Heart,
  GraduationCap,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="font-display text-xl font-bold text-charcoal">
            KidSpark
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-charcoal-light hover:text-charcoal transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary-400 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Safety-first AI for children
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal leading-tight mb-6">
            The AI your child{" "}
            <span className="text-primary-400">deserves</span>
          </h1>
          <p className="text-xl text-charcoal-light leading-relaxed mb-8 max-w-2xl">
            Smart enough to really help them learn. Safe enough that you never
            have to worry. With full parental control, curriculum-aligned
            tutoring, and safety by design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-500 transition-colors"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border-2 border-border text-charcoal px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-border py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-charcoal-light text-sm font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-400" />
              COPPA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-400" />
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-400" />
              No Ads, No Data Selling
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-400" />
              Psychologist Reviewed
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Built for how children actually learn
          </h2>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            Not a watered-down ChatGPT. A purpose-built learning companion
            designed with child psychologists and educators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Teaches, never answers"
            description="Hint-first design means your child develops real problem-solving skills. The AI guides them to the answer — never just gives it."
            color="primary"
          />
          <FeatureCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Your child's actual curriculum"
            description="British, CBSE, UAE MoE, Common Core, WAEC, IB — the AI knows what chapter your child is on and teaches it the way their teacher does."
            color="amber"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="5-layer safety system"
            description="Pre-filters, AI moderation, post-generation checks, human review, and pattern detection. Conservative by default."
            color="sage"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Parent dashboard"
            description="Weekly summaries, topic reports, and instant alerts if anything needs your attention. You decide the visibility level."
            color="primary"
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Celebrates mistakes"
            description="When your child gets something wrong, the AI explains why it's a common and useful error — then guides them to the right approach."
            color="coral"
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6" />}
            title="Enforced session limits"
            description="Not pop-up warnings — real time limits. Because screen dependency is a clinical risk, not a minor inconvenience."
            color="sage"
          />
        </div>
      </section>

      {/* Cultural Adaptation Section */}
      <section className="bg-white border-y border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Designed for your family's values
              </h2>
              <p className="text-charcoal-light text-lg mb-8">
                Not a Western product with a translation layer. KidSpark is
                culturally adapted — from the AI's personality to how it handles
                contested topics.
              </p>
              <ul className="space-y-4">
                <CultureItem text="Arabic first-class — RTL design, Fus'ha academic content" />
                <CultureItem text="Islamic mode with genuine adab, not a content filter toggle" />
                <CultureItem text="Gulf, Levant, and Egyptian regional customization" />
                <CultureItem text="Secular mode for families who prefer no religious framing" />
                <CultureItem text="Code-switching support — Hinglish, Arabic-English, naturally" />
                <CultureItem text="Defers to parents and teachers — AI never positions itself as the authority" />
              </ul>
            </div>
            <div className="bg-cream rounded-2xl p-8 border border-border">
              <div className="space-y-4">
                <ChatBubble
                  role="child"
                  text="Why do volcanos erupt? Can you explain in Arabic too?"
                />
                <ChatBubble
                  role="assistant"
                  text="Great question! Volcanos erupt because of pressure building up inside the Earth... البراكين تثور بسبب الضغط المتراكم داخل الأرض. What part do you want to explore more?"
                />
                <ChatBubble
                  role="child"
                  text="Can you explain the pressure part? Main samajh nahi aayi"
                />
                <ChatBubble
                  role="assistant"
                  text="Of course! Imagine you're squeezing a tube of toothpaste really hard... pressure builds until — whoosh! It pushes out. That's similar to what happens underground. Does that help? 😊"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-charcoal-light text-lg">
            No ads. No data selling. Ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            features={[
              "20 interactions/day",
              "1 child profile",
              "Basic parent summary",
              "Full curriculum support",
              "All safety features",
            ]}
            cta="Start Free"
            href="/signup"
          />
          <PricingCard
            name="Family"
            price="$9.99"
            period="/month"
            features={[
              "Unlimited interactions",
              "3 child profiles",
              "Full parent dashboard",
              "Conversation history",
              "Caregiver mode",
              "Vulnerability profiles",
            ]}
            cta="Start Free Trial"
            href="/signup?plan=family"
            highlighted
          />
          <PricingCard
            name="Family Plus"
            price="$14.99"
            period="/month"
            features={[
              "Everything in Family",
              "5 child profiles",
              "Priority support",
              "Weekly learning reports",
              "Cross-session memory",
              "Exam prep mode",
            ]}
            cta="Start Free Trial"
            href="/signup?plan=plus"
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-charcoal-lighter text-sm">
            Exam Season Pass also available — $4.99 for 4 weeks of intensive
            access.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">K</span>
                </div>
                <span className="font-display text-lg font-bold">KidSpark</span>
              </div>
              <p className="text-charcoal-lighter text-sm">
                Safe AI learning companion for children aged 3-16. Built with
                psychologists, educators, and parents.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-charcoal-lighter text-sm">
                <li>Features</li>
                <li>Pricing</li>
                <li>For Schools</li>
                <li>Safety Report</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Trust</h4>
              <ul className="space-y-2 text-charcoal-lighter text-sm">
                <li>Privacy Policy</li>
                <li>Safety Architecture</li>
                <li>COPPA Compliance</li>
                <li>GDPR Compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-charcoal-lighter text-sm">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Parent Guide</li>
                <li>Report a Concern</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-charcoal-light/20 mt-12 pt-8 text-charcoal-lighter text-sm">
            <p>
              KidSpark AI does not collect behavioural data for advertising. All
              child data is encrypted and deletable. We will never sell your
              family's information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "amber" | "sage" | "coral";
}) {
  const bgColors = {
    primary: "bg-primary-50",
    amber: "bg-amber-50",
    sage: "bg-sage-50",
    coral: "bg-coral-50",
  };
  const iconColors = {
    primary: "text-primary-500",
    amber: "text-amber-500",
    sage: "text-sage-500",
    coral: "text-coral-500",
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary-200 transition-colors">
      <div
        className={`w-12 h-12 ${bgColors[color]} rounded-xl flex items-center justify-center ${iconColors[color]} mb-5`}
      >
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
      <p className="text-charcoal-light leading-relaxed">{description}</p>
    </div>
  );
}

function CultureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
      <span className="text-charcoal">{text}</span>
    </li>
  );
}

function ChatBubble({ role, text }: { role: "child" | "assistant"; text: string }) {
  if (role === "child") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary-400 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%] text-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-border rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%] text-sm text-charcoal">
        {text}
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 ${
        highlighted
          ? "bg-primary-400 text-white ring-4 ring-primary-200 scale-105"
          : "bg-white border border-border"
      }`}
    >
      <h3
        className={`font-display text-lg font-semibold mb-1 ${
          highlighted ? "text-white" : "text-charcoal"
        }`}
      >
        {name}
      </h3>
      <div className="mb-6">
        <span
          className={`text-4xl font-bold ${
            highlighted ? "text-white" : "text-charcoal"
          }`}
        >
          {price}
        </span>
        <span
          className={`text-sm ${
            highlighted ? "text-primary-100" : "text-charcoal-light"
          }`}
        >
          {period}
        </span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckCircle2
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                highlighted ? "text-primary-100" : "text-primary-400"
              }`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
          highlighted
            ? "bg-white text-primary-500 hover:bg-primary-50"
            : "bg-primary-400 text-white hover:bg-primary-500"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
