// src/components/examples/ExamplePromptsGrid.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';

const ExamplePromptsGrid = ({ onPromptSelect }) => {
  const { t } = useTranslation();
  
  const categories = [
    {
      id: 'anime',
      titleKey: 'examples.categories.anime',
      emoji: '🎌',
      gradient: 'from-pink-500 to-red-500',
      examples: [
        {
          image: '/assets/example_images/Anime/1.jpg',
          prompt: 'Anime-style pirate girl with wind-swept coat standing on the bow of a ship soaring over giant waves, colorful sky with drifting clouds and soaring seagulls, steampunk-inspired goggles on her head, treasure map in one hand, confident smirk on her face, uniquely designed crew flag fluttering behind, stylized ship with fantastical elements like rotating propellers and wooden dragon carvings, vivid cel-shaded coloring, dynamic angle, 4K anime cinematic quality'
        },
        {
          image: '/assets/example_images/Anime/2.jpg',
          prompt: 'Epic anime-style samurai duel on a misty mountain cliff at sunset, fiery sky in the background, cherry blossom petals flying, both warriors with torn haori and glowing swords, high-speed motion lines, cinematic composition, rich traditional Japanese color palette, 8K stylized anime painting'
        },
        {
          image: '/assets/example_images/Anime/3.jpg',
          prompt: 'Anime-style cozy indoor scene of a girl sitting by the window sipping tea, raindrops on the glass, soft ambient light, bookshelf in the background, cat sleeping nearby, warm color tones, gentle expression, aesthetic Ghibli-style art, ultra-detailed, 4K resolution'
        },
        {
          image: '/assets/example_images/Anime/4.jpg',
          prompt: 'Anime-style magical girl in a ruined city, glowing magical circle beneath her feet, shattered buildings in the background, floating embers, scarred face and broken wand, duality of innocence and power, dark clouds above, cinematic angle, moody lighting, stylized in detailed anime art'
        }
      ]
    },
    {
      id: 'nature',
      titleKey: 'examples.categories.nature',
      emoji: '🌲',
      gradient: 'from-green-500 to-emerald-500',
      examples: [
        {
          image: '/assets/example_images/Nature/1.jpg',
          prompt: 'A serene forest with dew-covered grass, golden morning sunlight piercing through tall trees, photorealistic textures, soft mist, birds in flight, 8K natural scenery'
        },
        {
          image: '/assets/example_images/Nature/2.jpg',
          prompt: 'Massive floating islands covered with lush green forests and cascading waterfalls, connected by glowing vines, warm sky tones, fantasy artwork, painterly style, high detail'
        },
        {
          image: '/assets/example_images/Nature/3.jpg',
          prompt: 'A moody cinematic scene of storm clouds rolling over a rugged mountain valley, with lightning strikes and wind-blown trees, epic lighting, dramatic realism, 4K scene composition'
        },
        {
          image: '/assets/example_images/Nature/4.jpg',
          prompt: 'A peaceful Japanese Zen garden with white gravel patterns, bonsai trees, a small wooden bridge over a koi pond, minimalist art style with soft pastel tones and clean aesthetic'
        }
      ]
    },
    {
      id: 'space',
      titleKey: 'examples.categories.space',
      emoji: '🌌',
      gradient: 'from-purple-500 to-indigo-500',
      examples: [
        {
          image: '/assets/example_images/Space/1.jpg',
          prompt: 'A lone astronaut standing under a violet sky, strange glowing rocks surrounding them, twin moons in the background, detailed sci-fi concept art, cinematic lighting'
        },
        {
          image: '/assets/example_images/Space/2.jpg',
          prompt: 'Looking out from a futuristic space station window at a massive spiral galaxy, glowing star systems, 3D rendered, high contrast and clarity, sci-fi ambience'
        },
        {
          image: '/assets/example_images/Space/3.jpg',
          prompt: 'A surreal floating garden in space, with plants growing in zero gravity, stars shimmering all around, painterly fantasy style, dreamlike and vibrant, concept design aesthetic'
        },
        {
          image: '/assets/example_images/Space/4.jpg',
          prompt: 'A spacecraft being pulled into a wormhole, intense color distortion, glowing particles, bending light physics, ultra-detailed visualization in science-illustration style'
        }
      ]
    },
    {
      id: 'streets',
      titleKey: 'examples.categories.streets',
      emoji: '🏙️',
      gradient: 'from-cyan-500 to-blue-500',
      examples: [
        {
          image: '/assets/example_images/Streets/1.jpg',
          prompt: 'A neon-lit street with holographic ads, flying cars above, people in glowing techwear, reflections on wet asphalt, Blade Runner vibes, ultra-detailed cyberpunk concept art'
        },
        {
          image: '/assets/example_images/Streets/2.jpg',
          prompt: 'Old cobblestone street in Paris during rain, people with umbrellas, warm shop lights reflecting off wet pavement, photorealistic lighting, cozy and cinematic mood'
        },
        {
          image: '/assets/example_images/Streets/3.jpg',
          prompt: 'Busy street in 1980s Manhattan, yellow cabs, neon signs, vintage billboards, grainy photo style, rich in retro detail'
        },
        {
          image: '/assets/example_images/Streets/4.jpg',
          prompt: 'A quiet urban alley lit by a golden sunset, long shadows, dust particles in the air, strong depth and lighting, DSLR photography look, cinematic framing'
        }
      ]
    },
    {
      id: 'ghibli-pixar',
      titleKey: 'examples.categories.ghibliPixar',
      emoji: '🎥',
      gradient: 'from-orange-500 to-red-500',
      examples: [
        {
          image: '/assets/example_images/Ghibli-Pixar/1.jpg',
          prompt: 'A cozy rural village with windmills, green hills, and warm sunlight, stylized painterly textures, whimsical Ghibli charm, clouds drifting in a blue sky, animated vibe'
        },
        {
          image: '/assets/example_images/Ghibli-Pixar/2.jpg',
          prompt: 'A cute, round robot with expressive digital eyes, rolling through a futuristic lab, 3D Pixar-style rendering, bright color palette, stylized metallic textures'
        },
        {
          image: '/assets/example_images/Ghibli-Pixar/3.jpg',
          prompt: 'A magical bakery floating on a cloud, smoke puffing from its chimney, flying pastries around, pastel color scheme, Ghibli-Pixar fusion, fantasy 3D cartoon look'
        },
        {
          image: '/assets/example_images/Ghibli-Pixar/4.jpg',
          prompt: 'A young explorer sailing a colorful boat across calm cartoon oceans, stylized waves and sky, expressive character design, Pixar short-film quality'
        }
      ]
    },
    {
      id: 'misc',
      titleKey: 'examples.categories.misc',
      emoji: '🌀',
      gradient: 'from-yellow-500 to-pink-500',
      examples: [
        {
          image: '/assets/example_images/Misc/1.jpg',
          prompt: 'A human head split open with galaxies and memories spilling out, surreal art style, symbolic, dreamlike elements, soft brushwork and contrast'
        },
        {
          image: '/assets/example_images/Misc/2.jpg',
          prompt: 'A minimalist futuristic living room with smooth white surfaces, floating furniture, ambient lighting, clean design aesthetics, 3D architectural render'
        },
        {
          image: '/assets/example_images/Misc/3.jpg',
          prompt: 'A dark, twisted forest under a blood moon, thick fog covering the ground, shadowy figures in the background, horror aesthetic, cinematic thriller tone'
        },
        {
          image: '/assets/example_images/Misc/4.jpg',
          prompt: 'Floating neon geometric shapes over a dark background, glowing edges, vaporwave-inspired color palette, high-tech abstract art, sharp lighting effects'
        }
      ]
    }
  ];

  return (
    <GlassCard>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('examples.title')}</h3>
        </div>

        {/* Grid Layout: 6x1 on small screens (below 620px), 2x3 on medium, 3x2 on large */}
        <div className="grid grid-cols-1 min-[620px]:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <CategorySlider
              key={category.id}
              category={category}
              onPromptSelect={onPromptSelect}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const CategorySlider = ({ category, onPromptSelect, delay }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoSliding) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === category.examples.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoSliding, category.examples.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoSliding(false);
    // Resume auto-slide after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === category.examples.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? category.examples.length - 1 : prevIndex - 1
    );
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-slate-100/50 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-300/50 dark:border-white/10 overflow-hidden hover:border-slate-400/60 dark:hover:border-white/20 transition-all duration-300"
    >
      {/* Category Header */}
      <div className="p-3 border-b border-slate-300/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-sm`}>
            {category.emoji}
          </div>
          <h4 className="font-medium text-sm text-slate-800 dark:text-white">{t(category.titleKey)}</h4>
        </div>
      </div>

      {/* Image Slider */}
      <div className="relative h-56 overflow-hidden p-2">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              type: "tween",
              duration: 0.5, 
              ease: "easeInOut" 
            }}
            className="absolute inset-2"
          >
            <img
              src={category.examples[currentIndex].image}
              alt={t(category.titleKey)}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
                className="text-center text-white p-2"
              >
                <Star className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium">{t('examples.clickToUse')}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Prompt Text & Action */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-slate-600 dark:text-white/70 line-clamp-2 leading-relaxed min-h-[2rem]">
          "{category.examples[currentIndex].prompt.substring(0, 80)}..."
        </p>
        
        {/* Indicators */}
        <div className="flex justify-center gap-1 mb-2">
          {category.examples.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? `bg-gradient-to-r ${category.gradient} w-4` 
                  : 'bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50 w-1'
              }`}
            />
          ))}
        </div>

        {/* Try This Prompt Button */}
        <button
          onClick={() => onPromptSelect(category.examples[currentIndex].prompt)}
          className={`w-full py-2 px-3 rounded-lg bg-gradient-to-r ${category.gradient} text-white text-xs font-medium hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-1`}
        >
          <Star className="w-3 h-3" />
          {t('examples.tryThisPrompt')}
        </button>
      </div>
    </motion.div>
  );
};

export default ExamplePromptsGrid;
