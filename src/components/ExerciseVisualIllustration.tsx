import React from 'react';
import { Dumbbell, ArrowDown, ArrowUp, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface ExerciseVisualIllustrationProps {
  visualType?: string;
  category: string;
  equipment: string;
  name: string;
}

export const ExerciseVisualIllustration: React.FC<ExerciseVisualIllustrationProps> = ({
  visualType,
  category,
  equipment,
  name,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-4 sm:p-5 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background glow according to category */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-zinc-900 to-transparent" />

      {/* SVG Diagram Canvas */}
      <div className="relative z-10 w-full max-w-sm h-48 flex items-center justify-center">
        {visualType === 'press' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Bench */}
            <rect x="40" y="105" width="160" height="12" rx="4" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
            <rect x="70" y="117" width="10" height="30" fill="#27272a" />
            <rect x="160" y="117" width="10" height="30" fill="#27272a" />
            
            {/* Human Torso on Bench */}
            <ellipse cx="120" cy="100" rx="35" ry="10" fill="#f59e0b" opacity="0.85" />
            {/* Head */}
            <circle cx="65" cy="100" r="10" fill="#71717a" />
            
            {/* Target Chest Activation */}
            <ellipse cx="120" cy="98" rx="20" ry="7" fill="#ef4444" opacity="0.9" />
            <text x="120" y="93" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">PEITORAL</text>

            {/* Arms pushing barbell */}
            <line x1="100" y1="98" x2="90" y2="60" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <line x1="140" y1="98" x2="150" y2="60" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />

            {/* Barbell Bar */}
            <line x1="50" y1="58" x2="190" y2="58" stroke="#e4e4e7" strokeWidth="5" strokeLinecap="round" />
            {/* Weight Plates */}
            <rect x="60" y="42" width="8" height="32" rx="2" fill="#ef4444" />
            <rect x="172" y="42" width="8" height="32" rx="2" fill="#ef4444" />
            
            {/* Motion Arrows */}
            <g className="animate-pulse">
              <path d="M120 75 L120 40" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3,3" />
              <polygon points="120,33 116,42 124,42" fill="#38bdf8" />
              <text x="135" y="45" fill="#38bdf8" fontSize="8" fontWeight="bold">Empurrada</text>
            </g>
          </svg>
        )}

        {visualType === 'pulley' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Pulley Machine frame */}
            <line x1="120" y1="10" x2="120" y2="35" stroke="#71717a" strokeWidth="3" />
            <circle cx="120" cy="35" r="7" fill="#3f3f46" stroke="#fbbf24" strokeWidth="2" />
            {/* Cable */}
            <line x1="120" y1="35" x2="120" y2="65" stroke="#a1a1aa" strokeWidth="2" />
            
            {/* Handle / Bar */}
            <line x1="85" y1="65" x2="155" y2="65" stroke="#e4e4e7" strokeWidth="5" strokeLinecap="round" />

            {/* Person sitting */}
            <rect x="100" y="115" width="40" height="10" rx="3" fill="#3f3f46" />
            <circle cx="120" cy="85" r="10" fill="#71717a" />
            <path d="M110 95 Q120 120 120 125" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" />

            {/* Latissimus Dorsi (Costas) Highlight */}
            <ellipse cx="120" cy="102" rx="14" ry="10" fill="#06b6d4" opacity="0.9" />
            <text x="120" y="105" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">DORSAIS</text>

            {/* Arms pulling down */}
            <line x1="110" y1="95" x2="95" y2="65" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
            <line x1="130" y1="95" x2="145" y2="65" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

            {/* Traction Arrows */}
            <g className="animate-pulse">
              <path d="M75 60 L75 85" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3,3" />
              <polygon points="75,90 71,81 79,81" fill="#10b981" />
              <text x="45" y="77" fill="#10b981" fontSize="8" fontWeight="bold">Puxada</text>
            </g>
          </svg>
        )}

        {visualType === 'hipthrust' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Bench */}
            <rect x="30" y="70" width="30" height="50" rx="4" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
            
            {/* Body bridge */}
            {/* Shoulders on bench */}
            <circle cx="55" cy="72" r="10" fill="#71717a" />
            {/* Torso aligned horizontally */}
            <line x1="60" y1="75" x2="120" y2="75" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" />
            {/* Thighs */}
            <line x1="120" y1="75" x2="165" y2="120" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
            {/* Shins 90 deg */}
            <line x1="165" y1="120" x2="165" y2="145" stroke="#71717a" strokeWidth="10" strokeLinecap="round" />

            {/* Glute highlight */}
            <circle cx="115" cy="75" r="14" fill="#ef4444" opacity="0.9" />
            <text x="115" y="78" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">GLÚTEO</text>

            {/* Barbell on hips */}
            <circle cx="120" cy="65" r="12" fill="#38bdf8" opacity="0.9" />
            <line x1="100" y1="65" x2="140" y2="65" stroke="#e4e4e7" strokeWidth="4" />
            <text x="120" y="50" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">BARRA / CARGA</text>

            {/* Push vector upwards */}
            <g className="animate-pulse">
              <path d="M120 95 L120 70" stroke="#ef4444" strokeWidth="3" />
              <polygon points="120,62 115,72 125,72" fill="#ef4444" />
              <text x="125" y="105" fill="#ef4444" fontSize="8" fontWeight="bold">Extensão Pélvica</text>
            </g>
          </svg>
        )}

        {visualType === 'squat' || visualType === 'bulgarian' ? (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Ground */}
            <line x1="30" y1="145" x2="210" y2="145" stroke="#52525b" strokeWidth="3" />
            
            {/* Person in deep squat */}
            <circle cx="105" cy="45" r="11" fill="#71717a" />
            {/* Torso */}
            <line x1="105" y1="56" x2="90" y2="95" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
            {/* Thigh (horizontal / deep) */}
            <line x1="90" y1="95" x2="135" y2="95" stroke="#10b981" strokeWidth="14" strokeLinecap="round" />
            {/* Shin */}
            <line x1="135" y1="95" x2="125" y2="145" stroke="#71717a" strokeWidth="10" strokeLinecap="round" />

            {/* Quadriceps Highlight */}
            <ellipse cx="112" cy="95" rx="16" ry="7" fill="#10b981" opacity="0.9" />
            <text x="112" y="98" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">QUADRÍCEPS</text>

            {/* Glute */}
            <circle cx="85" cy="95" r="10" fill="#ef4444" opacity="0.85" />

            {/* Vectors */}
            <g className="animate-pulse">
              <path d="M112 125 L112 105" stroke="#10b981" strokeWidth="2.5" />
              <polygon points="112,98 108,107 116,107" fill="#10b981" />
              <text x="135" y="125" fill="#10b981" fontSize="8" fontWeight="bold">Força de Extensão</text>
            </g>
          </svg>
        ) : null}

        {visualType === 'fly' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Torso Top View / Front View */}
            <ellipse cx="120" cy="80" rx="30" ry="20" fill="#27272a" stroke="#52525b" strokeWidth="2" />
            <circle cx="120" cy="80" r="16" fill="#ef4444" opacity="0.85" />
            <text x="120" y="83" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">PEITORAL</text>

            {/* Left Arm Open Arc */}
            <path d="M90 80 Q60 60 50 85" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Right Arm Open Arc */}
            <path d="M150 80 Q180 60 190 85" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Convergence Motion Arcs */}
            <g className="animate-pulse">
              <path d="M55 90 Q85 115 110 100" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3,3" fill="none" />
              <polygon points="114,97 104,98 108,106" fill="#f59e0b" />

              <path d="M185 90 Q155 115 130 100" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3,3" fill="none" />
              <polygon points="126,97 132,106 136,98" fill="#f59e0b" />

              <text x="120" y="130" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">Fechamento em Abraço</text>
            </g>
          </svg>
        )}

        {visualType === 'stiff' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* Floor */}
            <line x1="30" y1="145" x2="210" y2="145" stroke="#52525b" strokeWidth="3" />

            {/* Person in Stiff / Hinge */}
            <circle cx="80" cy="65" r="10" fill="#71717a" />
            {/* Spine straight at 45 deg */}
            <line x1="85" y1="70" x2="130" y2="90" stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" />
            {/* Thigh / Hamstring */}
            <line x1="130" y1="90" x2="125" y2="145" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            
            {/* Hamstring and Glute highlight */}
            <line x1="130" y1="92" x2="127" y2="125" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <text x="165" y="110" fill="#ef4444" fontSize="8" fontWeight="bold">POSTERIORES</text>

            {/* Barbell hanging close to shins */}
            <line x1="110" y1="120" x2="110" y2="120" stroke="#e4e4e7" strokeWidth="1" />
            <circle cx="112" cy="120" r="10" fill="#38bdf8" />
            <line x1="90" y1="75" x2="112" y2="115" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

            {/* Hinge arrow (push hip back) */}
            <g className="animate-pulse">
              <path d="M125 80 L155 80" stroke="#f59e0b" strokeWidth="2.5" />
              <polygon points="160,80 150,76 150,84" fill="#f59e0b" />
              <text x="160" y="72" fill="#f59e0b" fontSize="7.5" fontWeight="bold">Quadril para Trás</text>
            </g>
          </svg>
        )}

        {visualType === 'legpress' && (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 drop-shadow-md">
            {/* 45 Degree Incline Seat */}
            <line x1="50" y1="130" x2="110" y2="70" stroke="#3f3f46" strokeWidth="12" strokeLinecap="round" />
            {/* Platform at 45 deg */}
            <line x1="150" y1="30" x2="200" y2="80" stroke="#71717a" strokeWidth="8" strokeLinecap="round" />

            {/* Person */}
            <circle cx="70" cy="85" r="9" fill="#71717a" />
            {/* Torso */}
            <line x1="75" y1="90" x2="105" y2="120" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
            {/* Thighs */}
            <line x1="105" y1="120" x2="140" y2="80" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Shins to plate */}
            <line x1="140" y1="80" x2="170" y2="55" stroke="#71717a" strokeWidth="10" strokeLinecap="round" />

            {/* Target Quad Highlight */}
            <ellipse cx="122" cy="100" rx="14" ry="7" fill="#10b981" opacity="0.9" />
            <text x="122" y="103" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">COXAS</text>

            {/* Push Arrow */}
            <g className="animate-pulse">
              <path d="M160 70 L185 45" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="189,41 180,44 185,50" fill="#38bdf8" />
              <text x="185" y="65" fill="#38bdf8" fontSize="8" fontWeight="bold">Empurre 45º</text>
            </g>
          </svg>
        )}

        {/* Fallback default illustration for curls, lateral, calf, etc. */}
        {(!visualType || ['row', 'curl', 'lateral', 'extension', 'calf'].includes(visualType)) && (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
              <span className="uppercase px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400">
                {equipment}
              </span>
              <span className="uppercase px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-cyan-400">
                {category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Muscle Focus Badge */}
      <div className="relative z-10 mt-1 flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-700/80">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-zinc-200">Biomecânica & Foco Direcionado:</span>
        <span className="text-amber-300 font-bold">{name}</span>
      </div>
    </div>
  );
};
