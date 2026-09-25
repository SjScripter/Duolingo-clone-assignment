from database import SessionLocal, engine
import models
import datetime

def seed_db():
    # Force recreate or clear for clean seed
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Seeding Duolingo database with 5 Sections and 24 Units starting FRESH...")

    # 1. Seed Main User starting FRESH
    user = models.User(
        username="Learner",
        xp=0,
        streak=1,
        hearts=5,
        gems=500,
        daily_goal=50,
        daily_xp=0,
        streak_freeze=1,
        last_activity_date=datetime.date.today()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Seed Spanish Course
    course = models.Course(title="Spanish", flag_code="es")
    db.add(course)
    db.commit()
    db.refresh(course)

    # 3. Seed Units across 5 Sections
    units_data = [
        # Section 1: Rookie (A1)
        {"id": 1, "title": "Order at a café", "description": "SECTION 1, UNIT 1", "order": 1, "color": "#58CC02"},
        {"id": 2, "title": "Greet people and say goodbye", "description": "SECTION 1, UNIT 2", "order": 2, "color": "#CE82FF"},
        {"id": 3, "title": "Say where you are from", "description": "SECTION 1, UNIT 3", "order": 3, "color": "#00CD9C"},
        {"id": 4, "title": "Get around in a city", "description": "SECTION 1, UNIT 4", "order": 4, "color": "#1CB0F6"},
        {"id": 5, "title": "Order food and drinks", "description": "SECTION 1, UNIT 5", "order": 5, "color": "#FFC800"},
        {"id": 6, "title": "Talk about family", "description": "SECTION 1, UNIT 6", "order": 6, "color": "#E55B8F"},
        {"id": 7, "title": "Describe your home", "description": "SECTION 1, UNIT 7", "order": 7, "color": "#FF9600"},
        {"id": 8, "title": "Section 1 Review & Champion", "description": "SECTION 1, UNIT 8", "order": 8, "color": "#FFC800"},

        # Section 2: Explorer (A1)
        {"id": 9, "title": "Form basic sentences", "description": "SECTION 2, UNIT 1", "order": 9, "color": "#CE82FF"},
        {"id": 10, "title": "Describe daily routines", "description": "SECTION 2, UNIT 2", "order": 10, "color": "#1CB0F6"},
        {"id": 11, "title": "Shop for clothes", "description": "SECTION 2, UNIT 3", "order": 11, "color": "#00CD9C"},
        {"id": 12, "title": "Talk about hobbies", "description": "SECTION 2, UNIT 4", "order": 12, "color": "#58CC02"},
        {"id": 13, "title": "Discuss weather and plans", "description": "SECTION 2, UNIT 5", "order": 13, "color": "#FF9600"},
        {"id": 14, "title": "Section 2 Review", "description": "SECTION 2, UNIT 6", "order": 14, "color": "#FFC800"},

        # Section 3: Traveler (A2)
        {"id": 15, "title": "Ask for directions in town", "description": "SECTION 3, UNIT 1", "order": 15, "color": "#00CD9C"},
        {"id": 16, "title": "Book hotel rooms", "description": "SECTION 3, UNIT 2", "order": 16, "color": "#1CB0F6"},
        {"id": 17, "title": "Express past experiences", "description": "SECTION 3, UNIT 3", "order": 17, "color": "#CE82FF"},
        {"id": 18, "title": "Section 3 Review", "description": "SECTION 3, UNIT 4", "order": 18, "color": "#FFC800"},

        # Section 4: Speaker (A2)
        {"id": 19, "title": "Discuss work and careers", "description": "SECTION 4, UNIT 1", "order": 19, "color": "#1CB0F6"},
        {"id": 20, "title": "Express opinions and feelings", "description": "SECTION 4, UNIT 2", "order": 20, "color": "#CE82FF"},
        {"id": 21, "title": "Section 4 Review", "description": "SECTION 4, UNIT 3", "order": 21, "color": "#FFC800"},

        # Section 5: Advanced (B1)
        {"id": 22, "title": "Debate current events", "description": "SECTION 5, UNIT 1", "order": 22, "color": "#E55B8F"},
        {"id": 23, "title": "Master complex storytelling", "description": "SECTION 5, UNIT 2", "order": 23, "color": "#00CD9C"},
        {"id": 24, "title": "Section 5 Champion Trophy", "description": "SECTION 5, UNIT 3", "order": 24, "color": "#FFC800"},
    ]

    units_objs = []
    for u in units_data:
        unit_obj = models.Unit(
            course_id=course.id,
            title=u["title"],
            description=u["description"],
            order=u["order"],
            color=u["color"]
        )
        units_objs.append(unit_obj)
    db.add_all(units_objs)
    db.commit()

    # 4. Seed Skills across all Units
    skills_objs = []
    skill_counter = 1
    for unit_obj in units_objs:
        s1 = models.Skill(unit_id=unit_obj.id, title=f"{unit_obj.title} Part 1", order=1, icon="star", total_lessons=3)
        s2 = models.Skill(unit_id=unit_obj.id, title=f"{unit_obj.title} Part 2", order=2, icon="star", total_lessons=3)
        s3 = models.Skill(unit_id=unit_obj.id, title="Chest", order=3, icon="chest", total_lessons=1)
        s4 = models.Skill(unit_id=unit_obj.id, title="Listening Practice", order=4, icon="headphones", total_lessons=3)
        s5 = models.Skill(unit_id=unit_obj.id, title=f"{unit_obj.title} Review", order=5, icon="star", total_lessons=3)
        s6 = models.Skill(unit_id=unit_obj.id, title="Trophy", order=6, icon="trophy", total_lessons=1)
        skills_objs.extend([s1, s2, s3, s4, s5, s6])
    
    db.add_all(skills_objs)
    db.commit()

    # 5. User Progress (Fresh state: Skill 1 is active, 0 completed)
    progress1 = models.UserProgress(user_id=user.id, skill_id=skills_objs[0].id, completed_lessons=0, is_completed=False)
    db.add(progress1)
    db.commit()

    # 6. Seed Lessons & Exercises for Skill 1 Lesson 1
    first_skill = skills_objs[0]
    s1_l1 = models.Lesson(skill_id=first_skill.id, title="Basic Coffee Ordering", order=1, xp_reward=10)
    s1_l2 = models.Lesson(skill_id=first_skill.id, title="Café Vocabulary", order=2, xp_reward=10)
    db.add_all([s1_l1, s1_l2])
    db.commit()

    ex1 = models.Exercise(
        lesson_id=s1_l1.id,
        type="TRANSLATE",
        question="The boy drinks water",
        options=["El", "niño", "bebe", "agua", "la", "manzana", "como", "mujer"],
        answer="El niño bebe agua",
        audio_text="El niño bebe agua",
        explanation="In Spanish, 'bebe' means drinks and 'agua' means water."
    )

    ex2 = models.Exercise(
        lesson_id=s1_l1.id,
        type="MULTIPLE_CHOICE",
        question="Which of these is 'the apple'?",
        options=[
            {"text": "la manzana", "subtext": "the apple", "icon": "🍎"},
            {"text": "el pan", "subtext": "the bread", "icon": "🍞"},
            {"text": "la leche", "subtext": "the milk", "icon": "🥛"},
            {"text": "el agua", "subtext": "the water", "icon": "💧"}
        ],
        answer="la manzana",
        audio_text="la manzana",
        explanation="'Manzana' is a feminine noun in Spanish (la manzana)."
    )

    ex3 = models.Exercise(
        lesson_id=s1_l1.id,
        type="MATCH_PAIRS",
        question="Tap the matching pairs",
        options=[
            {"left": "boy", "right": "niño"},
            {"left": "woman", "right": "mujer"},
            {"left": "water", "right": "agua"},
            {"left": "apple", "right": "manzana"}
        ],
        answer="MATCH_ALL",
        audio_text=None,
        explanation="Great job matching the vocabulary!"
    )

    ex4 = models.Exercise(
        lesson_id=s1_l1.id,
        type="FILL_IN_BLANK",
        question="Yo ____ una manzana",
        options=["como", "bebo", "hablo", "soy"],
        answer="como",
        audio_text="Yo como una manzana",
        explanation="'Como' comes from the verb 'comer' (to eat) for 'Yo' (I)."
    )

    ex5 = models.Exercise(
        lesson_id=s1_l1.id,
        type="TYPE_ANSWER",
        question="Translate 'Hello' to Spanish",
        options=[],
        answer="Hola",
        audio_text="Hola",
        explanation="'Hola' is the universal greeting for hello in Spanish."
    )

    db.add_all([ex1, ex2, ex3, ex4, ex5])
    db.commit()

    # 7. Seed Leaderboard Users
    lb_users = [
        models.LeaderboardUser(username="Bea", xp=920, streak=12, avatar="🦉", rank=1),
        models.LeaderboardUser(username="Oscar", xp=750, streak=8, avatar="🦊", rank=2),
        models.LeaderboardUser(username="Learner", xp=0, streak=1, avatar="⭐", rank=3, is_current_user=True),
        models.LeaderboardUser(username="Lin", xp=480, streak=5, avatar="🐼", rank=4),
        models.LeaderboardUser(username="Vikram", xp=350, streak=2, avatar="🐯", rank=5),
        models.LeaderboardUser(username="DuoFan", xp=210, streak=1, avatar="🐸", rank=6),
    ]
    db.add_all(lb_users)
    db.commit()

    # 8. Seed Shop Items
    shop_items = [
        models.ShopItem(
            title="Refill Hearts",
            description="Get full hearts so you can worry less about making mistakes in lessons!",
            cost=50,
            icon="❤️",
            item_key="REFILL_HEARTS"
        ),
        models.ShopItem(
            title="Streak Freeze",
            description="Streak Freeze allows your streak to remain intact for one day of inactivity.",
            cost=200,
            icon="🧊",
            item_key="STREAK_FREEZE"
        ),
        models.ShopItem(
            title="Super Duolingo",
            description="Unlimited hearts, zero ads, and personalized practice sessions!",
            cost=1000,
            icon="💎",
            item_key="SUPER_DUO"
        ),
    ]
    db.add_all(shop_items)
    db.commit()

    print(f"Database successfully seeded with 5 Sections and {len(units_objs)} Units starting FRESH!")

if __name__ == "__main__":
    seed_db()



