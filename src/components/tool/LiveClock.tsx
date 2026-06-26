import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useI18n } from '@/i18n';
import { CopyButton } from '@/components/ui/CopyButton';
import { formatThousands } from '@/lib/time';
import { useAppStore } from '@/store/useAppStore';

export function LiveClock() {
  const { t, lang } = useI18n();
  const theme = useAppStore((s) => s.theme);
  void theme;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const sec = Math.floor(now / 1000);
  const ms = now;
  const isoDate = new Date(now);
  const iso = isoDate.toISOString();
  const utcFull = isoDate.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'UTC',
    hour12: false,
  });

  return (
    <section
      id="live"
      className="relative overflow-hidden rounded panel p-6 sm:p-8 animate-fade-up"
    >
      {/* 背景纹理 */}
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-30" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted">
          <Activity size={12} className="text-accent animate-pulse-soft" />
          {t.liveClock.title}
        </div>

        {/* 秒级大数字 */}
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-baseline gap-3">
              <span className="mono text-4xl sm:text-6xl font-bold text-ink leading-none tracking-tight">
                {formatThousands(sec)}
              </span>
              <span className="text-sm text-muted">{t.liveClock.unitSec}</span>
            </div>
            <CopyButton value={String(sec)} label={t.common.copy} />
          </div>
        </div>

        {/* 毫秒 */}
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <span className="mono text-base text-accent">{formatThousands(ms)}</span>
          <span className="text-xs text-muted">{t.liveClock.unitMs}</span>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted">
            <span className="mono">{iso}</span>
          </div>
        </div>

        {/* UTC full */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="chip">{t.liveClock.utc}</span>
            <span className="mono text-ink">{utcFull}</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-muted/60">
            {t.liveClock.iso}
          </span>
        </div>
      </div>
    </section>
  );
}
