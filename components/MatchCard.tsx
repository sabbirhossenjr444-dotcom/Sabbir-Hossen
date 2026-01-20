
import React, { useState } from 'react';
import { Match, MatchType, UserMatch } from '../types';

interface MatchCardProps {
  match: Match;
  participants: UserMatch[];
  currentUserMobile?: string;
  onJoin: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, participants, currentUserMobile, onJoin }) => {
  const [showPlayers, setShowPlayers] = useState(false);
  const isFull = match.filledSlots >= match.totalSlots;
  const progress = (match.filledSlots / match.totalSlots) * 100;
  
  const isStartingSoon = match.id.includes('dynamic-0') || match.id.includes('dynamic-1');
  const hasRoomInfo = match.roomCode && match.roomPassword;
  const isJoined = participants.some(p => p.userMobile === currentUserMobile);

  return (
    <div className="bg-[#1a1a1c] rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all group ff-card-glow relative flex flex-col">
      <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-orange-500 border border-orange-500/30">
        MATCH #{String(match.matchNumber).padStart(3, '0')}
      </div>

      {isStartingSoon && !hasRoomInfo && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded text-[10px] font-bold animate-pulse shadow-lg">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          STARTING SOON
        </div>
      )}

      {hasRoomInfo && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-green-600 px-2 py-1 rounded text-[10px] font-black shadow-lg">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          ROOM OPEN
        </div>
      )}
      
      <div className="relative h-40 w-full overflow-hidden bg-[#0d0d0e] flex items-center justify-center border-b border-white/5 p-4 flex-shrink-0">
        <div className="absolute inset-0 ff-gradient opacity-5 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-28 h-28 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,78,80,0.4)]">
          <img 
            src="./logo.png" 
            alt="Strongest League Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a1a1c] to-transparent"></div>
        
        <div className="absolute bottom-2 left-2 flex gap-2 z-10">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${match.type === MatchType.BATTLE_ROYALE ? 'bg-orange-600' : 'bg-blue-600'}`}>
            {match.type}
          </span>
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">
            {match.format}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold truncate mb-2 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{match.title}</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Entry Fee</p>
            <p className="font-bold text-orange-400 tracking-tight">{match.entryFee}</p>
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Prize Pool</p>
            <p className="font-bold text-green-400 tracking-tight">{match.prizePool}</p>
          </div>
        </div>

        {/* Room Info Display - Always Visible */}
        <div className={`mb-4 rounded-xl p-3 flex justify-between items-center transition-all ${hasRoomInfo ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-black/40 border border-white/5 opacity-60'}`}>
          <div className="flex gap-4">
            <div>
              <p className="text-[8px] text-orange-500 uppercase font-black tracking-widest">Room ID</p>
              <p className="text-sm font-black text-white tracking-widest leading-none">
                {match.roomCode || 'WAITING...'}
              </p>
            </div>
            <div className="border-l border-white/10 pl-4">
              <p className="text-[8px] text-orange-500 uppercase font-black tracking-widest">Password</p>
              <p className="text-sm font-black text-white tracking-widest leading-none">
                {match.roomPassword || 'WAITING...'}
              </p>
            </div>
          </div>
          <div className={`text-xl ${hasRoomInfo ? 'animate-bounce' : 'grayscale opacity-30'}`}>🎮</div>
        </div>

        {/* Progress & Members Toggle */}
        <div className="mb-4">
          <div className="flex justify-between items-end text-[11px] mb-1">
            <div className="flex flex-col">
              <span className="text-gray-400">Total Joined</span>
              <span className={`font-semibold ${isFull ? 'text-red-500' : 'text-gray-200'}`}>{participants.length}/{match.totalSlots}</span>
            </div>
            <button 
              onClick={() => setShowPlayers(!showPlayers)}
              className="text-[9px] font-black uppercase text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
            >
              {showPlayers ? 'Hide List' : 'View Players'}
              <svg className={`w-3 h-3 transition-transform ${showPlayers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-red-500' : 'bg-orange-500'}`} 
              style={{ width: `${(participants.length / match.totalSlots) * 100}%` }}
            />
          </div>
        </div>

        {/* Real-time Members List - Expandable */}
        {showPlayers && (
          <div className="mb-4 max-h-40 overflow-y-auto custom-scrollbar bg-black/40 rounded-xl border border-white/5 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {participants.length === 0 ? (
              <p className="text-[9px] text-gray-500 font-bold text-center uppercase py-2">No players joined yet</p>
            ) : (
              participants.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between text-[10px] font-bold text-gray-300 bg-white/5 px-2 py-1.5 rounded-lg border border-transparent hover:border-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 font-black">{idx + 1}.</span>
                    <span className={`truncate max-w-[100px] ${p.userMobile === currentUserMobile ? 'text-orange-500' : ''}`}>
                      {p.gameName}
                    </span>
                    {p.userMobile === currentUserMobile && (
                      <span className="text-[7px] bg-orange-500 text-black px-1 rounded font-black">YOU</span>
                    )}
                  </div>
                  <span className="font-mono text-gray-500 text-[8px]">{p.uid.slice(0, 3)}****{p.uid.slice(-2)}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Start Time</span>
            <span className="text-xs font-bold text-white tracking-wide">{match.startTime}</span>
          </div>
          <button
            onClick={() => onJoin(match)}
            disabled={isFull || isJoined}
            className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all whitespace-nowrap uppercase tracking-widest ${
              isJoined
                ? 'bg-green-600/20 text-green-500 border border-green-500/30 cursor-default'
                : isFull 
                  ? 'bg-gray-800 cursor-not-allowed text-gray-500' 
                  : 'ff-gradient text-black hover:shadow-[0_0_20px_rgba(255,78,80,0.4)] active:scale-95'
            }`}
          >
            {isJoined ? 'JOINED' : isFull ? 'FULL' : 'JOIN NOW'}
          </button>
        </div>
      </div>
    </div>
  );
};
