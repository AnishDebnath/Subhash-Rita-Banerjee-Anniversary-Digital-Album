import React from 'react';
import { PhotographerCreditInfo } from '@/data/album.config';

interface PhotographerCreditProps {
  credit: PhotographerCreditInfo;
  isLeft: boolean;
  pageNumber?: number;
}

export const PhotographerCredit: React.FC<PhotographerCreditProps> = ({
  credit,
  isLeft,
}) => {
  return (
    <div 
      className="relative w-full h-full bg-[#101114] text-[#ede8de] overflow-hidden select-none flex flex-col justify-between items-center text-center"
      style={{
        padding: 'clamp(10px, 4.5cqmin, 36px)',
      }}
      data-density="soft"
    >
      {/* Background Matte Texture & Subtle Border */}
      <div 
        className="absolute border border-[#c5a059]/20 pointer-events-none" 
        style={{
          inset: 'clamp(6px, 3.5cqmin, 22px)',
        }}
      />
      <div className="absolute inset-0 paper-matte-texture pointer-events-none mix-blend-overlay opacity-60" />

      {/* Central Spine Shadow */}
      {isLeft ? (
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 spine-shadow-left pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 spine-shadow-right pointer-events-none z-10" />
      )}

      {/* Outer Page Edge Bevel */}
      {isLeft ? (
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-10" />
      )}

      {/* Top Studio Mark */}
      <div 
        className="relative z-10 text-center uppercase text-[#dfba73]/90 font-sans font-semibold"
        style={{
          fontSize: 'clamp(7.5px, 2.5cqmin, 11px)',
          letterSpacing: '0.24em',
        }}
      >
        Credits &amp; Acknowledgments
      </div>

      {/* Center Studio Information */}
      <div className="relative z-10 text-center max-w-md mx-auto my-auto px-2 w-full flex flex-col items-center">
        {/* Studio Monogram / Icon */}
        <div 
          className="mx-auto rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#0c0d10] shadow-inner shrink-0"
          style={{
            width: 'clamp(28px, 13cqmin, 60px)',
            height: 'clamp(28px, 13cqmin, 60px)',
            marginBottom: 'clamp(4px, 2.2cqmin, 14px)',
            padding: 'clamp(4px, 1.8cqmin, 8px)',
          }}
        >
          <svg 
            className="text-[#d4af37]" 
            style={{
              width: 'clamp(14px, 7cqmin, 28px)',
              height: 'clamp(14px, 7cqmin, 28px)',
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Studio Name */}
        <h3 
          className="font-sans-brand font-bold gold-foil-text uppercase text-center leading-tight px-1"
          style={{
            fontSize: 'clamp(12px, 5cqmin, 24px)',
            letterSpacing: '0.15em',
          }}
        >
          {credit.studioName}
        </h3>

        {/* Photographed by */}
        <p 
          className="font-sans font-medium text-[#dfba73]/90 text-center"
          style={{
            fontSize: 'clamp(8px, 2.9cqmin, 13px)',
            marginTop: 'clamp(2px, 0.8cqmin, 5px)',
            marginBottom: 'clamp(3px, 1.5cqmin, 8px)',
          }}
        >
          Photographed by {credit.photographerName}
        </p>

        {/* Quote */}
        {credit.quote && (
          <p 
            className="text-[#b8b0a2] font-sans font-normal leading-relaxed max-w-xs mx-auto line-clamp-2"
            style={{
              fontSize: 'clamp(7.5px, 2.5cqmin, 12px)',
              marginBottom: 'clamp(3px, 1.5cqmin, 10px)',
            }}
          >
            "{credit.quote}"
          </p>
        )}

        {/* Divider */}
        <div 
          className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto" 
          style={{
            width: 'clamp(24px, 14cqmin, 64px)',
            margin: 'clamp(2px, 1cqmin, 8px) auto',
          }}
        />

        {/* Metadata links */}
        <div 
          className="flex flex-col items-center text-[#a09888] font-sans font-medium"
          style={{
            fontSize: 'clamp(7px, 2.4cqmin, 11px)',
            gap: 'clamp(1px, 0.6cqmin, 4px)',
          }}
        >
          {credit.location && <span>{credit.location}</span>}
          {credit.websiteUrl && (
            <span className="text-[#dfba73] hover:underline cursor-pointer pointer-events-auto">
              {credit.websiteUrl.replace(/^https?:\/\//, '')}
            </span>
          )}
          {credit.socialHandle && (
            <span className="text-white/60">{credit.socialHandle}</span>
          )}
        </div>
      </div>

      {/* Bottom Studio Edition */}
      <div 
        className="relative z-10 text-white/35 font-sans font-medium uppercase text-center"
        style={{
          fontSize: 'clamp(7px, 2.2cqmin, 10px)',
          letterSpacing: '0.24em',
        }}
      >
        Fine Art Studio Edition
      </div>
    </div>
  );
};
