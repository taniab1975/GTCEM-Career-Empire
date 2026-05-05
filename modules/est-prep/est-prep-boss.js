// EST Prep boss bundle. Loaded as a classic browser script.
function getBossShowdownPair(round) {
  if (!round?.sampleResponses?.length) return [];
  const strong = round.sampleResponses.find(sample => /strong/i.test(sample.band || ""));
  const developing = round.sampleResponses.find(sample => /developing/i.test(sample.band || ""));
  if (strong && developing) return [strong, developing];
  return round.sampleResponses.slice(0, 2);
}

function getBossScaffoldLines(round) {
  return String(round?.scaffold || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function renderBossResponseBuilder(round) {
  const lines = getBossScaffoldLines(round);
  return `
    <div class="panel">
      <div class="section-title">
        <h2>Response Forge</h2>
        <p>Build before you write</p>
      </div>
      <p class="small-copy">Use the scaffold blocks to build a stronger answer before drafting the final response.</p>
      <div class="builder-grid">
        ${lines.map((line, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(line.replace("...", "").trim() || `Scaffold ${index + 1}`)}</strong>
            <textarea
              id="boss-scaffold-${index}"
              placeholder="Write the key idea for this part..."
              oninput="window.ESTPrep.setBossScaffold(${index}, this.value)"
            >${escapeHtml(state.answers[`boss-scaffold-${index}`] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildBossDraft()">Build Draft from Scaffold</button>
      </div>
    </div>
  `;
}

function renderDecoderStage() {
  setGameplayViewportMode(false);
  setStageMenuMode(false);
  setStageScene("challenge");
  renderFocusNav();
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  setText("stage-title", "VTCS Decoder");
  setText("stage-subtitle", "Run question forensics before you write.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">VTCS Core</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.feedback)}</p>
    </div>
    <div class="panel training-bay">
      <div class="section-title">
        <h2>Question Forensics Board</h2>
        <p>Build the brief</p>
      </div>
      <p class="small-copy">Treat the EST question like evidence. Build the four-part brief by locking the correct verb, topic, context, and response structure.</p>
      <div class="forensics-grid">
        <div class="prompt-card forensics-slot ${state.answers["decoder-verb"] ? "filled" : ""}">
          <strong>Verb</strong>
          <p>${escapeHtml(state.answers["decoder-verb"] || "Select the command word")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-topic"] ? "filled" : ""}">
          <strong>Topic</strong>
          <p>${escapeHtml(state.answers["decoder-topic"] || "Select the concept")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-context"] ? "filled" : ""}">
          <strong>Context</strong>
          <p>${escapeHtml(state.answers["decoder-context"] || "Select the context")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-structure"] ? "filled" : ""}">
          <strong>Structure</strong>
          <p>${escapeHtml(state.answers["decoder-structure"] || "Select the structure")}</p>
        </div>
      </div>
    </div>
    ${renderOptionGroup("decoder-verb", "Forensics Tool 1: Command verb", round.verbOptions)}
    ${renderOptionGroup("decoder-topic", "Forensics Tool 2: Topic", round.topicOptions)}
    ${renderOptionGroup("decoder-context", "Forensics Tool 3: Context", round.contextOptions)}
    ${renderOptionGroup("decoder-structure", "Forensics Tool 4: Structure", round.structureOptions)}
    <div class="written-stage">
      <strong>Case summary</strong>
      <p class="small-copy">Students lose marks when they misread what the question is actually asking. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">Bank Decoder Results</button>
    </div>
  `);
}

function renderBossStage() {
  setGameplayViewportMode(false);
  setStageMenuMode(false);
  setStageScene("challenge");
  renderFocusNav();
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const showdownPair = getBossShowdownPair(round);
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Direct 10% of this round's income to this class/community focus.</small>
    </button>
  `).join("");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Boss Round</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.help)}</p>
    </div>
    ${showdownPair.length === 2 ? `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>Worked Example Showdown</h2>
          <p>Judge before you draft</p>
        </div>
        <p class="small-copy">Choose the stronger response first. This helps students notice what quality looks like before they write their own answer.</p>
        <div class="sample-grid">
          ${showdownPair.map((sample, index) => `
            <article class="sample-card">
              <div class="sample-meta">
                <strong>Sample ${index + 1}</strong>
                <span>${escapeHtml(sample.label)}</span>
              </div>
              <p>${escapeHtml(sample.response)}</p>
              <button
                type="button"
                class="choice-button ${state.answers.bossShowdown === sample.label ? "selected live-selected" : ""}"
                style="margin-top:12px;"
                onclick="window.ESTPrep.setChoiceEncoded('bossShowdown', '${encodeURIComponent(sample.label)}')"
              >
                <strong>This is stronger</strong>
              </button>
            </article>
          `).join("")}
        </div>
        <div class="written-stage">
          <strong>Why?</strong>
          <p class="small-copy">Explain what makes the stronger sample better.</p>
          <textarea id="boss-showdown-reason" placeholder="Explain what the stronger sample includes or does better..." oninput="window.ESTPrep.setBossShowdownReason(this.value)">${escapeHtml(state.answers.bossShowdownReason || "")}</textarea>
        </div>
      </div>
    ` : ""}
    <div class="prompt-grid">
      ${round.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>${escapeHtml(round.scaffold.split("\n").join(" "))}</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", round.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", round.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", round.glossaryOptions)}
    ${renderBossResponseBuilder(round)}
    <div class="written-stage">
      <strong>Final simulation response</strong>
      <p class="small-copy">${escapeHtml(round.scaffold)}</p>
      <textarea id="boss-response" placeholder="Write your EST-style answer here...">${escapeHtml(state.answers.bossText || "")}</textarea>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Community Contribution</h2>
        <p class="status-watch">Class impact</p>
      </div>
      <p class="small-copy">Ten percent of this round’s reward feeds the wider class/community economy. Choose where this answer will direct its contribution.</p>
      <div class="choice-grid">${communityOptions}</div>
    </div>
    <div class="written-stage">
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Submit Boss Round</button>
    </div>
  `);
}

function setChoice(groupKey, option) {
  state.answers[groupKey] = option;
  updateSelectionButtons(groupKey, option);
  setSelectionPulse(groupKey, option);
  persistESTProgressSnapshot();
}

function setChoiceEncoded(groupKey, encodedOption) {
  setChoice(groupKey, decodeURIComponent(encodedOption));
}

function setBossScaffold(index, value) {
  state.answers[`boss-scaffold-${index}`] = value;
}

function setBossShowdownReason(value) {
  state.answers.bossShowdownReason = value;
}

function buildBossDraft() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const draft = getBossScaffoldLines(round)
    .map((line, index) => {
      const label = line.replace("...", "").trim();
      const value = state.answers[`boss-scaffold-${index}`] || "";
      return value ? `${label} ${value}`.trim() : "";
    })
    .filter(Boolean)
    .join("\n");
  state.answers.bossText = draft;
  const textarea = document.getElementById("boss-response");
  if (textarea) textarea.value = draft;
  state.recentReward = {
    type: "positive",
    title: "Draft built",
    detail: "Your scaffold blocks have been assembled into a first EST response draft."
  };
  renderRewardPulse();
}

function setBossVote(optionId) {
  state.answers.bossVote = optionId;
  updateSelectionButtons("boss-vote", optionId);
  const option = (state.stageDeck?.communityOptions || []).find(item => item.id === optionId);
  setSelectionPulse("boss-vote", option?.label || optionId);
}

function bossCriterionReview(round, response) {
  const normalized = String(response || "").trim();
  const lower = normalized.toLowerCase();
  const wordCount = normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
  const checks = [
    { id: "command", label: "Command word decoded", passed: state.answers["boss-command"] === round.correctCommand, detail: `Expected ${round.correctCommand}.` },
    { id: "content", label: "Best content point chosen", passed: state.answers["boss-content"] === round.correctContent, detail: "Content option aligns to the revision topic." },
    { id: "glossary", label: "Correct glossary term selected", passed: state.answers["boss-glossary"] === round.correctGlossary, detail: `Expected ${round.correctGlossary}.` },
    { id: "point", label: "Clear answer point", passed: round.requiredKeywords.point.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Your response should directly answer the question." },
    { id: "because", label: "Cause or explanation included", passed: round.requiredKeywords.because.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Use because/how reasoning, not a bare statement." },
    { id: "result", label: "Consequence or outcome included", passed: round.requiredKeywords.result.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Show the effect, outcome, or implication." },
    { id: "glossary-language", label: "Glossary language used in writing", passed: round.requiredKeywords.glossary.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Bring the glossary term into the actual response." },
    { id: "control", label: "Enough detail for marks", passed: wordCount >= 24, detail: "Very short answers usually miss the explanation needed for marks." }
  ];

  const passedCount = checks.filter(check => check.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);
  const strengths = checks.filter(check => check.passed).slice(0, 4).map(check => check.label);
  const nextSteps = checks.filter(check => !check.passed).slice(0, 4).map(check => check.detail);
  let band = "Needs work";
  if (scorePercent >= 85) band = "Strong";
  else if (scorePercent >= 60) band = "Developing";

  return { checks, scorePercent, band, strengths, nextSteps, wordCount };
}

function renderBossSamples(round) {
  if (!round?.sampleResponses?.length) return "";
  return `
    <div class="sample-review">
      <h3>Student sample comparison</h3>
      <p class="small-copy">Compare your answer with different quality samples. Look for what each sample includes or leaves out.</p>
      <div class="sample-grid">
        ${round.sampleResponses.map(sample => `
          <article class="sample-card ${sample.band.toLowerCase().replace(/\s+/g, "-")}">
            <div class="sample-meta">
              <strong>${escapeHtml(sample.label)}</strong>
              <span>${escapeHtml(sample.band)}</span>
            </div>
            <p>${escapeHtml(sample.response)}</p>
            <p class="sample-commentary">${escapeHtml(sample.commentary)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

async function submitDecoder() {
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const correctCount = [
    state.answers["decoder-verb"] === round.correctVerb,
    state.answers["decoder-topic"] === round.correctTopic,
    state.answers["decoder-context"] === round.correctContext,
    state.answers["decoder-structure"] === round.correctStructure
  ].filter(Boolean).length;
  const scoreRatio = correctCount / 4;
  awardStage("decoder", { scoreRatio });
  addEvidence("Decoded EST question", `${round.question} • Verb: ${state.answers["decoder-verb"] || "not chosen"} • Topic: ${state.answers["decoder-topic"] || "not chosen"} • Context: ${state.answers["decoder-context"] || "not chosen"} • Structure: ${state.answers["decoder-structure"] || "not chosen"}`);
  await saveProgress("decoder-drill", "decoder-breakdown", `Question: ${round.question}\nVerb: ${state.answers["decoder-verb"] || "not chosen"}\nTopic: ${state.answers["decoder-topic"] || "not chosen"}\nContext: ${state.answers["decoder-context"] || "not chosen"}\nStructure: ${state.answers["decoder-structure"] || "not chosen"}`, Math.round(scoreRatio * 100), {
    taskName: "VTCS Decoder",
    durationSeconds,
    promptText: round.question,
    extraPayload: {
      forensic_brief: {
        verb: state.answers["decoder-verb"] || "",
        topic: state.answers["decoder-topic"] || "",
        context: state.answers["decoder-context"] || "",
        structure: state.answers["decoder-structure"] || ""
      }
    }
  });
  showFeedbackBox(scoreRatio >= 0.75 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Decoder results:</strong> ${correctCount}/4 parts correct.`,
    `Best reading: <strong>${round.correctVerb}</strong> the issue of <strong>${round.correctTopic}</strong> in the context of <strong>${round.correctContext}</strong> using <strong>${round.correctStructure}</strong>.`,
    "You banked marks and readiness by reading the question properly before writing."
  ]);
}

async function submitBoss() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const textarea = document.getElementById("boss-response");
  const existingResponse = textarea ? textarea.value.trim() : "";
  if (!existingResponse) buildBossDraft();
  const response = textarea ? textarea.value.trim() : (state.answers.bossText || "");
  state.answers.bossText = response;
  const review = bossCriterionReview(round, response);
  state.lastBossReview = review;
  const scoreRatio = review.scorePercent / 100;
  awardStage("boss", { scoreRatio });
  addEvidence("Boss round EST answer", `${round.question} • ${response || "No boss-round answer entered"}`);
  await saveProgress(
    "boss-round",
    "est-response",
    `Prompt: ${round.question}\nScore: ${review.scorePercent}%\nBand: ${review.band}\nResponse: ${response || "No response entered"}`,
    review.scorePercent,
    {
      taskName: "Boss Round",
      durationSeconds,
      promptText: round.question,
      extraPayload: {
        showdown_choice: state.answers.bossShowdown || "",
        showdown_reason: state.answers.bossShowdownReason || "",
        scaffold_parts: getBossScaffoldLines(round).map((line, index) => ({
          label: line,
          response: state.answers[`boss-scaffold-${index}`] || ""
        }))
      }
    }
  );

  const strengths = review.strengths.length
    ? `<ul class="feedback-list">${review.strengths.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No strong elements were detected yet.</p>";
  const nextSteps = review.nextSteps.length
    ? `<ul class="feedback-list">${review.nextSteps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No immediate fixes needed. Push for even tighter wording.</p>";
  const rubric = `
    <div class="rubric-grid">
      ${review.checks.map(check => `
        <div class="rubric-chip ${check.passed ? "pass" : "fail"}">
          <strong>${escapeHtml(check.label)}</strong>
          <span>${check.passed ? "Met" : "Missing"}</span>
        </div>
      `).join("")}
    </div>
  `;

  showFeedbackBox(review.scorePercent >= 85 ? "good" : review.scorePercent >= 60 ? "warn" : "bad", [
    `<strong>Boss round complete:</strong> ${review.scorePercent}% • ${review.band} band.`,
    `Word count: ${review.wordCount}. This boss round checked decoding, glossary control, answer structure, explanation, and result language.`,
    `Marker model: ${escapeHtml(round.strongAnswer)}`
  ], `
    <div class="sample-review">
      <h3>Your strengths</h3>
      ${strengths}
      <h3>Next steps</h3>
      ${nextSteps}
      <h3>Rubric snapshot</h3>
      ${rubric}
    </div>
    ${renderBossSamples(round)}
  `);
}
