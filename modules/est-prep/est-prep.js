const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "est-prep";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
};

const STAGES = [
  {
    id: "content",
    title: "EST Content Check",
    state: "Knowledge reactor",
    summary: "Check the actual revision content for this EST before you try to answer under pressure.",
    marks: 3,
    readiness: 18,
    credits: 1500,
    taxRate: 0.1
  },
  {
    id: "glossary",
    title: "Glossary Check",
    state: "Precision language",
    summary: "Use the correct SCSA term in context so your answer sounds precise, not vague.",
    marks: 3,
    readiness: 18,
    credits: 1500,
    taxRate: 0.1
  },
  {
    id: "decoder",
    title: "VTCS Decoder",
    state: "Question decode",
    summary: "Unpack the command verb, topic, context, and answer structure before you even start writing.",
    marks: 4,
    readiness: 24,
    credits: 2200,
    taxRate: 0.1
  },
  {
    id: "boss",
    title: "Boss Round",
    state: "EST simulation",
    summary: "Decode, plan, and write one EST-style response with model-marker feedback and bigger rewards.",
    marks: 6,
    readiness: 30,
    credits: 3200,
    taxRate: 0.1
  }
];

const CONTENT_ROUND = {
  prompt: "Choose the strongest content statement for each EST revision topic.",
  rounds: [
    {
      topic: "Lifelong learning",
      question: "Which statement best explains lifelong learning?",
      options: [
        "Lifelong learning is the ongoing development of knowledge and skills throughout life in response to changing work, study, and life demands.",
        "Lifelong learning only happens at school before a person starts work.",
        "Lifelong learning means choosing one career path and never changing direction."
      ],
      correct: "Lifelong learning is the ongoing development of knowledge and skills throughout life in response to changing work, study, and life demands."
    },
    {
      topic: "Unexpected life events",
      question: "Which list best identifies types of unexpected life events that can affect career planning?",
      options: [
        "Illness, injury, family responsibilities, financial pressure, and relationship changes.",
        "School uniforms, hobbies, and lunch orders.",
        "Only positive events such as promotions and holidays."
      ],
      correct: "Illness, injury, family responsibilities, financial pressure, and relationship changes."
    },
    {
      topic: "Personal finance",
      question: "Which statement best explains a strategy to manage personal finance?",
      options: [
        "Creating and following a budget can help a person control spending and plan for future costs.",
        "Ignoring fixed expenses is the easiest way to save money.",
        "Borrowing more money always solves budgeting problems."
      ],
      correct: "Creating and following a budget can help a person control spending and plan for future costs."
    }
  ]
};

const DECODER_ROUND = {
  question: "Explain the impact of climate change on career planning.",
  verbOptions: ["Identify", "Explain", "Describe", "Compare"],
  correctVerb: "Explain",
  topicOptions: ["Climate change", "Career planning", "Communication skills", "Initiative"],
  correctTopic: "Climate change",
  contextOptions: ["Career planning", "Personal finance", "Growth industries", "Selection criteria"],
  correctContext: "Career planning",
  structureOptions: [
    "Name one item only",
    "Point + because/how + result",
    "Similarity + difference",
    "Definition only"
  ],
  correctStructure: "Point + because/how + result",
  feedback:
    "Strong EST answers start before writing. Decode the verb, then identify the topic, then the context, then the structure the marks are really asking for."
};

const GLOSSARY_ROUND = {
  prompt: "Which glossary term best fits the definition or context?",
  scenario:
    "A student researches future job demand, salary trends, and where opportunities are growing before making study and training decisions.",
  options: [
    "Labour market information",
    "Initiative",
    "Communication skills",
    "Time management"
  ],
  correct: "Labour market information",
  definitionPrompt: "Which definition best matches a growth industry?",
  definitionOptions: [
    "An industry where employment opportunities are shrinking over time.",
    "An industry expected to expand and create future job opportunities.",
    "A job application document used before an interview.",
    "A personal risk that affects relationships."
  ],
  correctDefinition: "An industry expected to expand and create future job opportunities."
};

