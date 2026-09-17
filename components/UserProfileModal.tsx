"use client";

import React, { useState } from "react";
import { UserProfile } from "../lib/types";
import { updateUserProfile, changeUserPassword } from "../lib/services/auth-service";
import { User, Mail, Phone, Lock, Save, X, Check, KeyRound, Shield, Users } from "lucide-react";

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

export default function UserProfileModal({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Form State
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [assignedGroup, setAssignedGroup] = useState(user.assignedGroup || "");
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || "#0f513f");

  // Password Change Form State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Feedback State
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!name.trim()) {
      setMsg({ type: "error", text: "El nombre es obligatorio." });
      return;
    }

    setLoading(true);
    const res = updateUserProfile(user.id, {
      name: name.trim(),
      phone: phone.trim(),
      assignedGroup: assignedGroup.trim(),
      avatarColor,
    });
    setLoading(false);

    if (res.success && res.user) {
      setMsg({ type: "success", text: "¡Perfil actualizado exitosamente!" });
      onProfileUpdated(res.user);
      setTimeout(() => onClose(), 1200);
    } else {
      setMsg({ type: "error", text: res.error || "No se pudo actualizar el perfil." });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!currentPass || !newPass || !confirmPass) {
      setMsg({ type: "error", text: "Todos los campos de contraseña son requeridos." });
      return;
    }
    if (newPass.length < 6) {
      setMsg({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "La nueva contraseña y la confirmación no coinciden." });
      return;
    }

    setLoading(true);
    const res = changeUserPassword(user.email, currentPass, newPass);
    setLoading(false);

    if (res.success) {
      setMsg({ type: "success", text: "¡Contraseña modificada correctamente!" });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => onClose(), 1500);
    } else {
      setMsg({ type: "error", text: res.error || "No se pudo cambiar la contraseña." });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador General";
      case "leader":
        return "Líder Grupo Pequeño";
      case "collector":
        return "Encuestador";
      default:
        return "Miembro / Lector";
    }
  };

  const colorOptions = [
    "#0f513f",
    "#176b55",
    "#1e40af",
    "#6b21a8",
    "#991b1b",
    "#9a3412",
    "#374151",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-[500px] w-full p-6 sm:p-7 shadow-2xl border border-[#dce6e2] space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#dce6e2] pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl text-white grid place-items-center font-black text-xl shadow-md transition-colors shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <h2 className="text-lg font-black text-[#18302a]">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#edf7f3] text-[#0f513f] px-2 py-0.5 rounded-md border border-[#cfe5dd]">
                  <Shield className="w-3 h-3 text-[#176b55]" /> {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#f0f3f2] hover:bg-[#dce6e2] text-[#6b7a76] hover:text-[#18302a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#edf7f3] p-1 rounded-xl border border-[#dce6e2]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "profile"
                ? "bg-white text-[#0f513f] shadow-sm font-black"
                : "text-[#6b7a76] hover:text-[#0f513f]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos Personales</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "password"
                ? "bg-white text-[#0f513f] shadow-sm font-black"
                : "text-[#6b7a76] hover:text-[#0f513f]"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Seguridad & Clave</span>
          </button>
        </div>

        {/* Alerts Feedback */}
        {msg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              msg.type === "success"
                ? "bg-[#eaf6f1] border border-[#a3d9c9] text-[#0f513f]"
                : "bg-[#fdecea] border border-[#f9beba] text-[#b42318]"
            }`}
          >
            {msg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Profile Details Tab Form */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Correo Electrónico (Solo Lectura)
              </label>
              <div className="relative opacity-75">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f5f7f8] border border-[#dce6e2] rounded-xl text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+58 412 0000000"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Grupo Pequeño (GP)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                  <input
                    type="text"
                    value={assignedGroup}
                    onChange={(e) => setAssignedGroup(e.target.value)}
                    placeholder="Ej.: GP Esperanza"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1.5 uppercase tracking-wider">
                Color de Identificación / Avatar
              </label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform border-2 ${
                      avatarColor === c ? "scale-110 border-black shadow-md" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#dce6e2]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#edf7f3] text-[#0f513f] font-semibold text-xs hover:bg-[#dce6e2]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Guardando..." : "Guardar Perfil"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Password Change Tab Form */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Contraseña Actual
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Tu contraseña actual"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Nueva Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#dce6e2]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#edf7f3] text-[#0f513f] font-semibold text-xs hover:bg-[#dce6e2]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Cambiando..." : "Actualizar Clave"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
