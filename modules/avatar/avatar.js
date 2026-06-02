(function () {
  const AUTH_STATE_KEY = "career-empire-auth-demo";
  const PLAYER_SESSION_KEY = "career-empire-session";
  const AVATAR_STORAGE_KEY = "career-empire-avatar-v1";

  const skinTones = [
    { id: "porcelain", label: "Porcelain", color: "#f4d6c5", shadow: "#d79f82" },
    { id: "sand", label: "Sand", color: "#dba77c", shadow: "#b57952" },
    { id: "warm", label: "Warm", color: "#b8734f", shadow: "#8d4e36" },
    { id: "copper", label: "Copper", color: "#935a3c", shadow: "#6f3d29" },
    { id: "mahogany", label: "Mahogany", color: "#66402f", shadow: "#43271c" },
    { id: "deep", label: "Deep", color: "#38251f", shadow: "#211514" }
  ];

  const faceStyles = [
    { id: "soft", label: "Soft", token: "S" },
    { id: "round", label: "Round", token: "R" },
    { id: "sharp", label: "Sharp", token: "A" },
    { id: "freckled", label: "Freckles", token: "F" },
    { id: "bright", label: "Bright", token: "B" },
    { id: "calm", label: "Calm", token: "C" }
  ];

  const hairStyles = [
    { id: "crop", label: "Crop", token: "C" },
    { id: "waves", label: "Waves", token: "W" },
    { id: "curls", label: "Curls", token: "R" },
    { id: "long", label: "Long", token: "L" },
    { id: "bun", label: "Bun", token: "B" },
    { id: "wrap", label: "Wrap", token: "H" }
  ];

  const hairColours = [
    { id: "black", label: "Black", color: "#161412" },
    { id: "brown", label: "Brown", color: "#5a3524" },
    { id: "auburn", label: "Auburn", color: "#9b3f24" },
    { id: "blonde", label: "Blonde", color: "#d9b85d" },
    { id: "silver", label: "Silver", color: "#c8ced4" },
    { id: "teal", label: "Teal", color: "#0f8f8c" }
  ];

  const outfits = [
    { id: "blazer", label: "ECC blazer", token: "E", fill: "#123a5d", accent: "#f6b73c", shirt: "#f4f7fb", tie: "#0f8f8c" },
    { id: "interview", label: "Interview blazer", token: "I", fill: "#17202a", accent: "#f6b73c", shirt: "#ffffff", tie: "#3859c7" },
    { id: "hoodie", label: "Campus hoodie", token: "H", fill: "#3859c7", accent: "#f6b73c", shirt: "#edf4ff", tie: "#3859c7" },
    { id: "scrubs", label: "Health scrubs", token: "S", fill: "#0f8f8c", accent: "#ffffff", shirt: "#dff9f6", tie: "#0f8f8c" },
    { id: "hivis", label: "Hi-vis gear", token: "V", fill: "#f6b73c", accent: "#17202a", shirt: "#fff7d7", tie: "#17202a" },
    { id: "apron", label: "Creative apron", token: "A", fill: "#6c4bd2", accent: "#a3d95b", shirt: "#ffffff", tie: "#6c4bd2" }
  ];

  const accessories = [
    { id: "none", label: "None", token: "-" },
    { id: "glasses", label: "Glasses", token: "G" },
    { id: "headphones", label: "Headphones", token: "O" },
    { id: "badge", label: "Name badge", token: "N" },
    { id: "earrings", label: "Small earrings", token: "E" },
    { id: "scarf", label: "Scarf", token: "S" }
  ];

  const characterBases = [
    {
      id: "mackillop",
      label: "MacKillop welcome",
      token: "M",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png"
    },
    {
      id: "mackillop-thinking",
      label: "MacKillop thinking",
      token: "T",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png"
    },
    {
      id: "mackillop-pointing",
      label: "MacKillop pointing",
      token: "P",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png"
    },
    {
      id: "romero",
      label: "Romero welcome",
      token: "R",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png"
    },
    {
      id: "romero-thinking",
      label: "Romero thinking",
      token: "T",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png"
    },
    {
      id: "romero-celebrating",
      label: "Romero celebrating",
      token: "C",
      imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png"
    }
  ];

  const unlocks = [
    { name: "Interview outfit", state: "Starter", color: "#17202a", token: "IO" },
    { name: "Work boots", state: "Shop stage 2", color: "#935a3c", token: "WB" },
    { name: "Health kit", state: "Career gear", color: "#0f8f8c", token: "HK" },
    { name: "Tool belt", state: "Apprenticeship", color: "#f6b73c", token: "TB" },
    { name: "Laptop bag", state: "Study upgrade", color: "#3859c7", token: "LB" },
    { name: "Transport fund", state: "Life goal", color: "#e85d4f", token: "TF" }
  ];

  const defaults = {
    characterBase: "mackillop",
    skinTone: "sand",
    faceStyle: "soft",
    hairStyle: "waves",
    hairColour: "brown",
    outfit: "blazer",
    accessory: "none",
    occupation: "",
    training: "",
    strength: ""
  };

  const avatarParts = window.CareerEmpireAvatarParts || {};
  if (avatarParts.schemaVersion) {
    skinTones.splice(0, skinTones.length, ...(avatarParts.skinTones || []));
    faceStyles.splice(0, faceStyles.length, ...(avatarParts.faceStyles || []));
    hairStyles.splice(0, hairStyles.length, ...(avatarParts.hairStyles || []));
    hairColours.splice(0, hairColours.length, ...(avatarParts.hairColours || []));
    outfits.splice(0, outfits.length, ...(avatarParts.outfits || []));
    accessories.splice(0, accessories.length, ...(avatarParts.accessories || []));
    characterBases.splice(0, characterBases.length, ...(avatarParts.characterBases || []));
    unlocks.splice(0, unlocks.length, ...(avatarParts.unlocks || []));
    Object.assign(defaults, avatarParts.defaults || {});
  }

  let state = { ...defaults };

  function readJsonStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getAuthState() {
    return readJsonStorage(AUTH_STATE_KEY, {});
  }

  function getSession() {
    return readJsonStorage(PLAYER_SESSION_KEY, {});
  }

  function getOwnerKey() {
    const authState = getAuthState();
    const session = getSession();
    const studentLogin = authState?.studentLogin || {};
    return String(
      studentLogin.id ||
      studentLogin.username ||
      session.studentId ||
      session.username ||
      session.playerName ||
      "demo"
    );
  }

  function getStudentName() {
    const authState = getAuthState();
    const session = getSession();
    const login = authState?.studentLogin || {};
    return login.displayName || login.username || session.playerName || "Future Me";
  }

  function readSavedAvatar() {
    const payload = readJsonStorage(AVATAR_STORAGE_KEY, {});
    const ownerKey = getOwnerKey();
    if (payload?.profiles && payload.profiles[ownerKey]) return payload.profiles[ownerKey];
    return payload?.latest || null;
  }

  function writeSavedAvatar(nextAvatar) {
    const ownerKey = getOwnerKey();
    const current = readJsonStorage(AVATAR_STORAGE_KEY, {});
    const next = {
      ...current,
      latest: nextAvatar,
      profiles: {
        ...(current.profiles && typeof current.profiles === "object" ? current.profiles : {}),
        [ownerKey]: nextAvatar
      }
    };
    writeJsonStorage(AVATAR_STORAGE_KEY, next);

    const session = getSession();
    writeJsonStorage(PLAYER_SESSION_KEY, {
      ...session,
      avatar: nextAvatar,
      checkpoint: "avatar-created",
      updatedAt: new Date().toISOString()
    });
  }

  function findById(items, id, fallback = items[0]) {
    return items.find(item => item.id === id) || fallback;
  }

  function getSelectableItems(items) {
    return items.filter(item => !item.internalOnly && !item.referenceOnly);
  }

  function getBaseDefaultState(baseId) {
    const base = findById(characterBases, baseId, null);
    if (!base) return {};
    return {
      ...(base.defaultHairStyle ? { hairStyle: base.defaultHairStyle } : {}),
      ...(base.defaultOutfit ? { outfit: base.defaultOutfit } : {})
    };
  }

  function normaliseState(nextState) {
    const characterBase = findById(characterBases, nextState.characterBase);
    if (!characterBase || characterBase.internalOnly || characterBase.referenceOnly) {
      const fallbackBase = characterBase?.migratesTo || defaults.characterBase || getSelectableItems(characterBases)[0]?.id;
      return {
        ...nextState,
        characterBase: fallbackBase,
        ...getBaseDefaultState(fallbackBase)
      };
    }
    return nextState;
  }

  function getCompletion(profile = state) {
    let score = 45;
    if (profile.occupation.trim()) score += 20;
    if (profile.training.trim()) score += 20;
    if (profile.strength.trim()) score += 15;
    return Math.min(100, score);
  }

  function getFacePath(faceStyle) {
    if (faceStyle === "round") return "M128 74 C177 74 209 111 207 159 C205 214 171 251 128 251 C85 251 51 214 49 159 C47 111 79 74 128 74 Z";
    if (faceStyle === "sharp") return "M128 70 C174 74 203 110 201 158 C199 207 168 242 128 255 C88 242 57 207 55 158 C53 110 82 74 128 70 Z";
    return "M128 72 C176 72 205 109 204 158 C202 209 170 249 128 249 C86 249 54 209 52 158 C51 109 80 72 128 72 Z";
  }

  function renderHair(hairStyle, hairColour) {
    if (hairStyle === "crop") {
      return `<path d="M50 145 C49 91 87 58 128 58 C171 58 207 94 205 148 C180 118 143 103 99 116 C76 123 60 132 50 145 Z" fill="url(#avatarHair)"/><path d="M72 105 C100 82 139 78 185 107" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.12"/>`;
    }
    if (hairStyle === "curls") {
      return `
        <path d="M50 151 C42 92 84 55 128 55 C174 55 214 94 206 151 C187 123 156 110 128 110 C99 110 70 124 50 151 Z" fill="url(#avatarHair)"/>
        ${[55, 72, 91, 112, 133, 154, 176, 195].map((x, index) => `<circle cx="${x}" cy="${100 + (index % 2) * 10}" r="20" fill="url(#avatarHair)"/>`).join("")}
        <path d="M83 85 C111 70 147 70 174 89" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.12"/>
      `;
    }
    if (hairStyle === "long") {
      return `<path d="M48 158 C38 92 82 53 128 53 C177 53 218 95 205 180 L194 279 C173 250 159 207 163 157 C137 137 103 138 78 158 C83 207 70 250 49 279 Z" fill="url(#avatarHair)"/><path d="M82 91 C111 70 151 70 181 95" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.12"/>`;
    }
    if (hairStyle === "bun") {
      return `
        <circle cx="128" cy="48" r="27" fill="url(#avatarHair)"/>
        <path d="M52 146 C48 90 88 60 128 60 C170 60 207 92 203 148 C180 122 148 111 128 111 C104 111 73 123 52 146 Z" fill="url(#avatarHair)"/>
        <path d="M98 61 C120 72 143 72 164 61" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.1"/>
      `;
    }
    if (hairStyle === "wrap") {
      return `
        <path d="M47 141 C55 84 90 55 132 55 C173 55 205 88 210 144 C181 122 148 114 117 116 C87 118 62 128 47 141 Z" fill="#f6b73c"/>
        <path d="M72 88 C110 102 151 102 188 87" fill="none" stroke="#123a5d" stroke-width="10" stroke-linecap="round" opacity="0.25"/>
      `;
    }
    return `
      <path d="M50 150 C47 94 85 57 128 57 C172 57 209 95 205 151 C183 119 145 105 104 116 C78 123 60 135 50 150 Z" fill="url(#avatarHair)"/>
      <path d="M69 127 C99 101 140 96 186 127" fill="none" stroke="url(#avatarHair)" stroke-width="22" stroke-linecap="round"/>
      <path d="M86 93 C114 78 151 78 178 99" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.12"/>
    `;
  }

  function renderHairFront(hairStyle) {
    if (hairStyle === "crop") {
      return `
        <path d="M76 105 C95 83 129 76 167 91 C157 105 134 112 106 113 C93 113 83 111 76 105 Z" fill="url(#avatarHair)"/>
        <path d="M91 106 C109 92 134 87 158 96" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.12"/>
      `;
    }
    if (hairStyle === "curls") {
      return [82, 101, 122, 145, 166].map((x, index) => (
        `<circle cx="${x}" cy="${106 + (index % 2) * 5}" r="${index === 2 ? 18 : 15}" fill="url(#avatarHair)"/>`
      )).join("");
    }
    if (hairStyle === "long") {
      return `
        <path d="M72 108 C103 82 146 79 183 105 C161 118 133 120 102 116 C88 114 78 111 72 108 Z" fill="url(#avatarHair)"/>
        <path d="M78 118 C103 109 132 107 160 113" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.1"/>
      `;
    }
    if (hairStyle === "bun") {
      return `<path d="M73 107 C103 84 147 83 183 108 C156 121 112 120 73 107 Z" fill="url(#avatarHair)"/>`;
    }
    if (hairStyle === "wrap") {
      return `<path d="M62 111 C95 92 142 88 192 111" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.16"/>`;
    }
    return `
      <path d="M73 111 C96 86 132 78 183 104 C163 123 132 124 96 116 C86 114 78 112 73 111 Z" fill="url(#avatarHair)"/>
      <path d="M93 106 C116 93 143 91 169 103" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.13"/>
    `;
  }

  function renderAccessory(accessory, outfit) {
    if (accessory === "glasses") {
      return `
        <g fill="none" stroke="#17202a" stroke-width="4" opacity="0.84">
          <circle cx="104" cy="154" r="15"/>
          <circle cx="152" cy="154" r="15"/>
          <path d="M119 154 L137 154"/>
        </g>
      `;
    }
    if (accessory === "headphones") {
      return `
        <path d="M71 140 C74 95 96 72 128 72 C160 72 182 95 185 140" fill="none" stroke="#17202a" stroke-width="8" stroke-linecap="round"/>
        <rect x="50" y="130" width="22" height="46" rx="11" fill="#17202a"/>
        <rect x="184" y="130" width="22" height="46" rx="11" fill="#17202a"/>
        <path d="M56 141 L66 141 M190 141 L200 141" stroke="#ffffff" stroke-width="3" opacity="0.16"/>
      `;
    }
    if (accessory === "badge") {
      return `<rect x="151" y="273" width="40" height="22" rx="6" fill="#ffffff" opacity="0.95"/><path d="M159 284 L183 284" stroke="${outfit.accent}" stroke-width="3" stroke-linecap="round"/>`;
    }
    if (accessory === "earrings") {
      return `<circle cx="54" cy="174" r="5" fill="#f6b73c"/><circle cx="202" cy="174" r="5" fill="#f6b73c"/>`;
    }
    if (accessory === "scarf") {
      return `<path d="M89 238 C113 254 145 254 168 238 L180 278 C149 299 107 299 76 278 Z" fill="#e85d4f"/><path d="M128 248 L128 304" stroke="#ffffff" stroke-width="8" opacity="0.3"/>`;
    }
    return "";
  }

  function renderPrototypeAvatar() {
    const skin = findById(skinTones, state.skinTone);
    const face = findById(faceStyles, state.faceStyle);
    const hairColour = findById(hairColours, state.hairColour).color;
    const outfit = findById(outfits, state.outfit);
    const freckles = face.id === "freckled"
      ? `<g fill="${skin.shadow}" opacity="0.58"><circle cx="107" cy="175" r="2.5"/><circle cx="119" cy="181" r="2"/><circle cx="148" cy="175" r="2.5"/><circle cx="136" cy="181" r="2"/></g>`
      : "";
    const smilePath = face.id === "calm" ? "M111 204 C121 211 136 211 146 204" : "M108 201 C119 217 139 217 150 201";
    const eyeScale = face.id === "bright" ? 1.08 : face.id === "calm" ? 0.92 : 1;
    const eyeYOffset = face.id === "calm" ? 2 : 0;
    const browYOffset = face.id === "bright" ? -4 : 0;

    return `
      <svg viewBox="0 0 256 360" role="img" aria-label="Personal avatar preview">
        <defs>
          <radialGradient id="avatarSkin" cx="38%" cy="28%" r="76%">
            <stop offset="0" stop-color="#fff1dc"/>
            <stop offset="0.2" stop-color="${skin.color}"/>
            <stop offset="1" stop-color="${skin.shadow}"/>
          </radialGradient>
          <linearGradient id="avatarHair" x1="0.18" x2="0.88" y1="0" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.24"/>
            <stop offset="0.18" stop-color="${hairColour}"/>
            <stop offset="1" stop-color="#0f0c0b"/>
          </linearGradient>
          <linearGradient id="avatarOutfit" x1="0.18" x2="0.86" y1="0" y2="1">
            <stop offset="0" stop-color="#2f6f9b"/>
            <stop offset="0.45" stop-color="${outfit.fill}"/>
            <stop offset="1" stop-color="#071629"/>
          </linearGradient>
          <radialGradient id="avatarEye" cx="35%" cy="28%" r="70%">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="0.42" stop-color="#73d9ff"/>
            <stop offset="1" stop-color="#123a5d"/>
          </radialGradient>
          <filter id="avatarSoftShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#071629" flood-opacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#avatarSoftShadow)">
          <ellipse cx="128" cy="333" rx="86" ry="18" fill="#17202a" opacity="0.15"/>
          <path d="M50 348 C56 280 82 239 128 239 C174 239 200 280 206 348 Z" fill="url(#avatarOutfit)"/>
          <path d="M88 246 L128 314 L168 246" fill="${outfit.shirt || "#ffffff"}" opacity="0.98"/>
          <path d="M113 251 L128 314 L143 251 Z" fill="${outfit.tie || outfit.accent}"/>
          <path d="M73 278 C104 304 152 304 184 278" fill="none" stroke="${outfit.accent}" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
          <path d="M75 348 C80 302 94 267 112 244" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.12"/>
          <path d="M181 348 C176 302 162 267 144 244" fill="none" stroke="#071629" stroke-width="4" opacity="0.2"/>
          <g transform="translate(157 276)">
            <path d="M0 0 L30 0 L30 34 C19 39 11 39 0 34 Z" fill="#123a5d" stroke="${outfit.accent}" stroke-width="3"/>
            <path d="M15 5 L15 28 M5 16 L25 16" stroke="${outfit.accent}" stroke-width="3" stroke-linecap="round"/>
          </g>
          <path d="M89 238 C101 260 116 272 128 272 C141 272 155 260 167 238 C151 229 104 229 89 238 Z" fill="url(#avatarSkin)"/>
          ${renderHair(state.hairStyle, hairColour)}
          <path d="${getFacePath(face.id)}" fill="url(#avatarSkin)"/>
          ${renderHairFront(state.hairStyle)}
          <path d="M54 166 C51 151 52 139 58 132" fill="none" stroke="${skin.shadow}" stroke-width="13" stroke-linecap="round" opacity="0.36"/>
          <path d="M202 166 C205 151 204 139 198 132" fill="none" stroke="${skin.shadow}" stroke-width="13" stroke-linecap="round" opacity="0.36"/>
          <path d="M88 129 C100 120 113 120 122 128" fill="none" stroke="url(#avatarHair)" stroke-width="6" stroke-linecap="round" transform="translate(0 ${browYOffset})"/>
          <path d="M134 128 C146 120 160 120 170 130" fill="none" stroke="url(#avatarHair)" stroke-width="6" stroke-linecap="round" transform="translate(0 ${browYOffset})"/>
          <g transform="translate(0 ${eyeYOffset}) scale(${eyeScale} 1)" transform-origin="128 154">
            <ellipse cx="103" cy="156" rx="18" ry="21" fill="#ffffff"/>
            <ellipse cx="153" cy="156" rx="18" ry="21" fill="#ffffff"/>
            <circle cx="106" cy="157" r="11" fill="url(#avatarEye)"/>
            <circle cx="150" cy="157" r="11" fill="url(#avatarEye)"/>
            <circle cx="106" cy="157" r="5.5" fill="#071629"/>
            <circle cx="150" cy="157" r="5.5" fill="#071629"/>
            <circle cx="101" cy="151" r="4" fill="#ffffff"/>
            <circle cx="145" cy="151" r="4" fill="#ffffff"/>
          </g>
          <path d="M129 170 C121 184 121 192 134 194" fill="none" stroke="${skin.shadow}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
          <ellipse cx="92" cy="181" rx="16" ry="8" fill="#ffffff" opacity="0.13"/>
          <ellipse cx="166" cy="181" rx="16" ry="8" fill="#ffffff" opacity="0.13"/>
          ${freckles}
          <path d="${smilePath}" fill="none" stroke="#3b1d17" stroke-width="5" stroke-linecap="round"/>
          <path d="M108 202 C119 214 139 214 150 202" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="${face.id === "calm" ? "0" : "0.78"}"/>
          ${renderAccessory(state.accessory, outfit)}
        </g>
      </svg>
    `;
  }

  function renderLayeredBody(outfit, skin) {
    const lower = outfit.lower || "trousers";
    const fill = outfit.fill || "#123a5d";
    const lowerFill = outfit.lowerFill || fill;
    const accent = outfit.accent || "#f6b73c";
    const shirt = outfit.shirt || "#f4f7fb";
    const tie = outfit.tie || accent;
    const skinFill = "url(#avatarSkin)";
    const shoes = lower === "sports-shorts" ? "#0b162a" : "#17202a";
    const sock = lower === "dress" || lower === "shorts" || lower === "sports-shorts" ? "#ffffff" : "#1a2436";

    const arms = `
      <g data-avatar-slot="arms">
        <path d="M86 243 C66 265 55 306 53 354" fill="none" stroke="url(#avatarUniform)" stroke-width="28" stroke-linecap="round"/>
        <path d="M194 243 C216 266 226 306 227 354" fill="none" stroke="url(#avatarUniform)" stroke-width="28" stroke-linecap="round"/>
        <ellipse cx="52" cy="365" rx="13" ry="16" fill="${skinFill}"/>
        <ellipse cx="228" cy="365" rx="13" ry="16" fill="${skinFill}"/>
      </g>
    `;

    const crest = `
      <g transform="translate(161 278)" data-avatar-slot="crest">
        <path d="M0 0 L28 0 L28 32 C18 37 10 37 0 32 Z" fill="#123a5d" stroke="${accent}" stroke-width="3"/>
        <path d="M14 5 L14 26 M5 15 L23 15" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
      </g>
    `;

    const legs = (legTop = 370) => `
      <g data-avatar-slot="legs">
        <path d="M104 ${legTop} C101 410 101 447 106 486" fill="none" stroke="${skinFill}" stroke-width="24" stroke-linecap="round"/>
        <path d="M176 ${legTop} C179 410 179 447 174 486" fill="none" stroke="${skinFill}" stroke-width="24" stroke-linecap="round"/>
        <path d="M98 430 L122 430" stroke="${sock}" stroke-width="15" stroke-linecap="round"/>
        <path d="M158 430 L182 430" stroke="${sock}" stroke-width="15" stroke-linecap="round"/>
        <path d="M89 496 C101 484 120 484 135 497" fill="${shoes}"/>
        <path d="M145 497 C160 484 179 484 191 496" fill="${shoes}"/>
      </g>
    `;

    if (lower === "dress") {
      return `
        ${arms}
        ${legs(386)}
        <g data-avatar-slot="uniform">
          <path d="M82 236 C111 222 168 222 198 236 L218 402 C179 427 101 427 62 402 Z" fill="url(#avatarUniform)"/>
          <path d="M94 246 L140 307 L186 246 L172 236 L140 272 L108 236 Z" fill="${shirt}" opacity="0.94"/>
          <path d="M101 334 C127 352 153 352 180 334" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.88"/>
          <path d="M92 273 C116 292 165 292 189 273" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.14"/>
          ${crest}
        </g>
      `;
    }

    if (lower === "plaid-skirt") {
      return `
        ${arms}
        ${legs(390)}
        <g data-avatar-slot="uniform">
          <path d="M80 240 C110 223 170 223 200 240 L190 335 C158 356 122 356 90 335 Z" fill="url(#avatarUniform)"/>
          <path d="M92 246 L140 309 L188 246 L174 237 L140 273 L106 237 Z" fill="${shirt}"/>
          <path d="M124 250 L140 316 L156 250 Z" fill="${tie}"/>
          <path d="M81 338 L199 338 L215 399 C176 420 104 420 65 399 Z" fill="url(#avatarPlaid)"/>
          <path d="M78 338 C108 354 172 354 202 338" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
          ${crest}
        </g>
      `;
    }

    if (lower === "shorts" || lower === "sports-shorts") {
      return `
        ${arms}
        ${legs(378)}
        <g data-avatar-slot="uniform">
          <path d="M82 239 C111 224 169 224 198 239 L188 338 C156 356 124 356 92 338 Z" fill="url(#avatarUniform)"/>
          <path d="M95 246 L140 306 L185 246" fill="${shirt}" opacity="0.96"/>
          <path d="M86 338 L132 338 L124 390 L82 390 Z" fill="${lowerFill}"/>
          <path d="M148 338 L194 338 L198 390 L156 390 Z" fill="${lowerFill}"/>
          <path d="M140 340 L140 386" stroke="#071629" stroke-width="4" opacity="0.24"/>
          <path d="M105 266 L175 266" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
          ${crest}
        </g>
      `;
    }

    return `
      ${arms}
      <g data-avatar-slot="legs">
        <path d="M92 330 L134 330 L129 488 L98 488 Z" fill="${lowerFill}"/>
        <path d="M146 330 L188 330 L182 488 L151 488 Z" fill="${lowerFill}"/>
        <path d="M140 334 L140 488" stroke="#071629" stroke-width="5" opacity="0.28"/>
        <path d="M89 497 C103 484 123 484 137 497" fill="${shoes}"/>
        <path d="M143 497 C157 484 177 484 191 497" fill="${shoes}"/>
      </g>
      <g data-avatar-slot="uniform">
        <path d="M78 240 C110 222 170 222 202 240 L190 342 C158 365 122 365 90 342 Z" fill="url(#avatarUniform)"/>
        <path d="M91 246 L140 322 L189 246 L174 238 L140 276 L106 238 Z" fill="${shirt}"/>
        <path d="M124 250 L140 326 L156 250 Z" fill="${tie}"/>
        <path d="M90 341 C118 358 163 358 190 341" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.86"/>
        <circle cx="140" cy="296" r="4" fill="${accent}"/>
        <circle cx="140" cy="318" r="4" fill="${accent}"/>
        ${crest}
      </g>
    `;
  }

  function renderLayeredAccessory(accessory, outfit) {
    if (accessory === "backpack") {
      return `
        <g data-avatar-slot="accessory">
          <path d="M58 256 C38 284 36 349 60 391 L83 382 C72 334 76 292 98 254 Z" fill="#17202a" opacity="0.82"/>
          <path d="M222 256 C242 284 244 349 220 391 L197 382 C208 334 204 292 182 254 Z" fill="#17202a" opacity="0.82"/>
        </g>
      `;
    }
    if (accessory === "badge") {
      return `<g data-avatar-slot="accessory"><rect x="165" y="292" width="42" height="22" rx="6" fill="#ffffff" opacity="0.95"/><path d="M174 303 L198 303" stroke="${outfit.accent}" stroke-width="3" stroke-linecap="round"/></g>`;
    }
    if (accessory === "scarf") {
      return `<g data-avatar-slot="accessory"><path d="M103 235 C124 252 156 252 177 235 L189 287 C160 307 120 307 91 287 Z" fill="#e85d4f"/><path d="M140 247 L140 306" stroke="#ffffff" stroke-width="7" opacity="0.28"/></g>`;
    }
    return "";
  }

  function renderLayeredAvatar() {
    const skin = findById(skinTones, state.skinTone);
    const face = findById(faceStyles, state.faceStyle);
    const hairColour = findById(hairColours, state.hairColour).color;
    const outfit = findById(outfits, state.outfit);
    const freckles = face.id === "freckled"
      ? `<g fill="${skin.shadow}" opacity="0.58"><circle cx="107" cy="175" r="2.5"/><circle cx="119" cy="181" r="2"/><circle cx="148" cy="175" r="2.5"/><circle cx="136" cy="181" r="2"/></g>`
      : "";
    const smilePath = face.id === "calm" ? "M111 204 C121 211 136 211 146 204" : "M108 201 C119 217 139 217 150 201";
    const eyeScale = face.id === "bright" ? 1.08 : face.id === "calm" ? 0.92 : 1;
    const eyeYOffset = face.id === "calm" ? 2 : 0;
    const browYOffset = face.id === "bright" ? -4 : 0;
    const faceAccessory = ["glasses", "headphones", "earrings"].includes(state.accessory)
      ? renderAccessory(state.accessory, outfit)
      : "";

    return `
      <svg class="avatar-layered-rig" viewBox="0 0 280 520" role="img" aria-label="Full-body modular avatar preview">
        <defs>
          <radialGradient id="avatarSkin" cx="38%" cy="28%" r="76%">
            <stop offset="0" stop-color="#fff1dc"/>
            <stop offset="0.2" stop-color="${skin.color}"/>
            <stop offset="1" stop-color="${skin.shadow}"/>
          </radialGradient>
          <linearGradient id="avatarHair" x1="0.18" x2="0.88" y1="0" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.24"/>
            <stop offset="0.18" stop-color="${hairColour}"/>
            <stop offset="1" stop-color="#0f0c0b"/>
          </linearGradient>
          <linearGradient id="avatarUniform" x1="0.18" x2="0.86" y1="0" y2="1">
            <stop offset="0" stop-color="#4d94c3"/>
            <stop offset="0.42" stop-color="${outfit.fill}"/>
            <stop offset="1" stop-color="#071629"/>
          </linearGradient>
          <pattern id="avatarPlaid" width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill="${outfit.lowerFill || "#1c426b"}"/>
            <path d="M0 6 H22 M0 16 H22 M7 0 V22 M16 0 V22" stroke="#e8f6ff" stroke-width="2" opacity="0.72"/>
            <path d="M0 11 H22 M11 0 V22" stroke="${outfit.accent}" stroke-width="2" opacity="0.78"/>
          </pattern>
          <radialGradient id="avatarEye" cx="35%" cy="28%" r="70%">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="0.42" stop-color="#73d9ff"/>
            <stop offset="1" stop-color="#123a5d"/>
          </radialGradient>
          <filter id="avatarSoftShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="12" stdDeviation="9" flood-color="#071629" flood-opacity="0.28"/>
          </filter>
        </defs>
        <g filter="url(#avatarSoftShadow)">
          <ellipse cx="140" cy="500" rx="88" ry="16" fill="#17202a" opacity="0.16"/>
          ${renderLayeredAccessory(state.accessory, outfit)}
          ${renderLayeredBody(outfit, skin)}
          <g data-avatar-slot="head" transform="translate(12 12)">
            <path d="M89 238 C101 260 116 272 128 272 C141 272 155 260 167 238 C151 229 104 229 89 238 Z" fill="url(#avatarSkin)"/>
            ${renderHair(state.hairStyle, hairColour)}
            <path d="${getFacePath(face.id)}" fill="url(#avatarSkin)"/>
            ${renderHairFront(state.hairStyle)}
            <path d="M54 166 C51 151 52 139 58 132" fill="none" stroke="${skin.shadow}" stroke-width="13" stroke-linecap="round" opacity="0.36"/>
            <path d="M202 166 C205 151 204 139 198 132" fill="none" stroke="${skin.shadow}" stroke-width="13" stroke-linecap="round" opacity="0.36"/>
            <path d="M88 129 C100 120 113 120 122 128" fill="none" stroke="url(#avatarHair)" stroke-width="6" stroke-linecap="round" transform="translate(0 ${browYOffset})"/>
            <path d="M134 128 C146 120 160 120 170 130" fill="none" stroke="url(#avatarHair)" stroke-width="6" stroke-linecap="round" transform="translate(0 ${browYOffset})"/>
            <g transform="translate(0 ${eyeYOffset}) scale(${eyeScale} 1)" transform-origin="128 154">
              <ellipse cx="103" cy="156" rx="18" ry="21" fill="#ffffff"/>
              <ellipse cx="153" cy="156" rx="18" ry="21" fill="#ffffff"/>
              <circle cx="106" cy="157" r="11" fill="url(#avatarEye)"/>
              <circle cx="150" cy="157" r="11" fill="url(#avatarEye)"/>
              <circle cx="106" cy="157" r="5.5" fill="#071629"/>
              <circle cx="150" cy="157" r="5.5" fill="#071629"/>
              <circle cx="101" cy="151" r="4" fill="#ffffff"/>
              <circle cx="145" cy="151" r="4" fill="#ffffff"/>
            </g>
            <path d="M129 170 C121 184 121 192 134 194" fill="none" stroke="${skin.shadow}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
            <ellipse cx="92" cy="181" rx="16" ry="8" fill="#ffffff" opacity="0.13"/>
            <ellipse cx="166" cy="181" rx="16" ry="8" fill="#ffffff" opacity="0.13"/>
            ${freckles}
            <path d="${smilePath}" fill="none" stroke="#3b1d17" stroke-width="5" stroke-linecap="round"/>
            <path d="M108 202 C119 214 139 214 150 202" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="${face.id === "calm" ? "0" : "0.78"}"/>
            ${faceAccessory}
          </g>
        </g>
      </svg>
    `;
  }

  function getProductionRigConfig() {
    return avatarParts.productionRigs && typeof avatarParts.productionRigs === "object"
      ? avatarParts.productionRigs
      : null;
  }

  function getProductionRigForBase(characterBase) {
    const config = getProductionRigConfig();
    if (!config || !characterBase?.assetRigId) return null;
    return config.rigs?.[characterBase.assetRigId] || null;
  }

  function getRigLayerTint(layerPath, skin, hairColour, outfit) {
    const isDefaultUniform = ["ecc-winter-trousers-blazer", "ecc-winter-skirt-jumper"].includes(outfit.id);
    if (layerPath.startsWith("hair/")) {
      return {
        kind: "hair",
        color: hairColour,
        opacity: hairColour === "#5a3524" ? 0.2 : 0.68,
        mode: "color"
      };
    }
    if (layerPath === "head/base.png" || layerPath === "body/skin-neck.png") {
      return {
        kind: "skin",
        color: skin.color,
        opacity: skin.id === "sand" ? 0.14 : 0.46,
        mode: "color"
      };
    }
    if (layerPath.endsWith("forearm-hand.png")) {
      return {
        kind: "skin",
        color: skin.color,
        opacity: skin.id === "sand" ? 0.08 : 0.22,
        mode: "color"
      };
    }
    if (layerPath === "uniform/blazer.png" || layerPath === "uniform/jumper.png") {
      return {
        kind: "uniform",
        color: outfit.fill || "#123a5d",
        opacity: isDefaultUniform ? 0.08 : 0.55,
        mode: "color"
      };
    }
    if (layerPath === "uniform/lower.png") {
      return {
        kind: "uniform",
        color: outfit.lowerFill || outfit.fill || "#1a2436",
        opacity: isDefaultUniform ? 0.08 : 0.52,
        mode: "color"
      };
    }
    if (layerPath === "uniform/tie.png") {
      return {
        kind: "uniform",
        color: outfit.tie || outfit.accent || "#0f8f8c",
        opacity: isDefaultUniform ? 0.08 : 0.62,
        mode: "color"
      };
    }
    if (layerPath === "uniform/shirt.png") {
      return {
        kind: "uniform",
        color: outfit.shirt || "#f4f7fb",
        opacity: isDefaultUniform ? 0.04 : 0.32,
        mode: "color"
      };
    }
    return null;
  }

  function getProductionLayerOrder(config) {
    return Array.isArray(config.layerOrder) ? [...config.layerOrder] : [];
  }

  function getRigLayerMotion(layerPath) {
    if (layerPath === "head/base.png") return "head";
    if (layerPath.startsWith("hair/")) return "hair";
    if (layerPath.startsWith("face/")) return "head";
    if (layerPath.startsWith("arms/left")) return "left-arm";
    if (layerPath.startsWith("arms/right")) return "right-arm";
    if (layerPath.startsWith("legs/left")) return "left-leg";
    if (layerPath.startsWith("legs/right")) return "right-leg";
    return "body";
  }

  function renderProductionRigTint(imagePath, layerPath, tint) {
    if (!tint) return "";
    return `
      <span
        class="avatar-production-rig-tint"
        aria-hidden="true"
        data-rig-motion="${escapeHtml(getRigLayerMotion(layerPath))}"
        data-rig-layer="${escapeHtml(`${layerPath}:tint`)}"
        data-rig-tint-kind="${escapeHtml(tint.kind)}"
        style="--rig-mask: url('${escapeHtml(imagePath)}'); --rig-tint: ${escapeHtml(tint.color)}; --rig-tint-opacity: ${escapeHtml(tint.opacity)}; --rig-tint-mode: ${escapeHtml(tint.mode)};"
      ></span>
    `;
  }

  function renderProductionRigLayer(basePath, layerPath, skin, hairColour, outfit) {
    const imagePath = `${basePath}/${layerPath}`;
    const tint = getRigLayerTint(layerPath, skin, hairColour, outfit);
    return `
      <img
        class="avatar-production-rig-layer"
        src="${escapeHtml(imagePath)}"
        alt=""
        aria-hidden="true"
        decoding="async"
        data-rig-motion="${escapeHtml(getRigLayerMotion(layerPath))}"
        data-rig-layer="${escapeHtml(layerPath)}"
      >
      ${renderProductionRigTint(imagePath, layerPath, tint)}
    `;
  }

  function getProductionFeatureAnchors(rig) {
    if (rig?.id === "ecc-girl-base-neutral") {
      return {
        eyeY: 415,
        leftEyeX: 454,
        rightEyeX: 544,
        browY: 377,
        cheekY: 470,
        mouthY: 506,
        earY: 440,
        leftEarX: 392,
        rightEarX: 624,
        neckY: 548,
        chestY: 716
      };
    }
    return {
      eyeY: 436,
      leftEyeX: 454,
      rightEyeX: 544,
      browY: 397,
      cheekY: 490,
      mouthY: 526,
      earY: 458,
      leftEarX: 390,
      rightEarX: 626,
      neckY: 566,
      chestY: 742
    };
  }

  function renderProductionRigFeatureOverlay(rig, skin, outfit) {
    const anchors = getProductionFeatureAnchors(rig);
    const freckles = state.faceStyle === "freckled"
      ? `
        <g data-rig-feature="freckles" fill="${escapeHtml(skin.shadow)}" opacity="0.68">
          <circle cx="${anchors.leftEyeX - 34}" cy="${anchors.cheekY}" r="7"/>
          <circle cx="${anchors.leftEyeX - 8}" cy="${anchors.cheekY + 14}" r="5"/>
          <circle cx="${anchors.rightEyeX + 34}" cy="${anchors.cheekY}" r="7"/>
          <circle cx="${anchors.rightEyeX + 8}" cy="${anchors.cheekY + 14}" r="5"/>
          <circle cx="512" cy="${anchors.cheekY + 18}" r="4.5"/>
        </g>
      `
      : "";
    const faceAccent = state.faceStyle === "bright"
      ? `
        <g data-rig-feature="bright-eyes" fill="#ffffff" opacity="0.82">
          <circle cx="${anchors.leftEyeX - 14}" cy="${anchors.eyeY - 15}" r="7"/>
          <circle cx="${anchors.rightEyeX - 14}" cy="${anchors.eyeY - 15}" r="7"/>
        </g>
      `
      : state.faceStyle === "sharp"
        ? `
          <g data-rig-feature="focused-brows" fill="none" stroke="#2b1710" stroke-width="9" stroke-linecap="round" opacity="0.88">
            <path d="M${anchors.leftEyeX - 48} ${anchors.browY} C${anchors.leftEyeX - 18} ${anchors.browY - 16} ${anchors.leftEyeX + 26} ${anchors.browY - 13} ${anchors.leftEyeX + 48} ${anchors.browY}"/>
            <path d="M${anchors.rightEyeX - 48} ${anchors.browY} C${anchors.rightEyeX - 18} ${anchors.browY - 13} ${anchors.rightEyeX + 26} ${anchors.browY - 16} ${anchors.rightEyeX + 48} ${anchors.browY}"/>
          </g>
        `
        : state.faceStyle === "calm"
          ? `<path data-rig-feature="calm-smile" d="M472 ${anchors.mouthY} C494 ${anchors.mouthY + 18} 534 ${anchors.mouthY + 18} 556 ${anchors.mouthY}" fill="none" stroke="#3b1d17" stroke-width="8" stroke-linecap="round" opacity="0.82"/>`
          : "";
    const glasses = state.accessory === "glasses"
      ? `
        <g data-rig-feature="glasses" fill="none" stroke="#17202a" stroke-width="9" opacity="0.86">
          <ellipse cx="${anchors.leftEyeX}" cy="${anchors.eyeY}" rx="44" ry="39"/>
          <ellipse cx="${anchors.rightEyeX}" cy="${anchors.eyeY}" rx="44" ry="39"/>
          <path d="M${anchors.leftEyeX + 44} ${anchors.eyeY} L${anchors.rightEyeX - 44} ${anchors.eyeY}"/>
        </g>
      `
      : "";
    const earrings = state.accessory === "earrings"
      ? `<g data-rig-feature="earrings" fill="#f6b73c"><circle cx="${anchors.leftEarX}" cy="${anchors.earY + 38}" r="12"/><circle cx="${anchors.rightEarX}" cy="${anchors.earY + 38}" r="12"/></g>`
      : "";
    const badge = state.accessory === "badge"
      ? `<g data-rig-feature="name-badge"><rect x="616" y="${anchors.chestY}" width="112" height="52" rx="13" fill="#ffffff" opacity="0.94"/><path d="M640 ${anchors.chestY + 27} L704 ${anchors.chestY + 27}" stroke="${escapeHtml(outfit.accent || "#f6b73c")}" stroke-width="8" stroke-linecap="round"/></g>`
      : "";
    const scarf = state.accessory === "scarf"
      ? `<path data-rig-feature="scarf" d="M418 ${anchors.neckY + 8} C464 ${anchors.neckY + 44} 558 ${anchors.neckY + 44} 606 ${anchors.neckY + 8} L640 ${anchors.neckY + 128} C578 ${anchors.neckY + 170} 446 ${anchors.neckY + 170} 384 ${anchors.neckY + 128} Z" fill="#e85d4f" opacity="0.92"/>`
      : "";
    const headphones = state.accessory === "headphones"
      ? `
        <g data-rig-feature="headphones" fill="none" stroke="#17202a" stroke-linecap="round">
          <path d="M382 ${anchors.eyeY - 18} C392 ${anchors.eyeY - 150} 444 ${anchors.eyeY - 214} 512 ${anchors.eyeY - 214} C580 ${anchors.eyeY - 214} 632 ${anchors.eyeY - 150} 642 ${anchors.eyeY - 18}" stroke-width="14"/>
          <rect x="352" y="${anchors.eyeY - 22}" width="46" height="94" rx="20" fill="#17202a" stroke="none"/>
          <rect x="626" y="${anchors.eyeY - 22}" width="46" height="94" rx="20" fill="#17202a" stroke="none"/>
        </g>
      `
      : "";
    return `
      <svg class="avatar-production-rig-overlay" viewBox="0 0 1024 1536" aria-hidden="true">
        ${scarf}
        ${freckles}
        ${faceAccent}
        ${glasses}
        ${earrings}
        ${badge}
        ${headphones}
      </svg>
    `;
  }

  function renderProductionRigAvatar(characterBase) {
    const config = getProductionRigConfig();
    const rig = getProductionRigForBase(characterBase);
    if (!config || !rig) return renderLayeredAvatar();

    const skin = findById(skinTones, state.skinTone);
    const hairColour = findById(hairColours, state.hairColour).color;
    const outfit = findById(outfits, state.outfit);
    const layerOrder = getProductionLayerOrder(config);
    const basePath = `${config.basePath}/${rig.fileRoot}`;
    const animationState = state.animationState || "idle";

    return `
      <div
        class="avatar-production-rig is-${escapeHtml(animationState)}"
        role="img"
        aria-label="${escapeHtml(rig.label || characterBase.label)} avatar preview"
      >
        ${layerOrder.map(layerPath => renderProductionRigLayer(basePath, layerPath, skin, hairColour, outfit)).join("")}
        ${renderProductionRigFeatureOverlay(rig, skin, outfit)}
      </div>
    `;
  }

  function buildAvatarSpec(profile = state) {
    const characterBase = findById(characterBases, profile.characterBase);
    const outfit = findById(outfits, profile.outfit);
    const productionRig = getProductionRigForBase(characterBase);
    return {
      schemaVersion: avatarParts.schemaVersion || 1,
      rigId: avatarParts.rig?.id || "avatar-svg-prototype-v1",
      renderMode: productionRig ? "production-png-rig" : characterBase?.partMode === "layered" ? "layered" : "reference-pose",
      slots: {
        body: profile.characterBase,
        assetRig: productionRig?.id || null,
        skinTone: profile.skinTone,
        faceStyle: profile.faceStyle,
        hairStyle: profile.hairStyle,
        hairColour: profile.hairColour,
        uniform: profile.outfit,
        accessory: profile.accessory,
        animationState: profile.animationState || "idle"
      },
      sources: {
        uniform: outfit?.source || outfit?.family || "prototype",
        base: productionRig ? "avatar-builder-png-rig" : characterBase?.imagePath ? "ecc-character-reference" : "layered-svg-prototype",
        manifest: productionRig ? avatarParts.productionRigs?.manifestPath : null,
        layerRoot: productionRig ? `${avatarParts.productionRigs?.basePath}/${productionRig.fileRoot}` : null
      }
    };
  }

  function renderAvatar() {
    const characterBase = findById(characterBases, state.characterBase);
    if (characterBase?.partMode === "production-png-rig") return renderProductionRigAvatar(characterBase);
    if (characterBase?.partMode === "layered") return renderLayeredAvatar();
    if (!characterBase?.imagePath) return renderPrototypeAvatar();

    return `
      <img
        class="avatar-character-art"
        src="${escapeHtml(characterBase.imagePath)}"
        alt="${escapeHtml(characterBase.label)} avatar preview"
      >
    `;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderBadges() {
    const badges = document.getElementById("avatar-profile-badges");
    if (!badges) return;
    const authState = getAuthState();
    const session = getSession();
    const login = authState?.studentLogin || {};
    const student = getStudentName();
    const classCode = login.classCode || session.classCode || "Class not set";
    const saved = readSavedAvatar();
    badges.innerHTML = [
      `<span class="badge">Student: ${escapeHtml(student)}</span>`,
      `<span class="badge">Class: ${escapeHtml(classCode)}</span>`,
      `<span class="badge">${saved ? "Avatar saved" : "Starter build"}</span>`
    ].join("");
  }

  function syncInputs() {
    const occupation = document.getElementById("avatar-future-occupation");
    const training = document.getElementById("avatar-future-training");
    const strength = document.getElementById("avatar-future-strength");
    if (occupation) occupation.value = state.occupation;
    if (training) training.value = state.training;
    if (strength) strength.value = state.strength;
  }

  function renderPreview() {
    const container = document.getElementById("avatar-render");
    if (container) container.innerHTML = renderAvatar();
    const name = getStudentName();
    const occupation = state.occupation.trim() || "Future pathway open";
    const completion = getCompletion();
    setText("avatar-name", name);
    setText("avatar-occupation", occupation);
    setText("avatar-progress-label", `${completion}% complete`);
    const fill = document.getElementById("avatar-progress-fill");
    if (fill) fill.style.width = `${completion}%`;
  }

  function renderChoiceButtons(containerId, items, key, group) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = getSelectableItems(items).map(item => `
      <button class="avatar-option ${state[key] === item.id ? "is-selected" : ""}" type="button" data-option-group="${group}" data-avatar-key="${key}" data-avatar-value="${item.id}">
        <span class="option-token">
          ${item.imagePath
            ? `<img class="option-token-image" src="${escapeHtml(item.imagePath)}" alt="">`
            : escapeHtml(item.token || item.label.slice(0, 1))}
        </span>
        <span>
          ${escapeHtml(item.label)}
          ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
        </span>
      </button>
    `).join("");
  }

  function renderSwatches(containerId, items, key) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
      <button class="avatar-swatch ${state[key] === item.id ? "is-selected" : ""}" type="button" data-avatar-key="${key}" data-avatar-value="${item.id}">
        <span style="background: ${escapeHtml(item.color)}"></span>
        <span>${escapeHtml(item.label)}</span>
      </button>
    `).join("");
  }

  function renderControls() {
    renderChoiceButtons("character-base-options", characterBases, "characterBase", "character");
    renderSwatches("skin-tone-options", skinTones, "skinTone");
    renderChoiceButtons("face-options", faceStyles, "faceStyle", "face");
    renderChoiceButtons("hair-options", hairStyles, "hairStyle", "hair");
    renderSwatches("hair-color-options", hairColours, "hairColour");
    renderChoiceButtons("outfit-options", outfits, "outfit", "outfit");
    renderChoiceButtons("accessory-options", accessories, "accessory", "accessory");
  }

  function renderUnlocks() {
    const container = document.getElementById("avatar-unlock-grid");
    if (!container) return;
    container.innerHTML = unlocks.map(item => `
      <article class="avatar-unlock-card">
        <div class="unlock-art" style="--unlock-color: ${escapeHtml(item.color)}">${escapeHtml(item.token)}</div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.state)}</span>
      </article>
    `).join("");
  }

  function renderAll() {
    renderControls();
    renderPreview();
    renderBadges();
    renderUnlocks();
  }

  function selectTab(tabId) {
    document.querySelectorAll("[data-avatar-tab]").forEach(button => {
      const active = button.dataset.avatarTab === tabId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".avatar-tab-panel").forEach(panel => {
      const active = panel.id === `avatar-panel-${tabId}`;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function saveAvatar() {
    state = {
      ...state,
      occupation: document.getElementById("avatar-future-occupation")?.value.trim() || "",
      training: document.getElementById("avatar-future-training")?.value.trim() || "",
      strength: document.getElementById("avatar-future-strength")?.value.trim() || ""
    };
    const avatar = {
      ...state,
      schemaVersion: avatarParts.schemaVersion || 1,
      avatarSpec: buildAvatarSpec(),
      studentName: getStudentName(),
      completion: getCompletion(),
      savedAt: new Date().toISOString(),
      moduleId: "avatar-studio"
    };
    writeSavedAvatar(avatar);
    setText("avatar-save-status", `Saved ${avatar.completion}% avatar profile.`);
    renderAll();
  }

  function randomFrom(items) {
    const selectable = getSelectableItems(items);
    return selectable[Math.floor(Math.random() * selectable.length)].id;
  }

  function randomiseAvatar() {
    state = {
      ...state,
      skinTone: randomFrom(skinTones),
      characterBase: randomFrom(characterBases),
      faceStyle: randomFrom(faceStyles),
      hairStyle: randomFrom(hairStyles),
      hairColour: randomFrom(hairColours),
      outfit: randomFrom(outfits),
      accessory: randomFrom(accessories)
    };
    setText("avatar-save-status", "New combination ready.");
    renderAll();
  }

  function resetAvatar() {
    state = { ...defaults };
    syncInputs();
    setText("avatar-save-status", "Starter avatar restored.");
    renderAll();
  }

  function setupEvents() {
    document.querySelectorAll("[data-avatar-tab]").forEach(button => {
      button.addEventListener("click", () => selectTab(button.dataset.avatarTab));
    });

    document.addEventListener("click", event => {
      const button = event.target.closest("[data-avatar-key][data-avatar-value]");
      if (!button) return;
      const nextState = {
        ...state,
        [button.dataset.avatarKey]: button.dataset.avatarValue
      };
      if (button.dataset.avatarKey === "characterBase") {
        Object.assign(nextState, getBaseDefaultState(button.dataset.avatarValue));
      }
      state = normaliseState(nextState);
      renderAll();
    });

    ["avatar-future-occupation", "avatar-future-training", "avatar-future-strength"].forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("input", () => {
        state = {
          ...state,
          occupation: document.getElementById("avatar-future-occupation")?.value.trim() || "",
          training: document.getElementById("avatar-future-training")?.value.trim() || "",
          strength: document.getElementById("avatar-future-strength")?.value.trim() || ""
        };
        renderPreview();
      });
    });

    document.getElementById("avatar-save")?.addEventListener("click", saveAvatar);
    document.getElementById("avatar-randomise")?.addEventListener("click", randomiseAvatar);
    document.getElementById("avatar-reset")?.addEventListener("click", resetAvatar);
  }

  function init() {
    const saved = readSavedAvatar();
    if (saved) state = normaliseState({ ...defaults, ...saved });
    syncInputs();
    setupEvents();
    renderAll();
  }

  init();
})();
