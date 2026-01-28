// Converted from PlaylistManager.jsx to PlaylistManager.tsx
'use client';

import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  Play,
  MoreVertical
} from 'lucide-react';
import { PlaylistContext } from '../../context/PlaylistContext';
import { PlayerContext } from '../../context/PlayerContext';
import CassetteCard from './CassetteCard';
// @ts-ignore: No type declaration for CassetteCard
import type { Playlist, PlaylistContextType, PlayerContextType } from '../../types';

interface PlaylistManagerProps {
  onSelectPlaylist?: (playlist: Playlist) => void;
}

export default function PlaylistManager({ onSelectPlaylist }: PlaylistManagerProps) {
  const {
    playlists,
    isLoading,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    duplicatePlaylist,
    exportPlaylist
  } = useContext(PlaylistContext) as PlaylistContextType;

  const { playSong } = useContext(PlayerContext) as PlayerContextType;

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setIsCreating(false);
  };

  const handleRename = async (id: number) => {
    if (!editingName.trim()) return;
    await renamePlaylist(id, editingName.trim());
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this playlist?')) {
      await deletePlaylist(id);
    }
    setMenuOpen(null);
  };

  const handleDuplicate = async (id: number) => {
    await duplicatePlaylist(id);
    setMenuOpen(null);
  };

  const handleExport = (id: number) => {
    const json = exportPlaylist(id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playlist-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setMenuOpen(null);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs, 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'var(--vinyl-groove)',
            borderTopColor: 'var(--copper)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--warm-cream)' }}
        >
          Playlists
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="retro-button retro-button-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Create playlist form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--walnut)'
              }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-lg outline-none"
                  style={{
                    background: 'var(--vinyl-groove)',
                    color: 'var(--warm-cream)',
                    border: '2px solid var(--walnut)'
                  }}
                />
                <button
                  onClick={handleCreate}
                  className="retro-button retro-button-primary"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewPlaylistName('');
                  }}
                  className="retro-button"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlists grid */}
      {playlists.length === 0 ? (
        <div
          className="text-center py-12"
          style={{ color: 'var(--text-muted)' }}
        >
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--vinyl-groove)' }}
          >
            <Plus size={32} />
          </div>
          <p>No playlists yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist: Playlist) => (
            <div key={playlist.id} className="relative">
              {editingId === playlist.id ? (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--surface)',
                    border: '2px solid var(--copper)'
                  }}
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(playlist.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditingName('');
                      }
                    }}
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg outline-none mb-2"
                    style={{
                      background: 'var(--vinyl-groove)',
                      color: 'var(--warm-cream)'
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRename(playlist.id)}
                      className="retro-button retro-button-primary flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName('');
                      }}
                      className="retro-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <CassetteCard
                  playlist={playlist}
                  onClick={() => onSelectPlaylist?.(playlist)}
                  onPlay={() => handlePlayPlaylist(playlist)}
                />
              )}

              {/* Menu button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === playlist.id ? null : playlist.id);
                  }}
                  className="p-1.5 rounded-full transition-colors hover:bg-white/10"
                >
                  <MoreVertical size={16} style={{ color: 'var(--warm-cream)' }} />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {menuOpen === playlist.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-8 z-10 min-w-40 rounded-lg overflow-hidden"
                      style={{
                        background: 'var(--surface)',
                        border: '2px solid var(--walnut)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPlaylist(playlist);
                          setMenuOpen(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--warm-cream)' }}
                      >
                        <Play size={14} />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(playlist.id);
                          setEditingName(playlist.name);
                          setMenuOpen(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--warm-cream)' }}
                      >
                        <Edit2 size={14} />
                        <span>Rename</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(playlist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--warm-cream)' }}
                      >
                        <Copy size={14} />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(playlist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--warm-cream)' }}
                      >
                        <Download size={14} />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(playlist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
