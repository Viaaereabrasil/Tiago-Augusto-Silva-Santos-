const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const getNextFuncTarget = `export function getNextRecommendedWorkout(): {
  templateId: string;
  reason: string;
  basedOnRotation: boolean;
} {`;

const getNextFuncRepl = `export function getNextRecommendedWorkout(): {
  templateId: string;
  reason: string;
  basedOnRotation: boolean;
} {
  const history = loadHistory();
  // Se não tem nenhum treino no histórico, assumimos que hoje (08/09/2026) começa no Inferiores A.
  if (history.length === 0 || !history.some(s => s.completed)) {
    return {
      templateId: 'inferiores-a',
      reason: 'Início da divisão de treino (08/09 - Inferiores A)',
      basedOnRotation: true,
    };
  }`;

code = code.replace(getNextFuncTarget, getNextFuncRepl);

fs.writeFileSync('src/utils/storage.ts', code);
