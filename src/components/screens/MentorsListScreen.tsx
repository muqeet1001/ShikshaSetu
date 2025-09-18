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
import { getMentorsByDistrict, Mentor } from '../../data/mentorsData';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface MentorsListScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'MentorsList'>;
}

export function MentorsListScreen({ navigation, route }: MentorsListScreenProps) {
  const { district = 'Srinagar', college, course } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'rating'>('rating');

  const allMentors = getMentorsByDistrict(district);
  
  // Filter mentors based on search query
  const filteredMentors = allMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.currentCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort mentors
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        return parseInt(b.totalExperience) - parseInt(a.totalExperience);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getAvatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const handleMentorPress = (mentor: Mentor) => {
    navigation.navigate('MentorProfile', { mentorId: mentor.id });
  };

  const handleMessagePress = (mentor: Mentor) => {
    navigation.navigate('MessageThread', { mentor });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#F59E0B" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={12} color="#F59E0B" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#D1D5DB" />);
    }
    return stars;
  };

  const renderMentorCard = (mentor: Mentor) => (
    <TouchableOpacity
      key={mentor.id}
      style={styles.mentorCard}
      onPress={() => handleMentorPress(mentor)}
    >
      <View style={styles.mentorHeader}>
        <View style={styles.mentorAvatar}>
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
        </View>

        <View style={styles.mentorInfo}>
          <View style={styles.mentorNameRow}>
            <Text style={styles.mentorName}>{mentor.name}</Text>
            {mentor.isAvailableForChat && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </View>

          <Text style={styles.mentorRole}>
            {mentor.currentRole} at {mentor.currentCompany}
          </Text>
          
          <Text style={styles.mentorExperience}>
            {mentor.totalExperience} experience • Class of {mentor.graduationYear}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {renderStars(mentor.rating)}
            </View>
            <Text style={styles.ratingText}>
              {mentor.rating} ({mentor.helpedStudents} students helped)
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.mentorBio} numberOfLines={2}>
        {mentor.bio}
      </Text>

      <View style={styles.skillsContainer}>
        {mentor.skills.slice(0, 3).map((skill, index) => (
          <Badge key={index} variant="outline" style={styles.skillBadge}>
            {skill}
          </Badge>
        ))}
        {mentor.skills.length > 3 && (
          <Text style={styles.moreSkills}>+{mentor.skills.length - 3} more</Text>
        )}
      </View>

      <View style={styles.mentorActions}>
        <View style={styles.responseTime}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.responseTimeText}>{mentor.responseTime}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleMessagePress(mentor)}
        >
          <Ionicons name="chatbubble" size={16} color="#3B82F6" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Mentors from {district}</Text>
        </View>

        {/* Search and Sort */}
        <View style={styles.searchSortContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search mentors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <View style={styles.sortButtons}>
              {[
                { key: 'rating', label: 'Rating' },
                { key: 'experience', label: 'Experience' },
                { key: 'name', label: 'Name' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortButton,
                    sortBy === option.key && styles.sortButtonActive
                  ]}
                  onPress={() => setSortBy(option.key as any)}
                >
                  <Text style={[
                    styles.sortButtonText,
                    sortBy === option.key && styles.sortButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {sortedMentors.length} mentors found from {district}
          </Text>
          {course && (
            <Text style={styles.courseFilter}>
              Showing mentors who studied {course}
            </Text>
          )}
        </View>

        {/* Mentors List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {sortedMentors.map(renderMentorCard)}
          
          {sortedMentors.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color="#D1D5DB" />
              <Text style={styles.noResultsTitle}>No mentors found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search criteria
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
  searchSortContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  resultsText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  courseFilter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mentorAvatar: {
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
  mentorInfo: {
    flex: 1,
  },
  mentorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
  },
  mentorRole: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 2,
  },
  mentorExperience: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  mentorBio: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  moreSkills: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  mentorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  messageButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
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
