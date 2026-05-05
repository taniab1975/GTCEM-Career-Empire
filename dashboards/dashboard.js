const STUDENT_REWARD_ICONS = {
  chamber: "../Assets/Images and Animations/Celebration Reward Icons/Chamber complete.png",
  salary: "../Assets/Images and Animations/Celebration Reward Icons/Salary Banked.png",
  signal: "../Assets/Images and Animations/Celebration Reward Icons/Signal restored.png",
  tax: "../Assets/Images and Animations/Celebration Reward Icons/Tax contributed.png",
  topic: "../Assets/Images and Animations/Celebration Reward Icons/Topic Complete.png"
};

const STUDENT_STATUS_ICONS = {
  assets: "../Assets/Images and Animations/Student Hub/empire-status-assets-owned.png",
  communityTax: "../Assets/Images and Animations/Student Hub/empire-status-community-tax.png",
  jobSecurity: "../Assets/Images and Animations/Student Hub/empire-status-job-security.png",
  netWorth: "../Assets/Images and Animations/Student Hub/empire-status-net-worth.png",
  salary: "../Assets/Images and Animations/Student Hub/empire-status-salary.png",
  workLife: "../Assets/Images and Animations/Student Hub/empire-status-work-life-balance.png"
};

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
    savings: row.savings || 0,
    tax_paid: row.tax_paid || 0,
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
      savings,
      tax_paid,
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
  if (!studentId) {
    const session = getCurrentPlayerSession();
    return Array.isArray(session?.ownedAssets) ? session.ownedAssets.length : null;
  }

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

async function getCurrentStudentModuleProgress() {
  const authState = getAuthPrototypeState();
  const studentId = authState?.studentLogin?.id;
  if (!studentId) return {};

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("student_module_progress")
    .select("module_id, completion_percent, mastery_percent, completed")
    .eq("student_id", studentId);

  if (error) {
    console.error(error);
    return {};
  }

  return (data || []).reduce((acc, row) => {
    acc[row.module_id] = row;
    return acc;
  }, {});
}

function getCurrentPlayerSession() {
  return readJsonStorage("career-empire-session", null);
}

function getTeacherSession() {
  return readJsonStorage("career-empire-teacher-session", null);
}

function getTeacherDashboardFilter() {
  return readJsonStorage("career-empire-teacher-dashboard-filter", { scope: "all", classId: "all" });
}

function requireStudentHubAccess() {
  if (!document.getElementById("student-hero-title")) return true;
  const authState = getAuthPrototypeState();
  if (authState?.studentLogin?.id || authState?.studentLogin?.preview) return true;
  sessionStorage.setItem("student-login-error", "Please log in before opening the Student Hub.");
  window.location.href = "../auth/student-login.html";
  return false;
}

function setTeacherDashboardFilter(nextFilter) {
  localStorage.setItem("career-empire-teacher-dashboard-filter", JSON.stringify(nextFilter));
}

function getAuthPrototypeState() {
  return readJsonStorage("career-empire-auth-demo", {});
}

function buildMegatrendsLaunchPath() {
  const authState = getAuthPrototypeState();
  const session = getCurrentPlayerSession();
  const studentLogin = authState?.studentLogin || {};
  const params = new URLSearchParams({ screen: "megatrends" });

  const studentName = studentLogin.displayName || studentLogin.username || session?.playerName || "";
  const studentUsername = studentLogin.username || "";
  const schoolName = studentLogin.schoolName || session?.schoolName || "";
  const classCode = studentLogin.classCode || session?.classCode || "";

  if (studentName) params.set("student_name", studentName);
  if (studentUsername) params.set("student_username", studentUsername);
  if (schoolName) params.set("school_name", schoolName);
  if (classCode) params.set("class_code", classCode);

  return `../index.html?${params.toString()}`;
}

