import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Pillar = {
  text: string;
  accentColor: string;
  glowColor: string;
};

const PILLARS: Pillar[] = [
  {
    text: "local-first software",
    accentColor: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.4)",
  },
  {
    text: "decentralized technologies",
    accentColor: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.4)",
  },
  {
    text: "open-source AI",
    accentColor: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
];

type Props = {
  staggerFrames?: number;
};

export const PillarReveal: React.FC<Props> = ({
  staggerFrames = 35,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Subtle radial background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
        }}
      >
        {PILLARS.map((pillar, index) => {
          const entryFrame = index * staggerFrames;
          const localFrame = Math.max(0, frame - entryFrame);
          const isVisible = frame >= entryFrame;

          if (!isVisible) return null;

          // Text slides in and fades
          const slideIn = spring({
            frame: localFrame,
            fps,
            config: { damping: 22, stiffness: 80, mass: 0.8 },
          });

          const opacity = interpolate(localFrame, [0, 12], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Highlight sweep: a glow that sweeps left to right across the text
          const sweepProgress = interpolate(
            localFrame,
            [5, 25],
            [-0.2, 1.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Underline draws in
          const underlineWidth = interpolate(
            localFrame,
            [8, 22],
            [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Glow intensity after reveal
          const steadyGlow =
            localFrame > 25
              ? 0.6 + Math.sin((localFrame - 25) * 0.04 + index * 2) * 0.15
              : interpolate(localFrame, [10, 25], [0, 0.6], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

          return (
            <div
              key={index}
              style={{
                position: "relative",
                opacity,
                transform: `translateY(${(1 - slideIn) * 40}px)`,
              }}
            >
              {/* Highlight sweep overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  left: `${sweepProgress * 100 - 30}%`,
                  width: "30%",
                  height: "140%",
                  background: `linear-gradient(90deg, transparent, ${pillar.glowColor}, transparent)`,
                  filter: "blur(20px)",
                  opacity: sweepProgress > 0 && sweepProgress < 1.2 ? 0.8 : 0,
                  pointerEvents: "none",
                }}
              />

              {/* Text */}
              <div
                style={{
                  fontFamily: "system-ui, -apple-system, 'Helvetica Neue', sans-serif",
                  fontSize: 64,
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  textShadow: `0 0 ${steadyGlow * 30}px ${pillar.glowColor}`,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {pillar.text}
              </div>

              {/* Accent underline */}
              <div
                style={{
                  height: 3,
                  width: `${underlineWidth}%`,
                  background: `linear-gradient(90deg, ${pillar.accentColor}, ${pillar.accentColor}88)`,
                  marginTop: 8,
                  borderRadius: 2,
                  boxShadow: `0 0 12px ${pillar.glowColor}`,
                  transition: "none",
                }}
              />

              {/* Small accent dot */}
              <div
                style={{
                  position: "absolute",
                  left: -30,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: pillar.accentColor,
                  opacity: interpolate(localFrame, [15, 22], [0, 0.8], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  boxShadow: `0 0 10px ${pillar.glowColor}`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
