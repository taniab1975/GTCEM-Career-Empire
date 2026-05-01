const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "est-prep";
const BANK_PATH = "../../data/modules/est-prep-bank.json";
const CONTENT_STAGE_CONFIG_PATH = "../../data/modules/est-prep-rounds/content-stage.json";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
};

const EST_GUIDE_CHARACTERS = {
  romero: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcome.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Pointing.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Encouraging.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png"
  },
  mackillop: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Encouraging.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Celebrating.png"
  }
};

const EST_GUIDE_ASSIGNMENTS = {
  initiative: "romero",
  "time-management": "mackillop",
  "personal-finance": "mackillop",
  "job-application": "romero",
  communication: "mackillop",
  "future-of-work": "romero"
};

const DEFAULT_CONTENT_TOPIC_GROUPS = [
  {
    id: "initiative",
    title: "Enterprise Behaviours - Initiative",
    topics: ["Initiative", "Being proactive", "Improving work practices", "Vocalising opinions", "Helping fellow workers", "Seeking more responsibilities"],
    writePrompt: "Write one or two EST-ready sentences explaining how initiative can be shown in a workplace situation.",
    sampleResponse: "Initiative can be shown when a worker acts proactively, suggests improvements, helps colleagues, or volunteers for extra responsibilities before being told. This matters because it improves productivity and shows the worker can contribute positively to the workplace."
  },
  {
    id: "time-management",
    title: "Time Management Skills - Plan and prioritise tasks to meet deadlines",
    topics: ["Time management", "Time-management tools", "Managing multiple tasks"],
    writePrompt: "Write one or two EST-ready sentences explaining how a student or worker can plan and prioritise tasks to meet deadlines.",
    sampleResponse: "Time management involves planning ahead, prioritising urgent tasks, and using tools such as calendars, lists, or reminders to stay organised. This helps a person meet deadlines because responsibilities are visible, manageable, and easier to adjust when circumstances change."
  },
  {
    id: "personal-finance",
    title: "Managing personal finance, budgeting, seeking assistance, unexpected financial events inc changes to financial circumstance",
    topics: ["Budgeting", "Tracking money in and out", "Seeking assistance", "Unexpected life events", "Responding to changed financial circumstances"],
    writePrompt: "Write one or two EST-ready sentences explaining how budgeting and seeking assistance support personal financial management.",
    sampleResponse: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and plan for unexpected events. Seeking assistance from trusted services or experts also supports financial management because it provides reliable advice and helps people make informed decisions."
  },
  {
    id: "job-application",
    title: "Cover Letters, STAR and Addressing Selection Criteria",
    topics: ["Cover letter purpose", "Selection criteria", "STAR method"],
    writePrompt: "Write one or two EST-ready sentences explaining how STAR helps an applicant address selection criteria effectively.",
    sampleResponse: "The STAR method helps applicants address selection criteria by structuring examples into Situation, Task, Action, and Result. This makes a response clearer because the employer can see exactly what the applicant did and what outcome was achieved."
  },
  {
    id: "communication",
    title: "Communication Skills",
    topics: ["Communication skills", "Non-verbal communication", "Active listening"],
    writePrompt: "Write one or two EST-ready sentences explaining how communication skills can be applied in a workplace or interview situation.",
    sampleResponse: "Communication skills can be applied by using clear verbal language, active listening, and appropriate non-verbal communication for the audience and purpose. This is important because it reduces misunderstandings, builds rapport, and helps tasks or interviews run more effectively."
  },
  {
    id: "future-of-work",
    title: "Megatrends, Growth Industries and Labour Market Information",
    topics: ["Megatrends", "Growth industry", "Labour market information", "Emerging industry", "Green industry"],
    writePrompt: "Write one or two EST-ready sentences explaining how megatrends, growth industries, or labour market information can influence future career opportunities.",
    sampleResponse: "Megatrends shape the future of work by changing industries, jobs, and skill needs over time. Labour market information and knowledge of growth industries help people make better career decisions because they show where demand is increasing, what qualifications may be needed, and which opportunities are emerging."
  }
];

const DEFAULT_CONTENT_RESPONSE_SCAFFOLDS = {
  initiative: {
    title: "Response Forge",
    subtitle: "Build the key idea first, then the example, then the impact.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Initiative can be shown when a worker ",
        placeholder: "acts proactively, suggests an improvement, or steps in to help..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "For example, they might ",
        placeholder: "restock early, suggest a safer system, or support a teammate..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This is effective because ",
        placeholder: "it improves productivity, safety, teamwork, or workplace reliability..."
      }
    ]
  },
  "time-management": {
    title: "Response Forge",
    subtitle: "Build the process, then the tools or example, then the reason it works.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Time management involves ",
        placeholder: "planning tasks, prioritising urgent work, and adjusting when deadlines change..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "A student or worker can use ",
        placeholder: "planners, reminders, checklists, schedules, or clear task sequencing..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This helps because ",
        placeholder: "deadlines stay visible, tasks are completed in the right order, and delays can be managed..."
      }
    ]
  },
  "personal-finance": {
    title: "Response Forge",
    subtitle: "Explain the money strategy, then the support move, then the benefit.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Managing personal finance involves ",
        placeholder: "tracking income and expenses, budgeting carefully, and preparing for change..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "If circumstances change, a person should ",
        placeholder: "review essentials, adjust spending, and seek reliable assistance early..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This is important because ",
        placeholder: "it reduces financial stress and helps people make informed decisions..."
      }
    ]
  },
  "job-application": {
    title: "Response Forge",
    subtitle: "Explain the method, then the evidence move, then the employer benefit.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "STAR helps an applicant by ",
        placeholder: "structuring a response into Situation, Task, Action, and Result..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "This allows the applicant to ",
        placeholder: "give a clear example that directly addresses the selection criteria..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "As a result, the employer can ",
        placeholder: "see what the applicant actually did and why they are suitable..."
      }
    ]
  },
  communication: {
    title: "Response Forge",
    subtitle: "Explain the skill, then the action, then the workplace effect.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Communication skills involve ",
        placeholder: "clear verbal language, active listening, and appropriate non-verbal signals..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "In a workplace or interview, a person can ",
        placeholder: "listen carefully, clarify understanding, and adapt the message to the audience..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This matters because ",
        placeholder: "it reduces misunderstandings, builds rapport, and helps tasks run effectively..."
      }
    ]
  },
  "future-of-work": {
    title: "Response Forge",
    subtitle: "Explain the long-term change, then the evidence or opportunity, then why it matters for careers.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Megatrends and labour market information show ",
        placeholder: "how industries, jobs, and skill needs change over time..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "For example, growth industries or data might show ",
        placeholder: "rising demand in health care, technology, renewable energy, or other expanding areas..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This matters for career planning because ",
        placeholder: "people can use the evidence to identify opportunities, training needs, and future pathways..."
      }
    ]
  }
};

