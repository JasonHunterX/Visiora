/**
 * 增强版历史记录组件 - 集成新的后端服务
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History,
  Heart,
  Search,
  Download,
  Trash2,
  MoreVertical,
  Eye,
  Calendar,
  Image as ImageIcon,
  Filter,
  Grid,
  List,
  RefreshCw,
  Star,
  ExternalLink,
  Copy
} from 'lucide-react';

import GlassCard from '../ui/GlassCard';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';
import { useHistory } from '../../hooks/useHistory';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { useTranslation } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

/**
 * 图像卡片组件
 */
const ImageCard = memo(({ 
  item, 
  onToggleFavorite, 
  onDelete, 
  onDownload, 
  onView,
  useBackend = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 图像 */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.prompt}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            "group-hover:scale-105"
          )}
          onLoad={() => setImageLoaded(true)}
          onClick={() => onView?.(item)}
        />
        
        {/* 加载占位 */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
        )}
        
        {/* 收藏按钮 */}
        <button
          onClick={() => onToggleFavorite?.(item.id)}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200",
            item.isFavorite 
              ? "bg-red-500/80 text-white" 
              : "bg-black/20 text-white/80 hover:bg-black/40"
          )}
        >
          <Heart className={cn(
            "w-4 h-4",
            item.isFavorite && "fill-current"
          )} />
        </button>
        
        {/* 后端标识 */}
        {useBackend && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
            后端
          </div>
        )}
        
        {/* 悬浮操作栏 */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onView?.(item)}
                    icon={Eye}
                    className="text-white/80 hover:text-white text-xs"
                  >
                    查看
                  </CustomButton>
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload?.(item)}
                    icon={Download}
                    className="text-white/80 hover:text-white text-xs"
                  >
                    下载
                  </CustomButton>
                </div>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(item.id)}
                  icon={Trash2}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  删除
                </CustomButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 信息区域 */}
      <div className="p-3 space-y-2">
        <p className="text-sm text-slate-800 dark:text-white/90 line-clamp-2 leading-relaxed">
          {item.prompt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-white/60">
          <div className="flex items-center gap-2">
            {item.modelUsed && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                {item.modelUsed}
              </span>
            )}
            {item.imageWidth && item.imageHeight && (
              <span>{item.imageWidth}×{item.imageHeight}</span>
            )}
          </div>
          
          {useBackend && (
            <div className="flex items-center gap-2">
              {item.viewCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.viewCount}
                </span>
              )}
              {item.downloadCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {item.downloadCount}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="text-xs text-slate-500 dark:text-white/50">
          {new Date(item.createdTime || item.timestamp).toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
});

ImageCard.displayName = 'ImageCard';

/**
 * 分页组件
 */
const Pagination = memo(({ pagination, onPageChange }) => {
  if (pagination.pages <= 1) return null;
  
  const pages = Array.from({ length: pagination.pages }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <CustomButton
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(pagination.current - 1)}
        disabled={pagination.current <= 1}
        className="text-xs"
      >
        上一页
      </CustomButton>
      
      <div className="flex gap-1">
        {pages.map(page => (
          <CustomButton
            key={page}
            variant={page === pagination.current ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="text-xs min-w-[32px]"
          >
            {page}
          </CustomButton>
        ))}
      </div>
      
      <CustomButton
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(pagination.current + 1)}
        disabled={pagination.current >= pagination.pages}
        className="text-xs"
      >
        下一页
      </CustomButton>
    </div>
  );
});

Pagination.displayName = 'Pagination';

/**
 * 主组件
 */
