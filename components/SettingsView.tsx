"use client";

import React, { useState, useEffect } from "react";
import { getSupabaseConfig } from "../lib/supabase/client";
import { setAdminPassword, getAdminPassword } from "../lib/services/survey-service";
import { createClient } from "@supabase/supabase-js";
import { Database, CheckCircle2, AlertCircle, HardDrive, User, Key, Globe, Lock, ShieldCheck } from "lucide-react";

interface SettingsViewProps {
  collectors: string[];
  onConfigUpdated: () => void;
}

export default function SettingsView({ collectors, onConfigUpdated }: SettingsViewProps) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "warning" | "error" } | null>(null);

  // Admin password change state
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const config = getSupabaseConfig();
    if (config) {
      setUrl(config.url);
      setKey(config.key);
    }
  }, []);

  const handleSaveConfig = () => {
    if (!url.trim() || !key.trim()) {
      setMsg({ text: "Debe introducir la URL del proyecto y la clave anon.", type: "warning" });
      return;
    }

    try {
      const cfg = { url: url.trim(), key: key.trim() };
      localStorage.setItem("rs_supabase_config", JSON.stringify(cfg));
      setMsg({
        text: "Configuración guardada correctamente. La base de datos central de Supabase está activa.",
        type: "success",
      });
      onConfigUpdated();
    } catch (err) {
      setMsg({ text: "Error al guardar la configuración local.", type: "error" });
    }
  };

  const handleTestConnection = async () => {
    if (!url.trim() || !key.trim()) {
      setMsg({ text: "Faltan la URL del proyecto y la clave pública (anon).", type: "warning" });
      return;
    }

    try {
      const tempClient = createClient(url.trim(), key.trim());
      const { data, error } = await tempClient.from("surveys").select("count", { count: "exact", head: true });

      if (error) {
        setMsg({
          text: `Error conectando con Supabase: ${error.message}. Verifique la URL, clave y aplique el archivo schema.sql en Supabase.`,
          type: "error",
        });
      } else {
        setMsg({
          text: "¡Conexión exitosa a Supabase! La tabla de encuestas está accesible.",
          type: "success",
        });
      }
    } catch (err: any) {
      setMsg({
        text: `Error inesperado probando conexión: ${err?.message || "Desconocido"}`,
        type: "error",
      });
    }
  };

  const handleLocalMode = () => {
    localStorage.removeItem("rs_supabase_config");
    setUrl("");
    setKey("");
    setMsg({ text: "La aplicación ha quedado configurada en modo local (LocalStorage).", type: "success" });
    onConfigUpdated();
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) {
      setPassMsg({ text: "Por favor escriba la nueva contraseña.", type: "error" });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg({ text: "Las contraseñas no coinciden.", type: "error" });
      return;
    }

    const success = setAdminPassword(newPass.trim());
    if (success) {
      setPassMsg({ text: "Contraseña de administrador actualizada correctamente.", type: "success" });
      setNewPass("");
      setConfirmPass("");
    } else {
      setPassMsg({ text: "No se pudo actualizar la contraseña.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Security Settings */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#176b55]" />
          <h2 className="text-lg font-bold text-[#18302a]">Seguridad y Acceso Administrador</h2>
        </div>
        <p className="text-xs text-[#6b7a76]">
          Cambie la clave necesaria para ingresar al panel de administración (Clave actual por defecto: <b>admin123</b>).
        </p>

        <form onSubmit={handleChangeAdminPassword} className="space-y-3">
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Nueva clave admin"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repetir nueva clave"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>
          </div>

          {passMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                passMsg.type === "success"
                  ? "bg-[#e8f6ef] border-[#a3e0c4] text-[#176b55]"
                  : "bg-[#fdecea] border-[#f9beba] text-[#b42318]"
              }`}
            >
              {passMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs"
          >
            Actualizar Clave Admin
          </button>
        </form>
      </div>

      {/* Supabase Config Card */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#176b55]" />
          <h2 className="text-lg font-bold text-[#18302a]">Configuración de la base central (Supabase)</h2>
        </div>
        <p className="text-xs text-[#6b7a76]">
          La aplicación funciona en modo local por defecto. Para sincronizar con una base de datos central en la nube, introduzca las credenciales de su proyecto de Supabase.
        </p>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">
              URL del proyecto Supabase
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxx.supabase.co"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">
              Clave pública (anon key)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {msg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
              msg.type === "success"
                ? "bg-[#e8f6ef] border-[#a3e0c4] text-[#176b55]"
                : msg.type === "warning"
                ? "bg-[#fff5db] border-[#f0d59a] text-[#8a5200]"
                : "bg-[#fdecea] border-[#f9beba] text-[#b42318]"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            onClick={handleSaveConfig}
            className="bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs"
          >
            Guardar configuración
          </button>

          <button
            onClick={handleTestConnection}
            className="bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            Probar conexión
          </button>

          <button
            onClick={handleLocalMode}
            className="inline-flex items-center gap-1.5 bg-[#fdecea] hover:bg-[#f9beba] text-[#b42318] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Usar modo local</span>
          </button>
        </div>
      </div>

      {/* Collectors List */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#176b55]" />
          <h2 className="text-lg font-bold text-[#18302a]">Catálogo de encuestadores registrados</h2>
        </div>
        <p className="text-xs text-[#6b7a76]">
          Los nombres de encuestadores se registran automáticamente al guardar formularios.
        </p>

        {collectors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {collectors.map((c) => (
              <span
                key={c}
                className="px-3 py-1 bg-[#edf3f1] text-[#0f513f] text-xs font-bold rounded-full border border-[#cfe5dd]"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#6b7a76] italic">
            Los nombres usados como encuestadores aparecerán aquí al guardar registros.
          </div>
        )}
      </div>
    </div>
  );
}
