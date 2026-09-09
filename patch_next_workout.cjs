const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const targetNextWorkout = `export function getNextRecommendedWorkout(): {
  templateId: string;
  reason: string;
  basedOnRotation: boolean;
} {
  const now = new Date();
  const todayStr = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
  const scheduledToday = getScheduledWorkoutForDate(todayStr);

  if (!scheduledToday.isRest && scheduledToday.templateId) {
    return {
      templateId: scheduledToday.templateId,
      reason: 'Programado para hoje no seu calendário',
      basedOnRotation: false,
    };
  }

  // Check last completed workout in rotation
  const last = getLastCompletedWorkout();
  if (last) {
    const idx = WORKOUT_ROTATION_ORDER.indexOf(last.session.templateId);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % WORKOUT_ROTATION_ORDER.length;
      return {
        templateId: WORKOUT_ROTATION_ORDER[nextIdx],
        reason: \`Sequência natural da divisão após \${last.session.title}\`,
        basedOnRotation: true,
      };
    }
  }

  // Default to inferiores-a
  return {
    templateId: 'inferiores-a',
    reason: 'Início da divisão de treino (Foco Inferiores)',
    basedOnRotation: true,
  };
}`;

const replNextWorkout = `export function getNextRecommendedWorkout(): {
  templateId: string;
  reason: string;
  basedOnRotation: boolean;
} {
  const history = loadHistory();
  // Find the last completed workout that is part of the rotation
  // history is already sorted by date desc when saved, but let's be sure it's the most recent one
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.endTime || a.date).getTime();
    const dateB = new Date(b.endTime || b.date).getTime();
    return dateB - dateA;
  });
  
  const lastRotationWorkout = sortedHistory.find(s => 
    s.completed && WORKOUT_ROTATION_ORDER.includes(s.templateId)
  );

  if (lastRotationWorkout) {
    const idx = WORKOUT_ROTATION_ORDER.indexOf(lastRotationWorkout.templateId);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % WORKOUT_ROTATION_ORDER.length;
      return {
        templateId: WORKOUT_ROTATION_ORDER[nextIdx],
        reason: \`Sequência natural da divisão após \${lastRotationWorkout.title}\`,
        basedOnRotation: true,
      };
    }
  }

  return {
    templateId: WORKOUT_ROTATION_ORDER[0],
    reason: 'Início da divisão de treino',
    basedOnRotation: true,
  };
}`;

if (code.includes('export function getNextRecommendedWorkout')) {
  code = code.replace(targetNextWorkout, replNextWorkout);
}

fs.writeFileSync('src/utils/storage.ts', code);
