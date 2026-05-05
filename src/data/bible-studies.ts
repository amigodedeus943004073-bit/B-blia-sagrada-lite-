
export interface Study {
  id: string;
  title: string;
  target: 'convert' | 'mature';
  category: string;
}

export const BIBLE_STUDIES: Study[] = [
  // Recém Convertidos
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
  { id: 'rc11', title: 'A Graça de Deus', target: 'convert', category: 'Fundamentos' },
  { id: 'rc12', title: 'Perdão: Receber e Dar', target: 'convert', category: 'Vida Cristã' },
  { id: 'rc13', title: 'Dízimos e Ofertas', target: 'convert', category: 'Práticas' },
  { id: 'rc14', title: 'A Segunda Vinda de Cristo', target: 'convert', category: 'Doutrina' },
  { id: 'rc15', title: 'Fruto do Espírito', target: 'convert', category: 'Vida Cristã' },
  { id: 'rc16', title: 'Armadura de Deus', target: 'convert', category: 'Guerra Espiritual' },
  { id: 'rc17', title: 'A Bíblia: Palavra de Deus', target: 'convert', category: 'Fundamentos' },
  { id: 'rc18', title: 'O Significado da Páscoa', target: 'convert', category: 'Doutrina' },
  { id: 'rc19', title: 'O Significado do Natal', target: 'convert', category: 'Doutrina' },
  { id: 'rc20', title: 'Como Compartilhar sua Fé', target: 'convert', category: 'Evangelismo' },
  { id: 'rc21', title: 'Humildade e Serviço', target: 'convert', category: 'Caráter' },
  { id: 'rc22', title: 'A Santidade de Deus', target: 'convert', category: 'Teologia' },
  { id: 'rc23', title: 'Fé vs Obras', target: 'convert', category: 'Fundamentos' },
  { id: 'rc24', title: 'A Ressurreição de Cristo', target: 'convert', category: 'Fundamentos' },
  { id: 'rc25', title: 'O Amor ao Próximo', target: 'convert', category: 'Vida Cristã' },
  
  // Antigos na Fé
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
  { id: 'mt11', title: 'Os Manuscritos Originais', target: 'mature', category: 'Bibliografia' },
  { id: 'mt12', title: 'O Tabernáculo e sua Tipologia', target: 'mature', category: 'Tipologia' },
  { id: 'mt13', title: 'As Alianças Bíblicas', target: 'mature', category: 'Alianças' },
  { id: 'mt14', title: 'Doutrina da Graça (Soteriologia)', target: 'mature', category: 'Doutrina' },
  { id: 'mt15', title: 'Vida Devocional Profunda', target: 'mature', category: 'Espiritualidade' },
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
