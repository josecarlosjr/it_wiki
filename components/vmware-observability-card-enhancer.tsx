'use client';

import { useEffect } from 'react';

export function VmwareObservabilityCardEnhancer() {
  useEffect(() => {
    const apply = () => {
      if (!document.getElementById('vmware-observability-reference')) return;
      const heading = document.getElementById('topicos-heading');
      const section = heading?.closest('.article-section');
      const accordion = section?.querySelector<HTMLElement>('.interactive-accordion');
      if (accordion) accordion.classList.add('vmware-observability-topic-grid');
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
