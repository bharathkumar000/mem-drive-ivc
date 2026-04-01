import React from 'react';
import ivcLogo from '../assets/ivc_logo.jpg';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center py-10 bg-white border-b border-[#e2e8f0] relative z-[100] shadow-sm">
      {/* Top Bar: inunity branding */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl font-display font-black tracking-tighter text-[#0f172a] flex items-center gap-2">
          inunity
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
        </span>
      </div>
      
      {/* Main Institution Block: Centered */}
      <div className="flex flex-col items-center gap-6 px-10">
        <div className="relative group flex justify-center">
            <div className="absolute inset-0 bg-[#3b82f6]/5 blur-[30px] rounded-full scale-150 transition-all group-hover:bg-[#3b82f6]/10" />
            <img 
              src={ivcLogo} 
              alt="VVCE" 
              className="w-16 h-16 object-contain relative z-10 grayscale-0 shadow-sm rounded-2xl"
              style={{ padding: '4px', background: 'white', border: '1px solid #f1f5f9' }}
            />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] tracking-[0.25em] text-[#64748b] font-black uppercase mb-1">
            VIDYAVARDHAKA SANGHA ®, MYSORE
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0f172a] leading-tight font-display mb-1">
            Vidyavardhaka College of Engineering
          </h2>
          <p className="text-[11px] tracking-widest text-[#94a3b8] font-bold uppercase">
            Autonomous institute affiliated to VTU, Belagavi
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
