import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  videoUrl: z.url("A valid uploaded video is required."),
})

export type ListingInput = z.infer<typeof listingSchema>
