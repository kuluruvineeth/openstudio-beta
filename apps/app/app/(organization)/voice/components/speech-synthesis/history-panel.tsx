// 'use client';

// import { IoDownloadOutline, IoPlay } from 'react-icons/io5';
// import { HistoryItem as HistoryItemType } from '~/lib/history';
// import { useAudioStore } from '@/store/audio-store';
// import { useVoiceStore, type Voice } from '@/store/voice-store';
// import type { ServiceType } from '@/types/services';

// export function HistoryPanel({
//   service,
//   searchQuery,
//   setSearchQuery,
//   hoveredItem,
//   setHoveredItem,
//   historyItems,
// }: {
//   service: ServiceType;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   hoveredItem: string | null;
//   setHoveredItem: (id: string | null) => void;
//   historyItems?: HistoryItemType[];
// }) {
//   const { playAudio } = useAudioStore();
//   const getVoices = useVoiceStore((state) => state.getVoices);
//   const voices = getVoices(service);

//   const handlePlayHistoryItem = (item: HistoryItemType) => {
//     if (item.audioUrl) {
//       playAudio({
//         id: item.id.toString(),
//         title: item.title,
//         voice: item.voice,
//         audioUrl: item.audioUrl,
//         service: item.service,
//       });
//     }
//   };

//   return (
//     <div className="flex h-full w-full flex-col">
//       <div className="w-full flex-shrink-0">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search history..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
//           />
//         </div>
//       </div>

//       {historyItems && historyItems.length > 0 ? (
//         <div className="mt-2 flex h-[100vh] w-full flex-col overflow-y-auto">
//           {/* Filter history items based on search */}
//           {(() => {
//             const filteredGroups = Object.entries(
//               historyItems
//                 .filter(
//                   (item) =>
//                     item.title
//                       .toLowerCase()
//                       .includes(searchQuery.toLowerCase()) ||
//                     voices
//                       .find((voice) => voice.id === item.voice)
//                       ?.name.toLowerCase()
//                       .includes(searchQuery.toLowerCase())
//                 )
//                 .reduce((groups: Record<string, typeof historyItems>, item) => {
//                   const date = item.date;
//                   if (!groups[date]) {
//                     groups[date] = [];
//                   }
//                   groups[date].push(item);
//                   return groups;
//                 }, {})
//             );

//             // Show no results found when filtered results are empty
//             return filteredGroups.length > 0 ? (
//               filteredGroups.map(([date, items], groupIndex) => (
//                 <div key={date}>
//                   <div className="sticky top-0 z-10 my-2 flex w-full justify-center bg-white py-1">
//                     <div className="rounded-full bg-gray-100 px-3 py-1 text-xs">
//                       {date}
//                     </div>
//                   </div>

//                   {items.map((item) => (
//                     <HistoryItem
//                       key={item.id}
//                       item={item}
//                       voices={voices}
//                       hoveredItem={hoveredItem}
//                       setHoveredItem={setHoveredItem}
//                       onPlay={handlePlayHistoryItem}
//                     />
//                   ))}
//                 </div>
//               ))
//             ) : (
//               <p className="mt-8 text-center text-sm text-gray-500">
//                 No results found
//               </p>
//             );
//           })()}
//         </div>
//       ) : (
//         <div className="flex h-full flex-col items-center justify-center text-center">
//           <p className="mt-3 text-sm text-gray-500">No history items yet</p>
//         </div>
//       )}
//     </div>
//   );
// }

// function HistoryItem({
//   item,
//   voices,
//   hoveredItem,
//   setHoveredItem,
//   onPlay,
// }: {
//   item: HistoryItemType;
//   voices: Voice[];
//   hoveredItem: string | null;
//   setHoveredItem: (id: string | null) => void;
//   onPlay: (item: HistoryItemType) => void;
// }) {
//   const voiceUsed =
//     voices.find((voice) => voice.id === item.voice) || voices[0]!;

//   return (
//     <div
//       onMouseEnter={() => setHoveredItem(item.id)}
//       onMouseLeave={() => setHoveredItem(null)}
//       className="relative flex items-center rounded-lg p-4 hover:bg-gray-100"
//     >
//       <div className="flex w-full flex-col gap-1">
//         <div className="relative w-full">
//           <p className="truncate text-sm">{item.title || 'No title'}</p>
//           {hoveredItem === item.id && (
//             <div className="absolute right-0 top-0 flex items-center gap-1 bg-gray-100 pl-2">
//               <button
//                 onClick={() => onPlay(item)}
//                 className="rounded-full p-1 hover:bg-gray-200"
//               >
//                 <IoPlay className="h-5 w-5" />
//               </button>
//               <button className="rounded-full p-1 hover:bg-gray-200">
//                 <IoDownloadOutline className="h-5 w-5" />
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center space-x-1">
//           <div
//             className="flex h-3 w-3 items-center justify-center rounded-full text-xs text-white"
//             style={{ background: voiceUsed.gradientColors }}
//           ></div>
//           <span className="text-xs font-light text-gray-500">
//             {voiceUsed.name}
//           </span>
//           <span className="text-xs font-light text-gray-500">·</span>
//           <span className="text-xs font-light text-gray-500">
//             {item.time || 'now'}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
