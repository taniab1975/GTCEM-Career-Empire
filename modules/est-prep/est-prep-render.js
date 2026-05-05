// EST Prep render bundle. Loaded as a classic browser script.
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

function setGameplayViewportMode(active) {
  document.body.classList.toggle("est-gameplay-viewport", active);
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("gameplay-viewport", active);
}

function getESTSceneBackground(scene) {
  if (scene === "challenge" || scene === "warning") return EST_SCENE_BACKGROUNDS.challenge;
  if (scene === "restored" || scene === "success") return EST_SCENE_BACKGROUNDS.restored;
  return EST_SCENE_BACKGROUNDS.neutral;
}

function buildESTSceneStyle(scene) {
  return `style="--est-scene-image:url('${escapeHtml(getESTSceneBackground(scene))}')"`;
}

function setStageScene(scene = "neutral") {
  const stageSection = document.getElementById("stage-section");
  if (!stageSection) return;
  stageSection.dataset.scene = scene;
  stageSection.style.setProperty("--est-stage-background", `url("${getESTSceneBackground(scene)}")`);
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
  const completedTopicCount = getCompletedContentTopicCount();
  const contentTrackButtons = groups.map((group, index) => {
    const status = getContentGroupStatus(group, index);
    const statusLabel = status === "active" ? "Current" : status === "complete" ? "Done" : "Not started";
    return `
      <button
        type="button"
        class="content-track-button compact ${status} ${index === state.contentGroupIndex ? "active" : ""}"
        onclick="window.ESTPrep.openContentGroupIntro(${index})"
      >
        <span class="content-track-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="content-track-copy">
          <strong>${escapeHtml(getContentGroupShortLabel(group.id))}</strong>
          <small>${escapeHtml(statusLabel)}</small>
        </span>
      </button>
    `;
  }).join("");
  if (isContentLessonActive() && currentGroup) {
    const status = isContentGroupDone(currentGroup) ? "Done" : "In progress";
    container.innerHTML = `
      <div class="focus-toolbar focus-toolbar--lesson">
        <button type="button" class="focus-back" onclick="window.ESTPrep.openStage('content')">← Topic menu</button>
        <div class="focus-lesson-pill">
          <strong>${escapeHtml(getContentGroupShortLabel(currentGroup.id))}</strong>
          <small>${escapeHtml(status)}</small>
        </div>
      </div>
    `;
    return;
  }
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
        <div class="content-track-subtitle">${escapeHtml(currentGroup ? currentGroup.title : `${completedTopicCount}/${groups.length || 0} topics banked. Choose one to enter its reactor.`)}</div>
      </div>
      <div class="content-track content-track-menu ${currentGroup ? "has-selection" : ""}">
        ${contentTrackButtons}
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

function setStagePulseVisible(visible) {
  const pulse = document.getElementById("stage-pulse");
  if (!pulse) return;
  pulse.style.display = visible ? "" : "none";
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
  const totalContentTopics = Math.max(1, (state.stageDeck?.contentGroups || []).length);
  const completedContentTopics = getCompletedContentTopicCount();
  container.innerHTML = STAGES.map(stage => `
    <article class="challenge-tile ${state.completed[stage.id] ? "completed" : ""} ${state.selectedStageId === stage.id ? "active" : ""}">
      <div class="kicker">${escapeHtml(stage.state)}</div>
      <h3>${escapeHtml(stage.title)}</h3>
      <p>${escapeHtml(stage.id === "content" && completedContentTopics > 0 ? `${completedContentTopics}/${totalContentTopics} topics banked in the knowledge reactor.` : stage.summary)}</p>
      <div class="challenge-meta">
        <span>${stage.id === "content" ? `${completedContentTopics}/${totalContentTopics} topics` : `${stage.marks} marks`}</span>
        <span>${stage.id === "content" ? `${formatCurrency(state.salaryBoost)} salary banked` : `${stage.readiness}% readiness`}</span>
      </div>
      <button type="button" onclick="window.ESTPrep.openStage('${stage.id}')">${stage.id === "content" && completedContentTopics > 0 ? "Resume lab" : state.completed[stage.id] ? "Review lab" : "Open lab"}</button>
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

function renderESTGuidePanel(groupId, context) {
  const character = getESTGuideCharacter(groupId);
  const pose = context === "intro"
    ? character.welcome
    : context === "forge"
      ? character.thinking
      : character.pointing;
  const label = groupId === "job-application"
    ? "Mission guide"
    : "EST guide";
  return `
    <div class="est-guide-panel est-guide-${escapeHtml(context)}">
      <img class="est-guide-image" src="${escapeHtml(pose)}" alt="EST guide character">
      <div class="est-guide-copy">
        <div class="kicker">${label}</div>
        <p>${escapeHtml(getESTGuideCopy(groupId, context))}</p>
      </div>
    </div>
  `;
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
  state.stageBestScores[stageId] = Math.max(Number(state.stageBestScores[stageId] || 0), Number(outcome.scoreRatio || 0));
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

function awardStageImprovement(stageId, previousRatio, nextRatio) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const prior = Math.max(0, Number(previousRatio || 0));
  const next = Math.max(prior, Number(nextRatio || 0));
  const deltaRatio = Math.max(0, next - prior);
  if (!deltaRatio) return;

  const earnedMarks = Math.max(0, Math.round(stage.marks * next) - Math.round(stage.marks * prior));
  const readinessGain = Math.max(0, Math.round(stage.readiness * next) - Math.round(stage.readiness * prior));
  const credits = Math.max(0, Math.round(stage.credits * deltaRatio));
  const tax = Math.max(0, Math.round(credits * stage.taxRate));

  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + readinessGain);
  state.confidence = Math.max(0, Math.min(100, state.confidence + 2));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.stageBestScores[stageId] = next;
  state.recentReward = {
    type: "positive",
    title: `${stage.title} best result improved`,
    detail: `Best score lifted from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • +${earnedMarks} marks • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} improved`,
    detail: `Best score raised from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • ${formatCurrency(credits)} salary added`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `${stageId}-improvement`,
    label: `${stage.title} improvement`,
    detail: `Best score improved from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}%`,
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

function showFeedbackBox(type, lines, extraHtml = "") {
  const scene = type === "good" ? "restored" : "challenge";
  setStageScene(scene);
  renderStageRoot(`
    <section class="est-scene-shell est-scene-shell--${scene}" ${buildESTSceneStyle(scene)}>
      <div class="feedback-box ${type}">
        ${lines.map(line => `<p>${line}</p>`).join("")}
        ${extraHtml}
        <p><button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button></p>
      </div>
    </section>
  `);
}
