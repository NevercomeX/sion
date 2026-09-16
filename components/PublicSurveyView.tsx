"use client";

import React, { useState } from "react";
import { SurveyRecord } from "../lib/types";
import SurveyForm from "./SurveyForm";
import AdminLoginModal from "./AdminLoginModal";
import { Lock, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";

interface PublicSurveyViewProps {
  onSaveSurvey: (record: SurveyRecord) => Promise<void>;
  onAdminLoginSuccess: () => void;
}

export default function PublicSurveyView({
  onSaveSurvey,
  onAdminLoginSuccess,
}: PublicSurveyViewProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSave = async (record: SurveyRecord) => {
    await onSaveSurvey(record);
    setSubmittedSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex flex-col">
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-[#0f513f] to-[#176b55] text-white py-6 px-6 shadow-md sticky top-0 z-30">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#0f513f] grid place-items-center font-black text-2xl shadow-md shrink-0">
              RS
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-snug">Roca de Sión</h1>
              <p className="text-xs opacity-90 font-medium">Conectando Vidas · Formulario de Registro</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-white/20 transition-all backdrop-blur-xs"
            title="Acceso restringido para administradores"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="max-sm:hidden">Acceso Administrador</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[900px] w-full mx-auto p-6 max-sm:p-4">
        {submittedSuccess ? (
          <div className="bg-white border border-[#cfe5dd] rounded-3xl p-8 shadow-xl text-center space-y-5 my-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#e8f6ef] text-[#176b55] grid place-items-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#18302a]">¡Encuesta Registrada Exitosamente!</h2>
              <p className="text-sm text-[#6b7a76] mt-2 max-w-[500px] mx-auto leading-relaxed">
                Gracias por completar la información. Los datos han sido guardados con seguridad para el seguimiento y actividades de la congregación.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                Registrar otra encuesta
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs flex items-center gap-3 text-xs text-[#0f513f]">
              <ShieldCheck className="w-5 h-5 text-[#176b55] shrink-0" />
              <span>
                <b>Formulario Seguro:</b> Los datos colectados están protegidos y se utilizarán únicamente con fines de contacto congregacional y bienestar de salud.
              </span>
            </div>

            <SurveyForm
              currentCollector=""
              editingRecord={null}
              onSave={handleSave}
              onClear={() => {}}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#6b7a76] border-t border-[#dce6e2] bg-white mt-8">
        IASD · Roca de Sión · Conectando Vidas &copy; {new Date().getFullYear()}
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminModalOpen(false);
          onAdminLoginSuccess();
        }}
      />
    </div>
  );
}
