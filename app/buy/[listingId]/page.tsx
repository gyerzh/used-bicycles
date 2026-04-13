import { notFound } from "next/navigation"
import { getListingById } from "@/db/listings"
import { BuyForm } from "@/components/buy-form"

interface Props {
  params: Promise<{ listingId: string }>
}

export default async function BuyPage({ params }: Props) {
  const { listingId } = await params
  const listing = await getListingById(listingId)
  if (!listing) notFound()

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-lg bg-white min-h-screen">
        <BuyForm listing={listing} />
      </div>
    </div>
  )
}
