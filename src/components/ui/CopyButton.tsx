import { useState, useCallback, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
  children?: ReactNode;
}

export function CopyButton({ value, className, label, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // 降级方案
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label || 'copy'}
      className={cn(
        'btn-outline min-h-[36px] px-3 py-1.5 text-xs',
        copied && 'border-accent text-accent',
        className,
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {children ?? (copied ? '✓' : label || 'Copy')}
    </button>
  );
}
