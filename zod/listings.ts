import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required.").max(80, "Title must be 80 characters or less."),
  description: z.string().min(1, "Description is required.").max(500, "Description must be 500 characters or less."),
  price: z.coerce.number().int("Price must be a whole number.").positive("Price must be greater than 0."),
  videoUrl: z.url("A valid uploaded video is required."),
})

export type ListingInput = z.infer<typeof listingSchema>
