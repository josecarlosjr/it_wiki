'use client';

import { useEffect } from 'react';

export function KubernetesCardEnhancer() {
  useEffect(() => {
    const root = document.getElementById('kubernetes-deep-dive');
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.reference-card'));
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      card.classList.add('k8s-topic-card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');

      const title = card.querySelector('h3');
      if (title && !title.querySelector('.k8s-topic-card-hint')) {
        const hint = document.createElement('span');
        hint.className = 'k8s-topic-card-hint';
        hint.textContent = '+';
        hint.setAttribute('aria-hidden', 'true');
        title.appendChild(hint);
      }

      const setExpanded = (expanded: boolean) => {
        for (const other of cards) {
          if (other === card) continue;
          other.classList.remove('is-expanded');
          other.setAttribute('aria-expanded', 'false');
          const otherHint = other.querySelector<HTMLElement>('.k8s-topic-card-hint');
          if (otherHint) otherHint.textContent = '+';
        }
        card.classList.toggle('is-expanded', expanded);
        card.setAttribute('aria-expanded', String(expanded));
        const hint = card.querySelector<HTMLElement>('.k8s-topic-card-hint');
        if (hint) hint.textContent = expanded ? '−' : '+';
      };

      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button, pre, code')) return;
        setExpanded(!card.classList.contains('is-expanded'));
        if (card.classList.contains('is-expanded')) {
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

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
