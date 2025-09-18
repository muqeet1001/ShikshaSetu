import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { careerAssessmentService, AssessmentQuestion, AssessmentReport } from '../../services/careerAssessmentService';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface CareerChatBotScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CareerChatBot'>;
}

type AssessmentStep = 'intro' | 'questions' | 'results';

const { width } = Dimensions.get('window');

export function CareerChatBotScreen({ navigation, route }: CareerChatBotScreenProps) {
  const { fullName } = route?.params || {};
  const firstName = fullName ? fullName.split(' ')[0] : 'Student';
  
  // Assessment state
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; selectedOption: string }[]>([]);
  const [assessmentResult, setAssmentResult] = useState<AssessmentReport | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Load questions when component mounts
    setQuestions(careerAssessmentService.getQuestions());
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [currentStep, currentQuestionIndex]);

  const scrollToTop = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const startAssessment = () => {
    setCurrentStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswerSelect = (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Save the answer
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedOption
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Move to next question or show results
    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      // Calculate results
      setTimeout(() => {
        const result = careerAssessmentService.calculateCareerMatch(updatedAnswers);
        setAssmentResult(result);
        setCurrentStep('results');
      }, 500);
    }
  };

  const restartAssessment = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAssmentResult(null);
  };

  const renderIntroScreen = () => (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={60} color="#3b82f6" />
          </View>
          
          <Text style={styles.welcomeTitle}>
            Career Assessment
          </Text>
          
          <Text style={styles.welcomeSubtitle}>
            Hello {firstName}! 👋
          </Text>
          
          <Text style={styles.introText}>
            Let's discover your perfect career path! This simple assessment will help you understand which careers match your interests and personality.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="help-circle" size={20} color="#3b82f6" />
              <Text style={styles.featureText}>5 simple questions</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={20} color="#f97316" />
              <Text style={styles.featureText}>Get percentage matches</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="school" size={20} color="#3b82f6" />
              <Text style={styles.featureText}>J&K specific guidance</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={20} color="#f97316" />
              <Text style={styles.featureText}>Takes only 2 minutes</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={startAssessment}>
            <Text style={styles.startButtonText}>Start Assessment</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderQuestionScreen = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </View>

            {/* Question */}
            <Text style={styles.questionTitle}>
              Question {currentQuestionIndex + 1}
            </Text>
            
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionButton}
                  onPress={() => handleAnswerSelect(option.value)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>{option.text}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderResultsScreen = () => {
    if (!assessmentResult) return null;

    const topCareers = assessmentResult.topCareers.slice(0, 5);

    return (
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsContainer}>
            {/* Header */}
            <View style={styles.resultsHeader}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <Text style={styles.resultsTitle}>Your Career Matches!</Text>
              <Text style={styles.resultsSubtitle}>{firstName}, here are your results</Text>
            </View>

            {/* Personality Type */}
            <View style={styles.personalityCard}>
              <Text style={styles.personalityTitle}>Your Personality</Text>
              <Text style={styles.personalityText}>{assessmentResult.personalityType}</Text>
            </View>

            {/* Career Matches */}
            <View style={styles.careersSection}>
              <Text style={styles.sectionTitle}>Career Matches</Text>
              {topCareers.map((career, index) => (
                <View key={career.career} style={styles.careerCard}>
                  <View style={styles.careerHeader}>
                    <View style={styles.rankContainer}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.careerInfo}>
                      <Text style={styles.careerName}>{career.career}</Text>
                      <Text style={styles.careerDescription}>{career.description}</Text>
                    </View>
                    <View style={styles.percentageContainer}>
                      <Text style={styles.percentageText}>{career.percentage}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.careerDetails}>
                    <Text style={styles.detailLabel}>Stream: <Text style={styles.detailValue}>{career.requiredStream}</Text></Text>
                    <Text style={styles.detailLabel}>Colleges: <Text style={styles.detailValue}>{career.colleges.join(', ')}</Text></Text>
                    <Text style={styles.detailLabel}>Salary: <Text style={styles.detailValue}>{career.salaryRange}</Text></Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {assessmentResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsSection}>
              <Text style={styles.sectionTitle}>Next Steps</Text>
              {assessmentResult.nextSteps.map((step, index) => (
                <View key={index} style={styles.nextStepItem}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={restartAssessment}>
                <Ionicons name="refresh" size={20} color="#f97316" />
                <Text style={styles.secondaryButtonText}>Take Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={() => navigation.navigate('Interests', { 
                  fullName, 
                  assessmentResult,
                  selectedCareer: topCareers[0]?.career 
                })}
              >
                <Text style={styles.primaryButtonText}>Explore More</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0fdf4', '#ffffff']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentStep === 'intro' ? 'Career Assessment' : 
               currentStep === 'questions' ? `Question ${currentQuestionIndex + 1}` : 
               'Your Results'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="school" size={24} color="#3b82f6" />
          </View>
        </View>

        {/* Content */}
        {currentStep === 'intro' && renderIntroScreen()}
        {currentStep === 'questions' && renderQuestionScreen()}
        {currentStep === 'results' && renderResultsScreen()}
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerIcon: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  
  // Intro Screen Styles
  introContainer: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 16,
  },
  introText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  // Question Screen Styles
  questionContainer: {
    padding: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 30,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },

  // Results Screen Styles
  resultsContainer: {
    padding: 24,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  personalityCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  personalityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  personalityText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },

  careersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  careerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  careerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  careerInfo: {
    flex: 1,
  },
  careerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  careerDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  percentageContainer: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  careerDetails: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    color: '#374151',
    fontWeight: '500',
  },

  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  nextStepsSection: {
    marginBottom: 32,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f97316',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
  },
});
