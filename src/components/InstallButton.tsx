"use client";

import { useEffect, useState } from "react";

// Chromium-only event, not included in the TypeScript DOM types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export default function InstallButton() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // The browser fires this when the app is installable; we hold on to it
    // so the prompt can be shown later from our own button
    function handlePrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    await installEvent?.prompt();
    setInstallEvent(null);
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <button
        type="button"
        onClick={install}
        disabled={!installEvent}
        className="rounded-full border border-slate-700 bg-slate-800 px-7 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Instalar no dispositivo
      </button>
      {!installEvent && (
        <p className="max-w-sm text-sm text-slate-500">
          Abra no Chrome ou Edge para instalar. No iPhone/iPad, use Compartilhar
          → Adicionar à Tela de Início.
        </p>
      )}
    </div>
  );
}
