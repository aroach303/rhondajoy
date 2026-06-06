/* ============================================================
   RHONDA JOY INTERIOR DESIGN — ANALYTICS
   Tracks pageviews, sessions, device type, CTA clicks, form submits
   ============================================================ */
(function () {
  const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
  const script   = document.currentScript;
  const site     = script ? script.getAttribute('data-site') : 'joysignaturedesigns.com';
  const SESSION_KEY = 'rj_session';
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  function send(table, payload) {
    fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  function getDevice() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  function getOrCreateSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Date.now() - s.last < SESSION_TIMEOUT) {
          s.last = Date.now();
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
          return { id: s.id, isNew: false };
        }
      }
    } catch (e) {}
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const isNew = !localStorage.getItem('rj_returning');
    localStorage.setItem('rj_returning', '1');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: Date.now() }));
    send('sessions', { site, session_id: id, device: getDevice(), is_new: isNew, started_at: new Date().toISOString() });
    return { id, isNew };
  }

  const session = getOrCreateSession();
  const page    = window.location.pathname;
  const startMs = Date.now();

  send('pageviews', {
    site,
    page,
    session_id: session.id,
    referrer: document.referrer || null,
    device: getDevice(),
    viewed_at: new Date().toISOString()
  });

  function trackEvent(type, meta) {
    send('events', {
      site, session_id: session.id,
      event_type: type,
      page,
      meta: meta || null,
      occurred_at: new Date().toISOString()
    });
  }

  window.trackEvent = trackEvent;

  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => trackEvent('click_to_call', { href: el.href }));
  });

  const formSubmitBtn = document.getElementById('form-submit');
  if (formSubmitBtn) {
    formSubmitBtn.addEventListener('click', () => trackEvent('form_submit_click', { page }));
  }

  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - startMs) / 1000);
    navigator.sendBeacon(`${SUPABASE_URL}/rest/v1/events`, JSON.stringify({
      site, session_id: session.id,
      event_type: 'session_duration',
      page,
      meta: { seconds: duration },
      occurred_at: new Date().toISOString()
    }));
  });
})();
