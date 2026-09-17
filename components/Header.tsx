"use client";

import React from "react";
import { UserProfile } from "../lib/types";
import { Plus, Database, HardDrive, User, LogOut, ShieldCheck, Menu, UserCog, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";

export type SupabaseStatus = "connected" | "error" | "local" | "checking";

interface HeaderProps {
  title: string;
  isSupabaseActive?: boolean;
  supabaseStatus?: SupabaseStatus;
  userProfile?: UserProfile | null;
  userName?: string;
  onNewSurvey: () => void;
  onAdminLogout: () => void;
  onOpenProfile?: () => void;
  onOpenMobileMenu?: () => void;
}

export default function Header({
  title,
  isSupabaseActive = false,
  supabaseStatus = "local",
  userProfile,
  userName = "Usuario",
  onNewSurvey,
  onAdminLogout,
  onOpenProfile,
  onOpenMobileMenu,
}: HeaderProps) {
  const displayName = userProfile?.name || userName;
  const roleLabel = userProfile?.role === "admin" ? "Admin" : userProfile?.role === "leader" ? "Líder GP" : "Encuestador";
  const avatarBg = userProfile?.avatarColor || "#0f513f";

  const effectiveStatus: SupabaseStatus = isSupabaseActive
    ? supabaseStatus === "local"
      ? "connected"
      : supabaseStatus
    : "local";

  return (
    <header className="h-[65px] sm:h-[70px] bg-white border-b border-[#dce6e2] flex items-center justify-between px-4 sm:px-7 sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-[#edf7f3] text-[#0f513f] hover:bg-[#dce6e2] transition-colors"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#18302a] leading-tight truncate">{title}</h1>
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold bg-[#0f513f] text-white px-2 py-0.5 rounded-md shrink-0">
              <ShieldCheck className="w-3 h-3" /> <span className="max-xs:hidden">{roleLabel}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6b7a76] max-sm:hidden">
            {/* Supabase Dynamic Connection Health Badge */}
            {effectiveStatus === "connected" && (
              <span
                className="inline-flex items-center gap-1.5 font-bold text-[#0f513f] bg-[#eaf6f1] px-2.5 py-0.5 rounded-full border border-[#a3d9c9] text-xs shadow-2xs"
                title="Conexión activa a Supabase Cloud"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Database className="w-3.5 h-3.5 text-[#176b55]" />
                <span>Supabase Conectado</span>
              </span>
            )}

            {effectiveStatus === "error" && (
              <span
                className="inline-flex items-center gap-1.5 font-bold text-[#b42318] bg-[#fdecea] px-2.5 py-0.5 rounded-full border border-[#f9beba] text-xs shadow-2xs"
                title="Error de conexión con la base central Supabase"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <AlertCircle className="w-3.5 h-3.5 text-[#b42318]" />
                <span>Supabase Error</span>
              </span>
            )}

            {effectiveStatus === "checking" && (
              <span
                className="inline-flex items-center gap-1.5 font-medium text-[#8a5200] bg-[#fff5db] px-2.5 py-0.5 rounded-full border border-[#f0d59a] text-xs"
                title="Comprobando estado de conexión..."
              >
                <RefreshCw className="w-3 h-3 animate-spin text-[#a15c00]" />
                <span>Verificando Supabase...</span>
              </span>
            )}

            {effectiveStatus === "local" && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#6b7a76] bg-[#f5f7f8] px-2.5 py-0.5 rounded-full border border-[#dce6e2] text-xs">
                <HardDrive className="w-3.5 h-3.5 text-[#6b7a76]" />
                <span>Modo Local</span>
              </span>
            )}

            {displayName && (
              <span className="inline-flex items-center gap-1 font-medium text-[#18302a]">
                <User className="w-3.5 h-3.5 text-[#176b55]" /> {displayName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNewSurvey}
          className="inline-flex items-center gap-1.5 bg-[#176b55] hover:bg-[#0f513f] text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="max-xs:hidden">Encuesta</span>
        </button>

        {onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs rounded-xl border border-[#cfe5dd] transition-colors shrink-0"
            title="Ver / Editar Mi Perfil"
          >
            <div
              className="w-6 h-6 rounded-lg text-white grid place-items-center font-bold text-[10px] shrink-0"
              style={{ backgroundColor: avatarBg }}
            >
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <span className="max-md:hidden">{displayName.split(" ")[0]}</span>
            <UserCog className="w-4 h-4 max-sm:hidden opacity-75" />
          </button>
        )}

        <button
          onClick={onAdminLogout}
          className="inline-flex items-center gap-1.5 bg-[#edf7f3] hover:bg-[#fdecea] text-[#0f513f] hover:text-[#b42318] font-semibold text-xs px-2.5 sm:px-3 py-2 rounded-xl transition-colors border border-[#cfe5dd] shrink-0"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="max-sm:hidden">Salir</span>
        </button>
      </div>
    </header>
  );
}
