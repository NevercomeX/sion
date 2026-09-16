"use client";

import React, { useState, useEffect } from "react";
import { SurveyRecord, SurveyStatus, NextActionOption } from "../lib/types";
import { X, Save, Edit3, Trash2, HeartPulse, ShieldAlert } from "lucide-react";

interface DetailModalProps {
  record: SurveyRecord | null;
  onClose: () => void;
  onSaveDetail: (updatedRecord: SurveyRecord) => void;
  onEditSurvey: (record: SurveyRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export default function DetailModal({
  record,
  onClose,
  onSaveDetail,
  onEditSurvey,
  onDeleteRecord,
}: DetailModalProps) {
  const [status, setStatus] = useState<SurveyStatus>("pendiente");
  const [nextAction, setNextAction] = useState<NextActionOption>("Contactar");
  const [nextDate, setNextDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (record) {
      setStatus(record.status || "pendiente");
      setNextAction((record.nextAction as NextActionOption) || "Contactar");
      setNextDate(record.nextDate || "");
      setNotes(record.notes || "");
    }
  }, [record]);

  if (!record) return null;

  const handleSave = () => {
    const isStatusChanged = record.status !== status;
    const nowIso = new Date().toISOString();
    const todayStr = nowIso.slice(0, 10);

    const updatedHistory = [...(record.followHistory || [])];
    if (isStatusChanged || notes !== record.notes) {
      updatedHistory.push({
        date: todayStr,
        action: nextAction,
        status,
        note: notes,
      });
    }

    const updatedRecord: SurveyRecord = {
      ...record,
      status,
      nextAction,
      nextDate,
      notes,
      updatedAt: nowIso,
      followHistory: updatedHistory,
    };

    onSaveDetail(updatedRecord);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-[780px] w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 border border-[#dce6e2]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#dce6e2] pb-4">
          <h2 className="text-xl font-black text-[#18302a]">Detalle y seguimiento de contacto</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#f0f3f2] hover:bg-[#dce6e2] text-[#6b7a76] hover:text-[#18302a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Participant Info Grid */}
        <div className="grid grid-cols-2 gap-4 bg-[#f7faf9] p-4 rounded-xl border border-[#dce6e2] max-sm:grid-cols-1">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7a76] block">Persona</span>
            <span className="text-sm font-bold text-[#18302a]">{record.name}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7a76] block">Teléfono</span>
            <span className="text-sm font-medium text-[#18302a]">{record.phone || "—"}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7a76] block">Dirección</span>
            <span className="text-sm font-medium text-[#18302a]">{record.address || "—"}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7a76] block">Interés principal</span>
            <span className="text-sm font-bold text-[#176b55]">{record.mainInterest || "—"}</span>
          </div>
        </div>

        {/* Follow-up Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#18302a] uppercase tracking-wider">Gestión de seguimiento</h3>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SurveyStatus)}
                className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
              >
                <option value="pendiente">pendiente</option>
                <option value="completado">completado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Próxima acción</label>
              <select
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value as NextActionOption)}
                className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
              >
                <option value="Contactar">Contactar</option>
                <option value="Realizar visita">Realizar visita</option>
                <option value="Invitar a actividad">Invitar a actividad</option>
                <option value="Ofrecer estudio bíblico">Ofrecer estudio bíblico</option>
                <option value="Seguimiento de salud">Seguimiento de salud</option>
                <option value="Sin acción por ahora">Sin acción por ahora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Próxima fecha</label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1">Notas de seguimiento</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escriba aquí los comentarios de la llamada o visita..."
                className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55] resize-y"
              />
            </div>
          </div>
        </div>

        {/* Risk Badge Notice */}
        <div className="p-3.5 rounded-xl bg-[#edf7f3] border border-[#cfe5dd] text-xs text-[#0f513f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#176b55]" />
            <span>
              <b>Pronóstico cardíaco:</b> {record.riskLabel} ({record.risk} puntos)
            </span>
          </div>
          <span className="text-[11px] opacity-75">Orientativo</span>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#dce6e2]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar seguimiento</span>
            </button>

            <button
              onClick={() => onEditSurvey(record)}
              className="inline-flex items-center gap-1.5 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar encuesta</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm(`¿Eliminar el registro de ${record.name}?`)) {
                onDeleteRecord(record.id);
              }
            }}
            className="inline-flex items-center gap-1.5 bg-[#fdecea] hover:bg-[#f9beba] text-[#b42318] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
