"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Check, Book, ArrowLeft, Lock, ArrowUp, Headphones, RefreshCw } from 'lucide-react';
import { fetchUnits, fetchUserStats, resetUserProgressAPI, Unit, UserStats } from '@/utils/api';
import { speakText } from '@/utils/sound';

// Duo Owl Mascot Component
const DuoSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl pointer-events-none">
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58CC02"/>
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58A700" clipPath="url(#clipDuo)"/>
    <defs>
      <clipPath id="clipDuo">
        <rect y="65" width="100" height="40" fill="white"/>
      </clipPath>
    </defs>
    <path d="M15 50 C5 50, 5 70, 15 75 Z" fill="#58CC02"/>
    <path d="M85 50 C95 50, 95 70, 85 75 Z" fill="#58CC02"/>
    <circle cx="35" cy="45" r="14" fill="white"/>
    <circle cx="65" cy="45" r="14" fill="white"/>
    <circle cx="39" cy="43" r="5" fill="#131F24"/>
    <circle cx="69" cy="43" r="5" fill="#131F24"/>
    <path d="M45 55 L50 65 L55 55 Z" fill="#FFC800"/>
    <path d="M35 90 L30 98 L40 98 Z" fill="#FF9600"/>
    <path d="M65 90 L60 98 L70 98 Z" fill="#FF9600"/>
  </svg>
);

// Lily Mascot Component (Purple Goth Mascot for Unit 2)
const LilySvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="40" fill="#7C3AED" />
    <path d="M25 35 C25 20, 75 20, 75 35 C75 55, 65 85, 50 85 C35 85, 25 55, 25 35" fill="#5B21B6" />
    <circle cx="38" cy="45" r="7" fill="white" />
    <circle cx="62" cy="45" r="7" fill="white" />
    <circle cx="40" cy="45" r="3" fill="#131F24" />
    <circle cx="64" cy="45" r="3" fill="#131F24" />
    <path d="M45 58 Q50 62 55 58" stroke="#131F24" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M25 30 Q50 45 75 30" stroke="#4C1D95" strokeWidth="12" strokeLinecap="round" fill="none" />
  </svg>
);

// Bear / Oscar Mascot Component (Unit 3)
const BearSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
    <circle cx="25" cy="25" r="14" fill="#92400E" />
    <circle cx="75" cy="25" r="14" fill="#92400E" />
    <circle cx="50" cy="55" r="38" fill="#B45309" />
    <ellipse cx="50" cy="65" rx="20" ry="14" fill="#FDE68A" />
    <circle cx="50" cy="58" r="6" fill="#131F24" />
    <circle cx="38" cy="46" r="4" fill="#131F24" />
    <circle cx="62" cy="46" r="4" fill="#131F24" />
  </svg>
);

