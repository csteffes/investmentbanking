const yearNode = document.querySelector("#year");
const trackTabs = document.querySelectorAll(".track-tab");
const filterButtons = document.querySelectorAll(".filter-chip");
const libraryCards = document.querySelectorAll(".library-card");
const resumeFileInput = document.querySelector("#resume-file");
const resumeFileNote = document.querySelector("#resume-file-note");
const programInput = document.querySelector("#program-input");
const backgroundInput = document.querySelector("#background-input");
const bankSelect = document.querySelector("#bank-select");
const groupSelect = document.querySelector("#group-select");
const stageSelect = document.querySelector("#stage-select");
const dateInput = document.querySelector("#date-input");
const confidenceRange = document.querySelector("#confidence-range");
const confidenceOutput = document.querySelector("#confidence-output");

const heroBank = document.querySelector("#hero-bank");
const heroGroup = document.querySelector("#hero-group");
const heroStage = document.querySelector("#hero-stage");
const heroPrompt = document.querySelector("#hero-prompt");
const heroTranscript = document.querySelector("#hero-transcript");
const heroReadiness = document.querySelector("#hero-readiness");
const heroReviewTitle = document.querySelector("#hero-review-title");
const heroReviewPoints = document.querySelector("#hero-review-points");

const briefDate = document.querySelector("#brief-date");
const briefTitle = document.querySelector("#brief-title");
const briefSummary = document.querySelector("#brief-summary");
const briefPersona = document.querySelector("#brief-persona");
const briefFocus = document.querySelector("#brief-focus");
const briefSprint = document.querySelector("#brief-sprint");

const demoTrackLabel = document.querySelector("#demo-track-label");
const demoTitle = document.querySelector("#demo-title");
const demoSummary = document.querySelector("#demo-summary");
const transcriptList = document.querySelector("#transcript-list");
const metricStack = document.querySelector("#metric-stack");
const evidenceList = document.querySelector("#evidence-list");
const nextRepsList = document.querySelector("#next-reps-list");
const demoReadiness = document.querySelector("#demo-readiness");

const bankProfiles = {
  Evercore: {
    tone: "Fast-paced VP screen with lean, direct follow-up pressure.",
    emphasis: "elite-boutique polish and clean transaction reasoning",
    dealHint: "large-cap advisory and sponsor-backed situations",
  },
  "Goldman Sachs": {
    tone: "High-bar associate interview with strong expectation of polish and composure.",
    emphasis: "poise, market awareness, and strong institutional fit",
    dealHint: "cross-product breadth and market color",
  },
  "J.P. Morgan": {
    tone: "Balanced associate screen with teamwork, execution discipline, and broad market awareness.",
    emphasis: "platform breadth, financing context, and client readiness",
    dealHint: "financing conditions and cross-sell opportunities",
  },
  "Morgan Stanley": {
    tone: "Polished first round with tighter attention to clarity and client presence.",
    emphasis: "communication, judgment, and steady technical delivery",
    dealHint: "sector narratives and financing windows",
  },
  Lazard: {
    tone: "Classic advisory-heavy screen with sharp follow-ups and a premium on judgment.",
    emphasis: "advisory mindset, precision, and deal judgment",
    dealHint: "strategic M&A logic and board-level discussion",
  },
  Centerview: {
    tone: "Very direct superday pressure with little patience for vague language.",
    emphasis: "clarity, depth, and senior-level commercial instinct",
    dealHint: "high-stakes strategic transactions",
  },
};

const groupProfiles = {
  "M&A": {
    focus: "merger math, transaction rationale, and execution cadence",
    recentDeal: "one recent strategic or sponsor-backed transaction",
  },
  Industrials: {
    focus: "cyclical sector context, capital intensity, and valuation ranges",
    recentDeal: "one industrials or aerospace transaction",
  },
  Healthcare: {
    focus: "regulatory nuance, reimbursement context, and growth quality",
    recentDeal: "one provider, medtech, or pharma transaction",
  },
  TMT: {
    focus: "sector narratives, software multiples, and growth durability",
    recentDeal: "one software, infra, or telecom deal",
  },
  FIG: {
    focus: "balance-sheet mechanics, regulation, and funding considerations",
    recentDeal: "one bank, insurer, or specialty finance transaction",
  },
  LevFin: {
    focus: "capital structure, debt sizing, and financing market conditions",
    recentDeal: "one leveraged buyout or refinancing discussion",
  },
};

