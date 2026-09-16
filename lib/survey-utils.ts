import { HealthFactor, RiskCategory } from "./types";

export const TOPICS: string[] = [
  "Diabetes",
  "Enfermedades cardíacas",
  "Cáncer",
  "Educación financiera",
  "Comida saludable",
  "Vida familiar",
  "Conocer más de Biblia",
  "Oración",
];

export const FACTORS: HealthFactor[] = [
  {
    key: "edad",
    name: "Edad",
    type: "radio",
    opts: [
      ["10–20 años de edad", 1],
      ["21–30 años de edad", 2],
      ["31–40 años de edad", 3],
      ["41–50 años de edad", 4],
      ["Más de 50 años de edad", 6],
    ],
  },
  {
    key: "herencia",
    name: "Herencia",
    type: "radio",
    opts: [
      ["No se conocen antecedentes cardíacos hereditarios", 1],
      ["Un familiar comenzó a sufrir del corazón después de los 60 años de edad", 2],
      ["Dos familiares comenzaron a sufrir del corazón después de los 60 años de edad", 3],
      ["Un familiar comenzó a sufrir del corazón antes de cumplir 60 años de edad", 4],
      ["Dos o más familiares comenzaron a sufrir del corazón antes de los 60 años de edad", 6],
    ],
  },
  {
    key: "tabaquismo",
    name: "Tabaquismo",
    type: "radio",
    opts: [
      ["No fuma", 0],
      ["Fuma 10–14 cigarrillos por día", 2],
      ["Fuma 15–19 cigarrillos por día", 3],
      ["Fuma 20–29 cigarrillos por día", 4],
      ["Fuma más de 30 cigarrillos por día", 6],
    ],
  },
  {
    key: "colesterol",
    name: "Colesterol / grasa",
    type: "radio",
    opts: [
      ["No consume grasa de origen animal o sólida (vegetariano)", 0],
      ["Rara vez usa grasa (dieta lacto-ovo-vegetariana)", 1],
      ["A veces usa un poco de grasa de origen animal o sólida", 3],
      ["Casi todos los días usa un poco de grasa de origen animal o sólida", 4],
      ["Todos los días utiliza grasa de origen animal o sólida", 6],
    ],
  },
  {
    key: "peso",
    name: "Peso",
    type: "radio",
    opts: [
      ["Más de 2 kg por debajo del nivel señalado como peso ideal", 0],
      ["2 kg por encima del peso ideal", 1],
      ["3–9 kg de sobrepeso", 2],
      ["10–15 kg de sobrepeso", 4],
      ["Más de 16 kg encima del peso", 6],
    ],
  },
  {
    key: "ejercicio",
    name: "Ejercicio",
    type: "radio",
    opts: [
      ["Ejercicio físico intenso tanto en el trabajo como en la recreación (mucho)", 1],
      ["Ejercicio físico moderado en el trabajo y la recreación (poco)", 2],
      ["Trabajo sedentario. Recreación con ejercicio físico intenso (a veces)", 2],
      ["Trabajo sedentario. Recreación con ejercicio moderado (rara vez)", 4],
      ["Trabajo y recreación sedentarios (casi nunca)", 6],
    ],
  },
  {
    key: "enfermedad",
    name: "Enfermedad / otros factores",
    type: "checkbox",
    opts: [
      ["Es diabético", 1],
      ["Es hipertenso", 1],
      ["Tiene colesterol", 1],
      ["Está usted frecuentemente ansioso o nervioso", 1],
      ["Tiende a deprimirse fácilmente", 1],
    ],
  },
];

export const RISK_CATEGORIES: RiskCategory[] = [
  { min: 4, max: 9, label: "Mínimo riesgo", className: "risk-min" },
  { min: 10, max: 15, label: "Bajo riesgo", className: "risk-low" },
  { min: 16, max: 20, label: "Riesgo moderado", className: "risk-mod" },
  { min: 21, max: 25, label: "Alto riesgo", className: "risk-high" },
  { min: 26, max: 999, label: "Riesgo Altísimo", className: "risk-max" },
];

export function getRiskInfo(score: number): RiskCategory {
  return (
    RISK_CATEGORIES.find((r) => score >= r.min && score <= r.max) ||
    RISK_CATEGORIES[0]
  );
}

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}
