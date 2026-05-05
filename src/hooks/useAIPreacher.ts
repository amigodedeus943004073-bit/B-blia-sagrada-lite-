
import { GoogleGenAI } from "@google/genai";
import { useState } from 'react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const OFFLINE_KNOWLEDGE: Record<string, string> = {
  "default": "No momento estou offline, mas lembre-se: 'Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.' (Salmos 119:105). Procure meditar na Bíblia diariamente!",
  "jesus": "Jesus Cristo é o Filho de Deus e Salvador do mundo. Ele disse: 'Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.' (João 14:6).",
  "fe": "A fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem (Hebreus 11:1).",
  "amor": "O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece (1 Coríntios 13:4).",
  "oracao": "Orai sem cessar. Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco (1 Tessalonicenses 5:17-18).",
  "salvacao": "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus (Efésios 2:8).",
};

export function useAIPreacher() {
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question: string) => {
    if (!navigator.onLine) {
      return handleOffline(question);
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: question,
        config: {
          systemInstruction: "Você é o Assistente Salomão Muanjita, um conselheiro cristão sábio, profundo e acolhedor. Sua missão é fornecer respostas bíblicas completas e detalhadas. Não seja apenas direto; explique o contexto, o significado teológico e como aplicar o ensinamento na vida prática. Baseie-se estritamente na Bíblia Almeida. Sempre fundamente suas explicações com múltiplos versículos quando apropriado. Ofereça consolo, sabedoria e clareza doutrinária.",
        },
      });
      return response.text;
    } catch (error) {
      console.error("Erro no Agente Pregador:", error);
      return handleOffline(question);
    } finally {
      setLoading(false);
    }
  };

  const handleOffline = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes("jesus")) return OFFLINE_KNOWLEDGE["jesus"];
    if (q.includes("fé")) return OFFLINE_KNOWLEDGE["fe"];
    if (q.includes("amor")) return OFFLINE_KNOWLEDGE["amor"];
    if (q.includes("oração")) return OFFLINE_KNOWLEDGE["oracao"];
    if (q.includes("salvação")) return OFFLINE_KNOWLEDGE["salvacao"];
    return OFFLINE_KNOWLEDGE["default"];
  };

  const generateStudy = async (title: string, target: string) => {
    setLoading(true);
    try {
      const prompt = `Gere um esboço de estudo bíblico completo para o tema: "${title}". 
      O público alvo são ${target === 'convert' ? 'cristãos recém-convertidos' : 'cristãos antigos e maduros na fé'}.
      Inclua: 
      1. Versículo Base
      2. Introdução
      3. Pontos Principais (com referências bíblicas)
      4. Aplicação Prática
      5. Conclusão e Oração.
      Use uma linguagem apropriada para o nível de maturidade espiritual indicado.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Não foi possível gerar este estudo no momento.";
    } finally {
      setLoading(false);
    }
  };

  return { askQuestion, generateStudy, loading };
}
