async function loadEmployabilitySkills() {
  const response = await fetch("../data/employability-skills.json");
  if (!response.ok) throw new Error("Could not load employability skills.");
  return response.json();
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") {
    return null;
  }
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function getPlayers() {
  return readJsonStorage("career-empire-players", []);
}

function mapRemotePlayerProfile(row) {
  const student = row.students || {};
  const classRecord = student.classes || {};
  const schoolRecord = student.schools || {};
  return {
    id: row.student_id,
    player_name: student.display_name || student.username || "Unknown",
    school_name: schoolRecord.name || "",
    class_code: classRecord.class_code || "",
    career_title: row.career_title || "Intern",
    annual_salary: row.annual_salary || 0,
    cumulative_net_worth: row.cumulative_net_worth || 0,
    career_level: row.career_level || 1,
    job_security: row.job_security || 0,
    work_life_balance: row.work_life_balance || 0,
    community_vote: row.last_community_vote || "none",
    years_played: row.years_played || 0,
    tech_mastery: row.tech_mastery || 0,
    climate_mastery: row.climate_mastery || 0,
    demo_mastery: row.demo_mastery || 0,
    economic_mastery: row.economic_mastery || 0,
    timestamp: row.updated_at || new Date().toISOString()
  };
}

async function getPlayers() {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return readJsonStorage("career-empire-players", []);

  const { data, error } = await supabase
    .from("player_profiles")
    .select(`
      student_id,
      career_title,
      annual_salary,
      cumulative_net_worth,
      career_level,
      job_security,
      work_life_balance,
      years_played,
      tech_mastery,
      climate_mastery,
      demo_mastery,
      economic_mastery,
      last_community_vote,
      updated_at,
      students!inner(
        display_name,
        username,
        classes(class_code, name),
        schools(name)
      )
    `);

  if (error) {
    console.error(error);
    return readJsonStorage("career-empire-players", []);
  }

  return (data || []).map(mapRemotePlayerProfile);
}

async function getCurrentStudentAssetCount() {
  const authState = getAuthPrototypeState();
  const studentId = authState?.studentLogin?.id;
  if (!studentId) return null;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("player_assets")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId);

  if (error) {
    console.error(error);
    return null;
  }
  return typeof count === "number" ? count : null;
}

function getCurrentPlayerSession() {
  return readJsonStorage("career-empire-session", null);
}

function getTeacherSession() {
  return readJsonStorage("career-empire-teacher-session", null);
}

function getAuthPrototypeState() {
  return readJsonStorage("career-empire-auth-demo", {});
}

function getActiveTeacherContext() {
  const authState = getAuthPrototypeState();
  const teacherSession = getTeacherSession();
  return {
    teacher: authState.teacher || null,
    teacherLogin: authState.teacherLogin || null,
    classroom: authState.classroom || null,
    teacherSession
  };
}

function parseTime(value) {
  const timestamp = Date.parse(value || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function dedupeLatestPlayers(players) {
  const latest = new Map();
  players.forEach(player => {
    const key = `${player.player_name || "unknown"}::${player.class_code || ""}`;
    const current = latest.get(key);
    if (!current || parseTime(player.timestamp) > parseTime(current.timestamp)) {
      latest.set(key, player);
    }
  });
  return [...latest.values()];
}

function getPlayerHistory(players, session) {
  if (!session || !session.playerName) return [];
  return players
    .filter(player => player.player_name === session.playerName && (!session.classCode || player.class_code === session.classCode))
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp));
}

function getCurrentPlayerRecord(players, session) {
  const history = getPlayerHistory(players, session);
  if (history.length) return history[0];
  return [...players].sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))[0] || null;
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function deriveEmployabilityProgress(record) {
  if (!record) {
    return {
      "communication": 0,
      "digital-literacy": 0,
      "teamwork": 0,
      "time-management": 0,
      "critical-thinking": 0,
      "problem-solving": 0
    };
  }

  const tech = Number(record.tech_mastery || 0);
  const climate = Number(record.climate_mastery || 0);
  const demo = Number(record.demo_mastery || 0);
  const economic = Number(record.economic_mastery || 0);
  const balance = Number(record.work_life_balance || 0);

  return {
    "communication": Math.round((demo + economic) / 2),
    "digital-literacy": tech,
    "teamwork": demo,
    "time-management": Math.round((balance + climate) / 2),
    "critical-thinking": Math.round((tech + climate + demo + economic) / 4),
    "problem-solving": Math.round((tech + climate + economic) / 3)
  };
}

