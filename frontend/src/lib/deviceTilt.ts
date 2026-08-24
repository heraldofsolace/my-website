"use client";

/**
 * Shared device-tilt tracking for AsciiField's mobile "move your finger" →
 * "tilt your phone" interaction. Centralized because several AsciiField
 * canvases can be mounted at once (the standalone ASCII section + multiple
 * Services panels) — one `deviceorientation` listener and one iOS
 * permission prompt serve all of them, rather than each canvas asking
 * separately.
 */

type TiltListener = (gamma: number, beta: number) => void;

const listeners = new Set<TiltListener>();
let started = false;
let permissionRequested = false;

function handleOrientation(e: DeviceOrientationEvent) {
  // gamma: left-right tilt, -90..90. beta: front-back tilt, -180..180.
  const gamma = e.gamma ?? 0;
  const beta = e.beta ?? 0;
  listeners.forEach((cb) => cb(gamma, beta));
}

function start() {
  if (started) return;
  started = true;
  window.addEventListener("deviceorientation", handleOrientation);
}

/**
 * iOS 13+ only fires `deviceorientation` after an explicit permission
 * grant, which must be requested from within a user-gesture handler (e.g.
 * touchstart). Call this from one — it's idempotent, so every AsciiField
 * instance can call it on its own first touch and only the first call
 * actually prompts. Browsers without the permission gate (most non-iOS
 * ones) just start listening immediately.
 */
export function requestTiltPermission() {
  if (permissionRequested) return;
  permissionRequested = true;

  const DeviceOrientationEventWithPermission = window.DeviceOrientationEvent as
    | (typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      })
    | undefined;

  if (typeof DeviceOrientationEventWithPermission?.requestPermission === "function") {
    DeviceOrientationEventWithPermission.requestPermission()
      .then((result) => {
        if (result === "granted") start();
      })
      .catch(() => {
        // Permission denied or API unavailable — the field just falls
        // back to touch-drag only, which already works.
      });
  } else {
    start();
  }
}

/** Subscribe to tilt updates; returns an unsubscribe function. */
export function subscribeTilt(cb: TiltListener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
