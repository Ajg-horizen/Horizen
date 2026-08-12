/**
 * Pixel-art glypher til notifikationer m.m. Samme dot-æstetik som
 * footerens hjerte og Connect-knappens dot-flow. Dots tegnes i
 * baggrundsfarven, så de står lyst på en mørk flade.
 */

type Grid = number[][];

const HEART: Grid = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

const DIAMOND: Grid = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

function Pixels({ grid }: { grid: Grid }) {
  const cols = grid[0].length;
  return (
    <div
      className="grid gap-[1px]"
      style={{ gridTemplateColumns: `repeat(${cols}, 2px)` }}
    >
      {grid.flat().map((on, i) => (
        <div
          key={i}
          className={`h-[2px] w-[2px] rounded-[0.5px] ${
            on ? "bg-background" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

export function PixelHeart() {
  return <Pixels grid={HEART} />;
}

export function PixelDiamond() {
  return <Pixels grid={DIAMOND} />;
}
