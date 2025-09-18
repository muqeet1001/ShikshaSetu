import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { ChatbotConfig, getEnvironmentConfig } from '../../config/chatbotConfig';

// Speech Recognition Types
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  language: 'en' | 'hi';
  duration: number;
  isOffline: boolean;
}

export interface SpeechConfig {
  language: 'en-US' | 'hi-IN' | 'auto';
  sampleRate: number;
  enableOffline: boolean;
  maxRecordingTime: number;
}

// Vosk Integration Interface (placeholder for actual Vosk implementation)
interface VoskRecognizer {
  recognize(audioData: ArrayBuffer): Promise<{ text: string; confidence: number }>;
  setLanguage(language: 'en' | 'hi'): void;
  isReady(): boolean;
}

class SpeechRecognitionService {
  private config: ChatbotConfig;
  private voskRecognizer?: VoskRecognizer;
  private isInitialized = false;
  private currentRecording?: Audio.Recording;
  private isRecording = false;

  constructor(config?: ChatbotConfig) {
    this.config = config || getEnvironmentConfig();
  }

  // Initialize speech recognition
  async initialize(): Promise<boolean> {
    try {
      // Request microphone permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      // Setup audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Initialize speech recognition (simulation mode)
      if (this.config.features.enableSpeechRecognition) {
        await this.initializeSpeechRecognition();
      }

      this.isInitialized = true;
      console.log('Speech recognition service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      return false;
    }
  }

  // Initialize speech recognition
  private async initializeSpeechRecognition(): Promise<void> {
    try {
      // This would load actual Vosk models
      // For now, we simulate the initialization
      console.log('Loading speech recognition for Hindi and English...');
      
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock Vosk recognizer
      this.voskRecognizer = {
        recognize: async (audioData: ArrayBuffer) => {
          // This would be actual Vosk recognition
          // For now, return mock results
          await new Promise(resolve => setTimeout(resolve, 500));
          return {
            text: 'मुझे डॉक्टर बनना है', // "I want to become a doctor" in Hindi
            confidence: 0.85
          };
        },
        setLanguage: (language: 'en' | 'hi') => {
          console.log(`Vosk language set to: ${language}`);
        },
        isReady: () => true
      };

      console.log('Speech recognition initialized successfully');
    } catch (error) {
      console.error('Failed to load Vosk models:', error);
      throw error;
    }
  }

  // Start recording
  async startRecording(language: 'en-US' | 'hi-IN' | 'auto' = 'auto'): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Speech recognition not initialized');
    }

    if (this.isRecording) {
      throw new Error('Already recording');
    }

    try {
      // Temporarily disable recording due to API compatibility issues
      // This will be fixed in future updates
      throw new Error('Recording temporarily disabled due to expo-av API changes');

      // Auto-stop after max recording time
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, this.config.speech.enableOffline ? 30000 : 60000); // 30s offline, 60s online

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  // Stop recording and process
  async stopRecording(): Promise<SpeechRecognitionResult> {
    if (!this.isRecording || !this.currentRecording) {
      throw new Error('Not currently recording');
    }

    try {
      const startTime = Date.now();
      
      await this.currentRecording.stopAndUnloadAsync();
      const uri = this.currentRecording.getURI();
      this.isRecording = false;

      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      console.log('Recording stopped, processing audio...');

      // Process the recording
      let result: SpeechRecognitionResult;

      if (this.config.features.enableSpeechRecognition && this.voskRecognizer?.isReady()) {
        // Use offline Vosk recognition
        result = await this.processWithVosk(uri, Date.now() - startTime);
      } else {
        // Fallback to text input simulation
        result = await this.simulateRecognition(Date.now() - startTime);
      }

      // Cleanup
      this.currentRecording = undefined;
      
      return result;

    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.isRecording = false;
      this.currentRecording = undefined;
      throw error;
    }
  }

  // Process audio with Vosk
  private async processWithVosk(audioUri: string, duration: number): Promise<SpeechRecognitionResult> {
    try {
      if (!this.voskRecognizer) {
        throw new Error('Vosk recognizer not available');
      }

      // In real implementation, convert audio file to ArrayBuffer
      // For now, simulate the process
      console.log('Processing audio with Vosk...');
      
      // Simulate audio conversion
      const audioData = new ArrayBuffer(1024); // Mock audio data
      
      // Language detection could be implemented here
      // For now, assume Hindi if contains Devanagari-like patterns
      this.voskRecognizer.setLanguage('hi');
      
      const recognition = await this.voskRecognizer.recognize(audioData);
      
      return {
        text: recognition.text,
        confidence: recognition.confidence,
        language: 'hi', // Would be detected automatically
        duration,
        isOffline: true
      };

    } catch (error) {
      console.error('Vosk processing failed:', error);
      
      // Fallback to simulation
      return this.simulateRecognition(duration);
    }
  }

