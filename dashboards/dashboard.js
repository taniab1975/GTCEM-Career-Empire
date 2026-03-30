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
  renderCommunityBoard("student-community-board", data);
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
      .select("*")
      .eq("class_id", classroomId),
    supabase
      .from("assessment_evidence")
      .select("*, students(display_name, username)")
      .eq("class_id", classroomId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("community_votes")
      .select("*")
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
  if (document.getElementById("student-focus-text") && !record) {
    setText("student-focus-text", "EST Prep is ready next. Use it to train command verbs, glossary terms, and short-answer structure before the assessment.");
  }
  setText("student-overall-completion", `${moduleCompletion}%`);
  setText("student-overall-completion-note", record ? `${record.years_played || 0} completed rounds currently recorded` : "No gameplay recorded yet");
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
      launchPath: buildMegatrendsLaunchPath(),
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
    },
    {
      title: "EST Prep",
      state: "Prototype live",
      summary: "Train for the upcoming EST by decoding questions, locking in glossary terms, and building mark-worthy responses.",
      progress: 0,
      mastery: 0,
      variant: "",
      spotlight: false,
      logoPath: skillsData.categories.find(category => category.id === "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking",
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
    title: `${row.module_id || row.module_slug || "module"} • ${formatDateTime(row.created_at)}`,
    detail: `${row.prompt || "Reflection submitted"}${row.response_text ? ` — ${String(row.response_text).slice(0, 120)}${String(row.response_text).length > 120 ? "..." : ""}` : ""}`
  }));
  const estResponses = estEvidenceRows.slice(0, 8).map(row => {
    const payload = parseStructuredEvidence(row);
    const responseText = payload?.response_text || row.response_text || "";
    const promptText = payload?.prompt_text || row.prompt || "";
    const score = typeof payload?.score_percent === "number"
      ? Math.round(payload.score_percent)
      : typeof row.auto_score === "number"
        ? Math.round(row.auto_score)
        : null;

    return {
      title: `${row.students?.display_name || row.students?.username || "Student"} • ${payload?.task_name || row.evidence_type || "response"} • ${score !== null ? `${score}%` : "Unscored"} • ${formatDateTime(row.created_at)}`,
      detail: [
        promptText ? `Prompt: ${promptText}` : "",
        responseText ? `Response: ${String(responseText).slice(0, 220)}${String(responseText).length > 220 ? "..." : ""}` : "No response text stored yet."
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
      return {
        title: `${studentName} • ${moduleLabel} • ${payload.task_name || row.evidence_type || "Task"}`,
        detail: `${formatDurationSeconds(payload.duration_seconds)}${score} • ${formatDateTime(row.created_at)}${payload.prompt_text ? ` • Prompt: ${String(payload.prompt_text).slice(0, 120)}${String(payload.prompt_text).length > 120 ? "..." : ""}` : ""}`
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
}

async function initDashboards() {
  syncMegatrendsLaunchLinks();
  const skillsData = await loadEmployabilitySkills();
  const players = await getPlayers();
  if (document.getElementById("student-module-grid")) {
    await renderStudentLiveData(players, skillsData);
  }
  if (document.getElementById("leaderboard-page-list")) {
    renderSharedLeaderboard(players, skillsData);
  }
  if (document.getElementById("community-page-board")) {
    renderSharedCommunityPage(players);
  }
  if (document.getElementById("global-page-metrics")) {
    renderSharedGlobalPage(players);
  }
  if (document.getElementById("teacher-module-health")) {
    const teacherData = await getTeacherDashboardData();
    renderTeacherLiveData(players, skillsData, teacherData);
  }
}

initDashboards().catch(error => {
  console.error(error);
});
