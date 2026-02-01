import React from 'react';
import { Icons, SOCIETY_EMAIL } from './constants';

const Header: React.FC = () => {
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EEIS Ramadan Planner',
        text: 'Support our Iftar & Suhoor catering!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      window.open(`https://wa.me/?text=Check out the EEIS Ramadan Planner: ${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  return (
    <header className="relative pt-12 pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[120px] mix-blend-multiply filter animate-blob" />
        <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[120px] mix-blend-multiply filter animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[500px] h-[500px] bg-slate-200/30 rounded-full blur-[120px] mix-blend-multiply filter animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="absolute top-0 right-6 text-emerald-950/20 font-black text-xs md:text-sm tracking-[0.2em] uppercase">
          v1.0 (Live)
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="text-left space-y-4">
            <div>
              <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter leading-none text-emerald-950 font-serif drop-shadow-sm">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-emerald-800 to-emerald-600">EEIS</span>
              </h1>
              <div className="flex flex-col gap-1 pl-2 border-l-4 border-amber-400/50">
                <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-[0.2em]">Ramadan 2026</p>
                <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none">Iftar & Suhoor</p>
                <p className="text-3xl md:text-4xl font-black text-slate-400 tracking-tight leading-none">Catering Planner</p>
              </div>
            </div>

            <a
              href={`mailto:${SOCIETY_EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/60 shadow-sm text-slate-600 hover:text-emerald-700 hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <Icons.Mail />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{SOCIETY_EMAIL}</span>
            </a>
          </div>

          <button
            onClick={shareApp}
            className="group relative bg-white/80 backdrop-blur-xl hover:bg-white text-slate-800 px-6 py-4 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-white/50 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex items-center gap-3 self-start md:self-end"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Share Planner</span>
              <svg className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;