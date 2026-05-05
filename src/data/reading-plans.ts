export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  tasks: {
    id: string;
    book: string;
    chapter: number;
    label: string;
  }[];
}

export const BIBLE_READING_PLANS: ReadingPlan[] = [
  {
    id: 'p1',
    title: 'Os Evangelhos em 30 Dias',
    description: 'Conheça a vida e os ensinamentos de Jesus através dos quatro evangelhos.',
    tasks: [
      { id: 't1', book: 'Mateus', chapter: 1, label: 'Mateus 1' },
      { id: 't2', book: 'Mateus', chapter: 2, label: 'Mateus 2' },
      { id: 't3', book: 'Mateus', chapter: 3, label: 'Mateus 3' },
      { id: 't4', book: 'Mateus', chapter: 4, label: 'Mateus 4' },
      { id: 't5', book: 'Mateus', chapter: 5, label: 'Mateus 5' },
      { id: 't6', book: 'Marcos', chapter: 1, label: 'Marcos 1' },
      { id: 't7', book: 'Lucas', chapter: 1, label: 'Lucas 1' },
      { id: 't8', book: 'João', chapter: 1, label: 'João 1' },
    ]
  },
  {
    id: 'p2',
    title: 'Sabedoria de Salomão',
    description: 'Leia provérbios e eclesiastes para crescer em sabedoria.',
    tasks: [
      { id: 'p2-t1', book: 'Provérbios', chapter: 1, label: 'Provérbios 1' },
      { id: 'p2-t2', book: 'Provérbios', chapter: 2, label: 'Provérbios 2' },
      { id: 'p2-t3', book: 'Eclesiastes', chapter: 1, label: 'Eclesiastes 1' },
    ]
  }
];
