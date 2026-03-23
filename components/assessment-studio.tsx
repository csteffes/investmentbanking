"use client";

import { useState } from "react";

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

const initialProfile: Profile = {
  school: "Wharton",
  background: "Student investment fund and corporate finance internship",
  bank: "Evercore",
  group: "M&A",
  stage: "Superday",
  interviewDate: "2026-04-17",
  confidence: 6
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

function buildScenario(track: Track, profile: Profile) {
  const base = {
    story: {
      label: "Story / Resume",
      prompt: `Walk me through your path from ${profile.background.toLowerCase()} to ${profile.bank} ${profile.group}, and explain why now is the right time.`,
      summary: "Coach the core story until it sounds earned, specific, and calm under follow-up.",
      transcript: [
        { speaker: "Coach", tag: "opening", text: "Lead with the pivot. Save the full chronology for later if they ask." },
        { speaker: "You", tag: "candidate", text: `I built real execution exposure through ${profile.background.toLowerCase()}, but I want a faster feedback loop and higher-stakes client work, which is why ${profile.bank} became the focus.` },
        { speaker: "Coach", tag: "follow-up", text: "That is the right shape. Add one sharper reason for this group and one proof point from your background." }
      ],
      scores: [
        ["Structure", 86],
        ["Communication", 84],
        ["Poise", 81],
        ["Fit", 88]
      ],
      evidence: ["Strong why-now logic.", "The why-this-group answer needs one sharper proof point.", "The close can be tighter."],
      nextSteps: ["Re-record your 90-second story.", "Cut two sentences from the opening.", "Add one bank-specific close."]
    },
    technical: {
      label: "Technical Core",
      prompt: `Walk me through how a $10 increase in depreciation flows through the three statements, then tell me how that changes enterprise value versus equity value.`,
      summary: "Use fast, repeatable drills to tighten accounting, valuation, and merger math answers.",
      transcript: [
        { speaker: "Coach", tag: "technical", text: "Start with the income statement, then move cleanly to cash flow and the balance sheet." },
        { speaker: "You", tag: "candidate", text: "EBIT falls by 10, taxes fall by the shield, and net income falls by the after-tax amount. Cash rises by the tax shield after adding depreciation back, and retained earnings fall by the same after-tax amount." },
        { speaker: "Coach", tag: "follow-up", text: `Good mechanics. Now answer faster and connect it back to what ${profile.group} bankers actually care about.` }
      ],
      scores: [
        ["Technical accuracy", 85],
        ["Structure", 79],
        ["Communication", 77],
        ["Commercial context", 73]
      ],
      evidence: ["The accounting flow was right.", "The EV versus equity bridge was too slow.", "The deal context needs one cleaner sentence."],
      nextSteps: ["Run two 45-second technical drills.", "Refresh merger math.", "Add one line on deal relevance."]
    },
    markets: {
      label: "Deals & Markets",
      prompt: `Give me one recent ${profile.group} deal or market theme you would bring up in a ${profile.bank} interview and explain why it matters.`,
      summary: "Build banker-style market judgment with one real deal, one clear view, and one smart open question.",
      transcript: [
        { speaker: "Coach", tag: "markets", text: "Use one real deal. Summarize it, interpret it, and tell me why now matters." },
        { speaker: "You", tag: "candidate", text: "I would bring up a recent sector deal that shows buyers are still paying for durable assets, but with more discipline around financing and execution risk than a year ago." },
        { speaker: "Coach", tag: "follow-up", text: "Directionally right. Name the deal, show why the timing matters, and end with a question a banker would respect." }
      ],
      scores: [
        ["Commercial judgment", 88],
        ["Communication", 85],
        ["Structure", 82],
        ["Specificity", 74]
      ],
      evidence: ["Good instinct for a live interview.", "Use a real transaction instead of a theme alone.", "The open question is the strongest part."],
      nextSteps: ["Prepare two current deal talking points.", "Write one unresolved question per deal.", "Practice a tighter 60-second version."]
    }
  } as const;

  return base[track];
}

export function AssessmentStudio() {
  const [track, setTrack] = useState<Track>("story");
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const scenario = buildScenario(track, profile);
  const readiness = Math.round(
    scenario.scores.reduce((sum, [, value]) => sum + value, 0) / scenario.scores.length
  );

  return (
    <section className="assessment-shell">
      <div className="section-head section-head--compact">
        <p className="section-kicker">Assessment preview</p>
        <h1>Pressure test the interview before the interview.</h1>
        <p>
          Set your target, switch tracks, and watch the prompt, transcript, and scorecard update in real
          time.
        </p>
      </div>

      <div className="assessment-grid">
        <form className="panel panel-form">
          <div className="panel-topline">
            <span className="status-chip">Candidate profile</span>
            <span className="muted-copy">{formatCountdown(profile.interviewDate)}</span>
          </div>

          <div className="form-row">
            <label htmlFor="school">School / program</label>
            <input
              id="school"
              value={profile.school}
              onChange={(event) => setProfile({ ...profile, school: event.target.value })}
            />
          </div>

          <div className="form-row">
            <label htmlFor="background">Background</label>
            <input
              id="background"
              value={profile.background}
              onChange={(event) => setProfile({ ...profile, background: event.target.value })}
            />
          </div>

          <div className="form-split">
            <div className="form-row">
              <label htmlFor="bank">Target bank</label>
              <select
                id="bank"
                value={profile.bank}
                onChange={(event) => setProfile({ ...profile, bank: event.target.value })}
              >
                {banks.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="group">Target group</label>
              <select
                id="group"
                value={profile.group}
                onChange={(event) => setProfile({ ...profile, group: event.target.value })}
              >
                {groups.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-split">
            <div className="form-row">
              <label htmlFor="stage">Stage</label>
              <select
                id="stage"
                value={profile.stage}
                onChange={(event) => setProfile({ ...profile, stage: event.target.value })}
              >
                {stages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="interview-date">Interview date</label>
              <input
                id="interview-date"
                type="date"
                value={profile.interviewDate}
                onChange={(event) => setProfile({ ...profile, interviewDate: event.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="confidence">Technical confidence: {profile.confidence}/10</label>
            <input
              id="confidence"
              type="range"
              min="1"
              max="10"
              value={profile.confidence}
              onChange={(event) => setProfile({ ...profile, confidence: Number(event.target.value) })}
            />
          </div>

          <div className="brief-panel">
            <p className="brief-label">This sprint</p>
            <ul className="brief-list">
              <li>Run one live mock.</li>
              <li>Do two fast drills.</li>
              <li>Bring one real deal.</li>
            </ul>
          </div>
        </form>

        <div className="panel panel-preview">
          <div className="track-tabs" role="tablist" aria-label="Assessment track">
            {(["story", "technical", "markets"] as Track[]).map((item) => (
              <button
                aria-selected={track === item}
                className={`track-tab${track === item ? " is-active" : ""}`}
                key={item}
                onClick={() => setTrack(item)}
                type="button"
              >
                {buildScenario(item, profile).label}
              </button>
            ))}
          </div>

          <div className="preview-stack">
            <article className="panel panel-live">
              <div className="panel-topline">
                <span className="status-chip">Live coach</span>
                <span className="muted-copy">
                  {profile.bank} {profile.group} · {profile.stage}
                </span>
              </div>
              <h2>{scenario.prompt}</h2>
              <p className="panel-summary">{scenario.summary}</p>
              <div className="waveform" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <ul className="transcript-list">
                {scenario.transcript.map((item) => (
                  <li key={`${item.speaker}-${item.tag}`}>
                    <div className="speaker-row">
                      <strong>{item.speaker}</strong>
                      <span>{item.tag}</span>
                    </div>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="panel panel-scorecard">
              <div className="panel-topline">
                <span className="muted-copy">Transcript-backed review</span>
                <span className="score-pill">{readiness}/100 readiness</span>
              </div>
              <div className="metrics-grid">
                {scenario.scores.map(([label, value]) => (
                  <div className="metric-card" key={label}>
                    <div className="metric-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                    <div className="metric-bar">
                      <span style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="review-columns">
                <div>
                  <p className="brief-label">Evidence</p>
                  <ul className="brief-list">
                    {scenario.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="brief-label">Next reps</p>
                  <ul className="brief-list">
                    {scenario.nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
