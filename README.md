# ledent.dev

Personal website of Thibaud Ledent. Static site built with [Astro](https://astro.build): no client framework, a few lines of inline JavaScript for the theme switch, Markdown for articles.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check .astro and .ts files
```

Requires Node 22 or later.

## Where the content lives

| To change | Edit |
| --- | --- |
| Experience, skills, education, profile text, email | The [CV repository](https://github.com/thibaudledent/CV). Never edit `src/data/cv.json` by hand: it is overwritten on every CV release. |
| Headline, ledger figures, extra profiles | `src/data/site.ts` |
| Projects | Nothing: every public GitHub repository is fetched at build time (`src/lib/github.ts`), most starred first. New ones appear on the next build. |
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
  lib/           cv.ts, writing.ts and github.ts: data helpers
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

### 1. Turn on Pages

In the repository: **Settings > Pages > Build and deployment > Source: GitHub Actions**.

### 2. Add the custom domain

In **Settings > Pages > Custom domain**, enter `ledent.dev` and save. With the "GitHub Actions" source no `CNAME` file is needed in the repository.

Optionally verify the domain for your account first (**Account settings > Pages > Add a domain**), which stops anyone else from claiming it on GitHub.

### 3. DNS records at Cloudflare

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `ledent.dev` (`@`) | `thibaudledent.github.io` | DNS only |
| CNAME | `www` | `thibaudledent.github.io` | DNS only |

- Cloudflare flattens the CNAME at the apex, so no A records are needed.
- Keep the proxy off (grey cloud) at least until GitHub has issued its certificate and **Enforce HTTPS** can be ticked in the Pages settings. `.dev` is HTTPS-only in every browser, so the site is unreachable until that certificate exists.
- If you later turn the Cloudflare proxy on, set **SSL/TLS > Overview** to **Full (strict)**.
- GitHub redirects `www.ledent.dev` to `ledent.dev` automatically once both records exist.

### 4. Allow deployments

```sh
gh variable set DEPLOY_ENABLED --repo thibaudledent/ledent.dev --body true
gh workflow run "Build and deploy" --repo thibaudledent/ledent.dev
```

From then on every push to `main` deploys.

