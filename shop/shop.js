const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";

const GLOBAL_ASSET_CATALOG = [
  { code: "study-desk", name: "Focused Study Desk", category: "study", cost: 900, icon: "🪑", benefit: "Supports planning-heavy tasks and a more stable learning setup." },
  { code: "laptop-upgrade", name: "Laptop Upgrade", category: "tools", cost: 1600, icon: "💻", benefit: "Improves research, online learning, and digital task readiness." },
  { code: "transport-pass", name: "Transport Pass", category: "mobility", cost: 700, icon: "🚌", benefit: "Helps placements, TAFE access, and work experience feel realistic and reachable." },
  { code: "wellbeing-pack", name: "Wellbeing Pack", category: "wellbeing", cost: 500, icon: "🌿", benefit: "Protects energy and balance while your pathway gets busier." },
  { code: "rental-upgrade", name: "Rental Upgrade", category: "housing", cost: 2200, icon: "🏠", benefit: "A more stable base that strengthens long-term pathway confidence." },
  { code: "phone-upgrade", name: "Phone Upgrade", category: "tools", cost: 850, icon: "📱", benefit: "Makes communication, scheduling, and job-readiness easier to manage." }
];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_DEMO_STATE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") return null;
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

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

async function loadStudentShopContext() {
  const authState = readState();
  const studentId = authState?.studentLogin?.id;
  const studentName = authState?.studentLogin?.displayName || authState?.studentLogin?.username || "Student";
  const schoolName = authState?.studentLogin?.schoolName || "";
  const classCode = authState?.studentLogin?.classCode || "";
  if (!studentId) return null;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return null;

  const [{ data: profile }, { data: assets }] = await Promise.all([
    supabase
      .from("player_profiles")
      .select("student_id, annual_salary, cumulative_net_worth, savings, work_life_balance, job_security")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("player_assets")
      .select("id, asset_code, asset_name, asset_category, purchase_cost, purchased_at")
      .eq("student_id", studentId)
      .order("purchased_at", { ascending: false })
  ]);

  return {
    studentId,
    studentName,
    schoolName,
    classCode,
    profile: profile || null,
    assets: assets || []
  };
}

function renderShopHero(context) {
  const badges = document.getElementById("shop-badge-stack");
  if (!badges) return;
  if (!context) {
    badges.innerHTML = '<span class="badge">Log in as a student to use the global shop.</span>';
    return;
  }

  badges.innerHTML = [
    `<span class="badge">Student: ${escapeHtml(context.studentName)}</span>`,
    `<span class="badge">School: ${escapeHtml(context.schoolName || "School not set")}</span>`,
    `<span class="badge">Class: ${escapeHtml(context.classCode || "Class not set")}</span>`
  ].join("");
}

function renderShopMetrics(context) {
  const profile = context?.profile || {};
  setText("shop-spendable", formatCurrency(profile.cumulative_net_worth || 0));
  setText("shop-assets-owned", String((context?.assets || []).length));
  setText("shop-salary", formatCurrency(profile.annual_salary || 0));
  setText("shop-net-worth", formatCurrency(profile.cumulative_net_worth || 0));
}

function renderOwnedInventory(context) {
  const container = document.getElementById("owned-shop-items");
  if (!container) return;
  const assets = context?.assets || [];
  if (!assets.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No items owned yet</strong><p>Use Megatrends or Lifelong Learning to build money, then buy your first upgrade here.</p></div>';
    return;
  }

  container.innerHTML = assets.map(asset => `
    <div class="timeline-item">
      <strong>${escapeHtml(asset.asset_name)}</strong>
      <p>${escapeHtml(asset.asset_category)} • ${formatCurrency(asset.purchase_cost)}</p>
    </div>
  `).join("");
}

async function buyGlobalAsset(asset, context) {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase || !context?.studentId || !context.profile) return;

  const currentWorth = Number(context.profile.cumulative_net_worth || 0);
  if (currentWorth < asset.cost) {
    alert(`You need ${formatCurrency(asset.cost - currentWorth)} more to buy ${asset.name}.`);
    return;
  }

  const alreadyOwned = (context.assets || []).some(item => item.asset_code === asset.code);
  if (alreadyOwned) return;

  const { error: assetError } = await supabase
    .from("player_assets")
    .insert({
      student_id: context.studentId,
      asset_code: asset.code,
      asset_name: asset.name,
      asset_category: asset.category,
      purchase_cost: asset.cost
    });

  if (assetError) {
    console.error(assetError);
    alert("Could not save that purchase yet.");
    return;
  }

  const { error: profileError } = await supabase
    .from("player_profiles")
    .upsert({
      student_id: context.studentId,
      updated_at: new Date().toISOString(),
      cumulative_net_worth: Math.max(0, currentWorth - asset.cost),
      savings: Math.max(0, Number(context.profile.savings || 0) - asset.cost)
    }, { onConflict: "student_id" });

  if (profileError) {
    console.error(profileError);
    alert("Your purchase saved, but the profile balance update needs checking.");
  }

  window.location.reload();
}

function renderShopGrid(context) {
  const container = document.getElementById("shop-grid");
  if (!container) return;
  const owned = new Set((context?.assets || []).map(item => item.asset_code));
  const currentWorth = Number(context?.profile?.cumulative_net_worth || 0);

  container.innerHTML = GLOBAL_ASSET_CATALOG.map(asset => `
    <article class="module-card">
      <div class="module-header">
        <div class="badge">${asset.icon}</div>
        <div>
          <div class="kicker">${escapeHtml(asset.category)}</div>
          <h3>${escapeHtml(asset.name)}</h3>
        </div>
      </div>
      <p>${escapeHtml(asset.benefit)}</p>
      <div class="section-title">
        <p>${formatCurrency(asset.cost)}</p>
        <p>${owned.has(asset.code) ? "Owned" : currentWorth >= asset.cost ? "Affordable" : "Locked"}</p>
      </div>
      <div class="module-actions">
        <button class="module-link" type="button" data-buy-asset="${asset.code}" ${owned.has(asset.code) ? "disabled" : ""}>
          ${owned.has(asset.code) ? "Already Owned" : "Buy Upgrade"}
        </button>
      </div>
    </article>
  `).join("");

  container.querySelectorAll("[data-buy-asset]").forEach(button => {
    button.addEventListener("click", async () => {
      const asset = GLOBAL_ASSET_CATALOG.find(item => item.code === button.dataset.buyAsset);
      if (!asset) return;
      await buyGlobalAsset(asset, context);
    });
  });
}

async function initShop() {
  const context = await loadStudentShopContext();
  renderShopHero(context);
  renderShopMetrics(context);
  renderOwnedInventory(context);
  renderShopGrid(context);
}

initShop().catch(console.error);
