'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './language-provider';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'it-wiki-theme';

export function ThemeSwitch() {
  const { t } = useLanguage();
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme = stored === 'dark' ? 'dark' : 'light';
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <div className="theme-switch" role="group" aria-label={t('Tema do site', 'Site theme')}>
      <button
        className={theme === 'light' ? 'active' : ''}
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        title={t('Tema claro', 'Light theme')}
      >
        {t('Claro', 'Light')}
      </button>
      <button
        className={theme === 'dark' ? 'active' : ''}
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        title={t('Tema escuro', 'Dark theme')}
      >
        {t('Escuro', 'Dark')}
      </button>
    </div>
  );
}
