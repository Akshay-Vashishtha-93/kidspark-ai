import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, detectSafeguardingSignals } from "@/lib/system-prompt";
import type { ChildProfile, CurriculumContext } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      childProfile,
      curriculumContext,
      sessionMinutesUsed,
    }: {
      messages: Array<{ role: "child" | "assistant"; content: string }>;
      childProfile: ChildProfile;
      curriculumContext: CurriculumContext | null;
      sessionMinutesUsed: number;
    } = body;

    // --- SAFETY: Check child's message for safeguarding signals ---
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "child") {
      const safeguardingDetection = detectSafeguardingSignals(lastMessage.content);

      if (safeguardingDetection) {
        // For Scenario B (crisis) and Scenario A (abuse), return a predefined safe response
        // The system prompt also handles this, but we double-ensure here
        const safeResponse = getSafeguardingResponse(safeguardingDetection.severity);

        return NextResponse.json({
          message: safeResponse,
          safeguardingFlag: {
            severity: safeguardingDetection.severity,
            trigger: safeguardingDetection.trigger,
          },
        });
      }
    }

    // --- Build system prompt with all safety, cultural, curriculum rules ---
    const systemPrompt = buildSystemPrompt(
      childProfile,
      curriculumContext,
      sessionMinutesUsed
    );

    // --- Convert messages to Anthropic format ---
    const anthropicMessages = messages.map((msg) => ({
      role: msg.role === "child" ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    }));

    // --- Call Claude ---
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    // --- Post-generation safety check ---
    // Check if AI response contains safeguarding flag marker
    const hasSafeguardingFlag = assistantMessage.includes("[SAFEGUARDING_FLAG]");
    const cleanMessage = assistantMessage.replace("[SAFEGUARDING_FLAG]", "").trim();

    return NextResponse.json({
      message: cleanMessage,
      safeguardingFlag: hasSafeguardingFlag
        ? { severity: "scenario_d_pattern", trigger: "AI-detected concern" }
        : null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

function getSafeguardingResponse(
  severity: string
): string {
  switch (severity) {
    case "scenario_b_crisis":
      return "Thank you for telling me. What you're feeling matters, and you deserve support. Please talk to a trusted adult — a parent, teacher, school counselor, or another grown-up you feel safe with. You can also reach a helpline where someone is ready to listen right now. You are not alone, and things can get better.";

    case "scenario_a_abuse":
      return "Thank you for telling me. You are NOT in trouble. What you shared is important, and you did the right thing by saying something. A safe grown-up is going to know you told me this, so they can help you. You are brave for speaking up.";

    case "scenario_c_parent_implicated":
      return "Thank you for telling me. You are NOT in trouble. What you shared is really important. A safe grown-up — someone who can help — is going to know about this. You did the right thing by telling me.";

    default:
      return "I hear you, and what you're feeling matters. Talking to someone you trust — like a teacher, school counselor, or a family member — can really help. You don't have to go through this alone.";
  }
}
