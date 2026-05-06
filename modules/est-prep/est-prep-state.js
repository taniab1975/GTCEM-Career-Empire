// EST Prep state bundle. Loaded as a classic browser script.
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
  decoderRoundIndex: 0,
  decoderResults: {},
  contentGroupIndex: -1,
  contentView: "menu",
  contentGroupStartedAt: 0,
  contentGroupDurations: {},
  contentTopicBestScores: {},
  contentTopicVotes: {},
  contentTopicVoteSaves: {},
  contentTopicResetAt: {},
  lastContentTopicReview: null,
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
  glossaryRecallIndex: 0,
  glossaryRecallTransition: null,
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
  glossaryRunStartedAt: 0,
  glossaryHasStarted: false,
  glossaryMode: "play",
  glossaryStudyIndex: 0,
  glossaryTermStats: {},
  stageBestScores: {},
  arcFlows: {}
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

function persistESTProgressSnapshot() {
  const session = getPlayerSession();
  writePlayerSession({
    ...session,
    estPrepDeck: state.stageDeck,
    estPrepProgress: {
      selectedStageId: state.selectedStageId,
      marksBanked: state.marksBanked,
      readiness: state.readiness,
      confidence: state.confidence,
      salaryBoost: state.salaryBoost,
      creditedSalaryBoost: state.creditedSalaryBoost,
      taxContribution: state.taxContribution,
      creditedTaxContribution: state.creditedTaxContribution,
      answers: state.answers,
      decoderRoundIndex: state.decoderRoundIndex,
      decoderResults: state.decoderResults,
      contentGroupIndex: state.contentGroupIndex,
      contentView: state.contentView,
      arcFlows: state.arcFlows,
      contentTopicBestScores: state.contentTopicBestScores,
      contentTopicVotes: state.contentTopicVotes,
      contentTopicVoteSaves: state.contentTopicVoteSaves,
      contentTopicResetAt: state.contentTopicResetAt,
      lastContentTopicReview: state.lastContentTopicReview,
      completed: state.completed,
      stageBestScores: state.stageBestScores,
      glossaryAssignments: state.glossaryAssignments,
      glossaryBatchIndex: state.glossaryBatchIndex,
      glossaryRoundIndex: state.glossaryRoundIndex,
      glossaryHasStarted: state.glossaryHasStarted,
      glossaryStreak: state.glossaryStreak,
      glossaryBestStreak: state.glossaryBestStreak,
      glossaryMisses: state.glossaryMisses,
      glossaryRoundRewards: state.glossaryRoundRewards,
      glossaryRoundVotes: state.glossaryRoundVotes,
      glossaryRoundStartedAt: state.glossaryRoundStartedAt,
      glossaryRunStartedAt: state.glossaryRunStartedAt,
      glossaryRecallAnswers: state.glossaryRecallAnswers,
      glossaryRecallResults: state.glossaryRecallResults,
      glossaryRecallIndex: state.glossaryRecallIndex,
      glossaryTermStats: state.glossaryTermStats
    }
  });
}

function hydrateESTProgressSnapshot() {
  const session = getPlayerSession();
  const progress = session.estPrepProgress || {};
  if (session.estPrepDeck) {
    state.stageDeck = session.estPrepDeck;
  }
  state.selectedStageId = progress.selectedStageId || null;
  state.marksBanked = Number(progress.marksBanked || state.marksBanked || 0);
  state.readiness = Number(progress.readiness || state.readiness || 0);
  state.confidence = Number(progress.confidence || state.confidence || 40);
  state.salaryBoost = Number(progress.salaryBoost || state.salaryBoost || 0);
  state.creditedSalaryBoost = Number(progress.creditedSalaryBoost || state.creditedSalaryBoost || 0);
  state.taxContribution = Number(progress.taxContribution || state.taxContribution || 0);
  state.creditedTaxContribution = Number(progress.creditedTaxContribution || state.creditedTaxContribution || 0);
  state.answers = progress.answers || {};
  state.decoderRoundIndex = Number.isInteger(progress.decoderRoundIndex) ? progress.decoderRoundIndex : 0;
  state.decoderResults = progress.decoderResults || {};
  state.contentGroupIndex = Number.isInteger(progress.contentGroupIndex) ? progress.contentGroupIndex : -1;
  state.contentView = progress.contentView || "menu";
  state.arcFlows = progress.arcFlows || {};
  state.contentTopicBestScores = progress.contentTopicBestScores || {};
  state.contentTopicVotes = progress.contentTopicVotes || {};
  state.contentTopicVoteSaves = progress.contentTopicVoteSaves || {};
  state.contentTopicResetAt = progress.contentTopicResetAt || {};
  state.lastContentTopicReview = progress.lastContentTopicReview || null;
  state.completed = progress.completed || {};
  state.stageBestScores = progress.stageBestScores || {};
  state.glossaryAssignments = progress.glossaryAssignments || {};
  state.glossaryBatchIndex = progress.glossaryBatchIndex || 0;
  state.glossaryRoundIndex = progress.glossaryRoundIndex || 0;
  state.glossaryHasStarted = Boolean(progress.glossaryHasStarted || state.glossaryHasStarted);
  state.glossaryStreak = Number(progress.glossaryStreak || state.glossaryStreak || 0);
  state.glossaryBestStreak = Number(progress.glossaryBestStreak || state.glossaryBestStreak || 0);
  state.glossaryMisses = Number(progress.glossaryMisses || state.glossaryMisses || 0);
  state.glossaryRoundRewards = progress.glossaryRoundRewards || state.glossaryRoundRewards || {};
  state.glossaryRoundVotes = progress.glossaryRoundVotes || state.glossaryRoundVotes || {};
  state.glossaryRoundStartedAt = 0;
  state.glossaryRunStartedAt = Number(progress.glossaryRunStartedAt || state.glossaryRunStartedAt || 0);
  state.glossaryRecallAnswers = progress.glossaryRecallAnswers || {};
  state.glossaryRecallResults = progress.glossaryRecallResults || {};
  state.glossaryRecallIndex = Number(progress.glossaryRecallIndex || state.glossaryRecallIndex || 0);
  state.glossaryTermStats = progress.glossaryTermStats || state.glossaryTermStats || {};
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
    const response = await fetch(CONTENT_STAGE_CONFIG_PATH, { cache: "no-store" });
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

function getCurrentStageDurationSeconds() {
  if (!state.stageStartedAt) return null;
  return Math.max(1, Math.round((Date.now() - state.stageStartedAt) / 1000));
}

function addEvidence(title, detail) {
  state.evidenceLog.push({ title, detail });
  renderEvidence();
}
