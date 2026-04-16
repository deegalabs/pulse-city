"use client";

import { useEffect, useRef, useCallback } from "react";
import { getAnalyzerData } from "@strudel/webaudio";

const SMOOTH_ALPHA = 0.6;
const PEAK_DECAY = 0.012;
const MIN_DB = -85;
const MAX_DB = -15;

function dbToNorm(db: number): number {
  if (!isFinite(db)) return 0;
  return Math.max(0, Math.min(1, (db - MIN_DB) / (MAX_DB - MIN_DB)));
}

interface SpectrumAnalyzerProps {
  onEnergy?: (energy: number, isBeat: boolean) => void;
}

export function SpectrumAnalyzer({ onEnergy }: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    peakHold: [] as number[],
    smoothed: [] as number[],
    prevEnergy: 0,
    beatFlash: 0,
    afr: 0,
    barGrad: null as CanvasGradient | null,
    barGradH: 0,
    barGradTop: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = stateRef.current;

    let freqData: Float32Array | Uint8Array | undefined;
    try {
      freqData = getAnalyzerData("frequency", 1);
    } catch {}

    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) {
      st.afr = requestAnimationFrame(draw);
      return;
    }

    // Clear
    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(0, 0, W, H);

    const barsTop = 8;
    const barsH = H - 16;

    // Check for valid data
    const hasData =
      freqData &&
      freqData.length > 0 &&
      isFinite(freqData[0]) &&
      freqData[0] !== 0;

    if (!hasData) {
      // Draw idle grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 5; i++) {
        const y = barsTop + (i / 6) * barsH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.fillStyle = "#1e293b";
      ctx.font = '12px "Chakra Petch", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("NO SIGNAL", W / 2, H / 2);
      st.afr = requestAnimationFrame(draw);
      return;
    }

    const barW = Math.max(3, Math.floor(W / 64) - 1);
    const gap = 1;
    const bars = Math.floor(W / (barW + gap));
    const usable = Math.floor(freqData!.length * 0.65);
    while (st.peakHold.length < bars) st.peakHold.push(0);
    while (st.smoothed.length < bars) st.smoothed.push(0);

    // Cache the gradient (recreate only when canvas height changes)
    if (!st.barGrad || st.barGradH !== barsH || st.barGradTop !== barsTop) {
      st.barGrad = ctx.createLinearGradient(0, barsTop + barsH, 0, barsTop);
      st.barGrad.addColorStop(0, "rgba(30,58,95,0.6)");
      st.barGrad.addColorStop(0.15, "#1a6fb5");
      st.barGrad.addColorStop(0.35, "#3aa5ff");
      st.barGrad.addColorStop(0.55, "#5ecc52");
      st.barGrad.addColorStop(0.7, "#a2d729");
      st.barGrad.addColorStop(0.85, "#ffe600");
      st.barGrad.addColorStop(1, "#ff4d8d");
      st.barGradH = barsH;
      st.barGradTop = barsTop;
    }

    // Energy + beat detection
    const freq = freqData!;
    let totalEnergy = 0;
    let bassEnergy = 0;
    const bassEnd = Math.floor(freq.length * 0.1);
    for (let i = 0; i < freq.length; i++) {
      const v = dbToNorm(freq[i]);
      totalEnergy += v;
      if (i < bassEnd) bassEnergy += v;
    }
    totalEnergy /= freq.length;
    bassEnergy /= bassEnd || 1;
    const isBeat = bassEnergy > 0.5 && bassEnergy > st.prevEnergy * 1.12;
    st.prevEnergy = bassEnergy * 0.6 + st.prevEnergy * 0.4;
    if (isBeat) st.beatFlash = 1;
    else st.beatFlash *= 0.85;

    onEnergy?.(Math.round(totalEnergy * 100), isBeat);

    // Beat flash overlay
    if (st.beatFlash > 0.05) {
      ctx.fillStyle = `rgba(162, 215, 41, ${st.beatFlash * 0.08})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 4; i++) {
      const y = barsTop + (i / 5) * barsH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Frequency bars — single cached gradient, clip per bar
    ctx.fillStyle = st.barGrad;
    for (let i = 0; i < bars; i++) {
      const t = Math.pow(i / bars, 1.7);
      const idx = Math.floor(t * usable);
      const raw = dbToNorm(freq[idx] ?? MIN_DB);

      // Smooth — lower alpha = faster response
      st.smoothed[i] = st.smoothed[i] * SMOOTH_ALPHA + raw * (1 - SMOOTH_ALPHA);
      const v = st.smoothed[i];
      const h = Math.max(1, v * barsH);
      const x = i * (barW + gap);
      const y = barsTop + barsH - h;

      // Bar shape with rounded top
      const r = Math.min(barW / 2, 2);
      ctx.beginPath();
      ctx.moveTo(x, barsTop + barsH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, barsTop + barsH);
      ctx.fill();

      // Peak hold line
      if (v > st.peakHold[i]) st.peakHold[i] = v;
      else st.peakHold[i] = Math.max(0, st.peakHold[i] - PEAK_DECAY);

      if (st.peakHold[i] > 0.01) {
        const peakY = barsTop + barsH - st.peakHold[i] * barsH;
        ctx.fillStyle =
          st.peakHold[i] > 0.8
            ? "#ff4d8d"
            : st.peakHold[i] > 0.5
              ? "#ffe600"
              : "rgba(255,255,255,0.7)";
        ctx.fillRect(x, peakY, barW, 1.5);
        ctx.fillStyle = st.barGrad!;
      }
    }

    st.afr = requestAnimationFrame(draw);
  }, [onEnergy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      // Reset cached gradient on resize
      stateRef.current.barGradH = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const st = stateRef.current;
    st.afr = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(st.afr);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}
