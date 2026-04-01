const ALLOWED_TEACHER_DOMAINS = ["cewa.edu.au", "education.wa.edu.au"];
const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";

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

function readState() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_DEMO_STATE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function writeState(patch) {
  const next = { ...readState(), ...patch };
  localStorage.setItem(AUTH_DEMO_STATE_KEY, JSON.stringify(next));
  return next;
}

function syncStudentPlayerSession(student) {
  if (!student?.id) return;
  let existing = {};
  try {
    existing = JSON.parse(localStorage.getItem(PLAYER_SESSION_KEY) || "{}");
  } catch (_) {
    existing = {};
  }
  const sameStudent = existing.studentId === student.id;
  const next = sameStudent ? { ...existing } : {};
  next.studentId = student.id;
  next.username = student.username || "";
  next.playerName = student.display_name || student.username || "Student";
  next.schoolName = student.schools?.name || "";
  next.classId = student.class_id || null;
  next.classCode = student.classes?.class_code || "";
  next.className = student.classes?.name || "";
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
}

function redirectAfterDelay(path, delayMs = 900) {
  window.setTimeout(() => {
    window.location.href = path;
  }, delayMs);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setHtml(id, value) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = value;
}

function isAllowedTeacherEmail(email) {
  const lower = String(email || "").trim().toLowerCase();
  return ALLOWED_TEACHER_DOMAINS.some(domain => lower.endsWith(`@${domain}`));
}

function isValidStudentUsername(username) {
  return /^[A-Za-z][A-Za-z0-9]{1,23}$/.test(String(username || "").trim());
}

function extractEmailDomain(email) {
  return String(email || "").trim().toLowerCase().split("@")[1] || "";
}

function generateClassCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateStudentPassword() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateStudentUsernameSuggestions(displayName) {
  const cleaned = String(displayName || "").replace(/[^A-Za-z\s]/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = (parts[0] || "").slice(0, 12);
  const second = (parts[1] || "").slice(0, 4);
  const suggestions = new Set();
  if (!first) return [];

  suggestions.add(first);
  if (second) {
    suggestions.add(`${first}${second.slice(0, 1)}`);
    suggestions.add(`${first}${second.slice(0, 2)}`);
    suggestions.add(`${first}${second.slice(0, 2)}1`);
    suggestions.add(`${first}${second.slice(0, 3)}`);
  } else {
    suggestions.add(`${first}1`);
    suggestions.add(`${first}2`);
  }

  return [...suggestions]
    .map(item => item.replace(/[^A-Za-z0-9]/g, "").slice(0, 24))
    .filter(item => item.length >= 2)
    .filter(isValidStudentUsername)
    .slice(0, 4);
}

async function hashValue(value) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureSchoolRecord(supabase, schoolName) {
  const normalizedName = schoolName.trim();
  const { data: existingSchool, error: existingError } = await supabase
    .from("schools")
    .select("id, name")
    .eq("name", normalizedName)
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existingSchool) {
    throw new Error("Selected school was not found in the approved schools table. Please choose a school from the search results.");
  }
  return existingSchool;
}

