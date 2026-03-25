"use client";

import { useState } from "react";
import { useVoiceSession } from "@/hooks/use-voice-session";
import type { ProfilePayload } from "@/hooks/use-voice-session";

type Track = "story" | "technical" | "markets";

type Profile = {
  school: string;
  background: string;
  bank: string;
  group: string;
  stage: string;
  interviewDate: string;
  confidence: number;
};

const banks = ["Evercore", "Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Lazard", "Centerview"];
const groups = ["M&A", "Healthcare", "TMT", "Industrials", "FIG", "LevFin"];
const stages = ["Networking", "First round", "Superday"];

const DEMO_TRACKS = {
  story: {
    label: "Story / Resume",
    prompt: "Walk me through your path and explain why now is the right time for banking.",
    transcript: [
      { speaker: "Coach" as const, tag: "opening", text: "Lead with the pivot. Save the full chronology for later if they ask." },
      { speaker: "You" as const, tag: "candidate", text: "I want the pace, client exposure, and execution intensity that banking offers." },
    ],
    scores: [["Structure", 86], ["Communication", 84], ["Poise", 81], ["Fit", 88]] as [string, number][],
  },
  technical: {
    label: "Technical Core",
    prompt: "Walk me through how a $10 increase in depreciation flows through the three statements.",
    transcript: [
      { speaker: "Coach" as const, tag: "technical", text: "Start with the income statement, then move cleanly to cash flow and the balance sheet." },
      { speaker: "You" as const, tag: "candidate", text: "EBIT falls by 10, taxes fall by the shield, net income falls by the after-tax amount." },
    ],
    scores: [["Technical accuracy", 85], ["Structure", 79], ["Communication", 77], ["Commercial context", 73]] as [string, number][],
  },
  markets: {
    label: "Deals & Markets",
    prompt: "Give me one recent deal or market theme you would bring up in your interview.",
    transcript: [
      { speaker: "Coach" as const, tag: "markets", text: "Use one real deal. Summarize it, interpret it, and tell me why now matters." },
      { speaker: "You" as const, tag: "candidate", text: "I'd bring up a recent sector deal showing buyers still paying for durable assets with financing discipline." },
    ],
    scores: [["Commercial judgment", 88], ["Communication", 85], ["Structure", 82], ["Specificity", 74]] as [string, number][],
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
  idle: "Start Live Mock",
  connecting: "Connecting…",
  connected: "End Session",
  ending: "Ending…",
  reviewing: "Generating scorecard…",
  done: "Start New Session",
  error: "Try Again",
};

export function AssessmentStudio() {
  const [track, setTrack] = useState<Track>("story");
  const [profile, setProfile] = useState<Profile>({
    school: "Wharton",
    background: "Student investment fund and corporate finance internship",
    bank: "Evercore",
    group: "M&A",
    stage: "Superday",
    interviewDate: "2026-04-17",
    confidence: 6,
  });

  const { state, transcript, scorecard, error, start, stop } = useVoiceSession();

  const isLive = state === "connected";
  const isLoading = state === "connecting" || state === "ending" || state === "reviewing";
  const isDone = state === "done";
  const demoTrack = DEMO_TRACKS[track];

  async function handleSessionButton() {
    if (state === "idle" || state === "error" || state === "done") {
      const payload: ProfilePayload = {
        school: profile.school,
        background: profile.background,
        bank: profile.bank,
        group: profile.group,
        stage: profile.stage,
      };
      await start(payload);
    } else if (state === "connected") {
      await stop();
    }
  }

  // Scores to display — real scorecard scores or demo scores
  const displayScores: [string, number][] = scorecard?.scores
    ? Object.entries(scorecard.scores).map(([k, v]) => [k.replace(/_/g, " "), v])
    : demoTrack.scores;

  const displayReadiness = scorecard?.readiness
    ?? Math.round(demoTrack.scores.reduce((s, [, v]) => s + v, 0) / demoTrack.scores.length);

  const displayTranscript = isLive || isDone || state === "reviewing" || state === "ending"
    ? transcript
    : null;

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-4">
          Live assessment
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] leading-[1.1] mb-3">
          Pressure test the interview before the interview.
        </h1>
        <p className="text-[#A0A0A0] leading-relaxed">
          Set your target, hit start, and practice with a real AI voice coach. Your scorecard generates automatically when you end the session.
        </p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-5">
        {/* ── Profile form ─────────────────────────────── */}
        <form className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#C9A227] bg-[rgba(201,162,39,0.1)] px-2 py-0.5 rounded">
              Candidate profile
            </span>
            <span className="text-xs text-[#606060]">{formatCountdown(profile.interviewDate)}</span>
          </div>

          {[
            { id: "school", label: "School / program", field: "school" as const },
            { id: "background", label: "Background", field: "background" as const },
          ].map(({ id, label, field }) => (
            <div key={id} className="flex flex-col gap-1">
              <label htmlFor={id} className="text-[11px] font-medium text-[#606060] uppercase tracking-wide">
                {label}
              </label>
              <input
                id={id}
                value={profile[field]}
                onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                disabled={isLive || isLoading}
                className="bg-[#1A1A1A] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8F8F8] placeholder-[#606060] focus:outline-none focus:border-[#C9A227]/50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "bank", label: "Target bank", field: "bank" as const, options: banks },
              { id: "group", label: "Target group", field: "group" as const, options: groups },
            ].map(({ id, label, field, options }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-[11px] font-medium text-[#606060] uppercase tracking-wide">
                  {label}
                </label>
                <select
                  id={id}
                  value={profile[field]}
                  onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                  disabled={isLive || isLoading}
                  className="bg-[#1A1A1A] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8F8F8] focus:outline-none focus:border-[#C9A227]/50 transition-colors duration-150 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="stage" className="text-[11px] font-medium text-[#606060] uppercase tracking-wide">
                Stage
              </label>
              <select
                id="stage"
                value={profile.stage}
                onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
                disabled={isLive || isLoading}
                className="bg-[#1A1A1A] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8F8F8] focus:outline-none focus:border-[#C9A227]/50 transition-colors duration-150 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {stages.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="interview-date" className="text-[11px] font-medium text-[#606060] uppercase tracking-wide">
                Interview date
              </label>
              <input
                id="interview-date"
                type="date"
                value={profile.interviewDate}
                onChange={(e) => setProfile({ ...profile, interviewDate: e.target.value })}
                disabled={isLive || isLoading}
                className="bg-[#1A1A1A] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8F8F8] focus:outline-none focus:border-[#C9A227]/50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confidence" className="text-[11px] font-medium text-[#606060] uppercase tracking-wide">
              Technical confidence:{" "}
              <span className="text-[#C9A227]">{profile.confidence}/10</span>
            </label>
            <input
              id="confidence"
              type="range"
              min="1"
              max="10"
              value={profile.confidence}
              onChange={(e) => setProfile({ ...profile, confidence: Number(e.target.value) })}
              disabled={isLive || isLoading}
              className="w-full accent-[#C9A227] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Session button */}
          <button
            type="button"
            onClick={handleSessionButton}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              isLive
                ? "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20"
                : "bg-[#C9A227] text-[#0A0A0A] hover:bg-[#E8BC30] disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isLive && (
              <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444] mr-2 animate-pulse" />
            )}
            {stateLabel[state] ?? "Start Live Mock"}
          </button>

          {error && (
            <p className="text-xs text-[#EF4444] leading-relaxed bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-2">
              This sprint
            </p>
            <ul className="space-y-1.5">
              {["Run one live mock.", "Do two fast drills.", "Bring one real deal."].map((item) => (
                <li key={item} className="text-xs text-[#A0A0A0] flex items-start gap-1.5">
                  <span className="text-[#C9A227] flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </form>

        {/* ── Right panel ──────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Track tabs — only show when not in live session */}
          {!isLive && state !== "reviewing" && (
            <div
              role="tablist"
              aria-label="Assessment track"
              className="flex gap-1 bg-[#111111] border border-white/[0.08] rounded-xl p-1"
            >
              {(Object.keys(DEMO_TRACKS) as Track[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={track === item}
                  onClick={() => setTrack(item)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    track === item
                      ? "bg-[#C9A227] text-[#0A0A0A]"
                      : "text-[#606060] hover:text-[#A0A0A0]"
                  }`}
                >
                  {DEMO_TRACKS[item].label}
                </button>
              ))}
            </div>
          )}

          {/* Live session panel */}
          <article className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${
                isLive
                  ? "text-[#22C55E] bg-[rgba(34,197,94,0.1)]"
                  : "text-[#C9A227] bg-[rgba(201,162,39,0.1)]"
              }`}>
                {isLive ? "● Live" : state === "reviewing" ? "Processing…" : "Live coach"}
              </span>
              <span className="text-xs text-[#606060]">
                {profile.bank} {profile.group} · {profile.stage}
              </span>
            </div>

            {!isLive && state !== "reviewing" && (
              <h2 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-3">
                {demoTrack.prompt}
              </h2>
            )}

            {/* Waveform — only animate when live */}
            <div className={`waveform mb-4${isLive ? "" : " waveform--idle"}`} aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
            </div>

            {/* Live transcript */}
            {displayTranscript && displayTranscript.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {displayTranscript.map((entry) => (
                  <li key={entry.id}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="text-xs font-semibold text-[#F8F8F8]">
                        {entry.speaker === "coach" ? "Coach" : "You"}
                      </strong>
                      <span className="text-[10px] text-[#606060]">{entry.speaker}</span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">{entry.text}</p>
                  </li>
                ))}
              </ul>
            ) : isLive ? (
              <p className="text-xs text-[#606060] italic">Listening… start speaking when ready.</p>
            ) : state === "reviewing" ? (
              <p className="text-xs text-[#606060] italic">Analyzing your session…</p>
            ) : (
              /* Demo transcript */
              <ul className="space-y-3">
                {demoTrack.transcript.map((item) => (
                  <li key={item.tag}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="text-xs font-semibold text-[#F8F8F8]">{item.speaker}</strong>
                      <span className="text-[10px] text-[#606060]">{item.tag}</span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          {/* Scorecard */}
          <article className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-[#606060]">
                {isDone ? "Session scorecard" : "Transcript-backed review"}
              </span>
              <span className="text-[10px] font-semibold text-[#C9A227] bg-[rgba(201,162,39,0.1)] px-2 py-0.5 rounded">
                {displayReadiness}/100 readiness
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {displayScores.map(([label, value]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#A0A0A0] capitalize">{label}</span>
                    <strong className="text-[#F8F8F8]">{value}</strong>
                  </div>
                  <div className="metric-bar">
                    <span style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {isDone && scorecard ? (
              <>
                {scorecard.summary && (
                  <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4 p-3 bg-[#1A1A1A] rounded-lg border border-white/[0.06]">
                    {scorecard.summary}
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Evidence", items: scorecard.evidence },
                    { label: "Next reps", items: scorecard.next_steps },
                  ].map(({ label, items }) => (
                    items.length > 0 && (
                      <div key={label}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-2">
                          {label}
                        </p>
                        <ul className="space-y-1.5">
                          {items.map((item) => (
                            <li key={item} className="text-xs text-[#A0A0A0] flex items-start gap-1.5">
                              <span className="text-[#C9A227] flex-shrink-0 mt-0.5">·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Evidence", items: ["Strong why-now logic.", "The why-this-group answer needs one sharper proof point.", "The close can be tighter."] },
                  { label: "Next reps", items: ["Re-record your 90-second story.", "Cut two sentences from the opening.", "Add one bank-specific close."] },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-2">
                      {label}
                    </p>
                    <ul className="space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="text-xs text-[#A0A0A0] flex items-start gap-1.5 opacity-40">
                          <span className="text-[#C9A227] flex-shrink-0 mt-0.5">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
