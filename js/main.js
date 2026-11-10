/* ======================================================================
   main.js  —  how the website BEHAVES
   ----------------------------------------------------------------------
   You don't need to edit this file to change your content (use config.js).
   Each numbered block below does one job. Search for the number to find it:
     1. Small helpers
     2. Video helpers        (file or YouTube? + thumbnails)
     3. Fill the page from config.js
     4. Video grid + filters
     5. Video pop-up (modal)
     6. Theme switch (light / dark)
     7. Navigation (menu, hide-on-scroll, active link)
     8. Scroll effects       (timeline, timecode, showreel zoom, process line)
     9. Reveal-on-scroll + number counters
    10. Custom cursor
    11. Contact (copy email + form)
   ====================================================================== */

(function () {
  "use strict";

  /* ---------- 1. SMALL HELPERS ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const pad = (n) => String(n).padStart(2, "0");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Safety check: SITE comes from config.js. If it is missing, tell the beginner why.
  if (typeof SITE === "undefined") {
    console.error("config.js did not load. Check that js/config.js exists and is linked in index.html BEFORE main.js.");
    return;
  }

  // Makes text safe to put inside HTML (prevents weird characters breaking the page).
  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  // Small pop-up message at the bottom of the screen.
  const toastEl = $("#toast");
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 3600);
  }


  /* ---------- 2. YOUTUBE HELPERS ---------- */

  // Pulls the 11-character video ID out of any normal YouTube link.
  // Returns null if the text is not a real link (e.g. the PASTE_..._HERE placeholder).
  function getYouTubeId(url) {
    if (!url) return null;
    const match = String(url).match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  const isShortUrl = (url) => /youtube\.com\/shorts\//.test(url || "");

  // Works out what kind of video a config value is:
  //   • a file  ("assets/videos/promo.mp4" or https://…/promo.mp4)  → play it directly
  //   • a YouTube link                                               → play it with YouTube's player
  //   • anything else (empty, typo)                                  → null → placeholder card
  function resolveSource(value) {
    if (!value) return null;
    const v = String(value).trim();
    const id = getYouTubeId(v);
    if (id) return { kind: "youtube", id, url: v, short: isShortUrl(v) };
    if (/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(v)) return { kind: "file", src: encodeURI(v) };
    return null;
  }

  // Loads the video's thumbnail from YouTube. Tries the sharpest size first,
  // then falls back to a smaller one if YouTube doesn't have the big one.
  function attachThumbnail(img, id) {
    const sizes = ["maxresdefault", "mqdefault"];
    let i = 0;
    const load = () => { img.src = `https://i.ytimg.com/vi/${id}/${sizes[i]}.jpg`; };
    img.addEventListener("error", () => { if (i < sizes.length - 1) { i++; load(); } });
    img.addEventListener("load", () => {
      // YouTube sometimes returns a tiny grey image instead of an error.
      if (img.naturalWidth <= 120 && i < sizes.length - 1) { i++; load(); }
    });
    load();
  }


  /* ---------- 3. FILL THE PAGE FROM config.js ---------- */
  function applyConfig() {
    document.title = `${SITE.name} — ${SITE.role}`;

    // <span data-config="name"> → text from SITE.name
    $$("[data-config]").forEach((el) => {
      const value = SITE[el.dataset.config];
      if (value) el.textContent = value;
    });

    // email links
    $$("[data-email]").forEach((a) => {
      a.href = "mailto:" + SITE.email;
      if (a.hasAttribute("data-email-text")) a.textContent = SITE.email;
    });

    // social links (hidden when left empty)
    $$("[data-social]").forEach((a) => {
      const url = SITE.socials && SITE.socials[a.dataset.social];
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        (a.closest("li") || a).hidden = true;
      }
    });

    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // Scrolling strip of tools (the list is repeated twice so the loop looks endless)
    const track = $("#marqueeTrack");
    const tools = SITE.tools || [];
    if (track && tools.length) {
      const items = tools.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join("");
      track.innerHTML = items + items;
    }

    // "Tools I work with" chips
    const chips = $("#toolChips");
    if (chips) chips.innerHTML = tools.map((t) => `<li>${esc(t)}</li>`).join("");

    // Stats (numbers count up when they scroll into view — see section 9)
    const stats = $("#stats");
    if (stats) {
      stats.innerHTML = (SITE.stats || [])
        .map(
          (s) => `<div class="stat">
            <span class="stat__value"><span data-count="${Number(s.value) || 0}">0</span>${esc(s.suffix || "")}</span>
            <span class="stat__label">${esc(s.label)}</span>
          </div>`
        )
        .join("");
    }
  }


  /* ---------- 4. VIDEO GRID + FILTERS + SHOWREEL ---------- */
  const grid = $("#videoGrid");

  // Shared by the video cards AND the big showreel: shows the thumbnail, handles
  // missing files (placeholder), hover preview, and opens the pop-up on click.
  function bindMedia(btn, item, title) {
    const source = resolveSource(item.video || item.youtube);
    const poster = item.poster ? encodeURI(item.poster) : "";
    const short = item.vertical === true || (source && source.short) || false;

    const placeholder = () => {
      btn.classList.add("is-placeholder");
      btn.setAttribute("aria-label", `Placeholder for ${title}. Add a video file in assets/videos/ and its path in config.js`);
    };

    if (!source) {
      placeholder();
    } else if (source.kind === "youtube") {
      attachThumbnail($(".thumb", btn), source.id);
    } else {
      // Your own video file. Use the poster picture if you gave one; otherwise
      // show the first frame of the video itself (a muted <video> that never plays by itself).
      const useFirstFrame = () => {
        const old = $(".thumb", btn);
        const v = document.createElement("video");
        v.className = "thumb";
        v.muted = true;
        v.defaultMuted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.setAttribute("aria-hidden", "true");
        v.addEventListener("error", placeholder);          // file missing or misspelled
        v.src = source.src + "#t=0.1";
        old.replaceWith(v);
      };
      const img = $(".thumb", btn);
      if (poster) {
        img.addEventListener("error", useFirstFrame);       // poster missing → use video frame
        img.src = poster;
      } else {
        useFirstFrame();
      }
      // Desktop only: a silent preview plays while the mouse is over the card.
      if (finePointer) {
        btn.addEventListener("mouseenter", () => {
          const v = $("video.thumb", btn);
          if (v && !btn.classList.contains("is-placeholder")) v.play().catch(() => {});
        });
        btn.addEventListener("mouseleave", () => {
          const v = $("video.thumb", btn);
          if (v) { v.pause(); v.currentTime = 0.1; }
        });
      }
    }

    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-placeholder")) {
        toast("Placeholder — put your video in assets/videos/ and its path in js/config.js");
        return;
      }
      openVideo({ source, title, poster, short }, btn);
    });
  }

  function createCard(video, index) {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.dataset.category = video.category || "";
    card.style.setProperty("--delay", (index % 3) * 90 + "ms"); // stagger within a row

    const media = document.createElement("button");
    media.type = "button";
    media.className = "media frame";
    media.dataset.cursor = "play";
    media.setAttribute("aria-label", `Play video: ${video.title}`);
    media.innerHTML = `
      <img class="thumb" alt="" loading="lazy" />
      <span class="media__ph"><strong>Video placeholder</strong><span>Add your file in <code>assets/videos/</code></span></span>
      <span class="media__tag">${esc(video.category || "Video")}</span>
      ${video.length ? `<span class="media__len">${esc(video.length)}</span>` : ""}
      <span class="media__play"><svg><use href="#i-play" /></svg></span>`;
    bindMedia(media, video, video.title);

    const body = document.createElement("div");
    body.className = "card__body";
    body.innerHTML = `
      <span class="card__cat">${esc(video.category || "")}</span>
      <h3 class="card__title">${esc(video.title)}</h3>
      <p class="card__text">${esc(video.description || "")}</p>`;

    card.append(media, body);
    return card;
  }

  function renderVideos() {
    const videos = SITE.videos || [];
    grid.innerHTML = "";
    videos.forEach((v, i) => grid.appendChild(createCard(v, i)));

    // Filter buttons: "All" + every category found in your video list
    const filters = $("#filters");
    const categories = ["All", ...new Set(videos.map((v) => v.category).filter(Boolean))];
    filters.innerHTML = "";
    if (categories.length <= 2) return; // no need for filters with a single category

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter";
      btn.textContent = cat;
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.addEventListener("click", () => {
        $$(".filter", filters).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        applyFilter(cat);
      });
      filters.appendChild(btn);
    });
  }

  function applyFilter(category) {
    grid.classList.add("is-filtering"); // fade out…
    setTimeout(() => {
      $$(".card", grid).forEach((card) => {
        card.hidden = !(category === "All" || card.dataset.category === category);
      });
      grid.classList.remove("is-filtering"); // …and fade back in
    }, reduceMotion ? 0 : 220);
  }

  function setupShowreel() {
    bindMedia($("#showreel"), { video: SITE.showreel, poster: SITE.showreelPoster }, `${SITE.name} — Showreel`);
  }


  /* ---------- 5. VIDEO POP-UP (MODAL) ---------- */
  const modal = $("#modal");
  const modalFrame = $("#modalFrame");
  let lastFocused = null;
  let closeTimer;

  function openVideo({ source, title, poster, short }, trigger) {
    lastFocused = trigger || document.activeElement;
    clearTimeout(closeTimer);

    // The player is created only now, so nothing heavy loads until someone clicks.
    let player;
    if (source.kind === "youtube") {
      player = document.createElement("iframe");
      player.src = `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      player.title = title;
      player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
      player.allowFullscreen = true;
      player.referrerPolicy = "strict-origin-when-cross-origin";
    } else {
      player = document.createElement("video");
      player.controls = true;
      player.autoplay = true;
      player.playsInline = true;
      player.preload = "auto";
      player.setAttribute("aria-label", title);
      if (poster) player.poster = poster;
      player.src = source.src;
      //Tall (9:16) videos get a tall frame automatically;
      player.addEventListener("loadedmetadata", () => {
        modalFrame.classList.toggle("is-short", player.videoHeight > player.videoWidth);
      });
    }

    modalFrame.innerHTML = "";
    modalFrame.classList.toggle("is-short", !!short);
    modalFrame.appendChild(player);

    $("#modalTitle").textContent = title;
    const link = $("#modalLink");
    link.hidden = source.kind !== "youtube";       // "Open on YouTube" only for YouTube videos
    if (source.kind === "youtube") link.href = source.url;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#modalClose").focus();
  }

  function closeVideo() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    const playing = $("video", modalFrame);
    if (playing) playing.pause();                   // stop the sound immediately
    // Remove the player after the fade-out so the video stops completely.
    closeTimer = setTimeout(() => (modalFrame.innerHTML = ""), 400);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function setupModal() {
    $("#modalClose").addEventListener("click", closeVideo);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); }); // click outside
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVideo(); });
  }


  /* ---------- 6. THEME SWITCH (light / dark) ---------- */
  function setupTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const btn = $("#themeToggle");

    const sync = () => meta && meta.setAttribute("content", root.getAttribute("data-theme") === "light" ? "#f6f4ee" : "#0b0b0c");
    sync();

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: ignore */ }
      sync();
    });
  }


  /* ---------- 7. NAVIGATION ---------- */
  const nav = $("#nav");
  const menu = $("#menu");
  const burger = $("#burger");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);
    if (open) nav.classList.remove("is-hidden");
  }

  function setupNav() {
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth >= 900) setMenu(false); });

    // Which section are we in? Highlights the menu link + updates the HUD "scene" label.
    const sections = $$("main section[data-scene]");
    const sceneEl = $("#hudScene");
    const links = $$(".nav__links a");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target);
          sceneEl.textContent = `Scene ${pad(index + 1)} · ${entry.target.dataset.scene}`;
          links.forEach((a) => {
            if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" } // "the section crossing the middle of the screen"
    );
    sections.forEach((s) => io.observe(s));
  }


  /* ---------- 8. SCROLL EFFECTS ----------
     One function runs on scroll (at most once per screen refresh) and updates:
       • the timeline bar + playhead at the top
       • the timecode counter (bottom-left)
       • the showreel's gentle zoom
       • the "filling" line in the Process section
       • the menu bar (blur background / hide when scrolling down) */
  const fill = $("#timelineFill");
  const head = $("#timelineHead");
  const tcEl = $("#hudTc");
  const showreel = $("#showreel");
  const processList = $("#processList");
  let lastY = 0;
  let ticking = false;

  function updateOnScroll() {
    ticking = false;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;

    // Timeline bar + playhead
    fill.style.transform = `scaleX(${progress})`;
    head.style.left = progress * 100 + "%";

    // Timecode: pretend the whole page is a 5-minute video at 24 frames per second.
    const totalFrames = Math.floor(progress * 300 * 24);
    const ff = totalFrames % 24;
    const ss = Math.floor(totalFrames / 24) % 60;
    const mm = Math.floor(totalFrames / 24 / 60);
    tcEl.textContent = `00:${pad(mm)}:${pad(ss)}:${pad(ff)}`;

    // Showreel zoom: 0.95 → 1 as it comes into view
    if (showreel && !reduceMotion) {
      const top = showreel.getBoundingClientRect().top;
      const t = clamp((window.innerHeight - top) / (window.innerHeight * 0.7), 0, 1);
      showreel.style.setProperty("--s", (0.94 + 0.06 * t).toFixed(4));
    }

    // Process line fill
    if (processList) {
      const r = processList.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.75 - r.top) / (r.height + window.innerHeight * 0.1), 0, 1);
      processList.style.setProperty("--pp", p.toFixed(4));
    }

    // Nav bar look + hide on scroll down / show on scroll up
    nav.classList.toggle("is-scrolled", y > 24);
    if (!menu.classList.contains("is-open")) {
      if (y > lastY + 6 && y > 240) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 240) nav.classList.remove("is-hidden");
    }
    lastY = y;
  }

  function setupScroll() {
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateOnScroll); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    updateOnScroll();
  }


  /* ---------- 9. REVEAL-ON-SCROLL + COUNTERS ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // animate only once
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function setupCounters() {
    const counters = $$("[data-count]");
    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3); // starts fast, ends slow
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { counters.forEach((c) => (c.textContent = c.dataset.count)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }


  /* ---------- 10. CUSTOM CURSOR (desktop mouse only) ---------- */
  function setupCursor() {
    const cursor = $("#cursor");
    if (!finePointer || !cursor) return;

    let x = 0, y = 0, cx = 0, cy = 0;

    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!cursor.classList.contains("is-on")) {
        cx = x; cy = y;
        cursor.classList.add("is-on");
        document.documentElement.classList.add("has-cursor");
      }
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));

    // Follow the mouse with a little smoothing ("lerp")
    (function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();

    // Change shape depending on what is under the mouse
    document.addEventListener("mouseover", (e) => {
      const play = e.target.closest('[data-cursor="play"]');
      const link = e.target.closest("a, button, .filter, select, input, textarea");
      cursor.classList.toggle("is-play", !!play && !play.classList.contains("is-placeholder"));
      cursor.classList.toggle("is-link", !!link && !play);
    });
  }


  /* ---------- 11. CONTACT: COPY EMAIL + FORM ---------- */
  function setupContact() {
    // Copy email button
    const copyBtn = $("#copyEmail");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(SITE.email);
        copyBtn.textContent = "Copied ✓";
      } catch (e) {
        copyBtn.textContent = "Press Ctrl+C";
      }
      setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    });

    // The form has no server (this is a front-end-only site), so on submit we open the
    // visitor's email app with everything already written out, addressed to you.
    const form = $("#contactForm");
    const status = $("#formStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ["name", "email", "message"];
      let valid = true;
      required.forEach((field) => {
        const input = form.elements[field];
        const ok = String(data.get(field) || "").trim() && (field !== "email" || input.checkValidity());
        input.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) { status.textContent = "Please fill in your name, a valid email and a message."; return; }

      const subject = `Project enquiry from ${data.get("name")}`;
      const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject type: ${data.get("type")}\n\n${data.get("message")}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app… if nothing happens, email me directly at " + SITE.email;
    });
  }


  /* ---------- START EVERYTHING ----------
     Order matters: first fill in the content, THEN set up the effects that need it. */
  applyConfig();
  renderVideos();
  setupShowreel();
  setupModal();
  setupTheme();
  setupNav();
  setupScroll();
  setupReveal();
  setupCounters();
  setupCursor();
  setupContact();
})();
