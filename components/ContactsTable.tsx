"use client";

import React, { useState } from "react";
import { SurveyRecord } from "../lib/types";
import { exportSurveysToExcel } from "../lib/excel-export";
import { Search, Download, ExternalLink, Filter, FileSpreadsheet } from "lucide-react";

interface ContactsTableProps {
  records: SurveyRecord[];
  onOpenDetail: (id: string) => void;
  onExportCsv: () => void;
}

export default function ContactsTable({
  records,
  onOpenDetail,
  onExportCsv,
}: ContactsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !search ||
      (r.name + " " + (r.phone || "")).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-[#6b7a76]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 max-sm:w-full">
          <button
            onClick={() => exportSurveysToExcel(filteredRecords)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#176b55] hover:bg-[#0f513f] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[650px] sm:min-w-full">
            <thead>
              <tr className="bg-[#f5f8f7] text-[#6b7a76] border-b border-[#dce6e2]">
                <th className="p-3 font-bold">Fecha</th>
                <th className="p-3 font-bold">Persona</th>
                <th className="p-3 font-bold">Teléfono</th>
                <th className="p-3 font-bold">Temas de interés</th>
                <th className="p-3 font-bold">Pronóstico cardíaco</th>
                <th className="p-3 font-bold">Próxima acción</th>
                <th className="p-3 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce6e2]">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3 whitespace-nowrap text-[#6b7a76] font-medium">{r.date}</td>
                  <td className="p-3 whitespace-nowrap">
                    <b className="block text-[#18302a] text-sm">{r.name}</b>
                    <span className="text-[11px] text-[#6b7a76]">Encuestador: {r.collector || "—"}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-[#18302a]">
                    {r.phone || "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {r.topics.map((t) => (
                        <span
                          key={t}
                          className="inline-block px-2 py-0.5 rounded-full bg-[#edf3f1] text-[#0f513f] text-[10px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap font-semibold">
                    {r.riskLabel} <span className="text-[#6b7a76]">({r.risk} pts)</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        r.status === "pendiente"
                          ? "bg-[#fff5db] text-[#8a5200]"
                          : "bg-[#e8f6ef] text-[#176b55]"
                      }`}
                    >
                      {r.nextAction}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenDetail(r.id)}
                      className="inline-flex items-center gap-1 font-bold text-[#176b55] hover:underline"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#6b7a76]">
          No se encontraron registros que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
