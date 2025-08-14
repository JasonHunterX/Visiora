// src/components/tabs/ModernTabNavigation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, History, Grid, LayoutGrid } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTranslation } from '../../contexts/LanguageContext';

const ModernTabNavigation = ({ activeTab, onTabChange, historyCount = 0, showGalleryTab = false }) => {
  const { t } = useTranslation();
  
  let tabs = [
    { id: 'generate', label: t('tabs.generate.label'), icon: Wand2, description: t('tabs.generate.description') },
    { id: 'enhance', label: t('tabs.enhance.label'), icon: Sparkles, description: t('tabs.enhance.description') },
    { id: 'history', label: t('tabs.history.label'), icon: History, description: t('tabs.history.description'), badge: historyCount }
  ];
  
  // Add gallery tab if user is logged in
  if (showGalleryTab) {
    tabs.splice(2, 0, { id: 'gallery', label: t('tabs.gallery.label'), icon: LayoutGrid, description: t('tabs.gallery.description') });
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto mb-8 px-4">
      <div className="relative p-1 rounded-2xl bg-white/0 border border-white/10 backdrop-blur-md w-full">
        {/* Active tab background */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 shadow-lg"
          layoutId="activeTab"
          initial={false}
          animate={{
            left: `${(tabs.findIndex(tab => tab.id === activeTab) / tabs.length) * 100}%`
          }}
          style={{ width: `${100 / tabs.length}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div className={cn(
          "relative z-10 grid gap-0 w-full",
          showGalleryTab ? "grid-cols-4" : "grid-cols-3"
        )}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all duration-200 w-full",
                  "hover:text-slate-800 dark:hover:text-white focus:outline-none focus:text-slate-800 dark:focus:text-white",
                  "touch-manipulation", // Better touch handling
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-white/60"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge !== undefined && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </motion.div>
                  )}
                </div>
                <span className="text-xs">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernTabNavigation;