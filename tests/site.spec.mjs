import { test, expect, API } from './helpers.mjs';

// Public URLs. These must keep working after any reorganization.
const NAV_PAGES = ['index', 'technology', 'applications', 'products', 'resources', 'contact'];
const APPLICATIONS = ['counter-uas', 'drone-stationary', 'drone-hovering', 'drone-on-the-move', 'aps', 'daa-radar', 'bvlos-ops', 'part-107-waivers'];
const PRODUCTS = ['kmb-product-counter-uas-radar', 'kmb-product-daa-radar'];
const LEGAL = ['privacy-policy', 'cookie-policy', 'terms-and-conditions'];
const ALL_PAGES = [
  ...NAV_PAGES.map((p) => `/${p}.html`),
  ...[...APPLICATIONS, ...PRODUCTS, ...LEGAL].map((p) => `/subpages/${p}.html`),
];

const BROCHURES = [
  ['/subpages/kmb-product-counter-uas-radar.html', 'cuas', /KMB(%20| )Software(%20| )Defined(%20| )Radar,(%20| )cUAS\.pdf$/],
  ['/subpages/kmb-product-daa-radar.html', 'daa', /KMB(%20| )Software(%20| )Defined(%20| )Radar,(%20| )Airborne(%20| )DAA\.pdf$/],
];

const settle = async (page) => { await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready); };

test.describe('every public page', () => {
  for (const url of ALL_PAGES) {
    test(`${url} renders with shared layout and no broken local assets`, async ({ page, site }) => {
      const resp = await page.goto(url);
      expect(resp.status()).toBe(200);
      await settle(page);
      await expect(page.locator('common-header header')).toHaveCount(1);
      await expect(page.locator('common-header .navbar-nav li a')).toHaveCount(6);
      await expect(page.locator('common-footer footer')).toHaveCount(1);
      await expect(page.locator('#subscribe-form')).toHaveCount(1);
      const brokenImages = await page.$$eval('img', (imgs) =>
        imgs.filter((i) => i.getAttribute('src') && i.complete && i.naturalWidth === 0 && i.src.startsWith(location.origin)).map((i) => i.src));
      expect(brokenImages).toEqual([]);
      expect(site.localFailures).toEqual([]);
      expect(site.pageErrors).toEqual([]);
    });
  }

  test('all same-site links and media on all pages resolve', async ({ page, site, request, baseURL }) => {
    test.setTimeout(120_000);
    const targets = new Set();
    for (const url of ALL_PAGES) {
      await page.goto(url);
      await settle(page);
      const found = await page.$$eval('a[href], source[src], img[src], link[href], script[src]', (els) =>
        els.map((e) => e.href || e.src).filter((u) => u && u.startsWith(location.origin)));
      found.forEach((u) => targets.add(u.split('#')[0]));
    }
    const bad = [];
    for (const u of targets) {
      const r = await request.head(u);
      if (r.status() !== 200) bad.push(`${r.status()} ${u}`);
    }
    expect(bad).toEqual([]);
    expect(targets.size).toBeGreaterThan(40);
  });

  test('anchors used between pages exist', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#zero-doppler-video')).toHaveCount(1);
    await page.goto('/technology.html');
    await expect(page.locator('#zero-doppler')).toHaveCount(1);
  });

  test('manifest and favicon load', async ({ page, request }) => {
    await page.goto('/index.html');
    const href = await page.locator('link[rel=manifest]').evaluate((l) => l.href);
    const manifest = await (await request.get(href)).json();
    for (const icon of manifest.icons) {
      expect((await request.head(new URL(icon.src, href).href)).status()).toBe(200);
    }
    const icon = await page.locator('link[rel=icon][sizes="32x32"]').evaluate((l) => l.href);
    expect((await request.head(icon)).status()).toBe(200);
  });
});

