import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Particles that converge to center then reveal the logo
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const LogoResolve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;

  // Particles that converge
  const particles = useMemo(() => {
    const rand = seededRandom(99);
    return Array.from({ length: 60 }, (_, i) => {
      const angle = rand() * Math.PI * 2;
      const dist = 400 + rand() * 600;
      return {
        startX: cx + Math.cos(angle) * dist,
        startY: cy + Math.sin(angle) * dist,
        speed: 0.8 + rand() * 0.4,
        size: 2 + rand() * 3,
        hue: rand() * 360,
      };
    });
  }, [cx, cy]);

  // Convergence happens in first 60 frames
  const convergeProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo fade in after convergence
  const logoOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  // Pulse radiating outward after logo appears
  const pulseFrame = frame - 75;
  const pulseRadius = pulseFrame > 0 ? pulseFrame * 8 : 0;
  const pulseOpacity =
    pulseFrame > 0
      ? interpolate(pulseFrame, [0, 40], [0.4, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Final hold - everything settles
  const isSettled = frame > 90;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {/* Converging particles */}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {particles.map((p, i) => {
          const progress = Math.min(convergeProgress * p.speed, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

          const currentX = interpolate(eased, [0, 1], [p.startX, cx]);
          const currentY = interpolate(eased, [0, 1], [p.startY, cy]);

          // Particles fade out as they reach center
          const particleOpacity =
            progress > 0.9
              ? interpolate(progress, [0.9, 1], [0.8, 0])
              : interpolate(progress, [0, 0.3], [0, 0.8], {
                  extrapolateRight: "clamp",
                });

          // Trail effect
          const trailLength = 20 * (1 - eased);
          const trailX = interpolate(
            eased,
            [0, 1],
            [p.startX, cx]
          );
          const trailY = interpolate(
            eased,
            [0, 1],
            [p.startY, cy]
          );

          if (isSettled && progress >= 1) return null;

          return (
            <g key={i}>
              {/* Trail */}
              {trailLength > 2 && (
                <line
                  x1={currentX}
                  y1={currentY}
                  x2={currentX + (p.startX - cx) * 0.02 * (1 - eased)}
                  y2={currentY + (p.startY - cy) * 0.02 * (1 - eased)}
                  stroke={`hsla(${p.hue}, 70%, 60%, ${particleOpacity * 0.5})`}
                  strokeWidth={1}
                />
              )}
              {/* Particle */}
              <circle
                cx={currentX}
                cy={currentY}
                r={p.size * (1 - eased * 0.5)}
                fill={`hsla(${p.hue}, 70%, 60%, ${particleOpacity})`}
              />
            </g>
          );
        })}

        {/* Pulse ring */}
        {pulseRadius > 0 && pulseOpacity > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={pulseRadius}
            fill="none"
            stroke={`rgba(255, 255, 255, ${pulseOpacity})`}
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Logo */}
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
          opacity: logoOpacity,
          transform: `scale(${0.8 + logoScale * 0.2})`,
        }}
      >
        {/* Powerhouse text logo */}
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textShadow: "0 0 30px rgba(255,255,255,0.15)",
          }}
        >
          POWERHOUSE
        </div>

        {/* Subtle tagline */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 18,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.3em",
            marginTop: 16,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          OPEN FRAMEWORK FOR A BETTER INTERNET
        </div>
      </div>

      {/* Faint network trace in background */}
      {isSettled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03 + Math.sin(frame * 0.03) * 0.01,
            background: `radial-gradient(circle at 30% 40%, rgba(100,200,255,0.3) 0%, transparent 30%),
                         radial-gradient(circle at 70% 60%, rgba(100,200,255,0.2) 0%, transparent 25%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
