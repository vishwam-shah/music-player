import React from 'react';
import { Home, Search, Plus, Library } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-black p-4 space-y-6">
      <div className="space-y-4">
        <button className="flex items-center gap-2 text-white hover:text-green-400">
          <Home /> Home
        </button>
        <button className="flex items-center gap-2 text-white hover:text-green-400">
          <Search /> Search
        </button>
        <button className="flex items-center gap-2 text-white hover:text-green-400">
          <Library /> Your Library
        </button>
        <button className="flex items-center gap-2 text-white hover:text-green-400">
          <Plus /> Create Playlist
        </button>
      </div>
    </div>
  );
}
