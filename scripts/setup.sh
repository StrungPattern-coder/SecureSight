#!/bin/bash

echo "🛡️  SecureSight Dashboard Setup"
echo "================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your Supabase settings"
    echo "Run: cp .env.example .env.local"
    exit 1
fi

# Check if Supabase is configured
if grep -q "your-project-ref.supabase.co" .env.local; then
    echo "⚠️  Please configure your Supabase settings in .env.local"
    echo "See SUPABASE_SETUP.md for detailed instructions"
    exit 1
fi

echo "🔐 Generating NextAuth secret..."
SECRET=$(node scripts/generate-secret.js | tail -1)
echo "Generated secret: $SECRET"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:push
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start the development server:"
echo "   npm run dev"
echo ""
echo "👤 Demo credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   Operator: operator@example.com / operator123"
echo "   Viewer: viewer@example.com / viewer123"
