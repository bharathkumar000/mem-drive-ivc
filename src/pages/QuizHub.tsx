import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import ivcLogo from '../assets/ivc_logo.jpg';

const QuizHub: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');
    if (accessCode === '999' || accessCode === 'IVC2026' || accessCode === '1234') {
      setTimeout(() => navigate('/quiz'), 800);
    } else {
      setError('INVALID_SECURITY_KEY');
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f8fafc]">
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none"
           style={{ 
             backgroundImage: `radial-gradient(#6366f1 0.5px, transparent 0.5px)`, 
             backgroundSize: '24px 24px' 
           }} />
      
      {/* Accent Overlays */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#ef4444]/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-[#6366f1]/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-12 relative py-32">
          <div className="w-full max-w-4xl flex flex-col items-center">
            
            {/* Access Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white border border-[#e2e8f0] rounded-[64px] p-24 md:p-32 w-full shadow-[0_80px_200px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
               {/* Accent decoration */}
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#f59e0b]" />

              <div className="flex flex-col items-center gap-24">
                {/* LOGO CONTAINER: Centered and Gapped */}
                <div className="text-center group w-full flex flex-col items-center">
                  <div className="w-56 h-56 flex items-center justify-center mb-16 transition-transform duration-500 hover:scale-110">
                     <img 
                        src={ivcLogo} 
                        alt="IVC Logo" 
                        className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700 shadow-xl" 
                        style={{ borderRadius: '48px' }}
                     />
                  </div>
                  <p className="font-display text-4xl tracking-[0.7em] text-[#0f172a] font-black uppercase mb-6 leading-tight">
                    AUTHORIZATION KEY
                  </p>
                  <p className="text-[15px] tracking-[0.3em] text-[#94a3b8] font-black uppercase">SECURED TERMINAL ACCESS REQUIRED</p>
                </div>

                <form onSubmit={handleStartQuiz} className="w-full flex flex-col items-center gap-24">
                  <input
                    type="text"
                    autoFocus
                    placeholder="KEY-XXXX-XXXX"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#f8fafc] border-2 border-[#e2e8f0] px-20 py-20 text-7xl text-center text-[#0f172a] font-display font-black tracking-[0.4em] rounded-[48px] outline-none focus:border-[#2563eb]/40 focus:bg-white focus:shadow-[0_60px_100px_rgba(37,99,235,0.12)] transition-all duration-500 placeholder:text-[#cbd5e1] placeholder:text-3xl placeholder:tracking-[0.2em] placeholder:font-black"
                  />
                  
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="w-full py-16 bg-[#0f172a] text-white font-display text-4xl tracking-[0.3em] font-black uppercase rounded-[48px] hover:bg-[#1e293b] hover:shadow-[0_60px_100px_rgba(15,23,42,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-40"
                  >
                    {isValidating ? 'SYNCHRONIZING...' : 'AUTHORIZE ACCESS'}
                  </button>
                </form>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 font-display text-[16px] tracking-[0.2em] font-black uppercase px-12 py-5 bg-red-50 rounded-2xl animate-pulse"
                    >
                      ⚠ SIGNAL_ERR: {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizHub;
