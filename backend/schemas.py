from pydantic import BaseModel
from typing import List, Optional, Any
import datetime

class ExerciseBase(BaseModel):
    type: str
    question: str
    options: Any = None
    answer: str
    audio_text: Optional[str] = None
    explanation: Optional[str] = None

class Exercise(ExerciseBase):
    id: int
    lesson_id: int
    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    title: str = "Lesson"
    order: int
    xp_reward: int

class Lesson(LessonBase):
    id: int
    skill_id: int
    exercises: List[Exercise] = []
    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    title: str
    order: int
    icon: str
    total_lessons: int = 2

class Skill(SkillBase):
    id: int
    unit_id: int
    lessons: List[Lesson] = []
    class Config:
        from_attributes = True

class UnitBase(BaseModel):
    title: str
    description: str
    order: int
    color: str

class Unit(UnitBase):
    id: int
    course_id: int
    skills: List[Skill] = []
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    flag_code: str

class Course(CourseBase):
    id: int
    units: List[Unit] = []
    class Config:
        from_attributes = True

class UserProgressBase(BaseModel):
    completed_lessons: int
    is_completed: bool

class UserProgress(UserProgressBase):
    id: int
    user_id: int
    skill_id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    xp: int
    streak: int
    hearts: int
    gems: int
    daily_goal: int = 50
    daily_xp: int = 20
    streak_freeze: int = 1
    last_activity_date: datetime.date

class User(UserBase):
    id: int
    progress: List[UserProgress] = []
    class Config:
        from_attributes = True

class LeaderboardUserSchema(BaseModel):
    id: int
    username: str
    xp: int
    streak: int
    avatar: str
    rank: int
    is_current_user: bool
    class Config:
        from_attributes = True

class ShopItemSchema(BaseModel):
    id: int
    title: str
    description: str
    cost: int
    icon: str
    item_key: str
    class Config:
        from_attributes = True

# Request schemas
class ProgressUpdate(BaseModel):
    xp_gained: int
    hearts_lost: int
    skill_id: int

class BuyItemRequest(BaseModel):
    item_key: str