async function loadSchoolOptions() {
  const targets = [
    {
      input: document.getElementById("teacher-school"),
      results: document.getElementById("teacher-school-results"),
      feedback: document.getElementById("teacher-school-feedback")
    },
    {
      input: document.getElementById("teacher-login-school"),
      results: document.getElementById("teacher-login-school-results"),
      feedback: document.getElementById("teacher-login-school-feedback")
    }
  ].filter(target => target.input && target.results);
  if (!targets.length) return;
  const supabase = await getSupabaseClientOrNull();
  let schoolNames = [];

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw error;
      schoolNames = (data || []).map(school => school.name);
    }
  } catch (error) {
    console.error("Failed to load schools from Supabase:", error);
  }

  if (!schoolNames.length) {
    schoolNames = Array.isArray(window.CAREER_EMPIRE_SCHOOLS) ? window.CAREER_EMPIRE_SCHOOLS : [];
  }

  try {
    if (!schoolNames.length) {
      throw new Error("No school list is available.");
    }

    function closeResults(results) {
      results.classList.remove("open");
      results.innerHTML = "";
    }

    function renderResults(results, input, feedback, matches) {
      if (!matches.length) {
        closeResults(results);
        return;
      }

      results.innerHTML = matches
        .slice(0, 12)
        .map(name => `<button type="button" class="search-option" data-school="${name}">${name}</button>`)
        .join("");
      results.classList.add("open");

      results.querySelectorAll(".search-option").forEach(button => {
        button.addEventListener("click", () => {
          input.value = button.dataset.school || "";
          closeResults(results);
          if (feedback) {
            feedback.className = "feedback good";
            feedback.textContent = "Approved school selected.";
          }
        });
      });
    }

    targets.forEach(({ input, results, feedback }) => {
      input.dataset.validSchools = JSON.stringify(schoolNames);
      if (feedback) {
        feedback.className = "feedback good";
        feedback.textContent = `${schoolNames.length} approved schools loaded.`;
      }

      input.addEventListener("input", () => {
        const validSchools = JSON.parse(input.dataset.validSchools || "[]");
        const query = input.value.trim().toLowerCase();
        if (!input.value.trim()) {
          if (feedback) {
            feedback.className = "feedback";
            feedback.textContent = `${validSchools.length} approved schools loaded.`;
          }
          closeResults(results);
          return;
        }

        const exactMatch = validSchools.includes(input.value.trim());
        const matches = validSchools.filter(name => name.toLowerCase().includes(query));
        renderResults(results, input, feedback, matches);

        if (feedback) {
          if (exactMatch) {
            feedback.className = "feedback good";
            feedback.textContent = "Approved school selected.";
          } else {
            feedback.className = "feedback warn";
            feedback.textContent = matches.length
              ? "Choose a school from the matching results below."
              : "No approved school matched that search yet.";
          }
        }
      });

      input.addEventListener("focus", () => {
        const validSchools = JSON.parse(input.dataset.validSchools || "[]");
        const query = input.value.trim().toLowerCase();
        if (!query) return;
        renderResults(results, input, feedback, validSchools.filter(name => name.toLowerCase().includes(query)));
      });

      document.addEventListener("click", (event) => {
        if (!results.contains(event.target) && event.target !== input) {
          closeResults(results);
        }
      });
    });
  } catch (error) {
    console.error("Failed to initialize school picker:", error);
    if (feedback) {
      feedback.className = "feedback bad";
      feedback.textContent = "The approved school list could not be loaded.";
    }
  }
}

async function ensureTeacherProfile(supabase, teacherPayload) {
  const { data: existingTeacher, error: existingError } = await supabase
    .from("teachers")
    .select("id, full_name, email, school_id")
    .eq("email", teacherPayload.email)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingTeacher) return existingTeacher;

  const { data: insertedTeacher, error: insertError } = await supabase
    .from("teachers")
    .insert(teacherPayload)
    .select("id, full_name, email, school_id")
    .single();

  if (insertError) throw insertError;
  return insertedTeacher;
}

async function ensureTeacherProfileFromState(supabase, email, fallback = {}) {
  const state = readState();
  const storedTeacher = state.teacher || {};
  const schoolName = storedTeacher.schoolName || fallback.schoolName || "";
  if (!schoolName) {
    throw new Error("Teacher profile not found and no stored school name is available to recreate it.");
  }

  const school = await ensureSchoolRecord(supabase, schoolName);
  return ensureTeacherProfile(supabase, {
    full_name: storedTeacher.fullName || fallback.fullName || email,
    email,
    email_domain: extractEmailDomain(email),
    password_hash: "__supabase_auth__",
    school_id: school.id
  });
}

