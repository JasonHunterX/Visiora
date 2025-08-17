/**
 * 后端积分管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { useBackendAuthContext } from '../contexts/BackendAuthContext.jsx';

export const useBackendCredits = () => {
  const {
    credits,
    remainingCredits,
    hasCredits,
    isAnonymous,
    loadUserCredits,
    checkCredits,
    spendCredits,
    addCredits,
    formatCredits,
    showInsufficientCreditsMessage,
    isLoadingCredits
  } = useBackendAuthContext();

  return {
    // 积分状态
    credits,
    remainingCredits,
    hasCredits,
    isAnonymous,
    isLoadingCredits,
    
    // 积分方法
    checkCredits,
    spendCredits,
    addCredits,
    loadUserCredits,
    formatCredits,
    showInsufficientCreditsMessage
  };
};

export default useBackendCredits;