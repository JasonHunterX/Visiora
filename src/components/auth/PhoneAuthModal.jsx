/**
 * 手机号认证模态框
 * 支持登录和注册
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useBackendAuthContext } from '../../contexts/BackendAuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';

const PhoneAuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { t } = useTranslation();
  const { 
    sendCaptcha, 
    loginWithPhone, 
    registerWithPhone, 
    loading, 
    error, 
    clearError 
  } = useBackendAuthContext();

  // 状态管理
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [step, setStep] = useState(1); // 1: 手机号, 2: 验证码, 3: 密码(可选)
  const [formData, setFormData] = useState({
    phone: '',
    captcha: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const countdownRef = useRef(null);

  // 验证手机号格式
  const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证验证码格式
  const validateCaptcha = (captcha) => {
    return captcha && captcha.length >= 4;
  };

  // 清除错误信息
  const clearMessages = () => {
    setLocalError('');
    setSuccessMessage('');
    clearError();
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      phone: '',
      captcha: '',
      password: ''
    });
    setStep(1);
    setCountdown(0);
    clearMessages();
  };

  // 关闭模态框
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 切换模式
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  // 发送验证码
  const handleSendCaptcha = async () => {
    if (!validatePhone(formData.phone)) {
      setLocalError('请输入正确的手机号码');
      return;
    }

    clearMessages();
    
    try {
      const result = await sendCaptcha(formData.phone, mode);
      
      if (result.success) {
        setSuccessMessage('验证码发送成功');
        setStep(2);
        setCountdown(60);
        
        // 启动倒计时
        countdownRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setLocalError(result.message);
      }
    } catch (err) {
      setLocalError(err.message || '发送验证码失败');
    }
  };

  // 验证码验证
  const handleVerifyCode = async () => {
    if (!validateCaptcha(formData.captcha)) {
      setLocalError('请输入正确的验证码');
      return;
    }

    clearMessages();
    setIsSubmitting(true);

    try {
      const authFunc = mode === 'login' ? loginWithPhone : registerWithPhone;
      const result = await authFunc(
        formData.phone, 
        formData.captcha, 
        formData.password || null
      );

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setLocalError(result.message);
      }
    } catch (err) {
      setLocalError(err.message || `${mode === 'login' ? '登录' : '注册'}失败`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 返回上一步
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
      clearMessages();
    }
  };

  // 表单输入处理
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    clearMessages();
  };

  // 清理倒计时
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // 监听模态框状态变化
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const displayError = localError || error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    {mode === 'login' ? '手机号登录' : '手机号注册'}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {step === 1 && '请输入您的手机号码'}
                    {step === 2 && '请输入验证码'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: 手机号输入 */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <CustomInput
                    label="手机号码"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="请输入手机号码"
                    maxLength={11}
                    className="text-lg"
                    autoFocus
                  />
                  
                  <CustomButton
                    onClick={handleSendCaptcha}
                    disabled={!validatePhone(formData.phone) || loading}
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    发送验证码
                  </CustomButton>
                </motion.div>
              )}

              {/* Step 2: 验证码输入 */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                    验证码已发送至 <span className="font-medium text-slate-800 dark:text-white">{formData.phone}</span>
                  </div>

                  <CustomInput
                    label="验证码"
                    type="text"
                    value={formData.captcha}
                    onChange={(e) => handleInputChange('captcha', e.target.value)}
                    placeholder="请输入验证码"
                    maxLength={6}
                    className="text-lg text-center letter-spacing-wider"
                    autoFocus
                  />

                  {/* 密码输入（可选） */}
                  <div className="relative">
                    <CustomInput
                      label="密码（可选）"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="设置登录密码（可选）"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <CustomButton
                      variant="ghost"
                      onClick={handleGoBack}
                      className="flex-1"
                    >
                      返回
                    </CustomButton>
                    <CustomButton
                      onClick={handleVerifyCode}
                      disabled={!validateCaptcha(formData.captcha) || isSubmitting}
                      loading={isSubmitting}
                      className="flex-1"
                    >
                      {mode === 'login' ? '登录' : '注册'}
                    </CustomButton>
                  </div>

                  {/* 重新发送验证码 */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <span className="text-sm text-slate-500">
                        {countdown}秒后可重新发送
                      </span>
                    ) : (
                      <button
                        onClick={handleSendCaptcha}
                        disabled={loading}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        重新发送验证码
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 错误和成功消息 */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">{displayError}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 切换模式 */}
              <div className="mt-6 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {mode === 'login' ? '还没有账号？' : '已有账号？'}
                </span>
                <button
                  onClick={toggleMode}
                  className="ml-2 text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {mode === 'login' ? '立即注册' : '立即登录'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoneAuthModal;