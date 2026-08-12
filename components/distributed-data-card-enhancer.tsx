'use client';

import { useEffect } from 'react';

type GroupConfig = {
  rootId: string;
  cardSelector: string;
  titleSelector: string;
};

const groups: GroupConfig[] = [
  {
    rootId: 'distributed-expandable-reference',
    cardSelector: ':scope > .distributed-section-card',
    titleSelector: ':scope > h2',
  },
  {
    rootId: 'kafka-reference',
    cardSelector: '.distributed-topic-card',
    titleSelector: ':scope > h3',
  },
  {
    rootId: 'redis-reference',
    cardSelector: '.distributed-topic-card',
    titleSelector: ':scope > h3',
  },
];

export function DistributedDataCardEnhancer() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    for (const group of groups) {
      const root = document.getElementById(group.rootId);
      if (!root) continue;

      const cards = Array.from(root.querySelectorAll<HTMLElement>(group.cardSelector));

      for (const card of cards) {
        card.classList.add('distributed-expandable-card');
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');

        const title = card.querySelector<HTMLElement>(group.titleSelector);
        if (title) {
          title.classList.add('distributed-card-title');
          if (!title.querySelector('.distributed-card-hint')) {
            const hint = document.createElement('span');
            hint.className = 'distributed-card-hint';
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
            const otherHint = other.querySelector<HTMLElement>('.distributed-card-hint');
            if (otherHint) otherHint.textContent = '+';
          }

          card.classList.toggle('is-expanded', expanded);
          card.setAttribute('aria-expanded', String(expanded));
          const hint = card.querySelector<HTMLElement>('.distributed-card-hint');
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
