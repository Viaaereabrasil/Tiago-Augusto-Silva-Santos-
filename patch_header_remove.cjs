const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

// 1. Remove states
code = code.replace(/  const \[elapsedSeconds.*?\n/, '');
code = code.replace(/  const \[isTimerRunning.*?\n/, '');
code = code.replace(/  const \[showStopwatch.*?\n/, '');

// 2. Remove hooks
code = code.replace(/  \/\/ Initialize elapsed time[\s\S]*?  \/\/ Stopwatch ticking[\s\S]*?    return \(\) => clearInterval\(interval\);\n  \}, \[isTimerRunning\]\);\n\n  const handleToggleTimer = \(\) => \{[\s\S]*?  \};\n\n  const handleResetTimer = \(\) => \{[\s\S]*?  \};\n\n  const formatTime = \(\(secs: number\) => \{[\s\S]*?  \}\);\n\n/, '');

// 3. Remove the button and the stopwatch control UI
const blockStart = `<button
                type="button"
                onClick={() => setShowStopwatch(!showStopwatch)}`;
const blockEnd = `</button>
              </div>
            )}`;

const startIndex = code.indexOf(blockStart);
const endIndex = code.indexOf(blockEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const codeBefore = code.substring(0, startIndex);
  const codeAfter = code.substring(endIndex + blockEnd.length);
  code = codeBefore + codeAfter;
}

fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
