const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  FileText,
  HelpCircle
} from 'lucide-react';`;

const repl = `  FileText,
  HelpCircle,
  Coffee
} from 'lucide-react';`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
