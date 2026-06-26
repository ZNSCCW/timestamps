import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';

export interface ToolOption {
  key: string;
  label: string;
  desc: string;
  icon: ReactNode;
}

interface ToolSwitcherProps {
  options: ToolOption[];
  value: string;
  onChange: (key: string) => void;
}

interface PanelPos {
  top: number;
  left: number;
  width: number;
}

export function ToolSwitcher({ options, value, onChange }: ToolSwitcherProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  const current = options.find((o) => o.key === value) ?? options[0];

  const updatePos = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left, width: r.width });
  };

  // 打开时同步计算位置
  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open]);

  // 监听滚动/resize 更新位置；点击外部/ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onResize = () => updatePos();
    const onScroll = () => updatePos();
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="relative">
      <label className="label" htmlFor="tool-select">{t.switcher.label}</label>

      {/* 触发按钮 */}
      <button
        ref={btnRef}
        id="tool-select"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'group flex w-full items-center gap-3 rounded border bg-surface-2 px-4 py-3 text-left transition-all',
          open ? 'border-accent/70 ring-2 ring-accent/15' : 'border-border hover:border-accent/40',
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-surface text-accent">
          {current.icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-ink truncate">{current.label}</span>
          <span className="block text-xs text-muted truncate">{current.desc}</span>
        </span>
        <ChevronDown
          size={18}
          className={cn('shrink-0 text-muted transition-transform', open && 'rotate-180 text-accent')}
        />
      </button>

      {/* 下拉面板通过 Portal 渲染到 body，避免被父容器层叠上下文遮挡 */}
      {open && pos && createPortal(
        <ul
          ref={panelRef}
          role="listbox"
          className="fixed z-[100] overflow-hidden rounded border border-border bg-surface shadow-panel animate-fade-up"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map((opt) => {
            const active = opt.key === value;
            return (
              <li key={opt.key} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.key); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    active ? 'bg-accent/10' : 'hover:bg-surface-2',
                  )}
                >
                  <span className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded border',
                    active ? 'border-accent/50 bg-accent/10 text-accent' : 'border-border bg-surface-2 text-muted',
                  )}>
                    {opt.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={cn('block text-sm font-medium truncate', active ? 'text-accent' : 'text-ink')}>
                      {opt.label}
                    </span>
                    <span className="block text-xs text-muted truncate">{opt.desc}</span>
                  </span>
                  {active && <Check size={16} className="shrink-0 text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
}
