'use client';

import Link from 'next/link';
import { useLanguage } from './language-provider';
import { ThemeSwitch } from './theme-switch';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="shell">
      <header className="header">
        <Link className="brand" href="/">
          <span className="brand-mark">IT</span>
          <span>IT_WIKI</span>
        </Link>
        <div className="header-actions">
          <nav className="nav" aria-label={t('Navegação principal', 'Main navigation')}>
            <Link href="/wiki/">{t('Enciclopédia', 'Encyclopedia')}</Link>
            <Link href="/wiki/kubernetes/">Kubernetes</Link>
            <Link href="/wiki/redes/">{t('Redes', 'Networking')}</Link>
            <Link href="/entrevistas/">{t('Entrevistas', 'Interviews')}</Link>
          </nav>
          <ThemeSwitch />
          <div className="language-switch" role="group" aria-label={t('Idioma do site', 'Site language')}>
            <button className={locale === 'pt' ? 'active' : ''} type="button" onClick={() => setLocale('pt')} aria-pressed={locale === 'pt'}>PT</button>
            <button className={locale === 'en' ? 'active' : ''} type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'}>EN</button>
          </div>
        </div>
      </header>
      {children}
      <footer className="footer">{t('IT_WIKI · enciclopédia técnica aberta e visual', 'IT_WIKI · open and visual technical encyclopedia')}</footer>
    </div>
  );
}
