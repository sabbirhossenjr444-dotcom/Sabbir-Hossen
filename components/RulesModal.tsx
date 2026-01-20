
import React from 'react';
import { RULES } from '../constants';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1c] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="ff-gradient p-4 flex justify-between items-center">
          <h2 className="text-black font-bebas text-2xl tracking-wider">Tournament Rules ⚠️</h2>
          <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <ul className="space-y-4 font-bangla">
            {RULES.map((rule, idx) => (
              <li key={idx} className="flex gap-3 text-gray-200">
                <span className="bg-orange-500/20 text-orange-500 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 font-bold text-xs">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={onClose}
            className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
};
