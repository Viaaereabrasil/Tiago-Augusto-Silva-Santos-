import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Zap,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Share2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  if (!isOpen) return null;

  // Determine direct share/install URL
  const defaultShareUrl = 'https://ais-pre-5gm2725apbcnvshvm4vmpa-72751191911.us-east5.run.app';
  const appUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : defaultShareUrl;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(appUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = appUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      sounds.playSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOpenNewTab = () => {
    sounds.playClick();
    window.open(appUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    const message = `🏋️‍♂️ *Diário de Treino Pro*\nAcesse e instale o aplicativo direto no seu celular para registrar seus treinos mesmo 100% offline:\n\n${appUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-amber-500/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Instalar no Celular</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                  App PWA
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Instale como aplicativo nativo e use 100% offline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-zinc-300 text-sm">
          {/* Direct Link & Quick Action Box */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Link Direto de Instalação:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="text-[11px] font-bold text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrCode ? 'Ocultar QR' : 'Escanear QR'}</span>
              </button>
            </div>

            {/* URL bar */}
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 break-all select-all">
              <span className="truncate flex-1 text-[11px] text-zinc-300">{appUrl}</span>
            </div>

            {/* Action buttons: Copiar Link & Abrir Nova Aba */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                id="btn-copy-install-link"
                onClick={handleCopyLink}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm ${
                  copied
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-open-install-tab"
                onClick={handleOpenNewTab}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 transition active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>Abrir em Nova Aba</span>
              </button>
            </div>

            {/* Share via WhatsApp */}
            <button
              type="button"
              id="btn-share-whatsapp-install"
              onClick={handleShareWhatsApp}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar Link para Meu WhatsApp</span>
            </button>

            {/* QR Code section (if toggled) */}
            {showQrCode && (
              <div className="pt-2 flex flex-col items-center justify-center space-y-2 text-center bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 animate-in fade-in">
                <p className="text-[11px] text-zinc-400">
                  Aponte a câmera do seu celular para abrir e instalar:
                </p>
                <div className="p-2 bg-white rounded-xl shadow-lg inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code para Instalação"
                    className="w-36 h-36 object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-white">Sem Internet</span>
              <span className="text-[11px] text-zinc-400">Funciona mesmo sem sinal ou no modo avião</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-white">Tela Cheia</span>
              <span className="text-[11px] text-zinc-400">Sem barras do navegador, experiência nativa</span>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">O aplicativo já está instalado!</p>
                <p className="text-xs text-emerald-400/80">Você já pode abri-lo direto pelo ícone na tela inicial do seu celular.</p>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Seu navegador suporta a instalação direta em 1 clique:
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                <span>Instalar Agora no Aparelho</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3 p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Como instalar no iPhone / iPad (Safari):
              </h4>
              <ol className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Abra o link acima no <strong>Safari</strong> do iPhone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> na barra inferior do Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Role o menu e toque em <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                  <span>Toque em <strong>Adicionar</strong> no topo direito. Pronto! O app fica na sua tela inicial.</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Generic Chrome Instructions */
            <div className="space-y-3 p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Como instalar no Android / Chrome:
              </h4>
              <ol className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Abra o link acima no <strong>Google Chrome</strong> do seu celular.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                  <span>Confirme em <strong>Instalar</strong>. O ícone aparecerá como aplicativo no seu aparelho!</span>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
