import { buyListing } from "@/app/buy/[listingId]/actions"
import { getListingById } from "@/db/listings"
import { createTransaction } from "@/db/transactions"

jest.mock("@/db/listings", () => ({ getListingById: jest.fn() }))
jest.mock("@/db/transactions", () => ({ createTransaction: jest.fn().mockResolvedValue(undefined) }))

const mockListing = {
  id: "BCY-1234567890-ABCDEFGH",
  title: "Trek Mountain Bike",
  description: "Great condition",
  price: 500,
  videoUrl: "https://example.com/video.mp4",
  createdAt: new Date(),
}

function fd(data: Record<string, string>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(data)) form.append(k, v)
  return form
}

describe("buyListing action", () => {
  it("returns error when listing is not found", async () => {
    ;(getListingById as jest.Mock).mockResolvedValueOnce(null)
    const result = await buyListing({}, fd({ listingId: "BCY-999-NOTFOUND" }))
    expect(result.error).toBe("Listing not found.")
    expect(result.success).toBeUndefined()
  })

  it("returns success with PAY- payment ID when listing exists", async () => {
    ;(getListingById as jest.Mock).mockResolvedValueOnce(mockListing)
    const result = await buyListing({}, fd({ listingId: mockListing.id }))
    expect(result.error).toBeUndefined()
    expect(result.success?.paymentId).toMatch(/^PAY-\d+-[A-Z0-9]+$/)
  })

  it("returns the correct price in the success payload", async () => {
    ;(getListingById as jest.Mock).mockResolvedValueOnce(mockListing)
    const result = await buyListing({}, fd({ listingId: mockListing.id }))
    expect(result.success?.price).toBe(500)
  })

  it("calls createTransaction with the listing's ID", async () => {
    ;(getListingById as jest.Mock).mockResolvedValueOnce(mockListing)
    await buyListing({}, fd({ listingId: mockListing.id }))
    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ listingId: mockListing.id })
    )
  })

  it("generates a unique payment ID each purchase", async () => {
    ;(getListingById as jest.Mock)
      .mockResolvedValueOnce(mockListing)
      .mockResolvedValueOnce(mockListing)
    const [a, b] = await Promise.all([
      buyListing({}, fd({ listingId: mockListing.id })),
      buyListing({}, fd({ listingId: mockListing.id })),
    ])
    expect(a.success?.paymentId).not.toBe(b.success?.paymentId)
  })
})
