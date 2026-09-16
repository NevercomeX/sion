import { getSupabaseClient } from "../supabase/client";
import { SurveyRecord } from "../types";

const LOCAL_STORAGE_KEY = "rs_v2_records";
const COLLECTORS_STORAGE_KEY = "rs_v2_collectors";
const ADMIN_PASS_KEY = "rs_admin_password";
const ADMIN_SESSION_KEY = "rs_admin_session";

const DEFAULT_ADMIN_PASS = "admin123";

// Admin Authentication Helpers
export function getAdminPassword(): string {
  const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(ADMIN_PASS_KEY);
      if (custom && custom.trim()) return custom.trim();
    } catch (err) {
      console.error("Error reading admin password from localStorage:", err);
    }
  }
  if (envPass && envPass.trim()) {
    return envPass.trim();
  }
  return DEFAULT_ADMIN_PASS;
}

export function setAdminPassword(newPassword: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(ADMIN_PASS_KEY, newPassword.trim());
    return true;
  } catch (err) {
    return false;
  }
}

export function verifyAdminPassword(inputPass: string): boolean {
  const current = getAdminPassword();
  return inputPass.trim() === current;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch (err) {
    return false;
  }
}

export function setAdminSession(loggedIn: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (loggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.error("Error setting admin session:", err);
  }
}

export async function fetchSurveys(): Promise<SurveyRecord[]> {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Map database fields (snake_case) to SurveyRecord (camelCase)
        const mappedRecords: SurveyRecord[] = data.map((item: any) => ({
          id: item.id,
          createdAt: item.created_at || item.createdAt,
          updatedAt: item.updated_at || item.updatedAt,
          name: item.name,
          phone: item.phone || "",
          address: item.address || "",
          date: item.date || "",
          collector: item.collector || "",
          contactPref: item.contact_pref || item.contactPref || "WhatsApp",
          topics: Array.isArray(item.topics) ? item.topics : [],
          mainInterest: item.main_interest || item.mainInterest || "",
          nextAction: item.next_action || item.nextAction || "Contactar",
          nextDate: item.next_date || item.nextDate || "",
          notes: item.notes || "",
          risk: Number(item.risk) || 0,
          riskLabel: item.risk_label || item.riskLabel || "",
          answers: item.answers || {},
          status: item.status || "pendiente",
          consent: Boolean(item.consent),
          followHistory: Array.isArray(item.follow_history || item.followHistory) 
            ? (item.follow_history || item.followHistory) 
            : [],
        }));

        // Sync to local cache
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedRecords));
        }
        return mappedRecords;
      } else if (error) {
        console.warn("Supabase query error, falling back to localStorage:", error.message || error, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (err) {
      console.error("Supabase fetch exception, falling back to localStorage:", err);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }

  return [];
}

export async function saveSurveyRecord(record: SurveyRecord): Promise<SurveyRecord> {
  const supabase = getSupabaseClient();

  // Save to local storage first for resilience
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      let records: SurveyRecord[] = local ? JSON.parse(local) : [];
      const existingIdx = records.findIndex((r) => r.id === record.id);
      if (existingIdx >= 0) {
        records[existingIdx] = record;
      } else {
        records.unshift(record);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));

      // Save collector name to collectors list if not present
      if (record.collector) {
        const collectorsLocal = localStorage.getItem(COLLECTORS_STORAGE_KEY);
        let collectors: string[] = collectorsLocal ? JSON.parse(collectorsLocal) : [];
        if (!collectors.includes(record.collector)) {
          collectors.push(record.collector);
          localStorage.setItem(COLLECTORS_STORAGE_KEY, JSON.stringify(collectors));
        }
      }
    } catch (err) {
      console.error("Error writing to localStorage:", err);
    }
  }

  // Sync with Supabase if client available
  if (supabase) {
    try {
      // Ensure null is sent for empty DATE fields to prevent Postgres syntax error
      const payload = {
        id: record.id,
        created_at: record.createdAt || new Date().toISOString(),
        updated_at: record.updatedAt || new Date().toISOString(),
        name: record.name,
        phone: record.phone || null,
        address: record.address || null,
        date: record.date && record.date.trim() ? record.date : new Date().toISOString().slice(0, 10),
        collector: record.collector || null,
        contact_pref: record.contactPref || "WhatsApp",
        topics: Array.isArray(record.topics) ? record.topics : [],
        main_interest: record.mainInterest || null,
        next_action: record.nextAction || "Contactar",
        next_date: record.nextDate && record.nextDate.trim() ? record.nextDate : null,
        notes: record.notes || null,
        risk: Number(record.risk) || 0,
        risk_label: record.riskLabel || null,
        answers: record.answers || {},
        status: record.status || "pendiente",
        consent: Boolean(record.consent),
        follow_history: Array.isArray(record.followHistory) ? record.followHistory : [],
      };

      const { error } = await supabase
        .from("surveys")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error("Supabase upsert error detail:", error.message || error, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (err) {
      console.error("Supabase upsert exception:", err);
    }
  }

  return record;
}

export async function deleteSurveyRecord(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      let records: SurveyRecord[] = local ? JSON.parse(local) : [];
      records = records.filter((r) => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error("Error deleting from localStorage:", err);
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("surveys").delete().eq("id", id);
      if (error) {
        console.error("Supabase delete error:", error.message || error, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (err) {
      console.error("Supabase delete exception:", err);
    }
  }

  return true;
}

export function fetchCollectors(): string[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(COLLECTORS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error reading collectors from localStorage:", err);
    }
  }
  return [];
}
