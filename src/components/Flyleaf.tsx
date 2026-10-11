import React from 'react';
import { AlbumConfig, AlbumItemConfig } from '@/data/album.config';
import tphLogo from '@/assets/tph.png';

interface FlyleafProps {
  config: AlbumConfig;
  isLeft: boolean;
  isClosing?: boolean;
  originalItem?: AlbumItemConfig;
}

export const Flyleaf: React.FC<FlyleafProps> = ({ config, isLeft, originalItem }) => {
  const subtitle = originalItem?.subtitle || 'Fin';
  const caption = originalItem?.caption || 'Handcrafted Luxury Album';

  return (
    <div 
      className="relative w-full h-full bg-[#101114] text-[#ede8de] overflow-hidden select-none flex flex-col justify-between items-center text-center"
      style={{
        padding: 'clamp(10px, 4.5cqmin, 36px)',
      }}
      data-density="soft"
    >
      {/* Mulberry Silk / Archival Endpaper Texture & Inner Border */}
      <div 
        className="absolute border border-[#c5a059]/25 pointer-events-none" 
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

      {/* TPH Logo & Fine Art Lettering */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-sm px-2 w-full">
        {/* TPH Logo Seal */}
        <img
          src={tphLogo}
          alt="TPH Logo"
          className="mx-auto shrink-0"
          style={{
            width: 'clamp(40px, 18cqmin, 88px)',
            height: 'clamp(40px, 18cqmin, 88px)',
            marginBottom: 'clamp(4px, 2.5cqmin, 16px)',
            objectFit: 'contain',
          }}
        />

        {/* Couple Names */}
        <h2 
          className="font-sans-brand gold-foil-text uppercase font-bold text-center leading-tight px-1"
          style={{
            fontSize: 'clamp(11px, 4.8cqmin, 24px)',
            letterSpacing: '0.18em',
          }}
        >
          {config.coupleNames}
        </h2>

        {/* Subtitle */}
        <p 
          className="font-sans font-medium text-[#dfba73]/90 text-center"
          style={{
            fontSize: 'clamp(8px, 2.9cqmin, 13px)',
            letterSpacing: '0.12em',
            marginTop: 'clamp(2px, 1cqmin, 6px)',
            marginBottom: 'clamp(4px, 1.8cqmin, 10px)',
          }}
        >
          {subtitle}
        </p>

        {/* Divider */}
        <div 
          className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" 
          style={{
            width: 'clamp(24px, 16cqmin, 72px)',
            margin: 'clamp(2px, 1.2cqmin, 8px) auto',
          }}
        />

        {/* Date & Location / Caption */}
        <p 
          className="text-[#a09888] font-sans font-medium uppercase text-center"
          style={{
            fontSize: 'clamp(7.5px, 2.5cqmin, 11px)',
            letterSpacing: '0.2em',
          }}
        >
          {config.weddingDate}
        </p>
        <p 
          className="text-[#8c8475] font-sans font-medium uppercase text-center"
          style={{
            fontSize: 'clamp(7px, 2.3cqmin, 10px)',
            letterSpacing: '0.16em',
            marginTop: 'clamp(1px, 0.6cqmin, 4px)',
          }}
        >
          {config.weddingLocation}
        </p>

        {/* Divider */}
        <div 
          className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" 
          style={{
            width: 'clamp(24px, 16cqmin, 72px)',
            margin: 'clamp(4px, 2cqmin, 12px) auto',
          }}
        />

        {/* Caption */}
        <p 
          className="font-sans font-medium text-[#dfba73]/90 text-center"
          style={{
            fontSize: 'clamp(8px, 2.9cqmin, 13px)',
            letterSpacing: '0.12em',
            marginTop: 'clamp(2px, 1cqmin, 6px)',
            marginBottom: 'clamp(4px, 1.8cqmin, 10px)',
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
};
