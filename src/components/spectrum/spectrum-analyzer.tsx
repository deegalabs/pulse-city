"use client";

import { useEffect, useRef, useCallback } from "react";
import { getAnalyzerData } from "@strudel/webaudio";

const SPECTROGRAM_ROWS = 60;
const SMOOTH_ALPHA = 0.82;
const PEAK_DECAY = 0.008;

function spectroColor(v: number): string {
  if (v < 0.15) return `rgba(20,50,90,${v * 5})`;
  if (v < 0.3) return `rgba(30,120,180,${0.4 + v})`;
  if (v < 0.5) return `rgba(58,165,255,${0.5 + v * 0.5})`;
  if (v < 0.7) return `rgba(162,215,41,${0.6 + v * 0.3})`;
  if (v < 0.85) return `rgba(255,230,0,${0.7 + v * 0.2})`;
  return `rgba(255,77,141,${0.8 + v * 0.2})`;
}

interface SpectrumAnalyzerProps {
  onEnergy?: (energy: number, isBeat: boolean) => void;
}

export function SpectrumAnalyzer({ onEnergy }: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    frameCount: 0,
    peakHold: [] as number[],
    smoothed: [] as number[],
    spectrogramData: [] as number[][],
    prevEnergy: 0,
    beatFlash: 0,
    afr: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = stateRef.current;
    st.frameCount++;

    let freqData: Uint8Array | Float32Array | undefined;
    let timeData: Uint8Array | Float32Array | undefined;
    try {
      freqData = getAnalyzerData("frequency", 1);
    } catch {}
    try {
      timeData = getAnalyzerData("time", 1);
    } catch {}

    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) {
      st.afr = requestAnimationFrame(draw);
      return;
    }

    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(0, 0, W, H);

    const bottomPad = 16;
    const spectroH = 36;
    const waveH = 40;
    const barsTop = waveH + 4;
    const barsH = H - bottomPad - spectroH - barsTop - 6;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
      const y = barsTop + (i / 6) * barsH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    if (!freqData?.length) {
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
    const usable = Math.floor(freqData.length * 0.65);
    while (st.peakHold.length < bars) st.peakHold.push(0);
    while (st.smoothed.length < bars) st.smoothed.push(0);

    // Energy + beat detection
    let totalEnergy = 0;
    let bassEnergy = 0;
    for (let i = 0; i < freqData.length; i++) {
      totalEnergy += freqData[i];
      if (i < freqData.length * 0.1) bassEnergy += freqData[i];
    }
    totalEnergy /= freqData.length;
    bassEnergy /= freqData.length * 0.1;
    const energyNorm = totalEnergy / 255;
    const bassNorm = bassEnergy / 255;
    const isBeat = bassNorm > 0.55 && bassNorm > st.prevEnergy * 1.15;
    st.prevEnergy = bassNorm * 0.7 + st.prevEnergy * 0.3;
    if (isBeat) st.beatFlash = 1;
    else st.beatFlash *= 0.88;

    onEnergy?.(Math.round(energyNorm * 100), isBeat);

    // Beat flash
    if (st.beatFlash > 0.05) {
      ctx.fillStyle = `rgba(162, 215, 41, ${st.beatFlash * 0.06})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Frequency bars
    for (let i = 0; i < bars; i++) {
      const t = Math.pow(i / bars, 1.7);
      const idx = Math.floor(t * usable);
      const raw = (freqData[idx] || 0) / 255;
      st.smoothed[i] = st.smoothed[i] * SMOOTH_ALPHA + raw * (1 - SMOOTH_ALPHA);
      const v = st.smoothed[i];
      const h = Math.max(1, v * barsH);
      const x = i * (barW + gap);
      const y = barsTop + barsH - h;

      const grad = ctx.createLinearGradient(x, barsTop + barsH, x, y);
      grad.addColorStop(0, "rgba(30,58,95,0.6)");
      grad.addColorStop(0.2, "#1a6fb5");
      grad.addColorStop(0.45, "#3aa5ff");
      grad.addColorStop(0.65, "#5ecc52");
      grad.addColorStop(0.8, "#a2d729");
      grad.addColorStop(0.92, "#ffe600");
      grad.addColorStop(1, "#ff4d8d");
      ctx.fillStyle = grad;

      const r = Math.min(barW / 2, 2);
      ctx.beginPath();
      ctx.moveTo(x, barsTop + barsH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, barsTop + barsH);
      ctx.fill();

      // Glow on loud
      if (v > 0.55) {
        ctx.shadowColor = v > 0.75 ? "#ffe600" : "#a2d729";
        ctx.shadowBlur = 6 + v * 8;
        ctx.fillStyle = `rgba(162,215,41,${(v - 0.55) * 0.2})`;
        ctx.fillRect(x - 1, y - 2, barW + 2, 4);
        ctx.shadowBlur = 0;
      }

      // Peak hold
      if (v > st.peakHold[i]) st.peakHold[i] = v;
      else st.peakHold[i] = Math.max(0, st.peakHold[i] - PEAK_DECAY);
      const peakY = barsTop + barsH - st.peakHold[i] * barsH;
      ctx.fillStyle =
        st.peakHold[i] > 0.8
          ? "#ff4d8d"
          : st.peakHold[i] > 0.5
            ? "#ffe600"
            : "#fff";
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x, peakY, barW, 1.5);
      ctx.globalAlpha = 1;
    }

    // Waveform overlay
    if (timeData?.length) {
      const mid = waveH / 2;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(58,165,255,${0.3 + energyNorm * 0.4})`;
      ctx.lineWidth = 1.5;
      const sliceW = W / timeData.length;
      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128 - 1;
        const y = mid + v * (waveH * 0.4);
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * sliceW, y);
      }
      ctx.stroke();
      ctx.lineTo(W, mid);
      ctx.lineTo(0, mid);
      ctx.closePath();
      ctx.fillStyle = `rgba(58,165,255,${0.03 + energyNorm * 0.04})`;
      ctx.fill();
    }

    // Spectrogram
    const spectroY = H - bottomPad - spectroH;
    const rowCols = Math.min(bars, 128);
    if (st.frameCount % 2 === 0) {
      const row: number[] = [];
      for (let i = 0; i < rowCols; i++) {
        const t = Math.pow(i / rowCols, 1.7);
        const idx = Math.floor(t * usable);
        row.push((freqData[idx] || 0) / 255);
      }
      st.spectrogramData.push(row);
      if (st.spectrogramData.length > SPECTROGRAM_ROWS)
        st.spectrogramData.shift();
    }
    const rowH = spectroH / SPECTROGRAM_ROWS;
    const colW = W / rowCols;
    for (let ri = 0; ri < st.spectrogramData.length; ri++) {
      const row = st.spectrogramData[ri];
      const ry = spectroY + (SPECTROGRAM_ROWS - 1 - ri) * rowH;
      for (let c = 0; c < row.length; c++) {
        const v = row[c];
        if (v < 0.02) continue;
        ctx.fillStyle = spectroColor(v);
        ctx.fillRect(c * colW, ry, colW + 0.5, rowH + 0.5);
      }
    }

    // Frequency labels
    ctx.fillStyle = "#3a4560";
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ["50", "100", "200", "500", "1k", "2k", "5k", "10k", "20k"].forEach(
      (label, i, arr) => {
        ctx.fillText(label, ((i + 0.5) / arr.length) * W, H - 3);
      }
    );

    st.afr = requestAnimationFrame(draw);
  }, [onEnergy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    });
    ro.observe(canvas);

    // Initial size
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

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
      style={{ imageRendering: "pixelated" }}
    />
  );
}
