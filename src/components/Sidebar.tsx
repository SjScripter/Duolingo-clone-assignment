"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Headphones, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { 
      name: 'LEARN', 
      href: '/',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-2xl">
          🏠
        </div>
      )
    },
    { 
      name: 'LEADERBOARDS', 
      href: '/leaderboards',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-2xl">
          🛡️
        </div>
      )
    },
    { 
      name: 'QUESTS', 
      href: '/quests',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-2xl">
          🧰
        </div>
      )
    },
    { 
      name: 'SHOP', 
      href: '/shop',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-2xl">
          🏪
        </div>
      )
    },
    { 
      name: 'PROFILE', 
      href: '/profile',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-2xl">
          👤
        </div>
      )
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r-2 border-[#37464F] p-4 sticky top-0 bg-[#131F24] z-50">
      <Link href="/" className="text-[#58CC02] text-3xl font-black mb-8 pl-4 tracking-tighter hover:opacity-90 transition-opacity">
        duolingo
      </Link>
      <nav className="flex-1 flex flex-col space-y-2 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/lesson') && item.href === '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all
                ${
                  isActive
                    ? 'bg-[#1CB0F6]/15 text-[#1CB0F6] border-2 border-[#1CB0F6]'
                    : 'text-gray-300 hover:bg-[#202F36] hover:text-white border-2 border-transparent'
                }
              `}
            >
              <div>{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* MORE Button */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex w-full items-center space-x-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all border-2 border-transparent
              ${showMore ? 'bg-[#202F36] text-white' : 'text-gray-300 hover:bg-[#202F36] hover:text-white'}
            `}
          >
            <div className="w-8 h-8 rounded-full bg-[#CE82FF] text-white flex items-center justify-center text-xs font-black">
              •••
            </div>
            <span>MORE</span>
          </button>

          {/* MORE Popover Menu matching screenshots */}
          {showMore && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#202F36] border-2 border-[#37464F] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in duration-150">
              <div className="flex flex-col p-2 space-y-1 border-b-2 border-[#37464F]">
                <button className="flex items-center space-x-3 text-white font-black px-4 py-3 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  <div className="bg-[#58CC02] p-1.5 rounded-lg text-white font-black text-xs">
                    ✳️
                  </div>
                  <span>DUOLINGO ENGLISH TEST</span>
                </button>
                <button className="flex items-center space-x-3 text-white font-black px-4 py-3 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  <div className="text-xl">🌍</div>
                  <span>SCHOOLS</span>
                </button>
                <button className="flex items-center space-x-3 text-white font-black px-4 py-3 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  <div className="text-xl">🎧</div>
                  <span>PODCAST</span>
                </button>
              </div>

              <div className="flex flex-col p-2 space-y-1">
                <Link href="/profile" className="text-white font-black px-4 py-2.5 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  CREATE A PROFILE
                </Link>
                <button className="text-white font-black px-4 py-2.5 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  SETTINGS
                </button>
                <button className="text-white font-black px-4 py-2.5 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  HELP
                </button>
                <button className="text-white font-black px-4 py-2.5 hover:bg-[#37464F] rounded-xl transition-colors text-left uppercase text-xs tracking-wider">
                  SIGN IN
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
