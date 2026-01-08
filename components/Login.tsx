
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface LoginProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

interface UserAccount {
  name: string;
  email: string;
  password?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getAccounts = (): UserAccount[] => {
    const accounts = localStorage.getItem('nutri_accounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const accounts = getAccounts();

    if (isSignUp) {
      // Logic for Registration
      const userExists = accounts.find(acc => acc.email === email);
      if (userExists) {
        toast.error('Este e-mail já está cadastrado.');
        setIsLoggingIn(false);
        return;
      }

      const newAccount: UserAccount = { name, email, password };
      const updatedAccounts = [...accounts, newAccount];
      localStorage.setItem('nutri_accounts', JSON.stringify(updatedAccounts));
      
      toast.success('Conta criada com sucesso!');
      onLogin({ name, email });
    } else {
      // Logic for Login
      const account = accounts.find(acc => acc.email === email && acc.password === password);
      
      if (account) {
        toast.success(`Bem-vinda de volta, ${account.name}!`);
        onLogin({ name: account.name, email: account.email });
      } else {
        toast.error('E-mail ou senha incorretos.');
      }
    }
    
    setIsLoggingIn(false);
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    const toastId = toast.loading('Conectando à sua conta Google...');
    
    setTimeout(() => {
      toast.success('Login via Google realizado!', { id: toastId });
      onLogin({ name: 'Nutricionista Conectada', email: 'google-user@gmail.com' });
      setIsLoggingIn(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 pt-10 text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSignUp ? 'Criar sua conta' : 'Acesse o NutriConteúdo'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isSignUp ? 'Comece a gerar conteúdos estratégicos hoje.' : 'Seja bem-vinda de volta ao seu painel.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="p-8 pt-0 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Profissional</label>
              <input 
                type="text" 
                placeholder="Dra. Juliana Silva"
                required
                disabled={isLoggingIn}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              required
              disabled={isLoggingIn}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              disabled={isLoggingIn}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoggingIn ? 'Aguarde...' : isSignUp ? 'Criar minha conta' : 'Entrar no sistema'}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-3 text-slate-300">ou continue com</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5" alt="Google" />
            </button>
            <button 
              type="button" 
              disabled={isLoggingIn}
              className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/331395/facebook.svg" className="h-5 w-5" alt="Facebook" />
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Sua privacidade é nossa prioridade. Dados protegidos.<br/>
            NutriConteúdo IA &copy; 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
