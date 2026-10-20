// Live preview inside the dashboard: no entrance animations, no real form posts.
const isPreview = document.documentElement.hasAttribute("data-preview");

// Enables the reveal-on-scroll styles. Set here (not in the HTML) so content
// stays visible if this script fails to load.
if (!isPreview) document.documentElement.classList.add("reveal-ready");

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

  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
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

const initActiveNav = () => {
  const links = document.querySelectorAll(".site-nav__link, .mobile-menu__link");
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const href = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === href);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  new Set(sections).forEach((section) => observer.observe(section));
};

/*----------------- REVEAL ON SCROLL ----------------*/

const initReveal = () => {
  const elements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
