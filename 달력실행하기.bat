@echo off
chcp 65001 > nul
echo =========================================
echo 교육일정표 메이커를 시작합니다...
echo =========================================
echo.
echo 창이 켜지면 절대로 이 검은 창을 끄지 마세요!
echo 종료하시려면 창을 닫으시면 됩니다.
echo.
start http://localhost:5173
npm run dev
