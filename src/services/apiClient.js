/**
 * API客户端基础配置
 */

// API基础配置
const API_CONFIG = {
  // 开发环境后端地址 - 空字符串表示使用Vite代理
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  // 超时时间
  TIMEOUT: 30000,
  // 请求头
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * HTTP状态码
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * API响应封装
 */
class ApiResponse {
  constructor(data, success = true, message = '', code = 200) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.code = code;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(data, true, message, 200);
  }

  static error(message = 'Error', code = 500, data = null) {
    return new ApiResponse(data, false, message, code);
  }
}

/**
 * API客户端类
 */
class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.HEADERS };
  }

  /**
   * 构建完整URL
   */
  buildUrl(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * 获取请求头
   */
  getHeaders(customHeaders = {}) {
    return {
      ...this.defaultHeaders,
      ...customHeaders
    };
  }

  /**
   * 处理响应
   */
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (response.ok) {
        // 后端返回的统一响应格式 {code, data, message, success}
        if (data.success !== undefined) {
          return data.success 
            ? ApiResponse.success(data.data, data.message)
            : ApiResponse.error(data.message, data.code, data.data);
        }
        // 直接返回数据
        return ApiResponse.success(data);
      } else {
        return ApiResponse.error(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }
    } catch (error) {
      return ApiResponse.error(
        'Response parsing failed: ' + error.message,
        response.status
      );
    }
  }

  /**
   * 处理请求错误
   */
  handleError(error) {
    console.error('API Request Error:', error);
    
    if (error.name === 'AbortError') {
      return ApiResponse.error('Request timeout', 408);
    }
    
    if (!navigator.onLine) {
      return ApiResponse.error('Network connection failed', 0);
    }
    
    return ApiResponse.error(
      error.message || 'Unknown network error',
      0
    );
  }

  /**
   * 基础请求方法
   */
  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    
    // 设置超时
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const config = {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        signal: controller.signal,
        ...options
      };

      // 处理请求体
      if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
      }

      console.log(`API Request: ${config.method} ${url}`, config.body ? JSON.parse(config.body) : '');
      
      const response = await fetch(url, config);
      const result = await this.handleResponse(response);
      
      console.log(`API Response: ${config.method} ${url}`, result);
      
      return result;
    } catch (error) {
      return this.handleError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET请求
   */
  async get(endpoint, params = {}, options = {}) {
    const fullUrl = this.buildUrl(endpoint);
    
    // 如果有查询参数，添加到URL中
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
      
      const separator = fullUrl.includes('?') ? '&' : '?';
      const finalUrl = `${fullUrl}${separator}${searchParams.toString()}`;
      
      return this.request(finalUrl, {
        method: 'GET',
        ...options
      });
    }
    
    return this.request(fullUrl, {
      method: 'GET',
      ...options
    });
  }

  /**
   * POST请求
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options
    });
  }

  /**
   * PUT请求
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options
    });
  }

  /**
   * DELETE请求
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
}

// 创建默认实例
const apiClient = new ApiClient();

export { ApiClient, ApiResponse, HTTP_STATUS, API_CONFIG };
export default apiClient;