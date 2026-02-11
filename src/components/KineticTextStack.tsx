import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = {
  lines: string[];
  color?: string;
  intervalFrames?: number;
};

export const KineticTextStack: React.FC<Props> = ({
  lines,
  color = "#ffffff",
  intervalFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: "15%",
      }}
    >
      {lines.map((line, index) => {
        const entryFrame = index * intervalFrames;
        const isVisible = frame >= entryFrame;

        if (!isVisible) return null;

        const localFrame = frame - entryFrame;

        // Spring animation for entry
        const slideUp = spring({
          frame: localFrame,
          fps,
          config: {
            damping: 20,
            stiffness: 100,
            mass: 0.8,
          },
        });

        const opacity = interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Glitch effect on entry (first 4 frames)
        const glitchOffset =
          localFrame < 4
            ? Math.sin(localFrame * 40) * (4 - localFrame) * 3
            : 0;

        // Impact flash
        const flashOpacity =
          localFrame < 3
            ? interpolate(localFrame, [0, 3], [0.4, 0], {
                extrapolateRight: "clamp",
              })
            : 0;

        return (
          <div
            key={index}
            style={{
              fontFamily: "'Courier New', 'Lucida Console', monospace",
              fontSize: 64,
              fontWeight: "bold",
              color: color,
              opacity,
              transform: `translateY(${(1 - slideUp) * 30}px) translateX(${glitchOffset}px)`,
              marginBottom: "12px",
              letterSpacing: "0.02em",
              textShadow: `0 0 ${flashOpacity * 40}px ${color}`,
              position: "relative",
            }}
          >
            {line}
            {/* Impact line */}
            {localFrame < 6 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  width: `${interpolate(localFrame, [0, 6], [0, 100], {
                    extrapolateRight: "clamp",
                  })}%`,
                  height: "2px",
                  backgroundColor: color,
                  opacity: interpolate(localFrame, [3, 6], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
