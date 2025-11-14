// src/components/LiveWaveform.jsx
import { useEffect, useRef } from "react";

export default function LiveWaveform({ stream, active = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!stream || !active) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioCtx();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // background
      ctx.fillStyle = "rgba(15,23,42,1)"; // dark
      ctx.fillRect(0, 0, width, height);

      // waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(59,130,246,0.9)"; // blue-ish
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0–2
        const y = (v * height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      try {
        source.disconnect();
        analyser.disconnect();
      } catch {
        // ignore
      }
      audioContext.close();
    };
  }, [stream, active]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={70}
      className="w-full max-w-xs rounded-md border border-[var(--color-border)] bg-slate-900"
    />
  );
}
