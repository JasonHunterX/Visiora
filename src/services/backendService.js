/**
 * 后端服务适配器
 * 统一封装后端API调用，提供与原有服务相同的接口
 */

import { aiDrawingApi, userCreditsApi, drawingHistoryApi } from './aiDrawingApi.js';

/**
 * 生成会话ID
 */
function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `sess_${timestamp}_${random}`;
}

/**
 * 获取或创建会话ID
 */
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('anonymous_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('anonymous_session_id', sessionId);
  }
  return sessionId;
}

/**
 * 获取用户标识（用户ID或会话ID）
 * @param {Object} user - 用户对象
 * @returns {Object} - {userId, sessionId}
 */
function getUserIdentifier(user) {
  if (user?.uid) {
    return {
      userId: parseInt(user.uid) || null,
      sessionId: null
    };
  } else {
    return {
      userId: null,
      sessionId: getOrCreateSessionId()
    };
  }
}

/**
 * 后端AI绘图服务
 * 替换原有的pollinationService
 */
export class BackendPollinationService {
  /**
   * 生成图像
   * @param {string} prompt - 提示词
   * @param {Object} options - 选项
   * @param {Object} user - 用户对象
   */
  async generateImage(prompt, options = {}, user = null) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      
      const request = {
        prompt,
        userId,
        sessionId,
        model: options.model || 'flux',
        width: options.width || 1024,
        height: options.height || 1024,
        seed: options.seed || null,
        removeWatermark: options.removeWatermark || false,
        enhancePrompt: options.enhancePrompt || false
      };

      const result = await aiDrawingApi.generateImage(request);
      
      if (result.success) {
        return {
          success: true,
          data: {
            taskId: result.data.taskId,
            imageUrl: result.data.imageUrl,
            status: result.data.status,
            prompt: result.data.prompt,
            enhancedPrompt: result.data.enhancedPrompt,
            model: result.data.model,
            width: result.data.width,
            height: result.data.height,
            seed: result.data.seed,
            creditsCost: result.data.creditsCost,
            createdTime: result.data.createdTime
          }
        };
      } else {
        return {
          success: false,
          error: result.message
        };
      }
    } catch (error) {
      console.error('Backend generate image error:', error);
      return {
        success: false,
        error: error.message || '生成图像失败'
      };
    }
  }

  /**
   * 增强提示词
   * @param {string} prompt - 原始提示词
   */
  async enhancePrompt(prompt) {
    try {
      const result = await aiDrawingApi.enhancePrompt(prompt);
      
      if (result.success) {
        return {
          original: result.data.originalPrompt,
          enhanced: result.data.enhancedPrompt,
          improved: result.data.improved
        };
      } else {
        // 如果增强失败，返回原始提示词
        return {
          original: prompt,
          enhanced: prompt,
          improved: false
        };
      }
    } catch (error) {
      console.error('Backend enhance prompt error:', error);
      // 增强失败时返回原始提示词
      return {
        original: prompt,
        enhanced: prompt,
        improved: false
      };
    }
  }

  /**
   * 获取任务状态
   * @param {string} taskId - 任务ID
   */
  async getTaskStatus(taskId) {
    try {
      const result = await aiDrawingApi.getTaskStatus(taskId);
      
      if (result.success) {
        return {
          taskId: result.data.taskId,
          status: result.data.status,
          imageUrl: result.data.imageUrl,
          errorMessage: result.data.errorMessage,
          processDurationSeconds: result.data.processDurationSeconds
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get task status error:', error);
      throw error;
    }
  }

  /**
   * 轮询任务状态直到完成
   * @param {string} taskId - 任务ID
   * @param {number} maxAttempts - 最大尝试次数
   * @param {number} interval - 间隔时间(毫秒)
   */
  async pollTaskStatus(taskId, maxAttempts = 30, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await this.getTaskStatus(taskId);
        
        if (status.status === 'COMPLETED') {
          return {
            success: true,
            imageUrl: status.imageUrl,
            status: status.status
          };
        } else if (status.status === 'FAILED') {
          return {
            success: false,
            error: status.errorMessage || '任务执行失败'
          };
        }
        
        // 继续等待
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        console.error(`Poll attempt ${i + 1} failed:`, error);
        if (i === maxAttempts - 1) {
          return {
            success: false,
            error: '任务状态查询超时'
          };
        }
      }
    }
    
    return {
      success: false,
      error: '任务执行超时'
    };
  }
}

/**
 * 后端用户积分服务
 * 替换原有的creditsService
 */
export class BackendCreditsService {
  /**
   * 获取用户积分
   * @param {Object} user - 用户对象
   */
  async getUserCredits(user = null) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await userCreditsApi.getCreditsInfo(userId, sessionId);
      
      if (result.success) {
        return {
          totalCredits: result.data.totalCredits,
          usedCredits: result.data.usedCredits,
          remainingCredits: result.data.remainingCredits,
          freeDailyCredits: result.data.freeDailyCredits,
          bonusCredits: result.data.bonusCredits,
          purchasedCredits: result.data.purchasedCredits,
          lastDailyReset: result.data.lastDailyReset,
          isAnonymous: result.data.isAnonymous,
          needsDailyReset: result.data.needsDailyReset
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get user credits error:', error);
      throw error;
    }
  }

  /**
   * 检查积分是否足够
   * @param {Object} user - 用户对象
   * @param {number} requiredCredits - 所需积分
   */
  async checkCredits(user = null, requiredCredits = 1) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await userCreditsApi.checkCredits({
        userId,
        sessionId,
        requiredCredits
      });
      
