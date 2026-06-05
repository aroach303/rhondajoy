const https = require('https');

const SITEMAP_URL = 'https://rhondajoyinteriordesign.com/sitemap.xml';
const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

const req = https.get(pingUrl, (res) => {
  res.resume();
  console.log(`Sitemap ping status: ${res.statusCode}`);
  process.exit(0);
});

req.setTimeout(4000, () => {
  console.log('Sitemap ping timed out — continuing deployment.');
  req.destroy();
  process.exit(0);
});

req.on('error', (err) => {
  console.log(`Sitemap ping failed silently: ${err.message}`);
  process.exit(0);
});
