import { useMemo, useState } from 'react';
import { CalendarClock, Plus, Minus } from 'lucide-react';
import { useI18n } from '@/i18n';
import { SectionCard } from '@/components/ui/SectionCard';
import { CopyButton } from '@/components/ui/CopyButton';
import { shiftTime, toDatetimeLocalValue, type TimeDelta } from '@/lib/time';
import { cn } from '@/lib/utils';

type Op = 'add' | 'subtract';

export function RelativeCalc() {
  const { t } = useI18n();
  const [baseStr, setBaseStr] = useState(() => toDatetimeLocalValue(new Date()));
  const [op, setOp] = useState<Op>('add');
  const [delta, setDelta] = useState<TimeDelta>({ days: 7 });

  const target = useMemo(() => {
    if (!baseStr) return null;
    const d = new Date(baseStr);
    if (Number.isNaN(d.getTime())) return null;
    const sign = op === 'add' ? 1 : -1;
    return shiftTime(d, {
      years: (delta.years ?? 0) * sign,
      months: (delta.months ?? 0) * sign,
      days: (delta.days ?? 0) * sign,
      hours: (delta.hours ?? 0) * sign,
      minutes: (delta.minutes ?? 0) * sign,
      seconds: (delta.seconds ?? 0) * sign,
    });
  }, [baseStr, op, delta]);

  const fields: { key: keyof TimeDelta; label: string }[] = [
    { key: 'years', label: t.relative.years },
    { key: 'months', label: t.relative.months },
    { key: 'days', label: t.relative.days },
    { key: 'hours', label: t.relative.hours },
    { key: 'minutes', label: t.relative.minutes },
    { key: 'seconds', label: t.relative.seconds },
  ];

  return (
    <SectionCard
      id="relative"
      title={t.relative.title}
      subtitle={t.relative.subtitle}
      icon={<CalendarClock size={18} />}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="label" htmlFor="base-input">{t.relative.base}</label>
          <div className="flex gap-2">
            <input
              id="base-input"
              type="datetime-local"
              step={1}
              className="input"
              value={baseStr}
              onChange={(e) => setBaseStr(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setBaseStr(toDatetimeLocalValue(new Date()))}
              className="btn-outline shrink-0 text-xs"
            >
              {t.relative.baseNow}
            </button>
          </div>

          <div className="mt-4">
            <label className="label">{t.relative.operation}</label>
            <div className="inline-flex rounded border border-border bg-surface-2 p-1">
              {(['add', 'subtract'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOp(o)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-all',
                    op === o ? 'bg-accent text-bg' : 'text-muted hover:text-ink',
                  )}
                >
                  {o === 'add' ? <Plus size={12} /> : <Minus size={12} />}
                  {o === 'add' ? t.relative.add : t.relative.subtract}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input
                  type="number"
                  min={0}
                  className="input px-2 py-1.5 text-center"
                  value={(delta[f.key] as number) ?? ''}
                  onChange={(e) => {
                    const v = e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0);
                    setDelta((d) => ({ ...d, [f.key]: v }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded border border-border bg-surface-2/50 p-4">
            <div className="label">{t.relative.target}</div>
            {target ? (
              <div className="mono text-xl text-accent break-all">{target.toISOString()}</div>
            ) : <span className="text-muted">—</span>}
          </div>
          <div className="rounded border border-border bg-surface-2/50 p-4">
            <div className="label">{t.relative.targetTs}</div>
            {target ? (
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-lg text-ink">{Math.floor(target.getTime() / 1000)}</span>
                <CopyButton value={String(Math.floor(target.getTime() / 1000))} label={t.common.copy} />
              </div>
            ) : <span className="text-muted">—</span>}
          </div>
          <div className="rounded border border-border bg-surface-2/50 p-4">
            <div className="label">{t.relative.targetMs}</div>
            {target ? (
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-lg text-ink">{target.getTime()}</span>
                <CopyButton value={String(target.getTime())} label={t.common.copy} />
              </div>
            ) : <span className="text-muted">—</span>}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