// Fallback seed units
const DEFAULT_UNITS: Unit[] = [
  {
    id: 1,
    course_id: 1,
    title: "Order at a café",
    description: "SECTION 1, UNIT 1",
    order: 1,
    color: "#58CC02",
    skills: [
      { id: 1, unit_id: 1, title: "Order at a café", order: 1, icon: "star", total_lessons: 3 },
      { id: 2, unit_id: 1, title: "Café Phrases", order: 2, icon: "star", total_lessons: 3 },
      { id: 3, unit_id: 1, title: "Drinks", order: 3, icon: "star", total_lessons: 3 },
      { id: 4, unit_id: 1, title: "Chest 1", order: 4, icon: "chest", total_lessons: 1 },
      { id: 5, unit_id: 1, title: "Snacks", order: 5, icon: "star", total_lessons: 3 },
      { id: 6, unit_id: 1, title: "Unit 1 Trophy", order: 6, icon: "trophy", total_lessons: 1 },
    ]
  },
  {
    id: 2,
    course_id: 1,
    title: "Greet people and say goodbye",
    description: "SECTION 1, UNIT 2",
    order: 2,
    color: "#CE82FF",
    skills: [
      { id: 7, unit_id: 2, title: "Greetings", order: 1, icon: "star", total_lessons: 3 },
      { id: 8, unit_id: 2, title: "Goodbyes", order: 2, icon: "star", total_lessons: 3 },
      { id: 9, unit_id: 2, title: "Chest 2", order: 3, icon: "chest", total_lessons: 1 },
      { id: 10, unit_id: 2, title: "Listening 1", order: 4, icon: "headphones", total_lessons: 3 },
      { id: 11, unit_id: 2, title: "Polite Words", order: 5, icon: "star", total_lessons: 3 },
      { id: 12, unit_id: 2, title: "Unit 2 Trophy", order: 6, icon: "trophy", total_lessons: 1 },
    ]
  },
  {
    id: 3,
    course_id: 1,
    title: "Say where you are from",
    description: "SECTION 1, UNIT 3",
    order: 3,
    color: "#00CD9C",
    skills: [
      { id: 13, unit_id: 3, title: "Countries", order: 1, icon: "star", total_lessons: 3 },
      { id: 14, unit_id: 3, title: "Audio Intro", order: 2, icon: "headphones", total_lessons: 3 },
      { id: 15, unit_id: 3, title: "Chest 3", order: 3, icon: "chest", total_lessons: 1 },
      { id: 16, unit_id: 3, title: "Listening 2", order: 4, icon: "headphones", total_lessons: 3 },
      { id: 17, unit_id: 3, title: "Origins", order: 5, icon: "star", total_lessons: 3 },
      { id: 18, unit_id: 3, title: "Unit 3 Trophy", order: 6, icon: "trophy", total_lessons: 1 },
    ]
  }
];

