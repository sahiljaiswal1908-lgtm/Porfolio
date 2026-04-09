/* ═══════════════════════════════════════════════
   SAHIL JAISWAL — PORTFOLIO SCRIPTS  ·  V6
   8 Animation Systems · Futuristic UX
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════
     SYSTEM 0 — GLOBAL STATE
     ═══════════════════════════════════════ */
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let scrollY = 0, smoothScrollY = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ═══════════════════════════════════════
     SYSTEM 1 — SMOOTH SCROLL ENGINE (Lenis-style)
     ═══════════════════════════════════════ */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateSmoothScroll() {
    scrollY = window.scrollY;
    smoothScrollY = lerp(smoothScrollY, scrollY, 0.08);
    if (Math.abs(smoothScrollY - scrollY) < 0.5) smoothScrollY = scrollY;
  }


  /* ═══════════════════════════════════════
     SYSTEM 2 — PARTICLE CANVAS
     ═══════════════════════════════════════ */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.glowSpeed = Math.random() * 0.02 + 0.005;
      this.glowPhase = Math.random() * Math.PI * 2;
      const c = Math.random();
      if (c < 0.25)      { this.r=46;this.g=196;this.b=182; }   // teal accent
      else if (c < 0.45) { this.r=255;this.g=107;this.b=107; }   // coral
      else if (c < 0.6)  { this.r=6;this.g=214;this.b=160; }     // mint green
      else if (c < 0.75) { this.r=255;this.g=209;this.b=102; }   // amber
      else if (c < 0.88) { this.r=72;this.g=202;this.b=228; }    // sky cyan
      else                { this.r=118;this.g=120;this.b=237; }   // soft indigo
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.glowPhase += this.glowSpeed;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y, dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 120) { const f = (120-dist)/120*0.3; this.x += (dx/dist)*f; this.y += (dy/dist)*f; }
      }
      if (this.x < -10) this.x = canvas.width+10; if (this.x > canvas.width+10) this.x = -10;
      if (this.y < -10) this.y = canvas.height+10; if (this.y > canvas.height+10) this.y = -10;
    }
    draw() {
      const glow = (Math.sin(this.glowPhase)+1)/2, op = this.opacity*(0.5+glow*0.5);
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${op})`; ctx.fill();
      if (this.size > 1.2) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size*3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${op*0.1})`; ctx.fill();
      }
    }
  }

  const pCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
  for (let i = 0; i < pCount; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 150) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(46,196,182,${(1-dist/150)*0.08})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
  }


  /* ═══════════════════════════════════════
     SYSTEM 3 — HERO TEXT SPLIT ANIMATION
     ═══════════════════════════════════════ */
  function initHeroTextSplit() {
    const nameLines = document.querySelectorAll('.name-line');
    nameLines.forEach(line => {
      // Skip if already has accent spans (like "Jaiswal.")
      const textNodes = [];
      line.childNodes.forEach(node => {
        if (node.nodeType === 3) { // text node
          textNodes.push({ node, text: node.textContent });
        } else if (node.classList && (node.classList.contains('accent') || node.classList.contains('name-period'))) {
          // Wrap each character in accent span
          const text = node.textContent;
          const wrapper = document.createDocumentFragment();
          text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char-animate accent';
            span.textContent = char;
            span.style.setProperty('--char-i', textNodes.reduce((a, t) => a + t.text.length, 0) + i);
            if (node.classList.contains('name-period')) {
              span.classList.add('name-period');
            }
            wrapper.appendChild(span);
          });
          node.replaceWith(wrapper);
        }
      });
      textNodes.forEach(({ node, text }) => {
        const wrapper = document.createDocumentFragment();
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'char-animate';
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.setProperty('--char-i', i);
          wrapper.appendChild(span);
        });
        node.replaceWith(wrapper);
      });
    });

    // Trigger animation after a brief delay
    setTimeout(() => {
      document.querySelectorAll('.char-animate').forEach(c => c.classList.add('char-visible'));
    }, 300);
  }
  initHeroTextSplit();


  /* ═══════════════════════════════════════
     SYSTEM 4 — SCROLL REVEAL (all variants)
     ═══════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur').forEach(el => revealObs.observe(el));


  /* ═══════════════════════════════════════
     SYSTEM 5 — STAGGERED GRID WAVE REVEAL
     ═══════════════════════════════════════ */
  function initStaggeredGrids() {
    document.querySelectorAll('.project-grid, .acad-grid, .skills-grid').forEach(grid => {
      const cards = grid.children;
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      Array.from(cards).forEach((card, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const waveDelay = (row + col) * 0.08;
        card.style.setProperty('--delay', `${waveDelay}s`);
      });
    });
  }
  initStaggeredGrids();


  /* ═══════════════════════════════════════
     SYSTEM 6 — ANIMATED COUNTER (easeOutExpo)
     ═══════════════════════════════════════ */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const text = e.target.textContent;
        const match = text.match(/^(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          const duration = 2000;
          const startTime = performance.now();

          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(target * easedProgress);
            e.target.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => countObs.observe(el));


  /* ═══════════════════════════════════════
     SYSTEM 7 — SKILL BAR FILL ANIMATION
     ═══════════════════════════════════════ */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));


  /* ═══════════════════════════════════════
     SYSTEM 8 — 3D CARD TILT + LIGHT EFFECT
     ═══════════════════════════════════════ */
  function initTiltCards() {
    const tiltCards = document.querySelectorAll('.project-card, .acad-card, .skill-card, .exp-card');

    tiltCards.forEach(card => {
      // Create light reflection overlay
      const lightEl = document.createElement('div');
      lightEl.className = 'tilt-light';
      card.appendChild(lightEl);

      card.addEventListener('mousemove', e => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

        // Move light reflection
        lightEl.style.opacity = '1';
        lightEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.05), transparent 50%)`;

        // Dynamic glow for exp-card
        const glow = card.querySelector('.card-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(46,196,182,.06), rgba(255,107,107,.03) 40%, transparent 60%)`;
          glow.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        lightEl.style.opacity = '0';
        const glow = card.querySelector('.card-glow');
        if (glow) glow.style.opacity = '0';
      });
    });
  }
  initTiltCards();


  /* ═══════════════════════════════════════
     SYSTEM 9 — MAGNETIC CURSOR EFFECTS
     ═══════════════════════════════════════ */
  function initMagneticElements() {
    const magElements = document.querySelectorAll('.dot, .contact-btn, .next-link, .scroll-cue');

    magElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        if (prefersReducedMotion) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        const maxDist = 100;

        if (distance < maxDist) {
          const pull = (1 - distance / maxDist) * 0.4;
          el.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }
  initMagneticElements();


  /* ═══════════════════════════════════════
     SYSTEM 10 — SCROLL-LINKED PARALLAX
     ═══════════════════════════════════════ */
  function updateParallax() {
    const winH = window.innerHeight;

    // Hero content fades and scales on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroProgress = Math.min(smoothScrollY / (winH * 0.6), 1);
      heroContent.style.opacity = 1 - heroProgress;
      heroContent.style.transform = `translateY(${smoothScrollY * 0.3}px) scale(${1 - heroProgress * 0.1})`;
    }

    // Background shapes parallax
    document.querySelectorAll('.hero-shapes').forEach(el => {
      el.style.transform = `translateY(${smoothScrollY * 0.2}px)`;
    });

    // Orbs parallax
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const speed = 0.08 + i * 0.04;
      orb.style.transform = `translateY(${smoothScrollY * speed}px)`;
    });

    // Academic bg effects parallax
    document.querySelectorAll('.acad-bg-effects').forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.12;
      el.style.transform = `translateY(${offset}px)`;
    });

    // Contact shapes parallax
    document.querySelectorAll('.contact-shapes').forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.1;
      el.style.transform = `translateY(${offset}px)`;
    });

    // Section-level scroll progress for clip-path reveals
    document.querySelectorAll('.snap-section').forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionProgress = Math.max(0, Math.min(1, 1 - rect.top / winH));
      section.style.setProperty('--section-progress', sectionProgress);
    });
  }


  /* ═══════════════════════════════════════
     SYSTEM 11 — SECTION TRANSITIONS
     ═══════════════════════════════════════ */
  function initSectionTransitions() {
    const sections = document.querySelectorAll('.snap-section');
    const transObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    sections.forEach(s => transObs.observe(s));
  }
  initSectionTransitions();


  /* ═══════════════════════════════════════
     SCROLL PROGRESS BAR
     ═══════════════════════════════════════ */
  const progressBar = document.getElementById('scroll-progress');


  /* ═══════════════════════════════════════
     NAV DOTS
     ═══════════════════════════════════════ */
  const dots = document.querySelectorAll('.dot');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.dot[data-target="${e.target.id}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.snap-section').forEach(s => sectionObs.observe(s));
  dots.forEach(d => d.addEventListener('click', () => {
    const t = document.getElementById(d.dataset.target);
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  }));


  /* ═══════════════════════════════════════
     MASTER ANIMATION LOOP
     ═══════════════════════════════════════ */
  function masterLoop() {
    // Smooth scroll
    updateSmoothScroll();

    // Particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();

    // Parallax
    updateParallax();

    // Scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = (smoothScrollY / docHeight * 100) + '%';
    }

    requestAnimationFrame(masterLoop);
  }
  masterLoop();


  /* ═══════════════════════════════════════
     DEEP-DIVE PANEL
     ═══════════════════════════════════════ */
  const ddEl       = document.getElementById('deep-dive');
  const ddBackdrop = ddEl.querySelector('.dd-backdrop');
  const ddClose    = ddEl.querySelector('.dd-close');
  const ddTabs     = ddEl.querySelectorAll('.dd-tab');
  const ddDetails  = ddEl.querySelector('.dd-tab-details');
  const ddGallery  = ddEl.querySelector('.dd-tab-gallery');
  const ddTitle    = ddEl.querySelector('.dd-title');
  const ddSubtitle = ddEl.querySelector('.dd-subtitle');
  const ddRole     = ddEl.querySelector('.dd-role');
  const ddBadge    = ddEl.querySelector('.dd-badge');
  const ddBlocks   = ddEl.querySelector('.dd-blocks');
  const ddTagsWrap = ddEl.querySelector('.dd-tags');
  const ddGallGrid = ddEl.querySelector('.dd-gallery-grid');
  const ddNoImages = ddEl.querySelector('.dd-no-images');

  function makeBlock(icon, label, html, color) {
    return `<div class="dd-block"><h4 style="color:${color}">${icon} ${label}</h4><p>${html}</p></div>`;
  }

  function makeSkillTags(skillsStr, color) {
    if (!skillsStr) return '';
    return skillsStr.split(',').map(s =>
      `<span class="tag" style="background:${hexToRgba(color,0.1)};border:1px solid ${hexToRgba(color,0.2)};color:${lighten(color)}">${s.trim()}</span>`
    ).join('');
  }

  function openDeepDive(card) {
    const color   = card.dataset.color || '#a855f7';
    const title   = card.dataset.title;
    const subtitle= card.dataset.subtitle;
    const role    = card.dataset.role;
    const badge   = card.dataset.badge || 'Industry';
    const images  = card.dataset.images ? card.dataset.images.split(',').filter(Boolean) : [];

    ddTitle.textContent = title;
    ddSubtitle.textContent = subtitle;
    ddRole.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg> ${role}`;
    ddRole.style.color = color;
    ddBadge.textContent = badge;
    ddBadge.style.background = hexToRgba(color, 0.12);
    ddBadge.style.color = color;
    ddBadge.style.border = `1px solid ${hexToRgba(color, 0.25)}`;

    let blocksHTML = '';
    if (card.dataset.context)   blocksHTML += makeBlock('📋', 'CONTEXT', card.dataset.context, color);
    if (card.dataset.obj)       blocksHTML += makeBlock('🎯', 'OBJECTIVE', card.dataset.obj, color);
    if (card.dataset.execution) blocksHTML += makeBlock('⚡', 'EXECUTION', card.dataset.execution, color);
    if (card.dataset.insights)  blocksHTML += makeBlock('💡', 'KEY INSIGHTS', card.dataset.insights, color);
    if (card.dataset.impact)    blocksHTML += makeBlock('📈', 'BUSINESS IMPACT', card.dataset.impact, color);
    if (card.dataset.skills)    blocksHTML += `<div class="dd-block"><h4 style="color:${color}">🛠️ SKILLS BUILT</h4><div class="dd-skill-tags">${makeSkillTags(card.dataset.skills, color)}</div></div>`;
    ddBlocks.innerHTML = blocksHTML;

    ddTagsWrap.innerHTML = '';
    ddGallGrid.innerHTML = '';
    ddTabs[1].style.display = '';
    if (images.length > 0) {
      ddNoImages.style.display = 'none';
      ddGallGrid.className = `dd-gallery-grid cols-${Math.min(images.length, 2)}`;
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim(); img.alt = title;
        img.addEventListener('click', () => openFullscreen(img.src));
        ddGallGrid.appendChild(img);
      });
    } else {
      ddNoImages.style.display = 'block';
      ddGallGrid.className = 'dd-gallery-grid';
    }

    ddTabs.forEach(t => t.classList.remove('active'));
    ddTabs[0].classList.add('active');
    ddDetails.classList.add('active');
    ddGallery.classList.remove('active');
    ddEl.querySelector('.dd-panel').scrollTop = 0;
    ddEl.classList.add('open');
    ddEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openAcadDeepDive(card) {
    const color    = card.dataset.color || '#a855f7';
    const title    = card.dataset.title;
    const subtitle = card.dataset.subtitle;
    const badge    = card.dataset.badge || 'Academic';

    ddTitle.textContent = title;
    ddSubtitle.textContent = subtitle;
    ddRole.innerHTML = '';
    ddBadge.textContent = badge;
    ddBadge.style.background = hexToRgba(color, 0.12);
    ddBadge.style.color = color;
    ddBadge.style.border = `1px solid ${hexToRgba(color, 0.25)}`;

    let blocksHTML = '';
    if (card.dataset.obj)      blocksHTML += makeBlock('🎯', 'OBJECTIVE', card.dataset.obj, color);
    if (card.dataset.approach) blocksHTML += makeBlock('⚡', 'APPROACH', card.dataset.approach, color);
    if (card.dataset.learn)    blocksHTML += makeBlock('💡', 'KEY LEARNINGS', card.dataset.learn, color);
    ddBlocks.innerHTML = blocksHTML;

    ddTagsWrap.innerHTML = '';
    ddGallGrid.innerHTML = '';
    ddNoImages.style.display = 'none';

    ddTabs.forEach(t => t.classList.remove('active'));
    ddTabs[0].classList.add('active');
    ddDetails.classList.add('active');
    ddGallery.classList.remove('active');
    ddTabs[1].style.display = 'none';
    ddEl.querySelector('.dd-panel').scrollTop = 0;
    ddEl.classList.add('open');
    ddEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDeepDive() {
    ddEl.classList.remove('open');
    ddEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ddTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ddTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'details') {
        ddDetails.classList.add('active');
        ddGallery.classList.remove('active');
      } else {
        ddDetails.classList.remove('active');
        ddGallery.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.clickable-project').forEach(card => {
    card.addEventListener('click', () => openDeepDive(card));
  });
  document.querySelectorAll('.clickable-acad').forEach(card => {
    card.addEventListener('click', () => openAcadDeepDive(card));
  });

  ddBackdrop.addEventListener('click', closeDeepDive);
  ddClose.addEventListener('click', closeDeepDive);


  /* ═══════════════════════════════════════
     FULLSCREEN IMAGE VIEWER
     ═══════════════════════════════════════ */
  const fsOverlay = document.getElementById('img-fullscreen');
  const fsImg = fsOverlay.querySelector('img');

  function openFullscreen(src) {
    fsImg.src = src;
    fsOverlay.classList.add('open');
  }

  fsOverlay.addEventListener('click', () => fsOverlay.classList.remove('open'));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (fsOverlay.classList.contains('open')) fsOverlay.classList.remove('open');
      else if (ddEl.classList.contains('open')) closeDeepDive();
    }
  });


  /* ═══════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════ */
  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function lighten(hex) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0,2),16);
    let g = parseInt(hex.substring(2,4),16);
    let b = parseInt(hex.substring(4,6),16);
    r = Math.min(255, r + 60);
    g = Math.min(255, g + 60);
    b = Math.min(255, b + 60);
    return `rgb(${r},${g},${b})`;
  }

});
