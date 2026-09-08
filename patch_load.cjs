const fs = require('fs');
let code = fs.readFileSync('src/utils/storage.ts', 'utf8');

const target1 = `      return {
        weeklyPlan,
        customDays: parsed.customDays || {},
        alarm: { ...DEFAULT_ALARM_SETTINGS, ...(parsed.alarm || {}) },
      };`;

const repl1 = `      return {
        weeklyPlan,
        customDays: parsed.customDays || {},
        alarm: { ...DEFAULT_ALARM_SETTINGS, ...(parsed.alarm || {}) },
        scheduleMode: parsed.scheduleMode || 'continuous',
        continuousPlan: parsed.continuousPlan || ['inferiores-a', 'superior-a', 'inferiores-b', 'superior-b'],
        continuousStartDate: parsed.continuousStartDate || new Date().toISOString().slice(0, 10),
      };`;

code = code.replace(target1, repl1);

const target2 = `  return {
    weeklyPlan: DEFAULT_WEEKLY_PLAN,
    customDays: {},
    alarm: DEFAULT_ALARM_SETTINGS,
  };`;

const repl2 = `  return {
    scheduleMode: 'continuous',
    weeklyPlan: DEFAULT_WEEKLY_PLAN,
    continuousPlan: ['inferiores-a', 'superior-a', 'inferiores-b', 'superior-b'],
    continuousStartDate: new Date().toISOString().slice(0, 10),
    customDays: {},
    alarm: DEFAULT_ALARM_SETTINGS,
  };`;

code = code.replace(target2, repl2);

fs.writeFileSync('src/utils/storage.ts', code);
