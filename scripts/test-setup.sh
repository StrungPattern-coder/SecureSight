#!/bin/bash

echo "🧪 Testing SecureSight Setup"
echo "============================"

# Test 1: Check environment file
echo "1. Checking environment configuration..."
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    exit 1
fi

if grep -q "your-project-ref" .env.local; then
    echo "⚠️  Environment variables need configuration"
else
    echo "✅ Environment variables configured"
fi

# Test 2: Check NextAuth secret
echo "2. Checking NextAuth secret..."
if grep -q "NEXTAUTH_SECRET=" .env.local; then
    echo "✅ NextAuth secret found"
else
    echo "❌ NextAuth secret missing"
fi

# Test 3: Test database connection
echo "3. Testing database connection..."
if npm run db:generate > /dev/null 2>&1; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
fi

# Test 4: Check if dependencies are installed
echo "4. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed - run npm install"
fi

# Test 5: Try to build the project
echo "5. Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check for errors"
fi

echo ""
echo "🎉 Test complete!"
echo "💡 Run 'npm run dev' to start the development server"
