
import React, { useState } from 'react';
import { User, Transaction, TransactionType } from '../types';

interface WalletPageProps {
  user: User;
  transactions: Transaction[];
  onTransactionSubmit: (tx: Partial<Transaction>) => void;
  onBack: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ user, transactions, onTransactionSubmit, onBack }) => {
  const [activeTab, setActiveTab] = useState<TransactionType | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bKash');
  const [trxId, setTrxId] = useState('');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [msg, setMsg] = useState('');

  const WALLET_NUMBER = '01856679562';
  const userTransactions = transactions.filter(t => t.userMobile === user.mobile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount);

    if (activeTab === 'deposit') {
      if (numAmount < 10) {
        setMsg('মিনিমাম ডিপোজিট ১০ টাকা।');
        return;
      }
      if (!trxId) {
        setMsg('TrxID দিন।');
        return;
      }
      onTransactionSubmit({
        amount: numAmount,
        type: 'deposit',
        method,
        trxId,
        userMobile: user.mobile
      });
      setMsg('ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে। এডমিন চেক করে এপ্রুভ করবে।');
    } else if (activeTab === 'withdraw') {
      if (numAmount < 100 || numAmount > 1000) {
        setMsg('মিনিমাম ১০০ এবং ম্যাক্সিমাম ১০০০ টাকা উইথড্র করা যাবে।');
        return;
      }
      if (numAmount > user.balance) {
        setMsg('পর্যাপ্ত ব্যালেন্স নেই!');
        return;
      }
      if (withdrawNumber.length < 11) {
        setMsg('ভ্যালিড বিকাশ/নগদ নাম্বার দিন।');
        return;
      }
      onTransactionSubmit({
        amount: numAmount,
        type: 'withdraw',
        method: `${method} (${withdrawNumber})`,
        userMobile: user.mobile
      });
      setMsg('উইথড্র রিকোয়েস্ট সফল হয়েছে।');
    }
    
    setAmount('');
    setTrxId('');
    setWithdrawNumber('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-bebas text-2xl tracking-widest">MY WALLET</h2>
          <div className="w-10"></div>
        </div>

        <div className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 mb-6 text-center shadow-xl">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Balance</p>
          <p className="text-4xl font-black text-green-400">৳ {user.balance.toFixed(2)}</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'deposit' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-400'}`}
          >
            Deposit
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'withdraw' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-400'}`}
          >
            Withdraw
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'history' ? 'bg-orange-500 text-black shadow-lg' : 'text-gray-400'}`}
          >
            History
          </button>
        </div>

        {msg && activeTab !== 'history' && <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold rounded-xl text-center font-bangla">{msg}</div>}

        {activeTab === 'history' ? (
          <div className="space-y-4">
            {userTransactions.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-[10px]">No transaction history</div>
            ) : (
              userTransactions.map(tx => (
                <div key={tx.id} className="bg-[#1a1a1c] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${tx.type === 'deposit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {tx.type}
                      </span>
                      <span className="text-[9px] font-bold text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-bold text-white">৳ {tx.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-500 uppercase">{tx.method}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                      tx.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                      tx.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'deposit' && (
                <div className="bg-orange-600/10 p-4 rounded-2xl border border-orange-600/20 mb-4">
                  <p className="text-[10px] font-black text-orange-500 uppercase mb-2">Instructions</p>
                  <p className="text-sm font-bangla text-gray-300">নিচের নাম্বারে <b>Send Money</b> করুন এবং TrxID দিন।</p>
                  <div className="flex items-center justify-between mt-3 bg-black/40 p-3 rounded-xl">
                    <span className="font-bold text-white tracking-widest">{WALLET_NUMBER}</span>
                    <span className="text-[9px] font-black bg-orange-500 text-black px-2 py-1 rounded">BKASH/NAGAD</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Payment Method</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none font-bold"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Amount (TK)</label>
                <input 
                  type="number" 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={activeTab === 'deposit' ? "Min 10 TK" : "Min 100 - Max 1000"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                />
              </div>

              {activeTab === 'deposit' ? (
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Transaction ID (TrxID)</label>
                  <input 
                    type="text" 
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="8XJKD992"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Receive Number</label>
                  <input 
                    type="tel" 
                    required
                    value={withdrawNumber}
                    onChange={(e) => setWithdrawNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
              )}

              <button type="submit" className="w-full ff-gradient py-4 rounded-xl font-bold text-black uppercase tracking-widest shadow-lg">
                {activeTab === 'deposit' ? 'REQUEST DEPOSIT' : 'REQUEST WITHDRAW'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
