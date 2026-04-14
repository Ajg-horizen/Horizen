"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import TestimonialAvatar from "@/components/TestimonialAvatar";
import { fadeInUp } from "@/lib/animations";
import { getFeaturedTestimonial, type Testimonial } from "@/lib/testimonials";

function TrustpilotStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-6 w-6 items-center justify-center bg-[#00b67a]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/**
 * Hero-testimonial fra single-source testimonials.ts.
 * Brug optional `testimonial` prop for at override — ellers hentes
 * den via `featured: true` flaget.
 */
export default function FeaturedTestimonial({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const t = testimonial ?? getFeaturedTestimonial();
  const { quote, rating, author } = t;
  const mainLabel = author.company ?? author.name;
  // Undgå duplikat: hvis company vises som mainLabel, skal den ikke med i subtitle
  const subtitleParts = author.company
    ? [author.role, author.location]
    : [author.role, author.company, author.location];
  const subtitle = subtitleParts.filter(Boolean).join(", ");

  return (
    <section className="py-24 bg-accent/50 rounded-3xl mx-4 md:mx-8">
      <Container size="site">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-left lg:text-center"
        >
          <div className="mb-8 flex justify-start lg:justify-center">
            <TrustpilotStars count={rating} />
          </div>
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-start gap-3 lg:justify-center">
            <TestimonialAvatar author={author} />
            <div className="text-left">
              <p className="text-sm font-semibold">{mainLabel}</p>
              {subtitle && (
                <p className="text-xs text-muted">{subtitle}</p>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
