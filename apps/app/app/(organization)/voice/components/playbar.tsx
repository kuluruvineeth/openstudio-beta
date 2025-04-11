'use client';

import { audioManager } from '@/lib/utils/audio-manager';
import { useAudioStore } from '@/store/audio-store';
import { useVoiceStore } from '@/store/voice-store';
import { useEffect } from 'react';
import {
  IoChevronDown,
  IoDownloadOutline,
  IoPause,
  IoPlay,
  IoTimeOutline,
} from 'react-icons/io5';
import { RiForward10Fill, RiReplay10Fill } from 'react-icons/ri';

export default function Playbar() {
  const {
    currentAudio,
    isPlaybarOpen,
    isPlaying,
    progress,
    duration,
    togglePlaybar,
    togglePlayPause,
    skipForward,
    skipBackward,
    downloadAudio,
    setIsPlaying,
    setProgress,
    setDuration,
  } = useAudioStore();

  const getVoices = useVoiceStore((state) => state.getVoices);

  useEffect(() => {
    if (!currentAudio) return;

    const audio = audioManager.initialize();
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentProgress = audioManager.getProgress();
      setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
      const durationTime = audioManager.getDuration();
      const formattedDuration = formatTime(durationTime);
      setDuration(formattedDuration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudio, setDuration, setIsPlaying, setProgress]);

  const styleTTS2Voices = getVoices('openstudio/voice-api');
  const seedVCVoices = getVoices('openstudio/seed-vc-api');
  const allVoices = [...styleTTS2Voices, ...seedVCVoices];
  const voice = allVoices.find((v) => v.id === currentAudio?.voice);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTimeFormatted = () => {
    return formatTime(audioManager.getCurrentTime());
  };

  return (
    <>
      {!isPlaybarOpen && (
        // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          onClick={togglePlaybar}
          className="-translate-x-1/2 absolute bottom-2 left-1/2 z-10 transform cursor-pointer"
        >
          <div className="flex h-1 w-96 items-center rounded-full bg-gray-300">
            {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
            <div
              className="h-1 rounded-full bg-black"
              style={{ width: `${progress === 0 ? 100 : progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* biome-ignore lint/style/noUnusedTemplateLiteral: <explanation> */}
      <div className={`relative border-gray-200 border-t bg-white shadow-md`}>
        <div className="absolute top-0 left-0 h-0.5 w-full bg-gray-200 md:hidden">
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div
            className="absolute h-0.5 bg-black"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div
          className="transition-all duration-300 ease-in-out"
          style={{
            height: isPlaybarOpen ? '80px' : '0px',
          }}
        >
          <div className="hidden h-full md:grid md:grid-cols-[25%_50%_25%]">
            {/* Left section */}
            <div className="flex items-center px-4">
              <div className="flex flex-col gap-1">
                <p className="max-w-xs truncate text-sm">
                  {currentAudio?.title}
                </p>
                <div className="flex items-center text-gray-400 text-xs">
                  {voice && (
                    // biome-ignore lint/complexity/noUselessFragments: <explanation>
                    <>
                      <div className="flex items-center">
                        <div
                          className="mr-1 flex h-3 w-3 items-center justify-center rounded-full text-white"
                          style={{ background: voice.gradientColors }}
                        />
                        <span>{voice.name}</span>
                        <span className="mx-1">·</span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center">
                    <IoTimeOutline className="mr-1 h-3 w-3" />
                    <span>{currentAudio?.createdAt || 'Just now'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center section */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-3">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={skipBackward}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <RiReplay10Fill className="h-5 w-5" />
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={togglePlayPause}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
                >
                  {isPlaying ? (
                    <IoPause className="h-5 w-5" />
                  ) : (
                    <IoPlay className="ml-0.5 h-5 w-5" />
                  )}
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={skipForward}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <RiForward10Fill className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-1 flex w-full items-center">
                <span className="mr-2 text-gray-400 text-xs">
                  {getCurrentTimeFormatted()}
                </span>
                <div className="relative flex-1">
                  <div className="h-1 rounded-full bg-gray-200">
                    <div
                      className="absolute h-1 rounded-full bg-black"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="ml-2 text-gray-400 text-xs">{duration}</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center justify-end gap-4 px-6">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={downloadAudio}
                className="rounded-full p-1.5 hover:bg-gray-100"
              >
                <IoDownloadOutline className="h-5 w-5" />
              </button>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={togglePlaybar}
                className="rounded-full p-1.5 hover:bg-gray-100"
              >
                <IoChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile view */}
          <div className="flex h-full md:hidden">
            <div className="flex flex-1 items-center px-4">
              <div className="flex w-full flex-col gap-1">
                <p className="truncate text-sm">{currentAudio?.title}</p>

                <div className="flex items-center text-gray-400 text-xs">
                  {voice && (
                    // biome-ignore lint/complexity/noUselessFragments: <explanation>
                    <>
                      <div className="flex items-center">
                        <div
                          className="mr-1 flex h-3 w-3 items-center justify-center rounded-full text-white"
                          style={{ background: voice.gradientColors }}
                        />
                        <span>{voice.name}</span>
                        <span className="mx-1">·</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center">
                    <IoTimeOutline className="mr-1 h-3 w-3" />
                    <span>{currentAudio?.createdAt || 'Just now'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={downloadAudio}
                className="rounded-full p-1.5 hover:bg-gray-100"
              >
                <IoDownloadOutline className="h-5 w-5" />
              </button>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={togglePlayPause}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
              >
                {isPlaying ? (
                  <IoPause className="h-5 w-5" />
                ) : (
                  <IoPlay className="ml-0.5 h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
