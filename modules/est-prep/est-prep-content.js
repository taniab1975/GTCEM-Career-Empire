// EST Prep content bundle. Loaded as a classic browser script.
function getContentGroupShortLabel(groupId) {
  const labels = {
    initiative: "Initiative",
    "time-management": "Time",
    "personal-finance": "Finance",
    "job-application": "Cover Letters",
    communication: "Comms",
    "future-of-work": "Megatrends"
  };
  return labels[groupId] || "Topic";
}

function isContentGroupDone(group) {
  if (!group) return false;
  const bankedPercent = Math.max(0, Number(state.contentTopicBestScores[group.id] || 0));
  if (bankedPercent > 0) return true;
  const response = String(state.answers[`content-note-${group.id}`] || "").trim();
  const answeredChecks = (group.rounds || []).every((_, index) => Boolean(state.answers[`content-${group.id}-${index}`]));
  const trainingConfig = getContentTrainingConfig(group.id);
  const trainingScore = getTrainingScore(trainingConfig);
  return answeredChecks && Boolean(response) && trainingScore.percent >= 70;
}

function getCompletedContentTopicCount() {
  const groups = state.stageDeck?.contentGroups || [];
  return groups.reduce((count, group) => count + (isContentGroupDone(group) ? 1 : 0), 0);
}

function getModuleCompletionPercent() {
  const contentGroups = state.stageDeck?.contentGroups || [];
  const contentFraction = contentGroups.length
    ? getCompletedContentTopicCount() / contentGroups.length
    : (state.completed.content ? 1 : 0);
  const completedStageUnits = STAGES.reduce((sum, stage) => {
    if (stage.id === "content") return sum + contentFraction;
    return sum + (state.completed[stage.id] ? 1 : 0);
  }, 0);
  return Math.max(0, Math.min(100, Math.round((completedStageUnits / STAGES.length) * 100)));
}

function syncContentCompletionFromTopicScores() {
  const groups = state.stageDeck?.contentGroups || [];
  if (!groups.length) return;
  const allBanked = groups.every(group => Number(state.contentTopicBestScores[group.id] || 0) > 0);
  if (allBanked) {
    state.completed.content = true;
    state.stageBestScores.content = Math.max(
      Number(state.stageBestScores.content || 0),
      groups.reduce((sum, group) => sum + Number(state.contentTopicBestScores[group.id] || 0), 0) / (groups.length * 100)
    );
  }
}

function getContentGroupStatus(group, index) {
  if (index === state.contentGroupIndex && state.contentView !== "menu") return "active";
  return isContentGroupDone(group) ? "complete" : "pending";
}

