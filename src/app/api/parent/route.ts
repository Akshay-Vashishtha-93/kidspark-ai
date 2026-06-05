import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = getDb();

  db.prepare(`
    UPDATE parents SET
      secondary_safeguarding_contact_name = ?,
      secondary_safeguarding_contact_phone = ?,
      secondary_safeguarding_contact_relation = ?
    WHERE id = ?
  `).run(
    body.secondary_safeguarding_contact_name,
    body.secondary_safeguarding_contact_phone,
    body.secondary_safeguarding_contact_relation,
    user.id
  );

  return NextResponse.json({ ok: true });
}
