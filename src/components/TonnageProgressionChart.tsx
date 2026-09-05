import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Dumbbell,
  Award,
  Zap,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { parseSessionTimestamp } from '../utils/storage';

interface TonnageProgressionChartProps {
  sessions: WorkoutSession[];
  onSelectExercise?: (exerciseName: string) => void;
}

interface SessionDataPoint {
  id: string;
  date: string;
  displayDate: string;
  fullDate: string;
  title: string;
  templateId: string;
  tonnage: number;
  totalSets: number;
  totalReps: number;
  avgWeightPerRep: number;
  maxWeightLifted: number;
  durationMinutes?: number;
}

interface ExerciseDataPoint {
  date: string;
  displayDate: string;
  sessionTitle: string;
  maxKg: number;
  totalVolumeKg: number;
  bestReps: number;
  totalSets: number;
}

export const TonnageProgressionChart: React.FC<TonnageProgressionChartProps> = ({
  sessions,
}) => {
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tonnage' | 'exercise_progression' | 'division_compare'>('tonnage');
  const [timeRange, setTimeRange] = useState<'all' | '10' | '5'>('all');
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // 1. Process session data sorted chronologically (oldest to newest for charts)
  const processedSessions: SessionDataPoint[] = useMemo(() => {
    // Sort chronological
    const sorted = [...sessions].sort((a, b) => {
      const timeA = parseSessionTimestamp(a.date, a.startTime);
      const timeB = parseSessionTimestamp(b.date, b.startTime);
      return timeA - timeB;
    });

    return sorted.map((sess) => {
      let tonnage = 0;
      let totalSets = 0;
      let totalReps = 0;
      let maxWeight = 0;

      for (const ex of sess.exercises) {
        for (const st of ex.sets) {
          if (st.completed) {
            totalSets++;
            const reps = (st.actualReps !== undefined && !isNaN(st.actualReps)) ? st.actualReps : (st.targetReps || 0);
            const kg = (st.actualKg !== undefined && !isNaN(st.actualKg)) ? st.actualKg : (st.targetKg || 0);
            tonnage += reps * kg;
            totalReps += reps;
            if (kg > maxWeight) {
              maxWeight = kg;
            }
          }
        }
      }

      const [y, m, d] = sess.date.split('-');
      const displayDate = d && m ? `${d}/${m}` : sess.date;
      const fullDate = d && m && y ? `${d}/${m}/${y}` : sess.date;

      return {
        id: sess.id,
        date: sess.date,
        displayDate,
        fullDate,
        title: sess.title,
        templateId: sess.templateId,
        tonnage: Math.round(tonnage),
        totalSets,
        totalReps,
        avgWeightPerRep: totalReps > 0 ? Math.round((tonnage / totalReps) * 10) / 10 : 0,
        maxWeightLifted: maxWeight,
        durationMinutes: sess.durationMinutes,
      };
    });
  }, [sessions]);

  // Extract all distinct exercises across all sessions
  const allExercisesList = useMemo(() => {
    const set = new Set<string>();
    for (const sess of sessions) {
      for (const ex of sess.exercises) {
        if (ex.name) set.add(ex.name);
      }
    }
    return Array.from(set).sort();
  }, [sessions]);

  // Set default selected exercise if none selected
  React.useEffect(() => {
    if (!selectedExercise && allExercisesList.length > 0) {
      // Pick a popular compound like Supino, Puxada or Leg Press if available
      const preferred = allExercisesList.find((e) =>
        e.toLowerCase().includes('puxada') ||
        e.toLowerCase().includes('supino') ||
        e.toLowerCase().includes('leg press') ||
        e.toLowerCase().includes('agachamento')
      ) || allExercisesList[0];
      setSelectedExercise(preferred);
    }
  }, [allExercisesList, selectedExercise]);

  // Filtered session list for charts
  const filteredData = useMemo(() => {
    let list = processedSessions;
    if (selectedTemplateFilter !== 'all') {
      list = list.filter((s) => s.templateId === selectedTemplateFilter);
    }
    if (timeRange === '5') {
      list = list.slice(-5);
    } else if (timeRange === '10') {
      list = list.slice(-10);
    }
    return list;
  }, [processedSessions, selectedTemplateFilter, timeRange]);

  // Exercise progression data over time
  const exerciseHistoryData: ExerciseDataPoint[] = useMemo(() => {
    if (!selectedExercise) return [];

    const points: ExerciseDataPoint[] = [];

    // Chronological order
    const sorted = [...sessions].sort((a, b) => {
      const timeA = parseSessionTimestamp(a.date, a.startTime);
      const timeB = parseSessionTimestamp(b.date, b.startTime);
      return timeA - timeB;
    });

    for (const sess of sorted) {
      const match = sess.exercises.find((e) => e.name.toLowerCase() === selectedExercise.toLowerCase());
      if (match) {
        let maxKg = 0;
        let totalVol = 0;
        let bestReps = 0;
        let completedCount = 0;

        for (const st of match.sets) {
          if (st.completed) {
            completedCount++;
            const kg = (st.actualKg !== undefined && !isNaN(st.actualKg)) ? st.actualKg : (st.targetKg || 0);
            const reps = (st.actualReps !== undefined && !isNaN(st.actualReps)) ? st.actualReps : (st.targetReps || 0);
            totalVol += kg * reps;
            if (kg > maxKg) {
              maxKg = kg;
              bestReps = reps;
            }
          }
        }

        if (completedCount > 0) {
          const [y, m, d] = sess.date.split('-');
          points.push({
            date: sess.date,
            displayDate: d && m ? `${d}/${m}` : sess.date,
            sessionTitle: sess.title,
            maxKg,
            totalVolumeKg: Math.round(totalVol),
            bestReps,
            totalSets: completedCount,
          });
        }
      }
    }

    return points;
  }, [sessions, selectedExercise]);

  // Division summary comparison (Average tonnage per workout type)
  const divisionComparisonData = useMemo(() => {
    const map: Record<string, { totalTonnage: number; count: number; name: string; color: string }> = {
      'superior-a': { totalTonnage: 0, count: 0, name: 'Superior A', color: '#f59e0b' },
      'inferiores-a': { totalTonnage: 0, count: 0, name: 'Inferiores A', color: '#10b981' },
      'superior-b': { totalTonnage: 0, count: 0, name: 'Superior B', color: '#38bdf8' },
      'inferiores-b': { totalTonnage: 0, count: 0, name: 'Inferiores B', color: '#ec4899' },
    };

    for (const s of processedSessions) {
      if (map[s.templateId]) {
        map[s.templateId].totalTonnage += s.tonnage;
        map[s.templateId].count += 1;
      }
    }

    return Object.entries(map).map(([key, val]) => ({
      key,
      name: val.name,
      avgTonnage: val.count > 0 ? Math.round(val.totalTonnage / val.count) : 0,
      sessionsCount: val.count,
      color: val.color,
    }));
  }, [processedSessions]);

  // Key KPI stats
  const totalVolumeAllTime = useMemo(() => {
    return processedSessions.reduce((acc, s) => acc + s.tonnage, 0);
  }, [processedSessions]);

  const maxSessionTonnage = useMemo(() => {
    if (processedSessions.length === 0) return 0;
    return Math.max(...processedSessions.map((s) => s.tonnage));
  }, [processedSessions]);

  const avgSessionTonnage = useMemo(() => {
    if (processedSessions.length === 0) return 0;
    return Math.round(totalVolumeAllTime / processedSessions.length);
  }, [processedSessions, totalVolumeAllTime]);

  // Growth percentage (comparing first half vs second half or first session vs last session)
  const growthRate = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0].tonnage;
    const last = filteredData[filteredData.length - 1].tonnage;
    if (first === 0) return null;
    const rate = Math.round(((last - first) / first) * 100);
    return rate;
  }, [filteredData]);

  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">Nenhum dado de progressão disponível</h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Conclua ao menos uma sessão de treino com cargas e repetições preenchidas para visualizar os gráficos de tonelagem e progressão de força.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5" id="tonnage-progression-container">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Volume Total (Tonnage)</span>
            <Dumbbell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {(totalVolumeAllTime / 1000).toFixed(1)}k <span className="text-xs text-zinc-400 font-sans font-normal">kg</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {totalVolumeAllTime.toLocaleString('pt-BR')} kg levantados
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Recorde de Sessão (PR)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {maxSessionTonnage.toLocaleString('pt-BR')} <span className="text-xs text-zinc-400 font-sans font-normal">kg</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Maior volume em um único treino
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Média por Sessão</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {avgSessionTonnage.toLocaleString('pt-BR')} <span className="text-xs text-zinc-400 font-sans font-normal">kg</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Média ponderada por treino
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Evolução Recente</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl sm:text-2xl font-black font-mono ${
                growthRate !== null && growthRate >= 0 ? 'text-emerald-400' : 'text-zinc-200'
              }`}>
                {growthRate !== null ? `${growthRate > 0 ? '+' : ''}${growthRate}%` : '—'}
              </span>
              {growthRate !== null && (
                <ArrowUpRight className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              )}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {processedSessions.length} treinos computados
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Chart View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-850 p-3.5 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            id="btn-view-tonnage"
            onClick={() => setViewMode('tonnage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'tonnage'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tonelagem Total (kg)</span>
          </button>

          <button
            id="btn-view-exercise-prog"
            onClick={() => setViewMode('exercise_progression')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'exercise_progression'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Carga por Exercício</span>
          </button>

          <button
            id="btn-view-division"
            onClick={() => setViewMode('division_compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'division_compare'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Divisão de Treino</span>
          </button>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {viewMode === 'tonnage' && (
            <>
              <select
                value={selectedTemplateFilter}
                onChange={(e) => setSelectedTemplateFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas as Divisões</option>
                <option value="superior-a">Superior A</option>
                <option value="inferiores-a">Inferiores A</option>
                <option value="superior-b">Superior B</option>
                <option value="inferiores-b">Inferiores B</option>
              </select>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas</option>
                <option value="10">Últimas 10</option>
                <option value="5">Últimas 5</option>
              </select>
            </>
          )}

          {viewMode === 'exercise_progression' && (
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 max-w-[200px] truncate"
            >
              {allExercisesList.map((exName) => (
                <option key={exName} value={exName}>
                  {exName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-3">
        {/* VIEW 1: TONNAGE PROGRESSION OVER TIME (Area Chart) */}
        {viewMode === 'tonnage' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Evolução de Tonelagem Acumulada por Sessão
                </h3>
                <p className="text-xs text-zinc-400">
                  Carga Total Levantada = Soma de (Repetições × Carga em kg) de todas as séries
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 self-start sm:self-auto">
                {filteredData.length} sessões exibidas
              </div>
            </div>

            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tonnageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as SessionDataPoint;
                        return (
                          <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[190px]">
                            <div className="font-bold text-white flex items-center justify-between gap-2 border-b border-zinc-800 pb-1.5">
                              <span>{data.title}</span>
                              <span className="text-[10px] text-zinc-400 font-normal">{data.fullDate}</span>
                            </div>
                            <div className="flex justify-between items-center text-amber-300 font-bold">
                              <span>Tonelagem Total:</span>
                              <span className="font-mono">{data.tonnage.toLocaleString('pt-BR')} kg</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                              <span>Séries Concluídas:</span>
                              <span className="text-zinc-200 font-mono">{data.totalSets} séries</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                              <span>Total de Reps:</span>
                              <span className="text-zinc-200 font-mono">{data.totalReps} reps</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                              <span>Carga Máxima:</span>
                              <span className="text-emerald-400 font-mono">{data.maxWeightLifted} kg</span>
                            </div>
                            {data.durationMinutes && (
                              <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                                <span>Duração:</span>
                                <span className="text-cyan-400 font-mono">{data.durationMinutes} min</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={avgSessionTonnage}
                    stroke="#a1a1aa"
                    strokeDasharray="4 4"
                    label={{
                      value: `Média (${avgSessionTonnage}kg)`,
                      fill: '#71717a',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tonnage"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#tonnageGradient)"
                    dot={{ fill: '#f59e0b', stroke: '#18181b', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 2: EXERCISE LOAD PROGRESSION (Line Chart with Max Kg and Volume) */}
        {viewMode === 'exercise_progression' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  Progressão de Carga: <span className="text-amber-400">{selectedExercise}</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Acompanhamento da carga máxima atingida (kg) e volume total deste exercício
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
                {exerciseHistoryData.length} registros encontrados
              </div>
            </div>

            {exerciseHistoryData.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                Nenhum registro finalizado para este exercício nas sessões anteriores.
              </div>
            ) : (
              <div className="h-[280px] sm:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseHistoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="displayDate"
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#3f3f46' }}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#3f3f46' }}
                      tickFormatter={(val) => `${val}kg`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as ExerciseDataPoint;
                          return (
                            <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[180px]">
                              <div className="font-bold text-white border-b border-zinc-800 pb-1 flex justify-between">
                                <span>{selectedExercise}</span>
                                <span className="text-[10px] text-zinc-400">{data.displayDate}</span>
                              </div>
                              <div className="flex justify-between items-center text-emerald-400 font-bold">
                                <span>Carga Máxima:</span>
                                <span className="font-mono">{data.maxKg} kg</span>
                              </div>
                              <div className="flex justify-between items-center text-amber-300 text-[11px]">
                                <span>Volume do Exercício:</span>
                                <span className="font-mono">{data.totalVolumeKg.toLocaleString('pt-BR')} kg</span>
                              </div>
                              <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                                <span>Séries Executadas:</span>
                                <span className="text-zinc-200 font-mono">{data.totalSets} séries</span>
                              </div>
                              <div className="text-[10px] text-zinc-500 italic pt-1 border-t border-zinc-800/80">
                                {data.sessionTitle}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="maxKg"
                      name="Carga Máxima (kg)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', stroke: '#18181b', strokeWidth: 2, r: 5 }}
                      activeDot={{ fill: '#34d399', stroke: '#ffffff', strokeWidth: 2, r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: DIVISION COMPARISON (Bar Chart) */}
        {viewMode === 'division_compare' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Média de Tonelagem por Divisão de Treino
                </h3>
                <p className="text-xs text-zinc-400">
                  Comparação do volume médio mobilizado entre Superior A/B e Inferiores A/B
                </p>
              </div>
            </div>

            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={divisionComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[170px]">
                            <div className="font-bold text-white border-b border-zinc-800 pb-1">
                              {data.name}
                            </div>
                            <div className="flex justify-between items-center text-cyan-300 font-bold">
                              <span>Média de Tonelagem:</span>
                              <span className="font-mono">{data.avgTonnage.toLocaleString('pt-BR')} kg</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                              <span>Sessões Registradas:</span>
                              <span className="text-zinc-200 font-mono">{data.sessionsCount} treinos</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="avgTonnage"
                    name="Tonelagem Média (kg)"
                    radius={[8, 8, 0, 0]}
                    fill="#38bdf8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Biomechanical Insight Note */}
      <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-zinc-200">Princípio da Sobrecarga Progressiva: </span>
          O aumento consistente da tonelagem (mais repetições com mesma carga ou mais carga para a mesma faixa de repetições mantendo a técnica) é o principal biomarcador de hipertrofia muscular e ganho real de força.
        </div>
      </div>
    </div>
  );
};
