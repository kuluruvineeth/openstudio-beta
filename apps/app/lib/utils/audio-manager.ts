class AudioManager {
  private audioElement: HTMLAudioElement | null = null;

  initialize(): HTMLAudioElement | null {
    if (this.audioElement) return this.audioElement;

    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      return this.audioElement;
    }

    return null;
  }

  getAudio(): HTMLAudioElement | null {
    return this.audioElement;
  }

  getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  getProgress(): number {
    if (!this.audioElement || !this.audioElement.duration) return 0;
    return (this.audioElement.currentTime / this.audioElement.duration) * 100;
  }

  setAudioSource(url: string): void {
    if (this.audioElement) {
      this.audioElement.src = url;
      this.audioElement.load();
    }
  }

  play(): Promise<void> | undefined {
    return this.audioElement?.play();
  }

  pause(): void {
    // biome-ignore lint/correctness/noVoidTypeReturn: <explanation>
    return this.audioElement?.pause();
  }

  skipForward(seconds = 10): void {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.min(
        this.audioElement.duration || 0,
        this.audioElement.currentTime + seconds
      );
    }
  }

  skipBackward(seconds = 10): void {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(
        0,
        this.audioElement.currentTime - seconds
      );
    }
  }
}

export const audioManager = new AudioManager();
