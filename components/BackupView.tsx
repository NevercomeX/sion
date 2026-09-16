"use client";

import React, { useState } from "react";
import { SurveyRecord } from "../lib/types";
import { exportSurveysToExcel } from "../lib/excel-export";
import { Upload, ShieldAlert, FileJson, FileSpreadsheet, HardDrive } from "lucide-react";

interface BackupViewProps {
  records: SurveyRecord[];
  collectors: string[];
  onImportRecords: (records: SurveyRecord[], collectors: string[]) => void;
  onExportCsv: () => void;
}

export default function BackupView({
  records,
  collectors,
  onImportRecords,
  onExportCsv,
}: BackupViewProps) {
  const [lastBackupTime, setLastBackupTime] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("rs_last_backup") || "No realizada"
      : "No realizada"
  );

  const handleExportJson = () => {
    const nowStr = new Date().toLocaleString();
    if (typeof window !== "undefined") {
      localStorage.setItem("rs_last_backup", nowStr);
    }
    setLastBackupTime(nowStr);

    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      totalRecords: records.length,
      records,
      collectors,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roca_de_sion_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed.records)) {
          throw new Error("El archivo no contiene un arreglo de registros válido.");
        }

        if (confirm("La importación actualizará los datos locales. ¿Desea continuar?")) {
          onImportRecords(parsed.records, parsed.collectors || []);
          alert("¡Copia de seguridad restaurada con éxito!");
        }
      } catch (err: any) {
        alert("Error al importar archivo JSON: " + (err?.message || "Formato no válido."));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Backup & Export Actions */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#18302a]">Copias y exportación de datos</h2>
          <p className="text-xs text-[#6b7a76]">
            Descargue un respaldo completo de la información en Excel, CSV o formato de respaldo JSON.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => exportSurveysToExcel(records)}
            className="inline-flex items-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <FileJson className="w-4 h-4" />
            <span>Descargar copia JSON</span>
          </button>

          <label className="inline-flex items-center gap-2 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restaurar desde JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV completo</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fff7e6] border border-[#f0d59a] text-xs text-[#a15c00] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <b>Seguridad:</b> Guarde las copias de seguridad en un lugar protegido. No las publique ni las comparta en grupos abiertos.
          </span>
        </div>
      </div>

      {/* Storage Information */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#176b55]" />
          <h2 className="text-lg font-bold text-[#18302a]">Estado del almacenamiento</h2>
        </div>

        <div className="space-y-1 text-xs text-[#18302a]">
          <p>
            <b className="text-sm font-black text-[#0f513f]">{records.length}</b> registros cargados en memoria / almacenamiento.
          </p>
          <p className="text-[#6b7a76]">Última copia manual: <b>{lastBackupTime}</b></p>
        </div>
      </div>
    </div>
  );
}
