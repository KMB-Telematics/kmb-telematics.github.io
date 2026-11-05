import { test as base, expect } from '@playwright/test';

export const API = 'https://k0kivb28mf.execute-api.us-east-2.amazonaws.com';

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST',
  'access-control-allow-headers': '*',
};

// Every test runs offline: third parties are blocked and the form API is mocked,
// so nothing here can create real records. Failures are collected for assertions.
export const test = base.extend({
  // auto: applies to every test, even one that never asks for `site`.
  site: [async ({ page, baseURL }, use) => {
    const site = { posts: [], apiBody: '"OK"', apiStatus: 200, localFailures: [], pageErrors: [] };
    await page.context().route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(baseURL)) return route.continue();
      if (url.startsWith(API)) {
        if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
        site.posts.push({ path: new URL(url).pathname, body: route.request().postDataJSON() });
        return route.fulfill({ status: site.apiStatus, headers: { ...cors, 'content-type': 'application/json' }, body: site.apiBody });
      }
      return route.abort();
    });
    page.on('pageerror', (e) => site.pageErrors.push(e.message));
    page.on('response', (r) => {
      if (r.url().startsWith(baseURL) && r.status() >= 400) site.localFailures.push(`${r.status()} ${r.url()}`);
    });
    await use(site);
  }, { auto: true }],
});

export { expect };
