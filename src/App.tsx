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
  XCircle
} from 'lucide-react';
import { BIBLE_BOOKS, Book } from './data/bible-metadata';
import { BIBLE_STUDIES, Study } from './data/bible-studies';
import { BIBLE_QUIZ, Question } from './data/bible-quiz';
import { useBible, Verse, Chapter } from './hooks/useBible';
import { useAIPreacher } from './hooks/useAIPreacher';

type View = 'home' | 'bible' | 'search' | 'favorites' | 'settings' | 'reader' | 'preacher' | 'studies' | 'study-detail' | 'games' | 'quiz';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterContent, setChapterContent] = useState<Chapter | null>(null);
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

  const { fetchChapter, getDailyVerse, loading: bibleLoading, error: bibleError } = useBible();
  const { askQuestion, generateStudy, loading: aiLoading } = useAIPreacher();

  useEffect(() => {
    getDailyVerse().then(setDailyVerse);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
  };

  const handleChapterSelect = async (chapter: number) => {
    if (!selectedBook) return;
    setSelectedChapter(chapter);
    const content = await fetchChapter(selectedBook.name, chapter);
    setChapterContent(content);
    setCurrentView('reader');
  };

  const handleGetBack = () => {
    if (currentView === 'reader') {
      setCurrentView('bible');
    } else if (currentView === 'study-detail') {
      setCurrentView('studies');
    } else if (selectedBook && !selectedChapter) {
        setSelectedBook(null);
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
    const content = await generateStudy(study.title, study.target);
    setStudyContent(content || null);
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    if (index === BIBLE_QUIZ[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < BIBLE_QUIZ.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setCurrentView('quiz');
  };

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
    return 'Bíblia Sagrada Lite';
  }, [currentView, selectedBook, selectedChapter]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'} font-sans transition-colors duration-300`}>
      {/* Header */}
      <header className={`p-4 sticky top-0 z-40 flex justify-between items-center ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-b`}>
        <div className="flex items-center gap-3">
          {(['reader', 'study-detail', 'quiz'].includes(currentView) || (currentView === 'bible' && selectedBook)) && (
            <button 
              onClick={() => {
                if (currentView === 'quiz') setCurrentView('games');
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
              {/* Daily Verse Card */}
              <div className={`p-6 rounded-3xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'} shadow-xl`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Versículo do Dia</span>
                  <Share2 size={18} className="opacity-50 cursor-pointer" />
                </div>
                {dailyVerse ? (
                  <>
                    <p className="text-xl md:text-2xl font-serif italic mb-4 leading-relaxed">
                      "{dailyVerse.text.trim()}"
                    </p>
                    <p className="text-right font-medium opacity-70">
                      — {dailyVerse.book_name} {dailyVerse.chapter}:{dailyVerse.verse}
                    </p>
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
                <div className="py-2">
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
                  <h2 className="text-3xl font-serif text-center mb-10 opacity-30 italic">Capítulo {selectedChapter}</h2>
                  {chapterContent.verses.map((v) => (
                    <p key={v.verse} className="leading-relaxed flex gap-3 group">
                      <span className="text-[0.6em] font-bold opacity-30 mt-1 select-none w-6 shrink-0">{v.verse}</span>
                      <span className="hover:text-blue-400 transition-colors">{v.text}</span>
                    </p>
                  ))}
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
                {BIBLE_STUDIES.filter(s => s.target === studiesFilter).map(study => (
                  <button
                    key={study.id}
                    onClick={() => handleStudySelect(study)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors text-left group ${darkMode ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-white border border-gray-100 hover:bg-blue-50/30 shadow-sm'}`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase opacity-40 mb-1 block tracking-widest">{study.category}</span>
                      <p className="font-bold">{study.title}</p>
                    </div>
                    <ChevronRight size={18} className="opacity-20 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'study-detail' && (
            <motion.div key="study-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8">
              <h2 className="text-2xl font-bold mb-2">{selectedStudy?.title}</h2>
              <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-8">
                {selectedStudy?.target === 'convert' ? 'Recém Convertido' : 'Antigo na Fé'} • {selectedStudy?.category}
              </p>
              
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-sm italic font-medium animate-pulse">Preparando conteúdo para seu crescimento...</p>
                </div>
              ) : studyContent ? (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                  {studyContent.split('\n').map((line, i) => (
                    <p key={i} className="leading-relaxed whitespace-pre-wrap">{line}</p>
                  ))}
                </div>
              ) : null}
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
                    <span className="text-xs font-black uppercase tracking-tighter opacity-30">Questão {currentQuestionIndex + 1} de {BIBLE_QUIZ.length}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>Pontuação: {score}</span>
                  </div>

                  <h2 className="text-xl font-bold mb-8 leading-tight">{BIBLE_QUIZ[currentQuestionIndex].question}</h2>

                  <div className="space-y-3 flex-1">
                    {BIBLE_QUIZ[currentQuestionIndex].options.map((option, idx) => {
                      const isCorrect = idx === BIBLE_QUIZ[currentQuestionIndex].correctAnswer;
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

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`mt-6 p-4 rounded-2xl text-sm ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-lg border border-gray-100'}`}
                      >
                        <p className="opacity-70 leading-relaxed mb-4">{BIBLE_QUIZ[currentQuestionIndex].explanation}</p>
                        <button 
                          onClick={nextQuestion}
                          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                          {currentQuestionIndex < BIBLE_QUIZ.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
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
                  <h2 className="text-3xl font-bold mb-2">Quiz Finalizado!</h2>
                  <p className="text-lg opacity-50 mb-8">Você acertou {score} de {BIBLE_QUIZ.length} perguntas.</p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <button 
                      onClick={resetQuiz}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} /> Repetir
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

          {currentView === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-1">
              <h3 className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 px-4">Configurações & Sobre</h3>
              {[
                { icon: <Bookmark size={20} />, label: 'Meus Marcadores', action: () => setCurrentView('favorites') },
                { icon: <GraduationCap size={20} />, label: 'Meus Estudos', action: () => setCurrentView('studies') },
                { icon: <Type size={20} />, label: 'Fonte', value: `${fontSize}px`, action: () => setFontSize(f => f >= 24 ? 14 : f + 2) },
                { icon: <MessageSquare size={20} />, label: 'Falar com Salomão Muanjita', action: () => window.open('https://wa.me/244943004073', '_blank') },
                { icon: <Share2 size={20} />, label: 'Compartilhar', action: () => {} },
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
                <h4 className="font-bold text-sm mb-1">Bíblia Sagrada Lite</h4>
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