export default function Home() {
  const [units, setUnits] = useState<Unit[]>(DEFAULT_UNITS);
  const [currentLevel, setCurrentLevel] = useState(1); // Starts FRESH at 1
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [owlSpeech, setOwlSpeech] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const loadData = async () => {
    const uData = await fetchUnits();
    if (uData.length > 0) {
      setUnits(uData);
    }
  };

  useEffect(() => {
    loadData();

    const savedLevel = localStorage.getItem('duo_current_level');
    if (savedLevel) {
      setCurrentLevel(parseInt(savedLevel));
    } else {
      setCurrentLevel(1);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleResetProgress = async () => {
    localStorage.removeItem('duo_current_level');
    setCurrentLevel(1);
    setSelectedNode(null);
    await resetUserProgressAPI();
    speakText("Progress reset to clean start!", "en-US");
    window.location.reload();
  };

  const handleNodeClick = (levelNum: number, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedNode(selectedNode === levelNum ? null : levelNum);
    }
  };

  const handleMascotClick = () => {
    const phrases = ["¡Vamos, tú puedes!", "¡Practica cada día!", "¡Excelente trabajo!", "Keep that streak alive! 🔥"];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setOwlSpeech(phrase);
    speakText("¡Vamos! Tú puedes", "es-ES");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global skill index counter across units
  let globalSkillIndex = 0;

  return (
    <div className="flex flex-col items-center pt-6 pb-32 overflow-x-hidden relative min-h-screen">
      
      {/* Top Header Controls */}
      <div className="w-full max-w-xl flex justify-between items-center px-4 mb-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">SPANISH PATH</span>
        <button 
          onClick={handleResetProgress}
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-duo-red border border-[#37464F] px-3 py-1.5 rounded-xl transition-colors"
          title="Reset all progress to clean state"
        >
          <RefreshCw size={14} />
          <span>START FRESH</span>
        </button>
      </div>

      {/* Render All Units Sequentially (Unit 1, Unit 2, Unit 3) */}
      <div className="flex flex-col items-center space-y-16 w-full max-w-xl">
        {units.map((unit, unitIdx) => {
          const isUnitLocked = unitIdx > 0 && globalSkillIndex >= currentLevel;

          return (
            <div key={unit.id} className="w-full flex flex-col items-center">
              
              {/* Unit Header Banner with Navigation to /sections & /guidebook */}
              <div 
                className="w-full rounded-2xl p-5 flex justify-between items-center shadow-lg relative z-20"
                style={{ backgroundColor: unit.color }}
              >
                <div className="flex flex-col">
                  {/* Back arrow clicking opens Sections Overview Page */}
                  <Link 
                    href="/sections"
                    className="flex items-center space-x-2 text-white/90 hover:text-white font-black text-[13px] mb-1 tracking-wider uppercase group cursor-pointer transition-colors"
                  >
                    <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{unit.description}</span>
                  </Link>
                  <h1 className="text-white text-2xl font-black leading-tight">
                    {unit.title}
                  </h1>
                </div>

                {/* Guidebook Button navigating to /guidebook/[id] */}
                <Link href={`/guidebook/${unit.id}`}>
                  <button 
                    className="flex items-center space-x-2 border-2 border-black/10 bg-white/10 hover:bg-white/20 transition-colors text-white px-3.5 py-2.5 rounded-xl font-bold shadow-sm flex-shrink-0"
                  >
                    <Book size={18} />
                    <span className="uppercase tracking-widest text-[13px] hidden sm:inline">Guidebook</span>
                  </button>
                </Link>
              </div>

              {/* Fast Forward Badge ("JUMP HERE?") for Locked Units */}
              {isUnitLocked && (
                <div className="my-6 z-30 flex flex-col items-center">
                  <div className="bg-[#202F36] border-2 border-[#37464F] text-white text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-md mb-2">
                    JUMP HERE?
                  </div>
                  <div 
                    style={{ backgroundColor: unit.color }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const firstSkillInUnit = globalSkillIndex + 1;
                      setCurrentLevel(firstSkillInUnit);
                      localStorage.setItem('duo_current_level', firstSkillInUnit.toString());
                    }}
                  >
                    ⏩
                  </div>
                </div>
              )}

              {/* Unit Skill Nodes Path */}
              <div className="flex flex-col items-center space-y-10 relative w-full mt-16 mb-6">
                {unit.skills.map((skill, skillIdx) => {
                  globalSkillIndex++;
                  const levelNum = globalSkillIndex;
                  const isCompleted = levelNum < currentLevel;
                  const isActive = levelNum === currentLevel;
                  const isLocked = levelNum > currentLevel;
                  const isSelected = selectedNode === levelNum;

                  const offset = Math.sin(skillIdx * 0.75) * 80;

                  return (
                    <div 
                      key={skill.id}
                      className="relative flex justify-center items-center h-[90px] w-full"
                    >
                      {/* Node Popover Box matching screenshot! */}
                      {isSelected && (
                        <div 
                          className="absolute -top-[135px] left-1/2 -translate-x-1/2 rounded-2xl p-4 z-50 whitespace-nowrap shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-150 w-64"
                          style={{ backgroundColor: unit.color }}
                        >
                          <div className="text-white font-black tracking-wider text-base mb-0.5 text-center truncate max-w-[220px]">
                            {skill.title}
                          </div>
                          <div className="text-white/90 text-xs mb-3 font-bold">
                            Lesson 1 of {skill.total_lessons || 3}
                          </div>
                          <Link href={`/lesson/${skill.id}`} className="w-full">
                            <button 
                              className="w-full py-3 bg-white hover:bg-gray-100 rounded-xl font-black uppercase text-sm tracking-wider shadow-md transition-transform active:scale-95 text-center"
                              style={{ color: unit.color }}
                            >
                              START +10 XP
                            </button>
                          </Link>
                          {/* Popover Pointer Tail */}
                          <div 
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                            style={{ backgroundColor: unit.color }}
                          ></div>
                        </div>
                      )}

                      {/* Mascot Illustrations next to Path */}
                      {unitIdx === 0 && skillIdx === 1 && (
                        <div 
                          className="absolute top-2 -right-[120px] cursor-pointer z-20 w-24 h-24 transition-transform duration-100 ease-out"
                          onClick={handleMascotClick}
                          style={{
                            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`
                          }}
                        >
                          <DuoSvg />
                          {owlSpeech && (
                            <div className="absolute -top-14 -left-12 bg-[#202F36] text-white text-xs p-3 rounded-2xl border-2 border-[#37464F] w-40 text-center shadow-2xl font-bold">
                              {owlSpeech}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#202F36] border-b-2 border-r-2 border-[#37464F] rotate-45"></div>
                            </div>
                          )}
                        </div>
                      )}

                      {unitIdx === 1 && skillIdx === 1 && (
                        <div className="absolute top-2 -left-[120px] w-24 h-24 pointer-events-none opacity-80">
                          <LilySvg />
                        </div>
                      )}

                      {unitIdx === 2 && skillIdx === 2 && (
                        <div className="absolute top-2 -right-[120px] w-24 h-24 pointer-events-none opacity-80">
                          <BearSvg />
                        </div>
                      )}

                      {/* Skill Node Button */}
                      <div 
                        className="relative flex items-center justify-center cursor-pointer group"
                        style={{ transform: `translateX(${offset}px)` }}
                        onClick={() => handleNodeClick(levelNum, isLocked)}
                      >
                        {/* Start Badge above Active Node (hidden when popover open) */}
                        {isActive && !isSelected && (
                          <div className="absolute -top-10 bg-[#202F36] border-2 border-[#58CC02] text-[#58CC02] text-[11px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-md z-30 animate-bounce">
                            START
                          </div>
                        )}

                        {/* Progress Ring for Active Level (Unstarted = 264 strokeDashoffset) */}
                        {isActive && (
                          <svg className="absolute w-[102px] h-[102px] -rotate-90 z-0 drop-shadow-md pointer-events-none">
                            <circle cx="51" cy="51" r="42" fill="none" stroke="#37464F" strokeWidth="8" />
                            <circle cx="51" cy="51" r="42" fill="none" stroke="#58CC02" strokeWidth="8" strokeDasharray="264" strokeDashoffset="264" strokeLinecap="round" />
                          </svg>
                        )}

                        <div 
                          className={`
                            w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all relative z-10
                            ${isActive ? 'bg-[#58CC02] scale-105 group-hover:scale-110' : 
                              isCompleted ? 'bg-[#FFC800] group-hover:bg-[#dfa700] scale-100 group-hover:scale-105' : 
                              'bg-[#37464F] group-hover:bg-[#4B5B65] cursor-not-allowed'}
                          `}
                          style={{
                            boxShadow: isActive ? '0 6px 0 #58A700' : 
                                       isCompleted ? '0 6px 0 #CC9900' : 
                                       '0 6px 0 #202F36'
                          }}
                        >
                          {isCompleted ? (
                            <Check size={38} className="text-white" strokeWidth={4} />
                          ) : isLocked ? (
                            skill.icon === 'headphones' ? <Headphones size={30} className="text-[#52656D]" /> :
                            skill.icon === 'chest' ? <div className="text-3xl opacity-50">🧰</div> :
                            skill.icon === 'trophy' ? <div className="text-3xl opacity-50">🏆</div> :
                            <Lock size={32} className="text-[#52656D]" strokeWidth={3} />
                          ) : (
                            skill.icon === 'headphones' ? <Headphones size={34} className="text-white" /> :
                            skill.icon === 'chest' ? <div className="text-3xl">🧰</div> :
                            skill.icon === 'trophy' ? <div className="text-3xl">🏆</div> :
                            <Star size={36} className="text-white fill-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Jump-To-Top Button (Bottom Right Up Arrow ↑) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#202F36] border-2 border-[#37464F] text-gray-300 hover:text-white hover:border-[#1CB0F6] rounded-2xl flex items-center justify-center shadow-2xl transition-all z-40 active:scale-95"
        title="Scroll to top"
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>
    </div>
  );
}
