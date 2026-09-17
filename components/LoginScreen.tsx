"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "../lib/types";
import {
  loginWithEmailPassword,
  registerWithInviteToken,
  validateInviteToken,
} from "../lib/services/auth-service";
import {
  User,
  LogIn,
  ShieldAlert,
  Mail,
  Lock,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  initialInviteCode?: string;
}

export default function LoginScreen({
  onLoginSuccess,
  initialInviteCode = "",
}: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Form State
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Feedback State
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialInviteCode) {
      setInviteCode(initialInviteCode);
      setActiveTab("register");
    }
  }, [initialInviteCode]);

  // Demo Quick Fill Handlers
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    const res = await loginWithEmailPassword(email, password);
    setLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.error || "No se pudo iniciar sesión.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!inviteCode.trim()) {
      setErrorMsg("Por favor ingresa un código de invitación válido.");
      return;
    }
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg("Nombre, Correo y Contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    const res = await registerWithInviteToken(
      inviteCode,
      regName,
      regEmail,
      regPassword,
      regPhone
    );
    setLoading(false);

    if (res.success && res.user) {
      setSuccessMsg("¡Registro autorizado exitoso! Iniciando sesión...");
      setTimeout(() => onLoginSuccess(res.user!), 1000);
    } else {
      setErrorMsg(res.error || "No se pudo completar el registro.");
    }
  };

  const validatedToken = inviteCode ? validateInviteToken(inviteCode) : null;

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0f513f]/10 via-[#eaf6f1] to-[#f5f7f8] p-4 sm:p-6">
      <div className="max-w-[460px] w-full bg-white border border-[#dce6e2] rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f513f] to-[#176b55] text-white grid place-items-center font-black text-2xl mx-auto shadow-lg">
            RS
          </div>
          <h1 className="text-2xl font-black text-[#18302a] tracking-tight">Roca de Sión</h1>
          <p className="text-xs font-semibold text-[#6b7a76]">
            Sistema Integrado de Gestión Congregacional v2.0
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-[#edf7f3] p-1 rounded-2xl border border-[#dce6e2]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "login"
                ? "bg-white text-[#0f513f] shadow-md font-black scale-[1.01]"
                : "text-[#6b7a76] hover:text-[#0f513f]"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "register"
                ? "bg-white text-[#0f513f] shadow-md font-black scale-[1.01]"
                : "text-[#6b7a76] hover:text-[#0f513f]"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Link Autorizado</span>
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#fdecea] border border-[#f9beba] text-xs font-medium text-[#b42318] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#eaf6f1] border border-[#a3d9c9] text-xs font-medium text-[#0f513f] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rocadesion.org"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#cfdcd7] rounded-xl text-sm focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#cfdcd7] rounded-xl text-sm focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? "Verificando..." : "Entrar a la Aplicación"}</span>
            </button>

            {/* Quick Fill Demo Access Buttons */}
            <div className="pt-3 border-t border-[#dce6e2] space-y-2">
              <div className="text-[11px] font-bold text-[#6b7a76] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#176b55]" />
                <span>Acceso Rápido de Prueba:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin@rocadesion.org", "admin123")}
                  className="p-2 rounded-xl bg-[#edf7f3] hover:bg-[#dce6e2] border border-[#cfe5dd] text-[#0f513f] font-bold text-[11px] flex flex-col items-center gap-0.5 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("lider@rocadesion.org", "lider123")}
                  className="p-2 rounded-xl bg-[#edf7f3] hover:bg-[#dce6e2] border border-[#cfe5dd] text-[#0f513f] font-bold text-[11px] flex flex-col items-center gap-0.5 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Líder GP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("encuestador@rocadesion.org", "user123")}
                  className="p-2 rounded-xl bg-[#edf7f3] hover:bg-[#dce6e2] border border-[#cfe5dd] text-[#0f513f] font-bold text-[11px] flex flex-col items-center gap-0.5 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Encuestador</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER WITH AUTHORIZED LINK FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1.5 uppercase tracking-wider">
                Código de Invitación Autorizado
              </label>
              <div className="relative">
                <LinkIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Ej.: RS_INVITE_2026"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#cfdcd7] rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-[#176b55]"
                />
              </div>

              {validatedToken ? (
                <div className="mt-1.5 text-xs text-[#0f513f] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#176b55]" />
                  <span>Link Autorizado para rol: <b>{validatedToken.role.toUpperCase()}</b> ({validatedToken.assignedGroup})</span>
                </div>
              ) : (
                <div className="mt-1 text-[11px] text-[#6b7a76]">
                  Prueba el código de demostración: <button type="button" onClick={() => setInviteCode("RS_INVITE_2026")} className="font-mono font-bold text-[#0f513f] underline">RS_INVITE_2026</button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej.: Pedro Ramírez"
                className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                  Teléfono (Opcional)
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+58 412..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
                Crea tu Contraseña
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>Completar Registro Autorizado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="p-3 rounded-xl bg-[#fff7e6] border border-[#f0d59a] text-[11px] text-[#a15c00] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <b>Acceso Protegido:</b> La congregación Roca de Sión resguarda la privacidad de sus registros y encuestas.
          </span>
        </div>
      </div>
    </div>
  );
}
