const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const newFunctions = `
function addDaysToDateStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}-\${String(date.getDate()).padStart(2, '0')}\`;
}

function getDaysDifference(startStr: string, endStr: string): number {
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd, 12, 0, 0);
  const end = new Date(ey, em - 1, ed, 12, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

`;

code = code.replace('export function getScheduledWorkoutForDate', newFunctions + 'export function getScheduledWorkoutForDate');

const newLogic = `
  // Check if there is an explicit override for this date
  if (sched.customDays && sched.customDays[dateStr]) {
    const custom = sched.customDays[dateStr];
    return {
      templateId: custom.templateId,
      isRest: custom.templateId === 'rest' || !!custom.isRest,
      isCustom: true,
      notes: custom.notes,
    };
  }

  // Continuous Mode
  if (sched.scheduleMode === 'continuous' && sched.continuousPlan && sched.continuousPlan.length > 0 && sched.continuousStartDate) {
    const diff = getDaysDifference(sched.continuousStartDate, dateStr);
    
    if (diff >= 0) {
      let pointer = 0;
      for (let i = 0; i < diff; i++) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        if (override && (override.templateId === 'rest' || override.isRest)) {
          // Rest day override -> do not advance pointer
        } else {
          pointer = (pointer + 1) % sched.continuousPlan.length;
        }
      }
      const planTemplateId = sched.continuousPlan[pointer];
      return {
        templateId: planTemplateId,
        isRest: planTemplateId === 'rest',
        isCustom: false,
      };
    }
  }
`;

code = code.replace(`  // Check if there is an explicit override for this date
  if (sched.customDays && sched.customDays[dateStr]) {
    const custom = sched.customDays[dateStr];
    return {
      templateId: custom.templateId,
      isRest: custom.templateId === 'rest' || !!custom.isRest,
      isCustom: true,
      notes: custom.notes,
    };
  }`, newLogic);

fs.writeFileSync('src/utils/storage.ts', code);
