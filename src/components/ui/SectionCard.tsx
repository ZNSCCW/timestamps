import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({ title, subtitle, icon, id, className, children, action }: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn('panel panel-hover rounded p-5 sm:p-6 animate-fade-up scroll-mt-24', className)}
    >
      <header className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-surface-2 text-accent">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </section>
  );
}
