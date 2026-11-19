"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminFullscreenToggle() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function handleChange() {
      setFullscreen(document.fullscreenElement !== null);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  async function toggle() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setFullscreen(document.fullscreenElement !== null);
    }
  }

  const Icon = fullscreen ? Minimize : Maximize;

  return (
    <button
      type="button"
      aria-label={fullscreen ? "Keluar dari layar penuh" : "Layar penuh"}
      aria-pressed={fullscreen}
      onClick={toggle}
      className="hidden min-h-11 min-w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary sm:inline-flex"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}
