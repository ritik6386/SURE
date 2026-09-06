"""
SAARTHI / SURE Platform Runner
Launches the FastAPI application serving both backend API and React Web Dashboard.
"""

import os
import sys
import subprocess

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(base_dir, ".venv", "Scripts", "python.exe")
    
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print("=" * 65)
    print("  SURE — Standards for Unified Regulatory Engine")
    print("  AI-Powered BIS Standards Platform for Smart Public Procurement")
    print("=" * 65)
    print("  Web Dashboard: http://localhost:8000")
    print("  API Docs:      http://localhost:8000/docs")
    print("  Evaluate:      http://localhost:8000/api/evaluate")
    print("=" * 65)
    print("Starting server on http://localhost:8000 ... (Press Ctrl+C to stop)")

    cmd = [venv_python, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
    try:
        subprocess.run(cmd, cwd=base_dir)
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    main()
