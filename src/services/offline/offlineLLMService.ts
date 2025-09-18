import { ChatbotConfig, getEnvironmentConfig } from '../../config/chatbotConfig';
import { AIResponse, CareerContext, ChatMessage } from '../ai/cloudAIService';

// Offline Response Patterns
interface OfflinePattern {
  keywords: string[];
  response: string;
  confidence: number;
  category: 'career' | 'stream' | 'education' | 'general';
}

// On-device LLM Service
class OfflineLLMService {
  private config: ChatbotConfig;
  private responsePatterns: OfflinePattern[] = [];
  private isModelLoaded = false;

  constructor(config?: ChatbotConfig) {
    this.config = config || getEnvironmentConfig();
    this.initializePatterns();
  }

  // Initialize offline response patterns
  private initializePatterns() {
    this.responsePatterns = [
      // Medical/Doctor patterns
      {
        keywords: ['doctor', 'medical', 'medicine', 'mbbs', 'surgeon', 'physician'],
        response: `Great choice! To become a doctor in J&K:

📚 **Stream Required**: Science (Biology, Chemistry, Physics)
🎯 **Entrance Exam**: NEET
🏥 **Top Colleges**: GMC Srinagar, GMC Jammu
💰 **Scholarship**: PM-YASASVI, J&K Merit scholarships
📈 **Success Rate**: 40+ students from rural J&K clear NEET yearly

**Next Steps:**
1. Choose Science stream in 11th
2. Focus on NCERT Biology & Chemistry
3. Join coaching or online prep (affordable options available)

What specific medical field interests you most?`,
        confidence: 0.9,
        category: 'career'
      },

      // Engineering patterns
      {
        keywords: ['engineer', 'engineering', 'technical', 'jee', 'computer', 'civil', 'mechanical'],
        response: `Excellent choice! Engineering path in J&K:

🔧 **Stream Required**: Science (Physics, Chemistry, Maths)
📝 **Entrance Exams**: JEE Main, JEE Advanced
🏫 **Local Options**: NIT Srinagar, IIIT Kashmir, GCET
💼 **Job Market**: 85% placement rate, ₹4-15L starting salary
🎓 **Specializations**: Computer, Civil, Electrical, Mechanical

**Quick Start Plan:**
1. Master Physics & Maths fundamentals
2. Practice JEE previous papers
3. Consider free online resources (Khan Academy, NPTEL)

Which engineering field excites you - software, construction, or machines?`,
        confidence: 0.9,
        category: 'career'
      },

      // Teaching patterns
      {
        keywords: ['teacher', 'teaching', 'education', 'professor', 'tutor'],
        response: `Teaching is a noble profession! Here's your path in J&K:

📖 **Requirements**: Graduate degree + B.Ed
🎓 **Best Options**: Subject specialization + Teaching methods
💼 **Opportunities**: Govt schools, private coaching, online tutoring
💰 **Salary Range**: ₹25,000-₹80,000/month (govt teacher)
🏆 **Advantage**: Secure job, social respect, holidays

**Career Steps:**
1. Choose your favorite subject for graduation
2. Complete B.Ed from recognized college
3. Appear for J&K TET/School Service Selection

What subjects do you enjoy teaching to friends?`,
        confidence: 0.8,
        category: 'career'
      },

      // Business/Commerce patterns
      {
        keywords: ['business', 'commerce', 'ca', 'management', 'entrepreneur', 'shop'],
        response: `Great business mindset! Commerce opportunities in J&K:

💼 **Stream Options**: Commerce, Business Studies
🎯 **Career Paths**: CA, CS, MBA, own business
📊 **Local Scope**: Tourism, handicrafts, agriculture business
💰 **Earning Potential**: ₹30,000-₹2,00,000+ (varies by role)

**Popular Options:**
- **CA**: 3-year course, high-paying (₹8-50L annually)
- **MBA**: After graduation, management roles
- **Own Business**: Use local resources, tourism

**Government Support:**
- MUDRA loans for startups
- Skill development programs

What type of business interests you - traditional or modern?`,
        confidence: 0.8,
        category: 'career'
      },

      // Stream selection patterns
      {
        keywords: ['stream', 'subject', '11th', 'science', 'commerce', 'arts'],
        response: `Perfect timing for stream selection! Here's the guide:

🔬 **Science**: For engineering, medical, research careers
- Subjects: Physics, Chemistry, Biology/Maths
- Best for: Logical thinking, problem-solving
- Job scope: Doctor, Engineer, Scientist

💼 **Commerce**: For business, finance, management
- Subjects: Accountancy, Business Studies, Economics
- Best for: Numbers, business sense
- Job scope: CA, Manager, Entrepreneur

🎨 **Arts/Humanities**: For civil services, teaching, media
- Subjects: History, Political Science, Psychology
- Best for: Reading, writing, social understanding
- Job scope: IAS, Teacher, Journalist

What activities do you enjoy most - solving problems, managing things, or helping people?`,
        confidence: 0.9,
        category: 'stream'
      },

      // College/Education patterns
      {
        keywords: ['college', 'university', 'admission', 'course', 'degree'],
        response: `Let's plan your higher education in J&K:

🏫 **Top Universities**:
- University of Kashmir (Srinagar)
- University of Jammu
- SKUAST (Agricultural)
- NIT Srinagar (Technical)

📋 **Admission Process**:
- Merit-based for most courses
- Entrance exams for professional courses
- Reservation as per J&K policy

💰 **Financial Support**:
- Fee waivers for economically weak
- Scholarship schemes available
- Education loans at low interest

**Important Dates**: Most admissions start June-July

Which field are you most interested in for your degree?`,
        confidence: 0.7,
        category: 'education'
      },

      // General encouragement patterns
      {
        keywords: ['confused', 'don\'t know', 'help', 'guide', 'lost'],
        response: `It's completely normal to feel confused - you're making important life decisions!

🎯 **Let's break it down step by step:**

1. **What subjects do you enjoy most in school?**
2. **Do you like helping people or solving technical problems?**
3. **Are you more interested in creative work or structured work?**
4. **Do you prefer working alone or with teams?**

💪 **Remember**: 
- Every successful person started with questions
- Many J&K students have found their path through exploration
- There's no "wrong" choice, only different paths

Let's start simple - tell me about one subject or activity that makes you excited!`,
        confidence: 0.6,
        category: 'general'
      },

      // Local/J&K specific patterns
      {
        keywords: ['kashmir', 'jammu', 'srinagar', 'j&k', 'local', 'here'],
        response: `Great to see interest in local opportunities! J&K has amazing potential:

🌟 **Growing Sectors**:
- **Tourism**: Hotel management, guide services
- **Agriculture**: Organic farming, food processing  
- **Handicrafts**: Traditional crafts with modern marketing
- **IT**: Growing tech sector in Srinagar

🏛️ **Government Jobs**:
- J&K Administrative Service
- Banking sector (J&K Bank preference)
- Teaching positions
- Police and civil services

🎓 **Local Success Stories**:
Many students from remote areas are now doctors, engineers, and IAS officers!

**Advantage**: Local knowledge + modern skills = perfect combination

What aspect of J&K's development interests you most?`,
        confidence: 0.8,
        category: 'general'
      }
    ];
  }

