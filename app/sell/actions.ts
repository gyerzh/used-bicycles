"use server"

import { z } from "zod"

const listingSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  videoUrl: z.url("A valid uploaded video is required."),
})

export type ListingState = {
  errors?: Partial<Record<keyof z.infer<typeof listingSchema>, string[]>>
  success?: { listingId: string }
}

function generateListingId(): string {
  const timestamp = Date.now()
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 10)
  return `BCY-${timestamp}-${suffix}`
}

export async function createListing(
  _prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const result = listingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    videoUrl: formData.get("videoUrl"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  // TODO: persist to database once schema is ready
  console.log("new listing", result.data)

  return { success: { listingId: generateListingId() } }
}
