import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AlbumConfig, AlbumItemConfig } from '@/data/album.config';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import tphLogo from '@/assets/tph.png';
import mindtrixLogo from '@/assets/watermark.png';

export interface ThumbnailItem {
  pageIndex: number;
  itemType: 'cover' | 'single' | 'spread-left' | 'spread-right' | 'credit' | 'flyleaf' | 'cover-back';
  originalItem?: AlbumItemConfig;
  isLeft?: boolean;
  pageNumber?: number;
  label: string;
  previewSrc?: string;
  fallbackSrc?: string;
}

interface ThumbnailStripProps {
  config: AlbumConfig;
  isOpen: boolean;
  currentPage: number;
  onClose: () => void;
  onSelectPage: (pageIndex: number) => void;
  pageMapping: ThumbnailItem[];
}

export const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
  config,
  isOpen,
  currentPage,
  onClose,
  onSelectPage,
  pageMapping,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundary state
  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  // Smooth scroll left and right
  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  // Auto scroll active item into view when drawer opens
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      updateScrollButtons();
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          updateScrollButtons();
        }, 150);
      }
    }
  }, [isOpen, currentPage, updateScrollButtons]);

  if (!isOpen) return null;

  // ponytail: compute clean display label using actual studio / couple names for details pages
  const getCardDisplayName = (item: ThumbnailItem) => {
    if (item.itemType === 'cover') return 'Front Cover';
    if (item.itemType === 'cover-back') return 'Back Cover';
    if (item.itemType === 'credit') {
      return item.originalItem?.creditInfo?.studioName || item.label || 'Details Page';
    }
    if (item.itemType === 'flyleaf') {
      return item.originalItem?.title || item.label || 'Details Page';
    }
    // Content images: show ONLY page number!
    return `Page ${item.pageNumber}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      <div className="p-4 sm:p-6 bg-[#faf9f6]/98 border-t border-neutral-200/90 shadow-2xl relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-200/80 mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-neutral-950">
                Spread Overview
              </h3>
              <p className="text-[11px] text-neutral-500 tracking-wider">
                Select any page to navigate directly
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-950 transition-colors"
              aria-label="Close Overview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Single Row Horizontal Pages Carousel with Navigation Buttons on Both Sides */}
          <div className="relative flex items-center gap-2 sm:gap-3 w-full">
            {/* Left Navigation Button */}
            <button
              onClick={handleScrollLeft}
              disabled={!canScrollLeft}
              aria-label="Previous Pages"
              className="shrink-0 p-2.5 sm:p-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 hover:text-black border border-neutral-200/90 shadow-md transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none active:scale-95 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Horizontal Single Row Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={updateScrollButtons}
              className="flex flex-row flex-nowrap items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-2 px-1 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1"
            >
              {pageMapping.map((item, idx) => {
                const isContent = item.itemType === 'single' || item.itemType === 'spread-left' || item.itemType === 'spread-right';
                const isActive = Math.abs(currentPage - item.pageIndex) <= (item.itemType.startsWith('spread') ? 1 : 0);
                const displayName = getCardDisplayName(item);

                return (
                  <button
                    key={idx}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => {
                      onSelectPage(item.pageIndex);
                      onClose();
                    }}
                    className={`group shrink-0 flex-none w-44 sm:w-52 text-left rounded-xl overflow-hidden border transition-all duration-300 relative flex flex-col shadow-xs ${
                      isActive 
                        ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-md scale-[1.02] bg-neutral-50' 
                        : 'border-neutral-200/80 hover:border-neutral-800 bg-white hover:shadow-sm'
                    }`}
                  >
                    {/* Image Area in 3:2 Ratio strictly */}
                    <div className="w-full aspect-[3/2] bg-neutral-900 overflow-hidden relative">
                      {item.itemType === 'credit' ? (
                        /* Details Page (Photographer / Studio / Production Credit matching main pages) */
                        (() => {
                          const credit = item.originalItem?.creditInfo || config.photographer;
                          const isWideLogo = credit.studioName === 'Mindtrix Media';
                          const logo = credit.logoSrc || (isWideLogo ? mindtrixLogo : tphLogo);
                          return (
                            <div className="w-full h-full bg-[#101114] text-[#ede8de] flex flex-col items-center justify-center p-2 relative select-none">
                              <div className="absolute inset-1 sm:inset-1.5 border border-[#c5a059]/25 pointer-events-none" />
                              {logo && (
                                <img
                                  src={logo}
                                  alt={credit.studioName}
                                  className={`mx-auto object-contain mb-1 shrink-0 ${
                                    isWideLogo ? 'h-3.5 sm:h-4 w-auto max-w-[80%]' : 'w-5 h-5 sm:w-6 sm:h-6'
                                  }`}
                                />
                              )}
                              <span className="text-[7.5px] sm:text-[9px] font-sans-brand gold-foil-text font-bold tracking-[0.12em] uppercase text-center px-1 truncate max-w-full">
                                {credit.studioName}
                              </span>
                              {credit.quote && (
                                <span className="text-[6px] sm:text-[7.5px] font-sans text-[#dfba73]/85 tracking-wider mt-0.5 text-center px-1 truncate max-w-full">
                                  {credit.quote}
                                </span>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        /* Single Page or Front/Back Cover */
                        <div className="w-full h-full relative overflow-hidden bg-neutral-900">
                          {item.previewSrc ? (
                            <img
                              src={item.previewSrc}
                              alt={displayName}
                              className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                              style={{ aspectRatio: '3 / 2' }}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-neutral-400">
                              {displayName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Label: Shows ONLY page numbers for content images, names for covers & details pages */}
                    <div className="p-2 sm:p-2.5 bg-white flex items-center justify-center text-center border-t border-neutral-100">
                      <span className={`text-neutral-900 font-sans truncate text-xs ${isContent ? 'font-semibold' : 'font-medium'}`}>
                        {displayName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={handleScrollRight}
              disabled={!canScrollRight}
              aria-label="Next Pages"
              className="shrink-0 p-2.5 sm:p-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 hover:text-black border border-neutral-200/90 shadow-md transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none active:scale-95 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
