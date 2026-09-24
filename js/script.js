(function () {
  "use strict";

  /* ==========================================================
     LANGUAGE
     ========================================================== */
  const STORAGE_KEY = "newbtp-lang";
  let currentLang = (function () {
    try {
      return localStorage.getItem(STORAGE_KEY) || "fr";
    } catch (e) {
      return "fr";
    }
  })();

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || (TRANSLATIONS.fr[key] || key);
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))));
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))));

    // About read-more toggle label depends on expanded state
    const aboutSection = document.querySelector(".about");
    const aboutToggle = document.getElementById("aboutToggle");
    if (aboutSection && aboutToggle) {
      const expanded = aboutSection.classList.contains("about--expanded");
      aboutToggle.textContent = expanded ? t("about.readLess") : t("about.readMore");
    }

    // Lang switch button states
    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    updateHeroTitle();
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyTranslations();
  }

  document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });

  /* ==========================================================
     HEADER — sticky shadow + mobile nav
     ========================================================== */
  const header = document.getElementById("header");
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---- Scroll progress bar (fills going down, empties going up) ---- */
  const scrollProgress = document.getElementById("scrollProgress");
  const onScrollProgress = () => {
    if (!scrollProgress) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  hamburgerBtn.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    hamburgerBtn.setAttribute("aria-expanded", String(open));
  });
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }));

  /* ==========================================================
     HERO SLIDER
     ========================================================== */
  const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
  const heroDotsWrap = document.getElementById("heroDots");
  const heroTitleEl = document.getElementById("heroTitle");
  const heroContentEl = document.getElementById("heroContent");
  const heroLearnMoreBtn = document.getElementById("heroLearnMore");
  const heroProjectKeys = [null, "douala-bali", "dschang", "yaounde-parc"];
  let heroIndex = 0;
  let heroTimer = null;

  heroSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToHeroSlide(i));
    heroDotsWrap.appendChild(dot);
  });
  const heroDots = Array.from(heroDotsWrap.children);

  function updateHeroTitle() {
    if (!heroTitleEl) return;
    heroTitleEl.textContent = t("hero.slide" + heroIndex + ".title");
    if (heroContentEl) heroContentEl.classList.toggle("hero__content--hidden", heroIndex === 0);
  }

  function goToHeroSlide(i) {
    const target = (i + heroSlides.length) % heroSlides.length;
    if (target === heroIndex) return;

    // Image + title + subtitle + active dot must change together as one
    // slide state. Fade the text out first, swap everything (image,
    // dot, text) at the same instant, then fade the text back in — this
    // keeps the crossfading image and the text in visual sync instead of
    // the text swapping instantly while the image is still fading.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 0 : 260;

    if (heroContentEl) heroContentEl.classList.add("is-switching");

    setTimeout(() => {
      heroSlides[heroIndex].classList.remove("is-active");
      heroDots[heroIndex].classList.remove("is-active");
      heroIndex = target;
      heroSlides[heroIndex].classList.add("is-active");
      heroDots[heroIndex].classList.add("is-active");
      updateHeroTitle();
      if (heroContentEl) heroContentEl.classList.remove("is-switching");
    }, delay);
  }

  function nextHeroSlide() { goToHeroSlide(heroIndex + 1); }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroTimer = setInterval(nextHeroSlide, 2000);
  }
  function stopHeroAutoplay() { if (heroTimer) clearInterval(heroTimer); }

  document.getElementById("heroPrev").addEventListener("click", () => { goToHeroSlide(heroIndex - 1); startHeroAutoplay(); });
  document.getElementById("heroNext").addEventListener("click", () => { goToHeroSlide(heroIndex + 1); startHeroAutoplay(); });

  const heroSliderEl = document.getElementById("heroSlider");
  // Autoplay no longer pauses on hover — it keeps cycling continuously.

  // touch swipe
  (function heroSwipe() {
    let startX = 0, deltaX = 0, touching = false;
    heroSliderEl.addEventListener("touchstart", (e) => { touching = true; startX = e.touches[0].clientX; }, { passive: true });
    heroSliderEl.addEventListener("touchmove", (e) => { if (touching) deltaX = e.touches[0].clientX - startX; }, { passive: true });
    heroSliderEl.addEventListener("touchend", () => {
      if (Math.abs(deltaX) > 40) goToHeroSlide(heroIndex + (deltaX < 0 ? 1 : -1));
      touching = false; deltaX = 0;
      startHeroAutoplay();
    });
  })();

  heroLearnMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const key = heroProjectKeys[heroIndex];
    if (key) openProjectModal(key);
  });

  startHeroAutoplay();

  /* ==========================================================
     ABOUT — expand / collapse
     ========================================================== */
  const aboutSection = document.querySelector(".about");
  const aboutToggle = document.getElementById("aboutToggle");
  aboutToggle.addEventListener("click", () => {
    const expanded = aboutSection.classList.toggle("about--expanded");
    aboutToggle.setAttribute("aria-expanded", String(expanded));
    aboutToggle.textContent = expanded ? t("about.readLess") : t("about.readMore");
  });

  /* ==========================================================
     PROJECT DETAIL MODAL
     ========================================================== */
  const modal = document.getElementById("projectModal");
  const modalImg = document.getElementById("modalImg");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalLocation = document.getElementById("modalLocation");
  const modalText = document.getElementById("modalText");
  const modalServices = document.getElementById("modalServices");
  let lastFocusedEl = null;

  function openProjectModal(key) {
    const data = PROJECTS[key];
    if (!data) return;
    const tagKey = key === "yaounde-parc" ? "projects.p1" : key === "dschang" ? "projects.p2" : "projects.p3";
    modalImg.src = data.img;
    modalImg.alt = modalTitleFor(key);
    modalTag.textContent = t(tagKey + ".tag");
    modalTitle.textContent = t(tagKey + ".title");
    modalLocation.textContent = data.location;
    modalText.textContent = t(tagKey + ".text");
    modalServices.innerHTML = "";
    (data.services[currentLang] || data.services.fr).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      modalServices.appendChild(li);
    });

    lastFocusedEl = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }
  function modalTitleFor(key) {
    return key === "yaounde-parc" ? "BICEC Yaoundé-Parc" : key === "dschang" ? "BICEC Dschang" : "BICEC Douala-Bali";
  }

  function closeProjectModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll("[data-project] .project-card__more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.closest("[data-project]").getAttribute("data-project");
      openProjectModal(key);
    });
  });
  document.getElementById("modalClose").addEventListener("click", closeProjectModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeProjectModal);
  document.getElementById("modalReturn").addEventListener("click", closeProjectModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeProjectModal(); });

  /* ==========================================================
     BEFORE / AFTER COMPARISON SLIDER
     ========================================================== */
  const baCompare = document.getElementById("baCompare");
  const baBeforeWrap = document.getElementById("baBeforeWrap");
  const baHandle = document.getElementById("baHandle");
  const baTabs = document.querySelectorAll(".ba__tab");

  function setBaPosition(percent) {
    percent = Math.max(0, Math.min(100, percent));
    baBeforeWrap.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    baHandle.style.left = percent + "%";
    baHandle.setAttribute("aria-valuenow", Math.round(percent));
  }
  setBaPosition(50);

  function baPointerX(clientX) {
    const rect = baCompare.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  let baDragging = false;
  baHandle.addEventListener("mousedown", () => (baDragging = true));
  window.addEventListener("mouseup", () => (baDragging = false));
  window.addEventListener("mousemove", (e) => { if (baDragging) setBaPosition(baPointerX(e.clientX)); });

  baHandle.addEventListener("touchstart", () => (baDragging = true), { passive: true });
  window.addEventListener("touchend", () => (baDragging = false));
  baCompare.addEventListener("touchmove", (e) => { if (baDragging) setBaPosition(baPointerX(e.touches[0].clientX)); }, { passive: true });

  baCompare.addEventListener("click", (e) => { if (e.target === baHandle || baHandle.contains(e.target)) return; setBaPosition(baPointerX(e.clientX)); });

  baHandle.addEventListener("keydown", (e) => {
    const current = parseFloat(baHandle.style.left) || 50;
    if (e.key === "ArrowLeft") setBaPosition(current - 5);
    if (e.key === "ArrowRight") setBaPosition(current + 5);
  });

  function switchBaTab(index) {
    baTabs.forEach((tab, i) => tab.classList.toggle("is-active", i === index));
    const entry = BEFORE_AFTER[index];
    const beforeImg = baCompare.querySelector(".ba__img--before");
    const afterImg = baCompare.querySelector(".ba__img--after");
    beforeImg.src = entry.before;
    beforeImg.alt = "Avant rénovation - " + entry.title;
    afterImg.src = entry.after;
    afterImg.alt = "Après rénovation - " + entry.title;
    setBaPosition(50);
  }
  baTabs.forEach((tab, i) => tab.addEventListener("click", () => switchBaTab(i)));

  /* ==========================================================
     STATISTICS COUNTERS
     ========================================================== */
  const statEls = Array.from(document.querySelectorAll(".stat__num"));
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const small = el.querySelector("small");
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.firstChild.textContent = String(value);
      if (progress < 1) requestAnimationFrame(tick);
    }
    el.textContent = "";
    el.appendChild(document.createTextNode("0"));
    if (small) el.appendChild(small);
    requestAnimationFrame(tick);
  }

  /* ==========================================================
     SCROLL REVEAL + STATS TRIGGER
     Elements fade/slide into view on the way down AND replay
     the same animation on the way back up, for a lively feel
     in both scroll directions.
     ========================================================== */
  const revealTargets = document.querySelectorAll(
    ".section-head, .service-card, .project-card, .stat, .about__media, .about__body, " +
    ".ba__compare, .contact__info, .contact__form, .partners__track-wrap, .footer__col, " +
    ".hero__eyebrow, .hero__title, .hero__cta-row"
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    // Small stagger for elements that sit side-by-side in a grid/row
    el.style.setProperty("--reveal-delay", ((i % 4) * 90) + "ms");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));

    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statEls.forEach(animateCount);
          statsIo.disconnect();
        }
      });
    }, { threshold: 0.4 });
    const statsGrid = document.getElementById("statsGrid");
    if (statsGrid) statsIo.observe(statsGrid);
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    statEls.forEach(animateCount);
  }

  /* ==========================================================
     E-MAIL SENDING — shared by the quote popup and the contact form
     (settings: js/quote-config.js). Resolves only if the service confirms.
     ========================================================== */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  async function sendMail(subject, entries, who, files) {
    const C = window.NEWBTP_QUOTE || {};
    const web3 = C.provider === "web3forms";
    const fd = new FormData();
    let url;
    if (web3) {
      if (!C.accessKey || /^YOUR_/.test(C.accessKey)) throw new Error("Web3Forms accessKey missing (js/quote-config.js)");
      url = "https://api.web3forms.com/submit";
      fd.append("access_key", C.accessKey); fd.append("subject", subject); fd.append("from_name", "NEW BTP SARL — Site web");
    } else {
      const to = C.recipientId || C.recipient;
      if (!to) throw new Error("recipient missing (js/quote-config.js)");
      url = "https://formsubmit.co/ajax/" + to;
      fd.append("_subject", subject); fd.append("_template", "table"); fd.append("_captcha", "false");
      fd.append("_replyto", who.email);
    }
    fd.append("name", who.name); fd.append("email", who.email);
    entries.forEach(([k, val]) => fd.append(k, val));
    if (files && files.length && (!web3 || C.attachFiles)) files.forEach((f) => fd.append("attachment", f, f.name));
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), C.timeoutMs || 25000);
    try {
      const res = await fetch(url, { method: "POST", body: fd, headers: { Accept: "application/json" }, signal: ctl.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !(data.success === true || data.success === "true")) throw new Error("Mail service replied: " + (data.message || res.status));
      return data;
    } finally { clearTimeout(timer); }
  }

  /* ==========================================================
     CONTACT FORM
     ========================================================== */
  const contactForm = document.getElementById("contactFormEl");
  const formStatus = document.getElementById("formStatus");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (contactForm.dataset.busy) return;
    const f = contactForm.elements, v = (n) => f[n].value.trim();
    if (f.botcheck && f.botcheck.checked) return; // honeypot
    const btn = contactForm.querySelector(".contact__submit");
    const label = btn.querySelector("[data-i18n]");
    const status = (key, ok) => { formStatus.setAttribute("data-i18n", key); formStatus.textContent = t(key); formStatus.style.color = ok ? "" : "#c0392b"; };
    if (!v("nom") || !EMAIL_RE.test(v("email")) || !v("message")) { status("contact.form.invalid", false); return; }
    contactForm.dataset.busy = "1"; btn.disabled = true;
    label.setAttribute("data-i18n", "contact.form.sending"); label.textContent = t("contact.form.sending");
    formStatus.textContent = ""; formStatus.removeAttribute("data-i18n");
    try {
      await sendMail(t("contact.form.mailSubject"), [
        ["Formulaire", "NEW BTP SARL — " + t("contact.form.title")],
        [t("contact.form.phone"), v("telephone") || "—"],
        [t("contact.form.subject"), v("sujet") || "—"],
        [t("contact.form.message"), v("message")]
      ], { name: v("nom"), email: v("email") });
      contactForm.reset(); status("contact.form.success", true);
    } catch (err) {
      console.error("[contact]", err); status("contact.form.error", false); // values are kept
    } finally {
      delete contactForm.dataset.busy; btn.disabled = false;
      label.setAttribute("data-i18n", "contact.form.send"); label.textContent = t("contact.form.send");
    }
  });

  /* ==========================================================
     INIT
     ========================================================== */
  /* ==========================================================
     QUOTE REQUEST MODAL (“Obtenir un devis”) — see js/quote-config.js
     ========================================================== */
  (function () {
    const modal = document.getElementById("quoteModal");
    if (!modal) return;
    const panel = modal.querySelector(".qm__panel");
    const form = document.getElementById("quoteForm");
    const success = document.getElementById("quoteSuccess");
    const fail = document.getElementById("quoteFail");
    const submitBtn = document.getElementById("quoteSubmit");
    const fileInput = document.getElementById("q_files");
    const fileList = document.getElementById("quoteFiles");
    const MAX_FILES = 3, MAX_SIZE = 5 * 1024 * 1024;
    let files = [], opener = null, sending = false;

    /* ---- open / close / focus trap ---- */
    function openModal(from) {
      opener = from || document.activeElement;
      form.hidden = false; success.hidden = true; fail.hidden = true;
      modal.hidden = false;
      document.documentElement.classList.add("qm-lock");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      setTimeout(() => form.elements.fullname.focus(), 60);
    }
    function closeModal() {
      if (modal.hidden) return;
      modal.classList.remove("is-open");
      const done = () => { modal.hidden = true; document.documentElement.classList.remove("qm-lock"); if (opener && opener.focus) opener.focus(); };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) done(); else setTimeout(done, 280);
    }
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quote-open]");
      if (!btn) return;
      e.preventDefault(); e.stopPropagation();
      openModal(btn);
    }, true);
    modal.addEventListener("mousedown", (e) => { if (e.target === modal) closeModal(); });
    document.getElementById("quoteClose").addEventListener("click", closeModal);
    document.getElementById("quoteOkClose").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
      if (e.key !== "Tab") return;
      const f = [...panel.querySelectorAll("button, input:not([type=file]):not(.qm-hp), select, textarea, label.qm-file")]
        .filter((el) => el.offsetParent !== null && !el.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* ---- errors (data-i18n so they re-translate on FR/EN switch) ---- */
    function setErr(name, key) {
      const el = form.querySelector('[data-err-for="' + name + '"]');
      const input = form.elements[name] || (name === "files" ? fileInput : null);
      if (el) { if (key) { el.setAttribute("data-i18n", key); el.textContent = t(key); } else { el.removeAttribute("data-i18n"); el.textContent = ""; } }
      if (input && input.setAttribute) input.setAttribute("aria-invalid", key ? "true" : "false");
    }
    const RULES = {
      fullname: (v) => !v.trim() && "q.err.required",
      email: (v) => (!v.trim() && "q.err.required") || (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && "q.err.email"),
      phone: (v) => (!v.trim() && "q.err.required") || (!(/^\+?[0-9\s().-]{7,22}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 7) && "q.err.phone"),
      type: (v) => !v && "q.err.required",
      location: (v) => !v.trim() && "q.err.required",
      description: (v) => !v.trim() && "q.err.required"
    };
    function validate() {
      let firstBad = null;
      Object.keys(RULES).forEach((n) => {
        const err = RULES[n](form.elements[n].value);
        setErr(n, err || ""); if (err && !firstBad) firstBad = form.elements[n];
      });
      const consent = form.elements.consent.checked;
      setErr("consent", consent ? "" : "q.err.consent");
      if (!consent && !firstBad) firstBad = form.elements.consent;
      if (firstBad) firstBad.focus();
      return !firstBad;
    }
    form.addEventListener("input", (e) => { const n = e.target.name; if (RULES[n] && e.target.getAttribute("aria-invalid") === "true") setErr(n, RULES[n](e.target.value) || ""); });
    form.elements.consent.addEventListener("change", (e) => { if (e.target.checked) setErr("consent", ""); });

    /* ---- files: extension + size + real content (magic bytes) ---- */
    const SIGS = {
      pdf: [[0x25, 0x50, 0x44, 0x46]], jpg: [[0xFF, 0xD8, 0xFF]], jpeg: [[0xFF, 0xD8, 0xFF]], png: [[0x89, 0x50, 0x4E, 0x47]],
      doc: [[0xD0, 0xCF, 0x11, 0xE0]], xls: [[0xD0, 0xCF, 0x11, 0xE0]], docx: [[0x50, 0x4B, 0x03, 0x04]], xlsx: [[0x50, 0x4B, 0x03, 0x04]]
    };
    async function realType(file) {
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!SIGS[ext]) return false;
      const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
      return SIGS[ext].some((s) => s.every((x, i) => b[i] === x));
    }
    function renderFiles() {
      fileList.innerHTML = "";
      files.forEach((f, i) => {
        const li = document.createElement("li");
        const span = document.createElement("span"); span.textContent = f.name + " (" + Math.max(1, Math.round(f.size / 1024)) + " Ko)";
        const rm = document.createElement("button"); rm.type = "button"; rm.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>'; rm.setAttribute("aria-label", t("q.removeFile") + " " + f.name);
        rm.addEventListener("click", () => { files.splice(i, 1); renderFiles(); setErr("files", ""); });
        li.append(span, rm); fileList.appendChild(li);
      });
    }
    fileInput.addEventListener("change", async () => {
      let err = "";
      for (const f of [...fileInput.files]) {
        if (files.length >= MAX_FILES) { err = "q.err.fileCount"; break; }
        if (f.size > MAX_SIZE) { err = "q.err.fileSize"; continue; }
        if (!(await realType(f))) { err = "q.err.fileType"; continue; }
        if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
      }
      fileInput.value = ""; renderFiles(); setErr("files", err);
    });

    /* ---- submit ---- */
    function setBtn(key, busy) { submitBtn.setAttribute("data-i18n", key); submitBtn.textContent = t(key); submitBtn.disabled = busy; }
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (sending) return;
      if (form.elements.botcheck.checked) return; // honeypot: bots only
      fail.hidden = true;
      if (!validate()) return;
      sending = true; setBtn("q.sending", true);
      try {
        const v = (n) => form.elements[n].value.trim();
        const typeText = form.elements.type.options[form.elements.type.selectedIndex].text;
        const docs = files.length ? files.map((f) => f.name).join(", ") : t("q.mail.none");
        await sendMail(t("q.mailSubject"), [
          ["Formulaire", t("q.mail.head")],
          [t("q.company"), v("company") || "—"],
          [t("q.phone"), v("phone")],
          [t("q.type"), typeText],
          [t("q.location"), v("location")],
          [t("q.budget"), v("budget") || "—"],
          [t("q.start"), v("start") || "—"],
          [t("q.projdesc"), v("description")],
          [t("q.mail.docs"), docs],
          ["Source", t("q.mail.foot")]
        ], { name: v("fullname"), email: v("email") }, files);
        form.reset(); files = []; renderFiles();
        form.hidden = true; success.hidden = false;
        document.getElementById("quoteOkClose").focus();
      } catch (err) {
        console.error("[quote]", err);
        fail.hidden = false; // form values are kept
        fail.scrollIntoView({ block: "nearest" });
      } finally {
        sending = false; setBtn("q.submit", false);
      }
    });
  })();

  applyTranslations();
})();
