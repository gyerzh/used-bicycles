import {
  checkBuyerOrder,
  confirmBikeReceived,
  checkSellerListing,
  requestPayout,
} from "@/app/check-listing/actions"
import {
  getTransactionById,
  confirmBuyerReceived as dbConfirmBuyer,
  recordSellerPayout,
} from "@/db/transactions"
import { getListingWithTransactions } from "@/db/listings"

jest.mock("@/db/transactions", () => ({
  getTransactionById: jest.fn(),
  confirmBuyerReceived: jest.fn(),
  recordSellerPayout: jest.fn(),
}))
jest.mock("@/db/listings", () => ({
  getListingWithTransactions: jest.fn(),
}))

function fd(data: Record<string, string>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(data)) form.append(k, v)
  return form
}

const mockTx = {
  id: "PAY-123-ABCDEFGH",
  listingId: "BCY-1-XYZ",
  listing: { id: "BCY-1-XYZ", title: "Trek Bike", price: 500 },
  buyerConfirmed: false,
  paymentReceived: true,
  sellerPaid: false,
  sellerInterac: null,
  createdAt: new Date(),
}

const mockListingWithTx = {
  id: "BCY-1-XYZ",
  title: "Trek Bike",
  price: 500,
  description: "",
  videoUrl: "",
  createdAt: new Date(),
  transactions: [mockTx],
}

// ── checkBuyerOrder ────────────────────────────────────────────────────────────

describe("checkBuyerOrder", () => {
  it("returns error when paymentId is empty", async () => {
    const result = await checkBuyerOrder({}, fd({ paymentId: "  " }))
    expect(result.error).toBe("Payment ID is required.")
    expect(result.transaction).toBeUndefined()
  })

  it("returns error when transaction is not found", async () => {
    ;(getTransactionById as jest.Mock).mockResolvedValueOnce(null)
    const result = await checkBuyerOrder({}, fd({ paymentId: "PAY-999-NOTFOUND" }))
    expect(result.error).toBe("No order found with that Payment ID.")
  })

  it("returns transaction details when found", async () => {
    ;(getTransactionById as jest.Mock).mockResolvedValueOnce(mockTx)
    const result = await checkBuyerOrder({}, fd({ paymentId: "PAY-123-ABCDEFGH" }))
    expect(result.error).toBeUndefined()
    expect(result.transaction?.paymentId).toBe("PAY-123-ABCDEFGH")
    expect(result.transaction?.listingTitle).toBe("Trek Bike")
    expect(result.transaction?.price).toBe(500)
    expect(result.transaction?.buyerConfirmed).toBe(false)
  })
})

// ── confirmBikeReceived ────────────────────────────────────────────────────────

describe("confirmBikeReceived", () => {
  it("returns updated transaction with buyerConfirmed true", async () => {
    ;(dbConfirmBuyer as jest.Mock).mockResolvedValueOnce({
      ...mockTx,
      buyerConfirmed: true,
    })
    const result = await confirmBikeReceived({}, fd({ paymentId: "PAY-123-ABCDEFGH" }))
    expect(result.transaction?.buyerConfirmed).toBe(true)
    expect(result.transaction?.paymentId).toBe("PAY-123-ABCDEFGH")
    expect(result.transaction?.price).toBe(500)
  })
})

// ── checkSellerListing ─────────────────────────────────────────────────────────

describe("checkSellerListing", () => {
  it("returns error when listingId is empty", async () => {
    const result = await checkSellerListing({}, fd({ listingId: "" }))
    expect(result.error).toBe("Listing ID is required.")
    expect(result.listing).toBeUndefined()
  })

  it("returns error when listing is not found", async () => {
    ;(getListingWithTransactions as jest.Mock).mockResolvedValueOnce(null)
    const result = await checkSellerListing({}, fd({ listingId: "BCY-999-NOTFOUND" }))
    expect(result.error).toBe("No listing found with that ID.")
  })

  it("returns listing with transaction details when found", async () => {
    ;(getListingWithTransactions as jest.Mock).mockResolvedValueOnce(mockListingWithTx)
    const result = await checkSellerListing({}, fd({ listingId: "BCY-1-XYZ" }))
    expect(result.error).toBeUndefined()
    expect(result.listing?.title).toBe("Trek Bike")
    expect(result.listing?.price).toBe(500)
    expect(result.listing?.paymentReceived).toBe(true)
    expect(result.listing?.buyerConfirmed).toBe(false)
    expect(result.listing?.sellerPaid).toBe(false)
    expect(result.listing?.transactionId).toBe("PAY-123-ABCDEFGH")
  })

  it("defaults all booleans to false when listing has no transactions", async () => {
    ;(getListingWithTransactions as jest.Mock).mockResolvedValueOnce({
      ...mockListingWithTx,
      transactions: [],
    })
    const result = await checkSellerListing({}, fd({ listingId: "BCY-1-XYZ" }))
    expect(result.listing?.paymentReceived).toBe(false)
    expect(result.listing?.buyerConfirmed).toBe(false)
    expect(result.listing?.sellerPaid).toBe(false)
    expect(result.listing?.transactionId).toBeUndefined()
  })
})

// ── requestPayout ──────────────────────────────────────────────────────────────

describe("requestPayout", () => {
  it("returns error when interac email is invalid", async () => {
    const result = await requestPayout(
      {},
      fd({ transactionId: "PAY-123-ABCDEFGH", interacEmail: "not-an-email" })
    )
    expect(result.error).toBe("Enter a valid email address.")
    expect(result.payoutSuccess).toBeUndefined()
  })

  it("returns payoutSuccess and updated listing on valid input", async () => {
    ;(recordSellerPayout as jest.Mock).mockResolvedValueOnce({
      ...mockTx,
      sellerInterac: "seller@example.com",
      sellerPaid: true,
      listing: mockListingWithTx,
    })
    const result = await requestPayout(
      {},
      fd({ transactionId: "PAY-123-ABCDEFGH", interacEmail: "seller@example.com" })
    )
    expect(result.payoutSuccess).toBe(true)
    expect(result.listing?.sellerPaid).toBe(true)
    expect(result.listing?.transactionId).toBe("PAY-123-ABCDEFGH")
  })

  it("calls recordSellerPayout with the correct arguments", async () => {
    ;(recordSellerPayout as jest.Mock).mockResolvedValueOnce({
      ...mockTx,
      sellerPaid: true,
      listing: mockListingWithTx,
    })
    await requestPayout(
      {},
      fd({ transactionId: "PAY-123-ABCDEFGH", interacEmail: "seller@example.com" })
    )
    expect(recordSellerPayout).toHaveBeenCalledWith(
      "PAY-123-ABCDEFGH",
      "seller@example.com"
    )
  })
})
