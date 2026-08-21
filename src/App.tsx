/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PianoRoll } from './components/PianoRoll';
import { demoScore } from './data/demoScore';

export default function App() {
  const [selected, setSelected] = React.useState<number | null>(null);
  const score = demoScore;
  const { config } = score;

  return (
    <div className="min-h-dvh bg-[#1e1b3a] p-3 flex flex-col gap-3">
      {/* score bar */}
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
          {score.chords.length} tokens
        </span>
      </div>

      <PianoRoll
        score={score}
        playhead={0}
        selectedPosition={selected}
        onSelectToken={setSelected}
      />

      {/* render config — placeholder until the settings drawer exists */}
      <div className="toy-panel-purple px-3 py-2 flex flex-wrap gap-1.5">
        {[
          `${config.model}`,
          `layer ${config.layer}`,
          `sae ${config.saeWidth}`,
          `top-k ${config.topK}`,
          `${config.scale}`,
          `${config.tokensPerSecond} tok/sec`,
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
