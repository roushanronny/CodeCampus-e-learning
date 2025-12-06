#!/bin/bash

# Vercel Frontend Deployment Script

echo "🚀 Starting Vercel Frontend Deployment..."

# Navigate to client directory
cd client

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete! Check Vercel dashboard for URL."

