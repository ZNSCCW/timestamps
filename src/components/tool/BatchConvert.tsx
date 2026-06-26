import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useI18n } from '@/i18n';
import { SectionCard } from '@/components/ui/SectionCard';
import { batchConvert } from '@/lib/time';

export function BatchConvert() {
  const { t, lang } = useI18n();
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');

  const results = submitted ? batchConvert(submitted, lang === 'zh' ? 'zh-CN' : 'en-US') : [];
  const okCount = results.filter((r) => r.ok).length;

  return (
    <SectionCard
      id="batch"
      title={t.batch.title}
      subtitle={t.batch.subtitle}
      icon={<Layers size={18} />}
      action={
        submitted ? (
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {okCount}/{results.length} {t.batch.count}
          </span>
        ) : null
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label" htmlFor="batch-input">{t.common.input}</label>
          <textarea
            id="batch-input"
            className="input min-h-[200px] resize-y font-mono text-xs leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.batch.placeholder}
            spellCheck={false}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setSubmitted(input)}
              className="btn-accent"
              disabled={!input.trim()}
            >
              {t.batch.convert}
            </button>
            <button
              type="button"
              onClick={() => { setInput(''); setSubmitted(''); }}
              className="btn-ghost"
            >
              {t.common.clear}
            </button>
          </div>
        </div>

        <div>
          <div className="label">{t.common.result}</div>
          {results.length === 0 ? (
            <div className="rounded border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
              {t.common.empty}
            </div>
          ) : (
            <div className="overflow-hidden rounded border border-border max-h-[260px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-surface-2 text-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">{t.batch.inputCol}</th>
                    <th className="px-3 py-2 text-left font-medium">{t.batch.unitCol}</th>
                    <th className="px-3 py-2 text-left font-medium">{t.batch.resultCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2 mono text-ink break-all">{r.input}</td>
                      <td className="px-3 py-2 text-muted">{r.ok ? (r.unit === 'seconds' ? 's' : 'ms') : '—'}</td>
                      <td className="px-3 py-2 mono text-accent break-all">{r.ok ? r.full : <span className="text-danger">{t.common.invalid}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
