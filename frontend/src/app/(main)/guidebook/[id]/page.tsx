"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, Lightbulb, BookOpen } from 'lucide-react';
import { speakText } from '@/utils/sound';

const DuoSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 drop-shadow-xl">
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58CC02"/>
    <path d="M15 45 C15 15, 85 15, 85 45 C85 80, 75 90, 50 90 C25 90, 15 80, 15 45" fill="#58A700" clipPath="url(#clipDuoGb)"/>
    <defs>
      <clipPath id="clipDuoGb">
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

interface GuidebookData {
  unitTitle: string;
  keyPhrases: { spanish: string; english: string }[];
  tipTitle: string;
  tipDescription: string;
  tableData: { spanish: string; english: string }[];
  tipPhrases: { spanish: string; english: string }[];
}

const GUIDEBOOK_CONTENTS: Record<string, GuidebookData> = {
  '1': {
    unitTitle: "Unit 1 Guidebook",
    keyPhrases: [
      { spanish: "Un vaso de agua, por favor.", english: "A glass of water, please." },
      { spanish: "Hola, quiero un té con azúcar.", english: "Hello, I want a tea with sugar." },
      { spanish: "Quiero un helado y un vaso de agua.", english: "I want an ice cream and a glass of water." }
    ],
    tipTitle: "Conjunctions: y & o",
    tipDescription: "Spanish uses y (and) and o (or) to connect words, just like in English.",
    tableData: [
      { spanish: "y", english: "and" },
      { spanish: "o", english: "or" }
    ],
    tipPhrases: [
      { spanish: "Un café y un helado.", english: "A coffee and an ice cream." },
      { spanish: "¿Un café o un té?", english: "A coffee or a tea?" }
    ]
  },
  '2': {
    unitTitle: "Unit 2 Guidebook",
    keyPhrases: [
      { spanish: "¡Buenos días! ¿Cómo estás?", english: "Good morning! How are you?" },
      { spanish: "Hasta luego, que tengas un buen día.", english: "See you later, have a nice day." },
      { spanish: "Muchas gracias, de nada.", english: "Thank you very much, you are welcome." }
    ],
    tipTitle: "Gender of Nouns: el vs la",
    tipDescription: "In Spanish, masculine nouns take 'el' and feminine nouns take 'la'.",
    tableData: [
      { spanish: "el niño / el pan", english: "masculine (the boy / the bread)" },
      { spanish: "la niña / la manzana", english: "feminine (the girl / the apple)" }
    ],
    tipPhrases: [
      { spanish: "El hombre y la mujer.", english: "The man and the woman." },
      { spanish: "La manzana es roja.", english: "The apple is red." }
    ]
  },
  '3': {
    unitTitle: "Unit 3 Guidebook",
    keyPhrases: [
      { spanish: "Yo soy de España, ¿y tú?", english: "I am from Spain, and you?" },
      { spanish: "Vivo en Madrid, una ciudad hermosa.", english: "I live in Madrid, a beautiful city." },
      { spanish: "¿De dónde eres?", english: "Where are you from?" }
    ],
    tipTitle: "Using the Verb Ser (To Be)",
    tipDescription: "Use 'ser' to describe identity, origins, and essential characteristics.",
    tableData: [
      { spanish: "Yo soy", english: "I am" },
      { spanish: "Tú eres", english: "You are" },
      { spanish: "Él / Ella es", english: "He / She is" }
    ],
    tipPhrases: [
      { spanish: "Yo soy estudiante de español.", english: "I am a Spanish student." },
      { spanish: "Ella es de México.", english: "She is from Mexico." }
    ]
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GuidebookPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const unitId = resolvedParams.id || '1';
  const content = GUIDEBOOK_CONTENTS[unitId] || GUIDEBOOK_CONTENTS['1'];

  const handleSpeak = (text: string) => {
    speakText(text, 'es-ES');
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      
      {/* Header Back Button */}
      <div className="w-full flex items-center mb-8">
        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white font-black text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft size={20} strokeWidth={3} />
          <span>Back</span>
        </Link>
      </div>

      {/* Guidebook Header Card */}
      <div className="w-full bg-[#202F36] border-2 border-[#37464F] rounded-3xl p-6 flex items-center space-x-6 mb-8 shadow-xl">
        <DuoSvg />
        <div>
          <h1 className="text-white text-3xl font-black">{content.unitTitle}</h1>
          <p className="text-gray-400 font-bold text-sm mt-1">Explore grammar tips and key phrases for this unit</p>
        </div>
      </div>

      {/* KEY PHRASES Section */}
      <div className="w-full mb-10">
        <h2 className="text-[#1CB0F6] text-xs font-black tracking-widest uppercase mb-4">
          KEY PHRASES
        </h2>
        <div className="space-y-3">
          {content.keyPhrases.map((phrase, idx) => (
            <div 
              key={idx}
              onClick={() => handleSpeak(phrase.spanish)}
              className="bg-[#1C2C35] border-2 border-[#37464F] hover:border-[#1CB0F6] rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all shadow-sm group"
            >
              <button 
                className="text-[#1CB0F6] p-2.5 rounded-xl bg-[#1CB0F6]/10 group-hover:scale-110 transition-transform"
                title="Click to hear audio"
              >
                <Volume2 size={24} />
              </button>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg group-hover:text-[#1CB0F6] transition-colors">
                  {phrase.spanish}
                </span>
                <span className="text-gray-400 font-semibold text-sm">
                  {phrase.english}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GRAMMAR TIPS Section */}
      <div className="w-full">
        <div className="bg-[#1C2C35] border-2 border-[#37464F] rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-2 text-[#FFC800] text-xs font-black tracking-widest uppercase mb-2">
            <Lightbulb size={16} />
            <span>TIP</span>
          </div>
          <h3 className="text-white text-2xl font-black mb-3">{content.tipTitle}</h3>
          <p className="text-gray-300 font-semibold text-sm mb-6 leading-relaxed">
            {content.tipDescription}
          </p>

          {/* Vocabulary / Rule Table */}
          <div className="w-full border-2 border-[#37464F] rounded-2xl overflow-hidden mb-6">
            <div className="grid grid-cols-2 bg-[#202F36] border-b-2 border-[#37464F] p-3 text-white font-black text-sm">
              <div>Spanish</div>
              <div>English</div>
            </div>
            {content.tableData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 p-3 text-sm font-bold border-b border-[#37464F] last:border-b-0 text-gray-200">
                <div className="text-[#1CB0F6] font-black">{row.spanish}</div>
                <div>{row.english}</div>
              </div>
            ))}
          </div>

          {/* Grammar Example Phrases with Voice */}
          <div className="space-y-3 pt-2">
            {content.tipPhrases.map((phrase, idx) => (
              <div 
                key={idx}
                onClick={() => handleSpeak(phrase.spanish)}
                className="flex items-center space-x-3 text-white font-bold cursor-pointer group hover:text-[#1CB0F6] transition-colors"
              >
                <button className="text-[#1CB0F6] p-1.5 rounded-lg bg-[#1CB0F6]/10">
                  <Volume2 size={20} />
                </button>
                <div>
                  <span className="font-black text-base block">{phrase.spanish}</span>
                  <span className="text-gray-400 text-xs font-semibold">{phrase.english}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
