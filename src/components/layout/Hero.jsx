// src/components/layout/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Zap } from 'lucide-react';
import TypewriterEffect from '../TypewriterEffect';
import AHoleBackground from '../ui/AHoleBackground';
import { useTranslation } from '../../contexts/LanguageContext';

const Hero = () => {
  const { t, tArray } = useTranslation();
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const floatingWords = [];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden -translate-y-[20vh]">
      {/* AHole Animation Background */}
      <AHoleBackground />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            custom={0}
            variants={textVariants}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/10 border border-slate-300/50 dark:border-white/20 backdrop-blur-md text-sm text-slate-700 dark:text-white/80">
              <Sparkles className="w-4 h-4" />
              <span>{t('hero.tagline')}</span>
            </div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={textVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}{" "}
            <TypewriterEffect 
              texts={tArray('hero.typewriter')}
              speed={150}
              delay={1500}
            />
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            custom={3}
            variants={textVariants}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            {[
              { icon: Wand2, textKey: "hero.features.aiGeneration" },
              { icon: Sparkles, textKey: "hero.features.smartEnhancement" },
              { icon: Zap, textKey: "hero.features.lightningFast" }
            ].map(({ icon: Icon, textKey }) => (
              <div
                key={textKey}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/30 dark:bg-white/5 border border-slate-300/30 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80 hover:bg-slate-300/40 dark:hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{t(textKey)}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Words Animation - Mobile Optimized */}
        <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
          {floatingWords.map((word, index) => {
            // Create more controlled positioning patterns for mobile
            const patterns = [
              // Left side - safe zone
              { left: 5 + Math.random() * 15, top: 10 + Math.random() * 80 },
              // Right side - safe zone  
              { left: 80 + Math.random() * 15, top: 10 + Math.random() * 80 },
              // Top - safe zone
              { left: 20 + Math.random() * 60, top: 5 + Math.random() * 15 },
              // Bottom - safe zone
              { left: 20 + Math.random() * 60, top: 80 + Math.random() * 15 },
              // Center - safe zone
              { left: 30 + Math.random() * 40, top: 30 + Math.random() * 40 },
            ];
            
            const pattern = patterns[index % patterns.length];
            const safeOffset = {
              left: Math.max(2, Math.min(85, pattern.left + (Math.random() - 0.5) * 10)),
              top: Math.max(5, Math.min(90, pattern.top + (Math.random() - 0.5) * 10))
            };
            
            return (
              <motion.div
                key={word}
                className="absolute text-slate-300/10 dark:text-white/8 font-bold text-xl md:text-3xl lg:text-5xl select-none will-change-transform"
                style={{
                  left: `${safeOffset.left}%`,
                  top: `${safeOffset.top}%`,
                  transform: 'translate(-50%, -50%)', // Center the text on its position
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-4, 4, -4],
                  scale: [0.95, 1.05, 0.95],
                  x: [-8, 8, -8],
                }}
                transition={{
                  duration: 15 + index * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.8,
                }}
              >
                {word}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;