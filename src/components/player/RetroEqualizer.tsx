"use client";

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { PlayerContext } from "../../context/PlayerContext";
import { Settings2, Sparkles, X } from "lucide-react";
import VisualEqualizer from "./VisualEqualizer";
import type { PlayerContextType } from "../../types";

const FREQ_LABELS = ["60", "230", "910", "4K", "14K"];

interface RetroEqualizerProps {
  compact?: boolean;
}

export default function RetroEqualizer({ compact = false }: RetroEqualizerProps) {
  const {
    eqValues,
    currentPreset,
    autoEnhance,
    setEQBand,
    setPreset,
    toggleAutoEnhance,
    getPresets
  } = useContext(PlayerContext) as PlayerContextType;

  const [isOpen, setIsOpen] = useState(false);

  const presets = getPresets();

  return (
    <>
      {compact ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="retro-button p-2 relative"
          title="Equalizer"
        >
          <Settings2 size={18} />
          {autoEnhance && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ background: "var(--amber-glow)" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="retro-button flex items-center gap-2"
        >
          <Settings2 size={18} />
          <span>EQ</span>
          {autoEnhance && <Sparkles size={14} className="text-amber-glow" />}
        </button>
      )}

      {/* EQ Modal */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="rounded-xl p-6 wood-texture"
            style={{
              background: "var(--surface)",
              border: "3px solid var(--walnut)",
              maxWidth: 500,
              width: "90%"
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--warm-cream)" }}>
                Equalizer
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Auto Enhance Toggle */}
            <div
              className="flex items-center justify-between p-3 rounded-lg mb-6"
              style={{ background: "var(--vinyl-groove)" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: autoEnhance ? "var(--amber-glow)" : "var(--text-muted)" }} />
                <span>Auto Enhance</span>
              </div>
              <button
                onClick={() => toggleAutoEnhance(!autoEnhance)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{
                  background: autoEnhance ? "var(--burnt-orange)" : "var(--vinyl-black)"
                }}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full"
                  style={{ background: "var(--warm-cream)" }}
                  animate={{ left: autoEnhance ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                Presets
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset: string) => (
                  <button
                    key={preset}
                    onClick={() => setPreset(preset)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                      currentPreset === preset
                        ? "border-2"
                        : "border border-transparent hover:border-copper"
                    }`}
                    style={{
                      background: currentPreset === preset ? "var(--burnt-orange)" : "var(--vinyl-groove)",
                      borderColor: currentPreset === preset ? "var(--gold-accent)" : "transparent"
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Equalizer Display */}
            <div className="mt-6">
              <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                Real-time Audio Spectrum
              </div>
              <VisualEqualizer variant="compact" barCount={24} />
            </div>

            {/* EQ Sliders */}
            <div
              className="p-4 rounded-lg mt-6"
              style={{ background: "var(--vinyl-black)" }}
            >
              <div className="flex justify-between items-end">
                {eqValues.map((value: number, index: number) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    {/* Value label */}
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {value > 0 ? "+" : ""}{value}
                    </div>

                    {/* Slider track */}
                    <div
                      className="relative"
                      style={{
                        width: 32,
                        height: 140,
                        background: "var(--vinyl-groove)",
                        borderRadius: 4,
                        border: "2px solid var(--walnut)"
                      }}
                    >
                      {/* Center line */}
                      <div
                        className="absolute left-0 right-0"
                        style={{
                          top: "50%",
                          height: 2,
                          background: "var(--copper)",
                          opacity: 0.5
                        }}
                      />

                      {/* Fill */}
                      <motion.div
                        className="absolute left-1 right-1 rounded"
                        style={{
                          background: value > 0 ? "var(--copper)" : "var(--amber-glow)",
                          opacity: 0.6
                        }}
                        animate={{
                          top: value >= 0 ? `${50 - (value / 12) * 50}%` : "50%",
                          bottom: value >= 0 ? "50%" : `${50 - (Math.abs(value) / 12) * 50}%`
                        }}
                      />

                      {/* Slider input */}
                      <input
                        type="range"
                        min={-12}
                        max={12}
                        value={value}
                        onChange={(e) => setEQBand(index, parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        style={{
                          writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
                          direction: "rtl"
                        }}
                      />

                      {/* Thumb indicator */}
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                          width: 28,
                          height: 12,
                          background: "var(--copper)",
                          border: "2px solid var(--gold-accent)",
                          borderRadius: 2,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
                        }}
                        animate={{
                          top: `${50 - (value / 12) * 46}%`
                        }}
                      />
                    </div>

                    {/* Frequency label */}
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--copper)" }}
                    >
                      {FREQ_LABELS[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current preset indicator */}
            <div
              className="mt-4 text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {currentPreset === "custom" ? "Custom settings" : `Preset: ${currentPreset}`}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
