import FeaturedTestimonial from "@/components/FeaturedTestimonial";
import {
  getTestimonial,
  pickTestimonialByKey,
} from "@/lib/testimonials";
import type { FeaturedTestimonialBlock as Data } from "@/lib/services";

export default function FeaturedTestimonialBlock({
  data,
  pageKey,
}: {
  data?: Data;
  /** Service-slug eller anden nøgle til deterministisk valg når intet
   * specifikt testimonialId er sat. */
  pageKey?: string;
}) {
  // Prioritet: eksplicit testimonialId → deterministisk pluk via pageKey → featured
  if (data?.testimonialId) {
    return <FeaturedTestimonial testimonial={getTestimonial(data.testimonialId)} />;
  }
  if (pageKey) {
    return <FeaturedTestimonial testimonial={pickTestimonialByKey(pageKey)} />;
  }
  return <FeaturedTestimonial />;
}