async function getTeacherProfileByEmail(supabase, email) {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, full_name, email, school_id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function findStudentProfilesByUsername(supabase, username) {
  const normalized = String(username || "").trim();
  const { data, error } = await supabase
    .from("students")
    .select("id, display_name, username, password_hash, school_id, class_id, created_by_teacher_id, is_active, classes(class_code, name), schools(name)")
    .ilike("username", normalized)
    .limit(2);

  if (error) throw error;
  return data || [];
}

async function getStudentProfileByUsername(supabase, username) {
  const matches = await findStudentProfilesByUsername(supabase, username);
  if (matches.length > 1) {
    throw new Error("Duplicate username detected. Please ask your teacher to assign a unique username.");
  }
  return matches[0] || null;
}

async function requireLoggedInTeacher(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data?.user;
  if (!user?.email) {
    throw new Error("No logged-in teacher session found. Log in as a teacher first.");
  }
  let teacher = await getTeacherProfileByEmail(supabase, user.email);
  if (!teacher) {
    teacher = await ensureTeacherProfileFromState(supabase, user.email);
  }
  if (!teacher) {
    throw new Error("Teacher profile not found in the database.");
  }
  return { user, teacher };
}

async function ensurePlayerProfile(supabase, studentId) {
  const { data: existingProfile, error: existingError } = await supabase
    .from("player_profiles")
    .select("student_id")
    .eq("student_id", studentId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingProfile) return existingProfile;

  const { data: insertedProfile, error: insertError } = await supabase
    .from("player_profiles")
    .insert({
      student_id: studentId,
      career_title: "Intern",
      annual_salary: 25000,
      cumulative_net_worth: 0,
      savings: 0,
      tax_paid: 0,
      career_level: 1,
      career_success: 0,
      job_security: 75,
      work_life_balance: 60,
      wellbeing: 60,
      social_status: 50,
      resilience: 50
    })
    .select("student_id")
    .single();

  if (insertError) throw insertError;
  return insertedProfile;
}

function initTeacherSignup() {
  const emailInput = document.getElementById("teacher-email");
  const feedback = document.getElementById("teacher-email-feedback");
  const help = document.getElementById("teacher-email-help");
  const form = document.getElementById("teacher-signup-form");
  if (!emailInput || !form) return;

  emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();
    if (!email) {
      feedback.className = "feedback";
      feedback.textContent = "";
      if (help) {
        help.className = "helper";
        help.innerHTML = "Use a staff email ending in `@cewa.edu.au` or `@education.wa.edu.au`.";
      }
      return;
    }
    if (isAllowedTeacherEmail(email)) {
      feedback.className = "feedback good";
      feedback.textContent = "Approved school domain. This teacher account would be allowed.";
      if (help) {
        help.className = "helper";
        help.innerHTML = "Use a staff email ending in `@cewa.edu.au` or `@education.wa.edu.au`.";
      }
    } else {
      feedback.className = "feedback bad";
      feedback.textContent = "Only staff emails ending in cewa.edu.au or education.wa.edu.au are allowed.";
      if (help) {
        help.className = "feedback warn";
        help.innerHTML = "If you're a teacher and your email address doesn't end in `@cewa.edu.au` or `@education.wa.edu.au`, please email <a href=\"mailto:tania.byrnes@cewa.edu.au\" style=\"color: inherit; font-weight: 700;\">tania.byrnes@cewa.edu.au</a> to add your email to the list of eligible registrations.";
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("teacher-name").value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const schoolName = document.getElementById("teacher-school").value.trim();
    const password = document.getElementById("teacher-password").value;
    const schoolFeedback = document.getElementById("teacher-school-feedback");
    if (!isAllowedTeacherEmail(email)) {
      feedback.className = "feedback bad";
      feedback.textContent = "Teacher signup blocked. Use an approved school email domain.";
      return;
    }
    const validSchools = JSON.parse(document.getElementById("teacher-school").dataset.validSchools || "[]");
    if (!validSchools.includes(schoolName)) {
      if (schoolFeedback) {
        schoolFeedback.className = "feedback bad";
        schoolFeedback.textContent = "Please choose a school from the approved list.";
      }
      return;
    }
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet. Add your config file before using real signup.";
      return;
    }

    try {
      feedback.className = "feedback warn";
      feedback.textContent = "Creating teacher account...";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            school_name: schoolName
          }
        }
      });

      if (authError) throw authError;

      const school = await ensureSchoolRecord(supabase, schoolName);
      const teacher = await ensureTeacherProfile(supabase, {
        full_name: fullName,
        email,
        email_domain: extractEmailDomain(email),
        password_hash: "__supabase_auth__",
        school_id: school.id
      });

      writeState({
        teacher: {
          id: teacher.id,
          fullName,
          email,
          schoolName
        }
      });

      const needsEmailConfirmation = !authData?.session;
      feedback.className = "feedback good";
      feedback.textContent = needsEmailConfirmation
        ? "Teacher account created. Supabase may require email confirmation before login, depending on your auth settings."
        : "Teacher account created and signed in. Next step: create a class.";
      initAuthContext();
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Teacher signup failed.";
    }
  });
}

