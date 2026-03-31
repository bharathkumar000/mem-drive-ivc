import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAntiCheating } from '../hooks/useAntiCheating';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { supabase } from '../supabase';
import confetti from 'canvas-confetti';
import bgImage from '../assets/futuristic_bg.png';

interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'text' | 'numerical' | 'multi';
  options?: string[];
  correct_answer: string;
  timer_limit: number;
}

const MOCK_QUESTIONS: Question[] = [
  { id: '1', text: 'Which component represents the "brain" of the IVC logo?', type: 'mcq', options: ['The Gear', 'The Brain', 'The Lightbulb', 'The Hand'], correct_answer: 'The Brain', timer_limit: 60 },
  { id: '2', text: 'Define the core principle of IVC in one word.', type: 'text', correct_answer: 'Innovation', timer_limit: 45 },
  { id: '3', text: 'Calculate the sum of bits in a byte.', type: 'numerical', correct_answer: '8', timer_limit: 30 },
  { id: '4', text: 'Select the futuristic elements present in the UI.', type: 'multi', options: ['Glow Effects', 'Circuit Board BG', 'Futuristic Font', 'Shadows'], correct_answer: 'Glow Effects, Circuit Board BG, Futuristic Font', timer_limit: 60 },
];

const QuizPage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [violationMsg, setViolationMsg] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();
  const currentQ = MOCK_QUESTIONS[currentIdx];
  const timerRef = useRef<any>(null);

  const handleViolation = (count: number, message: string) => {
    setViolations(count);
    setViolationMsg(message);
    setShowWarning(true);
    if (count >= 2) {
      handleSubmit();
      navigate('/leaderboard');
    }
  };

  useAntiCheating({ onViolation: handleViolation, violations });

  useEffect(() => {
    if (quizEnded) return;
    setTimeLeft(currentQ.timer_limit);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleNext(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx]);

  const handleSubmit = async () => {
    const points = Math.max(0, Math.floor(100 * (timeLeft / currentQ.timer_limit)));
    setTotalScore(prev => prev + points);
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswer('');
    } else {
      setQuizEnded(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00f7ff', '#ffffff', '#00bac2'] });
      setTimeout(() => navigate('/leaderboard'), 3000);
    }
  };

  const handleNext = () => handleSubmit();

  const toggleMultiOption = (opt: string) => {
    setAnswer(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(opt) ? arr.filter(i => i !== opt) : [...arr, opt];
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative no-select scanline-overlay"
         style={{ background: 'linear-gradient(180deg, #080c14 0%, #0c1a2a 50%, #080c14 100%)' }}>
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center px-4 md:px-12 pt-12">
          <div className="w-full max-w-7xl">
            {/* Progress + Timer row - Enlarged */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
              <div className="w-full md:w-auto">
                <p className="font-display text-xl tracking-[0.5em] text-cyan-glow/50 uppercase font-black mb-6">
                  QUESTION {currentIdx + 1} / {MOCK_QUESTIONS.length}
                </p>
                <div className="flex gap-3">
                  {MOCK_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-2.5 w-24 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-cyan-glow shadow-[0_0_20px_rgba(0,247,255,0.7)]' : 'bg-white/5'}`} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                <span className="text-sm tracking-[0.4em] text-white/30 uppercase font-black">REMAINING_TIME</span>
                <div className={`px-12 py-6 rounded-3xl border-2 backdrop-blur-3xl ${timeLeft < 10 ? 'border-red-500/60 bg-red-950/40' : 'border-cyan-glow/30 bg-dark-card/80'}`}>
                  <span className={`font-display text-6xl md:text-7xl font-black tracking-widest ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'glow-text'}`}>
                    {String(timeLeft).padStart(2, '0')}<span className="text-2xl ml-2 opacity-50 font-black">S</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Question card - Enlarged */}
            <motion.div key={currentIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-16 md:p-24 mb-12 border-2 border-cyan-glow/15 rounded-3xl"
                   style={{ boxShadow: '0 0 100px rgba(0,247,255,0.05)', background: 'rgba(12, 18, 32, 0.9)' }}>
                <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-[0.05em] leading-tight mb-16 text-center md:text-left">
                  {currentQ.text}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentQ.type === 'mcq' && currentQ.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setAnswer(opt)}
                      className={`w-full p-8 text-left rounded-2xl border-4 transition-all flex items-center justify-between cursor-pointer ${
                        answer === opt
                          ? 'bg-cyan-glow/20 border-cyan-glow/60 text-white shadow-[0_0_50px_rgba(0,247,255,0.2)]'
                          : 'bg-white/[0.03] border-white/5 text-gray-500 hover:border-white/20 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="text-xl md:text-2xl font-black tracking-widest uppercase">{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${answer === opt ? 'border-cyan-glow bg-cyan-glow' : 'border-white/10'}`}>
                        {answer === opt && <div className="w-4 h-4 bg-black rounded-full" />}
                      </div>
                    </button>
                  ))}

                  {currentQ.type === 'multi' && currentQ.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => toggleMultiOption(opt)}
                      className={`w-full p-8 text-left rounded-2xl border-4 transition-all flex items-center justify-between cursor-pointer ${
                        Array.isArray(answer) && answer.includes(opt)
                          ? 'bg-cyan-glow/20 border-cyan-glow/60 text-white shadow-[0_0_50px_rgba(0,247,255,0.2)]'
                          : 'bg-white/[0.03] border-white/5 text-gray-500 hover:border-white/20 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="text-xl md:text-2xl font-black tracking-widest uppercase">{opt}</span>
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${Array.isArray(answer) && answer.includes(opt) ? 'border-cyan-glow bg-cyan-glow' : 'border-white/10'}`}>
                        {Array.isArray(answer) && answer.includes(opt) && <CheckCircle2 className="w-5 h-5 text-black" />}
                      </div>
                    </button>
                  ))}
                </div>

                {(currentQ.type === 'text' || currentQ.type === 'numerical') && (
                    <div className="mt-8">
                       <input
                        type={currentQ.type === 'numerical' ? 'number' : 'text'}
                        placeholder="TRANSMIT_YOUR_RESPONSE_HERE..."
                        value={Array.isArray(answer) ? '' : answer}
                        onChange={e => setAnswer(e.target.value)}
                        className="w-full bg-white/[0.05] border-b-4 border-cyan-glow/20 p-10 rounded-2xl text-4xl md:text-5xl font-display font-black text-cyan-glow tracking-[0.2em] outline-none focus:border-cyan-glow/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-center"
                      />
                    </div>
                  )}
              </div>

              {/* Huge Submit Button */}
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-20 py-10 bg-cyan-glow text-black font-display text-4xl tracking-[0.5em] font-black uppercase rounded-2xl hover:shadow-[0_0_100px_rgba(0,247,255,0.5)] hover:scale-105 active:scale-[0.97] transition-all flex items-center gap-6 cursor-pointer"
                >
                  TRANSMIT <Send className="w-10 h-10" />
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 right-0 p-16 opacity-5 pointer-events-none select-none">
        <h1 className="text-[300px] font-black uppercase leading-none">IVC</h1>
      </div>
    </div>
  );
};

export default QuizPage;
