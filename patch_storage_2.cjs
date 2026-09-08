const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const target = `  // Continuous Mode
  if (sched.scheduleMode === 'continuous' && sched.continuousPlan && sched.continuousPlan.length > 0 && sched.continuousStartDate) {
    const diff = getDaysDifference(sched.continuousStartDate, dateStr);
    
    if (diff >= 0) {
      let pointer = 0;
      for (let i = 0; i < diff; i++) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        if (override && (override.templateId === 'rest' || !!override.isRest)) {
          // Rest day override -> do not advance pointer (this pushes the schedule forward!)
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
  }`;

const replacement = `  // Continuous Mode
  if (sched.scheduleMode === 'continuous' && sched.continuousPlan && sched.continuousPlan.length > 0 && sched.continuousStartDate) {
    const diff = getDaysDifference(sched.continuousStartDate, dateStr);
    const history = loadHistory();
    const historyMap = new Map();
    for (const h of history) {
      historyMap.set(h.date, h);
    }
    
    if (diff >= 0) {
      let pointer = 0;
      for (let i = 0; i < diff; i++) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        const histSession = historyMap.get(iterDateStr);
        
        const isRestOverride = override && (override.templateId === 'rest' || !!override.isRest);
        const isRestHistory = histSession && (histSession.templateId === 'rest' || histSession.exercises.length === 0);

        if (isRestOverride || isRestHistory) {
          // Rest day override or history -> do not advance pointer (this pushes the schedule forward!)
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
  }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/utils/storage.ts', code);