  // Simulate speech recognition for demo
  private async simulateRecognition(duration: number): Promise<SpeechRecognitionResult> {
    // Demo phrases in Hindi and English
    const demoTexts = [
      { text: 'मुझे इंजीनियर बनना है', language: 'hi' as const, meaning: 'I want to become an engineer' },
      { text: 'डॉक्टर कैसे बनें?', language: 'hi' as const, meaning: 'How to become a doctor?' },
      { text: 'I want to study science', language: 'en' as const, meaning: 'I want to study science' },
      { text: 'Tell me about commerce stream', language: 'en' as const, meaning: 'Tell me about commerce stream' },
      { text: 'मैं कॉमर्स पढ़ना चाहता हूँ', language: 'hi' as const, meaning: 'I want to study commerce' },
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomDemo = demoTexts[Math.floor(Math.random() * demoTexts.length)];

    return {
      text: randomDemo.text,
      confidence: 0.8 + Math.random() * 0.2, // 0.8 to 1.0
      language: randomDemo.language,
      duration,
      isOffline: true
    };
  }

  // Text-to-Speech for responses
  async speakResponse(text: string, language: 'hi' | 'en' = 'en'): Promise<void> {
    try {
      const options: Speech.SpeechOptions = {
        language: language === 'hi' ? 'hi-IN' : 'en-US',
        pitch: 1.0,
        rate: 0.9, // Slightly slower for clarity
        voice: undefined, // Use system default
      };

      // Clean text for better TTS
      let cleanText = text;
      
      // Remove markdown formatting
      cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
      cleanText = cleanText.replace(/^\d+\.\s/gm, ''); // Numbered lists
      cleanText = cleanText.replace(/^-\s/gm, ''); // Bullet points
      cleanText = cleanText.replace(/[📚🎯🏥💰📈🔧📝🏫💼🎓]/g, ''); // Emojis

      await Speech.speak(cleanText, options);
      
    } catch (error) {
      console.error('Text-to-speech failed:', error);
    }
  }

  // Cancel current recording
  async cancelRecording(): Promise<void> {
    if (this.isRecording && this.currentRecording) {
      try {
        await this.currentRecording.stopAndUnloadAsync();
        console.log('Recording cancelled');
      } catch (error) {
        console.error('Failed to cancel recording:', error);
      } finally {
        this.isRecording = false;
        this.currentRecording = undefined;
      }
    }
  }

  // Get supported languages
  getSupportedLanguages(): Array<{ code: string; name: string; offline: boolean }> {
    return [
      { code: 'en-US', name: 'English', offline: true },
      { code: 'hi-IN', name: 'हिंदी (Hindi)', offline: true },
      { code: 'auto', name: 'Auto-detect', offline: true }
    ];
  }

  // Check if speech recognition is available
  isAvailable(): boolean {
    return this.isInitialized && (this.voskRecognizer?.isReady() ?? false);
  }

  // Get service status
  getStatus() {
    return {
      initialized: this.isInitialized,
      recording: this.isRecording,
      offlineCapable: this.config.features.enableSpeechRecognition,
      voskReady: this.voskRecognizer?.isReady() ?? false,
      supportedLanguages: this.getSupportedLanguages()
    };
  }

  // Update configuration
  updateConfig(newConfig: ChatbotConfig) {
    this.config = newConfig;
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    if (this.isRecording) {
      await this.cancelRecording();
    }

    this.isInitialized = false;
    this.voskRecognizer = undefined;
    console.log('Speech recognition service cleaned up');
  }
}

// Export singleton instance
export const speechRecognitionService = new SpeechRecognitionService();

// Utility function to detect language from text
export function detectLanguage(text: string): 'hi' | 'en' | 'mixed' {
  // Hindi Unicode ranges
  const hindiPattern = /[\u0900-\u097F]/;
  const englishPattern = /[a-zA-Z]/;
  
  const hasHindi = hindiPattern.test(text);
  const hasEnglish = englishPattern.test(text);
  
  if (hasHindi && hasEnglish) return 'mixed';
  if (hasHindi) return 'hi';
  return 'en';
}

// Utility function to transliterate Hindi to English (basic)
export function transliterateHindi(text: string): string {
  const hindiToEnglish: { [key: string]: string } = {
    'डॉक्टर': 'doctor',
    'इंजीनियर': 'engineer',
    'टीचर': 'teacher',
    'बिजनेस': 'business',
    'साइंस': 'science',
    'कॉमर्स': 'commerce',
    'आर्ट्स': 'arts',
    // Add more mappings as needed
  };

  let transliterated = text;
  for (const [hindi, english] of Object.entries(hindiToEnglish)) {
    transliterated = transliterated.replace(new RegExp(hindi, 'g'), english);
  }

  return transliterated;
}