const DEFAULT_CONTENT_TRAINING_BAYS = {
  initiative: {
    type: "initiative-arc",
    title: "Initiative Reactor",
    subtitle: "Spot the move, name the type, fix the workplace, then upgrade the EST answer.",
    memoryHook: "PIVHS: Proactive, Improve work practices, Vocalise opinions, Help fellow workers, Seek more responsibilities",
    steps: [
      {
        id: "spot",
        title: "Step 1: Spot the Initiative",
        instruction: "Decide whether each workplace move shows strong initiative.",
        items: [
          {
            id: "initiative-stock",
            prompt: "A worker notices stock is running low and restocks before customers complain.",
            options: ["Shows initiative", "Needs more initiative", "Only follows instructions"],
            correct: "Shows initiative",
            feedback: "This is proactive. The worker spots a problem early and acts without being told."
          },
          {
            id: "initiative-wait",
            prompt: "A worker sees a spill but leaves it until a supervisor gives exact instructions.",
            options: ["Shows initiative", "Needs more initiative", "Strong teamwork"],
            correct: "Needs more initiative",
            feedback: "This is passive, not initiative. Waiting creates risk and delays."
          },
          {
            id: "initiative-display",
            prompt: "A worker fixes a messy display before customers start avoiding the area.",
            options: ["Shows initiative", "Needs more initiative", "Just luck"],
            correct: "Shows initiative",
            feedback: "This is initiative because the worker acts before the issue affects customers."
          }
        ]
      },
      {
        id: "classify",
        title: "Step 2: Name the Initiative Type",
        instruction: "Match each workplace action to the correct type of initiative.",
        items: [
          {
            id: "initiative-proactive",
            prompt: "Restocking shelves before products run out.",
            options: ["Being proactive", "Vocalising opinions", "Seeking more responsibilities"],
            correct: "Being proactive",
            feedback: "This is proactive because the worker anticipates a need before it becomes a problem."
          },
          {
            id: "initiative-opinion",
            prompt: "Telling a supervisor that clearer shelf signs would help customers find items faster.",
            options: ["Helping fellow workers", "Vocalising opinions", "Being proactive"],
            correct: "Vocalising opinions",
            feedback: "This is vocalising opinions because the worker shares an improvement idea constructively."
          },
          {
            id: "initiative-help",
            prompt: "Helping a new team member complete a task safely during a busy shift.",
            options: ["Helping fellow workers", "Improving work practices", "Seeking more responsibilities"],
            correct: "Helping fellow workers",
            feedback: "This is helping fellow workers because the action supports teamwork and productivity."
          },
          {
            id: "initiative-responsibility",
            prompt: "Volunteering to learn the new e-register system.",
            options: ["Being proactive", "Seeking more responsibilities", "Vocalising opinions"],
            correct: "Seeking more responsibilities",
            feedback: "This shows initiative through willingness to take on more and develop new skills."
          }
        ]
      },
      {
        id: "fix",
        title: "Step 3: Fix the Workplace",
        instruction: "Choose the strongest initiative response for each workplace problem.",
        items: [
          {
            id: "initiative-new-worker",
            prompt: "Packing tools are often missing, which wastes time for the team. What is the strongest initiative move for a new worker?",
            options: [
              "Suggest setting up supply stations at each bench so tools are always nearby.",
              "Keep searching quietly because improving systems is not a new worker's job.",
              "Wait until a manager gets frustrated enough to notice the problem."
            ],
            correct: "Suggest setting up supply stations at each bench so tools are always nearby.",
            feedback: "Strong move. This improves work practices and shows even a new worker can contribute useful ideas."
          },
          {
            id: "initiative-supervisor",
            prompt: "A junior supervisor notices customer queues are longest on Thursday evenings. What is the strongest initiative move?",
            options: [
              "Propose moving more staff into peak periods based on sales patterns.",
              "Leave the roster unchanged because busy times are just part of retail.",
              "Tell workers to move faster without changing staffing levels."
            ],
            correct: "Propose moving more staff into peak periods based on sales patterns.",
            feedback: "Strong move. This shows initiative at supervisor level by improving systems before service drops."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "initiative-sentence-1",
            prompt: "Which sentence best explains initiative in an EST-style answer?",
            options: [
              "I showed initiative by suggesting a safer system for restocking, which improved efficiency and helped the team work more effectively.",
              "I did my job and everything was fine.",
              "Initiative is when things happen at work."
            ],
            correct: "I showed initiative by suggesting a safer system for restocking, which improved efficiency and helped the team work more effectively.",
            feedback: "This is strongest because it names the action, shows initiative clearly, and explains the workplace effect."
          },
          {
            id: "initiative-sentence-2",
            prompt: "Which sentence best links initiative with teamwork?",
            options: [
              "Initiative can support teamwork when a worker notices a colleague struggling and steps in to help without being told.",
              "Initiative means working alone and not needing anyone else.",
              "Teamwork and initiative are unrelated."
            ],
            correct: "Initiative can support teamwork when a worker notices a colleague struggling and steps in to help without being told.",
            feedback: "This is strongest because it connects initiative to a real workplace example and explains how the team benefits."
          }
        ]
      }
    ]
  },
  "time-management": {
    type: "time-management-arc",
    title: "Time Management Control Room",
    subtitle: "Triage the task list, build the best order, rescue the deadline, then upgrade the EST answer.",
    memoryHook: "Plan • Prioritise • Track • Adjust",
    steps: [
      {
        id: "triage",
        title: "Step 1: Triage the Task List",
        instruction: "Choose which task should move first because the deadline pressure is highest.",
        items: [
          {
            id: "time-triage-burst-pipe",
            prompt: "An apprentice plumber has four jobs today. Which task should be the immediate priority?",
            options: [
              "Urgent repair on a burst pipe",
              "Paperwork and logbook",
              "Tidying the vehicle first"
            ],
            correct: "Urgent repair on a burst pipe",
            feedback: "Urgent repair comes first because it has the highest immediate consequence and deadline pressure."
          },
          {
            id: "time-triage-school",
            prompt: "A student has a test tomorrow, a shift on Saturday, and a message about a party tonight. What should be prioritised first?",
            options: [
              "Study for the test and lock in the shift time",
              "Answer the party message first",
              "Do whichever task feels easiest"
            ],
            correct: "Study for the test and lock in the shift time",
            feedback: "Strong time management starts with urgent commitments, not the least demanding task."
          },
          {
            id: "time-triage-tools",
            prompt: "Before leaving for the first job, what is the strongest planning move?",
            options: [
              "Check the schedule, tools, materials, and travel route",
              "Start driving and hope everything needed is already in the ute",
              "Ignore the schedule because the supervisor will fix problems later"
            ],
            correct: "Check the schedule, tools, materials, and travel route",
            feedback: "Planning before the task begins reduces delays and makes the whole day easier to manage."
          }
        ]
      },
      {
        id: "sequence",
        title: "Step 2: Build the Best Order",
        instruction: "Choose the sequence that shows the strongest planning process.",
        items: [
          {
            id: "time-sequence-day",
            prompt: "Which sequence shows the strongest start-of-day time management process?",
            options: [
              "Review the schedule, prepare tools/materials, travel to the urgent job, then complete lower-priority tasks later",
              "Travel first, check the schedule after arriving, then work out what tools are needed",
              "Start the easiest task, then decide whether the urgent job still matters"
            ],
            correct: "Review the schedule, prepare tools/materials, travel to the urgent job, then complete lower-priority tasks later",
            feedback: "This is strongest because it plans ahead, prepares resources, and sequences urgent work before less urgent tasks."
          },
          {
            id: "time-sequence-grouping",
            prompt: "Which move best shows efficient task sequencing?",
            options: [
              "Pick up supplies on the way to the next job instead of making a separate trip later",
              "Drive back across town twice because it feels more familiar",
              "Leave all materials collection until the end of the day"
            ],
            correct: "Pick up supplies on the way to the next job instead of making a separate trip later",
            feedback: "Grouping related tasks saves time and keeps the day moving more efficiently."
          },
          {
            id: "time-sequence-tools",
            prompt: "Which tool use best supports sequencing and deadline control?",
            options: [
              "Using a planner, checklist, or calendar to map tasks and times clearly",
              "Keeping all deadlines in your head so planning stays flexible",
              "Waiting until something is overdue before writing it down"
            ],
            correct: "Using a planner, checklist, or calendar to map tasks and times clearly",
            feedback: "Tools matter because they make the sequence visible and easier to track."
          }
        ]
      },
      {
        id: "rescue",
        title: "Step 3: Rescue the Deadline",
        instruction: "Choose the strongest response when the original plan starts to break down.",
        items: [
          {
            id: "time-rescue-delay",
            prompt: "A job is taking longer than expected and will push the rest of the schedule back. What is the strongest next move?",
            options: [
              "Inform the supervisor, adjust the schedule, and contact the next client about the delay",
              "Say nothing and hope the next job somehow still fits",
              "Abandon the current job without telling anyone"
            ],
            correct: "Inform the supervisor, adjust the schedule, and contact the next client about the delay",
            feedback: "Strong time management includes monitoring progress and adjusting early when delays occur."
          },
          {
            id: "time-rescue-emergency",
            prompt: "An emergency task comes in after the day has already been planned. What shows the strongest time management?",
            options: [
              "Reprioritise the day so the emergency is handled and lower-priority tasks shift accordingly",
              "Ignore the emergency because the original list was already written",
              "Keep all tasks in the same order even if deadlines are now unrealistic"
            ],
            correct: "Reprioritise the day so the emergency is handled and lower-priority tasks shift accordingly",
            feedback: "Good time management is not rigid. It adjusts when workplace conditions change."
          },
          {
            id: "time-rescue-balance",
            prompt: "A Year 12 student is struggling to balance school, work, sport, and family commitments. What is the strongest advice?",
            options: [
              "Write commitments into a planner, review priorities weekly, and allow buffer time when things change",
              "Take on every commitment and hope it works out",
              "Avoid planning because plans make life feel too controlled"
            ],
            correct: "Write commitments into a planner, review priorities weekly, and allow buffer time when things change",
            feedback: "This is strongest because it combines tools, review habits, and flexibility."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "time-sentence-1",
            prompt: "Which sentence best explains time management in an EST-style answer?",
            options: [
              "Time management involves planning tasks, prioritising urgent work, and adjusting schedules so deadlines can still be met.",
              "Time management means being busy all the time.",
              "Time management is when work happens eventually."
            ],
            correct: "Time management involves planning tasks, prioritising urgent work, and adjusting schedules so deadlines can still be met.",
            feedback: "This is strongest because it names the process clearly and explains the goal of meeting deadlines."
          },
          {
            id: "time-sentence-2",
            prompt: "Which sentence best links tools with effective time management?",
            options: [
              "Tools such as planners, calendars, reminders, and checklists help workers organise tasks, monitor progress, and stay on schedule.",
              "Tools are not important if someone just works harder.",
              "A good worker should rely on memory instead of using planning tools."
            ],
            correct: "Tools such as planners, calendars, reminders, and checklists help workers organise tasks, monitor progress, and stay on schedule.",
            feedback: "This is strongest because it explains both the tools and why they improve deadline control."
          }
        ]
      }
    ]
  },
  "future-of-work": {
    type: "future-of-work-arc",
    title: "Future Signals Scanner",
    subtitle: "Spot the shift, read the industry signal, use the data, then upgrade the EST answer.",
    memoryHook: "Shift • Signal • Evidence • Opportunity",
    steps: [
      {
        id: "shift",
        title: "Step 1: Spot the Shift",
        instruction: "Choose the statement that best shows how megatrends change work over time.",
        items: [
          {
            id: "future-shift-jobs",
            prompt: "Which statement best explains the impact of megatrends on jobs?",
            options: [
              "Megatrends can create emerging jobs and change existing ones, so workers may need new skills.",
              "Megatrends only affect jobs in one industry at a time.",
              "Megatrends mean all existing jobs disappear completely."
            ],
            correct: "Megatrends can create emerging jobs and change existing ones, so workers may need new skills.",
            feedback: "Strong call. The future of work is usually about jobs changing, evolving, or emerging rather than simply disappearing."
          },
          {
            id: "future-shift-routine",
            prompt: "Which type of work is most likely to be reduced or reshaped by automation and more efficient processes?",
            options: [
              "Routine or repetitive tasks",
              "Every specialised role equally",
              "Only outdoor work"
            ],
            correct: "Routine or repetitive tasks",
            feedback: "Correct. Lower-skill, repetitive, or routine tasks are often the most exposed to automation."
          },
          {
            id: "future-shift-evolve",
            prompt: "A job now uses online systems, digital communication, and new technology tools. What does this show?",
            options: [
              "The role is evolving as work changes",
              "The industry no longer matters",
              "Technology has no impact on work"
            ],
            correct: "The role is evolving as work changes",
            feedback: "Strong move. Many roles stay, but their tasks, tools, and expectations evolve."
          }
        ]
      },
      {
        id: "signal",
        title: "Step 2: Read the Industry Signal",
        instruction: "Choose the label that best fits each future-of-work idea.",
        items: [
          {
            id: "future-growth",
            prompt: "An industry is expanding over time and creating increased demand for workers.",
            options: [
              "Growth industry",
              "Green industry",
              "Labour market information"
            ],
            correct: "Growth industry",
            feedback: "A growth industry expands over time and can create more employment opportunities."
          },
          {
            id: "future-emerging",
            prompt: "An industry is new, developing, or becoming more important because of technology or changing needs.",
            options: [
              "Emerging industry",
              "Declining job",
              "Participation rate"
            ],
            correct: "Emerging industry",
            feedback: "Emerging industries are new or developing and often linked to megatrends."
          },
          {
            id: "future-green",
            prompt: "An industry reduces environmental harm or supports cleaner and more sustainable ways of working.",
            options: [
              "Green industry",
              "Growth industry",
              "Employment level"
            ],
            correct: "Green industry",
            feedback: "Green industries support sustainability and can include both new and changing roles."
          },
          {
            id: "future-lmi",
            prompt: "Data about wages, job vacancies, industry growth, and employment trends is called:",
            options: [
              "Labour market information",
              "Customer feedback",
              "Selection criteria"
            ],
            correct: "Labour market information",
            feedback: "Labour market information helps people make career decisions using evidence about jobs and industries."
          }
        ]
      },
      {
        id: "evidence",
        title: "Step 3: Use the Data",
        instruction: "Choose the strongest interpretation of the labour market evidence.",
        items: [
          {
            id: "future-data-health",
            prompt: "Employment data shows Health Care and Social Assistance grew strongly, while Manufacturing declined. What is the best interpretation?",
            options: [
              "Growth is uneven across industries, so some areas create more opportunities than others.",
              "Every industry is growing at the same rate.",
              "Industry data is useless for career decisions."
            ],
            correct: "Growth is uneven across industries, so some areas create more opportunities than others.",
            feedback: "This is the strongest interpretation because labour market growth is not spread evenly."
          },
          {
            id: "future-data-local",
            prompt: "National data shows an industry is growing, but there are few local opportunities where you live. What is the strongest conclusion?",
            options: [
              "Macro data still needs to be interpreted in relation to local opportunities and your own situation.",
              "National growth guarantees a job for everyone locally.",
              "Location never affects employment opportunities."
            ],
            correct: "Macro data still needs to be interpreted in relation to local opportunities and your own situation.",
            feedback: "Strong move. Labour market information is useful, but it has to be interpreted at the micro level too."
          },
          {
            id: "future-data-skills",
            prompt: "Projected employment growth is strongest in higher-skill occupations. What does that suggest?",
            options: [
              "Training, qualifications, and adaptable skills may be increasingly important for future opportunities.",
              "Skill level has no effect on future job growth.",
              "Only entry-level roles will expand."
            ],
            correct: "Training, qualifications, and adaptable skills may be increasingly important for future opportunities.",
            feedback: "Correct. The strongest growth is often linked to roles requiring post-secondary skills or specialised knowledge."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "future-sentence-1",
            prompt: "Which sentence best explains how megatrends influence the future of work?",
            options: [
              "Megatrends influence the future of work by changing industries, creating emerging jobs, and reshaping the skills workers need over time.",
              "Megatrends are just interesting ideas with no effect on careers.",
              "Megatrends only matter to government, not workers."
            ],
            correct: "Megatrends influence the future of work by changing industries, creating emerging jobs, and reshaping the skills workers need over time.",
            feedback: "This is strongest because it explains both the change and its impact on workers."
          },
          {
            id: "future-sentence-2",
            prompt: "Which sentence best explains why labour market information matters?",
            options: [
              "Labour market information helps people compare growth areas, wages, job demand, and skill needs so they can make better career decisions.",
              "Labour market information is only useful after someone already has a permanent job.",
              "Labour market information mainly tells you what subjects to like."
            ],
            correct: "Labour market information helps people compare growth areas, wages, job demand, and skill needs so they can make better career decisions.",
            feedback: "This is strongest because it links the evidence directly to career planning."
          }
        ]
      }
    ]
  },
  "personal-finance": {
    type: "personal-finance-arc",
    title: "Finance Stability Lab",
    subtitle: "Track the money, protect the essentials, seek support, then upgrade the EST answer.",
    memoryHook: "Track • Prioritise • Seek support • Adapt",
    steps: [
      {
        id: "track",
        title: "Step 1: Track the Money Signal",
        instruction: "Identify the strongest budgeting or tracking move in each situation.",
        items: [
          {
            id: "finance-track-1",
            prompt: "A student wants to understand why they keep running short before payday.",
            options: [
              "Track money in and money out so spending patterns and problem areas become visible.",
              "Keep guessing because writing it down takes too long.",
              "Only check the account balance when it is already low."
            ],
            correct: "Track money in and money out so spending patterns and problem areas become visible.",
            feedback: "Correct. Tracking income and expenses is the first move because it shows where money is actually going."
          },
          {
            id: "finance-track-2",
            prompt: "Which action best shows budgeting discipline rather than wishful thinking?",
            options: [
              "List regular and irregular expenses, then compare them against income for the week.",
              "Assume there will be enough money because there usually is.",
              "Spend first and work out the totals later."
            ],
            correct: "List regular and irregular expenses, then compare them against income for the week.",
            feedback: "Correct. Budgets work when both predictable and less predictable costs are visible."
          },
          {
            id: "finance-track-3",
            prompt: "A worker's hours change from week to week. What is the strongest money-management move?",
            options: [
              "Review income records regularly so the budget can adjust when earnings rise or fall.",
              "Use the highest earning week as the budget for every week.",
              "Ignore the variation and hope it evens out."
            ],
            correct: "Review income records regularly so the budget can adjust when earnings rise or fall.",
            feedback: "Correct. Tracking helps people respond quickly when income becomes irregular."
          }
        ]
      },
      {
        id: "prioritise",
        title: "Step 2: Protect the Essentials",
        instruction: "Choose the response that best protects financial stability when pressure hits.",
        items: [
          {
            id: "finance-priority-1",
            prompt: "Sami's hours drop, creating a weekly deficit. What should be reviewed first?",
            options: [
              "Essential costs such as transport, food, rent, bills, and other obligations that must still be covered.",
              "Only entertainment spending because it is the most fun to keep.",
              "Nothing yet, because changing the budget too early is overreacting."
            ],
            correct: "Essential costs such as transport, food, rent, bills, and other obligations that must still be covered.",
            feedback: "Correct. Strong budgeting starts by protecting essentials before optional spending."
          },
          {
            id: "finance-priority-2",
            prompt: "A person needs to cut spending after an unexpected bill. Which move is strongest?",
            options: [
              "Reduce non-essential spending first and keep reviewing the budget until the situation stabilises.",
              "Ignore the bill and keep all normal spending the same.",
              "Cancel all food and transport costs immediately."
            ],
            correct: "Reduce non-essential spending first and keep reviewing the budget until the situation stabilises.",
            feedback: "Correct. The strongest move is to protect essentials and reduce optional costs first."
          },
          {
            id: "finance-priority-3",
            prompt: "Why is maintaining an emergency fund useful?",
            options: [
              "It provides a buffer when income drops or unexpected expenses appear.",
              "It removes the need to budget at all.",
              "It should only be used for impulse purchases."
            ],
            correct: "It provides a buffer when income drops or unexpected expenses appear.",
            feedback: "Correct. Emergency savings improve preparedness when circumstances change unexpectedly."
          }
        ]
      },
      {
        id: "support",
        title: "Step 3: Seek the Right Support",
        instruction: "Decide which assistance source or response is most reliable and effective.",
        items: [
          {
            id: "finance-support-1",
            prompt: "A young worker is confused about managing debt and urgent bills. What is the strongest first support option?",
            options: [
              "Use a trusted service such as MoneySmart, a financial counsellor, or the National Debt Helpline.",
              "Follow a random influencer who promises instant money hacks.",
              "Avoid seeking advice because support means failure."
            ],
            correct: "Use a trusted service such as MoneySmart, a financial counsellor, or the National Debt Helpline.",
            feedback: "Correct. Assistance should come from reliable, trustworthy sources rather than pressure or guesswork."
          },
          {
            id: "finance-support-2",
            prompt: "A student's shifts fall and they may miss payments. Which action best shows effective support-seeking?",
            options: [
              "Contact the bank, employer, or relevant support service early to discuss options and changed circumstances.",
              "Wait until everything becomes unmanageable before saying anything.",
              "Hide the problem and stop checking messages."
            ],
            correct: "Contact the bank, employer, or relevant support service early to discuss options and changed circumstances.",
            feedback: "Correct. Early communication often creates more options, such as payment plans or extra shifts."
          },
          {
            id: "finance-support-3",
            prompt: "Why is reliable advice important in financial situations?",
            options: [
              "Reliable advice helps people avoid scams, bad decisions, and unnecessary financial risk.",
              "Any advice is fine if it sounds confident.",
              "Good financial choices should always be made quickly without checking."
            ],
            correct: "Reliable advice helps people avoid scams, bad decisions, and unnecessary financial risk.",
            feedback: "Correct. Trusted advice improves confidence and reduces the chance of costly mistakes."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "finance-sentence-1",
            prompt: "Which sentence best explains why budgeting matters?",
            options: [
              "Budgeting helps a person balance income and expenses, identify unnecessary spending, and prepare for future costs or financial change.",
              "Budgeting is just writing numbers down with no real purpose.",
              "Budgeting only matters if someone earns a very high income."
            ],
            correct: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and prepare for future costs or financial change.",
            feedback: "This is strongest because it explains both the process and why it supports financial control."
          },
          {
            id: "finance-sentence-2",
            prompt: "Which sentence best explains how people should respond to unexpected financial events?",
            options: [
              "Unexpected financial events should be managed by reviewing the budget, prioritising essentials, seeking reliable assistance, and adjusting plans where needed.",
              "Unexpected events mean planning is pointless.",
              "The best response is to keep spending the same and hope the issue disappears."
            ],
            correct: "Unexpected financial events should be managed by reviewing the budget, prioritising essentials, seeking reliable assistance, and adjusting plans where needed.",
            feedback: "This is strongest because it combines practical action with adaptability and support-seeking."
          }
        ]
      }
    ]
  },
  "job-application": {
    type: "job-application-arc",
    title: "Application Control Room",
    subtitle: "Read the ad, match the criteria, structure the evidence, then upgrade the EST answer.",
    memoryHook: "Target • Match • STAR • Strengthen",
    steps: [
      {
        id: "target",
        title: "Step 1: Read the Job Ad",
        instruction: "Choose the move that best targets the role instead of writing a generic application.",
        items: [
          {
            id: "job-target-1",
            prompt: "What makes the opening of a cover letter strongest?",
            options: [
              "It names the specific job advertisement and briefly explains why the applicant suits that role.",
              "It avoids naming the role so the same letter can be sent everywhere.",
              "It repeats the resume word for word."
            ],
            correct: "It names the specific job advertisement and briefly explains why the applicant suits that role.",
            feedback: "Correct. A strong cover letter responds directly to the advertised role and employer."
          },
          {
            id: "job-target-2",
            prompt: "Why should a cover letter be tailored rather than generic?",
            options: [
              "Because it shows understanding of the employer's needs and links skills directly to the role.",
              "Because employers prefer long personal stories unrelated to the job.",
              "Because grammar and structure do not matter if enthusiasm is high."
            ],
            correct: "Because it shows understanding of the employer's needs and links skills directly to the role.",
            feedback: "Correct. Tailoring makes the application relevant and persuasive."
          },
          {
            id: "job-target-3",
            prompt: "Which language choice best suits a cover letter?",
            options: [
              "Clear, concise, professional language appropriate to the employer and industry.",
              "Slang and jokes to sound relaxed.",
              "Vague language that avoids describing any real skills."
            ],
            correct: "Clear, concise, professional language appropriate to the employer and industry.",
            feedback: "Correct. Effective written communication helps the employer quickly understand suitability."
          }
        ]
      },
      {
        id: "criteria",
        title: "Step 2: Match the Selection Criteria",
        instruction: "Choose the response that best shows how to address what the employer is asking for.",
        items: [
          {
            id: "job-criteria-1",
            prompt: "What are selection criteria?",
            options: [
              "The skills, attributes, experience, and abilities an employer uses to judge suitability for the role.",
              "Optional details that applicants can ignore if their resume is strong.",
              "Only technical qualifications and nothing else."
            ],
            correct: "The skills, attributes, experience, and abilities an employer uses to judge suitability for the role.",
            feedback: "Correct. Selection criteria tell the applicant exactly what the employer wants demonstrated."
          },
          {
            id: "job-criteria-2",
            prompt: "What makes a response to selection criteria stronger?",
            options: [
              "Using a clear example from school, work, or volunteering that demonstrates the required skill in action.",
              "Making broad claims without evidence.",
              "Listing personality traits with no example."
            ],
            correct: "Using a clear example from school, work, or volunteering that demonstrates the required skill in action.",
            feedback: "Correct. Employers need evidence, not just claims."
          },
          {
            id: "job-criteria-3",
            prompt: "Which criterion response is strongest for teamwork?",
            options: [
              "Explaining a specific time you worked with others, what you did, and what result was achieved.",
              "Saying you are a team player because everyone says that about themselves.",
              "Talking only about what the team did and not your own contribution."
            ],
            correct: "Explaining a specific time you worked with others, what you did, and what result was achieved.",
            feedback: "Correct. Specific evidence makes the criterion believable and relevant."
          }
        ]
      },
      {
        id: "star",
        title: "Step 3: Structure It with STAR",
        instruction: "Choose the move that best uses Situation, Task, Action, and Result.",
        items: [
          {
            id: "job-star-1",
            prompt: "Why is STAR useful when responding to selection criteria?",
            options: [
              "It organises the example logically so the employer can clearly see the context, action, and result.",
              "It makes answers longer, even if they become less clear.",
              "It replaces the need for an actual example."
            ],
            correct: "It organises the example logically so the employer can clearly see the context, action, and result.",
            feedback: "Correct. STAR improves clarity and keeps the evidence focused."
          },
          {
            id: "job-star-2",
            prompt: "Which part of STAR should show what you personally did?",
            options: [
              "Action",
              "Situation only",
              "Result only"
            ],
            correct: "Action",
            feedback: "Correct. The Action section is where the applicant shows the steps they personally took."
          },
          {
            id: "job-star-3",
            prompt: "What makes the Result section effective?",
            options: [
              "It shows the outcome or impact of the applicant's actions.",
              "It repeats the job advertisement.",
              "It adds unrelated background details."
            ],
            correct: "It shows the outcome or impact of the applicant's actions.",
            feedback: "Correct. The result proves why the example matters."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "job-sentence-1",
            prompt: "Which sentence best explains the purpose of a cover letter?",
            options: [
              "A cover letter introduces the applicant, responds to a specific job advertisement, and highlights why their skills and experience suit the role.",
              "A cover letter is just a longer version of the resume.",
              "A cover letter should stay generic so it can be sent to every employer."
            ],
            correct: "A cover letter introduces the applicant, responds to a specific job advertisement, and highlights why their skills and experience suit the role.",
            feedback: "This is strongest because it explains both the purpose and how the document should function."
          },
          {
            id: "job-sentence-2",
            prompt: "Which sentence best explains why STAR improves a response?",
            options: [
              "STAR strengthens a response by organising evidence into situation, task, action, and result so the employer can clearly assess suitability.",
              "STAR is useful because it makes answers sound complicated.",
              "STAR only matters if the employer asks for exactly four sentences."
            ],
            correct: "STAR strengthens a response by organising evidence into situation, task, action, and result so the employer can clearly assess suitability.",
            feedback: "This is strongest because it links structure directly to employer judgement."
          }
        ]
      }
    ]
  },
  communication: {
    type: "communication-arc",
    title: "Communication Signal Lab",
    subtitle: "Read the audience, listen actively, use non-verbal cues well, then upgrade the EST answer.",
    memoryHook: "Audience • Listen • Non-verbal • Respond",
    steps: [
      {
        id: "audience",
        title: "Step 1: Read the Audience",
        instruction: "Choose the communication move that best suits the purpose, audience, and situation.",
        items: [
          {
            id: "comm-audience-1",
            prompt: "A worker is helping a confused customer find an item. Which response is strongest?",
            options: [
              "Use clear, polite language and explain the information at a level that suits the customer.",
              "Use slang and assume the customer already understands the store layout.",
              "Give the shortest possible answer and walk away."
            ],
            correct: "Use clear, polite language and explain the information at a level that suits the customer.",
            feedback: "Correct. Effective communication adapts the message to the audience and purpose."
          },
          {
            id: "comm-audience-2",
            prompt: "Why is adapting communication important?",
            options: [
              "Because different audiences and situations need different language, tone, and detail.",
              "Because the same communication style works perfectly everywhere.",
              "Because tone and format have no effect on understanding."
            ],
            correct: "Because different audiences and situations need different language, tone, and detail.",
            feedback: "Correct. Good communicators adjust the message instead of using one fixed style."
          },
          {
            id: "comm-audience-3",
            prompt: "Which workplace message is the clearest and most appropriate?",
            options: [
              "We're nearly out of drinks at the front, so can someone restock before the rush gets worse?",
              "Stuff is gone. Someone deal with it.",
              "Nothing needs to be said because people should notice for themselves."
            ],
            correct: "We're nearly out of drinks at the front, so can someone restock before the rush gets worse?",
            feedback: "Correct. It is specific, respectful, and helps the team act quickly."
          }
        ]
      },
      {
        id: "listen",
        title: "Step 2: Use Active Listening",
        instruction: "Choose the response that best shows real listening, not passive hearing.",
        items: [
          {
            id: "comm-listen-1",
            prompt: "A supervisor gives instructions for a display setup. What is the strongest listening move?",
            options: [
              "Ask a clarifying question like, 'Do you want these arranged by size?' before starting.",
              "Pretend to understand and guess the rest later.",
              "Interrupt halfway through because you already know enough."
            ],
            correct: "Ask a clarifying question like, 'Do you want these arranged by size?' before starting.",
            feedback: "Correct. Active listening includes checking understanding before acting."
          },
          {
            id: "comm-listen-2",
            prompt: "Which behaviour best shows active listening to a customer complaint?",
            options: [
              "Listen without interrupting, focus on the speaker, and respond calmly to what was actually said.",
              "Look at your phone while they explain the issue.",
              "Start defending yourself before they finish speaking."
            ],
            correct: "Listen without interrupting, focus on the speaker, and respond calmly to what was actually said.",
            feedback: "Correct. Active listening reduces misunderstandings and shows respect."
          },
          {
            id: "comm-listen-3",
            prompt: "Why is paraphrasing useful in workplace communication?",
            options: [
              "It confirms understanding by checking that the message was received correctly.",
              "It makes conversations longer for no reason.",
              "It replaces the need to pay attention in the first place."
            ],
            correct: "It confirms understanding by checking that the message was received correctly.",
            feedback: "Correct. Paraphrasing helps ensure the task or message is understood accurately."
          }
        ]
      },
      {
        id: "nonverbal",
        title: "Step 3: Use Non-verbal Signals Well",
        instruction: "Choose the move that best uses tone, body language, and facial expression to support the message.",
        items: [
          {
            id: "comm-nonverbal-1",
            prompt: "A worker is dealing with a busy queue and an impatient customer. Which non-verbal response is strongest?",
            options: [
              "Maintain eye contact, face the customer, and keep a calm, respectful tone.",
              "Roll your eyes and keep scanning the room while they speak.",
              "Cross your arms and use a sharp voice to end the conversation faster."
            ],
            correct: "Maintain eye contact, face the customer, and keep a calm, respectful tone.",
            feedback: "Correct. Positive non-verbal communication reinforces respect and helps de-escalate pressure."
          },
          {
            id: "comm-nonverbal-2",
            prompt: "Why does non-verbal communication matter?",
            options: [
              "It supports meaning, builds connection, and can reduce misunderstandings.",
              "It only matters in acting, not real workplaces.",
              "It is less important than the words in every situation."
            ],
            correct: "It supports meaning, builds connection, and can reduce misunderstandings.",
            feedback: "Correct. Tone, posture, and facial expression shape how messages are received."
          },
          {
            id: "comm-nonverbal-3",
            prompt: "Which interview behaviour best supports a positive first impression?",
            options: [
              "Sit upright, maintain appropriate eye contact, and use a calm, confident tone.",
              "Avoid eye contact and answer in a rushed monotone.",
              "Check your phone while the interviewer explains the role."
            ],
            correct: "Sit upright, maintain appropriate eye contact, and use a calm, confident tone.",
            feedback: "Correct. Employers judge communication through both verbal and non-verbal signals."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "comm-sentence-1",
            prompt: "Which sentence best explains communication skills in the workplace?",
            options: [
              "Communication skills involve using clear verbal language, active listening, and appropriate non-verbal cues so messages are understood in different situations.",
              "Communication means talking a lot so people know you are involved.",
              "Communication skills only matter in formal interviews."
            ],
            correct: "Communication skills involve using clear verbal language, active listening, and appropriate non-verbal cues so messages are understood in different situations.",
            feedback: "This is strongest because it names the main communication elements and explains the goal clearly."
          },
          {
            id: "comm-sentence-2",
            prompt: "Which sentence best explains why communication matters in an interview?",
            options: [
              "Strong communication helps an applicant listen carefully, answer clearly, and build a positive impression that matches the workplace culture.",
              "Interviews are mostly about luck, not communication.",
              "Only the words matter; listening and body language make no difference."
            ],
            correct: "Strong communication helps an applicant listen carefully, answer clearly, and build a positive impression that matches the workplace culture.",
            feedback: "This is strongest because it links communication directly to interview success and workplace fit."
          }
        ]
      }
    ]
  }
};

