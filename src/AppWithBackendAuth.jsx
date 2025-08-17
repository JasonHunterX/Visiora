/**
 * 使用后端认证的主应用组件
 */

import React, { useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import { BackendAuthProvider, useBackendAuthContext } from "./contexts/BackendAuthContext";
import { LanguageProvider, useTranslation } from "./contexts/LanguageContext";

// Layout Components
import BackendHeader from "./components/layout/BackendHeader";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";

// Tab Components
import ModernTabNavigation from "./components/tabs/ModernTabNavigation";
import EnhancedGenerateTab from "./components/enhanced/EnhancedGenerateTab";

// Lazy load components
const ModernEnhanceTab = lazy(() => import("./components/tabs/ModernEnhanceTab"));
const ModernMasonryHistoryTab = lazy(() => import("./components/tabs/ModernMasonryHistoryTab"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const PhoneAuthModal = lazy(() => import("./components/auth/PhoneAuthModal"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

// Main App Content Component
const AppContent = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, loading } = useBackendAuthContext();
  const [isDark] = useTheme();
  
  // State management
  const [activeTab, setActiveTab] = useState("generate");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  // Tab configuration
  const tabs = [
    { 
      id: "generate", 
      label: t('tabs.generate'), 
      icon: "✨", 
      component: EnhancedGenerateTab 
    },
    { 
      id: "enhance", 
      label: t('tabs.enhance'), 
      icon: "🔮", 
      component: ModernEnhanceTab 
    },
    { 
      id: "history", 
      label: t('tabs.history'), 
      icon: "📚", 
      component: ModernMasonryHistoryTab 
    },
    { 
      id: "gallery", 
      label: t('tabs.gallery'), 
      icon: "🖼️", 
      component: GalleryPage 
    }
  ];

  // Get active tab component
  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  // Auth handlers
  const handleShowLogin = () => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  };

  const handleShowRegister = () => {
    setAuthModalMode("register");
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 text-slate-800'
    }`}>
      <div className="relative">
        {/* Header */}
        <BackendHeader 
          user={user}
          isAuthenticated={isAuthenticated}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
        />

        {/* Hero Section */}
        <Hero />

        {/* Main Content */}
        <main className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            
            {/* Tab Navigation */}
            <div className="mb-8">
              <ModernTabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {ActiveTabComponent && <ActiveTabComponent />}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Auth Modal */}
        <Suspense fallback={null}>
          <PhoneAuthModal
            isOpen={showAuthModal}
            onClose={handleCloseAuthModal}
            defaultMode={authModalMode}
          />
        </Suspense>
      </div>
    </div>
  );
};

// Main App Component with Providers
const App = () => {
  return (
    <LanguageProvider>
      <BackendAuthProvider>
        <AppContent />
      </BackendAuthProvider>
    </LanguageProvider>
  );
};

export default App;