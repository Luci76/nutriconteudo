
import React, { useState, useEffect } from 'react';
import { PostInput, GeneratedPost, HypeTrend } from './types';
import { generateNutriContent, fetchHypeTrends } from './services/geminiService';
import Header from './components/Header';
import PostGenerator from './components/PostGenerator';
import HistoryList from './components/HistoryList';
import HypeDisplay from './components/HypeDisplay';
import Login from './components/Login';
import { Toaster, toast } from 'react-hot-toast';

type AppView = 'login' | 'main';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingHype, setIsSearchingHype] = useState(false);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  const [trends, setTrends] = useState<HypeTrend[]>([]);
  const [showHype, setShowHype] = useState(false);
  
  // Estado para pré-preenchimento via Hype
  const [hypeSelection, setHypeSelection] = useState<{niche: string, topic: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nutri_content_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    const savedUser = localStorage.getItem('nutri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('main');
    }
  }, []);

  const handleLogin = (userData: { name: string, email: string }) => {
    setUser(userData);
    localStorage.setItem('nutri_user', JSON.stringify(userData));
    setView('main');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nutri_user');
    setView('login');
    toast.success('Sessão encerrada.');
  };

  const saveToHistory = (post: GeneratedPost) => {
    const newHistory = [post, ...history].slice(0, 20);
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
      toast.success('Conteúdo estratégico gerado!');
      setShowHype(false);
    } catch (error) {
      toast.error('Erro na geração. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchHype = async (niche: string) => {
    if (!niche) {
      toast.error('Informe seu nicho de atuação!');
      return;
    }
    setIsSearchingHype(true);
    setShowHype(true);
    try {
      const results = await fetchHypeTrends(niche);
      setTrends(results);
    } catch (error) {
      toast.error('Erro ao buscar tendências.');
    } finally {
      setIsSearchingHype(false);
    }
  };

  const handleUseTrend = (trend: HypeTrend) => {
    setHypeSelection({ niche: trend.topic, topic: trend.topic });
    toast.success('Tendência selecionada! Finalize os detalhes abaixo.');
    document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (view === 'login') return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header userName={user?.name} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coluna de Configuração */}
          <div className="lg:col-span-5 space-y-6">
            <div id="generator-form" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </span>
                Criar Postagem
              </h2>
              <PostGenerator 
                onGenerate={handleGenerate} 
                onSearchHype={handleSearchHype}
                isGenerating={isGenerating} 
                isSearchingHype={isSearchingHype}
                externalSelection={hypeSelection}
              />
            </div>

            <HistoryList 
              history={history} 
              onSelect={(post) => {
                setCurrentPost(post);
                setShowHype(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onClear={() => {
                setHistory([]);
                localStorage.removeItem('nutri_content_history');
                toast.success('Histórico limpo');
              }}
            />
          </div>

          {/* Coluna de Exibição (Hype ou Resultado) */}
          <div className="lg:col-span-7 space-y-8">
            {showHype && (
              <HypeDisplay 
                trends={trends} 
                isLoading={isSearchingHype} 
                onClose={() => setShowHype(false)}
                onUseTrend={handleUseTrend}
              />
            )}

            {isGenerating && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">A IA está analisando seu nicho...</p>
                <p className="text-sm text-slate-400">Criando legenda humanizada e ética.</p>
              </div>
            )}

            {currentPost && !isGenerating && (
              <div id="result-post" className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">{currentPost.type}</span>
                    <h3 className="text-xl font-bold">{currentPost.title}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${currentPost.title}\n\n${currentPost.legend}\n\n${currentPost.cta}`);
                      toast.success('Conteúdo copiado!');
                    }}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Design do Post</h4>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                      {currentPost.structure}
                    </div>
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Legenda Pronta</h4>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(currentPost.legend);
                          toast.success('Legenda copiada!');
                        }}
                        className="text-xs text-emerald-600 font-bold hover:text-emerald-700"
                      >
                        COPIAR LEGENDA
                      </button>
                    </div>
                    <div className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 whitespace-pre-wrap text-slate-700 leading-relaxed italic">
                      {currentPost.legend}
                    </div>
                  </section>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-emerald-600 text-white p-4 rounded-xl text-center font-bold">
                      {currentPost.cta}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!currentPost && !isGenerating && !showHype && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700">O que vamos postar hoje?</h3>
                <p className="text-slate-400 mt-2 max-w-sm">Use o formulário à esquerda ou busque as tendências do momento com o botão de Hype.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
