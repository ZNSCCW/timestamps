import { Link } from 'react-router-dom';
import { Cookie, Check, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

/**
 * Cookie 同意横幅。
 * 显示条件：用户尚未做出选择（consent === null），或通过 openBanner() 主动调出。
 */
export function CookieBanner() {
  const { t } = useI18n();
  const consent = useAppStore((s) => s.consent);
  const bannerOpen = useAppStore((s) => s.bannerOpen);
  const setConsent = useAppStore((s) => s.setConsent);

  // 未选择 或 主动调出管理面板时显示
  const visible = consent === null || bannerOpen;
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.cookie.title}
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
    >
      <div className="container">
        <div className="panel rounded-lg p-4 shadow-panel animate-fade-up sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-accent/30 bg-surface-2 text-accent">
                <Cookie size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink">{t.cookie.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {t.cookie.desc}{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-accent hover:underline"
                  >
                    {t.cookie.privacy}
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setConsent('rejected')}
                className="btn-ghost min-h-[38px] px-4 py-2 text-xs"
              >
                <X size={14} />
                {t.cookie.reject}
              </button>
              <button
                type="button"
                onClick={() => setConsent('accepted')}
                className="btn-accent min-h-[38px] px-4 py-2 text-xs"
              >
                <Check size={14} />
                {t.cookie.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
