'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex size-full items-center justify-center bg-zinc-100 text-sm text-zinc-400',
          className,
        )}
      >
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className={cn('object-cover transition-transform duration-300', className)}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
