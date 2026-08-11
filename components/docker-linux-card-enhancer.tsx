'use client';

import { useEffect } from 'react';

type Config = {
  rootId: string;
  cardSelector: string;
  titleSelector: string;
};

const configs: Config[] = [
  {
    rootId: 'dockerfile-examples',
    cardSelector: '.code-example',
    titleSelector: ':scope > h3',
  },
  {
    rootId: 'linux-commands',
    cardSelector: '.command-group, .term-card',
    titleSelector: ':scope > h3, :scope > strong',
  },
  {
    rootId: 'automation-iac-reference',
    cardSelector: '.command-group',
    titleSelector: ':scope > h3',
  },
];

export function DockerLinuxCardEnhancer() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    for (const config of configs) {
      const root = document.getElementById(config.rootId);
      if (!root) continue;

      const cards = Array.from(root.querySelectorAll<HTMLElement>(config.cardSelector));

      for (const card of cards) {
        card.classList.add('docs-topic-card');
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');

        const title = card.querySelector<HTMLElement>(config.titleSelector);
        if (title) {
          title.classList.add('docs-topic-card-title');
          if (!title.querySelector('.docs-topic-card-hint')) {
            const hint = document.createElement('span');
            hint.className = 'docs-topic-card-hint';
            hint.textContent = '+';
            hint.setAttribute('aria-hidden', 'true');
            title.appendChild(hint);
          }
        }

        const setExpanded = (expanded: boolean) => {
          for (const other of cards) {
            if (other === card) continue;
            other.classList.remove('is-expanded');
            other.setAttribute('aria-expanded', 'false');
            const otherHint = other.querySelector<HTMLElement>('.docs-topic-card-hint');
            if (otherHint) otherHint.textContent = '+';
          }

          card.classList.toggle('is-expanded', expanded);
          card.setAttribute('aria-expanded', String(expanded));
          const hint = card.querySelector<HTMLElement>('.docs-topic-card-hint');
          if (hint) hint.textContent = expanded ? '−' : '+';
        };

        const onClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (target.closest('a, button, pre, code, table')) return;
          const next = !card.classList.contains('is-expanded');
          setExpanded(next);
          if (next) {
            requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          }
        };

        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          setExpanded(!card.classList.contains('is-expanded'));
        };

        card.addEventListener('click', onClick);
        card.addEventListener('keydown', onKeyDown);
        cleanups.push(() => {
          card.removeEventListener('click', onClick);
          card.removeEventListener('keydown', onKeyDown);
        });
      }
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
