import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseConfig } from "../types";

let cachedClient: SupabaseClient | null = null;
let currentConfigKey: string = "";

export function getSupabaseConfig(): SupabaseConfig | null {
  // First check process.env variables (works both on server and client)
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  
  if (envUrl && envKey && envUrl.trim() && envKey.trim()) {
    return { url: envUrl.trim(), key: envKey.trim() };
  }
  
  // Fallback to localStorage settings in browser
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("rs_supabase_config");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.key) {
          return { url: parsed.url.trim(), key: parsed.key.trim() };
        }
      }
    } catch (err) {
      console.error("Error reading Supabase config from localStorage:", err);
    }
  }
  
  return null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) {
    cachedClient = null;
    return null;
  }
  
  const key = `${config.url}_${config.key}`;
  if (cachedClient && currentConfigKey === key) {
    return cachedClient;
  }
  
  try {
    cachedClient = createClient(config.url, config.key);
    currentConfigKey = key;
    return cachedClient;
  } catch (err) {
    console.error("Error initializing Supabase client:", err);
    return null;
  }
}

export async function checkSupabaseHealth(): Promise<"connected" | "error" | "local"> {
  const config = getSupabaseConfig();
  if (!config) return "local";

  const supabase = getSupabaseClient();
  if (!supabase) return "error";

  try {
    const { error } = await supabase
      .from("surveys")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.warn("Supabase health check returned error:", error.message);
      return "error";
    }

    return "connected";
  } catch (err) {
    console.error("Supabase health check exception:", err);
    return "error";
  }
}

