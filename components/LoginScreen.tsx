"use client";

import React, { useState } from "react";
import { User, LogIn, ShieldAlert } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "Encuestador";
    onLogin(finalName);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#eaf6f1] to-[#f5f7f8] p-4">
      <div className="max-w-[440px] w-full bg-white border border-[#dce6e2] rounded-2xl p-7 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#0f513f] text-white grid place-items-center font-black text-2xl mb-4 shadow-md">
          RS
        </div>
        <h1 className="text-2xl font-black text-[#18302a] tracking-tight">Roca de Sión</h1>
        <div className="text-sm font-medium text-[#6b7a76] mt-0.5">Conectando Vidas · Versión 2.0 (Next.js & Supabase)</div>

        <p className="text-sm text-[#6b7a76] mt-4 leading-relaxed">
          Esta pantalla prepara el acceso de los encuestadores. Puede ingresar su nombre para registrar quién realiza la encuesta.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#18302a] mb-1.5 uppercase tracking-wider">
              Nombre del encuestador
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a76]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej.: Juan Pérez"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#cfdcd7] rounded-xl text-sm focus:outline-none focus:border-[#176b55] focus:ring-2 focus:ring-[#176b55]/20 font-medium transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#176b55] hover:bg-[#0f513f] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            <LogIn className="w-5 h-5" />
            <span>Entrar a la aplicación</span>
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-[#fff7e6] border border-[#f0d59a] text-xs text-[#a15c00] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <b>Privacidad:</b> Los datos de salud y contacto deben manejarse con autorización y acceso restringido.
          </span>
        </div>
      </div>
    </div>
  );
}
