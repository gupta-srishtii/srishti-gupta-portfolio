export const realms = [
  {
    id: 'code',
    name: 'Engineering & code',
    short: 'Code',
    subtitle: 'Ideas, built into possibilities',
    symbol: '01',
    color: '#8fae9b',
  },
  {
    id: 'design',
    name: 'Graphic design & UI/UX',
    short: 'Design',
    subtitle: 'Form, feeling, and thoughtful interfaces',
    symbol: '02',
    color: '#d3968c',
  },
  {
    id: 'motion',
    name: 'Motion & storytelling',
    short: 'Motion',
    subtitle: 'Stories, a frame at a time',
    symbol: '03',
    color: '#b1bbc4',
  },
  {
    id: 'art',
    name: 'Painting & creative hobbies',
    short: 'Art',
    subtitle: 'A place for the handmade',
    symbol: '04',
    color: '#c5ac70',
  },
  {
    id: 'books',
    name: 'The reading arboretum',
    short: 'Books',
    subtitle: 'Where curiosity takes root',
    symbol: '05',
    color: '#a4b77d',
  },
  {
    id: 'honors',
    name: 'Achievements & hackathons',
    short: 'Milestones',
    subtitle: 'Experiments, learning, and milestones',
    symbol: '06',
    color: '#d4bc7e',
  },
  {
    id: 'gifts',
    name: 'Handmade gifts & creations',
    short: 'Craft',
    subtitle: 'Small things, made with care',
    symbol: '07',
    color: '#c79883',
  },
  {
    id: 'about',
    name: 'The person behind the atelier',
    short: 'About',
    subtitle: 'A meeting of analytical and artistic curiosity',
    symbol: '08',
    color: '#c9c8ae',
  },
] as const;
export type RealmId = (typeof realms)[number]['id'];
export type Panel = RealmId | 'work' | 'resume' | 'contact' | 'guide' | null;
export type MascotState =
  'idle' | 'wave' | 'walk' | 'run' | 'turn' | 'interact' | 'celebrate' | 'sit';

/** Only verified work belongs here. Empty exhibitions are intentional. */
export interface PortfolioEntry {
  id: string;
  realm: Exclude<RealmId, 'about'>;
  title: string;
  description: string;
  medium?: string;
  year?: number;
  image?: string;
  url?: string;
  technologies?: string[];
}
export const entries: PortfolioEntry[] = [];
export const profile = {
  name: 'Srishti Gupta',
  title: 'CSE AI/ML student · multidisciplinary creative',
  bio: 'I explore graphic design, UI/UX, coding, video editing, painting, dance, and personal creative projects.',
  email: '',
  resume: '',
  education: [] as { institution: string; degree: string; period: string }[],
  experience: [] as { organization: string; role: string; period: string }[],
};
export function gallerySlots(realm: RealmId) {
  const works = entries.filter(
    (entry) => entry.realm === realm || (realm === 'honors' && entry.realm === 'gifts'),
  );
  return works.length ? works : [null, null, null];
}
