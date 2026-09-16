"use client";

import React from "react";
import { SurveyRecord } from "../lib/types";
import { Users, BookOpen, HeartHandshake, Clock, ChevronRight } from "lucide-react";

interface HomeDashboardProps {
  records: SurveyRecord[];
  onOpenDetail: (id: string) => void;
}

export default function HomeDashboard({ records, onOpenDetail }: HomeDashboardProps) {
  const totalCount = records.length;
  const bibliaCount = records.filter((r) => r.topics.includes("Conocer más de Biblia")).length;
  const oracionCount = records.filter((r) => r.topics.includes("Oración")).length;
  const pendingCount = records.filter((r) => r.status === "pendiente").length;

  // Topics breakdown
  const topicCounts: Record<string, number> = {};
  records.forEach((r) => {
    r.topics.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const maxTopicVal = sortedTopics[0]?.[1] || 1;

  // Pending follow-ups
  const pendingRecords = records
    .filter((r) => r.status === "pendiente")
    .sort((a, b) => (a.nextDate || "9999").localeCompare(b.nextDate || "9999"))
    .slice(0, 6);

  // Recent records
  const recentRecords = records.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-[#0f513f] block leading-tight">{totalCount}</span>
            <span className="text-xs font-semibold text-[#6b7a76]">Personas encuestadas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#edf7f3] text-[#176b55] grid place-items-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-[#0f513f] block leading-tight">{bibliaCount}</span>
            <span className="text-xs font-semibold text-[#6b7a76]">Interés en Biblia</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#edf7f3] text-[#176b55] grid place-items-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-[#0f513f] block leading-tight">{oracionCount}</span>
            <span className="text-xs font-semibold text-[#6b7a76]">Interés en oración</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#edf7f3] text-[#176b55] grid place-items-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-[#0f513f] block leading-tight">{pendingCount}</span>
            <span className="text-xs font-semibold text-[#6b7a76]">Seguimientos pendientes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fff7e6] text-[#a15c00] grid place-items-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Topics & Pending Grid */}
      <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
        {/* Topics Breakdown */}
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-[#18302a]">Temas de mayor interés</h2>
          <p className="text-xs text-[#6b7a76] mb-5">Ayuda a decidir qué actividades ofrecer.</p>

          {sortedTopics.length > 0 ? (
            <div className="space-y-3.5">
              {sortedTopics.slice(0, 8).map(([topic, count]) => {
                const percentage = Math.round((count / maxTopicVal) * 100);
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
            <div className="text-center py-10 text-xs text-[#6b7a76]">Sin datos todavía.</div>
          )}
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-[#18302a]">Seguimiento pendiente</h2>
          <p className="text-xs text-[#6b7a76] mb-5">Personas que necesitan una próxima acción.</p>

          {pendingRecords.length > 0 ? (
            <div className="divide-y divide-[#dce6e2]">
              {pendingRecords.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-bold text-[#18302a]">{r.name}</div>
                    <div className="text-xs text-[#6b7a76]">
                      <span className="font-medium text-[#176b55]">{r.nextAction}</span> · {r.nextDate || "Sin fecha"}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenDetail(r.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#176b55] bg-[#edf7f3] hover:bg-[#176b55] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Ver</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-[#6b7a76]">No hay seguimientos pendientes.</div>
          )}
        </div>
      </div>

      {/* Recent Surveys Table */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#18302a] mb-4">Últimas encuestas</h2>

        {recentRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f5f8f7] text-[#6b7a76] border-b border-[#dce6e2]">
                  <th className="p-3 font-bold">Fecha</th>
                  <th className="p-3 font-bold">Persona</th>
                  <th className="p-3 font-bold">Interés principal</th>
                  <th className="p-3 font-bold">Riesgo</th>
                  <th className="p-3 font-bold">Estado</th>
                  <th className="p-3 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce6e2]">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="p-3 whitespace-nowrap text-[#6b7a76] font-medium">{r.date}</td>
                    <td className="p-3 whitespace-nowrap font-bold text-[#18302a]">{r.name}</td>
                    <td className="p-3 whitespace-nowrap text-[#18302a]">{r.mainInterest || "—"}</td>
                    <td className="p-3 whitespace-nowrap font-semibold">{r.riskLabel} ({r.risk})</td>
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
                        className="text-xs font-bold text-[#176b55] hover:underline"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#6b7a76]">Sin registros todavía.</div>
        )}
      </div>
    </div>
  );
}
