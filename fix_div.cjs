const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

const target = `{liveClockTime || '00:00:00'}
                </span>
              </div>
              
              
            {onOpenProgressionChart && (`;

const repl = `{liveClockTime || '00:00:00'}
                </span>
              </div>
            </div>
              
            {onOpenProgressionChart && (`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
