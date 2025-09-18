import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { GradientButton } from "../ui/gradient-button";
import { Badge } from "../ui/badge";
import DistrictAdmitsSimple from '../DistrictAdmitsSimple';
import { colors } from '../../theme/colors';

interface CollegeDetailsScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CollegeDetails'>;
}

export function CollegeDetailsScreen({ navigation, route }: CollegeDetailsScreenProps) {
  const { college, course, formData = {} } = route?.params || {};
  const userDistrict = formData?.district || 'Srinagar';

  // Mock detailed outcomes data

  const defaultCollege = {
    name: "Government College for Women",
    distance: "2.1 km",
    fees: "₹8.5k/yr",
    facilities: ["Labs", "Library", "Bus Service", "Wi-Fi", "Canteen", "Sports Complex"],
    type: "Government",
    accreditation: "NAAC A+",
    ranking: "State Rank 15",
    contact: "+91-194-xxxxxxx",
    address: "Gandhi Nagar, Srinagar, J&K 190006",
    established: "1950",
    totalStudents: "2,847",
    facultyCount: "125",
    courses: ["B.Sc Biology", "B.Com", "BA English", "B.Sc Mathematics", "BA History"],
    hostelAvailable: true,
    placementRate: "82%",
    scholarships: ["Merit-based", "Need-based", "Minority scholarships"]
  };

  const collegeInfo = college || defaultCollege;

  const handleCall = () => {
    Linking.openURL(`tel:${collegeInfo.contact.replace(/[x-]/g, '1234567890')}`);
  };

  const handleEmail = () => {
    const email = `info@${collegeInfo.name.toLowerCase().replace(/\s+/g, '')}.edu`;
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = () => {
    const website = `https://${collegeInfo.name.toLowerCase().replace(/\s+/g, '')}.edu`;
    Linking.openURL(website);
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${collegeInfo.name}, ${collegeInfo.address}`);
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ecfdf5', '#ffffff']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>College Details</Text>
          </View>

          {/* College Basic Info */}
          <View style={styles.collegeCard}>
            <View style={styles.collegeHeader}>
              <Text style={styles.collegeName}>{collegeInfo.name}</Text>
              <Badge style={styles.typeBadge}>{collegeInfo.type}</Badge>
            </View>
            
            <View style={styles.basicInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="location" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{collegeInfo.address}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text style={styles.infoText}>Established: {collegeInfo.established}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{collegeInfo.totalStudents} students • {collegeInfo.facultyCount} faculty</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleEmail}>
              <Ionicons name="mail" size={20} color="#10B981" />
              <Text style={styles.quickActionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleWebsite}>
              <Ionicons name="globe" size={20} color="#F59E0B" />
              <Text style={styles.quickActionText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleDirections}>
              <Ionicons name="navigate" size={20} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Admissions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admissions & Fees</Text>
            <View style={styles.admissionInfo}>
              <View style={styles.admissionItem}>
                <Text style={styles.admissionLabel}>Annual Fees:</Text>
                <Text style={styles.admissionValue}>{collegeInfo.fees}</Text>
              </View>
              <View style={styles.admissionItem}>
                <Text style={styles.admissionLabel}>Distance:</Text>
                <Text style={styles.admissionValue}>{collegeInfo.distance}</Text>
              </View>
              <View style={styles.admissionItem}>
                <Text style={styles.admissionLabel}>Accreditation:</Text>
                <Text style={styles.admissionValue}>{collegeInfo.accreditation}</Text>
              </View>
              <View style={styles.admissionItem}>
                <Text style={styles.admissionLabel}>Ranking:</Text>
                <Text style={styles.admissionValue}>{collegeInfo.ranking}</Text>
              </View>
            </View>
          </View>

          {/* FROM YOUR DISTRICT SECTION - This is the key feature! */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Students from Your District</Text>
            <DistrictAdmitsSimple
              district={userDistrict}
              college={collegeInfo.name}
              course={course || 'B.Sc Biology'}
              userDistrict={userDistrict}
              isCompactView={false} // Detailed view for college details page
            />
          </View>


          {/* Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.facilitiesGrid}>
              {collegeInfo.facilities.map((facility: string, index: number) => (
                <Badge key={index} variant="outline" style={styles.facilityBadge}>
                  {facility}
                </Badge>
              ))}
            </View>
          </View>

          {/* Courses Offered */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Courses Offered</Text>
            <View style={styles.coursesGrid}>
              {collegeInfo.courses.map((course: string, index: number) => (
                <View key={index} style={styles.courseItem}>
                  <Text style={styles.courseText}>{course}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Scholarships */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scholarships Available</Text>
            <View style={styles.scholarshipsList}>
              {collegeInfo.scholarships.map((scholarship: string, index: number) => (
                <View key={index} style={styles.scholarshipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.scholarshipText}>{scholarship}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Apply Button */}
          <View style={styles.applySection}>
            <GradientButton
              variant="primary"
              style={styles.applyButton}
              onPress={() => {
                alert(`Application process for ${collegeInfo.name} will be available during admission season. Contact the college for more information.`);
              }}
            >
              Get Admission Information
            </GradientButton>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradient: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  collegeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collegeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  collegeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
  },
  basicInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  admissionInfo: {
    gap: 12,
  },
  admissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  admissionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  admissionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  outcomesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  outcomeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  outcomeNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  outcomeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  outcomeSource: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  outcomeDate: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coursesGrid: {
    gap: 8,
  },
  courseItem: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  courseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  scholarshipsList: {
    gap: 8,
  },
  scholarshipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scholarshipText: {
    fontSize: 14,
    color: '#374151',
  },
  applySection: {
    marginBottom: 24,
  },
  applyButton: {
    width: '100%',
  },
});