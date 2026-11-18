// Everything about the site that is not in the CV or in an article.
// Professional content (experience, skills, education) comes from
// src/data/cv.json, which is published by the CV repository.

export const site = {
  name: 'Thibaud Ledent',
  domain: 'ledent.dev',
  url: 'https://ledent.dev',
  // Second line of the home page headline, after the name.
  tagline: 'Software engineer and tech lead for large-scale transactional platforms.',
  description:
    'Thibaud Ledent is a Belgian freelance senior software engineer and tech lead with 10+ years on large-scale transactional platforms and high-volume payment systems.',
  cvPdf: '/cv/Thibaud-Ledent-CV.pdf',
  // Public repository of this site. Leave empty to hide the "source" link.
  sourceUrl: '',
};

export const nav = [
  { label: 'experience', href: '/experience/' },
  { label: 'projects', href: '/projects/' },
  { label: 'writing', href: '/writing/' },
  { label: 'contact', href: '#contact' },
];

// Profiles that are not in the CV. LinkedIn and GitHub come from cv.json.
export const extraProfiles = [
  { label: 'Stack Overflow', handle: 'stackoverflow.com/users/9321274', url: 'https://stackoverflow.com/users/9321274' },
  { label: 'X', handle: 'x.com/thibaudledent', url: 'https://x.com/thibaudledent' },
];

// The right-hand column of the home page ledger: one figure per entry,
// matched on the start of the project or mission name in the CV.
// Every figure is taken from the CV text. Entries without a match show none.
export const figures: { match: string; figure: string }[] = [
  { match: 'CBAM', figure: '60+ person programme' },
  { match: 'Acquirer Hub', figure: '0 → 7M+ transactions/day' },
  { match: 'Tokenization Service', figure: '2B+ tokens migrated' },
];
