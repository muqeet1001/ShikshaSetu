import React from 'react';
import { SplashScreen } from './SplashScreen';

interface SplashScreenWrapperProps {
  navigation: any;
}

export function SplashScreenWrapper({ navigation }: SplashScreenWrapperProps) {
  const handleContinue = () => {
    navigation.navigate('NameLocale');
  };

  return <SplashScreen onContinue={handleContinue} />;
}