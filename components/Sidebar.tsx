"use client";

import React from "react";
import { 
  Home, 
  PlusCircle, 
  Users, 
  CheckSquare, 
  BarChart2, 
  Database, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewSurvey: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onNewSurvey }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "survey", label: "Nueva encuesta", icon: PlusCircle },
    { id: "contacts", label: "Personas", icon: Users },
    { id: "follow", label: "Seguimiento", icon: CheckSquare },
    { id: "reports", label: "Reportes", icon: BarChart2 },
    { id: "backup", label: "Copias / datos", icon: Database },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <aside className="w-[245px] bg-gradient-to-b from-[#0f513f] to-[#176b55] text-white p-5 fixed inset-y-0 left-0 z-20 flex flex-col justify-between max-md:w-[70px] max-md:p-3 transition-all duration-300 shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1 mb-6 max-md:justify-center">
          <div className="w-[43px] h-[43px] rounded-xl bg-white text-[#0f513f] grid place-items-center font-black text-xl shadow-md shrink-0">
            RS
          </div>
          <div className="max-md:hidden">
            <b className="block text-[15px] font-bold leading-tight">Roca de Sión</b>
            <span className="block text-[11px] opacity-80 mt-0.5 font-medium">Conectando Vidas</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="grid gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "survey") {
                    onNewSurvey();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 max-md:justify-center ${
                  isActive
                    ? "bg-white text-[#0f513f] shadow-md font-bold"
                    : "text-[#eaf6f1] hover:bg-white/10 hover:text-white"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="max-md:hidden truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="text-[11px] opacity-70 max-md:hidden px-2 leading-snug font-medium">
        IASD · Roca de Sión
        <br />
        Uso congregacional v2.0
      </div>
    </aside>
  );
}
