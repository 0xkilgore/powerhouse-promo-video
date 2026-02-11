import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type ColorScheme = "cyan" | "warm" | "spectrum";

type Props = {
  nodeCount: number;
  centerNode?: boolean;
  colorScheme?: ColorScheme;
};

type Node = {
  x: number;
  y: number;
  entryFrame: number;
  size: number;
  id: number;
};

// Seeded random for deterministic layout
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getNodeColor(scheme: ColorScheme, index: number, total: number): string {
  switch (scheme) {
    case "cyan":
      return `hsl(${170 + (index / total) * 30}, 80%, 60%)`;
    case "warm":
      return `hsl(${30 + (index / total) * 20}, 70%, 65%)`;
    case "spectrum":
      return `hsl(${(index / total) * 360}, 70%, 60%)`;
  }
}

function getGlowColor(scheme: ColorScheme): string {
  switch (scheme) {
    case "cyan":
      return "rgba(0, 220, 220, 0.3)";
    case "warm":
      return "rgba(255, 180, 80, 0.3)";
    case "spectrum":
      return "rgba(100, 200, 255, 0.2)";
  }
}

export const NodeNetwork: React.FC<Props> = ({
  nodeCount,
  centerNode = false,
  colorScheme = "cyan",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Generate deterministic node positions
  const nodes = useMemo(() => {
    const rand = seededRandom(42);
    const result: Node[] = [];

    if (centerNode) {
      result.push({
        x: width / 2,
        y: height / 2,
        entryFrame: 0,
        size: nodeCount === 1 ? 16 : 12,
        id: 0,
      });
    }

    const startIndex = centerNode ? 1 : 0;
    const padding = nodeCount > 40 ? 50 : 150;

    for (let i = startIndex; i < nodeCount; i++) {
      const stagger = centerNode
        ? Math.floor((i - startIndex) / 2) * 10 + 15
        : (i / nodeCount) * 60;

      if (centerNode && nodeCount <= 10) {
        // Arrange around center in a circle
        const angle = ((i - 1) / (nodeCount - 1)) * Math.PI * 2;
        const radius = 200 + rand() * 100;
        result.push({
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          entryFrame: stagger,
          size: 8 + rand() * 4,
          id: i,
        });
      } else {
        result.push({
          x: padding + rand() * (width - padding * 2),
          y: padding + rand() * (height - padding * 2),
          entryFrame: stagger,
          size: nodeCount > 40 ? 3 + rand() * 3 : 6 + rand() * 6,
          id: i,
        });
      }
    }

    return result;
  }, [nodeCount, centerNode, width, height]);

  // Determine connections (nearby nodes)
  const connections = useMemo(() => {
    const maxDist = nodeCount > 40 ? 250 : nodeCount > 10 ? 350 : 400;
    const result: [number, number][] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          result.push([i, j]);
        }
      }
    }
    return result;
  }, [nodes, nodeCount]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "80%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${getGlowColor(colorScheme)} 0%, transparent 70%)`,
        }}
      />

      <svg width={width} height={height} style={{ position: "absolute" }}>
        {/* Connections */}
        {connections.map(([i, j], idx) => {
          const a = nodes[i];
          const b = nodes[j];
          const entryFrame = Math.max(a.entryFrame, b.entryFrame) + 5;
          const lineOpacity = interpolate(
            frame,
            [entryFrame, entryFrame + 15],
            [0, 0.3],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (lineOpacity <= 0) return null;

          // Data pulse traveling along the connection
          const pulseProgress =
            frame > entryFrame + 20
              ? ((frame - entryFrame - 20) % 60) / 60
              : -1;

          const color = getNodeColor(colorScheme, i, nodes.length);

          return (
            <g key={`conn-${idx}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={color}
                strokeWidth={1}
                opacity={lineOpacity}
              />
              {pulseProgress >= 0 && (
                <circle
                  cx={a.x + (b.x - a.x) * pulseProgress}
                  cy={a.y + (b.y - a.y) * pulseProgress}
                  r={2}
                  fill={color}
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const scale = spring({
            frame: Math.max(0, frame - node.entryFrame),
            fps,
            config: {
              damping: 15,
              stiffness: 80,
              mass: 0.5,
            },
          });

          if (scale <= 0.01) return null;

          const color = getNodeColor(colorScheme, idx, nodes.length);

          // Subtle breathing animation
          const breathe = 1 + Math.sin(frame * 0.05 + idx) * 0.1;

          return (
            <g key={`node-${idx}`}>
              {/* Glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * scale * breathe * 3}
                fill={color}
                opacity={0.1 * scale}
              />
              {/* Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * scale * breathe}
                fill={color}
                opacity={0.9 * scale}
              />
              {/* Bright center */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * scale * breathe * 0.4}
                fill="#ffffff"
                opacity={0.6 * scale}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
