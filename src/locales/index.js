// Language configuration and exports
import { en } from './en.js';
import { zhCN } from './zh-CN.js';
import { ja } from './ja.js';

export const languages = {
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    translations: en
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    translations: zhCN
  },
  'ja': {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    translations: ja
  }
};

export const defaultLanguage = 'en';

// Available language codes
export const availableLanguages = Object.keys(languages);

// Helper function to get translations for a specific language
export const getTranslations = (languageCode) => {
  return languages[languageCode]?.translations || languages[defaultLanguage].translations;
};

// Helper function to get language info
export const getLanguageInfo = (languageCode) => {
  return languages[languageCode] || languages[defaultLanguage];
};

// Helper function to detect browser language
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages?.[0] || defaultLanguage;
  
  // Try exact match first
  if (availableLanguages.includes(browserLang)) {
    return browserLang;
  }
  
  // Try matching language code without region (e.g., 'en-US' -> 'en')
  const langCode = browserLang.split('-')[0];
  const match = availableLanguages.find(lang => lang.startsWith(langCode));
  
  return match || defaultLanguage;
};