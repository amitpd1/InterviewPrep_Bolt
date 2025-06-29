#!/bin/bash

# AI Interview Platform Deployment Script
# This script builds the frontend and starts the Python backend

set -e  # Exit on any error

echo "🚀 Starting AI Interview Platform Deployment..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "🏗️ Building frontend for production..."
npm run build

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Checking if dist directory exists..."
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed. dist directory not found."
    exit 1
fi

echo "✅ Frontend built successfully!"

echo "🐍 Starting Python backend server..."
echo "🌐 The application will be available at: http://localhost:3001"
echo "📊 Health check endpoint: http://localhost:3001/api/health"
echo "🛑 Press Ctrl+C to stop the server"

# Start the Python backend
cd python_backend
python main.py