function initTeacherLogin() {
  const form = document.getElementById("teacher-login-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("teacher-login-email").value.trim().toLowerCase();
    const password = document.getElementById("teacher-login-password").value;
    const feedback = document.getElementById("teacher-login-feedback");
    if (!isAllowedTeacherEmail(email)) {
      feedback.className = "feedback bad";
      feedback.textContent = "This prototype only allows teacher emails from approved school domains.";
      return;
    }

    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const fallback = {
        fullName: document.getElementById("teacher-login-name")?.value.trim(),
        schoolName: document.getElementById("teacher-login-school")?.value.trim()
      };
      let teacher = await getTeacherProfileByEmail(supabase, email);
      if (!teacher) {
        teacher = await ensureTeacherProfileFromState(supabase, email, fallback);
      }
      writeState({
        teacherLogin: {
          email,
          loggedInAt: new Date().toISOString()
        },
        teacher: teacher ? {
          id: teacher.id,
          fullName: teacher.full_name || fallback.fullName,
          email: teacher.email,
          schoolId: teacher.school_id,
          schoolName: fallback.schoolName || readState().teacher?.schoolName
        } : readState().teacher
      });

      feedback.className = "feedback good";
      const nextPath = readState().classroom?.id ? "./manage-students.html" : "./create-class.html";
      feedback.textContent = `Teacher login accepted for ${email}. Redirecting you to the next teacher step.`;
      initAuthContext();
      redirectAfterDelay(nextPath);
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Teacher login failed.";
    }
  });
}

function initStudentLogin() {
  const usernameInput = document.getElementById("student-username");
  const feedback = document.getElementById("student-username-feedback");
  const form = document.getElementById("student-login-form");
  const hubButton = document.getElementById("open-student-hub");
  if (!usernameInput || !form) return;

  const redirectedError = sessionStorage.getItem("student-login-error");
  if (redirectedError) {
    feedback.className = "feedback bad";
    feedback.textContent = redirectedError;
    sessionStorage.removeItem("student-login-error");
  }

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      feedback.className = "feedback";
      feedback.textContent = "";
      return;
    }
    if (isValidStudentUsername(username)) {
      feedback.className = "feedback good";
      feedback.textContent = "Username format looks good for a student account.";
    } else {
      feedback.className = "feedback warn";
      feedback.textContent = "Use the exact teacher-issued username. Letters and numbers are allowed, but no spaces or email addresses.";
    }
  });

  if (hubButton) {
    hubButton.addEventListener("click", event => {
      const authState = readState();
      if (authState?.studentLogin?.id) return;
      event.preventDefault();
      feedback.className = "feedback bad";
      feedback.textContent = "Please log in successfully before opening the Student Hub.";
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (!isValidStudentUsername(username)) {
      feedback.className = "feedback bad";
      feedback.textContent = "Use the exact teacher-issued username. Letters and numbers are allowed, but no spaces or email addresses.";
      return;
    }
    const password = document.getElementById("student-password").value;
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const student = await getStudentProfileByUsername(supabase, username);
      if (!student) {
        throw new Error("Incorrect username.");
      }
      if (!student.is_active) {
        throw new Error("This student account is inactive.");
      }

      const candidateHash = await hashValue(password);
      if (candidateHash !== student.password_hash) {
        throw new Error("Incorrect password.");
      }

      await ensurePlayerProfile(supabase, student.id);

      const { error: loginStampError } = await supabase
        .from("students")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", student.id);

      if (loginStampError) throw loginStampError;

      writeState({
        studentLogin: {
          id: student.id,
          username: student.username,
          displayName: student.display_name,
          schoolId: student.school_id,
          classId: student.class_id,
          schoolName: student.schools?.name || "",
          classCode: student.classes?.class_code || "",
          className: student.classes?.name || "",
          createdByTeacherId: student.created_by_teacher_id,
          loggedInAt: new Date().toISOString()
        },
        classroom: student.class_id ? {
          id: student.class_id,
          classCode: student.classes?.class_code || "",
          name: student.classes?.name || ""
        } : null
      });

      syncStudentPlayerSession(student);

      feedback.className = "feedback good";
      feedback.textContent = `Welcome, ${student.display_name}. Redirecting you to your student hub.`;
      redirectAfterDelay("../dashboards/student.html");
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Student login failed.";
    }
  });
}

function initCreateClass() {
  const form = document.getElementById("create-class-form");
  if (!form) return;
  const codeOutput = document.getElementById("generated-class-code");
  const feedback = document.getElementById("create-class-feedback");
  const existing = readState();
  if (existing.classroom?.classCode) {
    codeOutput.textContent = existing.classroom.classCode;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const className = document.getElementById("class-name").value.trim();
    const yearLevel = document.getElementById("year-level").value.trim();
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { teacher } = await requireLoggedInTeacher(supabase);
      const classCode = generateClassCode();
      const { data, error } = await supabase
        .from("classes")
        .insert({
          teacher_id: teacher.id,
          school_id: teacher.school_id,
          name: className,
          year_level: yearLevel,
          class_code: classCode
        })
        .select("id, name, year_level, class_code")
        .single();

      if (error) throw error;

      writeState({
        classroom: {
          id: data.id,
          className: data.name,
          yearLevel: data.year_level,
          classCode: data.class_code,
          createdAt: new Date().toISOString()
        }
      });
      codeOutput.textContent = classCode;
      feedback.className = "feedback good";
      feedback.textContent = `Class "${className}" created for Year ${yearLevel}. Share code ${classCode} with students only if needed.`;
      initAuthContext();
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Class creation failed.";
    }
  });
}

function initAddStudents() {
  const form = document.getElementById("add-student-form");
  const displayNameInput = document.getElementById("new-student-display-name");
  const usernameInput = document.getElementById("new-student-username");
  const feedback = document.getElementById("new-student-feedback");
  const suggestionBox = document.getElementById("new-student-username-suggestions");
  const list = document.getElementById("generated-students");
  const generatedCredentials = document.getElementById("generated-student-credentials");
  if (!form || !displayNameInput || !usernameInput || !list) return;

  const render = async () => {
    const supabase = await getSupabaseClientOrNull();
    const state = readState();
    const currentClassName = state.classroom?.className || "Current class";
    if (!supabase || !state.classroom?.id) {
      list.innerHTML = '<div class="small-note">Create a class first, then student accounts will appear here.</div>';
      return;
    }
    const { data: students, error } = await supabase
      .from("students")
      .select("display_name, username, created_at")
      .eq("class_id", state.classroom.id)
      .order("created_at", { ascending: false });

    if (error) {
      list.innerHTML = `<div class="small-note">${error.message}</div>`;
      return;
    }

    if (!students.length) {
      list.innerHTML = '<div class="small-note">No student accounts created in this prototype yet.</div>';
      return;
    }
    list.innerHTML = students.map(student => `
      <div class="generated-item">
        <div>
          <strong>${student.display_name}</strong>
          <div class="small-note">Username: ${student.username} • Class: ${currentClassName || "Unassigned"}</div>
        </div>
        <div class="small-note">Created: ${new Date(student.created_at).toLocaleDateString()}</div>
      </div>
    `).join("");
  };

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      feedback.className = "feedback";
      feedback.textContent = "";
      return;
    }
    if (isValidStudentUsername(username)) {
      feedback.className = "feedback good";
      feedback.textContent = "Username format is valid.";
    } else {
      feedback.className = "feedback warn";
      feedback.textContent = "Use a teacher-issued username with letters and optional numbers. No spaces or email addresses.";
    }
  });

  const renderUsernameSuggestions = () => {
    if (!suggestionBox) return;
    const suggestions = generateStudentUsernameSuggestions(displayNameInput.value.trim());
    if (!suggestions.length) {
      suggestionBox.textContent = "Suggested pattern: Firstname + surname initial or extra surname letters, for example MarkT or MarkTh1.";
      return;
    }
    suggestionBox.innerHTML = `Suggestions: ${suggestions.map(item => `<strong>${item}</strong>`).join(" · ")}`;
  };

  displayNameInput.addEventListener("input", renderUsernameSuggestions);
  renderUsernameSuggestions();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const displayName = document.getElementById("new-student-display-name").value.trim();
    const username = usernameInput.value.trim();
    const state = readState();
    const className = state.classroom?.className || "Current class";
    if (!isValidStudentUsername(username)) {
      feedback.className = "feedback bad";
      feedback.textContent = "Student usernames must start with a letter and use only letters or numbers. No spaces or email addresses.";
      return;
    }
    const password = document.getElementById("new-student-password").value.trim() || generateStudentPassword();
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { teacher } = await requireLoggedInTeacher(supabase);
      if (!state.classroom?.id) {
        throw new Error("Create a class before adding students.");
      }

      const existingMatches = await findStudentProfilesByUsername(supabase, username);
      if (existingMatches.length) {
        throw new Error(`Username "${username}" is already in use. Please choose a different student username.`);
      }

      const passwordHash = await hashValue(password);
      const { error } = await supabase
        .from("students")
        .insert({
          display_name: displayName,
          username,
          password_hash: passwordHash,
          school_id: teacher.school_id,
          class_id: state.classroom.id,
          created_by_teacher_id: teacher.id
        });

      if (error) throw error;

      const insertedStudent = await getStudentProfileByUsername(supabase, username);
      if (insertedStudent) {
        await ensurePlayerProfile(supabase, insertedStudent.id);
      }

      form.reset();
      feedback.className = "feedback good";
      feedback.textContent = `Student account created for ${displayName}. Temporary password: ${password}`;
      if (generatedCredentials) {
        generatedCredentials.style.display = "block";
        generatedCredentials.innerHTML = `
          <p><strong>Student account created</strong></p>
          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Temporary password:</strong> ${password}</p>
          <p class="small-note">Please copy these details now and share them securely with the student.</p>
        `;
      }
      render();
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Student creation failed.";
    }
  });

  render().catch(error => {
    console.error(error);
  });
}

function initAuthContext() {
  const state = readState();
  setText("teacher-name-preview", state.teacher?.fullName || "No teacher saved yet");
  setText("teacher-school-preview", state.teacher?.schoolName || "School not set yet");
  setText("class-preview", state.classroom?.className || "No class created yet");
  setText("class-code-preview", state.classroom?.classCode || "Pending");
}

