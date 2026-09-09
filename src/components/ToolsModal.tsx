import React from 'react';
import { X, BellRing, Zap, Scale } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAlarm: () => void;
  onOpenTimer: () => void;
  onOpenPlates: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  onOpenAlarm,
  onOpenTimer,
  onOpenPlates,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pb-28 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full sm:w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Ferramentas</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          <button
            onClick={() => { onClose(); onOpenTimer(); }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/50 transition active:scale-95 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Cronômetro de Descanso</h3>
              <p className="text-xs text-zinc-500">Timer visual para pausas entre as séries</p>
            </div>
          </button>

          <button
            onClick={() => { onClose(); onOpenPlates(); }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/50 transition active:scale-95 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Scale className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Calculadora de Anilhas</h3>
              <p className="text-xs text-zinc-500">Distribua as cargas corretamente na barra</p>
            </div>
          </button>

          <button
            onClick={() => { onClose(); onOpenAlarm(); }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/50 transition active:scale-95 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
              <BellRing className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Alarme e Horários</h3>
              <p className="text-xs text-zinc-500">Programe lembretes e sons de alarme</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
