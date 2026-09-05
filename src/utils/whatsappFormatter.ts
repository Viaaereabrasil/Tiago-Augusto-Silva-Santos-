import { WorkoutSession } from '../types';

export function formatWorkoutForWhatsApp(session: WorkoutSession): string {
  const [year, month, day] = session.date.split('-');
  const formattedDate = day && month && year ? `${day}/${month}/${year}` : session.date;

  let message = `*${session.title.toUpperCase()} (${formattedDate})*\n\n`;

  let totalTonnage = 0;
  let totalCompletedSets = 0;

  session.exercises.forEach((exercise) => {
    message += `*${exercise.name}:*\n`;

    exercise.sets.forEach((set) => {
      const reps = set.actualReps !== undefined ? set.actualReps : set.targetReps;
      const kg = set.actualKg !== undefined ? set.actualKg : set.targetKg;
      const kgStr = kg !== undefined && kg !== null && kg > 0 ? `kg ${kg}` : 'kg __';
      
      const repStr = `${reps} rep`.padStart(6, ' ');

      let rirText = '';
      if (set.rir === 0) {
        rirText = ' sensação de 0 na reserva (falha)';
      } else if (set.rir !== undefined && set.rir !== null) {
        rirText = ` sensação de ${set.rir} na reserva`;
      }

      const checkMark = set.completed ? ' ✅' : '';
      message += `  ${repStr}      ${kgStr}${rirText}${checkMark}\n`;

      if (set.completed && kg && reps) {
        totalTonnage += kg * reps;
        totalCompletedSets += 1;
      }
    });

    message += '\n';
  });

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📊 *Resumo do Treino:*\n`;
  if (session.durationMinutes) {
    message += `⏱️ Duração: ${session.durationMinutes} min\n`;
  }
  message += `🏋️ Séries concluídas: ${totalCompletedSets} séries\n`;
  if (totalTonnage > 0) {
    message += `🔥 Volume total: ${totalTonnage.toLocaleString('pt-BR')} kg\n`;
  }
  if (session.notes && session.notes.trim()) {
    message += `📝 Observações: ${session.notes.trim()}\n`;
  }
  message += `📱 Registrado via Diário de Treino`;

  return message;
}
