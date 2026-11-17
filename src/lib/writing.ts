import { getCollection } from 'astro:content';

/** Published articles, most recent first. */
export async function getArticles() {
  const all = await getCollection('writing', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const longDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
