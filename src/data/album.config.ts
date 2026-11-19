/**
 * Luxury Wedding Digital Album Configuration
 * 
 * Defines the complete physical and visual structure of the album:
 * - Cover and Back Cover
 * - Interior Single Pages & Continuous Two-Page Panoramic Spreads (3:1)
 * - Configurable Photographer / Studio Credit Page
 * - Physical album dimensions (Standard 18x12" closed / 36x12" open, Extended, Large)
 * - Slideshow autoplay settings
 * - Synthesized tactile audio settings
 */

import tphLogo from '@/assets/tph.png';
import mindtrixLogo from '@/assets/watermark.png';

// 1. ImageKit cloud endpoint loaded strictly from .env
const IMAGEKIT_URL_ENDPOINT = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGEKIT_URL_ENDPOINT) || ''
).trim().replace(/\/+$/, '');

// 2. Direct ImageKit URL builder (strictly requires VITE_IMAGEKIT_URL_ENDPOINT in .env)
export const getImageKitUrl = (path: string): string => {
  if (!IMAGEKIT_URL_ENDPOINT) return '';
  const cleanPath = path.replace(/^\/+/, '');
  return `${IMAGEKIT_URL_ENDPOINT}/${cleanPath}`;
};

// 3. Folder structure matching your ImageKit media library:
// Root: <Project-Folder>/<Album-Folder>/<filename>.jpg
const ROOT_FOLDER = 'Subhash-Rita-Banerjee-Anniversary-Digital-Album';

// Front Cover & Back Cover
export const coverImage = getImageKitUrl(`${ROOT_FOLDER}/front-cover.jpg`);
export const backCoverImage = getImageKitUrl(`${ROOT_FOLDER}/back-cover.jpg`);

// Interior Pages
export const TOTAL_PAGES = 24;
export const interiorPages: string[] = [];

for (let i = 1; i <= TOTAL_PAGES; i++) {
  interiorPages.push(
    getImageKitUrl(
      `${ROOT_FOLDER}/page-${String(i).padStart(2, '0')}.jpg`
    )
  );
}

export interface AlbumDimensions {
  closedWidthInches: number;
  closedHeightInches: number;
  openWidthInches: number;
  openHeightInches: number;
  singlePageAspectRatio: number; // e.g. 1.5 (3:2)
  openSpreadAspectRatio: number;   // e.g. 3.0 (3:1)
}

export interface PhotographerCreditInfo {
  photographerName: string;
  studioName: string;
  role: string;
  websiteUrl: string;
  socialHandle?: string;
  location?: string;
  quote?: string;
  logoSrc?: string;
  showAlbumMeta?: boolean; // when false, album date/location lines are hidden
}

export type AlbumPageType = 'cover' | 'single' | 'credit' | 'cover-back';

export interface AlbumItemConfig {
  id: string;
  type: AlbumPageType;
  src?: string;
  title?: string;
  creditInfo?: PhotographerCreditInfo;
  isLeft?: boolean;
}

export interface AlbumConfig {
  id?: string;
  title: string;
  coupleNames: string;
  weddingDate: string;
  weddingLocation: string;
  defaultSize: 'standard' | 'extended' | 'large';
  dimensions: {
    standard: AlbumDimensions;
    extended: AlbumDimensions;
    large: AlbumDimensions;
  };
  autoplay: {
    enabled: boolean;
    defaultIntervalSeconds: number;
    intervalOptionsSeconds: number[];
  };
  soundEffects: {
    enabled: boolean;
    defaultVolume: number;
  };
  photographer: PhotographerCreditInfo;
  items: AlbumItemConfig[];
}

export const albumConfig: AlbumConfig = {
  id: 'wedding-album',
  title: 'Subhash & Rita Banerjee Anniversary',
  coupleNames: 'Subhash & Rita Banerjee',
  weddingDate: '19 February 2026',
  weddingLocation: 'Kolkata',
  defaultSize: 'standard',
  dimensions: {
    // Standard format: Closed 18" wide x 12" tall (3:2) | Open 36" wide x 12" tall (3:1)
    standard: {
      closedWidthInches: 18,
      closedHeightInches: 12,
      openWidthInches: 36,
      openHeightInches: 12,
      singlePageAspectRatio: 1.5, // 18 / 12 = 3:2
      openSpreadAspectRatio: 3.0,  // 36 / 12 = 3:1
    },
    // Extended format: Closed 20" wide x 13" tall | Open 40" wide x 13" tall
    extended: {
      closedWidthInches: 20,
      closedHeightInches: 13,
      openWidthInches: 40,
      openHeightInches: 13,
      singlePageAspectRatio: 20 / 13,
      openSpreadAspectRatio: 40 / 13,
    },
    // Large format: Closed 20" wide x 14" tall | Open 40" wide x 14" tall
    large: {
      closedWidthInches: 20,
      closedHeightInches: 14,
      openWidthInches: 40,
      openHeightInches: 14,
      singlePageAspectRatio: 20 / 14,
      openSpreadAspectRatio: 40 / 14,
    }
  },
  autoplay: {
    enabled: false,
    defaultIntervalSeconds: 5,
    intervalOptionsSeconds: [3, 5, 8, 10],
  },
  soundEffects: {
    enabled: true,
    defaultVolume: 0.4,
  },
  photographer: {
    photographerName: '',
    studioName: 'The Photographer House',
    role: 'Principal Photographer',
    websiteUrl: 'https://www.thephotographerhouse.com',
    quote: 'Where Every Click Tells a Story',
    logoSrc: tphLogo,
  },
  items: [
    // 1. Front Cover (Leaf 0)
    {
      id: 'cover-front',
      type: 'cover',
      src: coverImage,
      title: 'Subhash & Rita Banerjee',
    },

    // 2. Interior Pages (1..N)
    ...interiorPages.map((pageSrc, idx) => ({
      id: `page-${String(idx + 1).padStart(2, '0')}`,
      type: 'single' as const,
      src: pageSrc,
      title: `Page ${String(idx + 1).padStart(2, '0')}`,
    })),

    // 3. Back Cover (Final Leaf)
    {
      id: 'cover-back',
      type: 'cover-back',
      src: backCoverImage,
      title: 'Subhash & Rita Banerjee',
    },

    // 4. Details Pages (TPH & Mindtrix Media)
    {
      id: 'credit-tph',
      type: 'credit',
      isLeft: true,
      creditInfo: {
        photographerName: '',
        studioName: 'The Photographer House',
        role: '',
        websiteUrl: 'https://www.thephotographerhouse.com',
        quote: 'Where Every Click Tells a Story',
        logoSrc: tphLogo,
      },
    },
    {
      id: 'credit-mindtrix',
      type: 'credit',
      creditInfo: {
        photographerName: '',
        studioName: 'Mindtrix Media',
        role: 'Digital Album Production',
        websiteUrl: 'https://www.mindtrixmedia.com',
        logoSrc: mindtrixLogo,
        quote: 'This album is made with Mindtrix Media',
        showAlbumMeta: false,
      },
    },
  ],
};
