"use client";

import { useEffect, useState } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel"];

// Returns true after `timeoutMs` without user interaction.
// Every interaction clears the pending timer and starts a new one, so the
// timeout only fires after a full uninterrupted period of inactivity.
// Any interaction while idle immediately sets it back to false.
export function useIdleTimer(timeoutMs: number): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), timeoutMs);

    function handleActivity() {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), timeoutMs);
    }

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [timeoutMs]);

  return idle;
}
