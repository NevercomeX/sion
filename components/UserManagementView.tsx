"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, InviteToken, UserRole } from "../lib/types";
import {
  fetchUsers,
  adminSaveUser,
  adminDeleteUser,
  fetchInviteTokens,
  createInviteToken,
  toggleInviteTokenStatus,
} from "../lib/services/auth-service";
import {
  Users,
  Plus,
  Shield,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Link,
  Trash2,
  Edit,
  RefreshCw,
  Search,
  UserCheck,
} from "lucide-react";

export default function UserManagementView() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [inviteTokens, setInviteTokens] = useState<InviteToken[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State for Edit / Create User
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("collector");
  const [formGroup, setFormGroup] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(fetchUsers());
    setInviteTokens(fetchInviteTokens());
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("collector");
    setFormGroup("Grupo Pequeño");
    setFormPassword("");
    setMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone || "");
    setFormRole(user.role);
    setFormGroup(user.assignedGroup || "");
    setFormPassword("");
    setMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!formName.trim() || !formEmail.trim()) {
      setMsg({ type: "error", text: "Nombre y Correo son obligatorios." });
      return;
    }

    const userData: UserProfile = {
      id: editingUser ? editingUser.id : `usr_${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      phone: formPhone.trim(),
      role: formRole,
      status: editingUser ? editingUser.status : "active",
      assignedGroup: formGroup.trim(),
      avatarColor: editingUser?.avatarColor || "#0f513f",
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      lastLogin: editingUser?.lastLogin,
    };

    const res = adminSaveUser(userData, formPassword);
    if (res.success) {
      setMsg({ type: "success", text: "Usuario guardado exitosamente." });
      loadData();
      setTimeout(() => setIsModalOpen(false), 800);
    } else {
      setMsg({ type: "error", text: res.error || "No se pudo guardar el usuario." });
    }
  };

  const handleToggleStatus = (user: UserProfile) => {
    const updatedStatus = user.status === "active" ? "inactive" : "active";
    adminSaveUser({ ...user, status: updatedStatus });
    loadData();
  };

  const handleDelete = (userId: string) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      adminDeleteUser(userId);
      loadData();
    }
  };

  const handleCreateInviteToken = (role: UserRole) => {
    createInviteToken(role, "Grupo Pequeño General", "Administrador");
    loadData();
  };

  const handleToggleInviteToken = (code: string) => {
    toggleInviteTokenStatus(code);
    loadData();
  };

  const handleCopyInviteLink = (code: string) => {
    const link = `${window.location.origin}?invite=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.assignedGroup && u.assignedGroup.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <span className="px-2 py-0.5 rounded-md bg-[#0f513f] text-white text-[10px] font-black uppercase">Admin</span>;
      case "leader":
        return <span className="px-2 py-0.5 rounded-md bg-[#176b55] text-white text-[10px] font-bold uppercase">Líder GP</span>;
      case "collector":
        return <span className="px-2 py-0.5 rounded-md bg-[#edf7f3] text-[#0f513f] border border-[#cfe5dd] text-[10px] font-bold uppercase">Encuestador</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-[#f5f7f8] text-[#6b7a76] border border-[#dce6e2] text-[10px] font-bold uppercase">Miembro</span>;
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#18302a]">Gestión de Usuarios & Accesos</h2>
            <span className="bg-[#edf7f3] text-[#0f513f] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#cfe5dd]">
              {users.length} Usuarios
            </span>
          </div>
          <p className="text-xs text-[#6b7a76] mt-1">
            Administra usuarios registrados, asigna roles de acceso y genera links autorizados de registro.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.99] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Authorized Invite Links Section */}
      <div className="bg-gradient-to-br from-[#0f513f] to-[#176b55] text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-[#c2e4d8]" />
              <h3 className="text-base font-black">Links de Registro Autorizado</h3>
            </div>
            <p className="text-xs text-[#eaf6f1] opacity-90 mt-0.5">
              Comparte estos enlaces para permitir a nuevos usuarios registrarse de forma directa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCreateInviteToken("collector")}
              className="bg-white text-[#0f513f] hover:bg-[#eaf6f1] font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              + Link Encuestador
            </button>
            <button
              onClick={() => handleCreateInviteToken("leader")}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-white/20 transition-all"
            >
              + Link Líder GP
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {inviteTokens.map((t) => (
            <div
              key={t.code}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                t.active
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-black/20 border-white/10 text-white/50"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm tracking-wider">{t.code}</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/20 text-white">
                    {t.role}
                  </span>
                </div>
                <div className="text-[11px] opacity-80 truncate mt-0.5">
                  Grupo: {t.assignedGroup || "General"} · Usos: {t.usedCount}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleCopyInviteLink(t.code)}
                  className="p-2 rounded-lg bg-white text-[#0f513f] hover:bg-[#eaf6f1] font-semibold text-xs flex items-center gap-1 transition-all"
                  title="Copiar enlace de invitación"
                >
                  {copiedCode === t.code ? (
                    <Check className="w-4 h-4 text-[#176b55]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="max-xs:hidden text-[11px]">
                    {copiedCode === t.code ? "Copiado" : "Copiar Link"}
                  </span>
                </button>

                <button
                  onClick={() => handleToggleInviteToken(t.code)}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    t.active ? "bg-white/15 hover:bg-white/25 text-white" : "bg-white/5 text-white/40"
                  }`}
                  title={t.active ? "Desactivar link" : "Activar link"}
                >
                  {t.active ? <CheckCircle2 className="w-4 h-4 text-[#a3d9c9]" /> : <XCircle className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="bg-white border border-[#dce6e2] rounded-2xl shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#dce6e2] bg-[#f8faf9] flex items-center justify-between gap-3">
          <div className="relative max-w-[360px] w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo o GP..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
            />
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white border border-[#dce6e2] hover:bg-[#edf7f3] text-[#6b7a76] hover:text-[#0f513f] transition-colors"
            title="Recargar usuarios"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#18302a]">
            <thead className="bg-[#edf7f3] border-b border-[#dce6e2] uppercase text-[10px] font-extrabold text-[#0f513f] tracking-wider">
              <tr>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Grupo Pequeño</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf3f0] font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#6b7a76]">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8faf9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl text-white grid place-items-center font-bold text-xs shrink-0 shadow-xs"
                          style={{ backgroundColor: u.avatarColor || "#0f513f" }}
                        >
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <b className="block text-xs font-bold text-[#18302a]">{u.name}</b>
                          <span className="block text-[11px] text-[#6b7a76]">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3 px-4 text-[#6b7a76]">{u.assignedGroup || "Sin asignar"}</td>
                    <td className="py-3 px-4 text-[#6b7a76]">{u.phone || "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "active"
                            ? "bg-[#eaf6f1] text-[#0f513f] border border-[#a3d9c9]"
                            : "bg-[#fdecea] text-[#b42318] border border-[#f9beba]"
                        }`}
                      >
                        {u.status === "active" ? (
                          <>
                            <UserCheck className="w-3 h-3" /> Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 rounded-lg bg-[#fdecea] hover:bg-[#f9beba] text-[#b42318] transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-[460px] w-full p-6 shadow-2xl border border-[#dce6e2] space-y-5">
            <div className="flex items-center justify-between border-b border-[#dce6e2] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0f513f] text-white grid place-items-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#18302a]">
                  {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#f0f3f2] hover:bg-[#dce6e2] text-[#6b7a76]"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {msg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  msg.type === "success"
                    ? "bg-[#eaf6f1] text-[#0f513f] border border-[#a3d9c9]"
                    : "bg-[#fdecea] text-[#b42318] border border-[#f9beba]"
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1">Rol de Acceso</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                  >
                    <option value="admin">Administrador</option>
                    <option value="leader">Líder GP</option>
                    <option value="collector">Encuestador</option>
                    <option value="member">Miembro / Lector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18302a] mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+58 412..."
                    className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1">Grupo Pequeño (GP)</label>
                <input
                  type="text"
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  placeholder="Ej.: GP Esperanza"
                  className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1">
                  {editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Contraseña del usuario"}
                  className="w-full px-3 py-2 bg-white border border-[#cfdcd7] rounded-xl text-xs font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#dce6e2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#edf7f3] text-[#0f513f] font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#176b55] hover:bg-[#0f513f] text-white font-bold text-xs shadow-md"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
