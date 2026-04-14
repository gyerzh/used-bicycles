import { getAllListings } from "@/db/listings"
import { ListingSearch } from "@/components/listing-search"

export const dynamic = "force-dynamic"

export default async function Home() {
  const listings = (await getAllListings()).map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }))

  const prices = listings.map((l) => l.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 2000

  return <ListingSearch listings={listings} minPrice={minPrice} maxPrice={maxPrice} />
}
