import { useI18n } from '@/i18n';

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-[0.04]" />
      <div className="relative flex flex-col items-center text-center">
        <span className="chip animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          {t.hero.badge}
        </span>
        <h1
          className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl animate-fade-up"
          style={{ animationDelay: '60ms' }}
        >
          {t.hero.title}
        </h1>
        <p
          className="mt-4 max-w-xl text-sm text-muted sm:text-base animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          {t.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
