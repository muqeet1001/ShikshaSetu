# CareerCompass - React Native App

A React Native version of the CareerCompass application - an official post-Class 12 guidance app for the Government of Jammu & Kashmir.

## Features

- **Splash Screen**: Government-branded loading screen with J&K emblem
- **Multi-screen Navigation**: Complete flow from personal info to college directory
- **React Navigation**: Stack-based navigation between screens
- **Native UI Components**: Custom Button, Card, and Input components
- **TypeScript Support**: Full type safety throughout the app
- **Expo Compatible**: Easy to run and deploy with Expo

## Getting Started

### Prerequisites

- Node.js (14 or higher)
- npm or yarn
- Expo CLI (install with `npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

### Installation

1. Navigate to the project directory:
```bash
cd ShikshaSetu
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Follow the instructions to open the app:
   - For iOS: Press `i` to open in iOS simulator or scan QR code with Camera app
   - For Android: Press `a` to open in Android emulator or scan QR code with Expo Go
   - For Web: Press `w` to open in web browser

## Project Structure

```
CareerCompass/
├── App.tsx                 # Main app component with navigation
├── src/
│   ├── components/
│   │   ├── screens/        # All screen components
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── SplashScreenWrapper.tsx
│   │   │   └── PlaceholderScreens.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── tailwind.config.js    # Tailwind CSS configuration
```

## Navigation Flow

1. **Splash Screen** - Welcome screen with government branding
2. **Name & Locale** - Personal information collection
3. **Quick Start** - Academic details input
4. **Interests** - Career interest selection
5. **Flowchart** - Career pathway visualization
6. **Eligibility** - Course eligibility summary
7. **Colleges** - College directory listing

## Current Status

✅ **Fully Completed:**
- ✓ Basic project setup with Expo and TypeScript
- ✓ Navigation system with React Navigation
- ✓ Complete UI component library (Button, Card, Input, Label, Select, Checkbox, Badge)
- ✓ All screen components converted from original React app:
  - ✓ SplashScreen with government branding and loading animation
  - ✓ NameLocaleScreen with form validation and language selection
  - ✓ QuickStartScreen with complex forms, dropdowns, checkboxes, and OTP
  - ✓ InterestsScreen with interactive interest selection
  - ✓ CareerFlowchartScreen with expandable flowchart visualization
  - ✓ EligibilitySummaryScreen with course eligibility and filtering
  - ✓ CollegesListScreen with search, filtering, and college details
- ✓ Complete navigation flow with data passing between screens
- ✓ Government-themed styling and branding throughout
- ✓ Mobile-optimized layouts and interactions
- ✓ Form handling with validation and error messages

🚀 **Ready for Enhancement:**
- Add backend API integration for real data
- Implement user authentication and data persistence
- Add multi-language support (Hindi/Urdu)
- Enhanced animations and micro-interactions
- Push notifications for important updates
- Offline functionality with local storage

## Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator (macOS only)
- `npm run web` - Start web version

## Converting Original React Components

The original React web app used:
- **Radix UI components** → Converted to custom React Native components
- **Tailwind CSS classes** → Converted to StyleSheet objects
- **State-based navigation** → Replaced with React Navigation
- **HTML elements** (div, button) → React Native components (View, TouchableOpacity)

Each screen can be individually converted from the original `/src/components/screens/` directory by:
1. Replacing HTML elements with React Native components
2. Converting CSS classes to StyleSheet objects  
3. Updating navigation calls to use React Navigation
4. Testing on mobile devices through Expo

## Contributing

When adding new screens or components:
1. Follow the existing TypeScript patterns
2. Use the established styling approach with StyleSheet
3. Update the navigation types in `src/types/index.ts`
4. Test on both iOS and Android platforms

## Troubleshooting

**Metro Bundler Issues:**
```bash
npx expo start --clear
```

**Navigation Errors:**
- Ensure all screen names in navigation match the type definitions
- Check that all screens are properly registered in App.tsx

**Styling Issues:**
- React Native uses flexbox by default
- Use `StyleSheet.create()` instead of CSS classes
- Test layouts on multiple screen sizes