/**
 * Portfolio Data Configuration — Parshuram Das
 * ---------------------------------------------------------------------------
 * Edit this file to update personal details, role focus copy, skills, or
 * add direct GitHub repository URLs as you publish new work.
 */
window.PORTFOLIO_DATA = {
  profile: {
    name: "Parshuram Das",
    initials: "PD",
    status: "Immediate Joiner",
    location: "Mumbai, Maharashtra · Remote",
    education: "Fresh Post-Graduate",
    email: "dasparshu74@gmail.com",
    linkedin: "https://www.linkedin.com/in/parshuram-das-416358268",
    github: "https://github.com/Parshuram-Das",
    traits: ["Analytical Thinker", "Detail-Oriented", "Quick Learner"],
  },

  roles: {
    all: {
      id: "all",
      label: "All Tracks",
      shortLabel: "All",
      eyebrow: "Frontend · SaaS Product · Data Analytics",
      headlineLead: "I build responsive web interfaces,",
      headlineAccent: "shape SaaS products & validate data.",
      summary:
        "Fresh post-graduate based in Mumbai (open to remote & immediate joining). I combine mobile-first frontend engineering, SaaS lifecycle product thinking from build to production, and hands-on data cleaning & validation with Excel, Python, and SQL.",
      focusTags: [
        "HTML5 & CSS3",
        "Tailwind CSS",
        "Vanilla JS",
        "SaaS Lifecycle",
        "Python",
        "SQL",
        "Excel",
      ],
      snapshotTitle: "Cross-Functional Snapshot",
      snapshotMetrics: [
        { label: "UI Craft", value: "320px → 3000px", detail: "Mobile-first responsive architecture" },
        { label: "Product Scope", value: "Dev → Prod", detail: "End-to-end SaaS delivery mindset" },
        { label: "Data Rigor", value: "Excel · Python · SQL", detail: "Cleaning, validation & analysis" },
      ],
    },
    frontend: {
      id: "frontend",
      label: "Frontend Developer",
      shortLabel: "Frontend",
      eyebrow: "Frontend Developer Track",
      headlineLead: "Mobile-first interfaces engineered from",
      headlineAccent: "320px screens to 3000px displays.",
      summary:
        "I craft clean, accessible, zero-bloat web applications using semantic HTML, Tailwind CSS, and Vanilla JavaScript—prioritizing crisp mobile usability, fast loading, and resilient responsive layouts across every viewport.",
      focusTags: [
        "Semantic HTML5",
        "Tailwind CSS",
        "Vanilla JavaScript",
        "Mobile-First (320px+)",
        "Accessible UI",
        "Responsive Systems",
      ],
      snapshotTitle: "Frontend Focus",
      snapshotMetrics: [
        { label: "Core Stack", value: "HTML · Tailwind · JS", detail: "Zero heavy framework overhead" },
        { label: "Viewport Range", value: "320px – 3000px", detail: "Fluid grids & container queries" },
        { label: "Quality Bar", value: "A11y & Speed", detail: "Keyboard-safe dialogs & clean DOM" },
      ],
    },
    product: {
      id: "product",
      label: "Product Manager",
      shortLabel: "Product",
      eyebrow: "Product Manager Track",
      headlineLead: "Guiding SaaS products cleanly from",
      headlineAccent: "early development to production.",
      summary:
        "I approach software through a SaaS product lens—translating user problems into clear scope, collaborating across development and QA validation, and shipping reliable releases into production with measurable data checkpoints.",
      focusTags: [
        "SaaS Product Lifecycle",
        "Build-to-Prod Delivery",
        "User Flows & Scope",
        "Data-Backed Decisions",
        "QA & Validation",
        "Cross-Functional Execution",
      ],
      snapshotTitle: "Product Ownership Focus",
      snapshotMetrics: [
        { label: "Lifecycle", value: "Spec → Prod", detail: "Concept, build, QA & release tracking" },
        { label: "Decision Lens", value: "User + Data", detail: "Grounded in churn & usage signals" },
        { label: "Execution Style", value: "Detail-First", detail: "Clear acceptance & validation checks" },
      ],
    },
    analyst: {
      id: "analyst",
      label: "Business / Data Analyst",
      shortLabel: "Analyst",
      eyebrow: "Business & Data Analyst Track",
      headlineLead: "Turning raw, messy datasets into",
      headlineAccent: "validated, decision-ready insights.",
      summary:
        "I bring hands-on experience cleaning, normalizing, and validating datasets with Excel, Python, and SQL—ensuring data integrity first so business and product teams can trust every dashboard, churn metric, and classification output.",
      focusTags: [
        "SQL Querying",
        "Python (Data Cleaning)",
        "Microsoft Excel",
        "Data Validation",
        "Churn Analysis",
        "Insight Reporting",
      ],
      snapshotTitle: "Analytics & Validation Focus",
      snapshotMetrics: [
        { label: "Primary Toolkit", value: "Excel · Python · SQL", detail: "End-to-end wrangling & QA" },
        { label: "Core Strength", value: "Data Hygiene", detail: "Null, duplicate & schema validation" },
        { label: "Applied Work", value: "Churn & NLP", detail: "Retention insights & spam detection" },
      ],
    },
  },

  /**
   * Projects Showcase
   * -------------------------------------------------------------------------
   * TIP: Once you push or grab a specific repository URL, replace `repoUrl`
   * below (e.g. "https://github.com/Parshuram-Das/customer-churn-analysis")
   * and set `isDirectRepo: true`.
   */
  projects: [
    {
      id: "customer-churn-analysis",
      title: "Customer Churn Analysis",
      subtitle: "Data Cleaning, Validation & Retention Insights",
      tracks: ["analyst", "product"],
      trackLabels: ["Data Analysis", "Product Strategy"],
      year: "Featured Project",
      summary:
        "Analyzed customer behavior datasets to pinpoint churn drivers—performing systematic data cleaning and validation across Excel, Python, and SQL before translating findings into practical SaaS retention recommendations.",
      stack: ["Python", "SQL", "Excel", "Data Validation", "EDA"],
      repoUrl: "https://github.com/Parshuram-Das",
      isDirectRepo: false,
      repoLabel: "View on GitHub Profile (Repo link updating)",
      liveUrl: "",
      caseStudy: {
        objective:
          "Identify early warning patterns behind customer attrition in subscription-style cohorts while ensuring every metric was backed by thoroughly validated records.",
        approach: [
          "Audited raw customer tables for missing values, inconsistent date/category formatting, and duplicate records using Excel and Python.",
          "Wrote SQL validation queries to cross-check cohort counts, tenure buckets, and service usage segments.",
          "Segmented churned vs. retained profiles to frame actionable product retention hypotheses for onboarding and high-risk segments.",
        ],
        deliverables: [
          "Cleaned, audit-ready customer cohort dataset",
          "SQL & Python exploratory analysis scripts",
          "Churn risk breakdown & product retention takeaways",
        ],
      },
    },
    {
      id: "spam-email-detector",
      title: "Spam Email Detector",
      subtitle: "Text Preprocessing, Validation & Classification Pipeline",
      tracks: ["analyst", "product"],
      trackLabels: ["Data & ML Workflow", "Product Thinking"],
      year: "Featured Project",
      summary:
        "Built an automated email classification pipeline focused on cleaning unstructured text data, validating label integrity, and balancing precision vs. recall to avoid blocking legitimate user emails.",
      stack: ["Python", "Text Cleaning", "Data Validation", "Classification"],
      repoUrl: "https://github.com/Parshuram-Das",
      isDirectRepo: false,
      repoLabel: "View on GitHub Profile (Repo link updating)",
      liveUrl: "",
      caseStudy: {
        objective:
          "Reliably filter unwanted spam messages while minimizing false positives on important user communication.",
        approach: [
          "Cleaned raw email text inputs—normalizing casing, punctuation, noisy tokens, and duplicate entries in Python.",
          "Validated train/test split balance and verified label consistency prior to model training and evaluation.",
          "Evaluated false-positive vs. false-negative trade-offs from a product trust standpoint to guide threshold selection.",
        ],
        deliverables: [
          "Reusable Python text preprocessing & validation pipeline",
          "Trained spam classification workflow with evaluation metrics",
          "Threshold & error-analysis notes for real-world inbox deployment",
        ],
      },
    },
    {
      id: "responsive-portfolio-architecture",
      title: "Multi-Track Portfolio & SaaS Showcase",
      subtitle: "Mobile-First Architecture (320px–3000px)",
      tracks: ["frontend", "product"],
      trackLabels: ["Frontend Engineering", "Product Design"],
      year: "Live Build",
      summary:
        "Designed and engineered a fast, zero-dependency portfolio web app using semantic HTML5, Tailwind CSS, and Vanilla JS—featuring a multi-role explorer, light/dark system theming, accessible modals, and fluid scaling from 320px to 3000px.",
      stack: ["HTML5", "Tailwind CSS", "Vanilla JS", "Responsive UI", "A11y"],
      repoUrl: "https://github.com/Parshuram-Das",
      isDirectRepo: false,
      repoLabel: "GitHub Profile",
      liveUrl: "#home",
      caseStudy: {
        objective:
          "Present three complementary career capabilities—Frontend, Product Management, and Data Analysis—in one cohesive, fast-loading interface without overwhelming recruiters.",
        approach: [
          "Designed a role-switcher architecture that adapts headline positioning, skills, and project filtering in place.",
          "Built mobile-first CSS breakpoints and container queries verified across 320px, 375px, 425px, 1024px, 1440px, and ultrawide 3000px viewports.",
          "Implemented native HTML `<dialog>` drawers/modals, keyboard focus handling, and non-premature form validation.",
        ],
        deliverables: [
          "Modular static web architecture (`index.html`, `css/styles.css`, `js/data.js`, `js/main.js`)",
          "Data-driven project & role configuration for effortless updates",
          "Production-ready static deployment footprint",
        ],
      },
    },
  ],

  /**
   * Copy/Paste Template for Adding Another Project:
   * {
   *   id: "saas-dashboard-ui",
   *   title: "Project Title",
   *   subtitle: "Short Subtitle",
   *   tracks: ["frontend", "product"], // any combination of "frontend", "product", "analyst"
   *   trackLabels: ["Frontend", "SaaS Product"],
   *   year: "2026",
   *   summary: "1-2 sentence summary of what you built and validated.",
   *   stack: ["HTML", "Tailwind CSS", "Vanilla JS"],
   *   repoUrl: "https://github.com/Parshuram-Das/your-repo-name",
   *   isDirectRepo: true,
   *   repoLabel: "View Repository",
   *   liveUrl: "",
   *   caseStudy: {
   *     objective: "What problem did this solve?",
   *     approach: ["Step 1...", "Step 2...", "Step 3..."],
   *     deliverables: ["Deliverable 1", "Deliverable 2"]
   *   }
   * }
   */

  pillars: [
    {
      track: "frontend",
      badge: "01 / Frontend Developer",
      title: "Mobile-First Web Interfaces",
      description:
        "Translating product ideas into crisp, responsive interfaces using HTML, CSS, Tailwind CSS, and Vanilla JS—carefully tested from compact 320px phones up to 3000px ultrawide monitors.",
      skills: ["HTML5", "CSS3", "Tailwind CSS", "Vanilla JS", "Responsive Design", "Semantic A11y"],
    },
    {
      track: "product",
      badge: "02 / Product Manager",
      title: "SaaS Lifecycle Ownership",
      description:
        "Treating every build as a SaaS product: structuring user flows, coordinating requirements through development, running validation checks, and seeing releases safely into production.",
      skills: ["SaaS Product Mindset", "Spec to Prod", "User Flows", "QA & Release Checks", "Prioritization", "Cross-Team Clarity"],
    },
    {
      track: "analyst",
      badge: "03 / Business & Data Analyst",
      title: "Data Cleaning & Validation",
      description:
        "Hands-on experience auditing raw datasets, resolving inconsistencies, and validating metrics across Excel, Python, and SQL to power reliable business and product decisions.",
      skills: ["SQL", "Python", "Microsoft Excel", "Data Cleaning", "Schema Validation", "Churn & Metric Analysis"],
    },
  ],

  workflow: [
    {
      step: "01",
      title: "Clean & Validate",
      detail: "Audit inputs in Excel, Python & SQL before drawing conclusions.",
    },
    {
      step: "02",
      title: "Define SaaS Scope",
      detail: "Clarify user needs, edge cases, and release priorities.",
    },
    {
      step: "03",
      title: "Build Mobile-First",
      detail: "Craft responsive HTML, Tailwind & Vanilla JS starting at 320px.",
    },
    {
      step: "04",
      title: "Ship to Production",
      detail: "Verify cross-viewport behavior, accessibility & post-launch quality.",
    },
  ],
};

