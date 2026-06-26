import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { siteConfig } from '@/config/site';

export type Lang = 'zh' | 'en';
export type Theme = 'dark' | 'light';
// consent: null = 未选择（显示横幅）, 'accepted' | 'rejected' = 已选择
export type CookieConsent = null | 'accepted' | 'rejected';

interface AppState {
  lang: Lang;
  theme: Theme;
  consent: CookieConsent;
  /** 是否强制重新调出横幅（点击"管理 Cookie"时置 true） */
  bannerOpen: boolean;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setConsent: (c: Exclude<CookieConsent, null>) => void;
  openBanner: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: siteConfig.defaultLang,
      theme: 'dark',
      consent: null,
      bannerOpen: false,
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((s) => ({ lang: s.lang === 'zh' ? 'en' : 'zh' })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setConsent: (consent) => set({ consent, bannerOpen: false }),
      openBanner: () => set({ bannerOpen: true }),
    }),
    {
      name: 'timeforge-prefs',
      partialize: (s) => ({ lang: s.lang, theme: s.theme, consent: s.consent }),
    },
  ),
);
