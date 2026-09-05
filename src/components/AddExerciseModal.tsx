import React, { useState } from 'react';
import { X, Plus, Dumbbell } from 'lucide-react';
import { Exercise } from '../types';

interface AddExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
}

export const AddExerciseModal: React.FC<AddExerciseProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exercise['category']>('costas');
  const [equipment, setEquipment] = useState<Exercise['equipment']>('cabo');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `custom-ex-${Date.now()}`,
      name: name.trim(),
      category,
      equipment,
      notes: notes.trim() || undefined,
      sets: [
        { id: `s1-${Date.now()}`, targetReps: 12, type: 'warmup', completed: false },
        { id: `s2-${Date.now()}`, targetReps: 6, type: 'feeder', completed: false },
        { id: `s3-${Date.now()}`, targetReps: 10, rir: 2, type: 'working', completed: false },
        { id: `s4-${Date.now()}`, targetReps: 10, rir: 0, type: 'top_set', completed: false },
      ],
    };

    onAdd(newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Adicionar Novo Exercício</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-bold mb-1">Nome do Exercício:</label>
            <input
              type="text"
              required
              placeholder="Ex: Rosca Martelo com Halteres"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Grupo Muscular:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exercise['category'])}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="costas">Costas</option>
                <option value="peito">Peito</option>
                <option value="ombros">Ombros</option>
                <option value="triceps">Tríceps</option>
                <option value="biceps">Bíceps</option>
                <option value="pernas">Pernas</option>
                <option value="gluteos">Glúteos</option>
                <option value="panturrilha">Panturrilha</option>
                <option value="core">Core / Abdômen</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Equipamento:</label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as Exercise['equipment'])}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="cabo">Cabo / Polia</option>
                <option value="barra">Barra Livre</option>
                <option value="halter">Halteres</option>
                <option value="maquina">Máquina</option>
                <option value="corporal">Peso Corporal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Observação / Instrução de Execução (Opcional):</label>
            <input
              type="text"
              placeholder="Ex: Amplitude máxima, cotovelos junto ao corpo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-750 font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition shadow-md shadow-amber-500/20"
            >
              Adicionar ao Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
