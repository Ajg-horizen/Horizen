import { TRUSTPILOT } from "@/lib/testimonials";

const STAR =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** Fem stjernefelter i Trustpilots stil. Det sidste fyldes delvist (fx 4,5). */
function Stars({ score }: { score: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, score - i));
        return (
          <span
            key={i}
            className="relative flex size-4 items-center justify-center bg-[#dcdce6]"
          >
            <span
              className="absolute inset-y-0 left-0 bg-[#00b67a]"
              style={{ width: `${fill * 100}%` }}
            />
            <svg viewBox="0 0 24 24" className="relative size-2.5 fill-white">
              <path d={STAR} />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Lille badge med Horizens bedømmelse på Trustpilot. Linker til profilen.
 * Tallene ligger i TRUSTPILOT (src/lib/testimonials.ts).
 */
export default function TrustpilotBadge({
  className = "",
}: {
  className?: string;
}) {
  const score = TRUSTPILOT.score.toLocaleString("da-DK");
  return (
    <a
      href={TRUSTPILOT.url}
      target="_blank"
      rel="noopener"
      aria-label={`${TRUSTPILOT.label}: ${score} ud af 5 på Trustpilot, baseret på ${TRUSTPILOT.count} anmeldelser`}
      className={`inline-flex items-center gap-2.5 text-xs transition-opacity duration-300 hover:opacity-70 ${className}`}
    >
      <span className="flex items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          className="size-4 fill-[#00b67a]"
          aria-hidden="true"
        >
          <path d={STAR} />
        </svg>
        <span className="font-semibold">Trustpilot</span>
      </span>
      <Stars score={TRUSTPILOT.score} />
      <span className="font-semibold">{score}</span>
    </a>
  );
}
