"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";

const COMPLEXITY_LABELS = [
  "GDPR",
  "SSL",
  "UI/UX",
  "SEO",
  "Hosting",
  "Analytics",
  "Performance",
  "AI",
  "Responsive",
  "Branding",
  "Konvertering",
  "Tilgængelighed",
  "Social Media",
  "Google Ads",
  "Sikkerhed",
  "Vedligeholdelse",
];

export default function PhysicsPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const hasDropped = useRef(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const container = sceneRef.current;
    const width = container.offsetWidth;
    const height = 270;

    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      },
    });
    renderRef.current = render;

    // Walls
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);

    Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Blocks — start above canvas, held back until section is in view
    const blocks = COMPLEXITY_LABELS.map((label, i) => {
      const w = label.length * 9 + 36;
      const h = 34;
      const x = 40 + Math.random() * (width - 80);
      const y = -50 - i * 45; // Stacked above the canvas

      return Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 8 },
        restitution: 0.4,
        friction: 0.3,
        density: 0.002,
        render: {
          fillStyle: "#0f0f0f",
        },
        label,
      });
    });

    // Mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Remove Matter.js scroll capture so page scrolls normally
    mouse.element.removeEventListener("wheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    const canvas = render.canvas;
    canvas.style.touchAction = "pan-y";

    // Custom text rendering
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      if (!ctx) return;

      blocks.forEach((block) => {
        const { x, y } = block.position;
        const angle = block.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.font = "600 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#f5f5f0";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(block.label, 0, 0);
        ctx.restore();
      });
    });

    const runner = Runner.create();
    runnerRef.current = runner;

    Runner.run(runner, engine);
    Render.run(render);

    // Intersection Observer — add blocks when section enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDropped.current) {
          hasDropped.current = true;

          // Add blocks with stagger so they rain in
          blocks.forEach((block, i) => {
            setTimeout(() => {
              Composite.add(engine.world, block);
            }, i * 80);
          });

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    // Resize handler
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      render.canvas.width = newWidth;
      render.options.width = newWidth;
      Matter.Body.setPosition(floor, { x: newWidth / 2, y: height + 25 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: height / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <Container as="section" size="site" className="py-20">
      <div>
        <div className="mb-10 text-center">
          <ScrambleEyebrow>Det digitale landskab</ScrambleEyebrow>
          <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Der er mange ting at holde styr på
          </h3>
          <p className="mt-3 mx-auto max-w-lg text-sm leading-relaxed text-muted">
            GDPR, SEO, performance, sikkerhed, AI, optimering — listen
            er lang. Vi tager os af det tekniske, så du kan fokusere
            på din forretning.
          </p>
        </div>
        <div
          ref={sceneRef}
          className="relative h-[270px] w-full overflow-hidden rounded-2xl border border-foreground/[0.06]"
          style={{ cursor: "grab" }}
        />
      </div>
    </Container>
  );
}
