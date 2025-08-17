/**
 * 历史记录管理 Hook - 支持新的后端集成
 */

import { useState, useCallback, useEffect } from 'react';
import { serviceAdapter } from '../services/serviceAdapter.js';
import { useAuthContext } from '../contexts/AuthContextV2.js';

export const useHistory = () => {
  const { user } = useAuthContext();
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 12,
    total: 0,
    pages: 0
  });
  
  /**
   * 获取历史记录
   */
  const fetchHistory = useCallback(async (pageNum = 1, pageSize = 12) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await serviceAdapter.history.getUserHistory(user, pageNum, pageSize);
      
      setHistory(result.records || []);
      setPagination({
        current: result.current || pageNum,
        size: result.size || pageSize,
        total: result.total || 0,
        pages: result.pages || 0
      });
      
      console.log('历史记录已更新:', result);
    } catch (err) {
      console.error('获取历史记录失败:', err);
      setError(err.message || '获取历史记录失败');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * 获取收藏记录
   */
  const fetchFavorites = useCallback(async (pageNum = 1, pageSize = 12) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await serviceAdapter.history.getFavorites(user, pageNum, pageSize);
      
      setFavorites(result.records || []);
      setPagination({
        current: result.current || pageNum,
        size: result.size || pageSize,
        total: result.total || 0,
        pages: result.pages || 0
      });
      
      console.log('收藏记录已更新:', result);
    } catch (err) {
      console.error('获取收藏记录失败:', err);
      setError(err.message || '获取收藏记录失败');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * 搜索历史记录
   */
  const searchHistory = useCallback(async (keyword, pageNum = 1, pageSize = 12) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await serviceAdapter.history.searchHistory(user, keyword, pageNum, pageSize);
      
      setHistory(result.records || []);
      setPagination({
        current: result.current || pageNum,
        size: result.size || pageSize,
        total: result.total || 0,
        pages: result.pages || 0
      });
      
      console.log('搜索结果已更新:', result);
    } catch (err) {
      console.error('搜索历史记录失败:', err);
      setError(err.message || '搜索历史记录失败');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * 切换收藏状态
   */
  const toggleFavorite = useCallback(async (historyId) => {
    try {
      const success = await serviceAdapter.history.toggleFavorite(historyId);
      
      if (success) {
        // 更新本地状态
        setHistory(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ));
        
        setFavorites(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ));
        
        console.log('收藏状态已切换:', historyId);
      }
      
      return success;
    } catch (err) {
      console.error('切换收藏状态失败:', err);
      setError(err.message || '切换收藏状态失败');
      return false;
    }
  }, []);
  
  /**
   * 删除历史记录
   */
  const deleteHistory = useCallback(async (historyId) => {
    try {
      const success = await serviceAdapter.history.deleteHistory(historyId);
      
      if (success) {
        // 从本地状态中移除
        setHistory(prev => prev.filter(item => item.id !== historyId));
        setFavorites(prev => prev.filter(item => item.id !== historyId));
        
        console.log('历史记录已删除:', historyId);
      }
      
      return success;
    } catch (err) {
      console.error('删除历史记录失败:', err);
      setError(err.message || '删除历史记录失败');
      return false;
    }
  }, []);
  
  /**
   * 批量删除历史记录
   */
  const batchDeleteHistory = useCallback(async (historyIds) => {
    try {
      const success = await serviceAdapter.history.batchDeleteHistory(historyIds);
      
      if (success) {
        // 从本地状态中移除
        setHistory(prev => prev.filter(item => !historyIds.includes(item.id)));
        setFavorites(prev => prev.filter(item => !historyIds.includes(item.id)));
        
        console.log('批量删除历史记录成功:', historyIds);
      }
      
      return success;
    } catch (err) {
      console.error('批量删除历史记录失败:', err);
      setError(err.message || '批量删除历史记录失败');
      return false;
    }
  }, []);
  
  /**
   * 增加查看次数
   */
  const incrementViewCount = useCallback(async (historyId) => {
    try {
      const success = await serviceAdapter.history.incrementViewCount(historyId);
      
      if (success && serviceAdapter.config.useBackend) {
        // 后端模式：更新本地状态
        setHistory(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, viewCount: (item.viewCount || 0) + 1 }
            : item
        ));
        
        setFavorites(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, viewCount: (item.viewCount || 0) + 1 }
            : item
        ));
      }
      
      return success;
    } catch (err) {
      console.error('增加查看次数失败:', err);
      return false;
    }
  }, []);
  
  /**
   * 增加下载次数
   */
  const incrementDownloadCount = useCallback(async (historyId) => {
    try {
      const success = await serviceAdapter.history.incrementDownloadCount(historyId);
      
      if (success && serviceAdapter.config.useBackend) {
        // 后端模式：更新本地状态
        setHistory(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, downloadCount: (item.downloadCount || 0) + 1 }
            : item
        ));
        
        setFavorites(prev => prev.map(item => 
          item.id === historyId 
            ? { ...item, downloadCount: (item.downloadCount || 0) + 1 }
            : item
        ));
      }
      
      return success;
    } catch (err) {
      console.error('增加下载次数失败:', err);
      return false;
    }
  }, []);
  
  /**
   * 获取热门提示词
   */
  const getPopularPrompts = useCallback(async (limit = 10) => {
    try {
      const prompts = await serviceAdapter.history.getPopularPrompts(limit);
      return prompts;
    } catch (err) {
      console.error('获取热门提示词失败:', err);
      return [];
    }
  }, []);
  
  /**
   * 下载图像
   */
  const downloadImage = useCallback(async (historyItem) => {
    try {
      // 增加下载次数
      await incrementDownloadCount(historyItem.id);
      
      // 下载图像
      const link = document.createElement('a');
      link.href = historyItem.imageUrl;
      link.download = `visiora-${historyItem.id || Date.now()}.jpg`;
      link.click();
      
      console.log('图像下载已开始:', historyItem.id);
      return true;
    } catch (err) {
      console.error('下载图像失败:', err);
      return false;
    }
  }, [incrementDownloadCount]);
  
  /**
   * 查看图像详情
   */
  const viewImageDetail = useCallback(async (historyItem) => {
    try {
      // 增加查看次数
      await incrementViewCount(historyItem.id);
      
      console.log('图像详情已查看:', historyItem.id);
      return true;
    } catch (err) {
      console.error('查看图像详情失败:', err);
      return false;
    }
  }, [incrementViewCount]);
  
  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setHistory([]);
    setFavorites([]);
    setError(null);
    setPagination({
      current: 1,
      size: 12,
      total: 0,
      pages: 0
    });
  }, []);
  
  // 组件挂载时获取历史记录
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  return {
    // 状态
    history,
    favorites,
    isLoading,
    error,
    pagination,
    
    // 方法
    fetchHistory,
    fetchFavorites,
    searchHistory,
    toggleFavorite,
    deleteHistory,
    batchDeleteHistory,
    incrementViewCount,
    incrementDownloadCount,
    getPopularPrompts,
    downloadImage,
    viewImageDetail,
    reset,
    
    // 便捷访问
    hasHistory: history.length > 0,
    hasFavorites: favorites.length > 0,
    totalCount: pagination.total,
    
    // 配置信息
    useBackend: serviceAdapter.config.useBackend
  };
};