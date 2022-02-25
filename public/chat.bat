if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd "C:\Program Files\Google\Chrome\Application\chrome.exe"

start http://localhost:4000
goto :EOF
:minimized