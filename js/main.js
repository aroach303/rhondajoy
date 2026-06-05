/* ============================================================
   RHONDA JOY INTERIOR DESIGN — MAIN JS
   ============================================================ */

// Mark JS as loaded so reveal animations activate
document.body.classList.add('js-loaded');

// ── HEADER SCROLL ──
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE NAV ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const closeMenu = document.querySelector('.close-menu');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
}
if (closeMenu && mobileNav) {
  closeMenu.addEventListener('click', () => mobileNav.classList.remove('open'));
}
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

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

// ── TEL LINK TRACKING ──
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof trackEvent === 'function') trackEvent('click_to_call', { page: currentPage });
  });
});
