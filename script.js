/* ===================================================================
   TROUBLEMOVIES · interactions v3 (page-agnostic)
   Works on the home page and every project subpage. Every home-only
   block is guarded so the same file can be shared site-wide.
=================================================================== */
(function () {
  "use strict";

  /* ---------- Dev security gate (SOLO entorno de desarrollo) ---------- */
  (function devGate() {
    try { if (localStorage.getItem("tm_devgate_v1") === "1") return; } catch (e) {}
    const gate = document.createElement("div");
    gate.id = "devGate";
    gate.innerHTML = `
      <div id="devGateBox">
        <div class="dg-top-bar">
          <span class="dg-dot red"></span>
          <span class="dg-dot yellow"></span>
          <span class="dg-dot green"></span>
          <span class="dg-top-label">SENSEPOT DEV // RESTRICTED ACCESS</span>
        </div>
        <div class="dg-video-wrap">
          <video class="dg-video" autoplay muted loop playsinline>
            <source src="assets/sp-loading.webm" type="video/webm">
            <source src="assets/sp-loading.mp4" type="video/mp4">
          </video>
        </div>
        <div class="dg-badge"><span class="dg-badge-dot"></span> ENTORNO PRIVADO · DIVISIÓN SENSEPOT DEV</div>
        <h2 class="dg-title">Acceso Restringido</h2>
        <p class="dg-body">
          Estás ingresando a un <strong>sitio privado y seguro</strong> de
          <strong>Sensepot Smart Technologies</strong>. Este entorno es de uso
          exclusivo para desarrollo y pruebas internas.<br><br>
          Esta versión puede contener <strong>fallas, funcionalidades incompletas
          y vulnerabilidades de sistema</strong> propias de un entorno de desarrollo.
          Al continuar, confirmas que eres personal autorizado y aceptas los
          <strong>Términos y Condiciones de Desarrollador Sensepot</strong>
          (División Sensepot Dev).
        </p>
        <div class="dg-meta">
          <span class="dg-meta-item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg> TLS 1.3 Encriptado</span>
          <span class="dg-meta-item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5"/><path d="M8 5v3l2 2"/></svg> Sesión Monitorizada</span>
          <span class="dg-meta-item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2L2 5v4c0 3.3 2.7 5.7 6 6 3.3-.3 6-2.7 6-6V5L8 2z"/></svg> Acceso Verificado</span>
        </div>
        <button id="devGateBtn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm3.5 5.5-4 4-2-2"/></svg>
          Entendido — Continuar al Entorno Dev
        </button>
        <p class="dg-footer-note">Acceso registrado · Sensepot Smart Technologies® · <span id="dg-ts"></span></p>
      </div>`;
    const mount = () => {
      document.body.prepend(gate);
      document.documentElement.style.overflow = "hidden";
      const t = new Date(), pad = (n) => String(n).padStart(2, "0");
      const tsEl = gate.querySelector("#dg-ts");
      if (tsEl) tsEl.textContent =
        `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ` +
        `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())} ` +
        `UTC${t.getTimezoneOffset() <= 0 ? "+" : "-"}${pad(Math.abs(t.getTimezoneOffset() / 60))}`;
      gate.querySelector("#devGateBtn").addEventListener("click", () => {
        try { localStorage.setItem("tm_devgate_v1", "1"); } catch (e) {}
        gate.classList.add("hide");
        document.documentElement.style.overflow = "";
        setTimeout(() => gate.remove(), 600);
      });
    };
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount);
  })();

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const canHover = matchMedia("(hover:hover)").matches;

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  if (loader) addEventListener("load", () => setTimeout(() => loader.classList.add("hide"), reduce ? 0 : 1700));

  /* ---------- Scroll progress ---------- */
  const prog = $("#progress");
  if (prog) {
    const onScrollProg = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      prog.style.width = (p * 100).toFixed(2) + "%";
    };
    addEventListener("scroll", onScrollProg, { passive: true });
    onScrollProg();
  }

  /* ---------- Custom cursor + labels + magnetic ---------- */
  const cur = $("#cursor"), dot = $("#cursorDot"), curLabel = $("#cursorLabel");
  if (cur && dot && canHover) {
    let cx = innerWidth / 2, cy = innerHeight / 2, x = cx, y = cy;
    addEventListener("mousemove", (e) => {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    });
    (function loop() {
      x += (cx - x) * 0.2; y += (cy - y) * 0.2;
      cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      const play = e.target.closest("[data-cursor='play']");
      const hot = e.target.closest("a,button,.work__card,.svc__item,.vcard,.tile,input,select,textarea,label");
      if (play) { cur.classList.add("play"); cur.classList.remove("grow"); if (curLabel) curLabel.textContent = play.dataset.cursorLabel || "Play"; }
      else if (hot) { cur.classList.add("grow"); cur.classList.remove("play"); }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("[data-cursor='play'],a,button,.work__card,.svc__item,.vcard,.tile,input,select,textarea,label")) {
        cur.classList.remove("grow", "play");
      }
    });
    // magnetic
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.25}px,${my * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav"), navLinks = $("#navLinks"), burger = $("#burger");
  if (nav) addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
  if (burger && navLinks) {
    let menuScrollY = 0;
    const setMenu = (open) => {
      navLinks.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      if (open) {
        menuScrollY = scrollY;
        document.body.style.top = `-${menuScrollY}px`;
        document.body.classList.add("menu-open");
      } else if (document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        document.body.style.top = "";
        scrollTo(0, menuScrollY);
      }
    };
    burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    $$("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---------- Scrollspy (in-page anchors only) ---------- */
  const navMap = {};
  $$("#navLinks a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) navMap[href.slice(1)] = a;
  });
  if (Object.keys(navMap).length) {
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      const a = navMap[e.target.id];
      if (a && e.isIntersecting) { $$("#navLinks a").forEach((l) => l.classList.remove("active")); a.classList.add("active"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach((id) => { const s = $("#" + id); if (s) spy.observe(s); });
  }

  /* ---------- Split section titles into words ---------- */
  function split(el) {
    if (el.querySelector(".word")) return;
    const text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="word"><i>${w}</i></span>`).join(" ");
  }

  /* ---------- Reveal ---------- */
  const revObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); }
  }), { threshold: 0.12 });
  function observeReveals() {
    $$("[data-split]").forEach(split);
    $$(".reveal, [data-split]").forEach((el) => { if (!el.classList.contains("in")) revObs.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  const countObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count; let n = 0; const step = Math.max(1, target / 40);
    const t = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(t); } el.textContent = Math.floor(n); }, 28);
    countObs.unobserve(el);
  }), { threshold: 0.5 });
  $$(".stat__num").forEach((el) => countObs.observe(el));

  /* ---------- HERO flashlight + parallax + embers (home only) ---------- */
  const hero = $("#hero"), stage = $("#heroStage");
  if (hero && stage && !reduce) {
    let mx = 50, my = 42, tmx = 50, tmy = 42, lastInput = 0;
    function setTorch() {
      tmx += (mx - tmx) * 0.12; tmy += (my - tmy) * 0.12;
      stage.style.setProperty("--mx", tmx.toFixed(2) + "%");
      stage.style.setProperty("--my", tmy.toFixed(2) + "%");
    }
    function pointTo(clientX, clientY) {
      const r = hero.getBoundingClientRect();
      mx = ((clientX - r.left) / r.width) * 100;
      my = ((clientY - r.top) / r.height) * 100;
      lastInput = performance.now();
    }
    hero.addEventListener("mousemove", (e) => pointTo(e.clientX, e.clientY));
    hero.addEventListener("touchmove", (e) => { const t = e.touches[0]; pointTo(t.clientX, t.clientY); }, { passive: true });
    let t0 = performance.now();
    (function roam(now) {
      if (now - lastInput > 1400) {
        const e = (now - t0) / 1000;
        mx = 50 + Math.sin(e * 0.6) * 26;
        my = 40 + Math.cos(e * 0.43) * 16;
      }
      setTorch();
      requestAnimationFrame(roam);
    })(t0);
    addEventListener("scroll", () => {
      const s = scrollY;
      stage.style.transform = `translateY(${s * 0.12}px)`;
      stage.style.opacity = Math.max(0, 1 - s / 700);
    }, { passive: true });
  }

  /* ---------- Embers canvas ---------- */
  const cv = $("#embers");
  if (cv && hero && !reduce) {
    const ctx = cv.getContext("2d");
    let W, H, parts = [], running = true;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    function resize() { W = cv.width = hero.offsetWidth * DPR; H = cv.height = hero.offsetHeight * DPR; }
    resize(); addEventListener("resize", resize);
    const N = innerWidth < 760 ? 26 : 46;
    for (let i = 0; i < N; i++) parts.push(newP(true));
    function newP(init) {
      return { x: Math.random() * W, y: init ? Math.random() * H : H + 20, r: (Math.random() * 1.6 + 0.4) * DPR,
        s: (Math.random() * 0.5 + 0.2) * DPR, d: Math.random() * 0.6 - 0.3, a: Math.random() * 0.5 + 0.2, h: Math.random() < 0.5 ? "185,140,255" : "255,255,255" };
    }
    function tick() {
      if (!running) return requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y -= p.s; p.x += p.d; p.a -= 0.0009;
        if (p.y < -10 || p.a <= 0) Object.assign(p, newP(false));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(${p.h},${p.a})`; ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
    new IntersectionObserver((e) => (running = e[0].isIntersecting)).observe(hero);
  }

  /* ===================================================================
     WORK grid (home only)
  =================================================================== */
  const WORK = [
    { name: "MARYGYM", cat: "Spot comercial", meta: "Marymount · 2025", yt: "Bmwp6ymWYe4", poster: "yt-marygym", size: "lg" },
    { name: "Class of 2025", cat: "Aftermovie", meta: "Marymount · 2025", yt: "acmFdKige3k", poster: "yt-seniors", size: "sm" },
    { name: "MARYMUN", cat: "Trailer", meta: "Institucional · 2025", yt: "rOsENruWNx8", poster: "yt-marymun", size: "sm" },
    { name: "Mezcal", cat: "Pieza de marca", meta: "Branded", yt: "iilG5KMpeUw", poster: "yt-mezcal", size: "lg" },
  ];
  const grid = $("#workGrid");
  if (grid) {
    grid.innerHTML = WORK.map((w) => `
      <article class="work__card work__card--${w.size}" data-yt="${w.yt}" data-title="${w.name} · ${w.cat}" tabindex="0" role="button" data-cursor="play" aria-label="Reproducir ${w.name}">
        <span class="work__tag" data-tag>Ver video</span>
        <div class="work__media">
          <picture>
            <source srcset="assets/${w.poster}.webp" type="image/webp">
            <img src="assets/${w.poster}.jpg" alt="${w.name}" loading="lazy">
          </picture>
        </div>
        <span class="work__play"></span>
        <div class="work__overlay">
          <span class="work__cat">${w.cat} <span>${w.meta}</span></span>
          <h3 class="work__name">${w.name}</h3>
        </div>
      </article>`).join("");
    $$(".work__card").forEach((card) => {
      card.addEventListener("click", () => openLightbox(card.dataset.yt, card.dataset.title));
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(card.dataset.yt, card.dataset.title); });
      revObs.observe(card);
    });
  }

  /* ---------- Lightbox (site-wide) ---------- */
  const lb = $("#lightbox"), lbPlayer = $("#lightboxPlayer"), lbTitle = $("#lightboxTitle");
  function openLightbox(id, title, start) {
    if (!lb) return;
    const s = parseInt(start, 10);
    const startParam = (s > 0) ? `&start=${s}` : "";
    lbPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0${startParam}" title="${title || "Video"}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    if (lbTitle) lbTitle.textContent = title || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  }
  // image gallery state
  let gallery = [], gIdx = 0;
  function openImage(src, title) {
    if (!lb) return;
    lb.classList.add("is-img");
    lbPlayer.innerHTML = `<img src="${src}" alt="${title || ""}">`;
    if (lbTitle) lbTitle.textContent = title || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  }
  function openVideoFile(src, title) {
    if (!lb) return;
    lbPlayer.innerHTML = `<video src="${src}" controls autoplay playsinline style="width:100%;height:100%;object-fit:contain;background:#000"></video>`;
    if (lbTitle) lbTitle.textContent = title || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  }
  function stepGallery(d) {
    if (!gallery.length) return;
    gIdx = (gIdx + d + gallery.length) % gallery.length;
    openImage(gallery[gIdx].src, gallery[gIdx].title);
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("open", "is-img"); lb.setAttribute("aria-hidden", "true"); lbPlayer.innerHTML = ""; document.body.style.overflow = "";
  }
  if (lb) {
    const lbClose = $("#lightboxClose");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (lb.classList.contains("is-img") && lb.classList.contains("open")) {
        if (e.key === "ArrowRight") stepGallery(1);
        if (e.key === "ArrowLeft") stepGallery(-1);
      }
    });
    // generic openers · any element with data-video="<ytid>" (+ optional data-title)
    $$("[data-video]").forEach((el) => {
      el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
      el.setAttribute("role", el.getAttribute("role") || "button");
      const go = () => openLightbox(el.dataset.video, el.dataset.title || el.getAttribute("aria-label"), el.dataset.start);
      el.addEventListener("click", go);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    // local video openers · any element with data-localvideo="<src>" (+ optional data-title)
    $$("[data-localvideo]").forEach((el) => {
      el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
      el.setAttribute("role", el.getAttribute("role") || "button");
      const go = () => openVideoFile(el.dataset.localvideo, el.dataset.title || el.getAttribute("aria-label"));
      el.addEventListener("click", go);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    const lbPrev = $("#lbPrev"), lbNext = $("#lbNext");
    if (lbPrev) lbPrev.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(-1); });
    if (lbNext) lbNext.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(1); });
    // image openers · any element with data-img="<src>" (+ optional data-title)
    const imgEls = $$("[data-img]");
    gallery = imgEls.map((el) => ({ src: el.dataset.img, title: el.dataset.title || "" }));
    imgEls.forEach((el, i) => {
      el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
      el.setAttribute("role", el.getAttribute("role") || "button");
      const go = () => { gIdx = i; openImage(el.dataset.img, el.dataset.title); };
      el.addEventListener("click", go);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }
  const reelBtn = $("#reelBtn");
  if (reelBtn) reelBtn.addEventListener("click", () => openVideoFile("assets/showreel.mp4", "TroubleMovies · Showreel"));

  // expose for page-specific scripts
  window.TM = { openLightbox, openImage, openVideoFile, closeLightbox };

  /* ---------- Contact form (home only) ---------- */
  const form = $("#contactForm"), note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#f_name").value.trim(), email = $("#f_email").value.trim();
      const type = $("#f_type").value, budget = $("#f_budget").value || "Sin especificar", msg = $("#f_msg").value.trim();
      if (!name || !email || !type) { note.style.color = "var(--magenta)"; note.textContent = I18N[lang].form_err; return; }
      const subject = encodeURIComponent(`Nuevo proyecto · ${name} (${type})`);
      const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\nTipo: ${type}\nPresupuesto: ${budget}\n\n${msg}`);
      location.href = `mailto:troublemoviesproductions@gmail.com?subject=${subject}&body=${body}`;
      note.style.color = "var(--violet)"; note.textContent = I18N[lang].form_ok; form.reset();
    });
  }

  /* ---------- Accordion (site-wide; .acc > .acc__item > .acc__head + .acc__panel) ---------- */
  $$(".acc__head").forEach((head) => {
    const item = head.closest(".acc__item");
    const panel = item && item.querySelector(".acc__panel");
    if (!item || !panel) return;
    head.setAttribute("aria-expanded", "false");
    head.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", open);
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });

  /* ===================================================================
     i18n · base dictionary (home) merged with optional window.PAGE_I18N
  =================================================================== */
  const I18N = {
    es: {
      nav_work: "Trabajo", nav_services: "Servicios", nav_about: "Nosotros", nav_process: "Proceso", nav_contact: "Contacto", nav_cta: "Cuéntanos tu proyecto",
      nav_projects: "Proyectos", nav_events: "Eventos", nav_tmmg: "TMMG", nav_home: "Inicio", nav_legal: "Aviso Legal", nav_privacy: "Privacidad",
      hero_eyebrow: "Productora audiovisual", hero_l1: "Historias que", hero_l2: "valen la pena.",
      hero_sub: "Convertimos ideas en historias que la gente recuerda y comparte. A veces hay que meterse en problemas para crear algo memorable. Del bueno.",
      hero_work: "Ver el trabajo", hero_reel_k: "Ver showreel", hero_reel_v: "TroubleMovies · Reel", hero_scroll: "Scroll",
      work_eyebrow: "Trabajo seleccionado", work_title: "No lo contamos. Te lo mostramos.",
      services_eyebrow: "Servicios", services_title: "¿Qué necesitas crear?",
      services_lead: "De la idea a la entrega final. Tú traes la visión, nosotros el oficio para volverla inolvidable.",
      svc1_t: "Producción integral", svc1_d: "Desde la idea y el guion hasta filmación, edición y entrega final. Un solo equipo responsable de todo el proceso.",
      svc2_t: "Spots y contenido digital", svc2_d: "Videos creativos para redes, campañas de marketing y lanzamientos de marca. Pensados para detener el scroll.",
      svc3_t: "Cortometrajes y cine", svc3_d: "Desarrollo de historias con alma, listas para festivales y exhibiciones. Narrativa que trasciende la pantalla.",
      svc4_t: "Cobertura de eventos", svc4_d: "Graduaciones, conferencias, lanzamientos y experiencias en vivo filmadas con mirada cinematográfica.",
      gear_eyebrow: "El oficio", gear_title: "Con qué grabamos",
      gear_lead: "Equipo profesional y oficio para que cada proyecto se vea y se oiga como cine.",
      g1_t: "Drones cinematográficos", g1_d: "Tomas aéreas y FPV con encuadre y movimiento de cine.",
      g2_t: "Cámaras de cine", g2_d: "Sensores 4K/6K, ópticas y estabilización profesional.",
      g3_t: "Multicámara en vivo", g3_d: "Transmisión y switch en tiempo real, varios puntos a la vez.",
      g4_t: "Audio profesional", g4_d: "Captura y mezcla limpias, dentro y fuera del set.",
      g5_t: "Postproducción y color", g5_d: "Edición, color grading y motion graphics con identidad.",
      about_eyebrow: "Por qué Trouble", about_title: "Las historias que importan no nacen de jugar a lo seguro.",
      about_cap: "El venado · nuestro tótem",
      about_p1: "Somos <b>TroubleMovies</b>, una productora audiovisual que cree que cada proyecto merece una historia única. No hacemos contenido que pasa desapercibido: hacemos piezas que detienen el scroll, que emocionan y que mueven a la acción.",
      about_p2: "El venado es nuestro tótem: silencioso, atento, imposible de ignorar cuando aparece en la oscuridad. Así trabajamos: con calma, oficio y una mirada que no se conforma. Creativos por convicción, profesionales por costumbre.",
      stat_1: "Proyectos producidos", stat_2: "Hechos a medida", stat_3: "Marcas que confían", stat_4: "Vistas generadas",
      process_eyebrow: "Cómo trabajamos", process_title: "Sin sorpresas. Solo buen trabajo.",
      step1_t: "Conversamos", step1_d: "Entendemos tu objetivo, tu marca y a quién quieres llegar. Sin briefs interminables.",
      step2_t: "Creamos la idea", step2_d: "Concepto, guion y plan de producción. Te mostramos a dónde vamos antes de grabar.",
      step3_t: "Producimos", step3_d: "Rodaje y dirección con un equipo que cuida cada detalle frente y detrás de cámara.",
      step4_t: "Entregamos", step4_d: "Edición, color y sonido. Recibes piezas listas para publicar en cada formato.",
      clients_label: "Marcas que confían en nosotros", clients_more: "y más…",
      quote_text: "“Llegaron, entendieron la idea en cinco minutos y entregaron algo mejor de lo que imaginamos. El resultado habló por sí solo.”",
      quote_who: "Marca / Institución",
      contact_eyebrow: "Hagámoslo", contact_title: "¿Tienes una historia que contar?",
      contact_lead: "Cuéntanos qué tienes en mente. Te respondemos rápido y sin compromiso.",
      form_name: "Tu nombre", form_email: "Tu email", form_type: "Tipo de proyecto",
      form_type1: "Spot / contenido digital", form_type2: "Cortometraje / cine", form_type3: "Producción integral", form_type4: "Cobertura de evento", form_type5: "Otro",
      form_budget: "Presupuesto aproximado", form_budget_x: "Aún no lo sé", form_msg: "Cuéntanos sobre el proyecto", form_send: "Enviar solicitud",
      form_ok: "¡Listo! Se abrió tu correo para enviarnos el mensaje.", form_err: "Completa nombre, email y tipo de proyecto.",
      footer_big: "Hagamos algo memorable →", footer_tag: "Historias que valen la pena.",
    },
    en: {
      nav_work: "Work", nav_services: "Services", nav_about: "About", nav_process: "Process", nav_contact: "Contact", nav_cta: "Tell us your project",
      nav_projects: "Projects", nav_events: "Events", nav_tmmg: "TMMG", nav_home: "Home", nav_legal: "Legal Notice", nav_privacy: "Privacy",
      hero_eyebrow: "Audiovisual production", hero_l1: "Stories worth", hero_l2: "the trouble.",
      hero_sub: "We turn ideas into stories people remember and share. Sometimes you have to get into a little trouble to create something memorable. The good kind.",
      hero_work: "See the work", hero_reel_k: "Watch showreel", hero_reel_v: "TroubleMovies · Reel", hero_scroll: "Scroll",
      work_eyebrow: "Selected work", work_title: "We don't tell you. We show you.",
      services_eyebrow: "Services", services_title: "What do you need to create?",
      services_lead: "From the idea to final delivery. You bring the vision, we bring the craft to make it unforgettable.",
      svc1_t: "Full production", svc1_d: "From idea and script to shooting, editing and final delivery. One team owning the entire process.",
      svc2_t: "Spots & digital content", svc2_d: "Creative videos for social, marketing campaigns and brand launches. Built to stop the scroll.",
      svc3_t: "Short films & cinema", svc3_d: "Developing stories with soul, ready for festivals and screenings. Narrative that transcends the screen.",
      svc4_t: "Event coverage", svc4_d: "Graduations, conferences, launches and live experiences filmed with a cinematic eye.",
      gear_eyebrow: "The craft", gear_title: "What we shoot with",
      gear_lead: "Pro gear and craft so every project looks and sounds like cinema.",
      g1_t: "Cinematic drones", g1_d: "Aerial and FPV shots with cinema framing and movement.",
      g2_t: "Cinema cameras", g2_d: "4K/6K sensors, pro lenses and stabilization.",
      g3_t: "Live multicam", g3_d: "Real-time broadcast and switching from several angles.",
      g4_t: "Professional audio", g4_d: "Clean capture and mix, on set and beyond.",
      g5_t: "Post & color", g5_d: "Editing, color grading and motion graphics with identity.",
      about_eyebrow: "Why Trouble", about_title: "The stories that matter never come from playing it safe.",
      about_cap: "The deer · our totem",
      about_p1: "We're <b>TroubleMovies</b>, an audiovisual studio that believes every project deserves a unique story. We don't make content that goes unnoticed: we make pieces that stop the scroll, stir emotion and move people to act.",
      about_p2: "The deer is our totem: quiet, watchful, impossible to ignore when it appears in the dark. That's how we work: with calm, craft and an eye that won't settle. Creative by conviction, professional by habit.",
      stat_1: "Projects produced", stat_2: "Made to measure", stat_3: "Brands that trust us", stat_4: "Views generated",
      process_eyebrow: "How we work", process_title: "No surprises. Just great work.",
      step1_t: "We talk", step1_d: "We understand your goal, your brand and who you want to reach. No endless briefs.",
      step2_t: "We craft the idea", step2_d: "Concept, script and production plan. We show you where we're going before we shoot.",
      step3_t: "We produce", step3_d: "Shooting and direction with a team that cares for every detail, in front of and behind the camera.",
      step4_t: "We deliver", step4_d: "Editing, color and sound. You get pieces ready to publish in every format.",
      clients_label: "Brands that trust us", clients_more: "and more…",
      quote_text: "“They showed up, got the idea in five minutes and delivered something better than we imagined. The result spoke for itself.”",
      quote_who: "Brand / Institution",
      contact_eyebrow: "Let's do it", contact_title: "Got a story to tell?",
      contact_lead: "Tell us what you have in mind. We reply fast, no strings attached.",
      form_name: "Your name", form_email: "Your email", form_type: "Project type",
      form_type1: "Spot / digital content", form_type2: "Short film / cinema", form_type3: "Full production", form_type4: "Event coverage", form_type5: "Other",
      form_budget: "Approx. budget", form_budget_x: "Not sure yet", form_msg: "Tell us about the project", form_send: "Send request",
      form_ok: "Done! Your email app opened so you can send us the message.", form_err: "Please fill in name, email and project type.",
      footer_big: "Let's make something memorable →", footer_tag: "Stories worth the trouble.",
    },
  };

  // merge per-page strings (declared via <script> before this file)
  if (window.PAGE_I18N) {
    for (const l of ["es", "en"]) Object.assign(I18N[l], window.PAGE_I18N[l] || {});
  }

  let lang = localStorage.getItem("tm_lang") || "es";
  const langBtn = $("#langBtn");
  function applyLang(l) {
    lang = l; document.documentElement.lang = l; localStorage.setItem("tm_lang", l);
    if (langBtn) langBtn.classList.toggle("en", l === "en");
    $$("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n"); if (I18N[l][k] == null) return;
      if (/<[a-z]/i.test(I18N[l][k])) el.innerHTML = I18N[l][k]; else el.textContent = I18N[l][k];
    });
    // localize the work "Ver video" tags
    $$("[data-tag]").forEach((t) => (t.textContent = l === "es" ? "Ver video" : "Watch"));
    // re-split titles after text swap, then observe
    $$("[data-split]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      const txt = (k && I18N[l][k]) ? I18N[l][k] : el.textContent;
      el.classList.remove("in");
      el.innerHTML = `<span class="word"><i>${txt.trim().split(/\s+/).join('</i></span> <span class="word"><i>')}</i></span>`;
    });
    observeReveals();
  }
  if (langBtn) langBtn.addEventListener("click", () => applyLang(lang === "es" ? "en" : "es"));
  applyLang(lang);
  observeReveals();
})();
