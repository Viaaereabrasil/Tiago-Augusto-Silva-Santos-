const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

code = code.replace(`  const history = loadHistory();
  // Se não tem nenhum treino no histórico, assumimos que hoje (08/09/2026) começa no Inferiores A.
  if (history.length === 0 || !history.some(s => s.completed)) {
    return {
      templateId: 'inferiores-a',
      reason: 'Início da divisão de treino (08/09 - Inferiores A)',
      basedOnRotation: true,
    };
  }
  const history = loadHistory();`, `  const history = loadHistory();
  // Se não tem nenhum treino no histórico, assumimos que hoje (08/09/2026) começa no Inferiores A.
  if (history.length === 0 || !history.some(s => s.completed && WORKOUT_ROTATION_ORDER.includes(s.templateId))) {
    return {
      templateId: 'inferiores-a',
      reason: 'Início da divisão de treino',
      basedOnRotation: true,
    };
  }`);

fs.writeFileSync('src/utils/storage.ts', code);
