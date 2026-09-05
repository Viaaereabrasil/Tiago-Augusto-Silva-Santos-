import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  Activity,
  Flame,
  Zap,
  Info,
  Layers,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { parseSessionTimestamp } from '../utils/storage';

interface RpeEffortProgressionChartProps {
  sessions: WorkoutSession[];
}

interface WeekEffortDataPoint {
  weekKey: string;
  weekLabel: string;
  shortLabel: string;
  sessionsCount: number;
  totalSets: number;
  avgRpe: number;
  avgRir: number;
  rpe10Sets: number; // RIR 0
  rpe9Sets: number;  // RIR 1
  rpe8Sets: number;  // RIR 2
  rpe7orLessSets: number; // RIR 3+
  totalTonnageKg: number;
  sessionTitles: string[];
}

interface SessionEffortDataPoint {
  id: string;
  date: string;
  displayDate: string;
  fullDate: string;
  title: string;
  templateId: string;
  avgRpe: number;
  avgRir: number;
  totalSets: number;
  rpe10Sets: number;
  rpe9Sets: number;
  rpe8Sets: number;
  rpe7orLessSets: number;
  totalTonnageKg: number;
}

// Helper to calculate week grouping
function getWeekInfo(dateStr: string) {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);

  const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Seg, ...
  const diffToMonday = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  
  const monday = new Date(year, month, diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mDay = monday.getDate().toString().padStart(2, '0');
  const mMonth = (monday.getMonth() + 1).toString().padStart(2, '0');
  const sDay = sunday.getDate().toString().padStart(2, '0');
  const sMonth = (sunday.getMonth() + 1).toString().padStart(2, '0');

  // Simple week number approximation
  const startOfYear = new Date(monday.getFullYear(), 0, 1);
  const pastDaysOfYear = (monday.getTime() - startOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  return {
    weekKey: `${monday.getFullYear()}-W${weekNum}`,
    weekLabel: `${mDay}/${mMonth} a ${sDay}/${sMonth}`,
    shortLabel: `Sem ${weekNum} (${mDay}/${mMonth})`,
    mondayTimestamp: monday.getTime(),
  };
}

// Helper to convert set to RPE/RIR
function getSetRpeRir(set: { rir?: number | null; type?: string }) {
  if (set.rir !== undefined && set.rir !== null) {
    const rir = Math.max(0, Math.min(5, set.rir));
    const rpe = 10 - rir;
    return { rpe, rir };
  }

  // Fallback estimation based on set type if RIR wasn't specifically marked
  if (set.type === 'top_set') return { rpe: 9.5, rir: 0.5 };
  if (set.type === 'working') return { rpe: 8.5, rir: 1.5 };
  if (set.type === 'feeder') return { rpe: 7.0, rir: 3.0 };
  if (set.type === 'warmup') return { rpe: 5.5, rir: 4.5 };
  return { rpe: 8.0, rir: 2.0 };
}

export const RpeEffortProgressionChart: React.FC<RpeEffortProgressionChartProps> = ({ sessions }) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'per_session'>('weekly');
  const [metricMode, setMetricMode] = useState<'rpe' | 'rir' | 'combined'>('combined');
  const [showGuideInfo, setShowGuideInfo] = useState<boolean>(false);

  // Chronological sort
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const tA = parseSessionTimestamp(a.date, a.startTime);
      const tB = parseSessionTimestamp(b.date, b.startTime);
      return tA - tB;
    });
  }, [sessions]);

  // 1. Process Session-Level Effort Data
  const sessionEffortData: SessionEffortDataPoint[] = useMemo(() => {
    return sortedSessions.map((sess) => {
      let totalRpeSum = 0;
      let totalRirSum = 0;
      let completedSetsCount = 0;
      let rpe10Sets = 0;
      let rpe9Sets = 0;
      let rpe8Sets = 0;
      let rpe7orLessSets = 0;
      let totalTonnage = 0;

      for (const ex of sess.exercises) {
        for (const st of ex.sets) {
          if (st.completed) {
            completedSetsCount++;
            const { rpe, rir } = getSetRpeRir(st);
            totalRpeSum += rpe;
            totalRirSum += rir;

            if (rpe >= 9.5) rpe10Sets++;
            else if (rpe >= 8.5) rpe9Sets++;
            else if (rpe >= 7.5) rpe8Sets++;
            else rpe7orLessSets++;

            const reps = st.actualReps ?? st.targetReps ?? 0;
            const kg = st.actualKg ?? st.targetKg ?? 0;
            totalTonnage += reps * kg;
          }
        }
      }

      const [y, m, d] = sess.date.split('-');
      const displayDate = d && m ? `${d}/${m}` : sess.date;
      const fullDate = d && m && y ? `${d}/${m}/${y}` : sess.date;

      const avgRpe = completedSetsCount > 0 ? parseFloat((totalRpeSum / completedSetsCount).toFixed(1)) : 8.0;
      const avgRir = completedSetsCount > 0 ? parseFloat((totalRirSum / completedSetsCount).toFixed(1)) : 2.0;

      return {
        id: sess.id,
        date: sess.date,
        displayDate,
        fullDate,
        title: sess.title,
        templateId: sess.templateId,
        avgRpe,
        avgRir,
        totalSets: completedSetsCount,
        rpe10Sets,
        rpe9Sets,
        rpe8Sets,
        rpe7orLessSets,
        totalTonnageKg: Math.round(totalTonnage),
      };
    });
  }, [sortedSessions]);

  // 2. Process Weekly Effort Data
  const weeklyEffortData: WeekEffortDataPoint[] = useMemo(() => {
    const weekMap: Record<
      string,
      {
        weekLabel: string;
        shortLabel: string;
        sessionsCount: number;
        totalSets: number;
        rpeSum: number;
        rirSum: number;
        rpe10Sets: number;
        rpe9Sets: number;
        rpe8Sets: number;
        rpe7orLessSets: number;
        totalTonnage: number;
        sessionTitles: string[];
        mondayTimestamp: number;
      }
    > = {};

    for (const sess of sortedSessions) {
      const { weekKey, weekLabel, shortLabel, mondayTimestamp } = getWeekInfo(sess.date);

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = {
          weekLabel,
          shortLabel,
          sessionsCount: 0,
          totalSets: 0,
          rpeSum: 0,
          rirSum: 0,
          rpe10Sets: 0,
          rpe9Sets: 0,
          rpe8Sets: 0,
          rpe7orLessSets: 0,
          totalTonnage: 0,
          sessionTitles: [],
          mondayTimestamp,
        };
      }

      const w = weekMap[weekKey];
      w.sessionsCount += 1;
      if (!w.sessionTitles.includes(sess.title)) {
        w.sessionTitles.push(sess.title);
      }

      for (const ex of sess.exercises) {
        for (const st of ex.sets) {
          if (st.completed) {
            w.totalSets += 1;
            const { rpe, rir } = getSetRpeRir(st);
            w.rpeSum += rpe;
            w.rirSum += rir;

            if (rpe >= 9.5) w.rpe10Sets += 1;
            else if (rpe >= 8.5) w.rpe9Sets += 1;
            else if (rpe >= 7.5) w.rpe8Sets += 1;
            else w.rpe7orLessSets += 1;

            const reps = st.actualReps ?? st.targetReps ?? 0;
            const kg = st.actualKg ?? st.targetKg ?? 0;
            w.totalTonnage += reps * kg;
          }
        }
      }
    }

    const result = Object.entries(weekMap).map(([weekKey, val]) => {
      const avgRpe = val.totalSets > 0 ? parseFloat((val.rpeSum / val.totalSets).toFixed(1)) : 8.0;
      const avgRir = val.totalSets > 0 ? parseFloat((val.rirSum / val.totalSets).toFixed(1)) : 2.0;

      return {
        weekKey,
        weekLabel: val.weekLabel,
        shortLabel: val.shortLabel,
        sessionsCount: val.sessionsCount,
        totalSets: val.totalSets,
        avgRpe,
        avgRir,
        rpe10Sets: val.rpe10Sets,
        rpe9Sets: val.rpe9Sets,
        rpe8Sets: val.rpe8Sets,
        rpe7orLessSets: val.rpe7orLessSets,
        totalTonnageKg: Math.round(val.totalTonnage),
        sessionTitles: val.sessionTitles,
        timestamp: val.mondayTimestamp,
      };
    });

    return result.sort((a, b) => a.timestamp - b.timestamp);
  }, [sortedSessions]);

  // Overall Global KPIs
  const globalStats = useMemo(() => {
    let totalSets = 0;
    let totalRpeSum = 0;
    let totalRirSum = 0;
    let failureSets = 0;
    let effectiveSets = 0; // RPE 8+

    for (const sess of sortedSessions) {
      for (const ex of sess.exercises) {
        for (const st of ex.sets) {
          if (st.completed) {
            totalSets++;
            const { rpe, rir } = getSetRpeRir(st);
            totalRpeSum += rpe;
            totalRirSum += rir;
            if (rpe >= 9.5) failureSets++;
            if (rpe >= 8.0) effectiveSets++;
          }
        }
      }
    }

    const avgRpe = totalSets > 0 ? parseFloat((totalRpeSum / totalSets).toFixed(1)) : 0;
    const avgRir = totalSets > 0 ? parseFloat((totalRirSum / totalSets).toFixed(1)) : 0;
    const effectivePercentage = totalSets > 0 ? Math.round((effectiveSets / totalSets) * 100) : 0;

    return {
      totalSets,
      avgRpe,
      avgRir,
      failureSets,
      effectivePercentage,
      totalWeeks: weeklyEffortData.length,
    };
  }, [sortedSessions, weeklyEffortData]);

  // Intensity Zone Analysis
  const zoneAnalysis = useMemo(() => {
    const rpe = globalStats.avgRpe;
    if (rpe >= 9.2) {
      return {
        status: 'Zona de Alta Intensidade (Quase Falha)',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        description: 'Você está treinando muito próximo da falha máxima (RIR ~0.8). Excelente estímulo mecânico, monitore a recuperação e deloads.',
      };
    }
    if (rpe >= 8.0) {
      return {
        status: 'Faixa Ideal de Hipertrofia (RPE 8-9)',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        description: 'Faixa padrão-ouro: 1 a 2 repetições na reserva. Alto recrutamento de fibras com excelente sustentabilidade de volume.',
      };
    }
    return {
      status: 'Zona Moderada / Deload (RPE < 8)',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      description: 'Esforço moderado (3+ reps na reserva). Ideal para semanas de transição, aquisição de técnica ou recuperação ativa.',
    };
  }, [globalStats.avgRpe]);

  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Activity className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">Nenhum dado de esforço disponível</h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Conclua suas sessões de treino para registrar seu RPE e repetições na reserva (RIR) ao longo das semanas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="rpe-effort-progression-chart">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: RPE Médio */}
        <div className="p-3.5 rounded-xl bg-zinc-850/90 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">RPE Médio (Esforço)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-400 font-mono flex items-baseline gap-1">
              {globalStats.avgRpe > 0 ? globalStats.avgRpe : '—'}
              <span className="text-xs text-zinc-400 font-sans font-normal">/ 10</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Escala de Percepção de Esforço
            </div>
          </div>
        </div>

        {/* Card 2: RIR Médio */}
        <div className="p-3.5 rounded-xl bg-zinc-850/90 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">RIR Médio (Reserva)</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-orange-300 font-mono flex items-baseline gap-1">
              {globalStats.avgRir > 0 ? globalStats.avgRir : '—'}
              <span className="text-xs text-zinc-400 font-sans font-normal">reps</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Repetições antes da falha
            </div>
          </div>
        </div>

        {/* Card 3: % Séries Efetivas */}
        <div className="p-3.5 rounded-xl bg-zinc-850/90 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Séries Efetivas (RPE ≥ 8)</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {globalStats.effectivePercentage}%
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {globalStats.totalSets} séries analisadas
            </div>
          </div>
        </div>

        {/* Card 4: Séries na Falha Absoluta */}
        <div className="p-3.5 rounded-xl bg-zinc-850/90 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Falha Concêntrica (RIR 0)</span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-300 font-mono">
              {globalStats.failureSets}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Séries no limite absoluto (RPE 10)
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Insight Banner */}
      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">Diagnóstico de Intensidade:</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${zoneAnalysis.badgeBg}`}>
                {zoneAnalysis.status}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              {zoneAnalysis.description}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-rpe-guide"
          onClick={() => setShowGuideInfo(!showGuideInfo)}
          className="self-end sm:self-center px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{showGuideInfo ? 'Ocultar Guia' : 'Entender RPE/RIR'}</span>
        </button>
      </div>

      {/* Guide Info Accordion */}
      {showGuideInfo && (
        <div className="p-4 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 text-xs text-zinc-300 space-y-2.5 animate-fadeIn">
          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            Como interpretar a Escala RPE e RIR no Treino de Força
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-rose-500/30 space-y-1">
              <div className="font-bold text-rose-300">RPE 10 (RIR 0)</div>
              <p className="text-zinc-400">Falha total concêntrica. Nenhuma repetição a mais seria possível com boa forma.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-orange-500/30 space-y-1">
              <div className="font-bold text-orange-300">RPE 9 (RIR 1)</div>
              <p className="text-zinc-400">Muito intenso. Conseguiria realizar exatamente 1 repetição antes da falha.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-amber-500/30 space-y-1">
              <div className="font-bold text-amber-300">RPE 8 (RIR 2)</div>
              <p className="text-zinc-400">Intensidade ideal. Conseguiria realizar mais 2 repetições. Excelente estímulo hipertrófico.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-cyan-500/30 space-y-1">
              <div className="font-bold text-cyan-300">RPE ≤ 7 (RIR 3+)</div>
              <p className="text-zinc-400">Carga moderada a leve. 3 ou mais repetições na reserva. Foco em técnica ou recuperação.</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: View Switcher (Weekly vs Per Session) & Metric Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-850 p-3 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-1.5">
          <button
            id="btn-rpe-view-weekly"
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'weekly'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Média Semanal ({weeklyEffortData.length} sem)</span>
          </button>

          <button
            id="btn-rpe-view-session"
            onClick={() => setViewMode('per_session')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'per_session'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Por Sessão ({sessionEffortData.length} treinos)</span>
          </button>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="text-[10px] text-zinc-400 uppercase font-bold mr-1">Métrica:</span>
          <button
            onClick={() => setMetricMode('combined')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
              metricMode === 'combined'
                ? 'bg-zinc-700 text-white border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            RPE & RIR
          </button>
          <button
            onClick={() => setMetricMode('rpe')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
              metricMode === 'rpe'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Apenas RPE
          </button>
          <button
            onClick={() => setMetricMode('rir')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
              metricMode === 'rir'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Apenas RIR
          </button>
        </div>
      </div>

      {/* Main Effort Chart Container */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              {viewMode === 'weekly'
                ? 'Evolução da Média Semanal de Esforço (RPE / RIR)'
                : 'Evolução de Esforço por Treino Realizado'}
            </h3>
            <p className="text-xs text-zinc-400">
              {viewMode === 'weekly'
                ? 'Média consolidada de todas as séries de trabalho registradas em cada semana do calendário'
                : 'Média de esforço percebido em cada sessão individual'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono mt-1 sm:mt-0">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              RPE (0-10)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              RIR (0-5)
            </span>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-[280px] sm:h-[320px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={(viewMode === 'weekly' ? weeklyEffortData : sessionEffortData) as any}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rpeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rirGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              
              <XAxis
                dataKey={viewMode === 'weekly' ? 'shortLabel' : 'displayDate'}
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />

              {/* Reference Zones */}
              <ReferenceLine
                y={10}
                stroke="#f43f5e"
                strokeDasharray="3 3"
                label={{
                  value: 'Falha Total (RPE 10)',
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <ReferenceLine
                y={8}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: 'Faixa Ideal (RPE 8)',
                  fill: '#10b981',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data: any = payload[0].payload;
                    return (
                      <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs space-y-2 min-w-[200px]">
                        <div className="border-b border-zinc-800 pb-1.5">
                          <p className="font-bold text-white text-sm">
                            {viewMode === 'weekly' ? data.weekLabel : data.title}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {viewMode === 'weekly'
                              ? `${data.sessionsCount} sessões no período`
                              : `${data.fullDate}`}
                          </p>
                        </div>

                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex justify-between items-center text-amber-300">
                            <span>Média de RPE:</span>
                            <span className="font-bold text-amber-400 text-sm">{data.avgRpe} / 10</span>
                          </div>
                          <div className="flex justify-between items-center text-orange-300">
                            <span>Média de RIR (Reserva):</span>
                            <span className="font-bold text-orange-400">{data.avgRir} reps</span>
                          </div>
                          <div className="flex justify-between items-center text-zinc-400 pt-1 border-t border-zinc-800/80">
                            <span>Séries Realizadas:</span>
                            <span className="font-bold text-zinc-200">{data.totalSets}</span>
                          </div>
                          <div className="flex justify-between items-center text-rose-400">
                            <span>Séries na Falha (RIR 0):</span>
                            <span className="font-bold">{data.rpe10Sets}</span>
                          </div>
                          {data.totalTonnageKg > 0 && (
                            <div className="flex justify-between items-center text-zinc-400">
                              <span>Tonelagem:</span>
                              <span className="font-bold text-zinc-300">{data.totalTonnageKg.toLocaleString('pt-BR')} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {(metricMode === 'combined' || metricMode === 'rpe') && (
                <Area
                  type="monotone"
                  dataKey="avgRpe"
                  name="RPE Médio"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rpeGradient)"
                  dot={{ r: 4, fill: '#f59e0b', stroke: '#18181b', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#fbbf24' }}
                />
              )}

              {(metricMode === 'combined' || metricMode === 'rir') && (
                <Line
                  type="monotone"
                  dataKey="avgRir"
                  name="RIR Médio"
                  stroke="#fb923c"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#fb923c', stroke: '#18181b', strokeWidth: 1.5 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Secondary Intensity Breakdown Chart (Stacked Bars of Effort Tiers) */}
        <div className="pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              Distribuição de Séries por Faixa de Esforço
            </h4>
            <span className="text-[10px] text-zinc-500">Contagem de séries de trabalho</span>
          </div>

          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(viewMode === 'weekly' ? weeklyEffortData : sessionEffortData) as any}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey={viewMode === 'weekly' ? 'shortLabel' : 'displayDate'}
                  stroke="#71717a"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data: any = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 border border-zinc-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{viewMode === 'weekly' ? data.weekLabel : data.title}</p>
                          <div className="text-[11px] space-y-0.5">
                            <p className="text-rose-400">Falha (RPE 10): {data.rpe10Sets} séries</p>
                            <p className="text-orange-400">RPE 9 (RIR 1): {data.rpe9Sets} séries</p>
                            <p className="text-amber-400">RPE 8 (RIR 2): {data.rpe8Sets} séries</p>
                            <p className="text-cyan-400">RPE ≤ 7 (RIR 3+): {data.rpe7orLessSets} séries</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rpe10Sets" name="RPE 10 (Falha)" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rpe9Sets" name="RPE 9 (RIR 1)" stackId="a" fill="#fb923c" />
                <Bar dataKey="rpe8Sets" name="RPE 8 (RIR 2)" stackId="a" fill="#f59e0b" />
                <Bar dataKey="rpe7orLessSets" name="RPE ≤ 7" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
