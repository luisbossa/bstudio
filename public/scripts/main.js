// Live preview inside the dashboard: no real form posts.
const isPreview = document.documentElement.hasAttribute("data-preview");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/*----------------- MOBILE MENU ----------------*/

const initMobileMenu = () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const setOpen = (isOpen) => {
    menu.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", isOpen);
  };

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
};

/*----------------- HEADER: SHADOW, PROGRESS BAR, ACTIVE LINK ----------------*/

const initScrollState = () => {
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-progress-bar");
  let ticking = false;

  const update = () => {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? scrollTop / max : 0})`;
    header.classList.toggle("is-scrolled", scrollTop > 40);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) requestAnimationFrame(update);
      ticking = true;
    },
    { passive: true }
  );
  update();
};

// A link is active only while its section crosses a line at 35% of the
// viewport, so nothing is highlighted on the intro or on sections not in the menu.
const initActiveNav = () => {
  const links = document.querySelectorAll(".site-nav__link, .mobile-menu__link");
  const sections = [...new Set([...links].map((link) => link.getAttribute("href")))]
    .map((href) => (href.startsWith("#") ? document.querySelector(href) : null))
    .filter(Boolean);
  let ticking = false;

  const update = () => {
    const line = window.innerHeight * 0.35;
    const current = sections.find((section) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= line && bottom > line;
    });
    const href = current ? `#${current.id}` : null;
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === href));
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) requestAnimationFrame(update);
      ticking = true;
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
};

/*----------------- REVEAL ON SCROLL ----------------*/

// Each [data-reveal] element animates in once, the first time it enters the
// screen. Children of [data-reveal-stagger] reveal one after another.
const initReveal = () => {
  const root = document.documentElement;
  if (!root.classList.contains("reveal-ready")) return;
  window.__revealStarted = true;

  document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    [...group.children].forEach((child, index) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
      child.dataset.revealDelay = String(Math.min(index, 6) * 110);
    });
  });

  const elements = document.querySelectorAll("[data-reveal]");

  elements.forEach((el) => {
    if (el.dataset.revealDelay) el.style.setProperty("--reveal-delay", `${el.dataset.revealDelay}ms`);
  });

  // When the entrance ends, drop the reveal styles so the element is back to normal.
  const finish = (el) => {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-revealed");
    el.style.removeProperty("--reveal-delay");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        el.addEventListener("transitionend", function onEnd(event) {
          if (event.target !== el || event.propertyName !== "opacity") return;
          el.removeEventListener("transitionend", onEnd);
          finish(el);
        });
        el.classList.add("is-revealed");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((el) => observer.observe(el));
};

/*----------------- PROJECT VIDEOS ----------------*/

// Desktop: play on hover/focus. Touch screens: play while on screen.
const initProjectVideos = () => {
  const canHover = window.matchMedia("(hover: hover)").matches;

  document.querySelectorAll(".browser-frame").forEach((frame) => {
    const video = frame.querySelector("video");
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
      frame.classList.add("is-playing");
    };

    const pause = () => {
      video.pause();
      frame.classList.remove("is-playing");
    };

    if (canHover) {
      frame.addEventListener("mouseenter", play);
      frame.addEventListener("mouseleave", pause);
      frame.addEventListener("focus", play);
      frame.addEventListener("blur", pause);
    } else if (!prefersReducedMotion) {
      new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : pause()),
        { threshold: 0.6 }
      ).observe(frame);
    }
  });
};

/*----------------- CONTACT FORM ----------------*/

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  const submit = document.getElementById("contact-submit");
  if (!form || !submit) return;

  form.addEventListener("submit", (e) => {
    if (isPreview) {
      e.preventDefault();
      return;
    }
    submit.classList.add("is-loading");
    submit.querySelector(".btn__label").textContent = "Sending...";
  });
};

initMobileMenu();
initScrollState();
initActiveNav();
initReveal();
initProjectVideos();
initContactForm();
