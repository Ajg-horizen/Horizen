"use client";

import { DotFlow, DotFlowProps } from "@/components/ui/dot-flow";

const wave = [
  [24],
  [17, 23, 25, 31],
  [10, 16, 18, 24, 30, 32, 38],
  [3, 9, 11, 17, 23, 25, 31, 37, 39, 45],
  [2, 4, 10, 16, 18, 24, 30, 32, 38, 44, 46],
  [9, 11, 17, 23, 25, 31, 37, 39, 45],
  [16, 18, 24, 30, 32, 38],
  [23, 25, 31],
  [24],
  [],
];

const pulse = [
  [],
  [24],
  [17, 23, 25, 31],
  [10, 16, 18, 30, 32, 38],
  [3, 9, 11, 37, 39, 45],
  [10, 16, 18, 30, 32, 38],
  [17, 23, 25, 31],
  [24],
  [],
];

const spiral = [
  [24],
  [24, 25],
  [24, 25, 32],
  [24, 25, 32, 31],
  [24, 25, 32, 31, 23],
  [24, 25, 32, 31, 23, 16],
  [24, 25, 32, 31, 23, 16, 17],
  [24, 25, 32, 31, 23, 16, 17, 18],
  [24, 25, 32, 31, 23, 16, 17, 18, 19],
  [24, 25, 32, 31, 23, 16, 17, 18, 19, 33],
  [24, 25, 32, 31, 23, 16, 17, 18, 19, 33, 39],
  [24, 25, 32, 31, 23, 16, 17, 18, 19, 33, 39, 38],
  [24, 25, 32, 31, 23, 16, 17, 18, 19, 33, 39, 38, 37],
  [],
];

const diamond = [
  [],
  [24],
  [17, 23, 25, 31],
  [10, 16, 18, 24, 30, 32, 38],
  [17, 23, 25, 31],
  [24],
  [],
];

const items: DotFlowProps["items"] = [
  {
    title: "Connect",
    frames: diamond,
    duration: 200,
    repeatCount: 7,
  },
  {
    title: "Design",
    frames: wave,
    duration: 120,
    repeatCount: 2,
  },
  {
    title: "Optimér",
    frames: pulse,
    duration: 150,
    repeatCount: 2,
  },
  {
    title: "Vækst",
    frames: spiral,
    duration: 100,
    repeatCount: 2,
  },
];

export function ContactButton() {
  return (
    <a href="#contact" className="cursor-pointer block min-w-[130px]">
      <DotFlow items={items} />
    </a>
  );
}