function isContentLessonActive() {
  return state.selectedStageId === "content" && ["intro", "lesson", "response", "review"].includes(state.contentView) && state.contentGroupIndex >= 0;
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

function buildStageDeck(bank) {
  const glossaryTerms = buildGlossarySource();
  const contentGroups = buildContentGroups(bank);
  const glossaryBatches = chunkArray(pickRandom(glossaryTerms, 16), 4).slice(0, 4);

  return {
    contentGroups,
    glossaryBatches,
    decoderRound: pickRandom(bank.decoderRounds || [], 1)[0] || null,
    bossRound: pickRandom(bank.bossRounds || [], 1)[0] || null,
    communityOptions: bank.communityOptions || []
  };
}

function getContentTrainingConfig(groupId) {
  const { trainingBays } = getContentStageConfig();
  return trainingBays[groupId] || null;
}

function isArcTrainingType(type) {
  return /-arc$/.test(String(type || ""));
}

function getArcTrainingAnswerKey(configType, itemId) {
  return `training-${configType}-${itemId}`;
}

function getTrainingScore(config) {
  if (!config) return { correct: 0, total: 0, percent: 0 };
  if (isArcTrainingType(config.type)) {
    const items = (config.steps || []).flatMap(step => step.items || []);
    const total = items.length;
    const correct = items.filter(item => state.answers[getArcTrainingAnswerKey(config.type, item.id)] === item.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
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

function getArcStepProgress(config) {
  const steps = config?.steps || [];
  const stepStates = steps.map(step => {
    const items = step.items || [];
    const total = items.length;
    const correct = items.filter(item => state.answers[getArcTrainingAnswerKey(config.type, item.id)] === item.correct).length;
    return {
      title: step.title,
      correct,
      total,
      complete: total > 0 && correct === total
    };
  });
  const completedSteps = stepStates.filter(step => step.complete).length;
  const nextStep = stepStates.findIndex(step => !step.complete);
  const activeStep = nextStep === -1 ? stepStates.length : nextStep + 1;
  return { stepStates, completedSteps, activeStep };
}

function getArcStepQuestionProgress(config, stepIndex) {
  const step = config?.steps?.[stepIndex];
  const items = step?.items || [];
  const total = items.length;
  const correct = items.filter(item => getArcItemAnswer(config, item) === item.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return { total, correct, percent };
}

function getArcSceneImage(groupId, scene) {
  const groupScenes = EST_TOPIC_SCENES[groupId];
  if (!groupScenes) return "";
  if (scene === "restored" || scene === "success") return groupScenes.success || groupScenes.neutral || "";
  if (scene === "challenge" || scene === "warning") return groupScenes.challenge || groupScenes.neutral || "";
  return groupScenes.neutral || "";
}

function getTrainingConfigByType(type) {
  const { trainingBays } = getContentStageConfig();
  return Object.values(trainingBays || {}).find(config => config?.type === type) || null;
}

function getArcItemAnswer(config, item) {
  return state.answers[getArcTrainingAnswerKey(config.type, item.id)];
}

function getFirstPendingArcPosition(config) {
  const steps = config?.steps || [];
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex += 1) {
    const items = steps[stepIndex]?.items || [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      if (getArcItemAnswer(config, items[itemIndex]) !== items[itemIndex].correct) {
        return { phase: "question", stepIndex, itemIndex, lastOutcome: null };
      }
    }
  }
  return { phase: "complete", stepIndex: steps.length - 1, itemIndex: 0, lastOutcome: "correct" };
}

function getArcFlow(config) {
  if (!config) return null;
  const inferred = getFirstPendingArcPosition(config);
  const existing = state.arcFlows[config.type];
  if (!existing) {
    state.arcFlows[config.type] = inferred;
    return state.arcFlows[config.type];
  }

  if (existing.phase === "complete") {
    if (inferred.phase !== "complete") {
      state.arcFlows[config.type] = inferred;
    }
    return state.arcFlows[config.type];
  }

  const steps = config.steps || [];
  const step = steps[existing.stepIndex];
  const item = step?.items?.[existing.itemIndex];
  if (!step || !item) {
    state.arcFlows[config.type] = inferred;
    return state.arcFlows[config.type];
  }

  if (existing.phase === "transition") {
    const priorStepComplete = (steps[existing.stepIndex]?.items || []).every(entry => getArcItemAnswer(config, entry) === entry.correct);
    if (!priorStepComplete) {
      state.arcFlows[config.type] = inferred;
    }
    return state.arcFlows[config.type];
  }

  if (existing.phase === "feedback") {
    const answer = getArcItemAnswer(config, item);
    if (!answer) {
      state.arcFlows[config.type] = inferred;
    }
    return state.arcFlows[config.type];
  }

  if (existing.phase === "question" && getArcItemAnswer(config, item) === item.correct) {
    state.arcFlows[config.type] = {
      phase: "feedback",
      stepIndex: existing.stepIndex,
      itemIndex: existing.itemIndex,
      lastOutcome: "correct"
    };
  }
  return state.arcFlows[config.type];
}

function getArcProgressRailAsset(config) {
  const { completedSteps } = getArcStepProgress(config);
  if (completedSteps === 0) return EST_PROGRESS_RAILS.step1;
  if (completedSteps === 1) return EST_PROGRESS_RAILS.step2;
  if (completedSteps === 2) return EST_PROGRESS_RAILS.step3;
  if (completedSteps === 3) return EST_PROGRESS_RAILS.step4;
  return EST_PROGRESS_RAILS.complete;
}

function renderArcProgressRail(config, className = "") {
  const { completedSteps, activeStep, stepStates } = getArcStepProgress(config);
  const asset = getArcProgressRailAsset(config);
  const totalSteps = stepStates.length || 4;
  const caption = completedSteps === totalSteps
    ? "All reactor steps complete"
    : `Step ${activeStep} active • ${completedSteps}/${totalSteps} complete`;
  const classes = ["arc-progress-rail", className].filter(Boolean).join(" ");
  return `
    <div class="${escapeHtml(classes)}">
      <img class="arc-progress-image" src="${escapeHtml(asset)}" alt="${escapeHtml(caption)}">
      <div class="arc-progress-caption">${escapeHtml(caption)}</div>
    </div>
  `;
}

function renderArcActionButton({ label, onclick, asset, className = "" }) {
  const classes = ["arc-action-button", className].filter(Boolean).join(" ");
  return `
    <button type="button" class="${escapeHtml(classes)}" onclick="${onclick}">
      ${asset ? `<span class="arc-action-media"><img src="${escapeHtml(asset)}" alt=""></span>` : ""}
      <span class="arc-action-label">${escapeHtml(label)}</span>
    </button>
  `;
}

function getContentTopicRewardPreview() {
  const stage = STAGES.find(item => item.id === "content");
  const totalTopics = Math.max(1, (state.stageDeck?.contentGroups || []).length);
  if (!stage) return { marks: 0, readiness: 0, credits: 0, tax: 0 };
  return {
    marks: Math.max(1, Math.round(stage.marks / totalTopics)),
    readiness: Math.max(1, Math.round(stage.readiness / totalTopics)),
    credits: Math.max(1, Math.round(stage.credits / totalTopics)),
    tax: Math.max(0, Math.round((stage.credits / totalTopics) * stage.taxRate))
  };
}

function getArcGuidePose(groupId, flow, isCorrect) {
  const character = getESTGuideCharacter(groupId);
  if (flow?.phase === "complete") return character.celebrating || character.encouraging || character.pointing;
  if (flow?.phase === "transition") return character.encouraging || character.pointing || character.welcome;
  if (flow?.phase === "feedback" && !isCorrect) return character.thinking || character.pointing || character.welcome;
  if (flow?.phase === "feedback" && isCorrect) return character.encouraging || character.pointing || character.welcome;
  return character.pointing || character.welcome;
}

function renderArcGuideAside({ config, groupId, scene, flow, currentStep, currentItem, questionNumber, questionCount, stepProgress, completedSteps, totalStepCount, isCorrect }) {
  const guideContext = flow?.phase === "complete"
    ? "forge"
    : flow?.phase === "feedback" && !isCorrect
      ? "forge"
      : "challenge";
  const guidePose = getArcGuidePose(groupId, flow, isCorrect);
  const sceneImage = getArcSceneImage(groupId, scene) || getESTSceneBackground(scene);
  const statusTitle = flow?.phase === "complete"
    ? "Reactor restored"
    : currentStep?.title || "Reactor step";
  const statusCopy = flow?.phase === "complete"
    ? `${completedSteps}/${totalStepCount} steps complete. Build the EST response while the content is fresh.`
    : currentItem
      ? `Flash card ${questionNumber} of ${questionCount}. ${stepProgress.correct}/${stepProgress.total} restored in this step.`
      : `${completedSteps}/${totalStepCount} steps complete.`;
  return `
    <aside class="training-focus-aside training-focus-aside--arc" aria-label="Reactor guide">
      <div class="training-guide-mini training-guide-mini--arc est-guide-${escapeHtml(guideContext)}">
        <img class="training-guide-mini-image training-guide-mini-image--arc" src="${escapeHtml(guidePose)}" alt="ECC guide character">
        <div class="training-guide-mini-copy">
          <div class="kicker">ECC guide</div>
          <p>${escapeHtml(getESTGuideCopy(groupId, guideContext))}</p>
        </div>
      </div>
      <div class="training-focus-summary">
        <div class="kicker">Mission status</div>
        <h3>${escapeHtml(statusTitle)}</h3>
        <p>${escapeHtml(statusCopy)}</p>
      </div>
      <div class="training-scene-preview training-scene-preview--arc">
        <img src="${escapeHtml(sceneImage)}" alt="${escapeHtml(config.title)} scene">
      </div>
      ${config.memoryHook ? `
        <details class="training-memory-hook" open>
          <summary>Memory hook</summary>
          <p>${escapeHtml(config.memoryHook)}</p>
        </details>
      ` : ""}
    </aside>
  `;
}

function renderArcTrainingBay(config, score) {
  const groupId = getGroupIdForTrainingType(config.type);
  const groupLabel = getContentGroupShortLabel(groupId);
  const flow = getArcFlow(config);
  const scene = flow?.phase === "complete" || flow?.phase === "transition" ? "restored" : "challenge";
  const steps = config.steps || [];
  const currentStep = steps[flow?.stepIndex || 0] || steps[0];
  const currentItem = currentStep?.items?.[flow?.itemIndex || 0] || null;
  const answerKey = currentItem ? getArcTrainingAnswerKey(config.type, currentItem.id) : "";
  const currentAnswer = currentItem ? state.answers[answerKey] : "";
  const isCorrect = currentItem ? currentAnswer === currentItem.correct : false;
  const questionCount = currentStep?.items?.length || 0;
  const questionNumber = Math.min(questionCount || 1, (flow?.itemIndex || 0) + 1);
  const stepNumber = Math.min(steps.length || 1, (flow?.stepIndex || 0) + 1);
  const completedAll = flow?.phase === "complete";
  const transitionStepNumber = Math.min(steps.length || 1, ((flow?.stepIndex || 0) + 2));
  const stepProgress = getArcStepQuestionProgress(config, flow?.stepIndex || 0);
  const totalStepCount = steps.length || 4;
  const completedSteps = getArcStepProgress(config).completedSteps;
  const rewardPreview = getContentTopicRewardPreview();
  const microReward = isCorrect
    ? `Correct call locked. Salary and tax bank when this strand is completed or improved.`
    : `No salary banks on this card yet. Lock the strongest answer to move forward.`;
  const stateTitle = isCorrect ? `${groupLabel} signal locked` : "Try again";
  const stateLead = isCorrect ? "Strong call." : "Not quite yet.";
  return `
    <section class="est-scene-shell est-scene-shell--${scene}" ${buildESTSceneStyle(scene)}>
      <div class="panel training-bay training-campaign training-campaign--focus">
        <div class="training-hud training-hud--compact training-hud--mission">
          <div class="training-hud-copy">
            <div class="kicker">Knowledge reactor</div>
            <h2>${escapeHtml(config.title)}</h2>
          </div>
          <div class="training-hud-status">
            <strong>${escapeHtml(currentStep?.title || "Reactor step")}</strong>
            <small>${escapeHtml(completedAll ? `All ${totalStepCount} steps cleared` : `${stepProgress.correct}/${stepProgress.total} cleared in this step • ${completedSteps}/${totalStepCount} steps done`)}</small>
          </div>
        </div>
        <div class="training-focus-shell training-focus-shell--arc">
          ${renderArcGuideAside({ config, groupId, scene, flow, currentStep, currentItem, questionNumber, questionCount, stepProgress, completedSteps, totalStepCount, isCorrect })}
          <div class="training-focus-main">
            <div class="training-campaign-grid training-campaign-grid--flash">
          ${completedAll ? `
            <section class="training-step training-step--transition training-step--scene-change">
              <div class="training-state-popover training-state-popover--scene good">
                <div class="training-flash-media training-flash-media--scene">
                  <img src="${escapeHtml(EST_ANIMATED_ASSETS.unlock)}" alt="">
                </div>
                <div class="training-answer-copy">
                  <div class="kicker">Reactor cleared</div>
                  <h3>All reactor steps complete</h3>
                  <p class="training-feedback">${score.correct}/${score.total} decisions locked in. Move straight into the EST response while the content is fresh.</p>
                </div>
                <div class="training-economy-note good">
                  <strong>Reward preview</strong>
                  <span>${escapeHtml(`Bank the topic review next to add +${rewardPreview.marks} marks • +${rewardPreview.readiness}% readiness • +${formatCurrency(rewardPreview.credits)} salary • +${formatCurrency(rewardPreview.tax)} community fund into Career Empire.`)}</span>
                </div>
                <div class="arc-action-row">
                  ${renderArcActionButton({
                    label: "Build EST response",
                    onclick: "window.ESTPrep.openContentResponse()",
                    asset: EST_ANIMATED_ASSETS.progress,
                    className: "arc-action-button--overlay"
                  })}
                  <button type="button" class="submit-button compact ghost" onclick="window.ESTPrep.resetCurrentContentTopic()">Reset reactor</button>
                </div>
              </div>
            </section>
          ` : flow?.phase === "transition" ? `
            <section class="training-step training-step--transition training-step--scene-change">
              <div class="training-state-popover training-state-popover--scene good">
                <div class="training-flash-media training-flash-media--scene">
                  <img src="${escapeHtml(EST_ANIMATED_ASSETS.chamber)}" alt="">
                </div>
                <div class="training-answer-copy">
                  <div class="kicker">Step ${stepNumber} banked</div>
                  <h3>${escapeHtml(steps[flow.stepIndex + 1]?.title || currentStep?.title || "Next step unlocked")}</h3>
                  <p class="training-feedback">Step ${transitionStepNumber} is unlocked. The next flash card opens when you continue.</p>
                </div>
                <div class="arc-action-row">
                  ${renderArcActionButton({
                    label: `Start Step ${transitionStepNumber}`,
                    onclick: `window.ESTPrep.startArcStep('${config.type}')`,
                    asset: EST_ANIMATED_ASSETS.next,
                    className: "arc-action-button--overlay"
                  })}
                  <button type="button" class="submit-button compact ghost" onclick="window.ESTPrep.resetCurrentContentTopic()">Reset reactor</button>
                </div>
              </div>
            </section>
          ` : currentItem ? `
            <section class="training-step training-step--flash ${currentAnswer ? "has-state-overlay" : ""}">
              <div class="training-main-header compact">
                <div class="training-main-copy">
                  <div class="kicker">Central task</div>
                  <h2>${escapeHtml(currentStep?.title || "Central task")}</h2>
                </div>
                <div class="training-step-meter">
                  <strong>${escapeHtml(`${stepProgress.correct}/${stepProgress.total} restored`)}</strong>
                  <div class="training-step-bar">
                    <div class="training-step-fill" style="width:${stepProgress.percent}%"></div>
                  </div>
                  <small>${escapeHtml(`Flash card ${questionNumber} of ${questionCount}`)}</small>
                  <span class="training-bank-preview">${escapeHtml(`Bank on topic review: +${formatCurrency(rewardPreview.credits)} salary • +${formatCurrency(rewardPreview.tax)} community fund`)}</span>
                </div>
              </div>
              <article class="training-card training-card--flash ${currentAnswer ? (isCorrect ? "good" : "bad") : ""}">
                  <div class="training-question-layout ${currentAnswer ? "is-dimmed" : ""}">
                  <div class="training-card-lead">
                    <p class="training-card-prompt">${escapeHtml(currentItem?.prompt || "")}</p>
                    <p>${escapeHtml(currentStep.instruction || "Choose the strongest move.")}</p>
                    <p class="training-feedback">Pick the strongest move, get instant feedback, then move to the next flash card.</p>
                  </div>
                  <div class="training-answer-column">
                    <div class="training-stack">
                      ${currentItem.options.map(option => `
                        <button
                          type="button"
                          class="choice-button ${currentAnswer === option ? "selected live-selected" : ""} ${currentAnswer && option === currentItem.correct ? "correct" : ""} ${currentAnswer === option && !isCorrect ? "incorrect" : ""}"
                          onclick="window.ESTPrep.setTrainingChoiceEncoded('${answerKey}', '${encodeURIComponent(option)}')"
                          ${currentAnswer ? "disabled" : ""}
                        >
                          <strong>${escapeHtml(option)}</strong>
                        </button>
                      `).join("")}
                    </div>
                    ${renderArcProgressRail(config, "arc-progress-rail--answer")}
                  </div>
                </div>
              </article>
              ${currentAnswer ? `
                <div class="training-state-scrim" aria-live="polite">
                  <section class="training-state-popover ${isCorrect ? "good" : "bad"}">
                    <div class="training-flash-media training-flash-media--state">
                      <img src="${escapeHtml(isCorrect ? EST_ANIMATED_ASSETS.tick : EST_ANIMATED_ASSETS.wrong)}" alt="${escapeHtml(isCorrect ? "Correct answer animation" : "Wrong answer animation")}">
                    </div>
                    <div class="training-answer-copy">
                      <div class="kicker">${escapeHtml(isCorrect ? "Signal restored" : "Try again")}</div>
                      <h3>${escapeHtml(isCorrect ? stateTitle : "That choice won’t unlock the chamber")}</h3>
                      <p class="training-feedback">${escapeHtml(`${stateLead} ${currentItem.feedback}`)}</p>
                    </div>
                    <div class="training-economy-note ${isCorrect ? "good" : "bad"}">
                      <strong>${isCorrect ? "Micro reward signal" : "Banking rule"}</strong>
                      <span>${escapeHtml(microReward)}</span>
                    </div>
                    ${isCorrect ? `
                      <div class="arc-action-row">
                        ${renderArcActionButton({
                          label: questionNumber === questionCount ? `Finish Step ${stepNumber}` : "Next flash card",
                          onclick: `window.ESTPrep.advanceArcCard('${config.type}')`,
                          asset: EST_ANIMATED_ASSETS.next,
                          className: "arc-action-button--overlay"
                        })}
                      </div>
                    ` : `
                      <div class="training-hint-inline training-hint-inline--state">
                        <img src="${escapeHtml(EST_ANIMATED_ASSETS.hint)}" alt="Hint animation">
                        <span>Try again. You’ll return to this flash card until you lock the strongest move.</span>
                      </div>
                      <div class="arc-action-row">
                        ${renderArcActionButton({
                          label: "Try again",
                          onclick: `window.ESTPrep.retryArcCard('${config.type}')`,
                          asset: EST_ANIMATED_ASSETS.hint,
                          className: "arc-action-button--overlay arc-action-button--retry"
                        })}
                      </div>
                    `}
                  </section>
                </div>
              ` : ""}
            </section>
          ` : ""}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
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

function getContentResponseScaffold(group) {
  return group?.responseScaffold || DEFAULT_CONTENT_RESPONSE_SCAFFOLDS[group?.id] || null;
}

function getContentResponseSegmentKey(groupId, segmentId) {
  return `content-scaffold-${groupId}-${segmentId}`;
}

function normaliseCoachText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getContentResponseCoachChecks(group, scaffold = getContentResponseScaffold(group)) {
  const defaultChecks = {
    initiative: [
      { id: "concept", label: "Names initiative clearly", keywords: ["initiative", "proactive", "improvement", "responsib", "help"] },
      { id: "example", label: "Uses a workplace action or example", keywords: ["restock", "suggest", "help", "volunteer", "system", "colleague"] },
      { id: "impact", label: "Explains the workplace effect", keywords: ["because", "productiv", "team", "safety", "efficient", "workplace"] }
    ],
    "time-management": [
      { id: "concept", label: "Explains planning and prioritising", keywords: ["plan", "prioritis", "deadline", "schedule", "organis"] },
      { id: "example", label: "Uses a tool or process example", keywords: ["planner", "calendar", "checklist", "reminder", "task", "sequence"] },
      { id: "impact", label: "Explains how deadlines are met", keywords: ["because", "deadline", "order", "adjust", "progress", "manage"] }
    ],
    "personal-finance": [
      { id: "concept", label: "Explains budgeting or financial management", keywords: ["budget", "income", "expense", "finance", "spending"] },
      { id: "example", label: "Uses a support or decision example", keywords: ["seek", "assistance", "review", "essential", "support", "adjust"] },
      { id: "impact", label: "Explains why the action helps", keywords: ["because", "stress", "decision", "informed", "manage", "stability"] }
    ],
    "job-application": [
      { id: "concept", label: "Explains STAR or the application method", keywords: ["star", "situation", "task", "action", "result", "criteria"] },
      { id: "example", label: "Shows evidence or structure", keywords: ["example", "evidence", "criteria", "clear", "response", "structure"] },
      { id: "impact", label: "Explains the employer benefit", keywords: ["because", "employer", "suitable", "show", "understand", "clear"] }
    ],
    communication: [
      { id: "concept", label: "Explains the communication skill", keywords: ["communic", "listen", "verbal", "non verbal", "clear"] },
      { id: "example", label: "Uses a workplace or interview action", keywords: ["clarify", "audience", "interview", "workplace", "understand"] },
      { id: "impact", label: "Explains the effect on others or tasks", keywords: ["because", "misunderstanding", "rapport", "effective", "task", "clear"] }
    ],
    "future-of-work": [
      { id: "concept", label: "Explains megatrends or labour market change", keywords: ["megatrend", "future of work", "industry", "change", "labour market"] },
      { id: "example", label: "Uses evidence, a growth area, or industry example", keywords: ["growth", "health", "technology", "renewable", "data", "industry"] },
      { id: "impact", label: "Explains why it matters for career pathways", keywords: ["because", "opportunit", "career", "skills", "training", "pathway"] }
    ]
  };
  return scaffold?.coachChecks || defaultChecks[group?.id] || [];
}

function evaluateContentResponse(group) {
  const scaffold = getContentResponseScaffold(group);
  const checks = getContentResponseCoachChecks(group, scaffold);
  const builtResponse = buildContentResponseText(group);
  const normalizedBuilt = normaliseCoachText(builtResponse);
  const segmentResults = (scaffold?.segments || []).map(segment => {
    const value = String(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "").trim();
    const normalized = normaliseCoachText(value);
    const coachCheck = checks.find(item => item.id === segment.id);
    const lengthPass = normalized.split(" ").filter(Boolean).length >= 3;
    const keywordPass = !coachCheck?.keywords?.length || coachCheck.keywords.some(keyword => normalized.includes(normaliseCoachText(keyword)));
    return {
      id: segment.id,
      label: coachCheck?.label || segment.label,
      passed: Boolean(value) && lengthPass && keywordPass,
      value
    };
  });
  const builtHasReasoning = /(^|\s)(because|so|which|therefore|helps|shows)\b/.test(normalizedBuilt);
  const passedCount = segmentResults.filter(item => item.passed).length + (builtHasReasoning ? 1 : 0);
  const totalChecks = segmentResults.length + 1;
  const level = passedCount >= totalChecks ? "strong" : passedCount >= Math.max(2, totalChecks - 1) ? "developing" : "needs-work";
  const summary = level === "strong"
    ? "This reads like a stronger EST-ready response: clear idea, useful example, and a reasoned effect."
    : level === "developing"
      ? "This is moving in the right direction, but one part is still too vague or underdeveloped."
      : "This still needs more clarity. Add a sharper content point, a more specific example, and a stronger why-it-matters explanation.";

  return {
    builtResponse,
    segmentResults,
    builtHasReasoning,
    level,
    summary
  };
}

function setContentResponseSegment(groupId, segmentId, value) {
  state.answers[getContentResponseSegmentKey(groupId, segmentId)] = value;
}

function setContentNoteValue(groupId, value) {
  state.answers[`content-note-${groupId}`] = value;
}

function buildContentResponseText(group) {
  const scaffold = getContentResponseScaffold(group);
  if (!scaffold) return state.answers[`content-note-${group.id}`] || "";
  return (scaffold.segments || [])
    .map(segment => {
      const value = String(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "").trim();
      if (!value) return "";
      const sentence = `${segment.starter}${value}`.trim();
      return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
    })
    .filter(Boolean)
    .join(" ");
}

function buildContentResponse(groupId) {
  const groups = state.stageDeck?.contentGroups || [];
  const group = groups.find(item => item.id === groupId);
  if (!group) return;
  const built = buildContentResponseText(group);
  state.answers[`content-note-${groupId}`] = built;
  const textarea = document.getElementById("content-note");
  if (textarea) textarea.value = built;
  state.recentReward = {
    type: "positive",
    title: "Response built",
    detail: "Your scaffold segments have been combined into a short EST-ready paragraph you can refine."
  };
  renderRewardPulse();
  renderContentStage();
}

function getResponseCoachScorePercent(group) {
  const responseCoach = evaluateContentResponse(group);
  const segmentPasses = responseCoach.segmentResults.filter(item => item.passed).length;
  const reasoningPass = responseCoach.builtHasReasoning ? 1 : 0;
  const totalChecks = responseCoach.segmentResults.length + 1;
  if (!totalChecks) return 0;
  return Math.round(((segmentPasses + reasoningPass) / totalChecks) * 100);
}

function evaluateContentTopic(group) {
  const trainingConfig = getContentTrainingConfig(group.id);
  const trainingScore = trainingConfig ? getTrainingScore(trainingConfig) : { correct: 0, total: 0, percent: 0 };
  const roundResults = group.rounds.map((round, index) => ({
    topic: round.topic,
    question: round.question,
    selected: state.answers[`content-${group.id}-${index}`] || "not chosen",
    correctAnswer: round.correct,
    correct: state.answers[`content-${group.id}-${index}`] === round.correct
  }));
  const knowledgeCorrect = roundResults.filter(item => item.correct).length;
  const knowledgePercent = roundResults.length ? Math.round((knowledgeCorrect / roundResults.length) * 100) : 0;
  const builtResponse = state.answers[`content-note-${group.id}`] || "";
  const responseCoach = evaluateContentResponse(group);
  const responsePercent = builtResponse ? getResponseCoachScorePercent(group) : 0;
  const overallPercent = Math.round((knowledgePercent * 0.4) + (trainingScore.percent * 0.4) + (responsePercent * 0.2));
  return {
    group,
    trainingConfig,
    trainingScore,
    roundResults,
    knowledgeCorrect,
    knowledgePercent,
    responseCoach,
    responsePercent,
    builtResponse,
    overallPercent
  };
}

function awardContentTopicImprovement(summary) {
  const stage = STAGES.find(item => item.id === "content");
  if (!stage) return { improved: false, firstBank: false, earnedMarks: 0, readinessGain: 0, credits: 0, tax: 0, previousPercent: 0, nextPercent: 0 };
  const totalTopics = Math.max(1, (state.stageDeck?.contentGroups || []).length);
  const previousPercent = Math.max(0, Number(state.contentTopicBestScores[summary.group.id] || 0));
  const nextPercent = Math.max(previousPercent, Number(summary.overallPercent || 0));
  const deltaRatio = Math.max(0, (nextPercent - previousPercent) / 100);
  if (!deltaRatio) {
    return {
      improved: false,
      firstBank: false,
      earnedMarks: 0,
      readinessGain: 0,
      credits: 0,
      tax: 0,
      previousPercent,
      nextPercent
    };
  }

  const stageMarksShare = stage.marks / totalTopics;
  const stageReadinessShare = stage.readiness / totalTopics;
  const stageCreditShare = stage.credits / totalTopics;
  const earnedMarks = Math.max(0, Math.round(stageMarksShare * deltaRatio));
  const readinessGain = Math.max(0, Math.round(stageReadinessShare * deltaRatio));
  const credits = Math.max(0, Math.round(stageCreditShare * deltaRatio));
  const tax = Math.max(0, Math.round(credits * stage.taxRate));

  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + readinessGain);
  state.confidence = Math.max(0, Math.min(100, state.confidence + (previousPercent ? 2 : 3)));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.contentTopicBestScores[summary.group.id] = nextPercent;

  const allGroups = state.stageDeck?.contentGroups || [];
  const allBanked = allGroups.length > 0 && allGroups.every(group => Number(state.contentTopicBestScores[group.id] || 0) > 0);
  if (allBanked) {
    state.completed.content = true;
    state.stageBestScores.content = Math.max(
      Number(state.stageBestScores.content || 0),
      allGroups.reduce((sum, group) => sum + Number(state.contentTopicBestScores[group.id] || 0), 0) / (allGroups.length * 100)
    );
  }

  state.recentReward = {
    type: "positive",
    title: `${summary.group.title} banked`,
    detail: `+${earnedMarks} marks • +${readinessGain}% readiness • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${summary.group.title} saved`,
    detail: `${summary.overallPercent}% strand score • ${formatCurrency(credits)} salary • ${formatCurrency(tax)} community tax`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `revision-topic-${summary.group.id}`,
    label: `EST content topic - ${summary.group.title}`,
    detail: `${summary.overallPercent}% strand score`,
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

  return {
    improved: true,
    firstBank: previousPercent === 0,
    earnedMarks,
    readinessGain,
    credits,
    tax,
    previousPercent,
    nextPercent
  };
}

function renderContentResponseForge(group) {
  const scaffold = getContentResponseScaffold(group);
  if (!scaffold) {
    return `
      <div class="written-stage">
        <strong>Quick EST response</strong>
        <p class="small-copy">Write a short response so teachers can see how well you can explain this content area, not just select the right option. Students can compare this with a model answer after submission.</p>
        <textarea id="content-note" placeholder="Write one or two EST-ready sentences for this content strand...">${escapeHtml(state.answers[`content-note-${group.id}`] || "")}</textarea>
      </div>
    `;
  }

  const builtResponse = state.answers[`content-note-${group.id}`] || buildContentResponseText(group);
  const responseCoach = evaluateContentResponse(group);
  const segments = scaffold.segments || [];

  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(scaffold.title || "Quick EST response")}</h2>
        <p>${escapeHtml(scaffold.subtitle || "Build the response in small steps, then combine it.")}</p>
      </div>
      <p class="small-copy">${escapeHtml(group.writePrompt)}</p>
      ${renderESTGuidePanel(group.id, "forge")}
      <div class="builder-grid" style="margin-top:14px;">
        ${segments.map((segment, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(segment.label || `Sentence starter ${index + 1}`)}</strong>
            <p class="small-copy"><strong>${escapeHtml(segment.starter)}</strong></p>
            <textarea
              id="content-scaffold-${group.id}-${segment.id}"
              placeholder="${escapeHtml(segment.placeholder || "Add your idea here...")}"
              oninput="window.ESTPrep.setContentResponseSegmentEncoded('${group.id}', '${segment.id}', this.value)"
            >${escapeHtml(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildContentResponse('${group.id}')">Build Response Paragraph</button>
      </div>
    </div>
    <div class="written-stage">
      <strong>Built EST response</strong>
      <p class="small-copy">This final paragraph is assembled from your sentence starters. You can still edit it before banking the lab.</p>
      <textarea id="content-note" placeholder="Your built EST response will appear here...">${escapeHtml(builtResponse)}</textarea>
    </div>
    ${builtResponse ? `
      <div class="panel">
        <div class="section-title">
          <h2>EST-ready coach</h2>
          <p>${responseCoach.level === "strong" ? "Strong sentence signal" : responseCoach.level === "developing" ? "Developing sentence signal" : "Needs sharpening"}</p>
        </div>
        <p class="small-copy">${escapeHtml(responseCoach.summary)}</p>
        <div class="training-stack" style="margin-top:14px;">
          ${responseCoach.segmentResults.map(result => `
            <div class="training-card ${result.passed ? "good" : "bad"}">
              <strong>${escapeHtml(result.label)}</strong>
              <p class="training-feedback">${result.passed ? "Locked in." : "Needs a clearer EST phrase or more specific language."}</p>
            </div>
          `).join("")}
          <div class="training-card ${responseCoach.builtHasReasoning ? "good" : "bad"}">
            <strong>Explains why the point matters</strong>
            <p class="training-feedback">${responseCoach.builtHasReasoning ? "Your built paragraph includes causal or explanatory language." : "Add a stronger because/how/why explanation so the response sounds more analytical."}</p>
          </div>
        </div>
      </div>
    ` : ""}
  `;
}

function getContentTopicReviewReward(summary) {
  if (summary?.reward?.improved) return summary.reward;
  const stage = STAGES.find(item => item.id === "content");
  if (!stage || !summary?.group) return { earnedMarks: 0, readinessGain: 0, credits: 0, tax: 0, improved: false };
  const totalTopics = Math.max(1, (state.stageDeck?.contentGroups || []).length);
  const percent = Math.max(
    Number(summary.reward?.nextPercent || 0),
    Number(state.contentTopicBestScores[summary.group.id] || 0),
    Number(summary.overallPercent || 0)
  );
  const ratio = Math.max(0, percent / 100);
  const credits = Math.max(0, Math.round((stage.credits / totalTopics) * ratio));
  return {
    improved: false,
    earnedMarks: Math.max(0, Math.round((stage.marks / totalTopics) * ratio)),
    readinessGain: Math.max(0, Math.round((stage.readiness / totalTopics) * ratio)),
    credits,
    tax: Math.max(0, Math.round(credits * stage.taxRate))
  };
}

function contentTopicNeedsCommunityVote(summary) {
  const reviewReward = getContentTopicReviewReward(summary);
  return Boolean(summary?.group && Number(reviewReward.tax || 0) > 0 && (state.stageDeck?.communityOptions || []).length);
}

function getContentTopicVoteKey(groupId) {
  return state.contentTopicVotes?.[groupId] || "";
}

function getContentTopicVoteOption(groupId) {
  const voteKey = getContentTopicVoteKey(groupId);
  return (state.stageDeck?.communityOptions || []).find(option => option.id === voteKey) || null;
}

function renderContentTopicCommunityChoice(summary) {
  if (!contentTopicNeedsCommunityVote(summary)) return "";
  const groupId = summary.group.id;
  const voteKey = getContentTopicVoteKey(groupId);
  const reviewReward = getContentTopicReviewReward(summary);
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button
      type="button"
      class="choice-button ${voteKey === option.id ? "selected live-selected" : ""}"
      data-group="content-topic-vote-${escapeHtml(groupId)}"
      data-value="${escapeHtml(option.id)}"
      onclick="window.ESTPrep.setContentTopicVote('${escapeHtml(groupId)}', '${escapeHtml(option.id)}')"
    >
      <strong>${escapeHtml(option.label || option.id)}</strong>
      <span>${escapeHtml(option.description || "Class community focus")}</span>
    </button>
  `).join("");
  return `
    <div class="panel content-community-panel">
      <div class="section-title">
        <h2>Choose where the community fund goes</h2>
        <p class="status-watch">Required before continuing</p>
      </div>
      <p class="small-copy">You earned ${formatCurrency(reviewReward.credits)} salary. ${formatCurrency(reviewReward.tax)} is now class/community tax. Choose where that contribution should land.</p>
      <div class="choice-grid">${communityOptions}</div>
      ${voteKey ? `<p class="small-copy content-vote-confirmed">Selected: <strong>${escapeHtml(getContentTopicVoteOption(groupId)?.label || voteKey)}</strong></p>` : ""}
    </div>
    ${voteKey ? "" : `
      <div class="feedback-box warn content-vote-warning">
        <p><strong>Select one community fund before continuing.</strong></p>
        <p>The salary has been earned, but the class contribution needs a destination.</p>
      </div>
    `}
  `;
}

function getContentReviewContinueButton(label, action) {
  const summary = state.lastContentTopicReview;
  const needsVote = contentTopicNeedsCommunityVote(summary);
  const hasVote = summary ? Boolean(getContentTopicVoteKey(summary.group.id)) : true;
  const handler = needsVote && !hasVote
    ? "window.ESTPrep.requireContentTopicVote()"
    : `window.ESTPrep.${action}()`;
  return `<button class="submit-button" type="button" onclick="${handler}">${needsVote && !hasVote ? "Choose community fund first" : label}</button>`;
}

function renderContentTopicReview(summary) {
  if (!summary) return "";
  const coachLabel = summary.responseCoach.level === "strong"
    ? "Strong sentence signal"
    : summary.responseCoach.level === "developing"
      ? "Developing sentence signal"
      : "Needs sharpening";
  const reviewReward = getContentTopicReviewReward(summary);
  return `
    <section class="est-scene-shell est-scene-shell--success" ${buildESTSceneStyle("success")}>
      <div class="panel training-bay training-campaign training-campaign--focus">
        <div class="training-hud">
          <div class="training-hud-copy">
            <div class="kicker">Topic banked</div>
            <h2>${escapeHtml(summary.group.title)}</h2>
          </div>
          <div class="training-hud-status">
            <strong>${summary.overallPercent}% strand result</strong>
            <small>${summary.knowledgeCorrect}/${summary.roundResults.length} knowledge • ${summary.trainingScore.percent}% reactor • ${summary.responsePercent}% response</small>
          </div>
        </div>
        <div class="training-economy-note ${summary.reward?.improved ? "good" : "bad"}" style="margin-top:18px;">
          <strong>${summary.reward?.improved ? "Career Empire banked" : "Saved, best result kept"}</strong>
          <span>${escapeHtml(
            summary.reward?.improved
              ? `+${reviewReward.earnedMarks} marks • +${reviewReward.readinessGain}% readiness • +${formatCurrency(reviewReward.credits)} salary • +${formatCurrency(reviewReward.tax)} community fund`
              : `Your best result still stands at ${Math.round(summary.reward?.previousPercent || summary.overallPercent || 0)}%. No extra salary was added this time, but the banked community contribution can still be allocated.`
          )}</span>
        </div>
        ${reviewReward.credits || reviewReward.tax ? `
          <div class="glossary-reward-grid content-reward-grid">
            <article class="glossary-reward-chip">
              <strong>Salary earned</strong>
              <p>${formatCurrency(reviewReward.credits)}</p>
            </article>
            <article class="glossary-reward-chip">
              <strong>Community fund</strong>
              <p>${formatCurrency(reviewReward.tax)}</p>
            </article>
            <article class="glossary-reward-chip">
              <strong>Marks banked</strong>
              <p>${summary.reward?.improved ? "+" : ""}${reviewReward.earnedMarks}</p>
            </article>
            <article class="glossary-reward-chip">
              <strong>Readiness</strong>
              <p>${summary.reward?.improved ? "+" : ""}${reviewReward.readinessGain}%</p>
            </article>
          </div>
        ` : ""}
        ${renderContentTopicCommunityChoice(summary)}
        <div class="sample-review" style="margin-top:18px;padding-top:0;border-top:0;">
          <div class="sample-grid">
            <article class="sample-card">
              <div class="sample-meta">
                <strong>Your EST response</strong>
                <span>${coachLabel}</span>
              </div>
              <p>${escapeHtml(summary.builtResponse || "No EST response entered yet.")}</p>
              <p class="sample-commentary">${escapeHtml(summary.responseCoach.summary)}</p>
            </article>
            <article class="sample-card strong">
              <div class="sample-meta">
                <strong>Model answer</strong>
                <span>Compare + improve</span>
              </div>
              <p>${escapeHtml(summary.group.sampleResponse)}</p>
              <p class="sample-commentary">Use the model to compare specificity, workplace example, and the why-it-matters explanation.</p>
            </article>
          </div>
        </div>
        <div class="rubric-grid" style="margin-top:16px;">
          <div class="rubric-chip ${summary.knowledgePercent >= 70 ? "pass" : "fail"}">
            <strong>Knowledge checks</strong>
            <span>${summary.knowledgePercent}%</span>
          </div>
          <div class="rubric-chip ${summary.trainingScore.percent >= 70 ? "pass" : "fail"}">
            <strong>Reactor practice</strong>
            <span>${summary.trainingScore.percent}%</span>
          </div>
          <div class="rubric-chip ${summary.responsePercent >= 70 ? "pass" : "fail"}">
            <strong>EST response</strong>
            <span>${summary.responsePercent}%</span>
          </div>
        </div>
        <div class="builder-actions" style="margin-top:18px;">
          ${getContentReviewContinueButton("Back to topic menu", "openContentTopicMenuAfterReview")}
          <button class="submit-button" type="button" onclick="window.ESTPrep.retryCurrentContentTopic()">Replay this topic</button>
          ${state.contentGroupIndex < ((state.stageDeck?.contentGroups || []).length - 1)
            ? getContentReviewContinueButton("Next Topic", "nextContentGroupAfterReview")
            : getContentReviewContinueButton("Bank Full Content Suite", "submitContentAfterReview")}
        </div>
      </div>
    </section>
  `;
}

function renderTrainingBay(group) {
  const config = getContentTrainingConfig(group.id);
  if (!config) return "";
  const score = getTrainingScore(config);
  if (isArcTrainingType(config.type)) return renderArcTrainingBay(config, score);
  if (config.type === "sort") return renderSortTrainingBay(config, score);
  if (config.type === "scenario") return renderScenarioTrainingBay(config, score);
  if (config.type === "builder") return renderBuilderTrainingBay(config, score);
  return "";
}

function getTrainingInteractions(config) {
  if (!config) return [];
  if (isArcTrainingType(config.type)) {
    return (config.steps || []).flatMap(step => (step.items || []).map(item => ({
      item: item.prompt,
      selected: state.answers[getArcTrainingAnswerKey(config.type, item.id)] || "",
      correct_answer: item.correct,
      step: step.title
    })));
  }
  if (config.type === "sort") {
    return config.cards.map(card => ({
      item: card.text,
      selected: state.answers[`training-sort-${card.id}`] || "",
      correct_bucket: card.correctBucket
    }));
  }
  if (config.type === "scenario") {
    return config.scenarios.map(scenario => ({
      item: scenario.prompt,
      selected: state.answers[`training-scenario-${scenario.id}`] || "",
      correct_answer: scenario.correct
    }));
  }
  if (config.type === "builder") {
    return config.rounds.map(round => ({
      item: round.prompt,
      selected: state.answers[`training-builder-${round.id}`] || "",
      correct_answer: round.correct
    }));
  }
  return [];
}

function toggleReveal(key) {
  state.answers[key] = !state.answers[key];
  if (state.selectedStageId === "glossary") renderGlossaryStage();
  if (state.selectedStageId === "boss") renderBossStage();
}

function renderContentTopicIntro(group) {
  const highlights = group.introHighlights || [];
  const hasVideo = Boolean(group.introVideo);
  const usesPortraitMedia = group.introMediaLayout === "portrait" || /portrait/i.test(group.introVideo || "");
  const rewardPreview = getContentTopicRewardPreview();
  const bankedPercent = Math.max(0, Number(state.contentTopicBestScores[group.id] || 0));
  const hasBankedResult = bankedPercent > 0;
  return `
    <section class="est-scene-shell est-scene-shell--intro" ${buildESTSceneStyle("neutral")}>
      <div class="topic-intro-grid topic-intro-grid--compact topic-intro-grid--visual ${usesPortraitMedia ? "topic-intro-grid--portrait" : ""}">
        <div class="topic-media-card ${usesPortraitMedia ? "topic-media-card--portrait" : ""}">
          ${hasVideo ? `
            <video class="topic-media ${usesPortraitMedia ? "topic-media--portrait" : ""}" autoplay muted loop playsinline poster="${escapeHtml(group.introImage || "")}">
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
          <div class="training-economy-note good">
            <strong>Topic reward preview</strong>
            <span>${escapeHtml(`Up to +${rewardPreview.marks} marks • +${rewardPreview.readiness}% readiness • +${formatCurrency(rewardPreview.credits)} salary • +${formatCurrency(rewardPreview.tax)} community fund`)}</span>
          </div>
          ${highlights.length ? `
            <div class="badge-row topic-intro-highlights">
              ${highlights.map(item => `<span class="badge">${escapeHtml(item)}</span>`).join("")}
            </div>
          ` : ""}
          <div class="written-stage topic-intro-actions">
            <div class="topic-intro-button-row">
              <button class="submit-button compact" type="button" onclick="window.ESTPrep.openStage('content')">Back</button>
              <button class="submit-button compact" type="button" onclick="window.ESTPrep.startContentGroup()">${hasBankedResult ? "Replay topic" : "Start content check"}</button>
              ${hasBankedResult ? '<button class="submit-button compact ghost" type="button" onclick="window.ESTPrep.resetCurrentContentTopic()">Reset topic</button>' : ""}
            </div>
            ${hasBankedResult ? `<p class="small-copy topic-intro-status">Best banked result: ${bankedPercent}% • replay from the first reactor card or reset to clear this topic.</p>` : ""}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContentStage() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  renderFocusNav();
  if (state.contentView === "menu" || !currentGroup) {
    setGameplayViewportMode(false);
    setStageScene("neutral");
    setStageMenuMode(true);
    setStagePulseVisible(false);
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
    setGameplayViewportMode(false);
    setStageScene("neutral");
    setStageMenuMode(false);
    setStagePulseVisible(false);
    setText("stage-title", "");
    setText("stage-subtitle", "");
    renderStageRoot(renderContentTopicIntro(currentGroup));
    persistESTProgressSnapshot();
    return;
  }
  if (state.contentView === "review" && currentGroup && state.lastContentTopicReview?.group?.id === currentGroup.id) {
    setGameplayViewportMode(false);
    setStageScene("success");
    setStageMenuMode(false);
    setStagePulseVisible(false);
    setText("stage-title", "");
    setText("stage-subtitle", "");
    renderStageRoot(renderContentTopicReview(state.lastContentTopicReview));
    persistESTProgressSnapshot();
    return;
  }
  if (state.contentView === "response") {
    setGameplayViewportMode(false);
    setStageScene("neutral");
    setStageMenuMode(false);
    setStagePulseVisible(false);
    setText("stage-title", "");
    setText("stage-subtitle", "");
    renderStageRoot(`
      <section class="est-scene-shell est-scene-shell--neutral" ${buildESTSceneStyle("neutral")}>
        <div class="panel training-bay training-campaign training-campaign--focus">
          <div class="training-hud">
            <div class="training-hud-copy">
              <div class="kicker">Response forge</div>
              <h2>${escapeHtml(currentGroup.title)}</h2>
            </div>
            <div class="training-hud-status">
              <strong>Build and bank your EST answer</strong>
              <small>Compare it to the model before moving to the next strand.</small>
            </div>
          </div>
          <div class="training-campaign-grid" style="margin-top:18px;">
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
            ${renderContentResponseForge(currentGroup)}
            <div class="written-stage">
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="submit-button" type="button" onclick="window.ESTPrep.startContentGroup()">Back to reactor</button>
                <button class="submit-button" type="button" onclick="window.ESTPrep.submitCurrentContentTopic()">Bank Topic Review</button>
                ${state.contentGroupIndex === groups.length - 1
                  ? '<button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Full Content Suite</button>'
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </section>
    `);
    persistESTProgressSnapshot();
    return;
  }
  setStageMenuMode(false);
  setStagePulseVisible(false);
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  const trainingIsArc = trainingConfig && isArcTrainingType(trainingConfig.type);
  const trainingComplete = trainingScore.total > 0 && trainingScore.correct === trainingScore.total;
  setGameplayViewportMode(Boolean(trainingIsArc));
  setStageScene(trainingScore.total > 0 && trainingScore.correct === trainingScore.total ? "restored" : "challenge");
  setText("stage-title", "");
  setText("stage-subtitle", "");
  if (trainingIsArc && !trainingComplete) {
    renderStageRoot(`
      ${renderTrainingBay(currentGroup)}
    `);
    persistESTProgressSnapshot();
    return;
  }
  renderStageRoot(`
    ${renderTrainingBay(currentGroup)}
  `);
  persistESTProgressSnapshot();
}

function getGroupIdForTrainingType(type) {
  const { trainingBays } = getContentStageConfig();
  return Object.entries(trainingBays).find(([, config]) => config.type === type)?.[0] || "";
}

function getESTGuideCharacter(groupId) {
  const key = EST_GUIDE_ASSIGNMENTS[groupId] || "romero";
  return EST_GUIDE_CHARACTERS[key] || EST_GUIDE_CHARACTERS.romero;
}

function getESTGuideCopy(groupId, context) {
  const byContext = {
    intro: {
      initiative: "We’ll move through this like a mission: spot the behaviour, name the type, then sharpen the EST answer.",
      "time-management": "Take one planning move at a time. We’re looking for the best order, not the busiest schedule.",
      "personal-finance": "Think like a calm decision-maker here: track it, protect essentials, then seek the right support.",
      "job-application": "We’re not writing generic answers here. We’re targeting the role, the criteria, and the evidence.",
      communication: "This strand is all about reading the situation well, not just saying more words.",
      "future-of-work": "We’re scanning for change, evidence, and opportunity. That’s what makes this strand feel future-focused."
    },
    challenge: {
      initiative: "Choose the strongest move in each situation. If it feels vague or passive, it probably isn’t the best initiative call.",
      "time-management": "Look for the response that controls the workload, not the one that just sounds busy.",
      "personal-finance": "Choose the move that creates financial control and adaptability, not panic or avoidance.",
      "job-application": "Pick the response that gives the employer clear evidence, structure, and relevance.",
      communication: "Choose the action that makes the message clearer, more respectful, and easier to act on.",
      "future-of-work": "Look for the answer that uses evidence about change, demand, and opportunity."
    },
    forge: {
      initiative: "Build the sentence in parts first. Strong EST answers explain the behaviour, the example, and why it matters.",
      "time-management": "Aim for a response that names the process, the tool, and the reason it works.",
      "personal-finance": "A strong finance answer should mention budgeting, support, and how the strategy protects stability.",
      "job-application": "Keep it employer-facing. The best paragraph explains the method, the evidence, and why it proves suitability.",
      communication: "Try to include the skill, the action, and the effect on understanding or workplace relationships.",
      "future-of-work": "A stronger answer links the trend, the evidence, and the career impact in one clear paragraph."
    }
  };
  return byContext[context]?.[groupId] || "Take this one step at a time. A strong EST answer is built through clear choices, not rushing.";
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

function clearContentTopicWorkingState(group, { clearBankedResult = false, markEvidenceReset = false } = {}) {
  if (!group) return;
  const trainingConfig = getContentTrainingConfig(group.id);
  (group.rounds || []).forEach((_, index) => {
    delete state.answers[`content-${group.id}-${index}`];
  });
  delete state.answers[`content-note-${group.id}`];

  const scaffold = getContentResponseScaffold(group);
  (scaffold?.segments || []).forEach(segment => {
    delete state.answers[getContentResponseSegmentKey(group.id, segment.id)];
  });

  if (state.responseForgeDrafts) delete state.responseForgeDrafts[group.id];
  if (state.contentResponseBuilds) delete state.contentResponseBuilds[group.id];
  delete state.contentGroupDurations[group.id];
  if (trainingConfig && isArcTrainingType(trainingConfig.type)) {
    (trainingConfig.steps || []).forEach(step => {
      (step.items || []).forEach(item => {
        delete state.answers[getArcTrainingAnswerKey(trainingConfig.type, item.id)];
      });
    });
    if (!state.arcFlows || typeof state.arcFlows !== "object") state.arcFlows = {};
    delete state.arcFlows[trainingConfig.type];
    if (state.arcBanking) delete state.arcBanking[trainingConfig.type];
  } else if (trainingConfig?.type === "sort") {
    (trainingConfig.cards || []).forEach(card => {
      delete state.answers[`training-${trainingConfig.type}-${card.id}`];
    });
  } else if (trainingConfig?.type === "scenario") {
    (trainingConfig.scenarios || []).forEach(scenario => {
      delete state.answers[`training-${trainingConfig.type}-${scenario.id}`];
    });
  } else if (trainingConfig?.type === "builder") {
    (trainingConfig.rounds || []).forEach(round => {
      delete state.answers[`training-${trainingConfig.type}-${round.id}`];
    });
  }

  if (clearBankedResult) {
    delete state.contentTopicBestScores[group.id];
    delete state.contentTopicVotes[group.id];
    Object.keys(state.contentTopicVoteSaves || {}).forEach(key => {
      if (key.startsWith(`${group.id}:`)) delete state.contentTopicVoteSaves[key];
    });
  }

  if (markEvidenceReset) {
    if (!state.contentTopicResetAt || typeof state.contentTopicResetAt !== "object") state.contentTopicResetAt = {};
    state.contentTopicResetAt[group.id] = new Date().toISOString();
  }
}

function refreshContentCompletionAfterTopicReset(groups) {
  const bankedGroups = groups.filter(group => Number(state.contentTopicBestScores[group.id] || 0) > 0);
  if (bankedGroups.length === groups.length && groups.length) {
    syncContentCompletionFromTopicScores();
  } else {
    delete state.completed.content;
    if (bankedGroups.length) {
      state.stageBestScores.content = groups.reduce((sum, group) => sum + Number(state.contentTopicBestScores[group.id] || 0), 0) / (groups.length * 100);
    } else {
      delete state.stageBestScores.content;
    }
  }
}

function resetCurrentContentTopic() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  clearContentTopicWorkingState(currentGroup, { clearBankedResult: true, markEvidenceReset: true });
  refreshContentCompletionAfterTopicReset(groups);
  state.lastContentTopicReview = null;
  state.contentView = "lesson";
  state.contentGroupStartedAt = Date.now();
  state.recentReward = {
    type: "warning",
    title: "Topic reset",
    detail: `${currentGroup.title} has restarted from the first reactor card.`
  };
  persistESTProgressSnapshot();
  renderContentStage();
  renderRewardPulse();
  scrollToTopSmooth();
}

function jumpToContentGroup(index) {
  openContentGroupIntro(index);
}

function openContentGroupIntro(index) {
  const groups = state.stageDeck?.contentGroups || [];
  if (!groups.length) return;
  const nextIndex = Math.max(0, Math.min(index, groups.length - 1));
  if ((state.contentView === "lesson" || state.contentView === "response") && state.contentGroupIndex >= 0) {
    persistCurrentContentNote();
    bankCurrentContentDuration();
  }
  state.contentGroupIndex = nextIndex;
  state.contentView = "intro";
  state.selectedStageId = "content";
  setLabMode(true);
  persistESTProgressSnapshot();
  renderContentStage();
  scrollToTopSmooth();
}

function startContentGroup() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  const startedFromIntro = state.contentView === "intro";
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  const trainingComplete = trainingScore.total > 0 && trainingScore.correct === trainingScore.total;
  const hasBankedResult = Number(state.contentTopicBestScores[currentGroup.id] || 0) > 0;
  if (startedFromIntro && (hasBankedResult || trainingComplete)) {
    clearContentTopicWorkingState(currentGroup);
  }
  state.contentView = "lesson";
  state.contentGroupStartedAt = Date.now();
  persistESTProgressSnapshot();
  renderContentStage();
  scrollToTopSmooth();
}

function openContentResponse() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  if (trainingScore.total > 0 && trainingScore.correct === trainingScore.total) {
    state.contentView = "response";
    persistESTProgressSnapshot();
    renderContentStage();
    scrollToTopSmooth();
  }
}

async function submitCurrentContentTopic() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;

  persistCurrentContentNote();
  bankCurrentContentDuration();
  const summary = evaluateContentTopic(currentGroup);
  const reward = awardContentTopicImprovement(summary);
  summary.reward = reward;
  state.lastContentTopicReview = summary;
  state.contentView = "review";
  persistESTProgressSnapshot();

  await saveProgress(
    `revision-topic-${currentGroup.id}`,
    "revision-topic-check",
    `${currentGroup.title}: ${summary.knowledgeCorrect}/${summary.roundResults.length} knowledge checks correct.\nEST response: ${summary.builtResponse || "No response entered."}`,
    summary.overallPercent,
    {
      taskName: `EST Content Topic - ${currentGroup.title}`,
      durationSeconds: state.contentGroupDurations[currentGroup.id] || 0,
      promptText: currentGroup.writePrompt,
      extraPayload: {
        topic_group_id: currentGroup.id,
        topic_group: currentGroup.title,
        knowledge_percent: summary.knowledgePercent,
        training_percent: summary.trainingScore.percent,
        response_percent: summary.responsePercent,
        built_response: summary.builtResponse,
        sample_response: currentGroup.sampleResponse,
        round_results: summary.roundResults
      }
    }
  );

  if (!reward.improved) {
    state.recentReward = {
      type: "warning",
      title: `${currentGroup.title} saved`,
      detail: `This topic has been saved for review. Your best banked result remains ${Math.round(reward.previousPercent)}%, so no extra salary or tax was added this time.`
    };
    renderRewardPulse();
  }

  renderContentStage();
  scrollToTopSmooth();
}

function moveContentGroup(step) {
  jumpToContentGroup(state.contentGroupIndex + step);
}

function retryCurrentContentTopic() {
  if (state.contentGroupIndex < 0) return;
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  clearContentTopicWorkingState(currentGroup);
  state.lastContentTopicReview = null;
  openContentGroupIntro(state.contentGroupIndex);
}

async function setContentTopicVote(groupId, optionId) {
  if (!groupId || !optionId) return;
  if (!state.contentTopicVotes || typeof state.contentTopicVotes !== "object") state.contentTopicVotes = {};
  if (!state.contentTopicVoteSaves || typeof state.contentTopicVoteSaves !== "object") state.contentTopicVoteSaves = {};

  state.contentTopicVotes[groupId] = optionId;
  updateSelectionButtons(`content-topic-vote-${groupId}`, optionId);

  const option = getContentTopicVoteOption(groupId);
  state.recentReward = {
    type: "positive",
    title: "Community fund selected",
    detail: `${option?.label || optionId} will receive this topic's class contribution.`
  };
  pushEconomyLog({
    eventType: "community-vote",
    checkpoint: `revision-topic-${groupId}`,
    label: `EST content community allocation - ${option?.label || optionId}`,
    detail: `Community fund selected for ${groupId}`
  });
  persistESTProgressSnapshot();

  const voteSaveKey = `${groupId}:${optionId}`;
  if (state.student?.id && !state.contentTopicVoteSaves[voteSaveKey]) {
    const supabase = await getSupabaseClientOrNull();
    if (supabase) {
      const { error } = await supabase.from("community_votes").insert({
        student_id: state.student.id,
        class_id: state.student.classId,
        module_id: MODULE_ID,
        vote_key: optionId,
        created_at: new Date().toISOString()
      });
      if (error) {
        console.error(error);
      } else {
        state.contentTopicVoteSaves[voteSaveKey] = true;
        persistESTProgressSnapshot();
      }
    }
  }

  renderRewardPulse();
  renderContentStage();
}

function requireContentTopicVote() {
  state.recentReward = {
    type: "warning",
    title: "Choose a community fund",
    detail: "Pick one community fund destination before moving on from this banked topic."
  };
  renderRewardPulse();
  renderContentStage();
}

function openContentTopicMenuAfterReview() {
  openStage("content");
}

function nextContentGroupAfterReview() {
  moveContentGroup(1);
}

function submitContentAfterReview() {
  submitContent();
}

function setTrainingChoice(groupKey, option) {
  state.answers[groupKey] = option;
  const currentGroup = (state.stageDeck?.contentGroups || [])[state.contentGroupIndex];
  const trainingConfig = currentGroup ? getContentTrainingConfig(currentGroup.id) : null;
  if (trainingConfig && isArcTrainingType(trainingConfig.type) && groupKey.startsWith(`training-${trainingConfig.type}-`)) {
    const itemId = groupKey.slice(`training-${trainingConfig.type}-`.length);
    const flow = getArcFlow(trainingConfig);
    const step = trainingConfig.steps?.[flow?.stepIndex || 0];
    const item = step?.items?.find(entry => entry.id === itemId);
    if (item) {
      state.arcFlows[trainingConfig.type] = {
        phase: "feedback",
        stepIndex: flow?.stepIndex || 0,
        itemIndex: flow?.itemIndex || 0,
        lastOutcome: option === item.correct ? "correct" : "wrong"
      };
      persistESTProgressSnapshot();
      renderContentStage();
      return;
    }
  }
  persistESTProgressSnapshot();
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

function advanceArcCard(configType) {
  const config = getTrainingConfigByType(configType);
  if (!config) return;
  const flow = getArcFlow(config);
  if (!flow || flow.phase !== "feedback") return;
  const currentStep = config.steps?.[flow.stepIndex];
  const currentItem = currentStep?.items?.[flow.itemIndex];
  if (!currentStep || !currentItem) return;
  if (getArcItemAnswer(config, currentItem) !== currentItem.correct) return;

  const nextItemIndex = flow.itemIndex + 1;
  if (nextItemIndex < (currentStep.items || []).length) {
    state.arcFlows[config.type] = {
      phase: "question",
      stepIndex: flow.stepIndex,
      itemIndex: nextItemIndex,
      lastOutcome: null
    };
  } else if (flow.stepIndex + 1 < (config.steps || []).length) {
    state.arcFlows[config.type] = {
      phase: "transition",
      stepIndex: flow.stepIndex,
      itemIndex: flow.itemIndex,
      lastOutcome: "correct"
    };
  } else {
    state.arcFlows[config.type] = {
      phase: "complete",
      stepIndex: flow.stepIndex,
      itemIndex: flow.itemIndex,
      lastOutcome: "correct"
    };
  }
  persistESTProgressSnapshot();
  renderContentStage();
}

function retryArcCard(configType) {
  const config = getTrainingConfigByType(configType);
  if (!config) return;
  const flow = getArcFlow(config);
  if (!flow || flow.phase !== "feedback" || flow.lastOutcome !== "wrong") return;
  const currentStep = config.steps?.[flow.stepIndex];
  const currentItem = currentStep?.items?.[flow.itemIndex];
  if (!currentItem) return;
  const answerKey = getArcTrainingAnswerKey(config.type, currentItem.id);
  delete state.answers[answerKey];
  state.arcFlows[config.type] = {
    phase: "question",
    stepIndex: flow.stepIndex,
    itemIndex: flow.itemIndex,
    lastOutcome: null
  };
  persistESTProgressSnapshot();
  renderContentStage();
}

function startArcStep(configType) {
  const config = getTrainingConfigByType(configType);
  if (!config) return;
  const flow = getArcFlow(config);
  if (!flow || flow.phase !== "transition") return;
  state.arcFlows[config.type] = {
    phase: "question",
    stepIndex: Math.min((config.steps || []).length - 1, flow.stepIndex + 1),
    itemIndex: 0,
    lastOutcome: null
  };
  persistESTProgressSnapshot();
  renderContentStage();
}

function setContentResponseSegmentEncoded(groupId, segmentId, value) {
  setContentResponseSegment(groupId, segmentId, value);
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
            interactions: getTrainingInteractions(trainingConfig)
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
    `This stage is now grouped into the ${groups.length} core EST revision strands, so students and teachers can see which content area was strongest and where the most time was spent.`,
    "Those content points and written explanations are what later feed the decoder and boss-round responses."
  ], sampleReviewHtml);
}
