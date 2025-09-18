import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface FlowTabProps {
  careerCategory: string;
  renderFlowchart: () => React.ReactNode;
  renderTextOutline: () => React.ReactNode;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

export function FlowTab({ 
  careerCategory, 
  renderFlowchart, 
  renderTextOutline,
  reducedMotion,
  toggleReducedMotion
}: FlowTabProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{careerCategory} Career Pathway</Text>
        <TouchableOpacity 
          style={styles.accessibilityButton}
          onPress={toggleReducedMotion}
        >
          <Ionicons 
            name={reducedMotion ? "eye-outline" : "eye-off-outline"} 
            size={16} 
            color={colors.primary[600]} 
          />
          <Text style={styles.accessibilityButtonText}>
            {reducedMotion ? "Show Visual Flowchart" : "Show Text Outline"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {reducedMotion ? renderTextOutline() : renderFlowchart()}
      
      <View style={styles.sourceContainer}>
        <Text style={styles.sourceText}>Source: Ministry of Education</Text>
        <Text style={styles.sourceText}>Last updated: 2023-24 AY</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[800],
  },
  accessibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  accessibilityButtonText: {
    fontSize: 12,
    color: colors.primary[600],
    marginLeft: 4,
  },
  sourceContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: '#ffffff',
  },
  sourceText: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
});