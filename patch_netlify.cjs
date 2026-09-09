const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            </span>
          </div>
        </div>
      </main>`;
const repl = `            </span>
          </div>
        </div>

        <div className="mt-8 mb-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">Powered by Netlify</span>
        </div>
      </main>`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
