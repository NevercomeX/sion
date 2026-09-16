"use client";

import React, { useState } from "react";
import { Lock, X, LogIn, AlertCircle } from "lucide-react";
import { verifyAdminPassword } from "../lib/services/survey-service";
import { verifyAdminPasswordAction } from "../app/actions/auth";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Por favor ingrese la contraseña de administrador.");
      return;
    }

    setLoading(true);
    try {
      // 1. Check Server Action (verifies private ADMIN_PASSWORD on server side)
      let isServerValid = await verifyAdminPasswordAction(password);

      // 2. Check local client fallback if server action returns false (e.g. customized in localStorage)
      if (!isServerValid) {
        isServerValid = verifyAdminPassword(password);
      }

      if (isServerValid) {
        setError("");
        setPassword("");
        onSuccess();
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (err) {
      // Fallback to local verification if offline
      if (verifyAdminPassword(password)) {
        setError("");
        setPassword("");
        onSuccess();
      } else {
        setError("Contraseña incorrecta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-[420px] w-full p-6 shadow-2xl space-y-5 border border-[#dce6e2]">
        <div className="flex items-center justify-between border-b border-[#dce6e2] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0f513f] text-white grid place-items-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#18302a]">Acceso Administrador</h2>
              <p className="text-[11px] text-[#6b7a76]">Ingresa tu clave de acceso privada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#f0f3f2] hover:bg-[#dce6e2] text-[#6b7a76] hover:text-[#18302a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1 uppercase tracking-wider">
              Contraseña Privada
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Contraseña de administrador"
              className="w-full px-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm font-medium focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#fdecea] border border-[#f9beba] text-xs text-[#b42318] flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Verificando..." : "Ingresar"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-[#edf7f3] hover:bg-[#dce6e2] text-[#0f513f] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
