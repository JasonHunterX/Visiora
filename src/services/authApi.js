/**
 * 后端用户认证API服务
 */

import apiClient from './apiClient.js';

/**
 * 用户认证API类
 */
class AuthApi {
  constructor() {
    this.basePath = '/api/base/user';
  }

  /**
   * 手机号登录/注册（统一接口）
   * @param {Object} request - 登录请求
   * @param {string} request.phone - 手机号
   * @param {string} request.captcha - 验证码
   * @param {string} [request.password] - 密码（可选）
   * @param {boolean} [request.isRegister] - 是否注册（可选）
   */
  async loginWithPhone(request) {
    try {
      const result = await apiClient.post(`${this.basePath}/login`, request);
      return result;
    } catch (error) {
      console.error('手机号登录失败:', error);
      throw error;
    }
  }

  /**
   * 发送验证码
   * @param {Object} request - 验证码请求
   * @param {string} request.phone - 手机号
   * @param {string} [request.type] - 验证码类型（login/register）
   */
  async sendCaptcha(request) {
    try {
      const result = await apiClient.post(`${this.basePath}/captcha`, request);
      return result;
    } catch (error) {
      console.error('发送验证码失败:', error);
      throw error;
    }
  }

  /**
   * 验证Token
   * @param {string} token - JWT Token
   */
  async verifyToken(token) {
    try {
      const result = await apiClient.get(`${this.basePath}/verify`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return result;
    } catch (error) {
      console.error('Token验证失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户信息
   * @param {string} token - JWT Token
   */
  async getUserInfo(token) {
    try {
      const result = await apiClient.get(`${this.basePath}/info`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return result;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo - 用户信息
   * @param {string} token - JWT Token
   */
  async updateUserInfo(userInfo, token) {
    try {
      const result = await apiClient.put(`${this.basePath}/update`, userInfo, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return result;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }

  /**
   * 退出登录
   * @param {string} token - JWT Token
   */
  async logout(token) {
    try {
      const result = await apiClient.post(`${this.basePath}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return result;
    } catch (error) {
      console.error('退出登录失败:', error);
      throw error;
    }
  }

  /**
   * 刷新Token
   * @param {string} refreshToken - 刷新Token
   */
  async refreshToken(refreshToken) {
    try {
      const result = await apiClient.post(`${this.basePath}/refresh`, {
        refreshToken
      });
      return result;
    } catch (error) {
      console.error('刷新Token失败:', error);
      throw error;
    }
  }
}

// 创建API实例
export const authApi = new AuthApi();
export default authApi;