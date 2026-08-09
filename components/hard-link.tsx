'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

type HardLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function HardLink({ href, onClick, target, ...props }: HardLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank'
    ) {
      return;
    }

    event.preventDefault();
    window.location.assign(href);
  };

  return (
    <Link
      {...props}
      href={href}
      target={target}
      prefetch={false}
      onClick={handleClick}
    />
  );
}
