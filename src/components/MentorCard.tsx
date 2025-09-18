import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MentorProfile } from '../types/government-modules';

interface MentorCardProps {
  mentor: MentorProfile;
  onMessagePress: (mentorId: string) => void;
  showFullDetails?: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  mentor, 
  onMessagePress, 
  showFullDetails = false 
}) => {
  const handleCall = () => {
    if (mentor.phoneNumber) {
      Linking.openURL(`tel:${mentor.phoneNumber}`);
    } else {
      Alert.alert('Contact Info', 'Phone number not available. Please send a message to request contact details.');
    }
  };

  const handleLinkedIn = () => {
    if (mentor.linkedinUrl) {
      Linking.openURL(mentor.linkedinUrl);
    } else {
      Alert.alert('LinkedIn', 'LinkedIn profile not available for this mentor.');
    }
  };

  const handleTwitter = () => {
    if (mentor.twitterUrl) {
      Linking.openURL(mentor.twitterUrl);
    } else {
      Alert.alert('Twitter/X', 'Twitter/X profile not available for this mentor.');
    }
  };

  const handleMessage = () => {
    if (mentor.consentGiven && !mentor.isBlocked) {
      onMessagePress(mentor.id);
    } else {
      Alert.alert('Unavailable', 'This mentor is not available for messaging at the moment.');
    }
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
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.mentorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{mentor.name}</Text>
            {mentor.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
          <Text style={styles.course}>{mentor.course}</Text>
          <Text style={styles.college}>{mentor.college}</Text>
        </View>
        
        <View style={styles.statusBadge}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{mentor.currentStatus}</Text>
        </View>
      </View>

      {/* Current Role */}
      {mentor.currentRole && (
        <View style={styles.roleSection}>
          <Ionicons name="briefcase" size={14} color="#6B7280" />
          <Text style={styles.roleText}>
            {mentor.currentRole}
            {mentor.currentOrganization && ` at ${mentor.currentOrganization}`}
          </Text>
        </View>
      )}

      {/* Help Offerings */}
      {mentor.helpOfferings && mentor.helpOfferings.length > 0 && (
        <View style={styles.helpSection}>
          <Ionicons name="help-circle" size={14} color="#6B7280" />
          <Text style={styles.helpText}>
            Can help with: {mentor.helpOfferings.slice(0, 3).join(', ')}
            {mentor.helpOfferings.length > 3 && '...'}
          </Text>
        </View>
      )}

      {/* Availability */}
      <View style={styles.availabilitySection}>
        <View style={styles.availabilityRow}>
          <Ionicons name="time" size={14} color={getAvailabilityColor()} />
          <Text style={[styles.availabilityText, { color: getAvailabilityColor() }]}>
            {mentor.availability} availability
          </Text>
        </View>
        {mentor.responseTime && (
          <Text style={styles.responseTime}>{mentor.responseTime}</Text>
        )}
      </View>

      {/* Languages */}
      {mentor.languages && mentor.languages.length > 0 && (
        <View style={styles.languagesSection}>
          <Ionicons name="language" size={14} color="#6B7280" />
          <View style={styles.languagesList}>
            {mentor.languages.map((lang) => (
              <View key={lang} style={styles.languageTag}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Contact Actions */}
      {mentor.consentGiven && !mentor.isBlocked && (
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryAction]} 
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={16} color="#3B82F6" />
          </TouchableOpacity>

          {mentor.linkedinUrl && (
            <TouchableOpacity style={styles.actionButton} onPress={handleLinkedIn}>
              <Ionicons name="logo-linkedin" size={16} color="#0A66C2" />
            </TouchableOpacity>
          )}

          {mentor.twitterUrl && (
            <TouchableOpacity style={styles.actionButton} onPress={handleTwitter}>
              <Ionicons name="logo-twitter" size={16} color="#1DA1F2" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Privacy Notice */}
      {!mentor.consentGiven && (
        <View style={styles.privacyNotice}>
          <Ionicons name="shield-checkmark" size={14} color="#F59E0B" />
          <Text style={styles.privacyText}>
            Contact details protected by privacy settings
          </Text>
        </View>
      )}

      {/* Additional Details for Full View */}
      {showFullDetails && (
        <View style={styles.additionalDetails}>
          <Text style={styles.graduationText}>
            Graduated: {mentor.graduationYear} • {mentor.district}
          </Text>
          {mentor.lastActive && (
            <Text style={styles.lastActiveText}>
              Last active: {new Date(mentor.lastActive).toLocaleDateString()}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  course: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginBottom: 2,
  },
  college: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  roleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  availabilitySection: {
    marginBottom: 8,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  responseTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginLeft: 20,
  },
  languagesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  languagesList: {
    flexDirection: 'row',
    gap: 4,
  },
  languageTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3B82F6',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  },
  primaryAction: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    flex: 1,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  privacyText: {
    fontSize: 12,
    color: '#D97706',
    flex: 1,
  },
  additionalDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  graduationText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastActiveText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default MentorCard;