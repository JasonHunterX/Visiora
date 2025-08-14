import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { languages, availableLanguages } from '../../locales/index';
import { cn } from '../../utils/cn';

const LanguageSwitcher = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, isLoading } = useLanguage();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language selection
  const handleLanguageSelect = (languageCode) => {
    if (languageCode !== currentLanguage && !isLoading) {
      changeLanguage(languageCode);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageSelect(languageCode);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const currentLang = languages[currentLanguage];

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
          "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
          "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
          isLoading && "opacity-50 cursor-not-allowed",
          isOpen && "bg-white/10 border-white/20"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium min-w-[20px]">
          {currentLang?.flag}
        </span>
        <span className="hidden sm:block text-xs">
          {currentLang?.nativeName}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full right-0 mt-2 py-2 min-w-[180px]",
              "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md",
              "border border-slate-200/50 dark:border-white/10",
              "rounded-xl shadow-lg shadow-black/10 dark:shadow-black/20",
              "z-50 overflow-hidden"
            )}
            role="listbox"
          >
            {availableLanguages.map((languageCode) => {
              const lang = languages[languageCode];
              const isSelected = languageCode === currentLanguage;

              return (
                <motion.button
                  key={languageCode}
                  onClick={() => handleLanguageSelect(languageCode)}
                  onKeyDown={(e) => handleKeyDown(e, languageCode)}
                  disabled={isLoading}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200",
                    "hover:bg-slate-100/50 dark:hover:bg-white/5",
                    "focus:outline-none focus:bg-slate-100/50 dark:focus:bg-white/5",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isSelected && "bg-purple-50/50 dark:bg-purple-900/20"
                  )}
                  whileHover={{ x: 2 }}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Flag */}
                  <span className="text-lg flex-shrink-0" role="img" aria-label={`${lang.name} flag`}>
                    {lang.flag}
                  </span>

                  {/* Language Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white text-sm">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-white/60">
                      {lang.name}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-shrink-0 text-purple-600 dark:text-purple-400"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-lg">
          <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;