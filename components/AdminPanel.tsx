
import React, { useState, useEffect } from 'react';
import { Transaction, Match, User, MatchType, MatchFormat } from '../types';

interface AdminPanelProps {
  transactions: Transaction[];
  matches: Match[];
  onApprove: (txId: string) => void;
  onReject: (txId: string) => void;
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => void;
  onCreateMatch: (match: Match) => void;
  onUpdateUserBalance: (mobile: string, newBalance: number) => void;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  transactions, 
  matches, 
  onApprove, 
  onReject, 
  onUpdateMatch,
  onCreateMatch,
  onUpdateUserBalance,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'matches' | 'users' | 'create'>('overview');
  const [subTab, setSubTab] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Creating Match
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    matchNumber: matches.length + 1,
    title: '',
    type: MatchType.BATTLE_ROYALE,
    format: MatchFormat.SOLO,
    entryFee: '20 BDT',
    prizePool: '500 BDT',
    startTime: '08:00 PM Today',
    totalSlots: 48,
    filledSlots: 0
  });

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
    setUsers(allUsers);
    // Update match number based on current count
    setNewMatch(prev => ({ ...prev, matchNumber: matches.length + 1 }));
  }, [transactions, activeTab, matches.length]);

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const totalUsers = users.length;
  const activeMatchesCount = matches.length;
  const totalRevenue = transactions
    .filter(t => t.status === 'approved' && t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayout = transactions
    .filter(t => t.status === 'approved' && t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredPending = pendingTransactions.filter(t => {
    if (subTab === 'all') return true;
    return t.type === subTab;
  });

  // Edit Match State
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Match>>({});

  const handleEditClick = (m: Match) => {
    setEditingMatchId(m.id);
    setEditForm({ ...m });
  };

  const handleUpdate = (id: string) => {
    onUpdateMatch(id, editForm);
    setEditingMatchId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `match-${Date.now()}`;
    onCreateMatch({ ...newMatch, id } as Match);
    setActiveTab('matches');
    alert('Match Created Successfully! 🔥');
  };

  const handleAdjustBalance = (mobile: string) => {
    const amountStr = prompt('Enter amount to add (positive) or subtract (negative):');
    if (amountStr === null) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return;

    const user = users.find(u => u.mobile === mobile);
    if (user) {
      onUpdateUserBalance(mobile, user.balance + amount);
      // Update local state for immediate feedback
      setUsers(prev => prev.map(u => u.mobile === mobile ? { ...u, balance: u.balance + amount } : u));
    }
  };

  const filteredUsers = users.filter(u => 
    u.mobile.includes(searchQuery) || u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-4 pb-24 font-inter text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="font-bebas text-3xl tracking-widest leading-none">CONTROL CENTER</h2>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-1">Website Maintenance & Ops</p>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
             <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-xl">
                <p className="text-[8px] font-black uppercase text-orange-500">System Status</p>
                <p className="text-xs font-bold text-green-400">ONLINE</p>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'requests', label: `Requests (${pendingTransactions.length})`, icon: '⏳' },
            { id: 'matches', label: 'Matches', icon: '🎮' },
            { id: 'create', label: 'Add Match', icon: '➕' },
            { id: 'users', label: 'Users', icon: '👥' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-[11px] uppercase transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
            {[
              { label: 'Total Revenue', value: `৳${totalRevenue}`, color: 'text-green-500', icon: '💰' },
              { label: 'Total Payout', value: `৳${totalPayout}`, color: 'text-red-500', icon: '💸' },
              { label: 'Total Players', value: totalUsers, color: 'text-blue-500', icon: '👤' },
              { label: 'Active Matches', value: activeMatchesCount, color: 'text-orange-500', icon: '⚔️' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 ff-card-glow text-center">
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
            <div className="col-span-2 md:col-span-4 bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 mt-4">
               <h3 className="font-bebas text-2xl mb-4 tracking-widest uppercase">Maintenance Tasks</h3>
               <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setActiveTab('requests')}>
                    <p className="font-bold text-sm mb-1">Check Transactions</p>
                    <p className="text-[10px] text-gray-500 uppercase">Handle {pendingTransactions.length} pending requests</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setActiveTab('matches')}>
                    <p className="font-bold text-sm mb-1">Manage Room Info</p>
                    <p className="text-[10px] text-gray-500 uppercase">Update IDs for upcoming matches</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setActiveTab('users')}>
                    <p className="font-bold text-sm mb-1">Audit Balances</p>
                    <p className="text-[10px] text-gray-500 uppercase">Correct player wallet issues</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex gap-2">
                {(['all', 'deposit', 'withdraw'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => setSubTab(type)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${subTab === type ? 'bg-orange-500 text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid gap-4">
                {filteredPending.length === 0 ? (
                  <div className="text-center py-24 bg-[#1a1a1c] rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">All caught up! No pending requests.</p>
                  </div>
                ) : (
                  filteredPending.map(tx => (
                    <div key={tx.id} className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 ff-card-glow flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${tx.type === 'deposit' ? 'bg-green-600' : 'bg-red-600'}`}>
                            {tx.type}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-3xl font-black">৳{tx.amount}</p>
                        <p className="text-xs font-bold text-orange-500/80 mt-1 uppercase">User: {tx.userMobile}</p>
                        <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                          Method: <span className="text-white">{tx.method}</span>
                        </p>
                        {tx.trxId && (
                          <div className="mt-3 bg-black/40 px-3 py-2 rounded-xl inline-flex items-center gap-2 border border-white/5">
                            <span className="text-[9px] text-gray-500 uppercase font-black">TrxID:</span>
                            <span className="text-sm font-mono text-orange-500 font-black">{tx.trxId}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => onApprove(tx.id)} className="flex-1 md:flex-none bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl text-xs font-black uppercase transition-all shadow-xl">Approve</button>
                        <button onClick={() => onReject(tx.id)} className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-8 py-3 rounded-xl text-xs font-black uppercase transition-all">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 ff-card-glow animate-in slide-in-from-bottom-4 duration-500">
             <h3 className="font-bebas text-3xl mb-6 tracking-widest uppercase">Launch New Match</h3>
             <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Match Number</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-bold"
                        required
                        value={newMatch.matchNumber}
                        onChange={e => setNewMatch({...newMatch, matchNumber: parseInt(e.target.value)})}
                      />
                   </div>
                   <div className="col-span-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Tournament Title</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-bold"
                        required
                        value={newMatch.title}
                        onChange={e => setNewMatch({...newMatch, title: e.target.value})}
                        placeholder="Ex: BD Pro League"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Game Mode</label>
                      <select 
                        className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                        value={newMatch.type}
                        onChange={e => setNewMatch({...newMatch, type: e.target.value as MatchType})}
                      >
                        <option value={MatchType.BATTLE_ROYALE}>Battle Royale</option>
                        <option value={MatchType.CLASH_SQUAD}>Clash Squad</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Format</label>
                      <select 
                        className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                        value={newMatch.format}
                        onChange={e => setNewMatch({...newMatch, format: e.target.value as MatchFormat})}
                      >
                        <option value={MatchFormat.SOLO}>Solo</option>
                        <option value={MatchFormat.DUO}>Duo</option>
                        <option value={MatchFormat.SQUAD}>Squad</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Entry Fee</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold"
                        value={newMatch.entryFee}
                        onChange={e => setNewMatch({...newMatch, entryFee: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Prize Pool</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold"
                        value={newMatch.prizePool}
                        onChange={e => setNewMatch({...newMatch, prizePool: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Start Time</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold"
                        value={newMatch.startTime}
                        onChange={e => setNewMatch({...newMatch, startTime: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase ml-1 mb-1 block">Total Slots</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold"
                        value={newMatch.totalSlots}
                        onChange={e => setNewMatch({...newMatch, totalSlots: parseInt(e.target.value)})}
                      />
                   </div>
                </div>
                <button type="submit" className="w-full ff-gradient py-4 rounded-xl text-black font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-transform">
                  Launch Tournament 🔥
                </button>
             </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="relative">
                <input 
                  type="text"
                  placeholder="Search players by Mobile or Username..."
                  className="w-full bg-[#1a1a1c] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-all font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>
              <div className="bg-[#1a1a1c] rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Player</th>
                      <th className="px-6 py-4">Mobile</th>
                      <th className="px-6 py-4">Balance</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.mobile} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-black text-sm uppercase">{u.username}</p>
                          <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{u.role}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-400">{u.mobile}</td>
                        <td className="px-6 py-4">
                          <span className="font-black text-green-500 text-base">৳{u.balance.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleAdjustBalance(u.mobile)}
                             className="text-[9px] font-black uppercase bg-orange-500 text-black px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                           >
                             Edit Balance
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-500">
              {matches.map(m => (
                <div key={m.id} className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 group relative">
                  {editingMatchId === m.id ? (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Match #</label>
                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black" value={editForm.matchNumber} onChange={e => setEditForm({...editForm, matchNumber: parseInt(e.target.value)})} />
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Title</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                          </div>
                          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} />
                          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" value={editForm.entryFee} onChange={e => setEditForm({...editForm, entryFee: e.target.value})} />
                          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" value={editForm.prizePool} onChange={e => setEditForm({...editForm, prizePool: e.target.value})} />
                          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" placeholder="Room ID" value={editForm.roomCode} onChange={e => setEditForm({...editForm, roomCode: e.target.value})} />
                          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs col-span-2" placeholder="Password" value={editForm.roomPassword} onChange={e => setEditForm({...editForm, roomPassword: e.target.value})} />
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleUpdate(m.id)} className="flex-1 bg-green-500 text-black font-black text-[10px] py-2 rounded-lg">SAVE</button>
                          <button onClick={() => setEditingMatchId(null)} className="flex-1 bg-white/5 text-gray-400 font-black text-[10px] py-2 rounded-lg">CANCEL</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-black">#{String(m.matchNumber).padStart(3, '0')}</span>
                            <h4 className="font-black text-lg leading-none uppercase">{m.title}</h4>
                          </div>
                          <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{m.type} • {m.startTime}</span>
                        </div>
                        <button onClick={() => handleEditClick(m)} className="p-2 bg-white/5 rounded-lg hover:bg-orange-500 hover:text-black transition-all">✏️</button>
                      </div>
                      <div className="flex gap-2">
                         <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex-1">
                            <p className="text-[8px] text-gray-500 uppercase font-black">Room ID</p>
                            <p className="font-black text-sm tracking-widest">{m.roomCode || '---'}</p>
                         </div>
                         <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex-1">
                            <p className="text-[8px] text-gray-500 uppercase font-black">Pass</p>
                            <p className="font-black text-sm tracking-widest">{m.roomPassword || '---'}</p>
                         </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
