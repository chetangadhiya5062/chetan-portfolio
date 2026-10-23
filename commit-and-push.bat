@echo off
setlocal
rem Double-click to commit everything and push the agent-v1 branch.
rem The commit is made with the git name and email already configured on this computer.

cd /d "%~dp0"
set BRANCH=agent-v1

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo This folder is not a git repository.
  pause
  exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set CURRENT=%%b
if /i "%CURRENT%"=="master" goto wrongbranch
if /i "%CURRENT%"=="main" goto wrongbranch
if /i not "%CURRENT%"=="%BRANCH%" (
  echo You are on "%CURRENT%". Switching to %BRANCH%...
  git switch %BRANCH%
  if errorlevel 1 (
    echo Could not switch to %BRANCH%.
    pause
    exit /b 1
  )
)

echo.
echo Committing as:
for /f "delims=" %%n in ('git config user.name') do echo   %%n
for /f "delims=" %%e in ('git config user.email') do echo   %%e
echo.
git status --short
echo.

set "MSG="
set /p MSG=Commit message (press Enter for "update portfolio"): 
if "%MSG%"=="" set "MSG=update portfolio"

git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo Nothing new to commit.
  goto push
)
git commit -m "%MSG%"
if errorlevel 1 (
  echo Commit failed.
  pause
  exit /b 1
)

:push
echo.
echo Pushing %BRANCH% to GitHub...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo Push failed. Check your internet connection and GitHub sign-in, then run this again.
  pause
  exit /b 1
)
echo.
echo Done. Branch %BRANCH% is on GitHub.
pause
exit /b 0

:wrongbranch
echo You are on "%CURRENT%". This script never commits there.
echo Run:  git switch %BRANCH%   and try again.
pause
exit /b 1
