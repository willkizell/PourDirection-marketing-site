/* ============================================================
   POURDIRECTION — MARKETING SITE
   script.js
   ============================================================ */


/* ------------------------------------------------------------
   NAV — Add scrolled class after user scrolls
   ------------------------------------------------------------ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });


/* ------------------------------------------------------------
   INTERSECTION OBSERVER — Fade-up animations
   Watches all .fade-up elements and reveals them when visible
   ------------------------------------------------------------ */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

fadeEls.forEach((el) => observer.observe(el));


/* ------------------------------------------------------------
   PARALLAX — Subtle parallax on hero grid / glow
   Light movement only — not distracting
   ------------------------------------------------------------ */
const heroGrid = document.querySelector('.hero-grid');
const heroGlow = document.querySelector('.hero-glow');
const heroPhone = document.querySelector('.hero-phone');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > window.innerHeight) return; // only in hero viewport

  if (heroGrid) {
    heroGrid.style.transform = `translateY(${scrollY * 0.2}px)`;
  }
  if (heroGlow) {
    heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
  }
  if (heroPhone) {
    heroPhone.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
}, { passive: true });


/* ------------------------------------------------------------
   EMAIL FORM — Handle submission (UI only, no backend)
   Replace this with real submission logic when ready
   ------------------------------------------------------------ */
async function handleEmailSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const input = form.querySelector('.email-input');
  const btn = form.querySelector('button[type="submit"]');
  const thanks = document.getElementById('emailThanks');

  // Basic validation
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.focus();
    return;
  }

  // Loading state
  const originalText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  input.disabled = true;

  try {
    const res = await fetch('https://hook.us1.make.com/l1vcm1z4p3k0guucpypqr2un1rua4int', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, platform: 'website' }),
    });

    if (!res.ok) throw new Error('Server error');

    // Success
    form.style.transition = 'opacity 0.3s, transform 0.3s';
    form.style.opacity = '0';
    form.style.transform = 'scale(0.97)';
    setTimeout(() => {
      form.style.display = 'none';
      thanks.textContent = "You're on the list 🧭";
      thanks.classList.add('visible');
    }, 300);

  } catch (err) {
    // Error — reset button, show inline error
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
    input.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
    }, 3000);
  }
}


/* ------------------------------------------------------------
   HAMBURGER MENU — Toggle mobile drawer
   ------------------------------------------------------------ */
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

/* Close drawer when a drawer link is clicked */
document.querySelectorAll('.nav-drawer-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ------------------------------------------------------------
   SMOOTH ANCHOR SCROLLING — Account for fixed nav height
   ------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav ? nav.offsetHeight : 68;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ------------------------------------------------------------
   CURSOR GLOW — Subtle teal glow that follows the mouse
   Adds a premium feel without being distracting
   ------------------------------------------------------------ */
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle, rgba(26,159,134,0.07) 0%, transparent 65%);
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  will-change: left, top;
  opacity: 0;
`;
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let raf;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.opacity = '1';

  if (!raf) {
    raf = requestAnimationFrame(updateGlow);
  }
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

function updateGlow() {
  // Lerp for smooth trailing effect
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;

  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';

  raf = requestAnimationFrame(updateGlow);
}
