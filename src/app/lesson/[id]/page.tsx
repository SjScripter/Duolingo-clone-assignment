"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { X, Heart, Volume2, CheckCircle2, XCircle, Sparkles, RefreshCw, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { fetchLessonExercises, updateUserProgress, refillHeartsAPI, Exercise } from '@/utils/api';
import { playCorrectSound, playIncorrectSound, playVictoryFanfare, speakText } from '@/utils/sound';

// Fallback seed exercises for instant render
const FALLBACK_EXERCISES: Exercise[] = [
  {
    id: 1,
    lesson_id: 3,
    type: 'TRANSLATE',
    question: "The boy drinks water",
    options: ["El", "niño", "bebe", "agua", "la", "manzana", "como", "mujer"],
    answer: "El niño bebe agua",
    audio_text: "El niño bebe agua",
    explanation: "In Spanish, 'bebe' means drinks and 'agua' means water."
  },
  {
    id: 2,
    lesson_id: 3,
    type: 'MULTIPLE_CHOICE',
    question: "Which of these is 'the apple'?",
    options: [
      { text: "la manzana", subtext: "the apple", icon: "🍎" },
      { text: "el pan", subtext: "the bread", icon: "🍞" },
      { text: "la leche", subtext: "the milk", icon: "🥛" },
      { text: "el agua", subtext: "the water", icon: "💧" }
    ],
    answer: "la manzana",
    audio_text: "la manzana",
    explanation: "Manzana is a feminine noun in Spanish."
  },
  {
    id: 3,
    lesson_id: 3,
    type: 'MATCH_PAIRS',
    question: "Tap the matching pairs",
    options: [
      { left: "boy", right: "niño" },
      { left: "woman", right: "mujer" },
      { left: "water", right: "agua" },
      { left: "apple", right: "manzana" }
    ],
    answer: "MATCH_ALL",
    explanation: "Great vocabulary matching!"
  },
  {
    id: 4,
    lesson_id: 3,
    type: 'FILL_IN_BLANK',
    question: "Yo ____ una manzana",
    options: ["como", "bebo", "hablo", "soy"],
    answer: "como",
    audio_text: "Yo como una manzana",
    explanation: "Como comes from the verb comer (to eat)."
  },
  {
    id: 5,
    lesson_id: 3,
    type: 'TYPE_ANSWER',
    question: "Translate 'Hello' to Spanish",
    options: [],
    answer: "Hola",
    audio_text: "Hola",
    explanation: "Hola is the universal greeting in Spanish."
  }
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>(FALLBACK_EXERCISES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [heartsLostCount, setHeartsLostCount] = useState(0);
  const [status, setStatus] = useState<'none' | 'correct' | 'incorrect' | 'completed' | 'out_of_hearts'>('none');
  
  // Exercise Specific States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wordBankSelected, setWordBankSelected] = useState<string[]>([]);
  
  // Match Pairs States
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);
  const [selectedPairRight, setSelectedPairRight] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      const lessonId = parseInt(resolvedParams.id) || 3;
      const data = await fetchLessonExercises(lessonId);
      if (data && data.length > 0) {
        setExercises(data);
      }
    };
    loadExercises();
  }, [resolvedParams.id]);

  const currentExercise = exercises[currentIdx] || FALLBACK_EXERCISES[0];
  const progress = (currentIdx / exercises.length) * 100;

  // Speak Spanish audio when exercise loads or speaker clicked
  useEffect(() => {
    if (currentExercise && currentExercise.audio_text) {
      speakText(currentExercise.audio_text, 'es-ES');
    }
  }, [currentIdx, currentExercise]);

  const handleSpeakerClick = () => {
    if (currentExercise.audio_text) {
      speakText(currentExercise.audio_text, 'es-ES');
    } else if (typeof currentExercise.question === 'string') {
      speakText(currentExercise.question, 'es-ES');
    }
  };

  // Word Bank tile tap handlers
  const handleTileClick = (word: string, fromBank: boolean) => {
    if (status !== 'none') return;
    if (fromBank) {
      setWordBankSelected([...wordBankSelected, word]);
    } else {
      const idx = wordBankSelected.indexOf(word);
      if (idx !== -1) {
        const copy = [...wordBankSelected];
        copy.splice(idx, 1);
        setWordBankSelected(copy);
      }
    }
  };

  // Match Pair Tap Handlers
  const handleMatchLeftClick = (item: string) => {
    if (matchedPairs.includes(item)) return;
    setSelectedPairLeft(item);
    checkMatchPair(item, selectedPairRight);
  };

  const handleMatchRightClick = (item: string) => {
    if (matchedPairs.includes(item)) return;
    setSelectedPairRight(item);
    checkMatchPair(selectedPairLeft, item);
  };

  const checkMatchPair = (left: string | null, right: string | null) => {
    if (!left || !right) return;
    
    // Check if left and right match in pairs array
    const pairs: { left: string; right: string }[] = currentExercise.options || [];
    const isPair = pairs.some(p => p.left === left && p.right === right);

    if (isPair) {
      playCorrectSound();
      const newMatched = [...matchedPairs, left, right];
      setMatchedPairs(newMatched);
      setSelectedPairLeft(null);
      setSelectedPairRight(null);

      // Check if all pairs matched
      if (newMatched.length >= pairs.length * 2) {
        setStatus('correct');
      }
    } else {
      playIncorrectSound();
      setTimeout(() => {
        setSelectedPairLeft(null);
        setSelectedPairRight(null);
      }, 500);
    }
  };

  const handleCheck = () => {
    let isCorrect = false;

    if (currentExercise.type === 'TRANSLATE') {
      const userSentence = wordBankSelected.join(' ').trim().toLowerCase();
      isCorrect = userSentence === currentExercise.answer.trim().toLowerCase();
    } else if (currentExercise.type === 'MULTIPLE_CHOICE' || currentExercise.type === 'FILL_IN_BLANK') {
      isCorrect = selectedOption?.trim().toLowerCase() === currentExercise.answer.trim().toLowerCase();
    } else if (currentExercise.type === 'TYPE_ANSWER') {
      isCorrect = (selectedOption || '').trim().toLowerCase() === currentExercise.answer.trim().toLowerCase();
    } else if (currentExercise.type === 'MATCH_PAIRS') {
      isCorrect = true; // Checked incrementally
    }

    if (isCorrect) {
      playCorrectSound();
      setStatus('correct');
    } else {
      playIncorrectSound();
      setStatus('incorrect');
      setHeartsLostCount(prev => prev + 1);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setStatus('out_of_hearts');
      }
    }
  };

  const handleContinue = () => {
    if (status === 'correct') {
      if (currentIdx + 1 < exercises.length) {
        setCurrentIdx(i => i + 1);
        setStatus('none');
        setSelectedOption(null);
        setWordBankSelected([]);
        setMatchedPairs([]);
        setSelectedPairLeft(null);
        setSelectedPairRight(null);
      } else {
        // Completed all exercises in lesson!
        setStatus('completed');
        playVictoryFanfare();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        
        // Save progress to backend API
        const skillId = parseInt(resolvedParams.id) || 2;
        updateUserProgress(15, heartsLostCount, skillId);

        // Update local level progress
        const currLevel = parseInt(localStorage.getItem('duo_current_level') || '2');
        localStorage.setItem('duo_current_level', Math.max(currLevel, skillId + 1).toString());
      }
    } else if (status === 'incorrect') {
      setStatus('none');
      setSelectedOption(null);
      setWordBankSelected([]);
    } else if (status === 'completed') {
      router.push('/');
    }
  };

  const handleRefillAndContinue = async () => {
    await refillHeartsAPI();
    setHearts(5);
    setStatus('none');
    setSelectedOption(null);
    setWordBankSelected([]);
  };

  // Render Out of Hearts Modal
  if (status === 'out_of_hearts') {
    return (
      <div className="fixed inset-0 bg-[#131F24]/95 z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#202F36] border-2 border-[#37464F] rounded-3xl p-8 max-w-md w-full flex flex-col items-center shadow-2xl space-y-6">
          <div className="text-6xl animate-bounce">💔</div>
          <h1 className="text-white text-3xl font-black">You ran out of hearts!</h1>
          <p className="text-gray-300 font-bold text-sm">
            Refill your hearts now for 50 gems or return home to practice!
          </p>
          <div className="w-full space-y-3 pt-4">
            <button 
              onClick={handleRefillAndContinue}
              className="duo-button w-full py-4 text-lg font-black tracking-wider flex items-center justify-center space-x-2"
            >
              <span>REFILL HEARTS (50 💎)</span>
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full py-3.5 rounded-xl font-bold bg-transparent text-gray-400 hover:text-white border-2 border-[#37464F] uppercase tracking-wider text-sm transition-colors"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Lesson Completion Screen
  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#131F24] text-center">
        <div className="flex flex-col items-center space-y-6 max-w-md w-full">
          <div className="text-7xl animate-bounce">🎉</div>
          <h1 className="text-[#FFC800] text-4xl font-black tracking-tight">Lesson Complete!</h1>
          <p className="text-white text-xl font-bold">You've mastered this skill lesson!</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 w-full my-6">
            <div className="bg-[#202F36] border-2 border-[#FFC800] rounded-2xl p-5 flex flex-col items-center">
              <span className="text-xs text-[#FFC800] font-black uppercase tracking-wider mb-1">TOTAL XP</span>
              <span className="text-white text-3xl font-black flex items-center space-x-2">
                <span>⚡</span> <span>+15</span>
              </span>
            </div>
            <div className="bg-[#202F36] border-2 border-[#58CC02] rounded-2xl p-5 flex flex-col items-center">
              <span className="text-xs text-[#58CC02] font-black uppercase tracking-wider mb-1">ACCURACY</span>
              <span className="text-white text-3xl font-black">
                {Math.round(((exercises.length - heartsLostCount) / exercises.length) * 100)}%
              </span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/')} 
            className="duo-button w-full py-4 text-xl hover:scale-95 transition-transform font-black tracking-widest"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#131F24]">
      {/* Header with Progress Bar & Hearts */}
      <header className="flex items-center justify-between p-4 max-w-4xl mx-auto w-full gap-4 mt-2">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <X size={28} strokeWidth={3} />
        </Link>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 bg-[#37464F] h-4 rounded-full relative overflow-hidden">
          <div 
            className="bg-[#58CC02] h-full absolute top-0 left-0 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Hearts Display */}
        <div className="flex items-center space-x-2 text-[#FF4B4B] font-black text-xl">
          <Heart fill={hearts > 0 ? "currentColor" : "none"} className={hearts <= 1 ? "animate-pulse" : ""} size={26} />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Exercise View */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full pb-32">
        
        {/* Question Prompt */}
        <h1 className="text-white text-2xl sm:text-3xl font-black w-full mb-8 text-left leading-snug flex items-center justify-between">
          <span>
            {currentExercise.type === 'TRANSLATE' && 'Translate this sentence'}
            {currentExercise.type === 'MULTIPLE_CHOICE' && currentExercise.question}
            {currentExercise.type === 'MATCH_PAIRS' && 'Tap the matching pairs'}
            {currentExercise.type === 'FILL_IN_BLANK' && 'Complete the sentence'}
            {currentExercise.type === 'TYPE_ANSWER' && currentExercise.question}
          </span>
          <button 
            onClick={handleSpeakerClick}
            className="text-[#1CB0F6] hover:bg-[#1CB0F6]/10 p-2.5 rounded-2xl border-2 border-[#1CB0F6]/30 transition-transform active:scale-95 ml-4 flex-shrink-0"
            title="Listen to pronunciation"
          >
            <Volume2 size={28} />
          </button>
        </h1>

        {/* Mascot & Speech Prompt (Except Match Pairs) */}
        {currentExercise.type !== 'MATCH_PAIRS' && currentExercise.type !== 'MULTIPLE_CHOICE' && (
          <div className="flex items-center space-x-4 w-full mb-8 group">
            <div 
              onClick={handleSpeakerClick}
              className="text-5xl cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
            >
              🦉
            </div>
            
            <div className="border-2 border-[#37464F] bg-[#202F36] rounded-2xl p-4 text-white relative flex-1 shadow-md">
              <div className="absolute top-1/2 -left-[10px] -translate-y-1/2 w-4 h-4 bg-[#202F36] border-l-2 border-b-2 border-[#37464F] rotate-45"></div>
              <span className="text-xl font-bold">{currentExercise.question}</span>
            </div>
          </div>
        )}

        {/* EXERCISE TYPE 1: TRANSLATE (WORD BANK) */}
        {currentExercise.type === 'TRANSLATE' && (
          <div className="w-full space-y-8">
            {/* Answer Construction Area */}
            <div className="min-h-[72px] border-b-2 border-[#37464F] flex flex-wrap gap-2.5 p-3 items-center">
              {wordBankSelected.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleTileClick(word, false)}
                  className="bg-[#202F36] text-white border-2 border-[#37464F] px-4 py-2.5 rounded-xl font-bold text-lg shadow-sm hover:bg-[#202F36]/80 active:scale-95 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Word Bank Bank Tiles */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              {(currentExercise.options as string[] || []).map((word, idx) => {
                const isUsed = wordBankSelected.includes(word);
                return (
                  <button
                    key={`${word}-${idx}`}
                    disabled={isUsed || status !== 'none'}
                    onClick={() => handleTileClick(word, true)}
                    className={`
                      px-4 py-2.5 rounded-xl font-bold text-lg border-2 transition-all
                      ${isUsed 
                        ? 'bg-[#202F36]/30 border-transparent text-transparent cursor-default' 
                        : 'bg-[#202F36] border-[#37464F] text-white hover:bg-[#37464F] active:scale-95 shadow-sm'}
                    `}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EXERCISE TYPE 2: MULTIPLE CHOICE */}
        {currentExercise.type === 'MULTIPLE_CHOICE' && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {(currentExercise.options || []).map((opt: any, idx: number) => {
              const optText = typeof opt === 'string' ? opt : opt.text;
              const optIcon = typeof opt === 'object' ? opt.icon : '✨';
              const optSub = typeof opt === 'object' ? opt.subtext : '';
              const isSelected = selectedOption === optText;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (status === 'none') {
                      setSelectedOption(optText);
                      speakText(optText, 'es-ES');
                    }
                  }}
                  disabled={status !== 'none'}
                  className={`
                    p-5 rounded-2xl border-2 font-bold text-center transition-all flex flex-col items-center justify-center space-y-2
                    ${isSelected 
                      ? 'border-[#84D8FF] bg-[#84D8FF]/10 text-[#84D8FF] scale-98 shadow-md' 
                      : 'border-[#37464F] text-white hover:bg-[#202F36] hover:-translate-y-0.5'}
                  `}
                >
                  <span className="text-4xl">{optIcon}</span>
                  <span className="text-xl font-black">{optText}</span>
                  {optSub && <span className="text-xs text-gray-400 font-semibold">{optSub}</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* EXERCISE TYPE 3: MATCH PAIRS */}
        {currentExercise.type === 'MATCH_PAIRS' && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Left Column (English Words) */}
            <div className="flex flex-col space-y-3">
              {(currentExercise.options || []).map((pair: any) => {
                const isMatched = matchedPairs.includes(pair.left);
                const isSelected = selectedPairLeft === pair.left;
                return (
                  <button
                    key={pair.left}
                    disabled={isMatched || status !== 'none'}
                    onClick={() => handleMatchLeftClick(pair.left)}
                    className={`
                      p-4 rounded-xl border-2 font-bold text-center transition-all text-lg
                      ${isMatched ? 'opacity-20 border-transparent bg-transparent text-gray-500 line-through' :
                        isSelected ? 'border-[#1CB0F6] bg-[#1CB0F6]/20 text-[#1CB0F6]' :
                        'border-[#37464F] bg-[#202F36] text-white hover:bg-[#37464F]'}
                    `}
                  >
                    {pair.left}
                  </button>
                );
              })}
            </div>

            {/* Right Column (Spanish Words) */}
            <div className="flex flex-col space-y-3">
              {(currentExercise.options || []).map((pair: any) => {
                const isMatched = matchedPairs.includes(pair.right);
                const isSelected = selectedPairRight === pair.right;
                return (
                  <button
                    key={pair.right}
                    disabled={isMatched || status !== 'none'}
                    onClick={() => {
                      handleMatchRightClick(pair.right);
                      speakText(pair.right, 'es-ES');
                    }}
                    className={`
                      p-4 rounded-xl border-2 font-bold text-center transition-all text-lg
                      ${isMatched ? 'opacity-20 border-transparent bg-transparent text-gray-500 line-through' :
                        isSelected ? 'border-[#1CB0F6] bg-[#1CB0F6]/20 text-[#1CB0F6]' :
                        'border-[#37464F] bg-[#202F36] text-white hover:bg-[#37464F]'}
                    `}
                  >
                    {pair.right}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EXERCISE TYPE 4: FILL IN BLANK */}
        {currentExercise.type === 'FILL_IN_BLANK' && (
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {(currentExercise.options as string[] || []).map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  if (status === 'none') {
                    setSelectedOption(opt);
                    speakText(opt, 'es-ES');
                  }
                }}
                disabled={status !== 'none'}
                className={`
                  p-5 rounded-2xl border-2 font-bold text-center transition-all text-xl
                  ${selectedOption === opt 
                    ? 'border-[#84D8FF] bg-[#84D8FF]/10 text-[#84D8FF] scale-98' 
                    : 'border-[#37464F] text-white hover:bg-[#202F36]'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* EXERCISE TYPE 5: TYPE ANSWER */}
        {currentExercise.type === 'TYPE_ANSWER' && (
          <div className="w-full space-y-4">
            <input 
              type="text" 
              value={selectedOption || ''}
              onChange={(e) => {
                if (status === 'none') setSelectedOption(e.target.value);
              }}
              disabled={status !== 'none'}
              className="w-full bg-[#131F24] border-2 border-[#37464F] rounded-2xl p-5 text-white text-xl font-bold outline-none focus:border-[#1CB0F6] focus:bg-[#202F36] transition-colors"
              placeholder="Type in Spanish..."
              autoFocus
            />
          </div>
        )}
      </main>

      {/* Signature Animated Bottom Feedback Drawer */}
      <footer className={`
        fixed bottom-0 left-0 right-0 border-t-2 border-[#37464F] p-6 transition-colors duration-300 z-50
        ${status === 'correct' ? 'bg-[#d7ffb8] border-transparent text-[#2b7000]' : ''}
        ${status === 'incorrect' ? 'bg-[#ffdfe0] border-transparent text-[#ea2b2b]' : 'bg-[#131F24]'}
      `}>
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          {status === 'none' && (
            <button 
              onClick={handleContinue} 
              className="px-4 font-bold text-gray-500 hover:text-gray-300 text-sm uppercase tracking-widest transition-colors"
            >
              SKIP
            </button>
          )}

          {/* Correct Feedback Bar */}
          {status === 'correct' && (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl text-[#58CC02] shadow-md font-black">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl">Nicely done!</span>
                {currentExercise.explanation && (
                  <span className="text-sm font-bold opacity-90">{currentExercise.explanation}</span>
                )}
              </div>
            </div>
          )}

          {/* Incorrect Feedback Bar */}
          {status === 'incorrect' && (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl text-[#FF4B4B] shadow-md font-black">
                ✕
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl">Correct answer:</span>
                <span className="text-lg font-bold opacity-90">{currentExercise.answer}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={status === 'none' ? handleCheck : handleContinue}
            disabled={
              status === 'none' && 
              ((currentExercise.type === 'TRANSLATE' && wordBankSelected.length === 0) ||
               ((currentExercise.type === 'MULTIPLE_CHOICE' || currentExercise.type === 'TYPE_ANSWER' || currentExercise.type === 'FILL_IN_BLANK') && !selectedOption))
            }
            className={`
              px-10 py-3.5 rounded-2xl font-black uppercase transition-all duration-150 text-lg shadow-md hover:scale-95
              ${status === 'none' && !selectedOption && wordBankSelected.length === 0 ? 'bg-[#37464F] text-gray-500 cursor-not-allowed opacity-50' : ''}
              ${status === 'none' && (selectedOption || wordBankSelected.length > 0) ? 'duo-button' : ''}
              ${status === 'correct' ? 'duo-button' : ''}
              ${status === 'incorrect' ? 'bg-[#FF4B4B] text-white border-b-4 border-[#EA2B2B] hover:bg-[#ff3b3b]' : ''}
            `}
          >
            {status === 'none' ? 'Check' : 'Continue'}
          </button>
        </div>
      </footer>
    </div>
  );
}
