# KMB Telematics website

Static site for www.kmbradar.com, hosted on GitHub Pages with no build step.
Only `docs/` is published. Everything else in this repo is public on GitHub, but is not part of the website.

## Layout

```
docs/                 Published site. Keep CNAME here.
  *.html              Top-level pages
  subpages/           Application, product and legal pages
  pdf/                Brochures. Public to anyone with the URL.
  assets/
    css/              Site styles
    js/               Site code: layout components, forms
    vendor/           Third-party libraries, version in the file name
    img/  video/      Media, grouped by where it is used. Pages use WebP; full-size files back the click-to-enlarge links.
templates/            Starting points for new pages. Not published.
design/               Source and unused media, including full-size originals. Not published.
tests/                Browser tests
```

## Run and test

```
npm ci
npx playwright install chromium
npm run serve         # http://localhost:4173
npm test
```

Tests block third-party requests and mock the form API, so they never create real records.

The tests also cover phone widths, accessibility (axe), search metadata and link previews.

## Adding a page

Start from `templates/`, give the page a unique title, description, canonical URL and preview tags, and add it to `docs/sitemap.xml`.

## Security reports

`docs/.well-known/security.txt` tells researchers how to report issues. Renew its `Expires` date before it passes, at least once a year. The tests fail once it has expired.

## Things that are easy to break

- **Form field names:** `API_FIELD_NAMES` in `docs/assets/js/formhandlers.js` defines the names the backend receives.
- **Card pages:** `applications.html` and `products.html` load `#blog-img`, `#blog-header` and `#blog-text` from each subpage, using `/subpages/` paths.
- **Download buttons:** `data-target="#popupModal-<item>"` must match `thisitem` on `<common-download-form>`.
- **Home page video:** keep the radar plot readable when re-encoding. Very high compression erases its faint grid lines.
- **Public URLs:** Pages has no server-side redirects, so a moved page needs a redirect stub at its old URL.

## Libraries

| Library | Version | Source |
|---|---|---|
| jQuery | 3.7.1 | npm `jquery` |
| Bootstrap | 3.4.1 (final 3.x release) | npm `bootstrap` |
| Morphext | as previously bundled | github.com/MrSaints/Morphext |
| Play font | 5.3.0 (SIL Open Font License) | npm `@fontsource/play` |
