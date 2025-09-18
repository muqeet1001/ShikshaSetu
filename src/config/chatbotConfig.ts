// Hybrid Chatbot Configuration
export interface ChatbotConfig {
  // Cloud API Settings
  gemini: {
    apiKey: string;
    baseUrl: string;
    model: string;
    maxTokens: number;
    temperature: number;
    rateLimitMs: number;
  };
  
  huggingface: {
    apiKey: string;
    baseUrl: string;
    model: string;
    maxTokens: number;
    temperature: number;
    rateLimitMs: number;
  };
  
  // On-device Model Settings
  offline: {
    modelPath: string;
    modelSize: 'tiny' | 'small' | 'medium';
    maxContextLength: number;
    enableGPU: boolean;
  };
  
  // Speech Recognition Settings
  speech: {
    voskModelPath: string;
    languages: string[];
    sampleRate: number;
    enableOffline: boolean;
  };
  
  // Telephony Settings
  telephony: {
    ivrEndpoint: string;
    ussdCode: string;
    enableTelephony: boolean;
  };
  
  // Feature Flags
  features: {
    enableCloudAPI: boolean;
    enableOfflineMode: boolean;
    enableSpeechRecognition: boolean;
    enableTelephony: boolean;
    enableStreaming: boolean;
    enableSourceCitation: boolean;
  };
  
  // Performance Settings
  performance: {
    maxRetries: number;
    timeoutMs: number;
    cacheEnabled: boolean;
    maxCacheSize: number;
  };
}

// Default configuration
export const defaultChatbotConfig: ChatbotConfig = {
  gemini: {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash', // Free tier model
    maxTokens: 2048,
    temperature: 0.7,
    rateLimitMs: 2000, // Conservative rate limiting
  },
  
  huggingface: {
    apiKey: process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY || '',
    baseUrl: 'https://api-inference.huggingface.co/models',
    model: 'microsoft/DialoGPT-large',
    maxTokens: 200,
    temperature: 0.7,
    rateLimitMs: 2000,
  },
  
  offline: {
    modelPath: 'models/llama-2-7b-chat.q4_0.gguf',
    modelSize: 'small',
    maxContextLength: 2048,
    enableGPU: true,
  },
  
  speech: {
    voskModelPath: 'models/vosk-model-small-hi-in-0.22',
    languages: ['en-US', 'hi-IN'],
    sampleRate: 16000,
    enableOffline: true,
  },
  
  telephony: {
    ivrEndpoint: 'https://your-ivr-service.com/webhook',
    ussdCode: '*123*456#',
    enableTelephony: false, // Disabled by default
  },
  
  features: {
    enableCloudAPI: true,
    enableOfflineMode: true,
    enableSpeechRecognition: true,
    enableTelephony: false, // Disabled for demo
    enableStreaming: true,
    enableSourceCitation: true,
  },
  
  performance: {
    maxRetries: 3,
    timeoutMs: 30000,
    cacheEnabled: true,
    maxCacheSize: 100, // Max cached responses
  },
};

// Environment-specific overrides
export const getEnvironmentConfig = (): ChatbotConfig => {
  const baseConfig = { ...defaultChatbotConfig };
  
  // Development overrides
  if (__DEV__) {
    baseConfig.performance.timeoutMs = 60000; // Longer timeout for debugging
    baseConfig.features.enableTelephony = false; // Disable telephony in dev
  }
  
  return baseConfig;
};

// Validation helper
export const validateConfig = (config: ChatbotConfig): string[] => {
  const errors: string[] = [];
  
  if (config.features.enableCloudAPI) {
    if (!config.gemini.apiKey && !config.huggingface.apiKey) {
      errors.push('At least one cloud API key must be provided when cloud API is enabled');
    }
  }
  
  if (config.features.enableSpeechRecognition && !config.speech.voskModelPath) {
    errors.push('Vosk model path is required when speech recognition is enabled');
  }
  
  if (config.features.enableTelephony && !config.telephony.ivrEndpoint) {
    errors.push('IVR endpoint is required when telephony is enabled');
  }
  
  return errors;
};