"use client";

import React, { useState, useEffect } from "react";
import { SurveyRecord, UserProfile } from "../lib/types";
import {
  fetchSurveys,
  saveSurveyRecord,
  deleteSurveyRecord,
  fetchCollectors,
} from "../lib/services/survey-service";
import { getLoggedInUser, logoutUser } from "../lib/services/auth-service";
import { getSupabaseConfig, checkSupabaseHealth } from "../lib/supabase/client";

import PublicSurveyView from "../components/PublicSurveyView";
import LoginScreen from "../components/LoginScreen";
import UserProfileModal from "../components/UserProfileModal";
import Sidebar from "../components/Sidebar";
import Header, { SupabaseStatus } from "../components/Header";
import HomeDashboard from "../components/HomeDashboard";
import SurveyForm from "../components/SurveyForm";
import ContactsTable from "../components/ContactsTable";
import FollowUpPanel from "../components/FollowUpPanel";
import ReportsView from "../components/ReportsView";
import SettingsView from "../components/SettingsView";
import BackupView from "../components/BackupView";
import ActivitiesView from "../components/ActivitiesView";
import DetailModal from "../components/DetailModal";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [records, setRecords] = useState<SurveyRecord[]>([]);
  const [collectors, setCollectors] = useState<string[]>([]);

  // Supabase Connection & Health State
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>("checking");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [editingRecord, setEditingRecord] = useState<SurveyRecord | null>(null);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);

  // Invite code query parameter state (e.g. ?invite=RS_INVITE_2026)
  const [inviteCodeFromUrl, setInviteCodeFromUrl] = useState<string>("");

  useEffect(() => {
    // 1. Check URL query string for authorized invite links
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inviteParam = params.get("invite");
      if (inviteParam) {
        setInviteCodeFromUrl(inviteParam.trim().toUpperCase());
      }
    }

    // 2. Check logged-in user session
    const active = getLoggedInUser();
    if (active) {
      setCurrentUser(active);
    }

    checkSupabaseConfig();
    loadData();
  }, []);

  const checkSupabaseConfig = async () => {
    const cfg = getSupabaseConfig();
    if (!cfg) {
      setIsSupabaseActive(false);
      setSupabaseStatus("local");
      return;
    }

    setIsSupabaseActive(true);
    setSupabaseStatus("checking");

    try {
      const health = await checkSupabaseHealth();
      setSupabaseStatus(health);
    } catch (err) {
      setSupabaseStatus("error");
    }
  };

  const loadData = async () => {
    const data = await fetchSurveys();
    setRecords(data);
    const cols = fetchCollectors();
    setCollectors(cols);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab("home");
    loadData();
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setEditingRecord(null);
  };

  // New survey trigger from header
  const handleNewSurveyTrigger = () => {
    setEditingRecord(null);
    setActiveTab("survey");
  };

  // Save survey record
  const handleSaveSurvey = async (record: SurveyRecord) => {
    await saveSurveyRecord(record);
    await loadData();
    if (currentUser) {
      setEditingRecord(null);
      setActiveTab("contacts");
    }
  };

  // Save detail updates (from modal)
  const handleSaveDetail = async (updatedRecord: SurveyRecord) => {
    await saveSurveyRecord(updatedRecord);
    await loadData();
    setDetailModalId(null);
  };

  // Edit survey trigger from modal
  const handleEditSurveyFromModal = (record: SurveyRecord) => {
    setEditingRecord(record);
    setDetailModalId(null);
    setActiveTab("survey");
  };

  // Delete survey
  const handleDeleteSurvey = async (id: string) => {
    await deleteSurveyRecord(id);
    await loadData();
    setDetailModalId(null);
  };

  // Import JSON records
  const handleImportRecords = async (newRecords: SurveyRecord[], newCollectors: string[]) => {
    for (const r of newRecords) {
      await saveSurveyRecord(r);
    }
    await loadData();
  };

  // CSV Download utility
  const handleExportCsv = () => {
    if (records.length === 0) {
      alert("No hay registros para exportar.");
      return;
    }

    const headers = [
      "Fecha",
      "Nombre",
      "Teléfono",
      "Dirección",
      "Encuestador",
      "Preferencia",
      "Temas",
      "Interés principal",
      "Próxima acción",
      "Próxima fecha",
      "Estado",
      "Puntos",
      "Pronóstico",
      "Notas",
    ];

    const rows = records.map((r) => [
      r.date,
      r.name,
      r.phone,
      r.address,
      r.collector,
      r.contactPref,
      r.topics.join(" | "),
      r.mainInterest,
      r.nextAction,
      r.nextDate,
      r.status,
      r.risk,
      r.riskLabel,
      r.notes,
    ]);

    const csvContent = [
      headers.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
      ...rows.map((row) => row.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roca_de_sion_contactos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Titles mapping
  const titleMap: Record<string, string> = {
    home: "Inicio",
    survey: editingRecord ? "Editar encuesta" : "Nueva encuesta",
    contacts: "Personas",
    follow: "Seguimiento",
    reports: "Reportes",
    backup: "Copias / datos",
    settings: "Configuración y Usuarios",
    person: "Personas",
    "follow-up": "Seguimiento",
    register: "Registro",
    Activities: "Calendario de Actividades",
  };

  // 1. UNAUTHENTICATED / LOGIN VIEW: Show LoginPortal with quick login & invite link registration
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        initialInviteCode={inviteCodeFromUrl}
      />
    );
  }

  // 2. AUTHENTICATED USER CONTROL PANEL
  const selectedRecord = records.find((r) => r.id === detailModalId) || null;

  return (
    <div className="flex min-h-screen bg-[#f5f7f8]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewSurvey={handleNewSurveyTrigger}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        userProfile={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="md:ml-[250px] w-full md:w-[calc(100%-250px)] flex flex-col min-h-screen transition-all duration-300 pb-16 md:pb-0">
        <Header
          title={titleMap[activeTab] || "Roca de Sión"}
          isSupabaseActive={isSupabaseActive}
          supabaseStatus={supabaseStatus}
          userProfile={currentUser}
          userName={currentUser.name}
          onNewSurvey={handleNewSurveyTrigger}
          onAdminLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 max-w-[1400px] w-full mx-auto flex-1">
          {activeTab === "home" && (
            <HomeDashboard
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
            />
          )}

          {activeTab === "survey" && (
            <SurveyForm
              currentCollector={currentUser.name}
              editingRecord={editingRecord}
              onSave={handleSaveSurvey}
              onClear={() => setEditingRecord(null)}
            />
          )}

          {(activeTab === "contacts" || activeTab === "person" || activeTab === "register") && (
            <ContactsTable
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
              onExportCsv={handleExportCsv}
            />
          )}

          {(activeTab === "follow" || activeTab === "follow-up") && (
            <FollowUpPanel
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
            />
          )}

          {activeTab === "Activities" && <ActivitiesView />}

          {activeTab === "reports" && <ReportsView records={records} />}

          {activeTab === "backup" && (
            <BackupView
              records={records}
              collectors={collectors}
              onImportRecords={handleImportRecords}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              collectors={collectors}
              onConfigUpdated={() => {
                checkSupabaseConfig();
                loadData();
              }}
            />
          )}
        </main>
      </div>

      {/* User Profile Modal */}
      {isProfileModalOpen && currentUser && (
        <UserProfileModal
          user={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* Detail Modal */}
      {detailModalId && (
        <DetailModal
          record={selectedRecord}
          onClose={() => setDetailModalId(null)}
          onSaveDetail={handleSaveDetail}
          onEditSurvey={handleEditSurveyFromModal}
          onDeleteRecord={handleDeleteSurvey}
        />
      )}
    </div>
  );
}
