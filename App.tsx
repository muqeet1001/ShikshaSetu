import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './src/types';
import { BackgroundWrapper } from './src/components/common/BackgroundWrapper';
import { SplashScreenWrapper } from './src/components/screens/SplashScreenWrapper';
import { NameLocaleScreen } from './src/components/screens/NameLocaleScreen';
import { QuickStartScreen } from './src/components/screens/QuickStartScreen';
import { InterestsScreen } from './src/components/screens/InterestsScreen';
import { CareerFlowchartScreen } from './src/components/screens/CareerFlowchartScreen';
import { EligibilitySummaryScreen } from './src/components/screens/EligibilitySummaryScreen';
import { CollegesListScreen } from './src/components/screens/CollegesListScreen';
import { MentorsListScreen } from './src/components/screens/MentorsListScreen';
import { MentorProfileScreen } from './src/components/screens/MentorProfileScreen';
import { StudentsListScreen } from './src/components/screens/StudentsListScreen';
import { StudentProfileScreen } from './src/components/screens/StudentProfileScreen';
import { ClassSelectionScreen } from './src/components/screens/ClassSelectionScreen';
import { CareerChatBotScreen } from './src/components/screens/CareerChatBotScreen';
import { CollegeDetailsScreen } from './src/components/screens/CollegeDetailsScreen';
import { MessageThreadScreen } from './src/components/screens/MessageThreadScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Create a wrapper component for non-splash screens
const ScreenWithBackground = ({ children }: { children: React.ReactNode }) => (
  <BackgroundWrapper>{children}</BackgroundWrapper>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e40af', // Professional government blue
            elevation: 4,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            letterSpacing: 0.5,
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreenWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NameLocale"
          options={{ title: 'Personal Information' }}
        >
          {(props) => <ScreenWithBackground><NameLocaleScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="ClassSelection"
          options={{ title: 'Class Selection', headerShown: false }}
        >
          {(props) => <ScreenWithBackground><ClassSelectionScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="CareerChatBot"
          options={{ title: 'Career Guidance', headerShown: false }}
        >
          {(props) => <ScreenWithBackground><CareerChatBotScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="QuickStart"
          options={{ title: 'Academic Details' }}
        >
          {(props) => <ScreenWithBackground><QuickStartScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="Interests"
          options={{ title: 'Career Interests' }}
        >
          {(props) => <ScreenWithBackground><InterestsScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="Flowchart"
          options={{ title: 'Career Pathways' }}
        >
          {(props) => <ScreenWithBackground><CareerFlowchartScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="Eligibility"
          options={{ title: 'Course Eligibility' }}
        >
          {(props) => <ScreenWithBackground><EligibilitySummaryScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="Colleges"
          options={{ title: 'College Directory' }}
        >
          {(props) => <ScreenWithBackground><CollegesListScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="MentorsList"
          options={{ title: 'People from Your District' }}
        >
          {(props) => <ScreenWithBackground><MentorsListScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="MentorProfile"
          options={{ title: 'Mentor Profile' }}
        >
          {(props) => <ScreenWithBackground><MentorProfileScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="StudentsList"
          options={{ title: 'From Your District' }}
        >
          {(props) => <ScreenWithBackground><StudentsListScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="StudentProfile"
          options={{ title: 'Student Profile', headerShown: false }}
        >
          {(props) => <ScreenWithBackground><StudentProfileScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="CollegeDetails"
          options={{ title: 'College Details' }}
        >
          {(props) => <ScreenWithBackground><CollegeDetailsScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
        <Stack.Screen
          name="MessageThread"
          options={{ title: 'Messages' }}
        >
          {(props) => <ScreenWithBackground><MessageThreadScreen {...props} /></ScreenWithBackground>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
