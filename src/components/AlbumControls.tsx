import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  LayoutGrid,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface AlbumControlsProps {
  currentPage: number;
  totalPages: number;
  isCover: boolean;
  isBackCover: boolean;
  currentSpreadLabel: string;
  currentSpreadTitle?: string;
  headerText?: string;
  isAutoplay: boolean;
  autoplayInterval: number;
  intervalOptions: number[];
  isMuted: boolean;
  isFullscreen: boolean;
  selectedSize: 'standard' | 'extended' | 'large';
  isShortLandscape?: boolean;
  isMobile?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoplay: () => void;
  onChangeInterval: (seconds: number) => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onChangeSize: (size: 'standard' | 'extended' | 'large') => void;
  onToggleThumbnails: () => void;
  showThumbnails: boolean;
}

export const AlbumControls: React.FC<AlbumControlsProps> = ({
  currentPage,
  totalPages,
  isCover,
  isBackCover,
  currentSpreadLabel,
  currentSpreadTitle = '',
  headerText = 'Subhash & Rita Banerjee · Anniversary Digital Album',
  isAutoplay,
  autoplayInterval,
  intervalOptions,
  isMuted,
  isFullscreen,
  selectedSize,
  isShortLandscape = false,
  isMobile = false,
  onPrev,
  onNext,
  onToggleAutoplay,
  onChangeInterval,
  onRestart,
  onToggleMute,
  onToggleFullscreen,
  onChangeSize,
  onToggleThumbnails,
  showThumbnails,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity fade timer: automatically hides controls after 4s of no interaction
  useEffect(() => {
    const resetTimer = () => {
      setIsVisible(true);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      // Do not auto-fade if user is actively hovering the bar or settings are open
      if (!isHovered && !showSettings && !showThumbnails && !showAbout) {
        fadeTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 4000);
      }
    };

    const handleMouseMove = () => {
      resetTimer();
    };

    const handleTouchStart = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    resetTimer();

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isHovered, showSettings, showThumbnails, showAbout]);

  // Keep visible whenever settings or modals are open
  useEffect(() => {
    if (showSettings || showThumbnails || showAbout || isHovered) {
      setIsVisible(true);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    }
  }, [showSettings, showThumbnails, showAbout, isHovered]);

  return (
    <>
      {/* 
        Top Header: Center text part shown; left side logo name part and right side menu part commented out
      */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 ${
          isShortLandscape 
            ? 'px-4 pt-4 pb-1 sm:pt-5' 
            : isMobile
            ? 'px-4 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1rem))] pb-2'
            : 'px-6 sm:px-10 pt-8 lg:pt-9 pb-2'
        } flex items-center justify-center pointer-events-none transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {/* Left side logo name part - commented out per user request */}
        {/* 
        <div className="flex items-center pointer-events-auto">
          <button 
            onClick={onRestart}
            className={`${isShortLandscape ? 'text-sm font-semibold' : 'text-base sm:text-lg font-bold'} font-sans-brand tracking-tight text-neutral-900 hover:text-black transition-colors`}
            title="Return to Cover"
          >
            Royal Vows®
          </button>
        </div>
        */}

        {/* Top Center Text Part */}
        <div className="flex items-center pointer-events-auto">
          <span className="text-xs sm:text-sm md:text-base font-sans font-medium uppercase tracking-[0.22em] text-[#5c5a54] select-none text-center">
            {headerText}
          </span>
        </div>

        {/* Right side menu part - commented out per user request */}
        {/* 
        <nav 
          aria-label="Chronicle Navigation"
          className={`flex items-center ${isShortLandscape ? 'gap-3 text-[11px]' : 'gap-4 sm:gap-6 text-xs'} pointer-events-auto font-sans font-medium text-neutral-700`}
        >
          <button
            onClick={onToggleThumbnails}
            className={`hover:text-black transition-colors ${showThumbnails ? 'text-black font-semibold' : ''}`}
          >
            Spreads
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="hover:text-black transition-colors"
          >
            About
          </button>

          <button
            onClick={onToggleAutoplay}
            className={`${isShortLandscape ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'} bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs`}
          >
            {isAutoplay ? 'Pause' : 'Slideshow'}
          </button>
        </nav>
        */}
      </header>

      {/* Floating Side Navigation Chevrons: Commented out per user request */}
      {/* 
      <button
        onClick={onPrev}
        disabled={isCover}
        aria-label="Previous Page"
        className={`fixed ${isShortLandscape ? 'left-2 p-2' : 'left-4 sm:left-8 p-2.5 sm:p-3.5'} top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-black border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-500 disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
        }`}
      >
        <ChevronLeft className={`${isShortLandscape ? 'w-4 h-4' : 'w-5 h-5 sm:w-5.5 sm:h-5.5'}`} />
      </button>

      <button
        onClick={onNext}
        disabled={isBackCover}
        aria-label="Next Page"
        className={`fixed ${isShortLandscape ? 'right-2 p-2' : 'right-4 sm:right-8 p-2.5 sm:p-3.5'} top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-black border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-500 disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        <ChevronRight className={`${isShortLandscape ? 'w-4 h-4' : 'w-5 h-5 sm:w-5.5 sm:h-5.5'}`} />
      </button>
      */}

      {/* Bottom Detection Zone: Wakes up controls when cursor approaches bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-24 z-40 pointer-events-auto"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* Bottom-Left Editorial Metadata Status */}
      <div 
        className={`fixed ${isShortLandscape ? 'bottom-2 left-4 text-[10px] hidden sm:flex' : 'bottom-6 left-6 sm:left-10 text-xs sm:text-sm'} z-40 pointer-events-auto flex items-center gap-2 font-sans transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <span className="font-semibold text-neutral-900 tracking-wide">
          {currentSpreadLabel}
        </span>
        {currentSpreadTitle && !isCover && !isBackCover && !currentSpreadLabel.startsWith('Page') && (
          <>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-neutral-500 font-medium truncate max-w-[220px]">
              {currentSpreadTitle}
            </span>
          </>
        )}
      </div>

      {/* Bottom-Right Minimal Interaction Guidance */}
      <div 
        className={`fixed bottom-6 right-6 sm:right-10 z-40 pointer-events-auto ${isShortLandscape ? 'hidden' : 'hidden md:flex'} items-center gap-2 text-[11px] font-sans text-neutral-400 tracking-wide transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <span>← / → Page</span>
        <span aria-hidden="true">·</span>
        <span>Space to Play</span>
        <span aria-hidden="true">·</span>
        <span>Home for Cover</span>
      </div>

      {/* Floating Bottom Navigation Pill Dock */}
      <div 
        className={`fixed ${isShortLandscape ? 'bottom-2 sm:bottom-3 scale-95' : 'bottom-5 sm:bottom-6'} left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-auto transition-all duration-700 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Settings Flyout Popover */}
        {showSettings && (
          <div className="mb-2 p-4 bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] text-xs flex flex-col gap-3.5 min-w-[300px] animate-in fade-in slide-in-from-bottom-2 duration-300 text-neutral-800">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-sans font-semibold text-neutral-900 text-xs">Pacing &amp; Format</span>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 transition-colors"
                aria-label="Close settings"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slideshow Interval */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-600 font-sans text-xs">Slideshow Pace</span>
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/50">
                {intervalOptions.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onChangeInterval(sec)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-all ${
                      autoplayInterval === sec 
                        ? 'bg-neutral-900 text-white shadow-xs' 
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Album Format: Commented out per user request */}
            {/* 
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-600 font-sans text-xs">Dimensions</span>
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/50">
                {(['standard', 'extended', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onChangeSize(sz)}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-all font-sans font-medium ${
                      selectedSize === sz
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {sz === 'standard' ? '12×18"' : sz === 'extended' ? '13×20"' : '14×20"'}
                  </button>
                ))}
              </div>
            </div>
            */}

            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-[10px] text-neutral-400 font-sans">
              <span>Fine Art Flush Mount Silk Edition</span>
            </div>
          </div>
        )}

        {/* Minimalist Pill Dock */}
        <nav 
          aria-label="Album Navigation Controls"
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xl rounded-full border border-neutral-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
        >
          {/* 1. Restart Button */}
          <button
            onClick={onRestart}
            title="Restart to Front Cover (Home)"
            aria-label="Restart Album"
            className="p-2 rounded-full text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 active:scale-95 transition-all group"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-90" />
          </button>

          {/* 2. Previous Page Button */}
          <button
            onClick={onPrev}
            disabled={isCover}
            title="Previous Page (Left Arrow)"
            aria-label="Previous Page"
            className="p-2 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:pointer-events-none active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* 3. Play / Pause Button */}
          <button
            onClick={onToggleAutoplay}
            title={isAutoplay ? "Pause Slideshow" : "Play Slideshow"}
            aria-label={isAutoplay ? "Pause Slideshow" : "Play Slideshow"}
            className={`p-2 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center ${
              isAutoplay 
                ? 'bg-neutral-900 text-white shadow-xs' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
            }`}
          >
            {isAutoplay ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </button>

          {/* 4. Next Page Button */}
          <button
            onClick={onNext}
            disabled={isBackCover}
            title="Next Page (Right Arrow)"
            aria-label="Next Page"
            className="p-2 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:pointer-events-none active:scale-95 transition-all"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Hairline Divider */}
          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Spreads Overview Grid */}
          <button
            onClick={onToggleThumbnails}
            title="Spreads Overview"
            aria-label="Toggle Spreads Overview"
            className={`p-2 rounded-full transition-all active:scale-95 ${
              showThumbnails 
                ? 'text-neutral-950 bg-neutral-100 font-semibold' 
                : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Sound Toggle: background music + page flip rustle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={`p-2 rounded-full transition-all active:scale-95 ${
              isMuted 
                ? 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100' 
                : 'text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Album Settings Popover Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Pacing & Dimensions"
            aria-label="Album Settings"
            className={`p-2 rounded-full transition-all active:scale-95 ${
              showSettings 
                ? 'text-neutral-950 bg-neutral-100' 
                : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Fullscreen Mode */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 active:scale-95 transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </nav>
      </div>

      {/* About & Chronicle Story Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#faf9f6] border border-neutral-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-neutral-900 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors"
              aria-label="Close About"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Anniversary Heirloom Edition
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-sans-brand tracking-tight text-neutral-950 mt-1">
                  Subhash &amp; Rita Banerjee
                </h2>
                <p className="text-sm font-sans text-neutral-600 mt-1">
                  Anniversary Digital Album
                </p>
              </div>

              <div className="h-px bg-neutral-200" />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Date</span>
                  <span className="font-medium text-neutral-800">—</span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Location</span>
                  <span className="font-medium text-neutral-800">—</span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Photography</span>
                  <span className="font-medium text-neutral-800">Royal Vows Fine Art Studios</span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Print Medium</span>
                  <span className="font-medium text-neutral-800">250gsm Archival Silk</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200/70 text-xs text-neutral-600 leading-relaxed">
                An heirloom-grade digital keepsake reproducing hand-bound flush mount spreads with 180° panoramic continuity, physical page turning acoustics, and tactile gold foil detailing.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-5 py-2 bg-neutral-900 text-white text-xs font-medium rounded-full hover:bg-neutral-800 transition active:scale-95"
                >
                  Return to Chronicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
