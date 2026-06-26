import { Link } from 'react-router-dom';
import { Cookie as CookieIcon, Github, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { siteConfig } from '@/config/site';

export function Footer() {
  const { t } = useI18n();
  const openBanner = useAppStore((s) => s.openBanner);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-surface/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck size={14} className="text-accent/70" />
          <span>{t.footer.builtWith}</span>
        </div>

        <div className="flex items-center gap-5 text-xs text-muted">
          <Link to="/about" className="hover:text-ink transition-colors">{t.nav.about}</Link>
          <Link to="/privacy-policy" className="hover:text-ink transition-colors">{t.nav.privacy}</Link>
          <button
            type="button"
            onClick={openBanner}
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <CookieIcon size={14} />
            {t.cookie.manage}
          </button>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>

        <div className="text-xs text-muted/70">
          © {year} · {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
