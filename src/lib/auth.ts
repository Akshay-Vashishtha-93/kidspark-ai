import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getDb, generateId } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "kidspark-dev-secret-change-in-prod";
const COOKIE_NAME = "kidspark_session";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export async function signup(email: string, password: string, name: string): Promise<{ user?: AuthUser; error?: string }> {
  const db = getDb();

  const existing = db.prepare("SELECT id FROM parents WHERE email = ?").get(email);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hash = bcrypt.hashSync(password, 10);
  const id = generateId();

  db.prepare(
    "INSERT INTO parents (id, email, name, password_hash) VALUES (?, ?, ?, ?)"
  ).run(id, email, name, hash);

  // Log consent
  db.prepare(
    "INSERT INTO consent_log (id, parent_id, action, terms_version, method) VALUES (?, ?, ?, ?, ?)"
  ).run(generateId(), id, "initial_consent", "1.0", "email_password");

  const user: AuthUser = { id, email, name };
  await setSession(user);

  return { user };
}

export async function login(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  const db = getDb();

  const row = db.prepare("SELECT id, email, name, password_hash FROM parents WHERE email = ?").get(email) as {
    id: string;
    email: string;
    name: string;
    password_hash: string;
  } | undefined;

  if (!row) {
    return { error: "Invalid email or password." };
  }

  if (!bcrypt.compareSync(password, row.password_hash)) {
    return { error: "Invalid email or password." };
  }

  const user: AuthUser = { id: row.id, email: row.email, name: row.name };
  await setSession(user);

  return { user };
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    return payload;
  } catch {
    return null;
  }
}

export async function setSession(user: AuthUser): Promise<void> {
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
