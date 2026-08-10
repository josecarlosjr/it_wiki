'use client';

import { useEffect } from 'react';
import { AwsReference } from './aws-reference';

export function AwsExpandableReference() {
  useEffect(() => {
    const root = document.getElementById('aws-expandable-reference');
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(':scope > section.article-section:not(#aws-practical-reference)')
    );
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      card.classList.add('aws-topic-card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');

      const title = card.querySelector(':scope > h2');
      if (title && !title.querySelector('.aws-topic-card-hint')) {
        const hint = document.createElement('span');
        hint.className = 'aws-topic-card-hint';
        hint.textContent = '+';
        hint.setAttribute('aria-hidden', 'true');
        title.appendChild(hint);
      }

      const setExpanded = (expanded: boolean) => {
        for (const other of cards) {
          if (other === card) continue;
          other.classList.remove('is-expanded');
          other.setAttribute('aria-expanded', 'false');
          const otherHint = other.querySelector<HTMLElement>('.aws-topic-card-hint');
          if (otherHint) otherHint.textContent = '+';
        }

        card.classList.toggle('is-expanded', expanded);
        card.setAttribute('aria-expanded', String(expanded));
        const hint = card.querySelector<HTMLElement>('.aws-topic-card-hint');
        if (hint) hint.textContent = expanded ? '−' : '+';
      };

      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button, pre, code, table')) return;
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

  return (
    <div id="aws-expandable-reference">
      <AwsReference />
    </div>
  );
}
