from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime

import models, schemas
from database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/user", response_model=schemas.User)
def get_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/courses", response_model=List[schemas.Course])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.get("/api/units", response_model=List[schemas.Unit])
def get_units(db: Session = Depends(get_db)):
    return db.query(models.Unit).all()

@app.get("/api/skills/{skill_id}/lessons", response_model=List[schemas.Lesson])
def get_lessons(skill_id: int, db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).filter(models.Lesson.skill_id == skill_id).all()
    return lessons

@app.get("/api/lessons/{lesson_id}/exercises", response_model=List[schemas.Exercise])
def get_exercises(lesson_id: int, db: Session = Depends(get_db)):
    exercises = db.query(models.Exercise).filter(models.Exercise.lesson_id == lesson_id).all()
    return exercises

@app.post("/api/user/progress")
def update_progress(progress: schemas.ProgressUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update XP & Daily XP
    user.xp += progress.xp_gained
    user.daily_xp += progress.xp_gained
    
    # Update Hearts
    user.hearts = max(0, user.hearts - progress.hearts_lost)
    
    # Streak Logic
    today = datetime.date.today()
    if user.last_activity_date < today:
        # Check if last activity was yesterday
        if user.last_activity_date == today - datetime.timedelta(days=1):
            user.streak += 1
        elif user.last_activity_date < today - datetime.timedelta(days=1):
            # Reset streak unless streak freeze is used
            if user.streak_freeze > 0:
                user.streak_freeze -= 1
            else:
                user.streak = 1
        user.last_activity_date = today

    # Update Leaderboard current user entry as well
    lb_user = db.query(models.LeaderboardUser).filter(models.LeaderboardUser.is_current_user == True).first()
    if lb_user:
        lb_user.xp = user.xp
        lb_user.streak = user.streak

    # Update Skill Progress
    if progress.xp_gained > 0 and progress.skill_id > 0:
        user_progress = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == user.id,
            models.UserProgress.skill_id == progress.skill_id
        ).first()
        
        if user_progress:
            user_progress.completed_lessons += 1
        else:
            user_progress = models.UserProgress(
                user_id=user.id,
                skill_id=progress.skill_id,
                completed_lessons=1
            )
            db.add(user_progress)
            
        lessons_in_skill = db.query(models.Lesson).filter(models.Lesson.skill_id == progress.skill_id).count()
        if lessons_in_skill > 0 and user_progress.completed_lessons >= lessons_in_skill:
            user_progress.is_completed = True

    db.commit()
    db.refresh(user)
    return {"message": "Progress updated successfully", "user": user}

@app.post("/api/user/refill-hearts")
def refill_hearts(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.gems >= 50:
        user.gems -= 50
        user.hearts = 5
        db.commit()
        return {"message": "Hearts refilled!", "hearts": user.hearts, "gems": user.gems}
    else:
        # Free practice refill
        user.hearts = 5
        db.commit()
        return {"message": "Hearts refilled via practice!", "hearts": user.hearts, "gems": user.gems}

@app.get("/api/leaderboard", response_model=List[schemas.LeaderboardUserSchema])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.LeaderboardUser).order_by(models.LeaderboardUser.xp.desc()).all()
    # Update ranks
    for index, u in enumerate(users):
        u.rank = index + 1
    db.commit()
    return users

@app.get("/api/quests")
def get_quests(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    daily_xp = user.daily_xp if user else 30
    return [
        {"id": 1, "title": "Earn 10 XP", "reward": 10, "current": min(10, daily_xp), "target": 10, "icon": "⚡", "claimed": True},
        {"id": 2, "title": "Earn 50 XP", "reward": 20, "current": min(50, daily_xp), "target": 50, "icon": "🎯", "claimed": daily_xp >= 50},
        {"id": 3, "title": "Complete 3 Lessons", "reward": 30, "current": 2, "target": 3, "icon": "📚", "claimed": False},
        {"id": 4, "title": "Maintain a 3-day Streak", "reward": 50, "current": user.streak if user else 3, "target": 3, "icon": "🔥", "claimed": True},
    ]

@app.get("/api/shop", response_model=List[schemas.ShopItemSchema])
def get_shop_items(db: Session = Depends(get_db)):
    return db.query(models.ShopItem).all()

@app.post("/api/shop/buy")
def buy_shop_item(request: schemas.BuyItemRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    item = db.query(models.ShopItem).filter(models.ShopItem.item_key == request.item_key).first()
    
    if not user or not item:
        raise HTTPException(status_code=404, detail="Item or user not found")
        
    if user.gems < item.cost:
        raise HTTPException(status_code=400, detail="Not enough gems")
        
    user.gems -= item.cost
    
    if item.item_key == "REFILL_HEARTS":
        user.hearts = 5
    elif item.item_key == "STREAK_FREEZE":
        user.streak_freeze += 1
        
@app.post("/api/user/reset")
def reset_progress(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if user:
        user.xp = 0
        user.streak = 1
        user.hearts = 5
        user.gems = 500
        user.daily_xp = 0
        user.streak_freeze = 1
        user.last_activity_date = datetime.date.today()
    
    # Reset all user progress
    db.query(models.UserProgress).delete()
    
    # Set Skill 1 as active/completed initial state
    skill1 = db.query(models.Skill).order_by(models.Skill.id.asc()).first()
    if user and skill1:
        prog = models.UserProgress(user_id=user.id, skill_id=skill1.id, completed_lessons=0, is_completed=False)
        db.add(prog)

    db.commit()
    return {"message": "All progress reset to clean starting state", "user": user}


