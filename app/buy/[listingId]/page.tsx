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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl overflow-hidden">
        <BuyForm listing={listing} />
      </div>
    </div>
  )
}
