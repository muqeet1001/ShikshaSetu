import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { GradientButton } from "../ui/gradient-button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../types';

interface NameLocaleScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export function NameLocaleScreen({ navigation }: NameLocaleScreenProps) {
  const [fullName, setFullName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'UR'>('EN');

  const handleSubmit = () => {
    try {
      if (!navigation) {
        console.warn('Navigation is not available');
        return;
      }
      
      if (fullName.trim()) {
        // Navigate to class selection screen
        navigation.navigate('ClassSelection', { 
          fullName: fullName.trim(), 
          language: selectedLanguage 
        });
      } else {
        Alert.alert("Error", "Please enter your full name");
      }
    } catch (error) {
      console.error('Error navigating to ClassSelection:', error);
      Alert.alert("Error", "An error occurred while navigating");
    }
  };

  return (
    <LinearGradient
      colors={['#f9fafb', '#ffffff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="person-circle" size={32} color={colors.primary[500]} />
            </View>
            <Text style={styles.title}>
              Let's start with your name
            </Text>
          </View>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
            <Text style={styles.helper}>As on Class 12 certificate</Text>
          </View>

          <View style={styles.inputGroup}>
            <Label style={styles.label}>Language Preference</Label>
            <View style={styles.languageButtons}>
              {([{code: 'EN', name: 'English', icon: '🇬🇧'}, 
                 {code: 'HI', name: 'हिंदी', icon: '🇮🇳'}, 
                 {code: 'UR', name: 'اردو', icon: '🕌'}] as const).map((lang) => (
                <GradientButton
                  key={lang.code}
                  onPress={() => setSelectedLanguage(lang.code)}
                  variant={selectedLanguage === lang.code ? 'primary' : 'secondary'}
                  style={styles.languageButton}
                >
                  {lang.icon} {lang.name}
                </GradientButton>
              ))}
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <GradientButton
              variant="cool"
              onPress={() => navigation.goBack()}
              style={styles.actionButton}
              icon={<Ionicons name="arrow-back" size={18} color="white" />}
            >
              Back
            </GradientButton>
            <GradientButton
              variant="primary"
              onPress={handleSubmit}
              style={styles.primaryButton}
              disabled={!fullName.trim()}
              icon={<Ionicons name="arrow-forward" size={18} color="white" />}
            >
              Next
            </GradientButton>
          </View>
        </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formContainer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 32,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
  input: {
    width: '100%',
    fontSize: 17,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  helper: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 8,
  },
  languageButtons: {
    gap: 12,
  },
  languageButton: {
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
