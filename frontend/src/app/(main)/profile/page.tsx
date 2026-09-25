"use client";

import { useEffect, useState } from 'react';
import { fetchUserStats, UserStats } from '@/utils/api';
import { User, Flame, Zap, Shield, Award, Calendar, BookOpen, Star } from 'lucide-react';

export default function ProfilePage() {
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

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchUserStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      {/* Profile Header */}
      <div className="w-full bg-[#202F36] border-2 border-[#37464F] rounded-3xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 shadow-md">
        <div className="w-24 h-24 bg-[#131F24] border-4 border-[#58CC02] rounded-3xl flex items-center justify-center text-5xl shadow-inner">
          ⭐
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-white text-3xl font-black">{stats.username}</h1>
          <p className="text-gray-400 font-bold text-sm flex items-center justify-center sm:justify-start space-x-1.5">
            <Calendar size={16} />
            <span>Joined September 2026</span>
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
            <span className="text-xs bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/40 font-black px-3 py-1 rounded-full uppercase">
              🇪🇸 Spanish Learner
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="w-full mb-8">
        <h2 className="text-white text-xl font-black mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <span className="text-3xl">🔥</span>
            <div>
              <span className="text-white font-black text-xl block">{stats.streak}</span>
              <span className="text-gray-400 font-bold text-xs">Day streak</span>
            </div>
          </div>

          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <span className="text-3xl">⚡</span>
            <div>
              <span className="text-white font-black text-xl block">{stats.xp}</span>
              <span className="text-gray-400 font-bold text-xs">Total XP</span>
            </div>
          </div>

          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <span className="text-3xl">🛡️</span>
            <div>
              <span className="text-white font-black text-xl block">Bronze</span>
              <span className="text-gray-400 font-bold text-xs">Current League</span>
            </div>
          </div>

          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <span className="text-3xl">💎</span>
            <div>
              <span className="text-white font-black text-xl block">{stats.gems}</span>
              <span className="text-gray-400 font-bold text-xs">Gems</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="w-full">
        <h2 className="text-white text-xl font-black mb-4">Achievements</h2>
        <div className="space-y-4">
          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#FFC800]/20 border-2 border-[#FFC800] rounded-2xl flex items-center justify-center text-3xl">
              🔥
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-base">Wildfire</h3>
              <p className="text-gray-400 text-xs font-semibold">Reach a 3-day streak</p>
            </div>
            <span className="text-[#58CC02] font-black text-xs uppercase">COMPLETED</span>
          </div>

          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#1CB0F6]/20 border-2 border-[#1CB0F6] rounded-2xl flex items-center justify-center text-3xl">
              🎓
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-base">Sage</h3>
              <p className="text-gray-400 text-xs font-semibold">Earn 500 XP in total</p>
            </div>
            <span className="text-[#58CC02] font-black text-xs uppercase">COMPLETED</span>
          </div>

          <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#CE82FF]/20 border-2 border-[#CE82FF] rounded-2xl flex items-center justify-center text-3xl">
              👑
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-base">Champion</h3>
              <p className="text-gray-400 text-xs font-semibold">Finish #1 in your league</p>
            </div>
            <span className="text-gray-500 font-black text-xs uppercase">IN PROGRESS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
