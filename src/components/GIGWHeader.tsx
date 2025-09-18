import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Language = 'EN' | 'HI' | 'UR';

interface GIGWHeaderProps {
  title?: string;
  issuer?: string;
  showEmblem?: boolean;
  showLanguageSwitch?: boolean;
  onLanguageChange?: (language: Language) => void;
  currentLanguage?: Language;
}

const GIGWHeader: React.FC<GIGWHeaderProps> = ({
  title = 'CareerCompass',
  issuer = 'Government of Jammu & Kashmir',
  showEmblem = true,
  showLanguageSwitch = true,
  onLanguageChange,
  currentLanguage = 'EN'
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'EN', name: 'English', nativeName: 'English' },
    { code: 'HI', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'UR', name: 'Urdu', nativeName: 'اردو' }
  ];

  const handleLanguageSelect = (language: Language) => {
    setShowLanguageMenu(false);
    onLanguageChange?.(language);
    Alert.alert(
      'Language Changed',
      `Language switched to ${languages.find(l => l.code === language)?.name}`,
      [{ text: 'OK' }]
    );
  };

  const isRTL = currentLanguage === 'UR';

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.theme.blue} 
        translucent={false}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.theme.blue }]}>
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          {/* Emblem and Title */}
          <View style={[styles.titleSection, isRTL && styles.titleSectionRTL]}>
            {showEmblem && (
              <View style={styles.emblem}>
                <View style={styles.logoContainer}>
                  <Image 
                    source={require('../../assets/logo.png')} 
                    style={styles.headerLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
            <View style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}>
              <Text style={[styles.title, isRTL && styles.titleRTL]}>
                {title}
              </Text>
              <Text style={[styles.issuer, isRTL && styles.issuerRTL]}>
                {issuer}
              </Text>
            </View>
          </View>

          {/* Language Switch */}
          {showLanguageSwitch && (
            <View style={styles.languageSection}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                accessible={true}
                accessibilityLabel={`Current language: ${languages.find(l => l.code === currentLanguage)?.name}`}
                accessibilityHint="Tap to change language"
                accessibilityRole="button"
              >
                <Ionicons name="language" size={20} color="#FFFFFF" />
                <Text style={styles.languageText}>
                  {languages.find(l => l.code === currentLanguage)?.code}
                </Text>
                <Ionicons 
                  name={showLanguageMenu ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>

              {/* Language Menu */}
              {showLanguageMenu && (
                <View style={[styles.languageMenu, isRTL && styles.languageMenuRTL]}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      style={[
                        styles.languageMenuItem,
                        currentLanguage === language.code && styles.languageMenuItemActive,
                        isRTL && styles.languageMenuItemRTL
                      ]}
                      onPress={() => handleLanguageSelect(language.code)}
                      accessible={true}
                      accessibilityLabel={`Switch to ${language.name}`}
                      accessibilityRole="button"
                    >
                      <Text style={[
                        styles.languageMenuText,
                        currentLanguage === language.code && styles.languageMenuTextActive,
                        isRTL && styles.languageMenuTextRTL
                      ]}>
                        {language.nativeName}
                      </Text>
                      {currentLanguage === language.code && (
                        <Ionicons name="checkmark" size={16} color={colors.theme.orange} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.theme.blue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.theme.blue,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleSectionRTL: {
    flexDirection: 'row-reverse',
  },
  emblem: {
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.theme.white,
    padding: 4,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerRTL: {
    alignItems: 'flex-end',
    marginRight: 12,
    marginLeft: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  titleRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
  issuer: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 2,
    lineHeight: 16,
  },
  issuerRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
  languageSection: {
    position: 'relative',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    minHeight: 44, // WCAG AA minimum touch target
    minWidth: 44,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  languageMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    minWidth: 140,
  },
  languageMenuRTL: {
    right: 'auto',
    left: 0,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 48, // WCAG AA minimum touch target
  },
  languageMenuItemRTL: {
    flexDirection: 'row-reverse',
  },
  languageMenuItemActive: {
    backgroundColor: colors.theme.lightBlue, // Light blue background
  },
  languageMenuText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  languageMenuTextRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
  languageMenuTextActive: {
    color: colors.theme.orange,
    fontWeight: '600',
  },
});

export default GIGWHeader;