import React, { useState, useRef } from 'react';
import {
  X,
  Sliders,
  Volume2,
  VolumeX,
  Timer,
  Sparkles,
  RotateCcw,
  Cloud,
  ShieldCheck,
  LogIn,
  LogOut,
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Check,
  Smartphone
} from 'lucide-react';
import {
  UserPreferences,
  downloadBackupJSON,
  restoreBackupFromJSON,
  loadHistory,
  loadTemplates
} from '../utils/storage';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onResetFactoryData: () => void;
  authUser?: FirebaseUser | null;
  onManualSync?: () => void;
  isSyncing?: boolean;
  onBackupRestored?: (data: any) => void;
  onOpenPWAInstall?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register' | 'switch') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onResetFactoryData,
  authUser,
  onManualSync,
  isSyncing = false,
  onBackupRestored,
  onOpenPWAInstall,
  onOpenAuthModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const restOptions = [30, 45, 60, 90, 120, 180];
  const historyCount = loadHistory().length;
  const templatesCount = loadTemplates().length;

  const handleDownloadBackup = async () => {
    try {
      const res = downloadBackupJSON(false);
      let shared = false;
      
      // Attempt to use native share (mobile) to allow saving to cloud directly
      if (navigator.share && res.file) {
        try {
          await navigator.share({
            title: 'Backup Diário de Treino',
            text: 'Aqui está o backup dos meus treinos.',
            files: [res.file]
          });
          shared = true;
        } catch (shareErr) {
          console.log('Share API falhou ou foi cancelada, baixando normal...');
        }
      }

      if (!shared) {
        const url = URL.createObjectURL(res.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename;
        link.setAttribute('style', 'display: none');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setDownloadSuccess(`Backup exportado: ${res.filename} (${(res.fileSizeBytes / 1024).toFixed(1)} KB)`);
      setRestoreStatus(null);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error('Error downloading backup:', err);
      setRestoreStatus({
        type: 'error',
        message: 'Erro ao gerar arquivo de backup.',
      });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setRestoreStatus({ type: 'error', message: 'Arquivo vazio ou ilegível.' });
        return;
      }
      const res = restoreBackupFromJSON(text);
      if (res.success && res.restoredData) {
        setRestoreStatus({ type: 'success', message: res.message });
        setDownloadSuccess(null);
        if (onBackupRestored) {
          onBackupRestored(res.restoredData);
        }
      } else {
        setRestoreStatus({ type: 'error', message: res.message });
      }
      // Reset input value so same file can be reselected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setRestoreStatus({ type: 'error', message: 'Erro ao ler o arquivo selecionado.' });
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 pb-28 sm:pt-4 sm:px-4 sm:pb-28 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Configurações & Backup</h3>
              <p className="text-xs text-zinc-400">Preferências, nuvem e exportação de dados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs text-zinc-300 overflow-y-auto">
          {/* Manual JSON Backup & Offline Export Section */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span>Backup Manual em JSON</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded uppercase font-bold">
                      100% Offline
                    </span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    Garante um arquivo independente do Firebase direto no seu aparelho
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Baixe todos os seus dados (histórico de treinos, séries, cargas, fichas e preferências) em um arquivo <strong className="text-amber-300">.json</strong>. Funciona totalmente offline e pode ser guardado no seu computador, celular ou nuvem pessoal.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 bg-zinc-900/90 p-2 rounded-lg border border-zinc-800">
              <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                <HardDrive className="w-3 h-3 text-amber-400" />
                Dados atuais:
              </span>
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">
                {historyCount} {historyCount === 1 ? 'treino registrado' : 'treinos registrados'}
              </span>
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">
                {templatesCount} fichas
              </span>
            </div>

            {/* Action Buttons: Download and Restore */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="btn-download-json-backup"
                onClick={handleDownloadBackup}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Baixar Backup (.json)</span>
              </button>

              <button
                id="btn-trigger-restore-json"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Restaurar de Arquivo</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".json,application/json"
                className="hidden"
              />
            </div>

            {/* Download Success Notice */}
            {downloadSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{downloadSuccess}</span>
              </div>
            )}

            {/* Restore Feedback Notice */}
            {restoreStatus && (
              <div className={`p-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-2 animate-in fade-in ${
                restoreStatus.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/15 border border-red-500/30 text-red-300'
              }`}>
                {restoreStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{restoreStatus.message}</span>
              </div>
            )}
          </div>

          {/* Cloud Sync & Google Auth Section */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Sincronização na Nuvem</h4>
                  <p className="text-[10px] text-zinc-400">Google Cloud Firestore</p>
                </div>
              </div>

              {authUser ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Conectado
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-medium">
                  Modo Offline / Local
                </span>
              )}
            </div>

            {authUser ? (
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  {authUser.photoURL && (
                    <img
                      referrerPolicy="no-referrer"
                      src={authUser.photoURL}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full border border-amber-500/30"
                    />
                  )}
                  <div className="overflow-hidden">
                    <p className="font-bold text-zinc-200 text-xs truncate">{authUser.displayName || 'Atleta'}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{authUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {onOpenAuthModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuthModal('switch');
                      }}
                      className="py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-amber-400 font-bold text-[11px] transition flex items-center justify-center gap-1.5 border border-zinc-700"
                    >
                      <span>Trocar de Usuário</span>
                    </button>
                  )}
                  {onManualSync && (
                    <button
                      onClick={onManualSync}
                      disabled={isSyncing}
                      className="py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
                    >
                      <Cloud className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => logOut()}
                  className="w-full py-2 px-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-bold text-[11px] transition flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Conta Atual</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <p className="text-[11px] text-zinc-400">
                  Faça login ou cadastre-se para salvar os treinos de múltiplos usuários com histórico individual e seguro.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAuthModal) onOpenAuthModal('login');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Entrar (E-mail e Senha)</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAuthModal) onOpenAuthModal('register');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs border border-zinc-700 transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Criar Nova Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Default Rest Timer */}
          <div>
            <label className="font-bold text-white block mb-2 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-400" /> Tempo Padrão de Descanso:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {restOptions.map((sec) => (
                <button
                  key={sec}
                  onClick={() => onSavePreferences({ ...preferences, defaultRestSeconds: sec })}
                  className={`py-2 rounded-xl font-bold transition ${
                    preferences.defaultRestSeconds === sec
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-750'
                  }`}
                >
                  {sec} segundos
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <span className="font-bold text-white block">Efeitos Sonoros & Vibração</span>
              <span className="text-[11px] text-zinc-500">
                Tocar sino ao marcar série e aviso ao fim do descanso
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({ ...preferences, soundEnabled: !preferences.soundEnabled })
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                preferences.soundEnabled ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-zinc-950 transition-transform ${
                  preferences.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Start Timer on Check */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <span className="font-bold text-white block">Iniciar Descanso Automaticamente</span>
              <span className="text-[11px] text-zinc-500">
                Abre o cronômetro assim que você marcar a série como concluída
              </span>
            </div>
            <button
              onClick={() =>
                onSavePreferences({
                  ...preferences,
                  autoStartTimerOnCheck: !preferences.autoStartTimerOnCheck,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                preferences.autoStartTimerOnCheck ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-zinc-950 transition-transform ${
                  preferences.autoStartTimerOnCheck ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Install on Mobile PWA */}
          {onOpenPWAInstall && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-zinc-950 to-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs sm:text-sm">Instalar Aplicativo no Celular</span>
                  <span className="text-[11px] text-zinc-400">
                    Instale como aplicativo nativo (ícone na tela inicial, 100% tela cheia e offline).
                  </span>
                </div>
              </div>
              <button
                id="btn-settings-open-pwa"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPWAInstall();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition active:scale-95 shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Instalar / Baixar</span>
              </button>
            </div>
          )}

          {/* Reset All to Original State */}
          <div className="pt-2 border-t border-zinc-800">
            {confirmFactoryReset ? (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2">
                <p className="text-xs text-rose-300 font-medium">
                  Tem certeza? Isso restaurará as fichas padrão originais (Superior A/B e Inferiores A/B).
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetFactoryData();
                      setConfirmFactoryReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                  >
                    Sim, Restaurar
                  </button>
                  <button
                    onClick={() => setConfirmFactoryReset(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmFactoryReset(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Ficha Padrão Original</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
