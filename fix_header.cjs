const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');
code = code.replace(
  \`              </div>
              
              
            {onOpenProgressionChart && (\`,
  \`              </div>
            </div>
            
            {onOpenProgressionChart && (\`
);
fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
