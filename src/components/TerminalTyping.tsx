import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

type Props = {
  text: string;
  color?: string;
  typingSpeed?: number;
  cursorBlink?: boolean;
};

export const TerminalTyping: React.FC<Props> = ({
  text,
  color = "#33FF33",
  typingSpeed = 4,
  cursorBlink = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Characters revealed so far
  const charsRevealed = Math.min(
    Math.floor(frame / typingSpeed),
    text.length
  );
  const displayedText = text.slice(0, charsRevealed);
  const isFinished = charsRevealed >= text.length;

  // Cursor blink: visible for 15 frames, hidden for 15 frames
  const cursorVisible = cursorBlink
    ? Math.floor(frame / (fps / 2)) % 2 === 0
    : true;

  // Subtle CRT scan line effect
  const scanLineOpacity = interpolate(
    frame % 4,
    [0, 1, 2, 3],
    [0.03, 0.06, 0.03, 0.01]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* CRT scan lines overlay */}
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
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Subtle screen glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "600px",
          height: "300px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${color}08 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Terminal text */}
      <div
        style={{
          fontFamily: "'Courier New', 'Lucida Console', monospace",
          fontSize: 72,
          color: color,
          letterSpacing: "0.05em",
          textShadow: `0 0 10px ${color}66, 0 0 20px ${color}33`,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>{displayedText}</span>
        <span
          style={{
            opacity: cursorVisible ? 1 : 0,
            marginLeft: "2px",
            animation: "none",
          }}
        >
          {isFinished ? "█" : "█"}
        </span>
      </div>

      {/* Subtle CRT vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