test.describe('home page video', () => {
  const videoRequests = (page) => {
    const urls = [];
    page.on('request', (r) => { if (r.url().endsWith('.m4v')) urls.push(r.url()); });
    return urls;
  };

  test('downloads only when scrolled into view', async ({ page }) => {
    const urls = videoRequests(page);
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto('/index.html');
    await settle(page);
    await page.waitForTimeout(500);
    expect(urls).toEqual([]);
    await expect(page.locator('video')).toHaveAttribute('poster', /video-poster/);
    await page.locator('video').scrollIntoViewIfNeeded();
    await expect.poll(() => urls.length).toBeGreaterThan(0);
  });

  test('does not start for visitors who prefer less motion', async ({ page }) => {
    const urls = videoRequests(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html');
    await settle(page);
    await page.locator('video').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(urls).toEqual([]);
    await expect(page.locator('video')).toHaveAttribute('controls', '');
  });
});

test.describe('fonts and icons', () => {
  test('load from links in the page head, not imports inside the stylesheet', async ({ page, request, baseURL }) => {
    await page.goto('/technology.html');
    await expect(page.locator('head link[href*="fonts.googleapis.com/css2"]')).toHaveCount(1);
    await expect(page.locator('head link[href*="font-awesome"]')).toHaveCount(3);
    const css = await (await request.get(`${baseURL}/assets/css/style.css`)).text();
    expect(css).not.toMatch(/@import url\('https?:/);
  });
});

test.describe('libraries', () => {
  test('pages run the intended jQuery and Bootstrap versions and no removed plugins', async ({ page }) => {
    await page.goto('/technology.html');
    await settle(page);
    const v = await page.evaluate(() => ({
      jquery: jQuery.fn.jquery,
      bootstrap: jQuery.fn.modal.Constructor.VERSION,
      removed: ['fancybox', 'quicksand', 'flexslider', 'owlCarousel'].filter((p) => jQuery.fn[p]),
    }));
    expect(v).toEqual({ jquery: '3.7.1', bootstrap: '3.4.1', removed: [] });
  });

  test('footer social tooltips work', async ({ page }) => {
    await page.goto('/technology.html');
    await settle(page);
    // The icons come from a CDN blocked in tests, so the links have no size to hover over.
    await page.evaluate(() => jQuery('.social-network a[data-original-title="Linkedin"]').tooltip('show'));
    await expect(page.locator('.tooltip')).toContainText('Linkedin');
  });
});

test.describe('home page', () => {
  test('headline rotates, slider starts, video and partners are present', async ({ page, request, site }) => {
    await page.goto('/index.html');
    const rotating = page.locator('#js-rotating');
    const first = await rotating.innerText();
    await expect(rotating).not.toHaveText(first, { timeout: 8000 });
    await expect(page.locator('#main-slider.flexslider .slides li').first()).toBeVisible();
    const video = await page.locator('video source').evaluate((s) => s.src);
    expect((await request.head(video)).status()).toBe(200);
    await expect(page.locator('img.partner-nasa, img.partner-army, img.partner-nato')).toHaveCount(3);
    await expect(page.locator('common-header li.active a')).toHaveText('Home');
    expect(site.pageErrors).toEqual([]);
  });
});

test.describe('card pages built from subpages', () => {
  test('Applications shows a cover, title and snippet for all 8 pages', async ({ page }) => {
    await page.goto('/applications.html');
    for (const name of APPLICATIONS) {
      await expect(page.locator(`#cover-${name} img`)).toHaveCount(1);
      await expect(page.locator(`#title-${name}`)).not.toBeEmpty();
      await expect(page.locator(`#snippet-${name}`)).toContainText('[...]');
      await expect(page.locator(`#${name} a`).first()).toHaveAttribute('href', `/subpages/${name}.html`);
    }
    await expect(page.locator('common-header li.active a')).toHaveText('Applications');
  });

  test('Products shows a cover and title for both radars', async ({ page }) => {
    await page.goto('/products.html');
    for (const name of PRODUCTS) {
      await expect(page.locator(`#cover-${name} img`)).toHaveCount(1);
      await expect(page.locator(`#title-${name}`)).not.toBeEmpty();
    }
  });

  test('breadcrumb links back to the parent page', async ({ page }) => {
    await page.goto('/subpages/counter-uas.html');
    await expect(page.locator('blog-address a[href="/applications.html"]')).toHaveCount(1);
    await page.goto('/subpages/kmb-product-daa-radar.html');
    await expect(page.locator('blog-address a[href="/products.html"]')).toHaveCount(1);
  });
});

test.describe('product pages', () => {
  test('carousel advances with its next control', async ({ page }) => {
    await page.goto('/subpages/kmb-product-counter-uas-radar.html');
    await settle(page);
    const active = page.locator('#carousel-cuas .item.active img');
    const before = await active.getAttribute('src');
    await page.locator('#carousel-cuas .carousel-control.right').click();
    await expect(active).not.toHaveAttribute('src', before);
  });

  for (const [url, item, pdf] of BROCHURES) {
    test(`${item} brochure: modal, API record, then PDF opens`, async ({ page, site, request }) => {
      // Record the PDF the page asks to open, rather than depending on the headless PDF viewer.
      await page.addInitScript(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return {}; }; });
      await page.goto(url);
      await settle(page);
      await page.locator(`[data-target="#popupModal-${item}"]`).click();
      const modal = page.locator(`#popupModal-${item}`);
      await expect(modal).toBeVisible();
      const form = modal.locator('form');

      await form.locator('input[name=submit]').click();
      await expect(form.locator('input[name=name]')).toHaveClass(/error/);
      expect(site.posts).toEqual([]);

      await form.locator('input[name=name]').fill('Test User');
      await form.locator('input[name=email]').fill('test@example.com');
      await form.locator('input[name=company]').fill('Acme');
      await form.locator('input[name=jobtitle]').fill('Engineer');
      await form.locator('input[name=phone]').fill('+1 703-555-0100');
      await form.locator('input[name=submit]').click();
      await expect.poll(() => page.evaluate(() => window.__opened.length)).toBe(1);
      const opened = await page.evaluate(() => new URL(window.__opened[0], location.href).href);
      expect(opened).toMatch(pdf);
      expect((await request.get(opened)).status()).toBe(200);
      expect(site.posts).toEqual([{ path: '/download', body: {
        'From Web: Name': 'Test User',
        'From Web: Email': 'test@example.com',
        'From Web: Employer': 'Acme',
        'From Web: Job Title': 'Engineer',
        'From Web: Telephone': '+1 703-555-0100',
      } }]);
      await expect(modal).toBeHidden();
    });
  }

  test('Get Quote pre-selects the subject on the contact page', async ({ page }) => {
    await page.goto('/subpages/kmb-product-counter-uas-radar.html');
    await expect(page.locator('a[href^="/contact.html?subject=Price"]')).toHaveCount(1);
    await page.goto('/contact.html?subject=Price%20and%20quotation');
    await expect(page.locator('#subject')).toHaveValue('Price and quotation');
  });
});

test.describe('contact form', () => {
  test('blocks empty submissions and highlights fields', async ({ page, site }) => {
    await page.goto('/contact.html');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-form input[name=name]')).toHaveClass(/error/);
    await expect(page.locator('#contact-form input[name=email]')).toHaveClass(/error/);
    await expect(page.locator('#subject')).toHaveClass(/error/);
    await expect(page.locator('#contact-form textarea[name=message]')).toHaveClass(/error/);
    expect(site.posts).toEqual([]);
  });

  test('sends the expected record and confirms', async ({ page, site }) => {
    await page.goto('/contact.html');
    await page.locator('#contact-form input[name=name]').fill('Test User');
    await page.locator('#contact-form input[name=email]').fill('test@example.com');
    await page.locator('#subject').selectOption('Product inquiry');
    await page.locator('#contact-form textarea[name=message]').fill('Hello');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-done')).toBeVisible();
    expect(site.posts).toEqual([{ path: '/contact', body: {
      'From Web: Name': 'Test User',
      'From Web: Email': 'test@example.com',
      'From Web: Subject': 'Product inquiry',
      'From Web: Message': 'Hello',
    } }]);
    await expect(page.locator('#contact-form input[name=name]')).toHaveValue('');
  });

  test('"Others" reveals a free-text subject that replaces the subject sent', async ({ page, site }) => {
    await page.goto('/contact.html');
    await page.locator('#contact-form input[name=name]').fill('Test User');
    await page.locator('#contact-form input[name=email]').fill('test@example.com');
    await page.locator('#subject').selectOption('others');
    await page.locator('#othersubject').fill('Partnership');
    await page.locator('#contact-form textarea[name=message]').fill('Hello');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-done')).toBeVisible();
    expect(site.posts[0].body['From Web: Subject']).toBe('Partnership');
  });

  test('shows the map', async ({ page }) => {
    await page.goto('/contact.html');
    await expect(page.locator('.map-responsive iframe')).toHaveAttribute('src', /google\.com\/maps\/embed/);
  });
});

test.describe('subscribe form', () => {
  test('is labelled as KMB updates', async ({ page }) => {
    await page.goto('/technology.html');
    await expect(page.locator('common-footer')).toContainText('Get KMB updates');
    await expect(page.locator('common-footer')).not.toContainText(/newsletter/i);
  });

  test('rejects a bad address, then subscribes', async ({ page, site }) => {
    await page.goto('/technology.html');
    const email = page.locator('#subscribe-form input[name=email]');
    await page.locator('#subscribe-submit').click();
    await expect(email).toHaveClass(/error/);
    expect(site.posts).toEqual([]);
    await email.fill('test@example.com');
    await page.locator('#subscribe-submit').click();
    await expect(page.locator('#subscribe-done')).toBeVisible();
    expect(site.posts).toEqual([{ path: '/subscribe', body: { 'From Web: Email': 'test@example.com' } }]);
  });
});

test.describe('placeholder login', () => {
  test('never sends credentials anywhere and reports a failed match', async ({ page, site }) => {
    await page.goto('/resources.html');
    await page.locator('#login-form input[name=username]').fill('someone');
    await page.locator('#login-form input[name=password]').fill('not-a-real-password');
    const messages = [];
    page.on('dialog', async (d) => { messages.push(d.message()); await d.accept(); });
    await page.locator('#login-submit').click();
    await expect.poll(() => messages.length).toBe(1);
    expect(messages[0]).toContain("didn't match");
    expect(site.posts).toEqual([]);
    await expect(page.locator('#login-form input[name=password]')).toHaveValue('');
  });
});

test.describe('legal pages and notices', () => {
  for (const name of LEGAL) {
    test(`${name} is current and points to the live site`, async ({ page, request }) => {
      await page.goto(`/subpages/${name}.html`);
      await expect(page.locator('.legal-page h2').first()).toBeVisible();
      await expect(page.locator('common-header li.active')).toHaveCount(0);
      await expect(page.locator('.legal-updated')).toContainText('Last updated');
      const html = await (await request.get(`/subpages/${name}.html`)).text();
      expect(html).not.toMatch(/www\.kmb\.ac|Wilson Blvd|Page Content|updated soon/);
    });
  }

  test('policies state the agreed facts', async ({ page }) => {
    await page.goto('/subpages/privacy-policy.html');
    await expect(page.locator('.legal-page')).toContainText('up to 60 months');
    await expect(page.locator('.legal-page')).not.toContainText(/follow(ing)? up/i);
    await page.goto('/subpages/terms-and-conditions.html');
    await expect(page.locator('.legal-page a[href*="terms_maps"]')).toHaveCount(1);
    for (const name of LEGAL) {
      await page.goto(`/subpages/${name}.html`);
      await expect(page.locator('.legal-updated')).toHaveText('Last updated: November 5, 2026');
    }
    await page.goto('/subpages/kmb-product-daa-radar.html');
    await expect(page.locator('#popupModal-daa .form-privacy')).not.toContainText('follow up');
  });

  test('footer links to all three policies', async ({ page }) => {
    await page.goto('/technology.html');
    for (const name of LEGAL) {
      await expect(page.locator(`common-footer .link-list a[href="/subpages/${name}.html"]`)).toHaveCount(1);
    }
  });

  test('every form links to the privacy policy', async ({ page }) => {
    const link = 'a[href="/subpages/privacy-policy.html"]';
    await page.goto('/contact.html');
    await expect(page.locator(`#contact-form ${link}`)).toHaveCount(1);
    await expect(page.locator(`#subscribe-form ${link}`)).toHaveCount(1);
    await page.goto('/subpages/kmb-product-daa-radar.html');
    await expect(page.locator(`#popupModal-daa form ${link}`)).toHaveCount(1);
  });
});

test.describe('phone layout', () => {
  for (const width of [375, 320]) {
    test(`home headline clears the logo at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto('/index.html');
      await settle(page);
      const logoBottom = await page.locator('.navbar-brand img').evaluate((e) => e.getBoundingClientRect().bottom);
      const headingTop = await page.locator('#main-slider h1').evaluate((e) => e.getBoundingClientRect().top);
      expect(headingTop).toBeGreaterThan(logoBottom);
    });
  }

  test('spec table keeps words whole', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/subpages/kmb-product-counter-uas-radar.html');
    await settle(page);
    const lines = await page.locator('td', { hasText: 'Communications protocol' }).evaluate((td) => {
      const r = document.createRange();
      r.selectNodeContents(td);
      return new Set([...r.getClientRects()].map((c) => Math.round(c.top))).size;
    });
    expect(lines).toBeLessThanOrEqual(2);
  });

  for (const width of [375, 320]) {
    for (const url of ALL_PAGES) {
      test(`${url} fits a ${width}px screen`, async ({ page }) => {
        await page.setViewportSize({ width, height: 700 });
        await page.goto(url);
        await settle(page);
        await page.waitForTimeout(1200); // let slide-in animations finish
        const result = await page.evaluate(() => {
          const limit = document.documentElement.clientWidth + 1;
          return {
            pageWidth: document.documentElement.scrollWidth,
            tooWide: [...document.querySelectorAll('#wrapper *')]
              .filter((e) => !e.closest('.modal') && !e.closest('.table-responsive') && !e.closest('.carousel')
                && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().right > limit)
              .map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? `.${e.className.split(' ')[0]}` : '')),
          };
        });
        expect(result).toEqual({ pageWidth: width, tooWide: [] });
      });
    }
  }
});

test.describe('layout behaviour', () => {
  test('footer contact links carry the phone and email', async ({ page }) => {
    await page.goto('/technology.html');
    await expect(page.locator('.cryptedphone')).toHaveAttribute('data-telnumber', '783');
    await expect(page.locator('.cryptedmail')).toHaveAttribute('data-emaildomain', 'kmb');
  });

  test('footer shows the copyright years', async ({ page }) => {
    await page.goto('/technology.html');
    await expect(page.locator('.copyright')).toContainText('© 2018 - 2027 KMB Telematics Inc.');
  });

  for (const url of ['/technology.html', '/resources.html', '/subpages/cookie-policy.html', '/index.html']) {
    test(`footer reaches the bottom of a tall window on ${url}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 3000 });
      await page.goto(url);
      await settle(page);
      const layout = await page.evaluate(() => ({
        footerBottom: Math.round(document.querySelector('common-footer').getBoundingClientRect().bottom),
        pageHeight: document.documentElement.scrollHeight,
      }));
      expect(layout).toEqual({ footerBottom: 3000, pageHeight: 3000 });
    });
  }

  test('scroll-to-top appears and returns to the top', async ({ page }) => {
    await page.goto('/technology.html');
    await settle(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const up = page.locator('.scrollup');
    await expect(up).toBeVisible();
    await up.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBe(0);
  });

  test('mobile menu opens and links navigate', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto('/index.html');
    await settle(page);
    const link = page.locator('common-header .navbar-nav a[href="/contact.html"]');
    await expect(link).toBeHidden();
    await page.locator('.navbar-toggle').click();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/contact\.html$/);
  });
});
