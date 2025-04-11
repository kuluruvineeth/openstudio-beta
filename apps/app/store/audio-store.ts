import { audioManager } from '@/lib/utils/audio-manager';
import { create } from 'zustand';

export interface AudioInfo {
  id: string;
  title: string;
  voice: string | null;
  audioUrl: string;
  duration?: string;
  progress?: number;
  createdAt?: string;
  service?: string;
}

interface AudioState {
  currentAudio: AudioInfo | null;
  isPlaying: boolean;
  isPlaybarOpen: boolean;
  progress: number;
  duration: string;

  setCurrentAudio: (audio: AudioInfo) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPlaybarOpen: (isOpen: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: string) => void;

  playAudio: (audio: AudioInfo) => void;
  togglePlayPause: () => void;
  togglePlaybar: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  downloadAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  isPlaying: false,
  isPlaybarOpen: false,
  progress: 50,
  duration: '0:00',

  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsPlaybarOpen: (isPlaybarOpen) => set({ isPlaybarOpen }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  playAudio: (audio) => {
    const current = get().currentAudio;

    const audioElement = audioManager.initialize();

    if (current && current.audioUrl === audio.audioUrl) {
      get().togglePlayPause();
      return;
    }

    set({
      currentAudio: audio,
      isPlaybarOpen: true,
      isPlaying: true,
    });

    if (audioElement) {
      setTimeout(() => {
        audioManager.setAudioSource(audio.audioUrl);
        audioManager.play()?.catch((err) => {
          console.error(`Error playing audio: ${err}`);
          set({ isPlaying: false });
        });
      }, 0);
    }
  },

  togglePlayPause: () => {
    const isPlaying = get().isPlaying;
    const audio = audioManager.getAudio();

    if (!audio || !get().currentAudio) return;

    if (isPlaying) {
      audioManager.pause();
      set({ isPlaying: false });
    } else {
      if (!audio.src && get().currentAudio?.audioUrl) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        audioManager.setAudioSource(get().currentAudio!.audioUrl);
      }

      audioManager.play()?.catch((err) => {
        console.error(`Error playing audio: ${err}`);
      });
      set({ isPlaying: true });
    }
  },

  togglePlaybar: () => set({ isPlaybarOpen: !get().isPlaybarOpen }),

  skipForward: () => {
    audioManager.skipForward();
  },

  skipBackward: () => {
    audioManager.skipBackward();
  },

  downloadAudio: () => {
    const audio = get().currentAudio;
    if (!audio?.audioUrl) return;

    const link = document.createElement('a');
    link.href = audio.audioUrl;
    link.download = `${audio.title || 'audio'}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
}));
