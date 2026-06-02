(function () {
  const AVATAR_STORAGE_KEY = "career-empire-avatar-v1";
  const SESSION_STORAGE_KEY = "career-empire-session";
  const DEFAULT_DISPLAY_MS = 3800;
  const DEFAULT_COOLDOWN_MS = 9000;

  const scriptUrl = document.currentScript?.src || window.location.href;
  const baseUrl = new URL("../../Assets/Images and Animations/Avatar Studio/elevenlabs-animation-videos/", scriptUrl).href;

  const CLIPS = {
    "girl-idle": { id: "girl-idle", character: "girl", motion: "idle", src: "girl/ecc-girl-idle.mp4", label: "Ready" },
    "girl-wave": { id: "girl-wave", character: "girl", motion: "wave", src: "girl/ecc-girl-wave.mp4", label: "Mission joined" },
    "girl-point": { id: "girl-point", character: "girl", motion: "point", src: "girl/ecc-girl-point.mp4", label: "Check the signal" },
    "girl-run": { id: "girl-run", character: "girl", motion: "run", src: "girl/ecc-girl-run.mp4", label: "Challenge started" },
    "girl-celebrate": { id: "girl-celebrate", character: "girl", motion: "celebrate", src: "girl/ecc-girl-celebrate.mp4", label: "Salary banked" },
    "boy-wave": { id: "boy-wave", character: "boy", motion: "wave", src: "boy/ecc-boy-wave.mp4", label: "Mission joined" },
    "boy-celebrate": { id: "boy-celebrate", character: "boy", motion: "celebrate", src: "boy/ecc-boy-celebrate.mp4", label: "Salary banked" },
    "boy-think": { id: "boy-think", character: "boy", motion: "think", src: "boy/ecc-boy-think.mp4", label: "Review the signal" },
    "boy-action": { id: "boy-action", character: "boy", motion: "action-run", src: "boy/ecc-boy-action-run-borderline.mp4", label: "Energy boost" },
    "boy-point": { id: "boy-point", character: "boy", motion: "point", src: "boy/ecc-boy-point-with-text-artifact.mp4", label: "Check the signal" }
  };

  const ALIASES = {
    "mission-start": { boy: "boy-wave", girl: "girl-wave" },
    "core-pass": { boy: "boy-wave", girl: "girl-wave" },
    "reward": { boy: "boy-celebrate", girl: "girl-celebrate" },
    "salary-banked": { boy: "boy-celebrate", girl: "girl-celebrate" },
    "proof-needs-work": { boy: "boy-think", girl: "girl-point" },
    "nudge": { boy: "boy-think", girl: "girl-point" },
    "song-remix": { boy: "girl-idle", girl: "girl-idle" },
    "challenge-start": { boy: "boy-action", girl: "girl-run" }
  };

  let root = null;
  let video = null;
  let caption = null;
  let hideTimer = 0;
  let lastShown = {};

  function readJsonStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function getSavedAvatar() {
    const session = readJsonStorage(SESSION_STORAGE_KEY, {});
    if (session?.avatar) return session.avatar;
    const store = readJsonStorage(AVATAR_STORAGE_KEY, {});
    return store?.latest || store?.currentProfile || null;
  }

  function getPreferredCharacter(explicitCharacter) {
    if (explicitCharacter === "girl" || explicitCharacter === "boy") return explicitCharacter;
    const avatar = getSavedAvatar();
    const avatarText = JSON.stringify(avatar || {}).toLowerCase();
    if (/\bgirl\b|skirt|dress|female/.test(avatarText)) return "girl";
    return "boy";
  }

  function resolveClip(momentId, options = {}) {
    if (CLIPS[momentId]) return CLIPS[momentId];
    const alias = ALIASES[momentId];
    if (!alias) return null;
    const character = getPreferredCharacter(options.character);
    const clipId = typeof alias === "string" ? alias : alias[character] || alias.boy || alias.girl;
    return CLIPS[clipId] || null;
  }

  function getTargetElement(options = {}) {
    if (options.targetElement instanceof Element) return options.targetElement;
    if (options.targetSelector) return document.querySelector(options.targetSelector);
    return null;
  }

  function ensureRoot(targetElement = null) {
    if (root) return root;
    root = document.createElement("div");
    root.className = "ce-avatar-moment";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <div class="ce-avatar-moment__shell">
        <video class="ce-avatar-moment__video" muted playsinline loop preload="metadata"></video>
        <div class="ce-avatar-moment__caption"></div>
      </div>
    `;
    video = root.querySelector(".ce-avatar-moment__video");
    caption = root.querySelector(".ce-avatar-moment__caption");
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.disablePictureInPicture = true;
    }
    (targetElement || document.body).appendChild(root);
    return root;
  }

  function getClipUrl(clip) {
    return new URL(clip.src, baseUrl).href;
  }

  function hide() {
    if (!root) return;
    root.classList.remove("is-visible");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (video) video.pause();
    }, 260);
  }

  function show(momentId, options = {}) {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion && !options.force) return false;
    const clip = resolveClip(momentId, options);
    if (!clip || !document.body) return false;

    const now = Date.now();
    const reason = options.reason || momentId;
    const cooldownMs = Number(options.cooldownMs ?? DEFAULT_COOLDOWN_MS);
    if (!options.force && lastShown[reason] && now - lastShown[reason] < cooldownMs) return false;
    lastShown[reason] = now;

    const targetElement = getTargetElement(options);
    ensureRoot(targetElement);
    if (targetElement && root.parentElement !== targetElement) {
      targetElement.appendChild(root);
    } else if (!targetElement && root.parentElement !== document.body) {
      document.body.appendChild(root);
    }

    const variant = options.variant || (clip.motion === "celebrate" ? "success" : clip.motion === "think" || clip.motion === "point" ? "warning" : "neutral");
    const clipUrl = getClipUrl(clip);
    root.className = `ce-avatar-moment ${targetElement ? "is-embedded" : ""} is-${variant}`;
    if (caption) caption.textContent = options.label || clip.label || "";
    if (video && video.dataset.avatarMomentSrc !== clipUrl) {
      video.src = clipUrl;
      video.dataset.avatarMomentSrc = clipUrl;
      video.load();
    }
    root.classList.add("is-visible");
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, Number(options.displayMs || DEFAULT_DISPLAY_MS));
    return true;
  }

  function preload(momentIds = []) {
    momentIds
      .map(id => resolveClip(id))
      .filter(Boolean)
      .forEach(clip => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = getClipUrl(clip);
        document.head.appendChild(link);
      });
  }

  window.CareerEmpireAvatarMoments = {
    clips: CLIPS,
    aliases: ALIASES,
    getClipUrl,
    show,
    hide,
    preload,
    resolveClip
  };
})();
