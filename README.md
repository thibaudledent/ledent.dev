# ledent.dev

Personal website of Thibaud Ledent. Static site built with [Astro](https://astro.build): no client framework, a few lines of inline JavaScript for the theme switch, Markdown for articles.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check .astro and .ts files
```

Requires Node 22 or later (the version CI uses is in `.nvmrc`).

## Where the content lives

| To change | Edit |
| --- | --- |
| Experience, skills, education, profile text, email | The [CV repository](https://github.com/thibaudledent/CV). Never edit `src/data/cv.json` by hand: it is overwritten on every CV release. |
| Headline, project list, ledger figures, extra profiles | `src/data/site.ts` |
| Articles | `src/content/writing/*.md` |
| The CV PDF | `public/cv/Thibaud-Ledent-CV.pdf`, also published by the CV repository |

### Writing an article

Add a Markdown file to `src/content/writing/`. The file name is the URL: `my-article.md` becomes `/writing/my-article/`.

```md
---
title: "Sort Maven pom.xml files"
date: 2022-01-27
description: "One sentence, used on the index page, in search results and in the RSS feed."
tags: [maven]
draft: false
---

Text starts here. Use `##` for the first level of headings: the title is the page's `<h1>`.
```

- Images that should be optimised go in `src/assets/writing/` and are referenced with a relative path (`../../assets/writing/picture.png`).
- Files that must be served untouched, such as GIFs, go in `public/writing/` and are referenced as `/writing/file.gif`.
- `draft: true` keeps an article out of the build.

## Structure

```
src/
  components/    Wordmark, Header, Footer, Section, Ledger
  content/       writing/*.md
  data/          cv.json (generated), site.ts (hand-written)
  layouts/       Base.astro: <head>, SEO tags, fonts, theme
  lib/           cv.ts and writing.ts: data helpers
  pages/         index, experience, projects, writing, 404, rss.xml
  styles/        global.css: tokens and shared styles
public/          favicon, social image, CV PDF, robots.txt
brand/           source of the social image
```

## Design system

The identity is the cursor wordmark, and the site follows the rules of the logo sheet.

1. **The accent (`#B4510F`) only fills a cursor.** It appears after the wordmark, after the current navigation item, on the open-ended date of the current mission, at the end of the home headline, on keyboard focus, and as the underscore under a hovered link. It never colours text.
2. **Two typefaces.** JetBrains Mono 500 for the wordmark, headings, dates and navigation. IBM Plex Sans for anything read as a sentence. Both are self-hosted through `@fontsource`.
3. **One grid.** A 12.5rem label column and a content column, as on the logo sheet. Section labels are the real `<h2>` of each section.
4. **No radius, no shadow, no gradient.** Structure comes from hairline rules.
5. **The cursor only blinks in the header**: four times on arrival, then it stays solid. It does not blink for visitors who ask for reduced motion.

Tokens (colours, type scale, spacing) are at the top of `src/styles/global.css`. The cursor proportions come from the logo sheet: width 0.345em, height 0.83em, gap 0.276em. The dark theme is the "réserve sur noir" version of the logo; it follows the system setting and can be switched in the footer.

### Brand assets

- `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`: the reduced mark, an accent cursor on an ink square, with the pixel sizes of the logo sheet.
- `public/og.png`: the social sharing image. Its source is `brand/og.html`.

## Deployment using GitHub Pages

The **Build and deploy** workflow (`.github/workflows/deploy.yml`) type-checks and builds the site on every push and pull request. It only publishes from `main`, and only once the repository variable `DEPLOY_ENABLED` is `true` (step 5), so nothing goes out before the domain is ready. The domain `ledent.dev` is registered at Cloudflare, which only serves DNS: GitHub hosts the site and issues the HTTPS certificate.

Do the first setup once, in this order.

### 1. Turn on GitHub Pages

On GitHub, in the repository: **Settings > Pages > Build and deployment > Source**, choose **GitHub Actions**.

### 2. Verify the domain (optional, recommended)

This stops any other GitHub account from publishing a site on `ledent.dev`.

1. On GitHub: **your profile picture > Settings > Pages > Add a domain**, enter `ledent.dev`. GitHub shows a TXT record (a name like `_github-pages-challenge-thibaudledent` and a value).
2. On Cloudflare: **ledent.dev > DNS > Records > Add record**, type **TXT**, paste that name and value, save.
3. Back on GitHub, click **Verify**. It can take a few minutes for the record to be seen.

### 3. Add the DNS records at Cloudflare

On Cloudflare: **ledent.dev > DNS > Records > Add record**, twice:

| Type | Name | Target | Proxy status |
| --- | --- | --- | --- |
| CNAME | `@` | `thibaudledent.github.io` | DNS only (grey cloud) |
| CNAME | `www` | `thibaudledent.github.io` | DNS only (grey cloud) |

- Delete any other `A`, `AAAA` or `CNAME` record on `@` or `www` that Cloudflare may have added (a parking page, for example).
- Cloudflare flattens the CNAME at the apex, so no `A` records are needed.
- The proxy must be **off** (click the orange cloud until it turns grey). With the proxy on, GitHub cannot issue its certificate, and `.dev` is HTTPS-only in every browser, so the site would be unreachable.

### 4. Set the custom domain on GitHub

In the repository: **Settings > Pages > Custom domain**, enter `ledent.dev`, click **Save**. Wait for the DNS check to show a green tick. With the "GitHub Actions" source no `CNAME` file is needed in the repository.

### 5. Allow deployments and deploy

1. In the repository: **Settings > Secrets and variables > Actions > Variables > New repository variable**. Name `DEPLOY_ENABLED`, value `true`.
2. Start the first deployment: **Actions > Build and deploy > Run workflow** (branch `main`). Once both the `build` and `deploy` jobs are green, the site is published.

From then on every push to `main` deploys. To pause deployments, set `DEPLOY_ENABLED` to anything other than `true`.

The same with the GitHub CLI:

```sh
gh variable set DEPLOY_ENABLED --repo thibaudledent/ledent.dev --body true
gh workflow run "Build and deploy" --repo thibaudledent/ledent.dev
```

### 6. Turn on HTTPS

GitHub issues the certificate for `ledent.dev` within about 15 minutes to an hour after step 4. When it is ready, tick **Enforce HTTPS** in **Settings > Pages**. The site is then live at <https://ledent.dev>, and `www.ledent.dev` redirects to it.

### Troubleshooting

- **The `deploy` job is skipped**: `DEPLOY_ENABLED` is not set to `true`, or the run is not on `main`.
- **DNS check fails or stays pending on GitHub**: check that the records in step 3 are grey-cloud, then click **Remove** and re-save the custom domain to start the check again.
- **"Enforce HTTPS" is greyed out**: the certificate is not issued yet. Wait, and make sure the proxy is still off.
- **Turning the Cloudflare proxy on later** (for caching or analytics): only after **Enforce HTTPS** is ticked, and set **Cloudflare > SSL/TLS > Overview** to **Full (strict)**, otherwise visitors get a redirect loop.
