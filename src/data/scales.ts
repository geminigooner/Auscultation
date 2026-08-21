import { Note } from '../types';

export interface PitchInfo {
  pitch: string;
  midi: number;
  freq: number;
}

export const DEFAULT_PITCHES: PitchInfo[] = [
  { pitch: 'C5', midi: 72, freq: 523.25 },
  { pitch: 'A4', midi: 69, freq: 440.0 },
  { pitch: 'G4', midi: 67, freq: 392.0 },
  { pitch: 'E4', midi: 64, freq: 329.63 },
  { pitch: 'D4', midi: 62, freq: 293.66 },
  { pitch: 'C4', midi: 60, freq: 261.63 },
  { pitch: 'A3', midi: 57, freq: 220.0 },
  { pitch: 'G3', midi: 55, freq: 196.0 },
];

export const DEMO_PRESETS: { name: string; notes: Note[]; bpm: number }[] = [
  {
    name: 'auscultation rhythm',
    bpm: 110,
    notes: [
      { id: '1', pitch: 'C4', midi: 60, step: 0, duration: 1, velocity: 0.95 },
      { id: '2', pitch: 'G3', midi: 55, step: 1, duration: 1, velocity: 0.7 },
      { id: '3', pitch: 'E4', midi: 64, step: 4, duration: 1, velocity: 0.85 },
      { id: '4', pitch: 'G4', midi: 67, step: 6, duration: 1, velocity: 0.9 },
      { id: '5', pitch: 'C4', midi: 60, step: 8, duration: 1, velocity: 0.95 },
      { id: '6', pitch: 'G3', midi: 55, step: 9, duration: 1, velocity: 0.7 },
      { id: '7', pitch: 'A4', midi: 69, step: 12, duration: 1, velocity: 0.8 },
      { id: '8', pitch: 'C5', midi: 72, step: 14, duration: 1, velocity: 1.0 },
    ],
  },
  {
    name: 'toy music box',
    bpm: 128,
    notes: [
      { id: 't1', pitch: 'C5', midi: 72, step: 0, duration: 1, velocity: 0.9 },
      { id: 't2', pitch: 'G4', midi: 67, step: 2, duration: 1, velocity: 0.75 },
      { id: 't3', pitch: 'E4', midi: 64, step: 4, duration: 1, velocity: 0.8 },
      { id: 't4', pitch: 'A4', midi: 69, step: 6, duration: 1, velocity: 0.85 },
      { id: 't5', pitch: 'G4', midi: 67, step: 8, duration: 1, velocity: 0.9 },
      { id: 't6', pitch: 'D4', midi: 62, step: 10, duration: 1, velocity: 0.7 },
      { id: 't7', pitch: 'C4', midi: 60, step: 12, duration: 2, velocity: 1.0 },
    ],
  },
  {
    name: 'heart pulse dub',
    bpm: 78,
    notes: [
      { id: 'h1', pitch: 'C4', midi: 60, step: 0, duration: 1, velocity: 1.0 },
      { id: 'h2', pitch: 'G3', midi: 55, step: 2, duration: 1, velocity: 0.85 },
      { id: 'h3', pitch: 'C4', midi: 60, step: 8, duration: 1, velocity: 1.0 },
      { id: 'h4', pitch: 'G3', midi: 55, step: 10, duration: 1, velocity: 0.85 },
      { id: 'h5', pitch: 'E4', midi: 64, step: 14, duration: 1, velocity: 0.6 },
    ],
  },
];
