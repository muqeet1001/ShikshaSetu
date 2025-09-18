import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#6b7280"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
});