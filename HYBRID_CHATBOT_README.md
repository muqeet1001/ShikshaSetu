# CareerCompass Hybrid Chatbot

A comprehensive career guidance chatbot system designed specifically for students in Jammu & Kashmir, featuring cloud-offline hybrid architecture with multi-modal support.

## 🌟 Features

### Core Architecture
- **☁️ Cloud AI**: Google Gemini API & HuggingFace Inference Providers
- **📱 Offline Fallback**: Pattern-based responses with GGUF model support
- **🔄 Auto-Switching**: Seamless transition between online and offline modes
- **🌐 Connectivity Detection**: Real-time network monitoring and adaptation

### Multi-Modal Support
- **🎤 Voice Input**: Offline speech recognition with Vosk (Hindi/English)
- **🔊 Voice Output**: Text-to-speech responses
- **📞 Telephony**: IVR and USSD support for rural accessibility
- **💬 Text Chat**: Rich conversational interface with streaming responses

### Compliance & Quality
- **📚 Source Attribution**: Automatic citation of information sources
- **✅ Compliance Monitoring**: Response quality and reliability tracking
- **⚠️ Content Disclaimers**: Context-appropriate warnings and notes
- **🔍 Verification Prompts**: Alerts for critical information requiring verification

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   User Interface    │    │  Hybrid Orchestrator │    │   Cloud Services    │
│                     │    │                     │    │                     │
│ • Chat Screen       │◄──►│ • Connection Monitor │◄──►│ • Gemini API        │
│ • Voice Input       │    │ • Auto-Switching     │    │ • HuggingFace API   │
│ • Status Indicators │    │ • Request Queue      │    │ • Rate Limiting     │
└─────────────────────┘    │ • Error Handling     │    └─────────────────────┘
                           └─────────────────────┘    
                                      │               
                           ┌─────────────────────┐    ┌─────────────────────┐
                           │  Offline Services   │    │   Other Services    │
                           │                     │    │                     │
                           │ • Pattern Matching  │    │ • Speech Recognition│
                           │ • GGUF Models       │    │ • Compliance Service│
                           │ • Local Knowledge   │    │ • Telephony Service │
                           └─────────────────────┘    └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

1. **Clone and setup:**
   ```bash
   cd CareerCompass
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure API keys:**
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

### API Keys Required

#### Free Tier Options:
1. **Google Gemini API** (Recommended - High Quality & Free)
   - Sign up: https://aistudio.google.com/app/apikey
   - Free tier: 15 requests/minute, 1500 requests/day
   - Models: gemini-1.5-flash, gemini-1.5-pro

2. **HuggingFace API** (Fallback)
   - Sign up: https://huggingface.co/settings/tokens
   - Free tier: Rate-limited inference
   - Models: Various open-source models

#### Optional:
3. **Perplexity API** (For web-grounded responses)
   - Sign up: https://www.perplexity.ai/
   - Paid service with citations

## 📁 Project Structure

```
src/
├── config/
│   └── chatbotConfig.ts          # Central configuration
├── services/
│   ├── ai/
│   │   └── cloudAIService.ts     # Cloud API integration
│   ├── offline/
│   │   └── offlineLLMService.ts  # Offline pattern matching
│   ├── speech/
│   │   └── speechRecognitionService.ts # Vosk integration
│   ├── telephony/
│   │   └── telephonyService.ts   # IVR/USSD support
│   ├── hybridAIOrchestrator.ts   # Main orchestration
│   └── complianceService.ts      # Source attribution
└── components/screens/
    └── CareerChatBotScreen.tsx   # Main chat interface
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Required for cloud functionality
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
EXPO_PUBLIC_HUGGINGFACE_API_KEY=your_hf_key_here

# Feature toggles
EXPO_PUBLIC_ENABLE_CLOUD_API=true
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
EXPO_PUBLIC_ENABLE_SPEECH_RECOGNITION=true
EXPO_PUBLIC_ENABLE_TELEPHONY=false  # Set to true for rural access
```

### Runtime Configuration

```typescript
import { getEnvironmentConfig } from './src/config/chatbotConfig';

