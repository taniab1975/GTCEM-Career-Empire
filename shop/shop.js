const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const FEEDBACK_FALLBACK_KEY = "career-empire-feedback-fallback";
const PLAYER_SESSION_KEY = "career-empire-session";

const GLOBAL_ASSET_CATALOG = [
  { code: "study-desk", name: "Focused Study Desk", category: "study", cost: 900, icon: "🪑", benefit: "Supports planning-heavy tasks and a more stable learning setup." },
  { code: "laptop-upgrade", name: "Laptop Upgrade", category: "technology", cost: 1600, icon: "💻", benefit: "Improves research, online learning, and digital task readiness." },
  { code: "transport-pass", name: "Transport Pass", category: "mobility", cost: 700, icon: "🚌", benefit: "Helps placements, TAFE access, and work experience feel realistic and reachable." },
  { code: "wellbeing-pack", name: "Wellbeing Pack", category: "wellbeing", cost: 500, icon: "🌿", benefit: "Protects energy and balance while your pathway gets busier." },
  { code: "rental-upgrade", name: "Rental Upgrade", category: "housing", cost: 2200, icon: "🏠", benefit: "A more stable base that strengthens long-term pathway confidence." },
  { code: "iphone-upgrade", name: "iPhone Upgrade", category: "mobile-phones", cost: 1500, icon: "📱", benefit: "Boosts confidence, social status, and everyday organisation." },
  { code: "ps5-bundle", name: "PS5 Bundle", category: "fun", cost: 1300, icon: "🎮", benefit: "A fun flex purchase that makes the life sim feel more like real teen downtime." },
  { code: "festival-pass", name: "Summer Festival Pass", category: "experiences", cost: 580, icon: "🎟️", benefit: "Adds fun, memories, and social energy to the year you're building." },
  { code: "gym-membership", name: "Gym Membership", category: "wellbeing", cost: 720, icon: "🏋️", benefit: "Builds routine, energy, and confidence alongside your career goals." },
  { code: "sneaker-drop", name: "Limited Sneaker Drop", category: "clothes", cost: 460, icon: "👟", benefit: "A hype purchase that makes rewards feel personal and expressive." },
  { code: "tesla-fund", name: "Tesla Model 3 Fund", category: "cars", cost: 8500, icon: "🚗", benefit: "A dream-car savings target that feels aspirational and status-building." },
  { code: "ac-milan-membership", name: "AC Milan Membership", category: "fun", cost: 420, icon: "⚽", benefit: "A fun flex purchase that makes the life-build feel more personal." },
  { code: "pet-dog", name: "Rescue Puppy", category: "wellbeing", cost: 650, icon: "🐶", benefit: "Adds companionship and makes the life sim feel warmer and more human." },
  { code: "cat-companion", name: "Cat Companion", category: "wellbeing", cost: 520, icon: "🐱", benefit: "A calm little life upgrade that makes the world feel more lived in." },
  { code: "life-insurance", name: "Starter Life Insurance", category: "investments", cost: 1100, icon: "🛡️", benefit: "A grown-up security move that fits long-term planning and stability." },
  { code: "home-deposit", name: "First Home Deposit", category: "investments", cost: 5000, icon: "🏡", benefit: "A serious investment step toward future housing security and wealth building." }
];

const CATEGORY_META = {
  all: { label: "All", icon: "🛍️" },
  cars: { label: "Cars", icon: "🚗" },
  "mobile-phones": { label: "Mobile Phones", icon: "📱" },
  clothes: { label: "Clothes", icon: "👟" },
  investments: { label: "Investments", icon: "📈" },
  wellbeing: { label: "Wellbeing", icon: "🌿" },
  technology: { label: "Technology", icon: "💻" },
  study: { label: "Study", icon: "🪑" },
  mobility: { label: "Mobility", icon: "🚌" },
  housing: { label: "Housing", icon: "🏠" },
  fun: { label: "Fun", icon: "🎉" },
  experiences: { label: "Experiences", icon: "🎟️" }
};

