// 简体中文翻译
export const zhCN = {
  // 顶部导航
  header: {
    signUp: '注册',
    logo: {
      alt: 'Visiora 标志',
      subtitle: 'AI 图像生成器'
    }
  },

  // 导航选项卡
  tabs: {
    generate: {
      label: '生成',
      description: '创建新图像'
    },
    enhance: {
      label: '增强', 
      description: '改进提示词'
    },
    history: {
      label: '历史',
      description: '查看过往创作'
    },
    gallery: {
      label: '图库',
      description: '您的 AI 图像画廊'
    }
  },

  // 生成页面
  generate: {
    title: '描述您的创意',
    placeholder: '一条威严的龙在风暴云中翱翔，闪电照亮其鳞片，电影级灯光，超精细...',
    buttons: {
      quick: '快速',
      aiRandom: 'AI 随机',
      generate: '生成图像',
      generating: '生成中...',
      save: '保存',
      download: '下载'
    },
    categories: {
      portrait: '肖像',
      landscape: '风景', 
      fantasy: '奇幻',
      scifi: '科幻',
      anime: '动漫',
      surprise: '惊喜',
      title: '🎨 快速分类：'
    },
    settings: {
      title: '生成设置',
      model: 'AI 模型',
      dimensions: '尺寸',
      width: '宽度',
      height: '高度',
      seed: '种子（可选）',
      seedPlaceholder: '可重现结果的随机种子',
      removeWatermark: '移除水印'
    },
    imageDisplay: {
      title: '生成的图像',
      ready: '准备创作',
      readyDesc: '输入提示词并点击生成来创建您的第一张 AI 图像',
      generating: '正在生成您的图像...',
      complete: '完成'
    },
    tooltips: {
      saveLogin: '登录后可保存到图库'
    }
  },

  // 增强页面
  enhance: {
    title: '增强您的提示词',
    subtitle: '将您的想法转化为详细、专业的提示词，以获得更好的 AI 图像生成效果',
    placeholder: '输入您的基本想法或提示词...',
    button: '增强提示词',
    enhancing: '增强中...',
    ai: {
      title: 'AI 提示词增强器',
      subtitle: '将您的想法转化为详细的提示词',
      currentPrompt: '当前提示词：',
      placeholder: '输入您的基本想法...（例如："森林中的龙"）',
      button: '✨ 用 AI 增强提示词',
      enhancing: '正在用 AI 增强...',
      description: '我们的 AI 将为您的提示词添加专业细节、光照和艺术元素'
    },
    presets: {
      title: '风格预设',
      subtitle: '快速应用专业增强风格',
      cinematic: {
        title: '🔮 电影级 / 写实',
        description: '高细节人物肖像，电影场景，戏剧性镜头'
      },
      aesthetic: {
        title: '🎨 美学 / 极简主义',
        description: '社交媒体美学，壁纸，生活方式拍摄'
      },
      anime: {
        title: '🌀 动漫 / 漫画风格',
        description: '动漫肖像，战斗场景，可爱角色'
      },
      fantasy: {
        title: '🧚 奇幻 / 神话',
        description: '魔法世界，精灵，RPG，神性角色'
      },
      cartoon: {
        title: '🎭 卡通 / 皮克斯风格',
        description: '有趣，鲜艳，儿童友好，故事场景'
      }
    },
    manual: {
      title: '手动增强',
      subtitle: '选择个别风格来自定义您的提示词',
      clearAll: '清空所有',
      apply: '应用',
      selectedStyles: '已选风格',
      categories: {
        quality: '质量',
        lighting: '光照',
        style: '风格',
        camera: '镜头',
        mood: '氛围'
      }
    },
    messages: {
      enterPromptFirst: '请先输入提示词！',
      stylesApplied: '风格应用成功！'
    },
    tips: {
      title: '💡 增强技巧：',
      items: [
        '明确风格（写实、卡通、抽象）',
        '包含光照细节（柔和、戏剧性、黄金时段）',
        '提及构图（特写、广角、鸟瞰）',
        '添加艺术参考（文艺复兴、现代、极简主义）'
      ]
    },
    examples: {
      title: '✨ 增强前后对比：',
      items: [
        {
          before: '一只坐着的猫',
          after: '一只威严的波斯猫，翡翠般的眼睛，优雅地坐在天鹅绒垫子上，柔和的自然光线，专业宠物摄影，浅景深'
        },
        {
          before: '山地风景',
          after: '黄金时段令人叹为观止的山地风景，雪峰反射温暖的阳光，下方薄雾缭绕的山谷，戏剧性的云层，超广角构图，专业风景摄影'
        }
      ]
    }
  },

  // 历史页面
  history: {
    title: '生成历史',
    empty: '还没有生成图像',
    emptyDesc: '您生成的图像将显示在这里',
    clearAll: '清空所有历史',
    delete: '删除',
    usePrompt: '使用此提示词'
  },

  // 图库页面
  gallery: {
    title: '我的图库',
    empty: '您的图库为空',
    emptyDesc: '您保存的图像将显示在这里',
    loading: '正在加载您的图库...',
    delete: '从图库中删除'
  },

  // 用户认证
  auth: {
    login: {
      title: '欢迎回来',
      email: '邮箱地址',
      password: '密码',
      button: '登录',
      forgotPassword: '忘记密码？',
      noAccount: '没有账户？',
      signUp: '立即注册',
      withGoogle: '使用 Google 继续'
    },
    register: {
      title: '创建账户',
      name: '姓名',
      email: '邮箱地址', 
      password: '密码',
      confirmPassword: '确认密码',
      button: '创建账户',
      haveAccount: '已有账户？',
      signIn: '立即登录',
      withGoogle: '使用 Google 继续',
      terms: '创建账户即表示您同意我们的服务条款'
    },
    verification: {
      title: '请验证您的邮箱 📧',
      subtitle: '请检查您的收件箱和垃圾邮件文件夹',
      emailSent: '📧 验证邮件已发送至：',
      instructions: {
        title: '接下来的步骤：',
        steps: [
          '首先检查您的邮箱收件箱',
          '检查垃圾邮件文件夹 - 邮件经常会在那里',
          '将我们的邮箱添加到您的联系人',
          '点击邮件中的验证链接',
          '返回这里登录并获得您的奖励积分'
        ]
      },
      spam: {
        title: '邮件在垃圾箱？原因如下：',
        reasons: [
          '自动发送的邮件经常被过滤',
          '标记为"非垃圾邮件"以帮助未来邮件',
          '将我们的邮箱添加到您的安全发件人列表'
        ]
      },
      bonus: '奖励：验证后获得 10 个付费积分！',
      buttons: {
        verified: '我已验证 - 让我登录',
        resend: '重新发送验证邮件',
        close: '关闭'
      }
    },
    profile: {
      welcome: '欢迎',
      credits: '积分',
      logout: '登出',
      profile: '个人资料'
    }
  },

  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    back: '返回',
    next: '下一步',
    retry: '重试'
  },

  // 模型
  models: {
    flux: 'Flux（最佳质量）',
    turbo: 'Turbo（最快速度）', 
    kontext: 'Kontext（艺术风格）'
  },

  // 尺寸
  dimensions: {
    landscape: '横向（16:9）',
    portrait: '纵向（9:16）',
    square: '正方形（1:1）',
    wide: '宽屏（21:9）',
    story: '故事（9:16）',
    manual: '手动'
  },

  // 错误信息
  errors: {
    promptRequired: '请输入提示词！',
    noCredits: '您的积分不足。登录即可获得 10 个奖励积分！',
    noCreditsLoggedIn: '您的积分不足。明天登录即可获得 5 个免费每日积分。',
    enhancementFailed: '增强失败。请尝试使用不同的提示词。',
    imageLoadFailed: '加载生成图像失败',
    networkError: '网络错误。请检查您的连接。',
    unexpectedError: '发生意外错误'
  },

  // 成功信息
  success: {
    imageSaved: '图像已保存到图库！',
    promptEnhanced: '提示词增强成功！',
    accountCreated: '账户创建成功！',
    loginSuccess: '欢迎回来！',
    emailVerified: '邮箱验证成功！'
  },

  // 页脚
  footer: {
    madeWith: '由 ❤️ 制作',
    rights: '版权所有。'
  },

  // 首页横幅
  hero: {
    title: '将创意转化为',
    titleHighlight: '惊艳视觉',
    subtitle: '仅用几个词就能创造令人惊叹的 AI 生成图像。释放您的创造力，让想象力成为现实。',
    cta: '立即开始创作'
  }
};