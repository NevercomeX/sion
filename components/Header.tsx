"use client";

import React from "react";
import { Plus, Database, HardDrive, User, LogOut, ShieldCheck, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  isSupabaseActive: boolean;
  userName: string;
  onNewSurvey: () => void;
  onAdminLogout: () => void;
  onOpenMobileMenu?: () => void;
}

export default function Header({
  title,
  isSupabaseActive,
  userName,
  onNewSurvey,
  onAdminLogout,
  onOpenMobileMenu,
}: HeaderProps) {
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
              <ShieldCheck className="w-3 h-3" /> <span className="max-xs:hidden">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6b7a76] max-sm:hidden">
            {isSupabaseActive ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#176b55] bg-[#edf7f3] px-2 py-0.5 rounded-full border border-[#cfe5dd]">
                <Database className="w-3.5 h-3.5" /> Supabase Central
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium bg-[#f5f7f8] px-2 py-0.5 rounded-full border border-[#dce6e2]">
                <HardDrive className="w-3.5 h-3.5" /> Modo Local
              </span>
            )}
            {userName && (
              <span className="inline-flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#176b55]" /> {userName}
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

        <button
          onClick={onAdminLogout}
          className="inline-flex items-center gap-1.5 bg-[#edf7f3] hover:bg-[#fdecea] text-[#0f513f] hover:text-[#b42318] font-semibold text-xs px-2.5 sm:px-3 py-2 rounded-xl transition-colors border border-[#cfe5dd] shrink-0"
          title="Salir del panel de administración"
        >
          <LogOut className="w-4 h-4" />
          <span className="max-sm:hidden">Salir Admin</span>
        </button>
      </div>
    </header>
  );
}
