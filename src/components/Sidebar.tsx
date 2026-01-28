"use client";

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Search as SearchIcon,
  Library as LibraryIcon,
  Plus,
  ListMusic,
  Heart,
  Clock,
  Youtube,
  FolderOpen,
  Settings,
  Disc3,
  Music2
} from "lucide-react";
import { PlaylistContext } from "../context/PlaylistContext";
import { FavoritesContext } from "../context/FavoritesContext";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCreatePlaylist?: () => void;
  onAddLocalFiles?: () => void;
  onYouTubeOpen?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: SearchIcon },
  { id: "library", label: "Library", icon: LibraryIcon }
];

const QUICK_ACCESS: NavItem[] = [
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "jiosaavn", label: "JioSaavn", icon: Music2 }
];

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onCreatePlaylist,
  onAddLocalFiles,
  onYouTubeOpen
}) => {
  const { playlists } = useContext(PlaylistContext) ?? { playlists: [] };
  const favorites = (useContext(FavoritesContext) as import("../types").FavoritesContextType | null)?.favorites ?? [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="flex flex-col h-full wood-texture"
      style={{
        width: isCollapsed ? 72 : 240,
        background: "var(--color-background)",
        borderRight: "2px solid var(--color-border)",
        transition: "width 0.3s ease",
        paddingBottom: "120px"
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <motion.div
          className="shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Disc3 size={32} style={{ color: "var(--color-primary)" }} />
        </motion.div>
        {!isCollapsed && (
          <div>
            <h1
              className="font-bold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              Vinyl
            </h1>
            <p className="text-xs" style={{ color: "var(--color-textMuted)" }}>
              Music Player
            </p>
          </div>
        )}
      </div>
      {/* Main Navigation */}
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            isCollapsed={isCollapsed}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </nav>
      {/* Divider */}
      <div className="mx-3 my-2 h-px" style={{ background: "var(--color-border)" }} />
      {/* Quick Access */}
      <div className="p-3 space-y-1">
        {!isCollapsed && (
          <div
            className="text-xs uppercase tracking-wider mb-2 px-2"
            style={{ color: "var(--color-textMuted)" }}
          >
            Quick Access
          </div>
        )}
        {QUICK_ACCESS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            isCollapsed={isCollapsed}
            onClick={() => {
              if (item.id === "youtube") {
                onYouTubeOpen?.();
              } else {
                onViewChange(item.id);
              }
            }}
            badge={item.id === "favorites" ? favorites.length : null}
          />
        ))}
      </div>
      {/* Divider */}
      <div className="mx-3 my-2 h-px" style={{ background: "var(--color-border)" }} />
      {/* Playlists */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-2 px-2">
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-textMuted)" }}
            >
              Playlists
            </span>
            <button
              onClick={onCreatePlaylist}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Create Playlist"
            >
              <Plus size={14} style={{ color: "var(--color-textMuted)" }} />
            </button>
          </div>
        )}
        <div className="space-y-1">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onViewChange(`playlist-${playlist.id}`)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/5 text-left"
              style={{
                background:
                  activeView === `playlist-${playlist.id}`
                    ? "var(--color-surfaceHover)"
                    : "transparent"
              }}
            >
              <ListMusic size={16} style={{ color: "var(--color-primary)" }} />
              {!isCollapsed && (
                <span
                  className="truncate text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {playlist.name}
                </span>
              )}
            </button>
          ))}
          {playlists.length === 0 && !isCollapsed && (
            <button
              onClick={onCreatePlaylist}
              className="w-full flex items-center gap-2 px-3 py-3 rounded-lg transition-colors border-dashed"
              style={{
                border: "1px dashed var(--color-border)",
                color: "var(--color-textMuted)"
              }}
            >
              <Plus size={16} />
              <span className="text-sm">Create playlist</span>
            </button>
          )}
        </div>
      </div>
      {/* Bottom actions */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={onAddLocalFiles}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
        >
          <FolderOpen size={16} style={{ color: "var(--color-primary)" }} />
          {!isCollapsed && (
            <span className="text-sm" style={{ color: "var(--color-text)" }}>
              Add Local Files
            </span>
          )}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
        >
          <Settings size={16} style={{ color: "var(--color-textMuted)" }} />
          {!isCollapsed && (
            <span className="text-sm" style={{ color: "var(--color-textMuted)" }}>
              {isCollapsed ? "Expand" : "Collapse"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: number | null;
}

const NavButton: React.FC<NavButtonProps> = ({ item, isActive, isCollapsed, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
        isCollapsed ? "justify-center" : ""
      }`}
      style={{
        background: isActive ? "var(--color-primary)" : "transparent",
        color: isActive ? "#ffffff" : "var(--color-textMuted)",
        boxShadow: isActive ? "0 0 12px var(--color-primary)" : "none"
      }}
    >
      <item.icon size={20} />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {badge !== null && badge !== undefined && badge > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                background: isActive ? "rgba(255,255,255,0.2)" : "var(--color-surfaceHover)",
                color: isActive ? "#ffffff" : "var(--color-text)"
              }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Sidebar;