  // Main offline processing method
  async processOfflineQuery(
    userMessage: string,
    context: CareerContext
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Try pattern matching first
    const patternResponse = this.matchPatterns(userMessage, context);
    
    if (patternResponse.confidence >= 0.6) {
      return {
        ...patternResponse,
        responseTime: Date.now() - startTime,
        isOffline: true,
        source: 'offline'
      };
    }

    // Fallback to generic response
    const fallbackResponse = this.generateFallbackResponse(userMessage, context);
    
    return {
      ...fallbackResponse,
      responseTime: Date.now() - startTime,
      isOffline: true,
      source: 'fallback'
    };
  }

  // Pattern matching algorithm
  private matchPatterns(userMessage: string, context: CareerContext): Omit<AIResponse, 'responseTime' | 'isOffline' | 'source'> {
    const lowerMessage = userMessage.toLowerCase();
    let bestMatch: OfflinePattern | null = null;
    let highestScore = 0;

    // Score each pattern
    for (const pattern of this.responsePatterns) {
      let score = 0;
      let matchedKeywords = 0;

      // Check keyword matches
      for (const keyword of pattern.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          matchedKeywords++;
          score += 1;
        }
      }

      // Boost score for multiple keyword matches
      if (matchedKeywords > 1) {
        score = score * 1.5;
      }

      // Context-based scoring
      if (context.classLevel === '10th' && pattern.category === 'stream') {
        score += 0.5;
      }
      
      if (context.interests.some(interest => 
        pattern.keywords.some(keyword => 
          interest.toLowerCase().includes(keyword.toLowerCase())
        )
      )) {
        score += 0.3;
      }

      // Update best match
      if (score > highestScore && score > 0) {
        highestScore = score;
        bestMatch = pattern;
      }
    }

