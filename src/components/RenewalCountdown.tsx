import React, { useEffect, useState } from 'react';
import { msUntilRenewal } from '@/utils/renewal';

const pad = (n: number) => String(n).padStart(2, '0');

interface RenewalCountdownProps {
  onExpire?: () => void;
}

export const RenewalCountdown: React.FC<RenewalCountdownProps> = ({ onExpire }) => {
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

  return (
    <div
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 pointer-events-none select-none rounded-full bg-white/90 border border-neutral-200/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-3 py-1.5 sm:px-4 sm:py-2 flex items-baseline gap-1.5 sm:gap-2 whitespace-nowrap"
      aria-label="Album renewal countdown"
    >
      <span
        className="text-neutral-500 font-sans font-semibold uppercase shrink-0"
        style={{ fontSize: 'clamp(6px, 1.8cqmin, 9px)', letterSpacing: '0.22em' }}
      >
        Renewal In
      </span>
      <span
        className="text-neutral-900 font-sans-brand font-bold tabular-nums"
        style={{ fontSize: 'clamp(11px, 3.2cqmin, 15px)', letterSpacing: '0.04em' }}
      >
        {days}<span className="text-[#b8860b]/80 text-[0.72em]">d</span>{' '}
        {pad(hours)}<span className="text-[#b8860b]/80 text-[0.72em]">h</span>{' '}
        {pad(minutes)}<span className="text-[#b8860b]/80 text-[0.72em]">m</span>{' '}
        {pad(seconds)}<span className="text-[#b8860b]/80 text-[0.72em]">s</span>
      </span>
    </div>
  );
};
