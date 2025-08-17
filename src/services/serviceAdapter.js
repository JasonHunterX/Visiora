/**
 * 服务适配器 - 根据配置选择使用前端Firebase还是后端Java服务
 */

import { 
  backendPollinationService, 
  backendCreditsService, 
  backendHistoryService 
} from './backendService.js';

// 检查是否使用后端服务
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';

// 原有的前端服务（作为备用）
let originalPollinationService, originalCreditsService, originalHistoryService;

if (!USE_BACKEND) {
  // 只有在不使用后端时才导入原有服务
  const pollinationModule = await import('../api/pollinationService.js');
  originalPollinationService = pollinationModule;
  
  // 由于积分和历史服务在原系统中分散在不同文件，我们创建适配器
  originalCreditsService = {
    async getUserCredits(user) {
      // 原有的积分获取逻辑
      const credits = user ? localStorage.getItem('visiora_user_credits') : localStorage.getItem('visiora_anonymous_credits');
      return {
        totalCredits: parseInt(credits) || 0,
        usedCredits: 0,
        remainingCredits: parseInt(credits) || 0,
        freeDailyCredits: 5,
        bonusCredits: 0,
        purchasedCredits: 0,
        isAnonymous: !user
      };
    },
    
    async checkCredits(user, requiredCredits = 1) {
      const credits = await this.getUserCredits(user);
      return {
        hasEnoughCredits: credits.remainingCredits >= requiredCredits,
        requiredCredits,
        message: credits.remainingCredits >= requiredCredits ? '积分充足' : '积分不足'
      };
    },
    
    async addCredits(user, amount, description) {
      // 原有的积分增加逻辑
      const key = user ? 'visiora_user_credits' : 'visiora_anonymous_credits';
      const current = parseInt(localStorage.getItem(key)) || 0;
      localStorage.setItem(key, (current + amount).toString());
      return true;
    }
  };
  
  originalHistoryService = {
    async getUserHistory(user, pageNum = 1, pageSize = 12) {
      // 原有的历史记录逻辑
      const history = JSON.parse(localStorage.getItem('visiora-history') || '[]');
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        records: history.slice(start, end),
        total: history.length,
        pages: Math.ceil(history.length / pageSize),
        current: pageNum,
        size: pageSize
      };
    },
    
    async toggleFavorite(historyId) {
      // 原有的收藏逻辑
      const history = JSON.parse(localStorage.getItem('visiora-history') || '[]');
      const item = history.find(h => h.id === historyId);
      if (item) {
        item.isFavorite = !item.isFavorite;
        localStorage.setItem('visiora-history', JSON.stringify(history));
        return true;
      }
      return false;
    }
  };
}

/**
 * 统一的服务接口
 */
export const serviceAdapter = {
  // AI绘图服务
  pollination: USE_BACKEND ? backendPollinationService : originalPollinationService,
  
  // 积分服务
  credits: USE_BACKEND ? backendCreditsService : originalCreditsService,
  
  // 历史服务
  history: USE_BACKEND ? backendHistoryService : originalHistoryService,
  
  // 配置信息
  config: {
    useBackend: USE_BACKEND,
    backendUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT
  }
};

// 导出便捷访问的服务实例
export const pollinationService = serviceAdapter.pollination;
export const creditsService = serviceAdapter.credits;
export const historyService = serviceAdapter.history;

export default serviceAdapter;