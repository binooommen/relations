#!/bin/bash
# Start backend and db with Docker Compose, then run Expo locally for iOS

echo "Starting backend and database with Docker Compose..."
docker compose up -d db backend frontend

echo "Starting Expo CLI for iOS (locally)..."
cd frontend
npx expo start --ios
