(function attachCareerEmpireResponseModeration(windowObj) {
  const REVIEWABLE_EVIDENCE_TYPES = new Set([
    "est-response",
    "revision-topic-check",
    "justification"
  ]);

  const PROFANITY_WORDS = [
    "arsehole",
    "asshole",
    "bastard",
    "bitch",
    "bullshit",
    "cunt",
    "dickhead",
    "fuck",
    "fucking",
    "shit"
  ];

  function normaliseText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getWordCount(value) {
    return normaliseText(value).split(/\s+/).filter(Boolean).length;
  }

  function addFlag(flags, notes, key, note) {
    if (!flags.includes(key)) flags.push(key);
    if (note && !notes.includes(note)) notes.push(note);
  }

  function getNameParts(student = {}) {
    const raw = [
      student.displayName,
      student.display_name,
      student.playerName,
      student.username
    ].filter(Boolean).join(" ");

    return raw
      .replace(/[^A-Za-z\s]/g, " ")
      .split(/\s+/)
      .map(part => part.trim())
      .filter(part => part.length >= 3);
  }

  function flagResponseText(text, context = {}) {
    const value = String(text || "");
    const lowerValue = value.toLowerCase();
    const flags = [];
    const notes = [];

    if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value)) {
      addFlag(flags, notes, "possible_email", "Looks like it may contain an email address.");
    }

    if (/(?:\+?61|0)[\s-]?(?:\d[\s-]?){8,}/.test(value)) {
      addFlag(flags, notes, "possible_phone", "Looks like it may contain a phone number.");
    }

    if (/\b(?:https?:\/\/|www\.)\S+/i.test(value)) {
      addFlag(flags, notes, "possible_url", "Looks like it may contain a web link.");
    }

    if (/(^|\s)@[A-Za-z0-9_]{3,}\b/.test(value)) {
      addFlag(flags, notes, "possible_handle", "Looks like it may contain a social media handle.");
    }

    PROFANITY_WORDS.forEach(word => {
      const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(value)) {
        addFlag(flags, notes, "possible_profanity", "Contains language that should be checked before sharing.");
      }
    });

    getNameParts(context.student).forEach(part => {
      const pattern = new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(value)) {
        addFlag(flags, notes, "possible_student_name", "May include the student's name or username.");
      }
    });

    if (getWordCount(value) < 8) {
      addFlag(flags, notes, "too_short", "Very short response; may not be useful as a comparison example.");
    }

    if (lowerValue.includes("my school") || lowerValue.includes("my teacher") || lowerValue.includes("my class")) {
      addFlag(flags, notes, "possible_context_identifier", "May include identifying school, teacher, or class context.");
    }

    return {
      flags,
      flagNotes: notes.join(" ")
    };
  }

  function isReviewableEvidence(evidenceType, responseText) {
    if (!REVIEWABLE_EVIDENCE_TYPES.has(String(evidenceType || ""))) return false;
    return getWordCount(responseText) >= 8;
  }

  async function queuePendingReview(supabase, options = {}) {
    const responseText = normaliseText(options.responseText);
    if (!supabase || !options.studentId || !options.classId || !options.schoolId) return null;
    if (!isReviewableEvidence(options.evidenceType, responseText)) return null;

    const flagged = flagResponseText(responseText, {
      student: options.student
    });

    const row = {
      source_evidence_id: options.sourceEvidenceId || null,
      student_id: options.studentId,
      class_id: options.classId,
      school_id: options.schoolId,
      module_id: options.moduleId,
      evidence_type: options.evidenceType,
      task_key: options.taskKey || options.promptText || options.evidenceType,
      task_label: options.taskLabel || options.evidenceType || "Written response",
      prompt_text: options.promptText || "Saved written response",
      raw_response_text: responseText,
      approved_response_text: null,
      status: "pending_review",
      flags: flagged.flags,
      flag_notes: flagged.flagNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("student_response_reviews")
      .upsert(row, { onConflict: "source_evidence_id" })
      .select("id")
      .maybeSingle();

    if (error) {
      console.warn("Student response review could not be queued:", error.message || error);
      return null;
    }

    return data;
  }

  windowObj.CareerEmpireResponseModeration = {
    flagResponseText,
    isReviewableEvidence,
    queuePendingReview
  };
})(window);
