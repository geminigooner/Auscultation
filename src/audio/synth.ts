import { SoundPreset } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  public playNote(
    midi: number,
    velocity: number = 0.8,
    preset: SoundPreset = 'toy-box',
    durationSec: number = 0.25,
    cutoff: number = 2000,
    resonance: number = 2
  ) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freq = this.midiToFreq(midi);

    if (preset === 'heart-pulse') {
      // Auscultation lub-dub pulse acoustic simulation
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(cutoff, 350), now);
      filter.Q.setValueAtTime(resonance * 2, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.2), now + durationSec);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(velocity * 0.9, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + durationSec + 0.05);
      return;
    }

    if (preset === 'toy-box' || preset === 'music-box') {
      // Rich toy bell with FM harmonics
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(resonance, now);

      carrier.type = preset === 'toy-box' ? 'triangle' : 'sine';
      carrier.frequency.setValueAtTime(freq, now);

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(freq * (preset === 'toy-box' ? 2.5 : 3.0), now);

      modGain.gain.setValueAtTime(freq * 1.2 * velocity, now);
      modGain.gain.exponentialRampToValueAtTime(0.01, now + durationSec * 0.8);

      modulator.connect(carrier.frequency);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.7, now + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      carrier.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      modulator.start(now);
      carrier.start(now);
      modulator.stop(now + durationSec + 0.05);
      carrier.stop(now + durationSec + 0.05);
      return;
    }

    if (preset === 'chiptune') {
      // Playful 8-bit square wave
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + durationSec + 0.05);
      return;
    }

    // Marimba default
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(velocity * 0.8, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  }

  public playClick(high: boolean = false) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(high ? 880 : 440, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundEngine = new SoundEngine();
