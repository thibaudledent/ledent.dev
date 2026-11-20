// All public, non-archived repositories of the GitHub account, fetched at build time.
// Sorted by stars, then by most recent push.

const USER = 'thibaudledent';

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
}

let cache: Promise<Repo[]> | undefined;

export function getRepos(): Promise<Repo[]> {
  return (cache ??= fetchRepos());
}

async function fetchRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const raw: any[] = [];
  try {
    for (let page = 1; ; page++) {
      const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&per_page=100&page=${page}`, { headers });
      if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
      const batch = await res.json();
      raw.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (err) {
    // A deploy must never publish an empty list; a local build can go on without it.
    if (process.env.CI) throw err;
    console.warn(`[github] could not fetch repositories, the list will be empty: ${err}`);
    return [];
  }

  return raw
    .filter((r) => !r.private && !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
    }))
    .sort((a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt));
}
