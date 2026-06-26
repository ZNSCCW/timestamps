import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** 把 store 中的 theme 同步到 <html> 的 class 上 */
export function useThemeSync() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return theme;
}
