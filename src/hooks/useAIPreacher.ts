
import { GoogleGenAI } from "@google/genai";
import { useState } from 'react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function useAIPreacher() {
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: question,
        config: {
          systemInstruction: "Você é o Assistente Salomão Muanjita, um conselheiro cristão sábio e acolhedor. Sua missão é responder perguntas bíblicas, oferecer consolo espiritual e explicar doutrinas da fé cristã de forma clara e baseada na Bíblia (Almeida Revista e Corrigida). Seja breve, direto e use versículos para fundamentar suas respostas.",
        },
      });
      return response.text;
    } catch (error) {
      console.error("Erro no Agente Pregador:", error);
      return "Desculpe, tive um problema ao buscar sua resposta. Tente novamente em breve.";
    } finally {
      setLoading(false);
    }
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
