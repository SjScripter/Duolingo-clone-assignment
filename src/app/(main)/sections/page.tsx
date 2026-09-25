"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DuoSvg = ({ pose = 'wave' }: { pose?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 drop-shadow-xl">
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58CC02"/>
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58A700" clipPath="url(#clipDuoSec)"/>
    <defs>
      <clipPath id="clipDuoSec">
        <rect y="65" width="100" height="40" fill="white"/>
      </clipPath>
    </defs>
    <circle cx="35" cy="45" r="14" fill="white"/>
    <circle cx="65" cy="45" r="14" fill="white"/>
    <circle cx="39" cy="43" r="5" fill="#131F24"/>
    <circle cx="69" cy="43" r="5" fill="#131F24"/>
    <path d="M45 55 L50 65 L55 55 Z" fill="#FFC800"/>
    <path d="M35 90 L30 98 L40 98 Z" fill="#FF9600"/>
    <path d="M65 90 L60 98 L70 98 Z" fill="#FF9600"/>
  </svg>
);

export default function SectionsPage() {
  const router = useRouter();

  const sections = [
    {
      id: 1,
      title: "Section 1",
      level: "A1 • SEE DETAILS",
      speech: "¡Hola!",
      unitsCount: "8 UNITS",
      isActive: true,
      progress: 0,
      btnText: "CONTINUE",
      btnClass: "duo-button-blue bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#2bbbfa] text-white"
    },
    {
      id: 2,
      title: "Section 2",
      level: "A1 • SEE DETAILS",
      speech: "Quiero aprender español.",
      unitsCount: "31 UNITS",
      isActive: false,
      progress: 0,
      btnText: "JUMP TO SECTION 2",
      btnClass: "bg-[#202F36] border-2 border-[#37464F] text-[#1CB0F6] hover:bg-[#37464F]"
    },
    {
      id: 3,
      title: "Section 3",
      level: "A2 • SEE DETAILS",
      speech: "Puedo hablar español con mis amigos.",
      unitsCount: "45 UNITS",
      isActive: false,
      progress: 0,
      btnText: "JUMP TO SECTION 3",
      btnClass: "bg-[#202F36] border-2 border-[#37464F] text-[#1CB0F6] hover:bg-[#37464F]"
    },
    {
      id: 4,
      title: "Section 4",
      level: "A2 • SEE DETAILS",
      speech: "Puedo hablar un poco de español con mis amigos.",
      unitsCount: "60 UNITS",
      isActive: false,
      progress: 0,
      btnText: "JUMP TO SECTION 4",
      btnClass: "bg-[#202F36] border-2 border-[#37464F] text-[#1CB0F6] hover:bg-[#37464F]"
    },
    {
      id: 5,
      title: "Section 5",
      level: "B1 • SEE DETAILS",
      speech: "Soy capaz de usar español en mi vida cotidiana.",
      unitsCount: "250 UNITS",
      isActive: false,
      progress: 0,
      btnText: "JUMP TO SECTION 5",
      btnClass: "bg-[#202F36] border-2 border-[#37464F] text-[#1CB0F6] hover:bg-[#37464F]"
    }
  ];

  const handleSelectSection = (secId: number) => {
    // Save selected section & level
    localStorage.setItem('duo_current_section', secId.toString());
    const levelMap: Record<number, number> = { 1: 1, 2: 49, 3: 85, 4: 109, 5: 127 };
    const targetLevel = levelMap[secId] || 1;
    localStorage.setItem('duo_current_level', targetLevel.toString());
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      
      {/* Top Header Back Navigation */}
      <div className="w-full flex items-center mb-8">
        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white font-black text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft size={20} strokeWidth={3} />
          <span>Back</span>
        </Link>
      </div>

      {/* Sections Cards List */}
      <div className="w-full space-y-6">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`
              bg-[#1C2C35] border-2 border-[#37464F] rounded-3xl p-6 relative flex flex-col justify-between shadow-xl transition-all
              ${section.isActive ? 'border-[#1CB0F6]/50 ring-2 ring-[#1CB0F6]/20' : ''}
            `}
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[#1CB0F6] text-xs font-black tracking-widest uppercase block mb-1">
                  {section.level}
                </span>
                <h2 className="text-white text-2xl font-black">{section.title}</h2>
                {!section.isActive && (
                  <span className="text-gray-400 text-xs font-bold flex items-center space-x-1 mt-1">
                    <Lock size={12} />
                    <span>{section.unitsCount}</span>
                  </span>
                )}
              </div>

              {/* Speech Bubble & Duo Mascot */}
              <div className="flex items-center space-x-3">
                <div className="bg-[#202F36] border-2 border-[#37464F] text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl relative max-w-[160px] text-center shadow-md">
                  {section.speech}
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 bg-[#202F36] border-r-2 border-t-2 border-[#37464F] rotate-45"></div>
                </div>
                <DuoSvg />
              </div>
            </div>

            {/* Section Progress Bar for Active Section */}
            {section.isActive && (
              <div className="w-full my-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-[#37464F] h-3.5 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-[#58CC02] h-full absolute top-0 left-0 transition-all duration-500 rounded-full" 
                      style={{ width: `${section.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 font-black text-xs">{section.progress}%</span>
                  <Trophy size={18} className="text-gray-400" />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-4">
              <button
                onClick={() => handleSelectSection(section.id)}
                className={`
                  w-full py-3.5 rounded-2xl font-black uppercase text-sm tracking-wider transition-all shadow-md active:scale-98
                  ${section.btnClass}
                `}
              >
                {section.btnText}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
