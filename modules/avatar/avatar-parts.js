(function () {
  window.CareerEmpireAvatarParts = {
    schemaVersion: 2,
    rig: {
      id: "ecc-student-layered-rig-v1",
      canvas: { width: 280, height: 520 },
      slots: [
        "body",
        "skinTone",
        "faceStyle",
        "hairStyle",
        "hairColour",
        "uniform",
        "accessory",
        "animationState"
      ],
      anchorNotes: {
        head: "centered at x128 on the 256 head layer",
        neck: "body layer begins below y226",
        shoes: "feet sit on the y500 baseline"
      }
    },
    sourceSheets: [
      {
        id: "ecc-boy-avatar-sheet-v1",
        label: "Boy avatar model sheet",
        sourcePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Boy avatar.png",
        productionPath: "../../Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v1.png",
        dimensions: { width: 1536, height: 1024 },
        selectedBasePose: "top-left neutral full body",
        selectedExpressionRow: "bottom expression strip",
        role: "base avatar A, proportions, hair, blazer, trousers, shoes, expression swaps"
      },
      {
        id: "ecc-girl-avatar-sheet-v1",
        label: "Girl avatar model sheet",
        sourcePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Girl Avatar 1.png",
        productionPath: "../../Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v2-female.png",
        dimensions: { width: 1536, height: 1024 },
        selectedBasePose: "top-left neutral full body",
        selectedExpressionRow: "bottom expression strip",
        role: "base avatar B, proportions, hair, blazer, jumper, skirt, tights, shoes, expression swaps"
      }
    ],
    productionPlan: {
      documentationPath: "../../docs/avatar-production-plan.md",
      masterCanvas: { width: 1024, height: 1536, format: "transparent png/webp" },
      runtimeCanvas: { width: 280, height: 520, format: "svg/html preview" },
      firstBaseAvatars: ["ecc-boy-base-neutral", "ecc-girl-base-neutral"],
      anchorPoints: {
        root: { x: 0.5, y: 0.94 },
        feetBaseline: { x: 0.5, y: 0.93 },
        hips: { x: 0.5, y: 0.61 },
        torso: { x: 0.5, y: 0.46 },
        neck: { x: 0.5, y: 0.34 },
        headCenter: { x: 0.5, y: 0.22 },
        leftShoulder: { x: 0.35, y: 0.39 },
        rightShoulder: { x: 0.65, y: 0.39 },
        leftHandRest: { x: 0.29, y: 0.67 },
        rightHandRest: { x: 0.71, y: 0.67 }
      },
      layerSlots: [
        "body/base",
        "body/skin-neck",
        "head/base",
        "hair/back",
        "hair/front",
        "face/eyes",
        "face/brows",
        "face/mouth-expression",
        "uniform/blazer",
        "uniform/jumper",
        "uniform/shirt",
        "uniform/tie",
        "uniform/lower",
        "arms/upper",
        "arms/forearms-hands",
        "legs/upper",
        "legs/lower",
        "shoes",
        "accessories"
      ],
      expressionSwaps: ["neutral", "smile", "thinking", "surprised", "excited", "wink"],
      uniformSwaps: [
        "winter blazer with trousers",
        "winter blazer with plaid skirt",
        "summer dress",
        "summer shirt and shorts",
        "sports kit"
      ],
      remotionPrototype: {
        compositionId: "ECCAvatarRigPrototype",
        targetFile: "../../remotion-est-scenes/src/scenes/ECCAvatarRigPrototype.tsx",
        animationStates: ["idle", "blink", "wave", "think", "celebrate"]
      }
    },
    productionRigs: {
      manifestPath: "../../Assets/Images and Animations/Avatar Studio/layers/rig-manifest.json",
      basePath: "../../Assets/Images and Animations/Avatar Studio/layers",
      canvas: { width: 1024, height: 1536 },
      note: "First-pass transparent PNG rigs generated from the ECC model sheets.",
      usePreviewBase: true,
      baseImage: "sheet-base.png",
      skinMask: "skin/mask.png",
      hairMask: "hair/mask-current.png",
      hairStyleLayerSets: {
        waves: {
          back: "hair/back.png",
          front: "hair/front.png"
        },
        crop: {
          back: null,
          front: "hair/crop-front.png"
        }
      },
      accessoryLayers: {
        earrings: "accessories/small-earrings.png"
      },
      layerOrder: [
        "hair/back.png",
        "legs/left-upper.png",
        "legs/right-upper.png",
        "legs/left-lower.png",
        "legs/right-lower.png",
        "shoes/left.png",
        "shoes/right.png",
        "body/skin-neck.png",
        "uniform/lower.png",
        "uniform/shirt.png",
        "uniform/tie.png",
        "uniform/jumper.png",
        "uniform/blazer.png",
        "arms/left-upper.png",
        "arms/right-upper.png",
        "arms/left-forearm-hand.png",
        "arms/right-forearm-hand.png",
        "head/base.png",
        "hair/front.png",
        "accessories/crest-badge.png",
      ],
      expressionPlates: ["neutral", "smile", "thinking", "surprised", "excited", "wink"],
      rigs: {
        "ecc-boy-base-neutral": {
          id: "ecc-boy-base-neutral",
          label: "ECC boy base neutral",
          fileRoot: "ecc-boy-base-neutral",
          previewPath: "../../Assets/Images and Animations/Avatar Studio/layers/ecc-boy-base-neutral/recomposed-preview.png",
          defaultExpression: "neutral"
        },
        "ecc-girl-base-neutral": {
          id: "ecc-girl-base-neutral",
          label: "ECC girl base neutral",
          fileRoot: "ecc-girl-base-neutral",
          previewPath: "../../Assets/Images and Animations/Avatar Studio/layers/ecc-girl-base-neutral/recomposed-preview.png",
          defaultExpression: "neutral"
        }
      }
    },
    skinTones: [
      { id: "porcelain", label: "Porcelain", color: "#f4d6c5", shadow: "#d79f82" },
      { id: "sand", label: "Sand", color: "#dba77c", shadow: "#b57952" },
      { id: "warm", label: "Warm", color: "#b8734f", shadow: "#8d4e36" },
      { id: "copper", label: "Copper", color: "#935a3c", shadow: "#6f3d29" },
      { id: "mahogany", label: "Mahogany", color: "#66402f", shadow: "#43271c" },
      { id: "deep", label: "Deep", color: "#38251f", shadow: "#211514" }
    ],
    faceStyles: [
      { id: "soft", label: "Soft", token: "S" },
      { id: "round", label: "Round", token: "R" },
      { id: "sharp", label: "Sharp", token: "A" },
      { id: "freckled", label: "Freckles", token: "F" },
      { id: "bright", label: "Bright", token: "B" },
      { id: "calm", label: "Calm", token: "C" }
    ],
    eyeColours: [
      { id: "brown", label: "Brown", color: "#6f3f1f", highlight: "#c9823c", source: "contact-sheet" },
      { id: "amber", label: "Amber", color: "#9a7622", highlight: "#dfb453", source: "contact-sheet" },
      { id: "green", label: "Green", color: "#5f7d32", highlight: "#9fc45c", source: "contact-sheet" },
      { id: "blue", label: "Blue", color: "#2f789c", highlight: "#8bd8ff", source: "contact-sheet" },
      { id: "grey", label: "Grey", color: "#5d6871", highlight: "#b8c5ce", source: "contact-sheet" }
    ],
    hairStyles: [
      { id: "waves", label: "Original waves", token: "W", slot: "hair/front-waves" },
      { id: "crop", label: "Crop", token: "C", slot: "hair/crop", plannedOnly: true, note: "Needs clean art" },
      { id: "curls", label: "Curls", token: "R", slot: "hair/curly", plannedOnly: true, note: "Needs art" },
      { id: "long", label: "Long", token: "L", slot: "hair/long-back", plannedOnly: true, note: "Needs art" },
      { id: "bun", label: "Bun", token: "B", slot: "hair/bun", plannedOnly: true, note: "Needs art" },
      { id: "wrap", label: "Wrap", token: "H", slot: "hair/head-wrap", plannedOnly: true, note: "Needs art" }
    ],
    hairColours: [
      { id: "brown", label: "Brown", color: "#5a3524" },
      { id: "black", label: "Black", color: "#161412", plannedOnly: true, note: "Needs clean hair mask" },
      { id: "auburn", label: "Auburn", color: "#9b3f24", plannedOnly: true, note: "Needs clean hair mask" },
      { id: "blonde", label: "Blonde", color: "#d9b85d", plannedOnly: true, note: "Needs clean hair mask" },
      { id: "silver", label: "Silver", color: "#c8ced4", plannedOnly: true, note: "Needs clean hair mask" },
      { id: "teal", label: "Teal", color: "#0f8f8c", plannedOnly: true, note: "Needs clean hair mask" }
    ],
    outfits: [
      {
        id: "ecc-current-uniform",
        label: "Current ECC uniform",
        token: "ECC",
        family: "ecc-uniform",
        source: "sheet-base",
        lower: "baked-base",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c",
        note: "Active art"
      },
      {
        id: "ecc-winter-trousers-blazer",
        label: "Winter blazer",
        token: "WB",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-winter-skirt-jumper",
        label: "Winter skirt",
        token: "WS",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "plaid-skirt",
        fill: "#0f8f8c",
        lowerFill: "#1c426b",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-summer-dress",
        label: "Summer dress",
        token: "SD",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "dress",
        fill: "#0f8f8c",
        lowerFill: "#0f8f8c",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-summer-shirt-shorts",
        label: "Shirt & shorts",
        token: "SS",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "shorts",
        fill: "#f7fbff",
        lowerFill: "#16243c",
        accent: "#0f8f8c",
        shirt: "#f7fbff",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-sports",
        label: "Sports kit",
        token: "SP",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "sports-shorts",
        fill: "#0f63b6",
        lowerFill: "#16243c",
        accent: "#f6b73c",
        shirt: "#0f63b6",
        tie: "#f6b73c"
      },
      {
        id: "blazer",
        label: "ECC blazer",
        token: "EB",
        family: "legacy",
        plannedOnly: true,
        note: "Replaced by current uniform",
        lower: "trousers",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "interview",
        label: "Interview blazer",
        token: "I",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#17202a",
        lowerFill: "#17202a",
        accent: "#f6b73c",
        shirt: "#ffffff",
        tie: "#3859c7"
      },
      {
        id: "scrubs",
        label: "Health scrubs",
        token: "S",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#0f8f8c",
        lowerFill: "#0d7775",
        accent: "#ffffff",
        shirt: "#dff9f6",
        tie: "#0f8f8c"
      },
      {
        id: "hivis",
        label: "Hi-vis gear",
        token: "V",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#f6b73c",
        lowerFill: "#17202a",
        accent: "#17202a",
        shirt: "#fff7d7",
        tie: "#17202a"
      },
      {
        id: "apron",
        label: "Creative apron",
        token: "A",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#6c4bd2",
        lowerFill: "#17202a",
        accent: "#a3d95b",
        shirt: "#ffffff",
        tie: "#6c4bd2"
      }
    ],
    accessories: [
      { id: "none", label: "None", token: "-" },
      { id: "earrings", label: "Small earrings", token: "E" },
      { id: "badge", label: "Name badge", token: "N", plannedOnly: true, note: "Needs name-badge art" },
      { id: "glasses", label: "Glasses", token: "G", plannedOnly: true, note: "Needs better art" },
      { id: "headphones", label: "Headphones", token: "O", plannedOnly: true, note: "Needs art" },
      { id: "scarf", label: "Scarf", token: "S", plannedOnly: true, note: "Needs art" },
      { id: "backpack", label: "Backpack", token: "B", plannedOnly: true, note: "Needs art" }
    ],
    characterBases: [
      {
        id: "custom-trousers",
        label: "Custom trousers",
        token: "CT",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "ecc-boy-rig-source",
        defaultOutfit: "ecc-winter-trousers-blazer",
        defaultHairStyle: "waves",
        note: "Legacy SVG fallback"
      },
      {
        id: "custom-skirt",
        label: "Custom skirt",
        token: "CS",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "ecc-girl-rig-source",
        defaultOutfit: "ecc-winter-skirt-jumper",
        defaultHairStyle: "long",
        note: "Legacy SVG fallback"
      },
      {
        id: "ecc-boy-rig-source",
        label: "ECC boy rig",
        token: "BR",
        partMode: "production-png-rig",
        assetRigId: "ecc-boy-base-neutral",
        imagePath: "../../Assets/Images and Animations/Avatar Studio/layers/ecc-boy-base-neutral/recomposed-preview.png",
        defaultOutfit: "ecc-current-uniform",
        defaultHairStyle: "waves",
        note: "PNG source"
      },
      {
        id: "ecc-girl-rig-source",
        label: "ECC girl rig",
        token: "GR",
        partMode: "production-png-rig",
        assetRigId: "ecc-girl-base-neutral",
        imagePath: "../../Assets/Images and Animations/Avatar Studio/layers/ecc-girl-base-neutral/recomposed-preview.png",
        defaultOutfit: "ecc-current-uniform",
        defaultHairStyle: "waves",
        note: "PNG source"
      },
      {
        id: "mackillop",
        label: "MacKillop welcome",
        token: "M",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "mackillop-thinking",
        label: "MacKillop thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "mackillop-pointing",
        label: "MacKillop pointing",
        token: "P",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero",
        label: "Romero welcome",
        token: "R",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero-thinking",
        label: "Romero thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero-celebrating",
        label: "Romero celebrating",
        token: "C",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "modular-student",
        label: "Modular rig prototype",
        token: "MR",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "custom-trousers",
        note: "Schema test only"
      }
    ],
    unlocks: [
      { name: "Interview outfit", state: "Starter", color: "#17202a", token: "IO" },
      { name: "Work boots", state: "Shop stage 2", color: "#935a3c", token: "WB" },
      { name: "Health kit", state: "Career gear", color: "#0f8f8c", token: "HK" },
      { name: "Tool belt", state: "Apprenticeship", color: "#f6b73c", token: "TB" },
      { name: "Laptop bag", state: "Study upgrade", color: "#3859c7", token: "LB" },
      { name: "Transport fund", state: "Life goal", color: "#e85d4f", token: "TF" }
    ],
    defaults: {
      characterBase: "ecc-boy-rig-source",
      skinTone: "sand",
      faceStyle: "soft",
      eyeColour: "brown",
      hairStyle: "waves",
      hairColour: "brown",
      outfit: "ecc-current-uniform",
      accessory: "none",
      animationState: "idle",
      occupation: "",
      training: "",
      strength: ""
    }
  };
})();
