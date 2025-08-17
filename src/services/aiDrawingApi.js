/**
 * AI绘图API服务
 * 与后端Java服务进行交互
 */

import apiClient from './apiClient.js';

/**
 * AI绘图API类
 */
class AiDrawingApi {
  constructor() {
    this.basePath = '/api/ai-drawing';
  }

  /**
   * 创建绘图任务
   * @param {Object} request - 绘图请求参数
   * @param {string} request.prompt - 提示词
   * @param {number} [request.userId] - 用户ID
   * @param {string} [request.sessionId] - 会话ID
   * @param {string} [request.model] - AI模型
   * @param {number} [request.width] - 图像宽度
   * @param {number} [request.height] - 图像高度
   * @param {number} [request.seed] - 随机种子
   * @param {boolean} [request.removeWatermark] - 是否去水印
   * @param {boolean} [request.enhancePrompt] - 是否增强提示词
   */
  async generateImage(request) {
    try {
      const result = await apiClient.post(`${this.basePath}/generate`, request);
      return result;
    } catch (error) {
      console.error('生成图像失败:', error);
      throw error;
    }
  }

  /**
   * 增强提示词
   * @param {string} prompt - 原始提示词
   */
  async enhancePrompt(prompt) {
    try {
      const result = await apiClient.post(`${this.basePath}/enhance-prompt`, {
        prompt
      });
      return result;
    } catch (error) {
      console.error('增强提示词失败:', error);
      throw error;
    }
  }

