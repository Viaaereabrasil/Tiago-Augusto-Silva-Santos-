const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(`      </nav>
      </>
        )}

      {/* Modals */}`, `      </nav>

      {/* Modals */}`);

fs.writeFileSync('src/App.tsx', code);
