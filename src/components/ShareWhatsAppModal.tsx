import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, ExternalLink, MessageCircle } from 'lucide-react';
import { WorkoutSession } from '../types';
import { formatWorkoutForWhatsApp } from '../utils/whatsappFormatter';

interface ShareWhatsAppProps {
  isOpen: boolean;
  onClose: () => void;
  session: WorkoutSession;
}

export const ShareWhatsAppModal: React.FC<ShareWhatsAppProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const formattedText = formatWorkoutForWhatsApp(session);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(formattedText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-6">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Exportar Treino para WhatsApp</h3>
              <p className="text-xs text-zinc-400">Texto formatado com cargas e séries</p>
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
        <div className="p-5 space-y-4">
          <div className="relative">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Pré-visualização do Relatório:
            </label>
            <textarea
              readOnly
              value={formattedText}
              rows={12}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-none selection:bg-emerald-500/30"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              id="btn-copy-whatsapp"
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copiar Mensagem</span>
                </>
              )}
            </button>

            <button
              id="btn-send-whatsapp"
              onClick={handleOpenWhatsApp}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Abrir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
