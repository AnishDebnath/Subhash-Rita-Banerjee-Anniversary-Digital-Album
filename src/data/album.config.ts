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
 * 
 * Any image or detail can be updated here without modifying the page-turning engine.
 */

import { assets } from '@/assets';

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
}

export type AlbumPageType = 'cover' | 'single' | 'spread' | 'credit' | 'cover-back';

export interface AlbumItemConfig {
  id: string;
  type: AlbumPageType;
  src?: string;
  fallbackSrc?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  // For continuous panoramic spreads
  layout?: 'two-page-continuous' | 'single-page';
  aspectRatio?: string; // "3:1"
  splitAt?: number;      // 0.5 for center fold
  preserveOriginalImage?: boolean;
  // For photographer credit page
  creditInfo?: PhotographerCreditInfo;
}

export interface AlbumConfig {
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
  title: 'Subhash & Rita Banerjee Anniversary',
  coupleNames: 'Subhash & Rita Banerjee',
  weddingDate: '',
  weddingLocation: '',
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
    photographerName: 'Vikramaditya Rathore',
    studioName: 'Royal Vows Fine Art Studios',
    role: 'Principal Destination Wedding Photographer',
    websiteUrl: 'https://royalvows.studio',
    socialHandle: '@royalvows.fineart',
    location: 'Udaipur · Mumbai · London',
    quote: 'Every glance, every tear, every blessing preserved in timeless print.',
  },
  items: [
    // Front cover
    {
      id: 'cover-front',
      type: 'cover',
      src: assets.frontCover,
      title: 'Subhash & Rita Banerjee',
    },
    // Interior pages: page-01 shows first on the right after opening the cover
    { id: 'page-01', type: 'single', src: assets.page01 },
    { id: 'page-02', type: 'single', src: assets.page02 },
    { id: 'page-03', type: 'single', src: assets.page03 },
    { id: 'page-04', type: 'single', src: assets.page04 },
    { id: 'page-05', type: 'single', src: assets.page05 },
    { id: 'page-06', type: 'single', src: assets.page06 },
    { id: 'page-07', type: 'single', src: assets.page07 },
    { id: 'page-08', type: 'single', src: assets.page08 },
    { id: 'page-09', type: 'single', src: assets.page09 },
    { id: 'page-10', type: 'single', src: assets.page10 },
    { id: 'page-11', type: 'single', src: assets.page11 },
    { id: 'page-12', type: 'single', src: assets.page12 },
    { id: 'page-13', type: 'single', src: assets.page13 },
    { id: 'page-14', type: 'single', src: assets.page14 },
    { id: 'page-15', type: 'single', src: assets.page15 },
    { id: 'page-16', type: 'single', src: assets.page16 },
    { id: 'page-17', type: 'single', src: assets.page17 },
    { id: 'page-18', type: 'single', src: assets.page18 },
    { id: 'page-19', type: 'single', src: assets.page19 },
    { id: 'page-20', type: 'single', src: assets.page20 },
    { id: 'page-21', type: 'single', src: assets.page21 },
    { id: 'page-22', type: 'single', src: assets.page22 },
    { id: 'page-23', type: 'single', src: assets.page23 },
    { id: 'page-24', type: 'single', src: assets.page24 },
    // Back cover
    {
      id: 'cover-back',
      type: 'cover-back',
      src: assets.backCover,
      title: 'Subhash & Rita Banerjee',
    },
  ],
};
