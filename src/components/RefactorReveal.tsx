import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Background code lines — messy legacy code that gets refactored
const OLD_CODE_LINES = [
  "import { centralServer } from '@bigtech/cloud';",
  "const userData = await fetch('/api/harvest-data');",
  "if (!user.subscription) throw new PaywallError();",
  "platform.lockVendor(user.data, { escape: false });",
  "const algorithm = optimizeForEngagement(feed);",
  "await cloudProvider.uploadAll(localFiles);",
  "user.ownership = null; // deprecated",
  "const permissions = await platform.requestAccess();",
  "export const data = { owner: 'platform', access: 'revocable' };",
  "await tracker.logActivity(user, { share: true });",
  "if (user.wantsToLeave) { deny(); showModal('Are you sure?'); }",
  "const storage = new CentralizedSilo({ lock: true });",
  "platform.extractValue(community.contributions);",
  "const ai = new BlackBoxModel({ data: user.everything });",
  "await paywall.enforce({ content: 'your own data' });",
  "export default { control: 'them', freedom: 'none' };",
];

const NEW_CODE_LINES = [
  "import { Document } from '@powerhouse/reactor';",
  "const doc = Document.create({ schema, ops: [] });",
  "doc.sign(user.key); // cryptographic verification",
  "export { doc }; // local-first, user-owned",
  "const drive = Drive.sync({ peers, mode: 'p2p' });",
  "const agent = Agent.spawn({ permissions: doc.ops });",
];

type Props = {
  title?: string;
};

export const RefactorReveal: React.FC<Props> = ({
  title = "refactor the entire stack",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-60): Background code fades in, scrolling slowly
  // Phase 2 (60-120): Red strikethroughs sweep across old code
  // Phase 3 (120-160): Old code fades, new code types in
  // Phase 4 (160-210): Main title reveals with glitch

  const bgCodeOpacity = interpolate(frame, [0, 30], [0, 0.25], {
    extrapolateRight: "clamp",
  });

  const scrollOffset = frame * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      {/* Background code layer — dense, faded */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: bgCodeOpacity,
        }}
      >
        {Array.from({ length: 3 }).map((_, colIdx) => (
          <div
            key={colIdx}
            style={{
              position: "absolute",
              left: `${colIdx * 34}%`,
              top: -scrollOffset + colIdx * 40,
              width: "36%",
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              lineHeight: "22px",
              color: "#4a6a4a",
              whiteSpace: "pre",
              opacity: 0.6,
            }}
          >
            {[...OLD_CODE_LINES, ...OLD_CODE_LINES, ...OLD_CODE_LINES].map(
              (line, i) => (
                <div key={i} style={{ marginBottom: "4px" }}>
                  {line}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Strikethrough phase — red lines sweep across */}
      {frame > 50 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {OLD_CODE_LINES.slice(0, 10).map((line, i) => {
            const strikeDelay = 50 + i * 5;
            const strikeProgress =
              frame > strikeDelay
                ? interpolate(frame - strikeDelay, [0, 12], [0, 1], {
                    extrapolateRight: "clamp",
                  })
                : 0;

            const fadeOut =
              frame > strikeDelay + 30
                ? interpolate(frame - strikeDelay - 30, [0, 20], [1, 0], {
                    extrapolateRight: "clamp",
                  })
                : 1;

            if (strikeProgress === 0) return null;

            const yPos = 180 + i * 52;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 160,
                  top: yPos - scrollOffset * 0.3,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 18,
                  color: "#ff4444",
                  opacity: fadeOut * 0.7,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ opacity: 0.5 }}>{line}</span>
                {/* Strikethrough line */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: `${strikeProgress * 100}%`,
                    height: "2px",
                    backgroundColor: "#ff4444",
                    boxShadow: "0 0 8px rgba(255, 68, 68, 0.6)",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* New code typing in — green, clean */}
      {frame > 110 && (
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 280,
          }}
        >
          {NEW_CODE_LINES.map((line, i) => {
            const typeDelay = 110 + i * 15;
            const localFrame = Math.max(0, frame - typeDelay);

            if (localFrame === 0) return null;

            const charsToShow = Math.min(
              Math.floor(localFrame * 1.5),
              line.length
            );
            const displayText = line.substring(0, charsToShow);
            const showCursor =
              charsToShow < line.length && localFrame % 8 < 5;

            const lineOpacity = interpolate(localFrame, [0, 5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 18,
                  color: "#33FF33",
                  opacity: lineOpacity * 0.9,
                  marginBottom: "8px",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 4px rgba(51, 255, 51, 0.3)",
                }}
              >
                {displayText}
                {showCursor && (
                  <span style={{ color: "#33FF33", opacity: 0.8 }}>█</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Scan line effect during refactor */}
      {frame > 50 && frame < 140 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${((frame - 50) * 3) % 120 - 10}%`,
            width: "100%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 68, 68, 0.4), transparent)",
            boxShadow: "0 0 20px rgba(255, 68, 68, 0.2)",
          }}
        />
      )}

      {/* Main title reveal */}
      {frame > 150 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Darken background for title readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#0a0a0f",
              opacity: interpolate(frame - 150, [0, 20], [0, 0.85], {
                extrapolateRight: "clamp",
              }),
            }}
          />

          <div
            style={{
              zIndex: 1,
              textAlign: "center",
            }}
          >
            {title.split("").map((char, i) => {
              const charDelay = 155 + i * 1.5;
              const charFrame = Math.max(0, frame - charDelay);

              const charSpring = spring({
                frame: charFrame,
                fps,
                config: { damping: 15, stiffness: 120, mass: 0.5 },
              });

              // Glitch offset for first few frames
              const glitchX =
                charFrame > 0 && charFrame < 4
                  ? Math.sin(charFrame * 30 + i * 7) * (4 - charFrame) * 4
                  : 0;
              const glitchY =
                charFrame > 0 && charFrame < 4
                  ? Math.cos(charFrame * 20 + i * 5) * (4 - charFrame) * 2
                  : 0;

              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontFamily: "'Courier New', monospace",
                    fontSize: 72,
                    fontWeight: "bold",
                    color: "#ffffff",
                    opacity: charSpring,
                    transform: `translate(${glitchX}px, ${glitchY}px)`,
                    textShadow:
                      charFrame < 4
                        ? `${glitchX * 2}px 0 #33FF33, ${-glitchX * 2}px 0 #ff4444`
                        : "0 0 20px rgba(255, 255, 255, 0.15)",
                    letterSpacing: "0.06em",
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </span>
              );
            })}

            {/* Underline sweep */}
            {frame > 170 && (
              <div
                style={{
                  width: `${interpolate(frame - 170, [0, 20], [0, 100], { extrapolateRight: "clamp" })}%`,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #33FF33, #06b6d4, #ffffff)",
                  margin: "12px auto 0",
                  boxShadow: "0 0 12px rgba(51, 255, 51, 0.4)",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, #0a0a0f 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
