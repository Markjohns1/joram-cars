@echo off
echo ========================================
echo   Joram Cars - Development Server
echo ========================================
echo.

:: Start backend in a new window
echo Starting Backend (FastAPI)...
start "Joram Cars Backend" cmd /k "cd /d %~dp0backend && python -m venv venv 2>nul & call venv\Scripts\activate & pip install -r requirements.txt & uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a bit for backend to start
timeout /t 5 /nobreak > nul

:: Start frontend in a new window
echo Starting Frontend (Vite)...
start "Joram Cars Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait a bit for frontend to start
timeout /t 3 /nobreak > nul

:: Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo ========================================
echo   Servers started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
