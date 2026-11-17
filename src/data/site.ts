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
  { match: 'CBAM', figure: '27 member states' },
  { match: 'Acquirer Hub', figure: '0 → 7M+ transactions/day' },
  { match: 'Tokenization Service', figure: '2B+ tokens migrated' },
];

export interface Project {
  name: string;
  description: string;
  kind: string; // what my part in it is
  language: string;
  url: string;
  links?: { label: string; url: string }[];
  featured?: boolean; // shown on the home page
}

export const projects: Project[] = [
  {
    name: 'j8583',
    description:
      'Java implementation of the ISO 8583 protocol, the message format behind card payments. I maintain this fork, first made while working on payment platforms: published to Maven Central, released automatically on every merge to main, with documentation guides and Javadoc.',
    kind: 'Maintainer of the fork',
    language: 'Java',
    url: 'https://github.com/thibaudledent/j8583',
    links: [
      { label: 'Maven Central', url: 'https://central.sonatype.com/search?smo=true&namespace=io.github.thibaudledent.j8583&name=j8583' },
      { label: 'Javadoc', url: 'https://javadoc.io/doc/io.github.thibaudledent.j8583/j8583' },
    ],
    featured: true,
  },
  {
    name: 'evernote-to-notion-migration',
    description:
      'Migrates Evernote .enex exports to Notion through the official Notion API, with automatic attachment compression, decryption of encrypted content and resolution of internal note links.',
    kind: 'Author',
    language: 'Python',
    url: 'https://github.com/thibaudledent/evernote-to-notion-migration',
    featured: true,
  },
  {
    name: 'CV',
    description:
      'My CV as code, built with Typst: content kept as data, a designed one-page theme and an ATS-safe theme, compiled by CI on every push. Tagged releases publish the PDF and the content of this site.',
    kind: 'Author',
    language: 'Typst',
    url: 'https://github.com/thibaudledent/CV',
    featured: true,
  },
  {
    name: 'quarkus-poc',
    description:
      'Proof of concept from 2020: a Quarkus application compiled to a native image and run on AWS Lambda.',
    kind: 'Author',
    language: 'Java',
    url: 'https://github.com/thibaudledent/quarkus-poc',
    links: [{ label: 'Article', url: '/writing/quarkus-poc-aws-lambda/' }],
  },
  {
    name: 'config',
    description: 'My personal configuration and install files: zsh, Neovim, Maven, Terminator and setup scripts.',
    kind: 'Author',
    language: 'Shell',
    url: 'https://github.com/thibaudledent/config',
  },
];
