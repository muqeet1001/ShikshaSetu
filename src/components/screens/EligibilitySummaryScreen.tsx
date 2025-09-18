import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { GradientButton } from "../ui/gradient-button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { colors } from '../../theme/colors';

interface EligibilitySummaryScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route?: RouteProp<RootStackParamList, 'Eligibility'>;
}

export function EligibilitySummaryScreen({ navigation, route }: EligibilitySummaryScreenProps) {
  const { formData = {}, interests = [] } = route?.params || {};
  const [filters, setFilters] = useState({
    govtOnly: true,
    scope: 'District'
  });

  // Mock outcomes data for eligibility overview

  const eligibleCourses = [
    {
      name: 'MBBS/BDS',
      requirements: 'PCB',
      entrance: 'NEET',
      govtSeats: 'Available nearby',
      eligible: formData.subjects?.includes('Biology') && formData.subjects?.includes('Physics') && formData.subjects?.includes('Chemistry')
    },
    {
      name: 'B.Sc Biology',
      requirements: 'PCB',
      entrance: 'Merit based',
      govtSeats: '15 colleges near',
      eligible: formData.subjects?.includes('Biology')
    },
    {
      name: 'B.Tech',
      requirements: 'PCM',
      entrance: 'JEE/CET',
      govtSeats: 'As applicable',
      eligible: formData.subjects?.includes('Physics') && formData.subjects?.includes('Chemistry') && formData.subjects?.includes('Maths')
    },
    {
      name: 'B.Com/BBA',
      requirements: 'Commerce/Any+Math',
      entrance: 'Merit based', 
      govtSeats: '12 colleges near',
      eligible: formData.stream === 'Commerce' || formData.subjects?.includes('Maths')
    },
    {
      name: 'BA',
      requirements: 'Any stream',
      entrance: 'Merit based',
      govtSeats: '18 colleges near',
      eligible: true
    }
  ];

  const eligibleCount = eligibleCourses.filter(c => c.eligible).length;

  const handleViewColleges = (courseName: string) => {
    if (navigation) {
      navigation.navigate('Colleges', { course: courseName, formData, interests });
    }
  };

  return (
    <LinearGradient
      colors={['#fef3f2', '#ffffff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Course Eligibility</Text>
        
        <View style={styles.statsContainer}>
          <Badge variant="outline" style={styles.statBadge}>
            {eligibleCount} Eligible Courses
          </Badge>
          <Badge variant="outline">
            Govt Colleges Only
          </Badge>
        </View>

      </View>

      {/* Filters */}
      <Card style={styles.filtersCard}>
        <CardContent style={styles.filtersContent}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <View style={styles.scopeButtons}>
            <Text style={styles.filterLabel}>Scope:</Text>
            {['District', 'Adjacent', 'State'].map(scope => (
              <TouchableOpacity
                key={scope}
                onPress={() => setFilters(prev => ({ ...prev, scope }))}
                style={[
                  styles.scopeButton,
                  filters.scope === scope && styles.scopeButtonActive
                ]}
              >
                <Text style={[
                  styles.scopeButtonText,
                  filters.scope === scope && styles.scopeButtonTextActive
                ]}>
                  {scope}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* Eligible Courses */}
      <View style={styles.coursesContainer}>
        {eligibleCourses.map((course, index) => (
          <Card 
            key={index} 
            style={{
              ...styles.courseCard,
              ...(course.eligible ? styles.courseCardEligible : styles.courseCardIneligible)
            }}
          >
            <CardContent style={styles.courseContent}>
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <View style={styles.courseTitleRow}>
                    {course.eligible && <Text style={styles.checkIcon}>✅</Text>}
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Badge 
                      variant={course.eligible ? "default" : "secondary"}
                      style={styles.courseBadge}
                    >
                      {course.requirements}
                    </Badge>
                  </View>
                  <View style={styles.courseDetails}>
                    <Text style={styles.courseDetail}>Entrance: {course.entrance}</Text>
                    <Text style={styles.courseBullet}>•</Text>
                    <Text style={styles.courseDetail}>{course.govtSeats}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.courseActions}>
                <GradientButton
                  variant="secondary"
                  size="sm"
                  disabled={!course.eligible}
                  style={styles.courseButton}
                  onPress={() => console.log('View roadmap for', course.name)}
                >
                  View Roadmap
                </GradientButton>
                <GradientButton
                  variant="primary"
                  size="sm"
                  disabled={!course.eligible}
                  onPress={() => handleViewColleges(course.name)}
                  style={styles.courseButton}
                >
                  See Govt Colleges
                </GradientButton>
              </View>
            </CardContent>
          </Card>
        ))}
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
          onPress={() => navigation.navigate('Colleges', { formData, interests })}
          style={styles.primaryButton}
          icon={<Ionicons name="business" size={18} color="white" />}
        >
          View All Colleges
        </GradientButton>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  statBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  outcomesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  outcomeCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  outcomeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  outcomeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  filtersCard: {
    marginBottom: 24,
  },
  filtersContent: {
    padding: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  scopeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  scopeButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  scopeButtonActive: {
    backgroundColor: '#2563eb',
  },
  scopeButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  scopeButtonTextActive: {
    color: '#ffffff',
  },
  coursesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  courseCard: {
    borderLeftWidth: 4,
  },
  courseCardEligible: {
    borderLeftColor: '#2563eb',
    backgroundColor: '#f8fafc',
  },
  courseCardIneligible: {
    borderLeftColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkIcon: {
    fontSize: 16,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  courseBadge: {
    alignSelf: 'flex-start',
  },
  courseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  courseDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  courseBullet: {
    fontSize: 14,
    color: '#6b7280',
  },
  courseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  courseButton: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
