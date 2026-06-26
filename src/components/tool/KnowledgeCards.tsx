import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n';
import { SectionCard } from '@/components/ui/SectionCard';
import { cn } from '@/lib/utils';

export function KnowledgeCards() {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>('whatIs');
  const [activeLang, setActiveLang] = useState(0);

  const items = [
    { key: 'whatIs', q: t.knowledge.whatIs.q, a: t.knowledge.whatIs.a },
    { key: 'y2038', q: t.knowledge.y2038.q, a: t.knowledge.y2038.a },
    { key: 'snippets', q: t.knowledge.snippets.q, isSnippets: true },
  ];

  return (
    <SectionCard
      id="knowledge"
      title={t.knowledge.title}
      subtitle={t.knowledge.subtitle}
      icon={<BookOpen size={18} />}
    >
      <div className="divide-y divide-border">
        {items.map((it) => {
          const isOpen = open === it.key;
          return (
            <div key={it.key}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : it.key)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-ink">{it.q}</span>
                <ChevronDown
                  size={16}
                  className={cn('shrink-0 text-muted transition-transform', isOpen && 'rotate-180 text-accent')}
                />
              </button>
              {isOpen && (
                <div className="pb-4 pr-8 animate-fade-up">
                  {it.isSnippets ? (
                    <div>
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {t.knowledge.snippets.list.map((s, i) => (
                          <button
                            key={s.lang}
                            type="button"
                            onClick={() => setActiveLang(i)}
                            className={cn(
                              'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                              activeLang === i
                                ? 'bg-accent text-bg'
                                : 'border border-border text-muted hover:text-ink',
                            )}
                          >
                            {s.lang}
                          </button>
                        ))}
                      </div>
                      <pre className="overflow-x-auto rounded border border-border bg-surface-2 p-4 mono text-xs text-ink">
                        <code>{t.knowledge.snippets.list[activeLang].code}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted">{it.a}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