const EnhancedHistoryTab = memo(() => {
  const { user } = useAuthContext();
  const { t } = useTranslation();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  // 自定义Hook
  const {
    history,
    favorites,
    isLoading,
    error,
    pagination,
    fetchHistory,
    fetchFavorites,
    searchHistory,
    toggleFavorite,
    deleteHistory,
    batchDeleteHistory,
    downloadImage,
    viewImageDetail,
    hasHistory,
    hasFavorites,
    useBackend
  } = useHistory();
  
  // 当前显示的数据
  const currentData = useMemo(() => {
    return activeTab === 'favorites' ? favorites : history;
  }, [activeTab, favorites, history]);
  
  /**
   * 处理搜索
   */
  const handleSearch = useCallback(async () => {
    if (searchKeyword.trim()) {
      await searchHistory(searchKeyword.trim());
    } else {
      await fetchHistory();
    }
  }, [searchKeyword, searchHistory, fetchHistory]);
  
  /**
   * 处理标签切换
   */
  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    setSearchKeyword('');
    setSelectedItems(new Set());
    
    if (tab === 'favorites') {
      await fetchFavorites();
    } else {
      await fetchHistory();
    }
  }, [fetchFavorites, fetchHistory]);
  
  /**
   * 处理收藏切换
   */
  const handleToggleFavorite = useCallback(async (itemId) => {
    await toggleFavorite(itemId);
  }, [toggleFavorite]);
  
  /**
   * 处理删除
   */
  const handleDelete = useCallback(async (itemId) => {
    if (confirm('确定要删除这张图片吗？')) {
      await deleteHistory(itemId);
    }
  }, [deleteHistory]);
  
  /**
   * 处理批量删除
   */
  const handleBatchDelete = useCallback(async () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedItems.size} 张图片吗？`)) {
      const itemIds = Array.from(selectedItems);
      await batchDeleteHistory(itemIds);
      setSelectedItems(new Set());
    }
  }, [selectedItems, batchDeleteHistory]);
  
  /**
   * 处理下载
   */
  const handleDownload = useCallback(async (item) => {
    await downloadImage(item);
  }, [downloadImage]);
  
  /**
   * 处理查看
   */
  const handleView = useCallback(async (item) => {
    await viewImageDetail(item);
  }, [viewImageDetail]);
  
  /**
   * 处理页面变化
   */
  const handlePageChange = useCallback(async (page) => {
    if (activeTab === 'favorites') {
      await fetchFavorites(page);
    } else if (searchKeyword.trim()) {
      await searchHistory(searchKeyword.trim(), page);
    } else {
      await fetchHistory(page);
    }
  }, [activeTab, searchKeyword, fetchFavorites, searchHistory, fetchHistory]);
  
  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(async () => {
    if (activeTab === 'favorites') {
      await fetchFavorites();
    } else {
      await fetchHistory();
    }
  }, [activeTab, fetchFavorites, fetchHistory]);
  
  return (
    <div className="space-y-6">
      {/* 头部控制 */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-4">
          {/* 标题和状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {t('history.title')}
              </h3>
              {useBackend && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  后端同步
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
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
              
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                icon={viewMode === 'grid' ? List : Grid}
                className="text-xs"
              >
                {viewMode === 'grid' ? '列表' : '网格'}
              </CustomButton>
            </div>
          </div>
          
          {/* 标签切换 */}
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('history')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeTab === 'history'
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                全部历史 ({pagination.total || 0})
              </button>
              <button
                onClick={() => handleTabChange('favorites')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                  activeTab === 'favorites'
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Heart className="w-4 h-4" />
                收藏
              </button>
            </div>
          </div>
          
          {/* 搜索和操作 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索提示词..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={handleSearch}
                icon={Search}
                className="text-xs"
              >
                搜索
              </CustomButton>
            </div>
            
            {/* 批量操作 */}
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-white/60">
                  已选择 {selectedItems.size} 项
                </span>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={handleBatchDelete}
                  icon={Trash2}
                  className="text-xs text-red-600 hover:text-red-500"
                >
                  批量删除
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
      
      {/* 错误状态 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="space-y-4 text-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 dark:text-white/60 text-sm">加载中...</p>
            </div>
          </motion.div>
        ) : currentData.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* 图像网格 */}
            <div className={cn(
              "grid gap-4",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {currentData.map((item, index) => (
                <ImageCard
                  key={item.id || index}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onView={handleView}
                  useBackend={useBackend}
                />
              ))}
            </div>
            
            {/* 分页 */}
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              {activeTab === 'favorites' ? (
                <Heart className="w-8 h-8 text-purple-400" />
              ) : (
                <History className="w-8 h-8 text-purple-400" />
              )}
            </div>
            <h4 className="text-lg font-medium text-slate-800 dark:text-white/90 mb-2">
              {activeTab === 'favorites' ? '暂无收藏' : '暂无历史记录'}
            </h4>
            <p className="text-sm text-slate-600 dark:text-white/60 max-w-xs">
              {activeTab === 'favorites' 
                ? '您还没有收藏任何图片，去生成一些精美的作品吧！'
                : searchKeyword 
                  ? `没有找到包含"${searchKeyword}"的记录`
                  : '开始您的AI绘图之旅，创作属于您的艺术作品！'
              }
            </p>
            {searchKeyword && (
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchKeyword('');
                  fetchHistory();
                }}
                className="mt-4 text-xs"
              >
                清除搜索
              </CustomButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedHistoryTab.displayName = 'EnhancedHistoryTab';

export default EnhancedHistoryTab;