import React from 'react';

export const RenewalOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#f5f4ef]/85 backdrop-blur-xl px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Album renewal needed"
    >
      <div className="bg-white/95 border border-neutral-200/90 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] px-6 sm:px-10 py-8 sm:py-10 max-w-md w-full text-center">
        <div
          className="text-neutral-500 font-sans font-semibold uppercase mb-2"
          style={{ fontSize: 'clamp(8px, 2.2cqmin, 11px)', letterSpacing: '0.24em' }}
        >
          Album Locked
        </div>
        <h2
          className="font-sans-brand font-bold text-neutral-900 uppercase leading-tight"
          style={{ fontSize: 'clamp(18px, 5cqmin, 28px)', letterSpacing: '0.1em' }}
        >
          Renewal Needed
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent my-4 mx-auto w-24" />
        <p className="text-neutral-600 font-sans text-sm sm:text-base leading-relaxed">
          This album's one-year viewing period has ended.
          Contact us to renew access and keep the memories alive.
        </p>
        <a
          href="https://wa.me/918910092451"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
        >
          Contact on WhatsApp
        </a>
        <p className="mt-3 text-neutral-400 text-xs font-sans">+91 89100 92451</p>
      </div>
    </div>
  );
};