  /**
   * 查询任务状态
   * @param {string} taskId - 任务ID
   */
  async getTaskStatus(taskId) {
    try {
      const result = await apiClient.get(`${this.basePath}/task/${taskId}`);
      return result;
    } catch (error) {
      console.error('查询任务状态失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户任务列表
   * @param {Object} params - 查询参数
   * @param {number} [params.userId] - 用户ID
   * @param {string} [params.sessionId] - 会话ID
   * @param {string} [params.status] - 任务状态
   * @param {number} [params.pageNum] - 页码
   * @param {number} [params.pageSize] - 页面大小
   */
  async getUserTasks(params = {}) {
    try {
      const result = await apiClient.get(`${this.basePath}/tasks`, params);
      return result;
    } catch (error) {
      console.error('获取用户任务失败:', error);
      throw error;
    }
  }

  /**
   * 获取支持的AI模型
   */
  async getSupportedModels() {
    try {
      const result = await apiClient.get(`${this.basePath}/models`);
      return result;
    } catch (error) {
      console.error('获取支持模型失败:', error);
      throw error;
    }
  }

  /**
   * 获取任务统计
   */
  async getTaskStats() {
    try {
      const result = await apiClient.get(`${this.basePath}/stats`);
      return result;
    } catch (error) {
      console.error('获取任务统计失败:', error);
      throw error;
    }
  }
}

/**
 * 用户积分API类
 */
class UserCreditsApi {
  constructor() {
    this.basePath = '/api/ai-drawing/credits';
  }

  /**
   * 获取用户积分信息
   * @param {number} [userId] - 用户ID
   * @param {string} [sessionId] - 会话ID
   */
  async getCreditsInfo(userId, sessionId) {
    try {
      const params = {};
      if (userId) params.userId = userId;
      if (sessionId) params.sessionId = sessionId;
      
      const result = await apiClient.get(`${this.basePath}/info`, params);
      return result;
    } catch (error) {
      console.error('获取积分信息失败:', error);
      throw error;
    }
  }

  /**
   * 检查积分是否足够
   * @param {Object} request - 检查请求
   * @param {number} [request.userId] - 用户ID
   * @param {string} [request.sessionId] - 会话ID
   * @param {number} request.requiredCredits - 所需积分
   */
  async checkCredits(request) {
    try {
      const result = await apiClient.post(`${this.basePath}/check`, request);
      return result;
    } catch (error) {
      console.error('检查积分失败:', error);
      throw error;
    }
  }

  /**
   * 增加用户积分
   * @param {Object} request - 增加积分请求
   * @param {number} [request.userId] - 用户ID
   * @param {string} [request.sessionId] - 会话ID
   * @param {number} request.amount - 积分数量
   * @param {string} [request.description] - 描述
   */
  async addCredits(request) {
    try {
      const result = await apiClient.post(`${this.basePath}/add`, request);
      return result;
    } catch (error) {
      console.error('增加积分失败:', error);
      throw error;
    }
  }

  /**
   * 转移匿名积分
   * @param {string} sessionId - 会话ID
   * @param {number} userId - 用户ID
   */
  async transferAnonymousCredits(sessionId, userId) {
    try {
      const result = await apiClient.post(`${this.basePath}/transfer`, {
        sessionId,
        userId
      });
      return result;
    } catch (error) {
      console.error('转移匿名积分失败:', error);
      throw error;
    }
  }

  /**
   * 获取积分交易记录
   * @param {Object} params - 查询参数
   * @param {number} [params.userId] - 用户ID
   * @param {string} [params.sessionId] - 会话ID
   * @param {string} [params.transactionType] - 交易类型
   * @param {number} [params.pageNum] - 页码
   * @param {number} [params.pageSize] - 页面大小
   */
  async getTransactions(params = {}) {
    try {
      const result = await apiClient.get(`${this.basePath}/transactions`, params);
      return result;
    } catch (error) {
      console.error('获取积分交易记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取最近交易记录
   * @param {number} [userId] - 用户ID
   * @param {string} [sessionId] - 会话ID
   * @param {number} [limit] - 限制数量
   */
  async getRecentTransactions(userId, sessionId, limit = 5) {
    try {
      const params = { limit };
      if (userId) params.userId = userId;
      if (sessionId) params.sessionId = sessionId;
      
      const result = await apiClient.get(`${this.basePath}/transactions/recent`, params);
      return result;
    } catch (error) {
      console.error('获取最近交易记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取积分统计
   */
  async getCreditsStats() {
    try {
      const result = await apiClient.get(`${this.basePath}/stats`);
      return result;
    } catch (error) {
      console.error('获取积分统计失败:', error);
      throw error;
    }
  }
}

/**
 * 绘图历史API类
 */
class DrawingHistoryApi {
  constructor() {
    this.basePath = '/api/ai-drawing/history';
  }

  /**
   * 获取历史记录列表
   * @param {Object} params - 查询参数
   * @param {number} [params.userId] - 用户ID
   * @param {string} [params.sessionId] - 会话ID
   * @param {boolean} [params.includeDeleted] - 是否包含已删除
   * @param {number} [params.pageNum] - 页码
   * @param {number} [params.pageSize] - 页面大小
   */
  async getHistory(params = {}) {
    try {
      const result = await apiClient.get(`${this.basePath}/list`, params);
      return result;
    } catch (error) {
      console.error('获取历史记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取收藏记录
   * @param {Object} params - 查询参数
   * @param {number} [params.userId] - 用户ID
   * @param {string} [params.sessionId] - 会话ID
   * @param {number} [params.pageNum] - 页码
   * @param {number} [params.pageSize] - 页面大小
   */
  async getFavorites(params = {}) {
    try {
      const result = await apiClient.get(`${this.basePath}/favorites`, params);
      return result;
    } catch (error) {
      console.error('获取收藏记录失败:', error);
      throw error;
    }
  }

  /**
   * 搜索历史记录
   * @param {Object} params - 搜索参数
   * @param {number} [params.userId] - 用户ID
   * @param {string} [params.sessionId] - 会话ID
   * @param {string} params.keyword - 搜索关键词
   * @param {number} [params.pageNum] - 页码
   * @param {number} [params.pageSize] - 页面大小
   */
  async searchHistory(params = {}) {
    try {
      const result = await apiClient.get(`${this.basePath}/search`, params);
      return result;
    } catch (error) {
      console.error('搜索历史记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取最近历史
   * @param {number} [userId] - 用户ID
   * @param {string} [sessionId] - 会话ID
   * @param {number} [limit] - 限制数量
   */
  async getRecentHistory(userId, sessionId, limit = 6) {
    try {
      const params = { limit };
      if (userId) params.userId = userId;
      if (sessionId) params.sessionId = sessionId;
      
      const result = await apiClient.get(`${this.basePath}/recent`, params);
      return result;
    } catch (error) {
      console.error('获取最近历史失败:', error);
      throw error;
    }
  }

  /**
   * 切换收藏状态
   * @param {number} historyId - 历史记录ID
   */
  async toggleFavorite(historyId) {
    try {
      const result = await apiClient.post(`${this.basePath}/${historyId}/favorite`);
      return result;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      throw error;
    }
  }

  /**
   * 增加查看次数
   * @param {number} historyId - 历史记录ID
   */
  async incrementViewCount(historyId) {
    try {
      const result = await apiClient.post(`${this.basePath}/${historyId}/view`);
      return result;
    } catch (error) {
      console.error('增加查看次数失败:', error);
      throw error;
    }
  }

  /**
   * 增加下载次数
   * @param {number} historyId - 历史记录ID
   */
  async incrementDownloadCount(historyId) {
    try {
      const result = await apiClient.post(`${this.basePath}/${historyId}/download`);
      return result;
    } catch (error) {
      console.error('增加下载次数失败:', error);
      throw error;
    }
  }

  /**
   * 删除历史记录
   * @param {number} historyId - 历史记录ID
   */
  async deleteHistory(historyId) {
    try {
      const result = await apiClient.delete(`${this.basePath}/${historyId}`);
      return result;
    } catch (error) {
      console.error('删除历史记录失败:', error);
      throw error;
    }
  }

  /**
   * 批量删除历史记录
   * @param {number[]} ids - 历史记录ID数组
   */
  async batchDeleteHistory(ids) {
    try {
      const result = await apiClient.delete(`${this.basePath}/batch`, {
        body: { ids }
      });
      return result;
    } catch (error) {
      console.error('批量删除历史记录失败:', error);
      throw error;
    }
  }

  /**
   * 恢复历史记录
   * @param {number} historyId - 历史记录ID
   */
  async restoreHistory(historyId) {
    try {
      const result = await apiClient.post(`${this.basePath}/${historyId}/restore`);
      return result;
    } catch (error) {
      console.error('恢复历史记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取热门提示词
   * @param {number} [limit] - 限制数量
   */
  async getPopularPrompts(limit = 10) {
    try {
      const result = await apiClient.get(`${this.basePath}/popular-prompts`, { limit });
      return result;
    } catch (error) {
      console.error('获取热门提示词失败:', error);
      throw error;
    }
  }

  /**
   * 获取历史统计
   */
  async getHistoryStats() {
    try {
      const result = await apiClient.get(`${this.basePath}/stats`);
      return result;
    } catch (error) {
      console.error('获取历史统计失败:', error);
      throw error;
    }
  }
}

// 创建API实例
const aiDrawingApi = new AiDrawingApi();
const userCreditsApi = new UserCreditsApi();
const drawingHistoryApi = new DrawingHistoryApi();

export {
  AiDrawingApi,
  UserCreditsApi,
  DrawingHistoryApi,
  aiDrawingApi,
  userCreditsApi,
  drawingHistoryApi
};

export default {
  aiDrawing: aiDrawingApi,
  userCredits: userCreditsApi,
  drawingHistory: drawingHistoryApi
};