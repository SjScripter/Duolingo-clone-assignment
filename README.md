# Duolingo Web App Clone

A fullstack functional clone of the Duolingo web application, built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite**. It replicates Duolingo's iconic playful UI, learning path tree, 5 interactive exercise types, gamification mechanics (XP, daily streak, hearts, gems, leaderboards), and sound synthesis.

---

## 🚀 Key Features

### 1. Visual Learning Path (Skill Tree)
- Interactive unit path (`Order at a café`, `Ask for directions`) with unlocked, active, and completed skill nodes.
- Animated progress ring around active skills.
- Tooltip popovers to inspect lesson status and launch lessons.
- Floating animated **Duo Mascot** with interactive speech bubble & Web Speech API TTS.
- Top bar tracking **Streak (🔥)**, **Gems (💎)**, **Hearts (❤️)**, and **Course Flag (🇪🇸)**.

### 2. Lesson Player (Core Loop)
- Interactive sequence of exercises supporting **5 distinct exercise types**:
  1. **Translate (Word Bank / Tap-the-words)**: Tap word tiles to construct target sentence.
  2. **Multiple Choice**: Choice cards with icons and subtext descriptions.
  3. **Match Pairs**: Tap English and Spanish vocabulary pairs to match.
  4. **Fill in the Blank**: Complete Spanish sentences with choice tiles.
  5. **Type the Answer**: Text input with instant feedback.
- **Immediate Audio & Visual Feedback**: Signature green (correct) / red (incorrect) floating bottom drawer with explanations.
- **Audio & Speech (TTS)**: Web Speech API pronounces Spanish words aloud when exercises load or speaker icon is clicked.
- **Web Audio Sound Synthesizer**: Custom two-tone chord for correct answers, error buzz for wrong answers, and victory fanfare chime.
- **Hearts System**: Deducts 1 heart on error. Shows "Out of Hearts" modal with option to refill for 50 gems or practice.
- **Lesson Complete Screen**: Confetti animation (`canvas-confetti`), XP summary (+15 XP), accuracy breakdown, and progress persistence.

### 3. Gamification & Persistence
- **Leaderboards**: Ranked league standings (Bronze League) with active user highlighting.
- **Daily Quests**: Interactive quest progress bars with gem claim rewards.
- **Shop**: Spend gems to refill hearts or buy Streak Freezes.
- **Learner Profile**: View total XP, day streak, course details, and achievement badges (Wildfire, Sage, Champion).

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Lucide Icons, Canvas Confetti, Web Audio API, Web Speech API
- **Backend**: Python 3.12, FastAPI, SQLAlchemy
- **Database**: SQLite (`duolingo.db`)

---

## 🗄️ Database Schema (SQLite)

- **`User`**: Tracks `id`, `username`, `xp`, `streak`, `hearts`, `gems`, `daily_goal`, `daily_xp`, `streak_freeze`, `last_activity_date`.
- **`Course`**: `id`, `title`, `flag_code`.
- **`Unit`**: `id`, `course_id`, `title`, `description`, `order`, `color`.
- **`Skill`**: `id`, `unit_id`, `title`, `order`, `icon`, `total_lessons`.
- **`Lesson`**: `id`, `skill_id`, `title`, `order`, `xp_reward`.
- **`Exercise`**: `id`, `lesson_id`, `type` (`TRANSLATE`, `MULTIPLE_CHOICE`, `MATCH_PAIRS`, `FILL_IN_BLANK`, `TYPE_ANSWER`), `question`, `options` (JSON), `answer`, `audio_text`, `explanation`.
- **`UserProgress`**: `id`, `user_id`, `skill_id`, `completed_lessons`, `is_completed`.
- **`LeaderboardUser`**: `id`, `username`, `xp`, `streak`, `avatar`, `rank`, `is_current_user`.
- **`ShopItem`**: `id`, `title`, `description`, `cost`, `icon`, `item_key`.

---

## 📡 Backend API Endpoints

- `GET /api/user` - Fetch active user stats & progress
- `GET /api/units` - Fetch units with nested skills, lessons & exercises
- `GET /api/lessons/{id}/exercises` - Fetch exercise list for a lesson
- `POST /api/user/progress` - Submit lesson completion (XP, hearts lost, streak update)
- `POST /api/user/refill-hearts` - Refill hearts (via 50 gems or practice)
- `GET /api/leaderboard` - Fetch ranked league users
- `GET /api/quests` - Fetch daily quests progress
- `GET /api/shop` - Fetch shop items
- `POST /api/shop/buy` - Purchase item with gems

---

## ⚙️ Setup & Execution Instructions

### 1. Start the FastAPI Backend

```bash
cd backend

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Seed Database (Optional - DB is already seeded)
python seed.py

# Launch FastAPI Server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

### 2. Start the Next.js Frontend

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Run Development Server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 📝 Assumptions Made

1. A default logged-in learner (`Learner`) is assumed as per assignment instructions.
2. Web Audio API and Web Speech API are used natively to provide rich sound effects without external MP3 asset dependency.
3. Spanish (`es`) course with multiple units, skills, and exercises is seeded by default.
