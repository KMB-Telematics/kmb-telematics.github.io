import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers.mjs';

const PAGES = [
  '/index.html', '/technology.html', '/applications.html', '/products.html', '/resources.html', '/contact.html',
  '/subpages/counter-uas.html', '/subpages/drone-stationary.html', '/subpages/drone-hovering.html', '/subpages/drone-on-the-move.html',
  '/subpages/aps.html', '/subpages/daa-radar.html', '/subpages/bvlos-ops.html', '/subpages/part-107-waivers.html',
  '/subpages/kmb-product-counter-uas-radar.html', '/subpages/kmb-product-daa-radar.html',
  '/no-such-page.html',
  '/subpages/privacy-policy.html', '/subpages/cookie-policy.html', '/subpages/terms-and-conditions.html',
];

for (const url of PAGES) {
  test(`${url} has no accessibility violations and one h1`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('load');
    await page.waitForTimeout(1200); // cards load and animations finish
    await expect(page.locator('h1')).toHaveCount(1);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}

test('brochure form has no accessibility violations when open', async ({ page }) => {
  await page.goto('/subpages/kmb-product-daa-radar.html');
  await page.waitForLoadState('load');
  await page.locator('[data-target="#popupModal-daa"]').click();
  await expect(page.locator('#popupModal-daa')).toBeVisible();
  await page.waitForTimeout(500);
  const { violations } = await new AxeBuilder({ page }).include('#popupModal-daa').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});
