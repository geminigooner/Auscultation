/**
 * Auscultation — data model.
 *
 * The unit of this app is a SCORE: one forward pass through Gemma-2,
 * decomposed by a sparse autoencoder. One token = one chord.
 * One note = one SAE feature that fired at that token.
 *
 * There are no bars, no steps, and no BPM. Time is the token stream.
 */

/** One SAE feature firing at one token. This is a note. */
export interface FeatureNote {
  /** SAE feature index, 0..d_sae. Stable across the whole score. */
  featureId: number;
  /** MIDI pitch, assigned by the 1-D PCA of the decoder directions. */
  midi: number;
  /** Normalised activation, 0..1. Drives note opacity and gain. */
  velocity: number;
  /** Auto-interp label from Neuronpedia, when one exists. Usually absent. */
  label?: string;
}

/** One token position. This is a chord. */
export interface TokenChord {
  /** Position in the sequence, 0-indexed. */
  position: number;
  /** The decoded token string, e.g. " dusk". Whitespace is meaningful. */
  text: string;
  /** Count of features above threshold BEFORE top-k truncation. Always an integer >= 0. */
  l0: number;
  /** The kept voices, sorted by descending velocity. Length <= topK. */
  notes: FeatureNote[];
  /**
   * Cosine similarity of this token's active feature set to the previous
   * token's, 0..1. Drives the length of the slit-scan smear.
   * Absent on position 0.
   */
  overlap?: number;
}

/** How the score was rendered. Shown in the settings drawer, saved with the score. */
export interface ScoreConfig {
  model: string;          // "gemma-2-2b"
  layer: number;          // residual stream layer the SAE was trained on
  saeWidth: string;       // "16k"
  saeL0: number;          // average_l0 of the checkpoint, e.g. 71
  topK: number;           // max voices kept per chord
  scale: string;          // "minor"
  rootMidi: number;       // 33 = A1
  tokensPerSecond: number; // playback rate. NOT bpm.
}

/** One saved render. This is what a shelf card represents. */
export interface Score {
  id: string;
  prompt: string;
  createdAt: string;      // ISO 8601
  config: ScoreConfig;
  chords: TokenChord[];
  /** Free-text note the user writes after listening. The point of the shelf. */
  note?: string;
}

/** Transport state. Owned by the player, not persisted. */
export interface PlaybackState {
  isPlaying: boolean;
  /** Fractional token position of the playhead. 3.5 = halfway through token 3. */
  playhead: number;
  isLooping: boolean;
  volume: number;
  /** Token the inspector drawer is showing, or null if closed. */
  selectedPosition: number | null;
}

/** Timbre. Purely aesthetic — it does not encode any data. */
export type SoundPreset = 'heart-pulse' | 'toy-box' | 'music-box' | 'chiptune' | 'marimba';