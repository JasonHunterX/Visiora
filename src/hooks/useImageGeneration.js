/**
 * 图像生成 Hook - 支持新的后端集成
 */

import { useState, useCallback, useRef } from 'react';
import { serviceAdapter } from '../services/serviceAdapter.js';
import { useBackendAuthContext } from '../contexts/BackendAuthContext.jsx';

export const useImageGeneration = () => {
  const { user } = useBackendAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  
  const progressIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  
  /**
   * 模拟进度更新
   */
  const simulateProgress = useCallback(() => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressIntervalRef.current);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  }, []);
  
  /**
   * 清理定时器
   */
  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  /**
   * 处理图像加载完成
   */
  const handleImageLoadComplete = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
    setProgress(100);
    cleanup();
  }, [cleanup]);
  
  /**
   * 处理图像加载错误
   */
  const handleImageLoadError = useCallback(() => {
    setError("生成的图像加载失败");
    setIsLoading(false);
    setImageLoaded(false);
    setProgress(0);
    cleanup();
  }, [cleanup]);
  
  /**
   * 轮询任务状态（仅后端模式）
   */
  const pollTaskStatus = useCallback(async (taskId, maxAttempts = 30) => {
    if (!serviceAdapter.config.useBackend) return;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await serviceAdapter.pollination.getTaskStatus(taskId);
        
        if (status.status === 'COMPLETED') {
          setImageUrl(status.imageUrl);
          setProgress(100);
          return { success: true, imageUrl: status.imageUrl };
        } else if (status.status === 'FAILED') {
          throw new Error(status.errorMessage || '任务执行失败');
        }
        
        // 更新进度
        const progressValue = Math.min(10 + (i / maxAttempts) * 80, 95);
        setProgress(progressValue);
        
        // 等待2秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`轮询任务状态失败 (尝试 ${i + 1}/${maxAttempts}):`, error);
        if (i === maxAttempts - 1) {
          throw new Error('任务状态查询超时');
        }
      }
    }
    
    throw new Error('任务执行超时');
  }, []);
  
  /**
   * 生成图像
   */
  const generateImage = useCallback(async (options) => {
    const {
      prompt,
      model = 'flux',
      width = 1024,
      height = 1024,
      seed = null,
      removeWatermark = false,
      enhancePrompt = false
    } = options;
    
    if (!prompt || !prompt.trim()) {
      throw new Error('提示词不能为空');
    }
    
    try {
      // 重置状态
      setIsLoading(true);
      setError(null);
      setImageLoaded(false);
      setImageUrl(null);
      setTaskId(null);
      
      // 开始进度模拟
      simulateProgress();
      
      console.log('开始生成图像，使用后端:', serviceAdapter.config.useBackend);
      
      if (serviceAdapter.config.useBackend) {
        // 使用后端服务
        const result = await serviceAdapter.pollination.generateImage(
          prompt,
          {
            model,
            width,
            height,
            seed: seed || Math.floor(Math.random() * 1000),
            removeWatermark,
            enhancePrompt
          },
          user
        );
        
        if (result.success) {
          setTaskId(result.data.taskId);
          setProgress(20);
          
          // 如果立即有图像URL，设置它
          if (result.data.imageUrl) {
            setImageUrl(result.data.imageUrl);
            setProgress(100);
          } else {
            // 轮询任务状态
            const pollResult = await pollTaskStatus(result.data.taskId);
            if (pollResult.success) {
              setImageUrl(pollResult.imageUrl);
            }
          }
        } else {
          throw new Error(result.error || '图像生成失败');
        }
      } else {
        // 使用原有前端服务
        const encodedPrompt = encodeURIComponent(prompt.trim());
        const finalSeed = seed || Math.floor(Math.random() * 1000);
        
        let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&enhance=true&seed=${finalSeed}`;
        
        if (removeWatermark) {
          apiUrl += "&nologo=true";
        }
        
        console.log("前端模式 - API URL:", apiUrl);
        setImageUrl(apiUrl);
        setProgress(100);
      }
      
      // 设置超时保护
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setProgress(0);
          if (!imageUrl) {
            setError('图像生成超时，请重试');
          }
        }
      }, 30000); // 30秒超时
      
    } catch (err) {
      console.error('图像生成失败:', err);
      setError(err.message || '图像生成失败');
      setIsLoading(false);
      setImageLoaded(false);
      setProgress(0);
      cleanup();
    }
  }, [user, simulateProgress, pollTaskStatus, cleanup, isLoading, imageUrl]);
  
  /**
   * 增强提示词
   */
  const enhancePrompt = useCallback(async (prompt) => {
    try {
      if (serviceAdapter.config.useBackend) {
        const result = await serviceAdapter.pollination.enhancePrompt(prompt);
        return result.enhanced;
      } else {
        // 使用原有的提示词增强服务
        const { generateRandomPrompt } = await import('../api/pollinationService.js');
        return await generateRandomPrompt(prompt);
      }
    } catch (error) {
      console.error('提示词增强失败:', error);
      return prompt; // 失败时返回原始提示词
    }
  }, []);
  
  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setImageUrl(null);
    setImageLoaded(false);
    setError(null);
    setProgress(0);
    setTaskId(null);
    cleanup();
  }, [cleanup]);
  
  return {
    // 状态
    isLoading,
    imageUrl,
    imageLoaded,
    error,
    progress,
    taskId,
    
    // 方法
    generateImage,
    enhancePrompt,
    handleImageLoadComplete,
    handleImageLoadError,
    reset,
    
    // 配置信息
    useBackend: serviceAdapter.config.useBackend
  };
};