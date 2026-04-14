import { payoutSchema } from "@/zod/transactions"
import { z } from "zod"

const valid = {
  transactionId: "PAY-1234567890-ABCDEFGH",
  interacEmail: "seller@example.com",
}

describe("payoutSchema", () => {
  it("accepts valid payout data", () => {
    expect(payoutSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects empty transactionId", () => {
    const r = payoutSchema.safeParse({ ...valid, transactionId: "" })
    expect(r.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const r = payoutSchema.safeParse({ ...valid, interacEmail: "not-an-email" })
    expect(r.success).toBe(false)
    if (!r.success)
      expect(
        z.flattenError(r.error).fieldErrors.interacEmail?.[0]
      ).toBe("Enter a valid email address.")
  })

  it("rejects empty email", () => {
    const r = payoutSchema.safeParse({ ...valid, interacEmail: "" })
    expect(r.success).toBe(false)
  })

  it("infers correct types", () => {
    const r = payoutSchema.safeParse(valid)
    if (r.success) {
      expect(typeof r.data.transactionId).toBe("string")
      expect(typeof r.data.interacEmail).toBe("string")
    }
  })
})
