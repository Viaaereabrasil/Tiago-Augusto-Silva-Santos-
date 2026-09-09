const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<nav className="fixed bottom-0 inset-x-0 bg-black border-t border-zinc-900 px-4 py-2 sm:py-3 z-30 safe-bottom">',
  '<nav className="fixed bottom-0 inset-x-0 bg-black border-t border-zinc-900 px-4 py-2 sm:py-3 z-[100] safe-bottom">'
);

fs.writeFileSync('src/App.tsx', code);
