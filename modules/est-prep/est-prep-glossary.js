// EST Prep glossary bundle. Loaded as a classic browser script.
let glossaryTimerInterval = null;

let glossaryRecallAdvanceTimeout = null;

function clearGlossaryRecallAdvanceTimeout() {
  if (glossaryRecallAdvanceTimeout) {
    clearTimeout(glossaryRecallAdvanceTimeout);
    glossaryRecallAdvanceTimeout = null;
  }
}

function formatSecondsAsClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearGlossaryTimer() {
  if (glossaryTimerInterval) {
    window.clearInterval(glossaryTimerInterval);
    glossaryTimerInterval = null;
  }
}

function getGlossaryRoundElapsedSeconds() {
  if (!state.glossaryRoundStartedAt) return 0;
  return Math.max(0, Math.round((Date.now() - state.glossaryRoundStartedAt) / 1000));
}

function startGlossaryRoundTimer(reset = false) {
  if (reset || !state.glossaryRoundStartedAt) {
    state.glossaryRoundStartedAt = Date.now();
  }
  clearGlossaryTimer();
  glossaryTimerInterval = window.setInterval(() => {
    const timer = document.getElementById("glossary-round-timer");
    if (timer) timer.textContent = formatSecondsAsClock(getGlossaryRoundElapsedSeconds());
  }, 1000);
}

function getGlossarySpeedBand(elapsedSeconds) {
  if (elapsedSeconds <= 95) return { label: "Gold speed bonus", bonus: 650 };
  if (elapsedSeconds <= 150) return { label: "Silver speed bonus", bonus: 360 };
  return { label: "Bronze speed bonus", bonus: 180 };
}

function normaliseGlossaryTermText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function deriveGlossaryKeywords(definition) {
  const stopWords = new Set(["the", "and", "that", "with", "from", "their", "this", "into", "which", "when", "whereby", "while", "between", "they", "them", "such", "have", "has", "been", "will", "just", "more", "than", "over", "under", "work", "role", "roles", "process", "processes", "using", "used", "throughout", "within", "towards", "about", "your", "their", "these", "those", "what", "because", "allows", "allow", "being"]);
  return [...new Set(
    String(definition || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
  )].slice(0, 4);
}

function buildGlossarySource() {
  return FULL_GLOSSARY_TERMS.map((item, index) => ({
    id: `full-glossary-${index + 1}`,
    term: item.term,
    definition: item.definition,
    keywords: deriveGlossaryKeywords(item.definition)
  }));
}

function getGlossaryKeywordHint(termName, definition) {
  const hintMap = {
    "Initiative": "proactive action",
    "Proactive": "act early",
    "Time management": "plan + prioritise",
    "Budget": "income vs expenses",
    "Seeking assistance": "trusted advice",
    "Labour market information": "jobs + wages",
    "Growth industry": "high growth",
    "Emerging industry": "new industry",
    "Green industry": "sustainable work",
    "Cover letter": "first impression",
    "Selection criteria": "job requirements",
    "STAR": "situation task action result",
    "Megatrend": "long-term change",
    "Demographic shift": "population change",
    "Economic power shift": "global market shift",
    "Impactful technologies": "innovation + disruption",
    "Career planning": "goals + pathways",
    "Communication skills": "message for audience",
    "Non-verbal communication": "body language",
    "Active listening": "check understanding",
    "Unexpected life event": "unplanned disruption"
  };
  if (hintMap[termName]) return hintMap[termName];
  const words = String(definition || "").replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(" ");
}

function getGlossaryScenarioHint(scenario) {
  const text = String(scenario || "").trim();
  if (text.length <= 72) return text;
  return `${text.slice(0, 72).trim()}...`;
}

function buildGlossaryBoard(rounds) {
  return shuffle(rounds.flatMap((round, index) => ([
    {
      id: `glossary-${index}-keyword`,
      matchId: index,
      kind: "Keyword",
      text: getGlossaryKeywordHint(round.term.term, round.term.definition),
      style: {
        x: `${8 + ((index * 17) % 62)}%`,
        y: `${8 + ((index * 13) % 52)}%`,
        delay: `${(index % 5) * 0.4}s`,
        duration: `${5 + (index % 4)}s`
      }
    },
    {
      id: `glossary-${index}-scenario`,
      matchId: index,
      kind: "Scenario",
      text: getGlossaryScenarioHint(round.term.scenario),
      style: {
        x: `${16 + ((index * 19) % 58)}%`,
        y: `${18 + ((index * 11) % 48)}%`,
        delay: `${((index + 2) % 5) * 0.35}s`,
        duration: `${6 + (index % 3)}s`
      }
    },
    {
      id: `glossary-${index}-definition`,
      matchId: index,
      kind: "Definition",
      text: round.term.definition,
      style: {
        x: `${12 + ((index * 23) % 60)}%`,
        y: `${12 + ((index * 7) % 54)}%`,
        delay: `${((index + 1) % 5) * 0.45}s`,
        duration: `${7 + (index % 4)}s`
      }
    }
  ])));
}

function getCurrentGlossaryBatch() {
  const batches = state.stageDeck?.glossaryBatches || [];
  return batches[state.glossaryRoundIndex] || [];
}

function getCurrentGlossaryRound() {
  return GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex] || GLOSSARY_ROUND_CONFIGS[0];
}

