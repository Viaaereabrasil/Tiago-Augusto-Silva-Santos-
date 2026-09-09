import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Clock, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Dumbbell, 
  Target,
  Layers,
  HelpCircle,
  ArrowRight,
  Play,
  Video,
  ExternalLink
} from 'lucide-react';
import { 
  EXERCISE_GUIDES, 
  ExerciseGuide, 
  getExerciseGuideByName,
  getExerciseVideoEmbedUrl,
  getExerciseYouTubeSearchUrl
} from '../data/exerciseGuides';
import { ExerciseVisualIllustration } from './ExerciseVisualIllustration';

interface ExerciseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName?: string;
  initialTab?: 'execucao' | 'video' | 'setup' | 'dicas' | 'erros';
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  isOpen,
  onClose,
  initialExerciseName,
  initialTab = 'execucao',
}) => {
  const allGuides = Object.values(EXERCISE_GUIDES);
  
  // Find initial guide or default to first
  const [selectedGuideId, setSelectedGuideId] = useState<string>(() => {
    if (initialExerciseName) {
      const match = getExerciseGuideByName(initialExerciseName);
      if (match) return match.id;
    }
    return allGuides[0]?.id || 'supino-barra';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'execucao' | 'video' | 'setup' | 'dicas' | 'erros'>(initialTab);

  // Update selected if initialExerciseName changes when modal opens
  React.useEffect(() => {
    if (initialExerciseName) {
      const match = getExerciseGuideByName(initialExerciseName);
      if (match) {
        setSelectedGuideId(match.id);
      }
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialExerciseName, initialTab, isOpen]);

  if (!isOpen) return null;

  const currentGuide = EXERCISE_GUIDES[selectedGuideId] || allGuides[0];
  const videoEmbedUrl = getExerciseVideoEmbedUrl(currentGuide);
  const youtubeSearchUrl = getExerciseYouTubeSearchUrl(currentGuide);

  const filteredGuides = allGuides.filter((guide) => {
    const matchesSearch = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'todos') return matchesSearch;
    return matchesSearch && guide.category === selectedCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'peito':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'costas':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ombros':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'pernas':
      case 'gluteos':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'panturrilha':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'triceps':
      case 'biceps':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 pb-28 sm:pt-4 sm:px-4 sm:pb-28 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="exercise-guide-modal"
        className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-850 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Guia Biomecânico & Exemplos de Exercícios
              </h2>
              <p className="text-xs text-zinc-400">
                Instruções de execução, postura, músculos alvo e dicas de ouro
              </p>
            </div>
          </div>

          <button
            id="btn-close-guide-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Layout (Sidebar on Desktop, Main Content) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Exercise List / Selector */}
          <div className="w-full md:w-72 lg:w-80 bg-zinc-900/90 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
            {/* Search & Category Filter */}
            <div className="p-3 border-b border-zinc-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar exercício ou músculo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
                {['todos', 'peito', 'costas', 'ombros', 'pernas', 'gluteos', 'braços'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'braços' ? 'triceps' : cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap font-medium transition ${
                      selectedCategory === (cat === 'braços' ? 'triceps' : cat)
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50 p-2 space-y-1 max-h-48 md:max-h-none">
              {filteredGuides.map((guide) => {
                const isSelected = guide.id === currentGuide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setSelectedGuideId(guide.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-white font-bold'
                        : 'hover:bg-zinc-800/60 text-zinc-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-amber-400' : 'bg-zinc-600'}`} />
                      <span className="truncate">{guide.name}</span>
                    </div>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border shrink-0 ${getCategoryBadgeClass(guide.category)}`}>
                      {guide.category}
                    </span>
                  </button>
                );
              })}

              {filteredGuides.length === 0 && (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Nenhum exercício encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Right Main Content: Detailed Guide View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-zinc-900/40">
            {/* Guide Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-850 p-4 rounded-2xl border border-zinc-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(currentGuide.category)}`}>
                    {currentGuide.category}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700 uppercase">
                    {currentGuide.equipment}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {currentGuide.name}
                </h1>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {currentGuide.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="btn-switch-video-tab"
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                    activeTab === 'video'
                      ? 'bg-rose-600 text-white shadow-rose-600/30'
                      : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Vídeo Explicativo</span>
                </button>
              </div>
            </div>

            {/* Visual Illustration & Vector Scheme */}
            <ExerciseVisualIllustration
              visualType={currentGuide.visualType}
              category={currentGuide.category}
              equipment={currentGuide.equipment}
              name={currentGuide.name}
            />

            {/* Quick Metrics Bar: Cadence, Breathing & Muscles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-850/80 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Músculo Primário</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5">
                    {currentGuide.primaryMuscles.join(', ')}
                  </div>
                  {currentGuide.secondaryMuscles.length > 0 && (
                    <div className="text-[11px] text-zinc-400 mt-1">
                      <span className="font-semibold text-zinc-400">Auxiliares:</span> {currentGuide.secondaryMuscles.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-zinc-850/80 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Cadência Ideal</div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5 font-mono">
                    {currentGuide.cadence}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Controle na descida (excêntrica) e explosão na subida.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-850/80 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                <Wind className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Respiração</div>
                  <div className="text-xs text-cyan-200 mt-0.5 leading-tight">
                    {currentGuide.breathing}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Deep Instructions */}
            <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('execucao')}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  activeTab === 'execucao'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Passo a Passo</span>
              </button>

              <button
                id="tab-video"
                onClick={() => setActiveTab('video')}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  activeTab === 'video'
                    ? 'border-rose-400 text-rose-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Vídeo Demonstrativo</span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  activeTab === 'setup'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Setup & Postura</span>
              </button>

              <button
                onClick={() => setActiveTab('dicas')}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  activeTab === 'dicas'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Dicas de Ouro</span>
              </button>

              <button
                onClick={() => setActiveTab('erros')}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  activeTab === 'erros'
                    ? 'border-rose-400 text-rose-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Erros Comuns</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-zinc-850/60 border border-zinc-800 p-4 sm:p-5 rounded-2xl">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-400" />
                        Vídeo Demonstrativo & Biomecânica
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Assista à técnica de movimento, alinhamento articular e cadência
                      </p>
                    </div>

                    <a
                      href={youtubeSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition self-start sm:self-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir no YouTube</span>
                    </a>
                  </div>

                  {/* Responsive Video Container */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-xl">
                    <iframe
                      src={videoEmbedUrl}
                      title={`Vídeo explicativo de ${currentGuide.name}`}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Focus Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5" />
                        O Que Observar no Vídeo:
                      </div>
                      <ul className="text-xs text-zinc-300 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span><strong>Trajetória do movimento:</strong> Alinhamento com a linha de tração.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span><strong>Estabilidade escapular/tronco:</strong> Sem impulsos ou gangorras.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span><strong>Alongamento máximo:</strong> Controle excêntrico sem relaxar a tensão muscular.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Padrão Motor Recomendado:
                      </div>
                      <ul className="text-xs text-zinc-300 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Pico de contração de 1 segundo no encurtamento.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Respiração sincronizada (soltar o ar ao fazer força).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Preservação de 2 a 0 repetições na reserva (RIR).</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'execucao' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Como Executar com Técnica Perfeita:
                  </h3>
                  <ol className="space-y-2.5">
                    {currentGuide.execution.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-200 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'setup' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Ajuste da Máquina e Posicionamento Inicial:
                  </h3>
                  <ul className="space-y-2.5">
                    {currentGuide.setup.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'dicas' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Dicas de Conexão Mente-Músculo:
                  </h3>
                  <ul className="space-y-2.5">
                    {currentGuide.proTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'erros' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Erros Que Reduzem Seus Resultados ou Causam Lesão:
                  </h3>
                  <ul className="space-y-2.5">
                    {currentGuide.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-200 leading-relaxed bg-rose-950/20 p-3 rounded-xl border border-rose-500/20">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Series Hierarchy Explanation Box */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Como Estruturar as Séries deste Exercício na Ficha:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-zinc-300">
                <div className="p-2 bg-sky-950/30 border border-sky-500/30 rounded-lg">
                  <div className="font-bold text-sky-400">1. Aquecimento</div>
                  <div className="text-zinc-400 text-[10px] mt-0.5">30-40% da carga. Acorda a articulação e lubrifica com sinóvia.</div>
                </div>
                <div className="p-2 bg-indigo-950/30 border border-indigo-500/30 rounded-lg">
                  <div className="font-bold text-indigo-400">2. Feeder Set</div>
                  <div className="text-zinc-400 text-[10px] mt-0.5">60-80% da carga por 3-6 reps. Prepara o SNC sem gerar fadiga.</div>
                </div>
                <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded-lg">
                  <div className="font-bold text-amber-400">3. Working (RIR 2)</div>
                  <div className="text-zinc-400 text-[10px] mt-0.5">Carga alvo deixando exatamente 2 repetições antes de falhar.</div>
                </div>
                <div className="p-2 bg-rose-950/30 border border-rose-500/30 rounded-lg">
                  <div className="font-bold text-rose-400">4. Top Set (RIR 0)</div>
                  <div className="text-zinc-400 text-[10px] mt-0.5">Carga máxima até a falha concêntrica limpa com técnica segura.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-zinc-850 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Dica: Toque em qualquer exercício na lista à esquerda para ver a biomecânica completa.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition active:scale-95"
          >
            Entendi, Voltar ao Treino
          </button>
        </div>
      </div>
    </div>
  );
};
