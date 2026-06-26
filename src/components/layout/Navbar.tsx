import { Link, useLocation } from 'react-router-dom';
import { Clock, Languages, Moon, Sun } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { useThemeSync } from '@/hooks/useThemeSync';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { t, lang } = useI18n();
  const toggleLang = useAppStore((s) => s.toggleLang);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const theme = useThemeSync();
  const { pathname } = useLocation();

  const links: { to: string; label: string }[] = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/privacy-policy', label: t.nav.privacy },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded border border-accent/30 bg-surface-2">
            <Clock size={18} className="text-accent" />
            <span className="absolute inset-0 rounded animate-pulse-soft border border-accent/20" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-ink">{t.brand}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{t.tagline}</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'rounded px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-accent' : 'text-muted hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            );
          })}

          <div className="mx-1 h-6 w-px bg-border" />

          <button
            type="button"
            onClick={toggleLang}
            aria-label="toggle language"
            className="btn-ghost min-h-[36px] px-2.5"
          >
            <Languages size={16} />
            <span className="text-xs font-semibold">{t.nav.lang}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="toggle theme"
            className="btn-ghost min-h-[36px] px-2.5"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
