// EST Prep est-prep bundle. Loaded as a classic browser script.
function openStage(stageId) {
  const previousStageId = state.selectedStageId;
  setLabMode(true);
  setGameplayViewportMode(false);
  setStagePulseVisible(stageId !== "content");
  if (stageId !== "glossary") {
    state.glossaryMissionMode = false;
    clearGlossaryTimer();
    syncMissionMode();
  }
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  resetStageTaskTimer();
  if (stageId === "content") {
    if (previousStageId === "content" && ["lesson", "response"].includes(state.contentView) && state.contentGroupIndex >= 0) {
      persistCurrentContentNote();
      bankCurrentContentDuration();
    }
    state.contentGroupIndex = -1;
    state.contentView = "menu";
    state.lastContentTopicReview = null;
    if (previousStageId !== "content") {
      state.contentGroupStartedAt = Date.now();
      state.contentGroupDurations = {};
    }
  }
  if (stageId === "glossary") {
    state.glossaryMissionMode = true;
    if (typeof refreshGlossaryPracticeDeck === "function") {
      refreshGlossaryPracticeDeck();
    }
    syncMissionMode();
    if (!state.glossaryHasStarted && state.completed.glossary) {
      restoreGlossaryReplayBoard();
    } else if (!state.glossaryHasStarted) {
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
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function returnToTrack() {
  bankESTActiveTimers();
  setLabMode(false);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  setStageScene("neutral");
  state.glossaryMissionMode = false;
  state.glossaryRoundStartedAt = 0;
  state.glossaryRoundActiveSeconds = 0;
  state.glossaryRoundLastAt = 0;
  clearGlossaryTimer();
  syncMissionMode();
  state.selectedStageId = null;
  state.stageActiveSeconds = 0;
  state.stageActiveLastAt = 0;
  state.lastBossReview = null;
  state.contentGroupIndex = -1;
  state.contentView = "menu";
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function handleESTPrepDeepLink() {
  const params = new URLSearchParams(window.location.search || "");
  if (params.get("stage") !== "content") return false;

  const topicId = params.get("topic") || "";
  const groups = state.stageDeck?.contentGroups || [];
  const topicIndex = groups.findIndex(group => group.id === topicId);
  if (topicIndex < 0) return false;

  setLabMode(true);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  setStagePulseVisible(false);
  state.glossaryMissionMode = false;
  clearGlossaryTimer();
  syncMissionMode();
  state.selectedStageId = "content";
  state.lastBossReview = null;
  state.lastContentTopicReview = null;
  state.contentGroupIndex = topicIndex;
  state.contentView = params.get("view") === "response" ? "response" : "intro";
  state.contentGroupStartedAt = Date.now();
  persistESTProgressSnapshot();
  renderFocusNav();
  renderMap();
  renderContentStage();
  scrollToTopSmooth();

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, document.title, cleanUrl);
  return true;
}

async function init() {
  state.student = getLoggedInStudent();
  installESTActiveTimerGuards();
  registerLeaveWarning();
  hydrateESTProgressSnapshot();
  const [bank, contentStageConfig] = await Promise.all([
    loadBank(),
    loadContentStageConfig()
  ]);
  state.bank = bank;
  state.contentStageConfig = contentStageConfig;
  if (!state.stageDeck || !state.stageDeck?.contentGroups?.length) {
    state.stageDeck = buildStageDeck(state.bank);
  } else {
    refreshStageDeckContentGroups(state.bank);
  }
  ensureStageDeckDecoderRounds(state.bank);
  if (!state.glossaryHasStarted && typeof refreshGlossaryPracticeDeck === "function") {
    refreshGlossaryPracticeDeck();
  }
  await hydrateFromSupabase();
  refreshStageDeckContentGroups(state.bank);
  if (!state.glossaryHasStarted && typeof refreshGlossaryPracticeDeck === "function") {
    refreshGlossaryPracticeDeck();
  }
  syncContentCompletionFromTopicScores();
  if (!state.contentView) {
    state.contentView = "menu";
  }
  persistESTProgressSnapshot();
  setLabMode(false);
  setStageMenuMode(false);
  setStageScene("neutral");
  renderFocusNav();
  renderHero();
  renderMetrics();
  renderMap();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  renderEvidence();
  handleESTPrepDeepLink();
}

window.ESTPrep = {
  openStage,
  toggleCoreBriefingPause,
  toggleCoreBriefingMax,
  openContentGroupIntro,
  startContentGroup,
  openContentResponse,
  submitCurrentContentTopic,
  retryCurrentContentTopic,
  resetCurrentContentTopic,
  setContentTopicVote,
  requireContentTopicVote,
  openContentTopicMenuAfterReview,
  nextContentGroupAfterReview,
  submitContentAfterReview,
  nextContentGroup: () => moveContentGroup(1),
  prevContentGroup: () => moveContentGroup(-1),
  jumpToContentGroup,
  setTrainingChoice,
  setTrainingChoiceEncoded,
  advanceArcCard,
  retryArcCard,
  jumpArcStep,
  startArcStep,
  setContentResponseSegmentEncoded,
  buildContentResponse,
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
  startNewGlossaryPracticeRun,
  jumpToGlossaryRound,
  jumpToGlossarySet,
  toggleReveal,
  toggleTopicIntroVideo,
  toggleTopicIntroPictureInPicture,
  dismissTopicReminderPip,
  setGlossaryRecallAnswer,
  setGlossaryRecallChoiceEncoded,
  setGlossaryRecallTermChoiceEncoded,
  setGlossaryRecallKeywordChoiceEncoded,
  submitGlossaryChallengeChoiceEncoded,
  flipGlossaryMemoryCardEncoded,
  submitGlossaryBridgeChoiceEncoded,
  continueGlossaryBridgeLevel,
  resetGlossaryBridgeLevel,
  fireGlossaryInvaderShipEncoded,
  setGlossaryInvaderMove,
  stopGlossaryInvaderMove,
  setGlossaryInvaderShield,
  fireGlossaryInvaderPlayerShot,
  setBossScaffold,
  setBossShowdownReason,
  buildBossDraft,
  setChoice,
  setChoiceEncoded,
  setBossVote,
  submitContent,
  submitDecoder,
  nextDecoderQuestion,
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
