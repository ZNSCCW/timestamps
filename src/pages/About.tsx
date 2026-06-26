import { Link } from 'react-router-dom';
import { ArrowLeft, Boxes, Github, Mail, ShieldCheck, Target } from 'lucide-react';
import { useI18n } from '@/i18n';
import { siteConfig } from '@/config/site';

export default function About() {
  const { t } = useI18n();

  return (
    <div className="container max-w-4xl py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors">
        <ArrowLeft size={14} />
        {t.about.backHome}
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl animate-fade-up">
        {t.about.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted animate-fade-up" style={{ animationDelay: '60ms' }}>
        {t.about.intro}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <article className="panel rounded p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-surface-2 text-accent">
            <Target size={18} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-ink">{t.about.mission}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.about.missionText}</p>
        </article>

        <article className="panel rounded p-6 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-surface-2 text-accent">
            <ShieldCheck size={18} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-ink">{t.about.openSource}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.about.openSourceText}</p>
        </article>
      </div>

      <section className="mt-10 panel rounded p-6 animate-fade-up" style={{ animationDelay: '220ms' }}>
        <div className="flex items-center gap-2">
          <Boxes size={16} className="text-accent" />
          <h2 className="text-lg font-semibold text-ink">{t.about.stack}</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {t.about.stackList.map((s) => (
            <span key={s} className="chip text-ink">{s}</span>
          ))}
        </div>
      </section>

      <section className="mt-6 panel rounded p-6 animate-fade-up" style={{ animationDelay: '280ms' }}>
        <h2 className="text-lg font-semibold text-ink">{t.privacy.sections[9].h}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="btn-outline min-h-[40px] text-xs"
          >
            <Mail size={14} />
            {siteConfig.contactEmail}
          </a>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline min-h-[40px] text-xs"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
