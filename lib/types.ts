export type ContactPreference = "WhatsApp" | "Llamada" | "Visita" | "Indistinto";

export type NextActionOption = 
  | "Contactar" 
  | "Realizar visita" 
  | "Invitar a actividad" 
  | "Ofrecer estudio bíblico" 
  | "Seguimiento de salud" 
  | "Sin acción por ahora";

export type SurveyStatus = "pendiente" | "completado";

export type UserRole = "public" | "admin" | "leader" | "member" | "collector";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "active" | "inactive";
  assignedGroup?: string;
  avatarColor?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface InviteToken {
  code: string;
  role: UserRole;
  assignedGroup?: string;
  createdByName?: string;
  createdAt: string;
  active: boolean;
  usedCount: number;
}

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

export type ActivityStatus = "programada" | "en_curso" | "completada" | "cancelada";

export interface ActivityItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  category?: string;
  description?: string;
  organizer?: string;
  status: ActivityStatus;
  
  // Extensible Placeholders for future expansion
  placeholderField1?: string;
  placeholderField2?: string;
  placeholderField3?: string;
  placeholderExtraData?: Record<string, any>;

  createdAt: string;
  updatedAt: string;
}

