/**
 * 增强版图像生成组件 - 集成新的后端服务
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
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
  FolderPlus,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

import GlassCard from '../ui/GlassCard';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';
import ExamplePromptsGrid from '../examples/ExamplePromptsGrid';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import { useBackendCredits } from '../../hooks/useBackendCredits';
import { useBackendAuthContext } from '../../contexts/BackendAuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

const EnhancedGenerateTab = memo(() => {
  const { user } = useBackendAuthContext();
  const { t } = useTranslation();
  
  // 状态管理
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedShape, setSelectedShape] = useState("landscape");
  const [seed, setSeed] = useState("");
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [enhancePromptEnabled, setEnhancePromptEnabled] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  
  // 自定义Hook
  const {
    isLoading,
    imageUrl,
    imageLoaded,
    error,
    progress,
    taskId,
    generateImage,
    enhancePrompt,
    handleImageLoadComplete,
    handleImageLoadError,
    reset,
    useBackend
  } = useImageGeneration();
  
  const {
    credits,
    remainingCredits,
    hasCredits,
    isAnonymous,
    checkCredits,
    spendCredits,
    showInsufficientCreditsMessage,
    formatCredits
  } = useBackendCredits();
  
  // 配置数据
  const shapes = useMemo(() => ({
    landscape: { width: 1344, height: 768, label: t('dimensions.landscape') },
    portrait: { width: 768, height: 1344, label: t('dimensions.portrait') },
    square: { width: 1024, height: 1024, label: t('dimensions.square') },
    wide: { width: 1536, height: 640, label: t('dimensions.wide') },
    story: { width: 576, height: 1024, label: t('dimensions.story') },
    manual: { width: 1024, height: 1024, label: t('dimensions.manual') },
  }), [t]);
  
  const models = useMemo(() => ([
    { value: "flux", label: t('models.flux') },
    { value: "turbo", label: t('models.turbo') },
    { value: "kontext", label: t('models.kontext') },
  ]), [t]);
  
  const categories = useMemo(() => [
    { id: 'portrait', label: t('generate.categories.portrait'), icon: '👤' },
    { id: 'landscape', label: t('generate.categories.landscape'), icon: '🏔️' },
    { id: 'fantasy', label: t('generate.categories.fantasy'), icon: '🧙' },
    { id: 'scifi', label: t('generate.categories.scifi'), icon: '🚀' },
    { id: 'anime', label: t('generate.categories.anime'), icon: '🎌' },
    { id: 'surprise', label: t('generate.categories.surprise'), icon: '🎲' }
  ], [t]);
  
  /**
   * 处理生成点击
   */
  const handleGenerateClick = useCallback(async () => {
    if (!inputPrompt.trim()) {
      alert(t('errors.promptRequired'));
      return;
    }
    
    try {
      // 检查积分
      const creditsCheck = await checkCredits(1);
      if (!creditsCheck.hasEnoughCredits) {
        alert(showInsufficientCreditsMessage());
        return;
      }
      
      // 确定最终尺寸
      let finalWidth, finalHeight;
      if (selectedShape === "manual") {
        finalWidth = width;
        finalHeight = height;
      } else {
        const shapeRatio = shapes[selectedShape];
        finalWidth = shapeRatio.width;
        finalHeight = shapeRatio.height;
      }
      
      // 生成图像
      await generateImage({
        prompt: inputPrompt.trim(),
        model: selectedModel,
        width: finalWidth,
        height: finalHeight,
        seed: seed || null,
        removeWatermark,
        enhancePrompt: enhancePromptEnabled
      });
      
      console.log('图像生成请求已发送');
      
    } catch (err) {
      console.error('生成图像失败:', err);
      alert(err.message || '生成图像失败');
    }
  }, [
    inputPrompt, selectedModel, selectedShape, seed, removeWatermark, 
    enhancePromptEnabled, width, height, shapes, generateImage, 
    checkCredits, showInsufficientCreditsMessage, t
  ]);
  
  /**
   * 处理快速提示词
   */
  const handleConfusedClick = useCallback(() => {
    const examplePrompts = [
      "A majestic dragon soaring through storm clouds, lightning illuminating its scales, cinematic lighting, ultra detailed",
      "A futuristic cyberpunk city at night, neon lights reflecting in rain-soaked streets, atmospheric fog, hyper realistic",
      "An enchanted forest with glowing mushrooms, fairy lights dancing between ancient trees, magical atmosphere, fantasy art",
      "A space station orbiting a distant planet, stars twinkling in the background, sci-fi concept art, highly detailed",
      "A cozy coffee shop in autumn, warm lighting, people reading books, rain on windows, peaceful atmosphere"
    ];
    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setInputPrompt(randomPrompt);
  }, []);
  
  /**
   * 处理AI随机提示词
   */
  const handleGenerateRandomPrompt = useCallback(async (category = "") => {
    setIsGeneratingRandom(true);
    try {
      const categoryMapping = {
        portrait: 'portrait photography',
        landscape: 'landscape photography',
        fantasy: 'fantasy artwork',
        scifi: 'sci-fi scenes',
        anime: 'anime characters',
        surprise: ''
      };
      
      const randomPrompt = await enhancePrompt(categoryMapping[category] || category || 'random creative art');
      setInputPrompt(randomPrompt);
    } catch (error) {
      console.error("Error generating random prompt:", error);
      handleConfusedClick(); // 备用方案
    } finally {
      setIsGeneratingRandom(false);
    }
  }, [enhancePrompt, handleConfusedClick]);
  
  /**
   * 处理下载
   */
  const handleDownload = useCallback(() => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `visiora-${Date.now()}.jpg`;
      link.click();
    }
  }, [imageUrl]);
  
  return (
    <div className="space-y-8">
      {/* 后端状态指示器 */}
      {useBackend && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              使用后端服务 {taskId && `(任务ID: ${taskId})`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-300">
            积分: {formatCredits(remainingCredits)}
          </div>
        </div>
      )}
      
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
                    icon={isGeneratingRandom ? Loader2 : Bot}
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
                      onClick={() => handleGenerateRandomPrompt(category.id)}
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

              {/* Options */}
              <div className="space-y-4">
                <CustomInput
                  label={t('generate.settings.seed')}
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={t('generate.settings.seedPlaceholder')}
                />

                <div className="space-y-3">
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
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-white/80">{t('generate.settings.removeWatermark')}</span>
                  </label>

                  {useBackend && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={enhancePromptEnabled}
                          onChange={(e) => setEnhancePromptEnabled(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-5 h-5 rounded border-2 transition-all duration-200",
                          enhancePromptEnabled 
                            ? "bg-purple-500 border-purple-500" 
                            : "border-white/30 bg-transparent hover:border-white/50"
                        )}>
                          {enhancePromptEnabled && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center justify-center h-full"
                            >
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-white/80">AI增强提示词</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Credits Display */}
          <GlassCard className="border-slate-300 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-white/80">
                  剩余积分
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {formatCredits(remainingCredits)}
                </span>
                {!hasCredits && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            {!hasCredits && (
              <p className="text-xs text-red-500 mt-2">
                {showInsufficientCreditsMessage()}
              </p>
            )}
          </GlassCard>

          {/* Generate Button */}
          <CustomButton
            onClick={handleGenerateClick}
            disabled={isLoading || !inputPrompt.trim() || !hasCredits}
            loading={isLoading}
            size="lg"
            className="w-full"
            icon={isLoading ? null : Sparkles}
          >
            {isLoading 
              ? `${t('generate.buttons.generating')} ${Math.round(progress)}%` 
              : hasCredits 
                ? t('generate.buttons.generate')
                : '积分不足'
            }
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
                                <p className="text-white text-sm">
                                  {useBackend ? '后端生成中...' : t('generate.imageDisplay.generating')}
                                </p>
                                <div className="w-48 h-2 bg-slate-300/50 dark:bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <p className="text-slate-300 text-xs">{Math.round(progress)}% {t('generate.imageDisplay.complete')}</p>
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
                            {useBackend 
                              ? '使用全新的后端AI服务，生成更高质量的图像'
                              : t('generate.imageDisplay.readyDesc')
                            }
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
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm">{error}</p>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onClick={reset}
                          className="mt-3 text-red-400 hover:text-red-300"
                        >
                          重试
                        </CustomButton>
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
    </div>
  );
});

EnhancedGenerateTab.displayName = 'EnhancedGenerateTab';

export default EnhancedGenerateTab;