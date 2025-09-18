import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMentorById } from '../../data/government-mock-data';
import ConsentModal from '../ConsentModal';

interface MentorProfileScreenProps {
  navigation: any;
  route: any;
}

export function MentorProfileScreen({ navigation, route }: MentorProfileScreenProps) {
  const { mentorId } = route?.params || {};
  const mentor = getMentorById(mentorId);
  
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentPurpose, setConsentPurpose] = useState('contact');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  if (!mentor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person" size={48} color="#9CA3AF" />
          <Text style={styles.errorText}>Mentor not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleContactAction = (action: 'message' | 'email' | 'linkedin' | 'twitter') => {
    if (!mentor.consentGiven) {
      setConsentPurpose(action);
      setShowConsentModal(true);
      return;
    }

    switch (action) {
      case 'message':
        navigation.navigate('MessageThread', { mentorId: mentor.id });
        break;
      case 'email':
        if (mentor.email) {
          Linking.openURL(`mailto:${mentor.email}`);
        } else {
          Alert.alert('Contact Info', 'Email not available for this mentor.');
        }
        break;
      case 'linkedin':
        if (mentor.linkedinUrl) {
          Linking.openURL(mentor.linkedinUrl);
        } else {
          Alert.alert('LinkedIn', 'LinkedIn profile not available for this mentor.');
        }
        break;
      case 'twitter':
        if (mentor.twitterUrl) {
          Linking.openURL(mentor.twitterUrl);
        } else {
          Alert.alert('X (Twitter)', 'X (Twitter) profile not available for this mentor.');
        }
        break;
    }
  };

  const handleConsentAccept = () => {
    setShowConsentModal(false);
    Alert.alert('Consent Granted', 'You can now contact this mentor securely.');
    // In real app, update backend consent status
  };

  const handleReportMentor = () => {
    Alert.alert(
      'Report Mentor',
      'Please specify the reason for reporting this mentor.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Contact', onPress: () => console.log('Reported: Inappropriate Contact') },
        { text: 'Spam/Scam', onPress: () => console.log('Reported: Spam/Scam') },
        { text: 'Harassment', onPress: () => console.log('Reported: Harassment') },
        { text: 'Other', onPress: () => console.log('Reported: Other') }
      ]
    );
  };

  const handleBlockMentor = () => {
    Alert.alert(
      'Block Mentor',
      'Are you sure you want to block this mentor? You will no longer receive messages from them.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Mentor Blocked', 'You have successfully blocked this mentor.');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusColor = () => {
    switch (mentor.currentStatus) {
      case 'Working': return '#10B981';
      case 'Higher Studies': return '#3B82F6';
      case 'Current Student': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getAvailabilityColor = () => {
    switch (mentor.availability) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mentor Profile</Text>
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleReportMentor}
          >
            <Ionicons name="flag" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(mentor.name) }]}>
              <Text style={styles.avatarText}>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameWithBadge}>
                <Text style={styles.name}>{mentor.name}</Text>
                {mentor.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={styles.district}>{mentor.district}</Text>
              <Text style={styles.languages}>
                Languages: {mentor.languages.join(', ')}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.statusText}>{mentor.currentStatus}</Text>
            </View>
          </View>

          {/* Education & Career */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Career</Text>
            <View style={styles.degreeNowContainer}>
              <Ionicons name="school" size={16} color="#3B82F6" />
              <Text style={styles.degreeNowText}>
                {mentor.course} → {mentor.currentRole || mentor.currentStatus}
              </Text>
            </View>
            <Text style={styles.college}>{mentor.college}</Text>
            <Text style={styles.graduationYear}>Graduated: {mentor.graduationYear}</Text>
            {mentor.currentOrganization && (
              <Text style={styles.organization}>at {mentor.currentOrganization}</Text>
            )}
          </View>

          {/* Help Offerings */}
          {mentor.helpOfferings && mentor.helpOfferings.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Offers help with</Text>
              <View style={styles.helpOfferingsContainer}>
                {mentor.helpOfferings.map((offering, index) => (
                  <View key={index} style={styles.helpOfferingChip}>
                    <Text style={styles.helpOfferingText}>{offering}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityRow}>
                <Ionicons name="time" size={16} color={getAvailabilityColor()} />
                <Text style={[styles.availabilityText, { color: getAvailabilityColor() }]}>
                  {mentor.availability} availability
                </Text>
              </View>
              {mentor.responseTime && (
                <Text style={styles.responseTime}>{mentor.responseTime}</Text>
              )}
            </View>
          </View>

          {/* Last Update */}
          <Text style={styles.lastUpdated}>
            Updated on {new Date(mentor.profileUpdated).toLocaleDateString()}
          </Text>
        </View>

        {/* Contact Actions */}
        {mentor.consentGiven && !mentor.isBlocked && (
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact Options</Text>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={[styles.contactButton, styles.primaryContact]}
                onPress={() => handleContactAction('message')}
              >
                <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                <Text style={styles.primaryContactText}>Message in app</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactAction('email')}
              >
                <Ionicons name="mail" size={20} color="#6B7280" />
                <Text style={styles.contactText}>Email</Text>
              </TouchableOpacity>

              {mentor.linkedinUrl && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContactAction('linkedin')}
                >
                  <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
                  <Text style={styles.contactText}>LinkedIn</Text>
                </TouchableOpacity>
              )}

              {mentor.twitterUrl && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContactAction('twitter')}
                >
                  <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  <Text style={styles.contactText}>X (Twitter)</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Privacy Notice */}
        {!mentor.consentGiven && (
          <View style={styles.privacyNotice}>
            <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
            <Text style={styles.privacyText}>
              Contact details protected by privacy settings. Tap any contact option to request access.
            </Text>
          </View>
        )}

        {/* Report/Block Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.blockButton}
            onPress={handleBlockMentor}
          >
            <Ionicons name="remove-circle" size={16} color="#EF4444" />
            <Text style={styles.blockButtonText}>Block</Text>
          </TouchableOpacity>
        </View>

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
        mentorName={mentor.name}
        purpose={consentPurpose}
        dataToReveal={['Name', 'Course', 'District']}
        onAccept={handleConsentAccept}
        onDecline={() => setShowConsentModal(false)}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  reportButton: {
    padding: 8,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  district: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  languages: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  degreeNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  degreeNowText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  college: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  graduationYear: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  organization: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  helpOfferingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  helpOfferingChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  helpOfferingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  availabilityContainer: {
    gap: 4,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    fontSize: 15,
    fontWeight: '500',
  },
  responseTime: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 24,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  contactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 8,
    flex: 1,
    minWidth: 120,
  },
  primaryContact: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    flex: 2,
  },
  primaryContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    gap: 12,
  },
  privacyText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    lineHeight: 20,
  },
  bottomActions: {
    alignItems: 'center',
    marginBottom: 16,
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  blockButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
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
  },
});