"use client";

import React, { useState, useEffect } from "react";
import { ActivityItem, ActivityStatus } from "../lib/types";
import {
  fetchActivities,
  saveActivityRecord,
  deleteActivityRecord,
} from "../lib/services/activity-service";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export default function ActivitiesView() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState("Reunión GP");
  const [formDescription, setFormDescription] = useState("");
  const [formOrganizer, setFormOrganizer] = useState("");
  const [formStatus, setFormStatus] = useState<ActivityStatus>("programada");

  // Placeholder fields state
  const [formPlaceholder1, setFormPlaceholder1] = useState("");
  const [formPlaceholder2, setFormPlaceholder2] = useState("");
  const [formPlaceholder3, setFormPlaceholder3] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    setActivities(fetchActivities());
  };

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().slice(0, 10));
  };

  // Calendar Days calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const formatDayString = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Open Create Modal
  const handleOpenCreate = (initialDate?: string) => {
    setEditingActivity(null);
    setFormTitle("");
    setFormDate(initialDate || selectedDateStr || new Date().toISOString().slice(0, 10));
    setFormTime("19:00");
    setFormLocation("");
    setFormCategory("Reunión GP");
    setFormDescription("");
    setFormOrganizer("");
    setFormStatus("programada");
    setFormPlaceholder1("");
    setFormPlaceholder2("");
    setFormPlaceholder3("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (act: ActivityItem) => {
    setEditingActivity(act);
    setFormTitle(act.title);
    setFormDate(act.date);
    setFormTime(act.time || "");
    setFormLocation(act.location || "");
    setFormCategory(act.category || "Reunión GP");
    setFormDescription(act.description || "");
    setFormOrganizer(act.organizer || "");
    setFormStatus(act.status || "programada");
    setFormPlaceholder1(act.placeholderField1 || "");
    setFormPlaceholder2(act.placeholderField2 || "");
    setFormPlaceholder3(act.placeholderField3 || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate.trim()) {
      alert("Título y fecha son obligatorios.");
      return;
    }

    const activityData: ActivityItem = {
      id: editingActivity ? editingActivity.id : `act_${Date.now()}`,
      title: formTitle.trim(),
      date: formDate.trim(),
      time: formTime.trim(),
      location: formLocation.trim(),
      category: formCategory,
      description: formDescription.trim(),
      organizer: formOrganizer.trim(),
      status: formStatus,
      placeholderField1: formPlaceholder1.trim(),
      placeholderField2: formPlaceholder2.trim(),
      placeholderField3: formPlaceholder3.trim(),
      createdAt: editingActivity ? editingActivity.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveActivityRecord(activityData);
    loadActivities();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta actividad?")) {
      deleteActivityRecord(id);
      loadActivities();
    }
  };

  // Filtered activities
  const filteredActivities = activities.filter((a) => {
    if (selectedCategory !== "todos" && a.category !== selectedCategory) return false;
    return true;
  });

  const selectedDateActivities = filteredActivities.filter(
    (a) => a.date === selectedDateStr
  );

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "Reunión GP":
        return "bg-[#0f513f] text-white";
      case "Evangelismo":
        return "bg-[#176b55] text-white";
      case "Jóvenes":
        return "bg-blue-600 text-white";
      case "Salud":
        return "bg-emerald-600 text-white";
      case "Social":
        return "bg-amber-600 text-white";
      default:
        return "bg-slate-700 text-white";
    }
  };

  const categoriesList = [
    "todos",
    "Reunión GP",
    "Evangelismo",
    "Jóvenes",
    "Salud",
    "Social",
    "General",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#176b55]" />
            <h2 className="text-xl font-black text-[#18302a]">Calendario de Actividades</h2>
            <span className="bg-[#edf7f3] text-[#0f513f] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#cfe5dd]">
              {activities.length} Actividades
            </span>
          </div>
          <p className="text-xs text-[#6b7a76] mt-1">
            Planifica, programa y gestiona eventos congregacionales, reuniones de Grupo Pequeño y actividades comunitarias.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate()}
          className="inline-flex items-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.99] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Actividad</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-[#6b7a76] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-[#176b55]" /> Categoría:
        </span>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
              selectedCategory === cat
                ? "bg-[#0f513f] text-white shadow-xs"
                : "bg-white border border-[#dce6e2] text-[#6b7a76] hover:bg-[#edf7f3] hover:text-[#0f513f]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Calendar Grid / Right Events Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Interactive Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between border-b border-[#dce6e2] pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-[#18302a]">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 rounded-lg bg-[#edf7f3] text-[#0f513f] hover:bg-[#dce6e2] font-bold text-xs border border-[#cfe5dd] transition-colors"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#f5f7f8] hover:bg-[#edf7f3] text-[#18302a] transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#f5f7f8] hover:bg-[#edf7f3] text-[#18302a] transition-colors"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 text-center font-extrabold text-[11px] text-[#0f513f] uppercase tracking-wider py-1 border-b border-[#edf3f0]">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>

          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysArray.map((dayNum, index) => {
              if (dayNum === null) {
                return <div key={`empty_${index}`} className="h-20 sm:h-24 bg-[#f9faf9]/50 rounded-xl" />;
              }

              const dateStr = formatDayString(dayNum);
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().slice(0, 10);
              const dayActivities = filteredActivities.filter((a) => a.date === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#edf7f3] border-[#176b55] shadow-sm ring-2 ring-[#176b55]/20 scale-[1.01]"
                      : "bg-white border-[#e6ece9] hover:border-[#176b55]/50 hover:bg-[#f8faf9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black w-6 h-6 rounded-full grid place-items-center ${
                        isToday
                          ? "bg-[#0f513f] text-white shadow-xs"
                          : isSelected
                          ? "text-[#176b55]"
                          : "text-[#18302a]"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayActivities.length > 0 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#176b55] text-white">
                        {dayActivities.length}
                      </span>
                    )}
                  </div>

                  {/* Day Activities Badges Preview */}
                  <div className="space-y-1 overflow-hidden">
                    {dayActivities.slice(0, 2).map((act) => (
                      <div
                        key={act.id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${getCategoryColor(
                          act.category
                        )}`}
                        title={act.title}
                      >
                        {act.time ? `${act.time} ` : ""}{act.title}
                      </div>
                    ))}
                    {dayActivities.length > 2 && (
                      <div className="text-[9px] font-bold text-[#176b55] text-center">
                        +{dayActivities.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Activities List for Selected Day */}
        <div className="bg-white border border-[#dce6e2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#dce6e2] pb-3">
            <div>
              <h3 className="text-base font-black text-[#18302a]">
                Actividades ({selectedDateStr || "General"})
              </h3>
              <p className="text-[11px] text-[#6b7a76]">
                {selectedDateActivities.length} evento(s) programado(s)
              </p>
            </div>

            <button
              onClick={() => handleOpenCreate(selectedDateStr)}
              className="p-2 rounded-xl bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] transition-colors"
              title="Agregar en este día"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {selectedDateActivities.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <CalendarIcon className="w-8 h-8 text-[#a3b8b1] mx-auto opacity-60" />
                <p className="text-xs text-[#6b7a76] font-medium">
                  No hay actividades programadas para esta fecha.
                </p>
                <button
                  onClick={() => handleOpenCreate(selectedDateStr)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176b55] hover:underline pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Programar Actividad
                </button>
              </div>
            ) : (
              selectedDateActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-[#dce6e2] bg-[#fdfefe] hover:border-[#176b55]/50 transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${getCategoryColor(
                          act.category
                        )}`}
                      >
                        {act.category || "General"}
                      </span>
                      <h4 className="text-sm font-bold text-[#18302a] mt-1">{act.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(act)}
                        className="p-1 rounded-lg bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f]"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="p-1 rounded-lg bg-[#fdecea] hover:bg-[#f9beba] text-[#b42318]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Date, Time & Location */}
                  <div className="space-y-1 text-xs text-[#6b7a76]">
                    {act.time && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#176b55]" />
                        <span>Hora: {act.time}</span>
                      </div>
                    )}
                    {act.location && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#176b55]" />
                        <span>Lugar: {act.location}</span>
                      </div>
                    )}
                    {act.organizer && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-[#176b55]" />
                        <span>Organiza: {act.organizer}</span>
                      </div>
                    )}
                  </div>

                  {act.description && (
                    <p className="text-xs text-[#4c5c57] leading-relaxed pt-1 border-t border-[#edf3f0]">
                      {act.description}
                    </p>
                  )}

                  {/* Display Extensible Placeholder Fields if present */}
                  {(act.placeholderField1 || act.placeholderField2 || act.placeholderField3) && (
                    <div className="pt-2 border-t border-[#edf3f0] space-y-1 text-[11px] text-[#0f513f] font-semibold bg-[#edf7f3]/50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#176b55]">
                        <Layers className="w-3 h-3" /> Datos de Expansión (Placeholder):
                      </div>
                      {act.placeholderField1 && <div>• {act.placeholderField1}</div>}
                      {act.placeholderField2 && <div>• {act.placeholderField2}</div>}
                      {act.placeholderField3 && <div>• {act.placeholderField3}</div>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-[540px] w-full p-6 sm:p-7 shadow-2xl border border-[#dce6e2] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dce6e2] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#0f513f] text-white grid place-items-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18302a]">
                    {editingActivity ? "Editar Actividad" : "Nueva Actividad"}
                  </h3>
                  <p className="text-[11px] text-[#6b7a76]">Completa los datos del evento</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#f0f3f2] hover:bg-[#dce6e2] text-[#6b7a76]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej.: Culto de Oración & Fraternidad"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  >
                    <option value="Reunión GP">Reunión GP</option>
                    <option value="Evangelismo">Evangelismo</option>
                    <option value="Jóvenes">Jóvenes</option>
                    <option value="Salud">Salud</option>
                    <option value="Social">Social</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Estado
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ActivityStatus)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  >
                    <option value="programada">Programada</option>
                    <option value="en_curso">En Curso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Ubicación / Lugar
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Ej.: Templo Central / Casa de la Fam. X"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                    Organizador / Responsable
                  </label>
                  <input
                    type="text"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    placeholder="Ej.: Juan Pérez"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Descripción / Detalles
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalla los objetivos, materiales o programa de la actividad..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              {/* Extensible Placeholder Fields for Future Properties */}
              <div className="bg-[#edf7f3] border border-[#cfe5dd] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#0f513f] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#176b55]" />
                  <span>Campos de Expansión Futura (Placeholder)</span>
                </div>
                <p className="text-[11px] text-[#6b7a76]">
                  Estas propiedades permiten guardar datos personalizados mientras se define el esquema definitivo.
                </p>

                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={formPlaceholder1}
                    onChange={(e) => setFormPlaceholder1(e.target.value)}
                    placeholder="Placeholder Campo 1 (ej.: Recursos / Equipos)"
                    className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                  />
                  <input
                    type="text"
                    value={formPlaceholder2}
                    onChange={(e) => setFormPlaceholder2(e.target.value)}
                    placeholder="Placeholder Campo 2 (ej.: Enfoque o Tema principal)"
                    className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                  />
                  <input
                    type="text"
                    value={formPlaceholder3}
                    onChange={(e) => setFormPlaceholder3(e.target.value)}
                    placeholder="Placeholder Campo 3 (ej.: Notas internas de coordinación)"
                    className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#dce6e2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#edf7f3] text-[#0f513f] font-semibold text-xs hover:bg-[#dce6e2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs shadow-md"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
