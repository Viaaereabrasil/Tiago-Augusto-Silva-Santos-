import React, { useState } from 'react';
import {
  WifiOff,
  Wifi,
  CloudOff,
  Cloud,
  CheckCircle2,
  RefreshCw,
  X,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  Download,
  FileJson
} from 'lucide-react';
import { PendingSyncItem } from '../utils/syncQueue';
import { downloadBackupJSON } from '../utils/storage';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  pendingItems: PendingSyncItem[];
  isSyncing: boolean;
  onSyncManual: () => Promise<void> | void;
  authUser: any;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  pendingItems,
  isSyncing,
  onSyncManual,
  authUser,
}) => {
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    try {
      const res = downloadBackupJSON();
      setDownloadNotice(`Backup salvo: ${res.filename}`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: 'Erro ao gerar backup JSON local.',
      });
    }
  };

  const handleTriggerSync = async () => {
    setSyncFeedback({ type: null, message: '' });
    try {
      await onSyncManual();
      if (pendingItems.length === 0) {
        setSyncFeedback({
          type: 'success',
          message: 'Sincronização concluída com sucesso! Todos os dados estão atualizados na nuvem.',
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: 'Não foi possível conectar ao servidor do Firebase. Verifique sua conexão.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${
          !isOnline 
            ? 'bg-amber-500/10 border-amber-500/20' 
            : pendingItems.length > 0
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
              !isOnline
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : pendingItems.length > 0
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {!isOnline ? (
                <WifiOff className="w-5 h-5 animate-pulse" />
              ) : pendingItems.length > 0 ? (
                <CloudOff className="w-5 h-5 text-amber-400" />
              ) : (
                <Cloud className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>
                  {!isOnline
                    ? 'Modo Offline Ativo'
                    : pendingItems.length > 0
                      ? 'Pendente de Sincronização'
                      : 'Sincronização Ativa'}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  !isOnline
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : pendingItems.length > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {!isOnline ? 'Offline' : pendingItems.length > 0 ? 'Pendente' : 'Online'}
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {!isOnline
                  ? 'Armazenamento local seguro ativado'
                  : 'Status da conexão com Firebase Firestore'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-offline-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition active:scale-95"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-zinc-300">
          {/* Security & Local Storage Guarantee Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-850 border border-zinc-750 space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-xs sm:text-sm">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Seus treinos estão 100% protegidos</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
              Você pode continuar registrando suas séries, alterando cargas, adicionando novos exercícios e concluindo treinos normalmente. Toda a sua atividade é salva <strong className="text-zinc-200">instantaneamente no armazenamento interno do seu navegador</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Zero perda de dados mesmo se a conexão cair ou a aba for fechada.</span>
            </div>
          </div>

          {/* Pending Sync Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Fila de Sincronização ({pendingItems.length})
              </span>
              {pendingItems.length > 0 && (
                <span className="text-[10px] text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  {pendingItems.length} {pendingItems.length === 1 ? 'pendência' : 'pendências'}
                </span>
              )}
            </div>

            {pendingItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-zinc-200">Tudo sincronizado</p>
                <p className="text-[11px] text-zinc-400">
                  {authUser 
                    ? 'Nenhuma alteração pendente de envio para o Firebase.'
                    : 'Conecte sua conta Google para sincronizar seus dados com outros dispositivos.'}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-zinc-200 text-xs truncate">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
                      Aguardando rede
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Message */}
          {syncFeedback.message && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/15 border-red-500/30 text-red-300'
            }`}>
              {syncFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
          )}

          {/* User Account Info */}
          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Conta Google vinculada:</span>
            <span className="font-semibold text-zinc-200 truncate max-w-[200px]">
              {authUser ? (authUser.displayName || authUser.email) : 'Nenhuma (Modo Anônimo/Local)'}
            </span>
          </div>

          {/* Quick Offline JSON Backup Download */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <FileJson className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Backup Manual Independente</p>
                <p className="text-[10px] text-zinc-400">Baixe um arquivo .json com todos os seus treinos</p>
              </div>
            </div>
            <button
              id="btn-download-json-offline-modal"
              onClick={handleDownloadBackup}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 self-end sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .JSON</span>
            </button>
          </div>

          {downloadNotice && (
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{downloadNotice}</span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-3 sm:p-4 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
            <span>{isOnline ? 'Conexão ativa' : 'Dispositivo desconectado'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition active:scale-95"
            >
              Continuar Treinando
            </button>

            <button
              id="btn-trigger-sync-modal"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
