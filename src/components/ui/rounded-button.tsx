import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

interface RoundedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export function RoundedButton({
  children,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}: RoundedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isMobile && fullWidth && styles.fullWidthMobile,
    disabled && styles.disabled,
    isPressed && styles[`${variant}Pressed`],
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
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Text style={textStyles}>{children}</Text>
      {icon && icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999, // Pill shape
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Variants
  primary: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
  },
  secondary: {
    backgroundColor: '#6b7280',
    shadowColor: '#6b7280',
  },
  success: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
  },
  danger: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  // Pressed states
  primaryPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.98 }],
  },
  secondaryPressed: {
    backgroundColor: '#4b5563',
    transform: [{ scale: 0.98 }],
  },
  successPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.98 }],
  },
  dangerPressed: {
    backgroundColor: '#dc2626',
    transform: [{ scale: 0.98 }],
  },
  // Sizes
  size_sm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 120,
  },
  size_default: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 160,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  // Full width
  fullWidth: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  fullWidthMobile: {
    width: '90%',
    maxWidth: 320,
  },
  // Disabled
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Text styles
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  successText: {
    color: 'white',
  },
  dangerText: {
    color: 'white',
  },
  disabledText: {
    opacity: 0.7,
  },
  // Text sizes
  size_smText: {
    fontSize: 14,
  },
  size_defaultText: {
    fontSize: 16,
  },
  size_lgText: {
    fontSize: 18,
  },
});