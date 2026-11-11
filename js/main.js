/**
 * Parshuram Das Portfolio — Interactive UI & Accessibility Controller
 * Zero external runtime dependencies; works on both HTTP servers and file://.
 */
(function () {
  "use strict";

  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  const STORAGE_THEME_KEY = "parshuram-portfolio-theme";
  const VALID_ROLES = new Set(["all", "frontend", "product", "analyst"]);

  const state = {
    activeRole: "all",
    contactRoleTouched: false,
    toastTimer: null,
  };

  /* ------------------------------------------------------------------------
     DOM Helpers
     ------------------------------------------------------------------------ */
  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fallback below if clipboard permission is blocked
      }
    }
    try {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(helper);
      return ok;
    } catch (_) {
      return false;
    }
  }

  function showToast(message) {
    const toast = qs("#toast-banner");
    const toastText = qs("#toast-message");
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     Theme Management (Dark / Light + System Synchronization)
     ------------------------------------------------------------------------ */
  function applyTheme(theme, persist = false) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";

    if (persist) {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, theme);
      } catch (_) {
        // Ignore storage restrictions
      }
    }

    qsa("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      const sunIcon = qs("[data-icon-sun]", btn);
      const moonIcon = qs("[data-icon-moon]", btn);
      if (sunIcon) sunIcon.classList.toggle("hidden", !isDark);
      if (moonIcon) moonIcon.classList.toggle("hidden", isDark);
    });
  }

  function initTheme() {
    const initialIsDark = document.documentElement.classList.contains("dark");
    applyTheme(initialIsDark ? "dark" : "light", false);

    qsa("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextTheme = document.documentElement.classList.contains("dark")
          ? "light"
          : "dark";
        applyTheme(nextTheme, true);
      });
    });

    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", (event) => {
        try {
          if (localStorage.getItem(STORAGE_THEME_KEY)) return;
        } catch (_) {
          return;
        }
        applyTheme(event.matches ? "dark" : "light", false);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Role Switcher & Synchronized Work Showcase
     ------------------------------------------------------------------------ */
  function updateHeroForRole(roleKey) {
    const role = DATA.roles[roleKey] || DATA.roles.all;

    const eyebrow = qs("#hero-eyebrow");
    const headlineLead = qs("#hero-headline-lead");
    const headlineAccent = qs("#hero-headline-accent");
    const summary = qs("#hero-summary");
    const tagsContainer = qs("#hero-focus-tags");
    const snapshotTitle = qs("#snapshot-title");
    const snapshotList = qs("#snapshot-metrics");

    if (eyebrow) eyebrow.textContent = role.eyebrow;
    if (headlineLead) headlineLead.textContent = role.headlineLead;
    if (headlineAccent) headlineAccent.textContent = role.headlineAccent;
    if (summary) summary.textContent = role.summary;
    if (snapshotTitle) snapshotTitle.textContent = role.snapshotTitle;

    if (tagsContainer) {
      tagsContainer.replaceChildren(
        ...role.focusTags.map((tag) =>
          el(
            "span",
            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-mono-code border border-[var(--border-hairline)] bg-[var(--surface-card)] text-[var(--ink-secondary)]",
            tag
          )
        )
      );
    }

    if (snapshotList) {
      snapshotList.replaceChildren(
        ...role.snapshotMetrics.map((item) => {
          const card = el(
            "div",
            "p-3.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-canvas)] transition-colors"
          );
          const top = el("div", "flex items-center justify-between gap-2 mb-1");
          top.appendChild(
            el(
              "span",
              "text-xs font-mono-code uppercase tracking-wider text-[var(--ink-secondary)]",
              item.label
            )
          );
          card.appendChild(top);
          card.appendChild(
            el(
              "div",
              "text-sm xs:text-base font-semibold text-[var(--ink-primary)]",
              item.value
            )
          );
          card.appendChild(
            el("p", "text-xs text-[var(--ink-secondary)] mt-0.5", item.detail)
          );
          return card;
        })
      );
    }
  }

  function createProjectCard(project) {
    const article = el(
      "article",
      "project-card-shell group flex flex-col justify-between rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-5 bp425:p-6 transition-all duration-200 hover:border-blue-500/45 dark:hover:border-blue-400/45 hover:-translate-y-0.5 hover:shadow-lg"
    );

    const topGroup = el("div");

    // Card header (container-query responsive)
    const header = el(
      "div",
      "project-card-header flex flex-col items-start gap-2 mb-4"
    );

    const badgesWrap = el("div", "flex flex-wrap gap-1.5");
    project.trackLabels.forEach((label) => {
      badgesWrap.appendChild(
        el(
          "span",
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60",
          label
        )
      );
    });
    header.appendChild(badgesWrap);

    header.appendChild(
      el(
        "span",
        "text-[11px] font-mono-code uppercase tracking-wider text-[var(--ink-secondary)] shrink-0",
        project.year
      )
    );
    topGroup.appendChild(header);

    // Title & subtitle
    const title = el(
      "h3",
      "text-lg bp425:text-xl font-bold tracking-tight text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors",
      project.title
    );
    const subtitle = el(
      "p",
      "text-xs xs:text-sm font-medium text-[var(--accent-primary)] mt-1",
      project.subtitle
    );
    const summary = el(
      "p",
      "text-sm text-[var(--ink-secondary)] leading-relaxed mt-3",
      project.summary
    );

    topGroup.appendChild(title);
    topGroup.appendChild(subtitle);
    topGroup.appendChild(summary);

    // Stack tags
    const stackWrap = el("div", "flex flex-wrap gap-1.5 mt-4");
    project.stack.forEach((tech) => {
      stackWrap.appendChild(
        el(
          "span",
          "px-2 py-0.5 rounded-md text-xs font-mono-code bg-[var(--surface-subtle)] text-[var(--ink-secondary)] border border-[var(--border-hairline)]",
          tech
        )
      );
    });
    topGroup.appendChild(stackWrap);
    article.appendChild(topGroup);

    // Action footer
    const footer = el(
      "div",
      "mt-6 pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3"
    );

    const detailsBtn = el(
      "button",
      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs xs:text-sm font-semibold bg-[var(--ink-primary)] text-[var(--surface-canvas)] hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
      "Case Study"
    );
    detailsBtn.type = "button";
    detailsBtn.addEventListener("click", () => openProjectModal(project));
    footer.appendChild(detailsBtn);

    const linkGroup = el("div", "flex items-center gap-3");
    if (project.liveUrl) {
      const liveLink = el(
        "a",
        "text-xs xs:text-sm font-medium text-[var(--accent-primary)] hover:underline",
        "Live Preview"
      );
      liveLink.href = project.liveUrl;
      linkGroup.appendChild(liveLink);
    }

    if (project.repoUrl) {
      const repoLink = el(
        "a",
        "inline-flex items-center gap-1 text-xs xs:text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors",
        project.isDirectRepo ? "GitHub Repo ↗" : "GitHub ↗"
      );
      repoLink.href = project.repoUrl;
      repoLink.target = "_blank";
      repoLink.rel = "noopener noreferrer";
      repoLink.title = project.repoLabel || "View on GitHub";
      linkGroup.appendChild(repoLink);
    }
    footer.appendChild(linkGroup);
    article.appendChild(footer);

    return article;
  }

  function renderProjects(roleKey) {
    const grid = qs("#projects-grid");
    const countLabel = qs("#projects-count");
    if (!grid) return;

    const filtered =
      roleKey === "all"
        ? DATA.projects
        : DATA.projects.filter((item) => item.tracks.includes(roleKey));

    grid.replaceChildren(...filtered.map(createProjectCard));

    if (countLabel) {
      const total = DATA.projects.length;
      const shown = filtered.length;
      countLabel.textContent =
        shown === total
          ? `Showing all ${total} projects`
          : `Showing ${shown} of ${total} matching projects`;
    }
  }

  function updateAboutHighlights(roleKey) {
    qsa("[data-pillar-track]").forEach((card) => {
      const track = card.getAttribute("data-pillar-track");
      const isMatch = roleKey !== "all" && track === roleKey;
      card.classList.toggle("pillar-highlighted", isMatch);
    });
  }

  function syncRoleControls(roleKey) {
    qsa("[data-role-btn]").forEach((btn) => {
      const isActive = btn.getAttribute("data-role-btn") === roleKey;
      btn.setAttribute("aria-pressed", String(isActive));
      if (btn.getAttribute("role") === "tab") {
        btn.setAttribute("aria-selected", String(isActive));
      }
    });
  }

  function syncContactRoleSelect(roleKey) {
    if (state.contactRoleTouched) return;
    const select = qs("#contact-role");
    if (!select) return;
    const roleMap = {
      frontend: "Frontend Developer",
      product: "Product Manager",
      analyst: "Business / Data Analyst",
      all: "General / Multi-Role Opportunity",
    };
    select.value = roleMap[roleKey] || roleMap.all;
  }

  function setActiveRole(roleKey) {
    const normalized = VALID_ROLES.has(roleKey) ? roleKey : "all";
    state.activeRole = normalized;
    syncRoleControls(normalized);
    updateHeroForRole(normalized);
    renderProjects(normalized);
    updateAboutHighlights(normalized);
    syncContactRoleSelect(normalized);
  }

  function initRoleSystem() {
    qsa("[data-role-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role-btn");
        setActiveRole(role);
      });
    });

    setActiveRole("all");
  }

  /* ------------------------------------------------------------------------
     Native <dialog> Support (Case Study Modal + Mobile Drawer)
     ------------------------------------------------------------------------ */
  function attachDialogDismiss(dialog) {
    if (!dialog) return;
    // Fallback for browsers without native closedby="any" light-dismiss
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  function openProjectModal(project) {
    const dialog = qs("#project-dialog");
    if (!dialog) return;

    const title = qs("#modal-project-title", dialog);
    const subtitle = qs("#modal-project-subtitle", dialog);
    const badges = qs("#modal-project-badges", dialog);
    const objective = qs("#modal-project-objective", dialog);
    const approach = qs("#modal-project-approach", dialog);
    const deliverables = qs("#modal-project-deliverables", dialog);
    const stack = qs("#modal-project-stack", dialog);
    const repoLink = qs("#modal-project-repo", dialog);
    const repoNote = qs("#modal-project-repo-note", dialog);

    if (title) title.textContent = project.title;
    if (subtitle) subtitle.textContent = project.subtitle;
    if (objective) objective.textContent = project.caseStudy.objective;

    if (badges) {
      badges.replaceChildren(
        ...project.trackLabels.map((lbl) =>
          el(
            "span",
            "px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60",
            lbl
          )
        )
      );
    }

    if (approach) {
      approach.replaceChildren(
        ...project.caseStudy.approach.map((step) =>
          el("li", "text-sm text-[var(--ink-secondary)] leading-relaxed", step)
        )
      );
    }

    if (deliverables) {
      deliverables.replaceChildren(
        ...project.caseStudy.deliverables.map((item) =>
          el("li", "text-sm text-[var(--ink-secondary)] leading-relaxed", item)
        )
      );
    }

    if (stack) {
      stack.replaceChildren(
        ...project.stack.map((tech) =>
          el(
            "span",
            "px-2.5 py-1 rounded-md text-xs font-mono-code bg-[var(--surface-subtle)] text-[var(--ink-primary)] border border-[var(--border-hairline)]",
            tech
          )
        )
      );
    }

    if (repoLink) {
      repoLink.href = project.repoUrl || DATA.profile.github;
      repoLink.textContent = project.isDirectRepo
        ? "Open Repository ↗"
        : "Open GitHub Profile ↗";
    }

    if (repoNote) {
      repoNote.classList.toggle("hidden", Boolean(project.isDirectRepo));
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function initDialogs() {
    const projectDialog = qs("#project-dialog");
    const projectCloseBtn = qs("#modal-close-btn");
    attachDialogDismiss(projectDialog);
    if (projectCloseBtn && projectDialog) {
      projectCloseBtn.addEventListener("click", () => projectDialog.close());
    }

    const drawer = qs("#mobile-drawer");
    const openDrawerBtn = qs("#mobile-menu-open");
    const closeDrawerBtn = qs("#mobile-menu-close");
    attachDialogDismiss(drawer);

    if (openDrawerBtn && drawer) {
      openDrawerBtn.addEventListener("click", () => {
        if (typeof drawer.showModal === "function") {
          drawer.showModal();
        } else {
          drawer.setAttribute("open", "");
        }
      });
    }

    if (closeDrawerBtn && drawer) {
      closeDrawerBtn.addEventListener("click", () => drawer.close());
    }

    if (drawer) {
      qsa("a[href^='#']", drawer).forEach((link) => {
        link.addEventListener("click", () => {
          drawer.close();
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     About Section Static Data Hydration
     ------------------------------------------------------------------------ */
  function renderAboutSections() {
    const pillarsGrid = qs("#about-pillars-grid");
    if (pillarsGrid) {
      pillarsGrid.replaceChildren(
        ...DATA.pillars.map((pillar) => {
          const card = el(
            "article",
            "rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-5 bp425:p-6 transition-all"
          );
          card.setAttribute("data-pillar-track", pillar.track);

          card.appendChild(
            el(
              "span",
              "inline-block text-xs font-mono-code font-medium text-[var(--accent-primary)] mb-2",
              pillar.badge
            )
          );
          card.appendChild(
            el(
              "h3",
              "text-lg font-bold text-[var(--ink-primary)] mb-2",
              pillar.title
            )
          );
          card.appendChild(
            el(
              "p",
              "text-sm text-[var(--ink-secondary)] leading-relaxed mb-4",
              pillar.description
            )
          );

          const skillsWrap = el("div", "flex flex-wrap gap-1.5");
          pillar.skills.forEach((skill) => {
            skillsWrap.appendChild(
              el(
                "span",
                "px-2.5 py-1 rounded-md text-xs font-mono-code bg-[var(--surface-subtle)] text-[var(--ink-secondary)] border border-[var(--border-hairline)]",
                skill
              )
            );
          });
          card.appendChild(skillsWrap);
          return card;
        })
      );
    }

    const workflowList = qs("#workflow-steps");
    if (workflowList) {
      workflowList.replaceChildren(
        ...DATA.workflow.map((item) => {
          const card = el(
            "div",
            "rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-4"
          );
          card.appendChild(
            el(
              "span",
              "text-xs font-mono-code font-semibold text-[var(--accent-primary)]",
              `STEP ${item.step}`
            )
          );
          card.appendChild(
            el(
              "h4",
              "text-sm xs:text-base font-bold text-[var(--ink-primary)] mt-1",
              item.title
            )
          );
          card.appendChild(
            el(
              "p",
              "text-xs xs:text-sm text-[var(--ink-secondary)] mt-1 leading-relaxed",
              item.detail
            )
          );
          return card;
        })
      );
    }
  }

  /* ------------------------------------------------------------------------
     Scrollspy, Scroll Progress Fallback & Back-to-Top
     ------------------------------------------------------------------------ */
  function setActiveNavLink(sectionId) {
    qsa(".nav-link").forEach((link) => {
      const target = link.getAttribute("href");
      if (target === `#${sectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initScrollSpy() {
    const sections = qsa("main section[id]");
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      setActiveNavLink("home");
      return;
    }

    const visibleRatios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibleRatios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveNavLink(bestId);
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    setActiveNavLink("home");
  }

  function initScrollHelpers() {
    const backToTop = qs("#back-to-top");
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("animation-timeline: scroll()");

    function onScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (backToTop) {
        const show = scrollY > 480;
        backToTop.classList.toggle("opacity-0", !show);
        backToTop.classList.toggle("pointer-events-none", !show);
        backToTop.classList.toggle("translate-y-2", !show);
      }

      if (!supportsScrollTimeline) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
        document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ------------------------------------------------------------------------
     Accessible Contact Form & Copy Email Utilities
     ------------------------------------------------------------------------ */
  function validateField(field) {
    const errorEl = qs(`#${field.id}-error`);
    const valid = field.checkValidity();

    field.setAttribute("aria-invalid", String(!valid));
    if (errorEl) {
      if (valid) {
        errorEl.textContent = "";
        errorEl.classList.add("hidden");
      } else {
        if (field.validity.valueMissing) {
          errorEl.textContent = "This field is required.";
        } else if (field.validity.typeMismatch && field.type === "email") {
          errorEl.textContent = "Please enter a valid email address (e.g. name@company.com).";
        } else if (field.validity.tooShort) {
          errorEl.textContent = `Please enter at least ${field.minLength} characters.`;
        } else {
          errorEl.textContent = field.validationMessage || "Please check this field.";
        }
        errorEl.classList.remove("hidden");
      }
    }
    return valid;
  }

  function initContactForm() {
    const form = qs("#contact-form");
    if (!form) return;

    const roleSelect = qs("#contact-role");
    if (roleSelect) {
      roleSelect.addEventListener("change", () => {
        state.contactRoleTouched = true;
      });
    }

    const validatedFields = qsa("input[required], textarea[required]", form);
    validatedFields.forEach((field) => {
      let hasBlurred = false;
      field.addEventListener("blur", () => {
        hasBlurred = true;
        validateField(field);
      });
      field.addEventListener("input", () => {
        if (hasBlurred || field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    const resultBox = qs("#form-result");
    const mailtoAnchor = qs("#form-mailto-link");
    const copyDraftBtn = qs("#form-copy-draft");
    const formLiveStatus = qs("#form-live-status");

    let latestFormattedDraft = "";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let allValid = true;
      let firstInvalid = null;

      validatedFields.forEach((field) => {
        const ok = validateField(field);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        if (formLiveStatus) {
          formLiveStatus.textContent = "Please fix the highlighted form fields before continuing.";
        }
        return;
      }

      const nameVal = qs("#contact-name", form).value.trim();
      const emailVal = qs("#contact-email", form).value.trim();
      const roleVal = roleSelect ? roleSelect.value : "Opportunity";
      const msgVal = qs("#contact-message", form).value.trim();

      const subject = `[Portfolio Inquiry — ${roleVal}] from ${nameVal}`;
      const body = `Hi Parshuram,\n\nName: ${nameVal}\nReply Email: ${emailVal}\nInquiry / Role: ${roleVal}\n\nMessage:\n${msgVal}\n`;

      latestFormattedDraft = `To: ${DATA.profile.email}\nSubject: ${subject}\n\n${body}`;

      if (mailtoAnchor) {
        mailtoAnchor.href = `mailto:${DATA.profile.email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
      }

      if (resultBox) {
        resultBox.classList.remove("hidden");
      }

      if (formLiveStatus) {
        formLiveStatus.textContent =
          "Message draft is ready. Open your email client or copy the message below.";
      }

      showToast("Inquiry ready — open your email app or copy draft.");
    });

    if (copyDraftBtn) {
      copyDraftBtn.addEventListener("click", async () => {
        if (!latestFormattedDraft) return;
        const ok = await copyText(latestFormattedDraft);
        showToast(ok ? "Draft copied to clipboard." : "Could not copy automatically.");
      });
    }
  }

  function initCopyButtons() {
    qsa("[data-copy-email]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const ok = await copyText(DATA.profile.email);
        showToast(
          ok
            ? `Copied ${DATA.profile.email} to clipboard`
            : `Email: ${DATA.profile.email}`
        );
      });
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    initTheme();
    renderAboutSections();
    initRoleSystem();
    initDialogs();
    initScrollSpy();
    initScrollHelpers();
    initContactForm();
    initCopyButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
