import { z } from "zod"

export const payoutSchema = z.object({
  transactionId: z.string().min(1),
  interacEmail: z.email("Enter a valid email address."),
})

export type PayoutInput = z.infer<typeof payoutSchema>
