import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConsentModalProps } from '../types/government-modules';

interface ExtendedConsentModalProps extends ConsentModalProps {
  onWithdraw?: () => void;
  isConsentActive?: boolean;
  showWithdrawOption?: boolean;
}

const ConsentModal: React.FC<ExtendedConsentModalProps> = ({
  isVisible,
  mentorName,
  purpose,
  dataToReveal,
  onAccept,
  onDecline,
  onWithdraw,
  isConsentActive = false,
  showWithdrawOption = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Consent',
      'Are you sure you want to withdraw consent? This will hide your contact information and stop further communication.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Withdraw', 
          style: 'destructive',
          onPress: () => {
            onWithdraw?.();
          }
        }
      ]
    );
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
              </View>
              <Text style={styles.title}>
                {isConsentActive ? 'Consent Active' : 'Contact Consent'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onDecline}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {!isConsentActive ? (
                <>
                  <Text style={styles.description}>
                    To contact <Text style={styles.mentorName}>{mentorName}</Text> for {purpose}, 
                    we need your consent to share the following information:
                  </Text>

                  <View style={styles.dataList}>
                    {dataToReveal.map((data, index) => (
                      <View key={index} style={styles.dataItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.dataText}>{data}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.privacyNote}>
                    <Ionicons name="information-circle" size={16} color="#3B82F6" />
                    <Text style={styles.privacyText}>
                      Your information will only be shared with this mentor. 
                      You can withdraw consent anytime from your profile settings.
                    </Text>
                  </View>

                  <View style={styles.safetyBanner}>
                    <Ionicons name="warning" size={16} color="#F59E0B" />
                    <Text style={styles.safetyText}>
                      Do not share IDs/OTPs/payments; report misuse from profile.
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.description}>
                    You have active consent to contact <Text style={styles.mentorName}>{mentorName}</Text>.
                  </Text>
                  
                  <View style={styles.activeConsentInfo}>
                    <Text style={styles.infoLabel}>Shared Information:</Text>
                    {dataToReveal.map((data, index) => (
                      <Text key={index} style={styles.sharedDataText}>• {data}</Text>
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {!isConsentActive ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={onDecline}
                    disabled={isProcessing}
                  >
                    <Text style={styles.declineButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton, isProcessing && styles.disabledButton]}
                    onPress={handleAccept}
                    disabled={isProcessing}
                  >
                    <Text style={styles.acceptButtonText}>
                      {isProcessing ? 'Processing...' : 'Agree & Continue'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {showWithdrawOption && (
                    <TouchableOpacity
                      style={[styles.button, styles.withdrawButton]}
                      onPress={handleWithdraw}
                    >
                      <Text style={styles.withdrawButtonText}>Withdraw Consent</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={onDecline}
                  >
                    <Text style={styles.acceptButtonText}>Continue</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  mentorName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  dataList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  privacyText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
    flex: 1,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    gap: 8,
  },
  safetyText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  activeConsentInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  sharedDataText: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  declineButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  acceptButton: {
    backgroundColor: '#3B82F6',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  withdrawButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});

export default ConsentModal;