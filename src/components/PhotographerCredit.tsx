import React from 'react';
import tphLogo from '@/assets/tph.png';
import { PhotographerCreditInfo } from '@/data/album.config';

interface PhotographerCreditProps {
  credit: PhotographerCreditInfo;
  isLeft: boolean;
  pageNumber?: number;
  date?: string;
  location?: string;
}

export const PhotographerCredit: React.FC<PhotographerCreditProps> = ({
  credit,
  isLeft,
  date,
  location,
}) => {
  const logo = credit.logoSrc || tphLogo;
  // Wide landscape logos (Mindtrix Media wordmark) need a bigger, shorter box than square seals
  const isWideLogo = credit.studioName === 'Mindtrix Media';
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

      {/* Center Studio Information — whole block opens studio website on tap/click */}
      <div
        className="relative z-10 text-center max-w-md mx-auto my-auto px-2 w-full flex flex-col items-center cursor-pointer"
        onClick={() => {
          if (credit.websiteUrl) {
            window.open(credit.websiteUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        {/* Studio Monogram / Icon */}
        <img
          src={logo}
          alt={`${credit.studioName} logo`}
          className="mx-auto shrink-0"
          style={{
            width: isWideLogo ? 'clamp(88px, 42cqmin, 200px)' : 'clamp(28px, 13cqmin, 60px)',
            height: isWideLogo ? 'clamp(30px, 14cqmin, 68px)' : 'clamp(28px, 13cqmin, 60px)',
            marginBottom: 'clamp(4px, 2.2cqmin, 14px)',
            objectFit: 'contain',
          }}
        />

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
        {credit.photographerName && (
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
        )}

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

        {/* Date, Location & Website */}
        <div
          className="flex flex-col items-center text-[#a09888] font-sans font-medium"
          style={{
            fontSize: 'clamp(7px, 2.4cqmin, 11px)',
            gap: 'clamp(1px, 0.6cqmin, 4px)',
          }}
        >
          {credit.showAlbumMeta !== false && date && <span>{date}</span>}
          {credit.showAlbumMeta !== false && (location || credit.location) && <span>{location || credit.location}</span>}
          {credit.websiteUrl && (
            <a
              href={credit.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#dfba73] hover:underline cursor-pointer pointer-events-auto font-semibold"
              style={{
                fontSize: 'clamp(9px, 3.1cqmin, 14px)',
                marginTop: 'clamp(2px, 1cqmin, 6px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {credit.websiteUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
          {credit.socialHandle && (
            <span className="text-white/60">{credit.socialHandle}</span>
          )}
        </div>
      </div>
    </div>
  );
};
