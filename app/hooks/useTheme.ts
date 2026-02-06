import { useState, useEffect } from 'react';

export type Theme = 'default' | 'light';

const THEME_STORAGE_KEY = 'app-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // 移除所有主题属性
    root.removeAttribute('data-theme');
    
    // 如果不是默认主题，添加对应的主题属性
    if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }
    
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, changeTheme };
}
