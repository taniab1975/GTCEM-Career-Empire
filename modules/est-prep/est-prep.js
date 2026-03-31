const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "est-prep";
const BANK_PATH = "../../data/modules/est-prep-bank.json";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
};

const CONTENT_TOPIC_GROUPS = [
  {
    id: "initiative",
    title: "Enterprise Behaviours - Initiative",
    topics: ["Initiative", "Being proactive", "Improving work practices", "Helping fellow workers", "Seeking more responsibilities"],
    writePrompt: "Write one or two EST-ready sentences explaining how initiative can be shown in a workplace situation.",
    sampleResponse: "Initiative can be shown when a worker acts proactively, suggests improvements, helps colleagues, or volunteers for extra responsibilities before being told. This matters because it improves productivity and shows the worker can contribute positively to the workplace."
  },
  {
    id: "time-management",
    title: "Time Management Skills - Plan and Prioritise Tasks to Meet Specific Deadlines",
    topics: ["Time management", "Time-management tools", "Managing multiple tasks"],
    writePrompt: "Write one or two EST-ready sentences explaining how a student or worker can plan and prioritise tasks to meet deadlines.",
    sampleResponse: "Time management involves planning ahead, prioritising urgent tasks, and using tools such as calendars, lists, or reminders to stay organised. This helps a person meet deadlines because responsibilities are visible, manageable, and easier to adjust when circumstances change."
  },
  {
    id: "personal-finance",
    title: "Strategies to Manage Personal Finance, Including Budgeting and Seeking Assistance, and Unexpected Life Events Including Changes to Financial Circumstances",
    topics: ["Budgeting", "Tracking money in and out", "Seeking assistance", "Unexpected life events", "Responding to changed financial circumstances"],
    writePrompt: "Write one or two EST-ready sentences explaining how budgeting and seeking assistance support personal financial management.",
    sampleResponse: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and plan for unexpected events. Seeking assistance from trusted services or experts also supports financial management because it provides reliable advice and helps people make informed decisions."
  },
  {
    id: "job-application",
    title: "Purpose of a Cover Letter, STAR, and Techniques to Address Selection Criteria",
    topics: ["Cover letter purpose", "Selection criteria", "STAR method"],
    writePrompt: "Write one or two EST-ready sentences explaining how STAR helps an applicant address selection criteria effectively.",
    sampleResponse: "The STAR method helps applicants address selection criteria by structuring examples into Situation, Task, Action, and Result. This makes a response clearer because the employer can see exactly what the applicant did and what outcome was achieved."
  },
  {
    id: "communication",
    title: "Communication Skills",
    topics: ["Communication skills", "Non-verbal communication", "Active listening"],
    writePrompt: "Write one or two EST-ready sentences explaining how communication skills can be applied in a workplace or interview situation.",
    sampleResponse: "Communication skills can be applied by using clear verbal language, active listening, and appropriate non-verbal communication for the audience and purpose. This is important because it reduces misunderstandings, builds rapport, and helps tasks or interviews run more effectively."
  }
];

const CONTENT_TRAINING_BAYS = {
  initiative: {
    type: "sort",
    title: "Signal Sort",
    subtitle: "Sort the workplace moves into strong initiative or weak initiative.",
    leftLabel: "Shows initiative",
    rightLabel: "Needs more initiative",
    cards: [
      {
        id: "initiative-stock",
        text: "A worker notices stock is running low and restocks before customers complain.",
        correctBucket: "left",
        feedback: "This is proactive. The worker spots a problem early and acts without being told."
      },
      {
        id: "initiative-wait",
        text: "A worker sees a spill but leaves it until a supervisor gives exact instructions.",
        correctBucket: "right",
        feedback: "This is passive, not initiative. Waiting can create safety issues and delays."
      },
      {
        id: "initiative-improve",
        text: "A worker suggests a faster way to label items so the whole team saves time.",
        correctBucket: "left",
        feedback: "Improving work practices is a clear sign of initiative and problem-solving."
      },
      {
        id: "initiative-avoid",
        text: "A worker avoids new tasks because they might make a mistake.",
        correctBucket: "right",
        feedback: "Avoiding responsibility limits learning and does not show initiative."
      }
    ]
  },
  "time-management": {
    type: "sort",
    title: "Deadline Dash",
    subtitle: "Sort each move into strong planning or weak planning.",
    leftLabel: "Strong planning",
    rightLabel: "Weak planning",
    cards: [
      {
        id: "time-plan",
        text: "A student lists tasks, prioritises the urgent ones, and sets reminders.",
        correctBucket: "left",
        feedback: "This shows planning and prioritising, which is the heart of time management."
      },
      {
        id: "time-easiest",
        text: "A worker does the easiest task first and ignores the deadline order.",
        correctBucket: "right",
        feedback: "Doing easy tasks first can create bigger problems if urgent tasks are ignored."
      },
      {
        id: "time-adjust",
        text: "A worker checks progress and adjusts the plan when a delivery is delayed.",
        correctBucket: "left",
        feedback: "Good time management is flexible. Monitoring and adjusting helps meet deadlines."
      },
      {
        id: "time-memory",
        text: "A student keeps everything in their head and does not write deadlines down.",
        correctBucket: "right",
        feedback: "Relying only on memory makes it easier to miss tasks and deadlines."
      }
    ]
  },
  "personal-finance": {
    type: "rescue",
    title: "Scenario Rescue",
    subtitle: "Choose the strongest next move when life events affect money and planning.",
    scenarios: [
      {
        id: "finance-shifts",
        title: "Reduced shifts",
        prompt: "Your work hours are cut suddenly and your phone bill plus transport costs are due next week.",
        options: [
          "Review the budget, prioritise essentials, and cut non-essential spending straight away.",
          "Keep spending normally and hope the next roster fixes the problem.",
          "Ignore the bills until a family member notices."
        ],
        correct: "Review the budget, prioritise essentials, and cut non-essential spending straight away.",
        feedback: "Strong response. The first move is to review income and expenses so the situation is clear."
      },
      {
        id: "finance-support",
        title: "Unexpected expense",
        prompt: "Your car needs urgent repairs and you are unsure how to cover the cost without missing rent.",
        options: [
          "Seek reliable assistance early and look at payment options, support services, or temporary income.",
          "Use random advice from social media and avoid asking for help.",
          "Spend more on non-essential items to feel better before dealing with it."
        ],
        correct: "Seek reliable assistance early and look at payment options, support services, or temporary income.",
        feedback: "Strong response. Seeking assistance helps avoid bigger mistakes and opens up practical support."
      },
      {
        id: "finance-life-event",
        title: "Life event disruption",
        prompt: "A family change means you may need to move and adjust your work or study plans quickly.",
        options: [
          "Adapt goals, review finances, and change timelines or work arrangements to suit the new situation.",
          "Pretend nothing has changed because changing plans looks like failure.",
          "Stop planning completely because the future feels uncertain."
        ],
        correct: "Adapt goals, review finances, and change timelines or work arrangements to suit the new situation.",
        feedback: "Strong response. Unexpected life events often require revised timelines, goals, and financial choices."
      }
    ]
  },
  "job-application": {
    type: "rescue",
    title: "Application Forge",
    subtitle: "Choose the move that would make an application or interview response stronger.",
    scenarios: [
      {
        id: "job-cover-letter",
        title: "Cover letter purpose",
        prompt: "You are applying for a retail role. What makes the cover letter strongest?",
        options: [
          "Mention the specific job advertisement, explain why you are applying, and highlight your suitability briefly.",
          "Write a generic note that never names the role because it can be reused anywhere.",
          "Repeat the resume word for word without linking it to the employer."
        ],
        correct: "Mention the specific job advertisement, explain why you are applying, and highlight your suitability briefly.",
        feedback: "Strong response. A cover letter should target the specific role and make a positive first impression."
      },
      {
        id: "job-star",
        title: "Selection criteria",
        prompt: "You need to respond to teamwork selection criteria in an interview. What should you do?",
        options: [
          "Use STAR so the employer can see the situation, task, action, and result clearly.",
          "Give a vague answer because details might sound like bragging.",
          "Talk only about what the team did and leave out your own action."
        ],
        correct: "Use STAR so the employer can see the situation, task, action, and result clearly.",
        feedback: "Strong response. STAR helps structure evidence so the response is clear and relevant."
      },
      {
        id: "job-interview",
        title: "Interview communication",
        prompt: "The interviewer asks a question you did not fully understand. What is the best move?",
        options: [
          "Ask politely for clarification so you can answer the actual question well.",
          "Guess what they meant and answer quickly so you sound confident.",
          "Stay silent and hope they move to the next question."
        ],
        correct: "Ask politely for clarification so you can answer the actual question well.",
        feedback: "Strong response. Clarifying shows active listening and improves answer accuracy."
      }
    ]
  },
  communication: {
    type: "sort",
    title: "Communication Radar",
    subtitle: "Sort the behaviours into effective communication or weak communication.",
    leftLabel: "Effective communication",
    rightLabel: "Weak communication",
    cards: [
      {
        id: "comm-listen",
        text: "A worker listens fully, nods, and asks, 'Do you mean these arranged by size?'",
        correctBucket: "left",
        feedback: "This shows active listening because the worker checks understanding before acting."
      },
      {
        id: "comm-phone",
        text: "A team member checks their phone while a customer explains the issue.",
        correctBucket: "right",
        feedback: "This weakens communication because it suggests poor listening and low respect."
      },
      {
        id: "comm-tone",
        text: "An applicant uses calm tone, eye contact, and clear language in an interview.",
        correctBucket: "left",
        feedback: "This combines verbal and non-verbal communication to build rapport and clarity."
      },
      {
        id: "comm-slang",
        text: "A worker uses slang and rushed explanations with a confused customer.",
        correctBucket: "right",
        feedback: "Messages should suit the audience. Unclear language creates misunderstandings."
      }
    ]
  }
};

