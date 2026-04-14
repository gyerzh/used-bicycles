import { prisma } from "@/lib/prisma"

export function createListing(data: {
  id: string
  title: string
  description: string
  price: number
  videoUrl: string
}) {
  return prisma.listing.create({ data })
}

export function getAllListings() {
  return prisma.listing.findMany({
    where: { transactions: { none: {} } },
    orderBy: { createdAt: "desc" },
  })
}

export function getListingById(id: string) {
  return prisma.listing.findUnique({ where: { id } })
}

export function getListingWithTransactions(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 1 } },
  })
}
