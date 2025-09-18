import { ChatbotConfig, getEnvironmentConfig } from '../config/chatbotConfig';
import { HybridResponse } from './hybridAIOrchestrator';

// Compliance and source attribution types
export interface SourceAttribution {
  type: 'government_data' | 'verified_institution' | 'academic_source' | 'local_knowledge' | 'ai_generated';
  source: string;
  reliability: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  disclaimers?: string[];
}

export interface ComplianceInfo {
  hasAttribution: boolean;
  sources: SourceAttribution[];
  confidenceLevel: 'high' | 'medium' | 'low';
  disclaimers: string[];
  isOfflineGenerated: boolean;
  requiresVerification: boolean;
}

export interface EnhancedResponse extends HybridResponse {
  compliance: ComplianceInfo;
  formattedMessage: string;
}

// Known reliable sources for J&K career information
const TRUSTED_SOURCES = {
  // Government sources
  'jk_board': {
    name: 'J&K State Board of School Education',
    type: 'government_data' as const,
    reliability: 'high' as const,
    website: 'jkbose.ac.in'
  },
  'jk_government': {
    name: 'Jammu & Kashmir Government',
    type: 'government_data' as const,
    reliability: 'high' as const,
    website: 'jk.gov.in'
  },
  'aicte': {
    name: 'All India Council for Technical Education',
    type: 'government_data' as const,
    reliability: 'high' as const,
    website: 'aicte-india.org'
  },
  'ugc': {
    name: 'University Grants Commission',
    type: 'government_data' as const,
    reliability: 'high' as const,
    website: 'ugc.ac.in'
  },
  
  // Educational institutions
  'nit_srinagar': {
    name: 'NIT Srinagar',
    type: 'verified_institution' as const,
    reliability: 'high' as const,
    website: 'nitsri.net'
  },
  'kashmir_university': {
    name: 'University of Kashmir',
    type: 'verified_institution' as const,
    reliability: 'high' as const,
    website: 'kashmiruniversity.net'
  },
  'jammu_university': {
    name: 'University of Jammu',
    type: 'verified_institution' as const,
    reliability: 'high' as const,
    website: 'jammuuniversity.ac.in'
  },
  'gmc_srinagar': {
    name: 'Government Medical College, Srinagar',
    type: 'verified_institution' as const,
    reliability: 'high' as const,
    website: 'gmcsrinagar.edu.in'
  },
  
  // Academic and research sources
  'ncert': {
    name: 'National Council of Educational Research and Training',
    type: 'academic_source' as const,
    reliability: 'high' as const,
    website: 'ncert.nic.in'
  },
  'niepa': {
    name: 'National Institute of Educational Planning and Administration',
    type: 'academic_source' as const,
    reliability: 'medium' as const,
    website: 'niepa.ac.in'
  }
};

class ComplianceService {
  private config: ChatbotConfig;

  constructor(config?: ChatbotConfig) {
    this.config = config || getEnvironmentConfig();
  }

  // Analyze and enhance response with compliance information
  enhanceResponseWithCompliance(response: HybridResponse): EnhancedResponse {
    const compliance = this.analyzeCompliance(response);
    const formattedMessage = this.formatMessageWithAttribution(response.message, compliance);

    return {
      ...response,
      compliance,
      formattedMessage
    };
  }

  // Analyze response for compliance requirements
  private analyzeCompliance(response: HybridResponse): ComplianceInfo {
    const sources = this.extractSources(response.message);
    const hasAttribution = sources.length > 0 || response.hasSourceCitation;
    const confidenceLevel = this.determineConfidenceLevel(response);
    const disclaimers = this.generateDisclaimers(response);
    const requiresVerification = this.shouldRequireVerification(response);

    return {
      hasAttribution,
      sources,
      confidenceLevel,
      disclaimers,
      isOfflineGenerated: response.isOffline,
      requiresVerification
    };
  }

  // Extract source attributions from message content
  private extractSources(message: string): SourceAttribution[] {
    const sources: SourceAttribution[] = [];
    const lowerMessage = message.toLowerCase();

    // Check for government data mentions
    if (lowerMessage.includes('j&k board') || lowerMessage.includes('jkbose')) {
      sources.push({
        type: 'government_data',
        source: TRUSTED_SOURCES.jk_board.name,
        reliability: 'high',
        lastUpdated: new Date().getFullYear().toString()
      });
    }

    // Check for college mentions
    if (lowerMessage.includes('nit srinagar')) {
      sources.push({
        type: 'verified_institution',
        source: TRUSTED_SOURCES.nit_srinagar.name,
        reliability: 'high'
      });
    }

    if (lowerMessage.includes('gmc') || lowerMessage.includes('government medical college')) {
      sources.push({
        type: 'verified_institution',
        source: TRUSTED_SOURCES.gmc_srinagar.name,
        reliability: 'high'
      });
    }

    // Check for entrance exam information
    if (lowerMessage.includes('neet') || lowerMessage.includes('jee')) {
      sources.push({
        type: 'government_data',
        source: 'National Testing Agency (NTA)',
        reliability: 'high'
      });
    }

    // Check for placement/salary statistics
    if (lowerMessage.includes('placement') || lowerMessage.includes('₹') || lowerMessage.includes('salary')) {
      sources.push({
        type: 'academic_source',
        source: 'Educational Institution Reports',
        reliability: 'medium',
        disclaimers: ['Salary figures are approximate and may vary based on various factors']
      });
    }

    return sources;
  }

  // Determine overall confidence level
  private determineConfidenceLevel(response: HybridResponse): 'high' | 'medium' | 'low' {
    // Cloud responses with citations get high confidence
    if (!response.isOffline && response.hasSourceCitation && response.confidence >= 0.8) {
      return 'high';
    }

    // Offline responses with good pattern matching get medium confidence
    if (response.isOffline && response.confidence >= 0.7) {
      return 'medium';
    }

    // Fallback responses or low confidence get low rating
    if (response.source === 'fallback' || response.confidence < 0.6) {
      return 'low';
    }

    return 'medium';
  }

  // Generate appropriate disclaimers
  private generateDisclaimers(response: HybridResponse): string[] {
    const disclaimers: string[] = [];

    // Offline mode disclaimer
    if (response.isOffline) {
      disclaimers.push('Generated in offline mode using local knowledge base');
    }

    // Fallback disclaimer
    if (response.source === 'fallback') {
      disclaimers.push('This is a general response - please verify specific details from official sources');
    }

    // Low confidence disclaimer
    if (response.confidence < 0.6) {
      disclaimers.push('This information may not be complete - consider consulting multiple sources');
    }

    // Career guidance disclaimer
    if (response.message.toLowerCase().includes('career') || response.message.toLowerCase().includes('job')) {
      disclaimers.push('Career guidance is based on general trends and may not reflect individual outcomes');
    }

    // Financial information disclaimer
    if (response.message.includes('₹') || response.message.toLowerCase().includes('salary')) {
      disclaimers.push('Salary figures are approximate and may vary significantly based on location, experience, and market conditions');
    }

    // Admission/entrance exam disclaimer
    if (response.message.toLowerCase().includes('admission') || response.message.toLowerCase().includes('entrance')) {
      disclaimers.push('Admission processes and requirements may change - always verify with official institution websites');
    }

    return disclaimers;
  }

  // Determine if response requires verification
  private shouldRequireVerification(response: HybridResponse): boolean {
    const message = response.message.toLowerCase();
    
    // Require verification for critical information
    const criticalKeywords = [
      'admission deadline',
      'fee structure',
      'cut-off',
      'eligibility criteria',
      'entrance exam date',
      'scholarship amount',
      'placement statistics'
    ];

    return criticalKeywords.some(keyword => message.includes(keyword)) && response.confidence < 0.8;
  }

  // Format message with proper source attribution
  private formatMessageWithAttribution(message: string, compliance: ComplianceInfo): string {
    let formattedMessage = message;

    // Add source citations if available
    if (compliance.sources.length > 0) {
      formattedMessage += '\n\n**Sources:**';
      
      compliance.sources.forEach((source, index) => {
        const reliability = source.reliability === 'high' ? '✓' : 
                          source.reliability === 'medium' ? '⚠️' : '❓';
        formattedMessage += `\n${reliability} ${source.source}`;
        
        if (source.lastUpdated) {
          formattedMessage += ` (${source.lastUpdated})`;
        }
      });
    }

    // Add confidence indicator
    const confidenceEmoji = compliance.confidenceLevel === 'high' ? '🔹' :
                           compliance.confidenceLevel === 'medium' ? '🔸' : '🔹';
    
    formattedMessage += `\n\n${confidenceEmoji} **Confidence: ${compliance.confidenceLevel.toUpperCase()}**`;

    // Add disclaimers
    if (compliance.disclaimers.length > 0) {
      formattedMessage += '\n\n**Important Notes:**';
      compliance.disclaimers.forEach(disclaimer => {
        formattedMessage += `\n• ${disclaimer}`;
      });
    }

    // Add verification reminder for critical information
    if (compliance.requiresVerification) {
      formattedMessage += '\n\n⚠️ **Please verify this information from official sources before making important decisions.**';
    }

    // Add offline mode indicator
    if (compliance.isOfflineGenerated) {
      formattedMessage += '\n\n📱 *Generated in offline mode - connect to internet for latest updates*';
    }

    return formattedMessage;
  }

  // Generate compliance report for monitoring
  generateComplianceReport(responses: EnhancedResponse[]): {
    totalResponses: number;
    attributedResponses: number;
    confidenceLevels: Record<string, number>;
    commonSources: Record<string, number>;
    offlineResponses: number;
  } {
    const report = {
      totalResponses: responses.length,
      attributedResponses: responses.filter(r => r.compliance.hasAttribution).length,
      confidenceLevels: { high: 0, medium: 0, low: 0 },
      commonSources: {} as Record<string, number>,
      offlineResponses: responses.filter(r => r.compliance.isOfflineGenerated).length
    };

    responses.forEach(response => {
      // Count confidence levels
      report.confidenceLevels[response.compliance.confidenceLevel]++;
      
      // Count source types
      response.compliance.sources.forEach(source => {
        report.commonSources[source.type] = (report.commonSources[source.type] || 0) + 1;
      });
    });

    return report;
  }

  // Update configuration
  updateConfig(newConfig: ChatbotConfig): void {
    this.config = newConfig;
  }
}

// Export singleton instance
export const complianceService = new ComplianceService();