let activeCategory = "all";
let currentShopContext = null;
let pendingStoreImage = null;
let approvedStoreItems = [];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_DEMO_STATE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function writePlayerSession(patch) {
  const next = { ...readJsonStorage(PLAYER_SESSION_KEY, {}), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent(entry);
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

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    label: String(category || "Other").replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase()),
    icon: "🧩"
  };
}

function getCatalogCategories() {
  const categories = [...new Set(getFullAssetCatalog().map(asset => asset.category))];
  const preferredOrder = ["all", "cars", "mobile-phones", "clothes", "investments", "wellbeing", "technology", "study", "mobility", "housing", "fun", "experiences"];
  const ordered = preferredOrder.filter(category => category === "all" || categories.includes(category));
  const extras = categories.filter(category => !ordered.includes(category)).sort();
  return [...ordered, ...extras];
}

function getFullAssetCatalog() {
  return [...GLOBAL_ASSET_CATALOG, ...approvedStoreItems];
}

function parseApprovedStoreRequest(row) {
  if (!row?.message || typeof row.message !== "string") return null;
  try {
    const payload = JSON.parse(row.message);
    if (payload.kind !== "store-item-request" || payload.status !== "approved" || !payload.approved_item) return null;
    return payload.approved_item;
  } catch (_) {
    return null;
  }
}

async function loadApprovedStoreItems() {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    approvedStoreItems = [];
    return;
  }

  const { data, error } = await supabase
    .from("feedback_reports")
    .select("id, message")
    .eq("feedback_type", "store-item-request")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    approvedStoreItems = [];
    return;
  }

  const seenCodes = new Set();
  approvedStoreItems = (data || [])
    .map(parseApprovedStoreRequest)
    .filter(Boolean)
    .filter(item => {
      if (seenCodes.has(item.code)) return false;
      seenCodes.add(item.code);
      return true;
    });
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
      <p>${escapeHtml(getCategoryMeta(asset.asset_category).label)} • ${formatCurrency(asset.purchase_cost)}${assetCounts[asset.asset_code] > 1 ? ` • Qty ${assetCounts[asset.asset_code]} • Total spent ${formatCurrency(totalSpendByCode[asset.asset_code])}` : ""}</p>
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

  writePlayerSession({
    studentId: context.studentId,
    annualSalary: Number(context.profile.annual_salary || 0),
    cumulativeNetWorth: Math.max(0, currentWorth - asset.cost),
    savings: Math.max(0, Number(context.profile.savings || 0) - asset.cost),
    workLifeBalance: Number(context.profile.work_life_balance || 0),
    jobSecurity: Number(context.profile.job_security || 0),
    checkpoint: "shop-purchase"
  });
  pushEconomyLog({
    eventType: "purchase",
    moduleId: "global-shop",
    checkpoint: "shop-purchase",
    label: asset.name,
    detail: `Purchased from the global shop for ${formatCurrency(asset.cost)}`,
    earnedDelta: 0,
    taxDelta: 0,
    spendDelta: asset.cost,
    annualSalaryAfter: Number(context.profile.annual_salary || 0),
    netWorthAfter: Math.max(0, currentWorth - asset.cost),
    savingsAfter: Math.max(0, Number(context.profile.savings || 0) - asset.cost)
  });

  window.location.reload();
}

