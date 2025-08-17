/**
 * 配置面板组件 - 用于在前端和后端模式之间切换
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  Server,
  Globe,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Monitor,
  Cloud,
  Info
} from 'lucide-react';

import GlassCard from '../ui/GlassCard';
import CustomButton from '../ui/CustomButton';
import { serviceAdapter } from '../../services/serviceAdapter';
import { cn } from '../../utils/cn';

const ConfigPanel = memo(({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [backendInfo, setBackendInfo] = useState(null);
  
  /**
   * 测试后端连接
   */
  const testBackendConnection = useCallback(async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      // 测试后端健康检查接口
      const response = await fetch(`${serviceAdapter.config.backendUrl}/api/ai-drawing/test/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('success');
        setBackendInfo(data.data || data);
        console.log('后端连接测试成功:', data);
      } else {
        setConnectionStatus('error');
        console.error('后端连接测试失败:', response.status, response.statusText);
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('后端连接测试异常:', error);
    } finally {
      setTestingConnection(false);
    }
  }, []);
  
  /**
   * 获取当前配置信息
   */
  const getCurrentConfig = useCallback(() => {
    return {
      useBackend: serviceAdapter.config.useBackend,
      backendUrl: serviceAdapter.config.backendUrl,
      timeout: serviceAdapter.config.timeout,
      environment: import.meta.env.MODE,
      isDev: import.meta.env.DEV
    };
  }, []);
  
  /**
   * 复制配置信息
   */
  const copyConfig = useCallback(() => {
    const config = getCurrentConfig();
    const configText = JSON.stringify(config, null, 2);
    
    navigator.clipboard.writeText(configText).then(() => {
      alert('配置信息已复制到剪贴板');
    }).catch(() => {
      console.error('复制失败');
    });
  }, [getCurrentConfig]);
  
  // 组件加载时自动测试后端连接
  useEffect(() => {
    if (serviceAdapter.config.useBackend && isExpanded) {
      testBackendConnection();
    }
  }, [serviceAdapter.config.useBackend, isExpanded, testBackendConnection]);
  
  const config = getCurrentConfig();
  
  return (
    <GlassCard className={cn(
      "border-slate-300 dark:border-white/10",
      className
    )}>
      <div className="space-y-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              系统配置
            </h3>
          </div>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? '收起' : '展开'}
          </CustomButton>
        </div>
        
        {/* 快速状态显示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.useBackend ? (
              <>
                <Cloud className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  后端模式
                </span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  前端模式
                </span>
              </>
            )}
          </div>
          
          {config.useBackend && (
            <div className="flex items-center gap-2">
              {connectionStatus === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {connectionStatus === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={testBackendConnection}
                icon={testingConnection ? RefreshCw : Server}
                loading={testingConnection}
                className="text-xs"
              >
                测试连接
              </CustomButton>
            </div>
          )}
        </div>
        
        {/* 详细配置信息 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* 基础配置 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-white/80 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  基础配置
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">运行模式:</span>
                      <span className="font-medium">
                        {config.useBackend ? '后端集成' : '前端独立'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">环境:</span>
                      <span className="font-medium">{config.environment}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">调试模式:</span>
                      <span className="font-medium">
                        {config.isDev ? '开启' : '关闭'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">超时:</span>
                      <span className="font-medium">{config.timeout}ms</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 后端配置 */}
              {config.useBackend && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-white/80 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    后端服务
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">服务地址:</span>
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {config.backendUrl}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-white/60">连接状态:</span>
                      <div className="flex items-center gap-1">
                        {connectionStatus === 'success' && (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-xs">已连接</span>
                          </>
                        )}
                        {connectionStatus === 'error' && (
                          <>
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-red-600 text-xs">连接失败</span>
                          </>
                        )}
                        {connectionStatus === null && (
                          <span className="text-slate-500 text-xs">未测试</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 后端服务信息 */}
                  {backendInfo && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h5 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        后端服务状态
                      </h5>
                      <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                        {backendInfo.aiDrawingTaskService && (
                          <div>✓ AI绘图服务: 正常</div>
                        )}
                        {backendInfo.pollinationsService && (
                          <div>✓ Pollinations服务: 正常</div>
                        )}
                        {backendInfo.userCreditsService && (
                          <div>✓ 积分服务: 正常</div>
                        )}
                        {backendInfo.supportedModels && (
                          <div>✓ 支持模型: {backendInfo.supportedModels.join(', ')}</div>
                        )}
                        {backendInfo.timestamp && (
                          <div>⏱ 检测时间: {new Date(backendInfo.timestamp).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 功能对比 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-white/80 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  功能对比
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400">后端模式</h5>
                    <ul className="space-y-1 text-slate-600 dark:text-white/60">
                      <li>✓ 完整积分系统</li>
                      <li>✓ 任务状态跟踪</li>
                      <li>✓ 历史记录管理</li>
                      <li>✓ 用户数据同步</li>
                      <li>✓ 提示词增强</li>
                      <li>✓ 多模型支持</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-600 dark:text-green-400">前端模式</h5>
                    <ul className="space-y-1 text-slate-600 dark:text-white/60">
                      <li>✓ 快速响应</li>
                      <li>✓ 离线缓存</li>
                      <li>✓ 本地存储</li>
                      <li>○ 基础积分</li>
                      <li>○ 简单历史</li>
                      <li>- 无状态跟踪</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={copyConfig}
                  className="text-xs"
                >
                  复制配置
                </CustomButton>
                
                {config.isDev && (
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Current Config:', config);
                      console.log('Service Adapter:', serviceAdapter);
                    }}
                    className="text-xs text-purple-600"
                  >
                    控制台输出
                  </CustomButton>
                )}
              </div>
              
              {/* 环境变量提示 */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-1">切换模式:</p>
                    <p>在 .env 文件中设置 VITE_USE_BACKEND=true 启用后端模式</p>
                    <p>设置 VITE_API_BASE_URL 指定后端服务地址</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
});

ConfigPanel.displayName = 'ConfigPanel';

export default ConfigPanel;