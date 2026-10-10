import React from 'react';
import { AlbumConfig } from '@/data/album.config';
import { assets } from '@/assets';

interface CoverProps {
  config: AlbumConfig;
  onOpen?: () => void;
}

export const Cover: React.FC<CoverProps> = ({ config }) => {
  const frontCoverItem = config.items.find(i => i.type === 'cover');
  const coverImage = frontCoverItem?.src || frontCoverItem?.fallbackSrc || assets.frontCover;

  return (
    <div 
      className="relative w-full h-full text-[#ede8de] overflow-hidden select-none cursor-pointer group"
      data-density="hard"
    >
      {/* 1. Underlying Back Cover Board (Base board layer extending beneath the paper block) */}
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#14151a] rounded-br-sm z-0">
        <div className="absolute right-0 bottom-0 w-3 h-3 bg-gradient-to-br from-white/10 to-transparent rounded-br-sm pointer-events-none" />
      </div>

      {/* 
        2. Continuous Physical Page Block (Archival Paper Pages Stack)
        Shows a little bit of the side part (fore-edge), the bottom part, and CONTINUES around the corner seamlessly!
      */}
      <div className="absolute left-6 sm:left-7 right-0.5 top-2 bottom-0.5 z-10 overflow-hidden rounded-br-xs pointer-events-none bg-[#f6f3eb] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]">
        {/* Continuous horizontal page striations across the bottom and corner */}
        <div className="absolute inset-0 opacity-75 bg-[repeating-linear-gradient(to_bottom,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />

        {/* Vertical page striations on the right fore-edge blending into the corner */}
        <div className="absolute top-0 right-0 bottom-0 w-3 opacity-60 bg-[repeating-linear-gradient(to_right,#ffffff_0px,#ffffff_1px,#eee9df_2px,#ded8cc_3px)]" />

        {/* Binding depth shadow near the spine */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

        {/* Soft natural edge shading around the corner */}
        <div className="absolute right-0 bottom-0 w-4 h-4 bg-gradient-to-tl from-black/20 to-transparent" />
      </div>

      {/* 
        3. Main Front Hardcover Board
        Pure, clean, unfiltered image with no text, no darkening overlays, and no filters!
      */}
      <div className="absolute left-0 right-2 sm:right-2.5 top-0 bottom-2.5 sm:bottom-3 z-20 overflow-hidden rounded-tr-xs rounded-br-sm shadow-[2px_4px_10px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4)]">
        {/* Outer Spine Wrap on Left (The rounded physical spine) */}
        <div className="absolute left-0 top-0 bottom-0 w-5 sm:w-6 bg-gradient-to-r from-[#090a0d] via-[#1b1c22] to-[#0c0d10] z-40 pointer-events-none shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6)]">
          {/* Subtle curved spine highlight sheen */}
          <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-white/15 blur-[0.5px]" />
        </div>

        {/* Debossed Hinge Joint / French Groove (The physical crease channel) */}
        <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-2 sm:w-2.5 z-40 pointer-events-none bg-gradient-to-r from-black/65 via-black/40 to-black/10 shadow-[inset_1px_0_2px_rgba(0,0,0,0.85),inset_-1px_0_1px_rgba(255,255,255,0.1)]">
          {/* Deep crease centerline */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-black/90" />
        </div>

        {/* Raised Front Board Bevel Line adjacent to the groove */}
        <div className="absolute left-[27px] sm:left-[33px] top-0 bottom-0 w-0.5 z-40 pointer-events-none bg-white/15" />

        {/* Pure, Clean, Unfiltered Cover Image — No filters, no dark overlays, no text, 3:2 ratio */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img 
            src={coverImage}
            onError={(e) => {
              if (frontCoverItem?.fallbackSrc && e.currentTarget.src !== window.location.origin + frontCoverItem.fallbackSrc) {
                e.currentTarget.src = frontCoverItem.fallbackSrc;
              }
            }}
            alt="Front cover — Subhash & Rita Banerjee Anniversary Digital Album"
            className="w-full h-full object-cover"
            style={{ aspectRatio: '3 / 2' }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      {/* Cast Shadow from front cover overhang down onto the continuous page block */}
      <div className="absolute left-6 sm:left-7 right-2 sm:right-2.5 bottom-2.5 sm:bottom-3 h-2 bg-gradient-to-b from-black/55 to-transparent z-25 pointer-events-none" />
      <div className="absolute right-2 sm:right-2.5 top-0 bottom-2.5 sm:bottom-3 w-2 bg-gradient-to-r from-black/45 to-transparent z-25 pointer-events-none" />
    </div>
  );
};
