
import React, { useState } from 'react';
import { Match } from '../types';

interface JoinMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
  onConfirm: (uid: string, gameName: string) => void;
}

export const JoinMatchModal: React.FC<JoinMatchModalProps> = ({ isOpen, match, onClose, onConfirm }) => {
  const [uid, setUid] = useState('');
  const [gameName, setGameName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!uid.trim() || !gameName.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^\d+$/.test(uid)) {
      setError('UID must be numeric.');
      return;
    }

    onConfirm(uid, gameName);
    setUid('');
    setGameName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#1a1a1c] w-full max-w-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl ff-card-glow">
        <div className="ff-gradient p-5 flex justify-between items-center">
          <div>
            <h2 className="text-black font-bebas text-2xl tracking-wider leading-none">JOIN TOURNAMENT</h2>
            <p className="text-black/70 text-[10px] font-bold uppercase mt-1">{match.title}</p>
          </div>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black">Entry Fee</p>
              <p className="text-lg font-black text-orange-500">{match.entryFee}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-black">Match Time</p>
              <p className="text-sm font-bold text-white">{match.startTime}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center font-bangla">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Free Fire UID</label>
            <input 
              type="text" 
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Ex: 123456789"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Game ID Name</label>
            <input 
              type="text" 
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Ex: BD_WARRIOR_01"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-bold"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full ff-gradient py-4 rounded-xl font-black text-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-transform">
              CONFIRM REGISTRATION
            </button>
            <p className="text-[9px] text-gray-500 text-center mt-4 font-bold uppercase tracking-tighter">
              By clicking confirm, the entry fee will be deducted from your wallet.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
