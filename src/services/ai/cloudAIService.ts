import { ChatbotConfig, getEnvironmentConfig } from '../../config/chatbotConfig';

// Enhanced Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  message: string;
  isOffline: boolean;
  source: 'gemini' | 'huggingface' | 'offline' | 'fallback';
  confidence: number;
  responseTime: number;
  tokensUsed?: number;
  hasSourceCitation: boolean;
}

export interface CareerContext {
  fullName: string;
  classLevel: '10th' | '12th';
  district: string;
  interests: string[];
  previousMessages: ChatMessage[];
  sessionId?: string;
}

export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  source: 'gemini' | 'huggingface';
}

// Rate Limiting Queue
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;

  async execute<T>(fn: () => Promise<T>, delayMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;
          
          if (timeSinceLastRequest < delayMs) {
            await new Promise(r => setTimeout(r, delayMs - timeSinceLastRequest));
          }
          
          this.lastRequestTime = Date.now();
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await task();
    }
    
    this.processing = false;
  }
}

class CloudAIService {
  private config: ChatbotConfig;
  private geminiRateLimiter: RateLimiter;
  private hfRateLimiter: RateLimiter;
  private requestCache = new Map<string, AIResponse>();

  constructor(config?: ChatbotConfig) {
    this.config = config || getEnvironmentConfig();
    this.geminiRateLimiter = new RateLimiter();
    this.hfRateLimiter = new RateLimiter();
  }

  // Main cloud API orchestration
  async sendMessage(
    userMessage: string,
    context: CareerContext,
    onStream?: (chunk: StreamingResponse) => void
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Check cache first
    if (this.config.performance.cacheEnabled) {
      const cacheKey = this.generateCacheKey(userMessage, context);
      const cached = this.requestCache.get(cacheKey);
      if (cached) {
        return { ...cached, responseTime: Date.now() - startTime };
      }
    }

    // Try cloud providers in order
    let lastError: Error | null = null;
    
    // 1. Try Gemini first (high quality responses)
    if (this.config.gemini.apiKey) {
      try {
        const response = await this.callGeminiAPI(userMessage, context, onStream);
        this.cacheResponse(userMessage, context, response);
        return { ...response, responseTime: Date.now() - startTime };
      } catch (error) {
        console.warn('Gemini API failed:', error);
        lastError = error as Error;
      }
    }

    // 2. Try HuggingFace as fallback
    if (this.config.huggingface.apiKey) {
      try {
        const response = await this.callHuggingFaceAPI(userMessage, context);
        this.cacheResponse(userMessage, context, response);
        return { ...response, responseTime: Date.now() - startTime };
      } catch (error) {
        console.warn('HuggingFace API failed:', error);
        lastError = error as Error;
      }
    }

    // Both APIs failed
    throw lastError || new Error('No cloud APIs available');
  }

