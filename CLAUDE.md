# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains two main React Native projects:

- **nommy-employee/**: Active Expo-based React Native application (primary project)
- **payjob-mobile-old/**: Legacy React Native CLI application (reference/deprecated)

The project was originally called "payjob" and used React Native CLI. It has been renamed to "nommy" and is being migrated to Expo. The active project (`nommy-employee`) is an Expo SDK 53 application representing this migration.

## Commands

### Development Commands (nommy-employee/)
```bash
# Start development server
npm start
# or
expo start

# Platform-specific development
npm run android    # Android development build  
npm run ios        # iOS development build
npm run web        # Web development

# Code quality
npm run lint       # ESLint with Expo config
```

### Legacy Commands (payjob-mobile-old/)
```bash
# Development (deprecated - old "payjob" project)
npm start          # Metro bundler
npm run android    # React Native run-android
npm run ios        # React Native run-ios
npm run lint       # ESLint
npm run test       # Jest tests
```

## Architecture Overview

### Active Project (nommy-employee)
- **Framework**: Expo SDK 53 with React Native 0.79.6
- **Navigation**: Expo Router with file-based routing
- **UI Framework**: Basic React Native components with themed components
- **TypeScript**: Full TypeScript support with strict mode
- **Development**: Expo development workflow

### Project Structure (nommy-employee)
- `app/`: File-based routing (Expo Router) - main app screens and navigation
- `components/`: Reusable UI components including themed components (ThemedText, ThemedView)
- `hooks/`: Custom React hooks (theme, color scheme)
- `constants/`: App constants (Colors.ts)
- `assets/`: Static assets (images, fonts, etc.)
- `scripts/`: Build and utility scripts

### Legacy Project Architecture (payjob-mobile-old)
This was the original "payjob" application - a feature-rich React Native CLI application with:
- **Navigation**: React Navigation v6 (stack, tabs, material)
- **State Management**: React Query for server state
- **UI Library**: React Native Paper with Restyle theming
- **Internationalization**: i18next with react-i18next
- **Animations**: React Native Reanimated, Moti, Lottie
- **Maps**: React Native Maps with geolocation services
- **Push Notifications**: Firebase Messaging with Notifee
- **Storage**: React Native Keychain for secure storage
- **Analytics**: App Center (analytics, crashes)

## Migration Context

The project was renamed from "payjob" to "nommy" and migrated from React Native CLI to Expo to simplify development and deployment. Key migration considerations:

1. **Expo Equivalents**: Native modules replaced with Expo-managed alternatives
2. **Build Process**: EAS Build instead of native Android/iOS builds
3. **Configuration**: `app.json` and `app.config.js` for Expo settings
4. **Development**: Expo Dev Client instead of Metro bundler

## Development Notes

- The active project uses Expo's managed workflow
- File-based routing with Expo Router (similar to Next.js)
- Themed components provide consistent styling
- TypeScript strict mode enabled for better type safety
- Path aliases configured (`@/*` maps to root directory)

## Legacy Features to Reference

When implementing features in the active project, refer to the legacy codebase for:
- Complex navigation patterns
- State management with React Query
- Internationalization setup
- Animation implementations
- Map and geolocation features
- Push notification handling
- Form handling with React Hook Form
- UI patterns with React Native Paper
- payjob es el nombre antiguo del proyecto y se usa react native cli, ahora se llama nommy y vamos a migrar todo a expo