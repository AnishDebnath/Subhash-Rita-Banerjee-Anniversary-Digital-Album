import React, { useState } from 'react';
import { RotateCw, Maximize2 } from 'lucide-react';

interface RotateScreenOverlayProps {
  isVisible: boolean;
}

export const RotateScreenOverlay: React.FC<RotateScreenOverlayProps> = ({ isVisible }) => {
  const [fullscreenError, setFullscreenError] = useState(false);

  if (!isVisible) return null;

  const handleRequestFullscreenLandscape = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      // Attempt orientation lock if available in browser
      if (window.screen.orientation && 'lock' in window.screen.orientation) {
        await (window.screen.orientation as any).lock('landscape');
      }
    } catch {
      setFullscreenError(true);
      setTimeout(() => setFullscreenError(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#f5f4ef] text-neutral-900 select-none overflow-hidden animate-in fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      {/* Subtle Studio Canvas Background with Soft Vignette */}
      <div className="absolute inset-0 bg-radial from-[#ffffff] via-[#f7f5f0] to-[#eae6dc] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a1e_0.35px,transparent_0.35px)] opacity-[0.035] bg-[size:20px_20px] pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">
        {/* Animated Device Rotation Graphic */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
          {/* Circular Track Ring with Glowing Gradient */}
          <div className="absolute inset-0 rounded-full border border-neutral-300/70 shadow-[0_4px_24px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-sm" />
          
          {/* Subtle curved rotation indicator arc */}
          <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] text-neutral-400/50 animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="16 120"
              strokeLinecap="round"
            />
          </svg>

          {/* Pivoting Smartphone Graphic - Phone structure with pure black screen */}
          <div className="relative w-16 h-28 sm:w-18 sm:h-30 border-2 border-neutral-800 rounded-xl bg-neutral-900/5 shadow-md flex flex-col items-center justify-between p-1.5 animate-device-rotate">
            {/* Phone Speaker Notch */}
            <div className="w-4 h-1 bg-neutral-700 rounded-full mt-0.5" />
            
            {/* Screen Part: Pure black screen, nothing showing on screen */}
            <div className="w-full flex-1 my-1 rounded-sm bg-black border border-neutral-900 shadow-inner" />

            {/* Phone Home Bar */}
            <div className="w-6 h-0.5 bg-neutral-600 rounded-full mb-0.5" />
          </div>

          {/* Floating Rotate Icon Badge */}
          <div className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <RotateCw className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Simple Clean Heading */}
        <h1 className="text-lg sm:text-xl font-bold font-sans-brand tracking-tight text-neutral-900 mb-1.5">
          Please Rotate Your Device
        </h1>

        {/* Simple One-Line Instruction */}
        <p className="text-xs sm:text-sm font-sans text-neutral-500">
          Turn your screen to landscape to view the album
        </p>

        {/* Action Button for mobile users */}
        <button
          onClick={handleRequestFullscreenLandscape}
          className="mt-5 py-2.5 px-6 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Rotate Screen</span>
        </button>

        {fullscreenError && (
          <p className="mt-3 text-[11px] text-amber-700">
            Please turn your device physically
          </p>
        )}
      </div>
    </div>
  );
};
