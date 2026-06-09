import React, { useEffect, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridBackgroundProps {
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  className?: string;
}

export function AnimatedGridBackground({
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  className,
}: AnimatedGridBackgroundProps) {
  const id = useId();
  const width = 40;
  const height = 40;
  const strokeDasharray = "0";

  const [squares, setSquares] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const newSquares = Array.from({ length: numSquares }, (_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 15) - 7,
      y: Math.floor(Math.random() * 15) - 7,
    }));
    setSquares(newSquares);
  }, [numSquares]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full stroke-slate-800/40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="50%"
          y={-1}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <svg x="50%" y={-1} className="overflow-visible">
        {squares.map(({ id: sqId, x, y }) => (
          <rect
            key={sqId}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
            className="text-indigo-500/10 transition-opacity duration-1000"
            style={{
              animation: `pulse ${duration}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              animationDelay: `${(sqId % 5) * repeatDelay}s`,
            }}
          />
        ))}
      </svg>
    </svg>
  );
}
