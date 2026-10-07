type ProjectLinks = {
  github?: string;
  demo?: string;
  caseStudy?: string;
};

export const portfolioData = {
  name: "Eshwar Sai",
  title: "Frontend Engineer",
  tagline: "Building enterprise fintech platforms with React, TypeScript & Micro-Frontend architecture. Exploring AI/GenAI, React Native & Java Spring Boot.",
  email: "eshwarsairam7@gmail.com",
  phone: "+91 6363824367",
  location: "Bengaluru, Karnataka",
  social: {
    github: "https://github.com/Eshwar066",
    linkedin: "https://www.linkedin.com/in/eshwar-sai-93936321b",
  },

  summary: {
    experience: "3+ years",
    currentRole: "Software Development Engineer II",
    company: "Nuvama Wealth",
    domain: "Fintech / WealthTech",
    products: ["IPO Platform", "NCD Platform", "Trading Dashboard"],
    focus: "Micro-Frontend architecture, real-time trading data, performance optimization",
    expandingInto: ["React Native", "Java", "Spring Boot", "GenAI", "LLMs", "RAG", "AI Agents", "Forward Deployed Engineer (FDE)"],
  },

  experience: [
    {
      id: "nuvama-sde2",
      company: "Nuvama Wealth (formerly Edelweiss Wealth Management)",
      role: "Software Development Engineer II",
      period: "Jun 2025 – Present",
      duration: "Current",
      location: "Bengaluru, Karnataka",
      type: "Full-time",
      description:
        "Building two React/TypeScript Micro-Frontend applications (NCD-IPO, IPO Platform) within a Module Federation + Vite architecture enabling independent deployment across teams. Owning end-to-end IPO investment journeys — routing, product bouquet, orderbook, transaction flows — serving CXO, Relationship Manager, Partner, and Client segments.",
      achievements: [
        "Architected Micro-Frontend apps with Module Federation + Vite for independent team deployments",
        "Owned end-to-end IPO investment workflows across CXO, RM, Partner, and Client segments",
        "Designed reusable component architecture with shadcn/ui & Tailwind CSS adopted across both MFE apps",
        "Managed server-state with TanStack Query for cache-first data fetching across investment workflows",
        "Partnered with Product, QA, Design, and Backend in Agile sprints to ship on schedule",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Vite",
        "Module Federation",
        "Micro-Frontend",
        "TanStack Query",
        "shadcn/ui",
        "Tailwind CSS",
        "Redux Toolkit",
        "Zustand",
      ],
    },
    {
      id: "nuvama-se",
      company: "Nuvama Wealth",
      role: "Software Engineer",
      period: "Oct 2024 – May 2025",
      duration: "8 months",
      location: "Bengaluru, Karnataka",
      type: "Full-time",
      description:
        "Built and maintained real-time WebSocket integrations delivering live market and trading data on the Nuvama Wealth Broking web platform. Improved performance by 30% and migrated bundling from Webpack to Vite.",
      achievements: [
        "Built real-time WebSocket integrations for live market & trading data",
        "Improved page load performance by 30% via image optimization, code splitting, and lazy loading",
        "Migrated bundling from Webpack to Vite for faster DX and build times",
        "Developed scalable, reusable frontend modules for enterprise financial apps",
        "Mentored junior developers on best practices",
        "Improved cross-browser compatibility and REST API integration",
      ],
      technologies: [
        "React",
        "TypeScript",
        "WebSockets",
        "Vite",
        "Webpack",
        "Redux",
        "Zustand",
        "REST APIs",
      ],
    },
    {
      id: "nuvama-ase",
      company: "Nuvama Wealth",
      role: "Associate Software Engineer",
      period: "Oct 2023 – Sep 2024",
      duration: "1 year",
      location: "Bengaluru, Karnataka",
      type: "Full-time",
      description:
        "Built responsive trading dashboards and financial workflows using React, TypeScript, Redux, and Zustand across APIConnect, Partners Documentation Portal, and Nuvama Web & Mobile.",
      achievements: [
        "Built responsive trading dashboards and financial workflows",
        "Integrated REST APIs with backend teams for seamless web & mobile data flow",
        "Delivered reusable UI components improving maintainability across business modules",
        "Participated in code reviews, debugging, and performance optimization in Agile delivery",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Redux",
        "Zustand",
        "REST APIs",
        "Context API",
      ],
    },
  ],

  projects: [
    {
      id: "algo-trading",
      title: "Algo Trading Automation Platform",
      type: "Personal",
      category: "Fintech + AI",
      description:
        "Automated options trading platform for Indian markets with live order execution on a self-managed DigitalOcean Linux server.",
      longDescription:
        "Strategies driven by Open Interest analysis, option chain snapshots, and positional trading logic with stop-loss/target management. Broker API integrations with retry handling, logging, and live monitoring; scalable architecture for multiple concurrent strategies.",
      image: "/projects/algo-trading.jpg",
      technologies: [
        "Python",
        "FastAPI",
        "WebSockets",
        "PostgreSQL",
        "Redis",
        "Docker",
        "DigitalOcean",
        "Broker APIs",
      ],
      highlights: [
        "Live order execution on self-managed DigitalOcean server",
        "Open Interest analysis & option chain snapshot strategies",
        "Positional trading logic with stop-loss/target management",
        "Broker API integrations with retry handling & logging",
        "Live monitoring & scalable architecture for concurrent strategies",
      ],
      links: {
        // github: "https://github.com/Eshwar066/algo-trading",
      } as ProjectLinks,
      featured: true,
    },
    {
      id: "ncd-ipo-platform",
      title: "NCD-IPO & IPO Platform (MFE)",
      type: "Professional",
      category: "Fintech",
      description:
        "Two Micro-Frontend applications (NCD-IPO, IPO Platform) built with Module Federation + Vite enabling independent deployment. End-to-end IPO investment journeys for CXO, RM, Partner, Client segments.",
      longDescription:
        "Enterprise investment platform featuring product bouquet, orderbook, transaction flows. Reusable component architecture with shadcn/ui & Tailwind. Server-state management with TanStack Query. Module Federation for team autonomy.",
      image: "/projects/ncd-ipo-platform.jpg",
      technologies: [
        "React",
        "TypeScript",
        "Vite",
        "Module Federation",
        "Micro-Frontend",
        "TanStack Query",
        "shadcn/ui",
        "Tailwind CSS",
      ],
      highlights: [
        "Module Federation + Vite for independent MFE deployments",
        "End-to-end IPO journeys: bouquet → orderbook → transactions",
        "Reusable component library adopted across both apps",
        "TanStack Query for cache-first server state",
        "Segment-specific UX: CXO, RM, Partner, Client",
      ],
      links: {
        // caseStudy: "/case-studies/ncd-ipo-platform",
      } as ProjectLinks,
      featured: true,
    },
    {
      id: "naukri-automation",
      title: "Naukri Job Automation",
      type: "Personal",
      category: "AI/GenAI",
      description:
        "Desktop automation tool for Naukri job search and applications using Playwright, Flask + pywebview, with LLM-powered form filling (Gemini/Ollama).",
      longDescription:
        "Automated job application system that searches Naukri by role/location/date, auto-fills application forms using resume data and QA cache, and leverages Gemini or local Ollama LLMs for free-text/numeric questions. Desktop UI built with Flask + pywebview.",
      image: "/projects/naukri-automation.jpg",
      technologies: [
        "Python",
        "Playwright",
        "Flask",
        "pywebview",
        "Gemini API",
        "Ollama",
        "Docker",
        "JSON/Config-driven",
      ],
      highlights: [
        "Automated job search with role, location, date filters",
        "LLM-powered form filling (Gemini + local Ollama support)",
        "Resume profile extraction & QA caching for repeat questions",
        "Desktop UI with Flask + pywebview (Config, Env, Logs tabs)",
        "Docker Compose for local LLM inference",
      ],
      links: {
        // github: "https://github.com/Eshwar066/Jobs/tree/f01b0439c0fabb8c5cd164080a364ef43c4ee5a6/Naukri",
      } as ProjectLinks,
      featured: true,
    },
    {
      id: "linkedin-automation",
      title: "LinkedIn Easy Apply Automation",
      type: "Personal",
      category: "AI/GenAI",
      description:
        "Desktop automation tool for LinkedIn job search and Easy Apply using Playwright, Flask + pywebview, with LLM-powered form filling (Gemini/Ollama).",
      longDescription:
        "Automated LinkedIn Easy Apply system that searches jobs by role/location with Easy Apply filter, auto-fills forms using resume data and QA cache, and leverages Gemini or local Ollama LLMs for free-text/numeric questions. Desktop UI built with Flask + pywebview.",
      image: "/projects/linkedin-automation.jpg",
      technologies: [
        "Python",
        "Playwright",
        "Flask",
        "pywebview",
        "Gemini API",
        "Ollama",
        "Docker",
        "JSON/Config-driven",
      ],
      highlights: [
        "Automated LinkedIn job search with Easy Apply filter",
        "LLM-powered form filling (Gemini + local Ollama support)",
        "Resume profile extraction & QA caching for repeat questions",
        "Desktop UI with Flask + pywebview (Config, Env, Logs tabs)",
        "Docker Compose for local LLM inference",
        "Session caching via linkedin_state.json",
      ],
      links: {
        // github: "https://github.com/Eshwar066/Jobs",
      } as ProjectLinks,
      featured: true,
    },
  ],

  skills: {
    frontend: [
      { name: "React", level: 95, category: "Core" },
      { name: "TypeScript", level: 95, category: "Core" },
      { name: "Next.js", level: 90, category: "Framework" },
      { name: "React Native", level: 70, category: "Mobile" },
      { name: "Redux Toolkit", level: 90, category: "State" },
      { name: "Zustand", level: 90, category: "State" },
      { name: "Context API", level: 85, category: "State" },
      { name: "TanStack Query", level: 90, category: "Data Fetching" },
      { name: "Tailwind CSS", level: 90, category: "Styling" },
      { name: "shadcn/ui", level: 85, category: "UI Library" },
      { name: "SCSS / Styled Components", level: 80, category: "Styling" },
      { name: "MUI / Bootstrap", level: 75, category: "UI Library" },
      { name: "Vite", level: 90, category: "Build" },
      { name: "Webpack 5 / Module Federation", level: 85, category: "Architecture" },
      { name: "GitHub Actions", level: 80, category: "CI/CD" },
    ],
    backend: [
      { name: "Java", level: 65, category: "Language (Learning)" },
      { name: "Spring Boot", level: 60, category: "Framework (Learning)" },
      { name: "Python", level: 80, category: "Language" },
      { name: "FastAPI", level: 85, category: "Framework" },
      { name: "PostgreSQL", level: 85, category: "Database" },
      { name: "Redis", level: 80, category: "Cache/Queue" },
      { name: "REST APIs", level: 90, category: "API" },
      { name: "WebSockets", level: 85, category: "Real-time" },
      { name: "Docker", level: 75, category: "DevOps" },
      { name: "GitHub Actions", level: 80, category: "CI/CD" },
    ],
    ai: [
      { name: "LLMs (OpenAI, Anthropic, Local)", level: 80, category: "Models" },
      { name: "RAG / Vector Databases", level: 80, category: "Retrieval" },
      { name: "LangChain / LlamaIndex", level: 75, category: "Framework" },
      { name: "LangGraph / Agent Frameworks", level: 70, category: "Agents" },
      { name: "Prompt Engineering / Eval", level: 75, category: "Ops" },
      { name: "Fine-tuning / LoRA", level: 60, category: "Training" },
    ],
    fintech: [
      { name: "Equity Markets / Order Management", level: 90, category: "Domain" },
      { name: "Fixed Income (NCDs, Bonds)", level: 85, category: "Domain" },
      { name: "IPO / Primary Markets", level: 90, category: "Domain" },
      { name: "Regulatory (SEBI, RBI)", level: 80, category: "Compliance" },
      { name: "Real-time Market Data / WebSockets", level: 90, category: "Data" },
      { name: "Micro-Frontend / Module Federation", level: 85, category: "Architecture" },
    ],
  },

  certifications: [
    {
      name: "Bachelor of Engineering",
      issuer: "Bangalore Institute of Technology (VTU)",
      year: 2023,
      details: "CGPA 8.1 / 10.0",
    },
  ],

  education: {
    degree: "Bachelor of Engineering",
    field: "Mechanical Engineering",
    institution: "Bangalore Institute of Technology (VTU)",
    year: 2023,
    cgpa: "8.1 / 10.0",
  },

  openTo: [
    "React / Next.js Frontend",
    "React Native Mobile",
    "Java / Spring Boot Backend",
    "Forward Deployed Engineer (FDE)",
    "Full-Stack roles",
  ],
};

export type PortfolioData = typeof portfolioData;