const BUILDER_ROUND = {
  question: "Explain one way unexpected life events can affect career planning.",
  banks: {
    point: [
      "Unexpected life events can interrupt a person's original career plan.",
      "Unexpected life events are always positive.",
      "Career planning never changes once a student leaves school."
    ],
    because: [
      "This can happen because illness, family responsibilities, or financial pressure may change timelines, study options, or work availability.",
      "This happens because career plans are fixed and should not be reviewed.",
      "This happens because unexpected events do not affect decision-making."
    ],
    result: [
      "As a result, a person may need to adjust goals, retrain, delay study, or choose a new pathway.",
      "As a result, there is no need to plan again.",
      "As a result, career development stops forever."
    ]
  },
  correct: {
    point: "Unexpected life events can interrupt a person's original career plan.",
    because: "This can happen because illness, family responsibilities, or financial pressure may change timelines, study options, or work availability.",
    result: "As a result, a person may need to adjust goals, retrain, delay study, or choose a new pathway."
  }
};

const BOSS_ROUND = {
  question: "Explain one way unexpected life events can affect career planning.",
  help: "Use the command word, the content you revised, and the glossary context term to build one tight EST-style answer.",
  scaffold:
    "Point: One way unexpected life events can affect career planning is...\nBecause: This can happen because...\nResult: As a result...",
  strongAnswer:
    "One way unexpected life events can affect career planning is by disrupting a person's original pathway. This can happen because illness, financial pressure, or family responsibilities may change study options, timelines, and work availability. As a result, a person may need to review their plan, adjust goals, or choose an alternative pathway.",
  conceptTags: ["Unexpected life events", "Career planning", "Explain"],
  commandOptions: ["Identify", "Explain", "Describe", "Compare"],
  correctCommand: "Explain",
  contentOptions: [
    "Unexpected life events can change study, work, or timing decisions and may require a person to adjust a career plan.",
    "Unexpected life events only matter after retirement.",
    "Unexpected life events never affect career planning."
  ],
  correctContent: "Unexpected life events can change study, work, or timing decisions and may require a person to adjust a career plan.",
  glossaryOptions: ["Career planning", "Communication skills", "Initiative", "Growth industry"],
  correctGlossary: "Career planning",
  communityOptions: [
    { id: "climate", label: "Climate and Sustainability" },
    { id: "tech", label: "Tech Education and Inclusion" },
    { id: "diversity", label: "Diversity and Economic Equity" },
    { id: "global", label: "Global Opportunity Access" }
  ]
};