function getWeakestSkill(progressMap) {
  const entries = Object.entries(progressMap);
  if (!entries.length) return ["communication", 0];
  return entries.reduce((lowest, entry) => entry[1] < lowest[1] ? entry : lowest, entries[0]);
}

function getStrongestSkill(progressMap) {
  const entries = Object.entries(progressMap);
  if (!entries.length) return ["communication", 0];
  return entries.reduce((highest, entry) => entry[1] > highest[1] ? entry : highest, entries[0]);
}

function createProgressBar(value, variant = "") {
  return `
    <div class="progress-track">
      <div class="progress-fill ${variant}" style="width: ${value}%"></div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBadge(label, logoPath = "", logoLabel = "") {
  return `<span class="badge ${logoPath ? "with-logo" : ""}">${logoPath ? `<img class="badge-logo" src="${logoPath}" alt="${escapeHtml(logoLabel || label)} logo">` : ""}${escapeHtml(label)}</span>`;
}

function renderStudentModules(modules) {
  const container = document.getElementById("student-module-grid");
  if (!container) return;

  container.innerHTML = modules.map(module => `
    <article class="module-card ${module.spotlight ? "spotlight" : ""}">
      <div class="module-header">
        ${module.logoPath ? `<img class="module-logo" src="${module.logoPath}" alt="${escapeHtml(module.logoLabel || module.title)} logo">` : ""}
        <div>
          <div class="kicker">${module.state}</div>
          <h3>${module.title}</h3>
        </div>
      </div>
      <p>${module.summary}</p>
      ${createProgressBar(module.progress, module.variant)}
      <div class="section-title">
        <p>${module.progress}% complete</p>
        <p>${module.mastery}% mastery</p>
      </div>
      <div class="pill-row">
        ${module.tags.map(tag => `<span class="pill">${tag}</span>`).join("")}
      </div>
      ${module.launchPath ? `<div class="module-actions"><a class="module-link" href="${module.launchPath}">${module.launchLabel || "Open Module"}</a></div>` : ""}
    </article>
  `).join("");
}

function renderStudentTimeline(items) {
  const container = document.getElementById("student-timeline");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function renderStudentShopPreview(items) {
  const container = document.getElementById("student-shop-preview");
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="module-card ${item.spotlight ? "spotlight" : ""}">
      <div class="kicker">${item.state}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="pill-row">
        ${item.tags.map(tag => `<span class="pill">${tag}</span>`).join("")}
      </div>
      <div class="module-actions">
        <a class="module-link" href="${item.launchPath}">${item.launchLabel}</a>
      </div>
    </article>
  `).join("");
}

