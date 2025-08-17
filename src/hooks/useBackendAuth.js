/**
 * 后端用户认证Hook
 */

import { useState, useEffect, useCallback } from 'react';
import authApi from '../services/authApi.js';

/**
 * Token存储键
 */
const TOKEN_KEY = 'visiora_auth_token';
const REFRESH_TOKEN_KEY = 'visiora_refresh_token';
const USER_INFO_KEY = 'visiora_user_info';

export const useBackendAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 保存认证信息到本地存储
   */
  const saveAuthData = useCallback((authData) => {
    if (authData.token) {
      localStorage.setItem(TOKEN_KEY, authData.token);
    }
    if (authData.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    }
    if (authData.userInfo) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(authData.userInfo));
      setUser(authData.userInfo);
    }
    if (authData.token) {
      setToken(authData.token);
    }
  }, []);

  /**
   * 清除认证信息
   */
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    setUser(null);
    setToken(null);
  }, []);

  /**
   * 发送验证码
   */
  const sendCaptcha = useCallback(async (phone, type = 'login') => {
    try {
      setError(null);
      const result = await authApi.sendCaptcha({ phone, type });
      
      if (result.success) {
        return { success: true, message: result.message || '验证码发送成功' };
      } else {
        throw new Error(result.message || '发送验证码失败');
      }
    } catch (error) {
      const errorMessage = error.message || '发送验证码失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  /**
   * 手机号登录
   */
  const loginWithPhone = useCallback(async (phone, captcha, password = null) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authApi.loginWithPhone({
        phone,
        captcha,
        password,
        isRegister: false
      });

      if (result.success) {
        const authData = {
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          userInfo: result.data.userInfo
        };
        
        saveAuthData(authData);
        
        return { 
          success: true, 
          message: result.message || '登录成功',
          user: result.data.userInfo 
        };
      } else {
        throw new Error(result.message || '登录失败');
      }
    } catch (error) {
      const errorMessage = error.message || '登录失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [saveAuthData]);

  /**
   * 手机号注册
   */
  const registerWithPhone = useCallback(async (phone, captcha, password = null) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authApi.loginWithPhone({
        phone,
        captcha,
        password,
        isRegister: true
      });

      if (result.success) {
        const authData = {
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          userInfo: result.data.userInfo
        };
        
        saveAuthData(authData);
        
        return { 
          success: true, 
          message: result.message || '注册成功',
          user: result.data.userInfo 
        };
      } else {
        throw new Error(result.message || '注册失败');
      }
    } catch (error) {
      const errorMessage = error.message || '注册失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [saveAuthData]);

  /**
   * 退出登录
   */
  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('退出登录API调用失败:', error);
    } finally {
      clearAuthData();
    }
  }, [token, clearAuthData]);

  /**
   * 刷新Token
   */
  const refreshUserToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('没有刷新令牌');
      }

      const result = await authApi.refreshToken(refreshToken);
      
      if (result.success) {
        const authData = {
          token: result.data.token,
          refreshToken: result.data.refreshToken || refreshToken,
          userInfo: result.data.userInfo || user
        };
        
        saveAuthData(authData);
        return true;
      } else {
        throw new Error(result.message || 'Token刷新失败');
      }
    } catch (error) {
      console.error('Token刷新失败:', error);
      clearAuthData();
      return false;
    }
  }, [user, saveAuthData, clearAuthData]);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = useCallback(async () => {
    try {
      if (!token) return null;

      const result = await authApi.getUserInfo(token);
      
      if (result.success) {
        const userInfo = result.data;
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
        setUser(userInfo);
        return userInfo;
      } else {
        throw new Error(result.message || '获取用户信息失败');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }, [token]);

  /**
   * 更新用户信息
   */
  const updateUserInfo = useCallback(async (newUserInfo) => {
    try {
      if (!token) {
        throw new Error('用户未登录');
      }

      const result = await authApi.updateUserInfo(newUserInfo, token);
      
      if (result.success) {
        const updatedUser = result.data;
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        throw new Error(result.message || '更新用户信息失败');
      }
    } catch (error) {
      const errorMessage = error.message || '更新用户信息失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [token]);

  /**
   * 初始化认证状态
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUserInfo = localStorage.getItem(USER_INFO_KEY);

        if (storedToken && storedUserInfo) {
          try {
            // 验证Token是否有效
            const result = await authApi.verifyToken(storedToken);
            
            if (result.success) {
              setToken(storedToken);
              setUser(JSON.parse(storedUserInfo));
            } else {
              // Token无效，尝试刷新
              const refreshSuccess = await refreshUserToken();
              if (!refreshSuccess) {
                clearAuthData();
              }
            }
          } catch (error) {
            console.error('Token验证失败:', error);
            // 尝试刷新Token
            const refreshSuccess = await refreshUserToken();
            if (!refreshSuccess) {
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUserToken, clearAuthData]);

  return {
    // 状态
    user,
    token,
    loading,
    error,
    
    // 方法
    sendCaptcha,
    loginWithPhone,
    registerWithPhone,
    logout,
    refreshUserToken,
    fetchUserInfo,
    updateUserInfo,
    
    // 工具方法
    clearError: () => setError(null),
    isAuthenticated: !!user && !!token
  };
};