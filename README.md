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

## Deployment

Every push to `main` publishes the site to <https://ledent.dev>. The **Build and deploy** workflow (`.github/workflows/deploy.yml`) type-checks and builds the site on every push and pull request, and deploys to GitHub Pages only from `main`. To redeploy without a change, for example to refresh the project list: **Actions > Build and deploy > Run workflow**.

### How it is set up

This is already done; it is here in case it ever has to be redone.

- **GitHub**: in the repository's **Settings > Pages**, the source is **GitHub Actions**, the custom domain is `ledent.dev` and **Enforce HTTPS** is ticked. Optionally, the domain is also verified in the account's **Settings > Pages**, which stops other GitHub accounts from using it.
- **Cloudflare** only serves DNS. In **ledent.dev > DNS > Records**:

  | Type | Name | Target | Proxy status |
  | --- | --- | --- | --- |
  | CNAME | `@` | `thibaudledent.github.io` | DNS only (grey cloud) |
  | CNAME | `www` | `thibaudledent.github.io` | DNS only (grey cloud) |
  | TXT | `_github-pages-challenge-thibaudledent` | value given by GitHub (only if the domain is verified) | |

  GitHub redirects `www.ledent.dev` to `ledent.dev`. If you ever turn the Cloudflare proxy on (orange cloud), set **SSL/TLS > Overview** to **Full (strict)**, or visitors get a redirect loop.
