
import React from 'react';
import { GeneratedPost } from '../types';

interface HistoryListProps {
  history: GeneratedPost[];
  onSelect: (post: GeneratedPost) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Histórico Recente
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
        >
          Limpar
        </button>
      </div>
      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
        {history.map((post) => (
          <button
            key={post.id}
            onClick={() => onSelect(post)}
            className="w-full p-4 text-left hover:bg-slate-50 transition-colors group flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{post.type}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(post.timestamp).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-700 truncate group-hover:text-emerald-700">
                {post.title}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {post.input.niche} • {post.input.goal}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
