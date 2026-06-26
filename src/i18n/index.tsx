import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { zh, type Dict } from './zh';
import { en } from './en';

const DICTS: Record<string, Dict> = { zh, en };

interface I18nValue {
  lang: 'zh' | 'en';
  t: Dict;
  setLang: (l: 'zh' | 'en') => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const toggleLang = useAppStore((s) => s.toggleLang);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: DICTS[lang] ?? zh,
      setLang,
      toggleLang,
    }),
    [lang, setLang, toggleLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
