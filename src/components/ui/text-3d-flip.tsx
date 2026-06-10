"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text3DFlipProps {
  children: string;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  rotateDirection?: "top" | "bottom";
  staggerDuration?: number;
  transition?: any;
}

export default function Text3DFlip({
  children,
  className,
  textClassName,
  flipTextClassName,
  rotateDirection = "top",
  staggerDuration = 0.02,
  transition = { type: "spring", damping: 22, stiffness: 180 }
}: Text3DFlipProps) {
  const words = children.split(" ");

  const getRotationStyles = (isFlip: boolean) => {
    if (rotateDirection === "top") {
      return {
        initial: { rotateX: 0, y: 0, opacity: 1 },
        hover: { rotateX: isFlip ? 0 : 90, y: isFlip ? 0 : -12, opacity: isFlip ? 1 : 0 },
        flipInitial: { rotateX: -90, y: 12, opacity: 0 },
        flipHover: { rotateX: 0, y: 0, opacity: 1 }
      };
    } else {
      return {
        initial: { rotateX: 0, y: 0, opacity: 1 },
        hover: { rotateX: isFlip ? 0 : -90, y: isFlip ? 0 : 12, opacity: isFlip ? 1 : 0 },
        flipInitial: { rotateX: 90, y: -12, opacity: 0 },
        flipHover: { rotateX: 0, y: 0, opacity: 1 }
      };
    }
  };

  const animationStyles = getRotationStyles(false);
  const flipAnimationStyles = getRotationStyles(true);

  let letterIndex = 0;

  return (
    <span
      className={cn("relative inline-block py-1 cursor-default select-none", className)}
      aria-label={children}
    >
      <span className="sr-only">{children}</span>
      <motion.span
        className="inline-flex flex-wrap justify-start relative gap-x-[0.25em]"
        aria-hidden="true"
        initial="initial"
        whileHover="hover"
      >
        {words.map((word, wordIdx) => {
          const chars = word.split("");
          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {chars.map((char, charIdx) => {
                const currentIndex = letterIndex++;
                return (
                  <span
                    key={charIdx}
                    className="relative inline-block h-full overflow-visible"
                    style={{ perspective: "600px" }}
                  >
                    {/* Primary letter */}
                    <motion.span
                      className={cn("inline-block origin-bottom transition-colors", textClassName)}
                      variants={{
                        initial: animationStyles.initial,
                        hover: animationStyles.hover
                      }}
                      transition={{
                        ...transition,
                        delay: currentIndex * staggerDuration
                      }}
                    >
                      {char}
                    </motion.span>
                    {/* Secondary/Flipped letter */}
                    <motion.span
                      className={cn(
                        "absolute inset-0 inline-block origin-top transition-colors",
                        flipTextClassName
                      )}
                      variants={{
                        initial: flipAnimationStyles.flipInitial,
                        hover: flipAnimationStyles.flipHover
                      }}
                      transition={{
                        ...transition,
                        delay: currentIndex * staggerDuration
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}
