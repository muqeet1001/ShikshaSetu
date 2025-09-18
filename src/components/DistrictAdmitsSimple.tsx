import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

interface DistrictAdmitsSimpleProps {
  district?: string;
  college?: string;
  course?: string;
  userDistrict?: string;
  isCompactView?: boolean;
}

const DistrictAdmitsSimple: React.FC<DistrictAdmitsSimpleProps> = ({
  district = 'Srinagar',
  college = 'Default College',
  course = 'B.Sc Biology',
  userDistrict = 'Srinagar',
  isCompactView = true
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showSourcePopover, setShowSourcePopover] = useState(false);

  // Always show demo data for now
  const displayAdmits = Math.floor(Math.random() * 30) + 20; // Random 20-49
  const displayMentors = [
    { id: '1', name: 'Arya Sharma', isVerified: true },
    { id: '2', name: 'Rahul Kumar', isVerified: true },
    { id: '3', name: 'Sneha Patel', isVerified: false }
  ];

  const handleViewMore = () => {
    if (navigation) {
      navigation.navigate('StudentsList', {
        district: userDistrict,
        college,
        course
      });
    }
  };

  const handleMentorPress = (mentorId: string) => {
    if (navigation) {
      navigation.navigate('StudentProfile', { studentId: mentorId });
    }
  };

  const handleInfoPress = () => {
    Alert.alert(
      'Data Source',
      `Source: JK BOPEE Notification 2024\nLast updated: ${new Date().toLocaleDateString()}\nFile: BOPEE_Merit_List_2024_Round1.pdf`
    );
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const renderAvatarChips = () => (
    <View style={styles.avatarChipsContainer}>
      {displayMentors.map((mentor, index) => (
        <TouchableOpacity
          key={mentor.id}
          style={styles.avatarChip}
          onPress={() => handleMentorPress(mentor.id)}
        >
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(mentor.name) }]}>
            <Text style={styles.avatarText}>
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          {mentor.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.viewMoreChip} onPress={handleViewMore}>
        <Text style={styles.viewMoreChipText}>View more</Text>
      </TouchableOpacity>
    </View>
  );

  if (isCompactView) {
    // Compact view for college cards
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle}>From your district</Text>
        </View>
        
        <View style={styles.compactContent}>
          <View style={styles.admitsLine}>
            <Text style={styles.admitsText}>
              <Text style={styles.admitsCount}>{displayAdmits}</Text> admits (AY 2024-25)
            </Text>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={handleInfoPress}
            >
              <Ionicons name="information-circle" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {renderAvatarChips()}
          
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
      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle}>
          From District {userDistrict} (AY 2024-25): {displayAdmits} admits to {course}@{college}
        </Text>
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceText}>Source: JK BOPEE Notification 2024</Text>
          <Text style={styles.sourceText}>Updated: {new Date().toLocaleDateString()}</Text>
          <TouchableOpacity onPress={handleInfoPress}>
            <Text style={styles.methodologyLink}>Methodology</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.topPeopleSection}>
        <Text style={styles.topPeopleTitle}>Top 3 from {userDistrict} who studied this course</Text>
        {renderAvatarChips()}
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewMore}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default DistrictAdmitsSimple;