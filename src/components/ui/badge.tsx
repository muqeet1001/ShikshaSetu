import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.badgeText, styles[`${variant}Text`], textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#1f2937',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  defaultText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1f2937',
  },
  outlineText: {
    color: '#1f2937',
  },
  destructiveText: {
    color: '#ffffff',
  },
});