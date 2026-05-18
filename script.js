// ── Custom Cursor ──────────────────────────────────────────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

window.addEventListener('mousemove', e => {
  cursorDot.style.left  = e.clientX + 'px';
  cursorDot.style.top   = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

// ── Navigation scroll state ────────────────────────────────────
const nav = document.querySelector('#main-nav');
const navLinks = document.querySelectorAll('.nav-links a');

function updateNav() {
  if (!nav) return;
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
function setActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

// ── Hero 3D Tilt ───────────────────────────────────────────────
const cardWrap = document.querySelector('.hero-card-wrap');
const card     = document.querySelector('.hero-card');

if (cardWrap && card) {
  cardWrap.addEventListener('mousemove', e => {
    const rect   = cardWrap.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotY   = ((x - cx) / cx) * 12;
    const rotX   = -((y - cy) / cy) * 10;
    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  cardWrap.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ── Dynamic Background Glow on Mouse ──────────────────────────
const heroBgGlow = document.querySelector('.hero-bg-glow');
document.addEventListener('mousemove', e => {
  if (!heroBgGlow) return;
  const px = (e.clientX / window.innerWidth  * 100).toFixed(1);
  const py = (e.clientY / window.innerHeight * 100).toFixed(1);
  heroBgGlow.style.background =
    `radial-gradient(ellipse 70% 55% at ${px}% ${py}%, rgba(80,80,110,0.2) 0%, transparent 65%)`;
});

// ── Hero Scroll Parallax + Fade ───────────────────────────────
const heroSection = document.querySelector('#hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  if (!heroSection) return;
  const progress = Math.min(window.scrollY / window.innerHeight, 1);
  if (heroContent) {
    heroContent.style.opacity    = 1 - progress * 1.5;
    heroContent.style.transform  = `translateY(${progress * 40}px)`;
  }
}, { passive: true });

// ── Marquee – duplicate for infinite loop ─────────────────────
document.querySelectorAll('.marquee-track').forEach(track => {
  track.innerHTML += track.innerHTML;
});

// ── Section Reveal (IntersectionObserver) ────────────────────
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));

// ── FAQ Accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');

  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ── Mobile Menu ───────────────────────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
});
mobileClose?.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
});
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('open');
    })
  );
}

// ── Contact Form ──────────────────────────────────────────────
const form = document.querySelector('#contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#16a34a';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = "Let's Talk →";
    btn.style.background = '';
    btn.style.color = '';
    form.reset();
  }, 3000);
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Scroll-triggered counter animation ───────────────────────
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCount(el, target, suffix);
      counterIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterIO.observe(c));
