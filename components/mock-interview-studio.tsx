"use client";

import { useState } from "react";

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

  const isLive = state === "connected";
  const isLoading = state === "connecting" || state === "ending" || state === "debriefing";
  const isDone = state === "done";
  const previewTrack = DEMO_TRACKS[track];
  const liveTranscript = isLive || isDone || state === "debriefing" || state === "ending"
    ? transcript
    : null;

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
        <form className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4 h-fit">
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
