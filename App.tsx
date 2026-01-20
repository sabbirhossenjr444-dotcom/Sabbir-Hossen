
import React, { useState, useEffect, useCallback } from 'react';
import { MatchCard } from './components/MatchCard';
import { RulesModal } from './components/RulesModal';
import { AuthPage } from './components/AuthPage';
import { WalletPage } from './components/WalletPage';
import { AdminPanel } from './components/AdminPanel';
import { JoinMatchModal } from './components/JoinMatchModal';
import { HistoryPage } from './components/HistoryPage';
import { Match, MatchType, MatchFormat, User, Transaction, UserMatch } from './types';
import { getGamingAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'wallet' | 'admin' | 'history'>('home');
  const [matches, setMatches] = useState<Match[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userMatches, setUserMatches] = useState<UserMatch[]>([]);
  const [filter, setFilter] = useState<MatchType | 'ALL'>('ALL');
  const [showRules, setShowRules] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [advice, setAdvice] = useState<string>("Loading gaming pro tips...");
  const [isAdviceLoading, setIsAdviceLoading] = useState(true);

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('ff_logged_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTxs = localStorage.getItem('ff_transactions');
    if (savedTxs) setTransactions(JSON.parse(savedTxs));

    const savedUserMatches = localStorage.getItem('ff_user_matches');
    if (savedUserMatches) setUserMatches(JSON.parse(savedUserMatches));
    
    const savedMatches = localStorage.getItem('ff_all_matches');
    if (savedMatches && JSON.parse(savedMatches).length > 0) {
      setMatches(JSON.parse(savedMatches));
    } else {
      generateDynamicMatches();
    }
  }, []);

  // Update localStorage when transactions or userMatches change
  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_user_matches', JSON.stringify(userMatches));
  }, [userMatches]);

  useEffect(() => {
    localStorage.setItem('ff_all_matches', JSON.stringify(matches));
  }, [matches]);

  const generateDynamicMatches = useCallback(() => {
    const newMatches: Match[] = [];
    const now = new Date();
    
    let currentCursor = new Date(now);
    currentCursor.setSeconds(0);
    currentCursor.setMilliseconds(0);
    
    const mins = currentCursor.getMinutes();
    if (mins < 30) {
      currentCursor.setMinutes(30);
    } else {
      currentCursor.setMinutes(0);
      currentCursor.setHours(currentCursor.getHours() + 1);
    }

    const prizes = ['500 BDT', '1000 BDT', '200 Diamonds', '50 Diamonds', '2500 BDT'];
    const fees = ['20 BDT', '50 BDT', '10 BDT', 'Free', '100 BDT'];

    let matchesCreated = 0;
    let iterations = 0;
    
    while (matchesCreated < 12 && iterations < 100) {
      iterations++;
      const hour = currentCursor.getHours();
      
      if (hour >= 8 && hour <= 23) {
        const type = matchesCreated % 2 === 0 ? MatchType.BATTLE_ROYALE : MatchType.CLASH_SQUAD;
        const format = type === MatchType.BATTLE_ROYALE ? MatchFormat.SOLO : MatchFormat.SQUAD;
        
        const timeStr = currentCursor.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }) + " Today";

        newMatches.push({
          id: `match-${currentCursor.getTime()}`,
          matchNumber: matchesCreated + 1,
          title: type === MatchType.BATTLE_ROYALE ? `BD BR Elite Cup` : `CS 4v4 Diamond League`,
          type,
          format,
          entryFee: fees[matchesCreated % fees.length],
          prizePool: prizes[matchesCreated % prizes.length],
          startTime: timeStr,
          totalSlots: type === MatchType.BATTLE_ROYALE ? 48 : 8,
          filledSlots: Math.floor(Math.random() * 5),
          banner: '' 
        });
        matchesCreated++;
      }
      currentCursor.setMinutes(currentCursor.getMinutes() + 60);
    }
    
    setMatches(newMatches);
  }, []);

  const fetchAdvice = useCallback(async () => {
    setIsAdviceLoading(true);
    const tip = await getGamingAdvice('Mixed', 'Standard');
    setAdvice(tip);
    setIsAdviceLoading(false);
  }, []);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ff_logged_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
    localStorage.removeItem('ff_logged_user');
  };

  const handleTransactionRequest = (txData: Partial<Transaction>) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userMobile: user!.mobile,
      amount: txData.amount!,
      type: txData.type!,
      status: 'pending',
      method: txData.method!,
      trxId: txData.trxId,
      timestamp: Date.now()
    };

    if (txData.type === 'withdraw' && user) {
      const updatedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
      const userIdx = updatedUsers.findIndex((u: User) => u.mobile === user.mobile);
      if (userIdx !== -1) {
        updatedUsers[userIdx].balance -= txData.amount!;
        localStorage.setItem('ff_users', JSON.stringify(updatedUsers));
        
        const updatedUser = { ...user, balance: updatedUsers[userIdx].balance };
        setUser(updatedUser);
        localStorage.setItem('ff_logged_user', JSON.stringify(updatedUser));
      }
    }

    setTransactions(prev => [newTx, ...prev]);
  };

  const handleApproveTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        const updatedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
        const targetUserIndex = updatedUsers.findIndex((u: User) => u.mobile === tx.userMobile);
        
        if (targetUserIndex !== -1) {
          if (tx.type === 'deposit') {
            updatedUsers[targetUserIndex].balance += tx.amount;
          }
          localStorage.setItem('ff_users', JSON.stringify(updatedUsers));
          
          if (user?.mobile === tx.userMobile) {
            const updatedUser = { ...user, balance: updatedUsers[targetUserIndex].balance };
            setUser(updatedUser);
            localStorage.setItem('ff_logged_user', JSON.stringify(updatedUser));
          }
        }
        return { ...tx, status: 'approved' as const };
      }
      return tx;
    }));
  };

  const handleRejectTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        if (tx.type === 'withdraw') {
          const updatedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
          const targetUserIndex = updatedUsers.findIndex((u: User) => u.mobile === tx.userMobile);
          
          if (targetUserIndex !== -1) {
            updatedUsers[targetUserIndex].balance += tx.amount;
            localStorage.setItem('ff_users', JSON.stringify(updatedUsers));
            
            if (user?.mobile === tx.userMobile) {
              const updatedUser = { ...user, balance: updatedUsers[targetUserIndex].balance };
              setUser(updatedUser);
              localStorage.setItem('ff_logged_user', JSON.stringify(updatedUser));
            }
          }
        }
        return { ...tx, status: 'rejected' as const };
      }
      return tx;
    }));
  };

  const handleUpdateMatch = (matchId: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
  };

  const handleCreateMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  const handleUpdateUserBalance = (mobile: string, newBalance: number) => {
    const updatedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
    const userIdx = updatedUsers.findIndex((u: User) => u.mobile === mobile);
    if (userIdx !== -1) {
      updatedUsers[userIdx].balance = newBalance;
      localStorage.setItem('ff_users', JSON.stringify(updatedUsers));
      
      if (user?.mobile === mobile) {
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem('ff_logged_user', JSON.stringify(updatedUser));
      }
    }
  };

  const handleJoinRequest = (match: Match) => {
    const feeStr = match.entryFee.split(' ')[0];
    const fee = feeStr === 'Free' ? 0 : parseInt(feeStr);
    
    if (user && user.balance < fee) {
      alert(`Insufficient balance! You need ৳${fee} to join. Current balance: ৳${user.balance.toFixed(2)}. Please deposit first.`);
      setView('wallet');
      return;
    }

    setSelectedMatch(match);
    setShowJoinModal(true);
  };

  const handleConfirmJoin = (uid: string, gameName: string) => {
    if (!user || !selectedMatch) return;

    const feeStr = selectedMatch.entryFee.split(' ')[0];
    const fee = feeStr === 'Free' ? 0 : parseInt(feeStr);

    const updatedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
    const userIdx = updatedUsers.findIndex((u: User) => u.mobile === user.mobile);
    
    if (userIdx !== -1) {
      updatedUsers[userIdx].balance -= fee;
      localStorage.setItem('ff_users', JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, balance: updatedUsers[userIdx].balance };
      setUser(updatedUser);
      localStorage.setItem('ff_logged_user', JSON.stringify(updatedUser));
    }

    const newUserMatch: UserMatch = {
      id: `umatch-${Date.now()}`,
      userMobile: user.mobile,
      matchId: selectedMatch.id,
      matchTitle: selectedMatch.title,
      matchType: selectedMatch.type,
      startTime: selectedMatch.startTime,
      uid: uid,
      gameName: gameName,
      status: 'joined',
      timestamp: Date.now()
    };
    setUserMatches(prev => [newUserMatch, ...prev]);

    setMatches(prev => prev.map(m => m.id === selectedMatch.id ? { ...m, filledSlots: m.filledSlots + 1 } : m));

    alert(`Successfully registered for Match #${selectedMatch.matchNumber}: ${selectedMatch.title}!\nUID: ${uid}\nGame Name: ${gameName}\n\nGood luck, warrior! 🔥`);
    setShowJoinModal(false);
    setSelectedMatch(null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const filteredMatches = filter === 'ALL' ? matches : matches.filter(m => m.type === filter);
  const currentUserMatches = userMatches.filter(m => m.userMobile === user.mobile);

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {view === 'home' && (
        <>
          <div className="ff-gradient text-black py-2 px-4 text-center text-[10px] md:text-sm font-black animate-pulse uppercase tracking-tighter">
            🔥 BD FF TOURNAMENT LIVE! WIN CASH & DIAMONDS DAILY!
          </div>

          <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,78,80,0.3)]">
                <img src="./logo.png" alt="League Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-bebas text-lg tracking-wider leading-none text-white">STRONGEST LEAGUE</h1>
                <p className="text-[8px] text-orange-500 font-black tracking-widest uppercase opacity-80">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('wallet')}
                className="flex flex-col items-end bg-white/5 px-3 py-1 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-[8px] text-gray-500 font-bold uppercase">Balance</span>
                <span className="text-xs font-bold text-green-400">৳ {user.balance.toFixed(2)}</span>
              </button>
              {user.role === 'admin' && (
                <button onClick={() => setView('admin')} className="w-8 h-8 rounded-full border border-orange-500/30 flex items-center justify-center hover:bg-white/5 text-orange-500 transition-transform active:scale-90">
                  ⚙️
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-6">
            <section className="mb-6 bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 relative overflow-hidden ff-card-glow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Coach's Pro Tip</h4>
                    {isAdviceLoading && <div className="w-1 h-1 rounded-full bg-orange-500 animate-ping" />}
                  </div>
                  <p className="text-gray-300 font-bangla text-xs leading-relaxed whitespace-pre-line">{advice}</p>
                </div>
              </div>
            </section>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {(['ALL', MatchType.BATTLE_ROYALE, MatchType.CLASH_SQUAD] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                    filter === type ? 'bg-orange-500 text-black border-orange-500' : 'bg-white/5 text-gray-400 border-white/5'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type}
                </button>
              ))}
            </div>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bebas text-2xl tracking-widest flex items-center gap-2 text-white uppercase">
                  <span className="w-1 h-6 bg-orange-600 rounded-full inline-block"></span>
                  LIVE TOURNAMENTS
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    currentUserMobile={user.mobile}
                    participants={userMatches.filter(um => um.matchId === match.id)}
                    onJoin={handleJoinRequest}
                  />
                ))}
              </div>
            </section>
          </main>
        </>
      )}

      {view === 'wallet' && (
        <WalletPage 
          user={user} 
          transactions={transactions}
          onBack={() => setView('home')} 
          onTransactionSubmit={handleTransactionRequest} 
        />
      )}

      {view === 'admin' && user.role === 'admin' && (
        <AdminPanel 
          transactions={transactions} 
          matches={matches}
          onBack={() => setView('home')} 
          onApprove={handleApproveTransaction} 
          onReject={handleRejectTransaction} 
          onUpdateMatch={handleUpdateMatch}
          onCreateMatch={handleCreateMatch}
          onUpdateUserBalance={handleUpdateUserBalance}
        />
      )}

      {view === 'history' && (
        <HistoryPage 
          userMatches={currentUserMatches} 
          allMatches={matches}
          onBack={() => setView('home')} 
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0b]/95 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex items-center justify-between z-40 max-w-lg mx-auto rounded-t-3xl shadow-2xl">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-orange-500' : 'text-gray-500'}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setView('wallet')} className={`flex flex-col items-center gap-1 ${view === 'wallet' ? 'text-orange-500' : 'text-gray-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">Wallet</span>
        </button>
        <div className="relative -top-8">
          <button onClick={() => setView('home')} className="w-14 h-14 rounded-full ff-gradient flex items-center justify-center shadow-lg border-4 border-[#0a0a0b]">
            <img src="./logo.png" alt="Center Logo" className="w-8 h-8 object-contain brightness-0" />
          </button>
        </div>
        <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-orange-500' : 'text-gray-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">History</span>
        </button>
        <button onClick={() => setShowRules(true)} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">Rules</span>
        </button>
      </nav>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      
      <JoinMatchModal 
        isOpen={showJoinModal} 
        match={selectedMatch} 
        onClose={() => setShowJoinModal(false)} 
        onConfirm={handleConfirmJoin}
      />
    </div>
  );
};

export default App;
