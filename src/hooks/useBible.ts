
import { useState, useEffect } from 'react';

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

  const fetchChapter = async (book: string, chapter: number): Promise<Chapter | null> => {
    setLoading(true);
    setError(null);
    try {
      // Mocking some local data for "Lite" offline feel if needed, 
      // but for this demo we fetch from a reliable API
      const response = await fetch(`https://bible-api.com/${book}+${chapter}?translation=${TRANSLATION}`);
      if (!response.ok) throw new Error('Falha ao carregar capítulo');
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDailyVerse = async (): Promise<Verse | null> => {
    try {
      // For the daily verse, we can pick a random popular one or use an API
      // Here we pick a random chapter from a random book for demonstration
      // In a real app, this would be curated.
      const book = 'João';
      const chapter = 3;
      const verse = 16;
      const response = await fetch(`https://bible-api.com/${book}+${chapter}:${verse}?translation=${TRANSLATION}`);
      const data = await response.json();
      return data.verses[0];
    } catch (err) {
      return null;
    }
  };

  return { fetchChapter, getDailyVerse, loading, error };
}
