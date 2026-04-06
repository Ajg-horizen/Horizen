"use client";

import { useRef, useState, useEffect } from "react";
import { TextScramble } from "@/components/ui/text-scramble";

export function ScrambleEyebrow({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <TextScramble
        as="span"
        className={
          className ||
          "text-xs font-medium tracking-[0.3em] text-muted uppercase"
        }
        duration={1.2}
        speed={0.05}
        trigger={inView}
      >
        {children}
      </TextScramble>
    </div>
  );
}
