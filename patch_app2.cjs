const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  Smartphone,
  RefreshCw
} from 'lucide-react';`;

const repl = `  Smartphone,
  RefreshCw,
  Coffee
} from 'lucide-react';`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
