import React from 'react';
import { Score } from '../types';
import { midiToName } from '../data/scales';

const ROW_H = 22;
const COL_W = 78;
const GUTTER = 58;

interface PianoRollProps {
  score: Score;
  /** Fractional token position of the playhead. */
  playhead?: number;
  onSelectToken?: (position: number) => void;
  selectedPosition?: number | null;
}

export const PianoRoll: React.FC<PianoRollProps> = ({
  score,
  playhead = 0,
  onSelectToken,
  selectedPosition = null,
}) => {
  const { chords } = score;

  // Only pitches that actually carry a feature get a row. Empty semitones
  // carry no information, so they get no space.
  const rows = React.useMemo(() => {
    const used = new Set<number>();
    chords.forEach((c) => c.notes.forEach((n) => used.add(n.midi)));
    return Array.from(used).sort((a, b) => b - a);
  }, [chords]);

  const rowOf = React.useMemo(
    () => new Map(rows.map((midi, i) => [midi, i])),
    [rows],
  );

  const gridW = COL_W * chords.length;
  const gridH = ROW_H * rows.length;

  return (
    <div className="toy-panel-cream p-2 flex flex-col gap-2">
      <div className="flex items-center justify-between px-2 pt-1">
        <span className="text-sm font-bold lowercase text-[#1e1b3a]">
          piano roll <span className="opacity-60">(token = chord)</span>
        </span>
        <span className="text-[10px] font-bold lowercase text-[#1e1b3a] opacity-60">
          x: token · y: pitch
        </span>
      </div>

      <div
        className="overflow-auto rounded-2xl border-[3px] border-[#1e1b3a] bg-[#1e1b3a]"
        style={{ maxHeight: '58vh' }}
      >
        <div style={{ width: GUTTER + gridW }}>
          {/* rows */}
          <div className="flex">
            {/* pitch gutter */}
            <div
              className="sticky left-0 z-20 bg-[#1e1b3a] shrink-0"
              style={{ width: GUTTER }}
            >
              {rows.map((midi) => (
                <div
                  key={midi}
                  className="flex items-center justify-center"
                  style={{ height: ROW_H }}
                >
                  <span className="toy-chip bg-[#f5dfb8] px-1.5 text-[10px] font-bold leading-none text-[#1e1b3a] py-[3px]">
                    {midiToName(midi)}
                  </span>
                </div>
              ))}
            </div>

            {/* note area */}
            <div
              className="relative shrink-0"
              style={{
                width: gridW,
                height: gridH,
                backgroundImage: `repeating-linear-gradient(to bottom, #2a244d 0px, #2a244d 1px, transparent 1px, transparent ${ROW_H}px)`,
              }}
            >
              {/* column dividers */}
              {chords.map((c) => (
                <div
                  key={`col-${c.position}`}
                  onClick={() => onSelectToken?.(c.position)}
                  className="absolute top-0 cursor-pointer"
                  style={{
                    left: c.position * COL_W,
                    width: COL_W,
                    height: gridH,
                    borderLeft: '2px dashed #3a3266',
                    background:
                      selectedPosition === c.position
                        ? 'rgba(239,138,154,0.10)'
                        : 'transparent',
                  }}
                />
              ))}

              {/* notes */}
              {chords.map((c) =>
                c.notes.map((n) => (
                  <div
                    key={`${c.position}-${n.featureId}`}
                    className="absolute pointer-events-none rounded-[7px] border-[3px] border-[#1e1b3a] bg-[#ef8a9a]"
                    style={{
                      left: c.position * COL_W + 12,
                      top: (rowOf.get(n.midi) ?? 0) * ROW_H + 3,
                      width: COL_W - 24,
                      height: ROW_H - 6,
                      opacity: 0.3 + 0.7 * n.velocity,
                    }}
                  />
                )),
              )}

              {/* playhead */}
              <div
                className="absolute top-0 pointer-events-none"
                style={{
                  left: playhead * COL_W,
                  width: 3,
                  height: gridH,
                  background: '#ef8a9a',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>

          {/* token strip */}
          <div className="sticky bottom-0 z-10 flex bg-[#1e1b3a] pt-1">
            <div
              className="sticky left-0 z-20 bg-[#1e1b3a] shrink-0"
              style={{ width: GUTTER }}
            />
            {chords.map((c) => (
              <button
                key={`tok-${c.position}`}
                onClick={() => onSelectToken?.(c.position)}
                className="shrink-0 px-1 pb-1"
                style={{ width: COL_W }}
              >
                <span
                  className={`toy-chip block truncate px-2 py-1.5 text-[11px] font-bold lowercase text-[#1e1b3a] ${
                    selectedPosition === c.position
                      ? 'bg-[#ef8a9a]'
                      : 'bg-[#9b8cc4]'
                  }`}
                >
                  {c.text.trim() || c.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};