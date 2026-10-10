import React from 'react';
import { AlbumItemConfig } from '@/data/album.config';
import { assets } from '@/assets';

interface SinglePageProps {
  item: AlbumItemConfig;
  isLeft: boolean;
  pageNumber?: number;
}

export const SinglePage: React.FC<SinglePageProps> = ({
  item,
  isLeft,
  pageNumber,
}) => {
  const imageSrc = item.src || item.fallbackSrc || assets.page01;

  return (
    <div 
      className="relative w-full h-full bg-[#0d0e11] overflow-hidden select-none"
      data-density="soft"
    >
      {/* Full Bleed Edge-to-Edge Photograph in 3:2 ratio */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <img
          src={imageSrc}
          onError={(e) => {
            if (item.fallbackSrc && e.currentTarget.src !== window.location.origin + item.fallbackSrc) {
              e.currentTarget.src = item.fallbackSrc;
            }
          }}
          alt={item.title || (pageNumber ? `Album page ${pageNumber} — Subhash & Rita Banerjee Anniversary` : 'Album photograph')}
          className="w-full h-full object-cover select-none pointer-events-none brightness-[0.98] contrast-[1.02]"
          style={{ aspectRatio: '3 / 2' }}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>

      {/* Central Spine Curvature & Shadow */}
      {isLeft ? (
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 spine-shadow-left pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 spine-shadow-right pointer-events-none z-10" />
      )}

      {/* Outer Page Edge Bevel */}
      {isLeft ? (
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-black/25 to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
};
