/**
 * Session Timer Logic (F4.2)
 *
 * Enforced session limits — not advisory. When time expires, the session locks.
 * This is a clinical requirement from Dr. Rachel Kim to prevent dependency.
 */

import type { SessionTimer } from "@/types";

const COOLDOWN_MINUTES = 30;

export function createSessionTimer(dailyLimitMinutes: number, minutesUsedToday: number): SessionTimer {
  const remaining = Math.max(0, dailyLimitMinutes - minutesUsedToday);

  return {
    remaining_minutes: remaining,
    total_minutes: dailyLimitMinutes,
    is_cooldown: remaining <= 0,
    cooldown_ends_at: remaining <= 0 ? getCooldownEnd() : null,
    break_reminder_shown: false,
  };
}

export function shouldShowBreakReminder(sessionMinutes: number, alreadyShown: boolean): boolean {
  return sessionMinutes >= 20 && !alreadyShown;
}

export function isSessionLocked(timer: SessionTimer): boolean {
  if (!timer.is_cooldown) return false;
  if (!timer.cooldown_ends_at) return true;

  return new Date() < new Date(timer.cooldown_ends_at);
}

export function isWithinAllowedHours(start: string, end: string): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  return currentTime >= startTime && currentTime <= endTime;
}

export function getOfflineActivitySuggestion(age: number, topics: string[]): string {
  const topic = topics[topics.length - 1] || "what you learned";

  if (age <= 6) {
    const activities = [
      `Go draw a picture about ${topic}! Show it to your family when you're done.`,
      `Can you find something in your house that reminds you of ${topic}?`,
      `Try telling someone in your family one thing you learned today!`,
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  if (age <= 10) {
    const activities = [
      `Try explaining ${topic} to someone in your family — teaching it helps you remember it!`,
      `Go outside for 15 minutes. See if you notice anything that connects to ${topic}.`,
      `Write or draw three things you learned today. No screen needed!`,
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  const activities = [
    `Think about how ${topic} connects to something in your daily life. Write it down if you like.`,
    `Find a real-world example of ${topic} around your home or neighbourhood.`,
    `Try explaining what you learned to someone — if you can teach it, you really know it.`,
  ];
  return activities[Math.floor(Math.random() * activities.length)];
}

function getCooldownEnd(): string {
  const end = new Date();
  end.setMinutes(end.getMinutes() + COOLDOWN_MINUTES);
  return end.toISOString();
}
