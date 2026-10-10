/**
 * Web Audio API synthesizer for realistic physical book page-turning sound.
 * No external audio files needed; guarantees 100% offline reliability.
 */

class PageSoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Synthesize a tactile, crisp page turn / leaf flip sound
   */
  public playPageTurnSound() {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.32;

      // 1. Generate white noise buffer for paper friction texture
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Pinkish noise curve with slight textural modulation for fiber texture
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut * 0.7) + (white * 0.3);
        const textureFlutter = 1 + 0.15 * Math.sin((i / sampleRate) * 180);
        data[i] = lastOut * textureFlutter;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // 2. High-pass filter to remove rumble
      const hpf = this.ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(320, now);

      // 3. Bandpass filter to sculpt the silk/matte paper swoosh
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.Q.setValueAtTime(1.4, now);
      bpf.frequency.setValueAtTime(1600, now);
      bpf.frequency.exponentialRampToValueAtTime(650, now + duration);

      // 4. Amplitude Envelope
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.8, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.3, now + 0.16);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // 5. Connect and play
      noiseSource.connect(hpf);
      hpf.connect(bpf);
      bpf.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // Audio playback fails silently if browser blocks autoplay
    }
  }
}

export const pageSound = new PageSoundManager();
