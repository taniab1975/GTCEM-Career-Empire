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
  state.stageStartedAt = Date.now();
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
  setLabMode(false);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  setStageScene("neutral");
  state.glossaryMissionMode = false;
  state.glossaryRoundStartedAt = 0;
  clearGlossaryTimer();
  syncMissionMode();
  state.selectedStageId = null;
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

async function init() {
  state.student = getLoggedInStudent();
  registerLeaveWarning();
  const session = getPlayerSession();
  if (session.estPrepDeck || session.estPrepProgress) {
    hydrateESTProgressSnapshot();
  }
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
}

window.ESTPrep = {
  openStage,
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
  toggleReveal,
  setGlossaryRecallAnswer,
  setGlossaryRecallChoiceEncoded,
  setGlossaryRecallTermChoiceEncoded,
  setGlossaryRecallKeywordChoiceEncoded,
  submitGlossaryChallengeChoiceEncoded,
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
