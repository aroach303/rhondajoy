// ── Navigation scroll state ──────────────────
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Mobile menu ──────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Active nav link ──────────────────────────
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '/' && href === '/') || (href !== '/' && currentPath.startsWith(href))) {
    link.classList.add('active');
  }
});

// ── Fade-up scroll animations ────────────────
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// ── Contact form (Formspree fetch) ───────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="button"]');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  submitBtn && submitBtn.addEventListener('click', async () => {
    const name    = document.getElementById('f-name')?.value.trim();
    const phone   = document.getElementById('f-phone')?.value.trim();
    const email   = document.getElementById('f-email')?.value.trim();
    const message = document.getElementById('f-message')?.value.trim();

    if (!name || !email || !message) {
      if (errorMsg) { errorMsg.textContent = 'Please fill in all required fields.'; errorMsg.className = 'form-msg error'; }
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, phone, email, message })
      });
      if (res.ok) {
        if (successMsg) { successMsg.className = 'form-msg success'; }
        if (errorMsg)   { errorMsg.className = 'form-msg'; }
        contactForm.reset();
      } else {
        throw new Error('Form error');
      }
    } catch {
      if (errorMsg) { errorMsg.textContent = 'Something went wrong. Please try again or call us directly.'; errorMsg.className = 'form-msg error'; }
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}
