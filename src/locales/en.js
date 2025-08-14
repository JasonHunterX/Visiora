// English translations
export const en = {
  // Header
  header: {
    signUp: 'Sign Up',
    logo: {
      alt: 'Visiora Logo',
      subtitle: 'AI Image Generator'
    }
  },

  // Navigation Tabs
  tabs: {
    generate: {
      label: 'Generate',
      description: 'Create new images'
    },
    enhance: {
      label: 'Enhance', 
      description: 'Improve prompts'
    },
    history: {
      label: 'History',
      description: 'View past creations'
    },
    gallery: {
      label: 'Gallery',
      description: 'Your AI image gallery'
    }
  },

  // Generate Tab
  generate: {
    title: 'Describe Your Vision',
    placeholder: 'A majestic dragon soaring through storm clouds, lightning illuminating its scales, cinematic lighting, ultra detailed...',
    buttons: {
      quick: 'Quick',
      aiRandom: 'AI Random',
      generate: 'Generate Image',
      generating: 'Generating...',
      save: 'Save',
      download: 'Download'
    },
    categories: {
      portrait: 'Portrait',
      landscape: 'Landscape', 
      fantasy: 'Fantasy',
      scifi: 'Sci-Fi',
      anime: 'Anime',
      surprise: 'Surprise',
      title: '🎨 Quick Categories:'
    },
    settings: {
      title: 'Generation Settings',
      model: 'AI Model',
      dimensions: 'Dimensions',
      width: 'Width',
      height: 'Height',
      seed: 'Seed (Optional)',
      seedPlaceholder: 'Random seed for reproducible results',
      removeWatermark: 'Remove watermark'
    },
    imageDisplay: {
      title: 'Generated Image',
      ready: 'Ready to Create',
      readyDesc: 'Enter a prompt and click generate to create your first AI image',
      generating: 'Generating your image...',
      complete: 'complete'
    },
    tooltips: {
      saveLogin: 'Sign in to save to library'
    }
  },

  // Enhance Tab
  enhance: {
    title: 'Enhance Your Prompts',
    subtitle: 'Transform your ideas into detailed, professional prompts for better AI image generation',
    placeholder: 'Enter your basic idea or prompt...',
    button: 'Enhance Prompt',
    enhancing: 'Enhancing...',
    ai: {
      title: 'AI Prompt Enhancer',
      subtitle: 'Transform your ideas into detailed prompts',
      currentPrompt: 'Current Prompt:',
      placeholder: "Enter your base idea... (e.g., 'a dragon in a forest')",
      button: '✨ Enhance Prompt with AI',
      enhancing: 'Enhancing with AI...',
      description: 'Our AI will add professional details, lighting, and artistic elements to your prompt'
    },
    presets: {
      title: 'Style Presets',
      subtitle: 'Quick apply professional enhancement styles',
      cinematic: {
        title: '🔮 Cinematic / Realistic',
        description: 'High-detail character portraits, movie scenes, dramatic shots'
      },
      aesthetic: {
        title: '🎨 Aesthetic / Minimalist', 
        description: 'Social media aesthetics, wallpapers, lifestyle shots'
      },
      anime: {
        title: '🌀 Anime / Manga Inspired',
        description: 'Anime portraits, fight scenes, cute characters'
      },
      fantasy: {
        title: '🧚 Fantasy / Mythical',
        description: 'Magical worlds, elves, RPGs, godly characters'
      },
      cartoon: {
        title: '🎭 Cartoon / Pixar Style',
        description: 'Fun, vibrant, kid-friendly, storytelling scenes'
      }
    },
    manual: {
      title: 'Manual Enhancement',
      subtitle: 'Pick individual styles to customize your prompt',
      clearAll: 'Clear All',
      apply: 'Apply',
      selectedStyles: 'Selected Styles',
      categories: {
        quality: 'Quality',
        lighting: 'Lighting', 
        style: 'Style',
        camera: 'Camera',
        mood: 'Mood'
      }
    },
    messages: {
      enterPromptFirst: 'Please enter a prompt first!',
      stylesApplied: 'Styles Applied Successfully!'
    },
    tips: {
      title: '💡 Enhancement Tips:',
      items: [
        'Be specific about style (realistic, cartoon, abstract)',
        'Include lighting details (soft, dramatic, golden hour)',
        'Mention composition (close-up, wide shot, bird view)',
        'Add artistic references (Renaissance, modern, minimalist)'
      ]
    },
    examples: {
      title: '✨ Before & After Examples:',
      items: [
        {
          before: 'A cat sitting',
          after: 'A majestic Persian cat with emerald eyes sitting gracefully on a velvet cushion, soft natural lighting, professional pet photography, shallow depth of field'
        },
        {
          before: 'Mountain landscape',
          after: 'Breathtaking mountain landscape at golden hour, snow-capped peaks reflecting warm sunlight, misty valleys below, dramatic clouds, ultra-wide composition, professional landscape photography'
        }
      ]
    }
  },

  // History Tab
  history: {
    title: 'Generation History',
    empty: 'No images generated yet',
    emptyDesc: 'Your generated images will appear here',
    clearAll: 'Clear All History',
    delete: 'Delete',
    usePrompt: 'Use This Prompt'
  },

  // Gallery Tab  
  gallery: {
    title: 'My Gallery',
    empty: 'Your gallery is empty',
    emptyDesc: 'Images you save will appear here',
    loading: 'Loading your gallery...',
    delete: 'Delete from Gallery'
  },

  // Auth
  auth: {
    login: {
      title: 'Welcome Back',
      email: 'Email Address',
      password: 'Password',
      button: 'Sign In',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign up here',
      withGoogle: 'Continue with Google'
    },
    register: {
      title: 'Create Account',
      name: 'Full Name',
      email: 'Email Address', 
      password: 'Password',
      confirmPassword: 'Confirm Password',
      button: 'Create Account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in here',
      withGoogle: 'Continue with Google',
      terms: 'By creating an account, you agree to our Terms of Service'
    },
    verification: {
      title: 'Please Verify Your Email 📧',
      subtitle: 'Check your inbox and spam folder',
      emailSent: '📧 Verification email sent to:',
      instructions: {
        title: 'What to do next:',
        steps: [
          'Check your email inbox first',
          'Check spam/junk folder - emails often go there',
          'Add our email to your contacts',
          'Click the verification link in the email',
          'Return here to log in and get your bonus credits'
        ]
      },
      spam: {
        title: 'Email in spam? Here\'s why:',
        reasons: [
          'Automated emails often get filtered',
          'Mark as "Not Spam" to help future emails',
          'Add our email to your safe senders list'
        ]
      },
      bonus: 'Bonus: Get 10 paid credits after verification!',
      buttons: {
        verified: "I've Verified - Let Me Log In",
        resend: 'Resend Verification Email',
        close: 'Close'
      }
    },
    profile: {
      welcome: 'Welcome',
      credits: 'Credits',
      logout: 'Logout',
      profile: 'Profile'
    }
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    retry: 'Retry'
  },

  // Models
  models: {
    flux: 'Flux (Best Quality)',
    turbo: 'Turbo (Fastest)', 
    kontext: 'Kontext (Artistic)'
  },

  // Dimensions
  dimensions: {
    landscape: 'Landscape (16:9)',
    portrait: 'Portrait (9:16)',
    square: 'Square (1:1)',
    wide: 'Wide (21:9)',
    story: 'Story (9:16)',
    manual: 'Manual'
  },

  // Errors
  errors: {
    promptRequired: 'Please enter a prompt!',
    noCredits: "You don't have enough credits. Sign in to get 10 bonus credits!",
    noCreditsLoggedIn: "You don't have enough credits. Login tomorrow to receive 5 free daily credits.",
    enhancementFailed: 'Enhancement failed. Please try again with a different prompt.',
    imageLoadFailed: 'Failed to load the generated image',
    networkError: 'Network error. Please check your connection.',
    unexpectedError: 'An unexpected error occurred'
  },

  // Success Messages
  success: {
    imageSaved: 'Image saved to gallery!',
    promptEnhanced: 'Prompt enhanced successfully!',
    accountCreated: 'Account created successfully!',
    loginSuccess: 'Welcome back!',
    emailVerified: 'Email verified successfully!'
  },

  // Footer
  footer: {
    madeWith: 'Made with ❤️ by',
    rights: 'All rights reserved.'
  },

  // Hero Section
  hero: {
    title: 'Transform Ideas into',
    titleHighlight: 'Stunning Visuals',
    subtitle: 'Create breathtaking AI-generated images with just a few words. Unleash your creativity and bring your imagination to life.',
    cta: 'Start Creating Now'
  }
};