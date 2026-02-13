import { Composition } from "remotion";
import { TerminalTyping } from "./components/TerminalTyping";
import { KineticTextStack } from "./components/KineticTextStack";
import { NodeNetwork } from "./components/NodeNetwork";
import { ThreeTierStack } from "./components/ThreeTierStack";
import { ModuleAssembly } from "./components/ModuleAssembly";
import { LogoResolve } from "./components/LogoResolve";
import { ColorSpectrumShift } from "./components/ColorSpectrumShift";
import { PillarReveal } from "./components/PillarReveal";
import { RefactorReveal } from "./components/RefactorReveal";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Shot 3b: "our lives." terminal typing */}
      <Composition
        id="TerminalTyping"
        component={TerminalTyping}
        durationInFrames={3 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          text: "our lives.",
          color: "#33FF33",
          typingSpeed: 4,
          cursorBlink: true,
        }}
      />

      {/* Shot 3a: "our apps. our platforms. our data." stacking text */}
      <Composition
        id="KineticTextStack"
        component={KineticTextStack}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          lines: ["our apps.", "our platforms.", "our data."],
          color: "#ffffff",
          intervalFrames: 30,
        }}
      />

      {/* Shot 3a overlay: black text, transparent bg for compositing */}
      <Composition
        id="KineticTextStack-Overlay"
        component={KineticTextStack}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          lines: ["our apps.", "our platforms.", "our data."],
          color: "#000000",
          intervalFrames: 30,
        }}
      />

      {/* Shot 9: green monochrome → full color spectrum shift */}
      <Composition
        id="ColorSpectrumShift"
        component={ColorSpectrumShift}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Shots 10-12: three pillars reveal */}
      <Composition
        id="PillarReveal"
        component={PillarReveal}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          staggerFrames: 35,
        }}
      />

      {/* Shot 11: decentralized node network */}
      <Composition
        id="NodeNetwork-Small"
        component={NodeNetwork}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          nodeCount: 12,
          centerNode: false,
          colorScheme: "cyan" as const,
        }}
      />

      {/* Shots 16-17-18: individual → collaboration → global zoom-out */}
      <Composition
        id="NodeNetwork-Individual"
        component={NodeNetwork}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          nodeCount: 1,
          centerNode: true,
          colorScheme: "warm" as const,
        }}
      />

      <Composition
        id="NodeNetwork-Collaboration"
        component={NodeNetwork}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          nodeCount: 6,
          centerNode: true,
          colorScheme: "cyan" as const,
        }}
      />

      <Composition
        id="NodeNetwork-Global"
        component={NodeNetwork}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          nodeCount: 80,
          centerNode: false,
          colorScheme: "spectrum" as const,
        }}
      />

      {/* Shot 14: modular components assembling */}
      <Composition
        id="ModuleAssembly"
        component={ModuleAssembly}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Shot 15: three-tier stack building upward */}
      <Composition
        id="ThreeTierStack"
        component={ThreeTierStack}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* "Refactor the entire stack" — code refactor visual */}
      <Composition
        id="RefactorReveal"
        component={RefactorReveal}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: "refactor the entire stack",
        }}
      />

      {/* Shot 19: logo resolve */}
      <Composition
        id="LogoResolve"
        component={LogoResolve}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
