import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '../ui/badge';
import { 
  getStudentById, 
  getStudentDisplayName, 
  getAvatarInitials, 
  getAvatarColor 
} from '../../data/studentsData';

interface StudentProfileScreenProps {
  navigation: any;
  route: any;
}

export function StudentProfileScreen({ navigation, route }: StudentProfileScreenProps) {
  const { studentId } = route?.params || {};
  const student = getStudentById(studentId);
  
  const [showContactOptions, setShowContactOptions] = useState(false);

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person" size={48} color="#9CA3AF" />
          <Text style={styles.errorText}>Student not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = getStudentDisplayName(student);

  const handleContactAction = async (action: 'message' | 'call' | 'linkedin' | 'twitter' | 'whatsapp') => {
    try {
      switch (action) {
        case 'message':
          if (student.contactPreferences.allowMessages) {
            navigation.navigate('MessageThread', { student });
          } else {
            Alert.alert('Messaging Disabled', 'This student has disabled messaging.');
          }
          break;
        
        case 'call':
          if (student.contactPreferences.allowCalls && student.socialLinks.whatsapp) {
            Alert.alert(
              'Call Student',
              `Would you like to call ${displayName}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Call', 
                  onPress: () => Linking.openURL(`tel:${student.socialLinks.whatsapp}`)
                }
              ]
            );
          } else {
            Alert.alert('Calling Not Available', 'This student has not enabled calling or shared their phone number.');
          }
          break;
        
        case 'linkedin':
          if (student.socialLinks.linkedin) {
            await Linking.openURL(student.socialLinks.linkedin);
          } else {
            Alert.alert('LinkedIn', 'LinkedIn profile not available for this student.');
          }
          break;
        
        case 'twitter':
          if (student.socialLinks.twitter) {
            await Linking.openURL(student.socialLinks.twitter);
          } else {
            Alert.alert('X (Twitter)', 'X profile not available for this student.');
          }
          break;
        
        case 'whatsapp':
          if (student.socialLinks.whatsapp) {
            const whatsappUrl = `whatsapp://send?phone=${student.socialLinks.whatsapp}&text=Hi ${displayName}, I found your profile on CareerCompass!`;
            const supported = await Linking.canOpenURL(whatsappUrl);
            if (supported) {
              await Linking.openURL(whatsappUrl);
            } else {
              Alert.alert('WhatsApp', 'WhatsApp is not installed on your device.');
            }
          } else {
            Alert.alert('WhatsApp', 'WhatsApp contact not available for this student.');
          }
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Could not complete this action. Please try again.');
    }
  };

  const handleShareProfile = async () => {
    try {
      const message = `Check out ${displayName}'s profile on CareerCompass! ${student.shortBio}`;
      await Share.share({
        message,
        title: `${displayName} - CareerCompass Profile`
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleConnectRequest = () => {
    Alert.alert(
      'Send Connect Request',
      `Send a connection request to ${displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Request', 
          onPress: () => {
            Alert.alert('Request Sent!', `Your connection request has been sent to ${displayName}.`);
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    switch (student.currentStatus) {
      case 'Working': return '#10B981';
      case 'Alumni': return '#3B82F6';
      case 'Current Student': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = () => {
    switch (student.currentStatus) {
      case 'Working': return 'briefcase';
      case 'Alumni': return 'medal';
      case 'Current Student': return 'school';
      default: return 'person';
    }
  };

  const getStatusText = () => {
    switch (student.currentStatus) {
      case 'Current Student':
        return student.academicYear ? `${student.academicYear}, ${student.course}` : `${student.course} Student`;
      case 'Alumni':
        return `${student.course} Graduate (${student.graduationYear})`;
      case 'Working':
        return `${student.currentRole} at ${student.currentCompany}`;
      default:
        return student.currentStatus;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with back and share */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleShareProfile}
          >
            <Ionicons name="share-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar and Basic Info */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(student.name) }]}>
                <Text style={styles.avatarText}>
                  {getAvatarInitials(student.name)}
                </Text>
              </View>
              {student.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
              {student.isAvailableForChat && (
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>{displayName}</Text>
              <View style={styles.statusContainer}>
                <Ionicons 
                  name={getStatusIcon() as any} 
                  size={16} 
                  color={getStatusColor()} 
                />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.locationText}>{student.district}</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{student.bio}</Text>
          </View>

          {/* Education & Career */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Career</Text>
            <View style={styles.educationItem}>
              <View style={styles.educationHeader}>
                <Ionicons name="school-outline" size={18} color="#3B82F6" />
                <Text style={styles.educationTitle}>{student.college}</Text>
              </View>
              <Text style={styles.educationDetails}>
                {student.course} • {student.currentStatus === 'Current Student' ? 'Pursuing' : 'Graduated'} {student.graduationYear}
              </Text>
              {student.education[0]?.grade && (
                <Text style={styles.gradeText}>Grade: {student.education[0].grade}</Text>
              )}
            </View>

            {student.workExperience.length > 0 && (
              <View style={styles.workSection}>
                {student.workExperience.slice(0, 2).map((work, index) => (
                  <View key={work.id} style={styles.workItem}>
                    <View style={styles.workHeader}>
                      <Ionicons name="briefcase-outline" size={16} color="#F59E0B" />
                      <Text style={styles.workTitle}>{work.position}</Text>
                    </View>
                    <Text style={styles.workCompany}>{work.company}</Text>
                    <Text style={styles.workDuration}>{work.duration}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Skills */}
          {student.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <View style={styles.skillsContainer}>
                {student.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" style={styles.skillBadge}>
                    {skill}
                  </Badge>
                ))}
              </View>
            </View>
          )}

          {/* Achievements */}
          {student.achievements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              {student.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Ionicons name="trophy-outline" size={14} color="#F59E0B" />
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{student.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.stars}>
                <Ionicons name="star" size={12} color="#F59E0B" />
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{student.helpedStudents}</Text>
              <Text style={styles.statLabel}>Students Helped</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{student.responseTime.replace('Usually responds within ', '').replace(' hour', 'h').replace(' minute', 'm')}</Text>
              <Text style={styles.statLabel}>Response Time</Text>
            </View>
          </View>
        </View>

        {/* Contact Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Connect with {displayName}</Text>
          
          <View style={styles.primaryActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => handleContactAction('message')}
            >
              <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={handleConnectRequest}
            >
              <Ionicons name="person-add-outline" size={20} color="#3B82F6" />
              <Text style={styles.secondaryActionText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialActions}>
            {student.contactPreferences.allowCalls && student.socialLinks.whatsapp && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContactAction('call')}
              >
                <Ionicons name="call-outline" size={18} color="#10B981" />
                <Text style={styles.socialButtonText}>Call</Text>
              </TouchableOpacity>
            )}

            {student.socialLinks.whatsapp && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContactAction('whatsapp')}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.socialButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            )}

            {student.socialLinks.linkedin && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContactAction('linkedin')}
              >
                <Ionicons name="logo-linkedin" size={18} color="#0A66C2" />
                <Text style={styles.socialButtonText}>LinkedIn</Text>
              </TouchableOpacity>
            )}

            {student.socialLinks.twitter && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContactAction('twitter')}
              >
                <Ionicons name="logo-twitter" size={18} color="#1DA1F2" />
                <Text style={styles.socialButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#F59E0B" />
          <Text style={styles.safetyText}>
            Keep interactions respectful and professional. Report any inappropriate behavior.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  bioSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  educationItem: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  educationDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  workSection: {
    marginTop: 12,
  },
  workItem: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  workHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  workCompany: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  workDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    marginRight: 8,
    marginBottom: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  stars: {
    marginTop: 2,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryActions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  primaryAction: {
    backgroundColor: '#3B82F6',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  socialActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    margin: 4,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  safetyText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
    marginLeft: 12,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});