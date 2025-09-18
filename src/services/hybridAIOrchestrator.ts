import NetInfo from '@react-native-community/netinfo';
import { ChatbotConfig, getEnvironmentConfig } from '../config/chatbotConfig';
import { cloudAIService, AIResponse, CareerContext, StreamingResponse } from './ai/cloudAIService';
import { offlineLLMService } from './offline/offlineLLMService';
import { speechRecognitionService, SpeechRecognitionResult } from './speech/speechRecognitionService';

// Connection status types
export type ConnectionStatus = 'online' | 'offline' | 'limited';

export interface NetworkInfo {
  isConnected: boolean;
  connectionType: string | null;
  isInternetReachable: boolean | null;
  strength: 'excellent' | 'good' | 'poor' | 'none';
}

export interface HybridResponse extends AIResponse {
  fallbackReason?: string;
  networkInfo: NetworkInfo;
  processingMode: 'cloud-primary' | 'cloud-fallback' | 'offline-primary' | 'offline-fallback';
}

// Orchestration service that manages all AI components
class HybridAIOrchestrator {
  private config: ChatbotConfig;
  private networkInfo: NetworkInfo = {
    isConnected: false,
    connectionType: null,
    isInternetReachable: null,
    strength: 'none'
  };
  private isInitialized = false;
  private connectionListeners: ((status: ConnectionStatus) => void)[] = [];
  private requestQueue: Array<{ userMessage: string; context: CareerContext; resolve: Function; reject: Function }> = [];
  private isProcessingQueue = false;

  constructor(config?: ChatbotConfig) {
    this.config = config || getEnvironmentConfig();
  }

  // Initialize all services
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing Hybrid AI Orchestrator...');

      // Initialize network monitoring
      await this.initializeNetworkMonitoring();

      // Initialize offline LLM service
      await offlineLLMService.loadGGUFModel();

      // Initialize speech recognition if enabled
      if (this.config.features.enableSpeechRecognition) {
        await speechRecognitionService.initialize();
      }

