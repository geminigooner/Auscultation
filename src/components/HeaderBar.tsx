import React from 'react';
import { motion } from 'motion/react';
import { Settings, MessageCircle, Heart, Sparkles, Star } from 'lucide-react';
import { SoundPreset } from '../types';

interface HeaderBarProps {
  soundPreset: SoundPreset;
  onSelectPreset: (preset: SoundPreset) => void;
  bpm: number;
  isPlaying: boolean;
  onToggleSettings: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  soundPreset,
  bpm,
  isPlaying,
  onToggleSettings,
}) => {
  return (
    <div id="header-container" className="w-full flex flex-col gap-2">
      {/* Top chunky pill container */}
      <div 
        id="header-top-bar"
        className="toy-panel-purple p-2 flex items-center justify-between gap-2"
      >
        {/* Cat Avatar badge */}
        <motion.div
          id="cat-badge"
          whileTap={{ scale: 0.95 }}
          className="w-12 h-10 bg-[#9b8cc4] border-[3px] border-[#1e1b3a] rounded-2xl flex items-center justify-center text-xl shadow-[0px_2px_0px_#1e1b3a] shrink-0 cursor-pointer"
        >
          <span className="font-extrabold text-[#1e1b3a] select-none text-base">(=^･ω･^=)</span>
        </motion.div>

        {/* Message / status pill */}
        <motion.div
          id="app-title-pill"
          whileTap={{ scale: 0.95 }}
          className="flex-1 h-10 bg-[#f5dfb8] border-[3px] border-[#1e1b3a] rounded-full px-3 flex items-center gap-2 shadow-[0px_2px_0px_#1e1b3a] overflow-hidden"
        >
          <MessageCircle className="w-4 h-4 text-[#1e1b3a] stroke-[3]" />
          <span className="text-xs sm:text-sm font-bold text-[#1e1b3a] truncate tracking-tight lowercase">
            auscultation • {soundPreset.replace('-', ' ')}
          </span>
        </motion.div>

        {/* BPM / Pulse chip */}
        <motion.div
          id="bpm-indicator"
          whileTap={{ scale: 0.95 }}
          className={`h-10 px-3 border-[3px] border-[#1e1b3a] rounded-full flex items-center gap-1.5 shadow-[0px_2px_0px_#1e1b3a] shrink-0 ${
            isPlaying ? 'bg-[#ef8a9a]' : 'bg-[#ef8a9a]/70'
          }`}
        >
          <Heart className={`w-4 h-4 text-[#1e1b3a] stroke-[3] ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="text-xs font-bold text-[#1e1b3a]">{bpm}</span>
        </motion.div>

        {/* Settings gear button */}
        <motion.button
          id="settings-button"
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSettings}
          className="w-10 h-10 bg-[#9b8cc4] border-[3px] border-[#1e1b3a] rounded-xl flex items-center justify-center shadow-[0px_2px_0px_#1e1b3a] shrink-0 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#1e1b3a] stroke-[3]" />
        </motion.button>
      </div>

      {/* Decorative Star & Sparkle Sub-bar */}
      <div 
        id="header-sub-bar"
        className="w-full h-7 bg-[#9b8cc4] border-[3px] border-[#1e1b3a] rounded-full px-4 flex items-center justify-between shadow-[0px_2px_0px_#1e1b3a]"
      >
        <Star className="w-3.5 h-3.5 fill-[#ef8a9a] text-[#1e1b3a] stroke-[2]" />
        <span className="text-[11px] font-bold text-[#1e1b3a] tracking-wider lowercase opacity-90">
          chunky toy heart roll
        </span>
        <Sparkles className="w-3.5 h-3.5 fill-[#f5dfb8] text-[#1e1b3a] stroke-[2]" />
      </div>
    </div>
  );
};
