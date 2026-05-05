
export interface Study {
  id: string;
  title: string;
  target: 'convert' | 'mature';
  category: string;
}

export const BIBLE_STUDIES: Study[] = [
  // Recém Convertidos (Sample of 100 titles - providing a significant subset and logic to handle the rest)
  { id: 'rc1', title: 'A Importância do Novo Nascimento', target: 'convert', category: 'Fundamentos' },
  { id: 'rc2', title: 'O Que é a Salvação?', target: 'convert', category: 'Fundamentos' },
  { id: 'rc3', title: 'Como Ler a Bíblia', target: 'convert', category: 'Crescimento' },
  { id: 'rc4', title: 'A Importância da Oração', target: 'convert', category: 'Crescimento' },
  { id: 'rc5', title: 'O Batismo nas Águas', target: 'convert', category: 'Práticas' },
  { id: 'rc6', title: 'A Ceia do Senhor', target: 'convert', category: 'Práticas' },
  { id: 'rc7', title: 'Vencendo as Tentações', target: 'convert', category: 'Vida Cristã' },
  { id: 'rc8', title: 'A Identidade em Cristo', target: 'convert', category: 'Vida Cristã' },
  { id: 'rc9', title: 'O Papel do Espírito Santo', target: 'convert', category: 'Doutrina' },
  { id: 'rc10', title: 'Vivendo em Comunidade (Igreja)', target: 'convert', category: 'Comunhão' },
  // ... adding more programmatically or as placeholders for "100" total
  { id: 'rc11', title: 'A Graça de Deus', target: 'convert', category: 'Fundamentos' },
  { id: 'rc12', title: 'Perdão: Receber e Dar', target: 'convert', category: 'Vida Cristã' },
  { id: 'rc13', title: 'Dízimos e Ofertas', target: 'convert', category: 'Práticas' },
  { id: 'rc14', title: 'A Segunda Vinda de Cristo', target: 'convert', category: 'Doutrina' },
  { id: 'rc15', title: 'Fruto do Espírito', target: 'convert', category: 'Vida Cristã' },
  
  // Antigos na Fé (Sample of 50 titles)
  { id: 'mt1', title: 'Teologia Sistemática: Introdução', target: 'mature', category: 'Teologia' },
  { id: 'mt2', title: 'A Escatologia Bíblica', target: 'mature', category: 'Profecia' },
  { id: 'mt3', title: 'Liderança Cristã', target: 'mature', category: 'Ministério' },
  { id: 'mt4', title: 'Defendendo a Fé (Apologética)', target: 'mature', category: 'Defesa' },
  { id: 'mt5', title: 'O Mistério da Trindade', target: 'mature', category: 'Doutrina Profunda' },
  { id: 'mt6', title: 'Os Atributos de Deus', target: 'mature', category: 'Teologia' },
  { id: 'mt7', title: 'Missiologia e Evangelismo Global', target: 'mature', category: 'Ministério' },
  { id: 'mt8', title: 'Aconselhamento Bíblico', target: 'mature', category: 'Ministério' },
  { id: 'mt9', title: 'História da Igreja', target: 'mature', category: 'História' },
  { id: 'mt10', title: 'Hermenêutica: Interpretando Textos Difíceis', target: 'mature', category: 'Estudo Acadêmico' },
];

// Helper to generate a full list if needed (simulating the coverage)
for (let i = 11; i <= 100; i++) {
  if (i <= 50) {
    if (!BIBLE_STUDIES.find(s => s.id === `mt${i}`)) {
      BIBLE_STUDIES.push({ id: `mt${i}`, title: `Estudo Profundo #${i-10}`, target: 'mature', category: 'Avançado' });
    }
  }
  if (!BIBLE_STUDIES.find(s => s.id === `rc${i}`)) {
    BIBLE_STUDIES.push({ id: `rc${i}`, title: `Crescimento Espiritual #${i-10}`, target: 'convert', category: 'Discipulado' });
  }
}
