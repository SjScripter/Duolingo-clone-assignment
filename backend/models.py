from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, JSON
from sqlalchemy.orm import relationship
import datetime

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    xp = Column(Integer, default=505)
    streak = Column(Integer, default=1)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    daily_goal = Column(Integer, default=50)
    daily_xp = Column(Integer, default=20)
    streak_freeze = Column(Integer, default=1)
    last_activity_date = Column(Date, default=datetime.date.today)
    
    progress = relationship("UserProgress", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    flag_code = Column(String)
    
    units = relationship("Unit", back_populates="course")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    description = Column(String)
    order = Column(Integer)
    color = Column(String, default="#58cc02")
    
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String)
    order = Column(Integer)
    icon = Column(String, default="star")
    total_lessons = Column(Integer, default=2)
    
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill")
    user_progress = relationship("UserProgress", back_populates="skill")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    title = Column(String, default="Lesson 1")
    order = Column(Integer)
    xp_reward = Column(Integer, default=10)
    
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String) # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_IN_BLANK, TYPE_ANSWER
    question = Column(String)
    options = Column(JSON, nullable=True) # Array of strings, dicts, or pair objects
    answer = Column(String) # Correct answer string or JSON string
    audio_text = Column(String, nullable=True)
    explanation = Column(String, nullable=True)
    
    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    completed_lessons = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="progress")
    skill = relationship("Skill", back_populates="user_progress")

class LeaderboardUser(Base):
    __tablename__ = "leaderboard_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    xp = Column(Integer)
    streak = Column(Integer)
    avatar = Column(String)
    rank = Column(Integer)
    is_current_user = Column(Boolean, default=False)

class ShopItem(Base):
    __tablename__ = "shop_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    cost = Column(Integer)
    icon = Column(String)
    item_key = Column(String)

