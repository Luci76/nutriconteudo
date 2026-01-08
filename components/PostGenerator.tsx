
import React, { useState, useEffect } from 'react';
import { PostInput, ContentGoal, ContentType, CommunicationTone } from '../types';

interface PostGeneratorProps {
  onGenerate: (input: PostInput) => void;
  onSearchHype: (niche: string) => void;
  isGenerating: boolean;
  isSearchingHype: boolean;
  externalSelection?: { niche: string, topic: string } | null;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ 
  onGenerate, 
  onSearchHype, 
  isGenerating, 
  isSearchingHype,
  externalSelection 
}) => {
  const [formData, setFormData] = useState<PostInput>({
    niche: '',
    targetAudience: '',
    goal: 'atração',
    contentType: 'post único',
    tone: 'profissional',
  });

  // Atualiza formulário se vier do Hype
  useEffect(() => {
    if (externalSelection) {
      setFormData(prev => ({ 
        ...prev, 
        niche: externalSelection.niche,
        goal: 'autoridade' // Geralmente Hype é para autoridade
      }));
    }
  }, [externalSelection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.niche || !formData.targetAudience) return;
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            Nicho / Tema Central
          </label>
          <button
            type="button"
            onClick={() => onSearchHype(formData.niche)}
            disabled={isSearchingHype || !formData.niche}
            className={`flex items-center gap-1.5 text-[10px] font-bold py-1.5 px-3 rounded-full transition-all border shadow-sm ${
              !formData.niche 
              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
              : 'bg-orange-500 text-white border-orange-400 hover:bg-orange-600 active:scale-95'
            }`}
          >
            {isSearchingHype ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                BUSCANDO...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.879 7.459 7.459 0 00-1.886 1.587c-.6.683-1.053 1.476-1.326 2.322-.272.845-.34 1.761-.307 2.665.065 1.811.605 3.613 1.633 5.03a10 10 0 0011.326 3.077 8.53 8.53 0 003.827-2.91 8.442 8.442 0 001.435-5.728 8.51 8.51 0 00-2.036-4.923 6.23 6.23 0 00-3.143-2.12c-.118-.033-.245-.05-.373-.05a1 1 0 00-.722.309 1 1 0 00-.011 1.411c.232.23.391.535.482.868.09.332.14.708.14 1.122 0 1.243-.433 2.417-1.13 3.47a1 1 0 01-1.667-1.1c.458-.693.76-1.447.887-2.212.127-.765.118-1.546-.017-2.308a11.83 11.83 0 00-.451-1.747c-.212-.596-.483-1.146-.817-1.62a1 1 0 01-.132-.191z" clipRule="evenodd" />
                </svg>
                VER HYPE 🔥
              </>
            )}
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex: Jejum Intermitente, PCOS, Longevidade..."
          required
          value={formData.niche}
          onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
          Público-alvo
        </label>
        <input
          type="text"
          placeholder="Ex: Mulheres 30+, Iniciantes na dieta..."
          required
          value={formData.targetAudience}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Objetivo</label>
          <select
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as ContentGoal })}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
          >
            <option value="atração">Atração</option>
            <option value="autoridade">Autoridade</option>
            <option value="conversão">Agendamento</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Formato</label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
          >
            <option value="post único">Post Único</option>
            <option value="carrossel">Carrossel</option>
            <option value="reel">Reel</option>
            <option value="ideia de stories">Stories</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider text-[11px]">
          Tom de Voz
        </label>
        <div className="flex gap-2">
          {(['profissional', 'acolhedor', 'direto'] as CommunicationTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData({ ...formData, tone: t })}
              className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                formData.tone === t
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !formData.niche || !formData.targetAudience}
        className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
             <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             ELABORANDO...
          </span>
        ) : (
          <>🚀 GERAR CONTEÚDO ESTRATÉGICO</>
        )}
      </button>
    </form>
  );
};

export default PostGenerator;
