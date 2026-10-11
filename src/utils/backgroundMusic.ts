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
    this.audio.preload = 'auto';
    this.audio.volume = this.isMuted ? 0 : this.volume;
  }

  private handleGesture = () => {
    // Must call play() synchronously inside the gesture handler (iOS/Android rule)
    this.audio?.play()
      .then(() => this.unbindGesture())
      .catch(() => {
        // Still blocked — keep listeners armed for the next gesture
      });
  };

  private bindGesture() {
    if (this.gestureBound) return;
    this.gestureBound = true;
    window.addEventListener('pointerdown', this.handleGesture);
    window.addEventListener('touchend', this.handleGesture);
    window.addEventListener('click', this.handleGesture);
    window.addEventListener('keydown', this.handleGesture);
  }

  private unbindGesture() {
    if (!this.gestureBound) return;
    this.gestureBound = false;
    window.removeEventListener('pointerdown', this.handleGesture);
    window.removeEventListener('touchend', this.handleGesture);
    window.removeEventListener('click', this.handleGesture);
    window.removeEventListener('keydown', this.handleGesture);
  }

  public start() {
    this.init();
    if (!this.audio) return;
    // Mobile/tablet block autoplay — arm gesture unlock immediately, not after a failed play()
    this.bindGesture();
    // Desktop autoplay attempt (works when policy allows)
    const kick = () => {
      this.audio?.play()
        .then(() => this.unbindGesture())
        .catch(() => {
          // Blocked — gesture listeners stay armed
        });
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
