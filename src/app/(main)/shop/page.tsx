"use client";

import { useEffect, useState } from 'react';
import { buyShopItemAPI, fetchShopItemsAPI, fetchUserStats, ShopItem, UserStats } from '@/utils/api';
import { Store, Gem, Heart, Shield, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: 1,
      title: "Refill Hearts",
      description: "Get full hearts so you can worry less about making mistakes in lessons!",
      cost: 50,
      icon: "❤️",
      item_key: "REFILL_HEARTS"
    },
    {
      id: 2,
      title: "Streak Freeze",
      description: "Streak Freeze allows your streak to remain intact for one day of inactivity.",
      cost: 200,
      icon: "🧊",
      item_key: "STREAK_FREEZE"
    },
    {
      id: 3,
      title: "Super Duolingo",
      description: "Unlimited hearts, zero ads, and personalized practice sessions!",
      cost: 1000,
      icon: "💎",
      item_key: "SUPER_DUO"
    },
  ]);
  const [buyingKey, setBuyingKey] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = async () => {
    const sData = await fetchUserStats();
    if (sData) setStats(sData);

    const iData = await fetchShopItemsAPI();
    if (iData && iData.length > 0) setItems(iData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBuy = async (itemKey: string) => {
    setBuyingKey(itemKey);
    setMsg(null);

    const res = await buyShopItemAPI(itemKey);
    if (res && res.message) {
      setMsg(res.message);
      await loadData();
    } else {
      setMsg("Need more gems!");
    }
    setBuyingKey(null);
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full max-w-2xl mx-auto px-4">
      {/* Header Banner */}
      <div className="w-full flex flex-col items-center mb-8 border-b-2 border-[#37464F] pb-8 text-center">
        <div className="w-24 h-24 mb-4 flex items-center justify-center bg-[#1CB0F6]/20 rounded-full border-4 border-[#1CB0F6] text-5xl shadow-xl">
          🏪
        </div>
        <h1 className="text-white text-3xl font-black mb-2">Duolingo Shop</h1>
        <div className="flex items-center space-x-2 text-[#1CB0F6] font-black text-xl mt-1">
          <span>💎</span>
          <span>{stats ? stats.gems : 500} Gems Available</span>
        </div>
      </div>

      {msg && (
        <div className="w-full bg-[#1CB0F6]/20 border-2 border-[#1CB0F6] text-[#1CB0F6] font-bold p-3.5 rounded-2xl mb-6 text-center text-sm">
          {msg}
        </div>
      )}

      {/* Shop Items List */}
      <div className="w-full space-y-4">
        {items.map((item) => {
          const canAfford = (stats?.gems || 500) >= item.cost;

          return (
            <div 
              key={item.id}
              className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-5 flex items-center space-x-5 shadow-sm"
            >
              {/* Item Icon */}
              <div className="text-5xl w-14 flex justify-center">{item.icon}</div>

              {/* Item Info */}
              <div className="flex-1">
                <h3 className="text-white font-black text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 font-semibold text-xs leading-relaxed">{item.description}</p>
              </div>

              {/* Purchase Button */}
              <div>
                <button
                  onClick={() => handleBuy(item.item_key)}
                  disabled={buyingKey === item.item_key}
                  className={`
                    px-5 py-3 rounded-xl font-black uppercase text-sm transition-all flex items-center space-x-1.5
                    ${canAfford ? 'duo-button' : 'bg-[#37464F] text-gray-400 cursor-not-allowed opacity-60'}
                  `}
                >
                  <span>{buyingKey === item.item_key ? 'BUYING...' : `${item.cost}`}</span>
                  <span>💎</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
