#!/bin/bash

# Complete Deployment Script for CodeCampus
# This will deploy both backend and frontend

set -e  # Exit on error

echo "🚀 CodeCampus Deployment Script"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Railway login
echo -e "\n${YELLOW}Checking Railway login...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Railway${NC}"
    echo "Please run: railway login"
    echo "Browser will open automatically"
    railway login
    echo -e "${GREEN}✅ Railway login successful!${NC}"
else
    echo -e "${GREEN}✅ Already logged in to Railway${NC}"
fi

# Check Vercel login
echo -e "\n${YELLOW}Checking Vercel login...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Vercel${NC}"
    echo "Please run: vercel login"
    echo "Browser will open automatically"
    vercel login
    echo -e "${GREEN}✅ Vercel login successful!${NC}"
else
    echo -e "${GREEN}✅ Already logged in to Vercel${NC}"
fi

# Deploy Backend
echo -e "\n${YELLOW}🚀 Deploying Backend to Railway...${NC}"
cd server

# Link project if not linked
if [ ! -f .railway/project.json ]; then
    echo "Linking Railway project..."
    railway link
fi

# Deploy
railway up --detach
echo -e "${GREEN}✅ Backend deployment started!${NC}"

# Get backend URL
echo -e "\n${YELLOW}Getting backend URL...${NC}"
BACKEND_URL=$(railway domain 2>/dev/null || echo "Check Railway dashboard for URL")
echo -e "${GREEN}Backend URL: ${BACKEND_URL}${NC}"

# Deploy Frontend
echo -e "\n${YELLOW}🚀 Deploying Frontend to Vercel...${NC}"
cd ../client

# Deploy
vercel --prod --yes
echo -e "${GREEN}✅ Frontend deployment complete!${NC}"

# Get frontend URL
echo -e "\n${YELLOW}Getting frontend URL...${NC}"
FRONTEND_URL=$(vercel ls --prod | grep -o 'https://[^ ]*' | head -1 || echo "Check Vercel dashboard for URL")
echo -e "${GREEN}Frontend URL: ${FRONTEND_URL}${NC}"

echo -e "\n${GREEN}✅ Deployment Complete!${NC}"
echo "================================"
echo "Backend: ${BACKEND_URL}"
echo "Frontend: ${FRONTEND_URL}"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Set environment variables in Railway"
echo "2. Set environment variables in Vercel"
echo "3. Update ORIGIN_PORT in Railway with Frontend URL"

