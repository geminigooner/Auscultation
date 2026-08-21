import React from 'react';
import { Play, Pause, Repeat, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface TransportProps {
  isPlaying: boolean;
  /** Fractional token position. */
  playhead: number;
  totalTokens: number;
  tokensPerSecond: number;
  isLooping: boolean;
  onTogglePlay: () => void;
  onScrub: (playhead: number) => void;
  onToggleLoop: () => void;
  onChangeRate: (tokensPerSecond: number) => void;
}

export const Transport: React.FC<TransportProps> = ({
  isPlaying,
  playhead,
  totalTokens,
  tokensPerSecond,
  isLooping,
  onTogglePlay,
  onScrub,
  onToggleLoop,
  onChangeRate,
}) => {
  const totalSec = totalTokens / tokensPerSecond;
  const nowSec = playhead / tokensPerSecond;

  return (
    <div className="toy-panel-purple p-2 flex items-center gap-2">
      {/* play / pause */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="toy-btn-rose w-14 h-14 shrink-0 flex items-center justify-center"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-[#1e1b3a] fill-[#1e1b3a]" />
        ) : (
          <Play className="w-6 h-6 text-[#1e1b3a] fill-[#1e1b3a]" />
        )}
      </motion.button>

      {/* scrub */}
      <div className="toy-panel-cream flex-1 min-w-0 px-3 py-2 rounded-2xl">
        <div className="text-[11px] font-bold text-[#1e1b3a] text-center mb-1">
          {nowSec.toFixed(1)} / {totalSec.toFixed(1)} sec
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(0.001, totalTokens)}
          step={0.01}
          value={playhead}
          onChange={(e) => onScrub(parseFloat(e.target.value))}
          className="w-full accent-[#ef8a9a]"
          aria-label="Scrub"
        />
      </div>

      {/* loop */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggleLoop}
        aria-label="Loop"
        className={`w-12 h-12 shrink-0 flex items-center justify-center border-[3px] border-[#1e1b3a] rounded-2xl shadow-[0px_3px_0px_#1e1b3a] ${
          isLooping ? 'bg-[#ef8a9a]' : 'bg-[#9b8cc4]'
        }`}
      >
        <Repeat className="w-5 h-5 text-[#1e1b3a] stroke-[3]" />
      </motion.button>

      {/* rate */}
      <div className="toy-panel-cream shrink-0 px-2 py-1 rounded-2xl flex flex-col items-center">
        <div className="text-[9px] font-bold lowercase text-[#1e1b3a] opacity-70 leading-none">
          tok/sec
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangeRate(Math.max(1, tokensPerSecond - 1))}
            aria-label="Slower"
            className="w-6 h-6 flex items-center justify-center"
          >
            <Minus className="w-3.5 h-3.5 text-[#1e1b3a] stroke-[4]" />
          </button>
          <span className="text-base font-extrabold text-[#1e1b3a] w-4 text-center">
            {tokensPerSecond}
          </span>
          <button
            onClick={() => onChangeRate(Math.min(12, tokensPerSecond + 1))}
            aria-label="Faster"
            className="w-6 h-6 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5 text-[#1e1b3a] stroke-[4]" />
          </button>
        </div>
      </div>
    </div>
  );
};