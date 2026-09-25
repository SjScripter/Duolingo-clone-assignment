const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
    return '/api';
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();


export interface UserStats {
  id: number;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  daily_xp: number;
  streak_freeze: number;
}

export interface Skill {
  id: number;
  unit_id: number;
  title: string;
  order: number;
  icon: string;
  total_lessons: number;
}

export interface Unit {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  color: string;
  skills: Skill[];
}

export interface Exercise {
  id: number;
  lesson_id: number;
  type: 'TRANSLATE' | 'MULTIPLE_CHOICE' | 'MATCH_PAIRS' | 'FILL_IN_BLANK' | 'TYPE_ANSWER';
  question: string;
  options: any;
  answer: string;
  audio_text?: string;
  explanation?: string;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  xp: number;
  streak: number;
  avatar: string;
  rank: number;
  is_current_user: boolean;
}

export interface ShopItem {
  id: number;
  title: string;
  description: string;
  cost: number;
  icon: string;
  item_key: string;
}

export const fetchUserStats = async (): Promise<UserStats | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/user`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using local state", e);
    return null;
  }
};

export const fetchUnits = async (): Promise<Unit[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/units`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using fallback units", e);
    return [];
  }
};

export const fetchLessonExercises = async (lessonId: number): Promise<Exercise[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/exercises`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using fallback exercises", e);
    return [];
  }
};

export const updateUserProgress = async (xpGained: number, heartsLost: number, skillId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        xp_gained: xpGained,
        hearts_lost: heartsLost,
        skill_id: skillId
      })
    });
    return await res.json();
  } catch (e) {
    console.warn("Failed to submit progress to backend API", e);
    return null;
  }
};

export const refillHeartsAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/refill-hearts`, {
      method: 'POST'
    });
    return await res.json();
  } catch (e) {
    console.warn("Failed to refill hearts API", e);
    return null;
  }
};

export const fetchLeaderboardAPI = async (): Promise<LeaderboardUser[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/leaderboard`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
};

export const fetchQuestsAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/quests`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
};

export const fetchShopItemsAPI = async (): Promise<ShopItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/shop`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
};

export const buyShopItemAPI = async (itemKey: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/shop/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_key: itemKey })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const resetUserProgressAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/reset`, {
      method: 'POST'
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

