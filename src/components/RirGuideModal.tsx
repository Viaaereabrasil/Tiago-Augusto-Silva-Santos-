import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Flame, Shield, ArrowRight } from 'lucide-react';

interface RirGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RirGuideModal: React.FC<RirGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Guia de Sensação de Reserva (RIR)</h3>
              <p className="text-xs text-zinc-400">Metodologia de Alta Performance</p>
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
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-zinc-300 leading-relaxed">
          {/* Concept intro */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-amber-400" /> O que significa "Reps na Reserva"?
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <strong>RIR (Reps in Reserve)</strong> é o número de repetições adicionais que você
              ainda conseguiria fazer com boa postura antes de atingir a falha concêntrica total.
            </p>
          </div>

          {/* RIR Breakdown table */}
          <div className="space-y-2.5">
            {/* RIR 0 */}
            <div className="p-3 bg-zinc-850 border border-rose-500/30 rounded-xl flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs shrink-0">
                RIR 0
              </span>
              <div>
                <span className="font-bold text-rose-300 text-xs block">
                  0 na reserva (Falha Concéntrica)
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Você não conseguiria completar nem mais 1 repetição com forma correta. Recrutamento
                  máximo de fibras musculares de alto limiar.
                </p>
              </div>
            </div>

            {/* RIR 1 */}
            <div className="p-3 bg-zinc-850 border border-orange-500/30 rounded-xl flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono font-bold text-xs shrink-0">
                RIR 1
              </span>
              <div>
                <span className="font-bold text-orange-300 text-xs block">
                  1 na reserva (Quase na Falha)
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  A velocidade da barra diminuiu consideravelmente. Você conseguiria fazer apenas mais
                  uma repetição sofrida.
                </p>
              </div>
            </div>

            {/* RIR 2 */}
            <div className="p-3 bg-zinc-850 border border-amber-500/30 rounded-xl flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs shrink-0">
                RIR 2
              </span>
              <div>
                <span className="font-bold text-amber-300 text-xs block">
                  2 na reserva (Série de Estímulo Ótimo)
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Carga desafiadora! Você para a série sabendo que caberiam exatamente mais 2
                  repetições. Estímulo hipertrófico elevado com recuperação preservada.
                </p>
              </div>
            </div>

            {/* Feeder Sets */}
            <div className="p-3 bg-zinc-850 border border-indigo-500/30 rounded-xl flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold text-xs shrink-0">
                Feeder
              </span>
              <div>
                <span className="font-bold text-indigo-300 text-xs block">
                  Séries Preparatórias (12, 6, 4 reps)
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Servem para lubrificar articulações, aclimatar o sistema nervoso à carga pesada e
                  encontrar o peso ideal das séries top sem acumular fadiga precoce.
                </p>
              </div>
            </div>
          </div>

          {/* Strategy Tip */}
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-300 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Estratégia de Progressão
            </span>
            <p className="text-zinc-400">
              Mantenha o controle da fase excêntrica (descida de 2 a 3 segundos). Se você atingiu as
              10 reps na série de 0 na reserva com facilidade, aumente a carga no próximo treino!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition active:scale-95"
          >
            Entendido, Bora Treinar!
          </button>
        </div>
      </div>
    </div>
  );
};
