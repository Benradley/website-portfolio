/* ================================================================
   PORTFOLIO — MAIN JAVASCRIPT
   ================================================================
   HOW TO ADD A PROJECT:
   Copy one of the objects inside the `projects` array below,
   paste it at the end of the array, and fill in your own details.
   That's all — the card will appear on the page automatically.

   FIELDS:
     title       — name of the project (required)
     description — 1–2 sentence summary (required)
     tags        — array of tech/language strings (required)
     github      — URL to your GitHub repo (use "" to hide link)
     demo        — URL to a live demo (use "" to hide link)
     demoKey     — instead of a hardcoded demo URL, name a key from
                   assets/config.json (e.g. "droneDemo"). The startup
                   script writes the live tunnel URL there automatically.
                   Use either demo or demoKey, not both.
     video       — URL to a video demo, e.g. a YouTube link (use "" to hide link)
     image       — path to a screenshot in assets/images/ (use "" for no image)
   ================================================================ */

const projects = [

  /* ---- PROJECT 1 ---- */
  {
    title:       "University Capstone; CVLAD Visualizer",
    description: "A GUI for the NRC's autonomous helicopter project",
    tags:        ["Python", "OpenGl", "PyQt6"],
    github:      "https://github.com/Raneem02/SYSC4907-Project",
    demo:        "https://youtu.be/Zj2UhPZFbIE",                         // leave empty string "" if no live demo
    image:       "",                         // e.g. "assets/images/project1.png"
  },

  /* ---- PROJECT 2 ---- */
  {
    title:       "This Website",
    description: "I built this website with the help of claude code do display my portfolio and contact info",
    tags:        ["JavaScript", "HTML", "CSS", "AI Development", "AWS"],
    github:      "",
    demo:        "",
    image:       "",
  },

  /* ---- PROJECT 3 ---- */
  {
    title:       "Quadcopter Flight Analyser",
    description: "A tool for parsing flight data from five different drone manufacturers, display flight data and suggest flight improvements, Built with Claude",
    tags:        ["AI Development", "HTML", "CSS", "JavaScript", "Java", "AWS"],
    github:      "https://github.com/benradley/claude-project-1",
    demo:        "https://drone.brsoftware.ca",
    demoKey:     "droneDemo",   // URL loaded automatically from assets/config.json
    video:       "https://youtu.be/s-LnM9LZEU0",
    image:       "",
  },

  /* ---- ADD MORE PROJECTS BELOW THIS LINE ----
  {
    title:       "Your Next Project",
    description: "Description here.",
    tags:        ["Tag1", "Tag2"],
    github:      "https://github.com/yourusername/your-repo",
    demo:        "",
    image:       "",
  },
  ------------------------------------------- */

];


/* ================================================================
   VISIT BEACON
   Sends a silent POST to the server-side logger when the page loads.
   Fails quietly — if the endpoint is unavailable it has no effect.
   ================================================================ */
function logVisit() {
  fetch("/api/log-visit", {
    method:    "POST",
    keepalive: true,   // sends even if the user navigates away immediately
  }).catch(function() {
    // Silently ignore — analytics should never break the page
  });
}


/* ================================================================
   DYNAMIC CONFIG LOADER
   Fetches assets/config.json at page load so demo URLs can be updated
   by the startup script without touching this file.
   ================================================================ */
let siteConfig = {};

async function loadConfig() {
  try {
    const response = await fetch("assets/config.json");
    siteConfig = await response.json();
  } catch (e) {
    // config.json missing or unreachable — demo links simply won't appear
    siteConfig = {};
  }
}


