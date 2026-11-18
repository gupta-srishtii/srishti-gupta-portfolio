import type { RealmId } from './portfolio';
export const chapters: {
  title: string;
  realm: RealmId;
  world: string;
  line: string;
  color: string;
}[] = [
  {
    title: 'Graphic Design',
    realm: 'design',
    world: 'The design gallery',
    line: 'Shape, colour, and the spaces between.',
    color: '#a47d8c',
  },
  {
    title: 'Technical Projects',
    realm: 'code',
    world: 'The invention lab',
    line: 'Follow a question. Build a possibility.',
    color: '#6b9790',
  },
  {
    title: 'Art & Hobbies',
    realm: 'art',
    world: 'The painter’s greenhouse',
    line: 'Paint-stained hands. A curious heart.',
    color: '#839164',
  },
  {
    title: 'Books & Stories',
    realm: 'books',
    world: 'The book tree',
    line: 'A place for the stories that stay.',
    color: '#9b9668',
  },
  {
    title: 'Memories, Achievements & Handmade Creations',
    realm: 'honors',
    world: 'The keepsake archive',
    line: 'Achievements, memories, and things made with care.',
    color: '#ac8767',
  },
  {
    title: 'Video Editing',
    realm: 'motion',
    world: 'The film room',
    line: 'Little moments, brought into motion.',
    color: '#8e8ba5',
  },
];
