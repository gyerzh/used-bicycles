import { prisma } from "@/lib/prisma"

export function createTransaction(data: { id: string; listingId: string }) {
  return prisma.transaction.create({ data })
}

export function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: { listing: true },
  })
}

export function confirmBuyerReceived(id: string) {
  return prisma.transaction.update({
    where: { id },
    data: { buyerConfirmed: true },
    include: { listing: true },
  })
}

export function recordSellerPayout(id: string, interacEmail: string) {
  return prisma.transaction.update({
    where: { id },
    data: { sellerInterac: interacEmail, sellerPaid: true },
    include: { listing: true },
  })
}