  // Gemini API integration
  private async callGeminiAPI(
    userMessage: string,
    context: CareerContext,
    onStream?: (chunk: StreamingResponse) => void
  ): Promise<AIResponse> {
    return this.geminiRateLimiter.execute(async () => {
      const systemPrompt = this.buildSystemPrompt(context);
      
      // Build conversation history for Gemini
      let fullPrompt = systemPrompt + '\n\n';
      
      // Add previous messages
      context.previousMessages.slice(-4).forEach(msg => {
        if (msg.role === 'user') {
          fullPrompt += `Student: ${msg.content}\n`;
        } else {
          fullPrompt += `Counselor: ${msg.content}\n`;
        }
      });
      
      fullPrompt += `Student: ${userMessage}\nCounselor:`;

      const requestBody = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: this.config.gemini.temperature,
          maxOutputTokens: this.config.gemini.maxTokens,
          topP: 0.95,
          topK: 40
        }
      };

      const url = `${this.config.gemini.baseUrl}/models/${this.config.gemini.model}:generateContent?key=${this.config.gemini.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      return this.handleGeminiResponse(await response.json());
    }, this.config.gemini.rateLimitMs);
  }

  // Handle Gemini response
  private handleGeminiResponse(data: any): AIResponse {
    const candidate = data.candidates?.[0];
    const message = candidate?.content?.parts?.[0]?.text || 'I need more information to help you.';
    
    // Gemini provides safety ratings and finish reasons
    const finishReason = candidate?.finishReason;
    const safetyRatings = candidate?.safetyRatings || [];
    
    // Calculate confidence based on finish reason
    let confidence = 0.9; // Default high confidence for Gemini
    if (finishReason === 'SAFETY') {
      confidence = 0.3; // Low confidence for safety-filtered content
    } else if (finishReason === 'MAX_TOKENS') {
      confidence = 0.7; // Medium confidence for truncated responses
    }
    
    return {
      message: message.trim(),
      isOffline: false,
      source: 'gemini',
      confidence,
      responseTime: 0, // Will be set by caller
      tokensUsed: data.usageMetadata?.totalTokenCount,
      hasSourceCitation: this.hasSourceCitation(message),
    };
  }

  // HuggingFace API integration
  private async callHuggingFaceAPI(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    return this.hfRateLimiter.execute(async () => {
      const systemPrompt = this.buildSystemPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

      const response = await fetch(
        `${this.config.huggingface.baseUrl}/${this.config.huggingface.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.huggingface.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: this.config.huggingface.maxTokens,
              temperature: this.config.huggingface.temperature,
              do_sample: true,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      const message = data[0]?.generated_text || 'Let me help you explore this further.';
      
      return {
        message: message.replace('Assistant:', '').trim(),
        isOffline: false,
        source: 'huggingface',
        confidence: 0.8,
        responseTime: 0, // Will be set by caller
        hasSourceCitation: this.hasSourceCitation(message),
      };
    }, this.config.huggingface.rateLimitMs);
  }

  // Enhanced system prompt builder
  private buildSystemPrompt(context: CareerContext): string {
    const { fullName, classLevel, district } = context;
    const firstName = fullName.split(' ')[0];

    return `You are an expert career counselor specifically for students in Jammu & Kashmir, India.

STUDENT PROFILE:
- Name: ${firstName} (${fullName})
- Academic Level: ${classLevel}
- Location: ${district}, J&K
- Session Date: ${new Date().toLocaleDateString('en-IN')}

YOUR EXPERTISE:
- Deep knowledge of J&K education system and opportunities
- Understanding of local colleges, entrance exams, and job markets
- Awareness of government schemes and scholarships specific to J&K
- Familiarity with success stories from the region

COMMUNICATION STYLE:
- Warm, encouraging, and use the student's name frequently
- Simple language - avoid technical jargon
- Include practical examples and local success stories
- Always end with a specific follow-up question

CONTENT GUIDELINES:
- For 10th students: Focus on stream selection, career exploration, and building foundational skills
- For 12th students: Emphasize entrance exams, college applications, and immediate next steps
- Always mention specific local institutions and opportunities
- Include realistic salary ranges and job prospects
- Reference government schemes like PM-YASASVI, J&K Merit Scholarships
- Keep responses under 200 words for better engagement

SOURCE ATTRIBUTION:
- When mentioning specific facts, colleges, or statistics, indicate the source
- Use phrases like "According to J&K Board data..." or "As per recent placement reports..."
- Mark uncertain information clearly

CULTURAL SENSITIVITY:
- Respect both traditional and modern career aspirations
- Consider family expectations and economic factors
- Be aware of regional challenges and opportunities`;
  }

  // Utility methods
  private generateCacheKey(userMessage: string, context: CareerContext): string {
    const contextHash = `${context.classLevel}-${context.district}-${context.interests.join(',')}`;
    return `${userMessage.toLowerCase()}-${contextHash}`.slice(0, 100);
  }

  private cacheResponse(userMessage: string, context: CareerContext, response: AIResponse) {
    if (!this.config.performance.cacheEnabled) return;
    
    const key = this.generateCacheKey(userMessage, context);
    this.requestCache.set(key, response);
    
    // Clean cache if it exceeds max size
    if (this.requestCache.size > this.config.performance.maxCacheSize) {
      const firstKey = this.requestCache.keys().next().value;
      if (firstKey) {
        this.requestCache.delete(firstKey);
      }
    }
  }

  private hasSourceCitation(message: string): boolean {
    const citationPatterns = [
      'according to',
      'as per',
      'source:',
      'based on',
      'j&k board data',
      'placement reports',
      'government data'
    ];
    
    return citationPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );
  }

  // Public utility methods
  updateConfig(newConfig: ChatbotConfig) {
    this.config = newConfig;
  }

  clearCache() {
    this.requestCache.clear();
  }

  getCacheStats() {
    return {
      size: this.requestCache.size,
      maxSize: this.config.performance.maxCacheSize
    };
  }
}

// Export singleton instance
export const cloudAIService = new CloudAIService();