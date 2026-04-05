"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuthSession } from "@/components/auth-sync-provider";
import { getBrowserSupabase } from "@/lib/browser-supabase";
import type { InterviewProfile, SessionMode } from "@/lib/api-types";
import { useVoiceSession } from "@/hooks/use-voice-session";

type Profile = {
  school: string;
  background: string;
  bank: string;
  group: string;
  stage: string;
  interviewDate: string;
};

const banks = ["Evercore", "Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Lazard", "Centerview"];
const groups = ["M&A", "Healthcare", "TMT", "Industrials", "FIG", "LevFin"];
const stages = ["Networking", "First round", "Superday"];

const DEMO_TRACKS = {
  story: {
    label: "Story / Resume",
    prompt: "Walk me through your path and explain why now is the right time for banking.",
    transcript: [
      { speaker: "Interviewer" as const, tag: "opening", text: "Start with the pivot. Do not make me wait for why now." },
      { speaker: "You" as const, tag: "candidate", text: "I want the pace, client exposure, and execution intensity that banking offers." },
    ],
    summary: "The opening is credible and pointed in the right direction. The next improvement is making the story tighter in the first 30 seconds.",
    coachNotes: [
      "Lead with the pivot earlier so the interviewer hears the why now immediately.",
      "Trim the long background setup and get to the banking decision faster.",
      "End with one bank-specific line so the answer feels tailored, not reusable.",
    ],
    nextRep: "Run the same opener again and keep it inside 90 seconds.",
  },
  technical: {
    label: "Technical Core",
    prompt: "Walk me through how a $10 increase in depreciation flows through the three statements.",
    transcript: [
      { speaker: "Interviewer" as const, tag: "technical", text: "Start with the income statement, then move cleanly to cash flow and the balance sheet." },
      { speaker: "You" as const, tag: "candidate", text: "EBIT falls by 10, taxes fall by the shield, net income falls by the after-tax amount." },
    ],
    summary: "The core mechanics are there. The next rep should focus on keeping the answer sequential and calm all the way to the balance sheet.",
    coachNotes: [
      "Anchor the answer with the income statement first, then move in order without backtracking.",
      "Say the tax shield explicitly so the after-tax impact sounds automatic.",
      "Finish with the cash and balance sheet effects in one clean closing sentence.",
    ],
    nextRep: "Repeat the three-statement walk-through twice with no notes and no pauses.",
  },
  markets: {
    label: "Deals & Markets",
    prompt: "Give me one recent deal or market theme you would bring up in your interview.",
    transcript: [
      { speaker: "Interviewer" as const, tag: "markets", text: "Use one real deal. Summarize it, interpret it, and tell me why it matters now." },
      { speaker: "You" as const, tag: "candidate", text: "I'd bring up a recent sector deal showing buyers still paying for durable assets with financing discipline." },
    ],
    summary: "The answer has the right shape, but it still needs a more concrete deal anchor. The strongest next rep is adding names, timing, and your read on why it matters.",
    coachNotes: [
      "Use one specific deal instead of a generic market theme.",
      "Include the buyer, target, and why the transaction matters right now.",
      "Finish with your own takeaway so it sounds like a view, not a recap.",
    ],
    nextRep: "Run one 60-second deal pitch built around a single live transaction.",
  },
};

