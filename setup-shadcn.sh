#!/bin/bash

echo "🎨 Setting up shadcn/ui for Deep Research Agent..."
echo "=================================================="

# Navigate to frontend directory
cd frontend

echo "📦 Installing base dependencies..."
npm install

echo "🎯 Initializing shadcn/ui..."
# Initialize shadcn/ui with the existing components.json config
npx shadcn@latest init --yes

echo "🧩 Adding required shadcn/ui components..."
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add textarea
npx shadcn@latest add select

echo "✅ shadcn/ui setup complete!"
echo ""
echo "🚀 Start the development server with:"
echo "   cd frontend && npm run dev"
echo ""
echo "🌟 Components installed:"
echo "   • Button, Card, Badge"
echo "   • Progress, Separator"
echo "   • Textarea, Select"
echo "   • Framer Motion animations"
echo "   • Real-time process visualization"