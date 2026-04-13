"use server"

import { z } from "zod"
import { createListing as dbCreateListing } from "@/db/listings"
import { listingSchema, type ListingInput } from "@/zod/listings"

export type ListingState = {
  errors?: Partial<Record<keyof ListingInput, string[]>>
  success?: { listingId: string }
}

function generateListingId(): string {
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 10)
  return `BCY-${Date.now()}-${suffix}`
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
    return { errors: z.flattenError(result.error).fieldErrors }
  }

  const id = generateListingId()

  await dbCreateListing({ id, ...result.data })

  return { success: { listingId: id } }
}
