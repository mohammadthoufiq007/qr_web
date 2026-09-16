'use client';

import { type HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @defaultValue 'normal'
   */
  variant?: 'rainbow' | 'normal';
  /**
   * @defaultValue true
   */
  changeLayout?: boolean;
  /**
   * Banner message
   */
  message?: React.ReactNode;
  /**
   * @defaultValue '3rem'
   */
  height?: string;
}

export function Banner({
  id,
  variant = 'normal',
  changeLayout = true,
  message,
  height = '3rem',
  ...props
}: BannerProps): React.ReactElement | null {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const globalKey = id ? `banner-${id}` : undefined;

  useEffect(() => {
    setMounted(true);
    if (globalKey) {
      setOpen(localStorage.getItem(globalKey) !== 'true');
    } else {
      setOpen(true);
    }
  }, [globalKey]);

  const onClick = useCallback(() => {
    setOpen(false);
    if (globalKey) localStorage.setItem(globalKey, 'true');
  }, [globalKey]);

  if (!mounted || !open) return null;

  return (
    <div
      id={id}
      {...props}
      style={{ height: open ? height : '0', overflow: 'hidden' }}
      className={cn(
        'relative flex flex-row items-center justify-center px-4 text-center text-sm font-medium transition-all duration-300 rounded-xl mb-6 shadow-sm border',
        variant === 'rainbow' ? 'bg-white' : 'bg-teal-50 border-teal-100 text-teal-800',
        props.className,
      )}
    >

      {variant === 'rainbow' ? <RainbowLayer /> : null}
      {message || props.children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={onClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

const RainbowLayer = () => {
  return (
    <>
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-teal-400 via-[#2D5F5D] to-teal-800 opacity-20 rounded-xl" />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-teal-400 via-[#2D5F5D] to-teal-800 opacity-10 rounded-xl blur-md" />
    </>
  );
};
