// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import ModernThemeToggle from '../ui/ModernThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import UserProfileButtonFixed from '../auth/UserProfileButtonFixed';
import AuthModalV2 from '../auth/AuthModalV2';
import MobileAuthModalV2 from '../auth/MobileAuthModalV2';
import Button from '../ui/Button';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { useTranslation } from '../../contexts/LanguageContext';

const Header = ({ isDarkMode, onThemeChange }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthContext();
  const { t } = useTranslation();

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/20 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/assets/logo/logo.jpg" 
                  alt={t('header.logo.alt')} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-30 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Visiora
              </h1>
              <p className="text-xs text-slate-600 dark:text-white/60">{t('header.logo.subtitle')}</p>
            </div>
          </motion.div>

          {/* Right side - Language, Theme Toggle and Auth */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <UserProfileButtonFixed onLoginClick={() => {
              setIsAuthModalOpen(true);
              // Default to login tab
              setAuthModalMode('login');
            }} />
            
            {/* Only show Sign Up button when user is not logged in */}
            {!user && (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  // Set to signup tab
                  setAuthModalMode('register');
                }}
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center justify-center border-pink-400/50 min-w-[80px]"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V8z" />
                  </svg>
                  <span>{t('header.signUp')}</span>
                </div>
              </Button>
            )}
            
            <LanguageSwitcher className="hidden sm:block" />
            
            <ModernThemeToggle 
              isDarkMode={isDarkMode} 
              onToggle={onThemeChange}
              className="relative"
            />
          </div>
        </div>
      </div>
      
      {/* Auth Modal - Responsive */}
      {isMobile ? (
        <MobileAuthModalV2
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      ) : (
        <AuthModalV2
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      )}
    </motion.header>
  );
};

export default Header;