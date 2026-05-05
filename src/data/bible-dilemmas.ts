
export interface Dilemma {
  id: string;
  scenario: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const BIBLE_DILEMMAS: Dilemma[] = [
  {
    id: 'd1',
    scenario: 'Salomão Muanjita roubou 100 mil kwanzas de uma viúva. Jesus aparece naquele exato momento para o arrebatamento. O que acontece com ele?',
    options: [
      {
        text: 'Ele sobe, pois Deus é amor e perdoa tudo.',
        isCorrect: false,
        explanation: 'Deus é amor, mas a Bíblia diz que nenhum ladrão herdará o reino de Deus sem arrependimento e abandono do pecado (1 Coríntios 6:10).'
      },
      {
        text: 'Ele fica, pois está em pecado não confessado e praticando injustiça.',
        isCorrect: true,
        explanation: 'O arrebatamento encontrará os santos em santidade. O pecado deliberado sem arrependimento impede a subida (Mateus 24:44).'
      }
    ]
  },
  {
    id: 'd2',
    scenario: 'Um cristão é insultado e humilhado publicamente no trabalho por sua fé. Como ele deve reagir segundo o ensinamento de Jesus?',
    options: [
      {
        text: 'Responder à altura para defender a honra do Evangelho.',
        isCorrect: false,
        explanation: 'Jesus ensinou a oferecer a outra face e a ser manso, não devolvendo mal com mal (Mateus 5:39).'
      },
      {
        text: 'Orar por quem o persegue e responder com amor e mansidão.',
        isCorrect: true,
        explanation: 'Jesus disse: "Amai a vossos inimigos, bendizei os que vos maldizem, fazei bem aos que vos odeiam, e orai pelos que vos maltratam" (Mateus 5:44).'
      }
    ]
  },
  {
    id: 'd3',
    scenario: 'Você encontra uma carteira cheia de dinheiro no chão de um shopping sem ninguém por perto. O que a Bíblia orienta?',
    options: [
      {
        text: 'Ficar com o dinheiro, pois é uma "benção de Deus" que caiu do céu.',
        isCorrect: false,
        explanation: 'A benção de Deus não vem através da falta de integridade. O oitavo mandamento diz: "Não furtarás" (Êxodo 20:15).'
      },
      {
        text: 'Entregar na administração do shopping para que o dono seja encontrado.',
        isCorrect: true,
        explanation: 'A honestidade é um fruto da vida com Cristo. Devemos fazer aos outros o que gostaríamos que fizessem conosco (Mateus 7:12).'
      }
    ]
  },
  {
    id: 'd4',
    scenario: 'O rei Davi viu Bate-Seba e cometeu adultério. Para encobrir, ele planejou a morte de Urias. Qual foi a consequência direta apontada pelo profeta Natã?',
    options: [
      {
        text: 'Deus ignorou o pecado porque Davi era "um homem segundo o coração de Deus".',
        isCorrect: false,
        explanation: 'Deus não faz acepção de pessoas; o pecado de Davi teve consequências severas para sua casa e o filho que nasceu morreu (2 Samuel 12).'
      },
      {
        text: 'A espada nunca se apartaria da casa de Davi.',
        isCorrect: true,
        explanation: 'Natã profetizou que, por causa do desprezo à palavra do Senhor, o mal viria da própria casa de Davi (2 Samuel 12:10).'
      }
    ]
  },
  {
    id: 'd5',
    scenario: 'Ananias e Safira venderam uma propriedade e retiveram parte do valor, mas disseram aos apóstolos que entregaram tudo. Qual foi o pecado principal julgado?',
    options: [
      {
        text: 'Eles mentiram ao Espírito Santo.',
        isCorrect: true,
        explanation: 'Pedro disse que eles não mentiram aos homens, mas a Deus (Atos 5:3-4).'
      },
      {
        text: 'Eles não deram o dízimo corretamente.',
        isCorrect: false,
        explanation: 'O problema não foi a quantia, mas a mentira e o fingimento de santidade (Atos 5).'
      }
    ]
  },
  {
    id: 'd6',
    scenario: 'Um líder da igreja é pego em um escândalo financeiro, desviando ofertas para benefício próprio. Como a igreja deve proceder segundo 1 Timóteo 5?',
    options: [
      {
        text: 'Esconder para não envergonhar o nome de Jesus.',
        isCorrect: false,
        explanation: 'A Bíblia diz que aqueles que pecam devem ser repreendidos na presença de todos, para que os outros tenham temor (1 Timóteo 5:20).'
      },
      {
        text: 'Repreender publicamente se o pecado for comprovado.',
        isCorrect: true,
        explanation: 'A transparência e o temor são fundamentais. O pecado não deve ser ocultado para manter aparências (1 Timóteo 5:19-20).'
      }
    ]
  },
  {
    id: 'd7',
    scenario: 'Sansão revelou o segredo de sua força a Dalila por insistência. Qual foi o resultado espiritual dessa quebra de voto?',
    options: [
      {
        text: 'Ele perdeu a força porque o cabelo era mágico.',
        isCorrect: false,
        explanation: 'A força vinha do Espírito do Senhor sobre ele devido ao seu voto nazireu; ao permitir o corte, ele quebrou o voto e o Senhor se retirou dele (Juízes 16:20).'
      },
      {
        text: 'O Senhor se retirou dele e ele ficou como qualquer outro homem.',
        isCorrect: true,
        explanation: 'A tragédia de Sansão foi não perceber que o Senhor já não estava mais com ele após a quebra do seu compromisso (Juízes 16:20).'
      }
    ]
  },
  {
    id: 'd8',
    scenario: 'Um irmão na fé está espalhando fofocas sobre sua vida pessoal. Segundo Mateus 18, qual o primeiro passo?',
    options: [
      {
        text: 'Falar com o pastor imediatamente.',
        isCorrect: false,
        explanation: 'O primeiro passo é ir e falar com ele a sós (Mateus 18:15).'
      },
      {
        text: 'Ir falar com ele em particular e tentar ganhar o irmão.',
        isCorrect: true,
        explanation: 'Jesus ensinou a resolução direta e privada primeiro: "vai e repreende-o entre ti e ele só" (Mateus 18:15).'
      }
    ]
  },
  {
    id: 'd9',
    scenario: 'Acã escondeu capa babilônica e ouro da cidade de Jericó, que eram "anátema" (dedicados ao Senhor). O que aconteceu com o exército de Israel em seguida?',
    options: [
      {
        text: 'Eles foram derrotados na pequena cidade de Ai.',
        isCorrect: true,
        explanation: 'Por causa do pecado oculto, Israel perdeu a proteção e foi derrotado (Josué 7).'
      },
      {
        text: 'Deus os abençoou com mais vitórias porque Acã foi esperto.',
        isCorrect: false,
        explanation: 'O pecado de um trouxe derrota para toda a congregação (Josué 7).'
      }
    ]
  },
  {
    id: 'd10',
    scenario: 'Em uma situação de pressão, você é solicitado a negar sua fé em Jesus para manter seu emprego. O que Jesus disse sobre isso?',
    options: [
      {
        text: 'Pode negar exteriormente, o importante é o coração.',
        isCorrect: false,
        explanation: 'Jesus disse: "Mas qualquer que me negar diante dos homens, eu o negarei também diante de meu Pai, que está nos céus" (Mateus 10:33).'
      },
      {
        text: 'Permanecer fiel, pois quem o negar diante dos homens será negado no céu.',
        isCorrect: true,
        explanation: 'A fidelidade pública é requerida do verdadeiro seguidor de Cristo (Mateus 10:32-33).'
      }
    ]
  }
];
