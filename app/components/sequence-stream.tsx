"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = "INTERNINKSTONE".split("");
const WORD = "INTERNINKSTONE";

type AsciiCell = {
  char: string;
  alpha: number;
  target: number;
  color: "blue" | "white";
};

export default function SequenceStream({ variant = "hero" }: { variant?: "hero" | "registration" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isRegistration = variant === "registration";
    const cellWidth = isRegistration ? 15 : 18;
    const cellHeight = isRegistration ? 18 : 20;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let cells: AsciiCell[] = [];
    let animationFrame = 0;
    let lastMutation = 0;
    let nextWordAt = 0;

    const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const randomColor = (): AsciiCell["color"] => (
      isRegistration
        ? (Math.random() > 0.38 ? "white" : "blue")
        : (Math.random() > 0.5 ? "blue" : "white")
    );

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      columns = Math.max(12, Math.ceil(width / cellWidth));
      rows = Math.max(8, Math.ceil(height / cellHeight));
      cells = Array.from({ length: columns * rows }, () => ({
        char: randomSymbol(),
        alpha: Math.random() * (isRegistration ? 0.28 : 0.18),
        target: Math.random() > (isRegistration ? 0.6 : 0.72) ? 0.2 + Math.random() * 0.5 : 0.02,
        color: randomColor(),
      }));
      nextWordAt = performance.now() + 900;
    };

    const mutateField = (time: number) => {
      const mutationCount = Math.max(3, Math.floor(cells.length * 0.035));
      for (let index = 0; index < mutationCount; index += 1) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        cell.char = randomSymbol();
        cell.color = randomColor();
        cell.target = Math.random() > 0.58 ? 0.24 + Math.random() * 0.7 : 0.015;
      }

      if (time >= nextWordAt && columns > WORD.length + 2) {
        const row = 1 + Math.floor(Math.random() * Math.max(1, rows - 3));
        const start = Math.floor(Math.random() * Math.max(1, columns - WORD.length - 1));
        WORD.split("").forEach((char, offset) => {
          const cell = cells[row * columns + start + offset];
          if (!cell) return;
          cell.char = char;
          cell.color = randomColor();
          cell.target = 0.72 + Math.random() * 0.25;
        });
        nextWordAt = time + 1500 + Math.random() * 1500;
      }
    };

    const draw = (time: number) => {
      if (!reducedMotion.matches && time - lastMutation > 110) {
        mutateField(time);
        lastMutation = time;
      }

      context.clearRect(0, 0, width, height);
      context.font = `700 ${isRegistration ? 10 : 11}px "Courier New", ui-monospace, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      cells.forEach((cell, index) => {
        cell.alpha += (cell.target - cell.alpha) * (reducedMotion.matches ? 1 : 0.075);
        if (!reducedMotion.matches && Math.abs(cell.alpha - cell.target) < 0.015 && Math.random() > 0.992) {
          cell.target = cell.target > 0.2 ? 0.02 : 0.18 + Math.random() * 0.55;
        }
        const column = index % columns;
        const row = Math.floor(index / columns);
        const edgeFade = Math.min(1, row / 2, (rows - row) / 2);
        const horizontalEdge = Math.abs(((column + 0.5) / columns) - 0.5) * 2;
        const isWhite = isRegistration && horizontalEdge > 0.72 ? true : cell.color === "white";
        const rgb = isWhite ? "255,255,255" : "12,60,128";
        context.fillStyle = `rgba(${rgb},${cell.alpha * Math.max(0, edgeFade)})`;
        const x = column * cellWidth + cellWidth / 2;
        context.fillText(cell.char, x, row * cellHeight + cellHeight / 2);
      });

      if (!reducedMotion.matches) animationFrame = requestAnimationFrame(draw);
    };

    const restart = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      resize();
      restart();
    });
    observer.observe(canvas);
    reducedMotion.addEventListener("change", restart);
    resize();
    restart();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", restart);
      cancelAnimationFrame(animationFrame);
    };
  }, [variant]);

  return (
    <div className={`hero-sequence-stream hero-ascii-field hero-sequence-stream-${variant}`} aria-hidden="true">
      <canvas ref={canvasRef} />
      {variant === "hero" && (
        <div className="hero-sequence-terminal">
          <span>[ INTERNINKSTONE ]</span>
          <span>{"{ MOTION = RANDOM_FADE }"}</span>
          <span>// ASCII_FIELD</span>
        </div>
      )}
    </div>
  );
}
