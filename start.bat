@echo off
echo Installing dependencies...
npm install && (
    echo Starting Angular server...
    ng serve --open
)