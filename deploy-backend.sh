#!/bin/bash

# Railway Backend Deployment Script

echo "🚀 Starting Railway Backend Deployment..."

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
fi

# Navigate to server directory
cd server

# Link to Railway project (if not already linked)
if [ ! -f .railway/project.json ]; then
    echo "📦 Linking to Railway project..."
    railway link
fi

# Set root directory
echo "📁 Setting root directory to 'server'..."
railway variables set RAILWAY_ROOT_DIRECTORY=server 2>/dev/null || true

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment started! Check Railway dashboard for status."

