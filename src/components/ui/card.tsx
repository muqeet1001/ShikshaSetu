import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.cardContent, style]}>{children}</View>;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  return <View style={[styles.cardTitle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginVertical: 8,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  cardTitle: {
    marginBottom: 12,
  },
});
