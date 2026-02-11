import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const TIERS = [
  { label: "infrastructure", color: "#22c55e", glowColor: "rgba(34, 197, 94, 0.3)" },
  { label: "protocols", color: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.3)" },
  { label: "applications", color: "#f0f0f0", glowColor: "rgba(240, 240, 240, 0.2)" },
];

export const ThreeTierStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tierHeight = 140;
  const tierWidth = 700;
  const gap = 24;
  const totalHeight = TIERS.length * tierHeight + (TIERS.length - 1) * gap;
  const startY = (1080 - totalHeight) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {TIERS.map((tier, index) => {
        const entryDelay = index * 30;
        const localFrame = Math.max(0, frame - entryDelay);

        const slideUp = spring({
          frame: localFrame,
          fps,
          config: { damping: 18, stiffness: 60, mass: 1 },
        });

        const opacity = interpolate(localFrame, [0, 15], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Activation glow pulse
        const glowIntensity =
          localFrame > 20
            ? 0.6 + Math.sin((localFrame - 20) * 0.08) * 0.2
            : interpolate(localFrame, [0, 20], [0, 0.6], {
                extrapolateRight: "clamp",
              });

        const y = startY + index * (tierHeight + gap);

        // Data flow particles between tiers
        const showDataFlow = localFrame > 25;
        const dataFlowY = showDataFlow
          ? y + tierHeight + ((frame * 2 + index * 20) % (gap + tierHeight)) - tierHeight
          : 0;

        // Connection lines between tiers
        const showConnection = index > 0 && frame > entryDelay + 10;
        const connectionOpacity = showConnection
          ? interpolate(frame - entryDelay - 10, [0, 15], [0, 0.4], {
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <React.Fragment key={index}>
            {/* Connection line to tier above */}
            {showConnection && (
              <div
                style={{
                  position: "absolute",
                  left: 1920 / 2 - 1,
                  top: y - gap,
                  width: 2,
                  height: gap,
                  background: `linear-gradient(to bottom, ${TIERS[index - 1].color}, ${tier.color})`,
                  opacity: connectionOpacity,
                }}
              />
            )}

            {/* Tier container */}
            <div
              style={{
                position: "absolute",
                left: (1920 - tierWidth) / 2,
                top: y + (1 - slideUp) * 60,
                width: tierWidth,
                height: tierHeight,
                opacity,
                borderRadius: 12,
                border: `1px solid ${tier.color}40`,
                background: `linear-gradient(135deg, ${tier.color}10 0%, ${tier.color}05 100%)`,
                boxShadow: `0 0 ${glowIntensity * 60}px ${tier.glowColor}, inset 0 0 ${glowIntensity * 30}px ${tier.color}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Grid lines inside tier */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
                    linear-gradient(${tier.color}08 1px, transparent 1px),
                    linear-gradient(90deg, ${tier.color}08 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                  opacity: glowIntensity,
                }}
              />

              {/* Label */}
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 28,
                  color: tier.color,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: interpolate(localFrame, [10, 25], [0, 0.8], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  zIndex: 1,
                }}
              >
                {tier.label}
              </span>

              {/* Scanning line effect */}
              {localFrame > 15 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: `${((frame * 1.5 + index * 30) % 200) - 20}%`,
                    width: "100%",
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${tier.color}30, transparent)`,
                  }}
                />
              )}
            </div>

            {/* Data flow dots */}
            {showDataFlow && index < TIERS.length - 1 && (
              <>
                {[0, 1, 2].map((dot) => {
                  const dotProgress =
                    ((frame * 1.5 + dot * 20 + index * 15) % 60) / 60;
                  const dotY = y + tierHeight + dotProgress * (gap + 10) - 5;
                  const dotX = 1920 / 2 + (dot - 1) * 30;
                  return (
                    <div
                      key={dot}
                      style={{
                        position: "absolute",
                        left: dotX - 2,
                        top: dotY,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: tier.color,
                        opacity: 0.6,
                        boxShadow: `0 0 6px ${tier.color}`,
                      }}
                    />
                  );
                })}
              </>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