async function initManageStudents() {
  const list = document.getElementById("manage-students-list");
  const feedback = document.getElementById("manage-students-feedback");
  const classNameEl = document.getElementById("manage-class-name");
  const classCodeEl = document.getElementById("manage-class-code");
  const resetResult = document.getElementById("reset-password-result");
  if (!list || !feedback || !classNameEl || !classCodeEl || !resetResult) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    feedback.className = "feedback bad";
    feedback.textContent = "Supabase is not configured yet.";
    return;
  }

  try {
    const { teacher } = await requireLoggedInTeacher(supabase);
    const state = readState();
    let classroom = state.classroom;

    if (!classroom?.id) {
      const { data: latestClass, error: classError } = await supabase
        .from("classes")
        .select("id, name, year_level, class_code")
        .eq("teacher_id", teacher.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (classError) throw classError;
      if (!latestClass) {
        feedback.className = "feedback warn";
        feedback.textContent = "No class found yet. Create a class first.";
        classNameEl.textContent = "No class created yet";
        classCodeEl.textContent = "Pending";
        return;
      }

      classroom = {
        id: latestClass.id,
        className: latestClass.name,
        yearLevel: latestClass.year_level,
        classCode: latestClass.class_code
      };
      writeState({ classroom });
    }

    classNameEl.textContent = classroom.className || "Current class";
    classCodeEl.textContent = classroom.classCode || "Pending";

    const renderStudents = async () => {
      const { data: students, error: studentError } = await supabase
        .from("students")
        .select("id, display_name, username, created_at, last_login_at, is_active")
        .eq("class_id", classroom.id)
        .order("created_at", { ascending: true });

      if (studentError) throw studentError;

      if (!students.length) {
        feedback.className = "feedback warn";
        feedback.textContent = "No students found in this class yet.";
        list.innerHTML = "";
        return;
      }

      feedback.className = "feedback good";
      feedback.textContent = `${students.length} student account(s) loaded.`;
      list.innerHTML = students.map(student => `
        <div class="generated-item">
          <div>
            <strong>${student.display_name}</strong>
            <div class="small-note">Username: ${student.username}</div>
            <div class="small-note">Last login: ${student.last_login_at ? new Date(student.last_login_at).toLocaleString() : "Not yet logged in"}</div>
          </div>
          <div class="button-row" style="margin-top: 0;">
            <button type="button" class="button-secondary manage-reset-password" data-student-id="${student.id}" data-student-name="${student.display_name}" data-student-username="${student.username}">Reset password</button>
          </div>
        </div>
      `).join("");

      list.querySelectorAll(".manage-reset-password").forEach(button => {
        button.addEventListener("click", async () => {
          const newPassword = generateStudentPassword();
          const passwordHash = await hashValue(newPassword);
          const { error: updateError } = await supabase
            .from("students")
            .update({ password_hash: passwordHash })
            .eq("id", button.dataset.studentId);

          if (updateError) {
            feedback.className = "feedback bad";
            feedback.textContent = updateError.message || "Password reset failed.";
            return;
          }

          resetResult.innerHTML = `
            <p><strong>Password reset successful</strong></p>
            <p><strong>Name:</strong> ${button.dataset.studentName}</p>
            <p><strong>Username:</strong> ${button.dataset.studentUsername}</p>
            <p><strong>New temporary password:</strong> ${newPassword}</p>
            <p class="small-note">Please copy this now and share it securely. The previous password is no longer valid.</p>
          `;
          feedback.className = "feedback good";
          feedback.textContent = `Password reset for ${button.dataset.studentName}.`;
        });
      });
    };

    await renderStudents();
  } catch (error) {
    feedback.className = "feedback bad";
    feedback.textContent = error.message || "Student manager could not be loaded.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthContext();
  loadSchoolOptions();
  initTeacherSignup();
  initTeacherLogin();
  initStudentLogin();
  initCreateClass();
  initAddStudents();
  initManageStudents();
});
