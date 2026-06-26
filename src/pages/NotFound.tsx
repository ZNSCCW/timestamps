import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mono text-7xl font-bold text-accent animate-fade-up sm:text-9xl">
        {t.notFound.title}
      </div>
      <p className="mt-4 text-base text-muted animate-fade-up" style={{ animationDelay: '60ms' }}>
        {t.notFound.desc}
      </p>
      <Link
        to="/"
        className="btn-accent mt-8 animate-fade-up"
        style={{ animationDelay: '120ms' }}
      >
        <Home size={16} />
        {t.notFound.back}
      </Link>
    </div>
  );
}
