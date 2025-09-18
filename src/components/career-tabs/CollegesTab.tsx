import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../ui/card';
import { colors } from '../../theme/colors';

interface CollegesTabProps {
  careerCategory: string;
  navigation: any;
}

interface College {
  id: string;
  name: string;
  district: string;
  distance: string;
  fees: string;
  medium: string[];
  facilities: string[];
  isGovernment: boolean;
}

export function CollegesTab({ careerCategory = 'General', navigation }: CollegesTabProps) {
  // Mock data for colleges - in a real app, this would come from an API or database
  const colleges: College[] = [
    {
      id: '1',
      name: 'Government College of Engineering',
      district: 'Central District',
      distance: '5 km',
      fees: '₹10,000 - ₹15,000 per year',
      medium: ['English', 'Hindi'],
      facilities: ['Library', 'Labs', 'Hostel', 'Sports Complex'],
      isGovernment: true
    },
    {
      id: '2',
      name: 'State University of Technology',
      district: 'North District',
      distance: '12 km',
      fees: '₹8,000 - ₹12,000 per year',
      medium: ['English', 'Hindi', 'Regional'],
      facilities: ['Library', 'Computer Labs', 'Cafeteria'],
      isGovernment: true
    },
    {
      id: '3',
      name: 'Private Institute of Technology',
      district: 'South District',
      distance: '15 km',
      fees: '₹50,000 - ₹75,000 per year',
      medium: ['English'],
      facilities: ['Advanced Labs', 'Library', 'Hostel', 'Gym'],
      isGovernment: false
    },
  ];

  const handleCollegePress = (collegeId: string) => {
    if (navigation) {
      navigation.navigate('CollegeDetails', { collegeId });
    }
  };

  const renderCollege = (college: College) => (
    <Card key={college.id} style={styles.collegeCard}>
      <TouchableOpacity onPress={() => handleCollegePress(college.id)}>
        <CardContent>
          <View style={styles.collegeHeader}>
            <Text style={styles.collegeName}>{college.name}</Text>
            {college.isGovernment && (
              <View style={styles.governmentBadge}>
                <Text style={styles.governmentBadgeText}>Government</Text>
              </View>
            )}
          </View>
          
          <View style={styles.collegeDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color={colors.gray[600]} />
              <Text style={styles.detailText}>{college.district} • {college.distance}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={16} color={colors.gray[600]} />
              <Text style={styles.detailText}>{college.fees}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="language-outline" size={16} color={colors.gray[600]} />
              <Text style={styles.detailText}>Medium: {college.medium.join(', ')}</Text>
            </View>
          </View>
          
          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Facilities:</Text>
            <View style={styles.facilitiesList}>
              {college.facilities.map((facility, index) => (
                <View key={index} style={styles.facilityChip}>
                  <Text style={styles.facilityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.disclosureButton}>
            <Text style={styles.disclosureButtonText}>Official Disclosures</Text>
            <Ionicons name="open-outline" size={16} color={colors.primary[600]} />
          </TouchableOpacity>
          
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>Source: Ministry of Education</Text>
            <Text style={styles.sourceText}>Last updated: 2023-24 AY</Text>
          </View>
        </CardContent>
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Colleges for {careerCategory}</Text>
        <Text style={styles.subtitle}>Government colleges listed first by district</Text>
      </View>
      
      {colleges.map(renderCollege)}
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
  collegeCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  collegeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  collegeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[700],
    flex: 1,
  },
  governmentBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  governmentBadgeText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
  collegeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 8,
  },
  facilitiesContainer: {
    marginBottom: 12,
  },
  facilitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  disclosureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.primary[50],
    borderRadius: 4,
    marginBottom: 12,
  },
  disclosureButtonText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '500',
    marginRight: 8,
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