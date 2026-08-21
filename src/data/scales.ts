/**
 * Pitch helpers. The pitch axis itself is decided in Python (1-D PCA of the
 * SAE decoder directions) and baked into each note's `midi` value, so nothing
 * here assigns pitch — these only convert and label.
 */

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** 60 -> "C4" */
export function midiToName(midi: number): string {
  return NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Lowest and highest midi across a whole score, for sizing the roll's y-axis. */
export function pitchRange(
  chords: { notes: { midi: number }[] }[],
): { min: number; max: number } {
  const all = chords.flatMap((c) => c.notes.map((n) => n.midi));
  if (all.length === 0) return { min: 33, max: 84 };
  return { min: Math.min(...all), max: Math.max(...all) };
}

/** Row labels for the left gutter, one per semitone, high to low. */
export function pitchRows(min: number, max: number): { midi: number; name: string }[] {
  const rows = [];
  for (let m = max; m >= min; m--) rows.push({ midi: m, name: midiToName(m) });
  return rows;
}
