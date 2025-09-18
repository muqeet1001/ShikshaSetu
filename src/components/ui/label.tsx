import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string; // Not used in React Native but kept for compatibility
  style?: TextStyle;
}

export function Label({ children, style }: LabelProps) {
  return React.createElement(Text, { style: [styles.label, style] }, children);
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
});