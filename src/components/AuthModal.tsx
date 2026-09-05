import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  X,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  sendPasswordReset,
  signInWithGoogle,
  formatAuthErrorMessage
} from '../lib/firebase';
import {
  getSavedAccounts,
  saveAccountToList,
  removeSavedAccount,
  SavedUserAccount
} from '../utils/storage';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'switch';
  onAuthSuccess?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'switch'>(initialMode);
  
  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedUserAccount[]>([]);
  const [showFirebaseConsoleHelp, setShowFirebaseConsoleHelp] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
      setShowFirebaseConsoleHelp(false);
      const accounts = getSavedAccounts();
      setSavedAccounts(accounts);
      if (initialMode === 'login' && accounts.length > 0 && !email) {
        // Pre-fill last used email
        setEmail(accounts[0].email);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha seu e-mail e sua senha.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowFirebaseConsoleHelp(false);

    try {
      const user = await signInWithEmail(email, password);
      sounds.playSuccess();
      
      saveAccountToList({
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || name || 'Atleta',
        photoURL: user.photoURL || undefined,
        lastLogin: new Date().toISOString(),
      });

      if (onAuthSuccess) onAuthSuccess(user.email || email);
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      const formatted = formatAuthErrorMessage(err);
      setErrorMsg(formatted);
      if (err?.code === 'auth/operation-not-allowed') {
        setShowFirebaseConsoleHelp(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Informe seu nome ou apelido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Digite um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowFirebaseConsoleHelp(false);

    try {
      const user = await signUpWithEmail(email, password, name);
      sounds.playSuccess();

      saveAccountToList({
        uid: user.uid,
        email: user.email || email,
        displayName: name.trim(),
        lastLogin: new Date().toISOString(),
      });

      if (onAuthSuccess) onAuthSuccess(user.email || email);
      onClose();
    } catch (err: any) {
      console.error('Register error:', err);
      const formatted = formatAuthErrorMessage(err);
      setErrorMsg(formatted);
      if (err?.code === 'auth/operation-not-allowed') {
        setShowFirebaseConsoleHelp(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Digite seu e-mail para receber as instruções de recuperação.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendPasswordReset(email);
      sounds.playClick();
      setSuccessMsg(`Enviamos um link de redefinição de senha para ${email}. Verifique sua caixa de entrada e spam!`);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMsg(formatAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        sounds.playSuccess();
        saveAccountToList({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Atleta',
          photoURL: user.photoURL || undefined,
          lastLogin: new Date().toISOString(),
        });
        if (onAuthSuccess) onAuthSuccess(user.email || '');
        onClose();
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(formatAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (account: SavedUserAccount) => {
    setEmail(account.email);
    setTab('login');
    setErrorMsg(null);
  };

  const handleRemoveAccount = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    removeSavedAccount(uid);
    setSavedAccounts(getSavedAccounts());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 border border-amber-500/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              {tab === 'switch' ? <Users className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{tab === 'register' ? 'Criar Nova Conta' : tab === 'forgot' ? 'Recuperar Senha' : tab === 'switch' ? 'Trocar de Usuário' : 'Entrar no Diário'}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                {tab === 'switch'
                  ? 'Selecione ou adicione outro atleta neste aparelho'
                  : 'Acesse seus treinos e histórico isolados por atleta'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              tab === 'login'
                ? 'border-amber-400 text-amber-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>

          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              tab === 'register'
                ? 'border-amber-400 text-amber-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Novo Atleta</span>
          </button>

          {savedAccounts.length > 0 && (
            <button
              type="button"
              onClick={() => { setTab('switch'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-t-xl border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                tab === 'switch'
                  ? 'border-amber-400 text-amber-400 bg-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contas Salvas ({savedAccounts.length})</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-zinc-200 text-sm">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {showFirebaseConsoleHelp && (
                  <div className="mt-2 pt-2 border-t border-red-500/20 text-[11px] text-zinc-300 space-y-1">
                    <p className="font-bold text-amber-400">Como habilitar E-mail/Senha no Firebase:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                      <li>Acesse o <strong>Firebase Console</strong> do seu projeto.</li>
                      <li>Vá em <strong>Authentication</strong> ➔ aba <strong>Sign-in method</strong>.</li>
                      <li>Clique em <strong>E-mail/senha</strong> e ative a primeira chave.</li>
                      <li>Clique em <strong>Salvar</strong>. Pronto!</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB: SWITCH USER (Saved Accounts on this phone) */}
          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Contas que já entraram neste aparelho. Toque para trocar de usuário rapidamente:
              </p>

              <div className="space-y-2">
                {savedAccounts.map((account) => (
                  <div
                    key={account.uid}
                    onClick={() => handleSelectAccount(account)}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3">
                      {account.photoURL ? (
                        <img
                          src={account.photoURL}
                          alt={account.displayName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full border border-amber-500/40 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                          {(account.displayName || account.email || 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                          {account.displayName}
                        </h4>
                        <p className="text-[11px] text-zinc-400">{account.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveAccount(e, account.uid)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                        title="Remover conta deste aparelho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setTab('register'); setErrorMsg(null); }}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5 border border-zinc-700 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cadastrar Outro Atleta</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  E-mail do Atleta:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-zinc-300">
                    Senha:
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 transition"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Entrar no Diário de Treino</span>
                  </>
                )}
              </button>

              {/* Social Login / Google divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-zinc-800 w-full" />
                <span className="bg-zinc-900 px-2 text-[10px] text-zinc-500 uppercase tracking-wider">
                  ou entre com
                </span>
                <div className="border-t border-zinc-800 w-full" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition active:scale-95 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Entrar com Conta Google</span>
              </button>
            </form>
          )}

          {/* TAB: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Nome ou Apelido do Atleta:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva ou Treinador Carlos"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  E-mail:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Senha (mín. 6 dígitos):
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Confirmar Senha:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="******"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 transition"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Ocultar senhas' : 'Ver senhas digitadas'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Criando Conta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Cadastrar Conta de Atleta</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Digite o e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha:
              </p>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Seu E-mail:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs transition"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar Link'}
                </button>
              </div>
            </form>
          )}

          {/* Security badge footer */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dados isolados por usuário e protegidos com criptografia no Google Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
