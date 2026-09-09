const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

const regex = /  \/\/ Initialize elapsed time from session start time[\s\S]*?  const formatTime = \(secs: number\) => \{[\s\S]*?  \};\n/g;

code = code.replace(regex, '');
fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
