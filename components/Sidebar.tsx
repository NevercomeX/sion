"use client";

import React from "react";
import { 
  Home, 
  PlusCircle, 
  Users, 
  CheckSquare, 
  BarChart2, 
  Database, 
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewSurvey: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onNewSurvey,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const navItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "survey", label: "Nueva encuesta", icon: PlusCircle },
    { id: "contacts", label: "Personas", icon: Users },
    { id: "follow", label: "Seguimiento", icon: CheckSquare },
    { id: "reports", label: "Reportes", icon: BarChart2 },
    { id: "backup", label: "Copias / datos", icon: Database },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    if (id === "survey") {
      onNewSurvey();
    } else {
      setActiveTab(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar (Desktop fixed left & Mobile slide-over drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-gradient-to-b from-[#0f513f] to-[#176b55] text-white p-5 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          isOpenMobile ? "translate-x-0" : "max-md:-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0f513f] grid place-items-center font-black text-lg shadow-md shrink-0">
                RS
              </div>
              <div>
                <b className="block text-[15px] font-bold leading-tight">Roca de Sión</b>
                <span className="block text-[11px] opacity-80 font-medium">Conectando Vidas</span>
              </div>
            </div>

            {/* Close Button on Mobile */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#0f513f] shadow-md font-bold scale-[1.01]"
                      : "text-[#eaf6f1] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="text-[11px] opacity-75 px-1 leading-relaxed font-medium pt-4 border-t border-white/10">
          IASD · Roca de Sión
          <br />
          Uso congregacional v2.0
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for quick access */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#dce6e2] z-30 flex items-center justify-around py-2 px-1 shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? "text-[#176b55]" : "text-[#6b7a76]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
              <span className="truncate max-w-[55px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
