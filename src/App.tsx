/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book as BookIcon, 
  Search, 
  Heart, 
  Settings, 
  Home, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Bookmark,
  Sun,
  Moon,
  Type,
  MessageSquare,
  GraduationCap,
  Send,
  Loader2,
  Gamepad2,
  Trophy,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  ClipboardList,
  CheckSquare,
  Plus,
  Trash2,
  Edit3,
  WifiOff
} from 'lucide-react';
import { BIBLE_BOOKS, Book } from './data/bible-metadata';
import { BIBLE_STUDIES, Study } from './data/bible-studies';
import { BIBLE_QUIZ, Question } from './data/bible-quiz';
import { BIBLE_DILEMMAS, Dilemma } from './data/bible-dilemmas';
import { BIBLE_READING_PLANS, ReadingPlan } from './data/reading-plans';
import { useBible, Verse, Chapter } from './hooks/useBible';
import { useAIPreacher } from './hooks/useAIPreacher';

import { STATIC_STUDIES_CONTENT } from './data/static-studies-content';

type View = 'home' | 'bible' | 'search' | 'favorites' | 'settings' | 'reader' | 'preacher' | 'studies' | 'study-detail' | 'games' | 'quiz' | 'dilemmas' | 'notes' | 'reading-plan';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [chapterContent, setChapterContent] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const feelingsMap: Record<string, { title: string, content: string }> = {
    'decepcionado': {
      title: 'Superando a Decepção',
      content: 'A Bíblia diz em Salmos 34:18 que "Perto está o Senhor dos que têm o coração quebrantado". Quando pessoas ou situações nos falham, Deus permanece fiel. Romanos 8:28 nos lembra que todas as coisas cooperam para o bem dos que amam a Deus. Não desanime, sua esperança está no Senhor, não nos homens.'
    },
    'triste': {
      title: 'Consolo na Tristeza',
      content: 'Jesus disse: "Bem-aventurados os que choram, porque eles serão consolados" (Mateus 5:4). A tristeza é uma estação, não sua morada permanente. Salmos 30:5 promete que "o choro pode durar uma noite, mas a alegria vem pela manhã". Entregue seu fardo a Ele hoje.'
    },
    'deprimido': {
      title: 'Luz na Depressão',
      content: 'A Bíblia reconhece momentos de profunda angústia. Elias e Davi passaram por isso. Salmos 42:11 diz: "Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei". Ore por luz e busque ajuda, pois Deus opera através da oração e de Seus servos. Você tem valor infinito para o Criador.'
    },
    'ansioso': {
      title: 'Paz para a Ansiedade',
      content: 'Filipenses 4:6-7 nos exorta: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus... E a paz de Deus, que excede todo o entendimento, guardará os vossos corações". Respire e confie que Ele cuida do amanhã.'
    },
    'sozinho': {
      title: 'Você Nunca Está Só',
      content: 'Deus prometeu em Hebreus 13:5: "Não te deixarei, nem te desampararei". Mesmo quando não sentimos ninguém por perto, o Espírito Santo, o Consolador, está em nós. Você é parte da família de Deus.'
    }
  };

  const handleFeelingSelect = (feeling: string) => {
    const response = feelingsMap[feeling];
    if (response) {
      setStudyContent(`# ${response.title}\n\n${response.content}`);
      setCurrentView('study-detail');
    }
  };
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  
  // AI Preacher State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Studies State
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [studyContent, setStudyContent] = useState<string | null>(null);
  const [studiesFilter, setStudiesFilter] = useState<'convert' | 'mature'>('convert');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizLevel, setQuizLevel] = useState(1);
  const [medals, setMedals] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Dilemmas State
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [selectedDilemmaOption, setSelectedDilemmaOption] = useState<number | null>(null);
  const [showDilemmaExplanation, setShowDilemmaExplanation] = useState(false);
  const [dilemmasFinished, setDilemmasFinished] = useState(false);
  const [shuffledDilemmas, setShuffledDilemmas] = useState<Dilemma[]>([]);
  const [dilemmaLevel, setDilemmaLevel] = useState(1);
  const [dilemmaMedals, setDilemmaMedals] = useState(0);

  // Notebook State
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('bible_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Reading Plan State
  const [readingProgress, setReadingProgress] = useState<string[]>(() => {
    const saved = localStorage.getItem('bible_reading_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const { fetchChapter, fetchChapterWithAI, getDailyVerse, searchBible, loading: bibleLoading, error: bibleError } = useBible();
  const { askQuestion, generateStudy, loading: aiLoading } = useAIPreacher();

  useEffect(() => {
    getDailyVerse().then(setDailyVerse);
  }, []);

  useEffect(() => {
    localStorage.setItem('bible_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('bible_reading_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    if (book.chapters === 1) {
      handleChapterSelect(1, book);
    }
  };

  const handleChapterSelect = async (chapter: number, bookOverride?: Book) => {
    const book = bookOverride || selectedBook;
    if (!book) return;
    setSelectedChapter(chapter);
    
    // Initial fetch
    let content = await fetchChapter(book.name, chapter);
    
    // List of books that are often returned incomplete (only 1 verse) by some public APIs
    const oneChapterBooks = ['judas', 'filemon', 'obadias', '2 joão', '3 joão'];
    const isOneChapterBook = oneChapterBooks.includes(book.name.toLowerCase());

    // If it's a one-chapter book and we have suspiciously few verses, or it's empty
    if (isOneChapterBook && (!content || content.verses.length < 5)) {
      console.log(`${book.name} incompleto detectado. Chamando IA para completar...`);
      const aiContent = await fetchChapterWithAI(book.name, chapter);
      if (aiContent) content = aiContent;
    }
    
    setChapterContent(content);
    setCurrentView('reader');
  };

  const handleGetBack = () => {
    if (currentView === 'reader') {
      setCurrentView('bible');
      setSelectedChapter(null);
      // If it's a one-chapter book, go back to book selection automatically
      if (selectedBook && selectedBook.chapters === 1) {
        setSelectedBook(null);
      }
    } else if (currentView === 'study-detail') {
      setCurrentView('studies');
    } else if (currentView === 'notes' || currentView === 'reading-plan') {
      setCurrentView('home');
    } else if (selectedBook && !selectedChapter) {
      setSelectedBook(null);
    } else {
      setCurrentView('home');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || aiLoading) return;
    
    const userMsg: Message = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    const answer = await askQuestion(inputMessage);
    const assistantMsg: Message = { role: 'assistant', content: answer || 'Não consegui processar.' };
    setChatMessages(prev => [...prev, assistantMsg]);
  };

  const handleStudySelect = async (study: Study) => {
    setSelectedStudy(study);
    setCurrentView('study-detail');
    setStudyContent(null);
    
    // 1. Check for static content first (always offline)
    const staticItem = STATIC_STUDIES_CONTENT.find(s => s.id === study.id);
    if (staticItem) {
      setStudyContent(staticItem.content);
      return;
    }

    // 2. Check local cache for AI studies
    const cacheKey = `study_cache_${study.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setStudyContent(cached);
      return;
    }

    // 3. Fallback to AI (requires internet)
    if (!isOnline) {
      // Content remains null, showing the "requires internet" UI
      return;
    }

    const content = await generateStudy(study.title, study.target);
    if (content) {
      setStudyContent(content);
      localStorage.setItem(cacheKey, content);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    const currentQ = shuffledQuestions[currentQuestionIndex];
    setSelectedOption(index);
    if (index === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const handleShareVerse = async (verse: Verse) => {
    const text = `"${verse.text}"\n— ${verse.book_name} ${verse.chapter}:${verse.verse}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Versículo do Dia',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

  const feedbackMessage = useMemo(() => {
    if (!showExplanation || selectedOption === null) return '';
    const isCorrect = selectedOption === shuffledQuestions[currentQuestionIndex].correctAnswer;
    
    const correctMsgs = ["Boa!", "Viva! Você parece estar lendo bastante", "Estou orgulhoso", "Parabéns, continue assim!", "Glória a Deus, você acertou!"];
    const wrongMsgs = ["Precisas ler mais a Bíblia", "Medite mais na palavra", "Não desanime, continue estudando", "Essa era difícil, tente ler Gênesis a Apocalipse!", "Pesquise mais sobre este tema"];
    
    const list = isCorrect ? correctMsgs : wrongMsgs;
    return list[Math.floor(Math.random() * list.length)];
  }, [showExplanation, selectedOption, currentQuestionIndex, shuffledQuestions]);

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Logic for medals and levels
      const passScore = Math.ceil(shuffledQuestions.length * 0.7);
      if (score >= passScore) {
        setMedals(m => Math.min(m + 1, 3));
        if (quizLevel < 3) {
          setQuizLevel(l => l + 1);
        }
      }
      setQuizFinished(true);
    }
  };

  const resetQuiz = (keepLevel = false) => {
    if (!keepLevel) {
      setQuizLevel(1);
      setMedals(0);
    }
    
    // 10 questions per phase
    const shuffled = [...BIBLE_QUIZ].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setCurrentView('quiz');
  };

  const resetDilemmas = (keepLevel = false) => {
    if (!keepLevel) {
      setDilemmaLevel(1);
      setDilemmaMedals(0);
    }
    
    // 10 scenarios per phase (if available, otherwise all)
    const shuffled = [...BIBLE_DILEMMAS].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledDilemmas(shuffled);
    setCurrentDilemmaIndex(0);
    setSelectedDilemmaOption(null);
    setShowDilemmaExplanation(false);
    setDilemmasFinished(false);
    setCurrentView('dilemmas');
  };

  const handleDilemmaAnswer = (index: number) => {
    if (showDilemmaExplanation) return;
    setSelectedDilemmaOption(index);
    setShowDilemmaExplanation(true);
  };

  const nextDilemma = () => {
    if (currentDilemmaIndex < shuffledDilemmas.length - 1) {
      setCurrentDilemmaIndex(i => i + 1);
      setSelectedDilemmaOption(null);
      setShowDilemmaExplanation(false);
    } else {
      // Logic for medals and levels in Dilemmas
      const isWinner = shuffledDilemmas.every((d, idx) => {
        // If they got most right (e.g. 70%) or just check last answer?
        // Let's use a similar score logic for dilemmas if we want to track correctness
        return true; // Simplified or track dilemma score
      });
      
      // For dilemmas, let's just count how many they got right during the session
      let correctCount = 0;
      // We'd need a state for dilemma score if we want to be precise, 
      // but let's assume if they reach the end they passed Level 1.
      setDilemmaMedals(m => Math.min(m + 1, 3));
      if (dilemmaLevel < 3) setDilemmaLevel(l => l + 1);
      
      setDilemmasFinished(true);
    }
  };

  const handleShare = async (title: string, text: string) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${text}\n\nEnviado via Bíblia Sagrada (SMVM)`,
          url
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n\nEnviado via Bíblia Sagrada (SMVM)\n${url}`);
        // Quick visual feedback since alert is discouraged
        alert("Texto copiado para a área de transferência!");
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (!isOnline) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await searchBible(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const isChapterOffline = useMemo(() => {
    if (!selectedBook || !selectedChapter) return false;
    return !!localStorage.getItem(`bible_cache_${selectedBook.name}_${selectedChapter}`);
  }, [selectedBook, selectedChapter, currentView]);

  const titleText = useMemo(() => {
    if (currentView === 'reader') return `${selectedBook?.name} ${selectedChapter}`;
    if (currentView === 'bible' && selectedBook) return selectedBook.name;
    if (currentView === 'bible') return 'Bíblia Sagrada';
    if (currentView === 'search') return 'Pesquisar';
    if (currentView === 'favorites') return 'Favoritos';
    if (currentView === 'settings') return 'Mais';
    if (currentView === 'preacher') return 'Assistente Salomão Muanjita';
    if (currentView === 'studies') return 'Estudos Bíblicos';
    if (currentView === 'study-detail') return 'Estudo';
    if (currentView === 'games') return 'Jogos Bíblicos';
    if (currentView === 'quiz') return 'Quiz Bíblico';
    if (currentView === 'dilemmas') return 'Dilemas da Vida';
    if (currentView === 'notes') return 'Caderno de Anotações';
    if (currentView === 'reading-plan') return 'Plano de Leitura';
    return 'Bíblia Sagrada';
  }, [currentView, selectedBook, selectedChapter]);

  const handleToggleRead = (taskId: string) => {
    setReadingProgress(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const saveNote = (note: { title: string, content: string }) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...note } : n));
      setEditingNote(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: note.title,
        content: note.content,
        date: new Date().toLocaleDateString()
      };
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const NoteEditor = ({ note, onSave, onCancel }: { note: Note | null, onSave: (n: {title: string, content: string}) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white shadow-xl border border-gray-100'} space-y-4`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">{note ? 'Editar Anotação' : 'Nova Anotação'}</h3>
          <button onClick={onCancel} className="text-xs opacity-50 font-bold">Cancelar</button>
        </div>
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título (ex: Meditação Gênesis 1)"
          className={`w-full p-4 rounded-2xl outline-none border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'} font-bold`}
        />
        <textarea 
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="O que Deus falou ao seu coração hoje?"
          rows={8}
          className={`w-full p-4 rounded-2xl outline-none border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'} text-sm leading-relaxed`}
        />
        <button 
          onClick={() => onSave({ title, content })}
          disabled={!title.trim() || !content.trim()}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold disabled:opacity-50"
        >
          Salvar Anotação
        </button>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'} font-sans transition-colors duration-300`}>
      {/* Connectivity Indicator Bar */}
      <div className={`h-1.5 w-full sticky top-0 z-[60] transition-colors duration-500 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      {/* Header */}
      <header className={`p-4 sticky top-0 z-40 flex justify-between items-center ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-b`}>
        <div className="flex items-center gap-3">
          {(['reader', 'study-detail', 'quiz', 'dilemmas', 'notes', 'reading-plan'].includes(currentView) || (currentView === 'bible' && selectedBook)) && (
            <button 
              onClick={() => {
                if (currentView === 'quiz' || currentView === 'dilemmas') setCurrentView('games');
                else handleGetBack();
              }}
              className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">{titleText}</h1>
            {currentView === 'home' && (
              <p className="text-[10px] opacity-40 font-medium uppercase mt-1">Compilado por SMVM, Salomão Muanjita</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {currentView === 'reader' && (
            <button onClick={() => setFontSize(f => Math.min(f + 2, 32))} className="p-2 hover:bg-zinc-800 rounded-full">
              <Type size={20} />
            </button>
          )}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-zinc-800 rounded-full">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-28 max-w-2xl mx-auto px-4 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-6 space-y-8"
            >
              {/* Moody Section - How are you feeling? */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 mb-8"
            >
              <h3 className="text-sm font-black uppercase opacity-40 mb-4 tracking-widest">Como você se sente hoje?</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {['decepcionado', 'triste', 'deprimido', 'ansioso', 'sozinho', 'grato'].map((feeling) => (
                  <button
                    key={feeling}
                    onClick={() => handleFeelingSelect(feeling)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'
                    } active:scale-95 capitalize`}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Daily Verse Card */}
              <div className={`p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'} shadow-xl`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Versículo do Dia</span>
                </div>
                {dailyVerse ? (
                  <>
                    <p className="text-xl md:text-2xl font-serif italic mb-4 leading-relaxed">
                      "{dailyVerse.text.trim()}"
                    </p>
                    <div className="flex justify-between items-end mb-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => dailyVerse && handleShare('Versículo do Dia', `"${dailyVerse.text}"\n— ${dailyVerse.book_name} ${dailyVerse.chapter}:${dailyVerse.verse}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all"
                        >
                          <Share2 size={14} /> Compartilhar
                        </button>
                        <button 
                          onClick={async () => {
                            if (!dailyVerse) return;
                            setCurrentView('preacher');
                            const q = `Pode me explicar a profundidade e o contexto de ${dailyVerse.book_name} ${dailyVerse.chapter}:${dailyVerse.verse}? "${dailyVerse.text}"`;
                            setInputMessage(q);
                            // We don't call handleSendMessage directly because it's better if user sees the message being sent
                          }}
                          className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full text-xs font-bold transition-all`}
                        >
                          <MessageSquare size={14} /> Sabedoria de Salomão
                        </button>
                      </div>
                      <p className="text-right font-medium opacity-70">
                        — {dailyVerse.book_name} {dailyVerse.chapter}:{dailyVerse.verse}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="h-24 flex items-center justify-center italic opacity-50">Carregando alimento espiritual...</div>
                )}
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentView('studies')}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-gray-100'} group gap-3`}
                >
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <GraduationCap size={32} />
                  </div>
                  <span className="font-bold text-sm">Estudos</span>
                </button>
                <button 
                  onClick={() => setCurrentView('games')}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-gray-100'} group gap-3`}
                >
                  <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <Gamepad2 size={32} />
                  </div>
                  <span className="font-bold text-sm">Jogos</span>
                </button>
                <button 
                  onClick={() => setCurrentView('reading-plan')}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-gray-100'} group gap-3`}
                >
                  <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
                    <CheckSquare size={32} />
                  </div>
                  <span className="font-bold text-sm">Plano</span>
                </button>
                <button 
                  onClick={() => setCurrentView('notes')}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-gray-100'} group gap-3`}
                >
                  <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
                    <ClipboardList size={32} />
                  </div>
                  <span className="font-bold text-sm">Caderno</span>
                </button>
              </div>

              <button 
                onClick={() => setCurrentView('preacher')}
                className={`w-full flex items-center gap-4 p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'} group`}
              >
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <MessageSquare size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Assistente Salomão Muanjita</p>
                  <p className="text-xs opacity-50">Orientação espiritual alimentada por IA</p>
                </div>
              </button>

              <a 
                href="https://wa.me/244943004073" 
                target="_blank"
                rel="noreferrer"
                className={`w-full flex items-center gap-4 p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'} group`}
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Send size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Falar Directamente no WhatsApp</p>
                  <p className="text-xs opacity-50">Contacto: 943004073</p>
                </div>
              </a>

              {/* Recently Read (Simulated) */}
              <section>
                <h2 className="text-sm font-bold mb-4 px-1 opacity-50 uppercase tracking-widest">Continuar Lendo</h2>
                <button 
                  onClick={() => setCurrentView('bible')}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl ${darkMode ? 'bg-zinc-900' : 'bg-white shadow-sm'} group`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 text-zinc-400 rounded-xl">
                      <BookIcon size={24} />
                    </div>
                    <div className="text-left text-sm">
                      <p className="font-bold">Gênesis 1</p>
                      <p className="opacity-50 line-clamp-1">No princípio, criou Deus os céus e a terra...</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                </button>
              </section>
            </motion.div>
          )}

          {currentView === 'bible' && (
            <motion.div 
              key="bible"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="mb-6">
                <button 
                  onClick={() => setCurrentView('search')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white shadow-sm border border-gray-100'} text-sm font-medium opacity-60 hover:opacity-100 transition-all`}
                >
                  <Search size={18} />
                  <span>Pesquisar versículos ou palavras...</span>
                </button>
              </div>

              {!selectedBook ? (
                <div className="space-y-1">
                  <div className="grid grid-cols-1 gap-1">
                    {BIBLE_BOOKS.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleBookSelect(book)}
                        className={`flex items-center justify-between p-4 rounded-xl group transition-colors ${darkMode ? 'hover:bg-zinc-900/50' : 'hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 text-[10px] font-bold opacity-20 text-center ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                            {BIBLE_BOOKS.indexOf(book) + 1}
                          </span>
                          <span className="font-bold">{book.name}</span>
                        </div>
                        <ChevronRight size={16} className="opacity-20 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : !selectedChapter ? (
                <div className="py-2 space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <button 
                      onClick={() => setSelectedBook(null)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:opacity-70 transition-opacity"
                    >
                      <ChevronLeft size={16} /> Voltar para lista de livros
                    </button>
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{selectedBook.chapters} Capítulos</span>
                  </div>
                   <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => handleChapterSelect(chapter)}
                        className={`aspect-square flex items-center justify-center rounded-xl font-bold transition-all ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800' : 'bg-white shadow-sm hover:bg-zinc-50 text-gray-900 border border-gray-200'}`}
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {currentView === 'search' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <div className={`p-2 rounded-3xl mb-6 ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-lg border border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Busque por palavras ou temas..."
                    className="flex-1 bg-transparent p-3 outline-none text-sm font-bold"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {searchResults.map((v, i) => (
                  <motion.div 
                    key={`${v.book_name}-${v.chapter}-${v.verse}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      const book = BIBLE_BOOKS.find(b => b.name === v.book_name);
                      if (book) {
                        setSelectedBook(book);
                        handleChapterSelect(v.chapter, book);
                      }
                    }}
                    className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'} cursor-pointer hover:border-blue-500/30 transition-all`}
                  >
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{v.book_name} {v.chapter}:{v.verse}</span>
                       <ChevronRight size={14} className="opacity-30" />
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed font-serif">"{v.text}"</p>
                  </motion.div>
                ))}
                {searchResults.length === 0 && !isSearching && searchQuery.length > 0 && (
                  <div className="text-center py-20 px-8">
                    {!isOnline ? (
                      <>
                        <WifiOff size={40} className="mx-auto mb-4 opacity-20 text-rose-500" />
                        <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Busca Indisponível</p>
                        <p className="text-xs opacity-30">A pesquisa bíblica requer conexão com a internet para encontrar versículos específicos.</p>
                      </>
                    ) : (
                      <div className="opacity-30 text-sm">Nenhum resultado encontrado.</div>
                    )}
                  </div>
                )}
                {searchResults.length === 0 && !isSearching && searchQuery.length === 0 && (
                  <div className="text-center py-20 opacity-20">
                    <Search size={40} className="mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Digite para pesquisar</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'reader' && (
            <motion.div 
              key="reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8"
            >
              {bibleLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-4 rounded animate-pulse ${darkMode ? 'bg-zinc-900' : 'bg-gray-200'}`} style={{ width: `${Math.random() * 40 + 60}%` }} />
                  ))}
                </div>
              ) : chapterContent ? (
                <div className="space-y-6 reader-text" style={{ fontSize: `${fontSize}px` }}>
                  <div className="flex justify-between items-center opacity-30 italic mb-8">
                    <h2 className="text-3xl font-serif">Capítulo {selectedChapter}</h2>
                    {isChapterOffline && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle2 size={12} /> Disponível Offline
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    {chapterContent.verses.map((v) => (
                      <div key={v.verse} className="flex flex-col gap-1 group border-b border-transparent hover:border-blue-500/10 pb-4 transition-all">
                        <div className="flex gap-3">
                          <span className="text-[0.6em] font-bold opacity-30 mt-1 select-none w-6 shrink-0">{v.verse}</span>
                          <span className="hover:text-blue-400 transition-colors flex-1">{v.text}</span>
                          <button 
                            onClick={() => handleShare(`${selectedBook?.name} ${selectedChapter}:${v.verse}`, v.text)}
                            className="opacity-0 group-hover:opacity-30 hover:opacity-100 transition-opacity"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {chapterContent && chapterContent.verses.length < 5 && (
                    <div className="mt-12 text-center p-8 border-2 border-dashed border-zinc-500/10 rounded-3xl">
                      <p className="text-sm opacity-50 mb-4">Este capítulo parece estar incompleto ou falhou ao carregar.</p>
                      <button 
                        onClick={async () => {
                          if (!selectedBook || !selectedChapter) return;
                          const aiContent = await fetchChapterWithAI(selectedBook.name, selectedChapter);
                          if (aiContent) {
                            setChapterContent(aiContent);
                            const cacheKey = `bible_cache_${selectedBook.name}_${selectedChapter}`;
                            localStorage.setItem(cacheKey, JSON.stringify(aiContent));
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        Completar com Sabedoria Artificial
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  {bibleError || 'Não foi possível carregar este capítulo.'}
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'preacher' && (
            <motion.div 
              key="preacher"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 flex flex-col h-[75vh]"
            >
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12 px-6">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Paz do Senhor!</h3>
                    <p className="text-sm opacity-50">Eu sou Salomão Muanjita, seu assistente espiritual. Como posso ajudar seu crescimento hoje?</p>
                    <div className="mt-8 flex flex-wrap gap-2 justify-center">
                      {['O que é santidade?', 'Como orar melhor?', 'Quem foi Paulo?'].map(q => (
                        <button 
                          key={q} 
                          onClick={() => { setInputMessage(q); }}
                          className={`text-xs px-4 py-2 rounded-full border ${darkMode ? 'border-zinc-800 hover:bg-zinc-900' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                        : (darkMode ? 'bg-zinc-900' : 'bg-gray-100')
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                      <Loader2 className="animate-spin opacity-50" size={20} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className={`flex items-center gap-2 p-2 rounded-2xl ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Faça uma pergunta bíblica..."
                  className="bg-transparent border-none outline-none flex-1 px-3 text-sm font-medium"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || aiLoading}
                  className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'studies' && (
            <motion.div key="studies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'convert', label: 'Recém Convertidos' },
                  { id: 'mature', label: 'Antigos na Fé' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setStudiesFilter(tab.id as 'convert' | 'mature')}
                    className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      studiesFilter === tab.id 
                        ? (darkMode ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-blue-50 text-blue-600 border-blue-200')
                        : (darkMode ? 'bg-zinc-900 border-transparent text-zinc-500' : 'bg-gray-100 border-transparent text-gray-500')
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {BIBLE_STUDIES.filter(s => s.target === studiesFilter).map(study => {
                  const isStatic = STATIC_STUDIES_CONTENT.some(s => s.id === study.id);
                  const isCached = !!localStorage.getItem(`study_cache_${study.id}`);
                  const isOfflineReady = isStatic || isCached;
                  return (
                    <button
                      key={study.id}
                      onClick={() => handleStudySelect(study)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors text-left group ${darkMode ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-white border border-gray-100 hover:bg-blue-50/30 shadow-sm'}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase opacity-40 tracking-widest">{study.category}</span>
                          {isOfflineReady && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Pronto Offline</span>
                          )}
                        </div>
                        <p className="font-bold">{study.title}</p>
                        {study.shortDescription && <p className="text-xs opacity-50 mt-1 line-clamp-1">{study.shortDescription}</p>}
                      </div>
                      <ChevronRight size={18} className="opacity-20 group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentView === 'study-detail' && (
            <motion.div key="study-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">{selectedStudy?.title}</h2>
                {studyContent && (
                  <button 
                    onClick={() => handleShare(selectedStudy?.title || 'Estudo Bíblico', studyContent)}
                    className="p-3 bg-zinc-800 rounded-full"
                  >
                    <Share2 size={20} />
                  </button>
                )}
              </div>
              <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-8">
                {selectedStudy?.target === 'convert' ? 'Recém Convertido' : 'Antigo na Fé'} • {selectedStudy?.category}
              </p>
              
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-sm italic font-medium animate-pulse text-center px-6">Buscando na sabedoria bíblica...<br/>(Isso requer internet)</p>
                </div>
              ) : studyContent ? (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                  {studyContent.startsWith('#') ? (
                    // Simple markdown-like rendering for static content
                    <div className="space-y-4">
                      {studyContent.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-blue-500">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6">{line.replace('## ', '')}</h2>;
                        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4">{line.replace('### ', '')}</h3>;
                        return <p key={i} className="leading-relaxed whitespace-pre-wrap">{line}</p>;
                      })}
                    </div>
                  ) : (
                    studyContent.split('\n').map((line, i) => (
                      <p key={i} className="leading-relaxed whitespace-pre-wrap">{line}</p>
                    ))
                  )}
                </div>
              ) : !aiLoading && !studyContent && (
                <div className="text-center py-20 px-8">
                  <WifiOff size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium opacity-50">Este estudo requer conexão com a internet para ser gerado pela primeira vez.</p>
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'games' && (
            <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-4">
              <button 
                onClick={() => resetQuiz()}
                className={`w-full flex items-center justify-between p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white border border-gray-100 shadow-sm'} group`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <Trophy size={32} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Quiz Bíblico</p>
                    <p className="text-xs opacity-50 italic">Teste seus conhecimentos</p>
                  </div>
                </div>
                <ChevronRight size={20} className="opacity-30" />
              </button>

              <button 
                onClick={() => resetDilemmas()}
                className={`w-full flex items-center justify-between p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white border border-gray-100 shadow-sm'} group`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <Send size={32} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Dilemas da Vida</p>
                    <p className="text-xs opacity-50 italic">Situações do quotidiano</p>
                  </div>
                </div>
                <ChevronRight size={20} className="opacity-30" />
              </button>

              <div className={`p-8 rounded-3xl text-center border-2 border-dashed ${darkMode ? 'border-zinc-800' : 'border-gray-200'} opacity-30`}>
                <p className="text-sm font-bold uppercase tracking-widest">Mais jogos em breve</p>
              </div>
            </motion.div>
          )}

          {currentView === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 h-[70vh] flex flex-col">
              {!quizFinished ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tighter opacity-30">Questão {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                        Fase {quizLevel} {Array.from({ length: medals }).map((_, i) => <Trophy key={i} size={10} />)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>Pontuação: {score}</span>
                  </div>

                  {shuffledQuestions[currentQuestionIndex] && (
                    <>
                      <h2 className="text-xl font-bold mb-8 leading-tight">{shuffledQuestions[currentQuestionIndex].question}</h2>

                      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {shuffledQuestions[currentQuestionIndex].options.map((option, idx) => {
                          const isCorrect = idx === shuffledQuestions[currentQuestionIndex].correctAnswer;
                          const isSelected = idx === selectedOption;
                          
                          let btnClass = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm';
                          if (showExplanation) {
                            if (isCorrect) btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
                            else if (isSelected) btnClass = 'bg-rose-500/20 border-rose-500 text-rose-500';
                            else btnClass = 'opacity-20';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(idx)}
                              disabled={showExplanation}
                              className={`w-full p-5 rounded-2xl text-left font-medium border-2 transition-all flex justify-between items-center ${btnClass}`}
                            >
                              <span>{option}</span>
                              {showExplanation && isCorrect && <CheckCircle2 size={18} />}
                              {showExplanation && isSelected && !isCorrect && <XCircle size={18} />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`mt-6 p-4 rounded-2xl text-sm ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-lg border border-gray-100'}`}
                      >
                        <div className={`mb-3 py-1 px-3 rounded-lg font-bold text-center ${selectedOption === shuffledQuestions[currentQuestionIndex].correctAnswer ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {feedbackMessage}
                        </div>
                        <p className="opacity-70 leading-relaxed mb-4">{shuffledQuestions[currentQuestionIndex].explanation}</p>
                        <button 
                          onClick={nextQuestion}
                          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                          {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {score >= Math.ceil(shuffledQuestions.length * 0.7) ? 'Excelente!' : 'Tente Novamente'}
                  </h2>
                  <p className="text-lg opacity-50 mb-4">Você acertou {score} de {shuffledQuestions.length} perguntas.</p>
                  
                  {medals > 0 && (
                    <div className="flex gap-2 mb-8 justify-center">
                      {Array.from({ length: medals }).map((_, i) => (
                        <div key={i} className="p-2 bg-amber-500 text-white rounded-full">
                          <Trophy size={20} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <button 
                      onClick={() => resetQuiz(score >= Math.ceil(shuffledQuestions.length * 0.7))}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} /> {score >= Math.ceil(shuffledQuestions.length * 0.7) && quizLevel < 3 ? 'Próxima Fase' : 'Repetir'}
                    </button>
                    <button 
                      onClick={() => setCurrentView('games')}
                      className={`flex-1 py-4 rounded-2xl font-bold ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'dilemmas' && (
            <motion.div key="dilemmas" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 h-[75vh] flex flex-col">
              {!dilemmasFinished ? (
                <>
                  <div className="mb-8 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tighter opacity-30">Situação {currentDilemmaIndex + 1} de {shuffledDilemmas.length}</span>
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        Fase {dilemmaLevel} {Array.from({ length: dilemmaMedals }).map((_, i) => <Trophy key={i} size={10} />)}
                      </span>
                    </div>
                  </div>

                  {shuffledDilemmas[currentDilemmaIndex] && (
                    <>
                      <div className={`p-6 rounded-3xl mb-8 ${darkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
                        <p className="text-lg font-medium leading-relaxed italic">
                          "{shuffledDilemmas[currentDilemmaIndex].scenario}"
                        </p>
                      </div>

                      <div className="space-y-3 flex-1">
                        <p className="text-xs font-bold opacity-30 uppercase tracking-widest mb-2">O que acontece? / O que fazer?</p>
                        {shuffledDilemmas[currentDilemmaIndex].options.map((option, idx) => {
                          const isCorrect = option.isCorrect;
                          const isSelected = idx === selectedDilemmaOption;
                          
                          let btnClass = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm';
                          if (showDilemmaExplanation) {
                            if (isCorrect) btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
                            else if (isSelected) btnClass = 'bg-rose-500/20 border-rose-500 text-rose-500';
                            else btnClass = 'opacity-20';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleDilemmaAnswer(idx)}
                              disabled={showDilemmaExplanation}
                              className={`w-full p-5 rounded-2xl text-left font-medium border-2 transition-all flex justify-between items-center ${btnClass}`}
                            >
                              <span className="text-sm">{option.text}</span>
                              {showDilemmaExplanation && isCorrect && <CheckCircle2 size={18} />}
                              {showDilemmaExplanation && isSelected && !isCorrect && <XCircle size={18} />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <AnimatePresence>
                    {showDilemmaExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`mt-6 p-4 rounded-2xl text-sm ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-lg border border-gray-100'}`}
                      >
                         <div className={`mb-3 py-1 px-3 rounded-lg font-bold text-center ${shuffledDilemmas[currentDilemmaIndex].options[selectedDilemmaOption!].isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {shuffledDilemmas[currentDilemmaIndex].options[selectedDilemmaOption!].isCorrect ? 'Correcto!' : 'Pense Bem!'}
                        </div>
                        <p className="opacity-70 leading-relaxed mb-4 text-xs font-medium">
                          {shuffledDilemmas[currentDilemmaIndex].options[selectedDilemmaOption!].explanation}
                        </p>
                        <button 
                          onClick={nextDilemma}
                          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                          {currentDilemmaIndex < shuffledDilemmas.length - 1 ? 'Próxima Situação' : 'Concluir'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Fase {dilemmaLevel - 1} Concluída</h2>
                  <p className="text-lg opacity-50 mb-8 max-w-xs">Que as tuas decisões sejam sempre guiadas pela Palavra de Deus.</p>
                  
                  {dilemmaMedals > 0 && (
                    <div className="flex gap-2 mb-8 justify-center">
                      {Array.from({ length: dilemmaMedals }).map((_, i) => (
                        <div key={i} className="p-2 bg-emerald-500 text-white rounded-full">
                          <Trophy size={20} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <button 
                      onClick={() => resetDilemmas(true)}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} /> {dilemmaLevel <= 3 ? 'Próxima Fase' : 'Recomeçar'}
                    </button>
                    <button 
                      onClick={() => setCurrentView('games')}
                      className={`flex-1 py-4 rounded-2xl font-bold ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-6">
              <div className="flex justify-between items-center px-2">
                <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em]">{notes.length} ANOTAÇÕES</p>
                <button 
                  onClick={() => { setEditingNote(null); setCurrentView('notes'); /* Toggle editor? */ }}
                  className="flex items-center gap-2 text-blue-500 font-bold text-sm"
                >
                  <Plus size={18} /> Nova
                </button>
              </div>

              {editingNote !== null || (notes.length === 0 && !editingNote) ? (
                <NoteEditor 
                  note={editingNote} 
                  onSave={(n) => { saveNote(n); setEditingNote(null); }} 
                  onCancel={() => setEditingNote(null)} 
                />
              ) : null}

              <div className="space-y-4">
                {notes.map(note => (
                  <div 
                    key={note.id} 
                    className={`p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white border border-gray-100 shadow-sm'} relative group`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{note.title}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingNote(note)} className="p-2 hover:bg-zinc-800 rounded-lg text-blue-400">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-70 leading-relaxed whitespace-pre-wrap line-clamp-3 mb-4">{note.content}</p>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{note.date}</p>
                  </div>
                ))}
                
                {notes.length === 0 && !editingNote && (
                  <div className="text-center py-20 opacity-30">
                    <ClipboardList size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-medium italic">Seu caderno está vazio. Comece a anotar o que Deus fala com você hoje.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'reading-plan' && (
            <motion.div key="reading-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-8">
              {BIBLE_READING_PLANS.map(plan => {
                const completedCount = plan.tasks.filter(t => readingProgress.includes(t.id)).length;
                const progress = (completedCount / plan.tasks.length) * 100;

                return (
                  <div key={plan.id} className="space-y-4">
                    <div className="px-2">
                      <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                      <p className="text-sm opacity-50 mb-4">{plan.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                      <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Progresso: {completedCount}/{plan.tasks.length} capítulos</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {plan.tasks.map(task => {
                        const isRead = readingProgress.includes(task.id);
                        return (
                          <button
                            key={task.id}
                            onClick={() => handleToggleRead(task.id)}
                            className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                              isRead 
                                ? (darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100')
                                : (darkMode ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-gray-100 shadow-sm')
                            } border-2 group`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${isRead ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'} transition-colors`}>
                                <CheckSquare size={20} />
                              </div>
                              <div className="text-left">
                                <p className={`font-bold transition-all ${isRead ? 'opacity-30 line-through' : ''}`}>{task.label}</p>
                                <span className="text-[10px] opacity-40 font-bold uppercase">Leitura Recomendada</span>
                              </div>
                            </div>
                            {!isRead && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const book = BIBLE_BOOKS.find(b => b.name === task.book);
                                  if (book) {
                                    handleBookSelect(book);
                                    handleChapterSelect(task.chapter);
                                  }
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg opacity-80 hover:opacity-100"
                              >
                                LER AGORA
                              </button>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-1">
              <h3 className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 px-4">Configurações & Sobre</h3>
              {[
                { icon: <Bookmark size={20} />, label: 'Meus Marcadores', action: () => setCurrentView('favorites') },
                { icon: <CheckSquare size={20} />, label: 'Plano de Leitura', action: () => setCurrentView('reading-plan') },
                { icon: <ClipboardList size={20} />, label: 'Minhas Anotações', action: () => setCurrentView('notes') },
                { icon: <GraduationCap size={20} />, label: 'Meus Estudos', action: () => setCurrentView('studies') },
                { icon: <Type size={20} />, label: 'Fonte', value: `${fontSize}px`, action: () => setFontSize(f => f >= 24 ? 14 : f + 2) },
                { icon: <MessageSquare size={20} />, label: 'Falar com Salomão Muanjita', action: () => window.open('https://wa.me/244943004073', '_blank') },
                { icon: <Share2 size={20} />, label: 'Compartilhar App', action: () => handleShare('Bíblia Sagrada', 'Estou usando a Bíblia Sagrada (SMVM) para minha leitura diária. Baixe e comece a ler também!') },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl ${darkMode ? 'hover:bg-zinc-900 border-zinc-900' : 'hover:bg-gray-100 border-gray-100'} border transition-colors mb-2`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-zinc-500/10 opacity-60">{item.icon}</div>
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs opacity-50 font-bold">{item.value || <ChevronRight size={16} />}</span>
                </button>
              ))}
              
              <div className={`mt-12 p-6 rounded-3xl text-center ${darkMode ? 'bg-zinc-900/50' : 'bg-gray-100'}`}>
                <h4 className="font-bold text-sm mb-1">Bíblia Sagrada</h4>
                <p className="text-[10px] opacity-40 uppercase font-black">Versão 1.0.0</p>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Organizado por</p>
                  <p className="font-serif italic text-lg mt-1">Salomão Muanjita (SMVM)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-4 left-4 right-4 z-50 ${darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-gray-200'} backdrop-blur-xl border-2 rounded-[2rem] shadow-2xl overflow-hidden`}>
        <div className="flex justify-around items-center h-16">
          {[
            { view: 'home', icon: <Home size={22} />, label: 'Início' },
            { view: 'bible', icon: <BookIcon size={22} />, label: 'Bíblia' },
            { view: 'games', icon: <Gamepad2 size={22} />, label: 'Jogos' },
            { view: 'preacher', icon: <MessageSquare size={22} />, label: 'Assistente' },
            { view: 'settings', icon: <Settings size={22} />, label: 'Mais' },
          ].map((item) => (
            <button 
              key={item.view}
              onClick={() => setCurrentView(item.view as View)}
              className={`relative flex flex-col items-center justify-center h-full w-full transition-all ${currentView === item.view ? (darkMode ? 'text-blue-400' : 'text-blue-600') : 'opacity-30'}`}
            >
              {item.icon}
              <span className="text-[9px] font-bold uppercase mt-1 tracking-tighter">{item.label}</span>
              {currentView === item.view && (
                <motion.div 
                  layoutId="active-indicator"
                  className={`absolute -bottom-2 h-4 w-8 blur-md opacity-20 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
