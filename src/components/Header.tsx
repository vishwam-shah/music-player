"use client";

import React from "react";
import { Search, User, Bell } from "lucide-react";
import { motion } from "framer-motion";
import ThemeSwitcher from "./ui/ThemeSwitcher";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-xl"
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)"
      }}
    >
      {/* Search bar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1 max-w-lg"
      >
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: "var(--color-textMuted)" }}
        />
        <input
          type="text"
          value={searchQuery || ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:scale-[1.02]"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "2px solid var(--color-border)",
            boxShadow: "0 4px 12px var(--color-shadow)"
          }}
        />
      </motion.div>
      {/* Right actions */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 ml-4"
      >
        {/* Theme Switcher */}
        <ThemeSwitcher />
        
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl transition-all duration-300 backdrop-blur-xl border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)"
          }}
        >
          <Bell size={20} />
        </motion.button>
        {/* User profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-xl border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)"
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "var(--color-primary)",
              boxShadow: "0 0 20px var(--color-primary)"
            }}
          >
            <User size={16} />
          </div>
          <span className="text-sm font-medium hidden sm:block">Profile</span>
        </motion.button>
      </motion.div>
    </motion.header>
  );
};

export default Header;
