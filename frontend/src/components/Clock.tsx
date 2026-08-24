"use client";

import { useEffect, useState } from "react";

function format(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());
}

export default function Clock({ timeZone = "Asia/Kolkata" }: { timeZone?: string }) {
  // Placeholder on the server; the real value is filled in once mounted so
  // server and client markup match on first paint.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(format(timeZone)), 1000);
    const raf = requestAnimationFrame(() => setTime(format(timeZone)));
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [timeZone]);

  return <span className="tabular-nums">{time ?? "--:--:--"}</span>;
}
