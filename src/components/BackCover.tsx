import React from 'react';
import { AlbumConfig } from '@/data/album.config';
import { assets } from '@/assets';

interface BackCoverProps {
  config: AlbumConfig;
  onRestart?: () => void;
}

export const BackCover: React.FC<BackCoverProps> = ({ config }) => {
  const backItem = config.items.find(i => i.type === 'cover-back');
  const coverImage = backItem?.src || backItem?.fallbackSrc || assets.backCover;

  return (
    <div 
      className="relative w-full h-full text-[#ede8de] overflow-hidden select-none cursor-pointer group"
      data-density="hard"
    >
      {/* Layer 0 — Behind Part (Underlying Base Board) */}
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#2d0402] rounded-bl-sm z-0">
        <div className="absolute left-0 bottom-0 w-3 h-3 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-sm pointer-events-none" />
      </div>

      {/* Layer 1 — Archival Page Block (The White Paper Line) */}
      <div className="absolute left-0.5 right-6 sm:right-7 top-2 bottom-0.5 z-10 overflow-hidden rounded-bl-xs pointer-events-none bg-[#f6f3eb] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]">
        {/* Horizontal page striations */}
        <div className="absolute inset-0 opacity-75 bg-[repeating-linear-gradient(to_bottom,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />
        {/* Vertical fore-edge striations */}
        <div className="absolute top-0 left-0 bottom-0 w-3 opacity-60 bg-[repeating-linear-gradient(to_left,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />
      </div>

      {/* Layer 2 — Back Hardcover Board (Upper Part) */}
      <div className="absolute left-2 sm:left-2.5 right-0 top-0 bottom-2.5 sm:bottom-3 z-20 overflow-hidden rounded-tl-xs rounded-bl-sm shadow-[-2px_4px_10px_rgba(0,0,0,0.4)]">
        {/* Full-Bleed Centered Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={coverImage}
            onError={(e) => {
              if (backItem?.fallbackSrc && e.currentTarget.src !== window.location.origin + backItem.fallbackSrc) {
                e.currentTarget.src = backItem.fallbackSrc;
              }
            }}
            alt="Back cover — Subhash & Rita Banerjee Anniversary Digital Album"
            className="w-full h-full object-cover object-center"
            decoding="async"
          />
        </div>

        {/* Spine curvature shadow on right (width: 20-24px) */}
        <div className="absolute right-0 top-0 bottom-0 w-5 sm:w-6 bg-gradient-to-l from-black/50 via-black/20 to-transparent z-40 pointer-events-none shadow-[inset_1px_0_3px_rgba(0,0,0,0.5)]">
          <div className="absolute right-1.5 top-0 bottom-0 w-1 bg-white/20 blur-[0.5px]" />
        </div>

        {/* Debossed French groove crease on right */}
        <div className="absolute right-5 sm:right-6 top-0 bottom-0 w-2 sm:w-2.5 z-40 pointer-events-none bg-gradient-to-l from-black/35 via-black/15 to-transparent shadow-[inset_-1px_0_2px_rgba(0,0,0,0.7),inset_1px_0_1px_rgba(255,255,255,0.15)]">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-black/50" />
        </div>

        {/* Raised bevel highlight line */}
        <div className="absolute right-[27px] sm:right-[33px] top-0 bottom-0 w-0.5 z-40 pointer-events-none bg-white/20" />
      </div>
    </div>
  );
};
