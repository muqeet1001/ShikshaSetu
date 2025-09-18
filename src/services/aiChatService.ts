import NetInfo from '@react-native-community/netinfo';

// Types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  message: string;
  isOffline: boolean;
  source: 'groq' | 'huggingface' | 'offline' | 'fallback';
  confidence: number;
}

interface CareerContext {
  fullName: string;
  classLevel: '10th' | '12th';
  district: string;
  interests: string[];
  previousMessages: ChatMessage[];
}

class AIChatService {
  private groqApiKey: string = process.env.GROQ_API_KEY || '';
  private hfApiKey: string = process.env.HUGGINGFACE_API_KEY || '';
  private isOnline: boolean = true;
  private requestQueue: any[] = [];
  private rateLimitDelay: number = 1000; // 1 second between requests for free tier

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      console.log(`Network status: ${this.isOnline ? 'Online' : 'Offline'}`);
    });
  }

  // Main chat interface
  async sendMessage(
    userMessage: string, 
    context: CareerContext
  ): Promise<AIResponse> {
    try {
      if (this.isOnline) {
        // Try cloud APIs first (Groq → HuggingFace)
        return await this.tryCloudAPIs(userMessage, context);
      } else {
        // Fallback to offline
        return await this.getOfflineResponse(userMessage, context);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      return await this.getOfflineResponse(userMessage, context);
    }
  }

  // Cloud API handlers
  private async tryCloudAPIs(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    // Try Groq first (faster inference)
    try {
      return await this.callGroqAPI(userMessage, context);
    } catch (groqError) {
      console.warn('Groq API failed, trying HuggingFace:', groqError);
      
      try {
        return await this.callHuggingFaceAPI(userMessage, context);
      } catch (hfError) {
        console.warn('HuggingFace API failed, using offline:', hfError);
        return await this.getOfflineResponse(userMessage, context);
      }
    }
  }

  // Groq API integration
  private async callGroqAPI(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    await this.rateLimitWait();

    const systemPrompt = this.buildSystemPrompt(context);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.previousMessages.slice(-6), // Last 6 messages for context
      { role: 'user' as const, content: userMessage }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast, good for conversations
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false, // Set to true for streaming if needed
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || 'I need more information to help you.',
      isOffline: false,
      source: 'groq',
      confidence: 0.9,
    };
  }

  // HuggingFace API integration
  private async callHuggingFaceAPI(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    await this.rateLimitWait();

    const systemPrompt = this.buildSystemPrompt(context);
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data[0]?.generated_text?.split('Assistant:').pop()?.trim() || 'Let me help you explore this further.',
      isOffline: false,
      source: 'huggingface',
      confidence: 0.8,
    };
  }

  // Offline fallback responses
  private async getOfflineResponse(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for offline mode
    const responses = this.getOfflinePatternResponses(lowerMessage, context);
    
    return {
      message: responses.message,
      isOffline: true,
      source: 'offline',
      confidence: responses.confidence,
    };
  }

  // Offline pattern matching
  private getOfflinePatternResponses(message: string, context: CareerContext) {
    const { classLevel, district, fullName } = context;
    const firstName = fullName.split(' ')[0];

    // Career-related patterns
    if (message.includes('doctor') || message.includes('medical')) {
      return {
        message: `Great choice, ${firstName}! To become a doctor:\n\n📚 **Stream**: Science (Biology, Chemistry, Physics)\n🎯 **Exam**: NEET\n🏥 **Colleges in J&K**: GMC Srinagar, GMC Jammu\n📊 **Success Rate**: 40+ students from ${district} got medical seats last year\n\nWould you like to know about NEET preparation?`,
        confidence: 0.9
      };
    }

    if (message.includes('engineer') || message.includes('technical')) {
      return {
        message: `Engineering is excellent, ${firstName}! Here's your path:\n\n🔧 **Stream**: Science (Physics, Chemistry, Math)\n📝 **Exams**: JEE Main, JEE Advanced\n🏫 **Local Options**: NIT Srinagar, IIIT Kashmir\n📈 **Placement**: 85% students get jobs after engineering\n\nWhich engineering field interests you most?`,
        confidence: 0.9
      };
    }

    if (message.includes('teach') || message.includes('education')) {
      return {
        message: `Teaching is a noble profession, ${firstName}!\n\n📖 **Options**: B.Ed, Subject specialization\n🎓 **Requirements**: Graduate degree + B.Ed\n💼 **Opportunities**: Schools, coaching centers, online tutoring\n👨‍🏫 **Success**: Many teachers from ${district} are making great impact\n\nWhich subjects do you want to teach?`,
        confidence: 0.8
      };
    }

    // Class-specific responses
    if (classLevel === '10th') {
      if (message.includes('stream') || message.includes('subject')) {
        return {
          message: `Let's choose your stream wisely, ${firstName}!\n\n🔬 **Science**: For engineering, medical, research\n💼 **Commerce**: For business, CA, management\n🎨 **Arts**: For civil services, teaching, media\n⚙️ **Vocational**: For immediate job skills\n\nWhat kind of work excites you most?`,
          confidence: 0.8
        };
      }
    }

    // General encouragement
    const generalResponses = [
      `That's interesting, ${firstName}! Tell me more about what specifically excites you about this.`,
      `I understand your interest. Let's explore this further - what draws you to this field?`,
      `Great thinking! In ${district}, we have good opportunities in this area. What would you like to know more about?`,
      `${firstName}, you're asking the right questions! Let's break this down step by step.`
    ];

    return {
      message: generalResponses[Math.floor(Math.random() * generalResponses.length)],
      confidence: 0.6
    };
  }

  // System prompt builder
  private buildSystemPrompt(context: CareerContext): string {
    const { fullName, classLevel, district } = context;
    const firstName = fullName.split(' ')[0];

    return `You are a friendly career counselor for students in Jammu & Kashmir, India. 

STUDENT INFO:
- Name: ${firstName} (${fullName})
- Class: ${classLevel}
- Location: ${district}, J&K

YOUR ROLE:
- Be warm, encouraging, and use the student's name
- Give practical advice specific to J&K opportunities
- Include local colleges, success stories, and realistic job prospects
- Use simple language - avoid complex terms
- Ask follow-up questions to understand their interests better

GUIDELINES:
- For 10th students: Focus on stream selection and career exploration
- For 12th students: Focus on entrance exams and college admissions
- Always mention local examples and success stories from J&K
- Include parent-friendly information (job prospects, salary ranges)
- Keep responses under 200 words
- Ask one specific question to continue the conversation

TONE: Friendly, supportive, like talking to a younger sibling`;
  }

  // Rate limiting for free tiers
  private async rateLimitWait(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
  }

  // Utility methods
  public setOfflineMode(offline: boolean) {
    this.isOnline = !offline;
  }

  public getConnectionStatus(): boolean {
    return this.isOnline;
  }
}

// Export singleton instance
export const aiChatService = new AIChatService();
export type { AIResponse, CareerContext };