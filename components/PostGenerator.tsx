
import React, { useState } from 'react';
import { PostInput, ContentGoal, ContentType, CommunicationTone } from '../types';

interface PostGeneratorProps {
  onGenerate: (input: PostInput) => void;
  isGenerating: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState<PostInput>({
    niche: '',
    targetAudience: '',
    goal: 'atração',
    contentType: 'post único',
    tone: 'profissional',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.niche || !formData.targetAudience) return;
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nicho da Nutricionista
        </label>
        <input
          type="text"
          placeholder="Ex: Emagrecimento, Saúde Intestinal..."
          required
          value={formData.niche}
          onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Público-alvo
        </label>
        <input
          type="text"
          placeholder="Ex: Mulheres 30-50 anos, Atletas..."
          required
          value={formData.targetAudience}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Objetivo
          </label>
          <select
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as ContentGoal })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            <option value="atração">Atração (Novos seguidores)</option>
            <option value="autoridade">Autoridade (Provar conhecimento)</option>
            <option value="conversão">Conversão (Venda de consultas)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Tipo de Conteúdo
          </label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            <option value="post único">Post Único (Foto/Arte)</option>
            <option value="carrossel">Carrossel (Vários slides)</option>
            <option value="reel">Reel (Vídeo curto)</option>
            <option value="ideia de stories">Ideia de Stories</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Tom da Comunicação
        </label>
        <div className="flex gap-3">
          {(['profissional', 'acolhedor', 'direto'] as CommunicationTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData({ ...formData, tone: t })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                formData.tone === t
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !formData.niche || !formData.targetAudience}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l1.418 15.924a1 1 0 01-1.087 1.085l-3.524-.31a1 1 0 01-.897-.95L6.69 1.822a1 1 0 011.087-1.085l3.524.31zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Gerar Post Pronto
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-slate-400 mt-2">
        Respeitamos o código de ética do CFN. O conteúdo gerado é educativo e não substitui a consulta individual.
      </p>
    </form>
  );
};

export default PostGenerator;
