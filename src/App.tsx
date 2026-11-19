import React from 'react';
import { AlbumViewer } from './components/AlbumViewer';
import { albumConfig } from './data/album.config';

export default function App() {
  return (
    <main className="w-full h-screen bg-[#f5f4ef] overflow-hidden">
      <h1 className="sr-only">{albumConfig.title}</h1>
      <AlbumViewer config={albumConfig} />
    </main>
  );
}
