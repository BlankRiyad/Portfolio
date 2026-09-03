/* =================================================================
   MD. RIYAD HASAN — Portfolio
   Vanilla JS: navigation, smooth scroll, reveal animations,
   certificate modal/lightbox, back-to-top, active link tracking.
   ================================================================= */
(function () {
  "use strict";

  /* ---------- Lucide icons ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
  renderIcons();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }
  function toggleMenu() {
    if (!navLinks || !hamburger) return;
    var isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", toggleMenu);
    // Close when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Navbar scrolled state ---------- */
  var navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  // Native CSS scroll-behavior handles this, but we add a manual fallback
  // for older browsers and to close the mobile menu.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = navbar ? navbar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link via scroll spy ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a[href^='#']")
  );
  function spy() {
    var pos = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 40;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (s.offsetTop <= pos) current = s.id;
    }
    navAnchors.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", match);
    });
  }
  spy();
  window.addEventListener("scroll", spy, { passive: true });

  /* ---------- Certificate Modal / Lightbox ---------- */
  var modal = document.getElementById("certModal");
  var modalTitle = document.getElementById("modalTitle");
  var modalOrg = document.getElementById("modalOrg");
  var modalYear = document.getElementById("modalYear");
  var modalDesc = document.getElementById("modalDesc");
  var modalViewer = document.getElementById("modalViewer");
  var lastFocused = null;

  function isPdf(src) {
    return /\.pdf(\?|$)/i.test(src);
  }

  function openModal(card) {
    if (!modal) return;
    lastFocused = document.activeElement;
    var title = card.getAttribute("data-cert-title") || "Certificate";
    var org = card.getAttribute("data-cert-org") || "—";
    var year = card.getAttribute("data-cert-year") || "—";
    var desc = card.getAttribute("data-cert-desc") || "";
    var file = card.getAttribute("data-cert-file") || "";

    // Decode HTML entities that may exist in the data attributes
    var txt = document.createElement("textarea");
    function decode(str) { txt.innerHTML = str; return txt.value; }

    modalTitle.textContent = decode(title);
    modalOrg.textContent = decode(org);
    modalYear.textContent = decode(year);
    modalDesc.textContent = decode(desc);

    // Build viewer content
    modalViewer.innerHTML = "";
    if (file) {
      if (isPdf(file)) {
        var iframe = document.createElement("iframe");
        iframe.src = file + "#toolbar=1&view=FitH";
        iframe.title = decode(title) + " — certificate PDF";
        iframe.setAttribute("loading", "lazy");
        modalViewer.appendChild(iframe);
      } else {
        var img = document.createElement("img");
        img.src = file;
        img.alt = decode(title) + " — certificate image";
        img.setAttribute("loading", "lazy");
        modalViewer.appendChild(img);
      }
    } else {
      modalViewer.innerHTML =
        '<div class="viewer-empty"><i data-lucide="image"></i><p>No file attached yet.</p></div>';
      renderIcons();
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // Focus close button for accessibility
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 30);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalViewer.innerHTML = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Attach click handlers to cert cards
  document.querySelectorAll(".cert-card").forEach(function (card) {
    card.addEventListener("click", function () { openModal(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Close handlers
  if (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  function onScrollTop() {
    if (!toTop) return;
    if (window.scrollY > 600) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Re-render icons after dynamic content ---------- */
  // Ensure icons inside dynamically built viewer show up.
  // (renderIcons already ran once at top; this is a safety net.)
  window.addEventListener("load", renderIcons);

  /* =================================================================
     ROUND 2 — NEW FEATURES
     ================================================================= */

  /* ---------- Page preloader ---------- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 700);
  }
  window.addEventListener("load", function () { setTimeout(hidePreloader, 350); });
  // Safety: never let the preloader block the page longer than 2.5s
  setTimeout(hidePreloader, 2500);

  /* ---------- Reading progress bar ---------- */
  var progressFill = document.getElementById("progressFill");
  function updateProgress() {
    if (!progressFill) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressFill.style.width = Math.min(pct, 100) + "%";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  /* ---------- Floating dot nav (desktop) ---------- */
  var dotNav = document.getElementById("dotNav");
  var navSectionIds = ["hero", "about", "experience", "education", "skills", "projects", "certifications", "references", "contact"];
  var navLabels = {
    hero: "Home", about: "About", experience: "Experience", education: "Education",
    skills: "Skills", projects: "Projects", certifications: "Certifications",
    references: "References", contact: "Contact"
  };
  if (dotNav) {
    navSectionIds.forEach(function (id) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot-item";
      dot.setAttribute("data-target", id);
      dot.setAttribute("data-label", navLabels[id] || id);
      dot.setAttribute("aria-label", "Jump to " + (navLabels[id] || id));
      dot.addEventListener("click", function () {
        var target = document.getElementById(id);
        if (!target) return;
        var navH = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
      dotNav.appendChild(dot);
    });
    // Show dot nav only on wide screens after slight scroll
    function toggleDotNav() {
      if (window.innerWidth >= 1024 && window.scrollY > 300) dotNav.classList.add("visible");
      else dotNav.classList.remove("visible");
    }
    toggleDotNav();
    window.addEventListener("scroll", toggleDotNav, { passive: true });
    window.addEventListener("resize", toggleDotNav, { passive: true });
  }

  // Sync dot-nav active state with scroll spy (extend existing spy)
  var dotItems = dotNav ? Array.prototype.slice.call(dotNav.querySelectorAll(".dot-item")) : [];

  // Persistent active-section label (shows current section name next to dot-nav)
  var dotLabel = null;
  if (dotNav) {
    dotLabel = document.createElement("span");
    dotLabel.className = "dot-nav-label";
    dotLabel.setAttribute("aria-hidden", "true");
    dotNav.appendChild(dotLabel);
  }

  function syncDots(currentId) {
    dotItems.forEach(function (d) {
      d.classList.toggle("active", d.getAttribute("data-target") === currentId);
    });
    if (dotLabel && currentId) {
      dotLabel.textContent = navLabels[currentId] || currentId;
      dotLabel.classList.add("show");
    }
  }
  // Patch into the existing scroll spy by observing active nav link changes
  if (navAnchors.length && dotItems.length) {
    var spyObserver = new MutationObserver(function () {
      var active = document.querySelector(".nav-links a.active");
      if (active) {
        var id = active.getAttribute("href").replace("#", "");
        syncDots(id);
      }
    });
    navAnchors.forEach(function (a) {
      spyObserver.observe(a, { attributes: true, attributeFilter: ["class"] });
    });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll(".stat-num");
  function animateStat(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (el.dataset.counted === "1") return;
    el.dataset.counted = "1";
    var duration = 1400;
    var start = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { el.textContent = target.toLocaleString() + suffix; return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (stats.length && "IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (s) { statIO.observe(s); });
  } else {
    stats.forEach(function (s) { animateStat(s); });
  }

  /* ---------- Project filter ---------- */
  var projectsGrid = document.getElementById("projectsGrid");
  var filterBar = document.getElementById("projectFilters");
  var filterStatus = document.getElementById("filterStatus");

  if (projectsGrid && filterBar) {
    var projectCards = Array.prototype.slice.call(projectsGrid.querySelectorAll(".project-card"));
    // Collect all unique tags
    var tagSet = [];
    projectCards.forEach(function (card) {
      card.querySelectorAll(".tag").forEach(function (t) {
        var name = t.textContent.trim();
        if (tagSet.indexOf(name) === -1) tagSet.push(name);
      });
    });

    // "All" chip
    var allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "filter-chip active";
    allChip.textContent = "All";
    allChip.setAttribute("data-filter", "all");
    filterBar.appendChild(allChip);

    tagSet.forEach(function (tag) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip";
      chip.textContent = tag;
      chip.setAttribute("data-filter", tag);
      filterBar.appendChild(chip);
    });

    function applyFilter(filter) {
      var visibleCount = 0;
      projectCards.forEach(function (card) {
        var tags = Array.prototype.map.call(card.querySelectorAll(".tag"), function (t) { return t.textContent.trim(); });
        var match = (filter === "all" || tags.indexOf(filter) !== -1);
        if (match) {
          card.classList.remove("is-hidden");
          card.classList.remove("filter-match");
          // re-trigger animation
          void card.offsetWidth;
          card.classList.add("filter-match");
          visibleCount++;
        } else {
          card.classList.add("is-hidden");
        }
      });
      if (filterStatus) {
        if (filter === "all") {
          filterStatus.textContent = "Showing all " + visibleCount + " projects";
        } else {
          filterStatus.textContent = "Showing " + visibleCount + " project" + (visibleCount === 1 ? "" : "s") + " tagged \"" + filter + "\"";
        }
      }
    }

    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (!chip) return;
      filterBar.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      applyFilter(chip.getAttribute("data-filter"));
    });

    // initial status
    if (filterStatus) filterStatus.textContent = "Showing all " + projectCards.length + " projects";
  }

  /* ---------- Copy to clipboard + toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = '<i data-lucide="check-circle-2"></i><span>' + message + "</span>";
    renderIcons();
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (err) { reject(err); }
    });
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      if (!text) return;
      copyText(text).then(function () {
        btn.classList.add("copied");
        var icon = btn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "check");
          renderIcons();
        }
        showToast("Copied: " + text);
        setTimeout(function () {
          btn.classList.remove("copied");
          if (icon) {
            icon.setAttribute("data-lucide", "copy");
            renderIcons();
          }
        }, 1600);
      }).catch(function () {
        showToast("Could not copy — please copy manually.");
      });
    });
  });

  /* ---------- Footer back-to-top button ---------- */
  var footerTopBtn = document.getElementById("footerTopBtn");
  if (footerTopBtn) {
    footerTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Keyboard shortcut: press "t" for top, "/" focuses first nav ---------- */
  document.addEventListener("keydown", function (e) {
    // Ignore when typing in inputs
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "t" || e.key === "T") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  /* ---------- Tilt effect on project cards (subtle, pointer-fine only) ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    projectCardsTilt();
  }
  function projectCardsTilt() {
    var cards = document.querySelectorAll(".project-card:not(.featured)");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-6px) perspective(800px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 4) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* =================================================================
     ROUND 3 — NEW FEATURES
     ================================================================= */

  /* ---------- Warm-tint theme toggle ---------- */
  var tintToggle = document.getElementById("tintToggle");
  function currentTint() { return document.documentElement.getAttribute("data-tint") === "parchment" ? "parchment" : "cream"; }
  function applyTint(tint) {
    if (tint === "parchment") document.documentElement.setAttribute("data-tint", "parchment");
    else document.documentElement.removeAttribute("data-tint");
    try { localStorage.setItem("rh-tint", tint); } catch (e) {}
    if (tintToggle) {
      tintToggle.setAttribute("aria-pressed", tint === "parchment" ? "true" : "false");
      var icon = tintToggle.querySelector("i");
      if (icon) icon.setAttribute("data-lucide", tint === "parchment" ? "sun" : "palette");
      renderIcons();
    }
    showToast(tint === "parchment" ? "Parchment tint enabled" : "Cream tint enabled");
  }
  if (tintToggle) {
    tintToggle.setAttribute("aria-pressed", currentTint() === "parchment" ? "true" : "false");
    tintToggle.addEventListener("click", function () {
      applyTint(currentTint() === "parchment" ? "cream" : "parchment");
    });
  }

  /* ---------- Project thumbnail zoom on hover (CSS-driven, just needs the class) ---------- */
  // Already handled in CSS via .project-thumb img / i transitions.

  /* ---------- Keyboard shortcut: "f" focuses the project filter, "c" scrolls to contact ---------- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "f" || e.key === "F") {
      var projects = document.getElementById("projects");
      if (projects) {
        var navH = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({ top: projects.offsetTop - navH - 12, behavior: "smooth" });
        var firstChip = document.querySelector(".filter-chip");
        if (firstChip) setTimeout(function () { firstChip.focus(); }, 600);
      }
    }
    if (e.key === "c" || e.key === "C") {
      var contact = document.getElementById("contact");
      if (contact) {
        var navH2 = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({ top: contact.offsetTop - navH2 - 12, behavior: "smooth" });
      }
    }
  });

  /* =================================================================
     ROUND 4 — NEW FEATURES
     ================================================================= */

  /* ---------- Hero kinetic typography (split name into letters) ---------- */
  var kineticEl = document.querySelector("[data-kinetic]");
  if (kineticEl) {
    var text = kineticEl.textContent;
    var html = "";
    var delay = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " ") {
        html += '<span class="kin-space"></span>';
      } else {
        html += '<span class="kin-letter" style="animation-delay:' + delay + 'ms">' + ch + "</span>";
        delay += 45;
      }
    }
    kineticEl.innerHTML = html;
    // Ensure the name is still accessible as plain text for screen readers
    kineticEl.setAttribute("aria-label", text);
  }

  /* ---------- Back-to-top scroll-progress ring ---------- */
  var ringFill = document.querySelector(".to-top-ring .ring-fill");
  var ringCircumference = 138.23; // 2 * PI * 22
  function updateRing() {
    if (!ringFill) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? scrolled / max : 0;
    var offset = ringCircumference * (1 - pct);
    ringFill.style.strokeDashoffset = Math.max(0, offset);
  }
  updateRing();
  window.addEventListener("scroll", updateRing, { passive: true });
  window.addEventListener("resize", updateRing, { passive: true });

  /* ---------- Magnetic hover on back-to-top (pointer-fine only) ---------- */
  var toTopBtn = document.getElementById("toTop");
  if (toTopBtn && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    toTopBtn.addEventListener("mousemove", function (e) {
      var r = toTopBtn.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = (e.clientX - cx) / r.width;
      var dy = (e.clientY - cy) / r.height;
      toTopBtn.style.transform = "translate(" + dx * 8 + "px, " + dy * 8 + "px)";
    });
    toTopBtn.addEventListener("mouseleave", function () {
      toTopBtn.style.transform = "";
    });
  }

  /* ---------- Scroll-driven section number reveal ---------- */
  var revealSections = document.querySelectorAll("section[data-num]");
  if ("IntersectionObserver" in window && revealSections.length) {
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40% 0px" });
    revealSections.forEach(function (s) { sectionIO.observe(s); });
  } else {
    revealSections.forEach(function (s) { s.classList.add("in-view"); });
  }

  /* ---------- Footer "last updated" — auto-format from datetime attr ---------- */
  var lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    try {
      var dt = lastUpdated.getAttribute("datetime");
      if (dt) {
        var d = new Date(dt);
        if (!isNaN(d.getTime())) {
          var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          lastUpdated.textContent = months[d.getMonth()] + " " + d.getFullYear();
        }
      }
    } catch (e) {}
  }

  /* =================================================================
     ROUND 6 — NEW FEATURES
     ================================================================= */

  /* ---------- Keyboard shortcut hints overlay ---------- */
  var kbdHintBtn = document.getElementById("kbdHintBtn");
  var kbdOverlay = document.getElementById("kbdOverlay");
  function openKbd() {
    if (!kbdOverlay) return;
    kbdOverlay.classList.add("open");
    kbdOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = kbdOverlay.querySelector(".kbd-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 30);
  }
  function closeKbd() {
    if (!kbdOverlay) return;
    kbdOverlay.classList.remove("open");
    kbdOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (kbdHintBtn) kbdHintBtn.focus();
  }
  if (kbdHintBtn) {
    // Show button after slight scroll
    function toggleKbdHintBtn() {
      if (window.scrollY > 300) kbdHintBtn.classList.add("show");
      else kbdHintBtn.classList.remove("show");
    }
    toggleKbdHintBtn();
    window.addEventListener("scroll", toggleKbdHintBtn, { passive: true });
    kbdHintBtn.addEventListener("click", openKbd);
  }
  if (kbdOverlay) {
    kbdOverlay.querySelectorAll("[data-kbd-close]").forEach(function (el) {
      el.addEventListener("click", closeKbd);
    });
  }

  // "?" toggles the panel; Escape closes (in addition to existing Escape handlers)
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      if (kbdOverlay && kbdOverlay.classList.contains("open")) closeKbd();
      else openKbd();
    }
    if (e.key === "Escape" && kbdOverlay && kbdOverlay.classList.contains("open")) {
      closeKbd();
    }
  });

  /* ---------- Certificate modal confetti ---------- */
  var confettiCanvas = document.getElementById("confettiCanvas");
  var confettiReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function launchConfetti() {
    if (!confettiCanvas || confettiReduceMotion) return;
    var ctx = confettiCanvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    function sizeCanvas() {
      confettiCanvas.width = window.innerWidth * dpr;
      confettiCanvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();

    var colors = ["#C4A484", "#A88B6A", "#F5EDE3", "#FFFFFF", "#6B5E54"];
    var particles = [];
    var count = 70;
    var originX = window.innerWidth / 2;
    var originY = window.innerHeight / 2;

    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      var speed = 4 + Math.random() * 5;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1
      });
    }

    var frame = 0;
    var maxFrames = 90;
    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      frame++;
      var alive = false;
      particles.forEach(function (p) {
        p.vy += 0.15; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - frame / maxFrames);
        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive && frame < maxFrames + 20) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }
    requestAnimationFrame(tick);
  }

  // Hook into the existing modal open — patch openModal
  if (typeof window.__origOpenModal === "undefined" && modal) {
    // Wrap the existing openModal by observing class changes on the modal
    var modalObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === "class") {
          if (modal.classList.contains("open")) {
            launchConfetti();
          }
        }
      });
    });
    modalObserver.observe(modal, { attributes: true });
  }

  window.addEventListener("resize", function () {
    if (confettiCanvas) {
      var dpr = window.devicePixelRatio || 1;
      confettiCanvas.width = window.innerWidth * dpr;
      confettiCanvas.height = window.innerHeight * dpr;
    }
  });

  /* =================================================================
     ROUND 7 — NEW FEATURES
     ================================================================= */

  /* ---------- Project share + favorite buttons ---------- */
  // Build a set of project titles for share text + favorite keys
  var allProjectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));

  function copyTextPromise(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  // Favorites persistence
  function getFavs() {
    try { return JSON.parse(localStorage.getItem("rh-favs") || "[]"); } catch (e) { return []; }
  }
  function setFavs(arr) {
    try { localStorage.setItem("rh-favs", JSON.stringify(arr)); } catch (e) {}
  }
  function projectKey(card) {
    var h3 = card.querySelector("h3");
    return h3 ? h3.textContent.trim() : "project";
  }

  allProjectCards.forEach(function (card, idx) {
    var title = projectKey(card);
    var favBtn = card.querySelector(".project-fav-btn");
    var shareBtn = card.querySelector(".project-share-btn");

    // Restore favorite state
    if (favBtn) {
      var favs = getFavs();
      if (favs.indexOf(title) !== -1) {
        favBtn.classList.add("is-fav");
        favBtn.setAttribute("aria-pressed", "true");
        card.classList.add("is-fav");
      }
      favBtn.addEventListener("click", function () {
        var current = getFavs();
        var isFav = current.indexOf(title) !== -1;
        if (isFav) {
          current = current.filter(function (t) { return t !== title; });
          favBtn.classList.remove("is-fav");
          card.classList.remove("is-fav");
          favBtn.setAttribute("aria-pressed", "false");
          showToast("Removed from bookmarks");
        } else {
          current.push(title);
          favBtn.classList.add("is-fav");
          card.classList.add("is-fav");
          favBtn.setAttribute("aria-pressed", "true");
          showToast("Bookmarked: " + title);
        }
        setFavs(current);
        // swap icon
        var icon = favBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", isFav ? "bookmark" : "bookmark-check");
          renderIcons();
        }
      });
    }

    // Share button
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var url = window.location.href.split("#")[0] + "#projects";
        var shareData = {
          title: title + " — MD. RIYAD HASAN",
          text: "Check out this project: " + title,
          url: url
        };
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
        } else {
          copyTextPromise(shareData.url).then(function () {
            showToast("Project link copied");
          }).catch(function () { showToast("Could not copy link"); });
        }
      });
    }
  });

  /* ---------- Command palette (Cmd/Ctrl+K) ---------- */
  var cmdPalette = document.getElementById("commandPalette");
  var cmdInput = document.getElementById("cmdInput");
  var cmdList = document.getElementById("cmdList");
  var cmdTriggerHint = document.getElementById("cmdTriggerHint");

  // Build command list
  var cmdCommands = [
    { type: "section", title: "About", desc: "Professional summary", icon: "user", target: "about", kbd: null },
    { type: "section", title: "Experience", desc: "Employment timeline", icon: "briefcase", target: "experience", kbd: null },
    { type: "section", title: "Education", desc: "Academic journey", icon: "graduation-cap", target: "education", kbd: null },
    { type: "section", title: "Skills", desc: "Technical, languages, research", icon: "code-2", target: "skills", kbd: null },
    { type: "section", title: "Projects", desc: "Selected work", icon: "folder", target: "projects", kbd: "F" },
    { type: "section", title: "Certifications", desc: "Professional development", icon: "award", target: "certifications", kbd: null },
    { type: "section", title: "References", desc: "Endorsements", icon: "users", target: "references", kbd: null },
    { type: "section", title: "Contact", desc: "Get in touch", icon: "mail", target: "contact", kbd: "C" },
    { type: "action", title: "View CV (PDF)", desc: "Open the resume viewer", icon: "file-text", href: "cv.html", kbd: null },
    { type: "action", title: "Scroll to top", desc: "Back to top of page", icon: "arrow-up", action: "top", kbd: "T" },
    { type: "action", title: "Toggle background tint", desc: "Cream ↔ parchment", icon: "palette", action: "tint", kbd: null },
    { type: "action", title: "Keyboard shortcuts", desc: "Show all shortcuts", icon: "keyboard", action: "kbd", kbd: "?" }
  ];

  var cmdActiveIndex = 0;
  var cmdFiltered = cmdCommands.slice();

  function renderCmdList() {
    cmdList.innerHTML = "";
    if (!cmdFiltered.length) {
      var empty = document.createElement("li");
      empty.className = "cmd-item empty";
      empty.textContent = "No matching commands";
      cmdList.appendChild(empty);
      return;
    }
    cmdFiltered.forEach(function (cmd, i) {
      var li = document.createElement("li");
      li.className = "cmd-item" + (i === cmdActiveIndex ? " active" : "");
      li.setAttribute("role", "option");
      li.setAttribute("data-index", i);
      li.innerHTML =
        '<span class="cmd-item-icon"><i data-lucide="' + cmd.icon + '"></i></span>' +
        '<span class="cmd-item-text"><span class="cmd-item-title">' + cmd.title + '</span><span class="cmd-item-desc">' + cmd.desc + '</span></span>' +
        (cmd.kbd ? '<span class="cmd-item-kbd"><kbd>' + cmd.kbd + '</kbd></span>' : '');
      li.addEventListener("click", function () { executeCmd(cmd); });
      li.addEventListener("mouseenter", function () {
        cmdActiveIndex = i;
        updateCmdActive();
      });
      cmdList.appendChild(li);
    });
    renderIcons();
  }

  function updateCmdActive() {
    var items = cmdList.querySelectorAll(".cmd-item");
    items.forEach(function (el, i) { el.classList.toggle("active", i === cmdActiveIndex); });
  }

  function filterCmd(q) {
    q = (q || "").toLowerCase().trim();
    if (!q) { cmdFiltered = cmdCommands.slice(); }
    else {
      cmdFiltered = cmdCommands.filter(function (c) {
        return (c.title + " " + c.desc).toLowerCase().indexOf(q) !== -1;
      });
    }
    cmdActiveIndex = 0;
    renderCmdList();
  }

  function executeCmd(cmd) {
    closeCmd();
    if (!cmd) return;
    setTimeout(function () {
      if (cmd.type === "section") {
        var target = document.getElementById(cmd.target);
        if (target) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
        }
      } else if (cmd.type === "action") {
        if (cmd.action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (cmd.action === "tint") { if (tintToggle) tintToggle.click(); }
        else if (cmd.action === "kbd") { if (kbdHintBtn) kbdHintBtn.click(); else openKbd(); }
        else if (cmd.href) window.location.href = cmd.href;
      }
    }, 80);
  }

  function openCmd() {
    if (!cmdPalette) return;
    cmdPalette.classList.add("open");
    cmdPalette.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cmdFiltered = cmdCommands.slice();
    cmdActiveIndex = 0;
    renderCmdList();
    setTimeout(function () { if (cmdInput) { cmdInput.value = ""; cmdInput.focus(); } }, 30);
  }
  function closeCmd() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("open");
    cmdPalette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (cmdTriggerHint) cmdTriggerHint.addEventListener("click", openCmd);
  if (cmdPalette) {
    cmdPalette.querySelectorAll("[data-cmd-close]").forEach(function (el) {
      el.addEventListener("click", closeCmd);
    });
  }
  if (cmdInput) {
    cmdInput.addEventListener("input", function () { filterCmd(cmdInput.value); });
    cmdInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdActiveIndex = Math.min(cmdActiveIndex + 1, cmdFiltered.length - 1);
        updateCmdActive();
        scrollCmdIntoView();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdActiveIndex = Math.max(cmdActiveIndex - 1, 0);
        updateCmdActive();
        scrollCmdIntoView();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (cmdFiltered[cmdActiveIndex]) executeCmd(cmdFiltered[cmdActiveIndex]);
      }
    });
  }
  function scrollCmdIntoView() {
    var active = cmdList.querySelector(".cmd-item.active");
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  // Global Cmd/Ctrl+K to open, Escape to close
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains("open")) closeCmd();
      else openCmd();
    }
    if (e.key === "Escape" && cmdPalette && cmdPalette.classList.contains("open")) {
      closeCmd();
    }
  });

  /* ---------- Developer easter egg ---------- */
  var easterEgg = document.getElementById("easterEgg");
  var eeTriggered = false;
  function openEasterEgg() {
    if (!easterEgg || eeTriggered) return;
    eeTriggered = true;
    easterEgg.classList.add("open");
    easterEgg.setAttribute("aria-hidden", "false");
    // Compute live stats
    try {
      var html = document.documentElement.outerHTML;
      var lines = html.split("\n").length;
      var kb = Math.round(new Blob([html]).size / 1024);
      var eeLoc = document.getElementById("eeLoc");
      var eeKb = document.getElementById("eeKb");
      if (eeLoc) eeLoc.textContent = lines.toLocaleString();
      if (eeKb) eeKb.textContent = kb + " KB";
    } catch (e) {}
    document.body.style.overflow = "hidden";
  }
  function closeEasterEgg() {
    if (!easterEgg) return;
    easterEgg.classList.remove("open");
    easterEgg.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (easterEgg) {
    easterEgg.querySelectorAll("[data-ee-close]").forEach(function (el) {
      el.addEventListener("click", closeEasterEgg);
    });
  }
  // Trigger: devtools keystroke (Ctrl+Shift+I) OR typing "dev" anywhere
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
      setTimeout(openEasterEgg, 400);
    }
  });
  // Konami-style: type "dev"
  var devBuffer = "";
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key.length === 1) {
      devBuffer = (devBuffer + e.key).slice(-3);
      if (devBuffer.toLowerCase() === "dev") openEasterEgg();
    }
  });

  /* =================================================================
     ROUND 8 — NEW FEATURES
     ================================================================= */

  /* ---------- Copy section link + share section buttons (generated per section) ---------- */
  var sectionHeadings = document.querySelectorAll("main section[id] .section-head");
  sectionHeadings.forEach(function (head) {
    var section = head.closest("section[id]");
    if (!section) return;
    var id = section.id;

    // Create an actions wrapper for both buttons
    var actions = document.createElement("div");
    actions.className = "section-head-actions";

    // Copy link button
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "section-link-btn";
    btn.setAttribute("aria-label", "Copy link to " + id + " section");
    btn.innerHTML = '<i data-lucide="link"></i> Copy section link';
    btn.addEventListener("click", function () {
      var url = window.location.href.split("#")[0] + "#" + id;
      copyTextPromise(url).then(function () {
        btn.classList.add("copied");
        var icon = btn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "check");
          renderIcons();
        }
        showToast("Link copied: #" + id);
        setTimeout(function () {
          btn.classList.remove("copied");
          if (icon) {
            icon.setAttribute("data-lucide", "link");
            renderIcons();
          }
        }, 1600);
      }).catch(function () {
        showToast("Could not copy link");
      });
    });
    actions.appendChild(btn);

    // Share section button
    var shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "section-share-btn";
    shareBtn.setAttribute("aria-label", "Share " + id + " section");
    shareBtn.innerHTML = '<i data-lucide="share-2"></i> Share section';
    shareBtn.addEventListener("click", function () {
      var url = window.location.href.split("#")[0] + "#" + id;
      var h2 = head.querySelector("h2");
      var sectionName = h2 ? h2.textContent.trim() : id;
      var shareData = {
        title: sectionName + " — MD. RIYAD HASAN",
        text: "Read the " + sectionName + " section of MD. RIYAD HASAN's portfolio",
        url: url
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
      } else {
        copyTextPromise(shareData.url).then(function () {
          shareBtn.classList.add("copied");
          var icon = shareBtn.querySelector("i");
          if (icon) { icon.setAttribute("data-lucide", "check"); renderIcons(); }
          showToast("Section link copied");
          setTimeout(function () {
            shareBtn.classList.remove("copied");
            if (icon) { icon.setAttribute("data-lucide", "share-2"); renderIcons(); }
          }, 1600);
        }).catch(function () { showToast("Could not copy link"); });
      }
    });
    actions.appendChild(shareBtn);

    head.appendChild(actions);
  });
  renderIcons();

  /* ---------- Favorites FAB + panel ---------- */
  var favFab = document.getElementById("favFab");
  var favFabCount = document.getElementById("favFabCount");
  var favPanel = document.getElementById("favPanel");
  var favList = document.getElementById("favList");
  var favCount = document.getElementById("favCount");
  var favClear = document.getElementById("favClear");

  function updateFavFab() {
    var favs = getFavs();
    if (favFab && favFabCount) {
      if (favs.length > 0) {
        favFab.classList.add("show");
        favFab.style.display = "inline-flex";
        favFabCount.textContent = favs.length;
      } else {
        favFab.classList.remove("show");
        setTimeout(function () { if (getFavs().length === 0) favFab.style.display = "none"; }, 350);
      }
    }
  }

  function findCardByTitle(title) {
    return allProjectCards.find(function (c) {
      return projectKey(c) === title;
    });
  }

  function renderFavList() {
    if (!favList) return;
    var favs = getFavs();
    favList.innerHTML = "";
    if (!favs.length) {
      favList.innerHTML =
        '<div class="fav-empty">' +
          '<div class="ico"><i data-lucide="bookmark"></i></div>' +
          '<h4>No saved projects yet</h4>' +
          '<p>Tap the bookmark icon on any project card to save it here.</p>' +
        '</div>';
      renderIcons();
      if (favCount) favCount.textContent = "0 saved";
      return;
    }
    favs.forEach(function (title) {
      var card = findCardByTitle(title);
      var icon = "folder";
      var meta = "Project";
      if (card) {
        var iconEl = card.querySelector(".project-thumb i");
        if (iconEl) icon = iconEl.getAttribute("data-lucide") || "folder";
        var tags = Array.prototype.map.call(card.querySelectorAll(".tag"), function (t) { return t.textContent.trim(); }).join(" · ");
        if (tags) meta = tags;
      }
      var item = document.createElement("div");
      item.className = "fav-item";
      item.innerHTML =
        '<span class="fav-item-icon"><i data-lucide="' + icon + '"></i></span>' +
        '<div class="fav-item-text"><div class="fav-item-title">' + title + '</div><div class="fav-item-meta">' + meta + '</div></div>' +
        '<button class="fav-item-remove" aria-label="Remove ' + title + '"><i data-lucide="x"></i></button>';
      item.querySelector(".fav-item-remove").addEventListener("click", function () {
        // Remove from favorites
        var current = getFavs();
        current = current.filter(function (t) { return t !== title; });
        setFavs(current);
        // Update card state
        if (card) {
          var favBtn = card.querySelector(".project-fav-btn");
          if (favBtn) {
            favBtn.classList.remove("is-fav");
            card.classList.remove("is-fav");
            favBtn.setAttribute("aria-pressed", "false");
            var bIcon = favBtn.querySelector("i");
            if (bIcon) { bIcon.setAttribute("data-lucide", "bookmark"); renderIcons(); }
          }
        }
        renderFavList();
        updateFavFab();
        showToast("Removed: " + title);
      });
      favList.appendChild(item);
    });
    renderIcons();
    if (favCount) favCount.textContent = favs.length + " saved";
  }

  function openFavPanel() {
    if (!favPanel) return;
    favPanel.classList.add("open");
    favPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderFavList();
    var closeBtn = favPanel.querySelector(".fav-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 30);
  }
  function closeFavPanel() {
    if (!favPanel) return;
    favPanel.classList.remove("open");
    favPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (favFab) favFab.addEventListener("click", openFavPanel);
  if (favPanel) {
    favPanel.querySelectorAll("[data-fav-close]").forEach(function (el) {
      el.addEventListener("click", closeFavPanel);
    });
  }
  if (favClear) {
    favClear.addEventListener("click", function () {
      setFavs([]);
      // Update all cards
      allProjectCards.forEach(function (card) {
        var favBtn = card.querySelector(".project-fav-btn");
        if (favBtn) {
          favBtn.classList.remove("is-fav");
          card.classList.remove("is-fav");
          favBtn.setAttribute("aria-pressed", "false");
          var icon = favBtn.querySelector("i");
          if (icon) { icon.setAttribute("data-lucide", "bookmark"); }
        }
      });
      renderIcons();
      renderFavList();
      updateFavFab();
      showToast("Cleared all bookmarks");
    });
  }
  // Escape closes favorites panel
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && favPanel && favPanel.classList.contains("open")) closeFavPanel();
  });

  // Patch the existing favorite toggle to refresh the FAB + panel
  // (Re-attach a lightweight observer to refresh counts after each toggle)
  updateFavFab();

  // Hook into fav button clicks to refresh FAB/panel
  document.addEventListener("click", function (e) {
    var favBtn = e.target.closest(".project-fav-btn");
    if (favBtn) {
      setTimeout(function () {
        updateFavFab();
        if (favPanel && favPanel.classList.contains("open")) renderFavList();
      }, 50);
    }
  });

  // Add favorites panel action to the command palette
  cmdCommands.push({ type: "action", title: "Saved projects", desc: "View bookmarked projects", icon: "bookmark-check", action: "fav", kbd: null });
  var origExecuteCmd = executeCmd;
  executeCmd = function (cmd) {
    closeCmd();
    if (!cmd) return;
    setTimeout(function () {
      if (cmd.type === "section") {
        var target = document.getElementById(cmd.target);
        if (target) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
        }
      } else if (cmd.type === "action") {
        if (cmd.action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (cmd.action === "tint") { if (tintToggle) tintToggle.click(); }
        else if (cmd.action === "kbd") { if (kbdHintBtn) kbdHintBtn.click(); else openKbd(); }
        else if (cmd.action === "fav") openFavPanel();
        else if (cmd.href) window.location.href = cmd.href;
      }
    }, 80);
  };

  /* ---------- Reading-progress milestone toasts ---------- */
  var milestonesHit = {};
  var milestones = [
    { pct: 25, msg: "You're 25% through — nice scrolling!" },
    { pct: 50, msg: "Halfway there — thanks for reading!" },
    { pct: 75, msg: "75% explored — almost the whole story." },
    { pct: 100, msg: "You reached the end — thank you!" }
  ];
  var milestoneToast = document.getElementById("toast");
  function checkMilestones() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    milestones.forEach(function (m) {
      if (pct >= m.pct && !milestonesHit[m.pct]) {
        milestonesHit[m.pct] = true;
        // Show milestone toast (accent-colored)
        if (milestoneToast) {
          milestoneToast.innerHTML = '<i data-lucide="sparkles"></i><span>' + m.msg + '</span>';
          renderIcons();
          milestoneToast.classList.add("show", "milestone");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () {
            milestoneToast.classList.remove("show");
            setTimeout(function () { milestoneToast.classList.remove("milestone"); }, 300);
          }, 2800);
        }
      }
    });
  }
  window.addEventListener("scroll", checkMilestones, { passive: true });

  /* =================================================================
     ROUND 9 — NEW FEATURES
     ================================================================= */

  /* ---------- Hero reading time estimate ---------- */
  var readingTimeEl = document.querySelector("[data-hero-reading-time] .reading-time-value");
  if (readingTimeEl) {
    try {
      // Count words across all main content sections
      var mainContent = document.querySelector("main");
      if (mainContent) {
        var text = mainContent.textContent || "";
        var words = text.trim().split(/\s+/).filter(Boolean).length;
        // Average reading speed: 200 wpm
        var minutes = Math.max(1, Math.round(words / 200));
        readingTimeEl.textContent = "~" + minutes + " min read";
      }
    } catch (e) {}
  }

  /* ---------- Print portfolio action (added to command palette) ---------- */
  cmdCommands.push({ type: "action", title: "Print portfolio", desc: "Open print dialog", icon: "printer", action: "print", kbd: null });
  // Patch executeCmd to handle the print action
  var prevExecuteCmd = executeCmd;
  executeCmd = function (cmd) {
    closeCmd();
    if (!cmd) return;
    setTimeout(function () {
      if (cmd.type === "section") {
        var target = document.getElementById(cmd.target);
        if (target) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
        }
      } else if (cmd.type === "action") {
        if (cmd.action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (cmd.action === "tint") { if (tintToggle) tintToggle.click(); }
        else if (cmd.action === "kbd") { if (kbdHintBtn) kbdHintBtn.click(); else openKbd(); }
        else if (cmd.action === "fav") openFavPanel();
        else if (cmd.action === "print") {
          showToast("Opening print dialog…");
          setTimeout(function () { window.print(); }, 300);
        }
        else if (cmd.href) window.location.href = cmd.href;
      }
    }, 80);
  };

  /* ---------- Recently visited sections in command palette ---------- */
  function getRecentSections() {
    try { return JSON.parse(localStorage.getItem("rh-recent-sections") || "[]"); } catch (e) { return []; }
  }
  function addRecentSection(id) {
    if (!id || id === "hero") return;
    var recent = getRecentSections().filter(function (s) { return s !== id; });
    recent.unshift(id);
    recent = recent.slice(0, 3); // keep top 3
    try { localStorage.setItem("rh-recent-sections", JSON.stringify(recent)); } catch (e) {}
  }

  // Track section visits via the existing scroll-spy (observe active nav link changes)
  var recentSpyObserver = new MutationObserver(function () {
    var active = document.querySelector(".nav-links a.active");
    if (active) {
      var id = active.getAttribute("href").replace("#", "");
      if (id) addRecentSection(id);
    }
  });
  navAnchors.forEach(function (a) {
    recentSpyObserver.observe(a, { attributes: true, attributeFilter: ["class"] });
  });

  // Patch renderCmdList to show recently visited sections at the top
  var originalRenderCmdList = renderCmdList;
  renderCmdList = function () {
    cmdList.innerHTML = "";
    var recent = getRecentSections();
    var recentCmds = [];
    var otherCmds = [];
    cmdFiltered.forEach(function (c) {
      if (c.type === "section" && recent.indexOf(c.target) !== -1) {
        recentCmds.push(c);
      } else {
        otherCmds.push(c);
      }
    });
    // Sort recentCmds by recency
    recentCmds.sort(function (a, b) {
      return recent.indexOf(a.target) - recent.indexOf(b.target);
    });

    if (recentCmds.length > 0) {
      var label = document.createElement("li");
      label.className = "cmd-recent-label";
      label.innerHTML = '<i data-lucide="clock"></i> Recently visited';
      cmdList.appendChild(label);
    }

    recentCmds.forEach(function (cmd, i) {
      var li = document.createElement("li");
      li.className = "cmd-item recent" + (i === cmdActiveIndex && cmdActiveIndex < recentCmds.length ? " active" : "");
      li.setAttribute("role", "option");
      li.innerHTML =
        '<span class="cmd-item-icon"><i data-lucide="' + cmd.icon + '"></i></span>' +
        '<span class="cmd-item-text"><span class="cmd-item-title">' + cmd.title + '</span><span class="cmd-item-desc">' + cmd.desc + '</span></span>' +
        (cmd.kbd ? '<span class="cmd-item-kbd"><kbd>' + cmd.kbd + '</kbd></span>' : '');
      li.addEventListener("click", function () { executeCmd(cmd); });
      li.addEventListener("mouseenter", function () {
        cmdActiveIndex = i;
        updateCmdActive();
      });
      cmdList.appendChild(li);
    });

    if (recentCmds.length > 0 && otherCmds.length > 0) {
      var sep = document.createElement("li");
      sep.className = "cmd-recent-label";
      sep.innerHTML = '<i data-lucide="layout-grid"></i> All commands';
      cmdList.appendChild(sep);
      // Offset active index for the "all commands" section
    }

    otherCmds.forEach(function (cmd, i) {
      var globalIndex = recentCmds.length + i;
      var li = document.createElement("li");
      li.className = "cmd-item" + (globalIndex === cmdActiveIndex ? " active" : "");
      li.setAttribute("role", "option");
      li.setAttribute("data-index", globalIndex);
      li.innerHTML =
        '<span class="cmd-item-icon"><i data-lucide="' + cmd.icon + '"></i></span>' +
        '<span class="cmd-item-text"><span class="cmd-item-title">' + cmd.title + '</span><span class="cmd-item-desc">' + cmd.desc + '</span></span>' +
        (cmd.kbd ? '<span class="cmd-item-kbd"><kbd>' + cmd.kbd + '</kbd></span>' : '');
      li.addEventListener("click", function () { executeCmd(cmd); });
      li.addEventListener("mouseenter", function () {
        cmdActiveIndex = globalIndex;
        updateCmdActive();
      });
      cmdList.appendChild(li);
    });
    renderIcons();
  };

  // Update the active highlighting to work with the new structure
  updateCmdActive = function () {
    var items = cmdList.querySelectorAll(".cmd-item");
    items.forEach(function (el, i) {
      // Use the data-index attribute if available, otherwise count
      var idx = el.getAttribute("data-index");
      el.classList.toggle("active", idx !== null ? parseInt(idx, 10) === cmdActiveIndex : false);
    });
  };

  /* =================================================================
     ROUND 10 — NEW FEATURES
     ================================================================= */

  /* ---------- Nav breadcrumb (current section) ---------- */
  var navBreadcrumb = document.getElementById("navBreadcrumb");
  var navBreadcrumbLabel = document.getElementById("navBreadcrumbLabel");
  function updateBreadcrumb(id) {
    if (!navBreadcrumb || !navBreadcrumbLabel) return;
    var label = navLabels[id] || (id === "hero" ? "Home" : id);
    navBreadcrumbLabel.textContent = label;
    if (id && id !== "hero") {
      navBreadcrumb.classList.add("show");
    } else {
      // Show "Home" briefly at top, then hide after a moment
      if (window.scrollY < 100) {
        navBreadcrumb.classList.remove("show");
      } else {
        navBreadcrumb.classList.add("show");
      }
    }
  }
  // Hook into existing scroll spy (observe active nav link changes)
  if (navAnchors.length && navBreadcrumb) {
    var breadcrumbObserver = new MutationObserver(function () {
      var active = document.querySelector(".nav-links a.active");
      if (active) {
        var id = active.getAttribute("href").replace("#", "");
        updateBreadcrumb(id);
      }
    });
    navAnchors.forEach(function (a) {
      breadcrumbObserver.observe(a, { attributes: true, attributeFilter: ["class"] });
    });
  }

  /* ---------- Dot-nav active progress ring ---------- */
  // Add SVG ring to each dot item
  dotItems.forEach(function (dot) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "dot-progress-ring");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("aria-hidden", "true");
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "10");
    circle.setAttribute("cy", "10");
    circle.setAttribute("r", "8");
    svg.appendChild(circle);
    dot.appendChild(svg);
  });
  var dotRingCirc = 50.27; // 2 * PI * 8
  function updateDotRings() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? scrolled / max : 0;
    var activeDot = document.querySelector(".dot-item.active");
    if (activeDot) {
      var ring = activeDot.querySelector(".dot-progress-ring circle");
      if (ring) {
        // The ring shows progress within the current section (rough heuristic)
        ring.style.strokeDashoffset = Math.max(0, dotRingCirc * (1 - pct));
      }
    }
  }
  window.addEventListener("scroll", updateDotRings, { passive: true });
  updateDotRings();

  /* ---------- 'p' keyboard shortcut for print ---------- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "p" || e.key === "P") {
      if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        showToast("Opening print dialog…");
        setTimeout(function () { window.print(); }, 300);
      }
    }
  });

  // Update the kbd hints overlay to include the 'P' shortcut
  var kbdList = document.querySelector(".kbd-list");
  if (kbdList) {
    var printLi = document.createElement("li");
    printLi.innerHTML = '<span class="kbd-keys"><kbd>P</kbd></span><span class="kbd-desc">Print portfolio</span>';
    // Insert before the "?" entry (which is the 4th item, index 3)
    var items = kbdList.querySelectorAll("li");
    if (items.length >= 4) {
      kbdList.insertBefore(printLi, items[3]);
    } else {
      kbdList.appendChild(printLi);
    }
  }

  /* ---------- First-visit onboarding tour ---------- */
  var tourOverlay = document.getElementById("tourOverlay");
  function hasSeenTour() {
    try { return localStorage.getItem("rh-tour-seen") === "1"; } catch (e) { return false; }
  }
  function markTourSeen() {
    try { localStorage.setItem("rh-tour-seen", "1"); } catch (e) {}
  }
  function openTour() {
    if (!tourOverlay) return;
    tourOverlay.classList.add("open");
    tourOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var startBtn = document.getElementById("tourStart");
    if (startBtn) setTimeout(function () { startBtn.focus(); }, 30);
  }
  function closeTour() {
    if (!tourOverlay) return;
    tourOverlay.classList.remove("open");
    tourOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    markTourSeen();
  }
  if (tourOverlay) {
    tourOverlay.querySelectorAll("[data-tour-close]").forEach(function (el) {
      el.addEventListener("click", closeTour);
    });
    var tourStartBtn = document.getElementById("tourStart");
    if (tourStartBtn) {
      tourStartBtn.addEventListener("click", function () {
        closeTour();
        // Scroll to about section to start exploring
        var about = document.getElementById("about");
        if (about) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: about.offsetTop - navH - 12, behavior: "smooth" });
        }
        showToast("Welcome! Press ? for shortcuts, ⌘K for commands.");
      });
    }
  }
  // Escape closes tour
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && tourOverlay && tourOverlay.classList.contains("open")) closeTour();
  });
  // Show tour on first visit (after a short delay so the page loads)
  if (!hasSeenTour() && tourOverlay) {
    setTimeout(openTour, 1200);
  }

  // Add tour action to command palette
  cmdCommands.push({ type: "action", title: "Show onboarding tour", desc: "See key features", icon: "sparkles", action: "tour", kbd: null });
  var prevExecCmd2 = executeCmd;
  executeCmd = function (cmd) {
    closeCmd();
    if (!cmd) return;
    setTimeout(function () {
      if (cmd.type === "section") {
        var target = document.getElementById(cmd.target);
        if (target) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
        }
      } else if (cmd.type === "action") {
        if (cmd.action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (cmd.action === "tint") { if (tintToggle) tintToggle.click(); }
        else if (cmd.action === "kbd") { if (kbdHintBtn) kbdHintBtn.click(); else openKbd(); }
        else if (cmd.action === "fav") openFavPanel();
        else if (cmd.action === "print") { showToast("Opening print dialog…"); setTimeout(function () { window.print(); }, 300); }
        else if (cmd.action === "tour") openTour();
        else if (cmd.action === "changelog") openChangelog();
        else if (cmd.href) window.location.href = cmd.href;
      }
    }, 80);
  };

  /* =================================================================
     ROUND 11 — NEW FEATURES
     ================================================================= */

  /* ---------- Subtle sound design with mute toggle ---------- */
  var soundToggle = document.getElementById("soundToggle");
  var soundPulse = document.getElementById("soundPulse");
  var audioCtx = null;
  var soundEnabled = false;

  function getSoundPref() {
    try { return localStorage.getItem("rh-sound") === "on"; } catch (e) { return false; }
  }
  function setSoundPref(on) {
    try { localStorage.setItem("rh-sound", on ? "on" : "off"); } catch (e) {}
  }

  function initAudio() {
    if (audioCtx) return audioCtx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {}
    return audioCtx;
  }

  function playTone(freq, duration, type, volume) {
    if (!soundEnabled) return;
    var ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq || 440;
      var vol = (volume || 0.08);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (duration || 0.15));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (duration || 0.15));
      // Pulse indicator
      if (soundPulse) {
        soundPulse.classList.remove("active");
        void soundPulse.offsetWidth;
        soundPulse.classList.add("active");
      }
    } catch (e) {}
  }

  function playClick() { playTone(660, 0.08, "sine", 0.05); }
  function playOpen() { playTone(523, 0.12, "sine", 0.06); setTimeout(function () { playTone(784, 0.1, "sine", 0.05); }, 60); }
  function playSuccess() { playTone(659, 0.1, "sine", 0.06); setTimeout(function () { playTone(880, 0.12, "sine", 0.05); }, 80); }
  function playMilestone() { playTone(523, 0.1, "triangle", 0.06); setTimeout(function () { playTone(659, 0.1, "triangle", 0.06); }, 80); setTimeout(function () { playTone(784, 0.15, "triangle", 0.05); }, 160); }

  function applySoundState(on) {
    soundEnabled = on;
    setSoundPref(on);
    if (soundToggle) {
      soundToggle.classList.toggle("on", on);
      soundToggle.setAttribute("aria-pressed", on ? "true" : "false");
      var icon = soundToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", on ? "volume-2" : "volume-x");
        renderIcons();
      }
    }
  }

  if (soundToggle) {
    // Restore preference (default off)
    applySoundState(getSoundPref());
    soundToggle.addEventListener("click", function () {
      var newState = !soundEnabled;
      applySoundState(newState);
      if (newState) {
        // Play a confirmation tone when enabling
        initAudio();
        setTimeout(function () { playSuccess(); }, 50);
        showToast("Sound effects enabled");
      } else {
        showToast("Sound effects muted");
      }
    });
  }

  // Play sounds on key interactions (only if enabled)
  // Hook into existing interactions via event delegation
  document.addEventListener("click", function (e) {
    if (!soundEnabled) return;
    var target = e.target;
    // Modal/overlay opens
    if (target.closest(".cert-card")) { setTimeout(playOpen, 50); return; }
    if (target.closest("#kbdHintBtn") || target.closest("#cmdTriggerHint") || target.closest("#favFab")) { setTimeout(playOpen, 50); return; }
    if (target.closest(".project-fav-btn") || target.closest(".copy-btn") || target.closest(".section-link-btn") || target.closest(".section-share-btn")) { setTimeout(playSuccess, 50); return; }
    if (target.closest("a[href^='#']") || target.closest(".dot-item") || target.closest(".btn")) { setTimeout(playClick, 30); return; }
  }, true);

  // Play sound on milestones (patch the milestone function)
  var origCheckMilestones = checkMilestones;
  checkMilestones = function () {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    milestones.forEach(function (m) {
      if (pct >= m.pct && !milestonesHit[m.pct]) {
        milestonesHit[m.pct] = true;
        if (milestoneToast) {
          milestoneToast.innerHTML = '<i data-lucide="sparkles"></i><span>' + m.msg + '</span>';
          renderIcons();
          milestoneToast.classList.add("show", "milestone");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () {
            milestoneToast.classList.remove("show");
            setTimeout(function () { milestoneToast.classList.remove("milestone"); }, 300);
          }, 2800);
        }
        playMilestone();
      }
    });
  };

  /* ---------- Changelog modal ---------- */
  var changelogOverlay = document.getElementById("changelogOverlay");
  var changelogList = document.getElementById("changelogList");

  var changelogData = [
    {
      version: "v3.0", date: "September 2026",
      items: [
        "<strong>Onboarding tour</strong> for first-time visitors",
        "<strong>Nav breadcrumb</strong> showing current section",
        "<strong>Dot-nav progress ring</strong> on active section",
        "<strong>Sound design</strong> with mute toggle (opt-in)",
        "<strong>Changelog</strong> &amp; <strong>feedback</strong> links in footer",
        "<strong>'P' shortcut</strong> for print"
      ]
    },
    {
      version: "v2.0", date: "August 2026",
      items: [
        "<strong>Command palette</strong> (Ctrl/⌘ + K) with search &amp; recent sections",
        "<strong>Project bookmarks</strong> with saved panel",
        "<strong>Copy/share section link</strong> buttons on every section",
        "<strong>Reading-progress milestones</strong> at 25/50/75/100%",
        "<strong>Developer easter egg</strong> — type 'dev'",
        "<strong>Hero reading-time</strong> estimate"
      ]
    },
    {
      version: "v1.5", date: "August 2026",
      items: [
        "<strong>Keyboard shortcut hints</strong> overlay (press ?)",
        "<strong>Certificate confetti</strong> on modal open",
        "<strong>Print CV</strong> &amp; <strong>back-to-top</strong> on CV page",
        "<strong>BreadcrumbList</strong> structured data",
        "<strong>404 page</strong> for Cloudflare Pages"
      ]
    },
    {
      version: "v1.0", date: "July 2026",
      items: [
        "Initial portfolio with <strong>9 sections</strong>",
        "<strong>In-site CV viewer</strong> (no forced download)",
        "<strong>Certificate modal/lightbox</strong> system",
        "<strong>Warm cream palette</strong> + grain texture",
        "<strong>Theme tint toggle</strong> (cream ↔ parchment)",
        "<strong>Featured project</strong> bento layout"
      ]
    }
  ];

  function renderChangelog() {
    if (!changelogList) return;
    changelogList.innerHTML = "";
    changelogData.forEach(function (entry) {
      var div = document.createElement("div");
      div.className = "changelog-entry";
      var itemsHtml = entry.items.map(function (item) { return "<li>" + item + "</li>"; }).join("");
      div.innerHTML =
        '<div class="changelog-entry-head">' +
          '<span class="changelog-version-badge">' + entry.version + '</span>' +
          '<span class="changelog-date">' + entry.date + '</span>' +
        '</div>' +
        '<ul>' + itemsHtml + '</ul>';
      changelogList.appendChild(div);
    });
  }

  function openChangelog() {
    if (!changelogOverlay) return;
    renderChangelog();
    changelogOverlay.classList.add("open");
    changelogOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = changelogOverlay.querySelector(".changelog-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 30);
  }
  function closeChangelog() {
    if (!changelogOverlay) return;
    changelogOverlay.classList.remove("open");
    changelogOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (changelogOverlay) {
    changelogOverlay.querySelectorAll("[data-changelog-close]").forEach(function (el) {
      el.addEventListener("click", closeChangelog);
    });
  }
  var footerChangelog = document.getElementById("footerChangelog");
  if (footerChangelog) footerChangelog.addEventListener("click", openChangelog);
  // Escape closes changelog
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && changelogOverlay && changelogOverlay.classList.contains("open")) closeChangelog();
  });

  // Add changelog action to command palette
  cmdCommands.push({ type: "action", title: "What's new", desc: "View changelog", icon: "history", action: "changelog", kbd: null });
  var prevExecCmd3 = executeCmd;
  executeCmd = function (cmd) {
    closeCmd();
    if (!cmd) return;
    setTimeout(function () {
      if (cmd.type === "section") {
        var target = document.getElementById(cmd.target);
        if (target) {
          var navH = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
        }
      } else if (cmd.type === "action") {
        if (cmd.action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (cmd.action === "tint") { if (tintToggle) tintToggle.click(); }
        else if (cmd.action === "kbd") { if (kbdHintBtn) kbdHintBtn.click(); else openKbd(); }
        else if (cmd.action === "fav") openFavPanel();
        else if (cmd.action === "print") { showToast("Opening print dialog…"); setTimeout(function () { window.print(); }, 300); }
        else if (cmd.action === "tour") openTour();
        else if (cmd.action === "changelog") openChangelog();
        else if (cmd.href) window.location.href = cmd.href;
      }
    }, 80);
  };

  /* ---------- Feedback link ---------- */
  var footerFeedback = document.getElementById("footerFeedback");
  if (footerFeedback) {
    footerFeedback.addEventListener("click", function () {
      var subject = encodeURIComponent("Portfolio feedback — MD. RIYAD HASAN");
      var body = encodeURIComponent("Hi Riyad,\n\nI'd like to share some feedback about your portfolio website:\n\n");
      window.location.href = "mailto:mdriyad83@student.sust.edu?subject=" + subject + "&body=" + body;
      showToast("Opening your email app…");
    });
  }

})();
