// src/components/tabs/ModernMasonryHistoryTab.jsx
import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import { 
  History, 
  Download, 
  Trash2, 
  Copy, 
  Eye, 
  X,
  Calendar,
  Settings,
  AlertTriangle,
  Cloud
} from "lucide-react";
import { getUserGeneratedImages } from "../../api/imageServiceV2";
import { useAuthContext } from "../../contexts/AuthContextV2";
import { useTranslation } from "../../contexts/LanguageContext";
import GlassCard from "../ui/GlassCard";
import CustomButton from "../ui/CustomButton";
import ExamplePromptsGrid from "../examples/ExamplePromptsGrid";
import { cn } from "../../utils/cn";
import './masonry.css';

const ModernMasonryHistoryTab = memo(({
  history,
  setInputPrompt,
  setActiveTab,
  handleDeleteHistoryItem,
  handleClearAllHistory,
}) => {
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [cloudImages, setCloudImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('local');

  // Fetch cloud images when the component mounts or when user changes
  useEffect(() => {
    if (user && activeHistoryTab === 'cloud') {
      fetchCloudImages();
    }
  }, [user, activeHistoryTab]);

  const fetchCloudImages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const images = await getUserGeneratedImages(user.uid);
      setCloudImages(images);
    } catch (error) {
      console.error('Error fetching cloud images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleUsePrompt = (prompt) => {
    setInputPrompt(prompt);
    setActiveTab("generate");
  };

  const handleDownload = (imageUrl, prompt) => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `visiora-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.jpg`;
      link.click();
    }
  };

  // Format date from Firebase Timestamp or string
  const formatDate = (date) => {
    if (!date) return '';
    
    // If date is a string (from localStorage)
    if (typeof date === 'string') {
      try {
        return date;
      } catch {
        return date;
      }
    }
    
    // If date is a Date object (from Firestore)
    try {
      return date instanceof Date
        ? date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return t('history.unknownDate');
    }
  };

  // Handle deleting a cloud image
  const handleDeleteCloudImage = async (image) => {
    if (!user) return;
    
    try {
      // Import the delete function dynamically to prevent circular dependencies
      const { deleteGeneratedImage } = await import('../../api/imageServiceV2');
      
      // Call the delete function with the required IDs using the flattened structure
      await deleteGeneratedImage(
        user.uid, 
        image.imageId
      );
      
      // Remove the deleted image from state
      setCloudImages(prev => prev.filter(img => img.imageId !== image.imageId));
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting cloud image:', error);
    }
  };

  // Get the right list of images based on activeHistoryTab
  const displayImages = activeHistoryTab === 'local' ? history : cloudImages;
  
  // Map cloud image to the format expected by the UI
  const processedImages = activeHistoryTab === 'cloud'
    ? cloudImages.map(img => ({
        id: img.imageId || img.id,
        imageId: img.imageId,
        prompt: img.prompt,
        imageUrl: img.imageURL, // Note: cloud images use imageURL (uppercase URL)
        timestamp: formatDate(img.createdAt),
        model: img.modelUsed,
        dimensions: `${img.width || 0}x${img.height || 0}`,
        path: img.path,
        isCloud: true
      }))
    : history;

  // Optimized masonry breakpoints for better visual balance
  const breakpointColumns = {
    default: 4,     // 4 columns for very large screens (1400px+)
    1400: 4,        // 4 columns for large desktop
    1200: 3,        // 3 columns for desktop
    900: 2,         // 2 columns for tablet landscape  
    600: 2,         // 2 columns for tablet portrait
    480: 1          // 1 column for mobile
  };

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <GlassCard className="border-slate-300 dark:border-white/10 p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              {t('history.title')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle between local and cloud history */}
            {user && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
                <button
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-medium transition-all",
                    activeHistoryTab === 'local'
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  )}
                  onClick={() => setActiveHistoryTab('local')}
                >
                  {t('history.local')}
                </button>
                <button
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-1",
                    activeHistoryTab === 'cloud'
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  )}
                  onClick={() => setActiveHistoryTab('cloud')}
                >
                  <Cloud size={14} />
                  {t('history.cloud')}
                </button>
              </div>
            )}

            {/* Clear all button */}
            {(activeHistoryTab === 'local' && history.length > 0) && (
              <CustomButton
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm('all')}
                icon={Trash2}
              >
                {t('history.clearAll')}
              </CustomButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="space-y-4 text-center">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 dark:text-slate-300">{t('history.loading')}</p>
          </div>
        </div>
      )}

      {/* No history state */}
      {!isLoading && processedImages.length === 0 && (
        <div className="flex items-center justify-center min-h-[400px]">
          <GlassCard className="text-center max-w-md mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                {activeHistoryTab === 'cloud' ? (
                  <Cloud className="w-8 h-8 text-purple-400" />
                ) : (
                  <History className="w-8 h-8 text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  {activeHistoryTab === 'cloud' 
                    ? t('history.noCloudImages') 
                    : t('history.noHistoryYet')}
                </h3>
                <p className="text-slate-600 dark:text-white/60 leading-relaxed">
                  {activeHistoryTab === 'cloud'
                    ? t('history.noCloudImagesDesc')
                    : t('history.noHistoryYetDesc')}
                </p>
              </div>
              <CustomButton
                onClick={() => setActiveTab("generate")}
                variant="primary"
              >
                {t('history.generateImage')}
              </CustomButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* History Masonry Grid */}
      {!isLoading && processedImages.length > 0 && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="overflow-hidden"
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {processedImages.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                className="masonry-item masonry-fade-in"
              >
                <ImageCard 
                  item={item}
                  onImageClick={handleImageClick}
                />
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl mx-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {selectedImage.prompt}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-2 md:p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center">
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.prompt}
                      className="w-full h-auto object-contain max-h-[70vh]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x450?text=Image+Unavailable";
                      }}
                    />
                  </div>
                </div>

                <div className="w-full md:w-72 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('history.prompt')}
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.prompt || t('history.noPromptAvailable')}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('history.model')}
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.model || "Flux"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('history.dimensions')}
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.dimensions || "1024x1024"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('history.generatedOn')}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
                        <p className="text-sm text-slate-900 dark:text-white">
                          {selectedImage.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <CustomButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleUsePrompt(selectedImage.prompt)}
                      icon={Copy}
                    >
                      {t('history.useThisPrompt')}
                    </CustomButton>
                    
                    <CustomButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                      icon={Download}
                    >
                      {t('history.downloadImage')}
                    </CustomButton>
                    
                    <CustomButton
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseModal();
                        setShowDeleteConfirm(selectedImage.id);
                      }}
                      icon={Trash2}
                    >
                      {t('history.deleteImage')}
                    </CustomButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {showDeleteConfirm === 'all'
                    ? t('history.clearAllHistoryTitle')
                    : t('history.deleteImageTitle')}
                </h3>
                <p className="text-slate-500 dark:text-slate-300 mb-6">
                  {showDeleteConfirm === 'all'
                    ? t('history.clearAllHistoryDesc')
                    : t('history.deleteImageDesc')}
                </p>
                <div className="flex justify-center gap-3">
                  <CustomButton
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    {t('history.cancel')}
                  </CustomButton>
                  <CustomButton
                    variant="destructive"
                    onClick={() => {
                      // Handle delete based on which tab is active
                      if (showDeleteConfirm === 'all') {
                        if (activeHistoryTab === 'local') {
                          handleClearAllHistory();
                        } else if (activeHistoryTab === 'cloud' && user) {
                          // Cloud delete not supported for bulk deletion
                          console.log('Bulk cloud deletion not supported');
                        }
                      } else {
                        // Find the image to delete
                        const imageToDelete = processedImages.find(img => img.id === showDeleteConfirm);
                        
                        if (imageToDelete) {
                          if (activeHistoryTab === 'local' || !imageToDelete.isCloud) {
                            // Handle local deletion
                            handleDeleteHistoryItem(showDeleteConfirm);
                          } else if (activeHistoryTab === 'cloud' && imageToDelete.isCloud) {
                            // Handle cloud deletion
                            handleDeleteCloudImage(imageToDelete);
                          }
                        }
                      }
                      setShowDeleteConfirm(null);
                    }}
                  >
                    {t('history.delete')}
                  </CustomButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Optimized ImageCard component with better loading and hover effects
