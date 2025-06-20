#!/bin/bash

echo "🚀 TinderClone Backend Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL first."
    echo "📖 See TEAM_SETUP.md for installation instructions"
    echo "   macOS: brew install mysql"
    echo "   Linux: sudo apt install mysql-server"
    echo "   Windows: Download from mysql.com"
    exit 1
fi

echo "✅ MySQL is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "🔧 Please update the .env file with your database credentials"
    echo "📖 See TEAM_SETUP.md for detailed instructions"
else
    echo "✅ .env file found"
fi

# Ask if user wants to setup local database
echo ""
read -p "🤔 Do you want to setup the local database now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️  Setting up local database..."
    npm run setup:local-db
fi

echo ""
echo "🎉 Setup complete!"
echo "📖 Next steps:"
echo "   1. Update .env file with database credentials"
echo "   2. Run 'npm run dev' to start the server"
echo "   3. Check TEAM_SETUP.md for troubleshooting"
echo ""
echo "🗄️  Database commands:"
echo "   npm run setup:local-db  - Setup local database"
echo "   npm run sync:db:pull    - Pull data from RDS"
echo "   npm run sync:db:push    - Push data to RDS"
echo "   npm run db:reset        - Reset local database" 