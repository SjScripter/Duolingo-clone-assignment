"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUserStats, refillHeartsAPI, UserStats } from '@/utils/api';
import { Heart, Zap, Flame, Gem } from 'lucide-react';

export default function RightSidebar() {
  const [stats, setStats] = useState<UserStats>({
    id: 1,
    username: "Learner",
    xp: 505,
    streak: 3,
    hearts: 5,
    gems: 500,
    daily_goal: 50,
    daily_xp: 30,
    streak_freeze: 1
  });
  const [isRefilling, setIsRefilling] = useState(false);

  const loadStats = async () => {
    const data = await fetchUserStats();
    if (data) {
      setStats(data);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefillHearts = async () => {
    setIsRefilling(true);
    await refillHeartsAPI();
    await loadStats();
    setIsRefilling(false);
  };

  return (
    <div className="hidden lg:flex flex-col w-[350px] h-screen pt-6 px-4 sticky top-0 space-y-6 overflow-y-auto overflow-x-hidden pb-10 border-l-2 border-transparent">
      
      {/* Top Bar Stats */}
      <div className="flex justify-between items-center px-2 py-2 font-bold text-white mb-2 bg-[#202F36] rounded-2xl border-2 border-[#37464F]">
        <div className="flex items-center space-x-1.5 px-2 py-1 hover:bg-[#37464F] rounded-xl cursor-pointer">
          <span className="text-xl">🇪🇸</span>
          <span className="text-sm text-gray-300">ES</span>
        </div>
        
        <div className="flex items-center space-x-1.5 text-duo-yellow px-2 py-1 hover:bg-[#37464F] rounded-xl cursor-pointer" title="Streak Days">
          <span className="text-xl">🔥</span>
          <span className="text-sm font-black">{stats.streak}</span>
        </div>
        
        <div className="flex items-center space-x-1.5 text-duo-blue px-2 py-1 hover:bg-[#37464F] rounded-xl cursor-pointer" title="Gems">
          <span className="text-xl">💎</span>
          <span className="text-sm font-black">{stats.gems}</span>
        </div>
        
        <div 
          onClick={handleRefillHearts}
          className="flex items-center space-x-1.5 text-duo-red px-2 py-1 hover:bg-[#37464F] rounded-xl cursor-pointer transition-transform hover:scale-105" 
          title="Hearts (Click to Refill)"
        >
          <span className="text-xl">❤️</span>
          <span className="text-sm font-black">{stats.hearts}</span>
        </div>
      </div>

      {/* Hearts Low Warning / Refill Card */}
      {stats.hearts < 5 && (
        <div className="border-2 border-duo-red/40 bg-duo-red/10 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💔</span>
            <div>
              <h3 className="font-bold text-white text-sm">Need Hearts?</h3>
              <p className="text-gray-300 text-xs">Refill for 50 gems or practice</p>
            </div>
          </div>
          <button 
            onClick={handleRefillHearts}
            disabled={isRefilling}
            className="duo-button w-full py-2 text-xs flex items-center justify-center space-x-2"
          >
            <span>{isRefilling ? "Refilling..." : "REFILL HEARTS (50 💎)"}</span>
          </button>
        </div>
      )}

      {/* Unlock Leaderboards */}
      <div className="border-2 border-duo-border rounded-2xl p-4 flex flex-col space-y-4 relative bg-[#1C2C35]/50">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-[15px]">Leaderboard Standing</h3>
          <Link href="/leaderboards" className="text-duo-blue text-xs font-bold uppercase hover:underline">View League</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 flex items-center justify-center text-3xl bg-[#FFC800]/20 rounded-2xl border-2 border-[#FFC800]">
            🛡️
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm">Bronze League</h4>
            <p className="text-gray-400 text-xs leading-tight">
              Rank #3 • {stats.xp} Total XP
            </p>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="border-2 border-duo-border rounded-2xl p-4 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-[15px]">Daily Quests</h3>
          <Link href="/quests" className="text-duo-blue font-bold text-xs uppercase tracking-wider hover:text-[#84D8FF]">
            View all
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-3xl text-duo-yellow w-10 flex justify-center">⚡</div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1.5">Earn {stats.daily_goal} XP</h4>
            <div className="w-full bg-[#37464F] h-3.5 rounded-full relative overflow-hidden">
              <div 
                className="bg-duo-yellow h-full absolute top-0 left-0 transition-all duration-500" 
                style={{ width: `${Math.min(100, (stats.daily_xp / stats.daily_goal) * 100)}%` }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-black">
                {stats.daily_xp} / {stats.daily_goal} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Super Duolingo Promotion */}
      <div className="border-2 border-[#CE82FF]/40 bg-gradient-to-br from-[#CE82FF]/20 to-transparent rounded-2xl p-4 flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">✨</span>
          <div>
            <h3 className="font-bold text-white text-sm">Try Super for Free</h3>
            <p className="text-gray-300 text-xs">No ads, unlimited hearts</p>
          </div>
        </div>
        <Link href="/shop">
          <button className="w-full py-2.5 text-xs rounded-xl font-bold bg-[#CE82FF] text-white border-b-4 border-[#a34ee6] hover:bg-[#b863ed] transition-colors uppercase tracking-wider">
            TRY 2 WEEKS FREE
          </button>
        </Link>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-4">
        <a href="#" className="text-[#52656D] font-bold text-xs uppercase tracking-widest hover:text-gray-400">About</a>
        <a href="#" className="text-[#52656D] font-bold text-xs uppercase tracking-widest hover:text-gray-400">Blog</a>
        <a href="#" className="text-[#52656D] font-bold text-xs uppercase tracking-widest hover:text-gray-400">Store</a>
        <a href="#" className="text-[#52656D] font-bold text-xs uppercase tracking-widest hover:text-gray-400">Terms</a>
        <a href="#" className="text-[#52656D] font-bold text-xs uppercase tracking-widest hover:text-gray-400">Privacy</a>
      </div>

    </div>
  );
}

