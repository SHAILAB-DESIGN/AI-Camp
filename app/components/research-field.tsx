"use client";

import { useEffect, useRef } from "react";

type LatticeNode = { x: number; y: number; z: number };
type ProjectedNode = { x: number; y: number; depth: number; scale: number };
type Fragment = { x: number; y: number; scale: number; phase: number };

const GRID_SIZE = 5;
const HALF_GRID = (GRID_SIZE - 1) / 2;

const latticeNodes: LatticeNode[] = Array.from(
  { length: GRID_SIZE * GRID_SIZE * GRID_SIZE },
  (_, index) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE) % GRID_SIZE;
    const z = Math.floor(index / (GRID_SIZE * GRID_SIZE));
    return { x: x - HALF_GRID, y: y - HALF_GRID, z: z - HALF_GRID };
  },
);

const latticeEdges = latticeNodes.flatMap((_, index) => {
  const x = index % GRID_SIZE;
  const y = Math.floor(index / GRID_SIZE) % GRID_SIZE;
  const z = Math.floor(index / (GRID_SIZE * GRID_SIZE));
  const edges: Array<[number, number]> = [];

  if (x < GRID_SIZE - 1) edges.push([index, index + 1]);
  if (y < GRID_SIZE - 1) edges.push([index, index + GRID_SIZE]);
  if (z < GRID_SIZE - 1) edges.push([index, index + GRID_SIZE * GRID_SIZE]);
  return edges;
});

const cubeNodes: LatticeNode[] = [
  { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
];

const cubeEdges: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

const fragments: Fragment[] = [
  { x: 0.13, y: 0.24, scale: 0.9, phase: 0.2 },
  { x: 0.21, y: 0.73, scale: 0.72, phase: 1.4 },
  { x: 0.79, y: 0.28, scale: 0.68, phase: 1.8 },
  { x: 0.87, y: 0.76, scale: 0.84, phase: 2.8 },
];

export default function ResearchField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const projectLattice = (
      node: LatticeNode,
      time: number,
      centerX: number,
      centerY: number,
      spacing: number,
      phase: number,
    ): ProjectedNode => {
      const rotationX = time * 0.11 + phase * 0.44;
      const rotationY = time * 0.085 + phase;
      const rotationZ = Math.sin(time * 0.07 + phase) * 0.1;
      const sourceX = node.x * spacing;
      const sourceY = node.y * spacing;
      const sourceZ = node.z * spacing;
      const yAfterX = sourceY * Math.cos(rotationX) - sourceZ * Math.sin(rotationX);
      const zAfterX = sourceY * Math.sin(rotationX) + sourceZ * Math.cos(rotationX);
      const xAfterY = sourceX * Math.cos(rotationY) + zAfterX * Math.sin(rotationY);
      const zAfterY = -sourceX * Math.sin(rotationY) + zAfterX * Math.cos(rotationY);
      const xAfterZ = xAfterY * Math.cos(rotationZ) - yAfterX * Math.sin(rotationZ);
      const yAfterZ = xAfterY * Math.sin(rotationZ) + yAfterX * Math.cos(rotationZ);
      const scale = 560 / (560 + zAfterY);

      return {
        x: centerX + xAfterZ * scale,
        y: centerY + yAfterZ * scale,
        depth: zAfterY,
        scale,
      };
    };

    const drawLattice = (
      time: number,
      centerX: number,
      centerY: number,
      spacing: number,
      phase: number,
      opacity: number,
    ) => {
      const projected = latticeNodes.map((node) =>
        projectLattice(node, time, centerX, centerY, spacing, phase),
      );
      const pulse = 0.84 + Math.sin(time * 0.42 + phase) * 0.16;

      context.save();
      context.lineWidth = 0.75;
      latticeEdges.forEach(([fromIndex, toIndex]) => {
        const from = projected[fromIndex];
        const to = projected[toIndex];
        const depth = Math.max(0.36, Math.min(1, 0.68 - (from.depth + to.depth) / 520));
        context.strokeStyle = `rgba(246, 245, 240, ${opacity * depth * pulse})`;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      });

      projected.forEach((node, index) => {
        const depth = Math.max(0.32, Math.min(1, 0.7 - node.depth / 260));
        const emphasis = index % 7 === 0 ? 1.7 : 1;
        context.fillStyle = `rgba(246, 245, 240, ${opacity * depth * emphasis * 1.35})`;
        context.beginPath();
        context.arc(node.x, node.y, Math.max(0.8, 1.45 * node.scale), 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    };

    const drawFragments = (time: number, compact: boolean) => {
      fragments.slice(0, compact ? 4 : fragments.length).forEach((fragment, index) => {
        const driftX = Math.sin(time * 0.13 + fragment.phase) * 3;
        const driftY = Math.cos(time * 0.11 + fragment.phase) * 2;
        const opacity = index % 2 === 0 ? 0.095 : 0.07;
        const projected = cubeNodes.map((node) =>
          projectLattice(
            node,
            time * 0.72,
            width * fragment.x + driftX,
            height * fragment.y + driftY,
            (compact ? 12 : 16) * fragment.scale,
            fragment.phase,
          ),
        );

        context.save();
        context.lineWidth = 0.8;
        cubeEdges.forEach(([fromIndex, toIndex]) => {
          const from = projected[fromIndex];
          const to = projected[toIndex];
          context.strokeStyle = `rgba(246, 245, 240, ${opacity})`;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        });
        projected.forEach((node) => {
          context.fillStyle = `rgba(246, 245, 240, ${opacity * 1.5})`;
          context.beginPath();
          context.arc(node.x, node.y, 0.9, 0, Math.PI * 2);
          context.fill();
        });
        context.restore();
      });
    };

    const draw = (milliseconds = 0) => {
      const time = milliseconds / 1000;
      const compact = width < 760;
      context.clearRect(0, 0, width, height);

      if (compact) {
        drawLattice(time, width * 0.96, height * 0.5, 48, 0.2, 0.16);
        drawLattice(time, width * 0.01, height * 0.66, 35, 2.3, 0.1);
      } else {
        drawLattice(time, width * 0.94, height * 0.48, 70, 0.2, 0.2);
        drawLattice(time, width * 0.02, height * 0.62, 52, 2.3, 0.13);
      }
      drawFragments(time, compact);
    };

    const animate = (time: number) => {
      draw(time);
      if (running && visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    };

    const restart = () => {
      cancelAnimationFrame(frame);
      if (running && visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
      else draw(0);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      restart();
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    const handleMotionChange = () => restart();

    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    reducedMotion.addEventListener("change", handleMotionChange);
    resize();
    restart();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="research-field" aria-hidden="true" />;
}