const stageProfiles = {
  "Networking / coffee chats": {
    label: "Networking",
    sprint: [
      "Practice a clean 60-second personal story without sounding over-rehearsed.",
      "Build two thoughtful questions for bankers in your target group.",
      "Prepare one recent deal and one reason this platform fits your pivot.",
    ],
  },
  "First round": {
    label: "First round",
    sprint: [
      "Run one live mock with fit and technical mix before your next first round.",
      "Do two quick drills on accounting links and why this bank.",
      "Tighten one market or financing talking point for an informed close.",
    ],
  },
  Superday: {
    label: "Superday",
    sprint: [
      "Run one full live mock and two pressure drills under interruption.",
      "Sharpen one crisp why-bank answer and one recent deal discussion.",
      "Practice closing questions that sound informed, specific, and senior.",
    ],
  },
};

const demoScenarios = {
  story: {
    label: "Story / Resume",
    prompt: ({ bank, group, background, program }) =>
      `Walk me through your move from ${background.toLowerCase()} to ${program}, and tell me why ${bank} ${group} is the right next step now.`,
    summary: ({ bank, group }) =>
      `Resume-to-banking transition personalized for ${bank} ${group} recruiting.`,
    transcript: ({ background, program, bank, group }) => [
      {
        speaker: "Coach",
        tag: "opening",
        text: `Start with the pivot logic, not your full chronology. Why does ${bank} ${group} make sense after ${program}?`,
      },
      {
        speaker: "You",
        tag: "candidate",
        text: `I spent four years in ${background.toLowerCase()}, where I learned to break down messy strategic choices and communicate recommendations to senior leaders. At ${program}, I wanted deeper transaction exposure, faster feedback loops, and more client-facing execution, which is why ${bank} stood out.`,
      },
      {
        speaker: "Coach",
        tag: "follow-up",
        text: `Good foundation. Now tighten the bridge between strategy and live deal execution, and make the ${group} choice feel more specific than "I like transactions."`,
      },
    ],
    scores: {
      "Technical accuracy": 72,
      Structure: 88,
      Communication: 84,
      Poise: 82,
      "Commercial judgment": 76,
    },
    evidence: ({ bank, group }) => [
      `Strong transfer story, especially when connecting prior operating work to ${bank}'s advisory intensity.`,
      `The "why ${group}" answer needs one more concrete signal beyond broad interest in deals.`,
      "Energy stayed calm under interruption, but the closing sentence can land more decisively.",
    ],
    nextReps: ({ bank, group }) => [
      `Re-record your 75-second "why ${bank} / why ${group}" answer with a stronger group-specific proof point.`,
      "Cut chronology by one-third and lead with the pivot thesis.",
      "Practice one senior-sounding closing question tied to the team's current market activity.",
    ],
  },
  technical: {
    label: "Technical Core",
    prompt: ({ bank, group }) =>
      `You are interviewing for ${bank} ${group}. Walk me through how a $10 increase in depreciation flows through the three statements, then tell me how that affects enterprise value versus equity value.`,
    summary: ({ bank, group }) =>
      `Technical fundamentals calibrated for ${bank} ${group} pressure.`,
    transcript: ({ group }) => [
      {
        speaker: "Coach",
        tag: "technical",
        text: "Start with the income statement, then move cleanly to cash flow and the balance sheet without pausing to search.",
      },
      {
        speaker: "You",
        tag: "candidate",
        text: "On the income statement, EBIT falls by 10, taxes fall by the tax shield, and net income declines by the after-tax amount. On the cash flow statement, net income starts lower, then depreciation is added back, so cash rises by the tax shield. On the balance sheet, cash is up by that shield, PP&E is down by 10, and retained earnings are down by the after-tax amount.",
      },
      {
        speaker: "Coach",
        tag: "follow-up",
        text: `Solid mechanics. Now move faster on the EV versus equity value distinction and connect it back to why ${group} bankers care in live deal work.`,
      },
    ],
    scores: {
      "Technical accuracy": 86,
      Structure: 80,
      Communication: 79,
      Poise: 74,
      "Commercial judgment": 71,
    },
    evidence: () => [
      "The accounting flow was correct and sequenced clearly.",
      "You hesitated when shifting from mechanics to valuation relevance, which made the answer feel memorized instead of internalized.",
      "Commercial framing improved once the answer connected back to deal work.",
    ],
    nextReps: ({ group }) => [
      `Run a ${group} technical drill focused on EV, equity value, and purchase price logic.`,
      "Do one interruption-heavy repetition with a 45-second answer cap.",
      "Add one sentence explaining why the concept matters in real transaction work.",
    ],
  },
  markets: {
    label: "Deals & Markets",
    prompt: ({ bank, group }) =>
      `Give me one recent ${group} deal or market theme you would bring up in a ${bank} interview, explain why it matters, and tell me what question you still have about it.`,
    summary: ({ bank, group }) =>
      `Recent deals and market judgment for ${bank} ${group} interviews.`,
    transcript: ({ bank, group }) => [
      {
        speaker: "Coach",
        tag: "markets",
        text: `Pick one recent ${group} transaction or financing theme. Summarize it, interpret it, and avoid sounding like you memorized headlines.`,
      },
      {
        speaker: "You",
        tag: "candidate",
        text: "I would bring up a recent transaction in the sector because it shows how buyers are balancing growth conviction with a still-selective financing backdrop. What interested me most was not just the headline valuation, but how the buyer justified strategic control and timing despite a tighter capital market environment.",
      },
      {
        speaker: "Coach",
        tag: "follow-up",
        text: `That is directionally good. The next step is specificity: deal name, why now, and one unresolved question that a banker at ${bank} would respect.`,
      },
    ],
    scores: {
      "Technical accuracy": 78,
      Structure: 83,
      Communication: 86,
      Poise: 85,
      "Commercial judgment": 89,
    },
    evidence: ({ bank }) => [
      `Good instinct on moving from headline summary to interpretation, which matters in a ${bank} interview.`,
      "The answer still needs a named deal, not just a market pattern.",
      "Strong closing move when framing one open question instead of pretending full certainty.",
    ],
    nextReps: ({ group }) => [
      `Prepare two current ${group} talking points with one sentence on why they matter now.`,
      "Write down one intelligent unresolved question for each deal you plan to discuss.",
      "Practice a tighter 60-second version that lands on insight before detail.",
    ],
  },
};

