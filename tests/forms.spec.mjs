import { test, expect } from './helpers.mjs';

const fillContact = async (page, { subject = 'Product inquiry', email = 'test@example.com' } = {}) => {
  await page.locator('#contact-form input[name=name]').fill('Test User');
  await page.locator('#contact-form input[name=email]').fill(email);
  await page.locator('#subject').selectOption(subject);
  await page.locator('#contact-form textarea[name=message]').fill('Hello');
};

test.describe('form bug fixes', () => {
  test('accepts email addresses containing capitals', async ({ page, site }) => {
    await page.goto('/contact.html');
    await fillContact(page, { email: 'John.Smith@Example.com' });
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-done')).toBeVisible();
    expect(site.posts[0].body['From Web: Email']).toBe('John.Smith@Example.com');
  });

  test('rejects fields containing only spaces', async ({ page, site }) => {
    await page.goto('/contact.html');
    await fillContact(page);
    await page.locator('#contact-form input[name=name]').fill('   ');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-form input[name=name]')).toHaveClass(/error/);
    expect(site.posts).toEqual([]);
  });

  test('"Others" still works on a second message', async ({ page, site }) => {
    await page.goto('/contact.html');
    await fillContact(page, { subject: 'others' });
    await page.locator('#othersubject').fill('First');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-done')).toBeVisible();
    await fillContact(page, { subject: 'others' });
    await expect(page.locator('#othersubject')).toBeVisible();
    await page.locator('#othersubject').fill('Second');
    await page.locator('#contact-submit').click();
    await expect.poll(() => site.posts.length).toBe(2);
    expect(site.posts[1].body['From Web: Subject']).toBe('Second');
  });

  test('switching away from "Others" clears the highlight on subject', async ({ page }) => {
    await page.goto('/contact.html');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#subject')).toHaveClass(/error/);
    await fillContact(page, { subject: 'others' });
    await page.locator('#othersubject').fill('Partnership');
    await page.locator('#contact-submit').click();
    await expect(page.locator('#subject')).not.toHaveClass(/error/);
  });

  test('a link pre-selecting "Others" shows its field and can be submitted', async ({ page, site }) => {
    await page.goto('/contact.html?subject=others');
    await expect(page.locator('#othersubject')).toBeVisible();
    await page.locator('#contact-form input[name=name]').fill('Test User');
    await page.locator('#contact-form input[name=email]').fill('test@example.com');
    await page.locator('#othersubject').fill('Partnership');
    await page.locator('#contact-form textarea[name=message]').fill('Hello');
    await page.locator('#contact-submit').click();
    await expect.poll(() => site.posts.length).toBe(1);
    expect(site.pageErrors).toEqual([]);
  });

  test('the success message returns after being dismissed', async ({ page }) => {
    await page.goto('/contact.html');
    await fillContact(page);
    await page.locator('#contact-submit').click();
    await page.locator('#contact-done button.close').click();
    await expect(page.locator('#contact-done .alert')).toHaveCount(0);
    await fillContact(page);
    await page.locator('#contact-submit').click();
    await expect(page.locator('#contact-done .alert')).toBeVisible();
    await expect(page.locator('#contact-done')).toContainText('Your message has been sent');
  });

  for (const [label, status, body] of [['an error status', 500, '{"message":"Internal Server Error"}'], ['an unexpected reply', 200, '"NOPE"']]) {
    test(`tells the user when the API returns ${label}, and keeps what they typed`, async ({ page, site }) => {
      site.apiStatus = status;
      site.apiBody = body;
      const messages = [];
      page.on('dialog', async (d) => { messages.push(d.message()); await d.accept(); });
      await page.goto('/contact.html');
      await fillContact(page);
      await page.locator('#contact-submit').click();
      await expect.poll(() => messages.length).toBe(1);
      expect(messages[0]).toMatch(/try again/i);
      await expect(page.locator('#contact-done')).toBeHidden();
      await expect(page.locator('#contact-form textarea[name=message]')).toHaveValue('Hello');
    });
  }

  test('a slow API cannot be submitted twice', async ({ page, site }) => {
    await page.goto('/contact.html');
    await page.context().route('**/contact', async (route) => {
      if (route.request().method() === 'OPTIONS') return route.fallback();
      await new Promise((r) => setTimeout(r, 2600));
      return route.fallback();
    });
    await fillContact(page);
    await page.locator('#contact-submit').click();
    await page.waitForTimeout(2200);
    await expect(page.locator('#contact-submit')).toBeDisabled();
    await expect(page.locator('#contact-done')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#contact-submit')).toBeEnabled();
    expect(site.posts).toHaveLength(1);
  });

  test('a brochure still opens when the browser blocks the pop-up', async ({ page }) => {
    await page.addInitScript(() => { window.open = () => null; });
    await page.goto('/subpages/kmb-product-daa-radar.html');
    await page.waitForLoadState('load');
    await page.locator('[data-target="#popupModal-daa"]').click();
    const form = page.locator('#popupModal-daa form');
    await form.locator('input[name=name]').fill('Test User');
    await form.locator('input[name=email]').fill('test@example.com');
    await page.route('**/*.pdf', (r) => r.fulfill({ status: 200, contentType: 'text/plain', body: 'pdf' }));
    await form.locator('input[name=submit]').click();
    await expect(page).toHaveURL(/Airborne(%20| )DAA\.pdf$/);
  });

  test('clicking a label focuses its field', async ({ page }) => {
    await page.goto('/contact.html');
    await page.locator('label', { hasText: 'Email' }).click();
    await expect(page.locator('#contact-form input[name=email]')).toBeFocused();
    await page.goto('/subpages/kmb-product-daa-radar.html');
    await page.waitForLoadState('load');
    await page.locator('[data-target="#popupModal-daa"]').click();
    await page.locator('#popupModal-daa label', { hasText: 'Job Title' }).click();
    await expect(page.locator('#popupModal-daa input[name=jobtitle]')).toBeFocused();
  });
});

test.describe('contact page URL parameters', () => {
  test('only pre-select a real subject, and cannot alter anything else', async ({ page, site }) => {
    await page.goto('/contact.html?contact-submit=Click%20here&subject=not-a-subject&nope=1');
    await expect(page.locator('#contact-submit')).toHaveValue('Submit');
    await expect(page.locator('#subject')).toHaveValue('default');
    expect(site.pageErrors).toEqual([]);
  });
});
