import { assets } from '@/assets';

class BackgroundMusicManager {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.25;
  private gestureBound: boolean = false;

  private init() {
    if (this.audio) return;
    this.audio = new Audio(assets.backgroundMusic);
    this.audio.loop = true;
    this.audio.preload = 'none';
    this.audio.volume = this.isMuted ? 0 : this.volume;
  }

  private bindGestureRetry() {
    if (this.gestureBound) return;
    this.gestureBound = true;
    const resume = () => {
      this.audio?.play().catch(() => {});
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      window.removeEventListener('touchstart', resume);
      this.gestureBound = false;
    };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    window.addEventListener('touchstart', resume);
  }

  public start() {
    this.init();
    if (!this.audio) return;
    // Defer fetch until window load so images get bandwidth first
    const kick = () => {
      this.audio?.play().catch(() => this.bindGestureRetry());
    };
    if (document.readyState === 'complete') {
      kick();
    } else {
      window.addEventListener('load', kick, { once: true });
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.volume = muted ? 0 : this.volume;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio && !this.isMuted) {
      this.audio.volume = this.volume;
    }
  }
}

export const backgroundMusic = new BackgroundMusicManager();
