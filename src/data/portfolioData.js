export const personalInfo = {
  name: "Anjoelo Calderon",
  email: "anjoelo.ca@gmail.com",
  location: "Fremont, CA",
  linkedin: "https://linkedin.com/in/anjoelo-calderon",
  github: "https://github.com/jelo-ca",
  itch: "https://imajello.itch.io/",
  education: {
    school: "De Anza College",
    degree: "Associate of Science for Transfer",
    gpa: "3.75",
    expected: "Expected March 2026",
    coursework: [
      "Intermediate Programming in C++",
      "Data Abstract & Structures",
      "Intro x86 Assembly Language",
      "Intro to SQL",
    ],
  },
  hobbies: [
    "Martial Arts",
    "Dungeons & Dragons",
    "Musical Instruments",
    "Game Development",
  ],
  languages: ["Fluent English", "Fluent Filipino", "Some Spanish"],
};

export const experience = [
  {
    role: "STEM Tutor",
    org: "De Anza College",
    location: "Cupertino, CA",
    dates: "Sep 2025 – Present",
    bullets: [
      "Broke down complex topics in Calculus, Linear Algebra, and Physics into approachable lessons, adapting to each student's learning needs.",
      "Tracked recurring pain-points to continuously refine material and tutoring strategies.",
    ],
    modes: ["AI/ML"],
  },
  {
    role: "STEM Teaching Contractor",
    org: "Young Gates",
    location: "Milpitas, CA",
    dates: "Jun 2024 – Present",
    bullets: [
      "Conducted 20+ hands-on workshops across game development, programming, drones, and 3D design.",
      "Collaborated with the teaching team to track progress, adjust pacing, and provide support.",
    ],
    modes: ["AI/ML", "Fullstack", "Gamedev"],
  },
  {
    role: "Front-Service Manager",
    org: "Country Gourmet Sunnyvale",
    location: "Sunnyvale, CA",
    dates: "Oct 2021 – May 2024",
    bullets: [
      "Maintained the restaurant website by updating the SQL backend menu database and refreshing page layout.",
      "Managed front-of-house operations to maintain efficient, customer-oriented shifts.",
    ],
    modes: ["Fullstack"],
  },
];

export const leadership = [
  {
    role: "Founder & Executive Director",
    org: "De Anza Expo",
    location: "Cupertino, CA",
    dates: "Aug 2025 – Present",
    bullets: [
      "Launched a student-led expo featuring 15+ clubs; drove program strategy, proposal, roadmap, and event operations.",
      "Directed a student board spanning marketing, logistics, finances, outreach, and web execution.",
      "Managed stakeholders across campus leadership, student clubs, and external partners.",
    ],
  },
  {
    role: "Club President",
    org: "De Anza Game Development Club",
    location: "Cupertino, CA",
    dates: "Jan 2025 – Present",
    bullets: [
      "Reactivated an inactive club and achieved 400% membership growth in one quarter.",
      "Produced the club's first Game Jam (30+ entries, 120+ participants); defined submission and playtest criteria.",
      "Conducted QA playtests for member-built games delivering structured feedback on bugs, UI/UX, and balance.",
    ],
  },
];

export const resumeModes = {
  "AI/ML": {
    title: "AI/ML Engineer",
    subtitle: "Intelligence Class",
    flavor:
      "Trains on data, deploys insight, and rolls Arcana for RAG pipelines.",
    stats: [
      { name: "STR", label: "Python", score: 18 },
      { name: "DEX", label: "OCR/Vision", score: 15 },
      { name: "CON", label: "Git/GitHub", score: 15 },
      { name: "INT", label: "LlamaIndex", score: 17 },
      { name: "WIS", label: "LLMs", score: 16 },
      { name: "CHA", label: "Research", score: 14 },
    ],
    skills: [
      "Python",
      "LlamaIndex",
      "Mistral",
      "Phi-2",
      "Tesseract OCR",
      "PaddleOCR",
      "SQL",
      "Git/GitHub",
    ],
    background:
      "Builds AI pipelines and RAG systems for document intelligence. Currently externs at Pfizer developing OCR and retrieval systems using open-source LLMs.",
  },

  Fullstack: {
    title: "Fullstack Developer",
    subtitle: "Builder Class",
    flavor:
      "Casts React spells from the frontend, communes with databases below.",
    stats: [
      { name: "STR", label: "JavaScript", score: 16 },
      { name: "DEX", label: "React", score: 16 },
      { name: "CON", label: "Supabase", score: 15 },
      { name: "INT", label: "Python", score: 16 },
      { name: "WIS", label: "HTML/CSS", score: 17 },
      { name: "CHA", label: "Git/GitHub", score: 15 },
    ],
    skills: [
      "JavaScript",
      "React",
      "HTML/CSS",
      "TypeScript",
      "Supabase",
      "SQLite",
      "Python",
      "Git/GitHub",
    ],
    background:
      "Builds end-to-end web and mobile applications with clean, responsive UIs and reliable backends. Ships real products used by real people.",
  },

  Gamedev: {
    title: "Game Developer",
    subtitle: "Creator Class",
    flavor: "Rolls Initiative on every prototype. Nat 20 on game feel.",
    stats: [
      { name: "STR", label: "Python", score: 16 },
      { name: "DEX", label: "C#/Unity", score: 14 },
      { name: "CON", label: "Git/GitHub", score: 15 },
      { name: "INT", label: "C++", score: 14 },
      { name: "WIS", label: "Design", score: 13 },
      { name: "CHA", label: "Creativity", score: 17 },
    ],
    skills: [
      "C#",
      "Unity",
      "Python",
      "JavaScript",
      "C++",
      "Git/GitHub",
      "Game Design",
      "QA Playtesting",
    ],
    background:
      "President of De Anza Game Dev Club. Organized the club's first Game Jam with 30+ entries and 120+ participants. Passionate about interactive systems and player experience.",
  },
};

