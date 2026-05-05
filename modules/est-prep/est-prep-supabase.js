// EST Prep supabase bundle. Loaded as a classic browser script.
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

async function saveProgress(checkpoint, evidenceType = "artifact", evidenceText = "", autoScore = null, meta = {}) {
  const student = state.student;
  const session = getPlayerSession();
  const earnedDelta = Math.max(0, Number(state.salaryBoost || 0) - Number(state.creditedSalaryBoost || 0));
  const taxDelta = Math.max(0, Number(state.taxContribution || 0) - Number(state.creditedTaxContribution || 0));
  const nextSalary = Number(session.annualSalary || 25000) + earnedDelta;
  const nextNetWorth = Number(session.cumulativeNetWorth || 0) + earnedDelta;
  const nextWorkLife = Math.max(45, Math.min(100, Number(session.workLifeBalance || 60) + (state.streak > 1 ? 3 : 0)));
  const nextSecurity = Math.max(45, Math.min(100, Number(session.jobSecurity || 75) + Math.round(state.readiness / 20)));
  const nextSavings = Math.max(0, Number(session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25)));
  const nextTaxPaid = Math.max(0, Number(session.taxPaid || 0) + taxDelta);

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
    savings: nextSavings,
    taxPaid: nextTaxPaid,
    jobSecurity: nextSecurity,
    workLifeBalance: nextWorkLife,
    checkpoint
  });
  state.creditedSalaryBoost = Number(state.salaryBoost || 0);
  state.creditedTaxContribution = Number(state.taxContribution || 0);
  if (earnedDelta || taxDelta) {
    pushEconomyLog({
      eventType: "progress-saved",
      checkpoint,
      label: meta.taskName || checkpoint,
      detail: meta.promptText || evidenceType,
      earnedDelta,
      taxDelta,
      annualSalaryAfter: nextSalary,
      netWorthAfter: nextNetWorth,
      savingsAfter: nextSavings,
      taxPaidAfter: nextTaxPaid
    });
  }

  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const completionPercent = getModuleCompletionPercent();
  const masteryPercent = Math.min(100, Math.round((state.marksBanked / STAGES.reduce((sum, stage) => sum + stage.marks, 0)) * 100));

  const progressPayload = {
    student_id: student.id,
    module_id: MODULE_ID,
    completion_percent: completionPercent,
    mastery_percent: masteryPercent,
    attempts: Math.max(Object.keys(state.completed).length, getCompletedContentTopicCount()),
    unlocked: true,
    completed: completionPercent >= 100,
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
      response_text: evidenceText,
      ...meta.extraPayload
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

  if (Array.isArray(meta.additionalEvidenceRows) && meta.additionalEvidenceRows.length) {
    const additionalRows = meta.additionalEvidenceRows.map(item => ({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      evidence_type: item.evidenceType || evidenceType,
      prompt: item.prompt || checkpoint,
      response_text: JSON.stringify({
        kind: "career-empire-evidence",
        module_id: MODULE_ID,
        checkpoint: item.checkpoint || checkpoint,
        evidence_type: item.evidenceType || evidenceType,
        task_name: item.taskName || meta.taskName || state.selectedStageId || checkpoint,
        duration_seconds: item.durationSeconds ?? null,
        score_percent: typeof item.autoScore === "number" ? item.autoScore : autoScore,
        prompt_text: item.promptText || "",
        response_text: item.responseText || "",
        ...(item.extraPayload || {})
      }),
      auto_score: typeof item.autoScore === "number" ? item.autoScore : autoScore,
      created_at: new Date().toISOString()
    }));
    await supabase.from("assessment_evidence").insert(additionalRows);
  }

  const { data: existingProfile } = await supabase
    .from("player_profiles")
    .select("student_id, savings, tax_paid")
    .eq("student_id", student.id)
    .maybeSingle();

  await supabase.from("player_profiles").upsert({
    student_id: student.id,
    career_title: session.careerTitle || "Exam Strategist",
    annual_salary: nextSalary,
    cumulative_net_worth: nextNetWorth,
    savings: Math.max(0, Number(existingProfile?.savings || session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25))),
    tax_paid: Math.max(0, Number(existingProfile?.tax_paid || session.taxPaid || 0) + taxDelta),
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

function inferStageFromEvidence(row) {
  const type = String(row?.evidence_type || "").toLowerCase();
  const prompt = String(row?.prompt || "").toLowerCase();
  if (type === "revision-check" || type === "revision-topic-check" || prompt.includes("revision-arena") || prompt.includes("revision-topic-")) return "content";
  if (type === "glossary-check" || prompt.includes("glossary-lock-in")) return "glossary";
  if (type === "decoder-breakdown" || prompt.includes("decoder-drill")) return "decoder";
  if (type === "est-response" || prompt.includes("boss-round")) return "boss";
  return null;
}

function isContentTopicEvidenceReset(topicId, row) {
  const resetAt = state.contentTopicResetAt?.[topicId];
  if (!resetAt) return false;
  const resetTime = Date.parse(resetAt);
  const evidenceTime = Date.parse(row?.created_at || "");
  if (!Number.isFinite(resetTime)) return false;
  return !Number.isFinite(evidenceTime) || evidenceTime <= resetTime;
}

function getContentTopicIdFromEvidence(payload, row) {
  const topicId = payload?.topic_group_id || String(row?.prompt || "").replace(/^revision-topic-/, "");
  if (!topicId || topicId === row?.prompt) return "";
  return topicId;
}

function hydrateContentTopicFromPayload(payload, row) {
  const topicId = getContentTopicIdFromEvidence(payload, row);
  if (!topicId) return;
  if (isContentTopicEvidenceReset(topicId, row)) return;
  const score = Number(row?.auto_score ?? payload?.score_percent);
  if (!Number.isFinite(score) || score <= 0) return;
  state.contentTopicBestScores[topicId] = Math.max(
    Number(state.contentTopicBestScores[topicId] || 0),
    Math.round(score)
  );
  if (payload?.built_response && !state.answers[`content-note-${topicId}`]) {
    state.answers[`content-note-${topicId}`] = payload.built_response;
  }
}

function getEvidencePreview(row) {
  try {
    const parsed = JSON.parse(row?.response_text || "");
    return parsed.response_text || parsed.prompt_text || row?.prompt || "Saved response";
  } catch (_) {
    return String(row?.response_text || row?.prompt || "Saved response");
  }
}

function parseEvidencePayload(row) {
  try {
    return JSON.parse(row?.response_text || "");
  } catch (_) {
    return null;
  }
}

function hydrateGlossarySummaryFromPayload(payload) {
  const summary = payload?.round_summary;
  if (!summary) return;

  state.glossaryHasStarted = true;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = summary.round_rewards && typeof summary.round_rewards === "object"
    ? { ...summary.round_rewards }
    : state.glossaryRoundRewards;
  state.glossaryRoundVotes = summary.round_votes && typeof summary.round_votes === "object"
    ? { ...summary.round_votes }
    : state.glossaryRoundVotes;
  state.glossaryBestStreak = Math.max(Number(state.glossaryBestStreak || 0), Number(summary.best_streak || 0));
  state.glossaryMisses = Number(summary.misses || 0);
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryMode = "play";
  state.glossaryPulse = state.completed.glossary
    ? "Best glossary result loaded. Replay any chamber to improve your mastery without losing the banked result."
    : (state.glossaryPulse || "");
  state.glossaryPulseType = state.completed.glossary ? "good" : state.glossaryPulseType;
}

function restoreGlossaryReplayBoard() {
  clearGlossaryRecallAdvanceTimeout();
  clearGlossaryTimer();
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryRoundCelebration = null;
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  state.glossaryPulse = state.completed.glossary
    ? "Best glossary result loaded. Replay any chamber to improve your mastery without losing the banked result."
    : "Glossary lab restored. Pick up where you left off.";
  state.glossaryPulseType = "good";
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

async function hydrateFromSupabase() {
  const student = state.student;
  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const { data: evidenceRows, error: evidenceError } = await supabase
    .from("assessment_evidence")
    .select("evidence_type, prompt, response_text, created_at, auto_score")
    .eq("student_id", student.id)
    .eq("module_id", MODULE_ID)
    .order("created_at", { ascending: true });

  if (evidenceError) {
    console.error(evidenceError);
    return;
  }

  if (Array.isArray(evidenceRows) && evidenceRows.length) {
    let latestGlossaryPayload = null;
    state.evidenceLog = evidenceRows.map(row => {
      const stageId = inferStageFromEvidence(row);
      const payload = parseEvidencePayload(row);
      const isContentTopicEvidence = row?.evidence_type === "revision-topic-check" || String(row?.prompt || "").startsWith("revision-topic-");
      const topicId = isContentTopicEvidence ? getContentTopicIdFromEvidence(payload, row) : "";
      const ignoreContentTopicEvidence = Boolean(topicId && isContentTopicEvidenceReset(topicId, row));
      if (stageId && !(stageId === "content" && isContentTopicEvidence)) state.completed[stageId] = true;
      const autoScore = Number(row?.auto_score);
      if (stageId && Number.isFinite(autoScore) && !ignoreContentTopicEvidence) {
        state.stageBestScores[stageId] = Math.max(Number(state.stageBestScores[stageId] || 0), autoScore / 100);
      }
      if (isContentTopicEvidence) {
        hydrateContentTopicFromPayload(payload, row);
      }
      if (stageId === "glossary") {
        latestGlossaryPayload = payload || latestGlossaryPayload;
      }
      return {
        title: stageId ? `${STAGES.find(stage => stage.id === stageId)?.title || "Saved stage"} saved` : "Saved EST progress",
        detail: getEvidencePreview(row).slice(0, 160)
      };
    });
    if (latestGlossaryPayload) {
      hydrateGlossarySummaryFromPayload(latestGlossaryPayload);
    }
  }
}
