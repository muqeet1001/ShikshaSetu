import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../ui/badge';
import { 
  getStudentsByDistrict, 
  getStudentsByStatus, 
  Student, 
  getStudentDisplayName, 
  getAvatarInitials, 
  getAvatarColor 
} from '../../data/studentsData';

interface StudentsListScreenProps {
  navigation: any;
  route: any;
}

type StatusFilter = 'All' | 'Current Student' | 'Alumni' | 'Working';
type SortOption = 'name' | 'year' | 'rating' | 'availability';

export function StudentsListScreen({ navigation, route }: StudentsListScreenProps) {
  const { district = 'Srinagar', college, course } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const allStudents = getStudentsByDistrict(district);
  
  // If no students found, show demo data
  const demoStudents = allStudents.length === 0 ? [
    {
      id: '1',
      name: 'Arya Sharma',
      isVerified: true,
      district: district,
      college: college || 'Government College for Women',
      course: course || 'B.Sc Biology',
      graduationYear: '2014',
      currentRole: 'Senior Software Engineer',
      currentCompany: 'Google',
      totalExperience: '10 years',
      bio: 'Started as a biology student but transitioned to tech through self-learning. Now working at Google on machine learning projects.',
      shortBio: 'Biology to Tech transition • Google ML Engineer • Love helping with career changes',
      currentStatus: 'Working' as const,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/aryasharma',
        whatsapp: '+91-9876543210'
      },
      contactPreferences: {
        allowMessages: true,
        allowCalls: true,
        allowLinkedIn: true
      },
      privacySettings: {
        showFullName: true,
        showEmail: true,
        showPhone: false
      },
      skills: ['Machine Learning', 'Python', 'Data Science'],
      workExperience: [],
      education: [],
      achievements: ['Google Excellence Award 2023'],
      isAvailableForChat: true,
      responseTime: 'Usually responds within 2 hours',
      helpedStudents: 127,
      rating: 4.9,
      emailVisible: true,
      phoneVisible: false
    },
    {
      id: '2', 
      name: 'Rahul Kumar',
      isVerified: true,
      district: district,
      college: college || 'Government College for Women',
      course: course || 'B.Sc Biology',
      graduationYear: '2020',
      currentRole: 'Preparing for NEET',
      currentCompany: '',
      totalExperience: '0 years',
      bio: 'Recently graduated and preparing for NEET to pursue MBBS. Happy to share study strategies and entrance exam preparation tips.',
      shortBio: 'Recent graduate • NEET aspirant • Can help with exam prep strategies',
      currentStatus: 'Alumni' as const,
      socialLinks: {
        whatsapp: '+91-8765432109'
      },
      contactPreferences: {
        allowMessages: true,
        allowCalls: true,
        allowLinkedIn: false
      },
      privacySettings: {
        showFullName: true,
        showEmail: false,
        showPhone: false
      },
      skills: ['NEET Preparation', 'Biology', 'Study Planning'],
      workExperience: [],
      education: [],
      achievements: ['College Topper 2020'],
      isAvailableForChat: true,
      responseTime: 'Usually responds within 1 hour',
      helpedStudents: 15,
      rating: 4.8,
      emailVisible: false,
      phoneVisible: false
    },
    {
      id: '3',
      name: 'Sneha P.',
      isVerified: false,
      district: district,
      college: college || 'Government College for Women',
      course: course || 'B.Sc Biology',
      graduationYear: '2025',
      academicYear: '3rd Year',
      currentRole: 'Student',
      currentCompany: college || 'Government College for Women',
      totalExperience: '0 years',
      bio: 'Third-year biology student passionate about marine biology. Actively involved in college science club.',
      shortBio: '3rd Year Biology • Marine biology enthusiast • Science club member',
      currentStatus: 'Current Student' as const,
      socialLinks: {
        whatsapp: '+91-7654321098'
      },
      contactPreferences: {
        allowMessages: true,
        allowCalls: false,
        allowLinkedIn: false
      },
      privacySettings: {
        showFullName: false,
        showEmail: false,
        showPhone: false
      },
      skills: ['Biology', 'Marine Science', 'Environmental Studies'],
      workExperience: [],
      education: [],
      achievements: ['Science Club President'],
      isAvailableForChat: true,
      responseTime: 'Usually responds within 30 minutes',
      helpedStudents: 8,
      rating: 4.6,
      emailVisible: false,
      phoneVisible: false
    }
  ] : [];
  
  const displayStudents = allStudents.length > 0 ? allStudents : demoStudents;
  
  // Filter students based on search query and status
  let filteredStudents = displayStudents.filter(student => {
    const matchesSearch = 
      getStudentDisplayName(student).toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.shortBio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || student.currentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return getStudentDisplayName(a).localeCompare(getStudentDisplayName(b));
      case 'year':
        return parseInt(b.graduationYear) - parseInt(a.graduationYear);
      case 'rating':
        return b.rating - a.rating;
      case 'availability':
        return a.responseTime.localeCompare(b.responseTime);
      default:
        return 0;
    }
  });

  const handleStudentPress = (student: Student) => {
    navigation.navigate('StudentProfile', { studentId: student.id });
  };

  const handleMessagePress = (student: Student) => {
    navigation.navigate('MessageThread', { student });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Current Student':
        return { name: 'school-outline', color: '#3B82F6' };
      case 'Alumni':
        return { name: 'medal-outline', color: '#10B981' };
      case 'Working':
        return { name: 'briefcase-outline', color: '#F59E0B' };
      default:
        return { name: 'person-outline', color: '#6B7280' };
    }
  };

  const getStatusText = (student: Student) => {
    switch (student.currentStatus) {
      case 'Current Student':
        return student.academicYear ? `${student.academicYear} Student` : 'Current Student';
      case 'Alumni':
        return `Alumni (${student.graduationYear})`;
      case 'Working':
        return `Working at ${student.currentCompany}`;
      default:
        return student.currentStatus;
    }
  };

  const renderStudentCard = (student: Student) => {
    const displayName = getStudentDisplayName(student);
    const statusIcon = getStatusIcon(student.currentStatus);

    return (
      <TouchableOpacity
        key={student.id}
        style={styles.studentCard}
        onPress={() => handleStudentPress(student)}
      >
        <View style={styles.studentRow}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(student.name) }]}>
              <Text style={styles.avatarText}>
                {getAvatarInitials(student.name)}
              </Text>
            </View>
            {student.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          {/* Student Info */}
          <View style={styles.studentInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.studentName}>{displayName}</Text>
              {student.isAvailableForChat && (
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                </View>
              )}
            </View>
            
            <View style={styles.statusRow}>
              <Ionicons name={statusIcon.name as any} size={14} color={statusIcon.color} />
              <Text style={[styles.statusText, { color: statusIcon.color }]}>
                {getStatusText(student)}
              </Text>
            </View>
            
            <Text style={styles.shortBio} numberOfLines={1}>
              {student.shortBio}
            </Text>
            
            <Text style={styles.district}>{student.district}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.responseTime}>{student.responseTime.replace('Usually responds within ', '')}</Text>
            
            <TouchableOpacity
              style={styles.messageIcon}
              onPress={(e) => {
                e.stopPropagation();
                handleMessagePress(student);
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Rating and Stats */}
        <View style={styles.statsRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{student.rating.toFixed(1)}</Text>
          </View>
          
          <Text style={styles.helpedText}>
            Helped {student.helpedStudents} students
          </Text>

          {student.skills.length > 0 && (
            <View style={styles.skillsPreview}>
              <Badge variant="outline" style={styles.skillBadge}>
                {student.skills[0]}
              </Badge>
              {student.skills.length > 1 && (
                <Text style={styles.moreSkills}>+{student.skills.length - 1}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ecfdf5', '#ffffff']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>From Your District</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
            {(['All', 'Current Student', 'Alumni', 'Working'] as StatusFilter[]).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.filterButtonTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="options-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {sortedStudents.length} students found from {district}
          </Text>
        </View>

        {/* Students List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {sortedStudents.map(renderStudentCard)}
          
          {sortedStudents.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="people" size={48} color="#D1D5DB" />
              <Text style={styles.noResultsTitle}>No students found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusFilters: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  sortButton: {
    padding: 8,
    marginLeft: 8,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
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
  studentInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  onlineBadge: {
    marginLeft: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  shortBio: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  district: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActions: {
    alignItems: 'flex-end',
  },
  responseTime: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  messageIcon: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  helpedText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  skillsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillBadge: {
    marginRight: 6,
  },
  moreSkills: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});