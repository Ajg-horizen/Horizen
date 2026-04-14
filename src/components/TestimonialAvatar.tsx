import type { Testimonial } from "@/lib/testimonials";

/**
 * Viser forfatter-billede hvis `photo` findes, ellers initials-fallback.
 * Bruges af både FeaturedTestimonial og TrustpilotSection.
 */
export default function TestimonialAvatar({
  author,
  size = "md",
}: {
  author: Testimonial["author"];
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textClass = size === "sm" ? "text-[10px]" : "text-xs";

  if (author.photo) {
    return (
      <img
        src={author.photo}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  const label = author.company ?? author.name;
  const initials = label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${sizeClass} ${textClass} shrink-0 flex items-center justify-center rounded-full bg-foreground/10 font-semibold`}
    >
      {initials}
    </div>
  );
}