function getGlossaryVisual(index) {
  const visuals = [
    { shape: "circle", color: "#ff8a5b" },
    { shape: "diamond", color: "#5dd6ff" },
    { shape: "pill", color: "#ffd86c" },
    { shape: "hex", color: "#72f7b8" },
    { shape: "arch", color: "#c48bff" },
    { shape: "ticket", color: "#ff7dc0" }
  ];
  const offset = (state.glossaryRoundIndex * 2) + state.glossaryBatchIndex;
  return visuals[(index + offset) % visuals.length];
}

function syncMissionMode() {
  document.body.classList.toggle("glossary-mission-active", !!state.glossaryMissionMode);
}

function resetGlossaryRewardLoop() {
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = {};
  state.glossaryRoundVotes = {};
  state.glossaryRoundStartedAt = 0;
}

function initialiseGlossaryBoard() {
  clearGlossaryRecallAdvanceTimeout();
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryAssignments = {};
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallAnswers = {};
  state.glossaryRecallResults = {};
  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossaryStreak = 0;
  state.glossaryBestStreak = 0;
  state.glossaryMisses = 0;
  state.glossaryPulse = "System breach detected. Recover the first term signal to begin restoring the EST lab.";
  state.glossaryPulseType = "neutral";
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  resetGlossaryRewardLoop();
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

function clearGlossaryRoundState(roundIndex) {
  clearGlossaryRecallAdvanceTimeout();
  const roundBatchKey = `glossary-r${roundIndex}-b0`;
  delete state.glossaryAssignments[roundBatchKey];

  const batch = (state.stageDeck?.glossaryBatches || [])[roundIndex] || [];
  batch.forEach(item => {
    delete state.glossaryRecallAnswers[`term-${item.id}`];
    delete state.glossaryRecallAnswers[`keyword-${item.id}`];
    delete state.glossaryRecallResults[item.id];
  });

  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryStreak = 0;
  state.glossaryMisses = 0;
}

function getGlossaryBatchKey() {
  return `glossary-r${state.glossaryRoundIndex}-b${state.glossaryBatchIndex}`;
}

function getGlossaryAssignmentsForBatch() {
  return state.glossaryAssignments[getGlossaryBatchKey()] || {};
}

function getGlossaryPendingItems(batch = getCurrentGlossaryBatch()) {
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.filter(item => assignments[item.id] !== item.id);
}

function getCurrentGlossaryPromptItem(batch = getCurrentGlossaryBatch()) {
  return getGlossaryPendingItems(batch)[0] || null;
}

function buildGlossaryChallengeOptions(roundId, item, batch = getCurrentGlossaryBatch()) {
  const glossarySource = buildGlossarySource();
  if (!item) return [];

  if (roundId === "colour-shape") {
    const distractors = pickRandom(
      glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
      3
    );
    return shuffle([item.term, ...distractors]).map(option => ({
      value: option,
      title: option,
      detail: "Glossary term option"
    }));
  }

  if (roundId === "shape-only") {
    const distractors = pickRandom(
      glossarySource.filter(candidate => candidate.id !== item.id),
      3
    );
    return shuffle([
      { id: `${item.id}-correct`, text: clampText(item.definition, 110), isCorrect: true },
      ...distractors.map(candidate => ({
        id: `${candidate.id}-distractor`,
        text: clampText(candidate.definition, 110),
        isCorrect: false
      }))
    ]).map(option => ({
      value: option.id,
      title: option.text,
      detail: "Definition fragment"
    }));
  }

  const distractors = pickRandom(
    glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]).map(option => ({
    value: option,
    title: option,
    detail: "Restore the correct term from the definition file"
  }));
}

function isGlossaryChoiceCorrect(roundId, item, value) {
  if (!item) return false;
  if (roundId === "shape-only") {
    return value === `${item.id}-correct`;
  }
  return normaliseGlossaryTermText(value) === normaliseGlossaryTermText(item.term);
}

