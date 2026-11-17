// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Article URLs of the previous Jekyll site, kept alive as redirects.
const legacyPosts = {
  '/2019/03/01/bitbucket-pipeline': '/writing/bitbucket-pipeline/',
  '/2019/05/11/ngrep-hex-dump': '/writing/ngrep-hex-dump/',
  '/2019/09/19/check-sh-files-shellcheck': '/writing/check-sh-files-shellcheck/',
  '/2019/09/19/sort-json-by-node': '/writing/sort-json-by-node/',
  '/2020/03/27/quarkus-poc-aws-lambda': '/writing/quarkus-poc-aws-lambda/',
  '/2022/01/27/sort-pom-xml': '/writing/sort-pom-xml/',
};

export default defineConfig({
  site: 'https://ledent.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: legacyPosts,
  markdown: {
    shikiConfig: {
      themes: { light: 'min-light', dark: 'min-dark' },
      wrap: false,
    },
  },
});
