
import React, { useState } from 'react';
import { UserMatch, Match } from '../types';

interface HistoryPageProps {
  userMatches: UserMatch[];
  allMatches: Match[];
  onBack: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ userMatches, allMatches, onBack }) => {
  const [activeTab, setActiveTab] = useState<'joined' | 'wins'>('joined');

  const joinedMatches = userMatches.filter(m => m.status === 'joined' || m.status === 'lost');
  const winMatches = userMatches.filter(m => m.status === 'won');

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-bebas text-2xl tracking-widest uppercase text-white">My History</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'joined' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-400'}`}
          >
            Joined Matches
          </button>
          <button 
            onClick={() => setActiveTab('wins')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'wins' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-400'}`}
          >
            Winning History
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'joined' && (
            joinedMatches.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-xs">No matches joined yet</div>
            ) : (
              joinedMatches.map(um => {
                const matchDetails = allMatches.find(m => m.id === um.matchId);
                const hasRoom = matchDetails?.roomCode && matchDetails?.roomPassword;
                
                return (
                  <div key={um.id} className="bg-[#1a1a1c] p-5 rounded-2xl border border-white/5 ff-card-glow overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{um.matchTitle}</h4>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{um.matchType}</p>
                      </div>
                      <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">{um.startTime}</span>
                    </div>

                    {/* Room Code & Password Section */}
                    <div className={`mt-4 p-4 rounded-xl border ${hasRoom ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black/20 border-white/5'}`}>
                      {hasRoom ? (
                        <div className="flex justify-between items-center">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-[8px] text-orange-500 uppercase font-black">Room Code</p>
                              <p className="text-sm font-black text-white tracking-widest">{matchDetails.roomCode}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-orange-500 uppercase font-black">Password</p>
                              <p className="text-sm font-black text-white tracking-widest">{matchDetails.roomPassword}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center animate-pulse">
                            <span className="text-xs">🔑</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Room Info Waiting...</p>
                          <p className="text-[8px] text-gray-600 mt-1 uppercase">Matches start on time. check back soon!</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 bg-black/40 p-3 rounded-xl">
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase font-black">My UID</p>
                        <p className="text-xs font-bold text-white">{um.uid}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase font-black">In-Game Name</p>
                        <p className="text-xs font-bold text-white truncate">{um.gameName}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}

          {activeTab === 'wins' && (
            winMatches.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-xs">No wins recorded yet</div>
            ) : (
              winMatches.map(m => (
                <div key={m.id} className="bg-[#1a1a1c] p-5 rounded-2xl border border-green-500/30 ff-card-glow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-black px-3 py-1 text-[8px] font-black uppercase rounded-bl-xl">Winner</div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{m.matchTitle}</h4>
                      <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Victory</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase font-black">Prize Received</p>
                      <p className="text-xl font-black text-green-400">{m.prizeWon || '500 BDT'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-500 uppercase font-black">Date</p>
                      <p className="text-[10px] font-bold text-gray-400">{new Date(m.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
