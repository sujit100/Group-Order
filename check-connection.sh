#!/bin/bash

echo "🔍 Checking Supabase Connection..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "   Create it from env.local.example and add your Supabase credentials"
    exit 1
fi

echo "✅ .env.local file exists"

# Check if dependencies are installed
if [ ! -d node_modules ]; then
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if dev server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Development server is running"
    echo ""
    echo "📝 Testing Supabase connection..."
    echo "   Visit: http://localhost:3000/api/test-supabase"
    echo ""
    echo "   Or open in browser automatically? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        open "http://localhost:3000/api/test-supabase" 2>/dev/null || xdg-open "http://localhost:3000/api/test-supabase" 2>/dev/null || echo "   Please open manually: http://localhost:3000/api/test-supabase"
    fi
else
    echo "⚠️  Development server is not running"
    echo ""
    echo "   Starting development server..."
    echo "   (Press Ctrl+C to stop, then visit: http://localhost:3000/api/test-supabase)"
    echo ""
    npm run dev
fi
