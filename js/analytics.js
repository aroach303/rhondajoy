(function () {
  const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

  const script = document.currentScript;
  const site = script ? script.getAttribute('data-site') : window.location.hostname;

  function getDevice() {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  function isNewSession() {
    const key = 'rj_session';
    const timeout = 30 * 60 * 1000;
    const now = Date.now();
    const last = sessionStorage.getItem(key);
    if (!last || now - parseInt(last) > timeout) {
      sessionStorage.setItem(key, now.toString());
      return true;
    }
    sessionStorage.setItem(key, now.toString());
    return false;
  }

  function isReturning() {
    const key = 'rj_visited';
    const visited = localStorage.getItem(key);
    localStorage.setItem(key, '1');
    return !!visited;
  }

  function post(table, payload) {
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

  // Track pageview
  post('pageviews', {
    site,
    path: window.location.pathname,
    referrer: document.referrer || null,
    device: getDevice(),
    new_session: isNewSession(),
    returning: isReturning(),
    ts: new Date().toISOString()
  });

  // Track click-to-call
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => {
      post('events', {
        site,
        event: 'click_to_call',
        path: window.location.pathname,
        ts: new Date().toISOString()
      });
    });
  });

  // Track form submit button clicks
  document.querySelectorAll('button[type="submit"], button.submit-btn').forEach(el => {
    el.addEventListener('click', () => {
      post('events', {
        site,
        event: 'form_submit_click',
        path: window.location.pathname,
        ts: new Date().toISOString()
      });
    });
  });

  // Track session duration
  const sessionStart = Date.now();
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000);
    navigator.sendBeacon(`${SUPABASE_URL}/rest/v1/sessions`, JSON.stringify({
      site,
      path: window.location.pathname,
      duration_seconds: duration,
      ts: new Date().toISOString()
    }));
  });
})();
