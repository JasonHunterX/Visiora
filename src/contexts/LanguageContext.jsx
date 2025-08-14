import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getTranslations, getLanguageInfo, detectBrowserLanguage, defaultLanguage } from '../locales/index.js';

// Action types
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING'
};

// Initial state
const initialState = {
  currentLanguage: defaultLanguage,
  translations: getTranslations(defaultLanguage),
  languageInfo: getLanguageInfo(defaultLanguage),
  isLoading: false
};

// Reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
        translations: getTranslations(action.payload),
        languageInfo: getLanguageInfo(action.payload),
        isLoading: false
      };
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Storage key
const LANGUAGE_STORAGE_KEY = 'visiora_language';

// Language provider component
export function LanguageProvider({ children }) {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = () => {
      try {
        // Get language from localStorage first
        let savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        // If no saved language, detect from browser
        if (!savedLanguage) {
          savedLanguage = detectBrowserLanguage();
        }

        // Set the language if it's different from default
        if (savedLanguage && savedLanguage !== defaultLanguage) {
          changeLanguage(savedLanguage, false); // Don't save again
        }
      } catch (error) {
        console.warn('Failed to initialize language:', error);
        // Fallback to default language is already set in initialState
      }
    };

    initializeLanguage();
  }, []);

  // Change language function
  const changeLanguage = (languageCode, saveToStorage = true) => {
    try {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });
      
      // Validate language code
      const languageInfo = getLanguageInfo(languageCode);
      if (!languageInfo || languageCode === state.currentLanguage) {
        dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Update state
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: languageCode });

      // Save to localStorage if requested
      if (saveToStorage) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      }

      // Update document lang attribute
      document.documentElement.lang = languageCode;

      // Log language change in development
      if (import.meta.env.DEV) {
        console.log(`Language changed to: ${languageCode} (${languageInfo.nativeName})`);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Get nested translation value by key path (e.g., 'auth.login.title')
  const t = (keyPath, fallback = keyPath) => {
    try {
      const keys = keyPath.split('.');
      let value = state.translations;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) {
          break;
        }
      }

      return value || fallback;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`Translation not found for key: ${keyPath}`);
      }
      return fallback;
    }
  };

  // Get array of translations (for lists)
  const tArray = (keyPath, fallbackArray = []) => {
    try {
      const value = t(keyPath);
      return Array.isArray(value) ? value : fallbackArray;
    } catch (error) {
      return fallbackArray;
    }
  };

  // Interpolate variables in translation strings
  const tWithVars = (keyPath, variables = {}, fallback = keyPath) => {
    try {
      let translation = t(keyPath, fallback);
      
      if (typeof translation === 'string' && Object.keys(variables).length > 0) {
        Object.entries(variables).forEach(([key, value]) => {
          translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
      }
      
      return translation;
    } catch (error) {
      return fallback;
    }
  };

  const value = {
    // State
    currentLanguage: state.currentLanguage,
    translations: state.translations,
    languageInfo: state.languageInfo,
    isLoading: state.isLoading,
    
    // Actions
    changeLanguage,
    
    // Translation functions
    t,
    tArray,
    tWithVars
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

// Translation hook (shorter alias)
export function useTranslation() {
  return useLanguage();
}