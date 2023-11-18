@echo off
start cmd /k "npm start"
timeout /t 10
Start chrome "http://localhost:4000"
