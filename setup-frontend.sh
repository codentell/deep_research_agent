#!/bin/bash

echo "🎨 Setting up Deep Research Agent Frontend..."
echo "=================================================="

# Navigate to frontend directory
cd frontend

# Clean any existing installations
echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json yarn.lock yarn-error.log

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully!"
    echo ""
    echo "🚀 Start the development server with:"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "🌟 Features included:"
    echo "   • shadcn/ui components"
    echo "   • Framer Motion animations"
    echo "   • Real-time process visualization"
    echo "   • Responsive design"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi