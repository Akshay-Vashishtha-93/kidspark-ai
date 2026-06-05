"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Clock, BookOpen, Sparkles, Pause } from "lucide-react";
import type { ChildProfile, CurriculumContext } from "@/types";

interface ChatMessage {
  id: string;
  role: "child" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  childProfile: ChildProfile;
  curriculumContext: CurriculumContext | null;
}

export default function ChatInterface({
  childProfile,
  curriculumContext,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionStartRef = useRef<Date>(new Date());

  // Session timer - tracks minutes used
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - sessionStartRef.current.getTime()) / 60000;
      setSessionMinutes(Math.floor(elapsed));

      // Check if session limit reached
      if (elapsed >= childProfile.daily_session_limit_minutes) {
        setIsLocked(true);
      }

      // Break reminder at 20 minutes
      if (elapsed >= 20 && !showBreakReminder) {
        setShowBreakReminder(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [childProfile.daily_session_limit_minutes, showBreakReminder]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    const greetings: Record<string, string> = {
      en: `Hi ${childProfile.name}! What would you like to learn about today?`,
      ar: `مرحباً ${childProfile.name}! ماذا تريد أن تتعلم اليوم؟`,
      hi: `नमस्ते ${childProfile.name}! आज आप क्या सीखना चाहते हैं?`,
      pt: `Olá ${childProfile.name}! O que você gostaria de aprender hoje?`,
    };
    const lang = childProfile.language.substring(0, 2);
    const greeting = greetings[lang] || greetings.en;

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      },
    ]);
  }, [childProfile.name, childProfile.language]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isLocked) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "child",
      content: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          childProfile,
          curriculumContext,
          sessionMinutesUsed: sessionMinutes,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle safeguarding flags
      if (data.safeguardingFlag) {
        handleSafeguardingFlag(data.safeguardingFlag);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having a little trouble right now. Can you try asking me again?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isLocked, messages, childProfile, curriculumContext, sessionMinutes]);

  const handleSafeguardingFlag = (flag: {
    severity: string;
    trigger: string;
  }) => {
    // In production: send alert to parent dashboard, log to safeguarding_flags table
    // For now: console.warn for development
    console.warn("SAFEGUARDING FLAG:", flag);

    // TODO: Implement real-time alert to parent
    // TODO: Log to safeguarding_flags table via Supabase
    // TODO: For scenario_b (crisis), show crisis resources to child
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const remainingMinutes = Math.max(
    0,
    childProfile.daily_session_limit_minutes - sessionMinutes
  );

  // Session locked — show cooldown screen
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-cream p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <Pause className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-3">
          Time for a break!
        </h2>
        <p className="text-charcoal-light text-lg mb-6 max-w-md">
          You&apos;ve been learning for{" "}
          {childProfile.daily_session_limit_minutes} minutes today. That&apos;s
          awesome! Take a 30-minute break and come back refreshed.
        </p>
        <div className="bg-white rounded-2xl p-6 border border-border max-w-sm">
          <p className="text-charcoal font-medium mb-2">
            While you&apos;re away:
          </p>
          <p className="text-charcoal-light">
            {getOfflineActivity(childProfile.age)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h2 className="font-semibold text-charcoal">
              {childProfile.name}&apos;s Learning Space
            </h2>
            {curriculumContext && (
              <p className="text-xs text-charcoal-lighter flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {curriculumContext.subject} — {curriculumContext.unit}
              </p>
            )}
          </div>
        </div>

        {/* Session timer */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            remainingMinutes <= 10
              ? "bg-coral-50 text-coral-500"
              : remainingMinutes <= 20
              ? "bg-amber-50 text-amber-600"
              : "bg-primary-50 text-primary-600"
          }`}
        >
          <Clock className="w-4 h-4" />
          {remainingMinutes}m left
        </div>
      </div>

      {/* Break Reminder Banner */}
      {showBreakReminder && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between">
          <p className="text-amber-700 text-sm">
            You&apos;ve been at this for a while — want a 5-minute break?
          </p>
          <button
            onClick={() => setShowBreakReminder(false)}
            className="text-amber-600 text-sm font-medium hover:text-amber-700"
          >
            I&apos;m good!
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "child" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "child"
                  ? "bg-primary-400 text-white rounded-2xl rounded-tr-md"
                  : "bg-white border border-border text-charcoal rounded-2xl rounded-tl-md shadow-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-border">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 resize-none bg-cream border border-border rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 min-h-[48px] max-h-[120px]"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-primary-400 text-white rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getOfflineActivity(age: number): string {
  if (age <= 6) {
    return "Go draw a picture of your favourite animal and show it to your family!";
  }
  if (age <= 10) {
    return "Try teaching someone in your family one thing you learned today — it helps you remember!";
  }
  return "Find a real-world example of something you studied today. Write it down if you want to share it next time.";
}
