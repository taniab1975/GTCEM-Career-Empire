const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "est-prep";
const BANK_PATH = "../../data/modules/est-prep-bank.json";
const CONTENT_STAGE_CONFIG_PATH = "../../data/modules/est-prep-rounds/content-stage.json";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
};

const DEFAULT_CONTENT_TOPIC_GROUPS = [
  {
    id: "initiative",
    title: "Enterprise Behaviours - Initiative",
    topics: ["Initiative", "Being proactive", "Improving work practices", "Helping fellow workers", "Seeking more responsibilities"],
    writePrompt: "Write one or two EST-ready sentences explaining how initiative can be shown in a workplace situation.",
    sampleResponse: "Initiative can be shown when a worker acts proactively, suggests improvements, helps colleagues, or volunteers for extra responsibilities before being told. This matters because it improves productivity and shows the worker can contribute positively to the workplace."
  },
  {
    id: "time-management",
    title: "Time Management Skills - Plan and prioritise tasks to meet deadlines",
    topics: ["Time management", "Time-management tools", "Managing multiple tasks"],
    writePrompt: "Write one or two EST-ready sentences explaining how a student or worker can plan and prioritise tasks to meet deadlines.",
    sampleResponse: "Time management involves planning ahead, prioritising urgent tasks, and using tools such as calendars, lists, or reminders to stay organised. This helps a person meet deadlines because responsibilities are visible, manageable, and easier to adjust when circumstances change."
  },
  {
    id: "personal-finance",
    title: "Managing personal finance, budgeting, seeking assistance, unexpected financial events inc changes to financial circumstance",
    topics: ["Budgeting", "Tracking money in and out", "Seeking assistance", "Unexpected life events", "Responding to changed financial circumstances"],
    writePrompt: "Write one or two EST-ready sentences explaining how budgeting and seeking assistance support personal financial management.",
    sampleResponse: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and plan for unexpected events. Seeking assistance from trusted services or experts also supports financial management because it provides reliable advice and helps people make informed decisions."
  },
  {
    id: "job-application",
    title: "Cover Letters, STAR and Addressing Selection Criteria",
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

const DEFAULT_CONTENT_TRAINING_BAYS = {
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
    type: "scenario",
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
    type: "builder",
    title: "Application Forge",
    subtitle: "Build stronger job application responses by choosing the move that earns more marks.",
    rounds: [
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
        feedback: "Strong response. A cover letter should target the specific role and make a positive first impression.",
        builderLabel: "Best opening move"
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
        feedback: "Strong response. STAR helps structure evidence so the response is clear and relevant.",
        builderLabel: "Best response structure"
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
        feedback: "Strong response. Clarifying shows active listening and improves answer accuracy.",
        builderLabel: "Best interview move"
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

const FULL_GLOSSARY_TERMS = [
  { term: "Arbitration", definition: "A formal dispute resolution process whereby a neutral third party considers the arguments and evidence presented by disputing parties to determine a solution that will be binding for all involved." },
  { term: "Career", definition: "The sequence and variety of roles which one undertakes throughout a lifetime. It encompasses all life roles, not just occupation, and includes all paid and unpaid work, learning, leisure activities, and community and family responsibilities." },
  { term: "Career adaptability", definition: "The ability to adjust to changing work conditions and or environments by recognising and pursuing opportunities for a positive transition to new work roles." },
  { term: "Career competencies", definition: "The knowledge, skills and attitudes that promote intentional career development, lifelong learning and work life balance that can be developed and strengthened over time." },
  { term: "Career development", definition: "The lifelong process of gaining the knowledge, skills, attributes and behaviours to manage life, learning, leisure and work in order to move towards a personally determined and evolving preferred future." },
  { term: "Cover letter", definition: "A document that accompanies a job applicant's resume which concisely communicates their interest in a job opportunity and highlights the skills and attributes that make them a suitable candidate." },
  { term: "Demographic shift", definition: "The change in the size and nature of a population due to migration and changes in birth and death rates." },
  { term: "Dispute resolution", definition: "A process which aims to settle a conflict or disagreement between two or more people by developing a solution which is believed to be fair to all parties." },
  { term: "Diversity", definition: "The state of having or being composed of a variety of elements. In a work context, it refers to the inclusion of different types of people based on age, ethnicity, gender, religion and or ability disability." },
  { term: "Economic power shift", definition: "The long term global shift away from established advanced economies to emerging market countries." },
  { term: "Emerging industries", definition: "Industries that are in the early stages of creating new products and services or transforming existing products and services through innovation and or technology." },
  { term: "Enterprise", definition: "The willingness to try new things, show initiative and embrace and or promote innovative activities." },
  { term: "Enterprise culture", definition: "The shared values, beliefs, attitudes, standards and behaviours that characterise a work environment." },
  { term: "Impactful technology", definition: "The emergence of technologies that have the capacity to improve products, services and processes, but to also cause disruption and uncertainty for society and the economy." },
  { term: "Green industries", definition: "Industries that actively participate in protecting or improving the environment by adopting processes that reduce waste and or pollution or by producing sustainable products using environmentally friendly processes and materials." },
  { term: "Grievance", definition: "Any real or perceived problem an employee has about their work, the workplace or someone they work with." },
  { term: "Growth industry", definition: "An industry that is experiencing a higher than average growth rate compared to other industries." },
  { term: "Initiative", definition: "Taking a proactive approach to completing work tasks, overcoming challenges and dealing with unexpected events." },
  { term: "Learning opportunity", definition: "A situation that allows a person to develop knowledge, understanding and skills." },
  { term: "Lifelong learning", definition: "The ongoing, voluntary and self motivated pursuit of knowledge, understanding and skill development for either personal or professional reasons." },
  { term: "Mediation", definition: "A dispute resolution process whereby a neutral third party facilitates communication and negotiation between disputing parties, helping them to reach a compromised solution." },
  { term: "Megatrend", definition: "A significant and long lasting development that has a transformative impact on the way we live, work and do business." },
  { term: "Performance management", definition: "The continuous process of feedback and communication between an employer and an employee, so that the employee is supported in performing their work role to the best of their ability." },
  { term: "Personal risk", definition: "A risk that directly impacts on the individual and or their family." },
  { term: "Professional development", definition: "Undertaking learning and training to develop, refine and enhance skills, knowledge and understandings." },
  { term: "Professional risk", definition: "A risk taken during career development which can result in improved outcomes for the individual." },
  { term: "Resilience", definition: "The ability to endure adversity and bounce back from challenging life events." },
  { term: "Selection criteria", definition: "The qualities, skills, abilities, knowledge and qualifications needed to perform a job role effectively." },
  { term: "Skills shortage", definition: "A situation that occurs when employers cannot fill vacancies in an occupation or in a specialisation within that occupation." },
  { term: "Work environment", definition: "The physical conditions, procedures and processes, and social dynamics which comprise a place of work." }
];

const GLOSSARY_ROUND_CONFIGS = [
  { id: "colour-shape", title: "Round 1: Colour and Shape Match", cue: "Match each term piece to the definition socket using both colour and shape clues." },
  { id: "shape-only", title: "Round 2: Shape Match", cue: "The colour cue is gone. Now only the shape matches the correct definition." },
  { id: "plain-match", title: "Round 3: Term to Definition", cue: "No visual scaffolds now. Match the term to the correct definition on memory and understanding." },
  { id: "recall", title: "Round 4: Recall Forge", cue: "Use keywords to retrieve the term, then retrieve a keyword from the term." }
];

const STAGES = [
  { id: "content", title: "EST Content Check", state: "Knowledge reactor", summary: "Check the actual revision content before answering under pressure.", marks: 4, readiness: 18, credits: 1600, taxRate: 0.1 },
  { id: "glossary", title: "Glossary Check", state: "Precision language", summary: "Use exact glossary terms and definitions, not vague wording.", marks: 4, readiness: 20, credits: 1600, taxRate: 0.1 },
  { id: "decoder", title: "VTCS Decoder", state: "Question decode", summary: "Unpack verb, topic, context, and structure before you write.", marks: 4, readiness: 24, credits: 2200, taxRate: 0.1 },
  { id: "boss", title: "Boss Round", state: "EST simulation", summary: "Build and justify a mark-worthy EST response with richer feedback.", marks: 8, readiness: 34, credits: 3400, taxRate: 0.1 }
];

const HUB_SECTION_IDS = ["hero-section", "metrics-section", "reward-strip", "track-section", "logs-section"];

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
  contentStageConfig: null,
  marksBanked: 0,
  readiness: 0,
  confidence: 40,
  streak: 1,
  salaryBoost: 0,
  creditedSalaryBoost: 0,
  taxContribution: 0,
  creditedTaxContribution: 0,
  answers: {},
  lastBossReview: null,
  contentGroupIndex: -1,
  contentView: "menu",
  contentGroupStartedAt: 0,
  contentGroupDurations: {},
  glossaryBoard: [],
  glossarySelection: [],
  matchedGlossaryCards: [],
  matchedGlossaryTerms: [],
  glossaryTarget: null,
  glossaryRoundIndex: 0,
  glossaryBatchIndex: 0,
  glossaryAssignments: {},
  glossarySelectedTermId: "",
  glossarySelectedSocketId: "",
  glossaryDraggedTermId: "",
  glossaryRecallAnswers: {},
  glossaryRecallResults: {},
  glossaryStreak: 0,
  glossaryBestStreak: 0,
  glossaryMisses: 0,
  glossaryPulse: "",
  glossaryPulseType: "neutral",
  glossaryRoundCelebration: null,
  glossaryRoundRewards: {},
  glossaryRoundVotes: {},
  glossaryMissionMode: false,
  glossaryRoundStartedAt: 0,
  glossaryHasStarted: false,
  glossaryMode: "play",
  glossaryStudyIndex: 0
};

let glossaryTimerInterval = null;

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

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent({
    moduleId: MODULE_ID,
    ...entry
  });
}

function shouldWarnBeforeLeaving() {
  return Boolean(state.selectedStageId || Object.keys(state.completed).length || state.evidenceLog.length);
}

function registerLeaveWarning() {
  window.addEventListener("beforeunload", event => {
    if (!shouldWarnBeforeLeaving()) return;
    event.preventDefault();
    event.returnValue = "";
  });
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

function getStageMeta(stageId) {
  return STAGES.find(stage => stage.id === stageId) || null;
}

function getFocusSubtitle() {
  const stage = getStageMeta(state.selectedStageId);
  if (!stage) return "Focused EST lab";
  if (state.selectedStageId !== "content") return `${stage.title} focused mode`;
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  return currentGroup ? `${stage.title} • ${currentGroup.title}` : `${stage.title} topic menu`;
}

function setLabMode(active) {
  document.body.classList.toggle("est-lab-mode", active);
  HUB_SECTION_IDS.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.classList.toggle("is-hidden", active);
  });
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("is-hidden", !active);
}

function setStageMenuMode(active) {
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("menu-mode", active);
}

function renderFocusNav() {
  const container = document.getElementById("focus-nav");
  if (!container) return;
  if (!state.selectedStageId) {
    container.innerHTML = "";
    return;
  }

  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  const contentMenuPrompt = "Choose an EST curriculum content area below";
  container.innerHTML = `
    <div class="focus-toolbar">
      <button type="button" class="focus-back" onclick="window.ESTPrep.returnToTrack()">← Back to EST Hub</button>
      <div class="focus-label">${state.selectedStageId === "content" && !currentGroup ? "Choose an EST curriculum content area below" : escapeHtml(getFocusSubtitle())}</div>
    </div>
    <div class="focus-intro">You're in the EST Preparation module.</div>
    <div class="focus-track">
      ${STAGES.map(stage => `
        <button
          type="button"
          class="focus-track-button ${state.selectedStageId === stage.id ? "active" : ""}"
          onclick="window.ESTPrep.openStage('${stage.id}')"
        >
          <strong>${escapeHtml(stage.title)}</strong>
        </button>
      `).join("")}
    </div>
    ${state.selectedStageId === "content" ? `
      <div class="content-track-title-row">
        <div class="content-track-title">Topic Menu</div>
        <div class="content-track-subtitle">${escapeHtml(currentGroup ? currentGroup.title : contentMenuPrompt)}</div>
      </div>
      <div class="content-track content-track-menu ${currentGroup ? "has-selection" : ""}">
        ${groups.map((group, index) => `
          <button
            type="button"
            class="content-track-button ${index === state.contentGroupIndex ? "active" : ""}"
            onclick="window.ESTPrep.openContentGroupIntro(${index})"
          >
            <strong>${index + 1}. ${escapeHtml(group.title)}</strong>
          </button>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function scrollToTopSmooth() {
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (_) {
    window.scrollTo(0, 0);
  }
}

function formatSecondsAsClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearGlossaryTimer() {
  if (glossaryTimerInterval) {
    window.clearInterval(glossaryTimerInterval);
    glossaryTimerInterval = null;
  }
}

function getGlossaryRoundElapsedSeconds() {
  if (!state.glossaryRoundStartedAt) return 0;
  return Math.max(0, Math.round((Date.now() - state.glossaryRoundStartedAt) / 1000));
}

function startGlossaryRoundTimer(reset = false) {
  if (reset || !state.glossaryRoundStartedAt) {
    state.glossaryRoundStartedAt = Date.now();
  }
  clearGlossaryTimer();
  glossaryTimerInterval = window.setInterval(() => {
    const timer = document.getElementById("glossary-round-timer");
    if (timer) timer.textContent = formatSecondsAsClock(getGlossaryRoundElapsedSeconds());
  }, 1000);
}

function getGlossarySpeedBand(elapsedSeconds) {
  if (elapsedSeconds <= 95) return { label: "Gold speed bonus", bonus: 650 };
  if (elapsedSeconds <= 150) return { label: "Silver speed bonus", bonus: 360 };
  return { label: "Bronze speed bonus", bonus: 180 };
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

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function clampText(text, maxLength = 120) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function getContentStageConfig() {
  return state.contentStageConfig || {
    topicGroups: DEFAULT_CONTENT_TOPIC_GROUPS,
    trainingBays: DEFAULT_CONTENT_TRAINING_BAYS
  };
}

function buildContentGroups(bank) {
  const rounds = bank.contentRounds || [];
  const { topicGroups } = getContentStageConfig();
  return topicGroups.map(group => ({
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

async function loadContentStageConfig() {
  try {
    const response = await fetch(CONTENT_STAGE_CONFIG_PATH);
    if (!response.ok) throw new Error("Could not load EST content stage config.");
    return response.json();
  } catch (error) {
    console.warn("Using fallback EST content stage config.", error);
    return {
      topicGroups: DEFAULT_CONTENT_TOPIC_GROUPS,
      trainingBays: DEFAULT_CONTENT_TRAINING_BAYS
    };
  }
}

function normaliseGlossaryTermText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function deriveGlossaryKeywords(definition) {
  const stopWords = new Set(["the", "and", "that", "with", "from", "their", "this", "into", "which", "when", "whereby", "while", "between", "they", "them", "such", "have", "has", "been", "will", "just", "more", "than", "over", "under", "work", "role", "roles", "process", "processes", "using", "used", "throughout", "within", "towards", "about", "your", "their", "these", "those", "what", "because", "allows", "allow", "being"]);
  return [...new Set(
    String(definition || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
  )].slice(0, 4);
}

function buildGlossarySource() {
  return FULL_GLOSSARY_TERMS.map((item, index) => ({
    id: `full-glossary-${index + 1}`,
    term: item.term,
    definition: item.definition,
    keywords: deriveGlossaryKeywords(item.definition)
  }));
}

function buildStageDeck(bank) {
  const glossaryTerms = buildGlossarySource();
  const contentGroups = buildContentGroups(bank);
  const glossaryBatches = chunkArray(glossaryTerms, 4);

  return {
    contentGroups,
    glossaryBatches,
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
      <button type="button" onclick="window.ESTPrep.openStage('${stage.id}')">${state.completed[stage.id] ? "Review lab" : "Open lab"}</button>
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
  const { trainingBays } = getContentStageConfig();
  return trainingBays[groupId] || null;
}

function getTrainingScore(config) {
  if (!config) return { correct: 0, total: 0, percent: 0 };
  if (config.type === "sort") {
    const total = config.cards.length;
    const correct = config.cards.filter(card => state.answers[`training-${config.type}-${card.id}`] === card.correctBucket).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "scenario") {
    const total = config.scenarios.length;
    const correct = config.scenarios.filter(scenario => state.answers[`training-${config.type}-${scenario.id}`] === scenario.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "builder") {
    const total = config.rounds.length;
    const correct = config.rounds.filter(round => state.answers[`training-${config.type}-${round.id}`] === round.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  return { correct: 0, total: 0, percent: 0 };
}

function renderSortTrainingBay(config, score) {
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

function renderScenarioTrainingBay(config, score) {
  return `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} scenario calls</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      <div class="training-grid">
        ${config.scenarios.map(scenario => {
          const answer = state.answers[`training-scenario-${scenario.id}`];
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
                    onclick="window.ESTPrep.setTrainingChoiceEncoded('training-scenario-${scenario.id}', '${encodeURIComponent(option)}')"
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

function renderBuilderTrainingBay(config, score) {
  return `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} build choices locked</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      <div class="builder-grid">
        ${config.rounds.map(round => {
          const answer = state.answers[`training-builder-${round.id}`];
          const isCorrect = answer && answer === round.correct;
          return `
            <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
              <div class="kicker">${escapeHtml(round.title)}</div>
              <p>${escapeHtml(round.prompt)}</p>
              <div class="training-stack">
                ${round.options.map(option => `
                  <button
                    type="button"
                    class="choice-button ${answer === option ? "selected live-selected" : ""}"
                    onclick="window.ESTPrep.setTrainingChoiceEncoded('training-builder-${round.id}', '${encodeURIComponent(option)}')"
                  >
                    <strong>${escapeHtml(round.builderLabel || "Best move")}</strong>
                    <small>${escapeHtml(option)}</small>
                  </button>
                `).join("")}
              </div>
              <p class="training-feedback">${answer ? `${isCorrect ? "Stronger build." : "This weakens the response."} ${escapeHtml(round.feedback)}` : "Choose the move that would build the strongest EST-style response."}</p>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderTrainingBay(group) {
  const config = getContentTrainingConfig(group.id);
  if (!config) return "";
  const score = getTrainingScore(config);
  if (config.type === "sort") return renderSortTrainingBay(config, score);
  if (config.type === "scenario") return renderScenarioTrainingBay(config, score);
  if (config.type === "builder") return renderBuilderTrainingBay(config, score);
  return "";
}

function toggleReveal(key) {
  state.answers[key] = !state.answers[key];
  if (state.selectedStageId === "glossary") renderGlossaryStage();
  if (state.selectedStageId === "boss") renderBossStage();
}

function getBossShowdownPair(round) {
  if (!round?.sampleResponses?.length) return [];
  const strong = round.sampleResponses.find(sample => /strong/i.test(sample.band || ""));
  const developing = round.sampleResponses.find(sample => /developing/i.test(sample.band || ""));
  if (strong && developing) return [strong, developing];
  return round.sampleResponses.slice(0, 2);
}

function getBossScaffoldLines(round) {
  return String(round?.scaffold || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function renderBossResponseBuilder(round) {
  const lines = getBossScaffoldLines(round);
  return `
    <div class="panel">
      <div class="section-title">
        <h2>Response Forge</h2>
        <p>Build before you write</p>
      </div>
      <p class="small-copy">Use the scaffold blocks to build a stronger answer before drafting the final response.</p>
      <div class="builder-grid">
        ${lines.map((line, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(line.replace("...", "").trim() || `Scaffold ${index + 1}`)}</strong>
            <textarea
              id="boss-scaffold-${index}"
              placeholder="Write the key idea for this part..."
              oninput="window.ESTPrep.setBossScaffold(${index}, this.value)"
            >${escapeHtml(state.answers[`boss-scaffold-${index}`] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildBossDraft()">Build Draft from Scaffold</button>
      </div>
    </div>
  `;
}

function getGlossaryKeywordHint(termName, definition) {
  const hintMap = {
    "Initiative": "proactive action",
    "Proactive": "act early",
    "Time management": "plan + prioritise",
    "Budget": "income vs expenses",
    "Seeking assistance": "trusted advice",
    "Labour market information": "jobs + wages",
    "Growth industry": "high growth",
    "Emerging industry": "new industry",
    "Green industry": "sustainable work",
    "Cover letter": "first impression",
    "Selection criteria": "job requirements",
    "STAR": "situation task action result",
    "Megatrend": "long-term change",
    "Demographic shift": "population change",
    "Economic power shift": "global market shift",
    "Impactful technologies": "innovation + disruption",
    "Career planning": "goals + pathways",
    "Communication skills": "message for audience",
    "Non-verbal communication": "body language",
    "Active listening": "check understanding",
    "Unexpected life event": "unplanned disruption"
  };
  if (hintMap[termName]) return hintMap[termName];
  const words = String(definition || "").replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(" ");
}

function getGlossaryScenarioHint(scenario) {
  const text = String(scenario || "").trim();
  if (text.length <= 72) return text;
  return `${text.slice(0, 72).trim()}...`;
}

function buildGlossaryBoard(rounds) {
  return shuffle(rounds.flatMap((round, index) => ([
    {
      id: `glossary-${index}-keyword`,
      matchId: index,
      kind: "Keyword",
      text: getGlossaryKeywordHint(round.term.term, round.term.definition),
      style: {
        x: `${8 + ((index * 17) % 62)}%`,
        y: `${8 + ((index * 13) % 52)}%`,
        delay: `${(index % 5) * 0.4}s`,
        duration: `${5 + (index % 4)}s`
      }
    },
    {
      id: `glossary-${index}-scenario`,
      matchId: index,
      kind: "Scenario",
      text: getGlossaryScenarioHint(round.term.scenario),
      style: {
        x: `${16 + ((index * 19) % 58)}%`,
        y: `${18 + ((index * 11) % 48)}%`,
        delay: `${((index + 2) % 5) * 0.35}s`,
        duration: `${6 + (index % 3)}s`
      }
    },
    {
      id: `glossary-${index}-definition`,
      matchId: index,
      kind: "Definition",
      text: round.term.definition,
      style: {
        x: `${12 + ((index * 23) % 60)}%`,
        y: `${12 + ((index * 7) % 54)}%`,
        delay: `${((index + 1) % 5) * 0.45}s`,
        duration: `${7 + (index % 4)}s`
      }
    }
  ])));
}

function getCurrentGlossaryBatch() {
  const batches = state.stageDeck?.glossaryBatches || [];
  return batches[state.glossaryBatchIndex] || [];
}

function getCurrentGlossaryRound() {
  return GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex] || GLOSSARY_ROUND_CONFIGS[0];
}

function getGlossaryVisual(index) {
  const visuals = [
    { shape: "circle", color: "#ff8a5b" },
    { shape: "diamond", color: "#5dd6ff" },
    { shape: "pill", color: "#ffd86c" },
    { shape: "hex", color: "#72f7b8" },
    { shape: "arch", color: "#c48bff" },
    { shape: "ticket", color: "#ff7dc0" }
  ];
  const offset = (state.glossaryRoundIndex * 2) + state.glossaryBatchIndex;
  return visuals[(index + offset) % visuals.length];
}

function syncMissionMode() {
  document.body.classList.toggle("glossary-mission-active", !!state.glossaryMissionMode);
}

function resetGlossaryRewardLoop() {
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = {};
  state.glossaryRoundVotes = {};
  state.glossaryRoundStartedAt = 0;
}

function initialiseGlossaryBoard() {
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryAssignments = {};
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallAnswers = {};
  state.glossaryRecallResults = {};
  state.glossaryStreak = 0;
  state.glossaryBestStreak = 0;
  state.glossaryMisses = 0;
  state.glossaryPulse = "Start with colour and shape. Match each term piece to the correct definition socket.";
  state.glossaryPulseType = "neutral";
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  resetGlossaryRewardLoop();
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

function getGlossaryBatchKey() {
  return `glossary-r${state.glossaryRoundIndex}-b${state.glossaryBatchIndex}`;
}

function getGlossaryAssignmentsForBatch() {
  return state.glossaryAssignments[getGlossaryBatchKey()] || {};
}

function setGlossarySelectedTerm(termId) {
  const assignments = getGlossaryAssignmentsForBatch();
  const usedTermIds = Object.values(assignments);
  if (usedTermIds.includes(termId)) return;
  state.glossarySelectedTermId = state.glossarySelectedTermId === termId ? "" : termId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossarySelectedSocket(socketId) {
  const assignments = getGlossaryAssignmentsForBatch();
  if (assignments[socketId]) return;
  state.glossarySelectedSocketId = state.glossarySelectedSocketId === socketId ? "" : socketId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossaryMode(mode) {
  state.glossaryMode = mode === "study" ? "study" : "play";
  renderGlossaryStage();
}

function moveGlossaryStudy(step) {
  const batch = getCurrentGlossaryBatch();
  if (!batch.length) return;
  const nextIndex = (state.glossaryStudyIndex + step + batch.length) % batch.length;
  state.glossaryStudyIndex = nextIndex;
  renderGlossaryStage();
}

function flipGlossaryStudyCard() {
  const currentKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  state.answers[currentKey] = !state.answers[currentKey];
  renderGlossaryStage();
}

function resetGlossarySelections() {
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
}

function startGlossaryDrag(termId) {
  state.glossaryDraggedTermId = termId;
  state.glossarySelectedTermId = termId;
  renderGlossaryStage();
}

function endGlossaryDrag() {
  state.glossaryDraggedTermId = "";
  renderGlossaryStage();
}

function getGlossaryRoundEconomy(roundNumber) {
  const glossaryStage = STAGES.find(stage => stage.id === "glossary");
  if (!glossaryStage) return { salary: 0, taxRate: 0 };
  const salary = Math.round((glossaryStage.credits * (0.65 + (roundNumber * 0.12))) / 4);
  return { salary, taxRate: glossaryStage.taxRate };
}

function formatGlossaryRoundTitle(roundNumber) {
  return roundNumber === 1
    ? "You cleared Round 1. All 30 words are colour-locked."
    : roundNumber === 2
      ? "Round 2 cleared. Shape memory is taking over."
      : roundNumber === 3
        ? "Round 3 cleared. You matched terms from memory."
        : "Recall Forge complete. Glossary mastery is banked.";
}

function buildGlossaryCelebration(roundNumber, scoreText) {
  clearGlossaryTimer();
  const { salary, taxRate } = getGlossaryRoundEconomy(roundNumber);
  const elapsedSeconds = getGlossaryRoundElapsedSeconds();
  const speedBand = getGlossarySpeedBand(elapsedSeconds);
  const precisionBonus = state.glossaryMisses <= 1 ? 300 : state.glossaryMisses <= 4 ? 150 : 0;
  const totalSalary = salary + speedBand.bonus + precisionBonus;
  const tax = Math.round(totalSalary * taxRate);
  state.salaryBoost += totalSalary;
  state.taxContribution += tax;
  state.glossaryRoundRewards[roundNumber] = { salary: totalSalary, tax, scoreText, elapsedSeconds, speedBand, precisionBonus };
  state.glossaryRoundCelebration = {
    roundNumber,
    title: formatGlossaryRoundTitle(roundNumber),
    subtitle: roundNumber < 4
      ? `Let's level up. ${GLOSSARY_ROUND_CONFIGS[roundNumber].title} removes another support.`
      : "The final recall round is complete. Return to the lab stronger and sharper.",
    salary: totalSalary,
    tax,
    scoreText,
    elapsedSeconds,
    speedBand,
    precisionBonus
  };
  state.glossaryPulse = `Round ${roundNumber} cleared. Choose where the class community tax should land, then continue.`;
  state.glossaryPulseType = "good";
  state.recentReward = {
    type: "positive",
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${speedBand.label} • +${formatCurrency(totalSalary)} salary • +${formatCurrency(tax)} community tax`
  };
  state.debriefLog.push({
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${formatSecondsAsClock(elapsedSeconds)} • ${formatCurrency(totalSalary)} salary earned • ${formatCurrency(tax)} ready for community allocation`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `glossary-round-${roundNumber}`,
    label: `EST glossary round ${roundNumber}`,
    detail: `${scoreText} • ${speedBand.label}`,
    earnedDelta: totalSalary,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  scrollToTopSmooth();
}

function setGlossaryRoundVote(optionId) {
  if (!state.glossaryRoundCelebration) return;
  state.glossaryRoundVotes[state.glossaryRoundCelebration.roundNumber] = optionId;
  renderGlossaryStage();
}

function continueGlossaryRound() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return;
  const roundNumber = celebration.roundNumber;
  const voteKey = state.glossaryRoundVotes[roundNumber];
  if (!voteKey) return;
  state.answers[`glossaryVoteRound${roundNumber}`] = voteKey;
  state.glossaryRoundCelebration = null;
  state.glossarySelectedTermId = "";
  state.glossaryDraggedTermId = "";
  if (roundNumber < 4) {
    state.glossaryRoundIndex = roundNumber;
    state.glossaryBatchIndex = 0;
    state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex].cue;
    state.glossaryPulseType = "neutral";
    startGlossaryRoundTimer(true);
    renderGlossaryStage();
    scrollToTopSmooth();
    return;
  }
  bankGlossaryResults();
}

function returnToLab() {
  setLabMode(false);
  setStageMenuMode(false);
  state.selectedStageId = null;
  state.contentGroupIndex = -1;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Return from the glossary mission and keep building your EST run.");
  renderStageRoot(`
    <div class="empty-state">
      <p>Back in the EST Lab. Re-enter any stage when you're ready.</p>
    </div>
  `);
  scrollToTopSmooth();
}

function attemptGlossaryMatch(termId, targetTermId) {
  if (!termId) return;
  const batch = getCurrentGlossaryBatch();
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetTermId]) return;
  const draggedTerm = batch.find(item => item.id === termId);
  const targetTerm = batch.find(item => item.id === targetTermId);
  if (!draggedTerm || !targetTerm) return;

  if (termId === targetTermId) {
    assignments[targetTermId] = termId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    resetGlossarySelections();
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${targetTerm.term} matched. The blueprint wall is lighting up.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct match",
      detail: `${targetTerm.term} has been locked in. Keep matching to complete the blueprint.`
    };
  } else {
    resetGlossarySelections();
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = "Try again. That term piece does not fit this definition socket.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Try again",
      detail: `${draggedTerm.term} does not match that definition. Re-check the clue.`
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function dropGlossaryTerm(event, targetTermId) {
  event.preventDefault();
  attemptGlossaryMatch(state.glossaryDraggedTermId || state.glossarySelectedTermId, targetTermId);
}

function handleGlossarySocketClick(targetTermId) {
  setGlossarySelectedSocket(targetTermId);
}

function isGlossaryBatchMatched() {
  const batch = getCurrentGlossaryBatch();
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.length && batch.every(item => assignments[item.id] === item.id);
}

function moveToNextGlossaryBatchOrRound() {
  const batchCount = (state.stageDeck?.glossaryBatches || []).length;
  if (state.glossaryBatchIndex < batchCount - 1) {
    state.glossaryBatchIndex += 1;
    state.glossaryPulse = `Batch ${state.glossaryBatchIndex + 1} loaded. Keep the wall glowing.`;
    state.glossaryPulseType = "neutral";
    state.glossaryStudyIndex = 0;
  } else {
    const completedRound = state.glossaryRoundIndex + 1;
    buildGlossaryCelebration(completedRound, `All ${FULL_GLOSSARY_TERMS.length} glossary terms cleared in this round.`);
    renderGlossaryStage();
    return;
  }
  resetGlossarySelections();
  renderGlossaryStage();
}

function nextGlossaryPhase() {
  if (state.glossaryRoundIndex < 3) {
    if (!isGlossaryBatchMatched()) return;
    moveToNextGlossaryBatchOrRound();
  }
}

function setGlossaryRecallAnswer(key, value) {
  state.glossaryRecallAnswers[key] = value;
}

function renderGlossaryCelebration() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return "";
  const voteKey = state.glossaryRoundVotes[celebration.roundNumber] || "";
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button
      type="button"
      class="choice-button ${voteKey === option.id ? "selected live-selected" : ""}"
      onclick="window.ESTPrep.setGlossaryRoundVote('${option.id}')"
    >
      <strong>${escapeHtml(option.label || option.id)}</strong>
      <span>${escapeHtml(option.description || "Class community focus")}</span>
    </button>
  `).join("");
  return `
    <section class="glossary-celebration">
      <div class="glossary-celebration-card">
        <div class="kicker">Round ${celebration.roundNumber} cleared</div>
        <h3>${escapeHtml(celebration.title)}</h3>
        <p>${escapeHtml(celebration.subtitle)}</p>
        <div class="badge-row">
          <span class="badge">${escapeHtml(celebration.scoreText)}</span>
          <span class="badge">Time: ${formatSecondsAsClock(celebration.elapsedSeconds)}</span>
          <span class="badge">${escapeHtml(celebration.speedBand.label)}</span>
        </div>
        <div class="glossary-reward-grid">
          <article class="glossary-reward-chip">
            <strong>Total salary</strong>
            <p>${formatCurrency(celebration.salary)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Speed bonus</strong>
            <p>${formatCurrency(celebration.speedBand.bonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Precision bonus</strong>
            <p>${formatCurrency(celebration.precisionBonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Community tax</strong>
            <p>${formatCurrency(celebration.tax)}</p>
          </article>
        </div>
        <div class="panel glossary-vote-panel">
          <div class="section-title">
            <h2>Choose how your class tax helps the community</h2>
            <p>All pooled taxes go toward building something bigger than one student run.</p>
          </div>
          <div class="choice-grid">${communityOptions}</div>
        </div>
        <div class="builder-actions">
          <button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryRound()" ${voteKey ? "" : "disabled"}>
            ${celebration.roundNumber < 4 ? "Level Up to the Next Round" : "Bank Glossary Results"}
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderGlossaryStudyDeck(batch) {
  const card = batch[state.glossaryStudyIndex] || batch[0];
  if (!card) return "";
  const flipKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  const flipped = !!state.answers[flipKey];
  return `
    <div class="panel glossary-study-panel">
      <div class="section-title">
        <h2>Study Deck</h2>
        <p>Flip through the current batch before you play for speed and salary.</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Card ${state.glossaryStudyIndex + 1} / ${batch.length}</span>
        <span class="badge">${escapeHtml(card.term)}</span>
      </div>
      <button type="button" class="glossary-study-card ${flipped ? "flipped" : ""}" onclick="window.ESTPrep.flipGlossaryStudyCard()">
        <div class="glossary-study-inner">
          <div class="glossary-study-face">
            <span class="kicker">Term</span>
            <strong>${escapeHtml(card.term)}</strong>
            <p>Click to reveal the meaning.</p>
          </div>
          <div class="glossary-study-face glossary-study-back">
            <span class="kicker">Definition</span>
            <strong>${escapeHtml(card.definition)}</strong>
            <p>Keywords: ${escapeHtml(card.keywords.join(", "))}</p>
          </div>
        </div>
      </button>
      <div class="builder-actions glossary-study-actions">
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(-1)">Previous</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.flipGlossaryStudyCard()">Flip Card</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(1)">Next</button>
      </div>
    </div>
  `;
}

function renderContentTopicIntro(group) {
  const highlights = group.introHighlights || [];
  const hasVideo = Boolean(group.introVideo);
  return `
    <div class="topic-intro-grid">
      <div class="topic-media-card">
        ${hasVideo ? `
          <video class="topic-media" autoplay muted loop playsinline poster="${escapeHtml(group.introImage || "")}">
            <source src="${escapeHtml(group.introVideo)}" type="video/mp4">
          </video>
        ` : `
          <img class="topic-media topic-media-image" src="${escapeHtml(group.introImage || "")}" alt="${escapeHtml(group.title)}">
        `}
      </div>
      <div class="topic-intro-copy panel">
        <div class="kicker">Topic intro</div>
        <h3>${escapeHtml(group.introTitle || group.title)}</h3>
        <p class="small-copy">${escapeHtml(group.introSummary || group.writePrompt)}</p>
        ${highlights.length ? `
          <div class="badge-row topic-intro-highlights">
            ${highlights.map(item => `<span class="badge">${escapeHtml(item)}</span>`).join("")}
          </div>
        ` : ""}
        <div class="written-stage topic-intro-actions">
          <div class="topic-intro-button-row">
            <button class="submit-button" type="button" onclick="window.ESTPrep.openStage('content')">Back to topic menu</button>
            <button class="submit-button" type="button" onclick="window.ESTPrep.startContentGroup()">Start content check</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderContentStage() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  renderFocusNav();
  if (state.contentView === "menu" || !currentGroup) {
    setStageMenuMode(true);
    setText("stage-title", "");
    setText("stage-subtitle", "");
    renderStageRoot(`
      <div class="focus-card">
        <p class="small-copy">Select one curriculum area from the topic menu above to open that focused EST content module.</p>
      </div>
    `);
    return;
  }
  if (state.contentView === "intro") {
    setStageMenuMode(false);
    setText("stage-title", "EST Content Check");
    setText("stage-subtitle", `${currentGroup.title}`);
    renderStageRoot(renderContentTopicIntro(currentGroup));
    return;
  }
  setStageMenuMode(false);
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  setText("stage-title", "EST Content Check");
  setText("stage-subtitle", "Train one content strand at a time with a clean, distraction-light interface.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Focused revision</div>
      <h3>${escapeHtml(currentGroup.title)}</h3>
      <p>This lab is dedicated to one revision strand only: briefing, practice, knowledge check, then a short EST response.</p>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Module briefing</h2>
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
        <button class="submit-button" type="button" onclick="window.ESTPrep.openStage('content')">Back to topic menu</button>
        ${state.contentGroupIndex > 0 ? '<button class="submit-button" type="button" onclick="window.ESTPrep.prevContentGroup()">Previous Topic</button>' : ""}
        ${state.contentGroupIndex < groups.length - 1
          ? '<button class="submit-button" type="button" onclick="window.ESTPrep.nextContentGroup()">Next Topic</button>'
          : '<button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Content Results</button>'}
      </div>
    </div>
  `);
}

function renderGlossaryStage() {
  setStageMenuMode(false);
  renderFocusNav();
  syncMissionMode();
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const assignments = getGlossaryAssignmentsForBatch();
  const totalBatches = (state.stageDeck?.glossaryBatches || []).length;
  const roundNumber = state.glossaryRoundIndex + 1;
  const batchNumber = state.glossaryBatchIndex + 1;
  const matchedCount = Object.keys(assignments).length;
  setText("stage-title", "Glossary Mission");
  setText("stage-subtitle", "Leave the lab, lock in the language, then return stronger.");

  if (state.glossaryRoundCelebration) {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">Glossary Mission Access</div>
            <h3>Reward chamber</h3>
          </div>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
        ${renderGlossaryCelebration()}
      </div>
    `);
    return;
  }

  if (round.id === "recall") {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">Glossary Mission Access</div>
            <h3>${escapeHtml(round.title)}</h3>
            <p class="small-copy">Batch ${batchNumber} of ${totalBatches}. This final round is teacher-visible mastery.</p>
          </div>
          <div class="glossary-mission-actions">
            <span class="badge">Round 4 / 4</span>
            <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
          </div>
        </div>
        <div class="question-card glossary-round-banner">
          <div class="kicker">Recall Forge</div>
          <h3>${escapeHtml(round.title)}</h3>
          <p>Use the keyword clues to retrieve the term, then retrieve at least one keyword from the term. Faster accurate recall pays more.</p>
        </div>
        <div class="panel">
          <div class="section-title">
            <h2>Recall Round</h2>
            <p>Batch ${batchNumber}/${totalBatches}</p>
          </div>
          <div class="badge-row" style="margin-bottom:14px;">
            <span class="badge">Terms in batch: ${batch.length}</span>
            <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
            <span class="badge">Misses: ${state.glossaryMisses}</span>
          </div>
          <div class="sample-grid">
            ${batch.map(item => `
              <article class="sample-card">
                <div class="sample-meta">
                  <strong>${escapeHtml(item.term)}</strong>
                  <span>Recall pair</span>
                </div>
                <p><strong>Keywords to term:</strong> ${escapeHtml(item.keywords.join(", "))}</p>
                <textarea
                  placeholder="Type the term..."
                  oninput="window.ESTPrep.setGlossaryRecallAnswer('term-${item.id}', this.value)"
                >${escapeHtml(state.glossaryRecallAnswers[`term-${item.id}`] || "")}</textarea>
                <p style="margin-top:12px;"><strong>Term to keyword:</strong> Give at least one keyword for <em>${escapeHtml(item.term)}</em>.</p>
                <textarea
                  placeholder="Type one keyword..."
                  oninput="window.ESTPrep.setGlossaryRecallAnswer('keyword-${item.id}', this.value)"
                >${escapeHtml(state.glossaryRecallAnswers[`keyword-${item.id}`] || "")}</textarea>
              </article>
            `).join("")}
          </div>
        </div>
        <div class="written-stage">
          <strong>Round 4 complete</strong>
          <p class="small-copy">This final mastery round records exactly which terms the student can retrieve, not just recognise.</p>
          <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()">${batchNumber === totalBatches ? "Finish Recall Forge" : "Next Recall Batch"}</button>
        </div>
      </div>
    `);
    startGlossaryRoundTimer();
    return;
  }

  const progressPercent = Math.round((matchedCount / Math.max(1, batch.length)) * 100);
  const roundScore = Math.max(0, (matchedCount * 100) - (state.glossaryMisses * 25));
  const showColour = round.id === "colour-shape";
  const selectedTermId = state.glossarySelectedTermId;
  const selectedSocketId = state.glossarySelectedSocketId;
  const modeSwitch = `
    <div class="glossary-mode-switch">
      <button type="button" class="choice-button ${state.glossaryMode === "play" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('play')">Play Round</button>
      <button type="button" class="choice-button ${state.glossaryMode === "study" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('study')">Study Deck</button>
    </div>
  `;

  if (state.glossaryMode === "study") {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">Glossary Mission Access</div>
            <h3>Study before the speed run</h3>
            <p class="small-copy">Use the deck to learn the batch, then switch back into play mode for points and rewards.</p>
          </div>
          <div class="glossary-mission-actions">
            <span class="badge">Round ${roundNumber} / 4</span>
            <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
            <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
          </div>
        </div>
        ${modeSwitch}
        ${renderGlossaryStudyDeck(batch)}
      </div>
    `);
    startGlossaryRoundTimer();
    return;
  }

  renderStageRoot(`
    <div class="glossary-mission-shell">
      <div class="glossary-mission-topbar">
        <div>
          <div class="kicker">Glossary Mission Access</div>
          <h3>Career Empire Blueprint Wall</h3>
          <p class="small-copy">Step out of the four-module arena, clear the glossary mission, then return stronger for the next EST battle.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Round ${roundNumber} / 4</span>
          <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
      </div>
      <div class="question-card glossary-round-banner">
        <div class="kicker">Blueprint Wall</div>
        <h3>${escapeHtml(round.title)}</h3>
        <p>Match the term pieces to the correct definition sockets. The wall brightens, your streak rises, and faster clean rounds pay better.</p>
      </div>
      ${modeSwitch}
      <div class="panel">
        <div class="section-title">
          <h2>Career Empire Blueprint Wall</h2>
          <p>Round ${roundNumber}/4 • ${matchedCount}/${batch.length} matched</p>
        </div>
        <div class="badge-row" style="margin-bottom:14px;">
          <span class="badge">Current streak: x${state.glossaryStreak}</span>
          <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
          <span class="badge">Misses: ${state.glossaryMisses}</span>
          <span class="badge">Score: ${roundScore}</span>
        </div>
        <div class="glossary-instructions">
          <div class="glossary-step">
            <span>1</span>
            <strong>Choose a term card</strong>
          </div>
          <div class="glossary-step">
            <span>2</span>
            <strong>Choose its matching definition</strong>
          </div>
        </div>
        <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
        <div class="glossary-progress-track" aria-hidden="true">
          <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
        </div>
        <div class="glossary-blueprint" style="--glossary-progress:${Math.round((matchedCount / Math.max(1, batch.length)) * 100)}%;">
          <div class="glossary-sockets">
            ${batch.map((item, index) => {
              const visual = getGlossaryVisual(index);
              const assigned = assignments[item.id];
              const shapeClass = `shape-${visual.shape}`;
              const selected = selectedSocketId === item.id;
              return `
                <button
                  type="button"
                  class="glossary-socket ${shapeClass} ${assigned ? "matched" : ""} ${selected ? "selected live-selected" : ""} ${showColour ? "colour-cued" : ""}"
                  style="${showColour ? `--socket-colour:${visual.color};` : ""}"
                  onclick="window.ESTPrep.handleGlossarySocketClick('${item.id}')"
                >
                  <span class="kicker">${showColour ? "Shape + colour" : round.id === "shape-only" ? "Shape only" : "Definition only"}</span>
                  <strong>${escapeHtml(clampText(item.definition, 120))}</strong>
                  <span class="small-copy">Tap to lock this definition</span>
                  ${assigned ? '<span class="glossary-mark good">✓</span><span class="glossary-float-success">Nice lock-in!</span>' : ""}
                </button>
              `;
            }).join("")}
          </div>
          <div class="glossary-term-pool">
            ${batch.map((item, index) => {
              const visual = getGlossaryVisual(index);
              const shapeClass = `shape-${visual.shape}`;
              const used = Object.values(assignments).includes(item.id);
              const selected = selectedTermId === item.id;
              return `
                <button
                  type="button"
                  class="choice-button glossary-piece ${shapeClass} ${used ? "matched" : ""} ${selected ? "selected live-selected" : ""} ${showColour ? "colour-cued" : ""}"
                  style="${showColour ? `--socket-colour:${visual.color};` : ""}"
                  ${used ? "disabled" : ""}
                  onclick="window.ESTPrep.setGlossarySelectedTerm('${item.id}')"
                >
                  <span class="kicker">${showColour ? "Piece" : round.id === "shape-only" ? "Shape piece" : "Term piece"}</span>
                  <strong>${escapeHtml(item.term)}</strong>
                  <span class="small-copy">Tap to arm this card</span>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
      <div class="written-stage">
        <strong>Blueprint feedback</strong>
        <p class="small-copy">Correct matches glow and bank the wall. Finish the full batch, then clear the whole round to unlock salary, bonuses, and a class community choice.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>${batchNumber === totalBatches ? "Finish Round" : "Next Batch"}</button>
      </div>
    </div>
  `);
  startGlossaryRoundTimer();
}

function renderDecoderStage() {
  setStageMenuMode(false);
  renderFocusNav();
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  setText("stage-title", "VTCS Decoder");
  setText("stage-subtitle", "Run question forensics before you write.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">VTCS Core</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.feedback)}</p>
    </div>
    <div class="panel training-bay">
      <div class="section-title">
        <h2>Question Forensics Board</h2>
        <p>Build the brief</p>
      </div>
      <p class="small-copy">Treat the EST question like evidence. Build the four-part brief by locking the correct verb, topic, context, and response structure.</p>
      <div class="forensics-grid">
        <div class="prompt-card forensics-slot ${state.answers["decoder-verb"] ? "filled" : ""}">
          <strong>Verb</strong>
          <p>${escapeHtml(state.answers["decoder-verb"] || "Select the command word")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-topic"] ? "filled" : ""}">
          <strong>Topic</strong>
          <p>${escapeHtml(state.answers["decoder-topic"] || "Select the concept")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-context"] ? "filled" : ""}">
          <strong>Context</strong>
          <p>${escapeHtml(state.answers["decoder-context"] || "Select the context")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-structure"] ? "filled" : ""}">
          <strong>Structure</strong>
          <p>${escapeHtml(state.answers["decoder-structure"] || "Select the structure")}</p>
        </div>
      </div>
    </div>
    ${renderOptionGroup("decoder-verb", "Forensics Tool 1: Command verb", round.verbOptions)}
    ${renderOptionGroup("decoder-topic", "Forensics Tool 2: Topic", round.topicOptions)}
    ${renderOptionGroup("decoder-context", "Forensics Tool 3: Context", round.contextOptions)}
    ${renderOptionGroup("decoder-structure", "Forensics Tool 4: Structure", round.structureOptions)}
    <div class="written-stage">
      <strong>Case summary</strong>
      <p class="small-copy">Students lose marks when they misread what the question is actually asking. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">Bank Decoder Results</button>
    </div>
  `);
}

function renderBossStage() {
  setStageMenuMode(false);
  renderFocusNav();
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const showdownPair = getBossShowdownPair(round);
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
    ${showdownPair.length === 2 ? `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>Worked Example Showdown</h2>
          <p>Judge before you draft</p>
        </div>
        <p class="small-copy">Choose the stronger response first. This helps students notice what quality looks like before they write their own answer.</p>
        <div class="sample-grid">
          ${showdownPair.map((sample, index) => `
            <article class="sample-card">
              <div class="sample-meta">
                <strong>Sample ${index + 1}</strong>
                <span>${escapeHtml(sample.label)}</span>
              </div>
              <p>${escapeHtml(sample.response)}</p>
              <button
                type="button"
                class="choice-button ${state.answers.bossShowdown === sample.label ? "selected live-selected" : ""}"
                style="margin-top:12px;"
                onclick="window.ESTPrep.setChoiceEncoded('bossShowdown', '${encodeURIComponent(sample.label)}')"
              >
                <strong>This is stronger</strong>
              </button>
            </article>
          `).join("")}
        </div>
        <div class="written-stage">
          <strong>Why?</strong>
          <p class="small-copy">Explain what makes the stronger sample better.</p>
          <textarea id="boss-showdown-reason" placeholder="Explain what the stronger sample includes or does better..." oninput="window.ESTPrep.setBossShowdownReason(this.value)">${escapeHtml(state.answers.bossShowdownReason || "")}</textarea>
        </div>
      </div>
    ` : ""}
    <div class="prompt-grid">
      ${round.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>${escapeHtml(round.scaffold.split("\n").join(" "))}</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", round.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", round.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", round.glossaryOptions)}
    ${renderBossResponseBuilder(round)}
    <div class="written-stage">
      <strong>Final simulation response</strong>
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
  openContentGroupIntro(index);
}

function openContentGroupIntro(index) {
  const groups = state.stageDeck?.contentGroups || [];
  if (!groups.length) return;
  const nextIndex = Math.max(0, Math.min(index, groups.length - 1));
  if (state.contentView === "lesson" && state.contentGroupIndex >= 0) {
    persistCurrentContentNote();
    bankCurrentContentDuration();
  }
  state.contentGroupIndex = nextIndex;
  state.contentView = "intro";
  state.selectedStageId = "content";
  setLabMode(true);
  renderContentStage();
  scrollToTopSmooth();
}

function startContentGroup() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  state.contentView = "lesson";
  state.contentGroupStartedAt = Date.now();
  renderContentStage();
  scrollToTopSmooth();
}

function moveContentGroup(step) {
  jumpToContentGroup(state.contentGroupIndex + step);
}

function openStage(stageId) {
  const previousStageId = state.selectedStageId;
  setLabMode(true);
  if (stageId !== "glossary") {
    state.glossaryMissionMode = false;
    clearGlossaryTimer();
    syncMissionMode();
  }
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  state.stageStartedAt = Date.now();
  if (stageId === "content") {
    if (previousStageId === "content" && state.contentView === "lesson" && state.contentGroupIndex >= 0) {
      persistCurrentContentNote();
      bankCurrentContentDuration();
    }
    state.contentGroupIndex = -1;
    state.contentView = "menu";
    if (previousStageId !== "content") {
      state.contentGroupStartedAt = Date.now();
      state.contentGroupDurations = {};
    }
  }
  if (stageId === "glossary") {
    state.glossaryMissionMode = true;
    syncMissionMode();
    if (!state.glossaryHasStarted || state.completed.glossary) {
      initialiseGlossaryBoard();
    } else if (!state.glossaryRoundCelebration) {
      startGlossaryRoundTimer();
    }
  }
  renderMap();
  if (stageId === "content") renderContentStage();
  if (stageId === "glossary") renderGlossaryStage();
  if (stageId === "decoder") renderDecoderStage();
  if (stageId === "boss") renderBossStage();
  scrollToTopSmooth();
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

function setBossScaffold(index, value) {
  state.answers[`boss-scaffold-${index}`] = value;
}

function setBossShowdownReason(value) {
  state.answers.bossShowdownReason = value;
}

function buildBossDraft() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const draft = getBossScaffoldLines(round)
    .map((line, index) => {
      const label = line.replace("...", "").trim();
      const value = state.answers[`boss-scaffold-${index}`] || "";
      return value ? `${label} ${value}`.trim() : "";
    })
    .filter(Boolean)
    .join("\n");
  state.answers.bossText = draft;
  const textarea = document.getElementById("boss-response");
  if (textarea) textarea.value = draft;
  state.recentReward = {
    type: "positive",
    title: "Draft built",
    detail: "Your scaffold blocks have been assembled into a first EST response draft."
  };
  renderRewardPulse();
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
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: stageId,
    label: stage.title,
    detail: `${earnedMarks}/${stage.marks} marks • ${Math.round(stage.readiness * outcome.scoreRatio)} readiness`,
    earnedDelta: credits,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
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
  const earnedDelta = Math.max(0, Number(state.salaryBoost || 0) - Number(state.creditedSalaryBoost || 0));
  const taxDelta = Math.max(0, Number(state.taxContribution || 0) - Number(state.creditedTaxContribution || 0));
  const nextSalary = Number(session.annualSalary || 25000) + earnedDelta;
  const nextNetWorth = Number(session.cumulativeNetWorth || 0) + earnedDelta;
  const nextWorkLife = Math.max(45, Math.min(100, Number(session.workLifeBalance || 60) + (state.streak > 1 ? 3 : 0)));
  const nextSecurity = Math.max(45, Math.min(100, Number(session.jobSecurity || 75) + Math.round(state.readiness / 20)));
  const nextSavings = Math.max(0, Number(session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25)));
  const nextTaxPaid = Math.max(0, Number(session.taxPaid || 0) + taxDelta);

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
    savings: nextSavings,
    taxPaid: nextTaxPaid,
    jobSecurity: nextSecurity,
    workLifeBalance: nextWorkLife,
    checkpoint
  });
  state.creditedSalaryBoost = Number(state.salaryBoost || 0);
  state.creditedTaxContribution = Number(state.taxContribution || 0);
  if (earnedDelta || taxDelta) {
    pushEconomyLog({
      eventType: "progress-saved",
      checkpoint,
      label: meta.taskName || checkpoint,
      detail: meta.promptText || evidenceType,
      earnedDelta,
      taxDelta,
      annualSalaryAfter: nextSalary,
      netWorthAfter: nextNetWorth,
      savingsAfter: nextSavings,
      taxPaidAfter: nextTaxPaid
    });
  }

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

  const { data: existingProfile } = await supabase
    .from("player_profiles")
    .select("student_id, savings, tax_paid")
    .eq("student_id", student.id)
    .maybeSingle();

  await supabase.from("player_profiles").upsert({
    student_id: student.id,
    career_title: session.careerTitle || "Exam Strategist",
    annual_salary: nextSalary,
    cumulative_net_worth: nextNetWorth,
    savings: Math.max(0, Number(existingProfile?.savings || session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25))),
    tax_paid: Math.max(0, Number(existingProfile?.tax_paid || session.taxPaid || 0) + taxDelta),
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

function inferStageFromEvidence(row) {
  const type = String(row?.evidence_type || "").toLowerCase();
  const prompt = String(row?.prompt || "").toLowerCase();
  if (type === "revision-check" || prompt.includes("revision-arena")) return "content";
  if (type === "glossary-check" || prompt.includes("glossary-lock-in")) return "glossary";
  if (type === "decoder-breakdown" || prompt.includes("decoder-drill")) return "decoder";
  if (type === "est-response" || prompt.includes("boss-round")) return "boss";
  return null;
}

function getEvidencePreview(row) {
  try {
    const parsed = JSON.parse(row?.response_text || "");
    return parsed.response_text || parsed.prompt_text || row?.prompt || "Saved response";
  } catch (_) {
    return String(row?.response_text || row?.prompt || "Saved response");
  }
}

async function hydrateFromSupabase() {
  const student = state.student;
  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const { data: evidenceRows, error: evidenceError } = await supabase
    .from("assessment_evidence")
    .select("evidence_type, prompt, response_text, created_at")
    .eq("student_id", student.id)
    .eq("module_id", MODULE_ID)
    .order("created_at", { ascending: true });

  if (evidenceError) {
    console.error(evidenceError);
    return;
  }

  if (Array.isArray(evidenceRows) && evidenceRows.length) {
    state.evidenceLog = evidenceRows.map(row => {
      const stageId = inferStageFromEvidence(row);
      if (stageId) state.completed[stageId] = true;
      return {
        title: stageId ? `${STAGES.find(stage => stage.id === stageId)?.title || "Saved stage"} saved` : "Saved EST progress",
        detail: getEvidencePreview(row).slice(0, 160)
      };
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
    promptText: round.question,
    extraPayload: {
      forensic_brief: {
        verb: state.answers["decoder-verb"] || "",
        topic: state.answers["decoder-topic"] || "",
        context: state.answers["decoder-context"] || "",
        structure: state.answers["decoder-structure"] || ""
      }
    }
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
              : trainingConfig.type === "scenario"
                ? trainingConfig.scenarios.map(scenario => ({
                    item: scenario.prompt,
                    selected: state.answers[`training-scenario-${scenario.id}`] || "",
                    correct_answer: scenario.correct
                  }))
                : trainingConfig.rounds.map(round => ({
                    item: round.prompt,
                    selected: state.answers[`training-builder-${round.id}`] || "",
                    correct_answer: round.correct
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
  const batches = state.stageDeck?.glossaryBatches || [];
  const batch = getCurrentGlossaryBatch();
  if (state.glossaryRoundIndex < 3) return;

  batch.forEach(item => {
    const typedTerm = normaliseGlossaryTermText(state.glossaryRecallAnswers[`term-${item.id}`]);
    const typedKeyword = normaliseGlossaryTermText(state.glossaryRecallAnswers[`keyword-${item.id}`]);
    const termCorrect = typedTerm === normaliseGlossaryTermText(item.term);
    const keywordCorrect = item.keywords.some(keyword => typedKeyword.includes(normaliseGlossaryTermText(keyword)));
    const overallCorrect = termCorrect && keywordCorrect;
    state.glossaryRecallResults[item.id] = {
      term: item.term,
      keywords: item.keywords,
      termCorrect,
      keywordCorrect,
      overallCorrect
    };
  });

  if (state.glossaryBatchIndex < batches.length - 1) {
    state.glossaryBatchIndex += 1;
    state.glossaryPulse = "Nice. Next recall batch ready.";
    state.glossaryPulseType = "good";
    renderGlossaryStage();
    return;
  }

  const allResults = batches.flatMap(batchItems => batchItems.map(item => state.glossaryRecallResults[item.id]).filter(Boolean));
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  buildGlossaryCelebration(4, `${overallCorrect}/${total} final recall checks correct.`);
  renderGlossaryStage();
}

async function bankGlossaryResults() {
  const batches = state.stageDeck?.glossaryBatches || [];
  const allResults = batches.flatMap(batchItems => batchItems.map(item => state.glossaryRecallResults[item.id]).filter(Boolean));
  const durationSeconds = getCurrentStageDurationSeconds();
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  const scoreRatio = total ? overallCorrect / total : 0;
  const scorePercent = Math.round(scoreRatio * 100);
  awardStage("glossary", { scoreRatio });
  addEvidence("Glossary mastery run", `${overallCorrect}/${total} final recall checks correct • Best streak x${state.glossaryBestStreak} • Misses ${state.glossaryMisses}`);
  await saveProgress("glossary-lock-in", "glossary-check", `Glossary final recall: ${overallCorrect}/${total}`, scorePercent, {
    taskName: "Glossary Check",
    durationSeconds,
    promptText: "Match and recall glossary terms across four scaffolded rounds.",
    extraPayload: {
      round_summary: {
        rounds: GLOSSARY_ROUND_CONFIGS.map(item => item.title),
        total_terms: FULL_GLOSSARY_TERMS.length,
        best_streak: state.glossaryBestStreak,
        misses: state.glossaryMisses,
        round_rewards: state.glossaryRoundRewards,
        round_votes: state.glossaryRoundVotes
      },
      final_round_results: allResults
    }
  });
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  showFeedbackBox(scoreRatio >= 0.8 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Glossary score:</strong> ${overallCorrect}/${total} final recall checks correct.`,
    `Best streak: x${state.glossaryBestStreak}. Misses: ${state.glossaryMisses}.`,
    "Teachers can now inspect which terms were mastered or missed in the final recall round."
  ]);
}

async function submitBoss() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const textarea = document.getElementById("boss-response");
  const existingResponse = textarea ? textarea.value.trim() : "";
  if (!existingResponse) buildBossDraft();
  const response = textarea ? textarea.value.trim() : (state.answers.bossText || "");
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
      promptText: round.question,
      extraPayload: {
        showdown_choice: state.answers.bossShowdown || "",
        showdown_reason: state.answers.bossShowdownReason || "",
        scaffold_parts: getBossScaffoldLines(round).map((line, index) => ({
          label: line,
          response: state.answers[`boss-scaffold-${index}`] || ""
        }))
      }
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
  setLabMode(false);
  setStageMenuMode(false);
  state.selectedStageId = null;
  state.lastBossReview = null;
  state.contentGroupIndex = -1;
  state.contentView = "menu";
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
  scrollToTopSmooth();
}

async function init() {
  state.student = getLoggedInStudent();
  registerLeaveWarning();
  await hydrateFromSupabase();
  const [bank, contentStageConfig] = await Promise.all([
    loadBank(),
    loadContentStageConfig()
  ]);
  state.bank = bank;
  state.contentStageConfig = contentStageConfig;
  state.stageDeck = buildStageDeck(state.bank);
  state.contentView = "menu";
  setLabMode(false);
  setStageMenuMode(false);
  renderFocusNav();
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
  openContentGroupIntro,
  startContentGroup,
  nextContentGroup: () => moveContentGroup(1),
  prevContentGroup: () => moveContentGroup(-1),
  jumpToContentGroup,
  setTrainingChoice,
  setTrainingChoiceEncoded,
  setGlossarySelectedTerm,
  setGlossarySelectedSocket,
  setGlossaryMode,
  moveGlossaryStudy,
  flipGlossaryStudyCard,
  startGlossaryDrag,
  endGlossaryDrag,
  dropGlossaryTerm,
  handleGlossarySocketClick,
  nextGlossaryPhase,
  continueGlossaryRound,
  setGlossaryRoundVote,
  toggleReveal,
  setGlossaryRecallAnswer,
  setBossScaffold,
  setBossShowdownReason,
  buildBossDraft,
  setChoice,
  setChoiceEncoded,
  setBossVote,
  submitContent,
  submitDecoder,
  submitGlossary,
  submitBoss,
  returnToLab,
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
