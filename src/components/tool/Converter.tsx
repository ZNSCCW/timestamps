import { useMemo, useState } from 'react';
import { ArrowRightLeft, Calendar, Hash } from 'lucide-react';
import { useI18n } from '@/i18n';
import { SectionCard } from '@/components/ui/SectionCard';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  normalizeTimestamp,
  timestampToTimezones,
  dateToTimestamp,
  toDatetimeLocalValue,
  type TimestampUnit,
  type TimeZoneResult,
} from '@/lib/time';
import { TIMEZONES } from '@/lib/timezone';
import { cn } from '@/lib/utils';

type Mode = 'tsToDate' | 'dateToTs';

interface TsResultOk {
  error: false;
  unit: TimestampUnit;
  rows: TimeZoneResult[];
}
interface TsResultErr {
  error: true;
}
type TsResult = TsResultOk | TsResultErr | null;

interface DateResultOk {
  error: false;
  seconds: number;
  milliseconds: number;
}
interface DateResultErr {
  error: true;
}
type DateResult = DateResultOk | DateResultErr | null;

export function Converter() {
  const { t, lang } = useI18n();
  const [mode, setMode] = useState<Mode>('tsToDate');

  // ts -> date
  const [tsInput, setTsInput] = useState('');
  const [unit, setUnit] = useState<TimestampUnit | 'auto'>('auto');

  // date -> ts
  const [dateInput, setDateInput] = useState(() => toDatetimeLocalValue(new Date()));
  const [tz, setTz] = useState('UTC');

  const tsResult = useMemo<TsResult>(() => {
    if (!tsInput.trim()) return null;
    const norm = normalizeTimestamp(tsInput);
    if (!norm) return { error: true };
    const effectiveUnit: TimestampUnit = unit === 'auto' ? norm.unit : unit;
    const value = unit === 'auto'
      ? norm.value
      : (unit === 'seconds' ? Number(tsInput) : Number(tsInput));
    return {
      error: false,
      unit: effectiveUnit,
      rows: timestampToTimezones(value, effectiveUnit, TIMEZONES, lang === 'zh' ? 'zh-CN' : 'en-US'),
    };
  }, [tsInput, unit, lang]);

  const dateResult = useMemo<DateResult>(() => {
    if (!dateInput) return null;
    const r = dateToTimestamp(dateInput, tz);
    if (!r) return { error: true };
    return { error: false, ...r };
  }, [dateInput, tz]);

  return (
    <SectionCard
      id="converter"
      title={mode === 'tsToDate' ? t.converter.tsToDate : t.converter.dateToTs}
      icon={<ArrowRightLeft size={18} />}
      action={
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'tsToDate' ? 'dateToTs' : 'tsToDate'))}
          className="btn-outline min-h-[36px] px-3 py-1.5 text-xs"
          aria-label="switch mode"
        >
          <ArrowRightLeft size={14} />
          {mode === 'tsToDate' ? t.converter.dateToTs : t.converter.tsToDate}
        </button>
      }
    >
      {mode === 'tsToDate' ? (
        <div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="label" htmlFor="ts-input">{t.converter.inputTs}</label>
              <input
                id="ts-input"
                className="input"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder={t.converter.inputTsPlaceholder}
                inputMode="numeric"
                autoFocus
              />
            </div>
            <div>
              <label className="label">{t.converter.unit}</label>
              <div className="flex rounded border border-border bg-surface-2 p-1">
                {(['auto', 'seconds', 'milliseconds'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={cn(
                      'rounded px-2.5 py-1.5 text-xs font-medium transition-all',
                      unit === u ? 'bg-accent text-bg' : 'text-muted hover:text-ink',
                    )}
                  >
                    {u === 'auto' ? t.common.auto : u === 'seconds' ? t.common.seconds : t.common.milliseconds}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="label">{t.converter.result}</div>
            {!tsResult && <EmptyHint />}
            {tsResult && tsResult.error === true && (
              <div className="rounded border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {t.common.invalid}
              </div>
            )}
            {tsResult && tsResult.error === false && (
              <div className="overflow-hidden rounded border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {tsResult.rows.map((r) => (
                      <tr key={r.timezone} className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors">
                        <td className="px-3 py-2 text-muted">
                          <span className="text-ink">{r.city}</span>
                          <span className="ml-2 text-xs text-muted/70">{r.offset}</span>
                        </td>
                        <td className="px-3 py-2 mono text-ink whitespace-nowrap">{r.full}</td>
                        <td className="px-3 py-2 text-xs text-muted text-right">{r.weekday}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="date-input">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} /> {t.converter.pickDate}
                </span>
              </label>
              <input
                id="date-input"
                type="datetime-local"
                step={1}
                className="input"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="tz-select">{t.converter.pickTz}</label>
              <select
                id="tz-select"
                className="input"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
              >
                {TIMEZONES.map((z) => (
                  <option key={z.timezone} value={z.timezone}>
                    {z.timezone} — {lang === 'zh' ? z.cityZh : z.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ResultBlock label={t.converter.secondsResult} icon={<Hash size={12} />}>
              {dateResult && dateResult.error === false ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="mono text-xl text-accent">{dateResult.seconds}</span>
                  <CopyButton value={String(dateResult.seconds)} label={t.common.copy} />
                </div>
              ) : <span className="text-muted">—</span>}
            </ResultBlock>
            <ResultBlock label={t.converter.msResult} icon={<Hash size={12} />}>
              {dateResult && dateResult.error === false ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="mono text-xl text-accent">{dateResult.milliseconds}</span>
                  <CopyButton value={String(dateResult.milliseconds)} label={t.common.copy} />
                </div>
              ) : <span className="text-muted">—</span>}
            </ResultBlock>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function EmptyHint() {
  const { t } = useI18n();
  return <div className="rounded border border-dashed border-border px-4 py-6 text-center text-sm text-muted">{t.converter.inputTsPlaceholder}</div>;
}

function ResultBlock({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded border border-border bg-surface-2/50 p-4">
      <div className="label mb-3">
        <span className="inline-flex items-center gap-1.5">{icon}{label}</span>
      </div>
      {children}
    </div>
  );
}
