import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MentorProfile, PeopleFilters } from '../types/government-modules';
import { mentorsData, Mentor } from '../data/mentorsData';
import ConsentModal from './ConsentModal';

import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

interface PeopleDirectoryProps {
  initialDistrict?: string;
  initialCourse?: string;
  onMentorPress?: (mentorId: string) => void;
  navigation?: NavigationProp<RootStackParamList>;
}

const PeopleDirectory: React.FC<PeopleDirectoryProps> = ({
  initialDistrict = '',
  initialCourse = '',
  onMentorPress,
  navigation
}) => {
  const [filters, setFilters] = useState<PeopleFilters>({
    district: initialDistrict,
    course: initialCourse,
    language: undefined,
    scope: 'District',
    status: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [consentPurpose, setConsentPurpose] = useState('career guidance');
  const [showAllMentors, setShowAllMentors] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);

  // Available options for filters
  const districts = ['Srinagar', 'Jammu', 'Budgam', 'Anantnag', 'Baramulla'];
  const courses = ['B.Sc Biology', 'B.Com', 'BA English', 'B.Tech CSE', 'B.Sc Physics'];
  const languages: ('EN' | 'HI' | 'UR')[] = ['EN', 'HI', 'UR'];
  const scopes: ('District' | 'Adjacent' | 'State')[] = ['District', 'Adjacent', 'State'];
  const statuses: ('Working' | 'Higher Studies' | 'Current Student')[] = ['Working', 'Higher Studies', 'Current Student'];

  // Filter mentors based on current filters
  const filteredMentors = useMemo(() => {
    return mentorsData.filter(mentor => {
      // Search query filter
      if (searchQuery && !mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !mentor.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !mentor.currentCompany.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // District filter
      if (filters.district && mentor.district !== filters.district) {
        return false;
      }

      // Course filter
      if (filters.course && mentor.course !== filters.course) {
        return false;
      }

      // Status filter - map the mentor data to the expected status values
      if (filters.status.length > 0) {
        const mentorStatus = mentor.currentRole ? 'Working' : 'Current Student';
        if (!filters.status.includes(mentorStatus as any)) {
          return false;
        }
      }

      return true;
    });
  }, [mentorsData, filters, searchQuery]);

  // Get displayed mentors (with limit)
  const displayedMentors = useMemo(() => {
    return showAllMentors ? filteredMentors : filteredMentors.slice(0, displayLimit);
  }, [filteredMentors, showAllMentors, displayLimit]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleFilterChange = (key: keyof PeopleFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleStatusFilter = (status: 'Working' | 'Higher Studies' | 'Current Student') => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleContactAction = (mentor: Mentor, action: 'message' | 'email' | 'linkedin' | 'twitter') => {
    // For now, we'll assume consent is given for demo purposes
    // In a real app, you'd check mentor.consentGiven or similar field

    switch (action) {
      case 'message':
        // Navigate to message thread
        if (navigation) {
          navigation.navigate('MessageThread', { mentor: mentor });
        } else {
          Alert.alert('Message', `Start a conversation with ${mentor.name}`);
        }
        break;
      case 'email':
        if (mentor.emailVisible) {
          Alert.alert('Email', `Email: ${mentor.name}@example.com`);
        } else {
          Alert.alert('Email Not Available', 'This mentor has not shared their email publicly.');
        }
        break;
      case 'linkedin':
        if (mentor.linkedInUrl) {
          Linking.openURL(mentor.linkedInUrl);
        } else {
          Alert.alert('LinkedIn Not Available', 'This mentor has not shared their LinkedIn profile.');
        }
        break;
      case 'twitter':
        if (mentor.socialLinks?.twitter) {
          Linking.openURL(mentor.socialLinks.twitter);
        } else {
          Alert.alert('Twitter Not Available', 'This mentor has not shared their Twitter profile.');
        }
        break;
    }
  };

  const handleConsentAccept = () => {
    setShowConsentModal(false);
    if (selectedMentor) {
      Alert.alert('Consent Granted', 'You can now contact this mentor.');
      // In real app, update backend consent status
    }
  };

  const handleReportMentor = (mentorId: string) => {
    Alert.alert(
      'Report Mentor',
      'Please specify the reason for reporting this mentor.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Contact', onPress: () => console.log('Reported: Inappropriate Contact') },
        { text: 'Spam/Scam', onPress: () => console.log('Reported: Spam/Scam') },
        { text: 'Other', onPress: () => console.log('Reported: Other') }
      ]
    );
  };

  const renderFilterChips = () => (
    <View style={styles.filtersContainer}>
      {/* Scope Chips */}
      <Text style={styles.filterLabel}>Scope:</Text>
      <View style={styles.chipRow}>
        {scopes.map(scope => (
          <TouchableOpacity
            key={scope}
            style={[styles.chip, filters.scope === scope && styles.selectedChip]}
            onPress={() => handleFilterChange('scope', scope)}
          >
            <Text style={[styles.chipText, filters.scope === scope && styles.selectedChipText]}>
              {scope}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Chips */}
      <Text style={styles.filterLabel}>Status:</Text>
      <View style={styles.chipRow}>
        {statuses.map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.chip, filters.status.includes(status) && styles.selectedChip]}
            onPress={() => toggleStatusFilter(status)}
          >
            <Text style={[styles.chipText, filters.status.includes(status) && styles.selectedChipText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMentorCard = (mentor: Mentor) => (
    <View key={mentor.id} style={styles.mentorCard}>
      <View style={styles.mentorHeader}>
        <View style={styles.mentorInfo}>
          <View style={styles.nameRow}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(mentor.name) }]}>
              <Text style={styles.avatarText}>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <View style={styles.nameWithBadge}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                {mentor.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                )}
              </View>
              <Text style={styles.degreeNow}>
                {mentor.course} → {mentor.currentRole} at {mentor.currentCompany}
              </Text>
              <Text style={styles.experienceText}>
                {mentor.totalExperience} experience • Class of {mentor.graduationYear}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Ionicons name="briefcase" size={12} color="#3B82F6" />
              <Text style={styles.statusText}>Working</Text>
            </View>
            <Text style={styles.updatedDate}>
              Updated on {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => handleReportMentor(mentor.id)}
        >
          <Ionicons name="flag" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.mentorActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => handleContactAction(mentor, 'message')}
        >
          <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Message in app</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleContactAction(mentor, 'email')}
        >
          <Ionicons name="mail" size={16} color="#6B7280" />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>

        {mentor.linkedInUrl && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactAction(mentor, 'linkedin')}
          >
            <Ionicons name="logo-linkedin" size={16} color="#0A66C2" />
            <Text style={styles.actionText}>LinkedIn</Text>
          </TouchableOpacity>
        )}

        {mentor.socialLinks?.twitter && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactAction(mentor, 'twitter')}
          >
            <Ionicons name="logo-twitter" size={16} color="#1DA1F2" />
            <Text style={styles.actionText}>X (Twitter)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getAvatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>People Directory</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filters */}
      {renderFilterChips()}

      {/* Results */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredMentors.length > 0 ? (
          <>
            <Text style={styles.resultsCount}>
              {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
            </Text>
            {displayedMentors.map(renderMentorCard)}
            
            {/* View More Button */}
            {!showAllMentors && filteredMentors.length > displayLimit && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllMentors(true)}
              >
                <Ionicons name="chevron-down" size={20} color="#3B82F6" />
                <Text style={styles.viewMoreText}>
                  View More ({filteredMentors.length - displayLimit} more)
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Show Less Button */}
            {showAllMentors && filteredMentors.length > displayLimit && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowAllMentors(false)}
              >
                <Ionicons name="chevron-up" size={20} color="#3B82F6" />
                <Text style={styles.viewMoreText}>Show Less</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No mentors found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your filters or search in adjacent districts
            </Text>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => handleFilterChange('scope', 'Adjacent')}
            >
              <Text style={styles.expandButtonText}>Try adjacent districts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.requestButton}>
              <Text style={styles.requestButtonText}>Request a mentor</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Safety Note */}
        <View style={styles.safetyNote}>
          <Ionicons name="shield-checkmark" size={16} color="#F59E0B" />
          <Text style={styles.safetyText}>
            Do not share IDs/OTPs/payments; report misuse from profile.
          </Text>
        </View>
      </ScrollView>

      {/* Consent Modal */}
      <ConsentModal
        isVisible={showConsentModal}
        mentorName={selectedMentor?.name || ''}
        purpose={consentPurpose}
        dataToReveal={['Name', 'Course', 'District']}
        onAccept={handleConsentAccept}
        onDecline={() => setShowConsentModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mentorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nameContainer: {
    flex: 1,
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  degreeNow: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  updatedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reportButton: {
    padding: 8,
  },
  mentorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 6,
    flex: 1,
  },
  primaryAction: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  expandButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  requestButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    gap: 8,
  },
  safetyText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    fontWeight: '500',
  },
  experienceText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
    gap: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default PeopleDirectory;