const state = {
  student: null,
  selectedStageId: null,
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
  answers: {
    decoder: {},
    glossary: {},
    bossText: "",
    bossVote: ""
  }
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

function getLoggedInStudent() {
  const auth = getAuthState();
  const session = getPlayerSession();
  const login = auth.studentLogin || {};
  if (!login.id && !session.studentId) return null;
  return {
    id: login.id || session.studentId || null,
    username: login.username || session.username || "",
    displayName: login.displayName || session.playerName || "Student",
    classId: login.classId || session.classId || null,
    classCode: login.classCode || session.classCode || "",
    className: login.className || session.className || "",
    schoolName: login.schoolName || session.schoolName || ""
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
    const chips = [
      `Marks: ${state.marksBanked}`,
      `Readiness: ${state.readiness}%`,
      `Salary: ${formatCurrency(state.salaryBoost)}`,
      `Community Tax: ${formatCurrency(state.taxContribution)}`,
      `Streak: x${state.streak}`
    ];
    chipRow.innerHTML = chips.map(chip => `<span class="reward-chip">${escapeHtml(chip)}</span>`).join("");
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
  container.innerHTML = [
    { title: "Exam Readiness", detail: `${state.readiness}% and rising as you decode and respond accurately.` },
    { title: "Confidence", detail: `${state.confidence}% - strong rounds raise confidence, weak rounds flatten the streak.` },
    { title: "Salary Reward", detail: `${formatCurrency(state.salaryBoost)} added to your wider Career Empire profile.` },
    { title: "Community Tax", detail: `${formatCurrency(state.taxContribution)} heading into the class/community economy.` }
  ].map(item => `<div class="resource-item"><strong>${item.title}</strong><p>${item.detail}</p></div>`).join("");
}

function renderDebrief() {
  const container = document.getElementById("debrief-log");
  if (!container) return;
  if (!state.debriefLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No debrief yet</strong><p>Clear your first stage and the EST lab will start banking rewards and feedback.</p></div>';
    return;
  }
  container.innerHTML = state.debriefLog.slice(-4).reverse().map(item => `
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
  container.innerHTML = state.evidenceLog.slice(-5).reverse().map(item => `
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

function renderContentStage() {
  setText("stage-title", "EST Content Check");
  setText("stage-subtitle", "Use the actual revision content for this EST, not just generic exam technique.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Revision Arena</div>
      <h3>${escapeHtml(CONTENT_ROUND.prompt)}</h3>
      <p>This lab checks knowledge only. No glossary traps and no command-word decoding yet. Just the content you need to know for this upcoming EST.</p>
    </div>
    ${CONTENT_ROUND.rounds.map((round, index) => `
      <div class="panel">
        <div class="section-title">
          <h2>${escapeHtml(round.topic)}</h2>
          <p>Topic ${index + 1}</p>
        </div>
        <p class="small-copy">${escapeHtml(round.question)}</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.options.map(option => `
            <button type="button" class="choice-button ${state.answers[`content-${index}`] === option ? "selected live-selected" : ""}" data-group="content-${index}" data-value="${escapeHtml(option)}" onclick="window.ESTPrep.setChoiceEncoded('content-${index}', '${encodeURIComponent(option)}')">
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="written-stage">
      <strong>Why this matters</strong>
      <p class="small-copy">The EST is not only about exam structure. You also need accurate content points ready to use under time pressure.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Content Results</button>
    </div>
  `);
}

function renderDecoderStage() {
  setText("stage-title", "VTCS Decoder");
  setText("stage-subtitle", "Use verb, topic, context, and structure before you even think about writing.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">VTCS Core</div>
      <h3>${escapeHtml(DECODER_ROUND.question)}</h3>
      <p>${escapeHtml(DECODER_ROUND.feedback)}</p>
    </div>
    <div class="prompt-grid">
      <div class="prompt-card"><strong>Verb</strong><p>What does the question want you to do?</p></div>
      <div class="prompt-card"><strong>Topic</strong><p>What concept is being assessed?</p></div>
      <div class="prompt-card"><strong>Context</strong><p>What narrows the response?</p></div>
      <div class="prompt-card"><strong>Structure</strong><p>How should you build the answer?</p></div>
    </div>
    ${renderOptionGroup("decoder-verb", "Choose the command verb", DECODER_ROUND.verbOptions)}
    ${renderOptionGroup("decoder-topic", "Choose the topic", DECODER_ROUND.topicOptions)}
    ${renderOptionGroup("decoder-context", "Choose the context term", DECODER_ROUND.contextOptions)}
    ${renderOptionGroup("decoder-structure", "Choose the answer structure", DECODER_ROUND.structureOptions)}
    <div class="written-stage">
      <strong>Why this matters</strong>
      <p class="small-copy">Good students lose marks when they misread the question. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">Bank Decoder Results</button>
    </div>
  `);
}

function renderGlossaryStage() {
  setText("stage-title", "Glossary Check");
  setText("stage-subtitle", "This lab is about precise EST terminology, not broad content revision.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Term Vault</div>
      <h3>${escapeHtml(GLOSSARY_ROUND.prompt)}</h3>
      <p>Match the correct glossary term to the context, then confirm the definition. This lab is about terminology only.</p>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Context match</h2>
        <p>Choose one</p>
      </div>
      <p class="small-copy">${escapeHtml(GLOSSARY_ROUND.scenario)}</p>
      <div class="mcq-grid" style="margin-top: 14px;">
        ${GLOSSARY_ROUND.options.map(option => `
          <button type="button" class="choice-button ${state.answers["glossary-term"] === option ? "selected live-selected" : ""}" data-group="glossary-term" data-value="${escapeHtml(option)}" onclick="window.ESTPrep.setChoiceEncoded('glossary-term', '${encodeURIComponent(option)}')">
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
    ${renderOptionGroup("glossary-definition", "Definition check", GLOSSARY_ROUND.definitionOptions)}
    <div class="written-stage">
      <strong>Precision beats waffle</strong>
      <p class="small-copy">The EST rewards accurate language. This lab trains the wording that makes answers sound deliberate and exam-ready.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()">Bank Glossary Results</button>
    </div>
  `);
}

function renderBossStage() {
  setText("stage-title", "EST Boss Round");
  setText("stage-subtitle", "Pull command word, content knowledge, glossary context, and answer structure together in one exam-style battle.");
  const communityOptions = BOSS_ROUND.communityOptions.map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Direct 10% of this round's income to this class/community focus.</small>
    </button>
  `).join("");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Boss Round</div>
      <h3>${escapeHtml(BOSS_ROUND.question)}</h3>
      <p>${escapeHtml(BOSS_ROUND.help)} Use point + because/how + result when you write.</p>
    </div>
    <div class="prompt-grid">
      ${BOSS_ROUND.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>Point + because/how + result</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", BOSS_ROUND.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", BOSS_ROUND.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", BOSS_ROUND.glossaryOptions)}
    <div class="written-stage">
      <strong>Response scaffold</strong>
      <p class="small-copy">${escapeHtml(BOSS_ROUND.scaffold)}</p>
      <textarea id="boss-response" placeholder="Write your EST-style answer here...">${escapeHtml(state.answers.bossText || "")}</textarea>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Community Contribution</h2>
        <p class="status-watch">Class impact</p>
      </div>
      <p class="small-copy">You just answered a boss-round question and can bank a bigger reward. Ten percent of that reward will go into your class community contribution. Choose where you want your taxes to flow.</p>
      <div class="choice-grid">${communityOptions}</div>
    </div>
    <div class="written-stage">
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Finish Boss Round</button>
    </div>
  `);
}

function renderOptionGroup(groupKey, label, options) {
  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(label)}</h2>
        <p>Choose one</p>
      </div>
      <div class="mcq-grid">
        ${options.map(option => `
          <button type="button" class="choice-button ${state.answers[groupKey] === option ? "selected live-selected" : ""}" data-group="${escapeHtml(groupKey)}" data-value="${escapeHtml(option)}" onclick="window.ESTPrep.setChoiceEncoded('${groupKey}', '${encodeURIComponent(option)}')">
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function openStage(stageId) {
  state.selectedStageId = stageId;
  renderMap();
  if (stageId === "content") renderContentStage();
  if (stageId === "decoder") renderDecoderStage();
  if (stageId === "glossary") renderGlossaryStage();
  if (stageId === "boss") renderBossStage();
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
  setSelectionPulse("boss-vote", BOSS_ROUND.communityOptions.find(option => option.id === optionId)?.label || optionId);
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
  const labels = {
    "content-0": "Lifelong learning answer locked in",
    "content-1": "Unexpected life events list locked in",
    "content-2": "Personal finance answer locked in",
    "decoder-verb": "Command verb locked in",
    "decoder-topic": "Topic target locked in",
    "decoder-context": "Context term locked in",
    "decoder-structure": "Answer structure locked in",
    "glossary-term": "Glossary term selected",
    "glossary-definition": "Definition selected",
    "boss-command": "Boss-round command word locked in",
    "boss-content": "Boss-round content point locked in",
    "boss-glossary": "Boss-round glossary term locked in",
    "boss-vote": "Community target selected"
  };
  state.recentReward = {
    type: "positive",
    title: labels[groupKey] || "Choice locked in",
    detail: `${option} is banked. Keep building the stage to convert this into marks, readiness, salary, and class impact.`
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
  state.confidence = Math.max(0, Math.min(100, state.confidence + (outcome.scoreRatio >= 0.66 ? 8 : outcome.scoreRatio >= 0.34 ? 3 : -2)));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.streak = outcome.scoreRatio >= 0.66 ? Math.min(5, state.streak + 1) : 1;
  state.recentReward = {
    type: outcome.scoreRatio >= 0.66 ? "positive" : "warning",
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

async function saveProgress(checkpoint, evidenceText = "") {
  const student = state.student;
  if (!student?.id) return;
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    writePlayerSession({
      checkpoint,
      annualSalary: (getPlayerSession().annualSalary || 0) + state.salaryBoost,
      cumulativeNetWorth: (getPlayerSession().cumulativeNetWorth || 0) + state.salaryBoost
    });
    return;
  }

  const completionPercent = Math.round((Object.keys(state.completed).length / STAGES.length) * 100);
  const masteryPercent = Math.min(100, Math.round((state.marksBanked / 16) * 100));

  await supabase.from("student_module_progress").upsert({
    student_id: student.id,
    class_id: student.classId,
    module_slug: MODULE_ID,
    completion_percent: completionPercent,
    mastery_percent: masteryPercent,
    checkpoint,
    updated_at: new Date().toISOString()
  }, { onConflict: "student_id,module_slug" });

  if (evidenceText) {
    await supabase.from("assessment_evidence").insert({
      student_id: student.id,
      class_id: student.classId,
      module_slug: MODULE_ID,
      prompt: checkpoint,
      response_text: evidenceText,
      created_at: new Date().toISOString()
    });
  }

  const session = getPlayerSession();
  const currentSalary = Number(session.annualSalary || 25000);
  const currentNetWorth = Number(session.cumulativeNetWorth || 0);
  const nextSalary = currentSalary + state.salaryBoost;
  const nextNetWorth = currentNetWorth + state.salaryBoost;
  const workLifeBalance = Math.max(45, Math.min(100, Number(session.workLifeBalance || 60) + (state.streak > 1 ? 3 : 0)));
  const jobSecurity = Math.max(45, Math.min(100, Number(session.jobSecurity || 75) + Math.round(state.readiness / 20)));

  await supabase.from("player_profiles").upsert({
    student_id: student.id,
    career_title: session.careerTitle || "Exam Strategist",
    annual_salary: nextSalary,
    cumulative_net_worth: nextNetWorth,
    career_level: Number(session.careerLevel || 1),
    job_security: jobSecurity,
    work_life_balance: workLifeBalance,
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
      cause: state.answers.bossVote,
      created_at: new Date().toISOString()
    });
  }

  writePlayerSession({
    annualSalary: nextSalary,
    cumulativeNetWorth: nextNetWorth,
    jobSecurity,
    workLifeBalance
  });
}

function showFeedbackBox(type, lines) {
  renderStageRoot(`
    <div class="feedback-box ${type}">
      ${lines.map(line => `<p>${line}</p>`).join("")}
      <p><button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button></p>
    </div>
  `);
}

async function submitDecoder() {
  const correctCount = [
    state.answers["decoder-verb"] === DECODER_ROUND.correctVerb,
    state.answers["decoder-topic"] === DECODER_ROUND.correctTopic,
    state.answers["decoder-context"] === DECODER_ROUND.correctContext,
    state.answers["decoder-structure"] === DECODER_ROUND.correctStructure
  ].filter(Boolean).length;
  const scoreRatio = correctCount / 4;
  awardStage("decoder", { scoreRatio });
  addEvidence("Decoded EST question", `${DECODER_ROUND.question} • Verb: ${state.answers["decoder-verb"] || "not chosen"} • Topic: ${state.answers["decoder-topic"] || "not chosen"} • Context: ${state.answers["decoder-context"] || "not chosen"} • Structure: ${state.answers["decoder-structure"] || "not chosen"}`);
  await saveProgress("decoder-drill", `Decoded question: ${DECODER_ROUND.question}`);
  showFeedbackBox(scoreRatio >= 0.75 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Decoder results:</strong> ${correctCount}/4 parts correct.`,
    `Best reading: <strong>Explain</strong> the impact of <strong>climate change</strong> on <strong>career planning</strong>, using a <strong>point + because/how + result</strong> structure.`,
    `You just banked marks, salary reward, and class contribution by reading the question properly before writing.`
  ]);
}

async function submitContent() {
  const correctCount = CONTENT_ROUND.rounds.filter((round, index) => state.answers[`content-${index}`] === round.correct).length;
  const scoreRatio = correctCount / CONTENT_ROUND.rounds.length;
  awardStage("content", { scoreRatio });
  addEvidence("EST content check", CONTENT_ROUND.rounds.map((round, index) => `${round.topic}: ${state.answers[`content-${index}`] || "not chosen"}`).join(" • "));
  await saveProgress("revision-arena", `Content check accuracy: ${correctCount}/${CONTENT_ROUND.rounds.length}`);
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Content check:</strong> ${correctCount}/${CONTENT_ROUND.rounds.length} strongest answer points selected.`,
    `This stage is about knowing the actual assessed content for this EST, not just learning exam technique.`,
    `Your strongest knowledge points are what later feed the Decoder and Boss Round responses.`
  ]);
}

async function submitGlossary() {
  const correctCount = [
    state.answers["glossary-term"] === GLOSSARY_ROUND.correct,
    state.answers["glossary-definition"] === GLOSSARY_ROUND.correctDefinition
  ].filter(Boolean).length;
  const scoreRatio = correctCount / 2;
  awardStage("glossary", { scoreRatio });
  addEvidence("Glossary lock-in", `${state.answers["glossary-term"] || "No term chosen"} • ${state.answers["glossary-definition"] || "No definition chosen"}`);
  await saveProgress("glossary-lock-in", `Glossary stage accuracy: ${correctCount}/2`);
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Glossary score:</strong> ${correctCount}/2 correct.`,
    `For this round, the strongest choices were <strong>Labour market information</strong> and the definition of <strong>a growth industry</strong> as an expanding sector expected to create future jobs.`,
    `Precision language makes EST answers sound deliberate and exam-ready.`
  ]);
}

async function submitBoss() {
  const textarea = document.getElementById("boss-response");
  const response = textarea ? textarea.value.trim() : "";
  state.answers.bossText = response;
  const commandCorrect = state.answers["boss-command"] === BOSS_ROUND.correctCommand;
  const contentCorrect = state.answers["boss-content"] === BOSS_ROUND.correctContent;
  const glossaryCorrect = state.answers["boss-glossary"] === BOSS_ROUND.correctGlossary;
  const hasPoint = /(unexpected life events|career planning|pathway|plan)/i.test(response);
  const hasBecause = /(because|financial pressure|family responsibilities|illness|this can happen)/i.test(response);
  const hasResult = /(as a result|therefore|may need to|adjust|alternative pathway)/i.test(response);
  const scoreRatio = [commandCorrect, contentCorrect, glossaryCorrect, hasPoint, hasBecause, hasResult].filter(Boolean).length / 6;
  awardStage("boss", { scoreRatio });
  addEvidence("Boss round EST answer", response || "No boss-round answer entered");
  await saveProgress("boss-round", response || "No boss-round response");
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Boss round complete.</strong> You banked a larger EST reward and fed 10% into your class community contribution.`,
    `This boss round checked six things: command word, content, glossary context, point, because/how, and result.`,
    `Model marker logic: ${escapeHtml(BOSS_ROUND.strongAnswer)}`
  ]);
}

function returnToTrack() {
  state.selectedStageId = null;
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
}

function init() {
  state.student = getLoggedInStudent();
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

init();
