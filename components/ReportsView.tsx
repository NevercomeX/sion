"use client";

import React from "react";
import { SurveyRecord } from "../lib/types";
import { BarChart3, HeartPulse, CheckCircle2, BookOpen } from "lucide-react";

interface ReportsViewProps {
  records: SurveyRecord[];
}

export default function ReportsView({ records }: ReportsViewProps) {
  const total = records.length;
  const avgRisk = total
    ? (records.reduce((acc, r) => acc + (r.risk || 0), 0) / total).toFixed(1)
    : "0.0";

  const highRiskCount = records.filter((r) => (r.risk || 0) >= 21).length;
  const bibliaInterestCount = records.filter(
    (r) => r.mainInterest === "Conocer más de Biblia"
  ).length;

  // Topic interest counts
  const topicCounts: Record<string, number> = {};
  records.forEach((r) => {
    r.topics.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const maxTopicCount = sortedTopics[0]?.[1] || 1;

  // Risk breakdown counts
  const riskCounts: Record<string, number> = {};
  records.forEach((r) => {
    const label = r.riskLabel || "Sin evaluación";
    riskCounts[label] = (riskCounts[label] || 0) + 1;
  });

  // Follow-up status summary
  const pendingCount = records.filter((r) => r.status === "pendiente").length;
  const completedCount = records.filter((r) => r.status === "completado").length;
  const estudioCount = records.filter(
    (r) => r.nextAction === "Ofrecer estudio bíblico"
  ).length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs">
          <span className="text-3xl font-black text-[#0f513f] block leading-tight">{total}</span>
          <span className="text-xs font-semibold text-[#6b7a76]">Total encuestados</span>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs">
          <span className="text-3xl font-black text-[#0f513f] block leading-tight">{avgRisk}</span>
          <span className="text-xs font-semibold text-[#6b7a76]">Puntuación promedio</span>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs">
          <span className="text-3xl font-black text-[#b42318] block leading-tight">{highRiskCount}</span>
          <span className="text-xs font-semibold text-[#6b7a76]">21+ puntos (Alto / Altísimo riesgo)</span>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs">
          <span className="text-3xl font-black text-[#0f513f] block leading-tight">{bibliaInterestCount}</span>
          <span className="text-xs font-semibold text-[#6b7a76]">Interés principal en Biblia</span>
        </div>
      </div>

      {/* Grid for Topics & Risk Breakdown */}
      <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
        {/* Topic Breakdown */}
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#176b55]" />
            <h2 className="text-lg font-bold text-[#18302a]">Distribución de intereses</h2>
          </div>

          {sortedTopics.length > 0 ? (
            <div className="space-y-3">
              {sortedTopics.map(([topic, count]) => {
                const percentage = Math.round((count / maxTopicCount) * 100);
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#18302a]">
                      <span>{topic}</span>
                      <span className="font-bold text-[#0f513f]">{count}</span>
                    </div>
                    <div className="h-2.5 bg-[#edf1ef] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#176b55] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#6b7a76]">Sin datos.</div>
          )}
        </div>

        {/* Cardiac Risk Breakdown */}
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#176b55]" />
            <h2 className="text-lg font-bold text-[#18302a]">Pronóstico cardíaco por categoría</h2>
          </div>

          {Object.keys(riskCounts).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(riskCounts).map(([label, count]) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#dce6e2] bg-[#f7faf9]"
                >
                  <span className="text-xs font-bold text-[#18302a]">{label}</span>
                  <span className="text-sm font-black text-[#0f513f] bg-white px-3 py-1 rounded-lg border border-[#dce6e2] shadow-2xs">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#6b7a76]">Sin datos.</div>
          )}
        </div>
      </div>

      {/* Follow-up Summary */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#18302a]">Resumen de seguimiento</h2>

        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
          <div className="p-4 rounded-xl bg-[#fff5db] border border-[#f0d59a] text-center">
            <span className="text-3xl font-black text-[#8a5200] block">{pendingCount}</span>
            <span className="text-xs font-bold text-[#8a5200]">Pendientes</span>
          </div>

          <div className="p-4 rounded-xl bg-[#e8f6ef] border border-[#a3e0c4] text-center">
            <span className="text-3xl font-black text-[#176b55] block">{completedCount}</span>
            <span className="text-xs font-bold text-[#176b55]">Completados</span>
          </div>

          <div className="p-4 rounded-xl bg-[#edf7f3] border border-[#cfe5dd] text-center">
            <span className="text-3xl font-black text-[#0f513f] block">{estudioCount}</span>
            <span className="text-xs font-bold text-[#0f513f]">Con acción de estudio bíblico</span>
          </div>
        </div>
      </div>
    </div>
  );
}
