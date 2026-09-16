"use client";

import React, { useState, useEffect } from "react";
import { SurveyRecord, UserRole } from "../lib/types";
import {
  fetchSurveys,
  saveSurveyRecord,
  deleteSurveyRecord,
  fetchCollectors,
  isAdminLoggedIn,
  setAdminSession,
} from "../lib/services/survey-service";
import { getSupabaseConfig } from "../lib/supabase/client";

import PublicSurveyView from "../components/PublicSurveyView";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import HomeDashboard from "../components/HomeDashboard";
import SurveyForm from "../components/SurveyForm";
import ContactsTable from "../components/ContactsTable";
import FollowUpPanel from "../components/FollowUpPanel";
import ReportsView from "../components/ReportsView";
import SettingsView from "../components/SettingsView";
import BackupView from "../components/BackupView";
import DetailModal from "../components/DetailModal";

export default function Home() {
  const [role, setRole] = useState<UserRole>("public");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [records, setRecords] = useState<SurveyRecord[]>([]);
  const [collectors, setCollectors] = useState<string[]>([]);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);

  const [editingRecord, setEditingRecord] = useState<SurveyRecord | null>(null);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);

  // Check login & Supabase config on mount
  useEffect(() => {
    if (isAdminLoggedIn()) {
      setRole("admin");
    }
    checkSupabaseConfig();
    loadData();
  }, []);

  const checkSupabaseConfig = () => {
    const cfg = getSupabaseConfig();
    setIsSupabaseActive(Boolean(cfg));
  };

  const loadData = async () => {
    const data = await fetchSurveys();
    setRecords(data);
    const cols = fetchCollectors();
    setCollectors(cols);
  };

  const handleAdminLoginSuccess = () => {
    setAdminSession(true);
    setRole("admin");
    setActiveTab("home");
    loadData();
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setRole("public");
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
    if (role === "admin") {
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
    settings: "Configuración",
  };

  // 1. PUBLIC USER VIEW: Shared link view for regular respondents
  if (role === "public") {
    return (
      <PublicSurveyView
        onSaveSurvey={handleSaveSurvey}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />
    );
  }

  // 2. ADMIN VIEW: Full Control Panel
  const selectedRecord = records.find((r) => r.id === detailModalId) || null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewSurvey={handleNewSurveyTrigger}
      />

      {/* Main Content Area */}
      <div className="ml-[245px] w-[calc(100%-245px)] max-md:ml-[70px] max-md:w-[calc(100%-70px)] flex flex-col min-h-screen transition-all duration-300">
        <Header
          title={titleMap[activeTab] || "Roca de Sión"}
          isSupabaseActive={isSupabaseActive}
          userName="Administrador"
          onNewSurvey={handleNewSurveyTrigger}
          onAdminLogout={handleAdminLogout}
        />

        <main className="p-6 max-w-[1400px] w-full mx-auto flex-1">
          {activeTab === "home" && (
            <HomeDashboard
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
            />
          )}

          {activeTab === "survey" && (
            <SurveyForm
              currentCollector="Administrador"
              editingRecord={editingRecord}
              onSave={handleSaveSurvey}
              onClear={() => setEditingRecord(null)}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsTable
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === "follow" && (
            <FollowUpPanel
              records={records}
              onOpenDetail={(id) => setDetailModalId(id)}
            />
          )}

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
