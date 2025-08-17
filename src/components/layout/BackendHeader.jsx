/**
 * 支持后端认证的Header组件
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  User, 
  LogOut, 
  Settings, 
  CreditCard, 
  Phone,
  ChevronDown
} from 'lucide-react';
import ModernThemeToggle from '../ui/ModernThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import CustomButton from '../ui/CustomButton';
import { useBackendAuthContext } from '../../contexts/BackendAuthContext';
import { useTranslation } from '../../contexts/LanguageContext';

const BackendHeader = ({ 
  user, 
  isAuthenticated, 
  onShowLogin, 
  onShowRegister 
}) => {
  const { t } = useTranslation();
  const { logout, credits, formatCredits } = useBackendAuthContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

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
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visiora
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                AI图像生成
              </p>
            </div>
          </motion.div>

          {/* Center - Navigation (可选) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* 可以在这里添加导航链接 */}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Theme Toggle */}
            <ModernThemeToggle />
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                
                {/* Credits Display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 dark:bg-purple-900/30 border border-purple-200/50 dark:border-purple-700/50">
                  <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {formatCredits(credits.remainingCredits)}
                  </span>
                </div>

                {/* User Menu */}
                <div className="relative user-menu">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.nickname?.[0] || user.phone?.slice(-4) || 'U'}
                      </span>
                    </div>
                    {!isMobile && (
                      <>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-20 truncate">
                          {user.nickname || user.phone}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </>
                    )}
                  </motion.button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white">
                              {user.nickname || '用户'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Credits */}
                      {isMobile && (
                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">剩余积分</span>
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {formatCredits(credits.remainingCredits)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3">
                          <User className="w-4 h-4" />
                          个人信息
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3">
                          <CreditCard className="w-4 h-4" />
                          积分记录
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3">
                          <Settings className="w-4 h-4" />
                          设置
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center gap-2">
                <CustomButton
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={onShowLogin}
                  className="text-sm"
                >
                  登录
                </CustomButton>
                <CustomButton
                  size={isMobile ? "sm" : "default"}
                  onClick={onShowRegister}
                  className="text-sm"
                >
                  注册
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default BackendHeader;