
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mobile.length < 11) {
      setError('ভ্যালিড মোবাইল নাম্বার দিন (১১ ডিজিট)');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('ff_users') || '[]');
    
    if (isLogin) {
      const user = storedUsers.find((u: any) => u.mobile === mobile && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('মোবাইল নাম্বার বা পাসওয়ার্ড ভুল!');
      }
    } else {
      if (storedUsers.some((u: any) => u.mobile === mobile)) {
        setError('এই নাম্বারটি অলরেডি রেজিস্টার্ড!');
        return;
      }
      
      const newUser: User = {
        mobile,
        password,
        username: username || `Gamer_${mobile.slice(-4)}`,
        role: mobile === '01856679562' ? 'admin' : 'player',
        balance: 0
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('ff_users', JSON.stringify(storedUsers));
      setIsLogin(true);
      setMessage('রেজিস্ট্রেশন সফল! এখন লগিন করুন।');
    }
  };

  const handleForgetPassword = () => {
    if (!mobile) {
      setError('আগে মোবাইল নাম্বারটি লিখুন');
      return;
    }
    setMessage(`একটি ভেরিফিকেশন কোড আপনার ${mobile} নাম্বারে পাঠানো হয়েছে। (Demo)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0b]">
      <div className="w-full max-w-md bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 ff-card-glow">
        <div className="text-center mb-8">
          {/* Updated: Logo Image Container */}
          <div className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,78,80,0.5)]">
            <img 
              src="./logo.png" 
              alt="Strongest League Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-bebas text-3xl tracking-widest text-white">
            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-xs text-gray-400 font-bangla mt-1">
            {isLogin ? 'আপনার একাউন্টে লগিন করুন' : 'টুর্নামেন্টে জয়েন করতে রেজিস্ট্রেশন করুন'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg text-center font-bangla">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-lg text-center font-bangla">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Savage_Player"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Mobile Number</label>
            <input 
              type="tel" 
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <button type="submit" className="w-full ff-gradient py-4 rounded-xl font-bold text-black shadow-xl hover:scale-[1.02] active:scale-95 transition-transform uppercase tracking-widest">
            {isLogin ? 'LOGIN NOW' : 'REGISTER NOW'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-4"
          >
            {isLogin ? "একাউন্ট নেই? নতুন একাউন্ট খুলুন" : "অলরেডি একাউন্ট আছে? লগিন করুন"}
          </button>
          
          {isLogin && (
            <button 
              onClick={handleForgetPassword}
              className="text-xs text-orange-500/70 hover:text-orange-500 transition-colors font-bold uppercase tracking-widest"
            >
              Forget Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
