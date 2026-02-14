import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

const TEXT = "specification-driven AI";
const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]<>/\\|~`";

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

type CharState = {
  char: string;
  finalX: number;
  finalY: number;
  startX: number;
  startY: number;
  startRotation: number;
  delay: number;
};

export const SpecChaosToOrder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Build character layout
  const fontSize = 72;
  const charWidth = 43.2; // approximate monospace width at 72px
  const totalWidth = TEXT.length * charWidth;
  const startX = (1920 - totalWidth) / 2;
  const centerY = 540;

  const chars: CharState[] = TEXT.split("").map((char, i) => ({
    char,
    finalX: startX + i * charWidth,
    finalY: centerY - fontSize / 2,
    startX: seededRandom(i * 3 + 1) * 1920,
    startY: seededRandom(i * 3 + 2) * 1080,
    startRotation: (seededRandom(i * 3 + 3) - 0.5) * 720,
    delay: i * 1.2,
  }));

  // Phase 1 (0-60): Pure chaos — random chars flying around
  // Phase 2 (60-150): Characters converge to final positions
  // Phase 3 (150-180): Lock in + green validation pulse
  // Phase 4 (180-210): Settled with subtle glow

  const chaosPhase = frame < 60;
  const convergeStart = 60;
  const lockFrame = 150;

  // Validation checkmark
  const checkScale = frame > lockFrame
    ? spring({ frame: frame - lockFrame, fps, config: { damping: 8, stiffness: 100, mass: 0.6 } })
    : 0;

  const checkOpacity = frame > lockFrame
    ? interpolate(frame - lockFrame, [0, 10, 40, 60], [0, 1, 1, 0.7], { extrapolateRight: "clamp" })
    : 0;

  // Flash on lock
  const flashOpacity = frame > lockFrame
    ? interpolate(frame - lockFrame, [0, 5, 20], [0.6, 0.3, 0], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(51, 255, 51, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 255, 51, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />

      {/* Scattered random noise characters in background */}
      {chaosPhase &&
        Array.from({ length: 80 }).map((_, i) => {
          const x = (seededRandom(i * 7 + frame * 0.02) * 1920);
          const y = (seededRandom(i * 11 + frame * 0.03) * 1080);
          const charIdx = Math.floor(seededRandom(i * 13 + frame * 0.5) * RANDOM_CHARS.length);
          const opacity = interpolate(frame, [40, 60], [0.15, 0], { extrapolateRight: "clamp" });
          return (
            <span
              key={`noise-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontFamily: "'Courier New', monospace",
                fontSize: 16 + seededRandom(i) * 20,
                color: seededRandom(i * 3) > 0.5 ? "#33FF33" : "#06b6d4",
                opacity,
              }}
            >
              {RANDOM_CHARS[charIdx]}
            </span>
          );
        })}

      {/* Main characters */}
      {chars.map((c, i) => {
        if (c.char === " ") return null;

        let x: number, y: number, rotation: number, opacity: number;
        let displayChar = c.char;
        let color = "#ffffff";

        if (frame < convergeStart) {
          // Chaos phase: float around with swapped characters
          const drift = frame * 0.5;
          x = c.startX + Math.sin(drift * 0.03 + i) * 60;
          y = c.startY + Math.cos(drift * 0.04 + i * 1.3) * 40;
          rotation = c.startRotation + frame * (seededRandom(i * 5) - 0.5) * 3;
          opacity = interpolate(frame, [0, 15 + i * 1.5], [0, 0.6], { extrapolateRight: "clamp" });
          // Show random chars during chaos
          const charIdx = Math.floor(seededRandom(i * 17 + Math.floor(frame / 3)) * RANDOM_CHARS.length);
          displayChar = RANDOM_CHARS[charIdx];
          color = seededRandom(i * 9) > 0.5 ? "#33FF33" : "#06b6d4";
        } else if (frame < lockFrame) {
          // Converge phase
          const progress = interpolate(
            frame - convergeStart - c.delay,
            [0, 70],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const eased = spring({
            frame: Math.max(0, frame - convergeStart - c.delay),
            fps,
            config: { damping: 14, stiffness: 80, mass: 0.8 },
          });

          x = interpolate(eased, [0, 1], [c.startX, c.finalX]);
          y = interpolate(eased, [0, 1], [c.startY, c.finalY]);
          rotation = interpolate(eased, [0, 1], [c.startRotation * 0.3, 0]);
          opacity = interpolate(progress, [0, 0.3], [0.6, 1], { extrapolateRight: "clamp" });

          // Transition from random char to real char
          if (progress < 0.5) {
            const charIdx = Math.floor(seededRandom(i * 17 + Math.floor(frame / 2)) * RANDOM_CHARS.length);
            displayChar = RANDOM_CHARS[charIdx];
            color = progress < 0.3
              ? (seededRandom(i * 9) > 0.5 ? "#33FF33" : "#06b6d4")
              : "#ffffff";
          } else {
            displayChar = c.char;
            color = "#ffffff";
          }
        } else {
          // Locked phase
          x = c.finalX;
          y = c.finalY;
          rotation = 0;
          opacity = 1;
          displayChar = c.char;
          color = "#ffffff";
        }

        // Subtle glow after lock
        const glowIntensity = frame > lockFrame
          ? interpolate(frame - lockFrame, [0, 20], [0.8, 0.2], { extrapolateRight: "clamp" })
          : 0;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: "'Courier New', monospace",
              fontSize,
              fontWeight: "bold",
              color,
              opacity,
              transform: `rotate(${rotation}deg)`,
              textShadow: glowIntensity > 0
                ? `0 0 ${glowIntensity * 20}px rgba(51, 255, 51, ${glowIntensity}), 0 0 ${glowIntensity * 40}px rgba(6, 182, 212, ${glowIntensity * 0.5})`
                : "none",
              whiteSpace: "pre",
            }}
          >
            {displayChar}
          </span>
        );
      })}

      {/* Green validation flash on lock */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#33FF33",
            opacity: flashOpacity * 0.15,
          }}
        />
      )}

      {/* Validation checkmark */}
      {checkScale > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: centerY + fontSize + 20,
            transform: `translateX(-50%) scale(${checkScale})`,
            opacity: checkOpacity,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Img
            src={staticFile("brand/Vetra-white.svg")}
            style={{
              height: 24,
              objectFit: "contain",
            }}
          />
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="#33FF33" strokeWidth="2" fill="rgba(51, 255, 51, 0.1)" />
            <path d="M10 18 L16 24 L26 12" stroke="#33FF33" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 20,
              color: "#33FF33",
              textShadow: "0 0 8px rgba(51, 255, 51, 0.4)",
              letterSpacing: "0.05em",
            }}
          >
            validated
          </span>
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, #0a0a0f 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
