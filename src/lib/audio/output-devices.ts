"use client";

import { getAudioContext } from "@strudel/webaudio";

export interface OutputDevice {
  deviceId: string;
  label: string;
}

/**
 * Browser support check for AudioContext.setSinkId().
 * Chromium-based browsers (Chrome 110+, Edge, Opera) support it.
 * Safari/Firefox support varies — we degrade gracefully.
 */
export function isSinkIdSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ctx = getAudioContext();
    return typeof (ctx as unknown as { setSinkId?: unknown }).setSinkId === "function";
  } catch {
    return false;
  }
}

/**
 * Enumerate available audio output devices.
 * Requires permission — browser shows labels only after a getUserMedia call
 * OR after the user has explicitly granted microphone access. Without
 * permission, labels come back blank.
 */
export async function enumerateAudioOutputs(): Promise<OutputDevice[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === "audiooutput")
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Output ${i + 1}`,
      }));
  } catch {
    return [];
  }
}

/**
 * Request audio output permission. Firefox/Safari may need a dummy getUserMedia
 * call to expose device labels. We call getUserMedia({ audio: true }) then
 * immediately stop the track — the permission state unlocks labels.
 */
export async function requestAudioPermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Route Strudel's AudioContext to a specific output device.
 * Returns the previously-set sink id so the caller can restore it.
 */
export async function setAudioOutput(deviceId: string): Promise<string | null> {
  if (!isSinkIdSupported()) return null;
  const ctx = getAudioContext() as unknown as {
    sinkId?: string;
    setSinkId: (id: string) => Promise<void>;
  };
  const previous = ctx.sinkId ?? "";
  try {
    await ctx.setSinkId(deviceId);
    return previous;
  } catch (err) {
    console.error("setSinkId failed:", err);
    return null;
  }
}

/**
 * Current output sink id on Strudel's AudioContext. Empty string = system default.
 */
export function getCurrentOutputSinkId(): string {
  try {
    const ctx = getAudioContext() as unknown as { sinkId?: string };
    return ctx.sinkId ?? "";
  } catch {
    return "";
  }
}

export const DEFAULT_DEVICE_ID = ""; // system default
