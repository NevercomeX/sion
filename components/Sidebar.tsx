"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "../lib/types";
import {
  Home,
  PlusCircle,
  Users,
  User,
  UserPlus,
  CheckSquare,
  BarChart2,
  Database,
  Settings,
  X,
  ChevronDown,
  UserCog,
  Shield,
  ClipboardList,
  Activity,
  FilePlus,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewSurvey: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  userProfile?: UserProfile | null;
  onOpenProfile?: () => void;
}

interface NavSubItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavSubItem[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onNewSurvey,
  isOpenMobile = false,
  onCloseMobile,
  userProfile,
  onOpenProfile,
}: SidebarProps) {
  // Navigation menu structure with matched icons & smooth collapsible support
  const navMenu: NavItem[] = [
    {
      id: "home",
      label: "Inicio",
      icon: Home,
    },
    {
      id: "grupo_pequeño",
      label: "Grupo Pequeño",
      icon: Users,
      subItems: [
        { id: "person", label: "Persona", icon: User },
        { id: "follow-up", label: "Seguimiento", icon: CheckSquare },
        { id: "register", label: "Registro", icon: UserPlus },
        { id: "Activities", label: "Actividades", icon: Activity },
      ],
    },
    {
      id: "encuestas_group",
      label: "Encuestas",
      icon: ClipboardList,
      subItems: [
        { id: "survey", label: "Nueva encuesta", icon: FilePlus },
        { id: "reports", label: "Reportes", icon: BarChart2 },
        { id: "contacts", label: "Personas", icon: Users },
        { id: "follow", label: "Seguimiento", icon: CheckSquare },
        { id: "backup", label: "Copias / datos", icon: Database },
      ],
    },
    {
      id: "settings",
      label: "Ajustes",
      icon: Settings,
    },
  ];

  // State to track open/collapsed state for each submenu independently
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    encuestas_group: true,
    grupo_pequeño: true,
  });

  // Automatically expand a group if activeTab is inside it
  useEffect(() => {
    navMenu.forEach((group) => {
      if (group.subItems?.some((sub) => sub.id === activeTab)) {
        setOpenSubmenus((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [activeTab]);

  const toggleSubmenu = (groupId: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleNavClick = (id: string) => {
    if (id === "survey") {
      onNewSurvey();
    } else {
      setActiveTab(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  // Flattened list for mobile bottom navigation bar
  const allFlatItems = navMenu.flatMap((item) =>
    item.subItems ? item.subItems : [{ id: item.id, label: item.label, icon: item.icon }]
  );

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

          {/* Navigation Items (Smooth Multi-Submenu Support) */}
          <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
            {navMenu.map((group) => {
              const Icon = group.icon;
              const hasSubItems = Boolean(group.subItems && group.subItems.length > 0);
              const isGroupActive = group.subItems?.some((sub) => sub.id === activeTab);
              const isOpen = openSubmenus[group.id] ?? false;

              // Standalone Item without submenus
              if (!hasSubItems) {
                const isActive = activeTab === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => handleNavClick(group.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#0f513f] shadow-md font-bold scale-[1.01]"
                        : "text-[#eaf6f1] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{group.label}</span>
                  </button>
                );
              }

              // Menu Category with Submenu
              return (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs uppercase tracking-wider font-bold transition-all duration-200 ${
                      isGroupActive
                        ? "text-white bg-white/15 font-extrabold"
                        : "text-[#c2e4d8] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 opacity-90 shrink-0" />
                      <span className="truncate">{group.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 opacity-80 transition-transform duration-300 ease-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Smooth Accordion Container */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-1"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden ml-3 pl-3 border-l-2 border-white/25 space-y-1 py-0.5">
                      {group.subItems?.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs sm:text-sm font-medium transition-all duration-200 ${
                              isSubActive
                                ? "bg-white text-[#0f513f] shadow-sm font-bold translate-x-1"
                                : "text-[#eaf6f1] hover:bg-white/10 hover:text-white hover:translate-x-1"
                            }`}
                          >
                            <SubIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logged In User Pill */}
        <div className="space-y-3 pt-3 border-t border-white/15">
          {userProfile && (
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left group"
              title="Mi Perfil"
            >
              <div
                className="w-8 h-8 rounded-lg text-white grid place-items-center font-bold text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: userProfile.avatarColor || "#0f513f" }}
              >
                {userProfile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate group-hover:underline">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-[#c2e4d8] font-medium truncate flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span>{userProfile.role.toUpperCase()}</span>
                </div>
              </div>
              <UserCog className="w-4 h-4 text-[#c2e4d8] opacity-75 shrink-0" />
            </button>
          )}

          <div className="text-[10px] opacity-75 px-1 leading-relaxed font-medium">
            IASD · Roca de Sión
            <br />
            Uso congregacional v2.0
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for quick access */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#dce6e2] z-30 flex items-center justify-around py-2 px-1 shadow-lg">
        {allFlatItems.slice(0, 5).map((item) => {
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

