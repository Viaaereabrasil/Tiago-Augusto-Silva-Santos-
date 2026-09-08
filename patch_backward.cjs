const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const target = `    if (diff >= 0) {
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
    }`;

const repl = `    if (diff >= 0) {
      let pointer = 0;
      for (let i = 0; i < diff; i++) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        const histSession = historyMap.get(iterDateStr);
        
        const isRestOverride = override && (override.templateId === 'rest' || !!override.isRest);
        const isRestHistory = histSession && (histSession.templateId === 'rest' || (histSession.exercises && histSession.exercises.length === 0));

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
    } else {
      let pointer = 0;
      for (let i = -1; i >= diff; i--) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        const histSession = historyMap.get(iterDateStr);
        
        const isRestOverride = override && (override.templateId === 'rest' || !!override.isRest);
        const isRestHistory = histSession && (histSession.templateId === 'rest' || (histSession.exercises && histSession.exercises.length === 0));

        if (isRestOverride || isRestHistory) {
          // Rest day override or history -> do not move pointer backwards
        } else {
          pointer = (pointer - 1 + sched.continuousPlan.length) % sched.continuousPlan.length;
        }
      }
      const planTemplateId = sched.continuousPlan[pointer];
      return {
        templateId: planTemplateId,
        isRest: planTemplateId === 'rest',
        isCustom: false,
      };
    }`;

code = code.replace(target, repl);
fs.writeFileSync('src/utils/storage.ts', code);
