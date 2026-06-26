import { useState } from 'react';
import {
  ArrowRightLeft,
  BookOpen,
  CalendarClock,
  Globe,
  Layers,
} from 'lucide-react';
import { Hero } from '@/components/tool/Hero';
import { LiveClock } from '@/components/tool/LiveClock';
import { Converter } from '@/components/tool/Converter';
import { TimezoneMatrix } from '@/components/tool/TimezoneMatrix';
import { RelativeCalc } from '@/components/tool/RelativeCalc';
import { BatchConvert } from '@/components/tool/BatchConvert';
import { KnowledgeCards } from '@/components/tool/KnowledgeCards';
import { ToolSwitcher, type ToolOption } from '@/components/tool/ToolSwitcher';
import { AdUnit } from '@/components/ads/AdUnit';
import { useI18n } from '@/i18n';

export default function Home() {
  const { t } = useI18n();
  const [active, setActive] = useState('converter');

  const options: ToolOption[] = [
    { key: 'converter', label: t.converter.tsToDate, desc: t.converter.result, icon: <ArrowRightLeft size={18} /> },
    { key: 'matrix', label: t.matrix.title, desc: t.matrix.subtitle, icon: <Globe size={18} /> },
    { key: 'relative', label: t.relative.title, desc: t.relative.subtitle, icon: <CalendarClock size={18} /> },
    { key: 'batch', label: t.batch.title, desc: t.batch.subtitle, icon: <Layers size={18} /> },
    { key: 'knowledge', label: t.knowledge.title, desc: t.knowledge.subtitle, icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="container py-6">
      <Hero />

      {/* 顶部横幅广告位 — AdSense 启用后自动渲染 */}
      <AdUnit slot="top-banner" adSlotId="" className="mb-6" />

      <div className="space-y-6">
        <LiveClock />

        {/* 工具切换器 */}
        <div className="animate-fade-up">
          <ToolSwitcher options={options} value={active} onChange={setActive} />
        </div>

        {/* 当前工具（用 key 触发切换淡入动效） */}
        <div key={active} className="animate-fade-up">
          {active === 'converter' && <Converter />}
          {active === 'matrix' && <TimezoneMatrix />}
          {active === 'relative' && <RelativeCalc />}
          {active === 'batch' && <BatchConvert />}
          {active === 'knowledge' && <KnowledgeCards />}
        </div>

        {/* 工具区下方广告位 */}
        <AdUnit slot="after-tool" adSlotId="" />
      </div>
    </div>
  );
}
