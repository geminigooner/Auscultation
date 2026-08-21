export interface Note {
  id: string;
  pitch: string; // e.g. "C5", "A4", "G4", "E4", "D4", "C4", "A3", "G3"
  midi: number;
  step: number; // 0 to totalSteps - 1
  duration: number; // in steps (1 = 1 step)
  velocity: number; // 0.1 to 1.0
}

export type SoundPreset = 'toy-box' | 'heart-pulse' | 'music-box' | 'chiptune' | 'marimba';

export interface SoundPresetConfig {
  id: SoundPreset;
  name: string;
  type: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'custom';
  description: string;
}

export interface SequencerState {
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
  totalSteps: number;
  soundPreset: SoundPreset;
  volume: number;
  isLooping: boolean;
  selectedNoteId: string | null;
  cutoff: number;
  resonance: number;
  decay: number;
}
