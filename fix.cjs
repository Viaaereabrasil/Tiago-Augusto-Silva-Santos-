const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutCalendarModal.tsx', 'utf8');

const target = `                    </div>
                  );
                })}
              </div>
            </div>
          )}`;

const repl = `                    </div>
                  );
                })}
              </div>
              </>
              )}
            </div>
          )}`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/WorkoutCalendarModal.tsx', code);
