import React, { useEffect, useState } from 'react';
import { msUntilRenewal } from '@/utils/renewal';

const pad = (n: number) => String(n).padStart(2, '0');

interface RenewalCountdownProps {
  onExpire?: () => void;
  className?: string;
}

export const RenewalCountdown: React.FC<RenewalCountdownProps> = ({ onExpire, className = '' }) => {
  const [remaining, setRemaining] = useState(() => msUntilRenewal());

  useEffect(() => {
    const id = setInterval(() => {
      const left = msUntilRenewal();
      setRemaining(left);
      if (left <= 0 && onExpire) {
        onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onExpire]);

  const clamped = Math.max(0, remaining);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);

  // ponytail: clean badge using standard Tailwind responsive units instead of detached fixed position
  return (
    <div
      className={`select-none rounded-full bg-white/90 border border-neutral-200/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 flex items-baseline gap-1 sm:gap-1.5 lg:gap-2 whitespace-nowrap ${className}`}
      aria-label="Album renewal countdown"
    >
      <span className="text-neutral-500 font-sans font-semibold uppercase shrink-0 text-[8px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.2em]">
        Renewal In
      </span>
      <span className="text-neutral-900 font-sans-brand font-bold tabular-nums text-[11px] sm:text-xs lg:text-sm tracking-[0.02em] sm:tracking-[0.04em]">
        {days}<span className="text-[#b8860b]/80 text-[0.72em]">d</span>{' '}
        {pad(hours)}<span className="text-[#b8860b]/80 text-[0.72em]">h</span>{' '}
        {pad(minutes)}<span className="text-[#b8860b]/80 text-[0.72em]">m</span>{' '}
        {pad(seconds)}<span className="text-[#b8860b]/80 text-[0.72em]">s</span>
      </span>
    </div>
  );
};
