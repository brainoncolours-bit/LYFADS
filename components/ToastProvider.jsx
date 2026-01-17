'use client';
import { message } from 'antd';
import { createContext, useContext, useMemo } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const toast = useMemo(() => ({
    success: (msg, key = '') =>
      messageApi.open({ type: 'success', content: msg, key, duration: 3 }),
    error: (msg, key = '') =>
      messageApi.open({ type: 'error', content: msg, key, duration: 3 }),
    loading: (msg = 'Loading...', key = '') =>
      messageApi.open({ type: 'loading', content: msg, key, duration: 0 }),
  }), [messageApi]);

  return (
    <ToastContext.Provider value={toast}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
