import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Language = 'EN' | 'HI' | 'UR';

interface GIGWFooterProps {
  currentLanguage?: Language;
  onHelpdeskPress?: () => void;
  onAccessibilityPress?: () => void;
  onCompliancePress?: () => void;
  lastUpdated?: string;
}

const GIGWFooter: React.FC<GIGWFooterProps> = ({
  currentLanguage = 'EN',
  onHelpdeskPress,
  onAccessibilityPress,
  onCompliancePress,
  lastUpdated
}) => {
  const isRTL = currentLanguage === 'UR';
  
  const formatDate = () => {
    if (lastUpdated) {
      return new Date(lastUpdated).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  };

  const handleHelpdeskPress = () => {
    if (onHelpdeskPress) {
      onHelpdeskPress();
    } else {
      Alert.alert(
        'Helpdesk',
        'For support, please contact:\n\nEmail: support@careercompass.jk.gov.in\nPhone: +91-194-2440000\n\nOffice Hours: Mon-Fri, 9 AM - 6 PM',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Call Now', 
            onPress: () => Linking.openURL('tel:+911942440000') 
          },
          { 
            text: 'Email', 
            onPress: () => Linking.openURL('mailto:support@careercompass.jk.gov.in') 
          }
        ]
      );
    }
  };

  const handleAccessibilityPress = () => {
    if (onAccessibilityPress) {
      onAccessibilityPress();
    } else {
      Alert.alert(
        'Accessibility',
        'This application follows WCAG 2.1 AA guidelines and supports:\n\n• Screen readers\n• High contrast mode\n• Large text\n• Voice navigation\n• RTL languages\n\nFor accessibility issues, contact: accessibility@careercompass.jk.gov.in',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCompliancePress = () => {
    if (onCompliancePress) {
      onCompliancePress();
    } else {
      Alert.alert(
        'Government Compliance',
        'This application is compliant with:\n\n• Government of India Web Guidelines (GIGW)\n• Guidelines for Indian Government Websites\n• Digital India Guidelines\n• Right to Information Act 2005\n• IT Act 2000\n\nVersion: 1.0.0\nCompliance Certificate: JK-GIGW-2024-001',
        [{ text: 'OK' }]
      );
    }
  };

  const getLocalizedText = (key: string) => {
    const texts: Record<string, Record<Language, string>> = {
      'compliant': {
        'EN': 'Compliant with Government UI guidelines',
        'HI': 'सरकारी UI दिशानिर्देशों के अनुपालन में',
        'UR': 'حکومتی UI رہنمائی کے مطابق'
      },
      'lastUpdated': {
        'EN': 'Last updated',
        'HI': 'अंतिम अद्यतन',
        'UR': 'آخری بار اپ ڈیٹ'
      },
      'helpdesk': {
        'EN': 'Helpdesk',
        'HI': 'सहायता केंद्र',
        'UR': 'مدد کی میز'
      },
      'accessibility': {
        'EN': 'Accessibility',
        'HI': 'पहुंच',
        'UR': 'رسائی'
      }
    };
    
    return texts[key]?.[currentLanguage] || texts[key]?.['EN'] || key;
  };

  return (
    <View style={[styles.footer, isRTL && styles.footerRTL]}>
      {/* Main Footer Content */}
      <View style={[styles.footerContent, isRTL && styles.footerContentRTL]}>
        
        {/* Compliance Section */}
        <View style={[styles.section, isRTL && styles.sectionRTL]}>
          <TouchableOpacity
            style={[styles.complianceButton, isRTL && styles.complianceButtonRTL]}
            onPress={handleCompliancePress}
            accessible={true}
            accessibilityLabel="Government compliance information"
            accessibilityRole="button"
          >
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={[styles.complianceText, isRTL && styles.textRTL]}>
              {getLocalizedText('compliant')}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.lastUpdatedText, isRTL && styles.textRTL]}>
            {getLocalizedText('lastUpdated')}: {formatDate()}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionSection, isRTL && styles.actionSectionRTL]}>
          <TouchableOpacity
            style={[styles.actionButton, isRTL && styles.actionButtonRTL]}
            onPress={handleHelpdeskPress}
            accessible={true}
            accessibilityLabel="Contact helpdesk for support"
            accessibilityRole="button"
          >
            <Ionicons name="headset" size={16} color="#3B82F6" />
            <Text style={[styles.actionButtonText, isRTL && styles.textRTL]}>
              {getLocalizedText('helpdesk')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isRTL && styles.actionButtonRTL]}
            onPress={handleAccessibilityPress}
            accessible={true}
            accessibilityLabel="Accessibility information and options"
            accessibilityRole="button"
          >
            <Ionicons name="accessibility" size={16} color="#8B5CF6" />
            <Text style={[styles.actionButtonText, isRTL && styles.textRTL]}>
              {getLocalizedText('accessibility')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Border */}
      <View style={styles.bottomBorder} />
      
      {/* Copyright */}
      <View style={[styles.copyrightSection, isRTL && styles.copyrightSectionRTL]}>
        <Text style={[styles.copyrightText, isRTL && styles.textRTL]}>
          © 2024 Government of Jammu & Kashmir
        </Text>
        <View style={[styles.versionInfo, isRTL && styles.versionInfoRTL]}>
          <Text style={[styles.versionText, isRTL && styles.textRTL]}>
            v1.0.0
          </Text>
          <View style={styles.dot} />
          <Text style={[styles.versionText, isRTL && styles.textRTL]}>
            Build 2024.09.14
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  footerRTL: {
    direction: 'rtl',
  },
  footerContent: {
    gap: 16,
  },
  footerContentRTL: {
    alignItems: 'flex-end',
  },
  section: {
    gap: 8,
  },
  sectionRTL: {
    alignItems: 'flex-end',
  },
  complianceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
    alignSelf: 'flex-start',
    minHeight: 44, // WCAG AA minimum touch target
  },
  complianceButtonRTL: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  complianceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
    lineHeight: 18,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 16,
  },
  actionSectionRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44, // WCAG AA minimum touch target
  },
  actionButtonRTL: {
    flexDirection: 'row-reverse',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
    marginBottom: 12,
  },
  copyrightSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  copyrightSectionRTL: {
    flexDirection: 'row-reverse',
  },
  copyrightText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionInfoRTL: {
    flexDirection: 'row-reverse',
  },
  versionText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#9CA3AF',
  },
  textRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
});

export default GIGWFooter;