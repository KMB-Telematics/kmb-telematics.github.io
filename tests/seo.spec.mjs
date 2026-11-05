import { test, expect } from './helpers.mjs';

const BASE = 'https://www.kmbradar.com';
const PATHS = [
  'index.html', 'technology.html', 'applications.html', 'products.html', 'resources.html', 'contact.html',
  ...['counter-uas', 'drone-stationary', 'drone-hovering', 'drone-on-the-move', 'aps', 'daa-radar', 'bvlos-ops', 'part-107-waivers',
    'kmb-product-counter-uas-radar', 'kmb-product-daa-radar', 'privacy-policy', 'cookie-policy', 'terms-and-conditions'].map((n) => `subpages/${n}.html`),
];
const canonical = (path) => (path === 'index.html' ? `${BASE}/` : `${BASE}/${path}`);

test('each page has a good, unique title, description and canonical URL', async ({ page }) => {
  test.setTimeout(60_000);
  const titles = new Set();
  const descriptions = new Set();
  for (const path of PATHS) {
    await page.goto(`/${path}`);
    const title = await page.title();
    const description = await page.locator('meta[name=description]').getAttribute('content');
    expect(title.length, `${path} title`).toBeLessThanOrEqual(65);
    expect(description.length, `${path} description`).toBeGreaterThanOrEqual(50);
    expect(description.length, `${path} description`).toBeLessThanOrEqual(190);
    titles.add(title);
    descriptions.add(description);
    if (path === 'resources.html') {
      // Only a placeholder login for now, so it stays out of search results.
      await expect(page.locator('link[rel=canonical]')).toHaveCount(0);
      await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex');
    } else {
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', canonical(path));
      await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'index,follow');
    }
  }
  expect(titles.size).toBe(PATHS.length);
  expect(descriptions.size).toBe(PATHS.length);
});

test('robots.txt points to a sitemap whose pages all exist', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${BASE}/sitemap.xml`);
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(urls).toHaveLength(PATHS.length - 1); // Resources is noindex, so it is left out
  for (const url of urls) {
    expect((await request.head(url.replace(BASE, ''))).status(), url).toBe(200);
  }
});

test('home page describes the organization for search engines', async ({ page }) => {
  await page.goto('/index.html');
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(data.legalName).toBe('KMB Telematics Inc.');
  expect(data.address.postalCode).toBe('20009');
});

test('each page has a link preview with the share image', async ({ page, request }) => {
  test.setTimeout(60_000);
  const image = await (await request.head('/assets/img/social/kmb-share.jpg'));
  expect(image.status()).toBe(200);
  for (const path of PATHS) {
    await page.goto(`/${path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical(path));
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.{50,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${BASE}/assets/img/social/kmb-share.jpg`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }
});

test('security.txt is published, valid and not expired', async ({ page, request }) => {
  const response = await request.get('/.well-known/security.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toContain('Contact: mailto:info@kmb.ac');
  expect(text).toContain(`Canonical: ${BASE}/.well-known/security.txt`);
  const contactPage = text.match(/Contact: https:\/\/www\.kmbradar\.com(\/contact\.html\?subject=\S+)/)[1];
  await page.goto(contactPage);
  await expect(page.locator('#subject')).toHaveValue('Report a vulnerability');
  // If this fails, renew the Expires date in docs/.well-known/security.txt.
  const expires = new Date(text.match(/Expires: (\S+)/)[1]);
  expect(expires.getTime()).toBeGreaterThan(Date.now());
});
