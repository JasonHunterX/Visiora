// src/App.jsx
import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { generateRandomPrompt } from "./api/pollinationService";
import { saveGeneratedImage } from "./api/imageServiceV2";
import { useTheme } from "./hooks/useTheme";
import useLocalStorage from "./hooks/useLocalStorage";
import { AuthProvider, useAuthContext } from "./contexts/AuthContextV2";
import { LanguageProvider, useTranslation } from "./contexts/LanguageContext";


// Layout Components

import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";

// Tab Components
import ModernTabNavigation from "./components/tabs/ModernTabNavigation";
import ModernGenerateTab from "./components/tabs/ModernGenerateTab";

// Lazy load less critical components for better performance
const ModernEnhanceTab = lazy(() => import("./components/tabs/ModernEnhanceTab"));
// Importing the masonry layout for history tab
const ModernMasonryHistoryTab = lazy(() => import("./components/tabs/ModernMasonryHistoryTab"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const MobileAuthModal = lazy(() => import("./components/auth/MobileAuthModalV2"));
const SaveProjectModal = lazy(() => import("./components/projects/SaveProjectModal"));

// Email Verification Modal Component
const EmailVerificationModal = ({ email, onClose, onGoToLogin }) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      alert('To resend the verification email, please try signing up again with the same email address. The system will send a new verification link.');
    } catch (error) {
      // Handle resend error silently
    }
    setIsResending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl border border-purple-200 dark:border-purple-800"
    >
      <div className="text-center mb-5">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Please Verify Your Email 📧
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base mb-2">
          Check your inbox and spam folder
        </p>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">
            📧 Verification email sent to:
          </p>
          <p className="font-semibold text-purple-800 dark:text-purple-200 break-all text-sm">
            {email}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 flex items-center text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            What to do next:
          </h3>
          <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5 list-decimal list-inside">
            <li>Check your email inbox first</li>
            <li><strong>Check spam/junk folder</strong> - emails often go there</li>
            <li>Add <code>noreply@{import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com</code> to contacts</li>
            <li>Click the verification link in the email</li>
            <li>Return here to log in and get your bonus credits</li>
          </ol>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
          <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1 flex items-center text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Email in spam? Here's why:
          </h3>
          <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-0.5 list-disc list-inside ml-2">
            <li>Automated emails often get filtered</li>
            <li>Mark as "Not Spam" to help future emails</li>
            <li>Add our email to your safe senders list</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong>Bonus:</strong> Get 10 paid credits after verification!</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-5">
        <button
          onClick={onGoToLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25 text-sm"
        >
          I've Verified - Let Me Log In
        </button>

        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
        >
          {isResending ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <button
          onClick={onClose}
          className="w-full text-slate-500 dark:text-slate-400 font-medium py-2 px-5 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

// Loading component with better styling
const TabLoader = React.memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
      <p className="text-slate-600 dark:text-white/60 text-sm">Loading...</p>
    </div>
  </div>
));

TabLoader.displayName = 'TabLoader';



function App({ authContext, showLoginPrompt, setShowLoginPrompt }) {
  const { t } = useTranslation();
  // State management with better initial values
  const [inputPrompt, setInputPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("generate");

  // Generation settings
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedShape, setSelectedShape] = useState("landscape");
  const [seed, setSeed] = useState("");
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  // Enhancement state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

  // Theme management
  const { isDarkMode, toggleTheme, setTheme } = useTheme();

  // Use custom localStorage hook for better performance
  const [history, setHistory, clearHistory] = useLocalStorage("visiora-history", []);

  // Memoized configuration objects for better performance
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

  // Memoized progress simulation
  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    return interval;
  }, []);

  // Optimized image generation handler
  const handleGenerateClick = useCallback(async () => {
    if (!inputPrompt.trim()) {
      alert(t('errors.promptRequired'));
      return;
    }
    
    // Enhanced debugging for credits (dev only)
    if (import.meta.env.DEV) {
      console.log('Credits before spending:', authContext.credits);
      console.log('User logged in:', authContext.user ? 'Yes' : 'No');
      if (authContext.user) {
        console.log('User ID:', authContext.user.uid);
      } else {
        console.log('Anonymous credits in localStorage:', localStorage.getItem('visiora_anonymous_credits'));
      }
    }
    
    // TEMPORARY: Credit check disabled - unlimited generation for testing
    // Check if user has credits
    // const hasCredits = await authContext.spendCredit();
    

    
    // if (!hasCredits) {
    //   // Different messages for logged in vs anonymous users
    //   if (authContext.user) {
    //     setError("You don't have enough credits. Login tomorrow to receive 5 free daily credits.");
    //   } else {
    //     setError("You don't have enough credits. Sign in to get 10 bonus credits!");
    //     setShowLoginPrompt(true);
    //   }
    //   return;
    // }

    setIsLoading(true);
    setError(null);
    setImageLoaded(false);

    const progressInterval = simulateProgress();

    try {
      const encodedPrompt = encodeURIComponent(inputPrompt.trim());

      // Determine dimensions
      let finalWidth, finalHeight;
      if (selectedShape === "manual") {
        finalWidth = width;
        finalHeight = height;
      } else {
        const shapeRatio = shapes[selectedShape];
        finalWidth = shapeRatio.width;
        finalHeight = shapeRatio.height;
      }

      const finalSeed = seed || Math.floor(Math.random() * 1000);

      // Build API URL
      let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${selectedModel}&enhance=true&seed=${finalSeed}&nologo=true`;

      if (removeWatermark) {
        apiUrl += "&nologo=true";
      }

      if (import.meta.env.DEV) {
        console.log("API URL:", apiUrl);
      }

      setImageUrl(apiUrl);
      setProgress(100);

      // Add to history
      const historyItem = {
        id: Date.now(),
        prompt: inputPrompt.trim(),
        imageUrl: apiUrl,
        timestamp: new Date().toLocaleString(),
        model: selectedModel,
        shape: selectedShape,
        dimensions: `${finalWidth}x${finalHeight}`,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
      
      // Save to Firestore for logged-in users
      if (authContext.user) {
        try {
          const imageData = {
            prompt: inputPrompt.trim(),
            imageURL: apiUrl,
            modelUsed: selectedModel,
            width: finalWidth,
            height: finalHeight,
            seed: finalSeed,
            nologo: removeWatermark
          };
          
          await saveGeneratedImage(authContext.user.uid, imageData);
          if (import.meta.env.DEV) {
            console.log('Image saved to user library in Firestore');
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error saving image to Firestore:', error);
          }
          // Don't show error to user, silently fail as this is non-critical
        }
      }

      clearInterval(progressInterval);

      // Timeout fallback
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 8000);

      window.imageLoadTimeout = timeoutId;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error generating image:", err);
      }
      setError(err.message);
      setIsLoading(false);
      setImageLoaded(false);
      setProgress(0);
      clearInterval(progressInterval);
    }
  }, [inputPrompt, selectedModel, selectedShape, seed, removeWatermark, width, height, shapes, simulateProgress, setHistory]);

  // Optimized image load handlers
  const handleImageLoadComplete = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
    setProgress(0);
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  }, []);

  const handleImageLoadError = useCallback(() => {
    setError("Failed to load the generated image");
    setIsLoading(false);
    setImageLoaded(false);
    setProgress(0);
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  }, []);

  // Optimized random prompt handlers
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

  const handleGenerateRandomPrompt = useCallback(async (category = "") => {
    setIsGeneratingRandom(true);
    try {
      const randomPrompt = await generateRandomPrompt(category);
      setInputPrompt(randomPrompt);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error generating random prompt:", error);
      }
      handleConfusedClick(); // Fallback to local random
    } finally {
      setIsGeneratingRandom(false);
    }
  }, [handleConfusedClick]);

  // Enhanced prompt handler with better error handling
  const handleEnhancePrompt = useCallback(async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }

    setIsEnhancing(true);
    try {
      const system = "You are a professional prompt engineer for generative AI images. Given a users base idea, elaborate and enhance the prompt by preserving the original subject and context, adding vivid artistic details, improving clarity, storytelling, and immersion, including realistic textures, dynamic lighting, depth, and color harmony, specifying atmosphere and composition style, and ensuring final output is suitable for 8K ultra-high-resolution rendering. Output only the enhanced prompt as plain text.";
      
      let url = `https://text.pollinations.ai/${encodeURIComponent(system + ": " + inputPrompt.trim())}`;
      
      let response = await fetch(url);
      let responseText = await response.text();
      
      if (!response.ok || responseText.trim().toLowerCase().startsWith("<!doctype")) {
        throw new Error("Enhancement service unavailable");
      }

      // Parse response
      let enhancedText = "";
      try {
        const data = JSON.parse(responseText);
        enhancedText = data.response || data.text || data.content || responseText;
      } catch {
        enhancedText = responseText.trim();
      }

      if (enhancedText && enhancedText.length > 15 && enhancedText !== inputPrompt.trim()) {
        setInputPrompt(enhancedText);
      } else {
        throw new Error("Unable to enhance prompt");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error enhancing prompt:", error);
      }
      alert("Enhancement failed. Please try again with a different prompt.");
    } finally {
      setIsEnhancing(false);
    }
  }, [inputPrompt]);

  // Optimized history handlers
  const handleHistoryItemClick = useCallback((historyItem) => {
    setInputPrompt(historyItem.prompt);
    setImageUrl(historyItem.imageUrl);
    setActiveTab("generate");
  }, []);

  const handleDeleteHistoryItem = useCallback((itemId, event) => {
    event?.stopPropagation();
    setHistory(prev => prev.filter((item) => item.id !== itemId));
  }, [setHistory]);

  const handleClearAllHistory = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  // Memoized tab content renderer for better performance
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "generate":
        return (
          <div>
            <ModernGenerateTab
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              imageUrl={imageUrl}
              isLoading={isLoading}
              imageLoaded={imageLoaded}
              error={error}
              progress={progress}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              seed={seed}
              setSeed={setSeed}
              removeWatermark={removeWatermark}
              setRemoveWatermark={setRemoveWatermark}
              width={width}
              height={height}
              setWidth={setWidth}
              setHeight={setHeight}
            shapes={shapes}
            models={models}
            handleGenerateClick={handleGenerateClick}
            handleImageLoadComplete={handleImageLoadComplete}
            handleImageLoadError={handleImageLoadError}
            handleConfusedClick={handleConfusedClick}
            handleGenerateRandomPrompt={handleGenerateRandomPrompt}
            isGeneratingRandom={isGeneratingRandom}
          />
          </div>
        );
      case "enhance":
        return (
          <Suspense fallback={<TabLoader />}>
            <ModernEnhanceTab
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              isEnhancing={isEnhancing}
              handleEnhancePrompt={handleEnhancePrompt}
            />
          </Suspense>
        );
      case "history":
        return (
          <Suspense fallback={<TabLoader />}>
            <ModernMasonryHistoryTab
              history={history}
              setInputPrompt={setInputPrompt}
              setActiveTab={setActiveTab}
              handleDeleteHistoryItem={handleDeleteHistoryItem}
              handleClearAllHistory={handleClearAllHistory}
            />
          </Suspense>
        );

      case "gallery":
        return (
          <Suspense fallback={<TabLoader />}>
            <GalleryPage />
          </Suspense>
        );
      default:
        return null;
    }
  }, [
    activeTab, inputPrompt, imageUrl, isLoading, imageLoaded, error, progress,
    selectedModel, selectedShape, seed, removeWatermark, width, height,
    shapes, models, history, isEnhancing, isGeneratingRandom,
    handleGenerateClick, handleImageLoadComplete, handleImageLoadError,
    handleConfusedClick, handleGenerateRandomPrompt, handleEnhancePrompt,
    handleDeleteHistoryItem, handleClearAllHistory,
    setSelectedModel, setSelectedShape, setSeed, setRemoveWatermark, setWidth, setHeight
  ]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* MemoizedBackground removed to prevent duplicate rendering and remounts */}

        {/* Header */}
        <Header 
          isDarkMode={isDarkMode} 
          onThemeChange={toggleTheme}
          onLoginClick={() => setShowLoginPrompt(true)}
        />     
      <Hero />

      {/* Main Content */}
      <main className="relative z-10 pb-20 -translate-y-[30vh] w-full">
        <div className="container mx-auto px-6 w-full">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <ModernTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              historyCount={history.length}
              showGalleryTab={!!authContext.user}
            />
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
      
      {/* Auth Modal */}
      <Suspense fallback={null}>
        {showLoginPrompt && (
          <MobileAuthModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            initialMode="login"
          />
        )}
      </Suspense>
    </div>
  );
}