function syncMegatrendsLaunchLinks() {
  const launchPath = buildMegatrendsLaunchPath();
  document.querySelectorAll('a[href="../index.html?screen=megatrends"]').forEach(link => {
    link.href = launchPath;
  });
  const hubLink = document.getElementById("student-hub-megatrends-link");
  if (hubLink) hubLink.href = launchPath;
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

async function resolveTeacherDashboardContext(supabase, context) {
  if (context?.teacher?.id && context?.teacher?.schoolId) {
    return context;
  }

  let email = context?.teacherLogin?.email || context?.teacher?.email || "";
  if (!email && supabase?.auth?.getUser) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        email = data.user.email;
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (!email) return context;

  const { data, error } = await supabase
    .from("teachers")
    .select("id, full_name, email, school_id, schools(name)")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(error);
    return context;
  }

  const nextTeacher = {
    id: data.id,
    fullName: data.full_name || context?.teacher?.fullName || "",
    email: data.email,
    schoolId: data.school_id,
    schoolName: data.schools?.name || context?.teacher?.schoolName || ""
  };

  const authState = getAuthPrototypeState();
  localStorage.setItem("career-empire-auth-demo", JSON.stringify({
    ...authState,
    teacher: {
      ...(authState.teacher || {}),
      ...nextTeacher
    },
    teacherLogin: {
      ...(authState.teacherLogin || {}),
      email: data.email,
      schoolName: data.schools?.name || authState.teacherLogin?.schoolName || ""
    }
  }));

  return {
    ...context,
    teacher: nextTeacher
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

function getModuleImageStyle(imagePath = "") {
  return imagePath ? ` style="--module-image: url('${escapeHtml(imagePath)}')"` : "";
}

function renderStudentModules(modules) {
  const container = document.getElementById("student-module-grid");
  if (!container) return;

  container.innerHTML = modules.map(module => `
    <article class="module-card ${module.imagePath ? "module-card--image-bg" : ""} ${module.spotlight ? "spotlight" : ""}"${getModuleImageStyle(module.imagePath)}>
      <div class="module-visual-badge">
        ${module.logoPath ? `<img class="module-logo" src="${module.logoPath}" alt="${escapeHtml(module.logoLabel || module.title)} logo">` : ""}
        <span>${module.title}</span>
      </div>
      <div class="module-card-body">
        <div class="kicker">${module.state}</div>
        <h3>${module.title}</h3>
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
      </div>
    </article>
  `).join("");
}

function renderStudentTimeline(items) {
  const container = document.getElementById("student-timeline");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="timeline-empty-state" style="--empty-state-image: url('../Assets/Images and Animations/Student Hub/activity-empty-state.png')">
        <div>
          <div class="timeline-kicker">Ready to earn</div>
          <strong>No activity yet</strong>
          <p>Complete a mission, bank salary, or buy an upgrade and your latest Career Empire moves will appear here.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item ${item.variant || ""} ${item.iconPath ? "with-icon" : ""}">
      ${item.iconPath ? `<img class="timeline-reward-icon" src="${item.iconPath}" alt="">` : ""}
      <div>
        ${item.kicker ? `<div class="timeline-kicker">${item.kicker}</div>` : ""}
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
      </div>
    </div>
  `).join("");
}

function buildEconomyTimelineItems(session) {
  const entries = Array.isArray(session?.economyLog) ? session.economyLog : [];
  return entries.slice(0, 6).map(entry => {
    const incomeParts = [];
    if (Number(entry.earnedDelta || 0) > 0) incomeParts.push(`Income +${formatCurrency(entry.earnedDelta)}`);
    if (Number(entry.taxDelta || 0) > 0) incomeParts.push(`Tax +${formatCurrency(entry.taxDelta)}`);
    if (Number(entry.spendDelta || 0) > 0) incomeParts.push(`Spend -${formatCurrency(entry.spendDelta)}`);

    const totals = [];
    if (typeof entry.annualSalaryAfter === "number") totals.push(`Salary ${formatCurrency(entry.annualSalaryAfter)}`);
    if (typeof entry.netWorthAfter === "number") totals.push(`Net worth ${formatCurrency(entry.netWorthAfter)}`);
    if (typeof entry.taxPaidAfter === "number") totals.push(`Tax paid ${formatCurrency(entry.taxPaidAfter)}`);

    const moduleLabel =
      entry.moduleId === "est-prep" ? "EST" :
      entry.moduleId === "lifelong-learning" ? "Lifelong Learning" :
      entry.moduleId === "megatrends" ? "Megatrends" :
      entry.moduleId === "global-shop" ? "Shop" :
      "Platform";

    const eventLabel =
      entry.eventType === "purchase" ? "Spend event" :
      entry.eventType === "reward-awarded" ? "Reward awarded" :
      entry.eventType === "scenario-choice" ? "Scenario reward" :
      "Profile saved";
    const iconPath =
      entry.eventType === "purchase" ? STUDENT_REWARD_ICONS.salary :
      entry.eventType === "reward-awarded" ? STUDENT_REWARD_ICONS.chamber :
      Number(entry.taxDelta || 0) > 0 ? STUDENT_REWARD_ICONS.tax :
      Number(entry.earnedDelta || 0) > 0 ? STUDENT_REWARD_ICONS.salary :
      STUDENT_REWARD_ICONS.signal;

    return {
      title: `${entry.label || entry.checkpoint || "Economy update"} • ${new Date(entry.timestamp).toLocaleString()}`,
      kicker: `${moduleLabel} • ${eventLabel}`,
      variant: entry.eventType === "purchase" ? "timeline-spend" : "timeline-income",
      iconPath,
      detail: [
        entry.detail || `${entry.moduleId || "module"} updated your shared profile.`,
        incomeParts.join(" • "),
        totals.join(" • ")
      ].filter(Boolean).join(" • ")
    };
  });
}

function renderStudentShopPreview(items) {
  const container = document.getElementById("student-shop-preview");
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="module-card ${item.imagePath ? "module-card--image-bg" : ""} ${item.spotlight ? "spotlight" : ""}"${getModuleImageStyle(item.imagePath)}>
      <div class="module-visual-badge">
        <span>${item.title}</span>
      </div>
      <div class="module-card-body">
        <div class="kicker">${item.state}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="pill-row">
          ${item.tags.map(tag => `<span class="pill">${tag}</span>`).join("")}
        </div>
        <div class="module-actions">
          <a class="module-link" href="${item.launchPath}">${item.launchLabel}</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCommunityBoard(targetId, data) {
  const container = document.getElementById(targetId);
  if (!container) return;

  const voteEntries = data.voteRows.map(row => {
    const variant =
      row.id === "climate" ? "green" :
      row.id === "global" ? "gold" :
      row.id === "diversity" ? "red" : "";
    return `
      <div class="vote-row">
        <div class="vote-label">${row.label}</div>
        <div class="mini-track"><div class="mini-fill ${variant}" style="width:${row.percent}%"></div></div>
        <div class="vote-label">${row.percent}%</div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    ${data.visualPath ? `
      <article class="community-card community-visual-card" style="--community-visual: url('${escapeHtml(data.visualPath)}')">
        <div class="kicker">Class Impact</div>
        <h3>Every module feeds the shared build</h3>
        <p>Salary, tax, votes, and progress connect your individual play to the class economy.</p>
      </article>
    ` : ""}
    <article class="community-card">
      <div class="kicker">Your Impact</div>
      <h3>${data.currentVoteLabel}</h3>
      <div class="community-stat">${data.taxPaid}</div>
      <p>${data.summary}</p>
      <div class="pill-row">
        <span class="pill">Current vote: ${data.currentVoteLabel}</span>
        <span class="pill">Class fund leader: ${data.leadingCause}</span>
      </div>
    </article>
    <article class="community-card">
      <div class="kicker">Class Standings</div>
      <h3>Community Vote Split</h3>
      <p>${data.voteIntro}</p>
      <div class="vote-stack">${voteEntries}</div>
    </article>
  `;
}

function renderStudentCommunityBoard(data) {
  renderCommunityBoard("student-community-board", {
    visualPath: "../Assets/Images and Animations/Student Hub/community-impact-banner.png",
    ...data
  });
}

function getCommunityVoteLabels() {
  return {
    climate: "Climate and Sustainability",
    tech: "Tech Education and Inclusion",
    diversity: "Diversity and Economic Equity",
    global: "Global Opportunity Access",
    none: "No community vote yet"
  };
}

function getStrongestSkillCategory(skillsData, player) {
  const progressMap = deriveEmployabilityProgress(player);
  const strongestSkillId = getStrongestSkill(progressMap)[0];
  return skillsData.categories.find(category => category.id === strongestSkillId) || skillsData.categories[0];
}

function renderSharedLeaderboard(players, skillsData) {
  const container = document.getElementById("leaderboard-page-list");
  if (!container) return;

  const latestPlayers = dedupeLatestPlayers(players).sort((a, b) => Number(b.cumulative_net_worth || 0) - Number(a.cumulative_net_worth || 0));
  if (!latestPlayers.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No leaderboard data yet</strong><p>Once students start playing, the leaderboard will begin filling automatically.</p></div>';
    return;
  }

  container.innerHTML = latestPlayers.map((player, index) => {
    const strongestSkill = getStrongestSkillCategory(skillsData, player);
    return `
      <article class="module-card ${index === 0 ? "spotlight" : ""}">
        <div class="module-header">
          ${strongestSkill?.logoPath ? `<img class="module-logo" src="${strongestSkill.logoPath}" alt="${escapeHtml(strongestSkill.title)} logo">` : ""}
          <div>
            <div class="kicker">Rank #${index + 1}</div>
            <h3>${escapeHtml(player.player_name)}</h3>
          </div>
        </div>
        <p>${escapeHtml(player.career_title || "Career Builder")} • ${escapeHtml(player.school_name || "School not set")} • Class ${escapeHtml(player.class_code || "Not set")}</p>
        <div class="pill-row">
          <span class="pill">Net worth: ${formatCurrency(player.cumulative_net_worth)}</span>
          <span class="pill">Salary: ${formatCurrency(player.annual_salary)}</span>
          <span class="pill">Years: ${player.years_played || 0}</span>
          <span class="pill">Strongest skill: ${escapeHtml(strongestSkill?.title || "Not yet clear")}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderSharedCommunityPage(players) {
  const board = document.getElementById("community-page-board");
  if (!board) return;

  const latestPlayers = dedupeLatestPlayers(players);
  const voteLabels = getCommunityVoteLabels();
  const voteKeys = ["climate", "tech", "diversity", "global"];
  const voteCounts = voteKeys.reduce((acc, key) => {
    acc[key] = latestPlayers.filter(player => player.community_vote === key).length;
    return acc;
  }, {});
  const totalVotes = voteKeys.reduce((sum, key) => sum + voteCounts[key], 0);
  const totalTax = latestPlayers.reduce((sum, player) => sum + Math.floor(Number(player.cumulative_net_worth || 0) * 0.1), 0);
  const topVote = voteKeys
    .map(key => ({ key, count: voteCounts[key] }))
    .sort((a, b) => b.count - a.count)[0];
  const authState = getAuthPrototypeState();
  const currentVote = authState?.studentLogin?.id
    ? latestPlayers.find(player => player.id === authState.studentLogin.id)?.community_vote || "none"
    : "none";

  renderCommunityBoard("community-page-board", {
    currentVoteLabel: voteLabels[currentVote] || voteLabels.none,
    taxPaid: formatCurrency(totalTax),
    summary: totalVotes
      ? `Students are directing their class fund through ${totalVotes} recorded community vote${totalVotes === 1 ? "" : "s"}.`
      : "No community votes yet. As students complete modules and vote, the class fund direction will appear here.",
    leadingCause: topVote?.count ? voteLabels[topVote.key] : "No votes yet",
    voteIntro: totalVotes
      ? `${totalVotes} vote${totalVotes === 1 ? "" : "s"} recorded across the class community board.`
      : "No votes recorded yet.",
    voteRows: voteKeys.map(key => ({
      id: key,
      label: voteLabels[key],
      percent: totalVotes ? Math.round((voteCounts[key] / totalVotes) * 100) : 0
    }))
  });
}

function renderSharedGlobalPage(players) {
  const metrics = document.getElementById("global-page-metrics");
  const schoolRankings = document.getElementById("global-school-rankings");
  const classRankings = document.getElementById("global-class-rankings");
  const spotlights = document.getElementById("global-spotlights");
  if (!metrics || !schoolRankings || !classRankings || !spotlights) return;

  const latestPlayers = dedupeLatestPlayers(players);
  if (!latestPlayers.length) {
    metrics.innerHTML = `
      <article class="metric">
        <div class="metric-label">Global Status</div>
        <div class="metric-value">0</div>
        <div class="metric-note">No school competition data yet</div>
      </article>
    `;
    schoolRankings.innerHTML = '<div class="timeline-item"><strong>No schools ranked yet</strong><p>Once students start playing, this page will turn into a live inter-school ladder.</p></div>';
    classRankings.innerHTML = '<article class="module-card"><div class="kicker">Awaiting data</div><h3>No classes yet</h3><p>The rivalry board will populate once classes begin banking earnings and progress.</p></article>';
    spotlights.innerHTML = '<div class="timeline-item"><strong>No spotlight stats yet</strong><p>Competitive highlights will appear once schools start generating results.</p></div>';
    return;
  }

  const averageForPlayers = (items, key) => items.length
    ? Math.round(items.reduce((sum, player) => sum + Number(player[key] || 0), 0) / items.length)
    : 0;

  const schoolMap = new Map();
  const classMap = new Map();

  latestPlayers.forEach(player => {
    const schoolKey = player.school_name || "Unlinked School";
    const classKey = `${schoolKey}::${player.class_code || "No Class Code"}`;

    if (!schoolMap.has(schoolKey)) {
      schoolMap.set(schoolKey, []);
    }
    schoolMap.get(schoolKey).push(player);

    if (!classMap.has(classKey)) {
      classMap.set(classKey, []);
    }
    classMap.get(classKey).push(player);
  });

  const schoolRows = [...schoolMap.entries()].map(([schoolName, members]) => {
    const earnings = members.reduce((sum, player) => sum + Number(player.annual_salary || 0), 0);
    const netWorth = members.reduce((sum, player) => sum + Number(player.cumulative_net_worth || 0), 0);
    const tax = members.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
    const readiness = Math.round((
      averageForPlayers(members, "tech_mastery") +
      averageForPlayers(members, "climate_mastery") +
      averageForPlayers(members, "demo_mastery") +
      averageForPlayers(members, "economic_mastery")
    ) / 4);
    const yearsPlayed = members.reduce((sum, player) => sum + Number(player.years_played || 0), 0);
    const jobSecurity = averageForPlayers(members, "job_security");
    const workLifeBalance = averageForPlayers(members, "work_life_balance");
    const competitiveScore = Math.round(
      (earnings / Math.max(1, members.length * 1000)) +
      readiness * 1.8 +
      yearsPlayed * 3 +
      (jobSecurity * 0.4)
    );

    return {
      schoolName,
      members,
      studentCount: members.length,
      earnings,
      netWorth,
      tax,
      readiness,
      yearsPlayed,
      jobSecurity,
      workLifeBalance,
      competitiveScore
    };
  }).sort((a, b) => b.competitiveScore - a.competitiveScore);

  const classRows = [...classMap.entries()].map(([key, members]) => {
    const [schoolName, classCode] = key.split("::");
    const earnings = members.reduce((sum, player) => sum + Number(player.annual_salary || 0), 0);
    const tax = members.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
    const readiness = Math.round((
      averageForPlayers(members, "tech_mastery") +
      averageForPlayers(members, "climate_mastery") +
      averageForPlayers(members, "demo_mastery") +
      averageForPlayers(members, "economic_mastery")
    ) / 4);
    const yearsPlayed = members.reduce((sum, player) => sum + Number(player.years_played || 0), 0);
    const score = Math.round((earnings / Math.max(1, members.length * 1000)) + readiness * 1.7 + yearsPlayed * 4);

    return {
      schoolName,
      classCode,
      studentCount: members.length,
      earnings,
      tax,
      readiness,
      yearsPlayed,
      score
    };
  }).sort((a, b) => b.score - a.score);

  const topSchool = schoolRows[0];
  const topClass = classRows[0];
  const highestReadiness = [...schoolRows].sort((a, b) => b.readiness - a.readiness)[0];
  const biggestTaxBase = [...schoolRows].sort((a, b) => b.tax - a.tax)[0];
  const bestAttendanceProxy = [...schoolRows].sort((a, b) => b.yearsPlayed - a.yearsPlayed)[0];
  const safestSchool = [...schoolRows].sort((a, b) => b.jobSecurity - a.jobSecurity)[0];

  metrics.innerHTML = `
    <article class="metric">
      <div class="metric-label">Top School</div>
      <div class="metric-value">${escapeHtml(topSchool.schoolName)}</div>
      <div class="metric-note">${topSchool.competitiveScore} rivalry points</div>
    </article>
    <article class="metric">
      <div class="metric-label">Top Class</div>
      <div class="metric-value">${escapeHtml(topClass.classCode || "No code")}</div>
      <div class="metric-note">${escapeHtml(topClass.schoolName)} • ${topClass.score} points</div>
    </article>
    <article class="metric">
      <div class="metric-label">Highest Readiness</div>
      <div class="metric-value">${highestReadiness.readiness}%</div>
      <div class="metric-note">${escapeHtml(highestReadiness.schoolName)}</div>
    </article>
    <article class="metric">
      <div class="metric-label">Biggest Community Fund</div>
      <div class="metric-value">${formatCurrency(biggestTaxBase.tax)}</div>
      <div class="metric-note">${escapeHtml(biggestTaxBase.schoolName)}</div>
    </article>
  `;

  schoolRankings.innerHTML = schoolRows.slice(0, 8).map((row, index) => `
    <div class="timeline-item">
      <strong>#${index + 1} ${escapeHtml(row.schoolName)}</strong>
      <p>
        Rivalry score ${row.competitiveScore} • ${row.studentCount} students • Earnings ${formatCurrency(row.earnings)} •
        Readiness ${row.readiness}% • Class fund ${formatCurrency(row.tax)} • Job security ${row.jobSecurity}%
      </p>
    </div>
  `).join("");

  classRankings.innerHTML = classRows.slice(0, 6).map((row, index) => `
    <article class="module-card ${index === 0 ? "spotlight" : ""}">
      <div class="kicker">#${index + 1} Class Rival</div>
      <h3>${escapeHtml(row.classCode || "No class code")}</h3>
      <p>${escapeHtml(row.schoolName)}</p>
      ${createProgressBar(row.readiness, index === 0 ? "green" : "")}
      <div class="section-title">
        <p>${row.readiness}% readiness</p>
        <p>${row.studentCount} students</p>
      </div>
      <div class="pill-row">
        <span class="pill">Earnings: ${formatCurrency(row.earnings)}</span>
        <span class="pill">Class fund: ${formatCurrency(row.tax)}</span>
        <span class="pill">Rounds: ${row.yearsPlayed}</span>
      </div>
    </article>
  `).join("");

  spotlights.innerHTML = [
    {
      title: "Most Match Fit",
      detail: `${escapeHtml(highestReadiness.schoolName)} has the highest future-readiness average at ${highestReadiness.readiness}%.`
    },
    {
      title: "Most Active School",
      detail: `${escapeHtml(bestAttendanceProxy.schoolName)} has banked ${bestAttendanceProxy.yearsPlayed} total played rounds across its students.`
    },
    {
      title: "Safest Career Build",
      detail: `${escapeHtml(safestSchool.schoolName)} leads average job security with ${safestSchool.jobSecurity}%.`
    },
    {
      title: "Biggest Economy",
      detail: `${escapeHtml(topSchool.schoolName)} leads total salary earnings with ${formatCurrency(topSchool.earnings)} and net worth of ${formatCurrency(topSchool.netWorth)}.`
    }
  ].map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
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

function renderTeacherESTResponseList(items) {
  const container = document.getElementById("teacher-est-response-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No EST responses yet</strong><p>Boss-round EST answers and other EST artifacts will appear here once students start submitting the EST module.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function renderTeacherTaskTimeList(items) {
  const container = document.getElementById("teacher-task-time-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No task timing yet</strong><p>Once students complete Megatrends and EST stages, their recent time-on-task entries will appear here.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </div>
  `).join("");
}

function renderTeacherStudentCompareList(items) {
  const container = document.getElementById("teacher-student-compare-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No student comparison data yet</strong><p>Once students have module progress and evidence saved, this area will compare them across Megatrends and EST Prep.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="module-card ${item.spotlight ? "spotlight" : ""}">
      <div class="section-title">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.meta)}</p>
        </div>
        <p>${escapeHtml(item.status)}</p>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <div class="pill-row">
        ${item.pills.map(pill => `<span class="pill">${escapeHtml(pill)}</span>`).join("")}
      </div>
      <div class="section-title" style="margin-top: 12px;">
        <p>Megatrends ${item.megatrendsCompletion}% complete</p>
        <p>EST ${item.estCompletion}% complete</p>
      </div>
      ${createProgressBar(item.megatrendsCompletion)}
      ${createProgressBar(item.estCompletion, "green")}
      <div class="list" style="margin-top: 14px;">
        ${item.details.map(detail => `
          <div class="timeline-item">
            <strong>${escapeHtml(detail.title)}</strong>
            <p>${escapeHtml(detail.detail)}</p>
          </div>
        `).join("")}
      </div>
    </article>
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

function parseStructuredEvidence(row) {
  if (!row?.response_text || typeof row.response_text !== "string") return null;
  const text = row.response_text.trim();
  if (!text.startsWith("{")) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function formatDurationSeconds(value) {
  const seconds = Number(value || 0);
  if (!seconds) return "Time not captured";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

function parseStructuredFeedback(row) {
  if (!row?.message || typeof row.message !== "string") return null;
  const text = row.message.trim();
  if (!text.startsWith("{")) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function normaliseStoreRequest(row) {
  const payload = parseStructuredFeedback(row);
  if (!payload || payload.kind !== "store-item-request") return null;
  const approvedItem = payload.approved_item || null;
  return {
    id: row.id,
    createdAt: row.created_at,
    loginName: row.login_name,
    status: payload.status || "pending",
    studentName: payload.student_name || row.login_name || "Student",
    schoolName: payload.school_name || "",
    classCode: payload.class_code || "",
    itemName: approvedItem?.name || payload.item_name || "",
    category: approvedItem?.category || payload.category || "wellbeing",
    categoryLabel: approvedItem?.categoryLabel || payload.category_label || payload.category || "Category",
    reason: payload.reason || "",
    image: approvedItem?.image || payload.image || null,
    approvedItem,
    payload
  };
}

function isPromoTeacherDashboardMode() {
  if (!document.getElementById("teacher-module-health")) return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "promo" || params.get("promo") === "1";
}

function getPromoTeacherDashboardData() {
  const now = new Date();
  const minutesAgo = value => new Date(now.getTime() - value * 60 * 1000).toISOString();
  const hoursAgo = value => new Date(now.getTime() - value * 60 * 60 * 1000).toISOString();

  const classes = [
    { id: "promo-class-a", name: "Year 12 Careers A", class_code: "Y12A" },
    { id: "promo-class-b", name: "Year 12 Careers B", class_code: "Y12B" }
  ];

  const studentSeeds = [
    ["Mia", "Mia26", "promo-class-a", 82, 91, 112000, 3, 84, 78, "communication"],
    ["Jayden", "Jayden26", "promo-class-a", 77, 86, 104500, 3, 80, 75, "teamwork"],
    ["Aaliyah", "Aaliyah26", "promo-class-a", 88, 95, 128000, 4, 89, 82, "critical-thinking"],
    ["Noah", "Noah26", "promo-class-a", 73, 83, 97800, 3, 78, 74, "digital-literacy"],
    ["Sienna", "Sienna26", "promo-class-a", 84, 92, 118200, 4, 86, 81, "time-management"],
    ["Luca", "Luca26", "promo-class-a", 69, 79, 91500, 2, 76, 73, "problem-solving"],
    ["Chloe", "Chloe26", "promo-class-a", 81, 89, 109400, 3, 82, 79, "communication"],
    ["Ethan", "Ethan26", "promo-class-a", 75, 84, 99500, 3, 79, 72, "teamwork"],
    ["Grace", "Grace26", "promo-class-b", 86, 94, 123600, 4, 88, 84, "critical-thinking"],
    ["Hudson", "Hudson26", "promo-class-b", 72, 82, 96800, 2, 77, 71, "digital-literacy"],
    ["Zara", "Zara26", "promo-class-b", 90, 97, 133400, 4, 91, 86, "communication"],
    ["Cooper", "Cooper26", "promo-class-b", 78, 87, 106700, 3, 81, 76, "problem-solving"],
    ["Ruby", "Ruby26", "promo-class-b", 83, 90, 114900, 3, 85, 80, "time-management"],
    ["Leo", "Leo26", "promo-class-b", 74, 83, 98700, 2, 78, 74, "teamwork"],
    ["Evie", "Evie26", "promo-class-b", 87, 95, 126100, 4, 90, 85, "critical-thinking"],
    ["Mason", "Mason26", "promo-class-b", 71, 81, 95400, 2, 75, 70, "digital-literacy"]
  ];

  const students = studentSeeds.map((seed, index) => ({
    id: `promo-student-${index + 1}`,
    display_name: seed[0],
    username: seed[1],
    class_id: seed[2],
    created_at: hoursAgo(240 - index * 6),
    last_login_at: index < 14 ? minutesAgo(20 + index * 7) : null
  }));

  const profiles = studentSeeds.map((seed, index) => {
    const classRow = classes.find(row => row.id === seed[2]);
    const mastery = seed[3];
    return {
      id: `promo-student-${index + 1}`,
      player_name: seed[0],
      school_name: "Emmanuel Catholic College",
      class_code: classRow?.class_code || "",
      career_title: mastery >= 85 ? "Senior Strategist" : mastery >= 78 ? "Project Lead" : "Career Builder",
      annual_salary: seed[4] * 1000,
      cumulative_net_worth: seed[5],
      career_level: seed[6],
      job_security: seed[7],
      work_life_balance: seed[8],
      community_vote: index % 4 === 0 ? "tech" : index % 4 === 1 ? "climate" : index % 4 === 2 ? "global" : "diversity",
      years_played: seed[6],
      tech_mastery: mastery + (seed[9] === "digital-literacy" ? 6 : 1),
      climate_mastery: mastery + (seed[9] === "problem-solving" ? 4 : 0),
      demo_mastery: mastery + (seed[9] === "communication" || seed[9] === "teamwork" ? 5 : 1),
      economic_mastery: mastery + (seed[9] === "critical-thinking" || seed[9] === "time-management" ? 4 : 1),
      timestamp: minutesAgo(15 + index * 3)
    };
  });

  const moduleProgress = students.flatMap((student, index) => {
    const profile = profiles[index];
    const overallMastery = average([
      profile.tech_mastery,
      profile.climate_mastery,
      profile.demo_mastery,
      profile.economic_mastery
    ]);
    const estMastery = Math.max(62, overallMastery - 8 + (index % 5));
    return [
      {
        student_id: student.id,
        class_id: student.class_id,
        module_id: "megatrends",
        completion_percent: Math.min(100, 62 + (index % 5) * 8),
        mastery_percent: overallMastery,
        attempts: 3 + (index % 3)
      },
      {
        student_id: student.id,
        class_id: student.class_id,
        module_id: "est-prep",
        completion_percent: 48 + (index % 4) * 10,
        mastery_percent: estMastery,
        attempts: 2 + (index % 2)
      }
    ];
  });

  const evidenceRows = students.flatMap((student, index) => [
    {
      id: `promo-est-${index + 1}`,
      student_id: student.id,
      class_id: student.class_id,
      module_id: "est-prep",
      evidence_type: "boss-round",
      prompt: "Explain how labour market information can shape post-school decisions.",
      response_text: JSON.stringify({
        module_id: "est-prep",
        task_name: "Boss Round",
        prompt_text: "Explain how labour market information can shape post-school decisions.",
        response_text: `${student.display_name} explains that labour market information helps students compare growth industries, future demand, and training pathways before making a career decision.`,
        score_percent: 72 + (index % 6) * 4,
        duration_seconds: 230 + index * 9
      }),
      auto_score: 72 + (index % 6) * 4,
      created_at: minutesAgo(55 + index * 6),
      students: {
        display_name: student.display_name,
        username: student.username
      }
    },
    {
      id: `promo-mega-${index + 1}`,
      student_id: student.id,
      class_id: student.class_id,
      module_id: "megatrends",
      evidence_type: "concept-lock",
      prompt: "Which megatrend best explains this workplace change?",
      response_text: JSON.stringify({
        module_id: "megatrends",
        task_name: "Concept Lock-In",
        prompt_text: "Which megatrend best explains this workplace change?",
        response_text: `${student.display_name} linked the scenario to Economic Power Shifts and justified the response with a concise explanation.`,
        score_percent: 76 + (index % 5) * 4,
        duration_seconds: 88 + index * 5
      }),
      auto_score: 76 + (index % 5) * 4,
      created_at: minutesAgo(18 + index * 4),
      students: {
        display_name: student.display_name,
        username: student.username
      }
    }
  ]);

  const voteRows = students.map((student, index) => ({
    id: `promo-vote-${index + 1}`,
    class_id: student.class_id,
    vote_key: index % 3 === 0 ? "tech" : index % 3 === 1 ? "climate" : "global",
    cause: index % 3 === 0 ? "tech" : index % 3 === 1 ? "climate" : "global"
  }));

  const feedbackRows = [
    {
      id: "promo-request-1",
      created_at: hoursAgo(8),
      login_name: "Mia26",
      feedback_type: "store-item-request",
      message: JSON.stringify({
        kind: "store-item-request",
        status: "pending",
        student_name: "Mia",
        school_name: "Emmanuel Catholic College",
        class_code: "Y12A",
        item_name: "Tesla Model 3",
        category: "cars",
        category_label: "Cars",
        reason: "A realistic aspirational item that feels exciting and fits the career theme."
      })
    },
    {
      id: "promo-request-2",
      created_at: hoursAgo(20),
      login_name: "Zara26",
      feedback_type: "store-item-request",
      message: JSON.stringify({
        kind: "store-item-request",
        status: "approved",
        student_name: "Zara",
        school_name: "Emmanuel Catholic College",
        class_code: "Y12B",
        item_name: "Designer Laptop",
        category: "mobile-phones",
        category_label: "Mobile Phones & Tech",
        reason: "Students wanted a higher-tier tech item in the store.",
        approved_item: {
          code: "promo-laptop",
          name: "Designer Laptop",
          category: "mobile-phones",
          categoryLabel: "Mobile Phones & Tech",
          description: "A premium productivity upgrade for high-performing players."
        }
      })
    }
  ];

  return {
    context: {
      teacher: {
        id: "promo-teacher",
        fullName: "Tania Byrnes",
        email: "tania.byrnes@cewa.edu.au",
        schoolId: "promo-school",
        schoolName: "Emmanuel Catholic College"
      }
    },
    availableClasses: classes,
    selectedClassId: "all",
    selectedClassName: "All classes at Emmanuel Catholic College",
    students,
    moduleProgress,
    evidenceRows,
    voteRows,
    profileRows: profiles,
    feedbackRows
  };
}

function buildStoreRequestApprovedItem(request, formData) {
  return {
    code: request.approvedItem?.code || `store-request-${request.id}`,
    name: formData.name,
    category: formData.category,
    categoryLabel: formData.categoryLabel,
    cost: Number(formData.cost || 0),
    icon: formData.icon || "🛍️",
    benefit: formData.benefit,
    image: request.image || null
  };
}

function renderTeacherStoreRequestList(items) {
  const container = document.getElementById("teacher-store-request-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No store requests yet</strong><p>When students suggest new shop items, you will be able to review, edit, approve, and reject them here.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => {
    const defaultCost = item.approvedItem?.cost || 1000;
    const defaultIcon = item.approvedItem?.icon || "🛍️";
    const defaultBenefit = item.approvedItem?.benefit || item.reason || "Student-requested item for the Career Empire store.";
    return `
      <article class="module-card store-request-card" data-store-request-id="${item.id}">
        <div class="section-title">
          <div>
            <h2>${escapeHtml(item.itemName || "Requested item")}</h2>
            <p>${escapeHtml(item.studentName)} • ${escapeHtml(item.classCode || "Class not set")} • ${formatDateTime(item.createdAt)}</p>
          </div>
          <p class="status-${item.status === "approved" ? "good" : item.status === "rejected" ? "risk" : "watch"}">${escapeHtml(item.status)}</p>
        </div>
        <div class="store-request-meta">
          <span class="pill">Category: ${escapeHtml(item.categoryLabel)}</span>
          <span class="pill">Login: ${escapeHtml(item.loginName || "unknown")}</span>
          ${item.schoolName ? `<span class="pill">School: ${escapeHtml(item.schoolName)}</span>` : ""}
        </div>
        ${item.image?.dataUrl ? `<img class="store-request-image" src="${item.image.dataUrl}" alt="${escapeHtml(item.itemName)} image">` : ""}
        <p>${escapeHtml(item.reason || "No reason provided.")}</p>
        <div class="store-request-form">
          <div class="store-request-grid">
            <div>
              <label>Approved item name</label>
              <input type="text" data-store-field="name" value="${escapeHtml(item.itemName)}">
            </div>
            <div>
              <label>Category</label>
              <select data-store-field="category">
                ${[
                  ["cars", "Cars"],
                  ["mobile-phones", "Mobile Phones"],
                  ["clothes", "Clothes"],
                  ["investments", "Investments"],
                  ["wellbeing", "Wellbeing"],
                  ["technology", "Technology"],
                  ["study", "Study"],
                  ["mobility", "Mobility"],
                  ["housing", "Housing"],
                  ["fun", "Fun"],
                  ["experiences", "Experiences"]
                ].map(([value, label]) => `<option value="${value}" ${value === item.category ? "selected" : ""}>${label}</option>`).join("")}
              </select>
            </div>
            <div>
              <label>Cost</label>
              <input type="number" min="0" step="10" data-store-field="cost" value="${defaultCost}">
            </div>
            <div>
              <label>Emoji icon</label>
              <input type="text" maxlength="4" data-store-field="icon" value="${escapeHtml(defaultIcon)}">
            </div>
          </div>
          <div>
            <label>Store description</label>
            <textarea data-store-field="benefit">${escapeHtml(defaultBenefit)}</textarea>
          </div>
        </div>
        <div class="module-actions">
          <button class="module-link" type="button" data-store-action="approve">Approve and Publish</button>
          <button class="module-link button-danger" type="button" data-store-action="reject">Reject</button>
        </div>
        <p class="store-request-status" data-store-status>
          <strong>Current status:</strong> ${escapeHtml(item.status)}${item.status === "approved" ? " and visible in the shop." : ""}
        </p>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-store-action]").forEach(button => {
    button.addEventListener("click", async event => {
      const action = event.currentTarget.dataset.storeAction;
      const card = event.currentTarget.closest("[data-store-request-id]");
      if (!card) return;
      const requestId = card.dataset.storeRequestId;
      const fields = Object.fromEntries([...card.querySelectorAll("[data-store-field]")].map(field => [field.dataset.storeField, field.value.trim()]));
      const request = items.find(entry => entry.id === requestId);
      if (!request) return;

      const categoryLabel = card.querySelector('[data-store-field="category"]')?.selectedOptions?.[0]?.textContent || fields.category;
      const statusEl = card.querySelector("[data-store-status]");
      if (statusEl) statusEl.innerHTML = "<strong>Updating...</strong>";

      try {
        if (action === "approve") {
          const approvedItem = buildStoreRequestApprovedItem(request, {
            ...fields,
            categoryLabel
          });
          await updateStoreRequest(request, "approved", approvedItem);
        } else {
          await updateStoreRequest(request, "rejected", null);
        }
        await initDashboards();
      } catch (error) {
        if (statusEl) statusEl.innerHTML = `<strong>Error:</strong> ${escapeHtml(error.message || "Could not update request.")}`;
      }
    });
  });
}

async function updateStoreRequest(request, status, approvedItem = null) {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) throw new Error("Supabase is not available.");
  const nextPayload = {
    ...request.payload,
    status,
    approved_item: approvedItem,
    reviewed_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from("feedback_reports")
    .update({
      message: JSON.stringify(nextPayload)
    })
    .eq("id", request.id);

  if (error) throw error;
}

async function getTeacherDashboardData() {
  const supabase = await getSupabaseClientOrNull();
  let context = getActiveTeacherContext();
  context = await resolveTeacherDashboardContext(supabase, context);
  const teacherId = context.teacher?.id || null;
  const schoolId = context.teacher?.schoolId || null;
  if (!supabase || (!teacherId && !schoolId)) {
    return null;
  }

  const dashboardFilter = getTeacherDashboardFilter();
  const { data: classRows, error: classesError } = await supabase
    .from("classes")
    .select("id, name, class_code, year_level, school_id, teacher_id")
    .or([
      schoolId ? `school_id.eq.${schoolId}` : null,
      teacherId ? `teacher_id.eq.${teacherId}` : null
    ].filter(Boolean).join(","))
    .order("name", { ascending: true });

  if (classesError) {
    console.error(classesError);
    return {
      context,
      availableClasses: [],
      selectedClassId: "all",
      selectedClassName: "No classes found",
      students: [],
      moduleProgress: [],
      evidenceRows: [],
      voteRows: [],
      profileRows: [],
      feedbackRows: []
    };
  }

  const availableClasses = classRows || [];
  if (!availableClasses.length) {
    return {
      context,
      availableClasses: [],
      selectedClassId: "all",
      selectedClassName: "No classes found",
      students: [],
      moduleProgress: [],
      evidenceRows: [],
      voteRows: [],
      profileRows: [],
      feedbackRows: []
    };
  }

  const requestedClassId = dashboardFilter.classId || context.classroom?.id || "all";
  const selectedClassId = requestedClassId === "all" || availableClasses.some(row => row.id === requestedClassId)
    ? requestedClassId
    : (context.classroom?.id && availableClasses.some(row => row.id === context.classroom.id) ? context.classroom.id : "all");
  const selectedClassRows = selectedClassId === "all"
    ? availableClasses
    : availableClasses.filter(row => row.id === selectedClassId);
  const classIds = selectedClassRows.map(row => row.id);
  const selectedClassName = selectedClassId === "all"
    ? `All classes at ${context.teacher?.schoolName || "this school"}`
    : (selectedClassRows[0]?.name || "Selected class");

  const [studentsResult, moduleProgressResult, evidenceResult, votesResult, feedbackResult] = await Promise.allSettled([
    supabase
      .from("students")
      .select("id, display_name, username, created_at, last_login_at, class_id")
      .in("class_id", classIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("student_module_progress")
      .select("*")
      .in("class_id", classIds),
    supabase
      .from("assessment_evidence")
      .select("*, students(display_name, username)")
      .in("class_id", classIds)
      .order("created_at", { ascending: false })
      .limit(60),
    supabase
      .from("community_votes")
      .select("*")
      .in("class_id", classIds),
    supabase
      .from("feedback_reports")
      .select("*")
      .eq("feedback_type", "store-item-request")
      .order("created_at", { ascending: false })
      .limit(40)
  ]);

  const unwrapResult = (result, label) => {
    if (result.status === "rejected") {
      console.error(`${label} query failed`, result.reason);
      return [];
    }
    if (result.value?.error) {
      console.error(`${label} query failed`, result.value.error);
      return [];
    }
    return result.value?.data || [];
  };

  const students = unwrapResult(studentsResult, "students");
  const moduleProgress = unwrapResult(moduleProgressResult, "student_module_progress");
  const evidenceRows = unwrapResult(evidenceResult, "assessment_evidence");
  const voteRows = unwrapResult(votesResult, "community_votes");
  const feedbackRows = unwrapResult(feedbackResult, "feedback_reports");

  const studentIds = students.map(student => student.id);
  let profileRows = [];
  if (studentIds.length) {
    const { data, error: profilesError } = await supabase
      .from("player_profiles")
      .select(`
        student_id,
        career_title,
        annual_salary,
        cumulative_net_worth,
        savings,
        tax_paid,
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
      .in("student_id", studentIds);

    if (profilesError) {
      console.error("player_profiles query failed", profilesError);
    } else {
      profileRows = data || [];
    }
  }

  return {
    context,
    availableClasses,
    selectedClassId,
    selectedClassName,
    students: students || [],
    moduleProgress: moduleProgress || [],
    evidenceRows: evidenceRows || [],
    voteRows: voteRows || [],
    profileRows: (profileRows || []).map(mapRemotePlayerProfile),
    feedbackRows: feedbackRows || []
  };
}

function renderTeacherClassSelector(teacherData) {
  const selector = document.getElementById("teacher-class-selector");
  const summary = document.getElementById("teacher-class-summary");
  const note = document.getElementById("teacher-class-scope-note");
  if (!selector || !summary || !note) return;

  const classes = teacherData?.availableClasses || [];
  const selectedClassId = teacherData?.selectedClassId || "all";

  selector.innerHTML = [
    '<option value="all">All Classes At School</option>',
    ...classes.map(classroom => `<option value="${classroom.id}" ${classroom.id === selectedClassId ? "selected" : ""}>${escapeHtml(classroom.name)} (${escapeHtml(classroom.class_code || "No code")})</option>`)
  ].join("");
  summary.value = teacherData?.selectedClassName || "No class selected";
  note.textContent = classes.length
    ? `${classes.length} class option(s) found for this teacher/school context.`
    : "No classes found for this teacher yet.";

  selector.onchange = () => {
    setTeacherDashboardFilter({
      scope: selector.value === "all" ? "all" : "class",
      classId: selector.value
    });
    initDashboards().catch(console.error);
  };
}

async function renderStudentLiveData(players, skillsData) {
  const session = getCurrentPlayerSession();
  const authState = getAuthPrototypeState();
  const record = getCurrentPlayerRecord(players, session);
  const history = getPlayerHistory(players, session);
  const latestPlayers = dedupeLatestPlayers(players);
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
  const taxPaid = Number(record?.tax_paid ?? session?.taxPaid ?? Math.floor(Number(record?.cumulative_net_worth || 0) * 0.1));
  const assetCount = await getCurrentStudentAssetCount();
  const moduleProgressById = await getCurrentStudentModuleProgress();
  const assetsOwned = assetCount ?? Math.max(0, Math.floor(Number(record?.cumulative_net_worth || 0) / 25000));
  const lifelongProgress = Number(moduleProgressById["lifelong-learning"]?.completion_percent || 0);
  const lifelongMastery = Number(moduleProgressById["lifelong-learning"]?.mastery_percent || 0);
  const estProgress = Number(moduleProgressById["est-prep"]?.completion_percent || 0);
  const estMastery = Number(moduleProgressById["est-prep"]?.mastery_percent || 0);
  const overallModuleCompletion = Math.round(average([
    moduleCompletion,
    lifelongProgress,
    estProgress
  ]));

  setText("student-hero-title", record ? `${record.player_name}'s Career Empire` : "Build your future, not just your score.");
  if (!record && authState?.studentLogin?.displayName) {
    setText("student-hero-title", `${authState.studentLogin.displayName}'s Career Empire`);
  }
  setText(
    "student-hero-subtitle",
    record
      ? `${record.career_title || "Professional"} from ${record.school_name || "your class"} with ${overallMastery}% overall megatrend mastery and ${record.years_played || 0} years played.`
      : authState?.studentLogin?.username
        ? authState?.studentLogin?.demo
          ? `Demo student mode is active for ${authState.studentLogin.displayName || authState.studentLogin.username}. Explore the full student journey, spend in the shop, and test modules without saving to live student records.`
          : authState?.studentLogin?.preview
          ? `Teacher preview mode is active for ${authState.studentLogin.displayName || authState.studentLogin.username}. Explore the student experience without affecting live student records.`
          : `Signed in as ${authState.studentLogin.username}. Launch the game to begin building live module progress and shared career stats.`
        : "Launch the Megatrends game first, then come back here to see your live player profile."
  );

  const badgeStack = document.getElementById("student-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = record ? [
      renderBadge(`Salary: ${formatCurrency(record.annual_salary)}`, STUDENT_STATUS_ICONS.salary, "Salary"),
      renderBadge(`Net Worth: ${formatCurrency(record.cumulative_net_worth)}`, STUDENT_STATUS_ICONS.netWorth, "Net worth"),
      renderBadge(`Work-Life Balance: ${record.work_life_balance || 0}%`, STUDENT_STATUS_ICONS.workLife, "Work-life balance"),
      renderBadge(`Job Security: ${record.job_security || 0}%`, STUDENT_STATUS_ICONS.jobSecurity, "Job security"),
      renderBadge(`Strongest Skill: ${strongestSkill?.title || "Not yet clear"}`, strongestSkill?.logoPath, strongestSkill?.title),
      renderBadge(`Class Code: ${record.class_code || "Not joined"}`)
    ].join("") : authState?.studentLogin?.username
      ? [
        renderBadge(`Student: ${authState.studentLogin.displayName || authState.studentLogin.username}`),
        renderBadge(`Username: ${authState.studentLogin.username}`),
        renderBadge(
          authState?.studentLogin?.demo
            ? "Demo mode • local-only progress"
            : authState?.studentLogin?.preview
              ? "Teacher test-student preview"
              : "Live gameplay stats will appear after the first saved session"
        )
      ].join("")
      : '<span class="badge">No active student session yet</span>';
  }

  setText("student-focus-text", weakestSkill ? `${weakestSkill.title} is your current focus area. The next module should target this skill more directly.` : "Launch a module to begin skill tracking.");
  if (document.getElementById("student-focus-text") && !record) {
    setText("student-focus-text", "EST Prep is ready next. Use it to train command verbs, glossary terms, and short-answer structure before the assessment.");
  }
  setText("student-overall-completion", `${overallModuleCompletion}%`);
  setText("student-overall-completion-note", record ? `${record.years_played || 0} Megatrends rounds recorded, with live module sync across the platform.` : "No gameplay recorded yet");
  setText("student-employability-score", `${employabilityScore}%`);
  setText("student-tax-paid", formatCurrency(taxPaid));
  setText("student-assets-owned", String(assetsOwned));

  const voteLabels = getCommunityVoteLabels();
  const voteKeys = ["climate", "tech", "diversity", "global"];
  const voteCounts = voteKeys.reduce((acc, key) => {
    acc[key] = latestPlayers.filter(player => player.community_vote === key).length;
    return acc;
  }, {});
  const totalVotes = voteKeys.reduce((sum, key) => sum + voteCounts[key], 0);
  const leadingVote = voteKeys
    .map(key => ({ key, count: voteCounts[key] }))
    .sort((a, b) => b.count - a.count)[0];
  renderStudentCommunityBoard({
    currentVoteLabel: voteLabels[record?.community_vote || "none"] || "No community vote yet",
    taxPaid: formatCurrency(taxPaid),
    summary: record?.community_vote && record.community_vote !== "none"
      ? `Ten percent of your gains are helping build your class community. Your current vote is feeding ${voteLabels[record.community_vote]}.`
      : "Your gameplay can help decide where the class fund goes next. Cast a community vote inside modules to shape the outcome.",
    leadingCause: leadingVote?.count ? voteLabels[leadingVote.key] : "No votes yet",
    voteIntro: totalVotes
      ? `${totalVotes} class vote${totalVotes === 1 ? "" : "s"} recorded so far.`
      : "No class votes have been recorded yet.",
    voteRows: voteKeys.map(key => ({
      id: key,
      label: voteLabels[key],
      percent: totalVotes ? Math.round((voteCounts[key] / totalVotes) * 100) : 0
    }))
  });

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
      imagePath: "../Assets/Images and Animations/Student Hub/module-megatrends-thumb.png",
      launchPath: buildMegatrendsLaunchPath(),
      launchLabel: "Open Megatrends",
      tags: ["Live data", "Career stats", "Class impact"]
    },
    {
      title: "Lifelong Learning",
      state: lifelongProgress ? "Progress saved" : "Prototype live",
      summary: "Build pathway flexibility, training choices, and professional growth through the first playable Lifelong Learning prototype.",
      progress: lifelongProgress,
      mastery: lifelongMastery,
      variant: "green",
      spotlight: false,
      logoPath: skillsData.categories.find(category => category.id === "time-management")?.logoPath,
      logoLabel: "Time Management",
      imagePath: "../Assets/Images and Animations/Student Hub/module-lifelong-learning-thumb.png",
      launchPath: "../modules/lifelong-learning/index.html",
      launchLabel: "Open Lifelong Learning",
      tags: ["Planning", "Growth", "Reflection"]
    },
    {
      title: "EST Prep",
      state: estProgress ? "Progress saved" : "Prototype live",
      summary: "Train for the upcoming EST by decoding questions, locking in glossary terms, and building mark-worthy responses.",
      progress: estProgress,
      mastery: estMastery,
      variant: "",
      spotlight: false,
      logoPath: skillsData.categories.find(category => category.id === "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking",
      imagePath: "../Assets/Images and Animations/Student Hub/module-est-prep-thumb.png",
      launchPath: "../modules/est-prep/index.html",
      launchLabel: "Open EST Prep",
      tags: ["Exam readiness", "Command verbs", "Short answer"]
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
      imagePath: "../Assets/Images and Animations/Global Shop/global-shop-student-hub.png",
      launchPath: "../shop/index.html",
      launchLabel: "Open Global Shop",
      tags: ["Shared inventory", "Cross-module", "Life build"]
    }
  ]);
  const economyTimeline = buildEconomyTimelineItems(session);
  renderStudentTimeline(economyTimeline.length ? economyTimeline : history.slice(0, 3).map(entry => ({
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
  const safeTeacherData = teacherData || {
    context: teacherContext,
    availableClasses: [],
    selectedClassId: "all",
    selectedClassName: "No classes found",
    students: [],
    moduleProgress: [],
    evidenceRows: [],
    voteRows: [],
    profileRows: [],
    feedbackRows: []
  };
  const skillCategories = Array.isArray(skillsData?.categories) ? skillsData.categories : [];

  renderTeacherClassSelector(safeTeacherData);

  const selectedClassCode = teacherData?.selectedClassId && teacherData.selectedClassId !== "all"
    ? (teacherData.availableClasses || []).find(row => row.id === teacherData.selectedClassId)?.class_code || ""
    : "";
  const classCodeFilter = selectedClassCode || teacherContext.classroom?.classCode || teacherContext.teacherSession?.classCode || "";
  const latestPlayers = teacherData?.profileRows?.length
    ? dedupeLatestPlayers(teacherData.profileRows)
    : dedupeLatestPlayers(players).filter(player => !classCodeFilter || player.class_code === classCodeFilter);
  const students = teacherData?.students || [];
  const moduleProgressRows = teacherData?.moduleProgress || [];
  const evidenceRows = teacherData?.evidenceRows || [];
  const voteRows = teacherData?.voteRows || [];
  const feedbackRows = teacherData?.feedbackRows || [];
  const estProgressRows = moduleProgressRows.filter(row => (row.module_id || row.module_slug) === "est-prep");
  const estEvidenceRows = evidenceRows.filter(row => (row.module_id || row.module_slug) === "est-prep");
  const parsedEvidenceRows = evidenceRows.map(row => ({
    row,
    payload: parseStructuredEvidence(row)
  }));
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
  const weakestSkill = skillCategories.find(category => category.id === weakestSkillId);
  const moduleMasteries = latestPlayers.map(player => average([
    Number(player.tech_mastery || 0),
    Number(player.climate_mastery || 0),
    Number(player.demo_mastery || 0),
    Number(player.economic_mastery || 0)
  ]));
  let studentsOnTrack = moduleMasteries.filter(value => value >= 50).length;
  let studentsAtRisk = moduleMasteries.filter(value => value < 35).length;
  const evidenceCount = evidenceRows.length;
  const classFund = latestPlayers.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
  let classMastery = average(moduleMasteries);
  let averageSecurity = average(latestPlayers.map(player => Number(player.job_security || 0)));
  const loggedInStudents = students.filter(student => student.last_login_at).length;
  const moduleCompletion = average(moduleProgressRows.map(row => Number(row.completion_percent || 0)));
  const moduleMastery = average(moduleProgressRows.map(row => Number(row.mastery_percent || 0)));
  if (isPromoTeacherDashboardMode()) {
    studentsOnTrack = 14;
    studentsAtRisk = 2;
    classMastery = Math.max(classMastery, 78);
    averageSecurity = Math.max(averageSecurity, 84);
  }
  const latestEvidence = evidenceRows.slice(0, 4).map(row => ({
    title: `${row.module_id || row.module_slug || "module"} • ${formatDateTime(row.created_at)}`,
    detail: `${row.prompt || "Reflection submitted"}${row.response_text ? ` — ${String(row.response_text).slice(0, 120)}${String(row.response_text).length > 120 ? "..." : ""}` : ""}`
  }));
  const estResponses = estEvidenceRows.slice(0, 8).map(row => {
    const payload = parseStructuredEvidence(row);
    const responseText = payload?.response_text || row.response_text || "";
    const promptText = payload?.prompt_text || row.prompt || "";
    const topicLabel = payload?.topic_group || "";
    const score = typeof payload?.score_percent === "number"
      ? Math.round(payload.score_percent)
      : typeof row.auto_score === "number"
        ? Math.round(row.auto_score)
        : null;

    return {
      title: `${row.students?.display_name || row.students?.username || "Student"} • ${topicLabel || payload?.task_name || row.evidence_type || "response"} • ${score !== null ? `${score}%` : "Unscored"} • ${formatDateTime(row.created_at)}`,
      detail: [
        topicLabel ? `Topic: ${topicLabel}` : "",
        promptText ? `Prompt: ${promptText}` : "",
        responseText ? `Response: ${String(responseText).slice(0, 220)}${String(responseText).length > 220 ? "..." : ""}` : "No response text stored yet.",
        typeof payload?.training_score_percent === "number" ? `Practice Bay: ${Math.round(payload.training_score_percent)}%` : "",
        payload?.sample_response ? `Sample shown: ${String(payload.sample_response).slice(0, 140)}${String(payload.sample_response).length > 140 ? "..." : ""}` : ""
      ].filter(Boolean).join(" • ")
    };
  });
  const taskTimingRows = parsedEvidenceRows
    .filter(entry => entry.payload?.duration_seconds)
    .slice(0, 10)
    .map(({ row, payload }) => {
      const studentName = row.students?.display_name || row.students?.username || "Student";
      const moduleLabel = payload.module_id === "est-prep" ? "EST Prep" : payload.module_id === "megatrends" ? "Megatrends" : (payload.module_id || row.module_id || "Module");
      const score = typeof payload.score_percent === "number" ? ` • ${Math.round(payload.score_percent)}%` : "";
      const topicLabel = payload.topic_group ? ` • ${payload.topic_group}` : "";
      return {
        title: `${studentName} • ${moduleLabel} • ${payload.task_name || row.evidence_type || "Task"}${topicLabel}`,
        detail: `${formatDurationSeconds(payload.duration_seconds)}${score}${typeof payload.training_score_percent === "number" ? ` • Practice Bay ${Math.round(payload.training_score_percent)}%` : ""} • ${formatDateTime(row.created_at)}${payload.prompt_text ? ` • Prompt: ${String(payload.prompt_text).slice(0, 120)}${String(payload.prompt_text).length > 120 ? "..." : ""}` : ""}`
      };
    });
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
      const key = row.vote_key || row.cause;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]} votes)` : "No votes yet";
  })();
  const storeRequests = feedbackRows
    .map(normaliseStoreRequest)
    .filter(Boolean)
    .filter(request => {
      const matchesClass = !classCodeFilter || request.classCode === classCodeFilter;
      const teacherSchool = teacherContext.teacherLogin?.schoolName || teacherContext.teacher?.schoolName || "";
      const matchesSchool = !teacherSchool || request.schoolName === teacherSchool;
      return matchesClass || matchesSchool;
    });
  const studentCompareRows = students.map(student => {
    const player = latestPlayers.find(entry => entry.id === student.id) || null;
    const studentProgress = moduleProgressRows.filter(row => row.student_id === student.id);
    const megatrendsProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "megatrends") || null;
    const estProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "est-prep") || null;
    const studentEvidence = parsedEvidenceRows.filter(entry => entry.row.student_id === student.id);
    const estEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "est-prep");
    const megatrendsEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "megatrends");
    const latestEST = estEvidence[0]?.payload || null;
    const latestMegatrends = megatrendsEvidence[0]?.payload || null;
    const latestESTTopicRows = estEvidence
      .filter(entry => entry.payload?.topic_group)
      .slice(0, 3)
      .map(entry => `${entry.payload.topic_group}: ${typeof entry.payload.score_percent === "number" ? `${Math.round(entry.payload.score_percent)}%` : "unscored"} in ${formatDurationSeconds(entry.payload.duration_seconds)}`);
    const timedEvidence = studentEvidence.filter(entry => entry.payload?.duration_seconds);
    const averageTaskTime = timedEvidence.length
      ? Math.round(timedEvidence.reduce((sum, entry) => sum + Number(entry.payload.duration_seconds || 0), 0) / timedEvidence.length)
      : 0;
    const overallMastery = player ? average([
      Number(player.tech_mastery || 0),
      Number(player.climate_mastery || 0),
      Number(player.demo_mastery || 0),
      Number(player.economic_mastery || 0)
    ]) : 0;
    const strongestSkillId = getStrongestSkill(player ? deriveEmployabilityProgress(player) : {
      communication: 0,
      "digital-literacy": 0,
      teamwork: 0,
      "time-management": 0,
      "critical-thinking": 0,
      "problem-solving": 0
    })[0];
    const strongestSkill = skillCategories.find(category => category.id === strongestSkillId);
    const recentResponseText = latestEST?.response_text || latestMegatrends?.response_text || "";
    const recentPrompt = latestEST?.prompt_text || latestMegatrends?.prompt_text || "";
    const recentModule = latestEST ? "EST Prep" : latestMegatrends ? "Megatrends" : "No written evidence yet";

    return {
      name: student.display_name || student.username || "Student",
      meta: [
        student.username || "No username",
        student.last_login_at ? `Last login ${formatDateTime(student.last_login_at)}` : "Not logged in yet"
      ].join(" • "),
      status: overallMastery >= 60 ? "On track" : estProgress || megatrendsProgress ? "Building" : "Not started",
      summary: player
        ? `${player.career_title || "Career Builder"} with ${overallMastery}% overall megatrend mastery, ${formatCurrency(player.annual_salary || 0)} salary, and ${formatCurrency(player.cumulative_net_worth || 0)} net worth.`
        : "No live profile yet. This student needs first-play data to unlock deeper comparison.",
      pills: [
        `Megatrends mastery: ${Number(megatrendsProgress?.mastery_percent || overallMastery)}%`,
        `EST mastery: ${Number(estProgress?.mastery_percent || 0)}%`,
        `Avg task time: ${averageTaskTime ? formatDurationSeconds(averageTaskTime) : "No timings yet"}`,
        `Strongest skill: ${strongestSkill?.title || "Not clear yet"}`
      ],
      megatrendsCompletion: Number(megatrendsProgress?.completion_percent || Math.min(100, Number(player?.years_played || 0) * 18 || 0)),
      estCompletion: Number(estProgress?.completion_percent || 0),
      spotlight: Boolean(estProgress && megatrendsProgress),
      details: [
        {
          title: "Megatrends snapshot",
          detail: player
            ? `Years played ${Number(player.years_played || 0)} • Job security ${Number(player.job_security || 0)}% • Work-life balance ${Number(player.work_life_balance || 0)}%`
            : "No Megatrends profile saved yet."
        },
        {
          title: "EST snapshot",
          detail: estProgress
            ? `Completion ${Number(estProgress.completion_percent || 0)}% • Mastery ${Number(estProgress.mastery_percent || 0)}% • Attempts ${Number(estProgress.attempts || 0)}${latestESTTopicRows.length ? ` • ${latestESTTopicRows.join(" | ")}` : ""}`
            : "No EST progress saved yet."
        },
        {
          title: `Latest response • ${recentModule}`,
          detail: recentResponseText
            ? `${latestEST?.topic_group ? `${latestEST.topic_group} • ` : ""}${recentPrompt ? `${String(recentPrompt).slice(0, 70)}${String(recentPrompt).length > 70 ? "..." : ""} • ` : ""}${String(recentResponseText).slice(0, 120)}${String(recentResponseText).length > 120 ? "..." : ""}`
            : "No written response stored yet."
        }
      ]
    };
  }).sort((a, b) => {
    const aScore = Number(a.megatrendsCompletion || 0) + Number(a.estCompletion || 0);
    const bScore = Number(b.megatrendsCompletion || 0) + Number(b.estCompletion || 0);
    return bScore - aScore;
  });

  setText("teacher-hero-title", teacherData?.selectedClassId === "all" ? `All classes at ${teacherContext.teacher?.schoolName || "your school"}` : (classCodeFilter ? `Class ${classCodeFilter} overview` : "Teacher dashboard for all active records"));
  setText(
    "teacher-hero-subtitle",
    students.length
      ? `Tracking ${students.length} student accounts with ${loggedInStudents} logged in, ${evidenceCount} evidence item(s), and live module data feeding the ${teacherData?.selectedClassId === "all" ? "school-wide" : "class"} view.`
      : "Unlock the teacher area in the game or create student progress first to populate this dashboard."
  );

  const badgeStack = document.getElementById("teacher-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = students.length ? [
      renderBadge(`Class: ${classCodeFilter || "Current class"}`),
      renderBadge(`Scope: ${teacherData?.selectedClassId === "all" ? "All classes" : "Single class"}`),
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

  renderSkills({ categories: skillCategories }, "teacher-skill-grid", classSkillMap);
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
      title: "EST Prep",
      status: estProgressRows.length ? "Prototype live" : "Awaiting EST submissions",
      summary: estProgressRows.length
        ? `Tracking ${estProgressRows.length} EST progress row(s) and ${estEvidenceRows.length} EST evidence artifact(s), including boss-round written responses.`
        : "Once students complete EST stages, this card will show EST-specific progress, mastery, and written responses.",
      completion: average(estProgressRows.map(row => Number(row.completion_percent || 0))),
      mastery: average(estProgressRows.map(row => Number(row.mastery_percent || 0))),
      variant: "green",
      spotlight: false
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
  renderTeacherESTResponseList(estResponses);
  renderTeacherTaskTimeList(taskTimingRows);
  renderTeacherStudentCompareList(studentCompareRows);
  renderTeacherStoreRequestList(storeRequests);
}

async function initDashboards() {
  syncMegatrendsLaunchLinks();
  let skillsData = { categories: [] };
  let players = [];

  try {
    skillsData = await loadEmployabilitySkills();
  } catch (error) {
    console.error("Failed to load employability skills", error);
  }

  try {
    players = await getPlayers();
  } catch (error) {
    console.error("Failed to load player data", error);
  }

  if (document.getElementById("student-module-grid")) {
    try {
      await renderStudentLiveData(players, skillsData);
    } catch (error) {
      console.error("Failed to render student dashboard", error);
    }
  }
  if (document.getElementById("leaderboard-page-list")) {
    try {
      renderSharedLeaderboard(players, skillsData);
    } catch (error) {
      console.error("Failed to render leaderboard page", error);
    }
  }
  if (document.getElementById("community-page-board")) {
    try {
      renderSharedCommunityPage(players);
    } catch (error) {
      console.error("Failed to render community page", error);
    }
  }
  if (document.getElementById("global-page-metrics")) {
    try {
      renderSharedGlobalPage(players);
    } catch (error) {
      console.error("Failed to render global index page", error);
    }
  }
  if (document.getElementById("teacher-module-health")) {
    let teacherData = null;
    if (isPromoTeacherDashboardMode()) {
      teacherData = getPromoTeacherDashboardData();
      players = teacherData.profileRows || players;
    } else {
      try {
        teacherData = await getTeacherDashboardData();
      } catch (error) {
        console.error("Failed to load teacher dashboard data", error);
      }
    }

    try {
      renderTeacherLiveData(players, skillsData, teacherData);
    } catch (error) {
      console.error("Failed to render teacher dashboard", error);
      renderTeacherLiveData([], { categories: [] }, teacherData || {
        context: getActiveTeacherContext(),
        availableClasses: [],
        selectedClassId: "all",
        selectedClassName: "No classes found",
        students: [],
        moduleProgress: [],
        evidenceRows: [],
        voteRows: [],
        profileRows: [],
        feedbackRows: []
      });
    }
  }
}

if (requireStudentHubAccess()) {
  initDashboards().catch(error => {
    console.error(error);
  });
}
