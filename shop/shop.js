const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";

const GLOBAL_ASSET_CATALOG = [
  { code: "study-desk", name: "Focused Study Desk", category: "study", cost: 900, icon: "🪑", benefit: "Supports planning-heavy tasks and a more stable learning setup." },
  { code: "laptop-upgrade", name: "Laptop Upgrade", category: "tools", cost: 1600, icon: "💻", benefit: "Improves research, online learning, and digital task readiness." },
  { code: "transport-pass", name: "Transport Pass", category: "mobility", cost: 700, icon: "🚌", benefit: "Helps placements, TAFE access, and work experience feel realistic and reachable." },
  { code: "wellbeing-pack", name: "Wellbeing Pack", category: "wellbeing", cost: 500, icon: "🌿", benefit: "Protects energy and balance while your pathway gets busier." },
  { code: "rental-upgrade", name: "Rental Upgrade", category: "housing", cost: 2200, icon: "🏠", benefit: "A more stable base that strengthens long-term pathway confidence." },
  { code: "iphone-upgrade", name: "iPhone Upgrade", category: "lifestyle", cost: 1500, icon: "📱", benefit: "Boosts confidence, social status, and everyday organisation." },
  { code: "ps5-bundle", name: "PS5 Bundle", category: "gaming", cost: 1300, icon: "🎮", benefit: "A fun flex purchase that makes the life sim feel more like real teen downtime." },
  { code: "festival-pass", name: "Summer Festival Pass", category: "experiences", cost: 580, icon: "🎟️", benefit: "Adds fun, memories, and social energy to the year you're building." },
  { code: "gym-membership", name: "Gym Membership", category: "wellbeing", cost: 720, icon: "🏋️", benefit: "Builds routine, energy, and confidence alongside your career goals." },
  { code: "sneaker-drop", name: "Limited Sneaker Drop", category: "style", cost: 460, icon: "👟", benefit: "A hype purchase that makes rewards feel personal and expressive." },
  { code: "tesla-fund", name: "Tesla Model 3 Fund", category: "cars", cost: 8500, icon: "🚗", benefit: "A dream-car savings target that feels aspirational and status-building." },
  { code: "ac-milan-membership", name: "AC Milan Membership", category: "fun", cost: 420, icon: "⚽", benefit: "A fun flex purchase that makes the life-build feel more personal." },
  { code: "pet-dog", name: "Rescue Puppy", category: "pets", cost: 650, icon: "🐶", benefit: "Adds companionship and makes the life sim feel warmer and more human." },
  { code: "cat-companion", name: "Cat Companion", category: "pets", cost: 520, icon: "🐱", benefit: "A calm little life upgrade that makes the world feel more lived in." },
  { code: "life-insurance", name: "Starter Life Insurance", category: "security", cost: 1100, icon: "🛡️", benefit: "A grown-up security move that fits long-term planning and stability." },
  { code: "home-deposit", name: "First Home Deposit", category: "property", cost: 5000, icon: "🏡", benefit: "A serious investment step toward future housing security and wealth building." }
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

function getAssetCounts(assets) {
  return (assets || []).reduce((acc, asset) => {
    acc[asset.asset_code] = (acc[asset.asset_code] || 0) + 1;
    return acc;
  }, {});
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

  const assetCounts = getAssetCounts(assets);
  const totalSpendByCode = assets.reduce((acc, asset) => {
    acc[asset.asset_code] = (acc[asset.asset_code] || 0) + Number(asset.purchase_cost || 0);
    return acc;
  }, {});
  const latestByCode = new Map();
  assets.forEach(asset => {
    if (!latestByCode.has(asset.asset_code)) {
      latestByCode.set(asset.asset_code, asset);
    }
  });

  container.innerHTML = [...latestByCode.values()].map(asset => `
    <div class="timeline-item">
      <strong>${escapeHtml(asset.asset_name)}</strong>
      <p>${escapeHtml(asset.asset_category)} • ${formatCurrency(asset.purchase_cost)}${assetCounts[asset.asset_code] > 1 ? ` • Qty ${assetCounts[asset.asset_code]} • Total spent ${formatCurrency(totalSpendByCode[asset.asset_code])}` : ""}</p>
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
  const ownedCounts = getAssetCounts(context?.assets || []);
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
        <p>${currentWorth >= asset.cost ? "Affordable" : "Locked"}</p>
      </div>
      <div class="pill-row">
        <span class="pill">Owned: ${ownedCounts[asset.code] || 0}</span>
        <span class="pill">${escapeHtml(asset.category)}</span>
      </div>
      <div class="module-actions">
        <button class="module-link" type="button" data-buy-asset="${asset.code}" ${currentWorth < asset.cost ? "disabled" : ""}>
          ${(ownedCounts[asset.code] || 0) > 0 ? "Buy Another" : "Buy Item"}
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