function renderTeacherInterventions(items) {
  const container = document.getElementById("teacher-interventions");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <div class="timeline-header">
        ${item.logoPath ? `<img class="timeline-logo" src="${item.logoPath}" alt="${escapeHtml(item.logoLabel || item.title)} logo">` : ""}
        <strong>${item.title}</strong>
      </div>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function renderTeacherRosterActivity(items) {
  const container = document.getElementById("teacher-roster-activity");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No roster activity yet</strong><p>Once students log in and play, their activity will appear here.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function renderTeacherEvidenceList(items) {
  const container = document.getElementById("teacher-evidence-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No evidence submitted yet</strong><p>Typed reflections and lock-in tasks will appear here after students complete them.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function getSkillCategoryById(skillsData, skillId) {
  return skillsData.categories.find(category => category.id === skillId) || null;
}

function renderTeacherModuleHealth(items) {
  const container = document.getElementById("teacher-module-health");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <article class="module-card ${item.spotlight ? "spotlight" : ""}">
      <div class="kicker">${item.status}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      ${createProgressBar(item.completion, item.variant)}
      <div class="section-title">
        <p>${item.completion}% completion</p>
        <p>${item.mastery}% class mastery</p>
      </div>
    </article>
  `).join("");
}

function renderSkills(skillsData, targetId, progressMap) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = skillsData.categories.map(category => {
    const progress = progressMap[category.id] || 0;
    return `
      <article class="skill-card">
        <div class="skill-header">
          <img class="skill-logo" src="${category.logoPath || ""}" alt="${category.title} logo">
          <div>
            <div class="kicker">${category.title}</div>
            <h3>${progress}%</h3>
          </div>
        </div>
        <p>${category.description}</p>
        ${createProgressBar(progress)}
        <div class="pill-row">
          ${category.subskills.slice(0, 3).map(subskill => `<span class="pill">${subskill.title}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function formatDateTime(value) {
  if (!value) return "Not yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not yet" : date.toLocaleString();
}

async function getTeacherDashboardData() {
  const supabase = await getSupabaseClientOrNull();
  const context = getActiveTeacherContext();
  if (!supabase || !context.classroom?.id) {
    return null;
  }

  const classroomId = context.classroom.id;

  const [{ data: students, error: studentsError }, { data: moduleProgress, error: moduleProgressError }, { data: evidenceRows, error: evidenceError }, { data: voteRows, error: votesError }, { data: profileRows, error: profilesError }] = await Promise.all([
    supabase
      .from("students")
      .select("id, display_name, username, created_at, last_login_at, class_id")
      .eq("class_id", classroomId)
      .order("created_at", { ascending: true }),
    supabase
      .from("student_module_progress")
      .select("student_id, module_slug, completion_percent, mastery_percent, updated_at")
      .eq("class_id", classroomId),
    supabase
      .from("assessment_evidence")
      .select("student_id, prompt, response_text, module_slug, created_at")
      .eq("class_id", classroomId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("community_votes")
      .select("student_id, cause, created_at")
      .eq("class_id", classroomId),
    supabase
      .from("player_profiles")
      .select(`
        student_id,
        career_title,
        annual_salary,
        cumulative_net_worth,
        career_level,
        job_security,
        work_life_balance,
        years_played,
        tech_mastery,
        climate_mastery,
        demo_mastery,
        economic_mastery,
        last_community_vote,
        updated_at,
        students!inner(
          id,
          display_name,
          username,
          class_id,
          classes(class_code, name),
          schools(name)
        )
      `)
      .eq("students.class_id", classroomId)
  ]);

  if (studentsError) throw studentsError;
  if (moduleProgressError) throw moduleProgressError;
  if (evidenceError) throw evidenceError;
  if (votesError) throw votesError;
  if (profilesError) throw profilesError;

  return {
    context,
    students: students || [],
    moduleProgress: moduleProgress || [],
    evidenceRows: evidenceRows || [],
    voteRows: voteRows || [],
    profileRows: (profileRows || []).map(mapRemotePlayerProfile)
  };
}

async function renderStudentLiveData(players, skillsData) {
  const session = getCurrentPlayerSession();
  const authState = getAuthPrototypeState();
  const record = getCurrentPlayerRecord(players, session);
  const history = getPlayerHistory(players, session);
  const progressMap = deriveEmployabilityProgress(record);
  const employabilityScore = average(Object.values(progressMap));
  const weakestSkillId = getWeakestSkill(progressMap)[0];
  const strongestSkillId = getStrongestSkill(progressMap)[0];
  const weakestSkill = skillsData.categories.find(category => category.id === weakestSkillId);
  const strongestSkill = skillsData.categories.find(category => category.id === strongestSkillId);
  const overallMastery = Math.round((
    Number(record?.tech_mastery || 0) +
    Number(record?.climate_mastery || 0) +
    Number(record?.demo_mastery || 0) +
    Number(record?.economic_mastery || 0)
  ) / 4);
  const moduleCompletion = Math.min(100, Number(record?.years_played || 0) * 18);
  const taxPaid = Math.floor(Number(record?.cumulative_net_worth || 0) * 0.1);
  const assetCount = await getCurrentStudentAssetCount();
  const assetsOwned = assetCount ?? Math.max(0, Math.floor(Number(record?.cumulative_net_worth || 0) / 25000));

  setText("student-hero-title", record ? `${record.player_name}'s Career Empire` : "Build your future, not just your score.");
  if (!record && authState?.studentLogin?.displayName) {
    setText("student-hero-title", `${authState.studentLogin.displayName}'s Career Empire`);
  }
  setText(
    "student-hero-subtitle",
    record
      ? `${record.career_title || "Professional"} from ${record.school_name || "your class"} with ${overallMastery}% overall megatrend mastery and ${record.years_played || 0} years played.`
      : authState?.studentLogin?.username
        ? `Signed in as ${authState.studentLogin.username}. Launch the game to begin building live module progress and shared career stats.`
        : "Launch the Megatrends game first, then come back here to see your live player profile."
  );

  const badgeStack = document.getElementById("student-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = record ? [
      renderBadge(`Salary: ${formatCurrency(record.annual_salary)}`),
      renderBadge(`Net Worth: ${formatCurrency(record.cumulative_net_worth)}`),
      renderBadge(`Work-Life Balance: ${record.work_life_balance || 0}%`),
      renderBadge(`Job Security: ${record.job_security || 0}%`),
      renderBadge(`Strongest Skill: ${strongestSkill?.title || "Not yet clear"}`, strongestSkill?.logoPath, strongestSkill?.title),
      renderBadge(`Class Code: ${record.class_code || "Not joined"}`)
    ].join("") : authState?.studentLogin?.username
      ? [
        renderBadge(`Student: ${authState.studentLogin.displayName || authState.studentLogin.username}`),
        renderBadge(`Username: ${authState.studentLogin.username}`),
        renderBadge("Live gameplay stats will appear after the first saved session")
      ].join("")
      : '<span class="badge">No active student session yet</span>';
  }

  setText("student-focus-text", weakestSkill ? `${weakestSkill.title} is your current focus area. The next module should target this skill more directly.` : "Launch a module to begin skill tracking.");
  setText("student-overall-completion", `${moduleCompletion}%`);
  setText("student-overall-completion-note", record ? `${record.years_played || 0} completed rounds currently recorded` : "No gameplay recorded yet");
  setText("student-employability-score", `${employabilityScore}%`);
  setText("student-tax-paid", formatCurrency(taxPaid));
  setText("student-assets-owned", String(assetsOwned));

  renderSkills(skillsData, "student-skill-grid", progressMap);
  renderStudentModules([
    {
      title: "Megatrends",
      state: record ? "Module 1 Live" : "Ready to start",
      summary: record ? "Your live Megatrends record is feeding your shared career profile." : "Start the game to begin building your first module record.",
      progress: moduleCompletion,
      mastery: overallMastery,
      variant: "",
      spotlight: true,
      logoPath: skillsData.categories.find(category => category.id === "digital-literacy")?.logoPath,
      logoLabel: "Digital Literacy",
      launchPath: "../index.html",
      launchLabel: "Open Megatrends",
      tags: ["Live data", "Career stats", "Class impact"]
    },
    {
      title: "Lifelong Learning",
      state: "Prototype live",
      summary: "Build pathway flexibility, training choices, and professional growth through the first playable Lifelong Learning prototype.",
      progress: 0,
      mastery: 0,
      variant: "green",
      spotlight: false,
      logoPath: skillsData.categories.find(category => category.id === "time-management")?.logoPath,
      logoLabel: "Time Management",
      launchPath: "../modules/lifelong-learning/index.html",
      launchLabel: "Open Lifelong Learning",
      tags: ["Planning", "Growth", "Reflection"]
    }
  ]);
  renderStudentShopPreview([
    {
      title: "Global Shop",
      state: assetsOwned ? `${assetsOwned} owned` : "Ready to build",
      summary: assetsOwned
        ? "Your shared inventory is live. Open the shop to buy more upgrades that carry across the platform."
        : "Buy study, tool, transport, and lifestyle upgrades that connect to the wider Career Empire build.",
      spotlight: true,
      launchPath: "../shop/index.html",
      launchLabel: "Open Global Shop",
      tags: ["Shared inventory", "Cross-module", "Life build"]
    }
  ]);
  renderStudentTimeline(history.slice(0, 3).map(entry => ({
    title: `${entry.checkpoint || "checkpoint"} • ${new Date(entry.timestamp).toLocaleString()}`,
    detail: `Salary ${formatCurrency(entry.annual_salary)}, net worth ${formatCurrency(entry.cumulative_net_worth)}, mastery ${average([
      Number(entry.tech_mastery || 0),
      Number(entry.climate_mastery || 0),
      Number(entry.demo_mastery || 0),
      Number(entry.economic_mastery || 0)
    ])}%`
  })));
}

function renderTeacherLiveData(players, skillsData, teacherData = null) {
  const teacherContext = getActiveTeacherContext();
  const classCodeFilter = teacherContext.classroom?.classCode || teacherContext.teacherSession?.classCode || "";
  const latestPlayers = teacherData?.profileRows?.length
    ? dedupeLatestPlayers(teacherData.profileRows)
    : dedupeLatestPlayers(players).filter(player => !classCodeFilter || player.class_code === classCodeFilter);
  const students = teacherData?.students || [];
  const moduleProgressRows = teacherData?.moduleProgress || [];
  const evidenceRows = teacherData?.evidenceRows || [];
  const voteRows = teacherData?.voteRows || [];
  const skillProgressRows = latestPlayers.map(deriveEmployabilityProgress);
  const classSkillMap = {
    "communication": average(skillProgressRows.map(row => row.communication || 0)),
    "digital-literacy": average(skillProgressRows.map(row => row["digital-literacy"] || 0)),
    "teamwork": average(skillProgressRows.map(row => row.teamwork || 0)),
    "time-management": average(skillProgressRows.map(row => row["time-management"] || 0)),
    "critical-thinking": average(skillProgressRows.map(row => row["critical-thinking"] || 0)),
    "problem-solving": average(skillProgressRows.map(row => row["problem-solving"] || 0))
  };
  const weakestSkillId = getWeakestSkill(classSkillMap)[0];
  const weakestSkill = skillsData.categories.find(category => category.id === weakestSkillId);
  const moduleMasteries = latestPlayers.map(player => average([
    Number(player.tech_mastery || 0),
    Number(player.climate_mastery || 0),
    Number(player.demo_mastery || 0),
    Number(player.economic_mastery || 0)
  ]));
  const studentsOnTrack = moduleMasteries.filter(value => value >= 50).length;
  const studentsAtRisk = moduleMasteries.filter(value => value < 35).length;
  const evidenceCount = evidenceRows.length;
  const classFund = latestPlayers.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
  const classMastery = average(moduleMasteries);
  const averageSecurity = average(latestPlayers.map(player => Number(player.job_security || 0)));
  const loggedInStudents = students.filter(student => student.last_login_at).length;
  const moduleCompletion = average(moduleProgressRows.map(row => Number(row.completion_percent || 0)));
  const moduleMastery = average(moduleProgressRows.map(row => Number(row.mastery_percent || 0)));
  const latestEvidence = evidenceRows.slice(0, 4).map(row => ({
    title: `${row.module_slug || "module"} • ${formatDateTime(row.created_at)}`,
    detail: `${row.prompt || "Reflection submitted"}${row.response_text ? ` — ${String(row.response_text).slice(0, 120)}${String(row.response_text).length > 120 ? "..." : ""}` : ""}`
  }));
  const rosterActivity = students.slice()
    .sort((a, b) => parseTime(b.last_login_at || b.created_at) - parseTime(a.last_login_at || a.created_at))
    .slice(0, 6)
    .map(student => {
      const player = latestPlayers.find(entry => entry.id === student.id);
      return {
        title: `${student.display_name || student.username} • ${student.last_login_at ? "Logged in" : "Account ready"}`,
        detail: [
          `Username: ${student.username}`,
          student.last_login_at ? `Last login ${formatDateTime(student.last_login_at)}` : `Created ${formatDateTime(student.created_at)}`,
          player ? `Salary ${formatCurrency(player.annual_salary)} • Mastery ${average([
            Number(player.tech_mastery || 0),
            Number(player.climate_mastery || 0),
            Number(player.demo_mastery || 0),
            Number(player.economic_mastery || 0)
          ])}%` : "No gameplay saved yet"
        ].join(" • ")
      };
    });
  const voteCount = voteRows.length;
  const voteLeader = (() => {
    const counts = voteRows.reduce((acc, row) => {
      acc[row.cause] = (acc[row.cause] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]} votes)` : "No votes yet";
  })();

  setText("teacher-hero-title", classCodeFilter ? `Class ${classCodeFilter} overview` : "Teacher dashboard for all active records");
  setText(
    "teacher-hero-subtitle",
    students.length
      ? `Tracking ${students.length} student accounts with ${loggedInStudents} logged in, ${evidenceCount} evidence item(s), and live module data feeding the class view.`
      : "Unlock the teacher area in the game or create student progress first to populate this dashboard."
  );

  const badgeStack = document.getElementById("teacher-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = students.length ? [
      renderBadge(`Class: ${classCodeFilter || "Current class"}`),
      renderBadge(`Students: ${students.length}`),
      renderBadge(`Logged in: ${loggedInStudents}`),
      renderBadge(`Average mastery: ${classMastery}%`),
      renderBadge(`Average security: ${averageSecurity}%`),
      renderBadge(`Weakest skill: ${weakestSkill ? weakestSkill.title : "N/A"}`, weakestSkill?.logoPath, weakestSkill?.title),
      renderBadge(`Vote leader: ${voteLeader}`)
    ].join("") : '<span class="badge">No class data yet</span>';
  }

  setText("teacher-priority-text", weakestSkill ? `${weakestSkill.title} is currently the weakest class-wide employability area. This is the best place to target the next intervention.` : "No class skill data is available yet.");
  setText("teacher-students-on-track", String(studentsOnTrack));
  setText("teacher-students-at-risk", String(studentsAtRisk));
  setText("teacher-evidence-count", String(evidenceCount));
  setText("teacher-class-fund", formatCurrency(classFund));

  renderSkills(skillsData, "teacher-skill-grid", classSkillMap);
  renderTeacherModuleHealth([
    {
      title: "Megatrends",
      status: moduleProgressRows.length ? "Live module" : "Awaiting class data",
      summary: moduleProgressRows.length ? `Built from ${moduleProgressRows.length} saved module progress row(s), ${evidenceCount} evidence item(s), and ${voteCount} community vote(s).` : "Once students play, this module health card will populate automatically.",
      completion: moduleCompletion || average(latestPlayers.map(player => Math.min(100, Number(player.years_played || 0) * 18))),
      mastery: moduleMastery || classMastery,
      variant: "",
      spotlight: true
    },
    {
      title: "Lifelong Learning",
      status: "Next build target",
      summary: "This module should be used to lift planning, reflection, and self-management once it is live.",
      completion: 0,
      mastery: 0,
      variant: "green",
      spotlight: false
    }
  ]);
  renderTeacherInterventions([
    {
      title: weakestSkill ? `Target ${weakestSkill.title} next` : "Activate first class module",
      detail: weakestSkill ? `The class average for ${weakestSkill.title} is the lowest, so this is the best immediate teaching focus.` : "Students need live gameplay records before diagnostics can run.",
      logoPath: weakestSkill?.logoPath,
      logoLabel: weakestSkill?.title
    },
    {
      title: `${studentsAtRisk} students currently at risk`,
      detail: studentsAtRisk ? "Use this as the intervention pool for scaffolded tasks, review sessions, or module replay." : "No students are currently below the at-risk mastery threshold.",
      logoPath: getSkillCategoryById(skillsData, "teamwork")?.logoPath,
      logoLabel: "Teamwork"
    },
    {
      title: `${studentsOnTrack} students are on track`,
      detail: studentsOnTrack ? "These students are ready for extension prompts, deeper reflection, or leadership roles in class activities." : "Once mastery rises above 50%, students will appear here as ready for extension.",
      logoPath: getSkillCategoryById(skillsData, "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking"
    }
  ]);
  renderTeacherRosterActivity(rosterActivity);
  renderTeacherEvidenceList(latestEvidence);
}

async function initDashboards() {
  const skillsData = await loadEmployabilitySkills();
  const players = await getPlayers();
  if (document.getElementById("student-module-grid")) {
    await renderStudentLiveData(players, skillsData);
  }
  if (document.getElementById("teacher-module-health")) {
    const teacherData = await getTeacherDashboardData();
    renderTeacherLiveData(players, skillsData, teacherData);
  }
}

initDashboards().catch(error => {
  console.error(error);
});
