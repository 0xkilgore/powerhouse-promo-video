import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// Simulates a terminal booting up and shifting from green monochrome to full color
const CODE_LINES = [
  "$ INITIALIZING NEW PROTOCOL...",
  ">> loading local-first modules    [OK]",
  ">> connecting peer nodes           [OK]",
  ">> verifying cryptographic sigs    [OK]",
  ">> sync engine: ACTIVE",
  ">> document models: LOADED",
  ">> reactive architecture: ONLINE",
  "",
  "SYSTEM READY.",
  ">> building the future...",
  "",
  ">> nodes connected: 1,247",
  ">> documents synced: 48,302",
  ">> operations verified: 2,891,004",
  "",
  "PARADIGM SHIFT IN PROGRESS...",
];

export const ColorSpectrumShift: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // How many lines to show (scrolling in)
  const linesVisible = Math.min(
    Math.floor(frame / 4) + 1,
    CODE_LINES.length
  );

  // Color shift progress: 0 = pure green, 1 = full color
  const colorProgress = interpolate(
    frame,
    [30, durationInFrames - 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background shifts from pure black to dark blue-gray
  const bgR = Math.floor(interpolate(colorProgress, [0, 1], [0, 12]));
  const bgG = Math.floor(interpolate(colorProgress, [0, 1], [0, 14]));
  const bgB = Math.floor(interpolate(colorProgress, [0, 1], [0, 24]));

  // Text color shifts from green to multi-colored
  const getLineColor = (index: number): string => {
    const greenBase = { r: 51, g: 255, b: 51 }; // #33FF33

    if (colorProgress < 0.2) {
      return `rgb(${greenBase.r}, ${greenBase.g}, ${greenBase.b})`;
    }

    // Different target colors for different line types
    const line = CODE_LINES[index];
    let targetHue = 120; // green
    if (line.includes("[OK]")) targetHue = 170; // cyan
    if (line.includes("ACTIVE") || line.includes("ONLINE")) targetHue = 200; // blue
    if (line.includes("READY")) targetHue = 45; // gold
    if (line.includes("PROGRESS")) targetHue = 280; // purple
    if (line.includes(">>") && !line.includes("[")) targetHue = 190; // teal
    if (line.includes("nodes") || line.includes("documents")) targetHue = 30; // orange

    const shift = interpolate(colorProgress, [0.2, 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const currentHue = interpolate(shift, [0, 1], [120, targetHue]);
    const saturation = interpolate(shift, [0, 1], [100, 80]);
    const lightness = interpolate(shift, [0, 1], [60, 65]);

    return `hsl(${currentHue}, ${saturation}%, ${lightness}%)`;
  };

  // Scan line effect fading out as we modernize
  const scanLineOpacity = interpolate(colorProgress, [0, 0.7], [0.06, 0], {
    extrapolateRight: "clamp",
  });

  // CRT curvature fading
  const crtCurvature = interpolate(colorProgress, [0, 0.8], [3, 0], {
    extrapolateRight: "clamp",
  });

  // Screen brightness increasing
  const brightness = interpolate(colorProgress, [0, 1], [0.8, 1.1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgb(${bgR}, ${bgG}, ${bgB})`,
        filter: `brightness(${brightness})`,
      }}
    >
      {/* CRT scan lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, ${scanLineOpacity}) 2px,
            rgba(0, 255, 0, ${scanLineOpacity}) 4px
          )`,
          zIndex: 10,
          pointerEvents: "none",
          borderRadius: `${crtCurvature}%`,
        }}
      />

      {/* CRT vignette fading out */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${0.5 - colorProgress * 0.4}) 100%)`,
          zIndex: 11,
          pointerEvents: "none",
        }}
      />

      {/* Terminal text */}
      <div
        style={{
          padding: "80px 120px",
          fontFamily: "'Courier New', 'Lucida Console', monospace",
          fontSize: 24,
          lineHeight: 1.8,
          zIndex: 1,
        }}
      >
        {CODE_LINES.slice(0, linesVisible).map((line, index) => {
          const lineEntryFrame = index * 4;
          const lineLocalFrame = frame - lineEntryFrame;
          const lineOpacity = interpolate(lineLocalFrame, [0, 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={index}
              style={{
                color: getLineColor(index),
                opacity: lineOpacity,
                textShadow: `0 0 ${4 + colorProgress * 6}px ${getLineColor(index)}44`,
              }}
            >
              {line || "\u00A0"}
            </div>
          );
        })}

        {/* Blinking cursor at end */}
        <span
          style={{
            color: getLineColor(linesVisible - 1),
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
          }}
        >
          █
        </span>
      </div>

      {/* Color data viz overlay appearing as color comes in */}
      {colorProgress > 0.5 && (
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 80,
            bottom: 80,
            width: 400,
            opacity: interpolate(colorProgress, [0.5, 0.9], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            border: "1px solid rgba(100, 200, 255, 0.2)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            padding: 30,
          }}
        >
          {/* Simulated bar chart */}
          {[0.7, 0.5, 0.9, 0.3, 0.6, 0.8].map((height, i) => {
            const barDelay = interpolate(colorProgress, [0.5, 0.9], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const barHeight = height * barDelay * 100;
            const hue = 170 + i * 30;

            return (
              <div
                key={i}
                style={{
                  width: "80%",
                  height: 16,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${barHeight}%`,
                    height: "100%",
                    backgroundColor: `hsl(${hue}, 70%, 55%)`,
                    borderRadius: 4,
                    boxShadow: `0 0 10px hsla(${hue}, 70%, 55%, 0.3)`,
                  }}
                />
              </div>
            );
          })}

          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              color: "rgba(100, 200, 255, 0.5)",
              letterSpacing: "0.1em",
            }}
          >
            NETWORK STATUS
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
