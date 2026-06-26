import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { I18nProvider, useI18n } from '@/i18n';
import { useThemeSync } from '@/hooks/useThemeSync';
import { siteConfig } from '@/config/site';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function DocumentMeta() {
  const { t, lang } = useI18n();
  const { pathname } = useLocation();

  useEffect(() => {
    const map: Record<string, { title: string; desc: string }> = {
      '/': {
        title: lang === 'zh'
          ? 'TimeForge — Unix 时间戳转换工具 | Timestamp Converter'
          : 'TimeForge — Unix Timestamp Converter',
        desc: t.hero.subtitle,
      },
      '/about': {
        title: lang === 'zh' ? '关于 TimeForge' : 'About TimeForge',
        desc: t.about.intro,
      },
      '/privacy-policy': {
        title: lang === 'zh' ? '隐私政策 — TimeForge' : 'Privacy Policy — TimeForge',
        desc: t.privacy.sections[0].p,
      },
    };
    const m = map[pathname] || {
      title: 'TimeForge',
      desc: t.hero.subtitle,
    };
    document.title = m.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', m.desc);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // 动态 canonical
    const hashPath = pathname === '/' ? '' : `/#${pathname}`;
    const url = `${siteConfig.siteUrl}/${hashPath}`.replace(/\/+$/, '') || siteConfig.siteUrl;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [lang, t, pathname]);

  return null;
}

function AppInner() {
  useThemeSync();
  return (
    <Layout>
      <ScrollToTop />
      <DocumentMeta />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <HashRouter>
        <AppInner />
      </HashRouter>
    </I18nProvider>
  );
}