      this.isInitialized = true;
      console.log('Hybrid AI Orchestrator initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Hybrid AI Orchestrator:', error);
      return false;
    }
  }

  // Initialize network monitoring
  private async initializeNetworkMonitoring(): Promise<void> {
    // Get initial network state
    const netInfo = await NetInfo.fetch();
    this.updateNetworkInfo(netInfo);

    // Listen for network changes
    NetInfo.addEventListener(netInfo => {
      const previousStatus = this.getConnectionStatus();
      this.updateNetworkInfo(netInfo);
      const currentStatus = this.getConnectionStatus();

      if (previousStatus !== currentStatus) {
        console.log(`Network status changed: ${previousStatus} → ${currentStatus}`);
        this.notifyConnectionChange(currentStatus);
        
        // Process queued requests if we're back online
        if (currentStatus === 'online' && this.requestQueue.length > 0) {
          this.processRequestQueue();
        }
      }
    });
  }

  // Update network information
  private updateNetworkInfo(netInfo: any): void {
    this.networkInfo = {
      isConnected: netInfo.isConnected ?? false,
      connectionType: netInfo.type,
      isInternetReachable: netInfo.isInternetReachable,
      strength: this.determineConnectionStrength(netInfo)
    };
  }

  // Determine connection strength
  private determineConnectionStrength(netInfo: any): 'excellent' | 'good' | 'poor' | 'none' {
    if (!netInfo.isConnected) return 'none';
    
    // For cellular connections, check signal strength if available
    if (netInfo.type === 'cellular') {
      const details = netInfo.details;
      if (details?.strength !== undefined) {
        if (details.strength >= 80) return 'excellent';
        if (details.strength >= 60) return 'good';
        return 'poor';
      }
    }
    
    // For WiFi, assume good connection unless explicitly poor
    if (netInfo.type === 'wifi') {
      return netInfo.isInternetReachable ? 'excellent' : 'poor';
    }
    
    // Default to good if connected
    return 'good';
  }

  // Get current connection status
  getConnectionStatus(): ConnectionStatus {
    if (!this.networkInfo.isConnected) return 'offline';
    if (this.networkInfo.strength === 'poor') return 'limited';
    return 'online';
  }

  // Main message processing with auto-switching logic
  async sendMessage(
    userMessage: string,
    context: CareerContext,
    onStream?: (chunk: StreamingResponse) => void
  ): Promise<HybridResponse> {
    if (!this.isInitialized) {
      throw new Error('Hybrid AI Orchestrator not initialized');
    }

    const connectionStatus = this.getConnectionStatus();
    let processingMode: HybridResponse['processingMode'] = 'offline-primary';
    let fallbackReason: string | undefined;

    try {
      // Primary processing based on connection status
      if (connectionStatus === 'online' && this.config.features.enableCloudAPI) {
        // Try cloud API first (Gemini or HuggingFace)
        processingMode = 'cloud-primary';
        return await this.processWithCloud(userMessage, context, processingMode, onStream);
      } 
      else if (connectionStatus === 'limited' && this.config.features.enableCloudAPI) {
        // Limited connection - queue request or use offline
        if (this.shouldQueueRequest(userMessage)) {
          return this.queueRequest(userMessage, context);
        } else {
          processingMode = 'offline-primary';
          fallbackReason = 'Poor connection quality, using offline mode';
          return await this.processWithOffline(userMessage, context, processingMode, fallbackReason);
        }
      }
      else {
        // Offline mode
        processingMode = 'offline-primary';
        fallbackReason = connectionStatus === 'offline' ? 'No internet connection' : 'Cloud API disabled';
        return await this.processWithOffline(userMessage, context, processingMode, fallbackReason);
      }

    } catch (error) {
      console.warn('Primary processing failed, attempting fallback:', error);
      
      // Fallback logic
      if (processingMode === 'cloud-primary') {
        // Cloud failed, try offline
        processingMode = 'offline-fallback';
        fallbackReason = `Cloud API failed: ${error}`;
        return await this.processWithOffline(userMessage, context, processingMode, fallbackReason);
      } else {
        // Both failed - return error response
        return this.createErrorResponse(error as Error, context);
      }
    }
  }

  // Process with cloud APIs
  private async processWithCloud(
    userMessage: string,
    context: CareerContext,
    processingMode: HybridResponse['processingMode'],
    onStream?: (chunk: StreamingResponse) => void
  ): Promise<HybridResponse> {
    const response = await cloudAIService.sendMessage(userMessage, context, onStream);
    
    return {
      ...response,
      networkInfo: this.networkInfo,
      processingMode
    };
  }

  // Process with offline services
  private async processWithOffline(
    userMessage: string,
    context: CareerContext,
    processingMode: HybridResponse['processingMode'],
    fallbackReason?: string
  ): Promise<HybridResponse> {
    const response = await offlineLLMService.processOfflineQuery(userMessage, context);
    
    return {
      ...response,
      networkInfo: this.networkInfo,
      processingMode,
      fallbackReason
    };
  }

  // Queue request for later processing
  private queueRequest(userMessage: string, context: CareerContext): Promise<HybridResponse> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ userMessage, context, resolve, reject });
      
      // Return immediate offline response
      offlineLLMService.processOfflineQuery(userMessage, context)
        .then(response => {
          const queuedResponse: HybridResponse = {
            ...response,
            networkInfo: this.networkInfo,
            processingMode: 'offline-primary',
            fallbackReason: 'Request queued for better connection, showing offline response'
          };
          // Don't resolve yet - will be resolved when connection improves
          console.log(`Request queued. Queue size: ${this.requestQueue.length}`);
        });
    });
  }

  // Process queued requests
  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    console.log(`Processing ${this.requestQueue.length} queued requests`);

    while (this.requestQueue.length > 0 && this.getConnectionStatus() === 'online') {
      const request = this.requestQueue.shift()!;
      
      try {
        const response = await this.processWithCloud(
          request.userMessage, 
          request.context, 
          'cloud-fallback'
        );
        request.resolve(response);
      } catch (error) {
        const fallbackResponse = await this.processWithOffline(
          request.userMessage,
          request.context,
          'offline-fallback',
          'Queued cloud request failed, using offline response'
        );
        request.resolve(fallbackResponse);
      }
    }

    this.isProcessingQueue = false;
  }

  // Determine if request should be queued
  private shouldQueueRequest(userMessage: string): boolean {
    // Queue important career-related questions
    const importantKeywords = ['career', 'college', 'exam', 'admission', 'job', 'salary'];
    const isImportant = importantKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    // Don't queue if queue is already full
    const queueFull = this.requestQueue.length >= 5;
    
    return isImportant && !queueFull;
  }

  // Create error response
  private createErrorResponse(error: Error, context: CareerContext): HybridResponse {
    const { fullName } = context;
    const firstName = fullName.split(' ')[0];

    return {
      message: `Sorry ${firstName}, I'm experiencing technical difficulties right now. Please try asking your question in a different way, or check your internet connection.`,
      isOffline: true,
      source: 'fallback',
      confidence: 0.1,
      responseTime: 0,
      hasSourceCitation: false,
      networkInfo: this.networkInfo,
      processingMode: 'offline-fallback',
      fallbackReason: `System error: ${error.message}`
    };
  }

  // Speech recognition integration
  async processVoiceInput(
    context: CareerContext,
    language: 'en-US' | 'hi-IN' | 'auto' = 'auto'
  ): Promise<{ recognition: SpeechRecognitionResult; response: HybridResponse }> {
    if (!this.config.features.enableSpeechRecognition) {
      throw new Error('Speech recognition is disabled');
    }

    // Start recording
    await speechRecognitionService.startRecording(language);
    
    // This would typically be called by UI when user stops recording
    const recognition = await speechRecognitionService.stopRecording();
    
    // Process the recognized text
    const response = await this.sendMessage(recognition.text, context);
    
    return { recognition, response };
  }

  // Connection change notifications
  addConnectionListener(listener: (status: ConnectionStatus) => void): void {
    this.connectionListeners.push(listener);
  }

  removeConnectionListener(listener: (status: ConnectionStatus) => void): void {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
  }

  private notifyConnectionChange(status: ConnectionStatus): void {
    this.connectionListeners.forEach(listener => listener(status));
  }

  // Get service status
  getStatus() {
    return {
      initialized: this.isInitialized,
      networkInfo: this.networkInfo,
      connectionStatus: this.getConnectionStatus(),
      queuedRequests: this.requestQueue.length,
      cloudService: {
        available: this.config.features.enableCloudAPI,
        cacheStats: cloudAIService.getCacheStats()
      },
      offlineService: {
        available: this.config.features.enableOfflineMode,
        modelInfo: offlineLLMService.getModelInfo()
      },
      speechService: {
        available: this.config.features.enableSpeechRecognition,
        status: speechRecognitionService.getStatus()
      }
    };
  }

  // Update configuration
  updateConfig(newConfig: ChatbotConfig): void {
    this.config = newConfig;
    cloudAIService.updateConfig(newConfig);
    offlineLLMService.updateConfig(newConfig);
    speechRecognitionService.updateConfig(newConfig);
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    // Clear listeners
    this.connectionListeners = [];
    
    // Clear request queue
    this.requestQueue.forEach(request => {
      request.reject(new Error('Service shutting down'));
    });
    this.requestQueue = [];

    // Cleanup services
    await speechRecognitionService.cleanup();
    
    this.isInitialized = false;
    console.log('Hybrid AI Orchestrator cleaned up');
  }

  // Utility methods
  getNetworkInfo(): NetworkInfo {
    return { ...this.networkInfo };
  }

  async testConnection(): Promise<{ success: boolean; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity test
      const response = await fetch('https://www.google.com', {
        method: 'HEAD'
      });
      
      return {
        success: response.ok,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime
      };
    }
  }
}

// Export singleton instance
export const hybridAIOrchestrator = new HybridAIOrchestrator();