const STAGES = [
  { id: "content", title: "EST Content Check", state: "Knowledge reactor", summary: "Check the actual revision content before answering under pressure.", marks: 4, readiness: 18, credits: 1600, taxRate: 0.1 },
  { id: "glossary", title: "Glossary Check", state: "Precision language", summary: "Use exact glossary terms and definitions, not vague wording.", marks: 4, readiness: 20, credits: 1600, taxRate: 0.1 },
  { id: "decoder", title: "VTCS Decoder", state: "Question decode", summary: "Unpack verb, topic, context, and structure before you write.", marks: 4, readiness: 24, credits: 2200, taxRate: 0.1 },
  { id: "boss", title: "Boss Round", state: "EST simulation", summary: "Build and justify a mark-worthy EST response with richer feedback.", marks: 8, readiness: 34, credits: 3400, taxRate: 0.1 }
];

const state = {
  student: null,
  bank: null,
  stageDeck: null,
  selectedStageId: null,
  stageStartedAt: 0,
  completed: {},
  evidenceLog: [],
  debriefLog: [],
  recentReward: null,
  marksBanked: 0,
  readiness: 0,
  confidence: 40,
  streak: 1,
  salaryBoost: 0,
  taxContribution: 0,
  answers: {},
  lastBossReview: null,
  contentGroupIndex: 0,
  contentGroupStartedAt: 0,
  contentGroupDurations: {}
};

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function getAuthState() {
  return readJsonStorage(AUTH_DEMO_STATE_KEY, {});
}

function getPlayerSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function writePlayerSession(patch) {
  const next = { ...getPlayerSession(), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") {
    return null;
  }
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function buildContentGroups(bank) {
  const rounds = bank.contentRounds || [];
  return CONTENT_TOPIC_GROUPS.map(group => ({
    ...group,
    rounds: pickRandom(rounds.filter(round => group.topics.includes(round.topic)), 2)
  })).filter(group => group.rounds.length);
}

function getLoggedInStudent() {
  const auth = getAuthState();
  const session = getPlayerSession();
  const login = auth.studentLogin || {};
  if (!login.id && !login.username && !session.studentId && !session.playerName) return null;
  return {
    id: login.id || session.studentId || null,
    username: login.username || session.username || "",
    displayName: login.displayName || session.playerName || login.username || "Student",
    classId: login.classId || session.classId || null,
    classCode: login.classCode || session.classCode || "",
    className: login.className || session.className || "",
    schoolName: login.schoolName || session.schoolName || ""
  };
}

async function loadBank() {
  const response = await fetch(BANK_PATH);
  if (!response.ok) throw new Error("Could not load the EST Prep content bank.");
  return response.json();
}

function buildStageDeck(bank) {
  const glossaryTerms = bank.glossaryTerms || [];
  const contentGroups = buildContentGroups(bank);
  const glossaryRounds = pickRandom(glossaryTerms, Math.min(4, glossaryTerms.length)).map(term => {
    const distractors = pickRandom(glossaryTerms.filter(item => item.term !== term.term), 3);
    return {
      term,
      scenarioOptions: shuffle([term.term, ...distractors.map(item => item.term)]),
      definitionOptions: shuffle([term.definition, ...distractors.map(item => item.definition)])
    };
  });

  return {
    contentGroups,
    glossaryRounds,
    decoderRound: pickRandom(bank.decoderRounds || [], 1)[0] || null,
    bossRound: pickRandom(bank.bossRounds || [], 1)[0] || null,
    communityOptions: bank.communityOptions || []
  };
}

function renderHero() {
  const badgeRow = document.getElementById("hero-badges");
  if (!badgeRow) return;
  const student = state.student;
  badgeRow.innerHTML = [
    `<span class="badge">Student: ${escapeHtml(student?.displayName || "Guest")}</span>`,
    `<span class="badge">School: ${escapeHtml(student?.schoolName || "Not linked")}</span>`,
    `<span class="badge">Class: ${escapeHtml(student?.classCode || "No class code")}</span>`,
    `<span class="badge">Salary Boost: ${formatCurrency(state.salaryBoost)}</span>`
  ].join("");
}

function renderRewardPulse() {
  const chipRow = document.getElementById("reward-chips");
  if (chipRow) {
    chipRow.innerHTML = [
      `Marks: ${state.marksBanked}`,
      `Readiness: ${state.readiness}%`,
      `Salary: ${formatCurrency(state.salaryBoost)}`,
      `Community Tax: ${formatCurrency(state.taxContribution)}`,
      `Streak: x${state.streak}`
    ].map(chip => `<span class="reward-chip">${escapeHtml(chip)}</span>`).join("");
  }

  const pulse = document.getElementById("stage-pulse");
  if (!pulse) return;
  if (!state.recentReward) {
    pulse.innerHTML = `
      <div class="pulse-card">
        <strong>Mission pulse</strong>
        <p>Your choices should trigger visible marks, readiness, salary, and community gains here.</p>
      </div>
    `;
    return;
  }

  pulse.innerHTML = `
    <div class="pulse-card ${state.recentReward.type}">
      <strong>${escapeHtml(state.recentReward.title)}</strong>
      <p>${escapeHtml(state.recentReward.detail)}</p>
    </div>
  `;
}

function renderMetrics() {
  setText("metric-progress", `${Object.keys(state.completed).length}/4`);
  setText("metric-marks", String(state.marksBanked));
  setText("metric-readiness", `${state.readiness}%`);
  setText("metric-streak", `x${state.streak}`);
}

function renderMap() {
  const container = document.getElementById("challenge-map");
  if (!container) return;
  container.innerHTML = STAGES.map(stage => `
    <article class="challenge-tile ${state.completed[stage.id] ? "completed" : ""} ${state.selectedStageId === stage.id ? "active" : ""}">
      <div class="kicker">${escapeHtml(stage.state)}</div>
      <h3>${escapeHtml(stage.title)}</h3>
      <p>${escapeHtml(stage.summary)}</p>
      <div class="challenge-meta">
        <span>${stage.marks} marks</span>
        <span>${stage.readiness}% readiness</span>
      </div>
      <button type="button" onclick="window.ESTPrep.openStage('${stage.id}')">${state.completed[stage.id] ? "Review stage" : "Open stage"}</button>
    </article>
  `).join("");
}

function renderResources() {
  const container = document.getElementById("resource-board");
  if (!container) return;
  const bossPrompt = state.stageDeck?.bossRound?.question || "Boss round loading...";
  container.innerHTML = [
    { title: "Exam Readiness", detail: `${state.readiness}% and rising as you decode and respond accurately.` },
    { title: "Confidence", detail: `${state.confidence}% - clean decoding and strong answers keep your streak alive.` },
    { title: "Salary Reward", detail: `${formatCurrency(state.salaryBoost)} added to your wider Career Empire profile.` },
    { title: "Community Tax", detail: `${formatCurrency(state.taxContribution)} heading into the class/community economy.` },
    { title: "Current Boss Focus", detail: bossPrompt }
  ].map(item => `<div class="resource-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>`).join("");
}

function renderDebrief() {
  const container = document.getElementById("debrief-log");
  if (!container) return;
  if (!state.debriefLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No debrief yet</strong><p>Clear your first stage and the EST lab will start banking rewards and feedback.</p></div>';
    return;
  }
  container.innerHTML = state.debriefLog.slice(-5).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderEvidence() {
  const container = document.getElementById("evidence-log");
  if (!container) return;
  if (!state.evidenceLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No evidence saved yet</strong><p>Written responses and decoded question artifacts will appear here.</p></div>';
    return;
  }
  container.innerHTML = state.evidenceLog.slice(-6).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderStageRoot(html) {
  const root = document.getElementById("stage-root");
  if (root) root.innerHTML = html;
}

function renderOptionGroup(groupKey, title, options) {
  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(title)}</h2>
        <p>Choose one</p>
      </div>
      <div class="mcq-grid">
        ${options.map(option => `
          <button
            type="button"
            class="choice-button ${state.answers[groupKey] === option ? "selected live-selected" : ""}"
            data-group="${escapeHtml(groupKey)}"
            data-value="${escapeHtml(option)}"
            onclick="window.ESTPrep.setChoiceEncoded('${groupKey}', '${encodeURIComponent(option)}')"
          >
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function getContentTrainingConfig(groupId) {
  return CONTENT_TRAINING_BAYS[groupId] || null;
}

function getTrainingScore(config) {
  if (!config) return { correct: 0, total: 0, percent: 0 };
  if (config.type === "sort") {
    const total = config.cards.length;
    const correct = config.cards.filter(card => state.answers[`training-${config.type}-${card.id}`] === card.correctBucket).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "rescue") {
    const total = config.scenarios.length;
    const correct = config.scenarios.filter(scenario => state.answers[`training-${config.type}-${scenario.id}`] === scenario.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  return { correct: 0, total: 0, percent: 0 };
}

function renderTrainingBay(group) {
  const config = getContentTrainingConfig(group.id);
  if (!config) return "";
  const score = getTrainingScore(config);
  if (config.type === "sort") {
    return `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>${escapeHtml(config.title)}</h2>
          <p>${score.correct}/${score.total} sorted</p>
        </div>
        <p class="small-copy">${escapeHtml(config.subtitle)}</p>
        <div class="training-lanes">
          <span class="training-lane-tag good">${escapeHtml(config.leftLabel)}</span>
          <span class="training-lane-tag">${escapeHtml(config.rightLabel)}</span>
        </div>
        <div class="training-grid">
          ${config.cards.map(card => {
            const answer = state.answers[`training-sort-${card.id}`];
            const isCorrect = answer && answer === card.correctBucket;
            return `
              <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
                <strong>${escapeHtml(card.text)}</strong>
                <div class="training-actions">
                  <button type="button" class="choice-button ${answer === "left" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setTrainingChoice('training-sort-${card.id}', 'left')">${escapeHtml(config.leftLabel)}</button>
                  <button type="button" class="choice-button ${answer === "right" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setTrainingChoice('training-sort-${card.id}', 'right')">${escapeHtml(config.rightLabel)}</button>
                </div>
                <p class="training-feedback">${answer ? `${isCorrect ? "Strong call." : "Try again mentally."} ${escapeHtml(card.feedback)}` : "Pick the lane that best matches the behaviour."}</p>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  if (config.type === "rescue") {
    return `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>${escapeHtml(config.title)}</h2>
          <p>${score.correct}/${score.total} rescue calls</p>
        </div>
        <p class="small-copy">${escapeHtml(config.subtitle)}</p>
        <div class="training-grid">
          ${config.scenarios.map(scenario => {
            const answer = state.answers[`training-rescue-${scenario.id}`];
            const isCorrect = answer && answer === scenario.correct;
            return `
              <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
                <div class="kicker">${escapeHtml(scenario.title)}</div>
                <p>${escapeHtml(scenario.prompt)}</p>
                <div class="training-stack">
                  ${scenario.options.map(option => `
                    <button
                      type="button"
                      class="choice-button ${answer === option ? "selected live-selected" : ""}"
                      onclick="window.ESTPrep.setTrainingChoiceEncoded('training-rescue-${scenario.id}', '${encodeURIComponent(option)}')"
                    >
                      <strong>${escapeHtml(option)}</strong>
                    </button>
                  `).join("")}
                </div>
                <p class="training-feedback">${answer ? `${isCorrect ? "Best move." : "Risky move."} ${escapeHtml(scenario.feedback)}` : "Choose the strongest next action."}</p>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  return "";
}

function renderContentStage() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  setText("stage-title", "EST Content Check");
  setText("stage-subtitle", "Train the content first, then prove it under pressure.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Revision Arena</div>
      <h3>Move through the five EST content strands and bank evidence for each one.</h3>
      <p>Each strand now runs as a training loop: briefing, practice bay, knowledge check, then a quick EST response for teacher-visible evidence.</p>
    </div>
    <div class="choice-grid" style="margin-bottom: 18px;">
      ${groups.map((group, index) => `
        <button
          type="button"
          class="choice-button ${index === state.contentGroupIndex ? "selected live-selected" : ""}"
          style="min-height:auto;padding:10px 14px;"
          onclick="window.ESTPrep.jumpToContentGroup(${index})"
        >
          <strong>${index + 1}. ${escapeHtml(group.title)}</strong>
        </button>
      `).join("")}
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(currentGroup.title)}</h2>
        <p>EST content strand ${state.contentGroupIndex + 1} of ${groups.length}</p>
      </div>
      <p class="small-copy">${escapeHtml(currentGroup.writePrompt)}</p>
      ${trainingConfig ? `<div class="badge-row" style="margin-top:14px;"><span class="badge">Practice Bay: ${escapeHtml(trainingConfig.title)}</span><span class="badge">Training score: ${trainingScore.percent}%</span></div>` : ""}
    </div>
    ${renderTrainingBay(currentGroup)}
    ${currentGroup.rounds.map((round, index) => `
      <div class="panel">
        <div class="section-title">
          <h2>${escapeHtml(round.topic)}</h2>
          <p>Knowledge check ${index + 1}</p>
        </div>
        <p class="small-copy">${escapeHtml(round.question)}</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.options.map(option => `
            <button
              type="button"
              class="choice-button ${state.answers[`content-${currentGroup.id}-${index}`] === option ? "selected live-selected" : ""}"
              data-group="content-${currentGroup.id}-${index}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('content-${currentGroup.id}-${index}', '${encodeURIComponent(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="written-stage">
      <strong>Quick EST response</strong>
      <p class="small-copy">Write a short response so teachers can see how well you can explain this content area, not just select the right option. Students can compare this with a model answer after submission.</p>
      <textarea id="content-note" placeholder="Write one or two EST-ready sentences for this content strand...">${escapeHtml(state.answers[`content-note-${currentGroup.id}`] || "")}</textarea>
    </div>
    <div class="written-stage">
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${state.contentGroupIndex > 0 ? '<button class="submit-button" type="button" onclick="window.ESTPrep.prevContentGroup()">Previous Topic</button>' : ""}
        ${state.contentGroupIndex < groups.length - 1
          ? '<button class="submit-button" type="button" onclick="window.ESTPrep.nextContentGroup()">Next Topic</button>'
          : '<button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Content Results</button>'}
      </div>
    </div>
  `);
}

function renderGlossaryStage() {
  const rounds = state.stageDeck?.glossaryRounds || [];
  setText("stage-title", "Glossary Check");
  setText("stage-subtitle", "Random glossary terms rotate in each run so students have to know the language, not the order.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Term Vault</div>
      <h3>Match the right glossary term to the context, then lock in the correct definition.</h3>
      <p>This stage pulls random terms from the EST glossary bank each time you play.</p>
    </div>
    ${rounds.map((round, index) => `
      <div class="panel">
        <div class="section-title">
          <h2>${escapeHtml(round.term.term)}</h2>
          <p>Glossary round ${index + 1}</p>
        </div>
        <p class="small-copy"><strong>Context:</strong> ${escapeHtml(round.term.scenario)}</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.scenarioOptions.map(option => `
            <button
              type="button"
              class="choice-button ${state.answers[`glossary-term-${index}`] === option ? "selected live-selected" : ""}"
              data-group="glossary-term-${index}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('glossary-term-${index}', '${encodeURIComponent(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
        <p class="small-copy" style="margin-top: 16px;"><strong>Definition:</strong> Which definition best matches <em>${escapeHtml(round.term.term)}</em>?</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.definitionOptions.map(option => `
            <button
              type="button"
              class="choice-button ${state.answers[`glossary-definition-${index}`] === option ? "selected live-selected" : ""}"
              data-group="glossary-definition-${index}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('glossary-definition-${index}', '${encodeURIComponent(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="written-stage">
      <strong>Precision beats waffle</strong>
      <p class="small-copy">The EST rewards exact terminology. This round trains the language that makes short answers sound deliberate and exam-ready.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()">Bank Glossary Results</button>
    </div>
  `);
}

function renderDecoderStage() {
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  setText("stage-title", "VTCS Decoder");
  setText("stage-subtitle", "Use verb, topic, context, and structure before you start writing.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">VTCS Core</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.feedback)}</p>
    </div>
    <div class="prompt-grid">
      <div class="prompt-card"><strong>Verb</strong><p>What does the question want you to do?</p></div>
      <div class="prompt-card"><strong>Topic</strong><p>What concept is being assessed?</p></div>
      <div class="prompt-card"><strong>Context</strong><p>What narrows the response?</p></div>
      <div class="prompt-card"><strong>Structure</strong><p>How should you build the answer?</p></div>
    </div>
    ${renderOptionGroup("decoder-verb", "Choose the command verb", round.verbOptions)}
    ${renderOptionGroup("decoder-topic", "Choose the topic", round.topicOptions)}
    ${renderOptionGroup("decoder-context", "Choose the context term", round.contextOptions)}
    ${renderOptionGroup("decoder-structure", "Choose the answer structure", round.structureOptions)}
    <div class="written-stage">
      <strong>Why this matters</strong>
      <p class="small-copy">Students lose marks when they misread what the question is actually asking. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">Bank Decoder Results</button>
    </div>
  `);
}

function renderBossStage() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Direct 10% of this round's income to this class/community focus.</small>
    </button>
  `).join("");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Boss Round</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.help)}</p>
    </div>
    <div class="prompt-grid">
      ${round.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>${escapeHtml(round.scaffold.split("\n").join(" "))}</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", round.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", round.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", round.glossaryOptions)}
    <div class="written-stage">
      <strong>Response scaffold</strong>
      <p class="small-copy">${escapeHtml(round.scaffold)}</p>
      <textarea id="boss-response" placeholder="Write your EST-style answer here...">${escapeHtml(state.answers.bossText || "")}</textarea>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Community Contribution</h2>
        <p class="status-watch">Class impact</p>
      </div>
      <p class="small-copy">Ten percent of this round’s reward feeds the wider class/community economy. Choose where this answer will direct its contribution.</p>
      <div class="choice-grid">${communityOptions}</div>
    </div>
    <div class="written-stage">
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Submit Boss Round</button>
    </div>
  `);
}

function persistCurrentContentNote() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  const textarea = document.getElementById("content-note");
  if (!textarea) return;
  state.answers[`content-note-${currentGroup.id}`] = textarea.value.trim();
}

function bankCurrentContentDuration() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup || !state.contentGroupStartedAt) return;
  const elapsed = Math.max(1, Math.round((Date.now() - state.contentGroupStartedAt) / 1000));
  state.contentGroupDurations[currentGroup.id] = (state.contentGroupDurations[currentGroup.id] || 0) + elapsed;
  state.contentGroupStartedAt = Date.now();
}

function jumpToContentGroup(index) {
  const groups = state.stageDeck?.contentGroups || [];
  if (!groups.length) return;
  const nextIndex = Math.max(0, Math.min(index, groups.length - 1));
  persistCurrentContentNote();
  bankCurrentContentDuration();
  state.contentGroupIndex = nextIndex;
  renderContentStage();
}

function moveContentGroup(step) {
  jumpToContentGroup(state.contentGroupIndex + step);
}

function openStage(stageId) {
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  state.stageStartedAt = Date.now();
  if (stageId === "content") {
    state.contentGroupIndex = 0;
    state.contentGroupStartedAt = Date.now();
    state.contentGroupDurations = {};
  }
  renderMap();
  if (stageId === "content") renderContentStage();
  if (stageId === "glossary") renderGlossaryStage();
  if (stageId === "decoder") renderDecoderStage();
  if (stageId === "boss") renderBossStage();
}

function getCurrentStageDurationSeconds() {
  if (!state.stageStartedAt) return null;
  return Math.max(1, Math.round((Date.now() - state.stageStartedAt) / 1000));
}

function setChoice(groupKey, option) {
  state.answers[groupKey] = option;
  updateSelectionButtons(groupKey, option);
  setSelectionPulse(groupKey, option);
}

function setChoiceEncoded(groupKey, encodedOption) {
  setChoice(groupKey, decodeURIComponent(encodedOption));
}

function setTrainingChoice(groupKey, option) {
  state.answers[groupKey] = option;
  renderContentStage();
  state.recentReward = {
    type: "positive",
    title: "Practice move logged",
    detail: "Training Bay choices sharpen your understanding before the marked EST response."
  };
  renderRewardPulse();
}

function setTrainingChoiceEncoded(groupKey, encodedOption) {
  setTrainingChoice(groupKey, decodeURIComponent(encodedOption));
}

function setBossVote(optionId) {
  state.answers.bossVote = optionId;
  updateSelectionButtons("boss-vote", optionId);
  const option = (state.stageDeck?.communityOptions || []).find(item => item.id === optionId);
  setSelectionPulse("boss-vote", option?.label || optionId);
}

function updateSelectionButtons(groupKey, option) {
  const selector = `[data-group="${CSS.escape(groupKey)}"]`;
  document.querySelectorAll(selector).forEach(button => {
    const selected = button.dataset.value === String(option);
    button.classList.toggle("selected", selected);
    button.classList.toggle("live-selected", selected);
  });
}

function setSelectionPulse(groupKey, option) {
  state.recentReward = {
    type: "positive",
    title: "Choice locked in",
    detail: `${option} is banked. Finish the stage to convert this into marks, readiness, salary, and class impact.`
  };
  renderRewardPulse();
}

function awardStage(stageId, outcome) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const earnedMarks = Math.max(0, Math.round(stage.marks * outcome.scoreRatio));
  const credits = Math.round(stage.credits * outcome.scoreRatio * state.streak);
  const tax = Math.round(credits * stage.taxRate);
  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + Math.round(stage.readiness * outcome.scoreRatio));
  state.confidence = Math.max(0, Math.min(100, state.confidence + (outcome.scoreRatio >= 0.75 ? 8 : outcome.scoreRatio >= 0.5 ? 3 : -2)));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.streak = outcome.scoreRatio >= 0.75 ? Math.min(5, state.streak + 1) : 1;
  state.recentReward = {
    type: outcome.scoreRatio >= 0.75 ? "positive" : outcome.scoreRatio >= 0.5 ? "warning" : "bad",
    title: `${stage.title} reward pulse`,
    detail: `+${earnedMarks} marks • +${Math.round(stage.readiness * outcome.scoreRatio)}% readiness • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} cleared`,
    detail: `${earnedMarks}/${stage.marks} marks banked • ${formatCurrency(credits)} salary reward • ${formatCurrency(tax)} class contribution`
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderMap();
  renderDebrief();
}

function addEvidence(title, detail) {
  state.evidenceLog.push({ title, detail });
  renderEvidence();
}

async function saveProgress(checkpoint, evidenceType = "artifact", evidenceText = "", autoScore = null, meta = {}) {
  const student = state.student;
  const session = getPlayerSession();
  const nextSalary = Number(session.annualSalary || 25000) + state.salaryBoost;
  const nextNetWorth = Number(session.cumulativeNetWorth || 0) + state.salaryBoost;
  const nextWorkLife = Math.max(45, Math.min(100, Number(session.workLifeBalance || 60) + (state.streak > 1 ? 3 : 0)));
  const nextSecurity = Math.max(45, Math.min(100, Number(session.jobSecurity || 75) + Math.round(state.readiness / 20)));

  writePlayerSession({
    studentId: student?.id || session.studentId || null,
    username: student?.username || session.username || "",
    playerName: student?.displayName || session.playerName || "Student",
    schoolName: student?.schoolName || session.schoolName || "",
    classId: student?.classId || session.classId || null,
    classCode: student?.classCode || session.classCode || "",
    className: student?.className || session.className || "",
    annualSalary: nextSalary,
    cumulativeNetWorth: nextNetWorth,
    jobSecurity: nextSecurity,
    workLifeBalance: nextWorkLife,
    checkpoint
  });

  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const completionPercent = Math.round((Object.keys(state.completed).length / STAGES.length) * 100);
  const masteryPercent = Math.min(100, Math.round((state.marksBanked / STAGES.reduce((sum, stage) => sum + stage.marks, 0)) * 100));

  const progressPayload = {
    student_id: student.id,
    module_id: MODULE_ID,
    completion_percent: completionPercent,
    mastery_percent: masteryPercent,
    attempts: Object.keys(state.completed).length,
    unlocked: true,
    completed: Object.keys(state.completed).length === STAGES.length,
    last_played_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let progressResult = await supabase.from("student_module_progress").upsert({
    ...progressPayload,
    class_id: student.classId
  }, { onConflict: "student_id,module_id" });

  if (progressResult.error) {
    progressResult = await supabase.from("student_module_progress").upsert(progressPayload, { onConflict: "student_id,module_id" });
  }

  if (evidenceText) {
    const evidencePayload = JSON.stringify({
      kind: "career-empire-evidence",
      module_id: MODULE_ID,
      checkpoint,
      evidence_type: evidenceType,
      task_name: meta.taskName || state.selectedStageId || checkpoint,
      duration_seconds: meta.durationSeconds ?? null,
      score_percent: autoScore,
      prompt_text: meta.promptText || "",
      response_text: evidenceText,
      ...meta.extraPayload
    });
    await supabase.from("assessment_evidence").insert({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      evidence_type: evidenceType,
      prompt: checkpoint,
      response_text: evidencePayload,
      auto_score: autoScore,
      created_at: new Date().toISOString()
    });
  }

  if (Array.isArray(meta.additionalEvidenceRows) && meta.additionalEvidenceRows.length) {
    const additionalRows = meta.additionalEvidenceRows.map(item => ({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      evidence_type: item.evidenceType || evidenceType,
      prompt: item.prompt || checkpoint,
      response_text: JSON.stringify({
        kind: "career-empire-evidence",
        module_id: MODULE_ID,
        checkpoint: item.checkpoint || checkpoint,
        evidence_type: item.evidenceType || evidenceType,
        task_name: item.taskName || meta.taskName || state.selectedStageId || checkpoint,
        duration_seconds: item.durationSeconds ?? null,
        score_percent: typeof item.autoScore === "number" ? item.autoScore : autoScore,
        prompt_text: item.promptText || "",
        response_text: item.responseText || "",
        ...(item.extraPayload || {})
      }),
      auto_score: typeof item.autoScore === "number" ? item.autoScore : autoScore,
      created_at: new Date().toISOString()
    }));
    await supabase.from("assessment_evidence").insert(additionalRows);
  }

  await supabase.from("player_profiles").upsert({
    student_id: student.id,
    career_title: session.careerTitle || "Exam Strategist",
    annual_salary: nextSalary,
    cumulative_net_worth: nextNetWorth,
    career_level: Number(session.careerLevel || 1),
    job_security: nextSecurity,
    work_life_balance: nextWorkLife,
    years_played: Number(session.yearsPlayed || 0),
    tech_mastery: Number(session.techMastery || 0),
    climate_mastery: Number(session.climateMastery || 0),
    demo_mastery: Number(session.demoMastery || 0),
    economic_mastery: Number(session.economicMastery || 0),
    updated_at: new Date().toISOString()
  }, { onConflict: "student_id" });

  if (state.answers.bossVote) {
    await supabase.from("community_votes").insert({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      vote_key: state.answers.bossVote,
      created_at: new Date().toISOString()
    });
  }
}

function showFeedbackBox(type, lines, extraHtml = "") {
  renderStageRoot(`
    <div class="feedback-box ${type}">
      ${lines.map(line => `<p>${line}</p>`).join("")}
      ${extraHtml}
      <p><button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button></p>
    </div>
  `);
}

function bossCriterionReview(round, response) {
  const normalized = String(response || "").trim();
  const lower = normalized.toLowerCase();
  const wordCount = normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
  const checks = [
    { id: "command", label: "Command word decoded", passed: state.answers["boss-command"] === round.correctCommand, detail: `Expected ${round.correctCommand}.` },
    { id: "content", label: "Best content point chosen", passed: state.answers["boss-content"] === round.correctContent, detail: "Content option aligns to the revision topic." },
    { id: "glossary", label: "Correct glossary term selected", passed: state.answers["boss-glossary"] === round.correctGlossary, detail: `Expected ${round.correctGlossary}.` },
    { id: "point", label: "Clear answer point", passed: round.requiredKeywords.point.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Your response should directly answer the question." },
    { id: "because", label: "Cause or explanation included", passed: round.requiredKeywords.because.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Use because/how reasoning, not a bare statement." },
    { id: "result", label: "Consequence or outcome included", passed: round.requiredKeywords.result.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Show the effect, outcome, or implication." },
    { id: "glossary-language", label: "Glossary language used in writing", passed: round.requiredKeywords.glossary.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Bring the glossary term into the actual response." },
    { id: "control", label: "Enough detail for marks", passed: wordCount >= 24, detail: "Very short answers usually miss the explanation needed for marks." }
  ];

  const passedCount = checks.filter(check => check.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);
  const strengths = checks.filter(check => check.passed).slice(0, 4).map(check => check.label);
  const nextSteps = checks.filter(check => !check.passed).slice(0, 4).map(check => check.detail);
  let band = "Needs work";
  if (scorePercent >= 85) band = "Strong";
  else if (scorePercent >= 60) band = "Developing";

  return { checks, scorePercent, band, strengths, nextSteps, wordCount };
}

function renderBossSamples(round) {
  if (!round?.sampleResponses?.length) return "";
  return `
    <div class="sample-review">
      <h3>Student sample comparison</h3>
      <p class="small-copy">Compare your answer with different quality samples. Look for what each sample includes or leaves out.</p>
      <div class="sample-grid">
        ${round.sampleResponses.map(sample => `
          <article class="sample-card ${sample.band.toLowerCase().replace(/\s+/g, "-")}">
            <div class="sample-meta">
              <strong>${escapeHtml(sample.label)}</strong>
              <span>${escapeHtml(sample.band)}</span>
            </div>
            <p>${escapeHtml(sample.response)}</p>
            <p class="sample-commentary">${escapeHtml(sample.commentary)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

async function submitDecoder() {
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const correctCount = [
    state.answers["decoder-verb"] === round.correctVerb,
    state.answers["decoder-topic"] === round.correctTopic,
    state.answers["decoder-context"] === round.correctContext,
    state.answers["decoder-structure"] === round.correctStructure
  ].filter(Boolean).length;
  const scoreRatio = correctCount / 4;
  awardStage("decoder", { scoreRatio });
  addEvidence("Decoded EST question", `${round.question} • Verb: ${state.answers["decoder-verb"] || "not chosen"} • Topic: ${state.answers["decoder-topic"] || "not chosen"} • Context: ${state.answers["decoder-context"] || "not chosen"} • Structure: ${state.answers["decoder-structure"] || "not chosen"}`);
  await saveProgress("decoder-drill", "decoder-breakdown", `Question: ${round.question}\nVerb: ${state.answers["decoder-verb"] || "not chosen"}\nTopic: ${state.answers["decoder-topic"] || "not chosen"}\nContext: ${state.answers["decoder-context"] || "not chosen"}\nStructure: ${state.answers["decoder-structure"] || "not chosen"}`, Math.round(scoreRatio * 100), {
    taskName: "VTCS Decoder",
    durationSeconds,
    promptText: round.question
  });
  showFeedbackBox(scoreRatio >= 0.75 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Decoder results:</strong> ${correctCount}/4 parts correct.`,
    `Best reading: <strong>${round.correctVerb}</strong> the issue of <strong>${round.correctTopic}</strong> in the context of <strong>${round.correctContext}</strong> using <strong>${round.correctStructure}</strong>.`,
    "You banked marks and readiness by reading the question properly before writing."
  ]);
}

async function submitContent() {
  const groups = state.stageDeck?.contentGroups || [];
  persistCurrentContentNote();
  bankCurrentContentDuration();
  const durationSeconds = getCurrentStageDurationSeconds();
  const scoredRounds = groups.flatMap(group => group.rounds.map((round, index) => ({
    group,
    round,
    index,
    answerKey: `content-${group.id}-${index}`,
    selected: state.answers[`content-${group.id}-${index}`] || "",
    correct: state.answers[`content-${group.id}-${index}`] === round.correct
  })));
  const correctCount = scoredRounds.filter(item => item.correct).length;
  const scoreRatio = scoredRounds.length ? correctCount / scoredRounds.length : 0;
  const topicSummaries = groups.map(group => {
    const trainingConfig = getContentTrainingConfig(group.id);
    const results = group.rounds.map((round, index) => ({
      topic: round.topic,
      question: round.question,
      selected: state.answers[`content-${group.id}-${index}`] || "not chosen",
      correctAnswer: round.correct,
      correct: state.answers[`content-${group.id}-${index}`] === round.correct
    }));
    const topicCorrect = results.filter(item => item.correct).length;
    const topicScore = results.length ? Math.round((topicCorrect / results.length) * 100) : 0;
    return {
      group,
      results,
      topicCorrect,
      topicScore,
      training: trainingConfig
        ? {
            title: trainingConfig.title,
            type: trainingConfig.type,
            ...getTrainingScore(trainingConfig),
            interactions: trainingConfig.type === "sort"
              ? trainingConfig.cards.map(card => ({
                  item: card.text,
                  selected: state.answers[`training-sort-${card.id}`] || "",
                  correct_bucket: card.correctBucket
                }))
              : trainingConfig.scenarios.map(scenario => ({
                  item: scenario.prompt,
                  selected: state.answers[`training-rescue-${scenario.id}`] || "",
                  correct_answer: scenario.correct
                }))
          }
        : null,
      response: state.answers[`content-note-${group.id}`] || "",
      durationSeconds: state.contentGroupDurations[group.id] || 0
    };
  });
  awardStage("content", { scoreRatio });
  addEvidence("EST content check", topicSummaries.map(summary => `${summary.group.title}: ${summary.topicCorrect}/${summary.results.length} correct • ${summary.response || "No written response yet"}`).join(" || "));
  await saveProgress("revision-arena", "revision-check", `Content check accuracy: ${correctCount}/${scoredRounds.length}`, Math.round(scoreRatio * 100), {
    taskName: "EST Content Check",
    durationSeconds,
    promptText: "Choose the strongest content statement for each EST revision topic.",
    extraPayload: {
      topic_groups: topicSummaries.map(summary => ({
        topic_group_id: summary.group.id,
        topic_group: summary.group.title,
        duration_seconds: summary.durationSeconds,
        score_percent: summary.topicScore,
        training_score_percent: summary.training?.percent ?? null,
        written_response: summary.response,
        training: summary.training,
        items: summary.results.map(item => ({
          topic: item.topic,
          question: item.question,
          selected: item.selected,
          correct_answer: item.correctAnswer,
          correct: item.correct
        }))
      }))
    },
    additionalEvidenceRows: topicSummaries.map(summary => ({
      checkpoint: `revision-arena-${summary.group.id}`,
      evidenceType: "revision-topic-check",
      taskName: `EST Content Check - ${summary.group.title}`,
      durationSeconds: summary.durationSeconds,
      autoScore: summary.topicScore,
      prompt: summary.group.title,
      promptText: summary.group.writePrompt,
      responseText: summary.response || "No written response entered.",
        extraPayload: {
          topic_group_id: summary.group.id,
          topic_group: summary.group.title,
          sample_response: summary.group.sampleResponse,
          training_title: summary.training?.title || "",
          training_type: summary.training?.type || "",
          training_score_percent: summary.training?.percent ?? null,
          training_interactions: summary.training?.interactions || [],
          selected_options: summary.results.map(item => ({
            topic: item.topic,
            question: item.question,
            selected: item.selected,
          correct_answer: item.correctAnswer,
          correct: item.correct
        }))
      }
    }))
  });
  const sampleReviewHtml = `
    <div class="sample-review">
      <h3>Topic-by-topic recap</h3>
      <p class="small-copy">Use these model responses to compare your own EST-ready explanation for each content strand.</p>
      <div class="sample-grid">
        ${topicSummaries.map(summary => `
          <article class="sample-card ${summary.topicScore >= 80 ? "strong" : summary.topicScore >= 50 ? "developing" : "needs-work"}">
            <div class="sample-meta">
              <strong>${escapeHtml(summary.group.title)}</strong>
              <span>${summary.topicScore}% • ${formatDurationSeconds(summary.durationSeconds)}${summary.training ? ` • Practice ${summary.training.percent}%` : ""}</span>
            </div>
            <p><strong>Your response:</strong> ${escapeHtml(summary.response || "No written response entered.")}</p>
            <p><strong>Sample response:</strong> ${escapeHtml(summary.group.sampleResponse)}</p>
            <p class="sample-commentary">${escapeHtml(`${summary.topicCorrect}/${summary.results.length} knowledge checks correct in this content strand.${summary.training ? ` Practice Bay: ${summary.training.correct}/${summary.training.total}.` : ""}`)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Content check:</strong> ${correctCount}/${scoredRounds.length} strongest answer points selected.`,
    "This stage is now grouped into the five core EST revision strands, so students and teachers can see which content area was strongest and where the most time was spent.",
    "Those content points and written explanations are what later feed the decoder and boss-round responses."
  ], sampleReviewHtml);
}

async function submitGlossary() {
  const rounds = state.stageDeck?.glossaryRounds || [];
  const durationSeconds = getCurrentStageDurationSeconds();
  let correctCount = 0;
  rounds.forEach((round, index) => {
    if (state.answers[`glossary-term-${index}`] === round.term.term) correctCount += 1;
    if (state.answers[`glossary-definition-${index}`] === round.term.definition) correctCount += 1;
  });
  const total = rounds.length * 2;
  const scoreRatio = total ? correctCount / total : 0;
  awardStage("glossary", { scoreRatio });
  addEvidence("Glossary lock-in", rounds.map((round, index) => `${round.term.term}: scenario=${state.answers[`glossary-term-${index}`] || "not chosen"} • definition=${state.answers[`glossary-definition-${index}`] || "not chosen"}`).join(" || "));
  await saveProgress("glossary-lock-in", "glossary-check", `Glossary stage accuracy: ${correctCount}/${total}`, Math.round(scoreRatio * 100), {
    taskName: "Glossary Check",
    durationSeconds,
    promptText: "Match glossary terms to context and definition."
  });
  showFeedbackBox(scoreRatio >= 0.8 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Glossary score:</strong> ${correctCount}/${total} correct.`,
    "This round rotates glossary terms randomly, so students have to know the terminology itself rather than memorise one fixed list.",
    "Precise EST language makes short answers sound deliberate and exam-ready."
  ]);
}

async function submitBoss() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const textarea = document.getElementById("boss-response");
  const response = textarea ? textarea.value.trim() : "";
  state.answers.bossText = response;
  const review = bossCriterionReview(round, response);
  state.lastBossReview = review;
  const scoreRatio = review.scorePercent / 100;
  awardStage("boss", { scoreRatio });
  addEvidence("Boss round EST answer", `${round.question} • ${response || "No boss-round answer entered"}`);
  await saveProgress(
    "boss-round",
    "est-response",
    `Prompt: ${round.question}\nScore: ${review.scorePercent}%\nBand: ${review.band}\nResponse: ${response || "No response entered"}`,
    review.scorePercent,
    {
      taskName: "Boss Round",
      durationSeconds,
      promptText: round.question
    }
  );

  const strengths = review.strengths.length
    ? `<ul class="feedback-list">${review.strengths.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No strong elements were detected yet.</p>";
  const nextSteps = review.nextSteps.length
    ? `<ul class="feedback-list">${review.nextSteps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No immediate fixes needed. Push for even tighter wording.</p>";
  const rubric = `
    <div class="rubric-grid">
      ${review.checks.map(check => `
        <div class="rubric-chip ${check.passed ? "pass" : "fail"}">
          <strong>${escapeHtml(check.label)}</strong>
          <span>${check.passed ? "Met" : "Missing"}</span>
        </div>
      `).join("")}
    </div>
  `;

  showFeedbackBox(review.scorePercent >= 85 ? "good" : review.scorePercent >= 60 ? "warn" : "bad", [
    `<strong>Boss round complete:</strong> ${review.scorePercent}% • ${review.band} band.`,
    `Word count: ${review.wordCount}. This boss round checked decoding, glossary control, answer structure, explanation, and result language.`,
    `Marker model: ${escapeHtml(round.strongAnswer)}`
  ], `
    <div class="sample-review">
      <h3>Your strengths</h3>
      ${strengths}
      <h3>Next steps</h3>
      ${nextSteps}
      <h3>Rubric snapshot</h3>
      ${rubric}
    </div>
    ${renderBossSamples(round)}
  `);
}

function returnToTrack() {
  state.selectedStageId = null;
  state.lastBossReview = null;
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
}

async function init() {
  state.student = getLoggedInStudent();
  state.bank = await loadBank();
  state.stageDeck = buildStageDeck(state.bank);
  renderHero();
  renderMetrics();
  renderMap();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  renderEvidence();
}

window.ESTPrep = {
  openStage,
  nextContentGroup: () => moveContentGroup(1),
  prevContentGroup: () => moveContentGroup(-1),
  jumpToContentGroup,
  setTrainingChoice,
  setTrainingChoiceEncoded,
  setChoice,
  setChoiceEncoded,
  setBossVote,
  submitContent,
  submitDecoder,
  submitGlossary,
  submitBoss,
  returnToTrack
};

init().catch(error => {
  console.error(error);
  renderStageRoot(`
    <div class="feedback-box bad">
      <p><strong>EST Prep could not load.</strong></p>
      <p>${escapeHtml(error.message || "Unknown error")}</p>
    </div>
  `);
});
