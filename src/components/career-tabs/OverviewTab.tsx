import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { colors } from '../../theme/colors';

interface OverviewTabProps {
  careerCategory: string;
}

export function OverviewTab({ careerCategory }: OverviewTabProps) {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Text style={styles.title}>{careerCategory} Overview</Text>
          <Text style={styles.description}>
            This section provides an overview of careers in the {careerCategory} field, 
            including key information about education requirements, career prospects, 
            and industry trends.
          </Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education Requirements</Text>
            <Text style={styles.sectionText}>
              Learn about the educational qualifications needed for various roles in {careerCategory}.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Prospects</Text>
            <Text style={styles.sectionText}>
              Explore the job outlook and growth opportunities in the {careerCategory} sector.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Industry Trends</Text>
            <Text style={styles.sectionText}>
              Stay updated with the latest developments and trends in the {careerCategory} industry.
            </Text>
          </View>
          
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>Source: Ministry of Education</Text>
            <Text style={styles.sourceText}>Last updated: 2023-24 AY</Text>
          </View>
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
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary[800],
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary[700],
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  sourceContainer: {
    marginTop: 24,
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