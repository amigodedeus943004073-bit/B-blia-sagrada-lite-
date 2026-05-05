
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const BIBLE_QUIZ: Question[] = [
  {
    id: 'q1',
    question: 'Quem foi o primeiro homem criado por Deus?',
    options: ['Noé', 'Abraão', 'Adão', 'Moisés'],
    correctAnswer: 2,
    explanation: 'Conforme Gênesis 2, Adão foi o primeiro homem criado por Deus.'
  },
  {
    id: 'q2',
    question: 'Qual o nome do mar que Moisés dividiu?',
    options: ['Mar Morto', 'Mar Vermelho', 'Mar da Galileia', 'Mar Mediterrâneo'],
    correctAnswer: 1,
    explanation: 'Moisés dividiu o Mar Vermelho para o povo de Israel passar (Êxodo 14).'
  },
  {
    id: 'q3',
    question: 'Quem derrotou o gigante Golias?',
    options: ['Saul', 'Salomão', 'Davi', 'Sansão'],
    correctAnswer: 2,
    explanation: 'Davi, o jovem pastor, derrotou Golias com uma funda e uma pedra (1 Samuel 17).'
  },
  {
    id: 'q4',
    question: 'Quantos discípulos Jesus escolheu inicialmente?',
    options: ['10', '12', '7', '40'],
    correctAnswer: 1,
    explanation: 'Jesus escolheu 12 apóstolos para serem Seus seguidores mais próximos.'
  },
  {
    id: 'q5',
    question: 'Qual foi o primeiro milagre de Jesus?',
    options: ['Cura de um cego', 'Multiplicação de pães', 'Caminhar sobre as águas', 'Transformar água em vinho'],
    correctAnswer: 3,
    explanation: 'O primeiro milagre de Jesus foi transformar água em vinho nas bodas de Caná (João 2).'
  }
];
