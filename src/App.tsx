/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlbumViewer } from './components/AlbumViewer';
import { albumConfig } from './data/album.config';

export default function App() {
  return (
    <main className="w-full h-screen bg-[#f5f4ef] overflow-hidden">
      <h1 className="sr-only">Subhash & Rita Banerjee Anniversary Digital Album</h1>
      <AlbumViewer config={albumConfig} />
    </main>
  );
}
