
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const BIBLE_QUIZ: Question[] = [
  // Antigo Testamento
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
    id: 'q6',
    question: 'Qual o nome do jardim onde Adão e Eva viveram?',
    options: ['Jardim do Getsêmani', 'Jardim das Oliveiras', 'Jardim do Éden', 'Jardim de Susã'],
    correctAnswer: 2,
    explanation: 'Deus colocou o homem no Jardim do Éden (Gênesis 2:8).'
  },
  {
    id: 'q7',
    question: 'Quantos dias e noites choveu no dilúvio de Noé?',
    options: ['7 dias', '12 dias', '40 dias', '100 dias'],
    correctAnswer: 2,
    explanation: 'Choveu sobre a terra quarenta dias e quarenta noites (Gênesis 7:12).'
  },
  // Novo Testamento
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
  },
  {
    id: 'q8',
    question: 'Quem traiu Jesus com um beijo?',
    options: ['Pedro', 'João', 'Judas Iscariotes', 'Tomé'],
    correctAnswer: 2,
    explanation: 'Judas Iscariotes entregou Jesus aos principais dos sacerdotes com um beijo (Mateus 26:48-49).'
  },
  {
    id: 'q9',
    question: 'Qual o nome da cidade onde Jesus nasceu?',
    options: ['Nazaré', 'Jerusalém', 'Belém', 'Jericó'],
    correctAnswer: 2,
    explanation: 'Jesus nasceu em Belém da Judeia (Mateus 2:1).'
  },
  {
    id: 'q10',
    question: 'Quem escreveu a maioria das epístolas no Novo Testamento?',
    options: ['Pedro', 'Paulo', 'João', 'Tiago'],
    correctAnswer: 1,
    explanation: 'O apóstolo Paulo é o autor da maioria das epístolas do Novo Testamento.'
  },
  {
    id: 'q11',
    question: 'Quem foi jogado na cova dos leões?',
    options: ['Daniel', 'José', 'Sansão', 'Elias'],
    correctAnswer: 0,
    explanation: 'Daniel foi jogado na cova dos leões por sua fidelidade a Deus (Daniel 6).'
  },
  {
    id: 'q12',
    question: 'Qual o livro mais longo da Bíblia?',
    options: ['Gênesis', 'Isaías', 'Salmos', 'Apocalipse'],
    correctAnswer: 2,
    explanation: 'O livro de Salmos é o mais longo, com 150 capítulos.'
  },
  {
    id: 'q13',
    question: 'Qual homem era conhecido por sua grande força?',
    options: ['Golias', 'Sansão', 'Davi', 'Salomão'],
    correctAnswer: 1,
    explanation: 'Sansão recebeu força extraordinária de Deus (Juízes 13-16).'
  },
  {
    id: 'q14',
    question: 'Quem construiu a arca?',
    options: ['Moisés', 'Noé', 'Abraão', 'Ló'],
    correctAnswer: 1,
    explanation: 'Noé construiu a arca conforme a ordem de Deus (Gênesis 6).'
  },
  {
    id: 'q16',
    question: 'Qual o nome do profeta que foi engolido por um grande peixe?',
    options: ['Elias', 'Eliseu', 'Jonas', 'Isaías'],
    correctAnswer: 2,
    explanation: 'Jonas tentou fugir de Deus e foi engolido por um grande peixe (Jonas 1).'
  },
  {
    id: 'q17',
    question: 'Quantas pragas Deus enviou ao Egito?',
    options: ['7', '10', '12', '3'],
    correctAnswer: 1,
    explanation: 'Deus enviou 10 pragas sobre o Egito para que o Faraó libertasse Seu povo (Êxodo 7-12).'
  },
  {
    id: 'q18',
    question: 'Quem foi o discípulo que negou Jesus três vezes?',
    options: ['Judas', 'Pedro', 'João', 'André'],
    correctAnswer: 1,
    explanation: 'Pedro negou Jesus três vezes antes do galo cantar, conforme Jesus profetizou (Mateus 26).'
  },
  {
    id: 'q19',
    question: 'Quem viu a sarça ardente?',
    options: ['Abraão', 'Jacó', 'Moisés', 'Josué'],
    correctAnswer: 2,
    explanation: 'Deus falou com Moisés através de uma sarça que ardia mas não se consumia (Êxodo 3).'
  },
  {
    id: 'q20',
    question: 'Qual o nome do rio onde Jesus foi batizado?',
    options: ['Rio Nilo', 'Rio Eufrates', 'Rio Jordão', 'Rio Tigre'],
    correctAnswer: 2,
    explanation: 'Jesus foi batizado por João Batista no Rio Jordão (Mateus 3:13).'
  },
  {
    id: 'q21',
    question: 'O que caiu das mãos de Pedro na prisão?',
    options: ['Chaves', 'Cadeias', 'Pão', 'Espada'],
    correctAnswer: 1,
    explanation: 'Quando o anjo apareceu, as cadeias caíram das mãos de Pedro (Atos 12:7).'
  },
  {
    id: 'q22',
    question: 'Qual a cidade cujas muralhas caíram?',
    options: ['Babilônia', 'Jericó', 'Nínive', 'Tiro'],
    correctAnswer: 1,
    explanation: 'As muralhas de Jericó caíram após o povo rodear a cidade por sete dias (Josué 6).'
  },
  {
    id: 'q23',
    question: 'Quem era o rei de Israel conhecido por sua sabedoria?',
    options: ['Saul', 'Davi', 'Salomão', 'Ezequias'],
    correctAnswer: 2,
    explanation: 'Salomão pediu sabedoria a Deus e se tornou o homem mais sábio da terra (1 Reis 3).'
  },
  {
    id: 'q24',
    question: 'Quem foi levado ao céu em um redemoinho?',
    options: ['Moisés', 'Elias', 'Enoque', 'Eliseu'],
    correctAnswer: 1,
    explanation: 'Elias foi levado ao céu em um carro de fogo num redemoinho (2 Reis 2).'
  },
  {
    id: 'q25',
    question: 'Qual o "Fruto do Espírito" mencionado primeiro em Gálatas 5?',
    options: ['Paz', 'Alegria', 'Amor', 'Bondade'],
    correctAnswer: 2,
    explanation: 'Mas o fruto do Espírito é: amor, gozo, paz... (Gálatas 5:22).'
  },
  {
    id: 'q26',
    question: 'Quem foi o sucessor de Moisés como líder de Israel?',
    options: ['Calebe', 'Araão', 'Josué', 'Gideão'],
    correctAnswer: 2,
    explanation: 'Josué foi escolhido por Deus para suceder Moisés e levar o povo à Terra Prometida (Josué 1).'
  },
  {
    id: 'q27',
    question: 'Qual o nome da mulher que escondeu os espias em Jericó?',
    options: ['Raabe', 'Débora', 'Rute', 'Ester'],
    correctAnswer: 0,
    explanation: 'Raabe, a meretriz, escondeu os espias e por isso ela e sua família foram salvas (Josué 2).'
  },
  {
    id: 'q28',
    question: 'Quantos pães e peixes Jesus usou para alimentar os 5 mil?',
    options: ['7 pães e 2 peixes', '5 pães e 2 peixes', '12 pães e 5 peixes', '10 pães e 2 peixes'],
    correctAnswer: 1,
    explanation: 'Jesus usou cinco pães e dois peixes para alimentar a multidão (Mateus 14:17).'
  },
  {
    id: 'q29',
    question: 'Quem foi o primeiro rei de Israel?',
    options: ['Davi', 'Salomão', 'Saul', 'Samuel'],
    correctAnswer: 2,
    explanation: 'Saul foi ungido por Samuel como o primeiro rei de Israel (1 Samuel 10).'
  },
  {
    id: 'q30',
    question: 'Onde Moisés recebeu os Dez Mandamentos?',
    options: ['Monte Carmelo', 'Monte Sinai', 'Monte das Oliveiras', 'Monte Tabor'],
    correctAnswer: 1,
    explanation: 'Moisés subiu ao Monte Sinai, onde Deus lhe deu as tábuas da Lei (Êxodo 19-20).'
  },
  {
    id: 'q31',
    question: 'Quem era o marido de Maria, a mãe de Jesus?',
    options: ['Zacarias', 'José', 'João', 'Lázaro'],
    correctAnswer: 1,
    explanation: 'José era um carpinteiro e esposo de Maria (Mateus 1).'
  },
  {
    id: 'q32',
    question: 'Qual o nome do apóstolo que era cobrador de impostos?',
    options: ['Mateus', 'Marcos', 'Lucas', 'João'],
    correctAnswer: 0,
    explanation: 'Mateus (também chamado Levi) era publicano antes de seguir Jesus (Mateus 9:9).'
  },
  {
    id: 'q33',
    question: 'Quem foi vendido pelos irmãos como escravo para o Egito?',
    options: ['Benjamim', 'José', 'Rúben', 'Davi'],
    correctAnswer: 1,
    explanation: 'José foi vendido por seus irmãos por causa de inveja (Gênesis 37).'
  },
  {
    id: 'q34',
    question: 'Qual destas frases foi dita por Jesus na cruz?',
    options: ['"Está consumado"', '"Eu sou o pão da vida"', '"Lázaro, vem para fora"', '"Arrependei-vos"'],
    correctAnswer: 0,
    explanation: '"Está consumado" foi uma das últimas palavras de Jesus na cruz (João 19:30).'
  },
  {
    id: 'q35',
    question: 'Quem era o profeta que desafiou os profetas de Baal no Monte Carmelo?',
    options: ['Ezequiel', 'Isaías', 'Elias', 'Amós'],
    correctAnswer: 2,
    explanation: 'Elias desafiou os profetas de Baal para provar quem era o verdadeiro Deus (1 Reis 18).'
  }
];
