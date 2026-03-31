import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import ivcLogo from '../assets/ivc_logo.jpg';
import bgImage from '../assets/futuristic_bg.png';

const QuizHub: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');
    if (accessCode === 'IVC2026' || accessCode === '1234') {
      setTimeout(() => navigate('/quiz'), 800);
    } else {
      setError('INVALID ACCESS CODE');
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative scanline-overlay"
         style={{ background: 'linear-gradient(180deg, #080c14 0%, #0c1a2a 50%, #080c14 100%)' }}>
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Background logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <img src={ivcLogo} alt="" className="w-[600px] h-[600px] object-contain" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-[0.2em] glow-text text-center mb-16 uppercase">
              INNOVATORS & VISIONARIES CLUB
            </h1>

            <div className="glass-card p-12 w-full max-w-lg border border-cyan-glow/10">
              <div className="flex flex-col items-center gap-8">
                <div className="text-center">
                  <p className="font-display text-[10px] tracking-[0.6em] text-cyan-glow/50 font-bold uppercase mb-1">ACCESS CODE:</p>
                </div>

                <form onSubmit={handleStartQuiz} className="w-full flex flex-col items-center gap-8">
                  <input
                    type="text"
                    autoFocus
                    placeholder="ENTER CODE"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-b-2 border-cyan-glow/15 text-center py-4 text-2xl font-display font-black text-cyan-glow tracking-[0.4em] focus:border-cyan-glow/60 outline-none transition-colors placeholder:text-white/10"
                  />
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="w-full py-4 bg-cyan-glow text-black font-display text-xs tracking-[0.6em] font-bold uppercase rounded-sm hover:shadow-[0_0_40px_rgba(0,247,255,0.3)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isValidating ? 'VALIDATING...' : 'START QUIZ'}
                  </button>
                </form>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 font-display text-[10px] tracking-widest font-bold uppercase"
                    >
                      ▸ {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizHub;