// Wrapper component that uses AuthContext
function AppWithAuth() {
  // Access auth context
  const authContext = useAuthContext();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Check for email verification success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      setShowVerificationSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowVerificationSuccess(false), 5000);
    }
  }, []);

  // Check for unverified logged-in users
  useEffect(() => {
    if (authContext.user && !authContext.user.emailVerified && !authContext.loading) {
      if (import.meta.env.DEV) {
        console.log('🔍 Detected unverified user, showing verification modal');
      }
      setShowVerificationModal(true);
    } else {
      setShowVerificationModal(false);
    }
  }, [authContext.user, authContext.loading]);

  return (
    <>
      <App
        authContext={authContext}
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />

      {/* Email Verification Success Notification */}
      {showVerificationSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-2xl max-w-sm border border-green-400"
          >
            <div className="flex items-start space-x-4">
              {/* Success Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">🎉 Email Verified!</h4>
                <p className="text-green-100 text-sm mb-2">
                  Welcome to Visiora! Your account is now active.
                </p>
                <div className="bg-white/10 rounded-lg p-2 mb-3">
                  <p className="text-xs text-green-100">
                    ✨ <strong>Bonus:</strong> You'll get 10 paid credits on your first login!
                  </p>
                </div>
                <p className="text-green-100 text-xs">
                  You can now log in to start creating amazing images.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowVerificationSuccess(false)}
                className="flex-shrink-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Verification Modal for Unverified Users */}
      {showVerificationModal && authContext.user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <EmailVerificationModal
            email={authContext.user.email}
            onClose={() => setShowVerificationModal(false)}
            onGoToLogin={async () => {
              // Sign out the user and let them log in again
              await authContext.logout();
              setShowVerificationModal(false);
            }}
          />
        </div>
      )}
    </>
  );
}

// Main export with providers wrapper
export default function AppContainer() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </LanguageProvider>
  );
}