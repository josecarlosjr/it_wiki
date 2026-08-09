'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SiteLocale = 'pt' | 'en';

type LanguageContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
  t: (pt: string, en: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>('pt');

  useEffect(() => {
    const saved = window.localStorage.getItem('it-wiki-locale');
    const preferred = saved === 'en' || saved === 'pt'
      ? saved
      : navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt';
    setLocaleState(preferred);
    document.documentElement.lang = preferred === 'en' ? 'en' : 'pt-PT';
  }, []);

  const setLocale = (next: SiteLocale) => {
    setLocaleState(next);
    window.localStorage.setItem('it-wiki-locale', next);
    document.documentElement.lang = next === 'en' ? 'en' : 'pt-PT';
  };

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale,
    t: (pt, en) => locale === 'en' ? en : pt,
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
