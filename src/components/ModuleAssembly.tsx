import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const MODULES = [
  { label: "sync", icon: "⟲", x: -320, y: -120 },
  { label: "auth", icon: "🔑", x: 320, y: -120 },
  { label: "data", icon: "◆", x: -320, y: 120 },
  { label: "API", icon: "⟷", x: 320, y: 120 },
  { label: "docs", icon: "📄", x: 0, y: -200 },
  { label: "validate", icon: "✓", x: 0, y: 200 },
];

// Scattered starting positions (far from center)
const SCATTER = [
  { x: -600, y: -400 },
  { x: 700, y: -350 },
  { x: -500, y: 450 },
  { x: 650, y: 400 },
  { x: -100, y: -500 },
  { x: 150, y: 550 },
];

export const ModuleAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 1920 / 2;
  const cy = 1080 / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(100,200,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,200,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {MODULES.map((mod, index) => {
        const entryDelay = index * 15;
        const localFrame = Math.max(0, frame - entryDelay);

        const assembleProgress = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 40, mass: 1.2 },
        });

        // Interpolate from scattered position to final position
        const currentX = interpolate(
          assembleProgress,
          [0, 1],
          [SCATTER[index].x, mod.x]
        );
        const currentY = interpolate(
          assembleProgress,
          [0, 1],
          [SCATTER[index].y, mod.y]
        );

        const opacity = interpolate(localFrame, [0, 10], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Snap flash when module arrives (assembleProgress > 0.95)
        const isSnapped = assembleProgress > 0.95;
        const snapFrame = isSnapped ? frame : -100;
        const snapFlash = isSnapped
          ? interpolate(
              frame - entryDelay - 30,
              [0, 8],
              [0.6, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          : 0;

        // Module glow after snapping
        const glowIntensity = isSnapped
          ? 0.4 + Math.sin(frame * 0.06 + index) * 0.1
          : 0;

        const moduleWidth = 180;
        const moduleHeight = 100;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: cx + currentX - moduleWidth / 2,
              top: cy + currentY - moduleHeight / 2,
              width: moduleWidth,
              height: moduleHeight,
              opacity,
              borderRadius: 8,
              border: "1px solid rgba(100, 200, 255, 0.3)",
              background: `linear-gradient(135deg, rgba(100, 200, 255, 0.08) 0%, rgba(100, 200, 255, 0.02) 100%)`,
              boxShadow: `0 0 ${glowIntensity * 40}px rgba(100, 200, 255, ${glowIntensity * 0.5}), 0 0 ${snapFlash * 80}px rgba(255, 255, 255, ${snapFlash})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.8 }}>{mod.icon}</span>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                color: "rgba(100, 200, 255, 0.8)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {mod.label}
            </span>
          </div>
        );
      })}

      {/* Connection lines between snapped modules */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        {MODULES.map((mod, i) =>
          MODULES.slice(i + 1).map((other, j) => {
            const bothSnapped =
              frame > i * 15 + 35 && frame > (i + j + 1) * 15 + 35;
            if (!bothSnapped) return null;

            const lineOpacity = interpolate(
              frame - Math.max(i * 15 + 35, (i + j + 1) * 15 + 35),
              [0, 15],
              [0, 0.15],
              { extrapolateRight: "clamp" }
            );

            const dist = Math.sqrt(
              (mod.x - other.x) ** 2 + (mod.y - other.y) ** 2
            );
            if (dist > 400) return null;

            return (
              <line
                key={`${i}-${j}`}
                x1={cx + mod.x}
                y1={cy + mod.y}
                x2={cx + other.x}
                y2={cy + other.y}
                stroke="rgba(100, 200, 255, 0.5)"
                strokeWidth={1}
                opacity={lineOpacity}
              />
            );
          })
        )}
      </svg>
    </AbsoluteFill>
  );
};
