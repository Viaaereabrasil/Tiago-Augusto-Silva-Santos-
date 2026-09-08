const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

code = code.replace(
  'const nextInput = document.getElementById(`input-kg-${nextSet.id}`);',
  'const nextInput = document.getElementById(`input-kg-${nextSet.id}`) as HTMLInputElement;'
);

fs.writeFileSync('src/components/ExerciseCard.tsx', code);
