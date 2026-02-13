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

const COMMAND = "$ vetra spec --validate";
const OUTPUT_LINES = [
  "  ▸ loading document schema...",
  "  ▸ parsing operation definitions...",
  "  ▸ validating state reducers...",
  "  ▸ checking permission matrix...",
  "  ▸ verifying cryptographic signatures...",
  "  ✓ specification valid",
];
const TITLE = "specification-driven AI";

export const SpecTerminalValidation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-30): Terminal window appears
  // Phase 2 (30-60): Command types in
  // Phase 3 (60-120): Output lines appear + progress bar fills
  // Phase 4 (120-150): Progress completes, "specification valid"
  // Phase 5 (150-210): Title reveals letter by letter with green checks

  const terminalScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.6 },
  });

  // Command typing
  const commandStart = 30;
  const commandChars = frame > commandStart
    ? Math.min(Math.floor((frame - commandStart) * 0.8), COMMAND.length)
    : 0;
  const commandText = COMMAND.substring(0, commandChars);
  const showCommandCursor = frame > commandStart && frame < 70 && frame % 8 < 5;

  // Output lines
  const outputStart = 65;
  const lineDelay = 8;

  // Progress bar
  const progressStart = 65;
  const progressEnd = 130;
  const progressValue = interpolate(frame, [progressStart, progressEnd], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title reveal
  const titleStart = 145;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      {/* Ambient grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(51, 255, 51, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 255, 51, 0.02) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Terminal window */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -55%) scale(${terminalScale})`,
          width: 900,
          opacity: terminalScale,
        }}
      >
        {/* Terminal chrome */}
        <div
          style={{
            background: "linear-gradient(180deg, #2a2a2f, #1a1a1f)",
            borderRadius: "10px 10px 0 0",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
          <span
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Img
              src={staticFile("brand/Vetra-logo.png")}
              style={{
                height: 18,
                objectFit: "contain",
                objectPosition: "left",
                width: 18,
                overflow: "hidden",
              }}
            />
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 13,
                color: "#666",
              }}
            >
              vetra-cli
            </span>
          </span>
        </div>

        {/* Terminal body */}
        <div
          style={{
            backgroundColor: "#0d0d12",
            border: "1px solid #2a2a2f",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: "20px 24px",
            minHeight: 260,
            fontFamily: "'Courier New', monospace",
            fontSize: 16,
            lineHeight: "28px",
          }}
        >
          {/* Command line */}
          <div style={{ color: "#33FF33" }}>
            {commandText}
            {showCommandCursor && <span style={{ opacity: 0.8 }}>█</span>}
          </div>

          {/* Output lines */}
          {OUTPUT_LINES.map((line, i) => {
            const lineStart = outputStart + i * lineDelay;
            if (frame < lineStart) return null;

            const isLast = i === OUTPUT_LINES.length - 1;
            const lineOpacity = interpolate(frame - lineStart, [0, 5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  color: isLast ? "#33FF33" : "#8a8a9a",
                  opacity: lineOpacity,
                  fontWeight: isLast ? "bold" : "normal",
                }}
              >
                {line}
              </div>
            );
          })}

          {/* Progress bar */}
          {frame > progressStart && (
            <div style={{ marginTop: "12px" }}>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "#1a1a2a",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressValue}%`,
                    height: "100%",
                    background: progressValue >= 100
                      ? "#33FF33"
                      : "linear-gradient(90deg, #33FF33, #06b6d4)",
                    borderRadius: "3px",
                    boxShadow: progressValue >= 100
                      ? "0 0 12px rgba(51, 255, 51, 0.5)"
                      : "0 0 8px rgba(6, 182, 212, 0.3)",
                    transition: "background 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: 12,
                  color: progressValue >= 100 ? "#33FF33" : "#555",
                  marginTop: "4px",
                }}
              >
                {Math.floor(progressValue)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title reveal below terminal */}
      {frame > titleStart && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "72%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {TITLE.split("").map((char, i) => {
            const charDelay = titleStart + i * 1.8;
            const charFrame = Math.max(0, frame - charDelay);

            if (charFrame === 0 && char !== " ") return null;

            const charSpring = spring({
              frame: charFrame,
              fps,
              config: { damping: 12, stiffness: 150, mass: 0.4 },
            });

            // Small green pulse on each character arrival
            const pulseOpacity = charFrame > 0 && charFrame < 8
              ? interpolate(charFrame, [0, 3, 8], [0.8, 0.5, 0], { extrapolateRight: "clamp" })
              : 0;

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 64,
                  fontWeight: "bold",
                  color: "#ffffff",
                  opacity: charSpring,
                  transform: `translateY(${(1 - charSpring) * 15}px)`,
                  textShadow: pulseOpacity > 0
                    ? `0 0 ${pulseOpacity * 20}px rgba(51, 255, 51, ${pulseOpacity})`
                    : "0 0 12px rgba(255, 255, 255, 0.08)",
                  whiteSpace: "pre",
                  letterSpacing: "0.04em",
                }}
              >
                {char}
              </span>
            );
          })}
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
