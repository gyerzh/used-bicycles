"use server"

import { getListingById } from "@/db/listings"
import { createTransaction } from "@/db/transactions"

export type BuyState = {
  error?: string
  success?: { paymentId: string; price: number }
}

function generatePaymentId(): string {
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 10)
  return `PAY-${Date.now()}-${suffix}`
}

export async function buyListing(
  _prevState: BuyState,
  formData: FormData
): Promise<BuyState> {
  const listingId = formData.get("listingId") as string

  const listing = await getListingById(listingId)
  if (!listing) return { error: "Listing not found." }

  const id = generatePaymentId()

  await createTransaction({ id, listingId: listing.id })

  return { success: { paymentId: id, price: listing.price } }
}
