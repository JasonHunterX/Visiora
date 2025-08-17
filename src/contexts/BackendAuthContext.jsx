/**
 * 后端认证上下文
 * 替代Firebase认证系统
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackendAuth } from '../hooks/useBackendAuth.js';
import { serviceAdapter } from '../services/serviceAdapter.js';

// 创建认证上下文
const BackendAuthContext = createContext();

// 认证提供者组件
export function BackendAuthProvider({ children }) {
  const auth = useBackendAuth();
  const [credits, setCredits] = useState({
    totalCredits: 0,
    usedCredits: 0,
    remainingCredits: 0,
    freeDailyCredits: 0,
    bonusCredits: 0,
    purchasedCredits: 0,
    isAnonymous: true,
    needsDailyReset: false
  });
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  /**
   * 加载用户积分
   */
  const loadUserCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const creditsData = await serviceAdapter.credits.getUserCredits(auth.user);
      setCredits(creditsData);
    } catch (error) {
      console.error('加载用户积分失败:', error);
      // 设置默认积分
      setCredits({
        totalCredits: 0,
        usedCredits: 0,
        remainingCredits: 0,
        freeDailyCredits: 5,
        bonusCredits: 0,
        purchasedCredits: 0,
        isAnonymous: !auth.user,
        needsDailyReset: false
      });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  /**
   * 检查积分是否足够
   */
  const checkCredits = async (requiredCredits = 1) => {
    try {
      const result = await serviceAdapter.credits.checkCredits(auth.user, requiredCredits);
      return result;
    } catch (error) {
      console.error('检查积分失败:', error);
      return {
        hasEnoughCredits: false,
        requiredCredits,
        message: '检查积分失败'
      };
    }
  };

  /**
   * 消费积分
   */
  const spendCredits = async (amount, description = '图像生成') => {
    try {
      // 这里应该在后端自动处理，前端只需要重新加载积分
      await loadUserCredits();
      return true;
    } catch (error) {
      console.error('消费积分失败:', error);
      return false;
    }
  };

  /**
   * 增加积分
   */
  const addCredits = async (amount, description = '') => {
    try {
      const success = await serviceAdapter.credits.addCredits(auth.user, amount, description);
      if (success) {
        await loadUserCredits();
      }
      return success;
    } catch (error) {
      console.error('增加积分失败:', error);
      return false;
    }
  };

  /**
   * 转移匿名积分（登录时）
   */
  const transferAnonymousCredits = async () => {
    try {
      if (auth.user && serviceAdapter.credits.transferAnonymousCredits) {
        const success = await serviceAdapter.credits.transferAnonymousCredits(auth.user);
        if (success) {
          await loadUserCredits();
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error('转移匿名积分失败:', error);
      return false;
    }
  };

  /**
   * 获取积分交易记录
   */
  const getTransactions = async (pageNum = 1, pageSize = 10) => {
    try {
      const result = await serviceAdapter.credits.getTransactions(auth.user, pageNum, pageSize);
      return result;
    } catch (error) {
      console.error('获取积分交易记录失败:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  };

  /**
   * 格式化积分显示
   */
  const formatCredits = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return amount.toString();
  };

  /**
   * 显示积分不足消息
   */
  const showInsufficientCreditsMessage = () => {
    if (credits.isAnonymous) {
      return '匿名用户积分不足，请登录获取更多积分';
    }
    return '积分不足，请充值或等待每日免费积分';
  };

  // 监听用户状态变化，加载积分
  useEffect(() => {
    if (!auth.loading) {
      loadUserCredits();
    }
  }, [auth.user, auth.loading]);

  // 登录成功后转移匿名积分
  useEffect(() => {
    if (auth.user && !auth.loading) {
      transferAnonymousCredits();
    }
  }, [auth.user]);

  const contextValue = {
    // 用户认证状态
    user: auth.user,
    token: auth.token,
    loading: auth.loading || isLoadingCredits,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,

    // 认证方法
    sendCaptcha: auth.sendCaptcha,
    loginWithPhone: auth.loginWithPhone,
    registerWithPhone: auth.registerWithPhone,
    logout: auth.logout,
    updateUserInfo: auth.updateUserInfo,
    clearError: auth.clearError,

    // 积分状态
    credits,
    remainingCredits: credits.remainingCredits,
    hasCredits: credits.remainingCredits > 0,
    isAnonymous: credits.isAnonymous,
    isLoadingCredits,

    // 积分方法
    loadUserCredits,
    checkCredits,
    spendCredits,
    addCredits,
    transferAnonymousCredits,
    getTransactions,
    formatCredits,
    showInsufficientCreditsMessage,

    // 工具方法
    refreshUserInfo: auth.fetchUserInfo,
    refreshToken: auth.refreshUserToken
  };

  return (
    <BackendAuthContext.Provider value={contextValue}>
      {children}
    </BackendAuthContext.Provider>
  );
}

// Hook for using auth context
export function useBackendAuthContext() {
  const context = useContext(BackendAuthContext);
  if (!context) {
    throw new Error('useBackendAuthContext must be used within a BackendAuthProvider');
  }
  return context;
}

export default BackendAuthContext;