# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript YouTube consultant web application built with Vite. The app provides AI-powered tools for YouTube creators including keyword analysis, channel analysis, chat consultation, and the "One Million Views" consultant feature.

## Development Commands

### Basic Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Setup
- Set `GEMINI_API_KEY` in `.env.local` file for Google Gemini AI integration
- YouTube Data API Key can be configured through the app's settings modal

## Architecture Overview

### Core Application Structure
- **App.tsx**: Main application with view routing (keyword, channel, chat, one-million)
- **Context Providers**: Wraps app in SettingsProvider and LanguageProvider for global state
- **View-based Navigation**: Single-page app with tab-based navigation between features

### Key Directories
- `components/`: React components organized by feature
  - `common/`: Shared components (LoadingSpinner, ActionButton)
  - Feature-specific components (KeywordAnalyzer, ChannelAnalyzer, etc.)
- `contexts/`: React contexts for global state management
  - `SettingsContext.tsx`: Manages API keys and settings
  - `LanguageContext.tsx`: Handles i18n and language switching
- `services/`: External API integrations
  - `geminiService.ts`: Google Gemini AI integration with structured schemas
  - `youtubeDataService.ts`: YouTube Data API integration
- `lib/`: Utility libraries
  - `translations.ts`: Comprehensive i18n system with 4 languages (ko, en, ja, zh)
- `types.ts`: TypeScript definitions for all data structures

### API Integration Architecture
The app integrates with two main APIs:

**Google Gemini AI** (`services/geminiService.ts`):
- Uses structured JSON schemas for consistent AI responses
- Supports multiple languages with localized prompts
- Key functions: keyword analysis, channel analysis, video consulting, script generation
- Image generation for thumbnails and storyboards

**YouTube Data API** (`services/youtubeDataService.ts`):
- Channel and video data fetching
- Search functionality for video discovery
- API quota tracking and management

### Multi-language Support
- Supports Korean (default), English, Japanese, and Chinese
- Translation keys organized hierarchically in `lib/translations.ts`
- Language detection from localStorage with fallback to Korean
- AI prompts are localized for each supported language

### State Management Pattern
- Context-based global state for settings and language
- Local component state for feature-specific data
- Settings persisted to localStorage

## Configuration

### Vite Configuration
- Path aliases: `@/*` maps to project root
- Environment variable injection for API keys
- React plugin configured for JSX support

### TypeScript Configuration
- ES2022 target with modern module resolution
- Path mapping aligned with Vite aliases
- JSX configured for React 19

## Key Features

1. **Keyword Analyzer**: Generate video ideas from keywords using AI
2. **Channel Analyzer**: Comprehensive YouTube channel analysis with growth opportunities
3. **Chat Consultant**: Interactive AI consultant for YouTube strategy
4. **One Million Views Consultant**: Advanced video optimization with benchmark analysis, script generation, and storyboard visualization

## Important Notes

- API keys are stored locally in browser, never sent to app servers
- The app is designed as a client-side application with external API dependencies
- Multi-language support is comprehensive and should be maintained when adding new features
- All AI interactions use structured schemas to ensure consistent response formats
- YouTube API quota is tracked and displayed to users