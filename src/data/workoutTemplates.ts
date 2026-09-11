import { WorkoutTemplate } from '../types';

export const INITIAL_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    "id": "superior-a",
    "plan": "A",
    "title": "TREINO SUPERIOR A",
    "subtitle": "Costas, Peito, Ombros, Tríceps",
    "tag": "Superior",
    "exercises": [
      {
        "id": "superior-a-ex1",
        "name": "Pulley fechado pegada anat/triângulo",
        "category": "costas",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-a-ex1-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex1-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex1-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex1-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex1-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex2",
        "name": "Crucifixo cabo declinando",
        "category": "peito",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-a-ex2-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex2-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex2-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex2-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex2-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex3",
        "name": "Puxada alta unilateral cabo",
        "category": "costas",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-a-ex3-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex3-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex3-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex3-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex4",
        "name": "Supino barra",
        "category": "peito",
        "equipment": "barra",
        "sets": [
          {
            "id": "superior-a-ex4-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex4-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex4-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex4-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex5",
        "name": "Remada máquina",
        "category": "costas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "superior-a-ex5-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex5-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex5-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex5-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex6",
        "name": "Elevação lateral com halteres",
        "category": "ombros",
        "equipment": "halter",
        "sets": [
          {
            "id": "superior-a-ex6-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex6-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex6-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex6-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex7",
        "name": "Desenvolvimento Máquina",
        "category": "ombros",
        "equipment": "maquina",
        "sets": [
          {
            "id": "superior-a-ex7-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex7-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex7-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-a-ex7-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-a-ex8",
        "name": "Triceps polia alta",
        "category": "triceps",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-a-ex8-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-ex8-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-ex8-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-ex8-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": "inferiores-a",
    "plan": "A",
    "title": "TREINO INFERIORES A (Post/Glut)",
    "subtitle": "Posterior, Glúteos & Panturrilha",
    "tag": "Inferior",
    "exercises": [
      {
        "id": "inferiores-a-ex1",
        "name": "Elevação pélvica",
        "category": "gluteos",
        "equipment": "barra",
        "sets": [
          {
            "id": "inferiores-a-ex1-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex1-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex1-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex1-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex1-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex2",
        "name": "Cadeira flexora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-a-ex2-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex2-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex2-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex2-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex2-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex3",
        "name": "Mesa Flexora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-a-ex3-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex3-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex3-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex3-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex4",
        "name": "Cadeira abdutora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-a-ex4-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex4-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex4-s3",
            "targetReps": 2,
            "targetKg": 0,
            "actualReps": 2,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex4-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex4-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex5",
        "name": "Agachamento Búlgaro",
        "category": "pernas",
        "equipment": "halter",
        "sets": [
          {
            "id": "inferiores-a-ex5-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex5-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex5-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex5-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex6",
        "name": "Stiff",
        "category": "pernas",
        "equipment": "barra",
        "sets": [
          {
            "id": "inferiores-a-ex6-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex6-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex6-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex6-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-a-ex7",
        "name": "Panturilha no Agachamento Hack",
        "category": "panturrilha",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-a-ex7-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-ex7-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-ex7-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-a-ex7-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      }
    ]
  },
  {
    "id": "superior-b",
    "plan": "A",
    "title": "TREINO SUPERIORES B",
    "subtitle": "Peito, Costas, Ombros, Tríceps",
    "tag": "Superior",
    "exercises": [
      {
        "id": "superior-b-ex1",
        "name": "Crucifixo cabo inclinado",
        "category": "peito",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-b-ex1-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex1-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex1-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex1-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex1-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex2",
        "name": "Pulley aberto pegada anatômica",
        "category": "costas",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-b-ex2-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex2-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex2-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex2-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex2-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex3",
        "name": "Supino barra",
        "category": "peito",
        "equipment": "barra",
        "sets": [
          {
            "id": "superior-b-ex3-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex3-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex3-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex3-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex4",
        "name": "Remada unilateral cabo baixo",
        "category": "costas",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-b-ex4-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex4-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex4-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex4-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex5",
        "name": "Crucifixo cabo declinando",
        "category": "peito",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-b-ex5-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex5-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex5-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex5-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex6",
        "name": "Elevação lateral com halteres",
        "category": "ombros",
        "equipment": "halter",
        "sets": [
          {
            "id": "superior-b-ex6-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex6-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex6-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex6-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex7",
        "name": "Posterior de ombro Máquina",
        "category": "ombros",
        "equipment": "maquina",
        "sets": [
          {
            "id": "superior-b-ex7-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex7-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex7-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex7-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex7-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "superior-b-ex8",
        "name": "Triceps polia baixa",
        "category": "triceps",
        "equipment": "cabo",
        "sets": [
          {
            "id": "superior-b-ex8-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-ex8-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-ex8-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "superior-b-ex8-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      }
    ]
  },
  {
    "id": "inferiores-b",
    "plan": "A",
    "title": "TREINO INFERIORES B (Quadriceps)",
    "subtitle": "Quadríceps, Adutores & Panturrilha",
    "tag": "Inferior",
    "exercises": [
      {
        "id": "inferiores-b-ex1",
        "name": "Extensora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-b-ex1-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex1-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex1-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex1-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex1-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-b-ex2",
        "name": "Cadeira adutora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-b-ex2-s1",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex2-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex2-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex2-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex2-s5",
            "targetReps": 7,
            "targetKg": 0,
            "actualReps": 7,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-b-ex3",
        "name": "Agachamento livre/smith",
        "category": "pernas",
        "equipment": "barra",
        "sets": [
          {
            "id": "inferiores-b-ex3-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex3-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex3-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex3-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex3-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-b-ex4",
        "name": "Leg press",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-b-ex4-s1",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex4-s2",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex4-s3",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex4-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-b-ex5",
        "name": "Cadeira flexora",
        "category": "pernas",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-b-ex5-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex5-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex5-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex5-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex5-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      },
      {
        "id": "inferiores-b-ex6",
        "name": "Panturilha Hack",
        "category": "panturrilha",
        "equipment": "maquina",
        "sets": [
          {
            "id": "inferiores-b-ex6-s1",
            "targetReps": 12,
            "targetKg": 0,
            "actualReps": 12,
            "actualKg": 0,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-ex6-s2",
            "targetReps": 6,
            "targetKg": 0,
            "actualReps": 6,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex6-s3",
            "targetReps": 4,
            "targetKg": 0,
            "actualReps": 4,
            "actualKg": 0,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-ex6-s4",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "working",
            "completed": false,
            "rir": 2
          },
          {
            "id": "inferiores-b-ex6-s5",
            "targetReps": 10,
            "targetKg": 0,
            "actualReps": 10,
            "actualKg": 0,
            "type": "top_set",
            "completed": false,
            "rir": 0
          }
        ]
      }
    ]
  },
  {
    "id": "inferiores-a-b",
    "title": "TREINO INFERIORES A (Plano B)",
    "subtitle": "Posterior de Coxa & Glúteos",
    "tag": "Inferior",
    "exercises": [
      {
        "id": "inferiores-a-b-ex1",
        "name": "Elevação pélvica",
        "category": "gluteos",
        "equipment": "barra",
        "notes": "Apoio na escápula, pico de contração de 1s no topo",
        "sets": [
          {
            "id": "inferiores-a-b-ex1-s1",
            "targetReps": 12,
            "actualReps": 12,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex1-s2",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex1-s3",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex1-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex1-s5",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex2",
        "name": "Cadeira flexora",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Foco na flexão de joelhos, controle da volta",
        "sets": [
          {
            "id": "inferiores-a-b-ex2-s1",
            "targetReps": 12,
            "actualReps": 12,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex2-s2",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex2-s3",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex2-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex2-s5",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex3",
        "name": "Mesa Flexora",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Pelve colada no banco, sem hiperestender lombar",
        "sets": [
          {
            "id": "inferiores-a-b-ex3-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex3-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex3-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex3-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex4",
        "name": "Cadeira abdutora",
        "category": "gluteos",
        "equipment": "maquina",
        "notes": "Glúteo médio e mínimo, amplitude máxima",
        "sets": [
          {
            "id": "inferiores-a-b-ex4-s1",
            "targetReps": 12,
            "actualReps": 12,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex4-s2",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex4-s3",
            "targetReps": 2,
            "actualReps": 2,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex4-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex4-s5",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex5",
        "name": "Agachamento Búlgaro",
        "category": "pernas",
        "equipment": "halter",
        "notes": "Pé de trás apoiado no banco, tronco levemente inclinado à frente",
        "sets": [
          {
            "id": "inferiores-a-b-ex5-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex5-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex5-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex5-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex6",
        "name": "Stiff",
        "category": "pernas",
        "equipment": "barra",
        "notes": "Quadril para trás, coluna neutra, ênfase no alongamento dos isquiotibiais",
        "sets": [
          {
            "id": "inferiores-a-b-ex6-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex6-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex6-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex6-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-a-b-ex7",
        "name": "Panturilha no Agachamento Hack",
        "category": "panturrilha",
        "equipment": "maquina",
        "notes": "Alongamento profundo embaixo e contração total em cima sem flexionar os joelhos",
        "sets": [
          {
            "id": "inferiores-a-b-ex7-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex7-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex7-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-a-b-ex7-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      }
    ],
    "plan": "B"
  },
  {
    "id": "superior-a-b",
    "title": "TREINO SUPERIOR A (Plano B)",
    "subtitle": "Costas, Peito, Ombros & Tríceps",
    "tag": "Superior",
    "exercises": [
      {
        "id": "superior-a-b-ex1",
        "name": "Pulley fechado pegada anat/triângulo",
        "category": "costas",
        "equipment": "cabo",
        "notes": "Puxada fechada com foco na grande dorsal e adução escapular",
        "sets": [
          {
            "id": "superior-a-b-ex1-s1",
            "targetReps": 12,
            "targetKg": 25,
            "actualReps": 12,
            "actualKg": 25,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-b-ex1-s2",
            "targetReps": 6,
            "targetKg": 30,
            "actualReps": 6,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex1-s3",
            "targetReps": 4,
            "targetKg": 40,
            "actualReps": 4,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex1-s4",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex1-s5",
            "targetReps": 10,
            "targetKg": 55,
            "actualReps": 10,
            "actualKg": 55,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex2",
        "name": "Crucifixo cabo declinando",
        "category": "peito",
        "equipment": "cabo",
        "notes": "Foco na porção esternal/inferior do peitoral maior",
        "sets": [
          {
            "id": "superior-a-b-ex2-s1",
            "targetReps": 12,
            "targetKg": 20,
            "actualReps": 12,
            "actualKg": 20,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-a-b-ex2-s2",
            "targetReps": 6,
            "targetKg": 30,
            "actualReps": 6,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex2-s3",
            "targetReps": 4,
            "targetKg": 40,
            "actualReps": 4,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex2-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex2-s5",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex3",
        "name": "Puxada alta unilateral cabo",
        "category": "costas",
        "equipment": "cabo",
        "notes": "Execução unilateral para alinhamento biomecânico e conexão mente-músculo",
        "sets": [
          {
            "id": "superior-a-b-ex3-s1",
            "targetReps": 6,
            "targetKg": 10,
            "actualReps": 6,
            "actualKg": 10,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex3-s2",
            "targetReps": 4,
            "targetKg": 15,
            "actualReps": 4,
            "actualKg": 15,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex3-s3",
            "targetReps": 10,
            "targetKg": 20,
            "actualReps": 10,
            "actualKg": 20,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex3-s4",
            "targetReps": 10,
            "targetKg": 25,
            "actualReps": 10,
            "actualKg": 25,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex4",
        "name": "Supino barra",
        "category": "peito",
        "equipment": "barra",
        "notes": "Pegada média, escápulas retraídas e controle excêntrico",
        "sets": [
          {
            "id": "superior-a-b-ex4-s1",
            "targetReps": 6,
            "targetKg": 20,
            "actualReps": 6,
            "actualKg": 20,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex4-s2",
            "targetReps": 4,
            "targetKg": 30,
            "actualReps": 4,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex4-s3",
            "targetReps": 10,
            "targetKg": 40,
            "actualReps": 10,
            "actualKg": 40,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex4-s4",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex5",
        "name": "Remada máquina",
        "category": "costas",
        "equipment": "maquina",
        "notes": "Apoio no peito, puxada com os cotovelos junto ao tronco",
        "sets": [
          {
            "id": "superior-a-b-ex5-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex5-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex5-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex5-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex6",
        "name": "Elevação lateral com halteres",
        "category": "ombros",
        "equipment": "halter",
        "notes": "Leve inclinação de tronco, foco no deltóide lateral",
        "sets": [
          {
            "id": "superior-a-b-ex6-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex6-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex6-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex6-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex7",
        "name": "Desenvolvimento Máquina",
        "category": "ombros",
        "equipment": "maquina",
        "notes": "Deltóide anterior e tríceps com máxima estabilidade",
        "sets": [
          {
            "id": "superior-a-b-ex7-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex7-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex7-s3",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex7-s4",
            "targetReps": 10,
            "actualReps": 10,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-a-b-ex8",
        "name": "Triceps polia alta",
        "category": "triceps",
        "equipment": "cabo",
        "notes": "Extensão de cotovelos com tronco estável",
        "sets": [
          {
            "id": "superior-a-b-ex8-s1",
            "targetReps": 6,
            "actualReps": 6,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex8-s2",
            "targetReps": 4,
            "actualReps": 4,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-a-b-ex8-s3",
            "targetReps": 10,
            "actualReps": 10,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-a-b-ex8-s4",
            "targetReps": 10,
            "actualReps": 10,
            "type": "top_set",
            "completed": false
          }
        ]
      }
    ],
    "plan": "B"
  },
  {
    "id": "inferiores-b-b",
    "title": "TREINO INFERIORES B (Plano B)",
    "subtitle": "Quadríceps, Adutores & Panturrilha",
    "tag": "Inferior",
    "exercises": [
      {
        "id": "inferiores-b-b-ex1",
        "name": "Cadeira Extensora",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Pré-exaustão de quadríceps. Segurar 1 segundo no topo e controlar a descida",
        "sets": [
          {
            "id": "inferiores-b-b-ex1-s1",
            "targetReps": 12,
            "targetKg": 25,
            "actualReps": 12,
            "actualKg": 25,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex1-s2",
            "targetReps": 6,
            "targetKg": 35,
            "actualReps": 6,
            "actualKg": 35,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex1-s3",
            "targetReps": 4,
            "targetKg": 45,
            "actualReps": 4,
            "actualKg": 45,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex1-s4",
            "targetReps": 10,
            "targetKg": 55,
            "actualReps": 10,
            "actualKg": 55,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex1-s5",
            "targetReps": 10,
            "targetKg": 65,
            "actualReps": 10,
            "actualKg": 65,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex2",
        "name": "Agachamento no Hack Machine",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Pés na base da plataforma para máxima flexão de joelho e foco total em quadríceps",
        "sets": [
          {
            "id": "inferiores-b-b-ex2-s1",
            "targetReps": 12,
            "targetKg": 20,
            "actualReps": 12,
            "actualKg": 20,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex2-s2",
            "targetReps": 6,
            "targetKg": 40,
            "actualReps": 6,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex2-s3",
            "targetReps": 4,
            "targetKg": 60,
            "actualReps": 4,
            "actualKg": 60,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex2-s4",
            "targetReps": 10,
            "targetKg": 80,
            "actualReps": 10,
            "actualKg": 80,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex2-s5",
            "targetReps": 10,
            "targetKg": 100,
            "actualReps": 10,
            "actualKg": 100,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex3",
        "name": "Leg Press 45º",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Pés na largura dos ombros na parte inferior da plataforma. Amplitude máxima sem descolar o quadril",
        "sets": [
          {
            "id": "inferiores-b-b-ex3-s1",
            "targetReps": 6,
            "targetKg": 80,
            "actualReps": 6,
            "actualKg": 80,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex3-s2",
            "targetReps": 4,
            "targetKg": 120,
            "actualReps": 4,
            "actualKg": 120,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex3-s3",
            "targetReps": 10,
            "targetKg": 160,
            "actualReps": 10,
            "actualKg": 160,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex3-s4",
            "targetReps": 10,
            "targetKg": 200,
            "actualReps": 10,
            "actualKg": 200,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex4",
        "name": "Cadeira Adutora",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Fechamento completo com 1s de isometria no pico de contração dos adutores",
        "sets": [
          {
            "id": "inferiores-b-b-ex4-s1",
            "targetReps": 12,
            "targetKg": 30,
            "actualReps": 12,
            "actualKg": 30,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex4-s2",
            "targetReps": 6,
            "targetKg": 40,
            "actualReps": 6,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex4-s3",
            "targetReps": 4,
            "targetKg": 50,
            "actualReps": 4,
            "actualKg": 50,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex4-s4",
            "targetReps": 10,
            "targetKg": 60,
            "actualReps": 10,
            "actualKg": 60,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex4-s5",
            "targetReps": 10,
            "targetKg": 70,
            "actualReps": 10,
            "actualKg": 70,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex5",
        "name": "Passada com Halteres (Afundo)",
        "category": "pernas",
        "equipment": "halter",
        "notes": "Passadas firmes com tronco estável, joelho posterior quase tocando o solo",
        "sets": [
          {
            "id": "inferiores-b-b-ex5-s1",
            "targetReps": 6,
            "targetKg": 12,
            "actualReps": 6,
            "actualKg": 12,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex5-s2",
            "targetReps": 4,
            "targetKg": 16,
            "actualReps": 4,
            "actualKg": 16,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex5-s3",
            "targetReps": 10,
            "targetKg": 20,
            "actualReps": 10,
            "actualKg": 20,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex5-s4",
            "targetReps": 10,
            "targetKg": 24,
            "actualReps": 10,
            "actualKg": 24,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex6",
        "name": "Cadeira Flexora (Complementar)",
        "category": "pernas",
        "equipment": "maquina",
        "notes": "Estímulo complementar para equilíbrio articular da cadeia posterior",
        "sets": [
          {
            "id": "inferiores-b-b-ex6-s1",
            "targetReps": 6,
            "targetKg": 30,
            "actualReps": 6,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex6-s2",
            "targetReps": 4,
            "targetKg": 40,
            "actualReps": 4,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex6-s3",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex6-s4",
            "targetReps": 10,
            "targetKg": 55,
            "actualReps": 10,
            "actualKg": 55,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "inferiores-b-b-ex7",
        "name": "Panturrilha Sentado (Gêmeos / Sóleo)",
        "category": "panturrilha",
        "equipment": "maquina",
        "notes": "Pausa de 2 segundos no ponto mais baixo de alongamento do tendão de Aquiles",
        "sets": [
          {
            "id": "inferiores-b-b-ex7-s1",
            "targetReps": 6,
            "targetKg": 20,
            "actualReps": 6,
            "actualKg": 20,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex7-s2",
            "targetReps": 4,
            "targetKg": 30,
            "actualReps": 4,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex7-s3",
            "targetReps": 10,
            "targetKg": 40,
            "actualReps": 10,
            "actualKg": 40,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "inferiores-b-b-ex7-s4",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      }
    ],
    "plan": "B"
  },
  {
    "id": "superior-b-b",
    "title": "TREINO SUPERIOR B (Plano B)",
    "subtitle": "Peito Superior, Dorsais, Deltoides, Bíceps & Tríceps",
    "tag": "Superior",
    "exercises": [
      {
        "id": "superior-b-b-ex1",
        "name": "Supino Inclinado com Halteres",
        "category": "peito",
        "equipment": "halter",
        "notes": "Banco a 30-45º. Foco na porção clavicular do peitoral, controle na descida",
        "sets": [
          {
            "id": "superior-b-b-ex1-s1",
            "targetReps": 12,
            "targetKg": 16,
            "actualReps": 12,
            "actualKg": 16,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-b-ex1-s2",
            "targetReps": 6,
            "targetKg": 22,
            "actualReps": 6,
            "actualKg": 22,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex1-s3",
            "targetReps": 4,
            "targetKg": 28,
            "actualReps": 4,
            "actualKg": 28,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex1-s4",
            "targetReps": 10,
            "targetKg": 32,
            "actualReps": 10,
            "actualKg": 32,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex1-s5",
            "targetReps": 10,
            "targetKg": 36,
            "actualReps": 10,
            "actualKg": 36,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex2",
        "name": "Puxada Alta com Pegada Aberta Pronada",
        "category": "costas",
        "equipment": "cabo",
        "notes": "Tracionar a barra no peito superior mantendo escápulas ativadas para largura dorsal",
        "sets": [
          {
            "id": "superior-b-b-ex2-s1",
            "targetReps": 12,
            "targetKg": 30,
            "actualReps": 12,
            "actualKg": 30,
            "type": "warmup",
            "completed": false
          },
          {
            "id": "superior-b-b-ex2-s2",
            "targetReps": 6,
            "targetKg": 40,
            "actualReps": 6,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex2-s3",
            "targetReps": 4,
            "targetKg": 50,
            "actualReps": 4,
            "actualKg": 50,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex2-s4",
            "targetReps": 10,
            "targetKg": 60,
            "actualReps": 10,
            "actualKg": 60,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex2-s5",
            "targetReps": 10,
            "targetKg": 65,
            "actualReps": 10,
            "actualKg": 65,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex3",
        "name": "Crucifixo / Voador Peck Deck",
        "category": "peito",
        "equipment": "maquina",
        "notes": "Pico de contração de 1s no fechamento, sem deixar os ombros projetarem para frente",
        "sets": [
          {
            "id": "superior-b-b-ex3-s1",
            "targetReps": 6,
            "targetKg": 30,
            "actualReps": 6,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex3-s2",
            "targetReps": 4,
            "targetKg": 40,
            "actualReps": 4,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex3-s3",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex3-s4",
            "targetReps": 10,
            "targetKg": 55,
            "actualReps": 10,
            "actualKg": 55,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex4",
        "name": "Remada Curvada com Barra (ou Remada Baixa)",
        "category": "costas",
        "equipment": "barra",
        "notes": "Tronco a 45º, puxada na direção do umbigo ativando romboides e grande dorsal",
        "sets": [
          {
            "id": "superior-b-b-ex4-s1",
            "targetReps": 6,
            "targetKg": 30,
            "actualReps": 6,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex4-s2",
            "targetReps": 4,
            "targetKg": 40,
            "actualReps": 4,
            "actualKg": 40,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex4-s3",
            "targetReps": 10,
            "targetKg": 50,
            "actualReps": 10,
            "actualKg": 50,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex4-s4",
            "targetReps": 10,
            "targetKg": 60,
            "actualReps": 10,
            "actualKg": 60,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex5",
        "name": "Elevação Lateral na Polia / Cabo",
        "category": "ombros",
        "equipment": "cabo",
        "notes": "Cabo posicionado na altura do punho/joelho para tensão mecânica constante",
        "sets": [
          {
            "id": "superior-b-b-ex5-s1",
            "targetReps": 6,
            "targetKg": 5,
            "actualReps": 6,
            "actualKg": 5,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex5-s2",
            "targetReps": 4,
            "targetKg": 7.5,
            "actualReps": 4,
            "actualKg": 7.5,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex5-s3",
            "targetReps": 10,
            "targetKg": 10,
            "actualReps": 10,
            "actualKg": 10,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex5-s4",
            "targetReps": 10,
            "targetKg": 12.5,
            "actualReps": 10,
            "actualKg": 12.5,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex6",
        "name": "Crucifixo Invertido no Peck Deck (Deltóide Posterior)",
        "category": "ombros",
        "equipment": "maquina",
        "notes": "Abertura com foco nos deltóides posteriores e rombóides, braços semi-estendidos",
        "sets": [
          {
            "id": "superior-b-b-ex6-s1",
            "targetReps": 6,
            "targetKg": 20,
            "actualReps": 6,
            "actualKg": 20,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex6-s2",
            "targetReps": 4,
            "targetKg": 30,
            "actualReps": 4,
            "actualKg": 30,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex6-s3",
            "targetReps": 10,
            "targetKg": 40,
            "actualReps": 10,
            "actualKg": 40,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex6-s4",
            "targetReps": 10,
            "targetKg": 45,
            "actualReps": 10,
            "actualKg": 45,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex7",
        "name": "Rosca Bíceps na Polia / Barra W",
        "category": "biceps",
        "equipment": "cabo",
        "notes": "Cotovelos firmes junto ao tronco, contração máxima no pico do movimento",
        "sets": [
          {
            "id": "superior-b-b-ex7-s1",
            "targetReps": 6,
            "targetKg": 15,
            "actualReps": 6,
            "actualKg": 15,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex7-s2",
            "targetReps": 4,
            "targetKg": 20,
            "actualReps": 4,
            "actualKg": 20,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex7-s3",
            "targetReps": 10,
            "targetKg": 25,
            "actualReps": 10,
            "actualKg": 25,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex7-s4",
            "targetReps": 10,
            "targetKg": 30,
            "actualReps": 10,
            "actualKg": 30,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      },
      {
        "id": "superior-b-b-ex8",
        "name": "Tríceps Francês / Corda na Polia",
        "category": "triceps",
        "equipment": "cabo",
        "notes": "Alongamento profundo da cabeça longa do tríceps e extensão total dos braços",
        "sets": [
          {
            "id": "superior-b-b-ex8-s1",
            "targetReps": 6,
            "targetKg": 15,
            "actualReps": 6,
            "actualKg": 15,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex8-s2",
            "targetReps": 4,
            "targetKg": 20,
            "actualReps": 4,
            "actualKg": 20,
            "type": "feeder",
            "completed": false
          },
          {
            "id": "superior-b-b-ex8-s3",
            "targetReps": 10,
            "targetKg": 25,
            "actualReps": 10,
            "actualKg": 25,
            "rir": 2,
            "type": "working",
            "completed": false
          },
          {
            "id": "superior-b-b-ex8-s4",
            "targetReps": 10,
            "targetKg": 30,
            "actualReps": 10,
            "actualKg": 30,
            "rir": 0,
            "type": "top_set",
            "completed": false
          }
        ]
      }
    ],
    "plan": "B"
  },
  {
    "id": "rest",
    "title": "DIA DE DESCANSO",
    "subtitle": "Recuperação Muscular & Repouso",
    "tag": "Off",
    "exercises": []
  }
];
