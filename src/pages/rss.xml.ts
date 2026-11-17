import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../lib/writing';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: `${site.name}: writing`,
    description: 'Technical notes by Thibaud Ledent.',
    site: context.site ?? site.url,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: `/writing/${a.id}/`,
    })),
  });
}
