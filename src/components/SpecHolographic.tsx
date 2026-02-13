import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const TEXT = "specification-driven AI";

// Approximate character paths as simple rectangles for wireframe effect
// We'll use CSS outline/stroke techniques for the wireframe look

export const SpecHolographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-40): Grid backdrop fades in
  // Phase 2 (20-90): Wireframe outline of text draws in (left to right)
  // Phase 3 (90-150): Scan line sweeps, filling wireframe with solid white
  // Phase 4 (150-210): Settled with holographic shimmer

  const gridOpacity = interpolate(frame, [0, 40], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  // Wireframe draw progress (per character)
  const wireframeStart = 20;

  // Scan line position (percentage across screen)
  const scanStart = 90;
  const scanEnd = 150;
  const scanPosition = interpolate(frame, [scanStart, scanEnd], [-5, 105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Holographic shimmer
  const shimmerOffset = frame * 2;

  const fontSize = 72;
  const charWidth = 43.2;
  const totalWidth = TEXT.length * charWidth;
  const startX = (1920 - totalWidth) / 2;
  const centerY = 490;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      {/* Perspective grid floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "50%",
          opacity: gridOpacity,
          background: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(45deg)",
          transformOrigin: "center top",
        }}
      />

      {/* Horizontal grid lines behind text */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: gridOpacity * 0.4,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${i * 5 + 2}%`,
              height: "1px",
              backgroundColor: "rgba(6, 182, 212, 0.08)",
            }}
          />
        ))}
      </div>

      {/* Wireframe text layer */}
      <div
        style={{
          position: "absolute",
          left: startX,
          top: centerY,
        }}
      >
        {TEXT.split("").map((char, i) => {
          if (char === " ") {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: charWidth,
                }}
              />
            );
          }

          const charDrawDelay = wireframeStart + i * 2.5;
          const charFrame = Math.max(0, frame - charDrawDelay);

          if (charFrame === 0) return null;

          // Wireframe appears via spring
          const wireSpring = spring({
            frame: charFrame,
            fps,
            config: { damping: 20, stiffness: 120, mass: 0.5 },
          });

          // Calculate fill based on scan line position
          const charCenterPercent = ((startX + i * charWidth + charWidth / 2) / 1920) * 100;
          const distFromScan = scanPosition - charCenterPercent;
          const fillProgress = frame >= scanStart
            ? interpolate(distFromScan, [-5, 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;

          const isFilled = fillProgress > 0.5;

          // Wireframe color with holographic shift
          const hue = (180 + i * 3 + shimmerOffset * 0.5) % 360;
          const wireColor = `hsl(${hue}, 80%, 60%)`;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Courier New', monospace",
                fontSize,
                fontWeight: "bold",
                width: charWidth,
                textAlign: "center",
                opacity: wireSpring,
                transform: `translateY(${(1 - wireSpring) * 30}px)`,
                color: isFilled ? "#ffffff" : "transparent",
                WebkitTextStroke: isFilled ? "none" : `1.5px ${wireColor}`,
                textShadow: isFilled
                  ? `0 0 20px rgba(255, 255, 255, 0.15), 0 0 40px rgba(6, 182, 212, ${0.1 + Math.sin(frame * 0.05 + i * 0.3) * 0.05})`
                  : `0 0 8px ${wireColor}`,
                transition: "color 0.1s, -webkit-text-stroke 0.1s",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Scan line */}
      {frame >= scanStart && frame <= scanEnd + 10 && (
        <div
          style={{
            position: "absolute",
            left: `${scanPosition}%`,
            top: 0,
            width: "3px",
            height: "100%",
            background: "linear-gradient(180deg, transparent 20%, #06b6d4 40%, #ffffff 50%, #06b6d4 60%, transparent 80%)",
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)",
            opacity: interpolate(
              frame,
              [scanStart, scanStart + 5, scanEnd - 5, scanEnd + 10],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        />
      )}

      {/* Horizontal scan line glow on text */}
      {frame >= scanStart && frame <= scanEnd && (
        <div
          style={{
            position: "absolute",
            left: `${scanPosition - 3}%`,
            top: centerY - 20,
            width: "6%",
            height: fontSize + 40,
            background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.15), rgba(255, 255, 255, 0.1), rgba(6, 182, 212, 0.15), transparent)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Subtitle after fill */}
      {frame > scanEnd + 10 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: centerY + fontSize + 30,
            transform: "translateX(-50%)",
            fontFamily: "'Courier New', monospace",
            fontSize: 18,
            color: "#06b6d4",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: interpolate(frame - scanEnd - 10, [0, 20], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
            textShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
          }}
        >
          beyond vibe-coding
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
          background: "radial-gradient(ellipse at center, transparent 35%, #0a0a0f 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
