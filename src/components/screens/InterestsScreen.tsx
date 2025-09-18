import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from "../ui/gradient-button";
import { colors } from '../../theme/colors';

interface InterestsScreenProps {
  navigation: any;
  route?: any;
}

export function InterestsScreen({ navigation, route }: InterestsScreenProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { name: 'Medical', icon: 'medical', color: colors.accent.blue },
    { name: 'Engineering', icon: 'construct', color: colors.accent.orange },
    { name: 'Research', icon: 'flask', color: colors.secondary[500] },
    { name: 'Teaching', icon: 'school', color: colors.primary[500] },
    { name: 'Business', icon: 'briefcase', color: colors.accent.darkBlue },
    { name: 'Design', icon: 'color-palette', color: colors.accent.lightOrange },
    { name: 'Public Service', icon: 'people', color: colors.accent.navy },
    { name: 'Arts & Literature', icon: 'library', color: colors.accent.lightBlue },
    { name: 'Sports & Fitness', icon: 'fitness', color: colors.accent.darkOrange },
    { name: 'Technology', icon: 'laptop', color: colors.secondary[600] },
    { name: 'Agriculture', icon: 'leaf', color: colors.primary[600] },
    { name: 'Social Work', icon: 'heart', color: colors.accent.amber }
  ];

  const toggleInterest = (interestName: string) => {
    console.log('Toggling interest:', interestName);
    setSelectedInterests(prev => 
      prev.includes(interestName)
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  const handleContinue = () => {
    navigation.navigate('Flowchart', { 
      interests: selectedInterests,
      formData: route?.params?.formData 
    });
  };

  const handleSkip = () => {
    navigation.navigate('Flowchart', { 
      interests: [],
      formData: route?.params?.formData 
    });
  };

  return (
    <LinearGradient
      colors={['#f9fafb', '#ffffff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={28} color={colors.primary[500]} />
          </View>
          <Text style={styles.title}>
            What excites you?
          </Text>
          <Text style={styles.subtitle}>
            Select your areas of interest to get personalized career recommendations
          </Text>
        </View>
        
        <View style={styles.interestsGrid}>
          {interests.map(interest => {
            const isSelected = selectedInterests.includes(interest.name);
            return (
              <TouchableOpacity
                key={interest.name}
                onPress={() => toggleInterest(interest.name)}
                style={[
                  styles.interestCard,
                  isSelected && styles.interestCardSelected
                ]}
                activeOpacity={0.8}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <LinearGradient
                  colors={isSelected ? [interest.color, '#f8fafc'] : ['#ffffff', '#f8fafc']}
                  style={styles.cardGradient}
                  pointerEvents="none"
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.1)' }
                  ]}>
                    <Ionicons 
                      name={interest.icon as any} 
                      size={28} 
                      color={isSelected ? '#ffffff' : interest.color} 
                    />
                  </View>
                  <Text style={[
                    styles.interestText,
                    { color: isSelected ? '#ffffff' : colors.gray[800] }
                  ]}>
                    {interest.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonGroup}>
          <GradientButton
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
            icon={<Ionicons name="arrow-back" size={18} color="white" />}
          >
            Back
          </GradientButton>
          {selectedInterests.length > 0 ? (
            <GradientButton
              variant="primary"
              onPress={handleContinue}
              style={styles.primaryButton}
              icon={<Ionicons name="arrow-forward" size={18} color="white" />}
            >
              Continue ({selectedInterests.length})
            </GradientButton>
          ) : (
            <GradientButton
              variant="cool"
              onPress={handleSkip}
              style={styles.primaryButton}
              icon={<Ionicons name="chevron-forward" size={18} color="white" />}
            >
              Skip for now
            </GradientButton>
          )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: colors.gray[600],
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  interestCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  interestCardSelected: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.2,
    elevation: 8,
  },
  cardGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    position: 'relative',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  interestText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