function formatCountdown(value: string) {
  if (!value) return "No date selected";
  const today = new Date();
  const interview = new Date(`${value}T00:00:00`);
  const diff = Math.round((interview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diff)) return "No date selected";
  if (diff === 0) return "Interview is today";
  if (diff < 0) return `Interview was ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;
  return `Interview in ${diff} day${diff === 1 ? "" : "s"}`;
}

const stateLabel: Record<string, string> = {
  idle: "Start Mock Interview",
  connecting: "Connecting…",
  connected: "End Mock Interview",
  ending: "Ending…",
  debriefing: "Writing Coach Notes…",
  done: "Run Another Rep",
  error: "Try Again",
};

type SubscriptionState = {
  status: string;
  current_period_end: string | null;
} | null;

type HistoryEntry = {
  id: string;
  created_at: string;
  bank: string | null;
  group_name: string | null;
  interview_stage: string | null;
  mode: string;
  scorecards:
    | {
        summary?: string | null;
        next_steps?: string[] | null;
      }[]
    | null;
};

function formatSessionDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function MockInterviewStudio() {
  const [track, setTrack] = useState<SessionMode>("story");
  const [profile, setProfile] = useState<Profile>({
    school: "Wharton",
    background: "Student investment fund and corporate finance internship",
    bank: "Evercore",
    group: "M&A",
    stage: "Superday",
    interviewDate: "2026-04-17",
  });

  const { state, transcript, debrief, error, start, stop } = useVoiceSession();
  const { user, loading: authLoading, signOut } = useAuthSession();
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [authError, setAuthError] = useState<string | null>(null);
  const [billingState, setBillingState] = useState<"idle" | "checkout" | "portal">("idle");
  const [subscription, setSubscription] = useState<SubscriptionState>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [accountLoading, setAccountLoading] = useState(false);

  const isLive = state === "connected";
  const isLoading = state === "connecting" || state === "ending" || state === "debriefing";
  const isDone = state === "done";
  const previewTrack = DEMO_TRACKS[track];
  const liveTranscript = isLive || isDone || state === "debriefing" || state === "ending"
    ? transcript
    : null;
  const hasActivePlan = subscription?.status === "active" || subscription?.status === "trialing";

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !supabase) {
      setSubscription(null);
      setHistory([]);
      setAccountLoading(false);
      return;
    }
    const supabaseClient = supabase;

    let ignore = false;

    async function loadAccountData() {
      setAccountLoading(true);

      const [subscriptionResult, historyResult] = await Promise.all([
        supabaseClient
          .from("subscriptions")
          .select("status, current_period_end")
          .maybeSingle(),
        supabaseClient
          .from("mock_sessions")
          .select("id, created_at, bank, group_name, interview_stage, mode, scorecards(summary, next_steps)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (ignore) {
        return;
      }

      setSubscription(
        subscriptionResult.data
          ? {
              status: subscriptionResult.data.status as string,
              current_period_end: (subscriptionResult.data.current_period_end as string | null) ?? null,
            }
          : null
      );
      setHistory((historyResult.data as HistoryEntry[] | null) ?? []);
      setAccountLoading(false);
    }

    void loadAccountData();

    return () => {
      ignore = true;
    };
  }, [authLoading, debrief?.sessionId, supabase, user]);

  async function handleSessionButton() {
    if (state === "idle" || state === "error" || state === "done") {
      const payload: InterviewProfile = {
        school: profile.school,
        background: profile.background,
        bank: profile.bank,
        group: profile.group,
        stage: profile.stage,
        mode: track,
        prompt: previewTrack.prompt,
      };
      await start(payload);
    } else if (state === "connected") {
      await stop();
    }
  }

  async function handleCheckout() {
    setBillingState("checkout");
    setAuthError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{}",
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; url?: string } | null;
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to start checkout.");
      }

      window.location.assign(payload.url);
    } catch (checkoutError) {
      setAuthError(
        checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout."
      );
      setBillingState("idle");
    }
  }

  async function handlePortal() {
    setBillingState("portal");
    setAuthError(null);

    try {
      const response = await fetch("/api/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{}",
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; url?: string } | null;
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to open billing portal.");
      }

      window.location.assign(payload.url);
    } catch (portalError) {
      setAuthError(
        portalError instanceof Error ? portalError.message : "Unable to open billing portal."
      );
      setBillingState("idle");
    }
  }

  const inputClass = "bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const labelClass = "text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide";

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
          Mock interview
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] leading-[1.1] mb-3">
          Get a live investment banking interview rep on demand.
        </h1>
        <p className="text-[#6B7280] leading-relaxed">
          Pick the prompt, answer out loud, and get a short debrief with coach notes and the next rep to run.
        </p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        <form id="account" className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C9A227] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 rounded-md">
              Interview setup
            </span>
            <span className="text-xs text-[#9CA3AF]">{formatCountdown(profile.interviewDate)}</span>
          </div>

          {[
            { id: "school", label: "School / program", field: "school" as const },
            { id: "background", label: "Background", field: "background" as const },
          ].map(({ id, label, field }) => (
            <div key={id} className="flex flex-col gap-1">
              <label htmlFor={id} className={labelClass}>{label}</label>
              <input
                id={id}
                value={profile[field]}
                onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                disabled={isLive || isLoading}
                className={inputClass}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "bank", label: "Target bank", field: "bank" as const, options: banks },
              { id: "group", label: "Target group", field: "group" as const, options: groups },
            ].map(({ id, label, field, options }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={id} className={labelClass}>{label}</label>
                <select
                  id={id}
                  value={profile[field]}
                  onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                  disabled={isLive || isLoading}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {options.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="stage" className={labelClass}>Stage</label>
              <select
                id="stage"
                value={profile.stage}
                onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
                disabled={isLive || isLoading}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {stages.map((stage) => <option key={stage}>{stage}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="interview-date" className={labelClass}>Interview date</label>
              <input
                id="interview-date"
                type="date"
                value={profile.interviewDate}
                onChange={(e) => setProfile({ ...profile, interviewDate: e.target.value })}
                disabled={isLive || isLoading}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSessionButton}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              isLive
                ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                : "bg-[#111827] text-white hover:bg-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isLive && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
            {stateLabel[state] ?? "Start Mock Interview"}
          </button>

          {error && (
            <p className="text-xs text-red-600 leading-relaxed bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <p className="text-[11px] leading-relaxed text-[#9CA3AF]">
            Free trial access is rate-limited. Billing and saved-account actions require sign-in.
          </p>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                  Account
                </p>
                <h2 className="mt-1 text-sm font-semibold text-[#111827]">
                  {user ? "Signed in and ready to save your reps." : "Sign in to save history and unlock billing."}
                </h2>
              </div>
              {user && (
                <span className="rounded-full bg-[rgba(201,162,39,0.12)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9A7620]">
                  {hasActivePlan ? "Pro" : "Trial"}
                </span>
              )}
            </div>

            {authLoading || accountLoading ? (
              <p className="mt-4 text-sm text-[#9CA3AF]">Loading account…</p>
            ) : user ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#FCFBF8] px-4 py-3">
                  <p className="text-sm font-medium text-[#111827]">{user.email}</p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    {hasActivePlan
                      ? `Subscription active${subscription?.current_period_end ? ` until ${formatSessionDate(subscription.current_period_end)}` : ""}.`
                      : "No active subscription yet. Start your plan to unlock unlimited reps."}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!hasActivePlan && (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={billingState !== "idle"}
                      className="w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {billingState === "checkout" ? "Opening checkout…" : "Start 3-day free trial"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handlePortal}
                    disabled={billingState !== "idle" || !hasActivePlan}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition-colors duration-150 hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {billingState === "portal" ? "Opening billing…" : "Manage billing"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="w-full rounded-xl border border-transparent px-4 py-2 text-xs font-medium text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <Link
                  href="/create-account?redirectTo=%2Fmock-interview%23account"
                  className="flex w-full items-center justify-center rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1F2937]"
                >
                  Create account
                </Link>

                <Link
                  href="/login?redirectTo=%2Fmock-interview%23account"
                  className="flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition-colors duration-150 hover:bg-[#F9FAFB]"
                >
                  Log in
                </Link>

                <p className="text-xs leading-relaxed text-[#9CA3AF]">
                  Create an account or sign in to save your history, manage billing, and keep unlimited practice attached to one account.
                </p>
              </div>
            )}

            {authError && (
              <p className="mt-3 text-xs text-red-600">{authError}</p>
            )}
          </div>

          {user && history.length > 0 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                Saved history
              </p>
              <div className="mt-3 space-y-3">
                {history.map((entry) => {
                  const summary = entry.scorecards?.[0]?.summary ?? null;

                  return (
                    <div key={entry.id} className="rounded-xl border border-[#E5E7EB] bg-[#FCFBF8] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[#111827]">
                          {entry.bank || "Target bank"} {entry.group_name ? `· ${entry.group_name}` : ""}
                        </p>
                        <span className="text-[11px] text-[#9CA3AF]">
                          {formatSessionDate(entry.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF]">
                        {entry.mode} · {entry.interview_stage || "Practice"}
                      </p>
                      {summary && (
                        <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                          {summary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        <div className="flex flex-col gap-4">
          {!isLive && state !== "debriefing" && (
            <div role="tablist" aria-label="Practice mode" className="flex gap-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-1">
              {(Object.keys(DEMO_TRACKS) as SessionMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={track === item}
                  onClick={() => setTrack(item)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    track === item ? "bg-[#111827] text-white" : "text-[#9CA3AF] hover:text-[#6B7280]"
                  }`}
                >
                  {DEMO_TRACKS[item].label}
                </button>
              ))}
            </div>
          )}

          <article className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md ${
                isLive ? "text-green-600 bg-green-50" : "text-[#C9A227] bg-[rgba(201,162,39,0.08)]"
              }`}>
                {isLive ? "● Live" : state === "debriefing" ? "Coach notes…" : "Live interviewer"}
              </span>
              <span className="text-xs text-[#9CA3AF]">{profile.bank} {profile.group} · {profile.stage}</span>
            </div>

            {!isLive && state !== "debriefing" && (
              <h2 className="text-base font-semibold text-[#111827] leading-snug mb-3">{previewTrack.prompt}</h2>
            )}

            {liveTranscript && liveTranscript.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {liveTranscript.map((entry) => (
                  <li key={entry.id}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="text-xs font-semibold text-[#111827]">{entry.speaker === "interviewer" ? "Interviewer" : "You"}</strong>
                      <span className="text-[10px] text-[#9CA3AF]">{entry.speaker}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{entry.text}</p>
                  </li>
                ))}
              </ul>
            ) : isLive ? (
              <p className="text-sm text-[#9CA3AF] italic">Listening… start speaking when ready.</p>
            ) : state === "debriefing" ? (
              <p className="text-sm text-[#9CA3AF] italic">Wrapping the session and pulling out the next rep to run…</p>
            ) : (
              <ul className="space-y-3">
                {previewTrack.transcript.map((item) => (
                  <li key={item.tag}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="text-xs font-semibold text-[#111827]">{item.speaker}</strong>
                      <span className="text-[10px] text-[#9CA3AF]">{item.tag}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-[#9CA3AF]">{isDone ? "Session debrief" : "Sample debrief"}</span>
              <span className="text-xs font-semibold text-[#C9A227] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 rounded-md">
                {previewTrack.label}
              </span>
            </div>

            {isDone && debrief ? (
              <div className="space-y-5">
                {debrief.summary && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Recap</p>
                    <p className="text-sm text-[#6B7280] leading-relaxed p-3 bg-white rounded-lg border border-[#E5E7EB]">
                      {debrief.summary}
                    </p>
                  </div>
                )}

                {debrief.coachNotes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Coach notes</p>
                    <ul className="space-y-1.5">
                      {debrief.coachNotes.map((item) => (
                        <li key={item} className="text-sm text-[#6B7280] flex items-start gap-1.5">
                          <span className="text-[#C9A227] flex-shrink-0 mt-0.5">·</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {debrief.nextRep && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Next rep</p>
                    <p className="text-sm text-[#6B7280] leading-relaxed p-3 bg-white rounded-lg border border-[#E5E7EB]">
                      {debrief.nextRep}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Recap</p>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed p-3 bg-white rounded-lg border border-[#E5E7EB]">
                    {previewTrack.summary}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Coach notes</p>
                  <ul className="space-y-1.5">
                    {previewTrack.coachNotes.map((item) => (
                      <li key={item} className="text-sm text-[#9CA3AF] flex items-start gap-1.5 opacity-75">
                        <span className="text-[#C9A227] flex-shrink-0 mt-0.5">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-2">Next rep</p>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed p-3 bg-white rounded-lg border border-[#E5E7EB] opacity-75">
                    {previewTrack.nextRep}
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
