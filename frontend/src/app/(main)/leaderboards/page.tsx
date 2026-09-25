"use client";

import { useEffect, useState } from 'react';
import { fetchLeaderboardAPI, LeaderboardUser } from '@/utils/api';
import { Shield, Flame, Trophy, Award } from 'lucide-react';

export default function LeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { id: 1, username: "Bea", xp: 920, streak: 12, avatar: "🦉", rank: 1, is_current_user: false },
    { id: 2, username: "Oscar", xp: 750, streak: 8, avatar: "🦊", rank: 2, is_current_user: false },
    { id: 3, username: "Learner", xp: 505, streak: 3, avatar: "⭐", rank: 3, is_current_user: true },
    { id: 4, username: "Lin", xp: 480, streak: 5, avatar: "🐼", rank: 4, is_current_user: false },
    { id: 5, username: "Vikram", xp: 350, streak: 2, avatar: "🐯", rank: 5, is_current_user: false },
    { id: 6, username: "DuoFan", xp: 210, streak: 1, avatar: "🐸", rank: 6, is_current_user: false },
  ]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await fetchLeaderboardAPI();
      if (data && data.length > 0) {
        setLeaderboard(data);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      {/* Header Banner */}
      <div className="w-full flex flex-col items-center mb-8 border-b-2 border-[#37464F] pb-8 text-center">
        <div className="w-24 h-24 mb-4 flex items-center justify-center bg-[#FFC800]/20 rounded-full border-4 border-[#FFC800] text-5xl shadow-xl">
          🛡️
        </div>
        <h1 className="text-white text-3xl font-black mb-2">Bronze League</h1>
        <p className="text-gray-400 font-bold text-sm">Top 5 learners advance to Silver League this week!</p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full space-y-3">
        {leaderboard.map((user) => {
          const isTop3 = user.rank <= 3;
          const rankColor = 
            user.rank === 1 ? 'text-[#FFC800]' : 
            user.rank === 2 ? 'text-[#E5E5E5]' : 
            user.rank === 3 ? 'text-[#CD7F32]' : 'text-gray-400';

          return (
            <div 
              key={user.id} 
              className={`
                flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all
                ${user.is_current_user 
                  ? 'bg-[#1CB0F6]/15 border-[#1CB0F6] scale-102 shadow-md' 
                  : 'bg-[#202F36] border-[#37464F] hover:bg-[#202F36]/80'}
              `}
            >
              {/* Rank Number */}
              <div className={`w-8 font-black text-xl text-center ${rankColor}`}>
                {user.rank}
              </div>

              {/* User Avatar */}
              <div className="w-12 h-12 bg-[#131F24] border-2 border-[#37464F] rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                {user.avatar}
              </div>

              {/* Username & Streak */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-black text-base">{user.username}</span>
                  {user.is_current_user && (
                    <span className="bg-[#1CB0F6] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">YOU</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-gray-400">
                  <span>🔥 {user.streak} day streak</span>
                </div>
              </div>

              {/* XP Badge */}
              <div className="text-right">
                <span className="text-white font-black text-lg block">{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
