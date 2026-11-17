/* ============================================================
   SOUTH INDIAN WEDDING — script.js
   ============================================================ */
(function () {
  "use strict";

  /* --- Page loader fade-out --- */
  const loader = document.getElementById("page-loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("done"), 300);
  });

  /* --- Throttled scroll --- */
  const onScroll = [];
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          onScroll.forEach((fn) => fn());
          ticking = false;
        });
      }
    },
    { passive: true },
  );

  /* --- Scroll progress --- */
  const bar = document.getElementById("scroll-progress");
  onScroll.push(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = h > 0 ? (scrollY / h) * 100 + "%" : "0";
  });

  /* --- Reveal on scroll --- */
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

  /* --- Scroll-triggered image animations --- */
  const imgObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          imgObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll(".scroll-anim").forEach((el) => imgObs.observe(el));

  /* --- Scroll hint — fade out after scrolling --- */
  const scrollHint = document.getElementById("scroll-hint");
  if (scrollHint) {
    onScroll.push(() => {
      if (scrollY > 100) scrollHint.classList.add("hidden");
      else scrollHint.classList.remove("hidden");
    });
  }

  /* --- Foliage grows in as you scroll --- */
  const fL = document.querySelector(".foliage-left");
  const fR = document.querySelector(".foliage-right");
  if (fL && fR) {
    onScroll.push(() => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const progress = Math.min(scrollY / (maxScroll * 0.6), 1);
      const s = 0.2 + progress * 0.8;
      fL.style.transform = `scale(${s})`;
      fR.style.transform = `scale(${s})`;
    });
  }

  /* --- Lotus side parallax (slower, offset from leaves) --- */
  const lsL = document.querySelector(".lotus-side-left");
  const lsR = document.querySelector(".lotus-side-right");
  if (lsL && lsR) {
    onScroll.push(() => {
      const y = scrollY * 0.04;
      lsL.style.transform = `rotate(15deg) translateY(${y}px)`;
      lsR.style.transform = `scaleX(-1) rotate(15deg) translateY(${y}px)`;
    });
  }

  /* --- Mandapam subtle parallax --- */
  const mandapam = document.querySelector(".mandapam-wrap");
  if (mandapam) {
    onScroll.push(() => {
      const rect = mandapam.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) {
        const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
        mandapam.style.transform = `translateY(${(progress - 0.5) * -20}px)`;
      }
    });
  }

  /* --- Elephants subtle parallax --- */
  const elephants = document.querySelector(".elephants-footer");
  if (elephants) {
    onScroll.push(() => {
      const rect = elephants.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) {
        const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
        elephants.style.transform = `translateY(${(progress - 0.5) * -10}px)`;
      }
    });
  }

  /* --- Ganesha glow proximity --- */
  const gGlow = document.querySelector(".ganesha-glow");
  const gSec = document.getElementById("ganesha");
  if (gGlow && gSec) {
    onScroll.push(() => {
      const rect = gSec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const intensity = Math.max(
        0,
        1 - Math.abs(center - innerHeight / 2) / (innerHeight * 0.5),
      );
      gGlow.style.opacity = 0.3 + intensity * 0.6;
    });
  }

  /* --- Floating petals --- */
  const n = Math.min(5, Math.floor(innerWidth / 250) + 2);
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "petal";
    el.innerHTML =
      '<img src="images/lotus/lotus_bg.png" width="14" height="14" alt="" style="opacity:.4">';
    document.body.appendChild(el);
    const s = {
      el,
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vy: 0.06 + Math.random() * 0.14,
      w: Math.random() * Math.PI * 2,
      d: 0.25 + Math.random() * 0.35,
    };
    (function anim() {
      s.y += s.vy;
      s.w += 0.007;
      s.x += Math.sin(s.w) * s.d;
      if (s.y > innerHeight + 25) {
        s.y = -25;
        s.x = Math.random() * innerWidth;
      }
      s.el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.w * 10}deg)`;
      s.el.style.opacity = 0.18 + Math.sin(s.w) * 0.1;
      requestAnimationFrame(anim);
    })();
  }

  /* --- Countdown --- */
  const wed = new Date("2026-12-03T08:50:00+05:30");
  const $d = document.getElementById("cd-d"),
    $h = document.getElementById("cd-h"),
    $m = document.getElementById("cd-m"),
    $s = document.getElementById("cd-s");
  const tick = () => {
    const diff = wed - Date.now();
    if (diff <= 0) {
      [$d, $h, $m, $s].forEach((e) => {
        if (e) e.textContent = "🎉";
      });
      return;
    }
    if ($d) $d.textContent = Math.floor(diff / 864e5);
    if ($h) $h.textContent = Math.floor((diff % 864e5) / 36e5);
    if ($m) $m.textContent = Math.floor((diff % 36e5) / 6e4);
    if ($s) $s.textContent = Math.floor((diff % 6e4) / 1e3);
  };
  tick();
  setInterval(tick, 1000);

  /* --- Welcome overlay — language selection + music --- */
  const overlay = document.getElementById("welcome-overlay");
  const musicKn = document.getElementById("bg-music-kn");
  const musicEn = document.getElementById("bg-music-en");
  const sBtn = document.getElementById("sound-toggle");
  let music = null,
    musicStarted = false;

  function startMusic(lang) {
    music = lang === "en" ? musicEn : musicKn;
    music.volume = 0.4;
    music
      .play()
      .then(() => {
        musicStarted = true;
        sBtn.textContent = "🔔";
      })
      .catch(() => {});
  }

  function setLanguage(lang) {
    document.querySelectorAll("[data-" + lang + "]").forEach((el) => {
      el.innerHTML = el.getAttribute("data-" + lang);
    });
    if (lang === "kn") document.body.classList.add("kn-active");
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
      // Spawn flying birds
      const cx = innerWidth / 2,
        cy = innerHeight / 2;
      for (let i = 0; i < 9; i++) {
        const bird = document.createElement("div");
        bird.className = "bird";
        const angle = (Math.PI * 2 * i) / 9 - Math.PI / 2;
        const dist = 150 + Math.random() * 100;
        bird.style.left = cx + "px";
        bird.style.top = cy + "px";
        bird.style.setProperty("--bx", Math.cos(angle) * dist + "px");
        bird.style.setProperty("--by", Math.sin(angle) * dist - 80 + "px");
        bird.style.animationDelay = Math.random() * 0.4 + "s";
        bird.style.animationDuration = 2 + Math.random() * 1.5 + "s";
        bird.innerHTML = `<svg width="28" height="18" viewBox="0 0 28 18" fill="none"><path d="M14 10 Q8 4 0 0 Q6 6 8 10" fill="#b8922e" opacity=".8"/><path d="M14 10 Q20 4 28 0 Q22 6 20 10" fill="#b8922e" opacity=".8"/><ellipse cx="14" cy="11" rx="2" ry="1.5" fill="#8b2332"/></svg>`;
        document.body.appendChild(bird);
        requestAnimationFrame(() => bird.classList.add("fly"));
        setTimeout(() => bird.remove(), 3500);
      }
      setTimeout(() => overlay.classList.add("hidden"), 300);
      startMusic(btn.dataset.lang);
    });
  });

  sBtn?.addEventListener("click", () => {
    if (!music || !musicStarted) return;
    if (music.paused) {
      music.play();
      sBtn.textContent = "🔔";
    } else {
      music.pause();
      sBtn.textContent = "🔇";
    }
  });
})();