function renderCategoryBar() {
  const container = document.getElementById("shop-category-bar");
  if (!container) return;
  const categories = getCatalogCategories();
  container.innerHTML = categories.map(category => {
    const meta = getCategoryMeta(category);
    return `
      <button class="shop-category-pill ${category === activeCategory ? "active" : ""}" type="button" data-shop-category="${category}">
        ${meta.icon} ${escapeHtml(meta.label)}
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-shop-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.shopCategory;
      renderCategoryBar();
      renderShopGrid(currentShopContext);
    });
  });
}

function renderShopGrid(context) {
  const container = document.getElementById("shop-grid");
  if (!container) return;
  const ownedCounts = getAssetCounts(context?.assets || []);
  const currentWorth = Number(context?.profile?.cumulative_net_worth || 0);
  const catalog = getFullAssetCatalog();
  const filteredAssets = activeCategory === "all"
    ? catalog
    : catalog.filter(asset => asset.category === activeCategory);

  if (!filteredAssets.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No items in this category yet</strong><p>Use the store request button to suggest what should be added next.</p></div>';
    return;
  }

  container.innerHTML = filteredAssets.map(asset => {
    const categoryMeta = getCategoryMeta(asset.category);
    return `
      <article class="module-card">
        <div class="module-header">
          <div class="badge">${asset.image?.dataUrl ? `<img src="${asset.image.dataUrl}" alt="${escapeHtml(asset.name)}" style="width:32px;height:32px;border-radius:10px;object-fit:cover;">` : asset.icon}</div>
          <div>
            <div class="kicker">${escapeHtml(categoryMeta.label)}</div>
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
          <span class="pill">${escapeHtml(categoryMeta.label)}</span>
        </div>
        <div class="module-actions">
          <button class="module-link" type="button" data-buy-asset="${asset.code}" ${currentWorth < asset.cost ? "disabled" : ""}>
            ${(ownedCounts[asset.code] || 0) > 0 ? "Buy Another" : "Buy Item"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-buy-asset]").forEach(button => {
    button.addEventListener("click", async () => {
      const asset = GLOBAL_ASSET_CATALOG.find(item => item.code === button.dataset.buyAsset);
      if (!asset) return;
      await buyGlobalAsset(asset, context);
    });
  });
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

function createStoreRequestModal() {
  if (document.getElementById("shop-request-backdrop")) return;
  const backdrop = document.createElement("div");
  backdrop.className = "shop-request-backdrop";
  backdrop.id = "shop-request-backdrop";
  backdrop.innerHTML = `
    <div class="shop-request-card" role="dialog" aria-modal="true" aria-labelledby="shop-request-title">
      <h3 id="shop-request-title">Add an Item to the Store</h3>
      <p>Suggest a new shop item so Career Empire keeps growing with student ideas. Your request will be saved for teacher review before anything is added.</p>
      <div class="shop-request-grid">
        <div>
          <label for="shop-request-student">Student login</label>
          <input id="shop-request-student" type="text" readonly>
        </div>
        <div>
          <label for="shop-request-name">Item name</label>
          <input id="shop-request-name" type="text" placeholder="Example: Vintage Mustang Fund">
        </div>
        <div>
          <label for="shop-request-category">Category</label>
          <select id="shop-request-category">
            ${getCatalogCategories().filter(category => category !== "all").map(category => {
              const meta = getCategoryMeta(category);
              return `<option value="${category}">${escapeHtml(meta.label)}</option>`;
            }).join("")}
          </select>
        </div>
        <div>
          <label for="shop-request-message">Why should this be added?</label>
          <textarea id="shop-request-message" placeholder="Describe the item, why students would want it, and how it fits the shop."></textarea>
        </div>
        <div>
          <label for="shop-request-image">Optional photo</label>
          <input id="shop-request-image" type="file" accept="image/*">
          <p class="shop-request-note">Optional: upload a photo that represents the item. Keep it under 1 MB for now.</p>
        </div>
      </div>
      <div class="shop-request-actions">
        <button type="button" class="shop-request-primary" id="shop-request-submit">Send request</button>
        <button type="button" class="shop-request-secondary" id="shop-request-cancel">Cancel</button>
      </div>
      <div class="shop-request-status" id="shop-request-status"></div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) {
      closeStoreRequestModal();
    }
  });
}

function openStoreRequestModal() {
  const modal = document.getElementById("shop-request-backdrop");
  if (!modal) return;
  const studentInput = document.getElementById("shop-request-student");
  const nameInput = document.getElementById("shop-request-name");
  const categoryInput = document.getElementById("shop-request-category");
  const messageInput = document.getElementById("shop-request-message");
  const imageInput = document.getElementById("shop-request-image");
  const statusEl = document.getElementById("shop-request-status");

  if (studentInput) {
    studentInput.value = currentShopContext?.studentName || readState()?.studentLogin?.username || "Student";
  }
  if (nameInput) nameInput.value = "";
  if (categoryInput) categoryInput.value = "cars";
  if (messageInput) messageInput.value = "";
  if (imageInput) imageInput.value = "";
  if (statusEl) statusEl.textContent = "";
  pendingStoreImage = null;
  modal.classList.add("open");
}

function closeStoreRequestModal() {
  const modal = document.getElementById("shop-request-backdrop");
  if (modal) modal.classList.remove("open");
}

function bindStoreRequestActions() {
  const cancelButton = document.getElementById("shop-request-cancel");
  const submitButton = document.getElementById("shop-request-submit");
  const imageInput = document.getElementById("shop-request-image");

  document.querySelectorAll("[data-open-store-request]").forEach(button => {
    button.addEventListener("click", openStoreRequestModal);
  });
  if (cancelButton) {
    cancelButton.addEventListener("click", closeStoreRequestModal);
  }
  if (imageInput) {
    imageInput.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      const statusEl = document.getElementById("shop-request-status");
      pendingStoreImage = null;
      if (!file) return;
      if (file.size > 1024 * 1024) {
        if (statusEl) statusEl.textContent = "Please choose an image under 1 MB.";
        event.target.value = "";
        return;
      }
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      pendingStoreImage = {
        name: file.name,
        type: file.type,
        dataUrl
      };
      if (statusEl) statusEl.textContent = `Attached image: ${file.name}`;
    });
  }
  if (submitButton) {
    submitButton.addEventListener("click", submitStoreRequest);
  }
}

async function submitStoreRequest() {
  const identity = readState()?.studentLogin || {};
  const nameInput = document.getElementById("shop-request-name");
  const categoryInput = document.getElementById("shop-request-category");
  const messageInput = document.getElementById("shop-request-message");
  const statusEl = document.getElementById("shop-request-status");

  const itemName = nameInput?.value.trim() || "";
  const category = categoryInput?.value || "";
  const reason = messageInput?.value.trim() || "";

  if (!itemName || !reason) {
    if (statusEl) statusEl.textContent = "Please add an item name and tell us why it should be in the store.";
    return;
  }

  const payload = {
    kind: "store-item-request",
    student_name: currentShopContext?.studentName || identity.displayName || identity.username || "Student",
    login_name: identity.username || currentShopContext?.studentName || "unknown",
    school_name: currentShopContext?.schoolName || identity.schoolName || "",
    class_code: currentShopContext?.classCode || identity.classCode || "",
    item_name: itemName,
    category,
    category_label: getCategoryMeta(category).label,
    reason,
    image: pendingStoreImage
  };

  if (statusEl) statusEl.textContent = "Sending request...";
  try {
    await submitFeedback({
      page_path: window.location.pathname,
      actor_role: "student",
      login_name: payload.login_name,
      feedback_type: "store-item-request",
      message: JSON.stringify(payload)
    });
    if (statusEl) statusEl.textContent = "Thanks. Your store item request has been saved for review.";
    setTimeout(closeStoreRequestModal, 800);
  } catch (error) {
    if (statusEl) statusEl.textContent = error.message || "The request could not be saved.";
  }
}

function renderBuildNote() {
  const note = document.getElementById("shop-build-note");
  if (!note) return;
  note.textContent = "Browse categories like cars, mobile phones, clothes, investments, wellbeing, and more. Students can now also suggest new items for teacher approval.";
}

async function initShop() {
  await loadApprovedStoreItems();
  currentShopContext = await loadStudentShopContext();
  renderShopHero(currentShopContext);
  renderShopMetrics(currentShopContext);
  renderOwnedInventory(currentShopContext);
  renderBuildNote();
  renderCategoryBar();
  renderShopGrid(currentShopContext);
  createStoreRequestModal();
  bindStoreRequestActions();
}

initShop().catch(console.error);
