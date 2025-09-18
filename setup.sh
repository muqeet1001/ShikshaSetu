#!/bin/bash

# Hybrid ChatBot Setup Script for CareerCompass
# This script sets up the complete hybrid chatbot system

echo "🚀 Setting up CareerCompass Hybrid Chatbot..."

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

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional hybrid chatbot dependencies
echo "📦 Installing hybrid chatbot dependencies..."
npm install expo-av@~16.0.2 expo-file-system@~18.0.8 expo-speech@~13.0.1 react-native-vosk@^0.1.21

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys!"
else
    echo "✅ .env file already exists"
fi

# Create models directory for offline models
echo "📁 Creating models directory..."
mkdir -p assets/models

# Create necessary directories
mkdir -p src/services/ai
mkdir -p src/services/offline  
mkdir -p src/services/speech
mkdir -p src/services/telephony
mkdir -p src/config

echo "📋 Setup Instructions:"
echo ""
echo "1. 📝 Edit .env file and add your API keys:"
echo "   - Get Gemini API key from: https://aistudio.google.com/app/apikey"
echo "   - Get HuggingFace API key from: https://huggingface.co/settings/tokens"
echo ""
echo "2. 📱 For offline mode (optional):"
echo "   - Download GGUF model files to assets/models/"
echo "   - Download Vosk models for speech recognition"
echo ""
echo "3. 🔧 For telephony features (optional):"
echo "   - Set up IVR/USSD webhook endpoints"
echo "   - Configure telephony provider settings"
echo ""
echo "4. 🏃‍♂️ Start the development server:"
echo "   npm start"
echo ""
echo "✅ Hybrid Chatbot setup complete!"
echo ""
echo "🌟 Features available:"
echo "   ✓ Cloud AI (Gemini + HuggingFace)"
echo "   ✓ Offline AI fallback"
echo "   ✓ Speech recognition (Hindi/English)"
echo "   ✓ Auto-switching based on connectivity"
echo "   ✓ Source attribution & compliance"
echo "   ✓ IVR/USSD for rural access"
echo ""
echo "📚 For detailed documentation, see README.md"