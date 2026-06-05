import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, generateId } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const children = db.prepare("SELECT * FROM child_profiles WHERE parent_id = ? ORDER BY created_at ASC").all(user.id) as Row[];

  const parsed = children.map((c) => ({
    ...c,
    vulnerability_tags: JSON.parse(c.vulnerability_tags || "[]"),
    creative_studio_enabled: Boolean(c.creative_studio_enabled),
    cross_session_memory_enabled: Boolean(c.cross_session_memory_enabled),
    coaching_mode_only: Boolean(c.coaching_mode_only),
  }));

  return NextResponse.json({ children: parsed });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = getDb();

  // Check 5-child limit
  const count = db.prepare("SELECT COUNT(*) as c FROM child_profiles WHERE parent_id = ?").get(user.id) as { c: number };
  if (count.c >= 5) {
    return NextResponse.json({ error: "Maximum 5 child profiles per parent." }, { status: 400 });
  }

  const id = generateId();

  db.prepare(`
    INSERT INTO child_profiles (id, parent_id, name, age, grade, curriculum, language, cultural_mode, relational_register, emotional_framing, vulnerability_tags, vulnerability_notes, daily_session_limit_minutes, coaching_mode_only, parent_visibility)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    user.id,
    body.name,
    body.age,
    body.grade,
    body.curriculum || "british",
    body.language || "en",
    body.cultural_mode || "default",
    body.relational_register || "facilitator",
    body.emotional_framing || "feelings",
    JSON.stringify(body.vulnerability_tags || []),
    body.vulnerability_notes || "",
    body.daily_session_limit_minutes || 60,
    body.coaching_mode_only ? 1 : 0,
    body.parent_visibility || "full"
  );

  return NextResponse.json({ id });
}
