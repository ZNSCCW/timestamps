import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '@/i18n';
import { SectionCard } from '@/components/ui/SectionCard';
import { timestampToTimezones } from '@/lib/time';
import { TIMEZONES } from '@/lib/timezone';

export function TimezoneMatrix() {
  const { t, lang } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const rows = timestampToTimezones(now, 'milliseconds', TIMEZONES, lang === 'zh' ? 'zh-CN' : 'en-US');

  return (
    <SectionCard
      id="matrix"
      title={t.matrix.title}
      subtitle={t.matrix.subtitle}
      icon={<Globe size={18} />}
      action={
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          {t.matrix.basedOn}
        </span>
      }
    >
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-2 text-muted">
              <th className="px-4 py-2.5 text-left font-medium">{t.matrix.city}</th>
              <th className="px-4 py-2.5 text-left font-medium">{t.matrix.date}</th>
              <th className="px-4 py-2.5 text-left font-medium">{t.matrix.time}</th>
              <th className="px-4 py-2.5 text-right font-medium">{t.matrix.offset}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const tz = TIMEZONES[i];
              return (
                <tr
                  key={r.timezone}
                  className="border-t border-border transition-colors hover:bg-surface-2/50"
                >
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-ink">{lang === 'zh' ? tz.cityZh : tz.city}</div>
                    <div className="mono text-[10px] text-muted">{r.timezone}</div>
                  </td>
                  <td className="px-4 py-2.5 mono text-ink">{r.date}</td>
                  <td className="px-4 py-2.5 mono text-accent">{r.time}</td>
                  <td className="px-4 py-2.5 mono text-right text-muted">{r.offset}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
