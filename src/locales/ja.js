// 日本語翻訳
export const ja = {
  // ヘッダー
  header: {
    signUp: '新規登録',
    logo: {
      alt: 'Visiora ロゴ',
      subtitle: 'AI 画像ジェネレーター'
    }
  },

  // ナビゲーションタブ
  tabs: {
    generate: {
      label: '生成',
      description: '新しい画像を作成'
    },
    enhance: {
      label: '強化', 
      description: 'プロンプトを改善'
    },
    history: {
      label: '履歴',
      description: '過去の作品を表示'
    },
    gallery: {
      label: 'ギャラリー',
      description: 'あなたのAI画像ギャラリー'
    }
  },

  // 生成タブ
  generate: {
    title: 'あなたのビジョンを描写',
    placeholder: '嵐雲を飛翔する威厳ある龍、稲妻がその鱗を照らす、映画的ライティング、超詳細...',
    buttons: {
      quick: 'クイック',
      aiRandom: 'AIランダム',
      generate: '画像を生成',
      generating: '生成中...',
      save: '保存',
      download: 'ダウンロード'
    },
    categories: {
      portrait: 'ポートレート',
      landscape: '風景', 
      fantasy: 'ファンタジー',
      scifi: 'SF',
      anime: 'アニメ',
      surprise: 'サプライズ',
      title: '🎨 クイックカテゴリー：'
    },
    settings: {
      title: '生成設定',
      model: 'AIモデル',
      dimensions: 'サイズ',
      width: '幅',
      height: '高さ',
      seed: 'シード（任意）',
      seedPlaceholder: '再現可能な結果のためのランダムシード',
      removeWatermark: '透かしを除去'
    },
    imageDisplay: {
      title: '生成された画像',
      ready: '作成の準備完了',
      readyDesc: 'プロンプトを入力して生成をクリックし、最初のAI画像を作成してください',
      generating: '画像を生成中...',
      complete: '完了'
    },
    tooltips: {
      saveLogin: 'ライブラリに保存するにはサインインしてください'
    }
  },

  // 強化タブ
  enhance: {
    title: 'プロンプトを強化',
    subtitle: 'あなたのアイデアを詳細で専門的なプロンプトに変換し、より良いAI画像生成を実現',
    placeholder: '基本的なアイデアまたはプロンプトを入力...',
    button: 'プロンプトを強化',
    enhancing: '強化中...',
    ai: {
      title: 'AIプロンプト強化',
      subtitle: 'あなたのアイデアを詳細なプロンプトに変換',
      currentPrompt: '現在のプロンプト：',
      placeholder: '基本的なアイデアを入力...（例：「森の中の龍」）',
      button: '✨ AIでプロンプトを強化',
      enhancing: 'AIで強化中...',
      description: 'AIがプロンプトに専門的な詳細、照明、芸術的要素を追加します'
    },
    presets: {
      title: 'スタイルプリセット',
      subtitle: '専門的な強化スタイルを素早く適用',
      cinematic: {
        title: '🔮 映画的 / リアル',
        description: '高詳細キャラクターポートレート、映画シーン、劇的ショット'
      },
      aesthetic: {
        title: '🎨 美的 / ミニマル',
        description: 'ソーシャルメディア美学、壁紙、ライフスタイル撮影'
      },
      anime: {
        title: '🌀 アニメ / 漫画風',
        description: 'アニメポートレート、戦闘シーン、可愛いキャラクター'
      },
      fantasy: {
        title: '🧚 ファンタジー / 神話',
        description: '魔法の世界、エルフ、RPG、神々しいキャラクター'
      },
      cartoon: {
        title: '🎭 漫画 / ピクサー風',
        description: '楽しく、鮮やか、子供向け、ストーリーシーン'
      }
    },
    manual: {
      title: '手動強化',
      subtitle: '個別のスタイルを選択してプロンプトをカスタマイズ',
      clearAll: 'すべてクリア',
      apply: '適用',
      selectedStyles: '選択されたスタイル',
      categories: {
        quality: '品質',
        lighting: 'ライティング',
        style: 'スタイル',
        camera: 'カメラ',
        mood: 'ムード'
      }
    },
    messages: {
      enterPromptFirst: '最初にプロンプトを入力してください！',
      stylesApplied: 'スタイル適用成功！'
    },
    tips: {
      title: '💡 強化のコツ：',
      items: [
        'スタイルを具体的に（リアル、漫画、抽象）',
        'ライティングの詳細を含める（ソフト、劇的、ゴールデンアワー）',
        '構図について言及（クローズアップ、ワイドショット、俯瞰）',
        '芸術的参考を追加（ルネサンス、モダン、ミニマリスト）'
      ]
    },
    examples: {
      title: '✨ Before & After 例：',
      items: [
        {
          before: '座っている猫',
          after: 'エメラルドの瞳を持つ威厳あるペルシャ猫、ベルベットのクッションに優雅に座る、柔らかい自然光、プロのペット写真、浅い被写界深度'
        },
        {
          before: '山の風景',
          after: 'ゴールデンアワーの息をのむような山の風景、雪に覆われた山頂が暖かい日光を反射、下方には霧に包まれた谷、劇的な雲、超広角構図、プロの風景写真'
        }
      ]
    }
  },

  // 履歴タブ
  history: {
    title: '生成履歴',
    empty: 'まだ画像が生成されていません',
    emptyDesc: '生成された画像はここに表示されます',
    clearAll: 'すべての履歴をクリア',
    delete: '削除',
    usePrompt: 'このプロンプトを使用'
  },

  // ギャラリータブ
  gallery: {
    title: 'マイギャラリー',
    empty: 'ギャラリーは空です',
    emptyDesc: '保存した画像がここに表示されます',
    loading: 'ギャラリーを読み込み中...',
    delete: 'ギャラリーから削除'
  },

  // 認証
  auth: {
    login: {
      title: 'おかえりなさい',
      email: 'メールアドレス',
      password: 'パスワード',
      button: 'サインイン',
      forgotPassword: 'パスワードをお忘れですか？',
      noAccount: 'アカウントをお持ちでない場合',
      signUp: 'こちらで新規登録',
      withGoogle: 'Googleでサインイン'
    },
    register: {
      title: 'アカウント作成',
      name: 'フルネーム',
      email: 'メールアドレス', 
      password: 'パスワード',
      confirmPassword: 'パスワードを確認',
      button: 'アカウント作成',
      haveAccount: 'すでにアカウントをお持ちの場合',
      signIn: 'こちらでサインイン',
      withGoogle: 'Googleでサインイン',
      terms: 'アカウントを作成することで、利用規約に同意したことになります'
    },
    verification: {
      title: 'メールの認証をしてください 📧',
      subtitle: '受信トレイと迷惑メールフォルダを確認してください',
      emailSent: '📧 認証メールを送信しました：',
      instructions: {
        title: '次の手順：',
        steps: [
          'まずメールの受信トレイを確認',
          '迷惑メールフォルダを確認 - メールがそこにあることがよくあります',
          'メールアドレスを連絡先に追加',
          'メール内の認証リンクをクリック',
          'ここに戻ってログインしてボーナスクレジットを獲得'
        ]
      },
      spam: {
        title: 'メールが迷惑メールに？理由は次の通りです：',
        reasons: [
          '自動メールはフィルタリングされることがよくあります',
          '「迷惑メールではない」としてマークして今後のメールを支援',
          'メールアドレスを安全な送信者リストに追加'
        ]
      },
      bonus: 'ボーナス：認証後に10の有料クレジットを獲得！',
      buttons: {
        verified: '認証済み - ログインします',
        resend: '認証メールを再送信',
        close: '閉じる'
      }
    },
    profile: {
      welcome: 'ようこそ',
      credits: 'クレジット',
      logout: 'ログアウト',
      profile: 'プロフィール'
    }
  },

  // 共通
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    retry: '再試行'
  },

  // モデル
  models: {
    flux: 'Flux（最高品質）',
    turbo: 'Turbo（最高速度）', 
    kontext: 'Kontext（芸術的）'
  },

  // サイズ
  dimensions: {
    landscape: '横向き（16:9）',
    portrait: '縦向き（9:16）',
    square: '正方形（1:1）',
    wide: 'ワイド（21:9）',
    story: 'ストーリー（9:16）',
    manual: '手動'
  },

  // エラー
  errors: {
    promptRequired: 'プロンプトを入力してください！',
    noCredits: 'クレジットが不足しています。サインインして10ボーナスクレジットを獲得してください！',
    noCreditsLoggedIn: 'クレジットが不足しています。明日ログインして5つの無料デイリークレジットを受け取ってください。',
    enhancementFailed: '強化に失敗しました。別のプロンプトで再試行してください。',
    imageLoadFailed: '生成画像の読み込みに失敗しました',
    networkError: 'ネットワークエラー。接続を確認してください。',
    unexpectedError: '予期しないエラーが発生しました'
  },

  // 成功メッセージ
  success: {
    imageSaved: '画像がギャラリーに保存されました！',
    promptEnhanced: 'プロンプトが正常に強化されました！',
    accountCreated: 'アカウントが正常に作成されました！',
    loginSuccess: 'おかえりなさい！',
    emailVerified: 'メールが正常に認証されました！'
  },

  // フッター
  footer: {
    madeWith: '❤️ で作成',
    rights: '無断転載を禁じます。'
  },

  // ヒーローセクション
  hero: {
    title: 'アイデアを',
    titleHighlight: '美しいビジュアル',
    subtitle: 'わずか数語で息をのむようなAI生成画像を作成。創造性を解き放ち、想像を現実にしましょう。',
    cta: '今すぐ作成開始'
  }
};