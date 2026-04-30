"use client";

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <p className="font-semibold text-white">Petro Trilhas</p>
              <p className="text-xs text-slate-500">Administração</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a
            href="/admin/trilhas"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white"
          >
            🏔️ Trilhas
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              /* signOut */
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
