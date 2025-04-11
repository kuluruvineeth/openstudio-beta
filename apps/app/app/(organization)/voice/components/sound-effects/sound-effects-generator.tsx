'use client';

import { useAudioStore } from '@/store/audio-store';
import { useState } from 'react';
import { BiDoorOpen } from 'react-icons/bi';
import {
  IoAirplaneOutline,
  IoCarSportOutline,
  IoHardwareChipOutline,
  IoLeafOutline,
  IoPeopleOutline,
  IoThunderstormOutline,
  IoWaterOutline,
} from 'react-icons/io5';
import { GenerateButton } from '../generate-button';

const MAX_CHARS = 500;

export function SoundEffectsGenerator({ credits }: { credits: number }) {
  const [textContent, setTextContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState(
    'Describe your sound effect and then click generate...'
  );
  const [loading, setLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const { playAudio } = useAudioStore();

  const isTextEmpty = textContent.trim() === '';

  //   const handleGenerateSoundEffect = async () => {
  //     if (isTextEmpty) return;

  //     try {
  //       setLoading(true);
  //       const { audioId, shouldShowThrottleAlert } =
  //         await generateSoundEffect(textContent);
  //       if (shouldShowThrottleAlert) {
  //         toast('Exceeding 3 requests per minute will queue your requests.', {
  //           icon: '⏳',
  //         });
  //       }
  //       setCurrentAudioId(audioId);
  //     } catch (error) {
  //       console.error('Error generating sound effect: ', error);
  //       setLoading(false);
  //     }
  //   };

  const templateTexts = {
    'Car engine revving':
      'A powerful sports car engine revving up, starting low and building to a high-pitched roar with the sound of turbocharger spooling',
    'Heavy rainstorm':
      'Heavy rain pouring down with occasional thunder in the background, rain hitting windows and roof',
    'Forest ambience':
      'Peaceful forest sounds with birds chirping, leaves rustling in the wind, and a small stream flowing nearby',
    'Stadium crowd cheering':
      'A large stadium crowd erupting in cheers and applause after a goal or touchdown, with whistles and horns',
    'Ocean waves':
      'Ocean waves crashing against a rocky shore, with the rhythmic sound of water rushing in and receding',
    'Robot sounds':
      'Futuristic robot powering up with mechanical servo sounds, beeps, and electronic processing noises',
    'Creaky door':
      'Old wooden door slowly opening with an eerie creak, hinges squeaking in a haunted house',
    'Helicopter flyby':
      'Helicopter approaching from a distance, passing overhead with loud rotor blades, then flying away',
  };

  //   useEffect(() => {
  //     if (!currentAudioId || !loading) return;

  //     const pollInterval = setInterval(async () => {
  //       try {
  //         const status = await generationStatus(currentAudioId);

  //         if (status.success && status.audioUrl) {
  //           clearInterval(pollInterval);
  //           setLoading(false);

  //           const newAudio = {
  //             id: currentAudioId,
  //             title:
  //               textContent.substring(0, 50) +
  //               (textContent.length > 50 ? '...' : ''),
  //             audioUrl: status.audioUrl,
  //             voice: '',
  //             duration: '0:30',
  //             progress: 0,
  //             service: 'make-an-audio',
  //             createdAt: new Date().toLocaleDateString(),
  //           };

  //           playAudio(newAudio);
  //           setCurrentAudioId(null);
  //         } else if (!status.success) {
  //           clearInterval(pollInterval);
  //           setLoading(false);
  //           setCurrentAudioId(null);
  //           console.error('Sound effect generation failed');
  //         }
  //       } catch (error) {
  //         console.error('Error polling for audio status: ' + error);
  //         clearInterval(pollInterval);
  //         setLoading(false);
  //         setCurrentAudioId(null);
  //       }
  //     }, 500);

  //     return () => {
  //       clearInterval(pollInterval);
  //     };
  //   }, [currentAudioId, loading, playAudio, textContent]);

  return (
    <>
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div className="relative flex h-full w-full flex-col items-center">
        <div className="-translate-y-1/2 absolute top-1/2 right-0 left-0 transform">
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div
            className="h-[200px] w-full bg-gradient-to-r from-teal-300 via-blue-300 to-teal-300 opacity-20 blur-[70px]"
            style={{ animation: 'gradientMove 20s ease infinite' }}
          ></div>
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center gap-10 md:pt-20">
          <div
            className={`h-fit w-full max-w-2xl rounded-xl border bg-white p-4 shadow-xl transition-colors duration-200 ${isFocused ? 'border-black' : 'border-gray-200'}`}
          >
            <div className="flex flex-col">
              <textarea
                value={textContent}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= MAX_CHARS) {
                    setTextContent(text);
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={MAX_CHARS}
                placeholder={activePlaceholder}
                className="h-16 resize-none rounded-md p-2 placeholder:font-light placeholder:text-gray-500 focus:border-none focus:outline-none focus:ring-0"
              />
              <div className="mt-1 flex w-full justify-end">
                <span className="text-gray-400 text-xs">
                  {textContent.length}/{MAX_CHARS}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <GenerateButton
                  onGenerate={() => {}}
                  isDisabled={isTextEmpty || loading}
                  isLoading={loading}
                  buttonText="Generate Sound Effect"
                  showDownload={false}
                  creditsRemaining={credits}
                  fullWidth={false}
                />
              </div>
            </div>
          </div>

          <div className="h-fit w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <p className="mb-2 text-center text-gray-500 text-sm">
              Try a sound'effect examplegray-500sm'
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { text: 'Car engine revving', icon: <IoCarSportOutline /> },
                { text: 'Heavy rainstorm', icon: <IoThunderstormOutline /> },
                { text: 'Forest ambience', icon: <IoLeafOutline /> },
                { text: 'Stadium crowd cheering', icon: <IoPeopleOutline /> },
                { text: 'Ocean waves', icon: <IoWaterOutline /> },
                { text: 'Robot sounds', icon: <IoHardwareChipOutline /> },
                { text: 'Creaky door', icon: <BiDoorOpen /> },
                { text: 'Helicopter flyby', icon: <IoAirplaneOutline /> },
              ].map(({ text, icon }) => (
                // biome-ignore lint/a11y/useButtonType: <explanation>
                <button
                  className="flex items-center rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs hover:bg-gray-50"
                  key={text}
                  onMouseEnter={() =>
                    setActivePlaceholder(
                      templateTexts[text as keyof typeof templateTexts]
                    )
                  }
                  onMouseLeave={() =>
                    setActivePlaceholder(
                      'Describe your sound effect and then click generate...'
                    )
                  }
                  onClick={() => {
                    const content =
                      templateTexts[text as keyof typeof templateTexts];
                    if (content.length <= MAX_CHARS) {
                      setTextContent(content);
                    } else {
                      setTextContent(content.substring(0, MAX_CHARS));
                    }
                  }}
                >
                  <span className="mr-2 text-gray-500">{icon}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
