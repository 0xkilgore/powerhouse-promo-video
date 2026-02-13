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
import { SpecChaosToOrder } from "./components/SpecChaosToOrder";
import { SpecTerminalValidation } from "./components/SpecTerminalValidation";
import { SpecHolographic } from "./components/SpecHolographic";
import { SceneTitle } from "./components/SceneTitle";

const SCENE_TITLES = [
  // Part titles
  { id: "Title-Part1", title: "Reclaiming our Personal Space", subtitle: "Part 1" },
  { id: "Title-Part2", title: "Better Peer Collaboration", subtitle: "Part 2" },
  // Part 1 features
  { id: "Title-P1-LocalFirst", title: "Local-first documents" },
  { id: "Title-P1-Consistency", title: "Consistency guarantees" },
  { id: "Title-P1-History", title: "Verifiable document history" },
  { id: "Title-P1-Branching", title: "Undo, branching and merging" },
  { id: "Title-P1-Storage", title: "Storage agnostic" },
  { id: "Title-P1-Filesystem", title: "Beyond the filesystem paradigm" },
  // Part 2 features
  { id: "Title-P2-CommChannels", title: "Documents as communication channels" },
  { id: "Title-P2-Permissions", title: "Operations as permission hooks" },
  { id: "Title-P2-APIs", title: "Documents as APIs" },
  { id: "Title-P2-ReadModels", title: "Scalable read models and analytics" },
  { id: "Title-P2-Infrastructure", title: "Independent infrastructure" },
];

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

      {/* "specification-driven AI" — chaos to order */}
      <Composition
        id="SpecChaosToOrder"
        component={SpecChaosToOrder}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* "specification-driven AI" — terminal validation */}
      <Composition
        id="SpecTerminalValidation"
        component={SpecTerminalValidation}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* "specification-driven AI" — holographic wireframe */}
      <Composition
        id="SpecHolographic"
        component={SpecHolographic}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Scene title cards */}
      {SCENE_TITLES.map((scene) => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={SceneTitle}
          durationInFrames={2 * FPS}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{
            title: scene.title,
            subtitle: scene.subtitle,
          }}
        />
      ))}

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
