import { createListing } from "@/app/sell/actions"

jest.mock("@/db/listings", () => ({
  createListing: jest.fn().mockResolvedValue(undefined),
}))

function fd(data: Record<string, string>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(data)) form.append(k, v)
  return form
}

const valid = {
  title: "Trek Mountain Bike",
  description: "Great condition, barely ridden",
  price: "500",
  videoUrl: "https://blob.vercel-storage.com/video.mp4",
}

describe("createListing action", () => {
  it("returns field errors when title is empty", async () => {
    const result = await createListing({}, fd({ ...valid, title: "" }))
    expect(result.errors?.title).toBeDefined()
    expect(result.success).toBeUndefined()
  })

  it("returns field errors when description is empty", async () => {
    const result = await createListing({}, fd({ ...valid, description: "" }))
    expect(result.errors?.description).toBeDefined()
    expect(result.success).toBeUndefined()
  })

  it("returns field errors when price is zero", async () => {
    const result = await createListing({}, fd({ ...valid, price: "0" }))
    expect(result.errors?.price).toBeDefined()
    expect(result.success).toBeUndefined()
  })

  it("returns field errors when price is negative", async () => {
    const result = await createListing({}, fd({ ...valid, price: "-1" }))
    expect(result.errors?.price).toBeDefined()
  })

  it("returns field errors when videoUrl is missing", async () => {
    const result = await createListing({}, fd({ ...valid, videoUrl: "" }))
    expect(result.errors?.videoUrl).toBeDefined()
    expect(result.success).toBeUndefined()
  })

  it("returns field errors when videoUrl is not a URL", async () => {
    const result = await createListing({}, fd({ ...valid, videoUrl: "not-a-url" }))
    expect(result.errors?.videoUrl).toBeDefined()
  })

  it("returns success with BCY- listing ID on valid input", async () => {
    const result = await createListing({}, fd(valid))
    expect(result.errors).toBeUndefined()
    expect(result.success?.listingId).toMatch(/^BCY-\d+-[A-Z0-9]+$/)
  })

  it("generates a unique listing ID each call", async () => {
    const [a, b] = await Promise.all([
      createListing({}, fd(valid)),
      createListing({}, fd(valid)),
    ])
    expect(a.success?.listingId).not.toBe(b.success?.listingId)
  })
})