export const projects = [
  {
    name: "Pfizer Extern — AI Document Intelligence",
    dates: "Feb 2026 – Present",
    status: "In Progress",
    description:
      "AI pipelines for pharmaceutical vendor file processing using OCR and RAG.",
    bullets: [
      "Built AI pipelines to process pharmaceutical vendor files using OCR and RAG for data extraction and classification.",
      "Developed a RAG-based document retrieval system with LlamaIndex, optimized with chunk tuning and open-source LLMs.",
      "Benchmarking OCR accuracy, RAG retrieval quality, and routing performance; delivering a technical report with deployment recommendations.",
    ],
    tech: [
      "Python",
      "Tesseract",
      "PaddleOCR",
      "LlamaIndex",
      "Mistral",
      "Phi-2",
    ],
    url: null,
    modes: ["AI/ML"],
  },
  {
    name: "deanzaexpo.org",
    dates: "Dec 2025 – Jan 2026",
    status: "Shipped",
    description:
      "Responsive React event platform for De Anza Expo with authenticated organizer dashboard.",
    bullets: [
      "Shipped a responsive React site supporting 20+ speaker profiles and 15+ project entries.",
      "Built an authenticated organizer dashboard enabling same-day content updates — cut update time from ~10 min to <1 min per change.",
      "Implemented CRUD with schema-level constraints, client-side validation, and error handling.",
    ],
    tech: ["React", "Supabase", "JavaScript", "HTML/CSS", "Git/GitHub"],
    url: "https://deanzaexpo.org",
    modes: ["Fullstack", "AI/ML"],
  },
  {
    name: "militarymuaythai.com",
    dates: "Mar 2025 – Jun 2025",
    status: "Shipped",
    description:
      "Modernized marketing website and enrollment flow for a Muay Thai gym.",
    bullets: [
      "Modernized a marketing website and enrollment flow, contributing to a 12% increase in online enrollments.",
      "Improved Lighthouse score from 85 to 92 by aligning to modern web best practices.",
      "Refactored front-end structure and on-page SEO to improve crawlability and accessibility.",
    ],
    tech: ["JavaScript", "HTML/CSS", "Figma", "Lighthouse", "Git/GitHub"],
    url: null,
    modes: ["Fullstack"],
  },
  {
    name: "Study Guild",
    dates: "2025 – Present",
    status: "In Progress",
    description:
      "Gamified mobile study app with XP, streaks, and daily quests.",
    bullets: [
      "Built a gamified study app with XP, streaks, and daily quests to reinforce consistent study habits.",
      "Implemented offline-first persistence using SQLite with TypeScript data models; added Jest unit tests for repositories and streak logic.",
      "Instrumented key events to support future retention analysis and iteration.",
    ],
    tech: ["React Native", "TypeScript", "SQLite", "Jest", "Git/GitHub"],
    url: null,
    modes: ["Fullstack", "Gamedev"],
  },
  {
    name: "De Anza Game Jam",
    dates: "Jan 2025 – Present",
    status: "Ongoing",
    description:
      "Organized and ran the Game Dev Club's first Game Jam as Club President.",
    bullets: [
      "Produced the club's first Game Jam with 30+ entries and 120+ participants.",
      "Defined submission and playtest criteria; coordinated feedback cycles to support development.",
      "Conducted QA playtests for member-built games and delivered structured feedback on bugs, UI/UX, and balance.",
    ],
    tech: ["Game Design", "QA Playtesting", "Event Operations"],
    url: null,
    modes: ["Gamedev"],
  },
];
