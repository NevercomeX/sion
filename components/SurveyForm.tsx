"use client";

import React, { useState, useEffect } from "react";
import { SurveyRecord, FactorAnswers, ContactPreference, NextActionOption } from "../lib/types";
import { TOPICS, FACTORS, getRiskInfo, todayString } from "../lib/survey-utils";
import { Save, RefreshCw, ShieldAlert, HeartPulse } from "lucide-react";

interface SurveyFormProps {
  currentCollector: string;
  editingRecord: SurveyRecord | null;
  onSave: (record: SurveyRecord) => void;
  onClear: () => void;
}

export default function SurveyForm({
  currentCollector,
  editingRecord,
  onSave,
  onClear,
}: SurveyFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(todayString());
  const [collector, setCollector] = useState(currentCollector || "");
  const [contactPref, setContactPref] = useState<ContactPreference>("WhatsApp");
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [answers, setAnswers] = useState<FactorAnswers>({});
  
  const [mainInterest, setMainInterest] = useState("");
  const [nextAction, setNextAction] = useState<NextActionOption>("Contactar");
  const [nextDate, setNextDate] = useState(todayString());
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (editingRecord) {
      setName(editingRecord.name || "");
      setPhone(editingRecord.phone || "");
      setAddress(editingRecord.address || "");
      setDate(editingRecord.date || todayString());
      setCollector(editingRecord.collector || currentCollector || "");
      setContactPref((editingRecord.contactPref as ContactPreference) || "WhatsApp");
      setSelectedTopics(editingRecord.topics || []);
      setAnswers(editingRecord.answers || {});
      setMainInterest(editingRecord.mainInterest || "");
      setNextAction((editingRecord.nextAction as NextActionOption) || "Contactar");
      setNextDate(editingRecord.nextDate || todayString());
      setNotes(editingRecord.notes || "");
      setConsent(true);
    } else {
      resetForm();
    }
  }, [editingRecord, currentCollector]);

  const resetForm = () => {
    setName("");
    setPhone("");
    setAddress("");
    setDate(todayString());
    setCollector(currentCollector || "");
    setContactPref("WhatsApp");
    setSelectedTopics([]);
    setAnswers({});
    setMainInterest("");
    setNextAction("Contactar");
    setNextDate(todayString());
    setNotes("");
    setConsent(false);
  };

  // Calculate live score
  const totalScore = Object.values(answers).reduce((total, opts) => {
    return total + opts.reduce((sum, item) => sum + item.points, 0);
  }, 0);

  const answeredFactorsCount = Object.keys(answers).length;
  const isScoreReady = answeredFactorsCount > 0;
  const riskCategory = getRiskInfo(totalScore);

  // Radio selection handler
  const handleRadioChange = (factorKey: string, label: string, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [factorKey]: [{ label, points }],
    }));
  };

  // Checkbox factor handler (e.g. enfermedad)
  const handleCheckboxFactorChange = (factorKey: string, label: string, points: number, checked: boolean) => {
    setAnswers((prev) => {
      const currentList = prev[factorKey] || [];
      let updatedList;
      if (checked) {
        updatedList = [...currentList, { label, points }];
      } else {
        updatedList = currentList.filter((x) => x.label !== label);
      }
      if (updatedList.length === 0) {
        const copy = { ...prev };
        delete copy[factorKey];
        return copy;
      }
      return { ...prev, [factorKey]: updatedList };
    });
  };

  // Topic checkbox toggle
  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Escriba el nombre de la persona.");
    if (!consent) return alert("Debe registrar la autorización de la persona.");
    if (answeredFactorsCount < FACTORS.length) {
      return alert("Por favor seleccione una opción en cada factor del pronóstico cardíaco.");
    }

    const recordId = editingRecord ? editingRecord.id : crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const record: SurveyRecord = {
      id: recordId,
      createdAt: editingRecord?.createdAt || nowIso,
      updatedAt: nowIso,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      date,
      collector: collector.trim(),
      contactPref,
      topics: selectedTopics,
      mainInterest,
      nextAction,
      nextDate,
      notes: notes.trim(),
      risk: totalScore,
      riskLabel: riskCategory.label,
      answers,
      status: editingRecord?.status || "pendiente",
      consent: true,
      followHistory: editingRecord?.followHistory || [],
    };

    onSave(record);
    alert(editingRecord ? "Registro actualizado correctamente." : "Encuesta guardada con éxito.");
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Basic Data Card */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#18302a]">
            {editingRecord ? "Editar encuesta" : "Nueva encuesta"}
          </h2>
          <p className="text-xs text-[#6b7a76]">Registre la información con autorización de la persona.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-sm:grid-cols-1">
          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Nombre completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej.: María López"
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej.: +56 9 1234 5678"
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Dirección / sector</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej.: Av. Central 123, Sector Norte"
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Encuestador</label>
            <input
              type="text"
              value={collector}
              onChange={(e) => setCollector(e.target.value)}
              placeholder="Nombre del encuestador"
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Preferencia de contacto</label>
            <select
              value={contactPref}
              onChange={(e) => setContactPref(e.target.value as ContactPreference)}
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Llamada">Llamada</option>
              <option value="Visita">Visita</option>
              <option value="Indistinto">Indistinto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics of Interest */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#18302a]">Temas de interés</h2>
          <p className="text-xs text-[#6b7a76]">Puede seleccionar varias opciones.</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-sm:grid-cols-1">
          {TOPICS.map((topic) => {
            const isChecked = selectedTopics.includes(topic);
            return (
              <label
                key={topic}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition-all ${
                  isChecked
                    ? "border-[#176b55] bg-[#edf7f3] text-[#0f513f]"
                    : "border-[#dce6e2] hover:bg-[#f5f8f7] text-[#18302a]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTopicToggle(topic)}
                  className="w-4 h-4 rounded text-[#176b55] focus:ring-[#176b55] shrink-0"
                />
                <span className="leading-snug">{topic}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Cardiac Health Factors */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#176b55]" />
            <h2 className="text-base sm:text-lg font-bold text-[#18302a]">Pronóstico cardíaco</h2>
          </div>
          <p className="text-xs text-[#6b7a76] mt-1 leading-relaxed">
            Seleccione una opción por factor. En “Enfermedad / otros factores” puede seleccionar varios. Cuestionario orientativo, no diagnóstico médico.
          </p>
        </div>

        <div className="space-y-4">
          {FACTORS.map((factor) => {
            const currentAnswers = answers[factor.key] || [];

            return (
              <div key={factor.key} className="border border-[#dce6e2] rounded-xl overflow-hidden">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18302a] bg-[#f7faf9] px-3.5 py-2 border-b border-[#dce6e2]">
                  {factor.name}
                </h3>
                <div className="p-2.5 space-y-1.5">
                  {factor.opts.map(([label, points]) => {
                    const isChecked = currentAnswers.some((x) => x.label === label);

                    return (
                      <label
                        key={label}
                        className={`flex items-start sm:items-center justify-between gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-[#edf7f3] border-[#176b55] text-[#0f513f] font-semibold"
                            : "border-transparent hover:bg-[#edf7f3]/50 text-[#18302a]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <input
                            type={factor.type}
                            name={factor.key}
                            checked={isChecked}
                            onChange={(e) => {
                              if (factor.type === "radio") {
                                handleRadioChange(factor.key, label, points);
                              } else {
                                handleCheckboxFactorChange(factor.key, label, points, e.target.checked);
                              }
                            }}
                            className="mt-0.5 sm:mt-0 text-[#176b55] focus:ring-[#176b55] shrink-0"
                          />
                          <span className="leading-tight break-words">{label}</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold opacity-80 bg-[#dce6e2] text-[#18302a] px-2 py-0.5 rounded-full shrink-0 ml-1">
                          +{points}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Score Box */}
        {isScoreReady && (
          <div className={`p-4 sm:p-5 rounded-xl border ${riskCategory.className} transition-all duration-300`}>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Puntuación acumulada</div>
            <div className="text-3xl sm:text-4xl font-black mt-1 leading-tight">{totalScore} pts</div>
            <div className="text-sm font-extrabold mt-0.5">{riskCategory.label}</div>
            <div className="text-xs mt-2 font-medium opacity-80">
              Factores respondidos: {answeredFactorsCount} / {FACTORS.length}
            </div>
          </div>
        )}
      </div>

      {/* Initial Follow-up */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#18302a]">Seguimiento inicial</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-sm:grid-cols-1">
          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Interés principal</label>
            <select
              value={mainInterest}
              onChange={(e) => setMainInterest(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            >
              <option value="">Seleccionar interés principal</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Próxima acción</label>
            <select
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value as NextActionOption)}
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
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
            <label className="block text-xs font-bold text-[#18302a] mb-1">Fecha de próximo contacto</label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1">Notas u observaciones</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones de seguimiento..."
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176b55] font-medium resize-y"
            />
          </div>
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
        <label className="flex items-start gap-3 p-3 border border-[#cfdcd7] rounded-xl cursor-pointer text-xs font-bold text-[#18302a]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 text-[#176b55] rounded focus:ring-[#176b55] shrink-0 mt-0.5"
          />
          <span className="leading-normal">
            La persona autoriza registrar estos datos para contacto, seguimiento y actividades de la iglesia.
          </span>
        </label>

        <div className="p-3 rounded-xl bg-[#fff7e6] border border-[#f0d59a] text-xs text-[#a15c00] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <b>Privacidad:</b> No comparta públicamente estos registros. El cálculo cardíaco no sustituye la evaluación médica profesional.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2 max-sm:flex-col">
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.99]"
        >
          <Save className="w-4 h-4" />
          <span>{editingRecord ? "Actualizar encuesta" : "Guardar encuesta"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm("¿Limpiar el formulario?")) {
              resetForm();
              onClear();
            }
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold py-3 px-5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Limpiar</span>
        </button>
      </div>
    </form>
  );
}
