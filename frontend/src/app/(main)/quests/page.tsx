"use client";

import { useEffect, useState } from 'react';
import { fetchQuestsAPI } from '@/utils/api';
import { Target, CheckCircle2, Gift } from 'lucide-react';

export default function QuestsPage() {
  const [quests, setQuests] = useState([
    { id: 1, title: "Earn 10 XP", reward: 10, current: 30, target: 10, icon: "⚡", claimed: true },
    { id: 2, title: "Earn 50 XP", reward: 20, current: 30, target: 50, icon: "🎯", claimed: false },
    { id: 3, title: "Complete 3 Lessons", reward: 30, current: 2, target: 3, icon: "📚", claimed: false },
    { id: 4, title: "Maintain a 3-day Streak", reward: 50, current: 3, target: 3, icon: "🔥", claimed: true },
  ]);

  useEffect(() => {
    const loadQuests = async () => {
      const data = await fetchQuestsAPI();
      if (data && data.length > 0) {
        setQuests(data);
      }
    };
    loadQuests();
  }, []);

  const handleClaim = (id: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, claimed: true } : q));
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      {/* Header Banner */}
      <div className="w-full flex flex-col items-center mb-8 border-b-2 border-[#37464F] pb-8 text-center">
        <div className="w-24 h-24 mb-4 flex items-center justify-center bg-[#FFC800]/20 rounded-full border-4 border-[#FFC800] text-5xl shadow-xl">
          🎯
        </div>
        <h1 className="text-white text-3xl font-black mb-2">Daily Quests</h1>
        <p className="text-gray-400 font-bold text-sm">Complete quests every day to earn bonus gems and XP!</p>
      </div>

      {/* Quests List */}
      <div className="w-full space-y-4">
        {quests.map((quest) => {
          const isComplete = quest.current >= quest.target;
          const progressPercent = Math.min(100, (quest.current / quest.target) * 100);

          return (
            <div 
              key={quest.id}
              className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-5 flex items-center space-x-5 shadow-sm"
            >
              {/* Quest Icon */}
              <div className="text-4xl w-12 flex justify-center">{quest.icon}</div>

              {/* Quest Info & Progress */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-black text-base">{quest.title}</h3>
                  <span className="text-[#FFC800] text-xs font-black">+{quest.reward} 💎</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#37464F] h-4 rounded-full relative overflow-hidden">
                  <div 
                    className="bg-[#FFC800] h-full absolute top-0 left-0 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-black">
                    {quest.current} / {quest.target}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {quest.claimed ? (
                  <div className="flex items-center space-x-1 text-[#58CC02] font-black text-xs">
                    <CheckCircle2 size={22} />
                    <span>CLAIMED</span>
                  </div>
                ) : isComplete ? (
                  <button 
                    onClick={() => handleClaim(quest.id)}
                    className="duo-button px-4 py-2 text-xs font-black uppercase tracking-wider"
                  >
                    CLAIM!
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-[#37464F] rounded-xl flex items-center justify-center text-gray-500 text-xl">
                    🔒
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