const config = getEnvironmentConfig();
// Automatically adapts based on environment and feature flags
```

## 🌐 Usage Modes

### 1. Online Mode (Primary)
- **Cloud API Priority**: Gemini → HuggingFace → Offline fallback
- **High-Quality Responses**: Gemini 1.5 Flash for intelligent conversations
- **Rate Limiting**: Automatic queue management for free tiers
- **Source Citations**: Verified information with attributions

### 2. Offline Mode (Fallback)
- **Pattern Matching**: 200+ career-specific response patterns
- **Local Knowledge**: J&K-specific colleges, exams, and opportunities
- **Instant Responses**: No network dependency
- **Contextual Guidance**: Personalized based on student profile

### 3. Limited Connection Mode
- **Request Queuing**: Important queries queued for better connection
- **Hybrid Processing**: Mix of cached and offline responses
- **Background Sync**: Automatic retry when connection improves

## 🎤 Voice Features

### Speech Recognition (Vosk)
- **Offline Support**: No internet required for STT
- **Multi-Language**: Hindi and English recognition
- **Confidence Scoring**: Quality metrics for recognition accuracy
- **Text Confirmation**: User confirms recognized text before sending

### Text-to-Speech
- **System Integration**: Uses device's built-in TTS
- **Language Detection**: Automatic Hindi/English voice selection
- **Clean Output**: Removes markdown and formatting for better speech

## 📞 Rural Accessibility

### IVR (Interactive Voice Response)
```
नमस्कार! CareerCompass में आपका स्वागत है।
1. करियर मार्गदर्शन
2. स्ट्रीम चुनाव  
3. कॉलेज जानकारी
4. नौकरी के अवसर
```

### USSD (*123*456#)
- Step-by-step questionnaire
- Personalized career recommendations
- No smartphone required
- Works on feature phones

## 🛡️ Compliance & Safety

### Source Attribution
- **Government Data**: J&K Board, NTA, AICTE sources
- **Institution Verification**: NIT Srinagar, GMC citations
- **Confidence Levels**: High/Medium/Low reliability indicators
- **Update Timestamps**: Freshness indicators for information

### Content Disclaimers
- **Financial Information**: Salary ranges marked as approximate
- **Admission Data**: Requirements subject to change warnings
- **Career Guidance**: Individual outcomes may vary notices
- **Offline Responses**: Local knowledge base limitations

### Verification Requirements
Critical information (deadlines, fees, cut-offs) includes:
- ⚠️ **Verification prompts**
- 🔍 **Official source recommendations**
- 📱 **Offline mode indicators**

## 📊 Monitoring & Analytics

### Response Quality Metrics
```typescript
const report = complianceService.generateComplianceReport(responses);
// {
//   totalResponses: 150,
//   attributedResponses: 120,
//   confidenceLevels: { high: 80, medium: 50, low: 20 },
//   offlineResponses: 30
// }
```

### Connection Statistics
```typescript
const status = hybridAIOrchestrator.getStatus();
// Real-time monitoring of:
// - Network quality
// - Processing modes
// - Queue status
// - Service availability
```

## 🚀 Deployment

### Development
```bash
npm start                # Start Expo dev server
npm run android         # Run on Android
npm run ios            # Run on iOS
```

### Production Build
```bash
# Android APK
eas build --platform android --profile production

# iOS App Store
eas build --platform ios --profile production
```

### Environment-Specific Configs
- **Development**: Extended timeouts, debug logging
- **Production**: Optimized performance, error reporting
- **Offline**: Telephony disabled, local models only

## 🔍 Troubleshooting

### Common Issues

1. **API Keys Not Working**
   ```bash
   # Check environment file
   cat .env | grep API_KEY
   
   # Verify keys are valid
   # Groq: https://console.groq.com/
   # HuggingFace: https://huggingface.co/settings/tokens
   ```

2. **Voice Recognition Not Working**
   ```javascript
   // Check permissions
   const { status } = await Audio.requestPermissionsAsync();
   
   // Verify Vosk setup
   const isReady = speechRecognitionService.isAvailable();
   ```

3. **Offline Mode Issues**
   ```typescript
   // Check offline service status
   const modelInfo = offlineLLMService.getModelInfo();
   
   // Verify pattern loading
   const isLoaded = offlineLLMService.isOfflineModelReady();
   ```

### Network Issues
- **Poor Connection**: Automatic fallback to offline mode
- **Rate Limits**: Built-in queue and retry mechanism
- **API Failures**: Graceful degradation to pattern matching

## 📈 Performance Optimization

### Caching Strategy
- **Response Cache**: 100 most recent Q&A pairs
- **Pattern Cache**: Frequently matched patterns prioritized
- **Network Cache**: Connection status and quality metrics

### Resource Management
- **Memory**: Automatic cache cleanup when limits reached
- **CPU**: Background processing for non-critical tasks
- **Network**: Intelligent batching and compression

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Follow existing code patterns
4. Test with both online and offline modes
5. Submit pull request with clear description

### Code Style
- TypeScript for type safety
- ESLint/Prettier for formatting
- Comprehensive error handling
- User-centric design principles

## 📄 License

This project is part of the CareerCompass educational platform.

## 🆘 Support

For issues and questions:
1. Check this README first
2. Review troubleshooting section
3. Search existing issues
4. Create detailed bug report with:
   - Device information
   - Network conditions
   - Error logs
   - Steps to reproduce

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Cloud-offline hybrid architecture
- ✅ Voice recognition support
- ✅ Source attribution system
- ✅ Basic telephony framework

### Phase 2 (Upcoming)
- 🔄 Advanced GGUF model integration
- 🔄 Real-time streaming improvements
- 🔄 Enhanced telephony features
- 🔄 Multi-language support expansion

### Phase 3 (Future)
- 📋 Advanced analytics dashboard
- 📋 Personalization engine
- 📋 Integration with external databases
- 📋 Advanced compliance features

---

**Built with ❤️ for students in Jammu & Kashmir**

*Empowering career decisions through accessible, reliable, and culturally-aware AI guidance.*