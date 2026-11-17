import raw from '../data/cv.json';
import { figures } from '../data/site';

// Shape of src/data/cv.json, as exported by export.typ in the CV repository.
export interface CvEntry {
  client: string;
  project: string;
  role: string;
  location: string;
  dates: string;
  summary: string | null;
  bullets: string[];
  stack: string | null;
}
export interface CvMission {
  name: string;
  dates: string;
  summary: string | null;
  bullets: string[];
  stack: string | null;
}
export interface Cv {
  name: string;
  title: string;
  location: string;
  email: string;
  links: { label: string; url: string }[];
  profile: string;
  experience: CvEntry[];
  employment: {
    employer: string;
    role: string;
    location: string;
    dates: string;
    intro: string;
    missions: CvMission[];
  };
  skills: { group: string; items: string }[];
  certifications: string[];
  education: string[];
  languages: string;
  open_source: string;
}

export const cv = raw as Cv;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown from the CV export (**bold**, _emphasis_, [text](url)) to HTML. */
export function inline(text: string | null | undefined): string {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
}

/** The same text with the Markdown markers removed, for meta tags. */
export function plain(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** "Java · Kafka · Oracle" -> ["Java", "Kafka", "Oracle"] */
export const list = (s: string | null | undefined): string[] =>
  s ? s.split('·').map((x) => x.trim()).filter(Boolean) : [];

export const isCurrent = (dates: string) => /present|now/i.test(dates);

/** "Acquirer Hub — Lead Developer (Worldline, Brussels)" -> title / role / place */
export function parseMission(name: string) {
  const m = name.match(/^(.*?)\s+—\s+(.*?)(?:\s+\((.*)\))?$/);
  if (!m) return { title: name, role: '', place: '' };
  return { title: m[1], role: m[2], place: m[3] ?? '' };
}

const figureFor = (title: string) => figures.find((f) => title.startsWith(f.match))?.figure ?? '';

export interface LedgerRow {
  dates: string;
  title: string;
  detail: string;
  figure: string;
  current: boolean;
}

/** Every mission of the CV as one flat list, most recent first. */
export function ledger(): LedgerRow[] {
  const freelance = cv.experience.map((e) => ({
    dates: e.dates,
    title: e.project,
    detail: `${e.role}, ${e.client}`,
    figure: figureFor(e.project),
    current: isCurrent(e.dates),
  }));
  const missions = cv.employment.missions.map((m) => {
    const { title, role, place } = parseMission(m.name);
    return {
      dates: m.dates,
      title,
      detail: [role, place].filter(Boolean).join(', '),
      figure: figureFor(title),
      current: isCurrent(m.dates),
    };
  });
  return [...freelance, ...missions];
}
