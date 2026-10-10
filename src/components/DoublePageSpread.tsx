import React from 'react';
import { AlbumItemConfig } from '@/data/album.config';
import { assets } from '@/assets';

interface DoublePageSpreadLeafProps {
  item: AlbumItemConfig;
  isLeft: boolean;
  pageNumber?: number;
}

export const DoublePageSpreadLeaf: React.FC<DoublePageSpreadLeafProps> = ({
  item,
  isLeft,
  pageNumber,
}) => {
  const imageSrc = item.src || item.fallbackSrc || assets.page02;

  return (
    <div 
      className="relative w-full h-full bg-[#0d0e11] overflow-hidden select-none"
      data-density="soft"
    >
      {/* 
        Continuous panoramic image rendering:
        The full 3:1 image spans 200% width of a single 3:2 page.
        Left leaf displays left 50% (translateX 0).
        Right leaf displays right 50% (translateX -50%).
        Overflow is hidden, ensuring pixel-perfect continuity across the central spine.
      */}
      <div 
        className="absolute top-0 bottom-0 overflow-hidden"
        style={{
          width: '200%',
          left: isLeft ? '0%' : '-100%',
          height: '100%',
        }}
      >
        <img
          src={imageSrc}
          onError={(e) => {
            if (item.fallbackSrc && e.currentTarget.src !== window.location.origin + item.fallbackSrc) {
              e.currentTarget.src = item.fallbackSrc;
            }
          }}
          alt={item.title || (pageNumber ? `Album spread ${pageNumber} — Subhash & Rita Banerjee Anniversary` : 'Album panoramic spread')}
          className="w-full h-full object-cover select-none pointer-events-none brightness-[0.98] contrast-[1.03]"
          decoding="async"
          draggable={false}
        />

        {/* Paper texture overlay for authentic photographic print look */}
        <div className="absolute inset-0 paper-matte-texture pointer-events-none mix-blend-overlay opacity-60" />
      </div>

      {/* Subtle Central Binding Seam & Natural Paper Curvature Shadow */}
      {isLeft ? (
        // Right edge of left page (meets the spine)
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 spine-shadow-left pointer-events-none z-10" />
      ) : (
        // Left edge of right page (meets the spine)
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 spine-shadow-right pointer-events-none z-10" />
      )}

      {/* Outer Page Edge Shading & Bevel */}
      {isLeft ? (
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-black/25 to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
};
