import { ActivityItem } from "../types";

const ACTIVITIES_STORAGE_KEY = "rs_v2_activities";

// Seed default activities for immediate demonstration
const SEED_ACTIVITIES: ActivityItem[] = [
  {
    id: "act_01",
    title: "Reunión Semanal de Grupo Pequeño",
    date: new Date().toISOString().slice(0, 10),
    time: "19:00",
    location: "Casa de la Familia Gómez, Sector Central",
    category: "Reunión GP",
    description: "Estudio bíblico semanal y fraternidad del Grupo Pequeño Esperanza.",
    organizer: "Carlos Mendoza",
    status: "programada",
    placeholderField1: "Valor Placeholder A",
    placeholderField2: "Configuración adicional 1",
    placeholderField3: "Notas de coordinación",
    placeholderExtraData: { customTag: "Interno", priority: "Alta" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "act_02",
    title: "Jornada Comunitaria de Salud & Esperanza",
    date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    time: "09:00",
    location: "Plaza Principal Roca de Sión",
    category: "Evangelismo",
    description: "Toma de tensión, consejos de salud de 8 remedios naturales y encuestas de bienestar.",
    organizer: "María Gómez",
    status: "programada",
    placeholderField1: "Equipo Médico & Voluntarios",
    placeholderField2: "Stand 4 - Nutrición",
    placeholderField3: "Material impreso listo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "act_03",
    title: "Culto Joven & Actividad Social",
    date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    time: "17:30",
    location: "Templo Roca de Sión",
    category: "Jóvenes",
    description: "Programa de alabanza, dinámica en equipo y ágape fraterno.",
    organizer: "Liderazgo Joven",
    status: "programada",
    placeholderField1: "Banda de Alabanza",
    placeholderField2: "Refrigerio compartido",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function initializeActivitiesStore() {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(ACTIVITIES_STORAGE_KEY)) {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(SEED_ACTIVITIES));
    }
  } catch (err) {
    console.error("Error initializing activities store:", err);
  }
}

export function fetchActivities(): ActivityItem[] {
  initializeActivitiesStore();
  if (typeof window === "undefined") return SEED_ACTIVITIES;
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_ACTIVITIES;
  } catch (err) {
    console.error("Error fetching activities:", err);
    return SEED_ACTIVITIES;
  }
}

export function saveActivityRecord(activity: ActivityItem): ActivityItem {
  const current = fetchActivities();
  const idx = current.findIndex((a) => a.id === activity.id);

  const updatedItem = {
    ...activity,
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    current[idx] = updatedItem;
  } else {
    current.unshift(updatedItem);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.error("Error saving activity:", err);
    }
  }

  return updatedItem;
}

export function deleteActivityRecord(id: string): boolean {
  const current = fetchActivities();
  const filtered = current.filter((a) => a.id !== id);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error("Error deleting activity:", err);
    }
  }
  return true;
}
