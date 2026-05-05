
import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  verses: Verse[];
  book_name: string;
  chapter: number;
}

// Translations available in bible-api.com or similar
// For Portuguese, we can use "almeida" (João Ferreira de Almeida)
const TRANSLATION = 'almeida'; 

export function useBible() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapterWithAI = async (book: string, chapter: number): Promise<Chapter | null> => {
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    setLoading(true);
    try {
      const prompt = `Forneça o texto completo do capítulo ${chapter} do livro de ${book} da Bíblia Sagrada na tradução João Ferreira de Almeida (Almeida). 
      Retorne APENAS um objeto JSON válido seguindo este formato:
      {
        "book_name": "${book}",
        "chapter": ${chapter},
        "verses": [
          { "verse": 1, "text": "texto do versículo 1" },
          ...
        ]
      }
      Certifique-se de incluir TODOS os versículos do capítulo.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanedText);
      
      // Adapt to our Verse interface
      const formattedVerses: Verse[] = data.verses.map((v: any) => ({
        book_id: book.toUpperCase(),
        book_name: book,
        chapter: chapter,
        verse: v.verse,
        text: v.text
      }));

      return {
        book_name: book,
        chapter: chapter,
        verses: formattedVerses
      };
    } catch (err) {
      console.error("Erro na IA:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchChapter = async (book: string, chapter: number): Promise<Chapter | null> => {
    const cacheKey = `bible_cache_${book}_${chapter}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const parsed = JSON.parse(cached);
      // If it has at least some verses, consider it valid (unless it's a known one-chapter book and has only 1-2 verses)
      const oneChapterBooks = ['judas', 'filemon', 'obadias', '2 joão', '3 joão'];
      const isOneChapterBook = oneChapterBooks.includes(book.toLowerCase());
      
      if (isOneChapterBook && parsed.verses.length < 5) {
        // Continue to fetch fresh/AI
      } else {
        return parsed;
      }
    }

    setLoading(true);
    setError(null);
    try {
      // First try English name for the API if it's one of the tricky ones
      const bookNamesMap: Record<string, string> = {
        'judas': 'Jude',
        'filemon': 'Philemon',
        'obadias': 'Obadiah',
        '2 joão': '2 John',
        '3 joão': '3 John'
      };
      
      const apiBookName = bookNamesMap[book.toLowerCase()] || book;
      const response = await fetch(`https://bible-api.com/${apiBookName}+${chapter}?translation=${TRANSLATION}`);
      
      if (!response.ok) throw new Error('Falha ao carregar capítulo');
      const data = await response.json();
      
      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDailyVerse = async (): Promise<Verse | null> => {
    const cacheKey = 'bible_daily_verse';
    const cached = localStorage.getItem(cacheKey);
    const lastUpdate = localStorage.getItem('bible_daily_verse_date');
    const today = new Date().toDateString();

    if (cached && lastUpdate === today) {
      return JSON.parse(cached);
    }
    
    // List of inspiring verses for random selection
    const inspiredVerses = [
      { b: 'João', c: 3, v: 16 },
      { b: 'Salmos', c: 23, v: 1 },
      { b: 'Filipenses', c: 4, v: 13 },
      { b: 'Romanos', c: 8, v: 28 },
      { b: 'Isaías', c: 41, v: 10 },
      { b: 'Mateus', c: 11, v: 28 },
      { b: 'Josué', c: 1, v: 9 },
      { b: 'Proverbios', c: 3, v: 5 }
    ];

    const pick = inspiredVerses[Math.floor(Math.random() * inspiredVerses.length)];

    try {
      const response = await fetch(`https://bible-api.com/${pick.b}+${pick.c}:${pick.v}?translation=${TRANSLATION}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const result = data.verses[0];
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem('bible_daily_verse_date', today);
      return result;
    } catch (err) {
      if (cached) return JSON.parse(cached);
      return {
        book_id: 'JOHN',
        book_name: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'
      };
    }
  };

  const searchBible = async (query: string): Promise<Verse[]> => {
    if (!query || query.length < 3) return [];
    
    setLoading(true);
    try {
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Encontre versículos bíblicos que falem sobre: "${query}". 
      Retorne APENAS um array JSON de objetos com o seguinte formato:
      [
        { "book_name": "Nome do Livro", "chapter": 1, "verse": 1, "text": "texto do versículo" },
        ...
      ]
      Limite a 10 resultados mais relevantes. Use a tradução João Ferreira de Almeida.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanedText);

      return data.map((v: any) => ({
        book_id: v.book_name.toUpperCase(),
        book_name: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text
      }));
    } catch (err) {
      console.error("Erro na busca por IA:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchChapter, fetchChapterWithAI, getDailyVerse, searchBible, loading, error };
}
