import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../ui/card';
import { colors } from '../../theme/colors';

interface OutcomesTabProps {
  careerCategory: string;
  district?: string;
}

export function OutcomesTab({ careerCategory, district = 'Your District' }: OutcomesTabProps) {
  // Mock data for outcomes - in a real app, this would come from an API or database
  const outcomes = {
    workingPercentage: 78,
    higherStudiesPercentage: 15,
    currentStudentsPercentage: 7,
    updateYear: '2023',
    admitsData: [
      {
        college: 'Government Engineering College',
        course: 'B.Tech Computer Science',
        admitsCount: 45,
        academicYear: '2023-24'
      },
      {
        college: 'State University of Technology',
        course: 'B.Tech Electronics',
        admitsCount: 32,
        academicYear: '2023-24'
      },
      {
        college: 'National Institute of Technology',
        course: 'B.Tech Mechanical Engineering',
        admitsCount: 28,
        academicYear: '2023-24'
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Outcomes for {careerCategory}</Text>
        <Text style={styles.subtitle}>Data from {district}</Text>
      </View>
      
      {/* Outcome Metrics */}
      <Card style={styles.metricsCard}>
        <CardContent>
          <Text style={styles.sectionTitle}>Career Outcomes</Text>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <View style={[styles.metricCircle, { backgroundColor: colors.primary[100] }]}>
                <Text style={[styles.metricValue, { color: colors.primary[700] }]}>{outcomes.workingPercentage}%</Text>
              </View>
              <Text style={styles.metricLabel}>Working</Text>
            </View>
            
            <View style={styles.metricItem}>
              <View style={[styles.metricCircle, { backgroundColor: colors.secondary[100] }]}>
                <Text style={[styles.metricValue, { color: colors.secondary[700] }]}>{outcomes.higherStudiesPercentage}%</Text>
              </View>
              <Text style={styles.metricLabel}>Higher Studies</Text>
            </View>
            
            <View style={styles.metricItem}>
              <View style={[styles.metricCircle, { backgroundColor: colors.gray[100] }]}>
                <Text style={[styles.metricValue, { color: colors.gray[700] }]}>{outcomes.currentStudentsPercentage}%</Text>
              </View>
              <Text style={styles.metricLabel}>Current Students</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.methodologyButton}>
            <Text style={styles.methodologyButtonText}>View Methodology</Text>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary[600]} />
          </TouchableOpacity>
          
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>Source: Ministry of Education</Text>
            <Text style={styles.sourceText}>Last updated: {outcomes.updateYear}</Text>
          </View>
        </CardContent>
      </Card>
      
      {/* District Admits */}
      <Card style={styles.admitsCard}>
        <CardContent>
          <Text style={styles.sectionTitle}>From {district} (AY: {outcomes.admitsData[0]?.academicYear})</Text>
          
          {outcomes.admitsData.map((admit, index) => (
            <View key={index} style={styles.admitItem}>
              <View style={styles.admitHeader}>
                <Text style={styles.admitCollege}>{admit.college}</Text>
                <Text style={styles.admitCount}>{admit.admitsCount} admits</Text>
              </View>
              <Text style={styles.admitCourse}>{admit.course}</Text>
            </View>
          ))}
          
          <View style={styles.noteContainer}>
            <Ionicons name="information-circle" size={16} color={colors.gray[500]} />
            <Text style={styles.noteText}>
              District admits are shown only when permitted by official lists.
            </Text>
          </View>
          
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>Source: District Education Office</Text>
            <Text style={styles.sourceText}>Last updated: {outcomes.admitsData[0]?.academicYear}</Text>
          </View>
        </CardContent>
      </Card>
      
      {/* Text Outline for Accessibility */}
      <Card style={styles.accessibilityCard}>
        <CardContent>
          <Text style={styles.sectionTitle}>Text Outline</Text>
          <Text style={styles.outlineText}>
            Career outcomes for {careerCategory} in {district}:\n
            - {outcomes.workingPercentage}% of graduates are working\n
            - {outcomes.higherStudiesPercentage}% are pursuing higher studies\n
            - {outcomes.currentStudentsPercentage}% are current students\n\n
            District admits for {outcomes.admitsData[0]?.academicYear}:\n
            {outcomes.admitsData.map(admit => 
              `- ${admit.college}: ${admit.admitsCount} admits to ${admit.course}\n`
            ).join('')}
          </Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[800],
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 4,
  },
  metricsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  admitsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  accessibilityCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[700],
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 14,
    color: colors.gray[700],
  },
  methodologyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.primary[50],
    borderRadius: 4,
    marginBottom: 16,
  },
  methodologyButtonText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '500',
    marginRight: 8,
  },
  admitItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  admitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  admitCollege: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[800],
    flex: 1,
  },
  admitCount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[600],
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  admitCourse: {
    fontSize: 14,
    color: colors.gray[600],
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: colors.gray[700],
    marginLeft: 8,
    flex: 1,
  },
  outlineText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  sourceContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  sourceText: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
});