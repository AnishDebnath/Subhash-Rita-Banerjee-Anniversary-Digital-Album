import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PageFlip } from 'page-flip';
import { AlbumConfig } from '@/data/album.config';
import { calculateAlbumSize, CalculatedAlbumSize } from '@/utils/responsive';
import { compileAlbumLeaves, CompiledLeaf } from '@/utils/albumCompiler';
import { Cover } from './Cover';
import { BackCover } from './BackCover';
import { SinglePage } from './SinglePage';
import { DoublePageSpreadLeaf } from './DoublePageSpread';
import { PhotographerCredit } from './PhotographerCredit';
import { Flyleaf } from './Flyleaf';
import { AlbumControls } from './AlbumControls';
import { ThumbnailStrip } from './ThumbnailStrip';
import { RotateScreenOverlay } from './RotateScreenOverlay';
import { pageSound } from '@/utils/audio';
import { backgroundMusic } from '@/utils/backgroundMusic';

interface AlbumViewerProps {
  config: AlbumConfig;
}

export const AlbumViewer: React.FC<AlbumViewerProps> = ({ config }) => {
  const templateRef = useRef<HTMLDivElement>(null);
  const bookMountRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  // Selected format size (Standard, Extended, Large)
  const [selectedSize, setSelectedSize] = useState<'standard' | 'extended' | 'large'>(config.defaultSize);

  // Current screen dimensions
  const [albumDimensions, setAlbumDimensions] = useState<CalculatedAlbumSize>(() =>
    calculateAlbumSize(
      typeof window !== 'undefined' ? window.innerWidth : 1200,
      typeof window !== 'undefined' ? window.innerHeight : 800,
      config.dimensions[config.defaultSize]
    )
  );

  // Resize activity tracking for instant lag-free positioning
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Page tracking state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const currentPageRef = useRef<number>(0);
  currentPageRef.current = currentPage;

  // Alignment state for physical centering:
  // 'cover': Closed front cover centered in viewport
  // 'open': Two-page interior spread centered in viewport
  // 'back-cover': Closed back cover centered in viewport
  const [alignment, setAlignment] = useState<'cover' | 'open' | 'back-cover'>('cover');

  // Autoplay slideshow
  const [isAutoplay, setIsAutoplay] = useState<boolean>(config.autoplay.enabled);
  const [autoplayInterval, setAutoplayInterval] = useState<number>(config.autoplay.defaultIntervalSeconds);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio and Fullscreen state
  const [isMuted, setIsMuted] = useState<boolean>(!config.soundEffects.enabled);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);

  // Compile leaves
  const leaves: CompiledLeaf[] = useMemo(() => compileAlbumLeaves(config), [config]);

  // Background music: play by default (falls back to first user gesture if autoplay blocked)
  useEffect(() => {
    backgroundMusic.start();
  }, []);

  // Set total pages
  useEffect(() => {
    setTotalPages(leaves.length);
  }, [leaves.length]);

  // Window resize & orientation change handler
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      setIsResizing(true);
      if (resizeTimer) clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        const newDims = calculateAlbumSize(
          window.innerWidth,
          window.innerHeight,
          config.dimensions[selectedSize]
        );
        setAlbumDimensions(newDims);
        setIsResizing(false);
      }, 100);
    };

    const handleOrientation = () => {
      setIsResizing(true);
      if (resizeTimer) clearTimeout(resizeTimer);

      // Brief delay for mobile browser viewport values to stabilize
      resizeTimer = setTimeout(() => {
        const newDims = calculateAlbumSize(
          window.innerWidth,
          window.innerHeight,
          config.dimensions[selectedSize]
        );
        setAlbumDimensions(newDims);
        setIsResizing(false);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, [config.dimensions, selectedSize]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Initialize PageFlip instance
  useEffect(() => {
    if (!bookMountRef.current || !templateRef.current) return;

    // Clean up any existing instance first
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.destroy();
      } catch {
        // ignore
      }
      pageFlipRef.current = null;
    }

    // In vertical / portrait orientation, do not mount PageFlip (rotate screen overlay is active)
    if (albumDimensions.isPortrait) {
      if (bookMountRef.current) {
        bookMountRef.current.innerHTML = '';
      }
      return;
    }

    // Clear mount container
    bookMountRef.current.innerHTML = '';

    // Create an isolated wrapper element for PageFlip to own
    const bookWrapper = document.createElement('div');
    bookWrapper.className = 'stf__parent';
    bookWrapper.style.width = '100%';
    bookWrapper.style.height = '100%';
    bookMountRef.current.appendChild(bookWrapper);

    // Clone templates into the wrapper
    const templatePages = templateRef.current.querySelectorAll('.album-page');
    templatePages.forEach((page) => {
      const clone = page.cloneNode(true) as HTMLElement;
      clone.style.width = `${albumDimensions.singlePageWidth}px`;
      clone.style.height = `${albumDimensions.singlePageHeight}px`;
      bookWrapper.appendChild(clone);
    });

    // Instantiate PageFlip with stretch mode to seamlessly fit our calculated proportions
    const pf = new PageFlip(bookWrapper, {
      width: albumDimensions.singlePageWidth,
      height: albumDimensions.singlePageHeight,
      size: 'stretch',
      minWidth: 40,
      maxWidth: 2400,
      minHeight: 30,
      maxHeight: 1800,
      maxShadowOpacity: 0.28, // Softened shadow opacity for graceful, realistic depth
      showCover: true,
      mobileScrollSupport: false,
      flippingTime: 850,
      usePortrait: false, // Keep landscape physical book spread
      startPage: currentPageRef.current,
      drawShadow: true,
      swipeDistance: 25,
      showPageCorners: true,
      clickEventForward: true,
      useMouseEvents: true,
    });

    pf.loadFromHTML(bookWrapper.querySelectorAll('.album-page'));

    pf.on('flip', (e: { data: number }) => {
      setCurrentPage(e.data);
      currentPageRef.current = e.data;
      const total = pf.getPageCount();
      if (e.data === 0) {
        setAlignment('cover');
      } else if (e.data >= total - 1) {
        setAlignment('back-cover');
      } else {
        setAlignment('open');
      }
      pageSound.playPageTurnSound();
    });

    pf.on('changeState', (e: { data: string }) => {
      const state = e.data;
      if (state === 'flipping') {
        const render = (pf as any).getRender?.();
        const dir = render ? render.getDirection() : 0;
        const cur = pf.getCurrentPageIndex();
        const total = pf.getPageCount();

        if (dir === 0) {
          // Turning forward
          if (cur === 0) {
            setAlignment('open');
          } else if (cur >= total - 3) {
            setAlignment('back-cover');
          } else {
            setAlignment('open');
          }
        } else if (dir === 1) {
          // Turning backward
          if (cur <= 2) {
            setAlignment('cover');
          } else if (cur >= total - 1) {
            setAlignment('open');
          } else {
            setAlignment('open');
          }
        }
      } else if (state === 'read') {
        const cur = pf.getCurrentPageIndex();
        currentPageRef.current = cur;
        const total = pf.getPageCount();
        if (cur === 0) {
          setAlignment('cover');
        } else if (cur >= total - 1) {
          setAlignment('back-cover');
        } else {
          setAlignment('open');
        }
      }
    });

    pf.on('init', () => {
      const cur = pf.getCurrentPageIndex();
      currentPageRef.current = cur;
      const total = pf.getPageCount();
      if (cur === 0) {
        setAlignment('cover');
      } else if (cur >= total - 1) {
        setAlignment('back-cover');
      } else {
        setAlignment('open');
      }
    });

    // Ensure immediate alignment sync
    const initialPage = currentPageRef.current;
    if (initialPage === 0) {
      setAlignment('cover');
    } else if (initialPage >= leaves.length - 1) {
      setAlignment('back-cover');
    } else {
      setAlignment('open');
    }

    pageFlipRef.current = pf;

    return () => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
      if (bookMountRef.current) {
        bookMountRef.current.innerHTML = '';
      }
    };
    // Re-initialize cleanly when dimensions update on resize/screen change, format changes, or leaves change
  }, [selectedSize, leaves, albumDimensions.openBookWidth, albumDimensions.openBookHeight, albumDimensions.isPortrait]);

  // Autoplay loop
  useEffect(() => {
    if (!isAutoplay) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      if (pageFlipRef.current) {
        const cur = pageFlipRef.current.getCurrentPageIndex();
        const total = pageFlipRef.current.getPageCount();

        // Stop automatically at back cover
        if (cur >= total - 1) {
          setIsAutoplay(false);
          return;
        }

        pageFlipRef.current.flipNext('top');
      }
    }, autoplayInterval * 1000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isAutoplay, autoplayInterval]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setIsAutoplay(false);
    if (pageFlipRef.current) {
      const cur = pageFlipRef.current.getCurrentPageIndex();
      if (cur <= 2) {
        setAlignment('cover');
      } else if (cur >= totalPages - 1) {
        setAlignment('open');
      }
      pageFlipRef.current.flipPrev('top');
    }
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setIsAutoplay(false);
    if (pageFlipRef.current) {
      const cur = pageFlipRef.current.getCurrentPageIndex();
      if (cur === 0) {
        setAlignment('open');
      } else if (cur >= totalPages - 3) {
        setAlignment('back-cover');
      }
      pageFlipRef.current.flipNext('top');
    }
  }, [totalPages]);

  const handleRestart = useCallback(() => {
    setIsAutoplay(false);
    if (pageFlipRef.current) {
      setAlignment('cover');
      pageFlipRef.current.flip(0);
    }
  }, []);

  const handleTurnToPage = useCallback((targetIndex: number) => {
    setIsAutoplay(false);
    if (pageFlipRef.current) {
      if (targetIndex === 0) {
        setAlignment('cover');
      } else if (targetIndex >= totalPages - 1) {
        setAlignment('back-cover');
      } else {
        setAlignment('open');
      }
      pageFlipRef.current.flip(targetIndex);
    }
  }, [totalPages]);

  const handleToggleAutoplay = useCallback(() => {
    setIsAutoplay(prev => !prev);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      pageSound.setMuted(next);
      backgroundMusic.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleRestart();
      } else if (e.key === 'End') {
        e.preventDefault();
        if (pageFlipRef.current) {
          setAlignment('back-cover');
          pageFlipRef.current.flip(totalPages - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleRestart, totalPages]);

  // Touch tap navigation: quick tap (<250ms, <10px move) flips page — left half = prev, right half = next.
  // page-flip lib needs 250ms hold for tap flip; fast taps never register there, so we handle them.
  // Release at >=250ms skips our handler and lets lib's own flip run (no double-flip).
  useEffect(() => {
    const el = bookMountRef.current;
    if (!el) return;

    let downX = 0;
    let downY = 0;
    let downTime = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      if ((e.target as HTMLElement | null)?.closest('a,button')) return;
      downX = e.clientX;
      downY = e.clientY;
      downTime = Date.now();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || downTime === 0) return;
      const duration = Date.now() - downTime;
      downTime = 0;
      if (duration >= 250) return;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 10) return;

      const pf = pageFlipRef.current;
      if (!pf || pf.getState() !== 'read') return;

      const cur = pf.getCurrentPageIndex();
      const total = pf.getPageCount();
      if (cur === 0) {
        handleNext();
        return;
      }
      if (cur >= total - 1) {
        handlePrev();
        return;
      }
      const rect = el.getBoundingClientRect();
      if (e.clientX < rect.left + rect.width / 2) {
        handlePrev();
      } else {
        handleNext();
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [handleNext, handlePrev]);

  // Spread label & title calculation
  const { currentSpreadLabel, currentSpreadTitle } = useMemo(() => {
    if (currentPage === 0) {
      return { currentSpreadLabel: 'Front Cover', currentSpreadTitle: '' };
    }
    if (currentPage >= totalPages - 1) {
      return { currentSpreadLabel: 'Back Cover', currentSpreadTitle: '' };
    }

    const leftLeaf = leaves[currentPage];
    const rightLeaf = leaves[currentPage + 1];
    const pad = (n: number) => String(n).padStart(2, '0');

    let pageLabel = '';
    let title = '';

    // If left is flyleaf (opening details) and right is content:
    if (leftLeaf?.itemType === 'flyleaf' && rightLeaf && rightLeaf.itemType !== 'flyleaf') {
      pageLabel = `Page ${pad(rightLeaf.pageNumber)}`;
      title = rightLeaf.originalItem?.title || rightLeaf.label || '';
    } else if (rightLeaf?.itemType === 'flyleaf' && leftLeaf && leftLeaf.itemType !== 'flyleaf') {
      // Closing endpaper on the right: show left page number only
      pageLabel = `Page ${pad(leftLeaf.pageNumber)}`;
      title = leftLeaf.originalItem?.title || leftLeaf.label || '';
    } else if (rightLeaf?.itemType === 'credit' && leftLeaf && leftLeaf.itemType !== 'credit') {
      // If right is credit (closing details) and left is content:
      pageLabel = `Page ${pad(leftLeaf.pageNumber)}`;
      title = leftLeaf.originalItem?.title || leftLeaf.label || '';
    } else if (leftLeaf && rightLeaf) {
      if (leftLeaf.pageNumber === rightLeaf.pageNumber) {
        pageLabel = `Page ${pad(leftLeaf.pageNumber)}`;
      } else {
        pageLabel = `Pages ${pad(leftLeaf.pageNumber)}–${pad(rightLeaf.pageNumber)}`;
      }
      title = leftLeaf.originalItem?.title || rightLeaf.originalItem?.title || leftLeaf.label || '';
    } else {
      pageLabel = `Page ${pad(leftLeaf?.pageNumber || rightLeaf?.pageNumber || currentPage)}`;
      title = leftLeaf?.originalItem?.title || '';
    }

    // Clean up title (remove trailing (Left) or (Right) from spread titles)
    title = title.replace(/\s*\((Left|Right)\)\s*$/i, '');

    return { currentSpreadLabel: pageLabel, currentSpreadTitle: title };
  }, [currentPage, totalPages, leaves]);

  // Thumbnail strip mapping
  const thumbnailMapping = useMemo(() => {
    return leaves.map(leaf => ({
      pageIndex: leaf.leafIndex,
      itemType: leaf.itemType,
      isLeft: leaf.isLeft,
      pageNumber: leaf.pageNumber,
      label: leaf.label,
      previewSrc: leaf.previewSrc,
      fallbackSrc: leaf.fallbackSrc || leaf.originalItem?.fallbackSrc,
    }));
  }, [leaves]);

  const isCover = currentPage === 0;
  const isBackCover = currentPage >= totalPages - 1;

  return (
    <div className="relative w-screen h-screen bg-[#f5f4ef] flex items-center justify-center overflow-hidden select-none">
      {/* Luminous Gallery Studio Canvas Lighting */}
      <div className="absolute inset-0 bg-radial from-[#fbfbfa] via-[#f5f4ef] to-[#edeae3] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#111215_0.35px,transparent_0.35px)] opacity-[0.025] bg-[size:20px_20px] pointer-events-none" />

      {/* Hidden React-managed Template Container */}
      <div ref={templateRef} style={{ display: 'none' }} aria-hidden="true">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="album-page"
            data-density={leaf.density}
            style={{
              width: `${albumDimensions.singlePageWidth}px`,
              height: `${albumDimensions.singlePageHeight}px`,
              backgroundColor: '#0c0d10',
            }}
          >
            {leaf.itemType === 'cover' && <Cover config={config} />}
            {leaf.itemType === 'cover-back' && <BackCover config={config} />}
            {leaf.itemType === 'flyleaf' && (
              <Flyleaf 
                config={config} 
                isLeft={leaf.isLeft}
                isClosing={leaf.label.includes('Closing')}
              />
            )}
            {leaf.itemType === 'single' && (
              <SinglePage 
                item={leaf.originalItem}
                isLeft={leaf.isLeft}
                pageNumber={leaf.pageNumber}
              />
            )}
            {(leaf.itemType === 'spread-left' || leaf.itemType === 'spread-right') && (
              <DoublePageSpreadLeaf 
                item={leaf.originalItem}
                isLeft={leaf.itemType === 'spread-left'}
                pageNumber={leaf.pageNumber}
              />
            )}
            {leaf.itemType === 'credit' && (
              <PhotographerCredit 
                credit={config.photographer}
                isLeft={leaf.isLeft}
                pageNumber={leaf.pageNumber}
              />
            )}
          </div>
        ))}
      </div>

      {/* Centering Book Stage Container: Positions closed front/back cover or open spread precisely at viewport center */}
      <div 
        className={`relative z-20 flex items-center justify-center ${
          isResizing ? 'transition-none' : 'transition-transform duration-[850ms] ease-[cubic-bezier(0.35,0,0.25,1)]'
        }`}
        style={{
          width: albumDimensions.openBookWidth,
          height: albumDimensions.openBookHeight,
          transform: `translateX(${
            alignment === 'cover'
              ? -albumDimensions.singlePageWidth / 2
              : alignment === 'back-cover'
              ? albumDimensions.singlePageWidth / 2
              : 0
          }px)`,
        }}
      >
        {/* Physical Book Shadow on Gallery Surface: Perfectly aligned and eased with book opening and closing */}
        
        {/* 1. Left Leaf Floor Shadow: Lands gracefully right as front cover descends onto desk, lifts immediately when closing */}
        <div 
          className="absolute left-0 top-0 pointer-events-none rounded-l-xs"
          style={{
            width: albumDimensions.singlePageWidth,
            height: albumDimensions.openBookHeight,
            boxShadow: '0 28px 65px -14px rgba(0,0,0,0.24), 0 12px 28px -8px rgba(0,0,0,0.13), 0 2px 6px -1px rgba(0,0,0,0.06)',
            opacity: alignment === 'cover' ? 0 : 1,
            transition: isResizing 
              ? 'none' 
              : alignment === 'open' 
              ? 'opacity 480ms cubic-bezier(0.3, 0, 0.2, 1) 360ms' 
              : 'opacity 320ms ease-out 0ms',
          }}
        />

        {/* 2. Right Leaf Floor Shadow: Lands gracefully right as back cover descends onto desk, lifts immediately when closing */}
        <div 
          className="absolute right-0 top-0 pointer-events-none rounded-r-xs"
          style={{
            width: albumDimensions.singlePageWidth,
            height: albumDimensions.openBookHeight,
            boxShadow: '0 28px 65px -14px rgba(0,0,0,0.24), 0 12px 28px -8px rgba(0,0,0,0.13), 0 2px 6px -1px rgba(0,0,0,0.06)',
            opacity: alignment === 'back-cover' ? 0 : 1,
            transition: isResizing 
              ? 'none' 
              : alignment === 'open' 
              ? 'opacity 480ms cubic-bezier(0.3, 0, 0.2, 1) 360ms' 
              : 'opacity 320ms ease-out 0ms',
          }}
        />

        {/* 3. Ambient Continuous Spread Shadow: Merged depth across the spine when spread is fully open */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            boxShadow: '0 36px 85px -18px rgba(0,0,0,0.20), 0 16px 36px -10px rgba(0,0,0,0.10)',
            opacity: alignment === 'open' ? 1 : 0,
            transition: isResizing 
              ? 'none' 
              : alignment === 'open'
              ? 'opacity 500ms cubic-bezier(0.3, 0, 0.2, 1) 360ms'
              : 'opacity 300ms ease-out 0ms',
          }}
        />

        {/* Main Flipbook Mount Area */}
        <div 
          className="relative z-20 flex items-center justify-center"
          style={{
            width: albumDimensions.openBookWidth,
            height: albumDimensions.openBookHeight,
          }}
        >
          <div 
            ref={bookMountRef}
            className="flip-book-container w-full h-full"
            style={{
              width: albumDimensions.openBookWidth,
              height: albumDimensions.openBookHeight,
            }}
          />
        </div>
      </div>

      {/* Minimal Floating Controls Dock */}
      <AlbumControls 
        currentPage={currentPage}
        totalPages={totalPages}
        isCover={isCover}
        isBackCover={isBackCover}
        currentSpreadLabel={currentSpreadLabel}
        currentSpreadTitle={currentSpreadTitle}
        isAutoplay={isAutoplay}
        autoplayInterval={autoplayInterval}
        intervalOptions={config.autoplay.intervalOptionsSeconds}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        selectedSize={selectedSize}
        isShortLandscape={albumDimensions.isShortLandscape}
        isMobile={albumDimensions.isMobile}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleAutoplay={handleToggleAutoplay}
        onChangeInterval={setAutoplayInterval}
        onRestart={handleRestart}
        onToggleMute={handleToggleMute}
        onToggleFullscreen={handleToggleFullscreen}
        onChangeSize={(size) => {
          setSelectedSize(size);
        }}
        onToggleThumbnails={() => setShowThumbnails(prev => !prev)}
        showThumbnails={showThumbnails}
      />

      {/* Vertical / Portrait Mode Rotate Screen Prompt Overlay */}
      <RotateScreenOverlay isVisible={albumDimensions.isPortrait} />

      {/* All Spreads Overview Modal */}
      <ThumbnailStrip 
        config={config}
        isOpen={showThumbnails}
        currentPage={currentPage}
        onClose={() => setShowThumbnails(false)}
        onSelectPage={handleTurnToPage}
        pageMapping={thumbnailMapping}
      />
    </div>
  );
};
