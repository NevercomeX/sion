import * as XLSX from "xlsx";
import { SurveyRecord } from "./types";

export function exportSurveysToExcel(records: SurveyRecord[]) {
  if (!records || records.length === 0) {
    alert("No hay registros para exportar a Excel.");
    return;
  }

  // Format data for clean Excel columns
  const formattedData = records.map((r, index) => ({
    "N°": index + 1,
    "ID": r.id,
    "Fecha": r.date || "",
    "Nombre": r.name || "",
    "Teléfono": r.phone || "",
    "Dirección / Sector": r.address || "",
    "Encuestador": r.collector || "",
    "Preferencia Contacto": r.contactPref || "",
    "Temas de Interés": Array.isArray(r.topics) ? r.topics.join(" | ") : "",
    "Interés Principal": r.mainInterest || "",
    "Próxima Acción": r.nextAction || "",
    "Próxima Fecha": r.nextDate || "",
    "Estado Seguimiento": r.status || "pendiente",
    "Puntos Riesgo Cardíaco": r.risk || 0,
    "Pronóstico Cardíaco": r.riskLabel || "",
    "Notas de Seguimiento": r.notes || "",
    "Consentimiento": r.consent ? "Sí (Autorizado)" : "No",
    "Fecha Registro": r.createdAt ? new Date(r.createdAt).toLocaleString("es-ES") : "",
  }));

  // Create worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths for better Excel formatting
  worksheet["!cols"] = [
    { wch: 5 },  // N°
    { wch: 38 }, // ID
    { wch: 12 }, // Fecha
    { wch: 25 }, // Nombre
    { wch: 16 }, // Teléfono
    { wch: 30 }, // Dirección
    { wch: 20 }, // Encuestador
    { wch: 18 }, // Preferencia
    { wch: 40 }, // Temas
    { wch: 22 }, // Interés Principal
    { wch: 22 }, // Próxima Acción
    { wch: 14 }, // Próxima Fecha
    { wch: 18 }, // Estado
    { wch: 14 }, // Puntos
    { wch: 20 }, // Pronóstico
    { wch: 35 }, // Notas
    { wch: 18 }, // Consentimiento
    { wch: 20 }, // Fecha Registro
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Encuestas Roca de Sión");

  const todayStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `roca_de_sion_encuestas_${todayStr}.xlsx`);
}
