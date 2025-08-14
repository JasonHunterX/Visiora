// src/components/tabs/ModernGenerateTab.jsx
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Bot, 
  Zap, 
  Download, 
  Settings,
  Image as ImageIcon,
  Shuffle,
  Save,
  FolderPlus
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';

import ExamplePromptsGrid from '../examples/ExamplePromptsGrid';
import SaveProjectModal from '../projects/SaveProjectModal';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { useTranslation } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

const ModernGenerateTab = memo(({
  inputPrompt,
  setInputPrompt,
  imageUrl,
  isLoading,
  imageLoaded,
  error,
  progress,
  selectedModel,
  setSelectedModel,
  selectedShape,
  setSelectedShape,
  seed,
  setSeed,
  removeWatermark,
  setRemoveWatermark,
  width,
  height,
  setWidth,
  setHeight,
  shapes,
  models,
  handleGenerateClick,
  handleImageLoadComplete,
  handleImageLoadError,
  handleConfusedClick,
  handleGenerateRandomPrompt,
  isGeneratingRandom,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { user } = useAuthContext();
  const { t } = useTranslation();
  
  const categories = [
    { id: 'portrait', label: t('generate.categories.portrait'), icon: '👤' },
    { id: 'landscape', label: t('generate.categories.landscape'), icon: '🏔️' },
    { id: 'fantasy', label: t('generate.categories.fantasy'), icon: '🧙' },
    { id: 'scifi', label: t('generate.categories.scifi'), icon: '🚀' },
    { id: 'anime', label: t('generate.categories.anime'), icon: '🎌' },
    { id: 'surprise', label: t('generate.categories.surprise'), icon: '🎲' }
  ];

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `visiora-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
        {/* Prompt Section */}
        <GlassCard className="border-slate-300 dark:border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('generate.title')}</h3>
              </div>
              <div className="flex gap-2">
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={handleConfusedClick}
                  icon={Zap}
                  className="text-xs"
                >
                  {t('generate.buttons.quick')}
                </CustomButton>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGenerateRandomPrompt()}
                  disabled={isGeneratingRandom}
                  icon={isGeneratingRandom ? null : Bot}
                  loading={isGeneratingRandom}
                  className="text-xs"
                >
                  {t('generate.buttons.aiRandom')}
                </CustomButton>
              </div>
            </div>

            <motion.textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t('generate.placeholder')}
              className="w-full h-32 resize-none rounded-xl border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-200/50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            {/* Category Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-white/80">{t('generate.categories.title')}</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <CustomButton
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const categoryMapping = {
                        portrait: 'portrait photography',
                        landscape: 'landscape photography',
                        fantasy: 'fantasy artwork',
                        scifi: 'sci-fi scenes',
                        anime: 'anime characters',
                        surprise: ''
                      };
                      handleGenerateRandomPrompt(categoryMapping[category.id]);
                    }}
                    disabled={isGeneratingRandom}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span>{category.icon}</span>
                    {category.label}
                  </CustomButton>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Advanced Settings */}
        <GlassCard className="border-slate-300 dark:border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('generate.settings.title')}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-white/80">{t('generate.settings.model')}</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-200/50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value} className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-white/80">{t('generate.settings.dimensions')}</label>
                <select
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-200/50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {Object.entries(shapes).map(([key, shape]) => (
                    <option key={key} value={key} className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">
                      {shape.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual Dimensions */}
            <AnimatePresence>
              {selectedShape === 'manual' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <CustomInput
                    type="number"
                    label={t('generate.settings.width')}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                  <CustomInput
                    type="number"
                    label={t('generate.settings.height')}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seed and Options */}
            <div className="space-y-4">
              <CustomInput
                label={t('generate.settings.seed')}
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder={t('generate.settings.seedPlaceholder')}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={removeWatermark}
                    onChange={(e) => setRemoveWatermark(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-5 h-5 rounded border-2 transition-all duration-200",
                    removeWatermark 
                      ? "bg-purple-500 border-purple-500" 
                      : "border-white/30 bg-transparent hover:border-white/50"
                  )}>
                    {removeWatermark && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center h-full"
                      >
                        <svg className="w-3 h-3 text-slate-700 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 dark:text-white/80">{t('generate.settings.removeWatermark')}</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Generate Button */}
        <CustomButton
          onClick={handleGenerateClick}
          disabled={isLoading || !inputPrompt.trim()}
          loading={isLoading}
          size="lg"
          className="w-full"
          icon={isLoading ? null : Sparkles}
        >
          {isLoading ? `${t('generate.buttons.generating')} ${Math.round(progress)}%` : t('generate.buttons.generate')}
        </CustomButton>
      </div>

      {/* Right Panel - Image Display */}
      <div className="flex flex-col justify-center">
        <GlassCard className="flex-1 border-slate-300 dark:border-white/10">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('generate.imageDisplay.title')}</h3>
              </div>
              {imageUrl && imageLoaded && (
                <div className="flex space-x-2">
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSaveModalOpen(true)}
                    icon={FolderPlus}
                    disabled={!user}
                    title={!user ? t('generate.tooltips.saveLogin') : t('generate.buttons.save')}
                  >
                    {t('generate.buttons.save')}
                  </CustomButton>
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    icon={Download}
                  >
                    {t('generate.buttons.download')}
                  </CustomButton>
                </div>
              )}
            </div>

            <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 min-h-[500px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {imageUrl ? (
                  <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="max-w-full max-h-full object-contain"
                      onLoad={handleImageLoadComplete}
                      onError={handleImageLoadError}
                      loading="lazy"
                      decoding="async"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        imageRendering: 'crisp-edges'
                      }}
                    />
                    
                    {/* Loading Overlay */}
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        >
                          <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                            <div className="space-y-2">
                              <p className="text-slate-800 dark:text-white text-sm">{t('generate.imageDisplay.generating')}</p>
                              <div className="w-48 h-2 bg-slate-300/50 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <p className="text-slate-600 dark:text-white/60 text-xs">{Math.round(progress)}% {t('generate.imageDisplay.complete')}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-center"
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-slate-800 dark:text-white/90 mb-2">{t('generate.imageDisplay.ready')}</h4>
                        <p className="text-sm text-slate-600 dark:text-white/60 max-w-xs">
                          {t('generate.imageDisplay.readyDesc')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center"
                  >
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                        <span className="text-red-400 text-xl">⚠️</span>
                      </div>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    {/* Example Prompts Grid - Full Width */}
    <ExamplePromptsGrid onPromptSelect={setInputPrompt} />
    

    
    {/* Save Project Modal */}
    {isSaveModalOpen && (
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        projectData={{
          prompt: inputPrompt,
          model: selectedModel,
          shape: selectedShape,
          seed: seed,
          removeWatermark,
          width,
          height,
          imageUrl
        }}
      />
    )}
  </div>
  );
});

ModernGenerateTab.displayName = 'ModernGenerateTab';

export default ModernGenerateTab;