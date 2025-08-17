/**
 * 积分显示组件 - 支持新的后端集成
 */

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Minus, 
  Clock, 
  Gift,
  ShoppingCart,
  History,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Info
} from 'lucide-react';

import GlassCard from '../ui/GlassCard';
import CustomButton from '../ui/CustomButton';
import { useCredits } from '../../hooks/useCredits';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { cn } from '../../utils/cn';

const CreditsDisplay = memo(({ 
  className = "",
  showTransactions = false,
  showActions = true,
  compact = false 
}) => {
  const { user } = useAuthContext();
  const {
    credits,
    isLoading,
    error,
    fetchCredits,
    addCredits,
    getTransactions,
    formatCredits,
    remainingCredits,
    hasCredits,
    isAnonymous,
    useBackend
  } = useCredits();
  
  const [showDetails, setShowDetails] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [addingCredits, setAddingCredits] = useState(false);
  
  /**
   * 加载交易记录
   */
  const loadTransactions = useCallback(async () => {
    if (!showTransactions) return;
    
    setLoadingTransactions(true);
    try {
      const result = await getTransactions(1, 10);
      setTransactions(result.records || []);
    } catch (err) {
      console.error('加载交易记录失败:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, [showTransactions, getTransactions]);
  
  /**
   * 刷新积分信息
   */
  const handleRefresh = useCallback(async () => {
    await fetchCredits();
    if (showTransactions) {
      await loadTransactions();
    }
  }, [fetchCredits, showTransactions, loadTransactions]);
  
  /**
   * 测试添加积分（仅开发模式）
   */
  const handleTestAddCredits = useCallback(async () => {
    if (!import.meta.env.DEV) return;
    
    setAddingCredits(true);
    try {
      const success = await addCredits(5, '测试添加积分');
      if (success) {
        console.log('测试积分添加成功');
      }
    } catch (err) {
      console.error('测试添加积分失败:', err);
    } finally {
      setAddingCredits(false);
    }
  }, [addCredits]);
  
  /**
   * 获取积分类型颜色
   */
  const getCreditTypeColor = useCallback((type) => {
    switch (type) {
      case 'DAILY_RESET':
        return 'text-blue-500';
      case 'BONUS':
        return 'text-green-500';
      case 'PURCHASE':
        return 'text-purple-500';
      case 'CONSUME':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  }, []);
  
  /**
   * 获取积分类型图标
   */
  const getCreditTypeIcon = useCallback((type) => {
    switch (type) {
      case 'DAILY_RESET':
        return Clock;
      case 'BONUS':
        return Gift;
      case 'PURCHASE':
        return ShoppingCart;
      case 'CONSUME':
        return Minus;
      default:
        return Sparkles;
    }
  }, []);
  
  // 展开状态切换
  const toggleDetails = useCallback(() => {
    setShowDetails(prev => {
      const newValue = !prev;
      if (newValue && showTransactions && transactions.length === 0) {
        loadTransactions();
      }
      return newValue;
    });
  }, [showTransactions, transactions.length, loadTransactions]);
  
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 bg-slate-100/50 dark:bg-white/5 rounded-lg border border-slate-300/50 dark:border-white/10",
        className
      )}>
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-white/80">
          {formatCredits(remainingCredits)}
        </span>
        {!hasCredits && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        {showActions && (
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            icon={RefreshCw}
            loading={isLoading}
            className="text-xs"
          >
            刷新
          </CustomButton>
        )}
      </div>
    );
  }
  
  return (
    <GlassCard className={cn(
      "border-slate-300 dark:border-white/10",
      className
    )}>
      <div className="space-y-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              我的积分
            </h3>
            {useBackend && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                后端同步
              </span>
            )}
          </div>
          {showActions && (
            <div className="flex items-center gap-2">
              {import.meta.env.DEV && (
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={handleTestAddCredits}
                  icon={Plus}
                  loading={addingCredits}
                  className="text-xs text-green-600 hover:text-green-500"
                >
                  测试+5
                </CustomButton>
              )}
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                icon={RefreshCw}
                loading={isLoading}
                className="text-xs"
              >
                刷新
              </CustomButton>
            </div>
          )}
        </div>
        
        {/* 错误状态 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 主要积分显示 */}
        <div className="text-center py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCredits(remainingCredits)}
              </span>
              <span className="text-lg text-slate-600 dark:text-white/60">积分</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-white/60">
              <span>总计: {formatCredits(credits.totalCredits)}</span>
              <span>已用: {formatCredits(credits.usedCredits)}</span>
            </div>
            
            {/* 状态指示器 */}
            <div className="flex items-center justify-center gap-2">
              {hasCredits ? (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">积分充足</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">积分不足</span>
                </div>
              )}
              
              {credits.needsDailyReset && (
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">可重置</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 详细信息切换 */}
        <CustomButton
          variant="ghost"
          size="sm"
          onClick={toggleDetails}
          className="w-full text-sm"
          icon={showDetails ? null : Info}
        >
          {showDetails ? '收起详情' : '查看详情'}
        </CustomButton>
        
        {/* 详细信息 */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* 积分组成 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-white/60">每日免费</span>
                    <span className="font-medium">{formatCredits(credits.freeDailyCredits)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-white/60">奖励积分</span>
                    <span className="font-medium text-green-600">{formatCredits(credits.bonusCredits)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-white/60">购买积分</span>
                    <span className="font-medium text-purple-600">{formatCredits(credits.purchasedCredits)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-white/60">用户类型</span>
                    <span className="font-medium">
                      {isAnonymous ? '匿名用户' : '注册用户'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 交易记录 */}
              {showTransactions && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-white/80">最近交易</h4>
                    {loadingTransactions && (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {transactions.length > 0 ? (
                      transactions.map((transaction, index) => {
                        const IconComponent = getCreditTypeIcon(transaction.transactionType);
                        const colorClass = getCreditTypeColor(transaction.transactionType);
                        
                        return (
                          <motion.div
                            key={transaction.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className={cn("w-4 h-4", colorClass)} />
                              <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">
                                  {transaction.description || '积分变动'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-white/50">
                                  {new Date(transaction.createdTime).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={cn(
                                "text-sm font-medium",
                                transaction.isIncrease ? "text-green-600" : "text-red-600"
                              )}>
                                {transaction.isIncrease ? '+' : ''}{transaction.creditsChange}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-white/50">
                                余额: {transaction.balanceAfter}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-500 dark:text-white/50">
                        暂无交易记录
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 帮助信息 */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p className="font-medium">积分说明:</p>
                    <ul className="text-xs space-y-0.5 list-disc list-inside ml-2">
                      <li>每次生图消耗1积分</li>
                      <li>每日登录可获得5个免费积分</li>
                      <li>新用户注册奖励10积分</li>
                      {isAnonymous && <li>登录后可享受更多积分福利</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
});

CreditsDisplay.displayName = 'CreditsDisplay';

export default CreditsDisplay;