/* ================================================================
   PROJECT CARD RENDERER
   Builds the HTML for each project card and injects it into the grid.
   You do NOT need to edit this function.
   ================================================================ */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = projects.map(function(project, index) {

    // Build the screenshot img tag (only if an image path is provided)
    const imageHTML = project.image
      ? `<img class="project-image" src="${project.image}" alt="${project.title} screenshot" loading="lazy" />`
      : "";

    // Build the tech tag badges
    const tagsHTML = project.tags
      .map(function(tag) { return `<span class="tag">${tag}</span>`; })
      .join("");

    // Resolve demo URL — use demoKey to look up from config.json, or fall back to demo field
    const demoUrl = project.demoKey ? (siteConfig[project.demoKey] || "") : (project.demo || "");

    // Build GitHub and demo links (only shown when a URL is provided)
    let linksHTML = "";
    if (project.github) {
      linksHTML += `
        <a href="${project.github}" target="_blank" rel="noopener">
          <!-- GitHub icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755
              -1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
              1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466
              -1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176
              0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
              2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23
              1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
              0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295
              24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>`;
    }
    if (demoUrl) {
      linksHTML += `
        <a href="${demoUrl}" target="_blank" rel="noopener">
          <!-- External link icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Live Demo
        </a>`;
    }
    if (project.video) {
      linksHTML += `
        <a href="${project.video}" target="_blank" rel="noopener">
          <!-- Play icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
          </svg>
          Video Demo
        </a>`;
    }

    // Assemble the full card (index + 1 gives a human-readable project number)
    const num = String(index + 1).padStart(2, "0");
    return `
      <article class="project-card fade-in">
        ${imageHTML}
        <span class="project-number">Project ${num}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${tagsHTML}</div>
        ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ""}
      </article>
    `;
  }).join("");
}


/* ================================================================
   SKILLS RENDERER
   Collects every tag from the projects array, removes duplicates,
   and injects them into the Skills & Technologies section.
   Adding a tag to any project card will automatically appear here.
   ================================================================ */
function renderSkills() {
  const container = document.getElementById("skillTags");
  if (!container) return;

  // Flatten all tags from every project and remove duplicates
  const unique = [...new Set(projects.flatMap(function(p) { return p.tags; }))];

  container.innerHTML = unique
    .map(function(tag) { return `<span class="tag">${tag}</span>`; })
    .join("");
}


/* ================================================================
   MOBILE NAVIGATION TOGGLE
   Opens and closes the nav menu on small screens.
   ================================================================ */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function() {
    links.classList.toggle("open");
  });

  // Close the menu when a link is clicked
  links.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
      links.classList.remove("open");
    });
  });
}


/* ================================================================
   ACTIVE NAV LINK HIGHLIGHT
   Adds an "active" class to the nav link for the visible section.
   ================================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", function() {
    let currentSection = "";

    sections.forEach(function(section) {
      const top = section.offsetTop - 80; // 80px offset for the sticky nav height
      if (window.scrollY >= top) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  });
}


/* ================================================================
   FADE-IN ANIMATION
   Elements with the "fade-in" class animate in when scrolled into view.
   The CSS for .fade-in and .fade-in.visible lives in styles.css.
   ================================================================ */
function initFadeIn() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate once, then stop watching
      }
    });
  }, { threshold: 0.1 });

  // Fade in section containers and about block
  // Project cards already have fade-in added in renderProjects()
  document.querySelectorAll(".section-container, .about-content").forEach(function(el) {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Also observe project cards (rendered after DOMContentLoaded)
  document.querySelectorAll(".project-card").forEach(function(el) {
    observer.observe(el);
  });
}


/* ================================================================
   NAV SCROLL EFFECT
   Adds a "scrolled" class to the navbar when the user scrolls down,
   which triggers a deeper shadow in CSS.
   ================================================================ */
function initNavScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", function() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}


/* ================================================================
   SCROLL-TO-TOP BUTTON
   Shows a floating button after scrolling 400px down.
   ================================================================ */
function initScrollToTop() {
  const btn = document.getElementById("scrollToTop");
  if (!btn) return;

  window.addEventListener("scroll", function() {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ================================================================
   INIT — runs everything when the page has loaded
   ================================================================ */
document.addEventListener("DOMContentLoaded", async function() {
  await loadConfig();  // fetch config.json before rendering so demo URLs are ready
  renderProjects();    // build project cards from the array above
  renderSkills();      // populate Skills & Technologies from project tags
  logVisit();          // silent background beacon — logs this visit server-side
  initMobileNav();     // wire up the hamburger menu
  initScrollSpy();     // highlight the active nav link on scroll
  initFadeIn();        // fade sections in as they scroll into view
  initNavScroll();     // deepen nav shadow on scroll
  initScrollToTop();   // floating back-to-top button
});
