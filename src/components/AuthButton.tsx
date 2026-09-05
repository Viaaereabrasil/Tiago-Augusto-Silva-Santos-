import React, { useState } from 'react';
import { 
  User, 
  LogIn, 
  LogOut, 
  Cloud, 
  CloudOff, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  WifiOff, 
  Users, 
  UserPlus,
  KeyRound
} from 'lucide-react';
import { logOut } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthButtonProps {
  user: FirebaseUser | null;
  loading?: boolean;
  isSyncing?: boolean;
  onSyncManual?: () => void;
  isOnline?: boolean;
  pendingSyncCount?: number;
  onOpenOfflineModal?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register' | 'switch') => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  user,
  loading = false,
  isSyncing = false,
  onSyncManual,
  isOnline = true,
  pendingSyncCount = 0,
  onOpenOfflineModal,
  onOpenAuthModal,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (user) {
    return (
      <div className="relative">
        <button
          id="btn-user-profile-menu"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border text-zinc-200 text-xs font-semibold transition active:scale-95 ${
            !isOnline
              ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
              : pendingSyncCount > 0
                ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-zinc-800/90 hover:bg-zinc-750 border-zinc-700/80'
          }`}
          title={`Conectado como ${user.displayName || user.email}`}
        >
          {user.photoURL ? (
            <img
              referrerPolicy="no-referrer"
              src={user.photoURL}
              alt={user.displayName || 'Avatar'}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-amber-500/40 object-cover shrink-0"
            />
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden md:flex flex-col text-left leading-tight max-w-[110px]">
            <span className="text-[11px] font-bold text-zinc-200 truncate">{user.displayName || 'Atleta'}</span>
            {!isOnline ? (
              <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5">
                <WifiOff className="w-2.5 h-2.5" /> Offline
              </span>
            ) : pendingSyncCount > 0 ? (
              <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5">
                <CloudOff className="w-2.5 h-2.5" /> {pendingSyncCount} pendente(s)
              </span>
            ) : (
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
                <Cloud className="w-2.5 h-2.5" /> Nuvem Ativa
              </span>
            )}
          </div>

          {isSyncing && (
            <RefreshCw className="w-3 h-3 text-amber-400 animate-spin shrink-0 ml-0.5" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700/90 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-800">
                {user.photoURL ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-9 h-9 rounded-full border border-amber-500/40 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-100 truncate">{user.displayName || 'Atleta'}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="py-2.5 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                    {!isOnline ? (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Modo Offline</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Firestore Conectado</span>
                      </>
                    )}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                    !isOnline 
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : pendingSyncCount > 0 
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {!isOnline 
                      ? 'Offline' 
                      : pendingSyncCount > 0 
                        ? `${pendingSyncCount} pendente(s)` 
                        : 'Sincronizado'}
                  </span>
                </div>

                <p className="text-[10px] text-zinc-400 px-1 leading-relaxed">
                  Treinos salvos e isolados para o atleta <strong>{user.displayName || user.email}</strong>.
                </p>

                {onOpenAuthModal && (
                  <div className="space-y-1 pt-1">
                    <button
                      id="btn-switch-user-menu"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAuthModal('switch');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition text-left"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trocar de Usuário / Outro Atleta</span>
                    </button>

                    <button
                      id="btn-register-another-user-menu"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAuthModal('register');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-[11px] text-zinc-300 hover:text-white font-medium transition text-left"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Cadastrar Novo Atleta</span>
                    </button>
                  </div>
                )}

                {onOpenOfflineModal && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenOfflineModal();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 transition"
                  >
                    Ver detalhes de sincronização →
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                {onSyncManual && (
                  <button
                    id="btn-sync-manual-user"
                    onClick={() => {
                      onSyncManual();
                      setIsDropdownOpen(false);
                    }}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold text-zinc-200 transition active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Forçar Sincronização'}</span>
                  </button>
                )}

                <button
                  id="btn-signout-user"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        id="btn-open-login-modal"
        onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95 disabled:opacity-50"
        title="Entrar com e-mail e senha ou Google para salvar treinos por atleta"
      >
        <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">Entrar / Login</span>
        <span className="sm:hidden">Entrar</span>
      </button>
    </div>
  );
};


