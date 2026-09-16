"use client";

import React from "react";
import { SurveyRecord } from "../lib/types";
import { Calendar, User, ArrowRight } from "lucide-react";

interface FollowUpPanelProps {
  records: SurveyRecord[];
  onOpenDetail: (id: string) => void;
}

export default function FollowUpPanel({ records, onOpenDetail }: FollowUpPanelProps) {
  const sortedRecords = [...records].sort((a, b) =>
    (a.nextDate || "9999").localeCompare(b.nextDate || "9999")
  );

  return (
    <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#18302a]">Panel de seguimiento</h2>
        <p className="text-xs text-[#6b7a76]">Actualice cada contacto después de una llamada, visita o estudio.</p>
      </div>

      {sortedRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f5f8f7] text-[#6b7a76] border-b border-[#dce6e2]">
                <th className="p-3 font-bold">Próximo contacto</th>
                <th className="p-3 font-bold">Persona</th>
                <th className="p-3 font-bold">Acción</th>
                <th className="p-3 font-bold">Interés principal</th>
                <th className="p-3 font-bold">Encargado</th>
                <th className="p-3 font-bold">Estado</th>
                <th className="p-3 font-bold text-right">Gestionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce6e2]">
              {sortedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3 whitespace-nowrap font-bold text-[#176b55]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{r.nextDate || "Sin fecha"}</span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <b className="block text-[#18302a]">{r.name}</b>
                    <span className="text-[11px] text-[#6b7a76]">{r.phone || "Sin tel."}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-[#18302a]">{r.nextAction}</td>
                  <td className="p-3 whitespace-nowrap text-[#18302a]">{r.mainInterest || "—"}</td>
                  <td className="p-3 whitespace-nowrap text-[#6b7a76] font-medium">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{r.collector || "—"}</span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        r.status === "pendiente"
                          ? "bg-[#fff5db] text-[#8a5200]"
                          : "bg-[#e8f6ef] text-[#176b55]"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenDetail(r.id)}
                      className="inline-flex items-center gap-1 bg-[#edf7f3] hover:bg-[#176b55] hover:text-white text-[#0f513f] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Gestionar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#6b7a76]">Sin registros todavía.</div>
      )}
    </div>
  );
}
