import os
import sys

# Add backend directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.main import app
