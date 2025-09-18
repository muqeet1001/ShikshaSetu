import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getDistrictAdmits, getCollegeMentors } from '../data/government-mock-data';
import { DistrictAdmitData, MentorProfile } from '../types/government-modules';

interface DistrictAdmitsProps {
  district: string;
  college: string;
  course: string;
  userDistrict?: string; // User's home district
  isCompactView?: boolean; // For college card vs details view
}

const DistrictAdmits: React.FC<DistrictAdmitsProps> = ({
  district,
  college,
  course,
  userDistrict = 'Srinagar', // Default to Srinagar for demo
  isCompactView = true
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showSourcePopover, setShowSourcePopover] = useState(false);

  // Safety checks for required props
  if (!college || !course || !userDistrict) {
    console.warn('DistrictAdmits: Missing required props', { college, course, userDistrict });
    return null;
  }

  let districtAdmits: DistrictAdmitData[] = [];
  let mentors: MentorProfile[] = [];
  
  try {
    // Get admission data for this specific combination
    districtAdmits = getDistrictAdmits(userDistrict, college, course) as DistrictAdmitData[] || [];
    const allMentors = getCollegeMentors(college) as MentorProfile[] || [];
    mentors = allMentors.filter((mentor: MentorProfile) =>
      mentor && mentor.course === course && mentor.district === userDistrict
    ) || [];
  } catch (error) {
    console.error('DistrictAdmits: Error getting data', error);
    districtAdmits = [];
    mentors = [];
  }

  const totalAdmits = districtAdmits.reduce((sum, admit) => sum + admit.admitCount, 0);
  const availableMentors = mentors.filter(mentor => mentor.consentGiven && !mentor.isBlocked);


  // For demo purposes, always show some data
  const displayAdmits = totalAdmits > 0 ? totalAdmits : Math.floor(Math.random() * 30) + 20; // Random between 20-49
  const displayMentors: MentorProfile[] = availableMentors.length > 0 ? availableMentors : [
    {
      id: 'demo_mentor_1',
      name: 'Bhavani Singh',
      isVerified: true,
      currentStatus: 'Working' as const,
      currentRole: 'Software Engineer',
      currentOrganization: 'TCS',
      course: course,
      college: college,
      district: userDistrict,
      graduationYear: 2022,
      languages: ['EN', 'HI'] as ('EN' | 'HI' | 'UR')[],
      helpOfferings: ['Career guidance', 'Tech interviews'],
      availability: 'High' as const,
      responseTime: 'Usually responds within 2 hours',
      lastActive: '2024-09-14',
      profileUpdated: '2024-09-10',
      linkedinUrl: 'https://linkedin.com/in/arya-sharma',
      twitterUrl: 'https://twitter.com/arya_codes',
      phoneNumber: '+91-194-1234567',
      consentGiven: true,
      isBlocked: false
    },
    {
      id: 'demo_mentor_2',
      name: 'Abdul Muqeet',
      isVerified: true,
      currentStatus: 'Higher Studies' as const,
      currentRole: 'MBA Student',
      currentOrganization: 'IIM Jammu',
      course: course,
      college: college,
      district: userDistrict,
      graduationYear: 2023,
      languages: ['EN', 'HI'] as ('EN' | 'HI' | 'UR')[],
      helpOfferings: ['MBA preparation', 'Business studies'],
      availability: 'Medium' as const,
      responseTime: 'Usually responds within 4 hours',
      lastActive: '2024-09-13',
      profileUpdated: '2024-09-05',
      linkedinUrl: 'https://linkedin.com/in/rahul-kumar',
      phoneNumber: '+91-194-1234568',
      consentGiven: true,
      isBlocked: false
    },
    {
      id: 'demo_mentor_3',
      name: 'Sarah',
      isVerified: false,
      currentStatus: 'Working' as const,
      currentRole: 'Bank Officer',
      currentOrganization: 'J&K Bank',
      course: course,
      college: college,
      district: userDistrict,
      graduationYear: 2021,
      languages: ['EN', 'HI', 'UR'] as ('EN' | 'HI' | 'UR')[],
      helpOfferings: ['Banking career', 'Government jobs'],
      availability: 'High' as const,
      responseTime: 'Usually responds within 1 hour',
      lastActive: '2024-09-14',
      profileUpdated: '2024-09-12',
      linkedinUrl: 'https://linkedin.com/in/sneha-patel',
      twitterUrl: 'https://twitter.com/sneha_banking',
      phoneNumber: '+91-194-1234569',
      consentGiven: true,
      isBlocked: false
    }
  ];

  // Debug logs
  console.log('DistrictAdmits Debug:', {
    district,
    college,
    course,
    userDistrict,
    districtAdmitsCount: districtAdmits.length,
    mentorsCount: mentors.length,
    totalAdmits,
    availableMentorsCount: availableMentors.length,
    displayAdmits,
    displayMentorsCount: displayMentors.length
  });

  const latestAdmitData = districtAdmits.length > 0 ? districtAdmits[0] : null;

  const handleViewMore = () => {
    try {
      if (!navigation) {
        console.warn('Navigation is not available');
        return;
      }
      navigation.navigate('StudentsList', {
        district: userDistrict,
        college,
        course,
        totalAdmits
      });
    } catch (error) {
      console.error('Error navigating to StudentsList:', error);
    }
  };

  const handleMentorPress = (mentorId: string) => {
    try {
      if (!navigation) {
        console.warn('Navigation is not available');
        return;
      }
      if (!mentorId) {
        console.warn('Invalid mentor ID');
        return;
      }
      navigation.navigate('StudentProfile', { studentId: mentorId });
    } catch (error) {
      console.error('Error navigating to StudentProfile:', error);
    }
  };

  const renderSourcePopover = () => (
    <Modal
      visible={showSourcePopover}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSourcePopover(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={() => setShowSourcePopover(false)}
      >
        <View style={styles.popoverContent}>
          <Text style={styles.popoverTitle}>Data Source</Text>
          {latestAdmitData && (
            <>
              <Text style={styles.popoverText}>Source: {latestAdmitData.source}</Text>
              <Text style={styles.popoverText}>Last updated: {new Date(latestAdmitData.lastUpdated).toLocaleDateString()}</Text>
              {latestAdmitData.sourceFile && (
                <Text style={styles.popoverText}>File: {latestAdmitData.sourceFile}</Text>
              )}
            </>
          )}
          <TouchableOpacity 
            style={styles.popoverCloseButton}
            onPress={() => setShowSourcePopover(false)}
          >
            <Text style={styles.popoverCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderAvatarChips = () => {
    if (!displayMentors || displayMentors.length === 0) return null;
    
    return (
      <View style={styles.avatarChipsContainer}>
        {displayMentors.slice(0, 5).map((mentor: MentorProfile, index: number) => {
          if (!mentor || !mentor.name) return null;
          
          return (
            <TouchableOpacity
              key={mentor.id || `mentor_${index}`}
              style={styles.avatarChip}
              onPress={() => handleMentorPress(mentor.id || `demo_${index}`)}
            >
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(mentor.name) }]}>
                <Text style={styles.avatarText}>
                  {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                </Text>
              </View>
              {mentor.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        }).filter(Boolean)}
        {displayMentors.length > 5 && (
          <TouchableOpacity style={styles.viewMoreChip} onPress={handleViewMore}>
            <Text style={styles.viewMoreChipText}>View more</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isCompactView) {
    // Compact view for college cards
    return (
      <View style={styles.compactContainer}>
        {renderSourcePopover()}
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle}>From your district</Text>
        </View>
        
        <View style={styles.compactContent}>
          <View style={styles.admitsLine}>
            <Text style={styles.admitsText}>
              <Text style={styles.admitsCount}>{displayAdmits}</Text> admits (AY {latestAdmitData?.academicYear || '2024-25'})
            </Text>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => setShowSourcePopover(true)}
            >
              <Ionicons name="information-circle" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {displayMentors.length > 0 && renderAvatarChips()}
          
          <TouchableOpacity style={styles.compactViewMore} onPress={handleViewMore}>
            <Text style={styles.compactViewMoreText}>View more</Text>
            <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Detailed view for college details page
  return (
    <View style={styles.detailsContainer}>
      {renderSourcePopover()}
      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle}>
          From District {userDistrict} (AY {latestAdmitData?.academicYear || '2024-25'}): {displayAdmits} admits to {course}@{college}
        </Text>
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceText}>Source: {latestAdmitData?.source}</Text>
          <Text style={styles.sourceText}>Updated: {new Date(latestAdmitData?.lastUpdated || Date.now()).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => setShowSourcePopover(true)}>
            <Text style={styles.methodologyLink}>Methodology</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {displayMentors.length > 0 && (
        <View style={styles.topPeopleSection}>
          <Text style={styles.topPeopleTitle}>Top {displayMentors.length} from {userDistrict} who studied this course</Text>
          {renderAvatarChips()}
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewMore}>
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Legacy styles (keeping for backwards compatibility)
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  content: {
    gap: 8,
  },
  admitText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  countText: {
    fontWeight: '700',
    color: '#10B981',
  },
  districtText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  courseText: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  mentorsSection: {
    gap: 8,
  },
  mentorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mentorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  mentorName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  
  // New styles for enhanced component
  compactContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compactHeader: {
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  compactContent: {
    gap: 8,
  },
  admitsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  admitsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  admitsCount: {
    fontWeight: '700',
    color: '#10B981',
  },
  infoButton: {
    padding: 2,
  },
  avatarChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  avatarChip: {
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  viewMoreChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  viewMoreChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3B82F6',
  },
  compactViewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  compactViewMoreText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  
  // Details view styles
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailsHeader: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  sourceInfo: {
    gap: 4,
  },
  sourceText: {
    fontSize: 13,
    color: '#6B7280',
  },
  methodologyLink: {
    fontSize: 13,
    color: '#3B82F6',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  topPeopleSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  topPeopleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  
  // Modal and popover styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  popoverContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  popoverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  popoverText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  popoverCloseButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  popoverCloseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default DistrictAdmits;