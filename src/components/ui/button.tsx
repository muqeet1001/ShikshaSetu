import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`size_${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  default: {
    backgroundColor: '#1f2937',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  disabled: {
    opacity: 0.5,
  },
  size_default: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1f2937',
  },
  destructiveText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#1f2937',
  },
  disabledText: {
    opacity: 0.5,
  },
  size_defaultText: {
    fontSize: 16,
  },
  size_smText: {
    fontSize: 14,
  },
  size_lgText: {
    fontSize: 18,
  },
});