const FULL_GLOSSARY_TERMS = [
  { term: "Arbitration", definition: "A formal dispute resolution process whereby a neutral third party considers the arguments and evidence presented by disputing parties to determine a solution that will be binding for all involved." },
  { term: "Career", definition: "The sequence and variety of roles which one undertakes throughout a lifetime. It encompasses all life roles, not just occupation, and includes all paid and unpaid work, learning, leisure activities, and community and family responsibilities." },
  { term: "Career adaptability", definition: "The ability to adjust to changing work conditions and or environments by recognising and pursuing opportunities for a positive transition to new work roles." },
  { term: "Career competencies", definition: "The knowledge, skills and attitudes that promote intentional career development, lifelong learning and work life balance that can be developed and strengthened over time." },
  { term: "Career development", definition: "The lifelong process of gaining the knowledge, skills, attributes and behaviours to manage life, learning, leisure and work in order to move towards a personally determined and evolving preferred future." },
  { term: "Cover letter", definition: "A document that accompanies a job applicant's resume which concisely communicates their interest in a job opportunity and highlights the skills and attributes that make them a suitable candidate." },
  { term: "Demographic shift", definition: "The change in the size and nature of a population due to migration and changes in birth and death rates." },
  { term: "Dispute resolution", definition: "A process which aims to settle a conflict or disagreement between two or more people by developing a solution which is believed to be fair to all parties." },
  { term: "Diversity", definition: "The state of having or being composed of a variety of elements. In a work context, it refers to the inclusion of different types of people based on age, ethnicity, gender, religion and or ability disability." },
  { term: "Economic power shift", definition: "The long term global shift away from established advanced economies to emerging market countries." },
  { term: "Emerging industries", definition: "Industries that are in the early stages of creating new products and services or transforming existing products and services through innovation and or technology." },
  { term: "Enterprise", definition: "The willingness to try new things, show initiative and embrace and or promote innovative activities." },
  { term: "Enterprise culture", definition: "The shared values, beliefs, attitudes, standards and behaviours that characterise a work environment." },
  { term: "Impactful technology", definition: "The emergence of technologies that have the capacity to improve products, services and processes, but to also cause disruption and uncertainty for society and the economy." },
  { term: "Green industries", definition: "Industries that actively participate in protecting or improving the environment by adopting processes that reduce waste and or pollution or by producing sustainable products using environmentally friendly processes and materials." },
  { term: "Grievance", definition: "Any real or perceived problem an employee has about their work, the workplace or someone they work with." },
  { term: "Growth industry", definition: "An industry that is experiencing a higher than average growth rate compared to other industries." },
  { term: "Initiative", definition: "Taking a proactive approach to completing work tasks, overcoming challenges and dealing with unexpected events." },
  { term: "Learning opportunity", definition: "A situation that allows a person to develop knowledge, understanding and skills." },
  { term: "Lifelong learning", definition: "The ongoing, voluntary and self motivated pursuit of knowledge, understanding and skill development for either personal or professional reasons." },
  { term: "Mediation", definition: "A dispute resolution process whereby a neutral third party facilitates communication and negotiation between disputing parties, helping them to reach a compromised solution." },
  { term: "Megatrend", definition: "A significant and long lasting development that has a transformative impact on the way we live, work and do business." },
  { term: "Performance management", definition: "The continuous process of feedback and communication between an employer and an employee, so that the employee is supported in performing their work role to the best of their ability." },
  { term: "Personal risk", definition: "A risk that directly impacts on the individual and or their family." },
  { term: "Professional development", definition: "Undertaking learning and training to develop, refine and enhance skills, knowledge and understandings." },
  { term: "Professional risk", definition: "A risk taken during career development which can result in improved outcomes for the individual." },
  { term: "Resilience", definition: "The ability to endure adversity and bounce back from challenging life events." },
  { term: "Selection criteria", definition: "The qualities, skills, abilities, knowledge and qualifications needed to perform a job role effectively." },
  { term: "Skills shortage", definition: "A situation that occurs when employers cannot fill vacancies in an occupation or in a specialisation within that occupation." },
  { term: "Work environment", definition: "The physical conditions, procedures and processes, and social dynamics which comprise a place of work." }
];

const GLOSSARY_ROUND_CONFIGS = [
  { id: "colour-shape", title: "Round 1: Signal Scan", cue: "Recover the right glossary term from the clue trail and stabilise the first chamber." },
  { id: "shape-only", title: "Round 2: Definition Repair", cue: "Restore the correct definition file for each term and bring chamber two back online." },
  { id: "plain-match", title: "Round 3: Corruption Sweep", cue: "The supports are gone. Recover the correct term from meaning alone." },
  { id: "recall", title: "Round 4: Recall Forge", cue: "Use keywords to retrieve the term, then retrieve a keyword from the term." }
];

const STAGES = [
  { id: "content", title: "EST Content Check", state: "Knowledge reactor", summary: "Check the actual revision content before answering under pressure.", marks: 4, readiness: 18, credits: 1600, taxRate: 0.1 },
  { id: "glossary", title: "Glossary Check", state: "Precision language", summary: "Use exact glossary terms and definitions, not vague wording.", marks: 4, readiness: 20, credits: 1600, taxRate: 0.1 },
  { id: "decoder", title: "VTCS Decoder", state: "Question decode", summary: "Unpack verb, topic, context, and structure before you write.", marks: 4, readiness: 24, credits: 2200, taxRate: 0.1 },
  { id: "boss", title: "Boss Round", state: "EST simulation", summary: "Build and justify a mark-worthy EST response with richer feedback.", marks: 8, readiness: 34, credits: 3400, taxRate: 0.1 }
];

const HUB_SECTION_IDS = ["hero-section", "metrics-section", "reward-strip", "track-section", "logs-section"];

const state = {
  student: null,
  bank: null,
  stageDeck: null,
  selectedStageId: null,
  stageStartedAt: 0,
  completed: {},
  evidenceLog: [],
  debriefLog: [],
  recentReward: null,
  contentStageConfig: null,
  marksBanked: 0,
  readiness: 0,
  confidence: 40,
  streak: 1,
  salaryBoost: 0,
  creditedSalaryBoost: 0,
  taxContribution: 0,
  creditedTaxContribution: 0,
  answers: {},
  lastBossReview: null,
  contentGroupIndex: -1,
  contentView: "menu",
  contentGroupStartedAt: 0,
  contentGroupDurations: {},
  glossaryBoard: [],
  glossarySelection: [],
  matchedGlossaryCards: [],
  matchedGlossaryTerms: [],
  glossaryTarget: null,
  glossaryRoundIndex: 0,
  glossaryBatchIndex: 0,
  glossaryAssignments: {},
  glossarySelectedTermId: "",
  glossarySelectedSocketId: "",
  glossaryDraggedTermId: "",
  glossaryRecallAnswers: {},
  glossaryRecallResults: {},
  glossaryRecallIndex: 0,
  glossaryRecallTransition: null,
  glossaryStreak: 0,
  glossaryBestStreak: 0,
  glossaryMisses: 0,
  glossaryPulse: "",
  glossaryPulseType: "neutral",
  glossaryRoundCelebration: null,
  glossaryRoundRewards: {},
  glossaryRoundVotes: {},
  glossaryMissionMode: false,
  glossaryRoundStartedAt: 0,
  glossaryHasStarted: false,
  glossaryMode: "play",
  glossaryStudyIndex: 0,
  stageBestScores: {}
};

let glossaryTimerInterval = null;
let glossaryRecallAdvanceTimeout = null;

