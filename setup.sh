#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Prof. Abolaji's Portfolio Website...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before continuing."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version 16 or higher is required. Please upgrade your Node.js version."
    exit 1
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please update it with your Firebase credentials.${NC}"
fi

# Remind to set up Firebase
echo -e "${GREEN}Dependencies installed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update the .env file with your Firebase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Access the website at http://localhost:5173"

echo -e "${GREEN}Setup complete!${NC}" 