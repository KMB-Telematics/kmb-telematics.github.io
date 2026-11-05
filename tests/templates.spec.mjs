import { readFileSync } from 'node:fs';
import { test, expect } from './helpers.mjs';

const read = (path) => readFileSync(path, 'utf8');
const assets = (html) => [...html.matchAll(/<(?:link|script)[^>]*(?:href|src)="(\/assets\/(?:css|js|vendor)[^"]+)"/g)].map((m) => m[1]);
const metaNames = (html) => [...html.matchAll(/<meta (?:property|name)="([^"]+)"/g)].map((m) => m[1]).sort();

for (const template of ['templates/template.html', 'templates/blog-template.html']) {
  test(`${template} matches what a published page needs`, () => {
    const html = read(template);
    const published = read('docs/technology.html');
    expect(assets(html)).toEqual(assets(published));
    expect(metaNames(html)).toEqual(metaNames(published));
    expect(html).toContain('<link rel="canonical" href="https://www.kmbradar.com/');
    expect(html).toContain('<title>PAGE TITLE | KMB Telematics</title>');
    expect(html).toContain('<main>');
    expect(html).toMatch(/<inner-header pagename=/);
  });
}
