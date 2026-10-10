import { AlbumConfig, AlbumItemConfig } from '@/data/album.config';
import { assets } from '@/assets';

export interface CompiledLeaf {
  id: string;
  leafIndex: number;
  itemType: 'cover' | 'single' | 'spread-left' | 'spread-right' | 'credit' | 'flyleaf' | 'cover-back';
  originalItem: AlbumItemConfig;
  isLeft: boolean;
  pageNumber: number; // 1-based display number for interior pages
  density: 'hard' | 'soft';
  label: string;
  previewSrc?: string;
  fallbackSrc?: string;
}

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
    previewSrc: frontCoverItem?.src || assets.frontCover,
    fallbackSrc: frontCoverItem?.fallbackSrc,
  });

  // 2. Interior Items
  const interiorItems = config.items.filter(i => i.type !== 'cover' && i.type !== 'cover-back' && i.type !== 'credit');
  const creditItem = config.items.find(i => i.type === 'credit');
  const backCoverItem = config.items.find(i => i.type === 'cover-back');

  // If first interior item is a single page (e.g. page-00), let's create opening flyleaf on left, and page-00 on right!
  // In luxury flush mount albums, opening the cover reveals an endpaper/flyleaf on the left, and opening title page on the right.
  let isNextLeft = true;

  // Let's check first interior item
  const firstItem = interiorItems[0];
  if (firstItem && firstItem.type === 'single') {
    // Left leaf: Luxury Japanese silk / parchment flyleaf with wedding monogram
    leaves.push({
      id: 'leaf-flyleaf-opening',
      leafIndex: leaves.length,
      itemType: 'flyleaf',
      originalItem: {
        id: 'flyleaf-opening',
        type: 'single',
        title: config.coupleNames,
        subtitle: 'The Anniversary Album',
        caption: config.weddingLocation,
      },
      isLeft: true,
      pageNumber: 0,
      density: 'soft',
      label: 'Endpaper',
      previewSrc: assets.frontCover,
    });
    isNextLeft = false;

    // Right leaf: Opening page
    leaves.push({
      id: `leaf-${firstItem.id}`,
      leafIndex: leaves.length,
      itemType: 'single',
      originalItem: firstItem,
      isLeft: false,
      pageNumber: pageCounter++,
      density: 'soft',
      label: firstItem.title || 'Page 01',
      previewSrc: firstItem.src,
      fallbackSrc: firstItem.fallbackSrc,
    });
    isNextLeft = true;
  }

  // Process remaining interior items (starting from index 1 if first was single, or 0)
  const remainingInterior = (firstItem && firstItem.type === 'single') ? interiorItems.slice(1) : interiorItems;

  for (const item of remainingInterior) {
    if (item.type === 'spread') {
      // If we are currently expecting a right page, insert a filler or flyleaf to align the spread to left-right
      if (!isNextLeft) {
        leaves.push({
          id: `leaf-flyleaf-${leaves.length}`,
          leafIndex: leaves.length,
          itemType: 'flyleaf',
          originalItem: {
            id: `flyleaf-${leaves.length}`,
            type: 'single',
            title: config.coupleNames,
          },
          isLeft: false,
          pageNumber: pageCounter++,
          density: 'soft',
          label: 'Interlude',
        });
        isNextLeft = true;
      }

      // Continuous 3:1 Spread: Left Leaf
      leaves.push({
        id: `leaf-${item.id}-left`,
        leafIndex: leaves.length,
        itemType: 'spread-left',
        originalItem: item,
        isLeft: true,
        pageNumber: pageCounter++,
        density: 'soft',
        label: `${item.title || 'Panoramic Spread'} (Left)`,
        previewSrc: item.src,
        fallbackSrc: item.fallbackSrc,
      });

      // Continuous 3:1 Spread: Right Leaf
      leaves.push({
        id: `leaf-${item.id}-right`,
        leafIndex: leaves.length,
        itemType: 'spread-right',
        originalItem: item,
        isLeft: false,
        pageNumber: pageCounter++,
        density: 'soft',
        label: `${item.title || 'Panoramic Spread'} (Right)`,
        previewSrc: item.src,
        fallbackSrc: item.fallbackSrc,
      });

      isNextLeft = true;
    } else if (item.type === 'single') {
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
        fallbackSrc: item.fallbackSrc,
      });
      isNextLeft = !isNextLeft;
    }
  }

  // 3. Photographer Credit Page (positioned immediately before the back cover)
  if (creditItem) {
    leaves.push({
      id: 'leaf-photographer-credit',
      leafIndex: leaves.length,
      itemType: 'credit',
      originalItem: creditItem,
      isLeft: isNextLeft,
      pageNumber: pageCounter++,
      density: 'soft',
      label: 'Photographer Credits',
      previewSrc: creditItem.src,
      fallbackSrc: creditItem.fallbackSrc,
    });
    isNextLeft = !isNextLeft;
  }

  // Ensure total leaves before the back cover ends on an even number so back cover is on the left
  // (Total book leaves must be EVEN: 0 to N-1)
  // If leaves.length is currently odd (e.g. 9), adding back cover makes 10 (even). That is correct!
  // If leaves.length is even (e.g. 8), adding back cover would make 9 (odd, back cover would appear on right side).
  // In that case, insert an elegant final flyleaf/endpaper on the left!
  if (leaves.length % 2 === 0) {
    leaves.push({
      id: 'leaf-flyleaf-closing',
      leafIndex: leaves.length,
      itemType: 'flyleaf',
      originalItem: {
        id: 'flyleaf-closing',
        type: 'single',
        title: config.coupleNames,
        subtitle: 'Fin',
        caption: 'Handcrafted Luxury Album',
      },
      isLeft: isNextLeft,
      pageNumber: 0,
      density: 'soft',
      label: 'Closing Endpaper',
    });
  }

  // 4. Back Cover (Leaf N - 1)
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
    previewSrc: finalBackCoverItem?.src || assets.backCover,
    fallbackSrc: finalBackCoverItem?.fallbackSrc,
  });

  return leaves;
}
