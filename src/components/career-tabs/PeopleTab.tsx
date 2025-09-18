import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent } from '../ui/card';
import { colors } from '../../theme/colors';
import { mentorsData, type Mentor } from '../../data/mentorsData';

import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');

interface PeopleTabProps {
  careerCategory: string;
  navigation: NavigationProp<RootStackParamList>;
  district?: string;
}

type FilterType = 'all' | 'district' | 'experience' | 'role';
type SortType = 'rating' | 'experience' | 'helped' | 'recent';

export function PeopleTab({ careerCategory, navigation, district = 'Srinagar' }: PeopleTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('district');
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get filtered and sorted mentors
  const getFilteredMentors = () => {
    let filtered = mentorsData;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply district filter
    if (selectedFilter === 'district') {
      filtered = filtered.filter(mentor => mentor.district === district);
    }
    
    // Apply experience filter
    if (selectedExperience) {
      filtered = filtered.filter(mentor => {
        const mentorExp = parseInt(mentor.totalExperience);
        if (selectedExperience === '0-2') return mentorExp <= 2;
        if (selectedExperience === '3-5') return mentorExp >= 3 && mentorExp <= 5;
        if (selectedExperience === '6-10') return mentorExp >= 6 && mentorExp <= 10;
        if (selectedExperience === '10+') return mentorExp > 10;
        return true;
      });
    }
    
    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return parseInt(b.totalExperience) - parseInt(a.totalExperience);
        case 'helped':
          return b.helpedStudents - a.helpedStudents;
        case 'recent':
          return parseInt(b.graduationYear) - parseInt(a.graduationYear);
        default:
          return b.rating - a.rating;
      }
    });
    
    return filtered;
  };
  
  const filteredMentors = getFilteredMentors();
  
  const handleMentorPress = (mentorId: string) => {
    navigation.navigate('MentorProfile', { mentorId });
  };

  const renderStatsCard = () => (
    <LinearGradient
      colors={[colors.theme.blue, colors.theme.darkBlue]}
      style={styles.statsCard}
    >
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredMentors.length}</Text>
          <Text style={styles.statLabel}>Total People</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredMentors.filter(m => m.district === district).length}</Text>
          <Text style={styles.statLabel}>From {district}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredMentors.filter(m => m.isAvailableForChat).length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role, company..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray[400]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, selectedFilter === 'all' && styles.activeFilterChip]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.activeFilterChipText]}>
              All ({mentorsData.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, selectedFilter === 'district' && styles.activeFilterChip]}
            onPress={() => setSelectedFilter('district')}
          >
            <Ionicons name="location" size={14} color={selectedFilter === 'district' ? colors.theme.blue : colors.gray[600]} />
            <Text style={[styles.filterChipText, selectedFilter === 'district' && styles.activeFilterChipText]}>
              From {district} ({mentorsData.filter(m => m.district === district).length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  const renderMentorCard = (mentor: Mentor, index: number) => (
    <Animated.View
      key={mentor.id}
      style={[
        styles.mentorCard,
        {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <TouchableOpacity onPress={() => handleMentorPress(mentor.id)} activeOpacity={0.8}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.cardGradient}
        >
          <View style={styles.mentorHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[colors.theme.blue, colors.theme.orange]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>{mentor.name.charAt(0)}</Text>
              </LinearGradient>
              {mentor.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.theme.blue} />
                </View>
              )}
            </View>
            
            <View style={styles.mentorInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color={colors.theme.orange} />
                  <Text style={styles.ratingText}>{mentor.rating}</Text>
                </View>
              </View>
              <Text style={styles.mentorRole}>{mentor.currentRole}</Text>
              <Text style={styles.mentorCompany}>{mentor.currentCompany}</Text>
              
              <View style={styles.badgeRow}>
                <View style={styles.experienceBadge}>
                  <Text style={styles.badgeText}>{mentor.totalExperience} exp</Text>
                </View>
                <View style={styles.helpedBadge}>
                  <Text style={styles.badgeText}>{mentor.helpedStudents} helped</Text>
                </View>
              </View>
            </View>
          </View>
          
          <Text style={styles.shortBio}>{mentor.shortBio}</Text>
          
          <View style={styles.skillsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mentor.skills.slice(0, 4).map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {mentor.skills.length > 4 && (
                <View style={styles.skillTag}>
                  <Text style={styles.skillText}>+{mentor.skills.length - 4}</Text>
                </View>
              )}
            </ScrollView>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryAction}>
              <LinearGradient
                colors={[colors.theme.blue, colors.theme.darkBlue]}
                style={styles.actionGradient}
              >
                <Ionicons name="chatbubble" size={16} color="white" />
                <Text style={styles.primaryActionText}>Message</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction}>
              <Ionicons name="call" size={16} color={colors.theme.orange} />
              <Text style={styles.secondaryActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction}>
              <Ionicons name="logo-linkedin" size={16} color={colors.theme.blue} />
              <Text style={styles.secondaryActionText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.theme.lightBlue, colors.theme.lightOrange]}
          style={styles.loadingGradient}
        >
          <Animated.View
            style={[
              styles.loadingSpinner,
              {
                transform: [{
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          >
            <Ionicons name="people" size={48} color={colors.theme.blue} />
          </Animated.View>
          <Text style={styles.loadingText}>Finding amazing people from your district...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.theme.lightBlue, '#ffffff']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>People Network</Text>
          <Text style={styles.subtitle}>Connect with professionals from {district} and beyond</Text>
        </View>
        
        {renderStatsCard()}
        {renderSearchAndFilters()}
      </LinearGradient>
      
      <View style={styles.mentorsContainer}>
        <Text style={styles.sectionTitle}>
          {selectedFilter === 'district' ? `All from ${district}` : 'All Professionals'} ({filteredMentors.length})
        </Text>
        
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor, index) => renderMentorCard(mentor, index))
        ) : (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[colors.gray[50], colors.gray[100]]}
              style={styles.emptyStateGradient}
            >
              <Ionicons name="people" size={64} color={colors.gray[400]} />
              <Text style={styles.emptyStateTitle}>No mentors found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters to find more people
              </Text>
              <TouchableOpacity 
                style={styles.resetFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('district');
                  setSelectedExperience('');
                }}
              >
                <Text style={styles.resetFiltersText}>Reset Filters</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
      
      <View style={styles.safetyNote}>
        <LinearGradient
          colors={[colors.theme.lightOrange, '#fff3e0']}
          style={styles.safetyGradient}
        >
          <Ionicons name="shield-checkmark" size={20} color={colors.theme.orange} />
          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>Safe Networking</Text>
            <Text style={styles.safetyText}>
              All interactions are monitored. Report any inappropriate behavior immediately.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingGradient: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.theme.blue,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.theme.darkBlue,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    lineHeight: 22,
  },
  statsCard: {
    margin: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.theme.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.gray[800],
  },
  filtersRow: {
    marginBottom: 12,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 6,
  },
  activeFilterChip: {
    backgroundColor: colors.theme.lightBlue,
    borderColor: colors.theme.blue,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: colors.theme.blue,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 16,
  },
  mentorsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  mentorCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
  },
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  mentorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.theme.lightOrange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme.orange,
  },
  mentorRole: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme.blue,
    marginBottom: 2,
  },
  mentorCompany: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  experienceBadge: {
    backgroundColor: colors.theme.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  helpedBadge: {
    backgroundColor: colors.theme.lightOrange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
  },
  shortBio: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  skillText: {
    fontSize: 12,
    color: colors.gray[700],
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
  },
  emptyState: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  resetFiltersButton: {
    backgroundColor: colors.theme.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  safetyNote: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  safetyGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.theme.orange,
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 12,
    color: colors.gray[600],
    lineHeight: 16,
  },
});