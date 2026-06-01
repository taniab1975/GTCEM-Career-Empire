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
    hairStyles: [
      { id: "crop", label: "Crop", token: "C", slot: "hair/front-short" },
      { id: "waves", label: "Waves", token: "W", slot: "hair/front-waves" },
      { id: "curls", label: "Curls", token: "R", slot: "hair/curly" },
      { id: "long", label: "Long", token: "L", slot: "hair/long-back" },
      { id: "bun", label: "Bun", token: "B", slot: "hair/bun" },
      { id: "wrap", label: "Wrap", token: "H", slot: "hair/head-wrap" }
    ],
    hairColours: [
      { id: "black", label: "Black", color: "#161412" },
      { id: "brown", label: "Brown", color: "#5a3524" },
      { id: "auburn", label: "Auburn", color: "#9b3f24" },
      { id: "blonde", label: "Blonde", color: "#d9b85d" },
      { id: "silver", label: "Silver", color: "#c8ced4" },
      { id: "teal", label: "Teal", color: "#0f8f8c" }
    ],
    outfits: [
      {
        id: "ecc-winter-trousers-blazer",
        label: "Winter blazer",
        token: "WB",
        family: "ecc-uniform",
        source: "uniform-lookbook",
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
      { id: "glasses", label: "Glasses", token: "G" },
      { id: "headphones", label: "Headphones", token: "O" },
      { id: "badge", label: "Name badge", token: "N" },
      { id: "earrings", label: "Small earrings", token: "E" },
      { id: "scarf", label: "Scarf", token: "S" },
      { id: "backpack", label: "Backpack", token: "B" }
    ],
    characterBases: [
      {
        id: "mackillop",
        label: "MacKillop welcome",
        token: "M",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
        note: "ECC reference"
      },
      {
        id: "mackillop-thinking",
        label: "MacKillop thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
        note: "ECC reference"
      },
      {
        id: "mackillop-pointing",
        label: "MacKillop pointing",
        token: "P",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
        note: "ECC reference"
      },
      {
        id: "romero",
        label: "Romero welcome",
        token: "R",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png",
        note: "ECC reference"
      },
      {
        id: "romero-thinking",
        label: "Romero thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
        note: "ECC reference"
      },
      {
        id: "romero-celebrating",
        label: "Romero celebrating",
        token: "C",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png",
        note: "ECC reference"
      },
      {
        id: "modular-student",
        label: "Modular rig prototype",
        token: "MR",
        partMode: "layered",
        internalOnly: true,
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
      characterBase: "mackillop",
      skinTone: "sand",
      faceStyle: "soft",
      hairStyle: "waves",
      hairColour: "brown",
      outfit: "ecc-winter-trousers-blazer",
      accessory: "none",
      animationState: "idle",
      occupation: "",
      training: "",
      strength: ""
    }
  };
})();
