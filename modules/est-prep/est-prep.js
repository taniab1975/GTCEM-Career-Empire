const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "est-prep";
const BANK_PATH = "../../data/modules/est-prep-bank.json";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
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
  lastBossReview: null
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
  const contentRounds = pickRandom(bank.contentRounds || [], 5);
  const glossaryRounds = pickRandom(glossaryTerms, Math.min(4, glossaryTerms.length)).map(term => {
    const distractors = pickRandom(glossaryTerms.filter(item => item.term !== term.term), 3);
    return {
      term,
      scenarioOptions: shuffle([term.term, ...distractors.map(item => item.term)]),
      definitionOptions: shuffle([term.definition, ...distractors.map(item => item.definition)])
    };
  });

  return {
    contentRounds,
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

function renderContentStage() {
  const rounds = state.stageDeck?.contentRounds || [];
  setText("stage-title", "EST Content Check");
  setText("stage-subtitle", "Use the assessed revision content, not just generic exam technique.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Revision Arena</div>
      <h3>Choose the strongest content statement for each EST revision topic.</h3>
      <p>This bank rotates across the revision topics so the module can keep testing recall, not memorising one static set.</p>
    </div>
    ${rounds.map((round, index) => `
      <div class="panel">
        <div class="section-title">
          <h2>${escapeHtml(round.topic)}</h2>
          <p>Topic ${index + 1}</p>
        </div>
        <p class="small-copy">${escapeHtml(round.question)}</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.options.map(option => `
            <button
              type="button"
              class="choice-button ${state.answers[`content-${index}`] === option ? "selected live-selected" : ""}"
              data-group="content-${index}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('content-${index}', '${encodeURIComponent(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="written-stage">
      <strong>Why this matters</strong>
      <p class="small-copy">The EST rewards accurate content points under pressure. This stage is about having the right knowledge ready before you start building answers.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Content Results</button>
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

function openStage(stageId) {
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  state.stageStartedAt = Date.now();
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
      response_text: evidenceText
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
  const rounds = state.stageDeck?.contentRounds || [];
  const durationSeconds = getCurrentStageDurationSeconds();
  const correctCount = rounds.filter((round, index) => state.answers[`content-${index}`] === round.correct).length;
  const scoreRatio = rounds.length ? correctCount / rounds.length : 0;
  awardStage("content", { scoreRatio });
  addEvidence("EST content check", rounds.map((round, index) => `${round.topic}: ${state.answers[`content-${index}`] || "not chosen"}`).join(" • "));
  await saveProgress("revision-arena", "revision-check", `Content check accuracy: ${correctCount}/${rounds.length}`, Math.round(scoreRatio * 100), {
    taskName: "EST Content Check",
    durationSeconds,
    promptText: "Choose the strongest content statement for each EST revision topic."
  });
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Content check:</strong> ${correctCount}/${rounds.length} strongest answer points selected.`,
    "This stage is about knowing the actual assessed content for this EST, not just learning exam technique.",
    "Those content points are what later feed the decoder and boss-round responses."
  ]);
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
