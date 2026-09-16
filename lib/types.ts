export type ContactPreference = "WhatsApp" | "Llamada" | "Visita" | "Indistinto";

export type NextActionOption = 
  | "Contactar" 
  | "Realizar visita" 
  | "Invitar a actividad" 
  | "Ofrecer estudio bíblico" 
  | "Seguimiento de salud" 
  | "Sin acción por ahora";

export type SurveyStatus = "pendiente" | "completado";

export type UserRole = "public" | "admin";

export interface FactorAnswerOption {
  label: string;
  points: number;
}

export type FactorAnswers = Record<string, FactorAnswerOption[]>;

export interface FollowUpHistoryItem {
  date: string;
  action: string;
  status: SurveyStatus;
  note: string;
}

export interface SurveyRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  collector: string;
  contactPref: ContactPreference | string;
  topics: string[];
  mainInterest: string;
  nextAction: NextActionOption | string;
  nextDate: string;
  notes: string;
  risk: number;
  riskLabel: string;
  answers: FactorAnswers;
  status: SurveyStatus;
  consent: boolean;
  followHistory: FollowUpHistoryItem[];
}

export interface HealthFactorOption {
  label: string;
  points: number;
}

export interface HealthFactor {
  key: string;
  name: string;
  type: "radio" | "checkbox";
  opts: [string, number][];
}

export interface RiskCategory {
  min: number;
  max: number;
  label: string;
  className: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
}
