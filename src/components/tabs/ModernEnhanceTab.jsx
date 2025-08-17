// src/components/tabs/ModernEnhanceTab.jsx
import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, X, Zap, Stars } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import CustomButton from "../ui/CustomButton";
import ExamplePromptsGrid from "../examples/ExamplePromptsGrid";
import { useTranslation } from "../../contexts/LanguageContext";

import { cn } from "../../utils/cn";

const ModernEnhanceTab = memo(({
  inputPrompt = "",
  setInputPrompt = () => {},
  isEnhancing = false,
  handleEnhancePrompt = () => {},
}) => {
  const { t } = useTranslation();
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [showStylesAppliedPopup, setShowStylesAppliedPopup] = useState(false);

  const styleCategories = [
    {
      title: t('enhance.manual.categories.quality'),
      icon: "💎",
      styles: [
        "ultra high resolution",
        "professional photography",
        "8K",
        "highly detailed",
        "sharp focus",
        "masterpiece",
      ],
    },
    {
      title: t('enhance.manual.categories.lighting'),
      icon: "💡",
      styles: [
        "golden hour",
        "dramatic lighting",
        "soft lighting",
        "studio lighting",
        "volumetric lighting",
        "cinematic lighting",
      ],
    },
    {
      title: t('enhance.manual.categories.style'),
      icon: "🎨",
      styles: [
        "photorealistic",
        "hyperrealistic",
        "artistic",
        "professional",
        "award winning",
        "trending on artstation",
      ],
    },
    {
      title: t('enhance.manual.categories.camera'),
      icon: "📸",
      styles: [
        "portrait",
        "wide angle",
        "close-up",
        "macro",
        "telephoto",
        "fisheye",
      ],
    },
    {
      title: t('enhance.manual.categories.mood'),
      icon: "🌈",
      styles: [
        "ethereal",
        "dramatic",
        "serene",
        "mysterious",
        "vibrant",
        "moody",
      ],
    },
  ];

  const enhancePresets = [
    {
      id: "cinematic",
      title: t('enhance.presets.cinematic.title'),
      description: t('enhance.presets.cinematic.description'),
      gradient: "from-purple-500 to-pink-500",
      styles: [
        "8k ultra quality",
        "photorealistic details",
        "volumetric lighting",
        "cinematic shadows",
        "high dynamic range",
        "unreal engine render",
      ],
    },
    {
      id: "aesthetic",
      title: t('enhance.presets.aesthetic.title'),
      description: t('enhance.presets.aesthetic.description'),
      gradient: "from-pink-500 to-rose-500",
      styles: [
        "aesthetic composition",
        "soft pastel tones",
        "minimal lighting",
        "depth of field blur",
        "dreamy textures",
        "bokeh background",
      ],
    },
    {
      id: "anime",
      title: t('enhance.presets.anime.title'),
      description: t('enhance.presets.anime.description'),
      gradient: "from-cyan-500 to-blue-500",
      styles: [
        "anime style shading",
        "manga outline",
        "glowing eyes",
        "dynamic pose",
        "japanese cityscape",
        "cel-shaded color palette",
      ],
    },
    {
      id: "fantasy",
      title: t('enhance.presets.fantasy.title'),
      description: t('enhance.presets.fantasy.description'),
      gradient: "from-emerald-500 to-teal-500",
      styles: [
        "epic fantasy lighting",
        "mythical creatures",
        "divine aura",
        "glowing runes",
        "ancient ruins",
        "floating islands",
      ],
    },
    {
      id: "cartoon",
      title: t('enhance.presets.cartoon.title'),
      description: t('enhance.presets.cartoon.description'),
      gradient: "from-orange-500 to-yellow-500",
      styles: [
        "pixar animation style",
        "smooth plastic texture",
        "big expressive eyes",
        "vivid color palette",
        "storybook lighting",
        "soft character design",
      ],
    },
  ];

  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const applyPreset = (preset) => {
    if (!inputPrompt.trim()) {
      alert(t('enhance.messages.enterPromptFirst'));
      return;
    }

    setSelectedStyles(preset.styles);
    const enhancedPrompt = `${inputPrompt.trim()}, ${preset.styles.join(", ")}`;
    setInputPrompt(enhancedPrompt);

    // No popup for presets - they just apply the styles instantly
  };

  const enhanceWithStyles = () => {
    if (!inputPrompt.trim()) {
      alert(t('enhance.messages.enterPromptFirst'));
      return;
    }

    const enhancedPrompt = `${inputPrompt.trim()}, ${selectedStyles.join(", ")}`;
    setInputPrompt(enhancedPrompt);

    // Clear selected styles after applying
    setSelectedStyles([]);

    console.log("Applying manual styles, showing popup..."); // Debug log
    setShowStylesAppliedPopup(true);
    setTimeout(() => {
      console.log("Hiding popup..."); // Debug log
      setShowStylesAppliedPopup(false);
    }, 2000);
  };

  const clearStyles = () => {
    setSelectedStyles([]);
  };

  return (
    <>
      <div className="space-y-8">
        {/* AI Prompt Enhancement */}
        <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t('enhance.ai.title')}</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">{t('enhance.ai.subtitle')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-white/80">{t('enhance.ai.currentPrompt')}</label>
            <motion.textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t('enhance.ai.placeholder')}
              className="w-full h-32 resize-none rounded-xl border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-200/50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            <CustomButton
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || !inputPrompt.trim()}
              loading={isEnhancing}
              size="lg"
              icon={isEnhancing ? null : Stars}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isEnhancing ? t('enhance.ai.enhancing') : t('enhance.ai.button')}
            </CustomButton>

            <p className="text-xs text-slate-600 dark:text-white/60 text-center">
              {t('enhance.ai.description')}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Style Presets */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-slate-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t('enhance.presets.title')}</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">{t('enhance.presets.subtitle')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancePresets.map((preset) => (
              <div
                key={preset.id}
                className="relative group cursor-pointer"
                onClick={() => applyPreset(preset)}
              >
                <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    `bg-gradient-to-br ${preset.gradient}`
                  )} />
                  
                  <div className="relative z-10 space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{preset.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">{preset.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {preset.styles.slice(0, 3).map((style, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-slate-200/50 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded-md"
                        >
                          {style}
                        </span>
                      ))}
                      {preset.styles.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md">
                          +{preset.styles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Manual Style Selection */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-600 dark:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t('enhance.manual.title')}</h3>
                <p className="text-sm text-slate-600 dark:text-white/60">{t('enhance.manual.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={clearStyles}
                icon={X}
                disabled={selectedStyles.length === 0}
              >
                {t('enhance.manual.clearAll')}
              </CustomButton>
              <CustomButton
                variant="secondary"
                size="sm"
                onClick={enhanceWithStyles}
                disabled={selectedStyles.length === 0 || !inputPrompt.trim()}
                icon={Wand2}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30"
              >
                {t('enhance.manual.apply')} ({selectedStyles.length})
              </CustomButton>
            </div>
          </div>

          <div className="space-y-6">
            {styleCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h4 className="font-semibold text-slate-800 dark:text-white">{category.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                        selectedStyles.includes(style)
                          ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                          : "bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-300/50 dark:hover:bg-white/10 hover:border-slate-400/50 dark:hover:border-white/20 hover:text-slate-800 dark:hover:text-white"
                      )}
                    >
                      {selectedStyles.includes(style) ? "✓ " : "+ "}{style}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Styles Preview */}
          {selectedStyles.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="font-semibold text-slate-800 dark:text-white">{t('enhance.manual.selectedStyles')} ({selectedStyles.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStyles.map((style) => (
                  <span
                    key={style}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm"
                  >
                    {style}
                    <button
                      onClick={() => toggleStyle(style)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Example Prompts Grid - Full Width */}
      <ExamplePromptsGrid onPromptSelect={setInputPrompt} />
      </div>

      {/* Styles Applied Popup - Outside main container */}
      <AnimatePresence>
        {showStylesAppliedPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
          >
            <div className="flex flex-col items-center justify-center gap-4 px-8 py-6 bg-green-600 border-2 border-green-500 rounded-2xl text-white shadow-2xl min-w-[320px] text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-green-600 text-2xl font-bold">✓</span>
              </div>
              <span className="font-bold text-xl">{t('enhance.messages.stylesApplied')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ModernEnhanceTab.displayName = 'ModernEnhanceTab';

export default ModernEnhanceTab;