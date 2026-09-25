import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DATABASE_URL")

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
elif os.environ.get("VERCEL") or os.path.exists("/tmp"):
    db_path = "/tmp/duolingo.db"
    src = os.path.join(os.path.dirname(__file__), "duolingo.db")
    if not os.path.exists(db_path) and os.path.exists(src):
        import shutil
        try:
            shutil.copyfile(src, db_path)
        except Exception:
            pass
    if os.path.exists(db_path):
        SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"
    else:
        SQLALCHEMY_DATABASE_URL = f"sqlite:///{src}"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./duolingo.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

