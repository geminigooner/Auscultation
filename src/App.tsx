/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PianoRoll } from './components/PianoRoll';
import { Transport } from './components/Transport';
import { demoScore } from './data/demoScore';
import { soundEngine } from './audio/synth';

export default function App() {
  const score = demoScore;
  const total = score.chords.length;

  const [selected, setSelected] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLooping, setIsLooping] = React.useState(false);
  const [rate, setRate] = React.useState(score.config.tokensPerSecond);
  const [playhead, setPlayhead] = React.useState(0);

  // Refs so the animation loop never restarts on a state change.
  const playheadRef = React.useRef(0);
  const lastFiredRef = React.useRef(-1);
  const rateRef = React.useRef(rate);
  const loopRef = React.useRef(isLooping);
  React.useEffect(() => void (rateRef.current = rate), [rate]);
  React.useEffect(() => void (loopRef.current = isLooping), [isLooping]);

  const fireChord = React.useCallback(
    (position: number) => {
      const chord = score.chords[position];
      if (!chord) return;
      const dur = (1 / rateRef.current) * 0.9;
      chord.notes.forEach((n) => {
        soundEngine.playNote(n.midi, n.velocity, 'marimba', dur);
      });
    },
    [score],
  );

  // Playback loop. Advances the playhead in real time and fires each chord
  // once, as the playhead crosses its token boundary.
  React.useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      let next = playheadRef.current + dt * rateRef.current;

      if (next >= total) {
        if (loopRef.current) {
          next -= total;
          lastFiredRef.current = -1;
        } else {
          playheadRef.current = total;
          setPlayhead(total);
          setIsPlaying(false);
          return;
        }
      }

      const position = Math.floor(next);
      if (position !== lastFiredRef.current) {
        lastFiredRef.current = position;
        fireChord(position);
        setSelected(position);
      }

      playheadRef.current = next;
      setPlayhead(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, total, fireChord]);

  const togglePlay = () => {
    soundEngine.init(); // must happen inside a user gesture on iOS
    if (!isPlaying && playheadRef.current >= total) {
      playheadRef.current = 0;
      lastFiredRef.current = -1;
      setPlayhead(0);
    }
    setIsPlaying((p) => !p);
  };

  const scrub = (value: number) => {
    playheadRef.current = value;
    lastFiredRef.current = Math.floor(value);
    setPlayhead(value);
  };

  const selectToken = (position: number) => {
    setSelected(position);
    if (!isPlaying) {
      soundEngine.init();
      fireChord(position);
      scrub(position);
    }
  };

  return (
    <div className="min-h-dvh bg-[#1e1b3a] p-3 flex flex-col gap-3">
      <div className="toy-panel-purple p-2 flex items-center gap-2">
        <span className="text-lg leading-none font-extrabold text-[#1e1b3a] shrink-0">
          (=^･ω･^=)
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-base font-extrabold lowercase text-[#1e1b3a] leading-tight">
            auscultation
          </div>
          <div className="truncate text-[11px] font-bold text-[#1e1b3a] opacity-70">
            {score.prompt}
          </div>
        </div>
        <span className="toy-chip bg-[#f5dfb8] px-2 py-1 text-[10px] font-bold text-[#1e1b3a] shrink-0">
          {total} tokens
        </span>
      </div>

      <PianoRoll
        score={score}
        playhead={playhead}
        selectedPosition={selected}
        onSelectToken={selectToken}
      />

      <Transport
        isPlaying={isPlaying}
        playhead={playhead}
        totalTokens={total}
        tokensPerSecond={rate}
        isLooping={isLooping}
        onTogglePlay={togglePlay}
        onScrub={scrub}
        onToggleLoop={() => setIsLooping((l) => !l)}
        onChangeRate={setRate}
      />

      <div className="toy-panel-purple px-3 py-2 flex flex-wrap gap-1.5">
        {[
          `${score.config.model}`,
          `layer ${score.config.layer}`,
          `sae ${score.config.saeWidth}`,
          `top-k ${score.config.topK}`,
          `${score.config.scale}`,
        ].map((label) => (
          <span
            key={label}
            className="toy-chip bg-[#f5dfb8] px-2 py-1 text-[10px] font-bold lowercase text-[#1e1b3a]"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
