# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visiora is a React-based AI image generation application using Pollinations AI API. The project features a modern tech stack with complete user authentication, credit system, and internationalization support (English, Chinese, Japanese).

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (Vite, default port 5173)
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code checking

### Testing
No testing framework is currently configured. If adding tests, Vitest is recommended for consistency with Vite.

## Architecture Overview

### Core Architecture Patterns
- **React 18** with functional components and hooks
- **Context API** for global state management (auth, credits, internationalization)
- **Component-driven development** with highly modular component structure
- **Lazy loading** for non-critical components using React.lazy()
- **Suspense** boundaries for loading states
- **Code splitting** optimized through Vite configuration

### State Management Architecture
- `AuthContextV2.jsx` - Core context for user authentication and credit management
- `LanguageContext.jsx` - Internationalization context with support for en/zh-CN/ja
- Custom hooks for reusable state logic (`useAuth`, `useTheme`, `useLocalStorage`, `useTranslation`)
- Local storage for history tracking and anonymous user credits
- Reducer pattern for complex state management

### Key Service Integrations
- **Firebase Authentication** - User registration/login/email verification
- **Firestore** - User data, generation history, and credit storage
- **Pollinations AI** - Image generation and prompt enhancement API
- **Netlify** - Hosting and deployment platform

## Code Structure

### Component Hierarchy
```
App.jsx (main container)
├── LanguageProvider (i18n context)
├── AuthProvider (authentication context)
├── Header (navigation bar with theme/language switchers)
├── Hero (hero section with animated background)
├── ModernTabNavigation (tab navigation)
├── Tab Components (tab content)
│   ├── ModernGenerateTab (image generation)
│   ├── ModernEnhanceTab (prompt enhancement)
│   ├── ModernMasonryHistoryTab (generation history with masonry layout)
│   └── GalleryPage (user gallery)
└── Footer
```

### API Service Layer
- `pollinationService.js` - Pollinations AI API integration
- `imageServiceV2.js` - Image storage and management with Firestore
- `userServiceV2.js` - User profile management
- `creditsServiceV2.js` - Credit system core logic

### Internationalization System
- `src/locales/` - Translation files for en/zh-CN/ja
- `LanguageContext.jsx` - Language state management with automatic browser detection
- Translation functions: `t()`, `tArray()`, `tWithVars()` for different use cases
- Component-level internationalization implemented across Hero, ExamplePromptsGrid, and ModernMasonryHistoryTab

### Key Design Patterns
- **Composition pattern** - Complex components built from smaller components
- **Custom hooks** - Reusable state logic
- **Lazy loading** - Performance optimization for non-critical components
- **Error boundaries** - Graceful error handling
- **Provider pattern** - Context-based state management

## Firebase Configuration

### Required Environment Variables
Configure in `.env` file:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Firestore Collection Structure
- `users` - User profiles and credit information
- `user_images` - User-generated image records with metadata

## Key Dependencies

### Core Framework
- **React 18.3.1** - Main framework with concurrent features
- **Vite 7.0.4** - Build tool and dev server with HMR
- **Firebase 12.0.0** - Backend services (Auth, Firestore)

### UI and Animation
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library for React
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Customizable icon library
- **react-masonry-css** - Masonry layout for image galleries

### State and Data Management
- **React Context** - Global state management
- **Custom hooks** - Reusable stateful logic
- **Local Storage** - Persistent client-side data

## Development Guidelines

### Code Style and Architecture
- ESLint configuration for code quality
- PascalCase for components, camelCase for functions/variables
- File names match component names
- Functional components with hooks preferred over class components
- Internationalization: Use `useTranslation()` hook and `t()` function for all user-facing text

### Performance Optimization
- React.memo() for preventing unnecessary re-renders
- Lazy loading for non-critical components using React.lazy()
- useMemo() and useCallback() for expensive computations
- Vite configuration includes code splitting with manual chunks for vendor libraries
- Image lazy loading and optimized masonry layout for galleries

### Error Handling and UX
- All API calls wrapped in try-catch blocks
- Development environment shows detailed errors, production shows user-friendly messages
- Suspense boundaries for async component loading
- Loading states and error boundaries throughout the application

## Specialized Components

### Masonry Layout (ModernMasonryHistoryTab)
- Optimized responsive breakpoints: 4/3/2/1 columns based on screen size
- Enhanced loading states with skeleton animations
- Smooth hover effects with CSS transforms and shadows
- Supports both local and cloud image storage

### Internationalization Implementation
- Add new translation keys to `src/locales/en.js`, `zh-CN.js`, and `ja.js`
- Use `useTranslation()` hook in components: `const { t, tArray } = useTranslation()`
- Translation keys use dot notation: `t('section.subsection.key')`
- Arrays handled with `tArray('key')` for lists like typewriter effects

## Deployment

### Netlify Deployment
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables configured in Netlify dashboard
- `netlify.toml` includes redirect rules for SPA routing

### Environment Configuration
- Use `import.meta.env.DEV` for development checks
- All Firebase configuration via environment variables
- Separate configurations for development and production environments