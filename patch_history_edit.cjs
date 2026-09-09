const fs = require('fs');
let code = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

const target = `                            </div>
                          ))}
                        </div>
                      )}
                    </div>`;

const repl = `                            </div>
                          ))}
                          
                          {onLoadSession && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLoadSession(sess);
                              }}
                              className="w-full mt-2 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                            >
                              <Activity className="w-4 h-4" />
                              Editar Este Treino
                            </button>
                          )}
                        </div>
                      )}
                    </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/HistoryView.tsx', code);
