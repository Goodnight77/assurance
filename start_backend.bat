@echo off
echo ==========================================
echo  🤖 BH ASSURANCE - AI BACKEND SIMULATOR
echo ==========================================
echo.
echo Installing Python dependencies...
pip install -r requirements_fake_backend.txt
echo.
echo Starting fake AI backend server...
echo Press Ctrl+C to stop the server
echo.
python fake_backend_server.py
pause