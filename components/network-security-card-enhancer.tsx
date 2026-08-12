'use client';

import { useEffect } from 'react';

type Config = {
  rootId: string;
  cardSelector: string;
  titleSelector: string;
};

const configs: Config[] = [
  {
    rootId: 'network-reference-cards',
    cardSelector: ':scope > .article-section',
    titleSelector: ':scope > h2',
  },
  {
    rootId: 'security-reference-cards',
    cardSelector: ':scope > .article-section',
    titleSelector: ':scope > h2',
  },
];

export function NetworkSecurityCardEnhancer() {
  useEffect(() => {
    const listeners = new WeakMap<HTMLElement, { click: (event: MouseEvent) => void; keydown: (event: KeyboardEvent) => void }>();

    const apply = () => {
      for (const config of configs) {
        const root = document.getElementById(config.rootId);
        if (!root) continue;

        const cards = Array.from(root.querySelectorAll<HTMLElement>(config.cardSelector));
        for (const card of cards) {
          if (listeners.has(card)) continue;

          card.classList.add('network-security-expandable-card');
          card.tabIndex = 0;
          card.setAttribute('role', 'button');
          card.setAttribute('aria-expanded', 'false');

          const title = card.querySelector<HTMLElement>(config.titleSelector);
          if (title) {
            title.classList.add('network-security-card-title');
            if (!title.querySelector('.network-security-card-hint')) {
              const hint = document.createElement('span');
              hint.className = 'network-security-card-hint';
              hint.textContent = '+';
              hint.setAttribute('aria-hidden', 'true');
              title.appendChild(hint);
            }
          }

          const setExpanded = (expanded: boolean) => {
            const currentRoot = document.getElementById(config.rootId);
            const currentCards = currentRoot
              ? Array.from(currentRoot.querySelectorAll<HTMLElement>(config.cardSelector))
              : [];

            for (const other of currentCards) {
              if (other === card) continue;
              other.classList.remove('is-expanded');
              other.setAttribute('aria-expanded', 'false');
              const otherHint = other.querySelector<HTMLElement>('.network-security-card-hint');
              if (otherHint) otherHint.textContent = '+';
            }

            card.classList.toggle('is-expanded', expanded);
            card.setAttribute('aria-expanded', String(expanded));
            const hint = card.querySelector<HTMLElement>('.network-security-card-hint');
            if (hint) hint.textContent = expanded ? '−' : '+';
          };

          const onClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest('a, button, pre, code, table')) return;
            const next = !card.classList.contains('is-expanded');
            setExpanded(next);
            if (next) requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          };

          const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            setExpanded(!card.classList.contains('is-expanded'));
          };

          card.addEventListener('click', onClick);
          card.addEventListener('keydown', onKeyDown);
          listeners.set(card, { click: onClick, keydown: onKeyDown });
        }
      }
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      for (const config of configs) {
        const root = document.getElementById(config.rootId);
        if (!root) continue;
        const cards = Array.from(root.querySelectorAll<HTMLElement>(config.cardSelector));
        for (const card of cards) {
          const listener = listeners.get(card);
          if (!listener) continue;
          card.removeEventListener('click', listener.click);
          card.removeEventListener('keydown', listener.keydown);
        }
      }
    };
  }, []);

  return null;
}
