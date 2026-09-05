import React, { useState } from 'react';
import { X, Dumbbell, Zap, Calculator } from 'lucide-react';

interface OneRepMaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneRepMaxModal: React.FC<OneRepMaxModalProps> = ({ isOpen, onClose }) => {
  const [weightStr, setWeightStr] = useState<string>('50');
  const [repsStr, setRepsStr] = useState<string>('10');

  if (!isOpen) return null;

  const weight = Math.max(1, parseFloat(weightStr) || 1);
  const reps = Math.min(30, Math.max(1, parseInt(repsStr, 10) || 1));

  // Epley formula: 1RM = weight * (1 + reps / 30)
  // Brzycki formula: 1RM = weight * (36 / (37 - reps))
  const epley1RM = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));
  const brzycki1RM = reps >= 37 ? epley1RM : Math.round(weight * (36 / (37 - reps)));
  const avg1RM = Math.round((epley1RM + brzycki1RM) / 2);

  const percentages = [
    { pct: 95, reps: '1-2', label: 'Força Máxima' },
    { pct: 90, reps: '3-4', label: 'Força Pura' },
    { pct: 85, reps: '5-6', label: 'Força / Hipertrofia' },
    { pct: 80, reps: '7-8', label: 'Hipertrofia Densa' },
    { pct: 75, reps: '9-10', label: 'Hipertrofia Clássica' },
    { pct: 70, reps: '11-12', label: 'Volume Metabólico' },
    { pct: 60, reps: '15-20', label: 'Resistência / Pump' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-6">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Calculadora 1RM (Carga Máxima)</h3>
              <p className="text-xs text-zinc-400">Estimativa baseada em peso e repetições</p>
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
        <div className="p-5 space-y-4 text-xs">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-bold mb-1">Carga Levantada (kg)</label>
              <input
                type="number"
                min="1"
                value={weightStr}
                onChange={(e) => setWeightStr(e.target.value)}
                onBlur={() => {
                  if (!weightStr || parseFloat(weightStr) <= 0) setWeightStr('50');
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-center text-lg font-black font-mono text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">Repetições Feitas</label>
              <input
                type="number"
                min="1"
                max="30"
                value={repsStr}
                onChange={(e) => setRepsStr(e.target.value)}
                onBlur={() => {
                  if (!repsStr || parseInt(repsStr, 10) <= 0) setRepsStr('10');
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-center text-lg font-black font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 1RM Result Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                1RM Estimado (1 Rep Máxima)
              </span>
              <span className="text-3xl font-black text-white font-mono">{avg1RM} kg</span>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              <div>Epley: {epley1RM} kg</div>
              <div>Brzycki: {brzycki1RM} kg</div>
            </div>
          </div>

          {/* Percentages Table */}
          <div>
            <span className="font-bold text-zinc-300 block mb-2">Tabela de Intensidade / Zonas:</span>
            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
              {percentages.map((p) => {
                const targetKg = Math.round((avg1RM * p.pct) / 100);
                return (
                  <div key={p.pct} className="px-3 py-2 flex items-center justify-between text-xs hover:bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 w-10">{p.pct}%</span>
                      <span className="text-zinc-300">{p.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">({p.reps} reps)</span>
                      <span className="font-mono font-black text-white">{targetKg} kg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