function submitGlossaryChallengeChoiceEncoded(targetId, encodedValue) {
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const item = batch.find(entry => entry.id === targetId);
  if (!item) return;

  const answer = decodeURIComponent(encodedValue || "");
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetId]) return;

  if (isGlossaryChoiceCorrect(round.id, item, answer)) {
    assignments[targetId] = targetId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${item.term} restored. Another glossary signal is back online.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: `${item.term} is back in the system. Keep the chamber stable and chain the streak.`
    };
  } else {
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = round.id === "shape-only"
      ? "Definition mismatch. Re-read the meaning and try again."
      : "Signal mismatch. Use the clue feed and restore the right glossary term.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Signal unstable",
      detail: `${answer || "That choice"} did not restore the correct glossary entry.`
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function setGlossarySelectedTerm(termId) {
  const assignments = getGlossaryAssignmentsForBatch();
  const usedTermIds = Object.values(assignments);
  if (usedTermIds.includes(termId)) return;
  state.glossarySelectedTermId = state.glossarySelectedTermId === termId ? "" : termId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossarySelectedSocket(socketId) {
  const assignments = getGlossaryAssignmentsForBatch();
  if (assignments[socketId]) return;
  state.glossarySelectedSocketId = state.glossarySelectedSocketId === socketId ? "" : socketId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossaryMode(mode) {
  state.glossaryMode = mode === "study" ? "study" : "play";
  renderGlossaryStage();
}

function moveGlossaryStudy(step) {
  const batch = getCurrentGlossaryBatch();
  if (!batch.length) return;
  const nextIndex = (state.glossaryStudyIndex + step + batch.length) % batch.length;
  state.glossaryStudyIndex = nextIndex;
  renderGlossaryStage();
}

function flipGlossaryStudyCard() {
  const currentKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  state.answers[currentKey] = !state.answers[currentKey];
  renderGlossaryStage();
}

function resetGlossarySelections() {
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
}

function startGlossaryDrag(termId) {
  state.glossaryDraggedTermId = termId;
  state.glossarySelectedTermId = termId;
  renderGlossaryStage();
}

function endGlossaryDrag() {
  state.glossaryDraggedTermId = "";
  renderGlossaryStage();
}

function getGlossaryRoundEconomy(roundNumber) {
  const glossaryStage = STAGES.find(stage => stage.id === "glossary");
  if (!glossaryStage) return { salary: 0, taxRate: 0 };
  const salary = Math.round((glossaryStage.credits * (0.65 + (roundNumber * 0.12))) / 4);
  return { salary, taxRate: glossaryStage.taxRate };
}

function formatGlossaryRoundTitle(roundNumber) {
  return roundNumber === 1
    ? "Signal Scan cleared. The first chamber is back online."
    : roundNumber === 2
      ? "Definition Repair cleared. Chamber two is stable."
      : roundNumber === 3
        ? "Corruption Sweep cleared. Chamber three is restored."
        : "Recall Forge complete. Glossary mastery is banked.";
}

function buildGlossaryCelebration(roundNumber, scoreText) {
  clearGlossaryTimer();
  const { salary, taxRate } = getGlossaryRoundEconomy(roundNumber);
  const elapsedSeconds = getGlossaryRoundElapsedSeconds();
  const speedBand = getGlossarySpeedBand(elapsedSeconds);
  const precisionBonus = state.glossaryMisses <= 1 ? 300 : state.glossaryMisses <= 4 ? 150 : 0;
  const totalSalary = salary + speedBand.bonus + precisionBonus;
  const tax = Math.round(totalSalary * taxRate);
  state.salaryBoost += totalSalary;
  state.taxContribution += tax;
  state.glossaryRoundRewards[roundNumber] = { salary: totalSalary, tax, scoreText, elapsedSeconds, speedBand, precisionBonus };
  state.glossaryRoundCelebration = {
    roundNumber,
    title: formatGlossaryRoundTitle(roundNumber),
    subtitle: roundNumber < 4
      ? `Let's level up. ${GLOSSARY_ROUND_CONFIGS[roundNumber].title} removes another support.`
      : "The final recall round is complete. Return to the lab stronger and sharper.",
    salary: totalSalary,
    tax,
    scoreText,
    elapsedSeconds,
    speedBand,
    precisionBonus
  };
  state.glossaryPulse = `Round ${roundNumber} cleared. Choose where the class community tax should land, then continue.`;
  state.glossaryPulseType = "good";
  state.recentReward = {
    type: "positive",
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${speedBand.label} • +${formatCurrency(totalSalary)} salary • +${formatCurrency(tax)} community tax`
  };
  state.debriefLog.push({
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${formatSecondsAsClock(elapsedSeconds)} • ${formatCurrency(totalSalary)} salary earned • ${formatCurrency(tax)} ready for community allocation`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `glossary-round-${roundNumber}`,
    label: `EST glossary round ${roundNumber}`,
    detail: `${scoreText} • ${speedBand.label}`,
    earnedDelta: totalSalary,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  scrollToTopSmooth();
}

function setGlossaryRoundVote(optionId) {
  if (!state.glossaryRoundCelebration) return;
  state.glossaryRoundVotes[state.glossaryRoundCelebration.roundNumber] = optionId;
  renderGlossaryStage();
}

function continueGlossaryRound() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return;
  const roundNumber = celebration.roundNumber;
  const voteKey = state.glossaryRoundVotes[roundNumber];
  if (!voteKey) {
    state.glossaryPulse = "Choose a class tax destination before you level up to the next round.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Choose a tax destination",
      detail: "Select one community option first so the round reward knows where the class tax should go."
    };
    renderRewardPulse();
    renderGlossaryStage();
    return;
  }
  state.answers[`glossaryVoteRound${roundNumber}`] = voteKey;
  state.glossaryRoundCelebration = null;
  state.glossarySelectedTermId = "";
  state.glossaryDraggedTermId = "";
  if (roundNumber < 4) {
    state.glossaryRoundIndex = roundNumber;
    state.glossaryBatchIndex = 0;
    state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex].cue;
    state.glossaryPulseType = "neutral";
    startGlossaryRoundTimer(true);
    renderGlossaryStage();
    scrollToTopSmooth();
    return;
  }
  bankGlossaryResults();
}

function returnToLab() {
  setLabMode(false);
  setStageMenuMode(false);
  state.selectedStageId = null;
  state.contentGroupIndex = -1;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Return from the glossary mission and keep building your EST run.");
  renderStageRoot(`
    <div class="empty-state">
      <p>Back in the EST Lab. Re-enter any stage when you're ready.</p>
    </div>
  `);
  scrollToTopSmooth();
}

function attemptGlossaryMatch(termId, targetTermId) {
  if (!termId) return;
  const batch = getCurrentGlossaryBatch();
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetTermId]) return;
  const draggedTerm = batch.find(item => item.id === termId);
  const targetTerm = batch.find(item => item.id === targetTermId);
  if (!draggedTerm || !targetTerm) return;

  if (termId === targetTermId) {
    assignments[targetTermId] = termId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    resetGlossarySelections();
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${targetTerm.term} matched. The blueprint wall is lighting up.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct match",
      detail: `${targetTerm.term} has been locked in. Keep matching to complete the blueprint.`
    };
  } else {
    resetGlossarySelections();
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = "Try again. That term piece does not fit this definition socket.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Try again",
      detail: `${draggedTerm.term} does not match that definition. Re-check the clue.`
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function dropGlossaryTerm(event, targetTermId) {
  event.preventDefault();
  attemptGlossaryMatch(state.glossaryDraggedTermId || state.glossarySelectedTermId, targetTermId);
}

function handleGlossarySocketClick(targetTermId) {
  setGlossarySelectedSocket(targetTermId);
}

function isGlossaryBatchMatched() {
  const batch = getCurrentGlossaryBatch();
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.length && batch.every(item => assignments[item.id] === item.id);
}

function moveToNextGlossaryBatchOrRound() {
  const completedRound = state.glossaryRoundIndex + 1;
  buildGlossaryCelebration(completedRound, `All 4 glossary signals restored in this chamber.`);
  renderGlossaryStage();
}

function nextGlossaryPhase() {
  if (state.glossaryRoundIndex < 3) {
    if (!isGlossaryBatchMatched()) return;
    moveToNextGlossaryBatchOrRound();
  }
}

function setGlossaryRecallAnswer(key, value) {
  state.glossaryRecallAnswers[key] = value;
}

function setGlossaryRecallChoiceEncoded(key, encodedValue) {
  state.glossaryRecallAnswers[key] = decodeURIComponent(encodedValue || "");
  renderGlossaryStage();
}

function triggerGlossaryRecallAdvance(item, selectedKeyword, batch) {
  clearGlossaryRecallAdvanceTimeout();
  state.glossaryRecallTransition = {
    itemId: item.id,
    title: item.term,
    keyword: selectedKeyword,
    nextIndex: Math.min(batch.length - 1, state.glossaryRecallIndex + 1),
    finished: batch.every(entry => entry.id === item.id || state.glossaryRecallResults[entry.id]?.overallCorrect)
  };
  renderGlossaryStage();
  glossaryRecallAdvanceTimeout = setTimeout(() => {
    state.glossaryRecallIndex = state.glossaryRecallTransition?.nextIndex ?? state.glossaryRecallIndex;
    state.glossaryRecallTransition = null;
    renderGlossaryStage();
  }, 950);
}

function setGlossaryRecallTermChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const selectedTerm = decodeURIComponent(encodedValue || "");
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const correct = normaliseGlossaryTermText(selectedTerm) === normaliseGlossaryTermText(item.term);

  state.glossaryRecallAnswers[termKey] = selectedTerm;
  delete state.glossaryRecallAnswers[keywordKey];

  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: correct,
    keywordCorrect: false,
    overallCorrect: false
  };

  if (correct) {
    state.glossaryPulse = `${item.term} restored. Now recover one keyword that belongs with it.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct term restored",
      detail: "Good catch. Finish the signal by choosing one keyword that genuinely belongs to this term."
    };
  } else {
    state.glossaryPulse = `${selectedTerm} is not the right term for this signal. Try another term before moving on.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong term",
      detail: "That term does not match the keyword trail. Step 2 will stay locked until the correct term is chosen."
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function setGlossaryRecallKeywordChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const termResult = state.glossaryRecallResults[item.id];
  if (!termResult?.termCorrect) {
    state.glossaryPulse = "Choose the correct term first. The repair token only unlocks after Step 1 is right.";
    state.glossaryPulseType = "warn";
    renderGlossaryStage();
    return;
  }

  const selectedKeyword = decodeURIComponent(encodedValue || "");
  const keywordKey = `keyword-${item.id}`;
  const keywordCorrect = item.keywords.some(keyword => normaliseGlossaryTermText(selectedKeyword).includes(normaliseGlossaryTermText(keyword)));

  state.glossaryRecallAnswers[keywordKey] = selectedKeyword;
  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: true,
    keywordCorrect,
    overallCorrect: keywordCorrect
  };

  if (keywordCorrect) {
    state.glossaryPulse = `${selectedKeyword} locked in. Signal ${state.glossaryRecallIndex + 1} is restored.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: "Both steps are correct. Move to the next signal core."
    };
    triggerGlossaryRecallAdvance(item, selectedKeyword, batch);
  } else {
    state.glossaryPulse = `${selectedKeyword} does not belong with ${item.term}. Try a different repair token.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong repair token",
      detail: "The term is right, but the keyword is not. Try another token for this same signal."
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function getGlossaryStabilityPercent() {
  const completedRounds = Object.keys(state.glossaryRoundRewards || {}).length;
  const partial = state.glossaryRoundCelebration
    ? 0
    : Math.round(((state.glossaryBatchIndex + (isGlossaryBatchMatched() ? 1 : 0)) / Math.max(1, (state.stageDeck?.glossaryBatches || []).length)) * 25);
  return Math.min(100, (completedRounds * 25) + partial);
}

function getGlossaryRoundBadge(roundIndex) {
  const reward = state.glossaryRoundRewards[roundIndex + 1];
  if (reward) return "Restored";
  if (state.glossaryRoundIndex === roundIndex) return "Active";
  if (state.completed.glossary) return "Replay";
  if (state.glossaryRoundIndex > roundIndex) return "Unlocked";
  return "Locked";
}

function isGlossaryRoundUnlocked(roundIndex) {
  if (state.completed.glossary) return true;
  const unlockedCount = Object.keys(state.glossaryRoundRewards || {}).length;
  return roundIndex <= unlockedCount || state.glossaryRoundIndex === roundIndex;
}

function renderGlossaryChamberRail() {
  return `
    <div class="glossary-chamber-rail">
      ${GLOSSARY_ROUND_CONFIGS.map((round, index) => {
        const status = getGlossaryRoundBadge(index);
        const active = state.glossaryRoundIndex === index && !state.glossaryRoundCelebration;
        const complete = Boolean(state.glossaryRoundRewards[index + 1]);
        const unlocked = isGlossaryRoundUnlocked(index);
        return `
          <button
            type="button"
            class="glossary-chamber-card ${active ? "active" : ""} ${complete ? "complete" : ""} ${unlocked ? "" : "locked"}"
            ${unlocked ? `onclick="window.ESTPrep.jumpToGlossaryRound(${index})"` : "disabled"}
          >
            <div class="glossary-chamber-index">0${index + 1}</div>
            <strong>${escapeHtml(round.title.replace(/^Round \d+:\s*/, ""))}</strong>
            <p>${escapeHtml(round.cue)}</p>
            <span class="glossary-chamber-status">${status}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function jumpToGlossaryRound(roundIndex) {
  if (!isGlossaryRoundUnlocked(roundIndex)) return;
  if (state.glossaryRoundIndex === roundIndex && !state.glossaryRoundCelebration) return;
  clearGlossaryRoundState(roundIndex);
  state.glossaryRoundIndex = roundIndex;
  state.glossaryBatchIndex = 0;
  state.glossaryRoundCelebration = null;
  state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[roundIndex]?.cue || "";
  state.glossaryPulseType = "neutral";
  state.glossaryMode = "play";
  startGlossaryRoundTimer(true);
  renderGlossaryStage();
}

function buildRecallTermOptions(item) {
  const distractors = pickRandom(
    buildGlossarySource().filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]);
}

function buildRecallKeywordOptions(item) {
  const keywordPool = buildGlossarySource()
    .filter(candidate => candidate.id !== item.id)
    .flatMap(candidate => candidate.keywords);
  const distractors = pickRandom([...new Set(keywordPool.filter(keyword => !item.keywords.includes(keyword)))], 3);
  return shuffle([item.keywords[0], ...distractors]);
}

function renderGlossaryRecallForge(batch, batchNumber, totalBatches) {
  const readyCores = batch.filter(item => {
    return Boolean(state.glossaryRecallResults[item.id]?.overallCorrect);
  }).length;
  const firstIncompleteIndex = batch.findIndex(item => !state.glossaryRecallResults[item.id]?.overallCorrect);
  const activeIndex = firstIncompleteIndex >= 0
    ? firstIncompleteIndex
    : Math.max(0, Math.min(state.glossaryRecallIndex, batch.length - 1));
  const item = batch[activeIndex];
  if (!item) return "";
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const selectedTerm = state.glossaryRecallAnswers[termKey] || "";
  const selectedKeyword = state.glossaryRecallAnswers[keywordKey] || "";
  const recallResult = state.glossaryRecallResults[item.id] || {};
  const termSelected = Boolean(selectedTerm);
  const termCorrect = Boolean(recallResult.termCorrect);
  const keywordSelected = Boolean(selectedKeyword);
  const keywordCorrect = Boolean(recallResult.keywordCorrect);
  const termOptions = buildRecallTermOptions(item);
  const keywordOptions = buildRecallKeywordOptions(item);
  const transition = state.glossaryRecallTransition;
  const showingTransition = Boolean(transition && transition.itemId === item.id);
  return `
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>Recall Forge</h3>
          <p class="small-copy">The final chamber turns recognition into retrieval. Restore each term signal, then restore one key concept from memory.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Final chamber</span>
          <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      <div class="glossary-escape-console">
        <div class="glossary-stability-card">
          <div class="kicker">Lab stability</div>
          <strong>${getGlossaryStabilityPercent()}% restored</strong>
          <div class="glossary-progress-track" aria-hidden="true">
            <div class="glossary-progress-bar" style="width:${getGlossaryStabilityPercent()}%;"></div>
          </div>
          <p>Every restored signal banks more salary, more tax contribution, and clearer EST vocabulary under pressure.</p>
        </div>
        <div class="glossary-signal-feed">
          <div class="kicker">Forge rules</div>
          <p><strong>Step 1:</strong> Read the keyword trail and choose the correct term.</p>
          <p><strong>Step 2:</strong> Only if Step 1 is correct, choose one keyword that genuinely belongs to that term.</p>
          <p><strong>Step 3:</strong> Once both are right, the forge moves you to the next signal core.</p>
        </div>
      </div>
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>How to clear Recall Forge</h2>
          <p>${readyCores}/${batch.length} signal cores fully locked</p>
        </div>
        <p class="small-copy">Work one signal at a time. A wrong term stops the sequence. A correct term unlocks the repair token step.</p>
      </div>
      ${showingTransition ? `
        <div class="feedback-box good glossary-recall-celebration">
          <p><strong>Signal restored:</strong> ${escapeHtml(transition.title)}</p>
          <p>${escapeHtml(transition.keyword)} locked in. ${transition.finished ? "All signal cores are online. Restore the system when you're ready." : "Advancing to the next signal core..."}</p>
        </div>
      ` : ""}
      <div class="glossary-recall-grid">
        <article class="panel glossary-recall-card">
          <div class="sample-meta">
            <strong>Signal core ${activeIndex + 1}</strong>
            <span>${readyCores === batch.length ? "All signals restored" : readyCores > activeIndex ? "Signal already restored" : "Active signal"}</span>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 1: keyword trail</div>
            <p>${escapeHtml(item.keywords.join(" • "))}</p>
            <div class="choice-grid">
              ${termOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedTerm === option ? `selected live-selected ${termCorrect ? "correct" : "incorrect"}` : ""}"
                  onclick="window.ESTPrep.setGlossaryRecallTermChoiceEncoded('${item.id}', '${encodeURIComponent(option)}')"
                  ${showingTransition ? "disabled" : ""}
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 2: repair token</div>
            <p>${termCorrect
              ? `Good. Now choose one keyword that genuinely belongs with <strong>${escapeHtml(item.term)}</strong>.`
              : termSelected
                ? `That term is wrong. Fix Step 1 before trying the repair token.`
                : "Choose the correct term first. Then the repair token step unlocks."}</p>
            <div class="choice-grid">
              ${keywordOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedKeyword === option ? `selected live-selected ${keywordCorrect ? "correct" : "incorrect"}` : ""}"
                  ${(termCorrect && !showingTransition) ? "" : "disabled"}
                  onclick="window.ESTPrep.setGlossaryRecallKeywordChoiceEncoded('${item.id}', '${encodeURIComponent(option)}')"
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="badge-row">
            <span class="badge">${termCorrect ? "Step 1 correct" : termSelected ? "Step 1 incorrect" : "Choose a term"}</span>
            <span class="badge">${keywordCorrect ? "Step 2 correct" : keywordSelected ? "Step 2 incorrect" : "Choose a keyword"}</span>
          </div>
        </article>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Forge exit</strong>
        <p class="small-copy">Restore one signal core at a time. When all 4 are correct, restore the system to bank the final salary, tax contribution, and mastery save.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()" ${readyCores === batch.length ? "" : "disabled"}>${batchNumber === totalBatches ? "Restore System" : "Lock Next Recall Batch"}</button>
      </div>
    </div>
  `;
}

function renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore) {
  const promptItem = getCurrentGlossaryPromptItem(batch);
  const progressPercent = Math.round((matchedCount / Math.max(1, batch.length)) * 100);

  if (!promptItem) {
    return `
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>Chamber cleared</h2>
          <p>All ${batch.length} glossary signals restored in this batch.</p>
        </div>
        <p class="small-copy glossary-pulse good">The chamber is stable. Move to the next batch or bank the round reward.</p>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Chamber exit</strong>
        <p class="small-copy">You restored every glossary signal in this batch. Advance to keep the run going.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()">${batchNumber === totalBatches ? "Finish Round" : "Next Batch"}</button>
      </div>
    `;
  }

  const optionSet = buildGlossaryChallengeOptions(round.id, promptItem, batch);
  const challengeCopy = round.id === "colour-shape"
    ? {
        kicker: "Signal scan",
        title: "Recover the correct term from the clue trail",
        prompt: `Keyword trail: ${promptItem.keywords.join(" • ")}`,
        support: "Choose the glossary term that best matches the signal feed."
      }
    : round.id === "shape-only"
      ? {
          kicker: "Definition repair",
          title: "Restore the correct definition file",
          prompt: promptItem.term,
          support: "Choose the definition fragment that correctly restores this term."
        }
      : {
          kicker: "Corruption sweep",
          title: "Match the definition back to the correct term",
          prompt: clampText(promptItem.definition, 180),
          support: "The visual scaffolds are gone. Recover the right term from meaning alone."
        };

  return `
    <div class="panel glossary-command-panel glossary-arcade-shell">
      <div class="section-title">
        <h2>Recovery chamber ${state.glossaryRoundIndex + 1}</h2>
        <p>${matchedCount}/${batch.length} signal locks restored</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-arcade-grid">
        <article class="glossary-arcade-prompt">
          <div class="kicker">${escapeHtml(challengeCopy.kicker)}</div>
          <h3>${escapeHtml(challengeCopy.title)}</h3>
          <div class="glossary-arcade-signal">${escapeHtml(challengeCopy.prompt)}</div>
          <p>${escapeHtml(challengeCopy.support)}</p>
        </article>
        <div class="glossary-arcade-options">
          ${optionSet.map(option => `
            <button
              type="button"
              class="choice-button glossary-arcade-option"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeURIComponent(option.value)}')"
            >
              <span class="kicker">${escapeHtml(option.detail)}</span>
              <strong>${escapeHtml(option.title)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Chamber exit</strong>
      <p class="small-copy">Restore all ${batch.length} signals in this batch to unlock the next breach and bank the round reward.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>${batchNumber === totalBatches ? "Finish Round" : "Next Batch"}</button>
    </div>
  `;
}

function renderGlossaryCelebration() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return "";
  const voteKey = state.glossaryRoundVotes[celebration.roundNumber] || "";
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button
      type="button"
      class="choice-button ${voteKey === option.id ? "selected live-selected" : ""}"
      onclick="window.ESTPrep.setGlossaryRoundVote('${option.id}')"
    >
      <strong>${escapeHtml(option.label || option.id)}</strong>
      <span>${escapeHtml(option.description || "Class community focus")}</span>
    </button>
  `).join("");
  return `
    <section class="glossary-celebration">
      <div class="glossary-celebration-card">
        <div class="kicker">Round ${celebration.roundNumber} cleared</div>
        <h3>${escapeHtml(celebration.title)}</h3>
        <p>${escapeHtml(celebration.subtitle)}</p>
        <div class="badge-row">
          <span class="badge">${escapeHtml(celebration.scoreText)}</span>
          <span class="badge">Time: ${formatSecondsAsClock(celebration.elapsedSeconds)}</span>
          <span class="badge">${escapeHtml(celebration.speedBand.label)}</span>
        </div>
        <div class="glossary-reward-grid">
          <article class="glossary-reward-chip">
            <strong>Total salary</strong>
            <p>${formatCurrency(celebration.salary)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Speed bonus</strong>
            <p>${formatCurrency(celebration.speedBand.bonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Precision bonus</strong>
            <p>${formatCurrency(celebration.precisionBonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Community tax</strong>
            <p>${formatCurrency(celebration.tax)}</p>
          </article>
        </div>
        <div class="panel glossary-vote-panel">
          <div class="section-title">
            <h2>Choose how your class tax helps the community</h2>
            <p>All pooled taxes go toward building something bigger than one student run.</p>
          </div>
          <div class="choice-grid">${communityOptions}</div>
        </div>
        ${voteKey ? "" : `
          <div class="feedback-box warn">
            <p><strong>Select one tax destination before continuing.</strong></p>
            <p>Your round reward is ready, but the class tax allocation has to be chosen first.</p>
          </div>
        `}
        <div class="builder-actions">
          <button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryRound()">
            ${voteKey
              ? (celebration.roundNumber < 4 ? "Level Up to the Next Round" : "Bank Glossary Results")
              : "Choose a Tax Destination to Continue"}
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderGlossaryStudyDeck(batch) {
  const card = batch[state.glossaryStudyIndex] || batch[0];
  if (!card) return "";
  const flipKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  const flipped = !!state.answers[flipKey];
  return `
    <div class="panel glossary-study-panel">
      <div class="section-title">
        <h2>Study Deck</h2>
        <p>Flip through the current batch before you play for speed and salary.</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Card ${state.glossaryStudyIndex + 1} / ${batch.length}</span>
        <span class="badge">${escapeHtml(card.term)}</span>
      </div>
      <button type="button" class="glossary-study-card ${flipped ? "flipped" : ""}" onclick="window.ESTPrep.flipGlossaryStudyCard()">
        <div class="glossary-study-inner">
          <div class="glossary-study-face">
            <span class="kicker">Term</span>
            <strong>${escapeHtml(card.term)}</strong>
            <p>Click to reveal the meaning.</p>
          </div>
          <div class="glossary-study-face glossary-study-back">
            <span class="kicker">Definition</span>
            <strong>${escapeHtml(card.definition)}</strong>
            <p>Keywords: ${escapeHtml(card.keywords.join(", "))}</p>
          </div>
        </div>
      </button>
      <div class="builder-actions glossary-study-actions">
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(-1)">Previous</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.flipGlossaryStudyCard()">Flip Card</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(1)">Next</button>
      </div>
    </div>
  `;
}

function renderGlossaryStage() {
  setGameplayViewportMode(false);
  setStageMenuMode(false);
  renderFocusNav();
  syncMissionMode();
  setStageScene(state.glossaryRoundCelebration ? "restored" : "challenge");
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const assignments = getGlossaryAssignmentsForBatch();
  const totalBatches = 1;
  const roundNumber = state.glossaryRoundIndex + 1;
  const batchNumber = 1;
  const matchedCount = Object.keys(assignments).length;
  setText("stage-title", "Glossary Mission");
  setText("stage-subtitle", "Replay any unlocked chamber to sharpen vocabulary without resetting the whole glossary lab.");

  if (state.glossaryRoundCelebration) {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">Glossary Mission Access</div>
            <h3>Reward chamber</h3>
          </div>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
        ${renderGlossaryCelebration()}
      </div>
    `);
    return;
  }

  if (round.id === "recall") {
    renderStageRoot(renderGlossaryRecallForge(batch, batchNumber, totalBatches));
    startGlossaryRoundTimer();
    return;
  }

  const roundScore = Math.max(0, (matchedCount * 100) - (state.glossaryMisses * 25));
  const modeSwitch = `
    <div class="glossary-mode-switch">
      <button type="button" class="choice-button ${state.glossaryMode === "play" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('play')">Restore Chamber</button>
      <button type="button" class="choice-button ${state.glossaryMode === "study" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('study')">Intel Deck</button>
    </div>
  `;

  if (state.glossaryMode === "study") {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar glossary-escape-topbar">
          <div>
            <div class="kicker">System Recovery Protocol</div>
            <h3>Intel Deck</h3>
            <p class="small-copy">Flip through the signal cards, absorb the language, then jump back into the chamber to restore the glossary wall.</p>
          </div>
          <div class="glossary-mission-actions">
            <span class="badge">Round ${roundNumber} / 4</span>
            <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
            <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
          </div>
        </div>
        ${renderGlossaryChamberRail()}
        ${modeSwitch}
        ${renderGlossaryStudyDeck(batch)}
      </div>
    `);
    startGlossaryRoundTimer();
    return;
  }

  renderStageRoot(`
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>Glossary Lockdown</h3>
          <p class="small-copy">The EST lab vocabulary core has crashed. Clear each chamber to restore system stability before the final recall forge.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Round ${roundNumber} / 4</span>
          <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      <div class="glossary-escape-console">
        <div class="glossary-stability-card">
          <div class="kicker">System stability</div>
          <strong>${getGlossaryStabilityPercent()}% restored</strong>
          <div class="glossary-progress-track" aria-hidden="true">
            <div class="glossary-progress-bar" style="width:${getGlossaryStabilityPercent()}%;"></div>
          </div>
          <p>Correct matches restore the wall, build streak bonuses, and convert precision language into salary and community tax.</p>
        </div>
        <div class="glossary-signal-feed">
          <div class="kicker">Mission brief</div>
          <p>${escapeHtml(round.cue)}</p>
          <p>${matchedCount}/${batch.length} locks restored in this batch. Best streak x${state.glossaryBestStreak}.</p>
        </div>
      </div>
      <div class="question-card glossary-round-banner glossary-escape-banner">
        <div class="kicker">Blueprint breach</div>
        <h3>${escapeHtml(round.title)}</h3>
        <p>Each chamber now has its own repair mechanic. Read the signal, make the recovery choice, and stabilise the EST glossary core.</p>
      </div>
      ${modeSwitch}
      ${renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore)}
    </div>
  `);
  startGlossaryRoundTimer();
}

async function submitGlossary() {
  const batch = getCurrentGlossaryBatch();
  if (state.glossaryRoundIndex < 3) return;

  batch.forEach(item => {
    const typedTerm = normaliseGlossaryTermText(state.glossaryRecallAnswers[`term-${item.id}`]);
    const typedKeyword = normaliseGlossaryTermText(state.glossaryRecallAnswers[`keyword-${item.id}`]);
    const termCorrect = typedTerm === normaliseGlossaryTermText(item.term);
    const keywordCorrect = item.keywords.some(keyword => typedKeyword.includes(normaliseGlossaryTermText(keyword)));
    const overallCorrect = termCorrect && keywordCorrect;
    state.glossaryRecallResults[item.id] = {
      term: item.term,
      keywords: item.keywords,
      termCorrect,
      keywordCorrect,
      overallCorrect
    };
  });

  const allResults = batch.map(item => state.glossaryRecallResults[item.id]).filter(Boolean);
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  buildGlossaryCelebration(4, `${overallCorrect}/${total} final recall checks correct.`);
  renderGlossaryStage();
}

async function bankGlossaryResults() {
  const batch = getCurrentGlossaryBatch();
  const allResults = batch.map(item => state.glossaryRecallResults[item.id]).filter(Boolean);
  const durationSeconds = getCurrentStageDurationSeconds();
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  const scoreRatio = total ? overallCorrect / total : 0;
  const scorePercent = Math.round(scoreRatio * 100);
  const previousBestRatio = Math.max(0, Number(state.stageBestScores.glossary || 0));
  const firstGlossaryClear = !state.completed.glossary && previousBestRatio === 0;
  const improvedBest = scoreRatio > previousBestRatio;

  if (firstGlossaryClear) {
    awardStage("glossary", { scoreRatio });
  } else if (improvedBest) {
    awardStageImprovement("glossary", previousBestRatio, scoreRatio);
  } else {
    state.recentReward = {
      type: "warning",
      title: "Glossary replay saved",
      detail: `This attempt scored ${scorePercent}%. Your best glossary result remains ${Math.round(previousBestRatio * 100)}%, so no extra salary or tax was added.`
    };
    renderRewardPulse();
  }

  state.stageBestScores.glossary = Math.max(previousBestRatio, scoreRatio);
  addEvidence("Glossary mastery run", `${overallCorrect}/${total} final recall checks correct • Best streak x${state.glossaryBestStreak} • Misses ${state.glossaryMisses}`);
  await saveProgress("glossary-lock-in", "glossary-check", `Glossary final recall: ${overallCorrect}/${total}`, scorePercent, {
    taskName: "Glossary Check",
    durationSeconds,
    promptText: "Match and recall glossary terms across four scaffolded rounds.",
    extraPayload: {
      round_summary: {
        rounds: GLOSSARY_ROUND_CONFIGS.map(item => item.title),
        total_terms: FULL_GLOSSARY_TERMS.length,
        best_streak: state.glossaryBestStreak,
        misses: state.glossaryMisses,
        round_rewards: state.glossaryRoundRewards,
        round_votes: state.glossaryRoundVotes
      },
      final_round_results: allResults
    }
  });
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  showFeedbackBox(scoreRatio >= 0.8 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Glossary score:</strong> ${overallCorrect}/${total} final recall checks correct.`,
    `${improvedBest || firstGlossaryClear
      ? `Best glossary result is now ${Math.round(state.stageBestScores.glossary * 100)}%.`
      : `Best glossary result remains ${Math.round(previousBestRatio * 100)}%. This replay was saved but did not overwrite your best run.`}`,
    `Best streak: x${state.glossaryBestStreak}. Misses: ${state.glossaryMisses}.`,
    "Teachers can now inspect which terms were mastered or missed in the final recall round."
  ]);
}
