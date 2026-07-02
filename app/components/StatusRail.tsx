"use client";

import { useEffect, useState } from "react";
import { profile } from "../data/portfolio";

function useClock() {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "Asia/Singapore",
        }) + " UTC+8",
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function StatusRail() {
  const clock = useClock();
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2 font-mono text-[11px] tracking-wide text-faint sm:text-xs">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-secure cursor-blink" />
          <span className="text-secure">STATUS: {profile.status}</span>
        </span>
        <span className="hidden sm:inline">UID {profile.uid}</span>
        <span className="hidden md:inline">CLEARANCE {profile.clearance}</span>
        <span className="tabular-nums">{clock}</span>
      </div>
    </div>
  );
}
