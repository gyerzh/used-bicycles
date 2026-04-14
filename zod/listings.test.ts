import { listingSchema } from "@/zod/listings"
import { z } from "zod"

const valid = {
  title: "Trek Mountain Bike",
  description: "Excellent condition, barely used",
  price: 500,
  videoUrl: "https://example.com/video.mp4",
}

describe("listingSchema", () => {
  it("accepts valid listing data", () => {
    expect(listingSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects empty title", () => {
    const r = listingSchema.safeParse({ ...valid, title: "" })
    expect(r.success).toBe(false)
    if (!r.success)
      expect(z.flattenError(r.error).fieldErrors.title?.[0]).toBe(
        "Title is required."
      )
  })

  it("rejects empty description", () => {
    const r = listingSchema.safeParse({ ...valid, description: "" })
    expect(r.success).toBe(false)
    if (!r.success)
      expect(
        z.flattenError(r.error).fieldErrors.description?.[0]
      ).toBe("Description is required.")
  })

  it("rejects zero price", () => {
    const r = listingSchema.safeParse({ ...valid, price: 0 })
    expect(r.success).toBe(false)
    if (!r.success)
      expect(z.flattenError(r.error).fieldErrors.price?.[0]).toBe(
        "Price must be greater than 0."
      )
  })

  it("rejects negative price", () => {
    const r = listingSchema.safeParse({ ...valid, price: -100 })
    expect(r.success).toBe(false)
  })

  it("coerces price from string", () => {
    const r = listingSchema.safeParse({ ...valid, price: "299.99" })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.price).toBe(299.99)
  })

  it("rejects non-numeric price string", () => {
    const r = listingSchema.safeParse({ ...valid, price: "free" })
    expect(r.success).toBe(false)
  })

  it("rejects invalid videoUrl", () => {
    const r = listingSchema.safeParse({ ...valid, videoUrl: "not-a-url" })
    expect(r.success).toBe(false)
    if (!r.success)
      expect(z.flattenError(r.error).fieldErrors.videoUrl?.[0]).toBe(
        "A valid uploaded video is required."
      )
  })

  it("rejects empty videoUrl", () => {
    const r = listingSchema.safeParse({ ...valid, videoUrl: "" })
    expect(r.success).toBe(false)
  })
})
