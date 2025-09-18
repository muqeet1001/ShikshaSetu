import React from 'react';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { BackgroundWrapper } from './BackgroundWrapper';

interface ConditionalBackgroundWrapperProps {
  children: React.ReactNode;
}

export const ConditionalBackgroundWrapper: React.FC<ConditionalBackgroundWrapperProps> = ({ children }) => {
  return (
    <NavigationContainer>
      <NavigationStateHandler>
        {children}
      </NavigationStateHandler>
    </NavigationContainer>
  );
};

const NavigationStateHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigationState = useNavigationState(state => state);
  const currentRouteName = navigationState?.routes[navigationState.index]?.name;
  
  // Don't apply background to splash screen
  if (currentRouteName === 'Splash') {
    return <>{children}</>;
  }
  
  // Apply government background to all other screens
  return (
    <BackgroundWrapper>
      {children}
    </BackgroundWrapper>
  );
};