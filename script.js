/* =========================================================
   Cynthia Portfolio - Clean, practical, fully functional JS
   (Fixes: hamburger, smooth scroll, Formspree modal, etc.)
========================================================= */
// =========================
// Premium Loader (toned down)
// =========================
(function initPremiumLoader() {
  const loader = document.getElementById("page-loader");
  const particleWrap = document.getElementById("qParticles");
  const status = document.getElementById("qStatus");
  if (!loader) return;

  document.body.classList.add("is-loading");

  // Minimal particles (performance-safe)
  if (particleWrap) {
    const colors = ["#00ffff", "#8b5cf6", "#ec4899"];
    const N = 30;
    for (let i = 0; i < N; i++) {
      const p = document.createElement("span");
      p.className = "p";
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${Math.random() * 30}px`;
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = `${2.2 + Math.random() * 2.8}s`;
      p.style.animationDelay = `${Math.random() * 1.8}s`;
      p.style.opacity = `${0.35 + Math.random() * 0.55}`;
      p.style.width = p.style.height = `${2 + Math.random() * 2}px`;
      particleWrap.appendChild(p);
    }
  }

  // Soft rotating status text (not spammy)
  const messages = [
    "Initializing experience…",
    "Loading portfolio assets…",
    "Warming up visuals…",
  ];
  let i = 0;
  const t = setInterval(() => {
    if (status) status.textContent = messages[i % messages.length];
    i++;
  }, 650);

  const MIN_SHOW_MS = 2000;
  const start = performance.now();

  window.addEventListener("load", () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(() => {
      clearInterval(t);
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      document.body.classList.add("loaded");
      setTimeout(() => loader.remove(), 900);
    }, wait);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Sticky navbar on scroll
  // -------------------------
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector("#home");

  const handleSticky = () => {
    if (!navbar) return;
    const heroHeight = hero ? hero.offsetHeight : 600;
    const triggerY = Math.min(140, heroHeight * 0.25);
    navbar.classList.toggle("is-sticky", window.scrollY > triggerY);
  };

  window.addEventListener("scroll", handleSticky, { passive: true });
  handleSticky();

  // -------------------------
  // Mobile menu (Hamburger)
  // -------------------------
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector("#mobile-menu");
  const menuOverlay = document.querySelector(".menu-overlay");

  const setMenuOpen = (open) => {
    if (!hamburger) return;
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));

    if (mobileMenu) mobileMenu.classList.toggle("active", open);
    if (menuOverlay) menuOverlay.classList.toggle("active", open);

    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !open);
      icon.classList.toggle("fa-times", open);
    }
    document.body.classList.toggle("menu-open", open);
  };

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const open = !hamburger.classList.contains("active");
      setMenuOpen(open);
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", () => setMenuOpen(false));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  document.querySelectorAll("#mobile-menu a.nav-link").forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  // -------------------------
  // Smooth scroll (anchors)
  // -------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navOffset = navbar ? navbar.offsetHeight + 16 : 90;
      const y = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  // -------------------------
  // Typewriter (optional)
  // -------------------------
  const tw = document.getElementById("typewriter");
  if (tw) {
    const texts = [
      "Full-Stack Developer",
      "Data Analyst",
      "UI/UX Designer",
      "Creative Problem Solver",
    ];
    let t = 0;
    let c = 0;
    let del = false;

    const tick = () => {
      const full = texts[t];
      c = del ? c - 1 : c + 1;
      tw.textContent = full.slice(0, c);

      const doneTyping = !del && c === full.length;
      const doneDeleting = del && c === 0;

      let delay = del ? 35 : 55;
      if (doneTyping) {
        delay = 1100;
        del = true;
      } else if (doneDeleting) {
        del = false;
        t = (t + 1) % texts.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    };
    tick();
  }

  // -------------------------
  // Project modal (index)
  // -------------------------
  window.openProjectModal = function (html) {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    const body = modal.querySelector(".modal-body");
    if (body) body.innerHTML = html || "";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  };

  // Close project modal by clicking backdrop area
  const projectModal = document.getElementById("project-modal");
  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) window.closeProjectModal();
    });
  }

  // -------------------------
  // Thank-you modal (Formspree)
  // -------------------------
  const thanksModal = document.getElementById("thanksModal");
  const thanksMsg = document.getElementById("thanksMessage");

  const showThanksModal = (message) => {
    if (!thanksModal) return;
    if (thanksMsg && message) thanksMsg.textContent = message;
    thanksModal.classList.add("is-open");
    thanksModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeThanksModal = () => {
    if (!thanksModal) return;
    thanksModal.classList.remove("is-open");
    thanksModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  window.closeThanksModal = closeThanksModal;

  if (thanksModal) {
    thanksModal.addEventListener("click", (e) => {
      const close = e.target.closest("[data-close='true']");
      if (close) closeThanksModal();
    });
  }

  // -------------------------
  // Contact form submit (stay on page + popup)
  // -------------------------
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const sendBtn = document.getElementById("sendBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (sendBtn) {
        sendBtn.classList.add("is-sending");
        sendBtn.disabled = true;
      }
      if (formStatus) {
        formStatus.textContent = "";
      }

      try {
        const formData = new FormData(contactForm);
        const endpoint = contactForm.getAttribute("action");

        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          contactForm.reset();
          showThanksModal(
            "Thanks for reaching out! I’ll get back to you within 24 hours."
          );
          if (formStatus) {
            formStatus.textContent =
              "Message received ✅ I’ll reply within 24 hours.";
            formStatus.style.color = "#22c55e";
          }
        } else {
          if (formStatus) {
            formStatus.textContent =
              "Oops — something went wrong. Please try again.";
            formStatus.style.color = "#ef4444";
          }
        }
      } catch (err) {
        if (formStatus) {
          formStatus.textContent =
            "Network error — please check your internet and try again.";
          formStatus.style.color = "#ef4444";
        }
      } finally {
        if (sendBtn) {
          sendBtn.classList.remove("is-sending");
          sendBtn.disabled = false;
        }
      }
    });
  }
});

// =========================
// PART 1: NAVBAR & BACKGROUND EFFECTS (keep this from your current script)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector("#home");

  if (navbar) {
    const showAfter = () => {
      const heroHeight = hero ? hero.offsetHeight : 600;
      const triggerY = Math.min(140, heroHeight * 0.25);

      if (window.scrollY > triggerY) {
        navbar.classList.add("is-sticky");
      } else {
        navbar.classList.remove("is-sticky");
      }
    };

    window.addEventListener("scroll", showAfter, { passive: true });
    showAfter();
  }

  // Enhanced Plexus Background with Interactive Effects
  const canvas = document.getElementById("poly-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let dots = [];
    let mouse = { x: null, y: null, radius: 100 };
    let animationId;
    let time = 0;

    // Interactive zones that affect particles
    let interactiveZones = [];
    let clickEffects = [];

    // Color palette with multiple options
    const colorSchemes = {
      primary: {
        dot: "rgba(255, 111, 97, 0.9)",
        line: "rgba(212, 165, 255, 0.3)",
        glow: "rgba(255, 111, 97, 0.15)",
      },
      secondary: {
        dot: "rgba(97, 168, 255, 0.9)",
        line: "rgba(165, 220, 255, 0.3)",
        glow: "rgba(97, 168, 255, 0.15)",
      },
      neon: {
        dot: "rgba(0, 255, 157, 0.9)",
        line: "rgba(255, 0, 242, 0.3)",
        glow: "rgba(0, 255, 157, 0.15)",
      },
    };

    let currentScheme = "primary";

    // Mouse tracking with smoothing
    const mouseTrail = [];
    const maxTrailLength = 5;

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Add to trail for secondary effects
      mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      if (mouseTrail.length > maxTrailLength) mouseTrail.shift();
    });

    // Click effect
    document.addEventListener("click", (e) => {
      clickEffects.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200,
        life: 1,
      });
    });

    // Touch support for mobile
    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
      initInteractiveZones();
    }

    function initInteractiveZones() {
      interactiveZones = [];

      // Create some automatic interactive zones
      const zoneCount = 3;
      for (let i = 0; i < zoneCount; i++) {
        interactiveZones.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 100 + Math.random() * 150,
          strength: 0.5 + Math.random() * 1,
          type: Math.random() > 0.5 ? "attract" : "repel",
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function initDots() {
      dots = [];
      const numDots = Math.floor((width * height) / 12000); // Increased density
      for (let i = 0; i < numDots; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 1;
        const speed = 0.3 + Math.random() * 0.4;

        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: radius,
          originalRadius: radius,
          color: colorSchemes[currentScheme].dot,
          connectionCount: 0,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawDot(dot, alpha = 1) {
      // Pulsing effect
      const pulse = Math.sin(time * 0.002 + dot.pulseOffset) * 0.5 + 0.5;
      const currentRadius = dot.radius * (0.8 + pulse * 0.4);

      // Glow effect
      const gradient = ctx.createRadialGradient(
        dot.x,
        dot.y,
        0,
        dot.x,
        dot.y,
        currentRadius * 3
      );

      gradient.addColorStop(0, dot.color.replace("0.9", alpha.toString()));
      gradient.addColorStop(
        0.5,
        dot.color.replace("0.9", (alpha * 0.3).toString())
      );
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(
        dot.x - currentRadius * 0.3,
        dot.y - currentRadius * 0.3,
        currentRadius * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    function updateDots() {
      // Update interactive zones
      interactiveZones.forEach((zone) => {
        zone.pulse += 0.02;
        zone.radius = 80 + Math.sin(zone.pulse) * 40;
      });

      // Update click effects
      for (let i = clickEffects.length - 1; i >= 0; i--) {
        const effect = clickEffects[i];
        effect.radius += 5;
        effect.life -= 0.02;

        if (effect.life <= 0 || effect.radius > effect.maxRadius) {
          clickEffects.splice(i, 1);
        }
      }

      dots.forEach((dot) => {
        // Mouse interaction with trail
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = Math.pow((mouse.radius - dist) / mouse.radius, 2) * 4;
            const angle = Math.atan2(dy, dx);
            dot.x -= Math.cos(angle) * force;
            dot.y -= Math.sin(angle) * force;
          }

          // Mouse trail interaction
          mouseTrail.forEach((trailPoint, index) => {
            const trailDx = trailPoint.x - dot.x;
            const trailDy = trailPoint.y - dot.y;
            const trailDist = Math.sqrt(trailDx * trailDx + trailDy * trailDy);

            if (trailDist < 60) {
              const trailForce =
                ((60 - trailDist) / 60) * 1.5 * (index / mouseTrail.length);
              const trailAngle = Math.atan2(trailDy, trailDx);
              dot.x += Math.cos(trailAngle) * trailForce;
              dot.y += Math.sin(trailAngle) * trailForce;
            }
          });
        }

        // Interactive zones
        interactiveZones.forEach((zone) => {
          const dx = zone.x - dot.x;
          const dy = zone.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < zone.radius) {
            const strength =
              Math.pow((zone.radius - dist) / zone.radius, 2) * zone.strength;
            const angle = Math.atan2(dy, dx);

            if (zone.type === "attract") {
              dot.x += Math.cos(angle) * strength;
              dot.y += Math.sin(angle) * strength;
            } else {
              dot.x -= Math.cos(angle) * strength;
              dot.y -= Math.sin(angle) * strength;
            }
          }
        });

        // Click effects
        clickEffects.forEach((effect) => {
          const dx = effect.x - dot.x;
          const dy = effect.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < effect.radius) {
            const force =
              Math.pow((effect.radius - dist) / effect.radius, 2) *
              effect.life *
              6;
            const angle = Math.atan2(dy, dx);
            dot.x += Math.cos(angle) * force;
            dot.y += Math.sin(angle) * force;
          }
        });

        // Natural movement with boundary wrapping
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap around edges
        if (dot.x < -50) dot.x = width + 50;
        if (dot.x > width + 50) dot.x = -50;
        if (dot.y < -50) dot.y = height + 50;
        if (dot.y > height + 50) dot.y = -50;
      });
    }

    function drawConnections() {
      dots.sort((a, b) => a.y - b.y); // Sort for better layering

      // Reset connection counts
      dots.forEach((dot) => (dot.connectionCount = 0));

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            // Calculate opacity based on distance
            const opacity = Math.pow(1 - distance / 120, 2) * 0.3;

            // Line gradient based on dot positions
            const gradient = ctx.createLinearGradient(
              dots[i].x,
              dots[i].y,
              dots[j].x,
              dots[j].y
            );

            gradient.addColorStop(
              0,
              colorSchemes[currentScheme].line.replace(
                "0.3",
                opacity.toString()
              )
            );
            gradient.addColorStop(
              1,
              colorSchemes[currentScheme].line.replace(
                "0.3",
                (opacity * 0.7).toString()
              )
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 + (1 - distance / 120) * 1.5;

            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);

            // Add subtle curve for organic feel
            const midX = (dots[i].x + dots[j].x) / 2;
            const midY = (dots[i].y + dots[j].y) / 2;
            const offset = Math.sin(time * 0.003 + i + j) * 3;

            ctx.quadraticCurveTo(
              midX + Math.cos(time * 0.001 + i) * offset,
              midY + Math.sin(time * 0.001 + i) * offset,
              dots[j].x,
              dots[j].y
            );

            ctx.stroke();

            dots[i].connectionCount++;
            dots[j].connectionCount++;
          }
        }
      }
    }

    function drawEffects() {
      // Draw click effects
      clickEffects.forEach((effect) => {
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.strokeStyle = colorSchemes[currentScheme].glow.replace(
          "0.15",
          (effect.life * 0.3).toString()
        );
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw interactive zones
      interactiveZones.forEach((zone) => {
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.strokeStyle =
          zone.type === "attract"
            ? "rgba(0, 255, 157, 0.1)"
            : "rgba(255, 0, 100, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Add subtle background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "rgba(10, 10, 20, 0.05)");
      bgGradient.addColorStop(1, "rgba(20, 10, 30, 0.05)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      time++;

      updateDots();
      drawConnections();

      // Draw dots with connection-based size
      dots.forEach((dot) => {
        const sizeMultiplier = 1 + Math.min(dot.connectionCount * 0.1, 0.5);
        dot.radius = dot.originalRadius * sizeMultiplier;
        drawDot(dot);
      });

      drawEffects();

      // Subtle vignette effect
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.1)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(animate);
    }

    // Performance optimization for inactive tabs
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });

    window.addEventListener("resize", resizeCanvas);

    // Initialize
    resizeCanvas();
    animate();
  }

  // Enhanced Custom Cursor
  const cursor = document.querySelector(".custom-cursor");

  if (cursor) {
    let cursorX = 0;
    let cursorY = 0;
    let cursorTrail = [];
    const trailLength = 5;
    let isHovering = false;
    let cursorScale = 1;

    // Create cursor trail elements
    for (let i = 0; i < trailLength; i++) {
      const trailDot = document.createElement("div");
      trailDot.className = "cursor-trail";
      trailDot.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: rgba(212, 165, 255, ${0.5 - i * 0.1});
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: opacity 0.2s ease;
    `;
      document.body.appendChild(trailDot);
      cursorTrail.push({ el: trailDot, x: 0, y: 0 });
    }

    // Smooth cursor movement with trail
    function updateCursor(e) {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Update trail with delay
      cursorTrail.forEach((trail, index) => {
        setTimeout(() => {
          trail.x = cursorX;
          trail.y = cursorY;
          trail.el.style.left = trail.x + "px";
          trail.el.style.top = trail.y + "px";
          trail.el.style.opacity = isHovering ? "0.3" : "0.5";
        }, index * 20);
      });

      // Main cursor
      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";

      // Add slight rotation on movement
      const velocityX = e.movementX || 0;
      const velocityY = e.movementY || 0;
      const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      const rotation = velocity * 0.02;

      cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${cursorScale})`;
    }

    document.addEventListener("mousemove", updateCursor);

    // Enhanced hover detection
    const hoverables = document.querySelectorAll(
      'a, button, .btn, [role="button"], input, select, textarea, label, .clickable, .hover-effect, [data-cursor-hover]'
    );

    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", (e) => {
        cursor.classList.add("hover");
        isHovering = true;
        cursorScale = 1.5;

        // Add specific class based on element type
        if (el.tagName === "A") cursor.classList.add("hover-link");
        if (el.tagName === "BUTTON") cursor.classList.add("hover-button");
        if (el.tagName === "INPUT") cursor.classList.add("hover-input");

        // Add ripple effect on some elements
        if (el.hasAttribute("data-cursor-ripple")) {
          const ripple = document.createElement("div");
          ripple.className = "cursor-ripple";
          ripple.style.cssText = `
          position: absolute;
          width: 50px;
          height: 50px;
          border: 2px solid rgba(212, 165, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
          animation: ripple 0.6s ease-out forwards;
          z-index: 9999;
        `;
          document.body.appendChild(ripple);

          setTimeout(() => {
            ripple.style.left = e.clientX - 25 + "px";
            ripple.style.top = e.clientY - 25 + "px";
          }, 10);

          setTimeout(() => ripple.remove(), 600);
        }
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove(
          "hover",
          "hover-link",
          "hover-button",
          "hover-input"
        );
        isHovering = false;
        cursorScale = 1;
      });
    });

    // Click animation
    document.addEventListener("mousedown", () => {
      cursor.classList.add("click");
      cursorScale = 0.8;
    });

    document.addEventListener("mouseup", () => {
      cursor.classList.remove("click");
      cursorScale = isHovering ? 1.5 : 1;
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorTrail.forEach((trail) => (trail.el.style.opacity = "0"));
    });

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      cursorTrail.forEach((trail) => (trail.el.style.opacity = "0.5"));
    });

    // Add CSS for ripple animation
    if (!document.querySelector("#cursor-styles")) {
      const style = document.createElement("style");
      style.id = "cursor-styles";
      style.textContent = `
      @keyframes ripple {
        0% { transform: scale(0.1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes cursorPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
      }
      
      .custom-cursor.hover {
        animation: cursorPulse 2s infinite;
      }
    `;
      document.head.appendChild(style);
    }
    // Enhanced Typewriter Effect });

    // Add this to your script.js file, replacing the existing typewriter code

    // Enhanced Typewriter Effect
    const typewriterTexts = [
      "Full-Stack Developer",
      "Data Analyst",
      "Graphic Designer",
    ];
    const typewriterElement = document.getElementById("typewriter");
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
      const currentText = typewriterTexts[textIndex];

      if (isDeleting) {
        // Deleting text
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting
      } else {
        // Typing text
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
      }

      // Check if we're done with current text
      if (!isDeleting && charIndex === currentText.length) {
        // Pause at the end of typing
        typingSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Move to next text
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        typingSpeed = 500; // Pause before starting next text
      }

      setTimeout(typeWriter, typingSpeed);
    }

    // Start typewriter after page loads
    window.addEventListener("load", () => {
      setTimeout(typeWriter, 1000);
    });

    // Optional: click feedback
    document.addEventListener("mousedown", () => {
      if (cursor) cursor.classList.add("active");
    });

    document.addEventListener("mouseup", () => {
      if (cursor) cursor.classList.remove("active");
    });

    // Hide cursor when mouse leaves window (helps on some browsers)
    document.addEventListener("mouseleave", () => {
      if (cursor) cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      if (cursor) cursor.style.opacity = "1";
    });
  }
  // script.js - Basic functionality
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Portfolio website loaded");

    // COMPLETE PORTFOLIO SCRIPT WITH WORKING TYPEWRITER
    document.addEventListener("DOMContentLoaded", function () {
      console.log("=== PORTFOLIO SCRIPT LOADED ===");

      document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById("typewriter");
        if (!el) {
          console.error("❌ #typewriter not found in HTML");
          return;
        }

        const texts = [
          "Full-Stack Developer",
          "Data Analyst",
          "UI/UX Designer",
          "Creative Problem Solver",
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function tick() {
          const full = texts[textIndex];

          if (isDeleting) {
            charIndex--;
          } else {
            charIndex++;
          }

          el.textContent = full.slice(0, charIndex);

          let delay = isDeleting ? 50 : 100;

          // pause at end
          if (!isDeleting && charIndex === full.length) {
            isDeleting = true;
            delay = 2000;
          }

          // move to next word
          if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
          }

          setTimeout(tick, delay);
        }

        tick();
      });
    });
    document.head.appendChild(style);
    // Portfolio Filtering & Search
    document.addEventListener("DOMContentLoaded", function () {
      const grid = document.getElementById("portfolio-grid");
      const items = document.querySelectorAll(".portfolio-item");
      const filterBtns = document.querySelectorAll(".filter-btn");
      const searchInput = document.querySelector(".search-input");
      const emptyState = document.getElementById("portfolio-empty");
      const loadMoreBtn = document.getElementById("load-more");
      const statCounts = document.querySelectorAll(".stat-count");

      let visibleItems = 3;
      const totalItems = items.length;

      // Animate stats counter
      statCounts.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-count"));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent =
            Math.floor(current) + (stat.textContent.includes("+") ? "+" : "");
        }, 16);
      });

      // Filter functionality
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          filterProjects();
        });
      });

      // Search functionality
      searchInput.addEventListener("input", filterProjects);

      // Load more functionality
      loadMoreBtn.addEventListener("click", () => {
        loadMoreBtn.classList.add("loading");

        setTimeout(() => {
          visibleItems += 3;
          updateVisibleItems();
          loadMoreBtn.classList.remove("loading");

          if (visibleItems >= totalItems) {
            loadMoreBtn.style.display = "none";
          }

          document.querySelector(
            ".load-more-info"
          ).textContent = `Showing ${Math.min(
            visibleItems,
            totalItems
          )} of ${totalItems} projects`;
        }, 600);
      });

      function filterProjects() {
        const activeFilter =
          document.querySelector(".filter-btn.active").dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();

        let visibleCount = 0;

        items.forEach((item, index) => {
          const category = item.dataset.category;
          const tags = item.dataset.tags.toLowerCase();
          const title = item
            .querySelector(".project-title")
            .textContent.toLowerCase();
          const description = item
            .querySelector(".project-description")
            .textContent.toLowerCase();

          const matchesFilter =
            activeFilter === "all" || category.includes(activeFilter);
          const matchesSearch =
            !searchTerm ||
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            tags.includes(searchTerm);

          if (matchesFilter && matchesSearch && index < visibleItems) {
            item.style.display = "block";
            visibleCount++;
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, index * 50);
          } else {
            item.style.display = "none";
          }
        });
        // Portfolio Filtering & Search
        document.addEventListener("DOMContentLoaded", function () {
          const grid = document.getElementById("portfolio-grid");
          const items = document.querySelectorAll(".portfolio-item");
          const filterBtns = document.querySelectorAll(".filter-btn");
          const searchInput = document.querySelector(".search-input");
          const emptyState = document.getElementById("portfolio-empty");
          const loadMoreBtn = document.getElementById("load-more");
          const statCounts = document.querySelectorAll(".stat-count");

          let visibleItems = 3;
          const totalItems = items.length;

          // Animate stats counter
          statCounts.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-count"));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              stat.textContent =
                Math.floor(current) +
                (stat.textContent.includes("+") ? "+" : "");
            }, 16);
          });

          // Filter functionality
          filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
              filterBtns.forEach((b) => b.classList.remove("active"));
              btn.classList.add("active");
              filterProjects();
            });
          });

          // Search functionality
          searchInput.addEventListener("input", filterProjects);

          // Load more functionality
          loadMoreBtn.addEventListener("click", () => {
            loadMoreBtn.classList.add("loading");

            setTimeout(() => {
              visibleItems += 3;
              updateVisibleItems();
              loadMoreBtn.classList.remove("loading");

              if (visibleItems >= totalItems) {
                loadMoreBtn.style.display = "none";
              }

              document.querySelector(
                ".load-more-info"
              ).textContent = `Showing ${Math.min(
                visibleItems,
                totalItems
              )} of ${totalItems} projects`;
            }, 600);
          });

          function filterProjects() {
            const activeFilter =
              document.querySelector(".filter-btn.active").dataset.filter;
            const searchTerm = searchInput.value.toLowerCase();

            let visibleCount = 0;

            items.forEach((item, index) => {
              const category = item.dataset.category;
              const tags = item.dataset.tags.toLowerCase();
              const title = item
                .querySelector(".project-title")
                .textContent.toLowerCase();
              const description = item
                .querySelector(".project-description")
                .textContent.toLowerCase();

              const matchesFilter =
                activeFilter === "all" || category.includes(activeFilter);
              const matchesSearch =
                !searchTerm ||
                title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                tags.includes(searchTerm);

              if (matchesFilter && matchesSearch && index < visibleItems) {
                item.style.display = "block";
                visibleCount++;
                setTimeout(() => {
                  item.style.opacity = "1";
                  item.style.transform = "translateY(0)";
                }, index * 50);
              } else {
                item.style.display = "none";
              }
            });

            // Show/hide empty state
            if (visibleCount === 0) {
              emptyState.style.display = "block";
              grid.style.display = "none";
            } else {
              emptyState.style.display = "none";
              grid.style.display = "grid";
            }
          }

          function updateVisibleItems() {
            items.forEach((item, index) => {
              if (index < visibleItems) {
                item.style.display = "block";
                setTimeout(() => {
                  item.style.opacity = "1";
                  item.style.transform = "translateY(0)";
                }, index * 50);
              }
            });
          }

          // Initial setup
          updateVisibleItems();
        });

        // Project modal functions
        function openProjectModal(projectId) {
          const modal = document.getElementById("project-modal");
          const modalBody = modal.querySelector(".modal-body");

          // In a real implementation, you would fetch project details from a data source
          modalBody.innerHTML = ``;

          modal.style.display = "block";
          document.body.style.overflow = "hidden";
        }

        function closeProjectModal() {
          const modal = document.getElementById("project-modal");
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }

        // Other utility functions
        function openLivePreview(url) {
          window.open(url, "_blank");
        }

        function openSourceCode(url) {
          window.open(url, "_blank");
        }

        function openCaseStudy(projectId) {
          // Implement case study modal or page navigation
          console.log("Opening case study for:", projectId);
        }

        function resetFilters() {
          document.querySelector('.filter-btn[data-filter="all"]').click();
          document.querySelector(".search-input").value = "";
          filterProjects();
        }

        // Close modal on ESC
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") closeProjectModal();
        });

        // Close modal on outside click
        document
          .getElementById("project-modal")
          .addEventListener("click", (e) => {
            if (e.target === document.getElementById("project-modal")) {
              closeProjectModal();
            }
          });
        // Show/hide empty state
        if (visibleCount === 0) {
          emptyState.style.display = "block";
          grid.style.display = "none";
        } else {
          emptyState.style.display = "none";
          grid.style.display = "grid";
        }
      }

      function updateVisibleItems() {
        items.forEach((item, index) => {
          if (index < visibleItems) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, index * 50);
          }
        });
      }

      // Initial setup
      updateVisibleItems();
    });

    // Project modal functions
    function openProjectModal(projectId) {
      const modal = document.getElementById("project-modal");
      const modalBody = modal.querySelector(".modal-body");

      // In a real implementation, you would fetch project details from a data source
      modalBody.innerHTML = `
    <div class="modal-project">
      <div class="modal-header">
        <h2>Project Details</h2>
      </div>
      <div class="modal-image">
        <img src="./path-to-large-image.jpg" alt="Project Large Preview">
      </div>
      <div class="modal-info">
        <h3>Project Title</h3>
        <p>Detailed project description goes here...</p>
        <div class="modal-tech">
          <h4>Technologies Used</h4>
          <div class="tech-list">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
          </div>
        </div>
        <div class="modal-links">
          <a href="#" class="modal-link">
            <i class="fas fa-external-link-alt"></i>
            Live Demo
          </a>
          <a href="#" class="modal-link">
            <i class="fab fa-github"></i>
            View Code
          </a>
        </div>
      </div>
    </div>
  `;

      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }

    function closeProjectModal() {
      const modal = document.getElementById("project-modal");
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }

    // Other utility functions
    function openLivePreview(url) {
      window.open(url, "_blank");
    }

    function openSourceCode(url) {
      window.open(url, "_blank");
    }

    function openCaseStudy(projectId) {
      // Implement case study modal or page navigation
      console.log("Opening case study for:", projectId);
    }

    function resetFilters() {
      document.querySelector('.filter-btn[data-filter="all"]').click();
      document.querySelector(".search-input").value = "";
      filterProjects();
    }

    // Close modal on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeProjectModal();
    });

    // Close modal on outside click
    const projectModalEl = document.getElementById("project-modal");
    if (projectModalEl)
      projectModalEl.addEventListener("click", (e) => {
        if (e.target === document.getElementById("project-modal")) {
          closeProjectModal();
        }
      });

    // Mobile menu toggle
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuOverlay = document.querySelector(".menu-overlay");

    if (hamburger) {
      const setHamburgerState = (isOpen) => {
        hamburger.classList.toggle("active", isOpen);
        if (mobileMenu) mobileMenu.classList.toggle("active", isOpen);
        if (menuOverlay) menuOverlay.classList.toggle("active", isOpen);

        hamburger.setAttribute("aria-expanded", String(isOpen));
        const icon = hamburger.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-bars", !isOpen);
          icon.classList.toggle("fa-times", isOpen);
        }
      };

      hamburger.addEventListener("click", () => {
        const isOpen = !hamburger.classList.contains("active");
        setHamburgerState(isOpen);
      });

      // Close on any mobile link click
      document.querySelectorAll(".mobile-menu a.nav-link").forEach((link) => {
        link.addEventListener("click", () => setHamburgerState(false));
      });

      // Close on ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setHamburgerState(false);
      });
    }

    // Close mobile menu when clicking overlay
    if (menuOverlay) {
      menuOverlay.addEventListener("click", () => {
        if (hamburger) hamburger.classList.remove("active");
        if (mobileMenu) mobileMenu.classList.remove("active");
        if (menuOverlay) menuOverlay.classList.remove("active");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
        const icon = hamburger ? hamburger.querySelector("i") : null;
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Close mobile menu if open
          if (hamburger && hamburger.classList.contains("active")) {
            hamburger.classList.remove("active");
            mobileMenu.classList.remove("active");
            menuOverlay.classList.remove("active");
          }

          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });

    // Back to top button visibility (guarded)
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.pageYOffset > 300) backToTop.classList.add("visible");
          else backToTop.classList.remove("visible");
        },
        { passive: true }
      );
    }
    // Lightbox functions
    window.openLightbox = function (imageSrc, caption) {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      const lightboxCaption = document.getElementById("lightbox-caption");

      lightboxImg.src = imageSrc;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    window.closeLightbox = function () {
      const lightbox = document.getElementById("lightbox");
      lightbox.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    // Close lightbox on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });

    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const sendBtn = document.getElementById("sendBtn");

    if (contactForm) {
      contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        sendBtn.classList.add("is-sending");
        sendBtn.textContent = "Sending...";

        try {
          const formData = new FormData(this);
          const endpoint = this.dataset.endpoint || this.action;
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          });

          if (response.ok) {
            contactForm.reset();
            showThanksModal(
              "Thanks for reaching out! I’ll get back to you within 24 hours."
            );
            formStatus.textContent =
              "Message received. I’ll reply within 24 hours.";
            formStatus.style.color = "#4ade80";
          } else {
            formStatus.textContent =
              "Oops! Something went wrong. Please try again.";
            formStatus.style.color = "#ff6f61";
          }
        } catch (error) {
          formStatus.textContent =
            "Network error. Please check your connection.";
          formStatus.style.color = "#ff6f61";
        }

        formStatus.classList.add("show");
        sendBtn.classList.remove("is-sending");
        sendBtn.textContent = "Launch Message";

        setTimeout(() => {
          formStatus.classList.remove("show");
        }, 5000);
      });
    }
  });

  // Thank-you modal helpers (Formspree)
  function showThanksModal(message) {
    const modal = document.getElementById("thanksModal");
    const msg = document.getElementById("thanksMessage");
    if (!modal) return;

    if (msg && message) msg.textContent = message;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeThanksModal() {
    const modal = document.getElementById("thanksModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // Close modal on click (backdrop / close btn) + ESC
  document.addEventListener("click", (e) => {
    const closeTarget = e.target.closest("[data-close='true']");
    if (closeTarget) closeThanksModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeThanksModal();
  });

  function showDemoComingSoon() {
    alert("Demo coming soon! The climate dashboard will be available shortly.");
    // Or show a nicer modal/popup
  }
  // =========================
  // PART 2: DEMOS - COMPLETE WORKING VERSION
  // =========================

  console.log("Initializing demos...");

  // Simple utilities
  const utils = {
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    distance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
  };

  // Global animation scheduler
  const scheduler = {
    callbacks: [],
    running: false,
    fps: 60,
    add(callback) {
      this.callbacks.push(callback);
      if (!this.running) this.start();
    },
    start() {
      this.running = true;
      this.loop();
    },
    loop() {
      if (!this.running) return;
      requestAnimationFrame(() => this.loop());
      this.callbacks.forEach((cb) => cb());
    },
  };

  // Global pause state
  let isPaused = false;

  // =========================
  // DEMO 1: PARTICLE GALAXY
  // =========================
  class ParticleGalaxy {
    constructor() {
      console.log("Creating Particle Galaxy...");

      this.canvas = document.getElementById("galaxyCanvas");
      if (!this.canvas) {
        console.error("Particle Galaxy: Canvas not found");
        return;
      }

      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = 300;

      this.particles = [];
      this.blackHoles = [];
      this.gravity = 1.0;
      this.trailOpacity = 0.8;
      this.lastTime = 0;
      this.fps = 60;

      // Create initial stars
      this.createStars(150);

      // Setup controls
      this.setupControls();

      // Start animation
      this.animate();

      console.log("✓ Particle Galaxy ready");
    }

    createStars(count) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 100 + 200}, 100%, 70%)`,
          trail: [],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 1.6 + 0.4,
        });
      }
      this.updateStats();
    }

    addStar(x, y) {
      this.particles.push({
        x: x || Math.random() * this.canvas.width,
        y: y || Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        trail: [],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 1.6 + 0.4,
      });
      this.updateStats();
    }

    addBlackHole(x, y) {
      this.blackHoles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height / 2,
        radius: 15,
        mass: 1000,
        glowPulse: 0,
      });
      this.updateStats();
    }

    reset() {
      this.particles = [];
      this.blackHoles = [];
      this.createStars(150);
    }

    animate(timestamp) {
      // Calculate FPS
      if (this.lastTime) {
        this.fps = Math.round(1000 / (timestamp - this.lastTime));
      }
      this.lastTime = timestamp;

      // Update FPS display
      const fpsEl = document.getElementById("galaxyFPS");
      if (fpsEl) fpsEl.textContent = this.fps;

      // Clear with trail effect
      this.ctx.fillStyle = `rgba(15, 23, 42, ${1 - this.trailOpacity})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Update particles
      this.particles.forEach((p) => {
        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 15) p.trail.shift();

        // Gravity from black holes
        this.blackHoles.forEach((bh) => {
          const dx = bh.x - p.x;
          const dy = bh.y - p.y;
          const dist = Math.max(10, Math.sqrt(dx * dx + dy * dy));
          const force = (bh.mass / (dist * dist)) * this.gravity * 0.1;

          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -0.9;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -0.9;

        // Keep in bounds
        p.x = Math.max(0, Math.min(p.x, this.canvas.width));
        p.y = Math.max(0, Math.min(p.y, this.canvas.height));

        // Draw trail
        p.trail.forEach((point, i) => {
          const alpha = (i / p.trail.length) * 0.5;
          this.ctx.fillStyle = p.color.replace("%)", `%, ${alpha})`);
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, p.radius * 0.7, 0, Math.PI * 2);
          this.ctx.fill();
        });

        // Draw particle (crisp + soft glow + twinkle)
        const time = Date.now() * 0.001;
        const twinkle =
          Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.22 + 0.88;
        const r = p.radius * twinkle;

        this.ctx.save();
        this.ctx.globalCompositeOperation = "lighter";

        // soft glow
        const glow = this.ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          r * 4.2
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${0.85})`);
        glow.addColorStop(0.35, `rgba(170, 220, 255, ${0.28})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");

        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r * 4.2, 0, Math.PI * 2);
        this.ctx.fill();

        // star core
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, Math.max(0.9, r), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      });

      // Draw black holes
      const time = Date.now() * 0.001;
      this.blackHoles.forEach((bh) => {
        // Update glow pulse
        bh.glowPulse = Math.sin(time * 2) * 0.3 + 0.7;

        // Black hole with event horizon glow
        const gradient = this.ctx.createRadialGradient(
          bh.x,
          bh.y,
          bh.radius * 0.5,
          bh.x,
          bh.y,
          bh.radius * 2
        );
        gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
        gradient.addColorStop(0.7, `rgba(100, 20, 200, ${bh.glowPulse * 0.5})`);
        gradient.addColorStop(1, "rgba(180, 76, 255, 0)");

        // Event horizon glow
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(bh.x, bh.y, bh.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Black hole core
        this.ctx.fillStyle = "#000";
        this.ctx.beginPath();
        this.ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Accretion disk
        this.ctx.strokeStyle = `rgba(180, 76, 255, ${
          0.3 + Math.sin(time) * 0.2
        })`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(bh.x, bh.y, bh.radius * 2.5, 0, Math.PI * 2);
        this.ctx.stroke();

        // Inner disk
        this.ctx.strokeStyle = `rgba(100, 20, 200, ${
          0.5 + Math.cos(time * 1.5) * 0.2
        })`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(bh.x, bh.y, bh.radius * 1.5, 0, Math.PI * 2);
        this.ctx.stroke();
      });

      this.updateStats();
      requestAnimationFrame((t) => this.animate(t));
    }

    updateStats() {
      const starCountEl = document.getElementById("starCount");
      if (starCountEl) starCountEl.textContent = this.particles.length;

      const blackHoleCountEl = document.getElementById("blackHoleCount");
      if (blackHoleCountEl)
        blackHoleCountEl.textContent = this.blackHoles.length;
    }

    setupControls() {
      // Sliders
      const gravitySlider = document.getElementById("gravitySlider");
      if (gravitySlider) {
        gravitySlider.addEventListener("input", (e) => {
          this.gravity = parseFloat(e.target.value);
          const gravityValue = document.getElementById("gravityValue");
          if (gravityValue) gravityValue.textContent = this.gravity.toFixed(1);
        });
      }

      const trailSlider = document.getElementById("trailSlider");
      if (trailSlider) {
        trailSlider.addEventListener("input", (e) => {
          this.trailOpacity = parseFloat(e.target.value);
          const trailValue = document.getElementById("trailValue");
          if (trailValue) trailValue.textContent = this.trailOpacity.toFixed(1);
        });
      }

      // Buttons
      document
        .getElementById("galaxyReset")
        ?.addEventListener("click", () => this.reset());
      document
        .getElementById("galaxyAddStar")
        ?.addEventListener("click", () => this.addStar());

      // Added button for black holes
      document
        .getElementById("galaxyAddBlackHole")
        ?.addEventListener("click", () => {
          this.addBlackHole(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height
          );
        });

      // Canvas click - Shift + Click for black holes
      this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (e.shiftKey) {
          this.addBlackHole(x, y);
        } else {
          this.addStar(x, y);
        }
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        if (this.canvas) {
          const container = this.canvas.parentElement;
          if (container) {
            this.canvas.width = container.clientWidth;
          }
        }
      });
    }
  }

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    const galaxy = new ParticleGalaxy();
  });
  // =========================
  // DEMO 2: AI ART GENERATOR
  // =========================
  class AIArtGenerator {
    constructor() {
      console.log("Creating AI Art Generator...");

      this.canvas = document.getElementById("aiCanvas");
      if (!this.canvas) {
        console.error("AI Art Generator: Canvas not found");
        return;
      }

      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = 500;
      this.canvas.height = 300;

      this.generation = 1;
      this.complexity = 5;
      this.isAnimating = false;
      this.animationTime = 0;

      this.generateArt();
      this.setupControls();
      scheduler.add(() => this.update());

      console.log("✓ AI Art Generator ready");
    }

    generateArt() {
      // Clear canvas
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw neural network
      const layers = 3 + Math.floor(this.complexity / 3);

      for (let l = 0; l < layers; l++) {
        const nodes = 3 + Math.floor(this.complexity / 2);
        const xSpacing = this.canvas.width / (nodes + 1);
        const y = (l + 1) * (this.canvas.height / (layers + 1));

        for (let n = 0; n < nodes; n++) {
          const x = xSpacing * (n + 1);
          const radius = 5 + this.complexity;
          const hue = (l * 60 + n * 30) % 360;

          // Draw connections from previous layer
          if (l > 0) {
            for (let i = 0; i < 3; i++) {
              const prevX = xSpacing * (Math.floor(Math.random() * nodes) + 1);
              const prevY = l * (this.canvas.height / (layers + 1));

              this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.3)`;
              this.ctx.lineWidth = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(prevX, prevY);
              this.ctx.lineTo(x, y);
              this.ctx.stroke();
            }
          }

          // Draw node
          this.ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fill();

          // Glow
          const gradient = this.ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius * 2
          );
          gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.5)`);
          gradient.addColorStop(1, "transparent");

          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      // Update stats
      document.getElementById("generationCount").textContent = this
        .generation++;
      document.getElementById("layerCount").textContent = layers;
    }

    update() {
      if (isPaused) return;

      if (this.isAnimating) {
        this.animationTime += 0.02;

        // Add subtle animation
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw moving particles
        const time = Date.now() / 1000;
        for (let i = 0; i < 5; i++) {
          const x = this.canvas.width / 2 + Math.sin(time + i) * 100;
          const y = this.canvas.height / 2 + Math.cos(time * 1.3 + i) * 80;
          const radius = 5 + Math.sin(time * 2 + i) * 3;

          this.ctx.fillStyle = `hsla(${
            (time * 50 + i * 72) % 360
          }, 100%, 60%, 0.5)`;
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    setupControls() {
      // Generate button
      document.getElementById("aiGenerate")?.addEventListener("click", () => {
        this.generateArt();
      });

      // Animate button
      const animateBtn = document.getElementById("aiAnimate");
      if (animateBtn) {
        animateBtn.addEventListener("click", () => {
          this.isAnimating = !this.isAnimating;
          animateBtn.textContent = this.isAnimating
            ? "Stop Animation"
            : "Animate";
        });
      }

      // Complexity slider
      const complexitySlider = document.getElementById("complexitySlider");
      if (complexitySlider) {
        complexitySlider.addEventListener("input", (e) => {
          this.complexity = parseInt(e.target.value);
          document.getElementById("complexityValue").textContent =
            this.complexity;
          this.generateArt();
        });
      }

      // Style select
      const styleSelect = document.getElementById("styleSelect");
      if (styleSelect) {
        styleSelect.addEventListener("change", (e) => {
          const label = e.target.selectedOptions?.[0]?.text || e.target.value;
          const badge = document.getElementById("currentStyle");
          if (badge) badge.textContent = label.replace(/^[^A-Za-z0-9]+/, "");
          this.generateArt();
        });
      }
    }
  }

  // =========================
  // DEMO 3: MUSIC VISUALIZER
  // =========================
  class MusicVisualizer {
    constructor() {
      console.log("Creating Music Visualizer...");

      this.canvas = document.getElementById("musicCanvas");
      if (!this.canvas) {
        console.error("Music Visualizer: Canvas not found");
        return;
      }

      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = 300;

      this.isPlaying = false;
      this.visualStyle = "particles";
      this.sensitivity = 0.7;
      this.particles = [];
      this.audioData = new Array(64).fill(0);

      this.setupControls();
      this.animate();
      console.log("✓ Music Visualizer ready");
    }

    animate() {
      if (!this.isPlaying) {
        this.drawIdle();
      } else {
        this.simulateAudio();
      }

      requestAnimationFrame(() => this.animate());
    }

    drawIdle() {
      const time = Date.now() * 0.001;
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Clear with fade
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      this.ctx.fillRect(0, 0, width, height);

      // Draw calming waves
      for (let i = 0; i < 3; i++) {
        const y = height / 2 + Math.sin(time + i * 0.5) * 50;
        const alpha = 0.2 + Math.sin(time * 2 + i) * 0.1;

        this.ctx.strokeStyle = `rgba(180, 76, 255, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        for (let x = 0; x < width; x += 10) {
          const waveY = y + Math.sin(time * 2 + x * 0.01 + i) * 20;
          if (x === 0) this.ctx.moveTo(x, waveY);
          else this.ctx.lineTo(x, waveY);
        }

        this.ctx.stroke();
      }

      // Update stats (idle state)
      document.getElementById("frequencyValue").textContent = "440";
      document.getElementById("amplitudeValue").textContent = "0.000";
    }

    simulateAudio() {
      const time = Date.now() * 0.001;
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Update audio data (simulated)
      for (let i = 0; i < this.audioData.length; i++) {
        this.audioData[i] = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
      }

      // Clear with fade
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      this.ctx.fillRect(0, 0, width, height);

      // Draw based on visual style
      if (this.visualStyle === "spectrum") {
        this.drawSpectrum();
      } else if (this.visualStyle === "waves") {
        this.drawWaves();
      } else if (this.visualStyle === "kaleidoscope") {
        this.drawKaleidoscope();
      } else if (this.visualStyle === "particle-wave") {
        this.drawParticleWave();
      } else {
        this.drawParticles();
      }

      // Update stats
      const avgFreq =
        this.audioData.reduce((a, b) => a + b) / this.audioData.length;
      document.getElementById("frequencyValue").textContent = Math.round(
        avgFreq * 500
      );
      document.getElementById("amplitudeValue").textContent =
        avgFreq.toFixed(3);
      document.getElementById("latencyValue").textContent = Math.round(
        Math.random() * 10
      );

      // Update volume bar
      const volumeBar = document.getElementById("volumeBar");
      if (volumeBar) {
        volumeBar.style.width = `${avgFreq * 100}%`;
      }
    }

    drawSpectrum() {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const barWidth = width / this.audioData.length;

      for (let i = 0; i < this.audioData.length; i++) {
        const barHeight = this.audioData[i] * height * this.sensitivity;
        const x = i * barWidth;
        const y = height - barHeight;

        const gradient = this.ctx.createLinearGradient(x, y, x, height);
        gradient.addColorStop(0, "#b44cff");
        gradient.addColorStop(1, "#00ffff");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, barWidth - 1, barHeight);
      }
    }

    drawWaves() {
      const width = this.canvas.width;
      const height = this.canvas.height;

      this.ctx.strokeStyle = "#00ffff";
      this.ctx.lineWidth = 2;

      for (let i = 0; i < 3; i++) {
        this.ctx.beginPath();

        for (let x = 0; x < width; x += 5) {
          const index = Math.floor((x / width) * this.audioData.length);
          const intensity = this.audioData[index];
          const y =
            height / 2 +
            Math.sin(x * 0.02 + Date.now() * 0.001 * (i + 1)) *
              intensity *
              100 *
              this.sensitivity;

          if (x === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
      }
    }

    drawKaleidoscope() {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const segments = 12;
      const maxRadius = Math.min(centerX, centerY);

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const intensity =
          this.audioData[Math.floor((i / segments) * this.audioData.length)];
        const radius = intensity * maxRadius * this.sensitivity;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(angle);

        this.ctx.fillStyle = `hsla(${i * 30}, 100%, 60%, 0.7)`;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, radius, 0, (Math.PI * 2) / segments);
        this.ctx.fill();

        this.ctx.restore();
      }
    }

    drawParticles() {
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Add new particles
      if (Math.random() < this.sensitivity * 0.1) {
        const intensity =
          this.audioData[Math.floor(Math.random() * this.audioData.length)];

        this.particles.push({
          x: Math.random() * width,
          y: height,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 10 - 5,
          radius: intensity * 10 + 2,
          color: `hsl(${Math.random() * 60 + 200}, 100%, 60%)`,
          life: 1,
        });

        if (this.particles.length > 500) this.particles.shift();
      }

      // Update and draw particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.01;

        if (p.life <= 0 || p.y > height + 100) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.globalAlpha = 1;
    }

    drawParticleWave() {
      const width = this.canvas.width;
      const height = this.canvas.height;

      this.ctx.strokeStyle = "#b44cff";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();

      for (let x = 0; x < width; x += 10) {
        const index = Math.floor((x / width) * this.audioData.length);
        const intensity = this.audioData[index];
        const y =
          height / 2 +
          Math.sin(x * 0.03 + Date.now() * 0.002) *
            intensity *
            80 *
            this.sensitivity;

        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);

        // Draw particles along the wave
        this.ctx.fillStyle = "#00ffff";
        this.ctx.beginPath();
        this.ctx.arc(x, y, intensity * 6, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.stroke();
    }

    setupControls() {
      const micBtn = document.getElementById("micBtn");
      const toneBtn = document.getElementById("toneBtn");
      const stopBtn = document.getElementById("stopBtn");
      const visualStyleSelect = document.getElementById("visualStyle");
      const sensitivitySlider = document.getElementById("sensitivitySlider");

      if (micBtn) {
        micBtn.addEventListener("click", () => {
          this.isPlaying = true;
          document.getElementById("audioStatus").innerHTML =
            '<i class="fas fa-microphone"></i> Listening...';
        });
      }

      if (toneBtn) {
        toneBtn.addEventListener("click", () => {
          this.isPlaying = true;
          document.getElementById("audioStatus").innerHTML =
            '<i class="fas fa-wave-square"></i> Generating Tone...';
        });
      }

      if (stopBtn) {
        stopBtn.addEventListener("click", () => {
          this.isPlaying = false;
          this.particles = [];
          document.getElementById("audioStatus").innerHTML =
            '<i class="fas fa-microphone-slash"></i> Ready';
          document.getElementById("volumeBar").style.width = "0%";
        });
      }

      if (visualStyleSelect) {
        visualStyleSelect.addEventListener("change", (e) => {
          this.visualStyle = e.target.value;
          this.particles = []; // Clear particles when changing style
        });
      }

      if (sensitivitySlider) {
        sensitivitySlider.addEventListener("input", (e) => {
          this.sensitivity = parseFloat(e.target.value);
          document.getElementById("sensitivityValue").textContent =
            this.sensitivity.toFixed(1);
        });
      }
    }
  }

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    const musicVisualizer = new MusicVisualizer();

    // Handle window resize
    window.addEventListener("resize", () => {
      if (musicVisualizer.canvas) {
        const container = musicVisualizer.canvas.parentElement;
        if (container) {
          musicVisualizer.canvas.width = container.clientWidth;
        }
      }
    });
  });

  // =========================
  // INITIALIZE ALL DEMOS
  // =========================

  console.log("Initializing all demos...");

  // Initialize each demo
  try {
    window.galaxyDemo = new ParticleGalaxy();
    console.log("✓ Particle Galaxy initialized");
  } catch (error) {
    console.error("✗ Particle Galaxy failed:", error);
  }

  try {
    window.aiArtDemo = new AIArtGenerator();
    console.log("✓ AI Art Generator initialized");
  } catch (error) {
    console.error("✗ AI Art Generator failed:", error);
  }

  try {
    window.musicDemo = new MusicVisualizer();
    console.log("✓ Music Visualizer initialized");
  } catch (error) {
    console.error("✗ Music Visualizer failed:", error);
  }

  try {
    window.pathfindingDemo = new PathfindingVisualizer();
    console.log("✓ Pathfinding Visualizer initialized");
  } catch (error) {
    console.error("✗ Pathfinding Visualizer failed:", error);
  }

  try {
    window.physicsDemo = new PhysicsSandbox();
    console.log("✓ Physics Sandbox initialized");
  } catch (error) {
    console.error("✗ Physics Sandbox failed:", error);
  }

  try {
    window.shaderDemo = new ShaderPlayground();
    console.log("✓ Shader Playground initialized");
  } catch (error) {
    console.error("✗ Shader Playground failed:", error);
  }

  // Demo fullscreen buttons -> open standalone pages
  const demoPageMap = {
    "ai-art": "ai-art-generator.html",
    music: "interactive-music.html",
    "space-defender": "space-defender.html",
    climate: "climate-dashboard-demo.html",
    "create-viz": "create-viz-preview.html",
  };

  document.querySelectorAll(".demo-fullscreen").forEach((el) => {
    if (el.tagName === "A") return; // anchors already work
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const key = el.getAttribute("data-demo");
      const url = demoPageMap[key];
      if (url) window.open(url, "_blank");
    });
  });
  console.log("✅ All demos initialized!");

  // Add debug borders to canvases
  setTimeout(() => {
    const canvases = document.querySelectorAll(".demo-canvas, .shader-canvas");
    canvases.forEach((canvas) => {
      canvas.style.border = "2px solid rgba(5, 5, 5, 0.3)";
    });
  }, 1000);
});
