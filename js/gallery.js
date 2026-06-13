// ── HORIZONTAL SCROLL BUTTONS ──
  document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = document.getElementById(btn.getAttribute('data-scroll'));
      const dir = parseInt(btn.getAttribute('data-dir'), 10);
      row.scrollBy({ left: dir * 360, behavior: 'smooth' });
    });
  });

  // ── CATEGORY NAV ACTIVE STATE ──
  const categoryLinks = document.querySelectorAll('.category-link');
  const categorySections = document.querySelectorAll('.gallery-category-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        categoryLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  categorySections.forEach(section => sectionObserver.observe(section));

  // ── LIGHTBOX ──
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCap   = document.getElementById('lightbox-caption');
  const closeBtn      = document.getElementById('lightbox-close');
  const prevBtn       = document.getElementById('lightbox-prev');
  const nextBtn       = document.getElementById('lightbox-next');

  const allCards = Array.from(document.querySelectorAll('.gallery-card'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function updateLightbox() {
    const card = allCards[currentIndex];
    const img  = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = card.getAttribute('data-title');
    lightboxCap.textContent   = card.getAttribute('data-caption');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  allCards.forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + allCards.length) % allCards.length; updateLightbox(); });
  nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % allCards.length; updateLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + allCards.length) % allCards.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % allCards.length; updateLightbox(); }
  });
