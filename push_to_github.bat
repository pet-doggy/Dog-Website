@echo off
echo Configuring git username and email...
git config user.name "pet-doggy"
git config user.email "wildigourmet@gmail.com"

echo.
echo Setting up new remote origin...
git remote set-url origin https://github.com/pet-doggy/Final-Website.git 2>nul
if %errorlevel% neq 0 (
    git remote add origin https://github.com/pet-doggy/Final-Website.git
)

echo.
echo Adding files to git...
git add .

echo.
echo Committing files...
git commit -m "Push to new repository"

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main --force

echo.
echo Finished! Press any key to exit.
pause
