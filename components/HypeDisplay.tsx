
import React from 'react';
import { HypeTrend } from '../types';

interface HypeDisplayProps {
  trends: HypeTrend[];
  isLoading: boolean;
  onClose: () => void;
  onUseTrend: (trend: HypeTrend) => void;
}

const HypeDisplay: React.FC<HypeDisplayProps> = ({ trends, isLoading, onClose, onUseTrend }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500 w-2 h-2 rounded-full animate-pulse"></span>
              <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">Trending Now</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Radares de Hype 🔥</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-6 py-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : trends.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {trends.map((trend, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all group">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                    {trend.topic}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">CALIENTE</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{trend.summary}</p>
                
                <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Ângulo Sugerido:</span>
                  <p className="text-sm text-emerald-800 font-medium italic">"{trend.angle}"</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex gap-2">
                    {trend.sources?.slice(0, 1).map((src, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={src.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-400 hover:text-orange-600 underline flex items-center gap-1"
                      >
                        Fonte: {src.title || 'Referência'}
                      </a>
                    ))}
                  </div>
                  <button 
                    onClick={() => onUseTrend(trend)}
                    className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    CRIAR POST
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 font-medium italic">Nenhuma faísca encontrada. Tente um nicho mais específico.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HypeDisplay;