let activeTrack = "story";

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function averageScore(scores) {
  const values = Object.values(scores);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function formatInterviewCountdown(rawDate) {
  if (!rawDate) {
    return "No interview date selected";
  }

  const now = new Date();
  const interviewDate = new Date(`${rawDate}T00:00:00`);
  const diffMs = interviewDate.getTime() - now.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(days)) {
    return "No interview date selected";
  }

  if (days === 0) {
    return "Interview is today";
  }

  if (days < 0) {
    return `Interview was ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  }

  return `Interview in ${days} day${days === 1 ? "" : "s"}`;
}

function confidenceLabel(value) {
  if (value <= 3) {
    return "Needs rebuilding";
  }

  if (value <= 6) {
    return "Developing";
  }

  if (value <= 8) {
    return "Solid";
  }

  return "Sharp";
}

function getProfile() {
  return {
    resumeFile: resumeFileInput?.files?.[0]?.name || "No file selected",
    program: programInput?.value?.trim() || "Your MBA program",
    background: backgroundInput?.value?.trim() || "your pre-MBA background",
    bank: bankSelect?.value || "Evercore",
    group: groupSelect?.value || "M&A",
    stage: stageSelect?.value || "Superday",
    date: dateInput?.value || "",
    confidence: Number(confidenceRange?.value || 6),
  };
}

function renderList(node, items) {
  if (!node) return;

  node.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderTranscript(node, items) {
  if (!node) return;

  node.innerHTML = items
    .map(
      (item) => `
        <li>
          <div class="speaker-row">
            <strong>${item.speaker}</strong>
            <span>${item.tag}</span>
          </div>
          <p>${item.text}</p>
        </li>
      `
    )
    .join("");
}

function renderMetrics(node, scores) {
  if (!node) return;

  node.innerHTML = Object.entries(scores)
    .map(
      ([label, value]) => `
        <div class="metric-row">
          <div class="metric-label">
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
          <div class="metric-bar">
            <span style="width: ${value}%"></span>
          </div>
        </div>
      `
    )
    .join("");
}

function updateBrief(profile) {
  const bankProfile = bankProfiles[profile.bank];
  const groupProfile = groupProfiles[profile.group];
  const stageProfile = stageProfiles[profile.stage];

  if (confidenceOutput) {
    confidenceOutput.textContent = `${profile.confidence}/10`;
  }

  if (briefDate) {
    briefDate.textContent = formatInterviewCountdown(profile.date);
  }

  if (briefTitle) {
    briefTitle.textContent = `${profile.bank} ${profile.group} ${stageProfile.label.toLowerCase()} sprint`;
  }

  if (briefSummary) {
    briefSummary.textContent = `${profile.program} candidate with a pre-MBA background in ${profile.background.toLowerCase()} preparing for ${profile.bank} ${profile.group} ${profile.stage.toLowerCase()} interviews.`;
  }

  if (briefPersona) {
    briefPersona.textContent = bankProfile.tone;
  }

  const confidenceText = confidenceLabel(profile.confidence).toLowerCase();
  const focusItems = [
    `Anchor the story in ${bankProfile.emphasis}.`,
    `Prioritize ${groupProfile.focus} because your technical confidence is currently ${confidenceText}.`,
    `Bring ${groupProfile.recentDeal} and connect it to ${bankProfile.dealHint}.`,
  ];

  renderList(briefFocus, focusItems);
  renderList(briefSprint, stageProfile.sprint);
}

function updateHero(profile, scenario) {
  const readiness = averageScore(scenario.scores);

  if (heroBank) heroBank.textContent = profile.bank;
  if (heroGroup) heroGroup.textContent = profile.group;
  if (heroStage) heroStage.textContent = stageProfiles[profile.stage].label;
  if (heroPrompt) heroPrompt.textContent = scenario.prompt(profile);
  if (heroReadiness) heroReadiness.textContent = readiness;
  if (heroReviewTitle) {
    heroReviewTitle.textContent = `${profile.bank} ${profile.group} ${stageProfiles[profile.stage].label.toLowerCase()}`;
  }

  renderList(heroReviewPoints, scenario.evidence(profile));
  renderTranscript(heroTranscript, scenario.transcript(profile));
}

function updateDemo(profile, scenario) {
  if (demoTrackLabel) demoTrackLabel.textContent = scenario.label;
  if (demoTitle) demoTitle.textContent = scenario.prompt(profile);
  if (demoSummary) demoSummary.textContent = scenario.summary(profile);
  if (demoReadiness) demoReadiness.textContent = averageScore(scenario.scores);

  renderTranscript(transcriptList, scenario.transcript(profile));
  renderMetrics(metricStack, scenario.scores);
  renderList(evidenceList, scenario.evidence(profile));
  renderList(nextRepsList, scenario.nextReps(profile));
}

function renderActiveTrack() {
  const profile = getProfile();
  const scenario = demoScenarios[activeTrack];

  updateBrief(profile);
  updateHero(profile, scenario);
  updateDemo(profile, scenario);
}

function updateResumeNote() {
  if (!resumeFileNote || !resumeFileInput) return;

  const fileName = resumeFileInput.files?.[0]?.name;
  resumeFileNote.textContent = fileName
    ? `${fileName} selected for the prep brief.`
    : "No file selected in this prototype.";
}

trackTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeTrack = tab.dataset.track || "story";

    trackTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    renderActiveTrack();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");

    libraryCards.forEach((card) => {
      const matches =
        selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

[programInput, backgroundInput, bankSelect, groupSelect, stageSelect, dateInput, confidenceRange].forEach(
  (element) => {
    element?.addEventListener("input", renderActiveTrack);
    element?.addEventListener("change", renderActiveTrack);
  }
);

resumeFileInput?.addEventListener("change", () => {
  updateResumeNote();
  renderActiveTrack();
});

updateResumeNote();
renderActiveTrack();
