import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react';
import { useI18n } from '@/i18n';
import { siteConfig } from '@/config/site';

export default function Privacy() {
  const { t } = useI18n();

  // 把 i18n 中的占位邮箱/仓库替换为 config 中的真实值
  const resolveLink = (url: string) => {
    if (url === 'mailto:contact@example.com') return `mailto:${siteConfig.contactEmail}`;
    if (url === 'https://github.com' || url.startsWith('https://github.com/')) return siteConfig.githubUrl;
    return url;
  };

  return (
    <div className="container max-w-4xl py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors">
        <ArrowLeft size={14} />
        {t.about.backHome}
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl animate-fade-up">
        {t.privacy.title}
      </h1>
      <p className="mt-2 text-sm text-muted animate-fade-up" style={{ animationDelay: '40ms' }}>
        {t.privacy.updated}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted animate-fade-up" style={{ animationDelay: '80ms' }}>
        {t.privacy.intro}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[200px_1fr]">
        {/* 目录 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="label">{t.privacy.toc}</div>
            <nav className="space-y-1.5">
              {t.privacy.sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="block text-xs text-muted hover:text-accent transition-colors leading-relaxed"
                >
                  {s.h}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* 正文 */}
        <article className="space-y-8">
          {t.privacy.sections.map((s, i) => (
            <section
              key={i}
              id={`section-${i}`}
              className="scroll-mt-24 animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
            >
              <h2 className="text-lg font-semibold text-ink">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.p}</p>

              {/* 外部链接列表 */}
              {s.links && s.links.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {s.links.map((l, idx) => {
                    const resolved = resolveLink(l.url);
                    const isMail = resolved.startsWith('mailto:');
                    return (
                      <li key={idx}>
                        <a
                          href={resolved}
                          target={isMail ? undefined : '_blank'}
                          rel={isMail ? undefined : 'noreferrer'}
                          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                        >
                          {isMail ? <Mail size={12} /> : <ExternalLink size={12} />}
                          {isMail ? siteConfig.contactEmail : l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* 补充说明（如同意条款） */}
              {s.extra && (
                <p className="mt-3 rounded border border-border bg-surface-2/50 px-3 py-2 text-xs leading-relaxed text-muted">
                  {s.extra}
                </p>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
