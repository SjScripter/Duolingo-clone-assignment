import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

if os.environ.get("VERCEL") or os.path.exists("/tmp"):
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
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./duolingo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

