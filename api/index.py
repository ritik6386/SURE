"""
Vercel Serverless Entrypoint for SURE FastAPI Backend
"""

import sys
import os

# Inject root project directory to Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app

# Vercel ASGI Handler
handler = app
