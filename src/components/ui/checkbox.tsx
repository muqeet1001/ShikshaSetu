import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string; // Not used in React Native but kept for compatibility
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, disabled = false }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled
      ]}
      onPress={() => !disabled && onCheckedChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});