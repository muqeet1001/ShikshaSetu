import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { GradientButton } from "../ui/gradient-button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { colors } from '../../theme/colors';
import DistrictAdmitsSimple from '../DistrictAdmitsSimple';

interface CollegesListScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route?: RouteProp<RootStackParamList, 'Colleges'>;
}

export function CollegesListScreen({ navigation, route }: CollegesListScreenProps) {
  const { course, formData = {}, interests = [] } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState("");
  const userDistrict = formData?.district || 'Srinagar'; // Get from user profile/form data

  // Mock outcomes data for colleges
  const outcomesData = {
    working: { percentage: 78, source: "AICTE Graduate Survey" },
    higherStudies: { percentage: 22, source: "University Records" },
    currentStudents: { count: 2847, source: "J&K Higher Education" }
  };

  const colleges = [
    {
      name: "Govt College for Women",
      distance: "2.1 km",
      fees: "₹8.5k/yr",
      facilities: ["Labs", "Library", "Bus"],
      type: "Government",
      accreditation: "NAAC A+",
      ranking: "State Rank 15",
      contact: "+91-194-xxxxxxx"
    },
    {
      name: "SP College",
      distance: "8.0 km", 
      fees: "₹12k/yr",
      facilities: ["Science streams", "Wi-Fi", "Canteen"],
      type: "Government",
      accreditation: "NAAC A",
      ranking: "State Rank 28",
      contact: "+91-194-xxxxxxx"
    },
    {
      name: "Government College of Engineering & Technology",
      distance: "15.2 km",
      fees: "₹25k/yr",
      facilities: ["Modern Labs", "Placement Cell", "Hostel", "Industry Tie-ups"],
      type: "Government",
      accreditation: "NBA Accredited",
      ranking: "NIRF Rank 125",
      contact: "+91-194-xxxxxxx"
    },
    {
      name: "Islamia College of Science & Commerce",
      distance: "12.5 km",
      fees: "₹9.2k/yr",
      facilities: ["Library", "Sports", "Computer Lab", "Bus Service"],
      type: "Government",
      accreditation: "NAAC A",
      ranking: "State Rank 22",
      contact: "+91-194-xxxxxxx"
    },
    {
      name: "Amar Singh College",
      distance: "6.8 km",
      fees: "₹7.8k/yr",
      facilities: ["Arts & Science", "Library", "NCC", "NSS"],
      type: "Government",
      accreditation: "NAAC A",
      ranking: "State Rank 35",
      contact: "+91-194-xxxxxxx"
    }
  ];

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#ecfdf5', '#ffffff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Government Colleges</Text>
        {course && (
          <Text style={styles.subtitle}>For {course} course</Text>
        )}
        
        {/* Quick Stats */}
        <View style={styles.outcomesContainer}>
          <View style={styles.outcomeCard}>
            <Text style={styles.outcomeNumber}>{outcomesData.working.percentage}%</Text>
            <Text style={styles.outcomeLabel}>Working</Text>
          </View>
          <View style={styles.outcomeCard}>
            <Text style={styles.outcomeNumber}>{outcomesData.higherStudies.percentage}%</Text>
            <Text style={styles.outcomeLabel}>Higher Studies</Text>
          </View>
          <View style={styles.outcomeCard}>
            <Text style={styles.outcomeNumber}>{outcomesData.currentStudents.count.toLocaleString()}</Text>
            <Text style={styles.outcomeLabel}>Current Students</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search colleges..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Colleges List */}
      <View style={styles.collegesContainer}>
        {filteredColleges.map((college, index) => (
          <Card key={index} style={styles.collegeCard}>
            <CardContent style={styles.collegeContent}>
              <View style={styles.collegeHeader}>
                <View style={styles.collegeInfo}>
                  <Text style={styles.collegeName}>{college.name}</Text>
                  <View style={styles.collegeDetails}>
                    <Text style={styles.collegeDetail}>📍 {college.distance}</Text>
                    <Text style={styles.collegeBullet}>•</Text>
                    <Text style={[styles.collegeDetail, styles.feeText]}>Fees {college.fees}</Text>
                  </View>
                </View>
                <Badge style={styles.typeBadge}>
                  {college.type}
                </Badge>
              </View>

              {/* Facilities */}
              <View style={styles.facilitiesSection}>
                <Text style={styles.sectionLabel}>Facilities:</Text>
                <View style={styles.facilitiesContainer}>
                  {college.facilities.slice(0, 3).map((facility, idx) => (
                    <Badge key={idx} variant="outline" style={styles.facilityBadge}>
                      {facility}
                    </Badge>
                  ))}
                  {college.facilities.length > 3 && (
                    <Text style={styles.moreText}>+{college.facilities.length - 3} more</Text>
                  )}
                </View>
              </View>

              {/* Accreditation & Ranking */}
              <View style={styles.credentialsSection}>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Accreditation:</Text>
                  <Text style={styles.credentialValue}>{college.accreditation}</Text>
                </View>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Ranking:</Text>
                  <Text style={styles.credentialValue}>{college.ranking}</Text>
                </View>
              </View>

              {/* Trust Strip */}
              <View style={styles.trustStrip}>
                <TouchableOpacity style={styles.trustItem}>
                  <Ionicons name="document-text" size={14} color="#3B82F6" />
                  <Text style={styles.trustText}>Mandatory Disclosure</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trustItem}>
                  <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                  <Text style={styles.trustText}>Accreditation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trustItem}>
                  <Ionicons name="bar-chart" size={14} color="#F59E0B" />
                  <Text style={styles.trustText}>Ranking Data</Text>
                </TouchableOpacity>
              </View>

              {/* From your district section */}
              <DistrictAdmitsSimple
                district={userDistrict}
                college={college.name}
                course={course || 'B.Sc Biology'}
                userDistrict={userDistrict}
                isCompactView={true}
              />

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <GradientButton
                  variant="primary"
                  size="sm"
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('CollegeDetails', {
                    college: {
                      ...college,
                      address: `${college.name} Campus, Srinagar, J&K 190006`,
                      established: '1950',
                      totalStudents: '2,847',
                      facultyCount: '125',
                      courses: ['B.Sc Biology', 'B.Com', 'BA English', 'B.Sc Mathematics'],
                      scholarships: ['Merit-based', 'Need-based', 'Minority scholarships']
                    },
                    course: course || 'B.Sc Biology',
                    formData: { district: userDistrict }
                  })}
                >
                  Details
                </GradientButton>
                <GradientButton
                  variant="secondary"
                  size="sm"
                  style={styles.actionButton}
                  onPress={() => console.log('Call', college.contact)}
                  icon={<Ionicons name="call" size={16} color="white" />}
                >
                  Call
                </GradientButton>
                <GradientButton
                  variant="accent"
                  size="sm"
                  style={styles.actionButton}
                  onPress={() => console.log('View map for', college.name)}
                  icon={<Ionicons name="map" size={16} color="white" />}
                >
                  Map
                </GradientButton>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <GradientButton
          variant="cool"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          icon={<Ionicons name="arrow-back" size={18} color="white" />}
        >
          Back to Eligibility Summary
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  outcomesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  outcomeCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  outcomeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  outcomeLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    width: '100%',
  },
  collegesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  collegeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  collegeContent: {
    padding: 16,
  },
  collegeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  collegeInfo: {
    flex: 1,
    marginRight: 12,
  },
  collegeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  collegeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collegeDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  feeText: {
    fontWeight: '600',
    color: '#2563eb',
  },
  collegeBullet: {
    fontSize: 14,
    color: '#6b7280',
  },
  typeBadge: {
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
  },
  facilitiesSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  facilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  moreText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  credentialsSection: {
    marginBottom: 16,
    gap: 4,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  credentialLabel: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 80,
  },
  credentialValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
  },
  backButtonContainer: {
    marginTop: 16,
  },
  backButton: {
    width: '100%',
  },
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  trustText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
});