const ImageCard = memo(({ item, onImageClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 shadow-sm cursor-pointer border border-slate-200/50 dark:border-slate-700/50 masonry-hover-effect">
      {/* Enhanced loading placeholder with skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 masonry-skeleton" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Main image container */}
      <div className="relative overflow-hidden">
        <img
          src={hasError ? "https://via.placeholder.com/400x400/e2e8f0/64748b?text=Image+Unavailable" : item.imageUrl}
          alt={item.prompt || 'Generated image'}
          className={cn(
            "w-full h-auto object-cover transition-all duration-500 ease-out",
            "group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onClick={() => onImageClick(item)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Gradient overlay with enhanced hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Prompt preview */}
            <p className="text-white text-xs leading-relaxed line-clamp-2 mb-3 drop-shadow-lg">
              {item.prompt ? 
                (item.prompt.length > 80 ? `${item.prompt.substring(0, 80)}...` : item.prompt) 
                : 'No prompt available'
              }
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80 text-xs">
                {item.timestamp && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {item.timestamp}
                  </span>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2.5 rounded-full flex items-center justify-center transition-all duration-200 border border-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(item);
                }}
              >
                <Eye size={16} />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Top-right indicators */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {item.isCloud && (
            <div className="bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Cloud size={10} />
              Cloud
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

ModernMasonryHistoryTab.displayName = 'ModernMasonryHistoryTab';

export default ModernMasonryHistoryTab;
