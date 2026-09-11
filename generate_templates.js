const fs = require('fs');
const oldTemplatesFile = fs.readFileSync('src/data/workoutTemplates.ts', 'utf8');

// I will extract the current INITIAL_WORKOUT_TEMPLATES manually and append them.
