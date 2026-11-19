import { AlbumConfig, AlbumItemConfig } from '@/data/album.config';

export interface CompiledLeaf {
  id: string;
  leafIndex: number;
  itemType: 'cover' | 'single' | 'credit' | 'cover-back';
  originalItem: AlbumItemConfig;
  isLeft: boolean;
  pageNumber: number; // 1-based display number for interior pages
  density: 'hard' | 'soft';
  label: string;
  previewSrc?: string;
}

// ponytail: compile only elements that physically show on the website
export function compileAlbumLeaves(config: AlbumConfig): CompiledLeaf[] {
  const leaves: CompiledLeaf[] = [];
  let pageCounter = 1;

  // 1. Front Cover (Leaf 0)
  const frontCoverItem = config.items.find(i => i.type === 'cover') || config.items[0];
  leaves.push({
    id: 'leaf-front-cover',
    leafIndex: 0,
    itemType: 'cover',
    originalItem: frontCoverItem,
    isLeft: false,
    pageNumber: 0,
    density: 'hard',
    label: 'Front Cover',
    previewSrc: frontCoverItem?.src || '',
  });

  // 2. Interior Items
  const interiorItems = config.items.filter(i => i.type !== 'cover' && i.type !== 'cover-back' && i.type !== 'credit');
  const creditItems = config.items.filter(i => i.type === 'credit');
  const openingCreditItem = creditItems[0];
  const closingCreditItem = creditItems[1];
  const backCoverItem = config.items.find(i => i.type === 'cover-back');

  let isNextLeft = true;

  // If opening credit exists, place it on left, page 1 on right
  if (openingCreditItem) {
    leaves.push({
      id: 'leaf-credit-opening',
      leafIndex: leaves.length,
      itemType: 'credit',
      originalItem: openingCreditItem,
      isLeft: true,
      pageNumber: 0,
      density: 'soft',
      label: 'Photographer Credits',
      previewSrc: openingCreditItem?.creditInfo?.logoSrc || '',
    });
    isNextLeft = false;
  }

  // Interior Single Pages
  for (const item of interiorItems) {
    const num = pageCounter++;
    leaves.push({
      id: `leaf-${item.id}`,
      leafIndex: leaves.length,
      itemType: 'single',
      originalItem: item,
      isLeft: isNextLeft,
      pageNumber: num,
      density: 'soft',
      label: item.title || `Page ${String(num).padStart(2, '0')}`,
      previewSrc: item.src,
    });
    isNextLeft = !isNextLeft;
  }

  // 3. Closing Credit Page (before back cover)
  if (closingCreditItem) {
    leaves.push({
      id: 'leaf-credit-closing',
      leafIndex: leaves.length,
      itemType: 'credit',
      originalItem: closingCreditItem,
      isLeft: false,
      pageNumber: 0,
      density: 'soft',
      label: closingCreditItem.creditInfo?.studioName || 'Details',
      previewSrc: closingCreditItem.creditInfo?.logoSrc,
    });
  }

  // 4. Back Cover (Final Leaf)
  const finalBackCoverItem = backCoverItem || config.items[config.items.length - 1];
  leaves.push({
    id: 'leaf-back-cover',
    leafIndex: leaves.length,
    itemType: 'cover-back',
    originalItem: finalBackCoverItem,
    isLeft: true,
    pageNumber: 0,
    density: 'hard',
    label: 'Back Cover',
    previewSrc: finalBackCoverItem?.src || '',
  });

  return leaves;
}
