"use client";

import type { ReactNode } from "react";
import InstallButton from "@/components/InstallButton";
import { useStandalone } from "@/hooks/useStandalone";

interface DeviceFrameProps {
  children: ReactNode;
}

// Web mode: draws an Echo Show 8 with the live dashboard inside its screen.
// Installed PWA mode: renders the dashboard fullscreen, without the frame.
export default function DeviceFrame({ children }: DeviceFrameProps) {
  const standalone = useStandalone();

  if (standalone === null) return null;

  if (standalone) {
    return <main className="h-dvh w-screen">{children}</main>;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      {/* Chassis; padding % is relative to width */}
      <div className="device-shadow relative w-full max-w-6xl rounded-[2.8%/4.5%] border-4 border-[#242b3d] bg-[#11141c] p-[1.8%]">
        {/* Camera with privacy shutter, centered on the top bezel */}
        <div
          aria-hidden
          className="absolute top-[0.6%] left-1/2 flex -translate-x-1/2 items-center gap-2"
        >
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span className="h-2 w-2 rounded-full border border-slate-600 bg-slate-950" />
          <span className="h-1 w-1 rounded-full bg-slate-700" />
        </div>
        <div className="aspect-[8/5] overflow-hidden rounded-[1.6%/2.6%] border border-black/60">
          {children}
        </div>
      </div>
      {/* Speaker base behind the screen */}
      <div aria-hidden className="device-stand -mt-1 h-9 w-3/5 max-w-[700px] rounded-b-2xl" />

      <div className="mt-8">
        <InstallButton />
      </div>
    </main>
  );
}
