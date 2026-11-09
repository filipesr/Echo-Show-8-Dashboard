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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-10">
      {/* Fabric speaker body, slightly larger than the display panel */}
      <div className="device-fabric w-full max-w-5xl rounded-[3%/5%] p-[1.2%] shadow-2xl shadow-black">
        {/* Black glass panel; padding % is relative to width */}
        <div className="relative rounded-[2.4%/4%] bg-black px-[3.5%] py-[3.5%] ring-1 ring-white/10">
          <div
            aria-hidden
            className="absolute top-[1.4%] right-[6%] h-[1.2%] w-[0.75%] rounded-full bg-neutral-800 ring-1 ring-neutral-700"
          />
          <div className="aspect-[8/5] overflow-hidden">{children}</div>
        </div>
      </div>

      <InstallButton />
    </main>
  );
}
