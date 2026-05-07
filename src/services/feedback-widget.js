(function attachCareerEmpireFeedback(windowObj, documentObj) {
  const FEEDBACK_FALLBACK_KEY = "career-empire-feedback-fallback";
  const AUTH_STATE_KEY = "career-empire-auth-demo";
  const PLAYER_SESSION_KEY = "career-empire-session";
  const TEACHER_SESSION_KEY = "career-empire-teacher-session";
  const TEACHER_FILTER_KEY = "career-empire-teacher-dashboard-filter";

  function readJsonStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  async function getSupabaseClientOrNull() {
    if (!windowObj.CareerEmpireSupabase || typeof windowObj.CareerEmpireSupabase.getClient !== "function") {
      return null;
    }
    try {
      return await windowObj.CareerEmpireSupabase.getClient();
    } catch (_) {
      return null;
    }
  }

  function inferIdentity() {
    const authState = readJsonStorage("career-empire-auth-demo", {});
    const playerSession = readJsonStorage("career-empire-session", null);
    const teacherSession = readJsonStorage("career-empire-teacher-session", null);

    if (authState?.teacherLogin?.email) {
      return { actorRole: "teacher", loginName: authState.teacherLogin.email };
    }
    if (authState?.studentLogin?.username) {
      return { actorRole: "student", loginName: authState.studentLogin.username };
    }
    if (playerSession?.playerName) {
      return { actorRole: "player", loginName: playerSession.playerName };
    }
    if (teacherSession?.classCode) {
      return { actorRole: "teacher", loginName: teacherSession.classCode };
    }
    return { actorRole: "anonymous", loginName: "unknown" };
  }

  function ensureStyles() {
    if (documentObj.getElementById("career-empire-feedback-styles")) return;
    const style = documentObj.createElement("style");
    style.id = "career-empire-feedback-styles";
    style.textContent = `
      .ce-feedback-launcher {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 9998;
        padding: 12px 16px;
        border-radius: 999px;
        border: 1px solid rgba(107, 210, 255, 0.28);
        background: linear-gradient(145deg, rgba(17, 34, 58, 0.96), rgba(22, 46, 78, 0.96));
        color: #e9f1ff;
        font: 600 14px "Outfit", "Segoe UI", sans-serif;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
        cursor: pointer;
      }
      .ce-feedback-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(3, 8, 18, 0.72);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      }
      .ce-feedback-backdrop.open {
        display: flex;
      }
      .ce-feedback-card {
        width: min(100%, 560px);
        background: linear-gradient(145deg, rgba(10, 22, 38, 0.98), rgba(18, 36, 61, 0.98));
        border: 1px solid rgba(126, 168, 255, 0.24);
        border-radius: 24px;
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
        padding: 22px;
        color: #e9f1ff;
        font-family: "Outfit", "Segoe UI", sans-serif;
      }
      .ce-feedback-card h3, .ce-feedback-card p {
        margin-top: 0;
      }
      .ce-feedback-grid {
        display: grid;
        gap: 14px;
      }
      .ce-feedback-card label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .ce-feedback-card select,
      .ce-feedback-card textarea,
      .ce-feedback-card input {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(126, 168, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: #e9f1ff;
        padding: 12px 14px;
        font: inherit;
        box-sizing: border-box;
      }
      .ce-feedback-card textarea {
        min-height: 140px;
        resize: vertical;
      }
      .ce-feedback-actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        flex-wrap: wrap;
      }
      .ce-feedback-actions button {
        border: 0;
        border-radius: 14px;
        padding: 12px 16px;
        font: 700 14px "Outfit", "Segoe UI", sans-serif;
        cursor: pointer;
      }
      .ce-feedback-primary {
        background: linear-gradient(145deg, #1f8ef1, #1667d8);
        color: white;
      }
      .ce-feedback-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #e9f1ff;
        border: 1px solid rgba(126, 168, 255, 0.2);
      }
      .ce-feedback-status {
        margin-top: 10px;
        font-size: 13px;
      }
    `;
    documentObj.head.appendChild(style);
  }

  function persistAuthState(nextState) {
    const cleaned = Object.fromEntries(
      Object.entries(nextState || {}).filter(([, value]) => value !== undefined && value !== null)
    );
    if (Object.keys(cleaned).length) {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(cleaned));
    } else {
      localStorage.removeItem(AUTH_STATE_KEY);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAppRootPrefix() {
    const path = windowObj.location.pathname;
    if (path.includes("/modules/")) return "../../";
    if (path.includes("/auth/") || path.includes("/dashboards/") || path.includes("/shop/")) return "../";
    return "./";
  }

  function getAppPath(pathFromRoot) {
    return `${getAppRootPrefix()}${pathFromRoot}`;
  }

  function getStudentIdentity(state, session) {
    const login = state?.studentLogin || {};
    const hasStudent = login.id || login.username || login.displayName || session?.studentId || session?.username || session?.playerName;
    if (!hasStudent) return null;

    const isDemo = Boolean(login.demo || session?.demoMode);
    const isPreview = Boolean(login.preview && !isDemo);
    return {
      role: "student",
      stamp: isDemo
        ? "Demo Student"
        : login.username || session?.username || login.displayName || session?.playerName || "Student",
      title: isDemo
        ? "Demo student preview"
        : isPreview
          ? "Teacher test-student preview"
          : login.displayName && login.username && login.displayName !== login.username
            ? login.displayName
            : "Student login",
      mode: isDemo ? "Demo" : isPreview ? "Preview" : "Student"
    };
  }

  function getTeacherIdentity(state) {
    const teacher = state?.teacher || {};
    const teacherLogin = state?.teacherLogin || {};
    const email = teacherLogin.email || teacher.email || "";
    const display = email || teacher.fullName || teacherLogin.fullName || "";
    if (!display) return null;

    return {
      role: "teacher",
      stamp: display,
      title: teacher.fullName && email ? teacher.fullName : "Teacher login",
      mode: "Teacher"
    };
  }

  function getContainerButtonClass(container) {
    if (container.classList.contains("workflow-links")) return "workflow-link";
    if (container.classList.contains("module-nav")) return "module-nav-link";
    if (container.classList.contains("top-links")) return "ghost-link";
    return "dashboard-nav-link";
  }

  function getPageSessionScope() {
    const path = windowObj.location.pathname;
    if (
      documentObj.body?.dataset?.teacherNavActive ||
      path.includes("/dashboards/teacher.html") ||
      path.includes("/auth/teacher-") ||
      path.includes("/auth/create-class") ||
      path.includes("/auth/add-students") ||
      path.includes("/auth/manage-students")
    ) {
      return "teacher";
    }
    if (path.includes("/auth/index.html")) return "mixed";
    return "student";
  }

  function ensureSessionBannerStyles() {
    if (documentObj.getElementById("career-empire-session-banner-style")) return;
    const style = documentObj.createElement("style");
    style.id = "career-empire-session-banner-style";
    style.textContent = `
      .session-banner-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        margin-left: auto;
        min-width: min(100%, 250px);
      }
      .session-stamp {
        min-width: 0;
        max-width: 100%;
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 11px;
        border-radius: 8px;
        border: 1px solid rgba(128, 237, 153, 0.32);
        color: inherit;
        background: rgba(128, 237, 153, 0.1);
        line-height: 1;
      }
      .session-stamp-label {
        color: rgba(199, 216, 247, 0.82);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .session-stamp strong {
        display: block;
        max-width: 220px;
        overflow: hidden;
        color: inherit;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.15;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .session-stamp small {
        display: block;
        margin-top: 3px;
        color: rgba(199, 216, 247, 0.76);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.15;
      }
      .session-logout-button {
        appearance: none;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        border-radius: 8px;
      }
      .session-logout-button[disabled] {
        cursor: wait;
        opacity: 0.68;
      }
      @media (max-width: 680px) {
        .session-banner-actions {
          width: 100%;
          justify-content: flex-start;
          margin-left: 0;
        }
        .session-stamp strong {
          max-width: 170px;
        }
      }
    `;
    documentObj.head.appendChild(style);
  }

  function createSessionStamp(identity) {
    const stamp = documentObj.createElement("span");
    stamp.className = "session-stamp";
    stamp.title = `${identity.mode}: ${identity.title}`;
    stamp.innerHTML = `
      <span class="session-stamp-label">${escapeHtml(identity.mode)}</span>
      <span>
        <strong>${escapeHtml(identity.stamp)}</strong>
        <small>${escapeHtml(identity.title)}</small>
      </span>
    `;
    return stamp;
  }

  function createLogoutButton(identity, buttonClass) {
    const button = documentObj.createElement("button");
    button.type = "button";
    button.className = `${buttonClass} session-logout-button`;
    button.dataset.sessionLogoutRole = identity.role;
    button.textContent = identity.role === "teacher" ? "Teacher Logout" : "Student Logout";
    return button;
  }

  function renderSessionBanner() {
    ensureSessionBannerStyles();
    documentObj.querySelectorAll("[data-session-banner-actions='true']").forEach(element => element.remove());

    const state = readJsonStorage(AUTH_STATE_KEY, {});
    const session = readJsonStorage(PLAYER_SESSION_KEY, {});
    const studentIdentity = getStudentIdentity(state, session);
    const teacherIdentity = getTeacherIdentity(state);
    const scope = getPageSessionScope();
    const identities = scope === "teacher"
      ? [teacherIdentity || studentIdentity].filter(Boolean)
      : scope === "student"
        ? [studentIdentity || teacherIdentity].filter(Boolean)
        : [studentIdentity, teacherIdentity].filter(Boolean);

    if (!identities.length) return;

    const primaryContainers = Array.from(documentObj.querySelectorAll(".dashboard-nav, .workflow-links, .module-nav"));
    const fallbackContainers = primaryContainers.length ? [] : Array.from(documentObj.querySelectorAll(".top-links"));
    [...primaryContainers, ...fallbackContainers].forEach(container => {
      const buttonClass = getContainerButtonClass(container);
      const group = documentObj.createElement("div");
      group.className = "session-banner-actions";
      group.dataset.sessionBannerActions = "true";
      identities.forEach(identity => {
        group.appendChild(createSessionStamp(identity));
        group.appendChild(createLogoutButton(identity, buttonClass));
      });
      container.appendChild(group);
    });
  }

  async function signOutTeacherIfPossible() {
    const supabase = await getSupabaseClientOrNull();
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut();
    }
  }

  function clearStudentSession() {
    const state = readJsonStorage(AUTH_STATE_KEY, {});
    delete state.studentLogin;
    persistAuthState(state);
    localStorage.removeItem(PLAYER_SESSION_KEY);
    sessionStorage.removeItem("student-login-error");
  }

  async function clearTeacherSession() {
    try {
      await signOutTeacherIfPossible();
    } catch (error) {
      console.error("Teacher Supabase sign-out failed:", error);
    }
    const state = readJsonStorage(AUTH_STATE_KEY, {});
    delete state.teacherLogin;
    delete state.teacher;
    delete state.classroom;
    if (state.studentLogin?.preview) {
      delete state.studentLogin;
      localStorage.removeItem(PLAYER_SESSION_KEY);
    }
    persistAuthState(state);
    localStorage.removeItem(TEACHER_SESSION_KEY);
    localStorage.removeItem(TEACHER_FILTER_KEY);
  }

  async function handleSessionLogout(role, button) {
    if (button) {
      button.disabled = true;
      button.textContent = "Logging out...";
    }

    if (role === "teacher") {
      await clearTeacherSession();
      windowObj.location.href = getAppPath("auth/teacher-login.html");
      return;
    }

    clearStudentSession();
    windowObj.location.href = getAppPath("auth/student-login.html");
  }

  function initSessionBannerFallback() {
    if (windowObj.CareerEmpireSessionBanner?.render) {
      windowObj.CareerEmpireSessionBanner.render();
      return;
    }

    windowObj.CareerEmpireSessionBanner = {
      render: renderSessionBanner,
      clearStudentSession,
      clearTeacherSession
    };

    documentObj.addEventListener("click", event => {
      const button = event.target.closest("[data-session-logout-role]");
      if (!button) return;
      event.preventDefault();
      handleSessionLogout(button.dataset.sessionLogoutRole, button).catch(error => {
        console.error("Logout failed:", error);
        button.disabled = false;
        button.textContent = button.dataset.sessionLogoutRole === "teacher" ? "Teacher Logout" : "Student Logout";
      });
    });

    renderSessionBanner();
  }

  function createModal() {
    const backdrop = documentObj.createElement("div");
    backdrop.className = "ce-feedback-backdrop";
    backdrop.innerHTML = `
      <div class="ce-feedback-card" role="dialog" aria-modal="true" aria-labelledby="ce-feedback-title">
        <h3 id="ce-feedback-title">Report a bug or suggest an improvement</h3>
        <p>Your login name and the page you were on will be saved with this feedback so it can be followed up later.</p>
        <div class="ce-feedback-grid">
          <div>
            <label for="ce-feedback-type">Feedback type</label>
            <select id="ce-feedback-type">
              <option value="bug">Bug report</option>
              <option value="suggestion">Suggestion</option>
              <option value="question">Question</option>
            </select>
          </div>
          <div>
            <label for="ce-feedback-login">Login name</label>
            <input id="ce-feedback-login" type="text" readonly>
          </div>
          <div>
            <label for="ce-feedback-message">What would you like to report?</label>
            <textarea id="ce-feedback-message" placeholder="Describe the bug, issue, or idea here..."></textarea>
          </div>
        </div>
        <div class="ce-feedback-actions">
          <button type="button" class="ce-feedback-primary" id="ce-feedback-submit">Send feedback</button>
          <button type="button" class="ce-feedback-secondary" id="ce-feedback-cancel">Cancel</button>
        </div>
        <div class="ce-feedback-status" id="ce-feedback-status"></div>
      </div>
    `;
    documentObj.body.appendChild(backdrop);
    return backdrop;
  }

  async function submitFeedback(payload) {
    const supabase = await getSupabaseClientOrNull();
    if (supabase) {
      const { error } = await supabase.from("feedback_reports").insert(payload);
      if (error) throw error;
      return;
    }

    const existing = readJsonStorage(FEEDBACK_FALLBACK_KEY, []);
    existing.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...payload });
    localStorage.setItem(FEEDBACK_FALLBACK_KEY, JSON.stringify(existing));
  }

  function init() {
    ensureStyles();
    initSessionBannerFallback();
    const launcher = documentObj.createElement("button");
    launcher.className = "ce-feedback-launcher";
    launcher.type = "button";
    launcher.textContent = "Feedback";
    documentObj.body.appendChild(launcher);

    const modal = createModal();
    const typeInput = modal.querySelector("#ce-feedback-type");
    const loginInput = modal.querySelector("#ce-feedback-login");
    const messageInput = modal.querySelector("#ce-feedback-message");
    const statusEl = modal.querySelector("#ce-feedback-status");
    const submitButton = modal.querySelector("#ce-feedback-submit");
    const cancelButton = modal.querySelector("#ce-feedback-cancel");

    function openModal() {
      const identity = inferIdentity();
      loginInput.value = identity.loginName;
      messageInput.value = "";
      statusEl.textContent = "";
      modal.classList.add("open");
    }

    function closeModal() {
      modal.classList.remove("open");
    }

    launcher.addEventListener("click", openModal);
    cancelButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    submitButton.addEventListener("click", async () => {
      const identity = inferIdentity();
      const message = messageInput.value.trim();
      if (!message) {
        statusEl.textContent = "Please enter some feedback before sending.";
        return;
      }

      statusEl.textContent = "Sending...";
      try {
        await submitFeedback({
          page_path: windowObj.location.pathname,
          actor_role: identity.actorRole,
          login_name: identity.loginName,
          feedback_type: typeInput.value,
          message
        });
        statusEl.textContent = "Thank you. Your feedback has been saved.";
        setTimeout(closeModal, 700);
      } catch (error) {
        statusEl.textContent = error.message || "Feedback could not be saved.";
      }
    });
  }

  if (documentObj.readyState === "loading") {
    documentObj.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
