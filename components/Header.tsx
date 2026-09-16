"use client";

import React from "react";
import { Plus, Database, HardDrive, User, LogOut, ShieldCheck } from "lucide-react";

interface HeaderProps {
  title: string;
  isSupabaseActive: boolean;
  userName: string;
  onNewSurvey: () => void;
  onAdminLogout: () => void;
}

export default function Header({
  title,
  isSupabaseActive,
  userName,
  onNewSurvey,
  onAdminLogout,
}: HeaderProps) {
  return (
    <header className="h-[70px] bg-white border-b border-[#dce6e2] flex items-center justify-between px-7 sticky top-0 z-10 shadow-xs max-sm:px-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#18302a] max-sm:text-lg">{title}</h1>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold bg-[#0f513f] text-white px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 max-sm:hidden">
          {isSupabaseActive ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#176b55] font-semibold bg-[#edf7f3] px-2 py-0.5 rounded-full border border-[#cfe5dd]">
              <Database className="w-3.5 h-3.5" /> Supabase Central
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6b7a76] font-medium bg-[#f5f7f8] px-2 py-0.5 rounded-full border border-[#dce6e2]">
              <HardDrive className="w-3.5 h-3.5" /> Modo Local
            </span>
          )}
          {userName && (
            <span className="inline-flex items-center gap-1 text-xs text-[#6b7a76]">
              <User className="w-3.5 h-3.5 text-[#176b55]" /> {userName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewSurvey}
          className="inline-flex items-center gap-1.5 bg-[#176b55] hover:bg-[#0f513f] text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="max-sm:hidden">Nueva encuesta</span>
        </button>

        <button
          onClick={onAdminLogout}
          className="inline-flex items-center gap-1.5 bg-[#edf7f3] hover:bg-[#fdecea] text-[#0f513f] hover:text-[#b42318] font-semibold text-xs px-3 py-2 rounded-xl transition-colors border border-[#cfe5dd]"
          title="Salir del panel de administración"
        >
          <LogOut className="w-4 h-4" />
          <span className="max-sm:hidden">Salir Admin</span>
        </button>
      </div>
    </header>
  );
}
