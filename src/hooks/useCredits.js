/**
 * 积分管理 Hook - 支持新的后端集成
 */

import { useState, useCallback, useEffect } from 'react';
import { serviceAdapter } from '../services/serviceAdapter.js';
import { useAuthContext } from '../contexts/AuthContextV2.js';

export const useCredits = () => {
  const { user } = useAuthContext();
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * 获取用户积分信息
   */
  const fetchCredits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const creditsData = await serviceAdapter.credits.getUserCredits(user);
      setCredits(creditsData);
      
      console.log('积分信息已更新:', creditsData);
    } catch (err) {
      console.error('获取积分信息失败:', err);
      setError(err.message || '获取积分信息失败');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * 检查积分是否足够
   */
  const checkCredits = useCallback(async (requiredCredits = 1) => {
    try {
      const result = await serviceAdapter.credits.checkCredits(user, requiredCredits);
      return result;
    } catch (err) {
      console.error('检查积分失败:', err);
      return {
        hasEnoughCredits: false,
        requiredCredits,
        message: '检查积分失败'
      };
    }
  }, [user]);
  
  /**
   * 消费积分
   */
  const spendCredits = useCallback(async (amount = 1, description = 'AI绘图') => {
    try {
      // 检查积分是否足够
      const checkResult = await checkCredits(amount);
      if (!checkResult.hasEnoughCredits) {
        throw new Error(checkResult.message);
      }
      
      if (serviceAdapter.config.useBackend) {
        // 后端模式：积分扣减由后端在任务创建时自动处理
        console.log('后端模式：积分将在任务创建时自动扣减');
        return true;
      } else {
        // 前端模式：手动扣减本地积分
        const newRemaining = credits.remainingCredits - amount;
        setCredits(prev => ({
          ...prev,
          usedCredits: prev.usedCredits + amount,
          remainingCredits: Math.max(0, newRemaining)
        }));
        
        // 更新本地存储
        const key = user ? 'visiora_user_credits' : 'visiora_anonymous_credits';
        localStorage.setItem(key, Math.max(0, newRemaining).toString());
        
        console.log(`前端模式：已扣减 ${amount} 积分，剩余 ${newRemaining}`);
        return true;
      }
    } catch (err) {
      console.error('消费积分失败:', err);
      throw err;
    }
  }, [user, credits.remainingCredits, checkCredits]);
  
  /**
   * 添加积分
   */
  const addCredits = useCallback(async (amount, description = '积分充值') => {
    try {
      const success = await serviceAdapter.credits.addCredits(user, amount, description);
      
      if (success) {
        // 刷新积分信息
        await fetchCredits();
        console.log(`已添加 ${amount} 积分`);
      }
      
      return success;
    } catch (err) {
      console.error('添加积分失败:', err);
      setError(err.message || '添加积分失败');
      return false;
    }
  }, [user, fetchCredits]);
  
  /**
   * 转移匿名积分到注册账户
   */
  const transferAnonymousCredits = useCallback(async () => {
    if (!user) {
      throw new Error('用户未登录');
    }
    
    try {
      const success = await serviceAdapter.credits.transferAnonymousCredits(user);
      
      if (success) {
        // 刷新积分信息
        await fetchCredits();
        console.log('匿名积分转移成功');
      }
      
      return success;
    } catch (err) {
      console.error('转移匿名积分失败:', err);
      setError(err.message || '转移匿名积分失败');
      return false;
    }
  }, [user, fetchCredits]);
  
  /**
   * 获取积分交易记录
   */
  const getTransactions = useCallback(async (pageNum = 1, pageSize = 10) => {
    try {
      const result = await serviceAdapter.credits.getTransactions(user, pageNum, pageSize);
      return result;
    } catch (err) {
      console.error('获取交易记录失败:', err);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  }, [user]);
  
  /**
   * 显示积分不足提示
   */
  const showInsufficientCreditsMessage = useCallback(() => {
    if (user) {
      return "积分不足。明天登录可获得5个免费每日积分。";
    } else {
      return "积分不足。登录即可获得10个奖励积分！";
    }
  }, [user]);
  
  /**
   * 格式化积分显示
   */
  const formatCredits = useCallback((amount) => {
    if (typeof amount !== 'number') return '0';
    return amount.toLocaleString();
  }, []);
  
  // 组件挂载时获取积分信息
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);
  
  // 用户状态变化时重新获取积分
  useEffect(() => {
    if (user) {
      // 用户登录后，尝试转移匿名积分
      const handleUserLogin = async () => {
        try {
          await transferAnonymousCredits();
        } catch (err) {
          console.log('转移匿名积分失败或无积分可转移:', err.message);
        }
      };
      
      handleUserLogin();
    } else {
      // 用户退出登录，获取匿名积分
      fetchCredits();
    }
  }, [user?.uid, transferAnonymousCredits, fetchCredits]);
  
  return {
    // 状态
    credits,
    isLoading,
    error,
    
    // 方法
    fetchCredits,
    checkCredits,
    spendCredits,
    addCredits,
    transferAnonymousCredits,
    getTransactions,
    
    // 工具方法
    showInsufficientCreditsMessage,
    formatCredits,
    
    // 便捷访问
    remainingCredits: credits.remainingCredits,
    hasCredits: credits.remainingCredits > 0,
    isAnonymous: credits.isAnonymous,
    
    // 配置信息
    useBackend: serviceAdapter.config.useBackend
  };
};