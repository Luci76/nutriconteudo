
import React, { useState, useEffect } from 'react';
import { PostInput, GeneratedPost } from './types';
import { generateNutriContent } from './services/geminiService';
import Header from './components/Header';
import PostGenerator from './components/PostGenerator';
import HistoryList from './components/HistoryList';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nutri_content_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    }
  }, []);

  const saveToHistory = (post: GeneratedPost) => {
    const newHistory = [post, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('nutri_content_history', JSON.stringify(newHistory));
  };

  const handleGenerate = async (input: PostInput) => {
    setIsGenerating(true);
    setCurrentPost(null);
    try {
      const result = await generateNutriContent(input);
      const newPost: GeneratedPost = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input,
        title: result.title,
        type: result.type,
        structure: result.structure,
        legend: result.legend,
        cta: result.cta,
      };
      setCurrentPost(newPost);
      saveToHistory(newPost);
      toast.success('Conteúdo gerado com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao gerar o conteúdo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Deseja realmente limpar seu histórico?')) {
      setHistory([]);
      localStorage.removeItem('nutri_content_history');
      toast.success('Histórico limpo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </span>
                Criar Novo Conteúdo
              </h2>
              <PostGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div>
          </div>

          {/* Right Column - Results & History */}
          <div className="lg:col-span-7 space-y-8">
            {isGenerating && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">NutriConteúdo IA está elaborando sua estratégia...</p>
                <p className="text-sm text-slate-400 mt-2">Isso pode levar alguns segundos.</p>
              </div>
            )}

            {currentPost && !isGenerating && (
              <div id="result-post" className="bg-white rounded-2xl shadow-md border-2 border-emerald-100 p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                      {currentPost.type}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800">{currentPost.title}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`📌 Título: ${currentPost.title}\n📲 Tipo: ${currentPost.type}\n🧩 Estrutura: ${currentPost.structure}\n📝 Legenda: ${currentPost.legend}\n👉 CTA: ${currentPost.cta}`);
                      toast.success('Conteúdo copiado!');
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                    title="Copiar tudo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      Estrutura do Post
                    </h4>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {currentPost.structure}
                    </div>
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Legenda Sugerida
                      </h4>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(currentPost.legend);
                          toast.success('Legenda copiada!');
                        }}
                        className="text-xs text-emerald-600 hover:underline font-medium"
                      >
                        Copiar legenda
                      </button>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed italic">
                      {currentPost.legend}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      CTA Final
                    </h4>
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                      {currentPost.cta}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {!currentPost && !isGenerating && history.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-600">Nenhum conteúdo gerado ainda</h3>
                <p className="text-slate-400 mt-1 max-w-xs mx-auto">Preencha o formulário ao lado para criar sua primeira postagem estratégica.</p>
              </div>
            )}

            {history.length > 0 && (
              <HistoryList 
                history={history} 
                onSelect={(post) => {
                  setCurrentPost(post);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onClear={clearHistory}
              />
            )}
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
