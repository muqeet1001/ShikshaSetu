import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ClassSelectionScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');

export function ClassSelectionScreen({ navigation, route }: ClassSelectionScreenProps) {
  const { fullName } = route?.params || {};
  const [selectedClass, setSelectedClass] = useState<'10th' | '12th' | null>(null);

  const handleClassSelection = (classLevel: '10th' | '12th') => {
    setSelectedClass(classLevel);
    
    if (classLevel === '12th') {
      // Direct to existing QuickStart flow
      navigation.navigate('QuickStart', { fullName, classLevel });
    } else {
      // Direct to Career Chat Bot for 10th students
      navigation.navigate('CareerChatBot', { fullName, classLevel });
    }
  };

  const firstName = fullName ? fullName.split(' ')[0] : 'there';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f0fdf4', '#ffffff', '#eff6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.botAvatar}
              >
                <Ionicons name="school" size={32} color="white" />
              </LinearGradient>
            </View>
            
            <Text style={styles.greeting}>
              Great to meet you, {firstName}! 👋
            </Text>
            <Text style={styles.subGreeting}>
              I'm your career buddy, and I'm here to help you find the perfect path for your future.
            </Text>
          </View>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              Which class are you studying in right now?
            </Text>
          </View>

          {/* Class Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.classOption,
                styles.class10Option,
                selectedClass === '10th' && styles.selectedOption,
              ]}
              onPress={() => handleClassSelection('10th')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.optionGradient}
              >
                <View style={styles.optionContent}>
                  <Ionicons name="book-outline" size={32} color="white" />
                  <Text style={styles.optionTitle}>Class 10th</Text>
                  <Text style={styles.optionSubtitle}>
                    Exploring career options & choosing streams
                  </Text>
                  <View style={styles.optionBadge}>
                    <Ionicons name="chatbubble-outline" size={16} color="#3B82F6" />
                    <Text style={styles.badgeText}>Personal Chat Guidance</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.classOption,
                styles.class12Option,
                selectedClass === '12th' && styles.selectedOption,
              ]}
              onPress={() => handleClassSelection('12th')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.optionGradient}
              >
                <View style={styles.optionContent}>
                  <Ionicons name="school-outline" size={32} color="white" />
                  <Text style={styles.optionTitle}>Class 12th</Text>
                  <Text style={styles.optionSubtitle}>
                    Ready for college admissions & career planning
                  </Text>
                  <View style={styles.optionBadge}>
                    <Ionicons name="map-outline" size={16} color="#f97316" />
                    <Text style={styles.badgeText}>Direct Career Path</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          <View style={styles.helperContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.helperText}>
              Don't worry! You can change this later if you need different guidance.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  botAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width - 80,
  },
  questionContainer: {
    marginBottom: 30,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 350,
    gap: 16,
    marginBottom: 30,
  },
  classOption: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  class10Option: {
    borderWidth: 3,
    borderColor: 'transparent',
  },
  class12Option: {
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#F59E0B',
    transform: [{ scale: 1.02 }],
  },
  optionGradient: {
    padding: 24,
    minHeight: 140,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    maxWidth: width - 40,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
});