import type { Testimonial } from "@/core/domain/testimonial/testimonial";

export interface TestimonialRepository {
  listPublished(): Promise<Testimonial[]>;
}
