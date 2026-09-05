import React, { useState, useEffect } from 'react';
import { X, Scale, Plus, Minus } from 'lucide-react';

interface PlateCalcProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  initialTotalKg: number;
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

export const PlateCalculatorModal: React.FC<PlateCalcProps> = ({
  isOpen,
  onClose,
  exerciseName,
  initialTotalKg = 50,
}) => {
  const [totalKg, setTotalKg] = useState<number>(initialTotalKg);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg Olympic bar standard

  useEffect(() => {
    if (isOpen) {
      setTotalKg(initialTotalKg > 0 ? initialTotalKg : 20);
    }
  }, [isOpen, initialTotalKg]);

  if (!isOpen) return null;

  // Calculate plates per side
  const weightPerSide = Math.max(0, (totalKg - barWeight) / 2);
  let remaining = weightPerSide;
  const plateCounts: { plate: number; count: number }[] = [];

  for (const plate of AVAILABLE_PLATES) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate);
      plateCounts.push({ plate, count });
      remaining = Math.round((remaining - count * plate) * 100) / 100;
    }
  }

  const getPlateColor = (plate: number) => {
    switch (plate) {
      case 25:
        return 'bg-red-600 text-white border-red-500';
      case 20:
        return 'bg-blue-600 text-white border-blue-500';
      case 15:
        return 'bg-yellow-500 text-zinc-950 border-yellow-400';
      case 10:
        return 'bg-emerald-600 text-white border-emerald-500';
      case 5:
        return 'bg-zinc-100 text-zinc-950 border-zinc-300';
      case 2.5:
        return 'bg-zinc-800 text-zinc-200 border-zinc-600';
      case 1.25:
        return 'bg-zinc-700 text-zinc-300 border-zinc-500';
      default:
        return 'bg-zinc-800 text-white border-zinc-600';
    }
  };

  const getPlateHeight = (plate: number) => {
    if (plate >= 20) return 'h-24';
    if (plate >= 15) return 'h-20';
    if (plate >= 10) return 'h-16';
    if (plate >= 5) return 'h-12';
    return 'h-10';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Calculadora de Anilhas</h3>
              <p className="text-xs text-zinc-400">{exerciseName}</p>
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
        <div className="p-5 space-y-5">
          {/* Target Weight Selector */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Peso Total Desejado (Barra + Anilhas)
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTotalKg((k) => Math.max(barWeight, k - 5))}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white flex items-center justify-center transition active:scale-90"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  step="2.5"
                  value={totalKg}
                  onChange={(e) => setTotalKg(parseFloat(e.target.value) || 0)}
                  className="w-24 text-center text-3xl font-black font-mono bg-zinc-950 border border-zinc-700 rounded-xl py-1 text-amber-400 focus:outline-none focus:border-amber-500"
                />
                <span className="text-sm font-bold text-zinc-400">kg</span>
              </div>

              <button
                onClick={() => setTotalKg((k) => k + 5)}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white flex items-center justify-center transition active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Barbell Weight Toggle */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-zinc-400">Peso da barra:</span>
              {[20, 15, 10, 0].map((b) => (
                <button
                  key={b}
                  onClick={() => setBarWeight(b)}
                  className={`px-2 py-0.5 rounded-md font-bold transition ${
                    barWeight === b
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {b === 0 ? 'Sem barra' : `${b}kg`}
                </button>
              ))}
            </div>
          </div>

          {/* Barbell Visualization */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-400 mb-3">
              Carga por cada lado da barra: <span className="text-amber-400 font-mono text-sm">{weightPerSide} kg</span>
            </span>

            {/* Visual Barbell with Plates */}
            <div className="w-full flex items-center justify-center py-4 overflow-x-auto min-h-[120px]">
              {/* Left Bar Tip */}
              <div className="h-4 w-6 bg-zinc-600 rounded-l border border-zinc-500" />
              
              {/* Plates on Left side (mirrored) */}
              <div className="flex items-center gap-1">
                {plateCounts.flatMap(({ plate, count }) =>
                  Array.from({ length: count }).map((_, idx) => (
                    <div
                      key={`l-${plate}-${idx}`}
                      className={`w-3.5 ${getPlateHeight(plate)} ${getPlateColor(
                        plate
                      )} rounded-sm border flex items-center justify-center text-[9px] font-black shadow-md`}
                      title={`${plate} kg`}
                    />
                  ))
                )}
              </div>

              {/* Bar Center */}
              <div className="h-4 w-28 sm:w-36 bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-500 border border-zinc-400 relative flex items-center justify-center">
                <span className="text-[9px] font-extrabold text-zinc-900 uppercase">
                  {barWeight}kg BAR
                </span>
              </div>

              {/* Plates on Right side */}
              <div className="flex items-center gap-1 flex-row-reverse">
                {plateCounts.flatMap(({ plate, count }) =>
                  Array.from({ length: count }).map((_, idx) => (
                    <div
                      key={`r-${plate}-${idx}`}
                      className={`w-3.5 ${getPlateHeight(plate)} ${getPlateColor(
                        plate
                      )} rounded-sm border flex items-center justify-center text-[9px] font-black shadow-md`}
                      title={`${plate} kg`}
                    />
                  ))
                )}
              </div>

              {/* Right Bar Tip */}
              <div className="h-4 w-6 bg-zinc-600 rounded-r border border-zinc-500" />
            </div>

            {/* Plate Breakdown List */}
            <div className="w-full mt-3 pt-3 border-t border-zinc-800/80">
              <span className="text-[11px] font-bold text-zinc-400 block mb-2">
                Anilhas a colocar EM CADA LADO:
              </span>
              {plateCounts.length === 0 ? (
                <p className="text-xs text-zinc-400 italic text-center py-1">
                  Apenas o peso da barra ({barWeight} kg)
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {plateCounts.map(({ plate, count }) => (
                    <div
                      key={plate}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full border ${getPlateColor(
                            plate
                          )}`}
                        />
                        <span className="font-bold text-zinc-200">{plate} kg</span>
                      </div>
                      <span className="font-black text-amber-400 font-mono">
                        {count}x {count > 1 ? 'anilhas' : 'anilha'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
