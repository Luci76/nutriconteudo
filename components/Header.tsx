
import React from 'react';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              NutriConteúdo IA
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Marketing Estratégico</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {userName && (
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-none">{userName}</p>
                <button 
                  onClick={onLogout}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  SAIR
                </button>
              </div>
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm">
                {userName.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
