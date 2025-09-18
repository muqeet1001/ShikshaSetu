import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from "../ui/gradient-button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { colors } from '../../theme/colors';

interface QuickStartData {
  board: string;
  year: string;
  percentage: string;
  stream: string;
  subjects: string[];
  district: string;
  motherTongue: string;
  area: 'Urban' | 'Rural';
  mobile: string;
  otp: string;
}

interface QuickStartScreenProps {
  navigation: any;
  route?: any;
}

export function QuickStartScreen({ navigation, route }: QuickStartScreenProps) {
  const [formData, setFormData] = useState<QuickStartData>({
    board: '',
    year: '',
    percentage: '',
    stream: '',
    subjects: [],
    district: '',
    motherTongue: '',
    area: 'Urban',
    mobile: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);

  const streamSubjects = {
    'Science': ['Physics', 'Chemistry', 'Maths', 'Biology', 'CS', 'English'],
    'Arts': ['History', 'Political Science', 'Geography', 'Psychology', 'English', 'Sociology'],
    'Commerce': ['Accountancy', 'Business Studies', 'Economics', 'Maths', 'English', 'Statistics'],
    'Vocational': ['IT', 'Healthcare', 'Agriculture', 'Tourism', 'English', 'Entrepreneurship']
  };
  const streams = ['Science', 'Arts', 'Commerce', 'Vocational'];
  const districts = ['Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Kupwara', 'Pulwama'];
  const languages = ['Kashmiri', 'Hindi', 'Urdu', 'English', 'Dogri'];

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleStreamChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      stream: value,
      subjects: [] // Clear subjects when stream changes
    }));
  };

  const handleSendOTP = () => {
    if (formData.mobile.length === 10) {
      setOtpSent(true);
      Alert.alert("OTP Sent", "Please check your mobile for the OTP");
    } else {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
    }
  };

  const handleSubmit = () => {
    const requiredFields = ['board', 'stream', 'district', 'mobile', 'otp'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof QuickStartData]);
    
    if (missingFields.length > 0) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    
    navigation.navigate('Interests', { formData });
  };

  return (
    <LinearGradient
      colors={['#f8fafc', '#ffffff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="school" size={28} color={colors.secondary[500]} />
          </View>
          <Text style={styles.headerTitle}>Academic Details</Text>
          <Text style={styles.headerSubtitle}>Tell us about your educational background</Text>
        </View>
        <View style={styles.formContainer}>
        {/* Board and Academic Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Label>Board</Label>
            <Select value={formData.board} onValueChange={(value) => setFormData(prev => ({ ...prev, board: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="JKBOSE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JKBOSE">JKBOSE</SelectItem>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
              </SelectContent>
            </Select>
          </View>

          <View style={styles.column}>
            <Label>Year</Label>
            <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="2025" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </View>

          <View style={styles.column}>
            <Label>Percentage</Label>
            <Input
              placeholder="85"
              value={formData.percentage}
              onChangeText={(text) => setFormData(prev => ({ ...prev, percentage: text }))}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        {/* Stream */}
        <View style={styles.inputGroup}>
          <Label>Stream</Label>
          <Select value={formData.stream} onValueChange={handleStreamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select stream" />
            </SelectTrigger>
            <SelectContent>
              {streams.map(stream => (
                <SelectItem key={stream} value={stream}>{stream}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>

        {/* Subjects */}
        <View style={styles.inputGroup}>
          <Label>Subjects</Label>
          {formData.stream ? (
            <View style={styles.subjectsGrid}>
              {streamSubjects[formData.stream as keyof typeof streamSubjects].map(subject => (
                <View key={subject} style={styles.checkboxRow}>
                  <Checkbox
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
                  />
                  <Text style={styles.checkboxLabel}>{subject}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.selectStreamText}>Please select a stream first to view relevant subjects</Text>
          )}
        </View>

        {/* Location Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Label>District</Label>
            <Select value={formData.district} onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>

          <View style={styles.column}>
            <Label>Mother Tongue</Label>
            <Select value={formData.motherTongue} onValueChange={(value) => setFormData(prev => ({ ...prev, motherTongue: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* Area */}
        <View style={styles.inputGroup}>
          <Label>Area</Label>
          <View style={styles.areaButtons}>
            {(['Urban', 'Rural'] as const).map((area) => (
              <GradientButton
                key={area}
                onPress={() => setFormData(prev => ({ ...prev, area }))}
                variant={formData.area === area ? 'primary' : 'secondary'}
                style={styles.areaButton}
                size="sm"
              >
                {area}
              </GradientButton>
            ))}
          </View>
        </View>

        {/* Mobile and OTP */}
        <View style={styles.inputGroup}>
          <View style={styles.mobileRow}>
            <View style={styles.mobileInputContainer}>
              <Label>Mobile</Label>
              <View style={styles.phoneInput}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <Input
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.mobileInput}
                />
              </View>
            </View>
            <View style={styles.otpButtonContainer}>
              <GradientButton
                variant="secondary"
                onPress={handleSendOTP}
                disabled={formData.mobile.length !== 10 || otpSent}
                style={styles.otpButton}
                size="sm"
              >
                {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
              </GradientButton>
            </View>
          </View>

          {otpSent && (
            <View style={styles.otpContainer}>
              <Label>OTP</Label>
              <Input
                placeholder="Enter 4-digit OTP"
                value={formData.otp}
                onChangeText={(text) => setFormData(prev => ({ ...prev, otp: text }))}
                keyboardType="numeric"
                maxLength={4}
                style={styles.otpInput}
              />
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <GradientButton
            variant="cool"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
            icon={<Ionicons name="arrow-back" size={18} color="white" />}
          >
            Back
          </GradientButton>
          <GradientButton
            variant="primary"
            onPress={handleSubmit}
            style={styles.primaryButton}
            disabled={!formData.board || !formData.stream || !formData.district || !formData.mobile || !formData.otp}
            icon={<Ionicons name="arrow-forward" size={18} color="white" />}
          >
            Continue
          </GradientButton>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIconContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 17,
    color: colors.gray[600],
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  formContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  selectStreamText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    padding: 8,
  },
  areaButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  areaButton: {
    flex: 1,
  },
  mobileRow: {
    gap: 12,
  },
  mobileInputContainer: {
    gap: 8,
  },
  phoneInput: {
    flexDirection: 'row',
  },
  countryCode: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  mobileInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  otpButtonContainer: {
    justifyContent: 'flex-end',
  },
  otpButton: {
    paddingHorizontal: 16,
  },
  otpContainer: {
    gap: 8,
  },
  otpInput: {
    width: 120,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
