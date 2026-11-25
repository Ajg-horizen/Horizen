import type { Testimonial } from "@/lib/testimonials";

/**
 * Kundens firmanavn i en anmeldelse. Har kunden en hjemmeside, vises navnet
 * som link dertil (Andreas 25/11-2026): et almindeligt link, ikke nofollow,
 * fordi det er en ægte kunde med en ægte anmeldelse. Det giver kunden et
 * link fra horizen.dk, som Google kan følge.
 */
export default function TestimonialCompany({
  author,
}: {
  author: Testimonial["author"];
}) {
  if (!author.company) return null;
  if (!author.website) return <>{author.company}</>;
  return (
    <a
      href={author.website}
      target="_blank"
      rel="noopener"
      className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
    >
      {author.company}
    </a>
  );
}
