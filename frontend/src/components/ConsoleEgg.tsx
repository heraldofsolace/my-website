"use client";

import { useEffect } from "react";
import { profile } from "@/lib/data";

// Easter egg for the people who actually open devtools. Renders nothing —
// just a styled greeting in the console, with a nudge toward the other
// hidden eggs (the math-persona cursor, see Cursor.tsx; the X-Are-You-Hiring
// response header, see next.config.ts) and two callable console functions
// for anyone who takes the hint and actually types something.
let printed = false;

declare global {
  interface Window {
    whoami?: () => Record<string, string>;
    hire?: () => string;
  }
}

export default function ConsoleEgg() {
  useEffect(() => {
    window.whoami = () => ({
      name: profile.name,
      role: profile.role,
      location: profile.location,
      status: profile.availability,
      hint: "try hire()",
    });

    window.hire = () => {
      window.location.href = `mailto:${profile.email}`;
      return `Opening your mail client — or just email ${profile.email} yourself.`;
    };

    if (printed) return;
    printed = true;

    const box = "font-family:monospace;font-size:13px;padding:6px 10px;border-radius:4px;background:#d64541;color:#0b0a08;font-weight:700;";
    const body = "font-family:monospace;font-size:12px;color:#f6f1e7;";
    const dim = "font-family:monospace;font-size:12px;color:#948d7e;";

    console.log("%c  aniket bhattacharyea  ", box);
    console.log("%cHey, fellow devtools-opener. \u{1F44B}", body);
    console.log(
      "%cSince you're already poking around: switch to the math side and look closely at the cursor.",
      dim
    );
    console.log(
      "%cIf you like clean code and writing that doesn't read like it was written for an algorithm, I'm currently booking new DevRel / technical-content clients.",
      body
    );
    console.log("%cTry whoami() or hire() down here, too.", dim);
    console.log(`%c${profile.email}`, dim);
    profile.socials.forEach((social) => {
      console.log(`%c${social.label}: ${social.href}`, dim);
    });
  }, []);

  return null;
}
