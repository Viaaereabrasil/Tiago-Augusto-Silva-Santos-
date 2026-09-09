const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<HistoryView
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        initialTab={historyModalTab}
        userId={authUser?.uid}
      />`;

const repl = `<HistoryView
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        initialTab={historyModalTab}
        userId={authUser?.uid}
        onLoadSession={(sess) => {
          setCurrentSession(sess);
          setShowHistoryModal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
