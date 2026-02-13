import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = {
  title: string;
  subtitle?: string;
  variant?: "part" | "feature";
};

export const SceneTitle: React.FC<Props> = ({
  title,
  subtitle,
  variant = "part",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFeature = variant === "feature";

  // Text slide-up + fade
  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.6 },
  });

  const textY = interpolate(textSpring, [0, 1], [isFeature ? 16 : 24, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Subtitle (e.g. "Part 1") appears slightly before main title
  const subtitleSpring = subtitle
    ? spring({
        frame: frame - 2,
        fps,
        config: { damping: 20, stiffness: 90, mass: 0.5 },
      })
    : 0;

  // Accent line sweeps in
  const lineStart = isFeature ? 10 : 12;
  const lineWidth = interpolate(frame - lineStart, [0, 18], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line glow pulses once on completion
  const lineGlow =
    frame > lineStart + 18
      ? interpolate(frame - lineStart - 18, [0, 10], [0.7, 0.2], {
          extrapolateRight: "clamp",
        })
      : 0;

  if (isFeature) {
    // Feature variant: left-aligned, lower on screen
    return (
      <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 140,
            bottom: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Main title */}
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 42,
              fontWeight: "bold",
              color: "#ffffff",
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              textAlign: "left",
              maxWidth: 1200,
              lineHeight: 1.2,
              textShadow: "0 0 16px rgba(255, 255, 255, 0.05)",
            }}
          >
            {title}
          </div>

          {/* Accent line — left-aligned, shorter */}
          <div
            style={{
              marginTop: "14px",
              width: 320,
              height: "2px",
            }}
          >
            <div
              style={{
                width: `${lineWidth}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #06b6d4, rgba(6, 182, 212, 0.2))",
                boxShadow:
                  lineGlow > 0
                    ? `0 0 ${lineGlow * 12}px rgba(6, 182, 212, ${lineGlow})`
                    : "none",
              }}
            />
          </div>
        </div>

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 70%, transparent 40%, #0a0a0f 100%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  // Part variant: centered, larger
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Subtitle (Part number) */}
        {subtitle && (
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 20,
              color: "#06b6d4",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              opacity: subtitleSpring,
              transform: `translateY(${interpolate(subtitleSpring as number, [0, 1], [12, 0])}px)`,
              marginBottom: "16px",
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Main title */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 56,
            fontWeight: "bold",
            color: "#ffffff",
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.2,
            textShadow: "0 0 20px rgba(255, 255, 255, 0.06)",
          }}
        >
          {title}
        </div>

        {/* Accent line */}
        <div
          style={{
            marginTop: "18px",
            width: "40%",
            maxWidth: 500,
            height: "2px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${lineWidth}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #06b6d4, #ffffff 60%, rgba(255, 255, 255, 0.3))",
              boxShadow:
                lineGlow > 0
                  ? `0 0 ${lineGlow * 16}px rgba(6, 182, 212, ${lineGlow})`
                  : "none",
            }}
          />
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, #0a0a0f 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
