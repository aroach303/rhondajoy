/* ============================================================
   JOY SIGNATURE DESIGNS — MAIN JS
   Blueprint compliant: no inline handlers, null-safe, aria support
   ============================================================ */

document.body.classList.add('js-loaded');

// ── HEADER SCROLL ──
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileMenu');
const closeMenu = document.querySelector('.close-menu');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}
if (closeMenu && mobileNav) {
  closeMenu.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  });
}
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── ACTIVE NAV LINK ──
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '/' && href === '/')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));
}

// ── CONTACT FORM ──
const submitBtn = document.getElementById('form-submit');
if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const name    = document.getElementById('name')?.value?.trim();
    const phone   = document.getElementById('phone')?.value?.trim();
    const email   = document.getElementById('email')?.value?.trim();
    const service = document.getElementById('service')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();
    const msgBox  = document.getElementById('form-message');
    if (!msgBox) return;

    if (!name || !email || !message) {
      msgBox.className = 'form-message error';
      msgBox.textContent = 'Please fill in your name, email, and message.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, message })
      });
      if (res.ok) {
        msgBox.className = 'form-message success';
        msgBox.textContent = 'Thank you! Rhonda will be in touch with you shortly.';
        ['name','phone','email','service','message'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      } else {
        throw new Error('failed');
      }
    } catch {
      msgBox.className = 'form-message error';
      msgBox.textContent = 'Something went wrong. Please call us directly or try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

// ── TEL TRACKING ──
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof trackEvent === 'function') trackEvent('click_to_call', {});
  });
});
