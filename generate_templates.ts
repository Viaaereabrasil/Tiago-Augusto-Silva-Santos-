import fs from 'fs';
import { INITIAL_WORKOUT_TEMPLATES } from './src/data/workoutTemplates';
import { WorkoutTemplate } from './src/types';

// Process existing templates as Plan B
const planB: WorkoutTemplate[] = INITIAL_WORKOUT_TEMPLATES.map(tpl => {
  if (tpl.id === 'rest') return tpl;
  return {
    ...tpl,
    id: tpl.id + '-b',
    title: tpl.title + ' (Plano B)',
    plan: 'B'
  };
});

// Build Plan A
function makeSets(repsList: number[], rirList: (number|null)[]) {
  return repsList.map((reps, i) => {
    let type: 'warmup' | 'feeder' | 'working' | 'top_set' = 'feeder';
    if (i === repsList.length - 1) type = 'top_set';
    else if (i === repsList.length - 2) type = 'working';
    else if (i === 0 && repsList.length > 3) type = 'warmup'; // rough heuristics
    
    return {
      id: `s${i + 1}`,
      targetReps: reps,
      targetKg: 0,
      actualReps: reps,
      actualKg: 0,
      type,
      completed: false,
      rir: rirList[i] !== null ? rirList[i] : undefined
    };
  });
}

function makeEx(id: string, name: string, category: any, equipment: any, repsList: number[], rirList: (number|null)[]) {
  return {
    id,
    name,
    category,
    equipment,
    sets: makeSets(repsList, rirList)
  };
}

const planA: WorkoutTemplate[] = [
  {
    id: 'superior-a',
    plan: 'A',
    title: 'TREINO SUPERIOR A',
    subtitle: 'Costas, Peito, Ombros, Tríceps',
    tag: 'Superior',
    exercises: [
      makeEx('sup-a-1', 'Pulley fechado pegada anat/triângulo', 'costas', 'cabo', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('sup-a-2', 'Crucifixo cabo declinando', 'peito', 'cabo', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('sup-a-3', 'Puxada alta unilateral cabo', 'costas', 'cabo', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-a-4', 'Supino barra', 'peito', 'barra', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-a-5', 'Remada máquina', 'costas', 'maquina', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-a-6', 'Elevação lateral com halteres', 'ombros', 'halter', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-a-7', 'Desenvolvimento Máquina', 'ombros', 'maquina', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-a-8', 'Triceps polia alta', 'triceps', 'cabo', [6, 4, 10, 10], [null, null, null, null])
    ]
  },
  {
    id: 'inferiores-a',
    plan: 'A',
    title: 'TREINO INFERIORES A (Post/Glut)',
    subtitle: 'Posterior, Glúteos & Panturrilha',
    tag: 'Inferior',
    exercises: [
      makeEx('inf-a-1', 'Elevação pélvica', 'gluteos', 'barra', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-a-2', 'Cadeira flexora', 'pernas', 'maquina', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-a-3', 'Mesa Flexora', 'pernas', 'maquina', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('inf-a-4', 'Cadeira abdutora', 'pernas', 'maquina', [12, 6, 2, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-a-5', 'Agachamento Búlgaro', 'pernas', 'halter', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('inf-a-6', 'Stiff', 'pernas', 'barra', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('inf-a-7', 'Panturilha no Agachamento Hack', 'panturrilha', 'maquina', [6, 4, 10, 10], [null, null, 2, 0])
    ]
  },
  {
    id: 'superior-b',
    plan: 'A',
    title: 'TREINO SUPERIORES B',
    subtitle: 'Peito, Costas, Ombros, Tríceps',
    tag: 'Superior',
    exercises: [
      makeEx('sup-b-1', 'Crucifixo cabo inclinado', 'peito', 'cabo', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('sup-b-2', 'Pulley aberto pegada anatômica', 'costas', 'cabo', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('sup-b-3', 'Supino barra', 'peito', 'barra', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-b-4', 'Remada unilateral cabo baixo', 'costas', 'cabo', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-b-5', 'Crucifixo cabo declinando', 'peito', 'cabo', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-b-6', 'Elevação lateral com halteres', 'ombros', 'halter', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('sup-b-7', 'Posterior de ombro Máquina', 'ombros', 'maquina', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('sup-b-8', 'Triceps polia baixa', 'triceps', 'cabo', [6, 4, 10, 10], [null, null, 2, 0])
    ]
  },
  {
    id: 'inferiores-b',
    plan: 'A',
    title: 'TREINO INFERIORES B (Quadriceps)',
    subtitle: 'Quadríceps, Adutores & Panturrilha',
    tag: 'Inferior',
    exercises: [
      makeEx('inf-b-1', 'Extensora', 'pernas', 'maquina', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-b-2', 'Cadeira adutora', 'pernas', 'maquina', [10, 6, 4, 10, 7], [null, null, null, 2, 0]),
      makeEx('inf-b-3', 'Agachamento livre/smith', 'pernas', 'barra', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-b-4', 'Leg press', 'pernas', 'maquina', [6, 4, 10, 10], [null, null, 2, 0]),
      makeEx('inf-b-5', 'Cadeira flexora', 'pernas', 'maquina', [12, 6, 4, 10, 10], [null, null, null, 2, 0]),
      makeEx('inf-b-6', 'Panturilha Hack', 'panturrilha', 'maquina', [12, 6, 4, 10, 10], [null, null, null, 2, 0])
    ]
  }
];

// Fix IDs of nested sets to be unique per template
function fixIds(templates: WorkoutTemplate[]) {
  templates.forEach(t => {
    t.exercises.forEach((ex, exIdx) => {
      ex.id = `${t.id}-ex${exIdx + 1}`;
      ex.sets.forEach((s, sIdx) => {
        s.id = `${ex.id}-s${sIdx + 1}`;
      });
    });
  });
}

fixIds(planA);
fixIds(planB);

const allTemplates = [...planA, ...planB.filter(t => t.id !== 'rest'), planB.find(t => t.id === 'rest')];

const outCode = `import { WorkoutTemplate } from '../types';

export const INITIAL_WORKOUT_TEMPLATES: WorkoutTemplate[] = ${JSON.stringify(allTemplates, null, 2)};
`;

fs.writeFileSync('src/data/workoutTemplates.ts', outCode);
console.log('Templates updated successfully!');