      if (result.success) {
        return {
          hasEnoughCredits: result.data.hasEnoughCredits,
          requiredCredits: result.data.requiredCredits,
          message: result.data.message
        };
      } else {
        return {
          hasEnoughCredits: false,
          requiredCredits,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Check credits error:', error);
      return {
        hasEnoughCredits: false,
        requiredCredits,
        message: '检查积分失败'
      };
    }
  }

  /**
   * 增加积分
   * @param {Object} user - 用户对象
   * @param {number} amount - 积分数量
   * @param {string} description - 描述
   */
  async addCredits(user = null, amount, description = '') {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await userCreditsApi.addCredits({
        userId,
        sessionId,
        amount,
        description
      });
      
      return result.success;
    } catch (error) {
      console.error('Add credits error:', error);
      return false;
    }
  }

  /**
   * 转移匿名积分
   * @param {Object} user - 用户对象
   */
  async transferAnonymousCredits(user) {
    try {
      if (!user?.uid) {
        throw new Error('用户未登录');
      }
      
      const sessionId = getOrCreateSessionId();
      const userId = parseInt(user.uid);
      
      const result = await userCreditsApi.transferAnonymousCredits(sessionId, userId);
      return result.success;
    } catch (error) {
      console.error('Transfer anonymous credits error:', error);
      return false;
    }
  }

  /**
   * 获取积分交易记录
   * @param {Object} user - 用户对象
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 页面大小
   */
  async getTransactions(user = null, pageNum = 1, pageSize = 10) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await userCreditsApi.getTransactions({
        userId,
        sessionId,
        pageNum,
        pageSize
      });
      
      if (result.success) {
        return {
          records: result.data.records || [],
          total: result.data.total || 0,
          pages: result.data.pages || 0,
          current: result.data.current || 1,
          size: result.data.size || pageSize
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get transactions error:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  }
}

/**
 * 后端历史记录服务
 * 替换原有的imageService
 */
export class BackendHistoryService {
  /**
   * 获取用户历史记录
   * @param {Object} user - 用户对象
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 页面大小
   */
  async getUserHistory(user = null, pageNum = 1, pageSize = 12) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await drawingHistoryApi.getHistory({
        userId,
        sessionId,
        includeDeleted: false,
        pageNum,
        pageSize
      });
      
      if (result.success) {
        return {
          records: result.data.records || [],
          total: result.data.total || 0,
          pages: result.data.pages || 0,
          current: result.data.current || 1,
          size: result.data.size || pageSize
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get user history error:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  }

  /**
   * 获取收藏记录
   * @param {Object} user - 用户对象
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 页面大小
   */
  async getFavorites(user = null, pageNum = 1, pageSize = 12) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await drawingHistoryApi.getFavorites({
        userId,
        sessionId,
        pageNum,
        pageSize
      });
      
      if (result.success) {
        return {
          records: result.data.records || [],
          total: result.data.total || 0,
          pages: result.data.pages || 0,
          current: result.data.current || 1,
          size: result.data.size || pageSize
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get favorites error:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  }

  /**
   * 搜索历史记录
   * @param {Object} user - 用户对象
   * @param {string} keyword - 搜索关键词
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 页面大小
   */
  async searchHistory(user = null, keyword, pageNum = 1, pageSize = 12) {
    try {
      const { userId, sessionId } = getUserIdentifier(user);
      const result = await drawingHistoryApi.searchHistory({
        userId,
        sessionId,
        keyword,
        pageNum,
        pageSize
      });
      
      if (result.success) {
        return {
          records: result.data.records || [],
          total: result.data.total || 0,
          pages: result.data.pages || 0,
          current: result.data.current || 1,
          size: result.data.size || pageSize
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Search history error:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        current: 1,
        size: pageSize
      };
    }
  }

  /**
   * 切换收藏状态
   * @param {number} historyId - 历史记录ID
   */
  async toggleFavorite(historyId) {
    try {
      const result = await drawingHistoryApi.toggleFavorite(historyId);
      return result.success;
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return false;
    }
  }

  /**
   * 删除历史记录
   * @param {number} historyId - 历史记录ID
   */
  async deleteHistory(historyId) {
    try {
      const result = await drawingHistoryApi.deleteHistory(historyId);
      return result.success;
    } catch (error) {
      console.error('Delete history error:', error);
      return false;
    }
  }

  /**
   * 批量删除历史记录
   * @param {number[]} historyIds - 历史记录ID数组
   */
  async batchDeleteHistory(historyIds) {
    try {
      const result = await drawingHistoryApi.batchDeleteHistory(historyIds);
      return result.success;
    } catch (error) {
      console.error('Batch delete history error:', error);
      return false;
    }
  }

  /**
   * 增加查看次数
   * @param {number} historyId - 历史记录ID
   */
  async incrementViewCount(historyId) {
    try {
      const result = await drawingHistoryApi.incrementViewCount(historyId);
      return result.success;
    } catch (error) {
      console.error('Increment view count error:', error);
      return false;
    }
  }

  /**
   * 增加下载次数
   * @param {number} historyId - 历史记录ID
   */
  async incrementDownloadCount(historyId) {
    try {
      const result = await drawingHistoryApi.incrementDownloadCount(historyId);
      return result.success;
    } catch (error) {
      console.error('Increment download count error:', error);
      return false;
    }
  }

  /**
   * 获取热门提示词
   * @param {number} limit - 限制数量
   */
  async getPopularPrompts(limit = 10) {
    try {
      const result = await drawingHistoryApi.getPopularPrompts(limit);
      
      if (result.success) {
        return result.data || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Get popular prompts error:', error);
      return [];
    }
  }
}

// 创建服务实例
export const backendPollinationService = new BackendPollinationService();
export const backendCreditsService = new BackendCreditsService();
export const backendHistoryService = new BackendHistoryService();

// 默认导出
export default {
  pollination: backendPollinationService,
  credits: backendCreditsService,
  history: backendHistoryService
};