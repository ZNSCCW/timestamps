import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

type AdSlot = 'top-banner' | 'after-tool' | 'sidebar';

interface AdUnitProps {
  slot: AdSlot;
  /** AdSense 广告单元 ID（data-ad-slot）。部署后从 AdSense 后台获取 */
  adSlotId?: string;
  className?: string;
  /** 是否响应式（自动适配宽度） */
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSense 广告位组件。
 *
 * 行为：
 * - adsenseEnabled === false 或 publisherId 为空：渲染带占位标识的空容器，不影响布局
 * - 启用且配置完整：注入 <ins class="adsbygoogle"> 并推送 adsbygoogle 触发渲染
 *
 * AdSense 脚本本身放在 index.html 的 <head>，由全局加载一次。
 */
export function AdUnit({ slot, adSlotId, className, responsive = true }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!siteConfig.adsenseEnabled || !siteConfig.adsensePublisherId || !adSlotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 脚本未加载或被广告拦截器拦截，静默忽略
    }
  }, [adSlotId]);

  // 未启用 — 渲染占位容器（仅在开发环境可见，生产构建可隐藏）
  if (!siteConfig.adsenseEnabled || !siteConfig.adsensePublisherId || !adSlotId) {
    if (import.meta.env.PROD) return null;
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded border border-dashed border-border bg-surface-2/40 text-xs text-muted/60',
          slotLayoutClass(slot),
          className,
        )}
        aria-hidden
      >
        Ad slot · {slot}
      </div>
    );
  }

  // 启用 — 注入 AdSense ins 标签
  return (
    <div className={cn('overflow-hidden', className)}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={siteConfig.adsensePublisherId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

function slotLayoutClass(slot: AdSlot): string {
  switch (slot) {
    case 'top-banner':
      return 'min-h-[90px] w-full';
    case 'after-tool':
      return 'min-h-[250px] w-full';
    case 'sidebar':
      return 'min-h-[600px] w-full';
    default:
      return 'min-h-[120px] w-full';
  }
}
