import { AlbumDimensions } from '@/data/album.config';

export interface CalculatedAlbumSize {
  singlePageWidth: number;
  singlePageHeight: number;
  openBookWidth: number;
  openBookHeight: number;
  scale: number;
  isMobile: boolean;
  isPortrait: boolean;
  isShortLandscape: boolean;
}

export function calculateAlbumSize(
  windowWidth: number,
  windowHeight: number,
  dimensions: AlbumDimensions
): CalculatedAlbumSize {
  const isPortrait = windowHeight > windowWidth;
  const isShortLandscape = !isPortrait && windowHeight < 540;
  const isMobile = isShortLandscape || windowWidth < 768;

  // Adaptive reserved padding for controls, header, and margins:
  // Mobile landscape: tightly tuned so book gets maximum screen area without colliding with controls
  const paddingX = isShortLandscape ? 24 : isMobile ? 36 : windowWidth < 1200 ? 56 : 80;
  const paddingY = isShortLandscape 
    ? (windowHeight < 420 ? 54 : 68) 
    : isMobile 
    ? 80 
    : windowHeight < 768 
    ? 96 
    : 120;

  const availW = Math.max(160, windowWidth - paddingX);
  const availH = Math.max(100, windowHeight - paddingY);

  const openAspectRatio = dimensions.openSpreadAspectRatio || 3.0; // 36 / 12 = 3.0 (3:1 open spread)
  const maxOpenWidth = 1800; // Cap on ultra-wide screens to maintain optimal density

  // Start with available width bounded by max width
  let targetOpenWidth = Math.min(availW, maxOpenWidth);
  let targetOpenHeight = Math.round(targetOpenWidth / openAspectRatio);

  // If height constraint is exceeded, bound by height and recalculate width
  if (targetOpenHeight > availH) {
    targetOpenHeight = availH;
    targetOpenWidth = Math.round(targetOpenHeight * openAspectRatio);
  }

  // Double check that width never exceeds available width
  if (targetOpenWidth > availW) {
    targetOpenWidth = availW;
    targetOpenHeight = Math.round(targetOpenWidth / openAspectRatio);
  }

  // Ensure single page width is integer and even
  let singlePageWidth = Math.floor(targetOpenWidth / 2);
  if (singlePageWidth % 2 !== 0) {
    singlePageWidth -= 1;
  }
  singlePageWidth = Math.max(60, singlePageWidth);
  const openBookWidth = singlePageWidth * 2;
  const singlePageHeight = Math.max(40, Math.round(openBookWidth / openAspectRatio));
  const openBookHeight = singlePageHeight;

  // Reference base width: 18" * 50 = 900px
  const baseSingleWidth = dimensions.closedWidthInches * 50;
  const scale = Number((singlePageWidth / baseSingleWidth).toFixed(3));

  return {
    singlePageWidth,
    singlePageHeight,
    openBookWidth,
    openBookHeight,
    scale,
    isMobile,
    isPortrait,
    isShortLandscape,
  };
}
