import React from 'react';
import { AlbumConfig } from '@/data/album.config';
import { assets } from '@/assets';

interface BackCoverProps {
  config: AlbumConfig;
  onRestart?: () => void;
  loadImage?: boolean;
}

export const BackCover: React.FC<BackCoverProps> = ({ config, loadImage = true }) => {
  const backItem = config.items.find(i => i.type === 'cover-back');
  const coverImage = backItem?.src || backItem?.fallbackSrc || assets.backCover;

  return (
    <div 
      className="relative w-full h-full text-[#ede8de] overflow-hidden select-none cursor-pointer group"
      data-density="hard"
    >
      {/* 1. Underlying Front Cover Board (Base board layer extending beneath the paper block) */}
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#14151a] rounded-bl-sm z-0">
        <div className="absolute left-0 bottom-0 w-3 h-3 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-sm pointer-events-none" />
      </div>

      {/* 
        2. Continuous Physical Page Block (Archival Paper Pages Stack)
        Shows a little bit of the side part (fore-edge on left), the bottom part, and CONTINUES around the corner seamlessly!
      */}
      <div className="absolute left-0.5 right-6 sm:right-7 top-2 bottom-0.5 z-10 overflow-hidden rounded-bl-xs pointer-events-none bg-[#f6f3eb] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]">
        {/* Continuous horizontal page striations across the bottom and corner */}
        <div className="absolute inset-0 opacity-75 bg-[repeating-linear-gradient(to_bottom,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />

        {/* Vertical page striations on the left fore-edge side blending into the corner */}
        <div className="absolute top-0 left-0 bottom-0 w-3 opacity-60 bg-[repeating-linear-gradient(to_left,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />

        {/* Binding depth shadow near the spine on right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/45 via-black/15 to-transparent" />

        {/* Soft natural edge shading around the left-bottom corner */}
        <div className="absolute left-0 bottom-0 w-4 h-4 bg-gradient-to-tr from-black/20 to-transparent" />
      </div>

      {/* 
        3. Main Back Hardcover Board
        Pure, clean, unfiltered image with no text, no darkening overlays, and no filters!
      */}
      <div className="absolute left-2 sm:left-2.5 right-0 top-0 bottom-2.5 sm:bottom-3 z-20 overflow-hidden rounded-tl-xs rounded-bl-sm shadow-[-2px_4px_10px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4)]">
        {/* Outer Spine Wrap on Right (The rounded physical spine extending cleanly to the bottom) */}
        <div className="absolute right-0 top-0 bottom-0 w-5 sm:w-6 bg-gradient-to-l from-[#090a0d] via-[#1b1c22] to-[#0c0d10] z-40 pointer-events-none shadow-[inset_2px_0_4px_rgba(0,0,0,0.6)]">
          {/* Spine curvature highlight */}
          <div className="absolute right-1.5 top-0 bottom-0 w-1 bg-white/15 blur-[0.5px]" />
        </div>

        {/* Debossed Hinge Joint / French Groove on Right */}
        <div className="absolute right-5 sm:right-6 top-0 bottom-0 w-2 sm:w-2.5 z-40 pointer-events-none bg-gradient-to-l from-black/65 via-black/40 to-black/10 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.85),inset_1px_0_1px_rgba(255,255,255,0.1)]">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-black/90" />
        </div>

        {/* Raised Back Board Bevel Line adjacent to the groove */}
        <div className="absolute right-[27px] sm:right-[33px] top-0 bottom-0 w-0.5 z-40 pointer-events-none bg-white/15" />

        {/* Pure, Clean, Unfiltered Back Cover Image — No filters, no dark overlays, no text, 3:2 ratio */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {loadImage && (
          <img 
            src={coverImage}
            onError={(e) => {
              if (backItem?.fallbackSrc && e.currentTarget.src !== window.location.origin + backItem.fallbackSrc) {
                e.currentTarget.src = backItem.fallbackSrc;
              }
            }}
            alt="Back cover — Subhash & Rita Banerjee Anniversary Digital Album"
            className="w-full h-full object-cover"
            style={{ aspectRatio: '3 / 2' }}
            loading="lazy"
            decoding="async"
          />
          )}
        </div>
      </div>

      {/* Cast Shadow from back cover overhang down onto the continuous page block */}
      <div className="absolute left-2 sm:left-2.5 right-6 sm:right-7 bottom-2.5 sm:bottom-3 h-2 bg-gradient-to-b from-black/55 to-transparent z-25 pointer-events-none" />
      <div className="absolute left-2 sm:left-2.5 top-0 bottom-2.5 sm:bottom-3 w-2 bg-gradient-to-l from-black/45 to-transparent z-25 pointer-events-none" />
    </div>
  );
};
