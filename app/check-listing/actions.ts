"use server"

import { z } from "zod"
import { getTransactionById, confirmBuyerReceived, recordSellerPayout } from "@/db/transactions"
import { getListingWithTransactions } from "@/db/listings"
import { payoutSchema } from "@/zod/transactions"

// ── Buyer: look up transaction by Payment ID ──────────────────────────────────

export type BuyerCheckState = {
  error?: string
  transaction?: {
    paymentId: string
    listingTitle: string
    price: number
    buyerConfirmed: boolean
  }
}

export async function checkBuyerOrder(
  _prev: BuyerCheckState,
  formData: FormData
): Promise<BuyerCheckState> {
  const paymentId = (formData.get("paymentId") as string)?.trim()
  if (!paymentId) return { error: "Payment ID is required." }

  const tx = await getTransactionById(paymentId)
  if (!tx) return { error: "No order found with that Payment ID." }

  return {
    transaction: {
      paymentId: tx.id,
      listingTitle: tx.listing.title,
      price: tx.listing.price,
      buyerConfirmed: tx.buyerConfirmed,
    },
  }
}

export async function confirmBikeReceived(
  _prev: BuyerCheckState,
  formData: FormData
): Promise<BuyerCheckState> {
  const paymentId = (formData.get("paymentId") as string)?.trim()

  const tx = await confirmBuyerReceived(paymentId)

  return {
    transaction: {
      paymentId: tx.id,
      listingTitle: tx.listing.title,
      price: tx.listing.price,
      buyerConfirmed: true,
    },
  }
}

// ── Seller: look up listing by Listing ID ─────────────────────────────────────

export type SellerCheckState = {
  error?: string
  listing?: {
    id: string
    title: string
    price: number
    paymentReceived: boolean
    buyerConfirmed: boolean
    sellerPaid: boolean
    transactionId?: string
  }
  payoutSuccess?: boolean
}

export async function checkSellerListing(
  _prev: SellerCheckState,
  formData: FormData
): Promise<SellerCheckState> {
  const listingId = (formData.get("listingId") as string)?.trim()
  if (!listingId) return { error: "Listing ID is required." }

  const listing = await getListingWithTransactions(listingId)
  if (!listing) return { error: "No listing found with that ID." }

  const tx = listing.transactions[0]

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      paymentReceived: tx?.paymentReceived ?? false,
      buyerConfirmed: tx?.buyerConfirmed ?? false,
      sellerPaid: tx?.sellerPaid ?? false,
      transactionId: tx?.id,
    },
  }
}


export async function requestPayout(
  _prev: SellerCheckState,
  formData: FormData
): Promise<SellerCheckState> {
  const result = payoutSchema.safeParse({
    transactionId: formData.get("transactionId"),
    interacEmail: formData.get("interacEmail"),
  })

  if (!result.success) {
    return { error: z.flattenError(result.error).fieldErrors.interacEmail?.[0] }
  }

  const tx = await recordSellerPayout(result.data.transactionId, result.data.interacEmail)

  return {
    payoutSuccess: true,
    listing: {
      id: tx.listing.id,
      title: tx.listing.title,
      price: tx.listing.price,
      paymentReceived: tx.paymentReceived,
      buyerConfirmed: tx.buyerConfirmed,
      sellerPaid: true,
      transactionId: tx.id,
    },
  }
}
