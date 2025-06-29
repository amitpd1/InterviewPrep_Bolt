#!/bin/bash

# Docker Deployment Script for AI Interview Platform

set -e

echo "🐳 Building Docker image for AI Interview Platform..."

# Build the Docker image
docker build -t ai-interview-platform .

echo "✅ Docker image built successfully!"

echo "🚀 Starting the application with Docker..."

# Run the container
docker run -d \
  --name ai-interview-platform \
  -p 3001:3001 \
  --env-file .env \
  ai-interview-platform

echo "✅ Application started successfully!"
echo "🌐 The application is available at: http://localhost:3001"
echo "📊 Health check: http://localhost:3001/api/health"
echo ""
echo "📋 Useful Docker commands:"
echo "  View logs: docker logs ai-interview-platform"
echo "  Stop app:  docker stop ai-interview-platform"
echo "  Remove:    docker rm ai-interview-platform"