function clearGlossaryRecallAdvanceTimeout() {
  if (glossaryRecallAdvanceTimeout) {
    clearTimeout(glossaryRecallAdvanceTimeout);
    glossaryRecallAdvanceTimeout = null;
  }
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function getAuthState() {
  return readJsonStorage(AUTH_DEMO_STATE_KEY, {});
}

function getPlayerSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function writePlayerSession(patch) {
  const next = { ...getPlayerSession(), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent({
    moduleId: MODULE_ID,
    ...entry
  });
}

function shouldWarnBeforeLeaving() {
  return Boolean(state.selectedStageId || Object.keys(state.completed).length || state.evidenceLog.length);
}

function registerLeaveWarning() {
  window.addEventListener("beforeunload", event => {
    if (!shouldWarnBeforeLeaving()) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

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

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function getStageMeta(stageId) {
  return STAGES.find(stage => stage.id === stageId) || null;
}

function getFocusSubtitle() {
  const stage = getStageMeta(state.selectedStageId);
  if (!stage) return "Focused EST lab";
  if (state.selectedStageId !== "content") return `${stage.title} focused mode`;
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  return currentGroup ? `${stage.title} • ${currentGroup.title}` : `${stage.title} topic menu`;
}

function setLabMode(active) {
  document.body.classList.toggle("est-lab-mode", active);
  HUB_SECTION_IDS.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.classList.toggle("is-hidden", active);
  });
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("is-hidden", !active);
}

function setStageMenuMode(active) {
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("menu-mode", active);
}

function renderFocusNav() {
  const container = document.getElementById("focus-nav");
  if (!container) return;
  if (!state.selectedStageId) {
    container.innerHTML = "";
    return;
  }

  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  const contentMenuPrompt = "Choose an EST curriculum content area below";
  container.innerHTML = `
    <div class="focus-toolbar">
      <button type="button" class="focus-back" onclick="window.ESTPrep.returnToTrack()">← Back to EST Hub</button>
      <div class="focus-label">${state.selectedStageId === "content" && !currentGroup ? "Choose an EST curriculum content area below" : escapeHtml(getFocusSubtitle())}</div>
    </div>
    <div class="focus-intro">You're in the EST Preparation module.</div>
    <div class="focus-track">
      ${STAGES.map(stage => `
        <button
          type="button"
          class="focus-track-button ${state.selectedStageId === stage.id ? "active" : ""}"
          onclick="window.ESTPrep.openStage('${stage.id}')"
        >
          <strong>${escapeHtml(stage.title)}</strong>
        </button>
      `).join("")}
    </div>
    ${state.selectedStageId === "content" ? `
      <div class="content-track-title-row">
        <div class="content-track-title">Topic Menu</div>
        <div class="content-track-subtitle">${escapeHtml(currentGroup ? currentGroup.title : contentMenuPrompt)}</div>
      </div>
      <div class="content-track content-track-menu ${currentGroup ? "has-selection" : ""}">
        ${groups.map((group, index) => `
          <button
            type="button"
            class="content-track-button ${index === state.contentGroupIndex ? "active" : ""}"
            onclick="window.ESTPrep.openContentGroupIntro(${index})"
          >
            <strong>${index + 1}. ${escapeHtml(group.title)}</strong>
          </button>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function scrollToTopSmooth() {
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (_) {
    window.scrollTo(0, 0);
  }
}

function formatSecondsAsClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearGlossaryTimer() {
  if (glossaryTimerInterval) {
    window.clearInterval(glossaryTimerInterval);
    glossaryTimerInterval = null;
  }
}

function getGlossaryRoundElapsedSeconds() {
  if (!state.glossaryRoundStartedAt) return 0;
  return Math.max(0, Math.round((Date.now() - state.glossaryRoundStartedAt) / 1000));
}

function startGlossaryRoundTimer(reset = false) {
  if (reset || !state.glossaryRoundStartedAt) {
    state.glossaryRoundStartedAt = Date.now();
  }
  clearGlossaryTimer();
  glossaryTimerInterval = window.setInterval(() => {
    const timer = document.getElementById("glossary-round-timer");
    if (timer) timer.textContent = formatSecondsAsClock(getGlossaryRoundElapsedSeconds());
  }, 1000);
}

function getGlossarySpeedBand(elapsedSeconds) {
  if (elapsedSeconds <= 95) return { label: "Gold speed bonus", bonus: 650 };
  if (elapsedSeconds <= 150) return { label: "Silver speed bonus", bonus: 360 };
  return { label: "Bronze speed bonus", bonus: 180 };
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function clampText(text, maxLength = 120) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function getContentStageConfig() {
  return state.contentStageConfig || {
    topicGroups: DEFAULT_CONTENT_TOPIC_GROUPS,
    trainingBays: DEFAULT_CONTENT_TRAINING_BAYS
  };
}

function buildContentGroups(bank) {
  const rounds = bank.contentRounds || [];
  const { topicGroups } = getContentStageConfig();
  return topicGroups.map(group => ({
    ...group,
    rounds: pickRandom(rounds.filter(round => group.topics.includes(round.topic)), 2)
  })).filter(group => group.rounds.length);
}

function getLoggedInStudent() {
  const auth = getAuthState();
  const session = getPlayerSession();
  const login = auth.studentLogin || {};
  if (!login.id && !login.username && !session.studentId && !session.playerName) return null;
  return {
    id: login.id || session.studentId || null,
    username: login.username || session.username || "",
    displayName: login.displayName || session.playerName || login.username || "Student",
    classId: login.classId || session.classId || null,
    classCode: login.classCode || session.classCode || "",
    className: login.className || session.className || "",
    schoolName: login.schoolName || session.schoolName || ""
  };
}

async function loadBank() {
  const response = await fetch(BANK_PATH);
  if (!response.ok) throw new Error("Could not load the EST Prep content bank.");
  return response.json();
}

async function loadContentStageConfig() {
  try {
    const response = await fetch(CONTENT_STAGE_CONFIG_PATH);
    if (!response.ok) throw new Error("Could not load EST content stage config.");
    return response.json();
  } catch (error) {
    console.warn("Using fallback EST content stage config.", error);
    return {
      topicGroups: DEFAULT_CONTENT_TOPIC_GROUPS,
      trainingBays: DEFAULT_CONTENT_TRAINING_BAYS
    };
  }
}

function normaliseGlossaryTermText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function deriveGlossaryKeywords(definition) {
  const stopWords = new Set(["the", "and", "that", "with", "from", "their", "this", "into", "which", "when", "whereby", "while", "between", "they", "them", "such", "have", "has", "been", "will", "just", "more", "than", "over", "under", "work", "role", "roles", "process", "processes", "using", "used", "throughout", "within", "towards", "about", "your", "their", "these", "those", "what", "because", "allows", "allow", "being"]);
  return [...new Set(
    String(definition || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
  )].slice(0, 4);
}

function buildGlossarySource() {
  return FULL_GLOSSARY_TERMS.map((item, index) => ({
    id: `full-glossary-${index + 1}`,
    term: item.term,
    definition: item.definition,
    keywords: deriveGlossaryKeywords(item.definition)
  }));
}

function buildStageDeck(bank) {
  const glossaryTerms = buildGlossarySource();
  const contentGroups = buildContentGroups(bank);
  const glossaryBatches = chunkArray(pickRandom(glossaryTerms, 16), 4).slice(0, 4);

  return {
    contentGroups,
    glossaryBatches,
    decoderRound: pickRandom(bank.decoderRounds || [], 1)[0] || null,
    bossRound: pickRandom(bank.bossRounds || [], 1)[0] || null,
    communityOptions: bank.communityOptions || []
  };
}

function renderHero() {
  const badgeRow = document.getElementById("hero-badges");
  if (!badgeRow) return;
  const student = state.student;
  badgeRow.innerHTML = [
    `<span class="badge">Student: ${escapeHtml(student?.displayName || "Guest")}</span>`,
    `<span class="badge">School: ${escapeHtml(student?.schoolName || "Not linked")}</span>`,
    `<span class="badge">Class: ${escapeHtml(student?.classCode || "No class code")}</span>`,
    `<span class="badge">Salary Boost: ${formatCurrency(state.salaryBoost)}</span>`
  ].join("");
}

function renderRewardPulse() {
  const chipRow = document.getElementById("reward-chips");
  if (chipRow) {
    chipRow.innerHTML = [
      `Marks: ${state.marksBanked}`,
      `Readiness: ${state.readiness}%`,
      `Salary: ${formatCurrency(state.salaryBoost)}`,
      `Community Tax: ${formatCurrency(state.taxContribution)}`,
      `Streak: x${state.streak}`
    ].map(chip => `<span class="reward-chip">${escapeHtml(chip)}</span>`).join("");
  }

  const pulse = document.getElementById("stage-pulse");
  if (!pulse) return;
  if (!state.recentReward) {
    pulse.innerHTML = `
      <div class="pulse-card">
        <strong>Mission pulse</strong>
        <p>Your choices should trigger visible marks, readiness, salary, and community gains here.</p>
      </div>
    `;
    return;
  }

  pulse.innerHTML = `
    <div class="pulse-card ${state.recentReward.type}">
      <strong>${escapeHtml(state.recentReward.title)}</strong>
      <p>${escapeHtml(state.recentReward.detail)}</p>
    </div>
  `;
}

function renderMetrics() {
  setText("metric-progress", `${Object.keys(state.completed).length}/4`);
  setText("metric-marks", String(state.marksBanked));
  setText("metric-readiness", `${state.readiness}%`);
  setText("metric-streak", `x${state.streak}`);
}

function renderMap() {
  const container = document.getElementById("challenge-map");
  if (!container) return;
  container.innerHTML = STAGES.map(stage => `
    <article class="challenge-tile ${state.completed[stage.id] ? "completed" : ""} ${state.selectedStageId === stage.id ? "active" : ""}">
      <div class="kicker">${escapeHtml(stage.state)}</div>
      <h3>${escapeHtml(stage.title)}</h3>
      <p>${escapeHtml(stage.summary)}</p>
      <div class="challenge-meta">
        <span>${stage.marks} marks</span>
        <span>${stage.readiness}% readiness</span>
      </div>
      <button type="button" onclick="window.ESTPrep.openStage('${stage.id}')">${state.completed[stage.id] ? "Review lab" : "Open lab"}</button>
    </article>
  `).join("");
}

function renderResources() {
  const container = document.getElementById("resource-board");
  if (!container) return;
  const bossPrompt = state.stageDeck?.bossRound?.question || "Boss round loading...";
  container.innerHTML = [
    { title: "Exam Readiness", detail: `${state.readiness}% and rising as you decode and respond accurately.` },
    { title: "Confidence", detail: `${state.confidence}% - clean decoding and strong answers keep your streak alive.` },
    { title: "Salary Reward", detail: `${formatCurrency(state.salaryBoost)} added to your wider Career Empire profile.` },
    { title: "Community Tax", detail: `${formatCurrency(state.taxContribution)} heading into the class/community economy.` },
    { title: "Current Boss Focus", detail: bossPrompt }
  ].map(item => `<div class="resource-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>`).join("");
}

function renderDebrief() {
  const container = document.getElementById("debrief-log");
  if (!container) return;
  if (!state.debriefLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No debrief yet</strong><p>Clear your first stage and the EST lab will start banking rewards and feedback.</p></div>';
    return;
  }
  container.innerHTML = state.debriefLog.slice(-5).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderEvidence() {
  const container = document.getElementById("evidence-log");
  if (!container) return;
  if (!state.evidenceLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No evidence saved yet</strong><p>Written responses and decoded question artifacts will appear here.</p></div>';
    return;
  }
  container.innerHTML = state.evidenceLog.slice(-6).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderStageRoot(html) {
  const root = document.getElementById("stage-root");
  if (root) root.innerHTML = html;
}

function renderOptionGroup(groupKey, title, options) {
  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(title)}</h2>
        <p>Choose one</p>
      </div>
      <div class="mcq-grid">
        ${options.map(option => `
          <button
            type="button"
            class="choice-button ${state.answers[groupKey] === option ? "selected live-selected" : ""}"
            data-group="${escapeHtml(groupKey)}"
            data-value="${escapeHtml(option)}"
            onclick="window.ESTPrep.setChoiceEncoded('${groupKey}', '${encodeURIComponent(option)}')"
          >
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function getContentTrainingConfig(groupId) {
  const { trainingBays } = getContentStageConfig();
  return trainingBays[groupId] || null;
}

function isArcTrainingType(type) {
  return /-arc$/.test(String(type || ""));
}

function getArcTrainingAnswerKey(configType, itemId) {
  return `training-${configType}-${itemId}`;
}

function getTrainingScore(config) {
  if (!config) return { correct: 0, total: 0, percent: 0 };
  if (isArcTrainingType(config.type)) {
    const items = (config.steps || []).flatMap(step => step.items || []);
    const total = items.length;
    const correct = items.filter(item => state.answers[getArcTrainingAnswerKey(config.type, item.id)] === item.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "sort") {
    const total = config.cards.length;
    const correct = config.cards.filter(card => state.answers[`training-${config.type}-${card.id}`] === card.correctBucket).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "scenario") {
    const total = config.scenarios.length;
    const correct = config.scenarios.filter(scenario => state.answers[`training-${config.type}-${scenario.id}`] === scenario.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  if (config.type === "builder") {
    const total = config.rounds.length;
    const correct = config.rounds.filter(round => state.answers[`training-${config.type}-${round.id}`] === round.correct).length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }
  return { correct: 0, total: 0, percent: 0 };
}

function renderArcTrainingBay(config, score) {
  const groupId = getGroupIdForTrainingType(config.type);
  const guide = groupId ? renderESTGuidePanel(groupId, "challenge") : "";
  return `
    <div class="panel training-bay training-campaign">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} training decisions locked</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      ${config.memoryHook ? `<div class="badge-row" style="margin-top:14px;"><span class="badge">${escapeHtml(config.memoryHook)}</span></div>` : ""}
      ${guide}
      <div class="training-campaign-grid">
        ${(config.steps || []).map((step, stepIndex) => `
          <section class="training-step">
            <div class="section-title">
              <h2>${escapeHtml(step.title)}</h2>
              <p>${escapeHtml(step.instruction || "Choose the strongest initiative move.")}</p>
            </div>
            <div class="training-stack">
              ${(step.items || []).map(item => {
                const answer = state.answers[getArcTrainingAnswerKey(config.type, item.id)];
                const isCorrect = answer && answer === item.correct;
                return `
                  <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
                    <div class="kicker">Initiative level ${stepIndex + 1}</div>
                    <strong>${escapeHtml(item.prompt)}</strong>
                    <div class="training-stack">
                      ${item.options.map(option => `
                        <button
                          type="button"
                          class="choice-button ${answer === option ? "selected live-selected" : ""}"
                          onclick="window.ESTPrep.setTrainingChoiceEncoded('${getArcTrainingAnswerKey(config.type, item.id)}', '${encodeURIComponent(option)}')"
                        >
                          <strong>${escapeHtml(option)}</strong>
                        </button>
                      `).join("")}
                    </div>
                    <p class="training-feedback">${answer ? `${isCorrect ? "Strong initiative call." : "Try the stronger move mentally."} ${escapeHtml(item.feedback)}` : "Choose the answer that best demonstrates initiative in this situation."}</p>
                  </article>
                `;
              }).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function renderSortTrainingBay(config, score) {
  return `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} sorted</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      <div class="training-lanes">
        <span class="training-lane-tag good">${escapeHtml(config.leftLabel)}</span>
        <span class="training-lane-tag">${escapeHtml(config.rightLabel)}</span>
      </div>
      <div class="training-grid">
        ${config.cards.map(card => {
          const answer = state.answers[`training-sort-${card.id}`];
          const isCorrect = answer && answer === card.correctBucket;
          return `
            <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
              <strong>${escapeHtml(card.text)}</strong>
              <div class="training-actions">
                <button type="button" class="choice-button ${answer === "left" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setTrainingChoice('training-sort-${card.id}', 'left')">${escapeHtml(config.leftLabel)}</button>
                <button type="button" class="choice-button ${answer === "right" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setTrainingChoice('training-sort-${card.id}', 'right')">${escapeHtml(config.rightLabel)}</button>
              </div>
              <p class="training-feedback">${answer ? `${isCorrect ? "Strong call." : "Try again mentally."} ${escapeHtml(card.feedback)}` : "Pick the lane that best matches the behaviour."}</p>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderScenarioTrainingBay(config, score) {
  return `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} scenario calls</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      <div class="training-grid">
        ${config.scenarios.map(scenario => {
          const answer = state.answers[`training-scenario-${scenario.id}`];
          const isCorrect = answer && answer === scenario.correct;
          return `
            <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
              <div class="kicker">${escapeHtml(scenario.title)}</div>
              <p>${escapeHtml(scenario.prompt)}</p>
              <div class="training-stack">
                ${scenario.options.map(option => `
                  <button
                    type="button"
                    class="choice-button ${answer === option ? "selected live-selected" : ""}"
                    onclick="window.ESTPrep.setTrainingChoiceEncoded('training-scenario-${scenario.id}', '${encodeURIComponent(option)}')"
                  >
                    <strong>${escapeHtml(option)}</strong>
                  </button>
                `).join("")}
              </div>
              <p class="training-feedback">${answer ? `${isCorrect ? "Best move." : "Risky move."} ${escapeHtml(scenario.feedback)}` : "Choose the strongest next action."}</p>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderBuilderTrainingBay(config, score) {
  return `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>${escapeHtml(config.title)}</h2>
        <p>${score.correct}/${score.total} build choices locked</p>
      </div>
      <p class="small-copy">${escapeHtml(config.subtitle)}</p>
      <div class="builder-grid">
        ${config.rounds.map(round => {
          const answer = state.answers[`training-builder-${round.id}`];
          const isCorrect = answer && answer === round.correct;
          return `
            <article class="training-card ${answer ? (isCorrect ? "good" : "bad") : ""}">
              <div class="kicker">${escapeHtml(round.title)}</div>
              <p>${escapeHtml(round.prompt)}</p>
              <div class="training-stack">
                ${round.options.map(option => `
                  <button
                    type="button"
                    class="choice-button ${answer === option ? "selected live-selected" : ""}"
                    onclick="window.ESTPrep.setTrainingChoiceEncoded('training-builder-${round.id}', '${encodeURIComponent(option)}')"
                  >
                    <strong>${escapeHtml(round.builderLabel || "Best move")}</strong>
                    <small>${escapeHtml(option)}</small>
                  </button>
                `).join("")}
              </div>
              <p class="training-feedback">${answer ? `${isCorrect ? "Stronger build." : "This weakens the response."} ${escapeHtml(round.feedback)}` : "Choose the move that would build the strongest EST-style response."}</p>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function getContentResponseScaffold(group) {
  return group?.responseScaffold || DEFAULT_CONTENT_RESPONSE_SCAFFOLDS[group?.id] || null;
}

function getContentResponseSegmentKey(groupId, segmentId) {
  return `content-scaffold-${groupId}-${segmentId}`;
}

function normaliseCoachText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getContentResponseCoachChecks(group, scaffold = getContentResponseScaffold(group)) {
  const defaultChecks = {
    initiative: [
      { id: "concept", label: "Names initiative clearly", keywords: ["initiative", "proactive", "improvement", "responsib", "help"] },
      { id: "example", label: "Uses a workplace action or example", keywords: ["restock", "suggest", "help", "volunteer", "system", "colleague"] },
      { id: "impact", label: "Explains the workplace effect", keywords: ["because", "productiv", "team", "safety", "efficient", "workplace"] }
    ],
    "time-management": [
      { id: "concept", label: "Explains planning and prioritising", keywords: ["plan", "prioritis", "deadline", "schedule", "organis"] },
      { id: "example", label: "Uses a tool or process example", keywords: ["planner", "calendar", "checklist", "reminder", "task", "sequence"] },
      { id: "impact", label: "Explains how deadlines are met", keywords: ["because", "deadline", "order", "adjust", "progress", "manage"] }
    ],
    "personal-finance": [
      { id: "concept", label: "Explains budgeting or financial management", keywords: ["budget", "income", "expense", "finance", "spending"] },
      { id: "example", label: "Uses a support or decision example", keywords: ["seek", "assistance", "review", "essential", "support", "adjust"] },
      { id: "impact", label: "Explains why the action helps", keywords: ["because", "stress", "decision", "informed", "manage", "stability"] }
    ],
    "job-application": [
      { id: "concept", label: "Explains STAR or the application method", keywords: ["star", "situation", "task", "action", "result", "criteria"] },
      { id: "example", label: "Shows evidence or structure", keywords: ["example", "evidence", "criteria", "clear", "response", "structure"] },
      { id: "impact", label: "Explains the employer benefit", keywords: ["because", "employer", "suitable", "show", "understand", "clear"] }
    ],
    communication: [
      { id: "concept", label: "Explains the communication skill", keywords: ["communic", "listen", "verbal", "non verbal", "clear"] },
      { id: "example", label: "Uses a workplace or interview action", keywords: ["clarify", "audience", "interview", "workplace", "understand"] },
      { id: "impact", label: "Explains the effect on others or tasks", keywords: ["because", "misunderstanding", "rapport", "effective", "task", "clear"] }
    ],
    "future-of-work": [
      { id: "concept", label: "Explains megatrends or labour market change", keywords: ["megatrend", "future of work", "industry", "change", "labour market"] },
      { id: "example", label: "Uses evidence, a growth area, or industry example", keywords: ["growth", "health", "technology", "renewable", "data", "industry"] },
      { id: "impact", label: "Explains why it matters for career pathways", keywords: ["because", "opportunit", "career", "skills", "training", "pathway"] }
    ]
  };
  return scaffold?.coachChecks || defaultChecks[group?.id] || [];
}

function evaluateContentResponse(group) {
  const scaffold = getContentResponseScaffold(group);
  const checks = getContentResponseCoachChecks(group, scaffold);
  const builtResponse = buildContentResponseText(group);
  const normalizedBuilt = normaliseCoachText(builtResponse);
  const segmentResults = (scaffold?.segments || []).map(segment => {
    const value = String(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "").trim();
    const normalized = normaliseCoachText(value);
    const coachCheck = checks.find(item => item.id === segment.id);
    const lengthPass = normalized.split(" ").filter(Boolean).length >= 3;
    const keywordPass = !coachCheck?.keywords?.length || coachCheck.keywords.some(keyword => normalized.includes(normaliseCoachText(keyword)));
    return {
      id: segment.id,
      label: coachCheck?.label || segment.label,
      passed: Boolean(value) && lengthPass && keywordPass,
      value
    };
  });
  const builtHasReasoning = /(^|\s)(because|so|which|therefore|helps|shows)\b/.test(normalizedBuilt);
  const passedCount = segmentResults.filter(item => item.passed).length + (builtHasReasoning ? 1 : 0);
  const totalChecks = segmentResults.length + 1;
  const level = passedCount >= totalChecks ? "strong" : passedCount >= Math.max(2, totalChecks - 1) ? "developing" : "needs-work";
  const summary = level === "strong"
    ? "This reads like a stronger EST-ready response: clear idea, useful example, and a reasoned effect."
    : level === "developing"
      ? "This is moving in the right direction, but one part is still too vague or underdeveloped."
      : "This still needs more clarity. Add a sharper content point, a more specific example, and a stronger why-it-matters explanation.";

  return {
    builtResponse,
    segmentResults,
    builtHasReasoning,
    level,
    summary
  };
}

function setContentResponseSegment(groupId, segmentId, value) {
  state.answers[getContentResponseSegmentKey(groupId, segmentId)] = value;
}

function setContentNoteValue(groupId, value) {
  state.answers[`content-note-${groupId}`] = value;
}

function buildContentResponseText(group) {
  const scaffold = getContentResponseScaffold(group);
  if (!scaffold) return state.answers[`content-note-${group.id}`] || "";
  return (scaffold.segments || [])
    .map(segment => {
      const value = String(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "").trim();
      if (!value) return "";
      const sentence = `${segment.starter}${value}`.trim();
      return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
    })
    .filter(Boolean)
    .join(" ");
}

function buildContentResponse(groupId) {
  const groups = state.stageDeck?.contentGroups || [];
  const group = groups.find(item => item.id === groupId);
  if (!group) return;
  const built = buildContentResponseText(group);
  state.answers[`content-note-${groupId}`] = built;
  const textarea = document.getElementById("content-note");
  if (textarea) textarea.value = built;
  state.recentReward = {
    type: "positive",
    title: "Response built",
    detail: "Your scaffold segments have been combined into a short EST-ready paragraph you can refine."
  };
  renderRewardPulse();
  renderContentStage();
}

function renderContentResponseForge(group) {
  const scaffold = getContentResponseScaffold(group);
  if (!scaffold) {
    return `
      <div class="written-stage">
        <strong>Quick EST response</strong>
        <p class="small-copy">Write a short response so teachers can see how well you can explain this content area, not just select the right option. Students can compare this with a model answer after submission.</p>
        <textarea id="content-note" placeholder="Write one or two EST-ready sentences for this content strand...">${escapeHtml(state.answers[`content-note-${group.id}`] || "")}</textarea>
      </div>
    `;
  }

  const builtResponse = state.answers[`content-note-${group.id}`] || buildContentResponseText(group);
  const responseCoach = evaluateContentResponse(group);
  const segments = scaffold.segments || [];

  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(scaffold.title || "Quick EST response")}</h2>
        <p>${escapeHtml(scaffold.subtitle || "Build the response in small steps, then combine it.")}</p>
      </div>
      <p class="small-copy">${escapeHtml(group.writePrompt)}</p>
      ${renderESTGuidePanel(group.id, "forge")}
      <div class="builder-grid" style="margin-top:14px;">
        ${segments.map((segment, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(segment.label || `Sentence starter ${index + 1}`)}</strong>
            <p class="small-copy"><strong>${escapeHtml(segment.starter)}</strong></p>
            <textarea
              id="content-scaffold-${group.id}-${segment.id}"
              placeholder="${escapeHtml(segment.placeholder || "Add your idea here...")}"
              oninput="window.ESTPrep.setContentResponseSegmentEncoded('${group.id}', '${segment.id}', this.value)"
            >${escapeHtml(state.answers[getContentResponseSegmentKey(group.id, segment.id)] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildContentResponse('${group.id}')">Build Response Paragraph</button>
      </div>
    </div>
    <div class="written-stage">
      <strong>Built EST response</strong>
      <p class="small-copy">This final paragraph is assembled from your sentence starters. You can still edit it before banking the lab.</p>
      <textarea id="content-note" placeholder="Your built EST response will appear here...">${escapeHtml(builtResponse)}</textarea>
    </div>
    ${builtResponse ? `
      <div class="panel">
        <div class="section-title">
          <h2>EST-ready coach</h2>
          <p>${responseCoach.level === "strong" ? "Strong sentence signal" : responseCoach.level === "developing" ? "Developing sentence signal" : "Needs sharpening"}</p>
        </div>
        <p class="small-copy">${escapeHtml(responseCoach.summary)}</p>
        <div class="training-stack" style="margin-top:14px;">
          ${responseCoach.segmentResults.map(result => `
            <div class="training-card ${result.passed ? "good" : "bad"}">
              <strong>${escapeHtml(result.label)}</strong>
              <p class="training-feedback">${result.passed ? "Locked in." : "Needs a clearer EST phrase or more specific language."}</p>
            </div>
          `).join("")}
          <div class="training-card ${responseCoach.builtHasReasoning ? "good" : "bad"}">
            <strong>Explains why the point matters</strong>
            <p class="training-feedback">${responseCoach.builtHasReasoning ? "Your built paragraph includes causal or explanatory language." : "Add a stronger because/how/why explanation so the response sounds more analytical."}</p>
          </div>
        </div>
      </div>
    ` : ""}
  `;
}

function renderTrainingBay(group) {
  const config = getContentTrainingConfig(group.id);
  if (!config) return "";
  const score = getTrainingScore(config);
  if (isArcTrainingType(config.type)) return renderArcTrainingBay(config, score);
  if (config.type === "sort") return renderSortTrainingBay(config, score);
  if (config.type === "scenario") return renderScenarioTrainingBay(config, score);
  if (config.type === "builder") return renderBuilderTrainingBay(config, score);
  return "";
}

function getTrainingInteractions(config) {
  if (!config) return [];
  if (isArcTrainingType(config.type)) {
    return (config.steps || []).flatMap(step => (step.items || []).map(item => ({
      item: item.prompt,
      selected: state.answers[getArcTrainingAnswerKey(config.type, item.id)] || "",
      correct_answer: item.correct,
      step: step.title
    })));
  }
  if (config.type === "sort") {
    return config.cards.map(card => ({
      item: card.text,
      selected: state.answers[`training-sort-${card.id}`] || "",
      correct_bucket: card.correctBucket
    }));
  }
  if (config.type === "scenario") {
    return config.scenarios.map(scenario => ({
      item: scenario.prompt,
      selected: state.answers[`training-scenario-${scenario.id}`] || "",
      correct_answer: scenario.correct
    }));
  }
  if (config.type === "builder") {
    return config.rounds.map(round => ({
      item: round.prompt,
      selected: state.answers[`training-builder-${round.id}`] || "",
      correct_answer: round.correct
    }));
  }
  return [];
}

function toggleReveal(key) {
  state.answers[key] = !state.answers[key];
  if (state.selectedStageId === "glossary") renderGlossaryStage();
  if (state.selectedStageId === "boss") renderBossStage();
}

function getBossShowdownPair(round) {
  if (!round?.sampleResponses?.length) return [];
  const strong = round.sampleResponses.find(sample => /strong/i.test(sample.band || ""));
  const developing = round.sampleResponses.find(sample => /developing/i.test(sample.band || ""));
  if (strong && developing) return [strong, developing];
  return round.sampleResponses.slice(0, 2);
}

function getBossScaffoldLines(round) {
  return String(round?.scaffold || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function renderBossResponseBuilder(round) {
  const lines = getBossScaffoldLines(round);
  return `
    <div class="panel">
      <div class="section-title">
        <h2>Response Forge</h2>
        <p>Build before you write</p>
      </div>
      <p class="small-copy">Use the scaffold blocks to build a stronger answer before drafting the final response.</p>
      <div class="builder-grid">
        ${lines.map((line, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(line.replace("...", "").trim() || `Scaffold ${index + 1}`)}</strong>
            <textarea
              id="boss-scaffold-${index}"
              placeholder="Write the key idea for this part..."
              oninput="window.ESTPrep.setBossScaffold(${index}, this.value)"
            >${escapeHtml(state.answers[`boss-scaffold-${index}`] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildBossDraft()">Build Draft from Scaffold</button>
      </div>
    </div>
  `;
}

function getGlossaryKeywordHint(termName, definition) {
  const hintMap = {
    "Initiative": "proactive action",
    "Proactive": "act early",
    "Time management": "plan + prioritise",
    "Budget": "income vs expenses",
    "Seeking assistance": "trusted advice",
    "Labour market information": "jobs + wages",
    "Growth industry": "high growth",
    "Emerging industry": "new industry",
    "Green industry": "sustainable work",
    "Cover letter": "first impression",
    "Selection criteria": "job requirements",
    "STAR": "situation task action result",
    "Megatrend": "long-term change",
    "Demographic shift": "population change",
    "Economic power shift": "global market shift",
    "Impactful technologies": "innovation + disruption",
    "Career planning": "goals + pathways",
    "Communication skills": "message for audience",
    "Non-verbal communication": "body language",
    "Active listening": "check understanding",
    "Unexpected life event": "unplanned disruption"
  };
  if (hintMap[termName]) return hintMap[termName];
  const words = String(definition || "").replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(" ");
}

function getGlossaryScenarioHint(scenario) {
  const text = String(scenario || "").trim();
  if (text.length <= 72) return text;
  return `${text.slice(0, 72).trim()}...`;
}

function buildGlossaryBoard(rounds) {
  return shuffle(rounds.flatMap((round, index) => ([
    {
      id: `glossary-${index}-keyword`,
      matchId: index,
      kind: "Keyword",
      text: getGlossaryKeywordHint(round.term.term, round.term.definition),
      style: {
        x: `${8 + ((index * 17) % 62)}%`,
        y: `${8 + ((index * 13) % 52)}%`,
        delay: `${(index % 5) * 0.4}s`,
        duration: `${5 + (index % 4)}s`
      }
    },
    {
      id: `glossary-${index}-scenario`,
      matchId: index,
      kind: "Scenario",
      text: getGlossaryScenarioHint(round.term.scenario),
      style: {
        x: `${16 + ((index * 19) % 58)}%`,
        y: `${18 + ((index * 11) % 48)}%`,
        delay: `${((index + 2) % 5) * 0.35}s`,
        duration: `${6 + (index % 3)}s`
      }
    },
    {
      id: `glossary-${index}-definition`,
      matchId: index,
      kind: "Definition",
      text: round.term.definition,
      style: {
        x: `${12 + ((index * 23) % 60)}%`,
        y: `${12 + ((index * 7) % 54)}%`,
        delay: `${((index + 1) % 5) * 0.45}s`,
        duration: `${7 + (index % 4)}s`
      }
    }
  ])));
}

function getCurrentGlossaryBatch() {
  const batches = state.stageDeck?.glossaryBatches || [];
  return batches[state.glossaryRoundIndex] || [];
}

function getCurrentGlossaryRound() {
  return GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex] || GLOSSARY_ROUND_CONFIGS[0];
}

function getGlossaryVisual(index) {
  const visuals = [
    { shape: "circle", color: "#ff8a5b" },
    { shape: "diamond", color: "#5dd6ff" },
    { shape: "pill", color: "#ffd86c" },
    { shape: "hex", color: "#72f7b8" },
    { shape: "arch", color: "#c48bff" },
    { shape: "ticket", color: "#ff7dc0" }
  ];
  const offset = (state.glossaryRoundIndex * 2) + state.glossaryBatchIndex;
  return visuals[(index + offset) % visuals.length];
}

function syncMissionMode() {
  document.body.classList.toggle("glossary-mission-active", !!state.glossaryMissionMode);
}

function resetGlossaryRewardLoop() {
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = {};
  state.glossaryRoundVotes = {};
  state.glossaryRoundStartedAt = 0;
}

function initialiseGlossaryBoard() {
  clearGlossaryRecallAdvanceTimeout();
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryAssignments = {};
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallAnswers = {};
  state.glossaryRecallResults = {};
  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossaryStreak = 0;
  state.glossaryBestStreak = 0;
  state.glossaryMisses = 0;
  state.glossaryPulse = "System breach detected. Recover the first term signal to begin restoring the EST lab.";
  state.glossaryPulseType = "neutral";
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  resetGlossaryRewardLoop();
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

function clearGlossaryRoundState(roundIndex) {
  clearGlossaryRecallAdvanceTimeout();
  const roundBatchKey = `glossary-r${roundIndex}-b0`;
  delete state.glossaryAssignments[roundBatchKey];

  const batch = (state.stageDeck?.glossaryBatches || [])[roundIndex] || [];
  batch.forEach(item => {
    delete state.glossaryRecallAnswers[`term-${item.id}`];
    delete state.glossaryRecallAnswers[`keyword-${item.id}`];
    delete state.glossaryRecallResults[item.id];
  });

  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryStreak = 0;
  state.glossaryMisses = 0;
}

function getGlossaryBatchKey() {
  return `glossary-r${state.glossaryRoundIndex}-b${state.glossaryBatchIndex}`;
}

function getGlossaryAssignmentsForBatch() {
  return state.glossaryAssignments[getGlossaryBatchKey()] || {};
}

function getGlossaryPendingItems(batch = getCurrentGlossaryBatch()) {
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.filter(item => assignments[item.id] !== item.id);
}

function getCurrentGlossaryPromptItem(batch = getCurrentGlossaryBatch()) {
  return getGlossaryPendingItems(batch)[0] || null;
}

function buildGlossaryChallengeOptions(roundId, item, batch = getCurrentGlossaryBatch()) {
  const glossarySource = buildGlossarySource();
  if (!item) return [];

  if (roundId === "colour-shape") {
    const distractors = pickRandom(
      glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
      3
    );
    return shuffle([item.term, ...distractors]).map(option => ({
      value: option,
      title: option,
      detail: "Glossary term option"
    }));
  }

  if (roundId === "shape-only") {
    const distractors = pickRandom(
      glossarySource.filter(candidate => candidate.id !== item.id),
      3
    );
    return shuffle([
      { id: `${item.id}-correct`, text: clampText(item.definition, 110), isCorrect: true },
      ...distractors.map(candidate => ({
        id: `${candidate.id}-distractor`,
        text: clampText(candidate.definition, 110),
        isCorrect: false
      }))
    ]).map(option => ({
      value: option.id,
      title: option.text,
      detail: "Definition fragment"
    }));
  }

  const distractors = pickRandom(
    glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]).map(option => ({
    value: option,
    title: option,
    detail: "Restore the correct term from the definition file"
  }));
}

function isGlossaryChoiceCorrect(roundId, item, value) {
  if (!item) return false;
  if (roundId === "shape-only") {
    return value === `${item.id}-correct`;
  }
  return normaliseGlossaryTermText(value) === normaliseGlossaryTermText(item.term);
}

function submitGlossaryChallengeChoiceEncoded(targetId, encodedValue) {
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const item = batch.find(entry => entry.id === targetId);
  if (!item) return;

  const answer = decodeURIComponent(encodedValue || "");
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetId]) return;

  if (isGlossaryChoiceCorrect(round.id, item, answer)) {
    assignments[targetId] = targetId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${item.term} restored. Another glossary signal is back online.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: `${item.term} is back in the system. Keep the chamber stable and chain the streak.`
    };
  } else {
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = round.id === "shape-only"
      ? "Definition mismatch. Re-read the meaning and try again."
      : "Signal mismatch. Use the clue feed and restore the right glossary term.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Signal unstable",
      detail: `${answer || "That choice"} did not restore the correct glossary entry.`
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function setGlossarySelectedTerm(termId) {
  const assignments = getGlossaryAssignmentsForBatch();
  const usedTermIds = Object.values(assignments);
  if (usedTermIds.includes(termId)) return;
  state.glossarySelectedTermId = state.glossarySelectedTermId === termId ? "" : termId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossarySelectedSocket(socketId) {
  const assignments = getGlossaryAssignmentsForBatch();
  if (assignments[socketId]) return;
  state.glossarySelectedSocketId = state.glossarySelectedSocketId === socketId ? "" : socketId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossaryMode(mode) {
  state.glossaryMode = mode === "study" ? "study" : "play";
  renderGlossaryStage();
}

function moveGlossaryStudy(step) {
  const batch = getCurrentGlossaryBatch();
  if (!batch.length) return;
  const nextIndex = (state.glossaryStudyIndex + step + batch.length) % batch.length;
  state.glossaryStudyIndex = nextIndex;
  renderGlossaryStage();
}

function flipGlossaryStudyCard() {
  const currentKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  state.answers[currentKey] = !state.answers[currentKey];
  renderGlossaryStage();
}

function resetGlossarySelections() {
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
}

function startGlossaryDrag(termId) {
  state.glossaryDraggedTermId = termId;
  state.glossarySelectedTermId = termId;
  renderGlossaryStage();
}

function endGlossaryDrag() {
  state.glossaryDraggedTermId = "";
  renderGlossaryStage();
}

function getGlossaryRoundEconomy(roundNumber) {
  const glossaryStage = STAGES.find(stage => stage.id === "glossary");
  if (!glossaryStage) return { salary: 0, taxRate: 0 };
  const salary = Math.round((glossaryStage.credits * (0.65 + (roundNumber * 0.12))) / 4);
  return { salary, taxRate: glossaryStage.taxRate };
}

function formatGlossaryRoundTitle(roundNumber) {
  return roundNumber === 1
    ? "Signal Scan cleared. The first chamber is back online."
    : roundNumber === 2
      ? "Definition Repair cleared. Chamber two is stable."
      : roundNumber === 3
        ? "Corruption Sweep cleared. Chamber three is restored."
        : "Recall Forge complete. Glossary mastery is banked.";
}

function buildGlossaryCelebration(roundNumber, scoreText) {
  clearGlossaryTimer();
  const { salary, taxRate } = getGlossaryRoundEconomy(roundNumber);
  const elapsedSeconds = getGlossaryRoundElapsedSeconds();
  const speedBand = getGlossarySpeedBand(elapsedSeconds);
  const precisionBonus = state.glossaryMisses <= 1 ? 300 : state.glossaryMisses <= 4 ? 150 : 0;
  const totalSalary = salary + speedBand.bonus + precisionBonus;
  const tax = Math.round(totalSalary * taxRate);
  state.salaryBoost += totalSalary;
  state.taxContribution += tax;
  state.glossaryRoundRewards[roundNumber] = { salary: totalSalary, tax, scoreText, elapsedSeconds, speedBand, precisionBonus };
  state.glossaryRoundCelebration = {
    roundNumber,
    title: formatGlossaryRoundTitle(roundNumber),
    subtitle: roundNumber < 4
      ? `Let's level up. ${GLOSSARY_ROUND_CONFIGS[roundNumber].title} removes another support.`
      : "The final recall round is complete. Return to the lab stronger and sharper.",
    salary: totalSalary,
    tax,
    scoreText,
    elapsedSeconds,
    speedBand,
    precisionBonus
  };
  state.glossaryPulse = `Round ${roundNumber} cleared. Choose where the class community tax should land, then continue.`;
  state.glossaryPulseType = "good";
  state.recentReward = {
    type: "positive",
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${speedBand.label} • +${formatCurrency(totalSalary)} salary • +${formatCurrency(tax)} community tax`
  };
  state.debriefLog.push({
    title: `Glossary round ${roundNumber} cleared`,
    detail: `${scoreText} • ${formatSecondsAsClock(elapsedSeconds)} • ${formatCurrency(totalSalary)} salary earned • ${formatCurrency(tax)} ready for community allocation`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `glossary-round-${roundNumber}`,
    label: `EST glossary round ${roundNumber}`,
    detail: `${scoreText} • ${speedBand.label}`,
    earnedDelta: totalSalary,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  scrollToTopSmooth();
}

function setGlossaryRoundVote(optionId) {
  if (!state.glossaryRoundCelebration) return;
  state.glossaryRoundVotes[state.glossaryRoundCelebration.roundNumber] = optionId;
  renderGlossaryStage();
}

function continueGlossaryRound() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return;
  const roundNumber = celebration.roundNumber;
  const voteKey = state.glossaryRoundVotes[roundNumber];
  if (!voteKey) {
    state.glossaryPulse = "Choose a class tax destination before you level up to the next round.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Choose a tax destination",
      detail: "Select one community option first so the round reward knows where the class tax should go."
    };
    renderRewardPulse();
    renderGlossaryStage();
    return;
  }
  state.answers[`glossaryVoteRound${roundNumber}`] = voteKey;
  state.glossaryRoundCelebration = null;
  state.glossarySelectedTermId = "";
  state.glossaryDraggedTermId = "";
  if (roundNumber < 4) {
    state.glossaryRoundIndex = roundNumber;
    state.glossaryBatchIndex = 0;
    state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex].cue;
    state.glossaryPulseType = "neutral";
    startGlossaryRoundTimer(true);
    renderGlossaryStage();
    scrollToTopSmooth();
    return;
  }
  bankGlossaryResults();
}

function returnToLab() {
  setLabMode(false);
  setStageMenuMode(false);
  state.selectedStageId = null;
  state.contentGroupIndex = -1;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Return from the glossary mission and keep building your EST run.");
  renderStageRoot(`
    <div class="empty-state">
      <p>Back in the EST Lab. Re-enter any stage when you're ready.</p>
    </div>
  `);
  scrollToTopSmooth();
}

function attemptGlossaryMatch(termId, targetTermId) {
  if (!termId) return;
  const batch = getCurrentGlossaryBatch();
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetTermId]) return;
  const draggedTerm = batch.find(item => item.id === termId);
  const targetTerm = batch.find(item => item.id === targetTermId);
  if (!draggedTerm || !targetTerm) return;

  if (termId === targetTermId) {
    assignments[targetTermId] = termId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    resetGlossarySelections();
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${targetTerm.term} matched. The blueprint wall is lighting up.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct match",
      detail: `${targetTerm.term} has been locked in. Keep matching to complete the blueprint.`
    };
  } else {
    resetGlossarySelections();
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = "Try again. That term piece does not fit this definition socket.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Try again",
      detail: `${draggedTerm.term} does not match that definition. Re-check the clue.`
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function dropGlossaryTerm(event, targetTermId) {
  event.preventDefault();
  attemptGlossaryMatch(state.glossaryDraggedTermId || state.glossarySelectedTermId, targetTermId);
}

function handleGlossarySocketClick(targetTermId) {
  setGlossarySelectedSocket(targetTermId);
}

function isGlossaryBatchMatched() {
  const batch = getCurrentGlossaryBatch();
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.length && batch.every(item => assignments[item.id] === item.id);
}

function moveToNextGlossaryBatchOrRound() {
  const completedRound = state.glossaryRoundIndex + 1;
  buildGlossaryCelebration(completedRound, `All 4 glossary signals restored in this chamber.`);
  renderGlossaryStage();
}

function nextGlossaryPhase() {
  if (state.glossaryRoundIndex < 3) {
    if (!isGlossaryBatchMatched()) return;
    moveToNextGlossaryBatchOrRound();
  }
}

function setGlossaryRecallAnswer(key, value) {
  state.glossaryRecallAnswers[key] = value;
}

function setGlossaryRecallChoiceEncoded(key, encodedValue) {
  state.glossaryRecallAnswers[key] = decodeURIComponent(encodedValue || "");
  renderGlossaryStage();
}

function triggerGlossaryRecallAdvance(item, selectedKeyword, batch) {
  clearGlossaryRecallAdvanceTimeout();
  state.glossaryRecallTransition = {
    itemId: item.id,
    title: item.term,
    keyword: selectedKeyword,
    nextIndex: Math.min(batch.length - 1, state.glossaryRecallIndex + 1),
    finished: batch.every(entry => entry.id === item.id || state.glossaryRecallResults[entry.id]?.overallCorrect)
  };
  renderGlossaryStage();
  glossaryRecallAdvanceTimeout = setTimeout(() => {
    state.glossaryRecallIndex = state.glossaryRecallTransition?.nextIndex ?? state.glossaryRecallIndex;
    state.glossaryRecallTransition = null;
    renderGlossaryStage();
  }, 950);
}

function setGlossaryRecallTermChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const selectedTerm = decodeURIComponent(encodedValue || "");
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const correct = normaliseGlossaryTermText(selectedTerm) === normaliseGlossaryTermText(item.term);

  state.glossaryRecallAnswers[termKey] = selectedTerm;
  delete state.glossaryRecallAnswers[keywordKey];

  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: correct,
    keywordCorrect: false,
    overallCorrect: false
  };

  if (correct) {
    state.glossaryPulse = `${item.term} restored. Now recover one keyword that belongs with it.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct term restored",
      detail: "Good catch. Finish the signal by choosing one keyword that genuinely belongs to this term."
    };
  } else {
    state.glossaryPulse = `${selectedTerm} is not the right term for this signal. Try another term before moving on.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong term",
      detail: "That term does not match the keyword trail. Step 2 will stay locked until the correct term is chosen."
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function setGlossaryRecallKeywordChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const termResult = state.glossaryRecallResults[item.id];
  if (!termResult?.termCorrect) {
    state.glossaryPulse = "Choose the correct term first. The repair token only unlocks after Step 1 is right.";
    state.glossaryPulseType = "warn";
    renderGlossaryStage();
    return;
  }

  const selectedKeyword = decodeURIComponent(encodedValue || "");
  const keywordKey = `keyword-${item.id}`;
  const keywordCorrect = item.keywords.some(keyword => normaliseGlossaryTermText(selectedKeyword).includes(normaliseGlossaryTermText(keyword)));

  state.glossaryRecallAnswers[keywordKey] = selectedKeyword;
  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: true,
    keywordCorrect,
    overallCorrect: keywordCorrect
  };

  if (keywordCorrect) {
    state.glossaryPulse = `${selectedKeyword} locked in. Signal ${state.glossaryRecallIndex + 1} is restored.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: "Both steps are correct. Move to the next signal core."
    };
    triggerGlossaryRecallAdvance(item, selectedKeyword, batch);
  } else {
    state.glossaryPulse = `${selectedKeyword} does not belong with ${item.term}. Try a different repair token.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong repair token",
      detail: "The term is right, but the keyword is not. Try another token for this same signal."
    };
  }

  renderRewardPulse();
  renderGlossaryStage();
}

function getGlossaryStabilityPercent() {
  const completedRounds = Object.keys(state.glossaryRoundRewards || {}).length;
  const partial = state.glossaryRoundCelebration
    ? 0
    : Math.round(((state.glossaryBatchIndex + (isGlossaryBatchMatched() ? 1 : 0)) / Math.max(1, (state.stageDeck?.glossaryBatches || []).length)) * 25);
  return Math.min(100, (completedRounds * 25) + partial);
}

function getGlossaryRoundBadge(roundIndex) {
  const reward = state.glossaryRoundRewards[roundIndex + 1];
  if (reward) return "Restored";
  if (state.glossaryRoundIndex === roundIndex) return "Active";
  if (state.completed.glossary) return "Replay";
  if (state.glossaryRoundIndex > roundIndex) return "Unlocked";
  return "Locked";
}

function isGlossaryRoundUnlocked(roundIndex) {
  if (state.completed.glossary) return true;
  const unlockedCount = Object.keys(state.glossaryRoundRewards || {}).length;
  return roundIndex <= unlockedCount || state.glossaryRoundIndex === roundIndex;
}

function renderGlossaryChamberRail() {
  return `
    <div class="glossary-chamber-rail">
      ${GLOSSARY_ROUND_CONFIGS.map((round, index) => {
        const status = getGlossaryRoundBadge(index);
        const active = state.glossaryRoundIndex === index && !state.glossaryRoundCelebration;
        const complete = Boolean(state.glossaryRoundRewards[index + 1]);
        const unlocked = isGlossaryRoundUnlocked(index);
        return `
          <button
            type="button"
            class="glossary-chamber-card ${active ? "active" : ""} ${complete ? "complete" : ""} ${unlocked ? "" : "locked"}"
            ${unlocked ? `onclick="window.ESTPrep.jumpToGlossaryRound(${index})"` : "disabled"}
          >
            <div class="glossary-chamber-index">0${index + 1}</div>
            <strong>${escapeHtml(round.title.replace(/^Round \d+:\s*/, ""))}</strong>
            <p>${escapeHtml(round.cue)}</p>
            <span class="glossary-chamber-status">${status}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function jumpToGlossaryRound(roundIndex) {
  if (!isGlossaryRoundUnlocked(roundIndex)) return;
  if (state.glossaryRoundIndex === roundIndex && !state.glossaryRoundCelebration) return;
  clearGlossaryRoundState(roundIndex);
  state.glossaryRoundIndex = roundIndex;
  state.glossaryBatchIndex = 0;
  state.glossaryRoundCelebration = null;
  state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[roundIndex]?.cue || "";
  state.glossaryPulseType = "neutral";
  state.glossaryMode = "play";
  startGlossaryRoundTimer(true);
  renderGlossaryStage();
}

function buildRecallTermOptions(item) {
  const distractors = pickRandom(
    buildGlossarySource().filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]);
}

function buildRecallKeywordOptions(item) {
  const keywordPool = buildGlossarySource()
    .filter(candidate => candidate.id !== item.id)
    .flatMap(candidate => candidate.keywords);
  const distractors = pickRandom([...new Set(keywordPool.filter(keyword => !item.keywords.includes(keyword)))], 3);
  return shuffle([item.keywords[0], ...distractors]);
}

function renderGlossaryRecallForge(batch, batchNumber, totalBatches) {
  const readyCores = batch.filter(item => {
    return Boolean(state.glossaryRecallResults[item.id]?.overallCorrect);
  }).length;
  const firstIncompleteIndex = batch.findIndex(item => !state.glossaryRecallResults[item.id]?.overallCorrect);
  const activeIndex = firstIncompleteIndex >= 0
    ? firstIncompleteIndex
    : Math.max(0, Math.min(state.glossaryRecallIndex, batch.length - 1));
  const item = batch[activeIndex];
  if (!item) return "";
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const selectedTerm = state.glossaryRecallAnswers[termKey] || "";
  const selectedKeyword = state.glossaryRecallAnswers[keywordKey] || "";
  const recallResult = state.glossaryRecallResults[item.id] || {};
  const termSelected = Boolean(selectedTerm);
  const termCorrect = Boolean(recallResult.termCorrect);
  const keywordSelected = Boolean(selectedKeyword);
  const keywordCorrect = Boolean(recallResult.keywordCorrect);
  const termOptions = buildRecallTermOptions(item);
  const keywordOptions = buildRecallKeywordOptions(item);
  const transition = state.glossaryRecallTransition;
  const showingTransition = Boolean(transition && transition.itemId === item.id);
  return `
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>Recall Forge</h3>
          <p class="small-copy">The final chamber turns recognition into retrieval. Restore each term signal, then restore one key concept from memory.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Final chamber</span>
          <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      <div class="glossary-escape-console">
        <div class="glossary-stability-card">
          <div class="kicker">Lab stability</div>
          <strong>${getGlossaryStabilityPercent()}% restored</strong>
          <div class="glossary-progress-track" aria-hidden="true">
            <div class="glossary-progress-bar" style="width:${getGlossaryStabilityPercent()}%;"></div>
          </div>
          <p>Every restored signal banks more salary, more tax contribution, and clearer EST vocabulary under pressure.</p>
        </div>
        <div class="glossary-signal-feed">
          <div class="kicker">Forge rules</div>
          <p><strong>Step 1:</strong> Read the keyword trail and choose the correct term.</p>
          <p><strong>Step 2:</strong> Only if Step 1 is correct, choose one keyword that genuinely belongs to that term.</p>
          <p><strong>Step 3:</strong> Once both are right, the forge moves you to the next signal core.</p>
        </div>
      </div>
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>How to clear Recall Forge</h2>
          <p>${readyCores}/${batch.length} signal cores fully locked</p>
        </div>
        <p class="small-copy">Work one signal at a time. A wrong term stops the sequence. A correct term unlocks the repair token step.</p>
      </div>
      ${showingTransition ? `
        <div class="feedback-box good glossary-recall-celebration">
          <p><strong>Signal restored:</strong> ${escapeHtml(transition.title)}</p>
          <p>${escapeHtml(transition.keyword)} locked in. ${transition.finished ? "All signal cores are online. Restore the system when you're ready." : "Advancing to the next signal core..."}</p>
        </div>
      ` : ""}
      <div class="glossary-recall-grid">
        <article class="panel glossary-recall-card">
          <div class="sample-meta">
            <strong>Signal core ${activeIndex + 1}</strong>
            <span>${readyCores === batch.length ? "All signals restored" : readyCores > activeIndex ? "Signal already restored" : "Active signal"}</span>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 1: keyword trail</div>
            <p>${escapeHtml(item.keywords.join(" • "))}</p>
            <div class="choice-grid">
              ${termOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedTerm === option ? `selected live-selected ${termCorrect ? "correct" : "incorrect"}` : ""}"
                  onclick="window.ESTPrep.setGlossaryRecallTermChoiceEncoded('${item.id}', '${encodeURIComponent(option)}')"
                  ${showingTransition ? "disabled" : ""}
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 2: repair token</div>
            <p>${termCorrect
              ? `Good. Now choose one keyword that genuinely belongs with <strong>${escapeHtml(item.term)}</strong>.`
              : termSelected
                ? `That term is wrong. Fix Step 1 before trying the repair token.`
                : "Choose the correct term first. Then the repair token step unlocks."}</p>
            <div class="choice-grid">
              ${keywordOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedKeyword === option ? `selected live-selected ${keywordCorrect ? "correct" : "incorrect"}` : ""}"
                  ${(termCorrect && !showingTransition) ? "" : "disabled"}
                  onclick="window.ESTPrep.setGlossaryRecallKeywordChoiceEncoded('${item.id}', '${encodeURIComponent(option)}')"
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="badge-row">
            <span class="badge">${termCorrect ? "Step 1 correct" : termSelected ? "Step 1 incorrect" : "Choose a term"}</span>
            <span class="badge">${keywordCorrect ? "Step 2 correct" : keywordSelected ? "Step 2 incorrect" : "Choose a keyword"}</span>
          </div>
        </article>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Forge exit</strong>
        <p class="small-copy">Restore one signal core at a time. When all 4 are correct, restore the system to bank the final salary, tax contribution, and mastery save.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()" ${readyCores === batch.length ? "" : "disabled"}>${batchNumber === totalBatches ? "Restore System" : "Lock Next Recall Batch"}</button>
      </div>
    </div>
  `;
}

function renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore) {
  const promptItem = getCurrentGlossaryPromptItem(batch);
  const progressPercent = Math.round((matchedCount / Math.max(1, batch.length)) * 100);

  if (!promptItem) {
    return `
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>Chamber cleared</h2>
          <p>All ${batch.length} glossary signals restored in this batch.</p>
        </div>
        <p class="small-copy glossary-pulse good">The chamber is stable. Move to the next batch or bank the round reward.</p>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Chamber exit</strong>
        <p class="small-copy">You restored every glossary signal in this batch. Advance to keep the run going.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()">${batchNumber === totalBatches ? "Finish Round" : "Next Batch"}</button>
      </div>
    `;
  }

  const optionSet = buildGlossaryChallengeOptions(round.id, promptItem, batch);
  const challengeCopy = round.id === "colour-shape"
    ? {
        kicker: "Signal scan",
        title: "Recover the correct term from the clue trail",
        prompt: `Keyword trail: ${promptItem.keywords.join(" • ")}`,
        support: "Choose the glossary term that best matches the signal feed."
      }
    : round.id === "shape-only"
      ? {
          kicker: "Definition repair",
          title: "Restore the correct definition file",
          prompt: promptItem.term,
          support: "Choose the definition fragment that correctly restores this term."
        }
      : {
          kicker: "Corruption sweep",
          title: "Match the definition back to the correct term",
          prompt: clampText(promptItem.definition, 180),
          support: "The visual scaffolds are gone. Recover the right term from meaning alone."
        };

  return `
    <div class="panel glossary-command-panel glossary-arcade-shell">
      <div class="section-title">
        <h2>Recovery chamber ${state.glossaryRoundIndex + 1}</h2>
        <p>${matchedCount}/${batch.length} signal locks restored</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-arcade-grid">
        <article class="glossary-arcade-prompt">
          <div class="kicker">${escapeHtml(challengeCopy.kicker)}</div>
          <h3>${escapeHtml(challengeCopy.title)}</h3>
          <div class="glossary-arcade-signal">${escapeHtml(challengeCopy.prompt)}</div>
          <p>${escapeHtml(challengeCopy.support)}</p>
        </article>
        <div class="glossary-arcade-options">
          ${optionSet.map(option => `
            <button
              type="button"
              class="choice-button glossary-arcade-option"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeURIComponent(option.value)}')"
            >
              <span class="kicker">${escapeHtml(option.detail)}</span>
              <strong>${escapeHtml(option.title)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Chamber exit</strong>
      <p class="small-copy">Restore all ${batch.length} signals in this batch to unlock the next breach and bank the round reward.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>${batchNumber === totalBatches ? "Finish Round" : "Next Batch"}</button>
    </div>
  `;
}

function renderGlossaryCelebration() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return "";
  const voteKey = state.glossaryRoundVotes[celebration.roundNumber] || "";
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button
      type="button"
      class="choice-button ${voteKey === option.id ? "selected live-selected" : ""}"
      onclick="window.ESTPrep.setGlossaryRoundVote('${option.id}')"
    >
      <strong>${escapeHtml(option.label || option.id)}</strong>
      <span>${escapeHtml(option.description || "Class community focus")}</span>
    </button>
  `).join("");
  return `
    <section class="glossary-celebration">
      <div class="glossary-celebration-card">
        <div class="kicker">Round ${celebration.roundNumber} cleared</div>
        <h3>${escapeHtml(celebration.title)}</h3>
        <p>${escapeHtml(celebration.subtitle)}</p>
        <div class="badge-row">
          <span class="badge">${escapeHtml(celebration.scoreText)}</span>
          <span class="badge">Time: ${formatSecondsAsClock(celebration.elapsedSeconds)}</span>
          <span class="badge">${escapeHtml(celebration.speedBand.label)}</span>
        </div>
        <div class="glossary-reward-grid">
          <article class="glossary-reward-chip">
            <strong>Total salary</strong>
            <p>${formatCurrency(celebration.salary)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Speed bonus</strong>
            <p>${formatCurrency(celebration.speedBand.bonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Precision bonus</strong>
            <p>${formatCurrency(celebration.precisionBonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Community tax</strong>
            <p>${formatCurrency(celebration.tax)}</p>
          </article>
        </div>
        <div class="panel glossary-vote-panel">
          <div class="section-title">
            <h2>Choose how your class tax helps the community</h2>
            <p>All pooled taxes go toward building something bigger than one student run.</p>
          </div>
          <div class="choice-grid">${communityOptions}</div>
        </div>
        ${voteKey ? "" : `
          <div class="feedback-box warn">
            <p><strong>Select one tax destination before continuing.</strong></p>
            <p>Your round reward is ready, but the class tax allocation has to be chosen first.</p>
          </div>
        `}
        <div class="builder-actions">
          <button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryRound()">
            ${voteKey
              ? (celebration.roundNumber < 4 ? "Level Up to the Next Round" : "Bank Glossary Results")
              : "Choose a Tax Destination to Continue"}
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderGlossaryStudyDeck(batch) {
  const card = batch[state.glossaryStudyIndex] || batch[0];
  if (!card) return "";
  const flipKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  const flipped = !!state.answers[flipKey];
  return `
    <div class="panel glossary-study-panel">
      <div class="section-title">
        <h2>Study Deck</h2>
        <p>Flip through the current batch before you play for speed and salary.</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Card ${state.glossaryStudyIndex + 1} / ${batch.length}</span>
        <span class="badge">${escapeHtml(card.term)}</span>
      </div>
      <button type="button" class="glossary-study-card ${flipped ? "flipped" : ""}" onclick="window.ESTPrep.flipGlossaryStudyCard()">
        <div class="glossary-study-inner">
          <div class="glossary-study-face">
            <span class="kicker">Term</span>
            <strong>${escapeHtml(card.term)}</strong>
            <p>Click to reveal the meaning.</p>
          </div>
          <div class="glossary-study-face glossary-study-back">
            <span class="kicker">Definition</span>
            <strong>${escapeHtml(card.definition)}</strong>
            <p>Keywords: ${escapeHtml(card.keywords.join(", "))}</p>
          </div>
        </div>
      </button>
      <div class="builder-actions glossary-study-actions">
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(-1)">Previous</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.flipGlossaryStudyCard()">Flip Card</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(1)">Next</button>
      </div>
    </div>
  `;
}

function renderContentTopicIntro(group) {
  const highlights = group.introHighlights || [];
  const hasVideo = Boolean(group.introVideo);
  return `
    <div class="topic-intro-grid">
      <div class="topic-media-card">
        ${hasVideo ? `
          <video class="topic-media" autoplay muted loop playsinline poster="${escapeHtml(group.introImage || "")}">
            <source src="${escapeHtml(group.introVideo)}" type="video/mp4">
          </video>
        ` : `
          <img class="topic-media topic-media-image" src="${escapeHtml(group.introImage || "")}" alt="${escapeHtml(group.title)}">
        `}
      </div>
      <div class="topic-intro-copy panel">
        <div class="kicker">Topic intro</div>
        <h3>${escapeHtml(group.introTitle || group.title)}</h3>
        <p class="small-copy">${escapeHtml(group.introSummary || group.writePrompt)}</p>
        ${renderESTGuidePanel(group.id, "intro")}
        ${highlights.length ? `
          <div class="badge-row topic-intro-highlights">
            ${highlights.map(item => `<span class="badge">${escapeHtml(item)}</span>`).join("")}
          </div>
        ` : ""}
        <div class="written-stage topic-intro-actions">
          <div class="topic-intro-button-row">
            <button class="submit-button" type="button" onclick="window.ESTPrep.openStage('content')">Back to topic menu</button>
            <button class="submit-button" type="button" onclick="window.ESTPrep.startContentGroup()">Start content check</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderContentStage() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  renderFocusNav();
  if (state.contentView === "menu" || !currentGroup) {
    setStageMenuMode(true);
    setText("stage-title", "");
    setText("stage-subtitle", "");
    renderStageRoot(`
      <div class="focus-card">
        <p class="small-copy">Select one curriculum area from the topic menu above to open that focused EST content module.</p>
      </div>
    `);
    return;
  }
  if (state.contentView === "intro") {
    setStageMenuMode(false);
    setText("stage-title", "EST Content Check");
    setText("stage-subtitle", `${currentGroup.title}`);
    renderStageRoot(renderContentTopicIntro(currentGroup));
    return;
  }
  setStageMenuMode(false);
  const trainingConfig = getContentTrainingConfig(currentGroup.id);
  const trainingScore = getTrainingScore(trainingConfig);
  setText("stage-title", "EST Content Check");
  setText("stage-subtitle", "Train one content strand at a time with a clean, distraction-light interface.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Focused revision</div>
      <h3>${escapeHtml(currentGroup.title)}</h3>
      <p>This lab is dedicated to one revision strand only: briefing, practice, knowledge check, then a short EST response.</p>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Module briefing</h2>
        <p>EST content strand ${state.contentGroupIndex + 1} of ${groups.length}</p>
      </div>
      <p class="small-copy">${escapeHtml(currentGroup.writePrompt)}</p>
      ${trainingConfig ? `<div class="badge-row" style="margin-top:14px;"><span class="badge">Practice Bay: ${escapeHtml(trainingConfig.title)}</span><span class="badge">Training score: ${trainingScore.percent}%</span></div>` : ""}
    </div>
    ${renderTrainingBay(currentGroup)}
    ${currentGroup.rounds.map((round, index) => `
      <div class="panel">
        <div class="section-title">
          <h2>${escapeHtml(round.topic)}</h2>
          <p>Knowledge check ${index + 1}</p>
        </div>
        <p class="small-copy">${escapeHtml(round.question)}</p>
        <div class="mcq-grid" style="margin-top: 14px;">
          ${round.options.map(option => `
            <button
              type="button"
              class="choice-button ${state.answers[`content-${currentGroup.id}-${index}`] === option ? "selected live-selected" : ""}"
              data-group="content-${currentGroup.id}-${index}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('content-${currentGroup.id}-${index}', '${encodeURIComponent(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    ${renderContentResponseForge(currentGroup)}
    <div class="written-stage">
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button class="submit-button" type="button" onclick="window.ESTPrep.openStage('content')">Back to topic menu</button>
        ${state.contentGroupIndex > 0 ? '<button class="submit-button" type="button" onclick="window.ESTPrep.prevContentGroup()">Previous Topic</button>' : ""}
        ${state.contentGroupIndex < groups.length - 1
          ? '<button class="submit-button" type="button" onclick="window.ESTPrep.nextContentGroup()">Next Topic</button>'
          : '<button class="submit-button" type="button" onclick="window.ESTPrep.submitContent()">Bank Content Results</button>'}
      </div>
    </div>
  `);
}

function getGroupIdForTrainingType(type) {
  const { trainingBays } = getContentStageConfig();
  return Object.entries(trainingBays).find(([, config]) => config.type === type)?.[0] || "";
}

function getESTGuideCharacter(groupId) {
  const key = EST_GUIDE_ASSIGNMENTS[groupId] || "romero";
  return EST_GUIDE_CHARACTERS[key] || EST_GUIDE_CHARACTERS.romero;
}

function getESTGuideCopy(groupId, context) {
  const byContext = {
    intro: {
      initiative: "We’ll move through this like a mission: spot the behaviour, name the type, then sharpen the EST answer.",
      "time-management": "Take one planning move at a time. We’re looking for the best order, not the busiest schedule.",
      "personal-finance": "Think like a calm decision-maker here: track it, protect essentials, then seek the right support.",
      "job-application": "We’re not writing generic answers here. We’re targeting the role, the criteria, and the evidence.",
      communication: "This strand is all about reading the situation well, not just saying more words.",
      "future-of-work": "We’re scanning for change, evidence, and opportunity. That’s what makes this strand feel future-focused."
    },
    challenge: {
      initiative: "Choose the strongest move in each situation. If it feels vague or passive, it probably isn’t the best initiative call.",
      "time-management": "Look for the response that controls the workload, not the one that just sounds busy.",
      "personal-finance": "Choose the move that creates financial control and adaptability, not panic or avoidance.",
      "job-application": "Pick the response that gives the employer clear evidence, structure, and relevance.",
      communication: "Choose the action that makes the message clearer, more respectful, and easier to act on.",
      "future-of-work": "Look for the answer that uses evidence about change, demand, and opportunity."
    },
    forge: {
      initiative: "Build the sentence in parts first. Strong EST answers explain the behaviour, the example, and why it matters.",
      "time-management": "Aim for a response that names the process, the tool, and the reason it works.",
      "personal-finance": "A strong finance answer should mention budgeting, support, and how the strategy protects stability.",
      "job-application": "Keep it employer-facing. The best paragraph explains the method, the evidence, and why it proves suitability.",
      communication: "Try to include the skill, the action, and the effect on understanding or workplace relationships.",
      "future-of-work": "A stronger answer links the trend, the evidence, and the career impact in one clear paragraph."
    }
  };
  return byContext[context]?.[groupId] || "Take this one step at a time. A strong EST answer is built through clear choices, not rushing.";
}

function renderESTGuidePanel(groupId, context) {
  const character = getESTGuideCharacter(groupId);
  const pose = context === "intro"
    ? character.welcome
    : context === "forge"
      ? character.thinking
      : character.pointing;
  const label = groupId === "job-application"
    ? "Mission guide"
    : "EST guide";
  return `
    <div class="est-guide-panel est-guide-${escapeHtml(context)}">
      <img class="est-guide-image" src="${escapeHtml(pose)}" alt="EST guide character">
      <div class="est-guide-copy">
        <div class="kicker">${label}</div>
        <p>${escapeHtml(getESTGuideCopy(groupId, context))}</p>
      </div>
    </div>
  `;
}

function renderGlossaryStage() {
  setStageMenuMode(false);
  renderFocusNav();
  syncMissionMode();
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const assignments = getGlossaryAssignmentsForBatch();
  const totalBatches = 1;
  const roundNumber = state.glossaryRoundIndex + 1;
  const batchNumber = 1;
  const matchedCount = Object.keys(assignments).length;
  setText("stage-title", "Glossary Mission");
  setText("stage-subtitle", "Replay any unlocked chamber to sharpen vocabulary without resetting the whole glossary lab.");

  if (state.glossaryRoundCelebration) {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">Glossary Mission Access</div>
            <h3>Reward chamber</h3>
          </div>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
        ${renderGlossaryCelebration()}
      </div>
    `);
    return;
  }

  if (round.id === "recall") {
    renderStageRoot(renderGlossaryRecallForge(batch, batchNumber, totalBatches));
    startGlossaryRoundTimer();
    return;
  }

  const roundScore = Math.max(0, (matchedCount * 100) - (state.glossaryMisses * 25));
  const modeSwitch = `
    <div class="glossary-mode-switch">
      <button type="button" class="choice-button ${state.glossaryMode === "play" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('play')">Restore Chamber</button>
      <button type="button" class="choice-button ${state.glossaryMode === "study" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('study')">Intel Deck</button>
    </div>
  `;

  if (state.glossaryMode === "study") {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar glossary-escape-topbar">
          <div>
            <div class="kicker">System Recovery Protocol</div>
            <h3>Intel Deck</h3>
            <p class="small-copy">Flip through the signal cards, absorb the language, then jump back into the chamber to restore the glossary wall.</p>
          </div>
          <div class="glossary-mission-actions">
            <span class="badge">Round ${roundNumber} / 4</span>
            <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
            <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
          </div>
        </div>
        ${renderGlossaryChamberRail()}
        ${modeSwitch}
        ${renderGlossaryStudyDeck(batch)}
      </div>
    `);
    startGlossaryRoundTimer();
    return;
  }

  renderStageRoot(`
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>Glossary Lockdown</h3>
          <p class="small-copy">The EST lab vocabulary core has crashed. Clear each chamber to restore system stability before the final recall forge.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Round ${roundNumber} / 4</span>
          <span class="badge">Batch ${batchNumber} / ${totalBatches}</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Return to EST Lab</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      <div class="glossary-escape-console">
        <div class="glossary-stability-card">
          <div class="kicker">System stability</div>
          <strong>${getGlossaryStabilityPercent()}% restored</strong>
          <div class="glossary-progress-track" aria-hidden="true">
            <div class="glossary-progress-bar" style="width:${getGlossaryStabilityPercent()}%;"></div>
          </div>
          <p>Correct matches restore the wall, build streak bonuses, and convert precision language into salary and community tax.</p>
        </div>
        <div class="glossary-signal-feed">
          <div class="kicker">Mission brief</div>
          <p>${escapeHtml(round.cue)}</p>
          <p>${matchedCount}/${batch.length} locks restored in this batch. Best streak x${state.glossaryBestStreak}.</p>
        </div>
      </div>
      <div class="question-card glossary-round-banner glossary-escape-banner">
        <div class="kicker">Blueprint breach</div>
        <h3>${escapeHtml(round.title)}</h3>
        <p>Each chamber now has its own repair mechanic. Read the signal, make the recovery choice, and stabilise the EST glossary core.</p>
      </div>
      ${modeSwitch}
      ${renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore)}
    </div>
  `);
  startGlossaryRoundTimer();
}

function renderDecoderStage() {
  setStageMenuMode(false);
  renderFocusNav();
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  setText("stage-title", "VTCS Decoder");
  setText("stage-subtitle", "Run question forensics before you write.");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">VTCS Core</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.feedback)}</p>
    </div>
    <div class="panel training-bay">
      <div class="section-title">
        <h2>Question Forensics Board</h2>
        <p>Build the brief</p>
      </div>
      <p class="small-copy">Treat the EST question like evidence. Build the four-part brief by locking the correct verb, topic, context, and response structure.</p>
      <div class="forensics-grid">
        <div class="prompt-card forensics-slot ${state.answers["decoder-verb"] ? "filled" : ""}">
          <strong>Verb</strong>
          <p>${escapeHtml(state.answers["decoder-verb"] || "Select the command word")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-topic"] ? "filled" : ""}">
          <strong>Topic</strong>
          <p>${escapeHtml(state.answers["decoder-topic"] || "Select the concept")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-context"] ? "filled" : ""}">
          <strong>Context</strong>
          <p>${escapeHtml(state.answers["decoder-context"] || "Select the context")}</p>
        </div>
        <div class="prompt-card forensics-slot ${state.answers["decoder-structure"] ? "filled" : ""}">
          <strong>Structure</strong>
          <p>${escapeHtml(state.answers["decoder-structure"] || "Select the structure")}</p>
        </div>
      </div>
    </div>
    ${renderOptionGroup("decoder-verb", "Forensics Tool 1: Command verb", round.verbOptions)}
    ${renderOptionGroup("decoder-topic", "Forensics Tool 2: Topic", round.topicOptions)}
    ${renderOptionGroup("decoder-context", "Forensics Tool 3: Context", round.contextOptions)}
    ${renderOptionGroup("decoder-structure", "Forensics Tool 4: Structure", round.structureOptions)}
    <div class="written-stage">
      <strong>Case summary</strong>
      <p class="small-copy">Students lose marks when they misread what the question is actually asking. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">Bank Decoder Results</button>
    </div>
  `);
}

function renderBossStage() {
  setStageMenuMode(false);
  renderFocusNav();
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const showdownPair = getBossShowdownPair(round);
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Direct 10% of this round's income to this class/community focus.</small>
    </button>
  `).join("");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">Boss Round</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.help)}</p>
    </div>
    ${showdownPair.length === 2 ? `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>Worked Example Showdown</h2>
          <p>Judge before you draft</p>
        </div>
        <p class="small-copy">Choose the stronger response first. This helps students notice what quality looks like before they write their own answer.</p>
        <div class="sample-grid">
          ${showdownPair.map((sample, index) => `
            <article class="sample-card">
              <div class="sample-meta">
                <strong>Sample ${index + 1}</strong>
                <span>${escapeHtml(sample.label)}</span>
              </div>
              <p>${escapeHtml(sample.response)}</p>
              <button
                type="button"
                class="choice-button ${state.answers.bossShowdown === sample.label ? "selected live-selected" : ""}"
                style="margin-top:12px;"
                onclick="window.ESTPrep.setChoiceEncoded('bossShowdown', '${encodeURIComponent(sample.label)}')"
              >
                <strong>This is stronger</strong>
              </button>
            </article>
          `).join("")}
        </div>
        <div class="written-stage">
          <strong>Why?</strong>
          <p class="small-copy">Explain what makes the stronger sample better.</p>
          <textarea id="boss-showdown-reason" placeholder="Explain what the stronger sample includes or does better..." oninput="window.ESTPrep.setBossShowdownReason(this.value)">${escapeHtml(state.answers.bossShowdownReason || "")}</textarea>
        </div>
      </div>
    ` : ""}
    <div class="prompt-grid">
      ${round.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>${escapeHtml(round.scaffold.split("\n").join(" "))}</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", round.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", round.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", round.glossaryOptions)}
    ${renderBossResponseBuilder(round)}
    <div class="written-stage">
      <strong>Final simulation response</strong>
      <p class="small-copy">${escapeHtml(round.scaffold)}</p>
      <textarea id="boss-response" placeholder="Write your EST-style answer here...">${escapeHtml(state.answers.bossText || "")}</textarea>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Community Contribution</h2>
        <p class="status-watch">Class impact</p>
      </div>
      <p class="small-copy">Ten percent of this round’s reward feeds the wider class/community economy. Choose where this answer will direct its contribution.</p>
      <div class="choice-grid">${communityOptions}</div>
    </div>
    <div class="written-stage">
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Submit Boss Round</button>
    </div>
  `);
}

function persistCurrentContentNote() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  const textarea = document.getElementById("content-note");
  if (!textarea) return;
  state.answers[`content-note-${currentGroup.id}`] = textarea.value.trim();
}

function bankCurrentContentDuration() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup || !state.contentGroupStartedAt) return;
  const elapsed = Math.max(1, Math.round((Date.now() - state.contentGroupStartedAt) / 1000));
  state.contentGroupDurations[currentGroup.id] = (state.contentGroupDurations[currentGroup.id] || 0) + elapsed;
  state.contentGroupStartedAt = Date.now();
}

function jumpToContentGroup(index) {
  openContentGroupIntro(index);
}

function openContentGroupIntro(index) {
  const groups = state.stageDeck?.contentGroups || [];
  if (!groups.length) return;
  const nextIndex = Math.max(0, Math.min(index, groups.length - 1));
  if (state.contentView === "lesson" && state.contentGroupIndex >= 0) {
    persistCurrentContentNote();
    bankCurrentContentDuration();
  }
  state.contentGroupIndex = nextIndex;
  state.contentView = "intro";
  state.selectedStageId = "content";
  setLabMode(true);
  renderContentStage();
  scrollToTopSmooth();
}

function startContentGroup() {
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  if (!currentGroup) return;
  state.contentView = "lesson";
  state.contentGroupStartedAt = Date.now();
  renderContentStage();
  scrollToTopSmooth();
}

function moveContentGroup(step) {
  jumpToContentGroup(state.contentGroupIndex + step);
}

function openStage(stageId) {
  const previousStageId = state.selectedStageId;
  setLabMode(true);
  if (stageId !== "glossary") {
    state.glossaryMissionMode = false;
    clearGlossaryTimer();
    syncMissionMode();
  }
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  state.stageStartedAt = Date.now();
  if (stageId === "content") {
    if (previousStageId === "content" && state.contentView === "lesson" && state.contentGroupIndex >= 0) {
      persistCurrentContentNote();
      bankCurrentContentDuration();
    }
    state.contentGroupIndex = -1;
    state.contentView = "menu";
    if (previousStageId !== "content") {
      state.contentGroupStartedAt = Date.now();
      state.contentGroupDurations = {};
    }
  }
  if (stageId === "glossary") {
    state.glossaryMissionMode = true;
    syncMissionMode();
    if (!state.glossaryHasStarted && state.completed.glossary) {
      restoreGlossaryReplayBoard();
    } else if (!state.glossaryHasStarted) {
      initialiseGlossaryBoard();
    } else if (!state.glossaryRoundCelebration) {
      startGlossaryRoundTimer();
    }
  }
  renderMap();
  if (stageId === "content") renderContentStage();
  if (stageId === "glossary") renderGlossaryStage();
  if (stageId === "decoder") renderDecoderStage();
  if (stageId === "boss") renderBossStage();
  scrollToTopSmooth();
}

function getCurrentStageDurationSeconds() {
  if (!state.stageStartedAt) return null;
  return Math.max(1, Math.round((Date.now() - state.stageStartedAt) / 1000));
}

function setChoice(groupKey, option) {
  state.answers[groupKey] = option;
  updateSelectionButtons(groupKey, option);
  setSelectionPulse(groupKey, option);
}

function setChoiceEncoded(groupKey, encodedOption) {
  setChoice(groupKey, decodeURIComponent(encodedOption));
}

function setTrainingChoice(groupKey, option) {
  state.answers[groupKey] = option;
  renderContentStage();
  state.recentReward = {
    type: "positive",
    title: "Practice move logged",
    detail: "Training Bay choices sharpen your understanding before the marked EST response."
  };
  renderRewardPulse();
}

function setTrainingChoiceEncoded(groupKey, encodedOption) {
  setTrainingChoice(groupKey, decodeURIComponent(encodedOption));
}

function setContentResponseSegmentEncoded(groupId, segmentId, value) {
  setContentResponseSegment(groupId, segmentId, value);
}

function setBossScaffold(index, value) {
  state.answers[`boss-scaffold-${index}`] = value;
}

function setBossShowdownReason(value) {
  state.answers.bossShowdownReason = value;
}

function buildBossDraft() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const draft = getBossScaffoldLines(round)
    .map((line, index) => {
      const label = line.replace("...", "").trim();
      const value = state.answers[`boss-scaffold-${index}`] || "";
      return value ? `${label} ${value}`.trim() : "";
    })
    .filter(Boolean)
    .join("\n");
  state.answers.bossText = draft;
  const textarea = document.getElementById("boss-response");
  if (textarea) textarea.value = draft;
  state.recentReward = {
    type: "positive",
    title: "Draft built",
    detail: "Your scaffold blocks have been assembled into a first EST response draft."
  };
  renderRewardPulse();
}

function setBossVote(optionId) {
  state.answers.bossVote = optionId;
  updateSelectionButtons("boss-vote", optionId);
  const option = (state.stageDeck?.communityOptions || []).find(item => item.id === optionId);
  setSelectionPulse("boss-vote", option?.label || optionId);
}

function updateSelectionButtons(groupKey, option) {
  const selector = `[data-group="${CSS.escape(groupKey)}"]`;
  document.querySelectorAll(selector).forEach(button => {
    const selected = button.dataset.value === String(option);
    button.classList.toggle("selected", selected);
    button.classList.toggle("live-selected", selected);
  });
}

function setSelectionPulse(groupKey, option) {
  state.recentReward = {
    type: "positive",
    title: "Choice locked in",
    detail: `${option} is banked. Finish the stage to convert this into marks, readiness, salary, and class impact.`
  };
  renderRewardPulse();
}

function awardStage(stageId, outcome) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const earnedMarks = Math.max(0, Math.round(stage.marks * outcome.scoreRatio));
  const credits = Math.round(stage.credits * outcome.scoreRatio * state.streak);
  const tax = Math.round(credits * stage.taxRate);
  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + Math.round(stage.readiness * outcome.scoreRatio));
  state.confidence = Math.max(0, Math.min(100, state.confidence + (outcome.scoreRatio >= 0.75 ? 8 : outcome.scoreRatio >= 0.5 ? 3 : -2)));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.stageBestScores[stageId] = Math.max(Number(state.stageBestScores[stageId] || 0), Number(outcome.scoreRatio || 0));
  state.streak = outcome.scoreRatio >= 0.75 ? Math.min(5, state.streak + 1) : 1;
  state.recentReward = {
    type: outcome.scoreRatio >= 0.75 ? "positive" : outcome.scoreRatio >= 0.5 ? "warning" : "bad",
    title: `${stage.title} reward pulse`,
    detail: `+${earnedMarks} marks • +${Math.round(stage.readiness * outcome.scoreRatio)}% readiness • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} cleared`,
    detail: `${earnedMarks}/${stage.marks} marks banked • ${formatCurrency(credits)} salary reward • ${formatCurrency(tax)} class contribution`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: stageId,
    label: stage.title,
    detail: `${earnedMarks}/${stage.marks} marks • ${Math.round(stage.readiness * outcome.scoreRatio)} readiness`,
    earnedDelta: credits,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderMap();
  renderDebrief();
}

function awardStageImprovement(stageId, previousRatio, nextRatio) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const prior = Math.max(0, Number(previousRatio || 0));
  const next = Math.max(prior, Number(nextRatio || 0));
  const deltaRatio = Math.max(0, next - prior);
  if (!deltaRatio) return;

  const earnedMarks = Math.max(0, Math.round(stage.marks * next) - Math.round(stage.marks * prior));
  const readinessGain = Math.max(0, Math.round(stage.readiness * next) - Math.round(stage.readiness * prior));
  const credits = Math.max(0, Math.round(stage.credits * deltaRatio));
  const tax = Math.max(0, Math.round(credits * stage.taxRate));

  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + readinessGain);
  state.confidence = Math.max(0, Math.min(100, state.confidence + 2));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.stageBestScores[stageId] = next;
  state.recentReward = {
    type: "positive",
    title: `${stage.title} best result improved`,
    detail: `Best score lifted from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • +${earnedMarks} marks • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} improved`,
    detail: `Best score raised from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • ${formatCurrency(credits)} salary added`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `${stageId}-improvement`,
    label: `${stage.title} improvement`,
    detail: `Best score improved from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}%`,
    earnedDelta: credits,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderMap();
  renderDebrief();
}

function addEvidence(title, detail) {
  state.evidenceLog.push({ title, detail });
  renderEvidence();
}

async function saveProgress(checkpoint, evidenceType = "artifact", evidenceText = "", autoScore = null, meta = {}) {
  const student = state.student;
  const session = getPlayerSession();
  const earnedDelta = Math.max(0, Number(state.salaryBoost || 0) - Number(state.creditedSalaryBoost || 0));
  const taxDelta = Math.max(0, Number(state.taxContribution || 0) - Number(state.creditedTaxContribution || 0));
  const nextSalary = Number(session.annualSalary || 25000) + earnedDelta;
  const nextNetWorth = Number(session.cumulativeNetWorth || 0) + earnedDelta;
  const nextWorkLife = Math.max(45, Math.min(100, Number(session.workLifeBalance || 60) + (state.streak > 1 ? 3 : 0)));
  const nextSecurity = Math.max(45, Math.min(100, Number(session.jobSecurity || 75) + Math.round(state.readiness / 20)));
  const nextSavings = Math.max(0, Number(session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25)));
  const nextTaxPaid = Math.max(0, Number(session.taxPaid || 0) + taxDelta);

  writePlayerSession({
    studentId: student?.id || session.studentId || null,
    username: student?.username || session.username || "",
    playerName: student?.displayName || session.playerName || "Student",
    schoolName: student?.schoolName || session.schoolName || "",
    classId: student?.classId || session.classId || null,
    classCode: student?.classCode || session.classCode || "",
    className: student?.className || session.className || "",
    annualSalary: nextSalary,
    cumulativeNetWorth: nextNetWorth,
    savings: nextSavings,
    taxPaid: nextTaxPaid,
    jobSecurity: nextSecurity,
    workLifeBalance: nextWorkLife,
    checkpoint
  });
  state.creditedSalaryBoost = Number(state.salaryBoost || 0);
  state.creditedTaxContribution = Number(state.taxContribution || 0);
  if (earnedDelta || taxDelta) {
    pushEconomyLog({
      eventType: "progress-saved",
      checkpoint,
      label: meta.taskName || checkpoint,
      detail: meta.promptText || evidenceType,
      earnedDelta,
      taxDelta,
      annualSalaryAfter: nextSalary,
      netWorthAfter: nextNetWorth,
      savingsAfter: nextSavings,
      taxPaidAfter: nextTaxPaid
    });
  }

  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const completionPercent = Math.round((Object.keys(state.completed).length / STAGES.length) * 100);
  const masteryPercent = Math.min(100, Math.round((state.marksBanked / STAGES.reduce((sum, stage) => sum + stage.marks, 0)) * 100));

  const progressPayload = {
    student_id: student.id,
    module_id: MODULE_ID,
    completion_percent: completionPercent,
    mastery_percent: masteryPercent,
    attempts: Object.keys(state.completed).length,
    unlocked: true,
    completed: Object.keys(state.completed).length === STAGES.length,
    last_played_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let progressResult = await supabase.from("student_module_progress").upsert({
    ...progressPayload,
    class_id: student.classId
  }, { onConflict: "student_id,module_id" });

  if (progressResult.error) {
    progressResult = await supabase.from("student_module_progress").upsert(progressPayload, { onConflict: "student_id,module_id" });
  }

  if (evidenceText) {
    const evidencePayload = JSON.stringify({
      kind: "career-empire-evidence",
      module_id: MODULE_ID,
      checkpoint,
      evidence_type: evidenceType,
      task_name: meta.taskName || state.selectedStageId || checkpoint,
      duration_seconds: meta.durationSeconds ?? null,
      score_percent: autoScore,
      prompt_text: meta.promptText || "",
      response_text: evidenceText,
      ...meta.extraPayload
    });
    await supabase.from("assessment_evidence").insert({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      evidence_type: evidenceType,
      prompt: checkpoint,
      response_text: evidencePayload,
      auto_score: autoScore,
      created_at: new Date().toISOString()
    });
  }

  if (Array.isArray(meta.additionalEvidenceRows) && meta.additionalEvidenceRows.length) {
    const additionalRows = meta.additionalEvidenceRows.map(item => ({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      evidence_type: item.evidenceType || evidenceType,
      prompt: item.prompt || checkpoint,
      response_text: JSON.stringify({
        kind: "career-empire-evidence",
        module_id: MODULE_ID,
        checkpoint: item.checkpoint || checkpoint,
        evidence_type: item.evidenceType || evidenceType,
        task_name: item.taskName || meta.taskName || state.selectedStageId || checkpoint,
        duration_seconds: item.durationSeconds ?? null,
        score_percent: typeof item.autoScore === "number" ? item.autoScore : autoScore,
        prompt_text: item.promptText || "",
        response_text: item.responseText || "",
        ...(item.extraPayload || {})
      }),
      auto_score: typeof item.autoScore === "number" ? item.autoScore : autoScore,
      created_at: new Date().toISOString()
    }));
    await supabase.from("assessment_evidence").insert(additionalRows);
  }

  const { data: existingProfile } = await supabase
    .from("player_profiles")
    .select("student_id, savings, tax_paid")
    .eq("student_id", student.id)
    .maybeSingle();

  await supabase.from("player_profiles").upsert({
    student_id: student.id,
    career_title: session.careerTitle || "Exam Strategist",
    annual_salary: nextSalary,
    cumulative_net_worth: nextNetWorth,
    savings: Math.max(0, Number(existingProfile?.savings || session.savings || 0) + Math.max(0, Math.round(earnedDelta * 0.25))),
    tax_paid: Math.max(0, Number(existingProfile?.tax_paid || session.taxPaid || 0) + taxDelta),
    career_level: Number(session.careerLevel || 1),
    job_security: nextSecurity,
    work_life_balance: nextWorkLife,
    years_played: Number(session.yearsPlayed || 0),
    tech_mastery: Number(session.techMastery || 0),
    climate_mastery: Number(session.climateMastery || 0),
    demo_mastery: Number(session.demoMastery || 0),
    economic_mastery: Number(session.economicMastery || 0),
    updated_at: new Date().toISOString()
  }, { onConflict: "student_id" });

  if (state.answers.bossVote) {
    await supabase.from("community_votes").insert({
      student_id: student.id,
      class_id: student.classId,
      module_id: MODULE_ID,
      vote_key: state.answers.bossVote,
      created_at: new Date().toISOString()
    });
  }
}

function inferStageFromEvidence(row) {
  const type = String(row?.evidence_type || "").toLowerCase();
  const prompt = String(row?.prompt || "").toLowerCase();
  if (type === "revision-check" || prompt.includes("revision-arena")) return "content";
  if (type === "glossary-check" || prompt.includes("glossary-lock-in")) return "glossary";
  if (type === "decoder-breakdown" || prompt.includes("decoder-drill")) return "decoder";
  if (type === "est-response" || prompt.includes("boss-round")) return "boss";
  return null;
}

function getEvidencePreview(row) {
  try {
    const parsed = JSON.parse(row?.response_text || "");
    return parsed.response_text || parsed.prompt_text || row?.prompt || "Saved response";
  } catch (_) {
    return String(row?.response_text || row?.prompt || "Saved response");
  }
}

function parseEvidencePayload(row) {
  try {
    return JSON.parse(row?.response_text || "");
  } catch (_) {
    return null;
  }
}

function hydrateGlossarySummaryFromPayload(payload) {
  const summary = payload?.round_summary;
  if (!summary) return;

  state.glossaryHasStarted = true;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = summary.round_rewards && typeof summary.round_rewards === "object"
    ? { ...summary.round_rewards }
    : state.glossaryRoundRewards;
  state.glossaryRoundVotes = summary.round_votes && typeof summary.round_votes === "object"
    ? { ...summary.round_votes }
    : state.glossaryRoundVotes;
  state.glossaryBestStreak = Math.max(Number(state.glossaryBestStreak || 0), Number(summary.best_streak || 0));
  state.glossaryMisses = Number(summary.misses || 0);
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryMode = "play";
  state.glossaryPulse = state.completed.glossary
    ? "Best glossary result loaded. Replay any chamber to improve your mastery without losing the banked result."
    : (state.glossaryPulse || "");
  state.glossaryPulseType = state.completed.glossary ? "good" : state.glossaryPulseType;
}

function restoreGlossaryReplayBoard() {
  clearGlossaryRecallAdvanceTimeout();
  clearGlossaryTimer();
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryRoundCelebration = null;
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  state.glossaryPulse = state.completed.glossary
    ? "Best glossary result loaded. Replay any chamber to improve your mastery without losing the banked result."
    : "Glossary lab restored. Pick up where you left off.";
  state.glossaryPulseType = "good";
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

async function hydrateFromSupabase() {
  const student = state.student;
  if (!student?.id) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;

  const { data: evidenceRows, error: evidenceError } = await supabase
    .from("assessment_evidence")
    .select("evidence_type, prompt, response_text, created_at, auto_score")
    .eq("student_id", student.id)
    .eq("module_id", MODULE_ID)
    .order("created_at", { ascending: true });

  if (evidenceError) {
    console.error(evidenceError);
    return;
  }

  if (Array.isArray(evidenceRows) && evidenceRows.length) {
    let latestGlossaryPayload = null;
    state.evidenceLog = evidenceRows.map(row => {
      const stageId = inferStageFromEvidence(row);
      if (stageId) state.completed[stageId] = true;
      const autoScore = Number(row?.auto_score);
      if (stageId && Number.isFinite(autoScore)) {
        state.stageBestScores[stageId] = Math.max(Number(state.stageBestScores[stageId] || 0), autoScore / 100);
      }
      if (stageId === "glossary") {
        latestGlossaryPayload = parseEvidencePayload(row) || latestGlossaryPayload;
      }
      return {
        title: stageId ? `${STAGES.find(stage => stage.id === stageId)?.title || "Saved stage"} saved` : "Saved EST progress",
        detail: getEvidencePreview(row).slice(0, 160)
      };
    });
    if (latestGlossaryPayload) {
      hydrateGlossarySummaryFromPayload(latestGlossaryPayload);
    }
  }
}

function showFeedbackBox(type, lines, extraHtml = "") {
  renderStageRoot(`
    <div class="feedback-box ${type}">
      ${lines.map(line => `<p>${line}</p>`).join("")}
      ${extraHtml}
      <p><button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button></p>
    </div>
  `);
}

function bossCriterionReview(round, response) {
  const normalized = String(response || "").trim();
  const lower = normalized.toLowerCase();
  const wordCount = normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
  const checks = [
    { id: "command", label: "Command word decoded", passed: state.answers["boss-command"] === round.correctCommand, detail: `Expected ${round.correctCommand}.` },
    { id: "content", label: "Best content point chosen", passed: state.answers["boss-content"] === round.correctContent, detail: "Content option aligns to the revision topic." },
    { id: "glossary", label: "Correct glossary term selected", passed: state.answers["boss-glossary"] === round.correctGlossary, detail: `Expected ${round.correctGlossary}.` },
    { id: "point", label: "Clear answer point", passed: round.requiredKeywords.point.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Your response should directly answer the question." },
    { id: "because", label: "Cause or explanation included", passed: round.requiredKeywords.because.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Use because/how reasoning, not a bare statement." },
    { id: "result", label: "Consequence or outcome included", passed: round.requiredKeywords.result.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Show the effect, outcome, or implication." },
    { id: "glossary-language", label: "Glossary language used in writing", passed: round.requiredKeywords.glossary.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Bring the glossary term into the actual response." },
    { id: "control", label: "Enough detail for marks", passed: wordCount >= 24, detail: "Very short answers usually miss the explanation needed for marks." }
  ];

  const passedCount = checks.filter(check => check.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);
  const strengths = checks.filter(check => check.passed).slice(0, 4).map(check => check.label);
  const nextSteps = checks.filter(check => !check.passed).slice(0, 4).map(check => check.detail);
  let band = "Needs work";
  if (scorePercent >= 85) band = "Strong";
  else if (scorePercent >= 60) band = "Developing";

  return { checks, scorePercent, band, strengths, nextSteps, wordCount };
}

function renderBossSamples(round) {
  if (!round?.sampleResponses?.length) return "";
  return `
    <div class="sample-review">
      <h3>Student sample comparison</h3>
      <p class="small-copy">Compare your answer with different quality samples. Look for what each sample includes or leaves out.</p>
      <div class="sample-grid">
        ${round.sampleResponses.map(sample => `
          <article class="sample-card ${sample.band.toLowerCase().replace(/\s+/g, "-")}">
            <div class="sample-meta">
              <strong>${escapeHtml(sample.label)}</strong>
              <span>${escapeHtml(sample.band)}</span>
            </div>
            <p>${escapeHtml(sample.response)}</p>
            <p class="sample-commentary">${escapeHtml(sample.commentary)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

async function submitDecoder() {
  const round = state.stageDeck?.decoderRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const correctCount = [
    state.answers["decoder-verb"] === round.correctVerb,
    state.answers["decoder-topic"] === round.correctTopic,
    state.answers["decoder-context"] === round.correctContext,
    state.answers["decoder-structure"] === round.correctStructure
  ].filter(Boolean).length;
  const scoreRatio = correctCount / 4;
  awardStage("decoder", { scoreRatio });
  addEvidence("Decoded EST question", `${round.question} • Verb: ${state.answers["decoder-verb"] || "not chosen"} • Topic: ${state.answers["decoder-topic"] || "not chosen"} • Context: ${state.answers["decoder-context"] || "not chosen"} • Structure: ${state.answers["decoder-structure"] || "not chosen"}`);
  await saveProgress("decoder-drill", "decoder-breakdown", `Question: ${round.question}\nVerb: ${state.answers["decoder-verb"] || "not chosen"}\nTopic: ${state.answers["decoder-topic"] || "not chosen"}\nContext: ${state.answers["decoder-context"] || "not chosen"}\nStructure: ${state.answers["decoder-structure"] || "not chosen"}`, Math.round(scoreRatio * 100), {
    taskName: "VTCS Decoder",
    durationSeconds,
    promptText: round.question,
    extraPayload: {
      forensic_brief: {
        verb: state.answers["decoder-verb"] || "",
        topic: state.answers["decoder-topic"] || "",
        context: state.answers["decoder-context"] || "",
        structure: state.answers["decoder-structure"] || ""
      }
    }
  });
  showFeedbackBox(scoreRatio >= 0.75 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Decoder results:</strong> ${correctCount}/4 parts correct.`,
    `Best reading: <strong>${round.correctVerb}</strong> the issue of <strong>${round.correctTopic}</strong> in the context of <strong>${round.correctContext}</strong> using <strong>${round.correctStructure}</strong>.`,
    "You banked marks and readiness by reading the question properly before writing."
  ]);
}

async function submitContent() {
  const groups = state.stageDeck?.contentGroups || [];
  persistCurrentContentNote();
  bankCurrentContentDuration();
  const durationSeconds = getCurrentStageDurationSeconds();
  const scoredRounds = groups.flatMap(group => group.rounds.map((round, index) => ({
    group,
    round,
    index,
    answerKey: `content-${group.id}-${index}`,
    selected: state.answers[`content-${group.id}-${index}`] || "",
    correct: state.answers[`content-${group.id}-${index}`] === round.correct
  })));
  const correctCount = scoredRounds.filter(item => item.correct).length;
  const scoreRatio = scoredRounds.length ? correctCount / scoredRounds.length : 0;
  const topicSummaries = groups.map(group => {
    const trainingConfig = getContentTrainingConfig(group.id);
    const results = group.rounds.map((round, index) => ({
      topic: round.topic,
      question: round.question,
      selected: state.answers[`content-${group.id}-${index}`] || "not chosen",
      correctAnswer: round.correct,
      correct: state.answers[`content-${group.id}-${index}`] === round.correct
    }));
    const topicCorrect = results.filter(item => item.correct).length;
    const topicScore = results.length ? Math.round((topicCorrect / results.length) * 100) : 0;
    return {
      group,
      results,
      topicCorrect,
      topicScore,
      training: trainingConfig
        ? {
            title: trainingConfig.title,
            type: trainingConfig.type,
            ...getTrainingScore(trainingConfig),
            interactions: getTrainingInteractions(trainingConfig)
          }
        : null,
      response: state.answers[`content-note-${group.id}`] || "",
      durationSeconds: state.contentGroupDurations[group.id] || 0
    };
  });
  awardStage("content", { scoreRatio });
  addEvidence("EST content check", topicSummaries.map(summary => `${summary.group.title}: ${summary.topicCorrect}/${summary.results.length} correct • ${summary.response || "No written response yet"}`).join(" || "));
  await saveProgress("revision-arena", "revision-check", `Content check accuracy: ${correctCount}/${scoredRounds.length}`, Math.round(scoreRatio * 100), {
    taskName: "EST Content Check",
    durationSeconds,
    promptText: "Choose the strongest content statement for each EST revision topic.",
    extraPayload: {
      topic_groups: topicSummaries.map(summary => ({
        topic_group_id: summary.group.id,
        topic_group: summary.group.title,
        duration_seconds: summary.durationSeconds,
        score_percent: summary.topicScore,
        training_score_percent: summary.training?.percent ?? null,
        written_response: summary.response,
        training: summary.training,
        items: summary.results.map(item => ({
          topic: item.topic,
          question: item.question,
          selected: item.selected,
          correct_answer: item.correctAnswer,
          correct: item.correct
        }))
      }))
    },
    additionalEvidenceRows: topicSummaries.map(summary => ({
      checkpoint: `revision-arena-${summary.group.id}`,
      evidenceType: "revision-topic-check",
      taskName: `EST Content Check - ${summary.group.title}`,
      durationSeconds: summary.durationSeconds,
      autoScore: summary.topicScore,
      prompt: summary.group.title,
      promptText: summary.group.writePrompt,
      responseText: summary.response || "No written response entered.",
        extraPayload: {
          topic_group_id: summary.group.id,
          topic_group: summary.group.title,
          sample_response: summary.group.sampleResponse,
          training_title: summary.training?.title || "",
          training_type: summary.training?.type || "",
          training_score_percent: summary.training?.percent ?? null,
          training_interactions: summary.training?.interactions || [],
          selected_options: summary.results.map(item => ({
            topic: item.topic,
            question: item.question,
            selected: item.selected,
          correct_answer: item.correctAnswer,
          correct: item.correct
        }))
      }
    }))
  });
  const sampleReviewHtml = `
    <div class="sample-review">
      <h3>Topic-by-topic recap</h3>
      <p class="small-copy">Use these model responses to compare your own EST-ready explanation for each content strand.</p>
      <div class="sample-grid">
        ${topicSummaries.map(summary => `
          <article class="sample-card ${summary.topicScore >= 80 ? "strong" : summary.topicScore >= 50 ? "developing" : "needs-work"}">
            <div class="sample-meta">
              <strong>${escapeHtml(summary.group.title)}</strong>
              <span>${summary.topicScore}% • ${formatDurationSeconds(summary.durationSeconds)}${summary.training ? ` • Practice ${summary.training.percent}%` : ""}</span>
            </div>
            <p><strong>Your response:</strong> ${escapeHtml(summary.response || "No written response entered.")}</p>
            <p><strong>Sample response:</strong> ${escapeHtml(summary.group.sampleResponse)}</p>
            <p class="sample-commentary">${escapeHtml(`${summary.topicCorrect}/${summary.results.length} knowledge checks correct in this content strand.${summary.training ? ` Practice Bay: ${summary.training.correct}/${summary.training.total}.` : ""}`)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
  showFeedbackBox(scoreRatio === 1 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Content check:</strong> ${correctCount}/${scoredRounds.length} strongest answer points selected.`,
    `This stage is now grouped into the ${groups.length} core EST revision strands, so students and teachers can see which content area was strongest and where the most time was spent.`,
    "Those content points and written explanations are what later feed the decoder and boss-round responses."
  ], sampleReviewHtml);
}

async function submitGlossary() {
  const batch = getCurrentGlossaryBatch();
  if (state.glossaryRoundIndex < 3) return;

  batch.forEach(item => {
    const typedTerm = normaliseGlossaryTermText(state.glossaryRecallAnswers[`term-${item.id}`]);
    const typedKeyword = normaliseGlossaryTermText(state.glossaryRecallAnswers[`keyword-${item.id}`]);
    const termCorrect = typedTerm === normaliseGlossaryTermText(item.term);
    const keywordCorrect = item.keywords.some(keyword => typedKeyword.includes(normaliseGlossaryTermText(keyword)));
    const overallCorrect = termCorrect && keywordCorrect;
    state.glossaryRecallResults[item.id] = {
      term: item.term,
      keywords: item.keywords,
      termCorrect,
      keywordCorrect,
      overallCorrect
    };
  });

  const allResults = batch.map(item => state.glossaryRecallResults[item.id]).filter(Boolean);
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  buildGlossaryCelebration(4, `${overallCorrect}/${total} final recall checks correct.`);
  renderGlossaryStage();
}

async function bankGlossaryResults() {
  const batch = getCurrentGlossaryBatch();
  const allResults = batch.map(item => state.glossaryRecallResults[item.id]).filter(Boolean);
  const durationSeconds = getCurrentStageDurationSeconds();
  const overallCorrect = allResults.reduce((sum, item) => sum + (item.termCorrect ? 1 : 0) + (item.keywordCorrect ? 1 : 0), 0);
  const total = allResults.length * 2;
  const scoreRatio = total ? overallCorrect / total : 0;
  const scorePercent = Math.round(scoreRatio * 100);
  const previousBestRatio = Math.max(0, Number(state.stageBestScores.glossary || 0));
  const firstGlossaryClear = !state.completed.glossary && previousBestRatio === 0;
  const improvedBest = scoreRatio > previousBestRatio;

  if (firstGlossaryClear) {
    awardStage("glossary", { scoreRatio });
  } else if (improvedBest) {
    awardStageImprovement("glossary", previousBestRatio, scoreRatio);
  } else {
    state.recentReward = {
      type: "warning",
      title: "Glossary replay saved",
      detail: `This attempt scored ${scorePercent}%. Your best glossary result remains ${Math.round(previousBestRatio * 100)}%, so no extra salary or tax was added.`
    };
    renderRewardPulse();
  }

  state.stageBestScores.glossary = Math.max(previousBestRatio, scoreRatio);
  addEvidence("Glossary mastery run", `${overallCorrect}/${total} final recall checks correct • Best streak x${state.glossaryBestStreak} • Misses ${state.glossaryMisses}`);
  await saveProgress("glossary-lock-in", "glossary-check", `Glossary final recall: ${overallCorrect}/${total}`, scorePercent, {
    taskName: "Glossary Check",
    durationSeconds,
    promptText: "Match and recall glossary terms across four scaffolded rounds.",
    extraPayload: {
      round_summary: {
        rounds: GLOSSARY_ROUND_CONFIGS.map(item => item.title),
        total_terms: FULL_GLOSSARY_TERMS.length,
        best_streak: state.glossaryBestStreak,
        misses: state.glossaryMisses,
        round_rewards: state.glossaryRoundRewards,
        round_votes: state.glossaryRoundVotes
      },
      final_round_results: allResults
    }
  });
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  showFeedbackBox(scoreRatio >= 0.8 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Glossary score:</strong> ${overallCorrect}/${total} final recall checks correct.`,
    `${improvedBest || firstGlossaryClear
      ? `Best glossary result is now ${Math.round(state.stageBestScores.glossary * 100)}%.`
      : `Best glossary result remains ${Math.round(previousBestRatio * 100)}%. This replay was saved but did not overwrite your best run.`}`,
    `Best streak: x${state.glossaryBestStreak}. Misses: ${state.glossaryMisses}.`,
    "Teachers can now inspect which terms were mastered or missed in the final recall round."
  ]);
}

async function submitBoss() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const textarea = document.getElementById("boss-response");
  const existingResponse = textarea ? textarea.value.trim() : "";
  if (!existingResponse) buildBossDraft();
  const response = textarea ? textarea.value.trim() : (state.answers.bossText || "");
  state.answers.bossText = response;
  const review = bossCriterionReview(round, response);
  state.lastBossReview = review;
  const scoreRatio = review.scorePercent / 100;
  awardStage("boss", { scoreRatio });
  addEvidence("Boss round EST answer", `${round.question} • ${response || "No boss-round answer entered"}`);
  await saveProgress(
    "boss-round",
    "est-response",
    `Prompt: ${round.question}\nScore: ${review.scorePercent}%\nBand: ${review.band}\nResponse: ${response || "No response entered"}`,
    review.scorePercent,
    {
      taskName: "Boss Round",
      durationSeconds,
      promptText: round.question,
      extraPayload: {
        showdown_choice: state.answers.bossShowdown || "",
        showdown_reason: state.answers.bossShowdownReason || "",
        scaffold_parts: getBossScaffoldLines(round).map((line, index) => ({
          label: line,
          response: state.answers[`boss-scaffold-${index}`] || ""
        }))
      }
    }
  );

  const strengths = review.strengths.length
    ? `<ul class="feedback-list">${review.strengths.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No strong elements were detected yet.</p>";
  const nextSteps = review.nextSteps.length
    ? `<ul class="feedback-list">${review.nextSteps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No immediate fixes needed. Push for even tighter wording.</p>";
  const rubric = `
    <div class="rubric-grid">
      ${review.checks.map(check => `
        <div class="rubric-chip ${check.passed ? "pass" : "fail"}">
          <strong>${escapeHtml(check.label)}</strong>
          <span>${check.passed ? "Met" : "Missing"}</span>
        </div>
      `).join("")}
    </div>
  `;

  showFeedbackBox(review.scorePercent >= 85 ? "good" : review.scorePercent >= 60 ? "warn" : "bad", [
    `<strong>Boss round complete:</strong> ${review.scorePercent}% • ${review.band} band.`,
    `Word count: ${review.wordCount}. This boss round checked decoding, glossary control, answer structure, explanation, and result language.`,
    `Marker model: ${escapeHtml(round.strongAnswer)}`
  ], `
    <div class="sample-review">
      <h3>Your strengths</h3>
      ${strengths}
      <h3>Next steps</h3>
      ${nextSteps}
      <h3>Rubric snapshot</h3>
      ${rubric}
    </div>
    ${renderBossSamples(round)}
  `);
}

function returnToTrack() {
  setLabMode(false);
  setStageMenuMode(false);
  state.selectedStageId = null;
  state.lastBossReview = null;
  state.contentGroupIndex = -1;
  state.contentView = "menu";
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
  scrollToTopSmooth();
}

async function init() {
  state.student = getLoggedInStudent();
  registerLeaveWarning();
  await hydrateFromSupabase();
  const [bank, contentStageConfig] = await Promise.all([
    loadBank(),
    loadContentStageConfig()
  ]);
  state.bank = bank;
  state.contentStageConfig = contentStageConfig;
  state.stageDeck = buildStageDeck(state.bank);
  state.contentView = "menu";
  setLabMode(false);
  setStageMenuMode(false);
  renderFocusNav();
  renderHero();
  renderMetrics();
  renderMap();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  renderEvidence();
}

window.ESTPrep = {
  openStage,
  openContentGroupIntro,
  startContentGroup,
  nextContentGroup: () => moveContentGroup(1),
  prevContentGroup: () => moveContentGroup(-1),
  jumpToContentGroup,
  setTrainingChoice,
  setTrainingChoiceEncoded,
  setContentResponseSegmentEncoded,
  buildContentResponse,
  setGlossarySelectedTerm,
  setGlossarySelectedSocket,
  setGlossaryMode,
  moveGlossaryStudy,
  flipGlossaryStudyCard,
  startGlossaryDrag,
  endGlossaryDrag,
  dropGlossaryTerm,
  handleGlossarySocketClick,
  nextGlossaryPhase,
  continueGlossaryRound,
  setGlossaryRoundVote,
  toggleReveal,
  setGlossaryRecallAnswer,
  setGlossaryRecallChoiceEncoded,
  setGlossaryRecallTermChoiceEncoded,
  setGlossaryRecallKeywordChoiceEncoded,
  submitGlossaryChallengeChoiceEncoded,
  setBossScaffold,
  setBossShowdownReason,
  buildBossDraft,
  setChoice,
  setChoiceEncoded,
  setBossVote,
  submitContent,
  submitDecoder,
  submitGlossary,
  submitBoss,
  returnToLab,
  returnToTrack
};

init().catch(error => {
  console.error(error);
  renderStageRoot(`
    <div class="feedback-box bad">
      <p><strong>EST Prep could not load.</strong></p>
      <p>${escapeHtml(error.message || "Unknown error")}</p>
    </div>
  `);
});