    if (bestMatch) {
      const personalizedResponse = this.personalizeResponse(bestMatch.response, context);
      return {
        message: personalizedResponse,
        confidence: Math.min(bestMatch.confidence * (highestScore / bestMatch.keywords.length), 1),
        hasSourceCitation: false
      };
    }

    // No good pattern match
    return {
      message: '',
      confidence: 0,
      hasSourceCitation: false
    };
  }

  // Personalize response with user context
  private personalizeResponse(response: string, context: CareerContext): string {
    const { fullName, district, classLevel } = context;
    const firstName = fullName.split(' ')[0];

    let personalizedResponse = response;

    // Add personal touches
    personalizedResponse = personalizedResponse.replace(/\{firstName\}/g, firstName);
    personalizedResponse = personalizedResponse.replace(/\{district\}/g, district);
    personalizedResponse = personalizedResponse.replace(/\{classLevel\}/g, classLevel);

    // Add opening greeting randomly
    const greetings = [
      `Hi ${firstName}! `,
      `Great question, ${firstName}! `,
      `${firstName}, I'm excited to help! `,
      `Perfect timing, ${firstName}! `
    ];

    if (Math.random() > 0.5) {
      personalizedResponse = greetings[Math.floor(Math.random() * greetings.length)] + personalizedResponse;
    }

    return personalizedResponse;
  }

  // Generate fallback response when no patterns match
  private generateFallbackResponse(userMessage: string, context: CareerContext): Omit<AIResponse, 'responseTime' | 'isOffline' | 'source'> {
    const { fullName, classLevel, district } = context;
    const firstName = fullName.split(' ')[0];

    const fallbackResponses = [
      `That's an interesting question, ${firstName}! While I don't have specific information about that in offline mode, I can help you explore career options that might relate to your interests. What subjects do you enjoy most in ${classLevel} class?`,
      
      `${firstName}, I want to give you the best possible guidance! Since I'm in offline mode right now, let me ask - are you more interested in careers that involve helping people, working with technology, or being creative? This will help me suggest the right path for you.`,
      
      `Good question! From ${district}, many students have succeeded in various fields. Since I'm offline right now, let me help you think through this step by step. What kind of work environment appeals to you - indoors like in offices, or outdoors like in fields?`,
      
      `${firstName}, I appreciate your question! In offline mode, I can still guide you with career basics. For ${classLevel} students, the most important thing is choosing the right stream. Are you leaning more towards Science, Commerce, or Arts subjects?`
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      message: randomResponse,
      confidence: 0.5,
      hasSourceCitation: false
    };
  }

  // GGUF Model Integration (Placeholder for future implementation)
  async loadGGUFModel(): Promise<boolean> {
    try {
      // This would integrate with llama.cpp GGUF models
      // For now, we return true to indicate patterns are loaded
      console.log('Offline patterns loaded successfully');
      this.isModelLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load offline model:', error);
      return false;
    }
  }

  // Model status
  isOfflineModelReady(): boolean {
    return this.isModelLoaded;
  }

  // Get model info
  getModelInfo() {
    return {
      modelType: 'Pattern-based with GGUF placeholder',
      size: this.responsePatterns.length + ' patterns',
      loaded: this.isModelLoaded,
      capabilities: [
        'Career guidance',
        'Stream selection',
        'Local J&K opportunities',
        'Educational pathways'
      ]
    };
  }

  // Update configuration
  updateConfig(newConfig: ChatbotConfig) {
    this.config = newConfig;
  }
}

// Export singleton
export const offlineLLMService = new OfflineLLMService();

// Additional utility types
export interface OfflineModelStatus {
  isLoaded: boolean;
  modelPath: string;
  size: string;
  capabilities: string[];
}