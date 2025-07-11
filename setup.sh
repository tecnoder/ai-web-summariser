#!/bin/bash

# AI Website Summarizer - Setup Script
# This script helps you set up the environment variables quickly

echo "🤖 AI Website Summarizer - Environment Setup"
echo "============================================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Your existing .env.local was not modified."
        exit 1
    fi
fi

# Copy template to .env.local
if [ -f "env.template" ]; then
    cp env.template .env.local
    echo "✅ Created .env.local from template"
else
    echo "❌ env.template not found! Make sure you're in the project root directory."
    exit 1
fi

echo ""
echo "🔑 OpenAI API Key Setup"
echo "----------------------"
echo "To complete the setup, you need to add your OpenAI API key."
echo ""
echo "1. Visit: https://platform.openai.com/api-keys"
echo "2. Sign up or log in to your OpenAI account"
echo "3. Create a new API key"
echo "4. Copy the API key"
echo ""

read -p "Do you have your OpenAI API key ready? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter your OpenAI API key: " api_key
    
    if [ -z "$api_key" ]; then
        echo "❌ No API key entered. You'll need to edit .env.local manually."
    else
        # Replace the placeholder with the actual API key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/sk-your-openai-api-key-here/$api_key/" .env.local
        else
            # Linux
            sed -i "s/sk-your-openai-api-key-here/$api_key/" .env.local
        fi
        echo "✅ API key added to .env.local"
    fi
else
    echo ""
    echo "📝 Manual Setup Required:"
    echo "1. Edit .env.local"
    echo "2. Replace 'sk-your-openai-api-key-here' with your actual API key"
fi

echo ""
echo "🚀 Next Steps"
echo "-------------"
echo "1. Install dependencies: npm install"
echo "2. Start development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "✨ Your AI Website Summarizer is ready!"

# Make the script executable
chmod +x setup.sh 