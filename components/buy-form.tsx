"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PurchaseSuccess } from "@/components/purchase-success"
import { buyListing, type BuyState } from "@/app/buy/[listingId]/actions"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  videoUrl: string
  createdAt: Date
}

interface Props {
  listing: Listing
}

export function BuyForm({ listing }: Props) {
  const [state, formAction, pending] = useActionState<BuyState, FormData>(
    buyListing,
    {}
  )

  const formattedDate = listing.createdAt.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Video */}
      <div className="lg:w-3/5 shrink-0">
        <video
          src={listing.videoUrl}
          controls
          className="w-full aspect-video lg:aspect-auto lg:h-full bg-black object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 px-6 py-6 flex flex-col gap-6">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Back to Search
        </Link>

        <div>
          <h1 className="text-xl font-black uppercase tracking-wide leading-tight mb-2">
            {listing.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold">${listing.price}</span>
            <span className="text-sm text-zinc-400">Listed {formattedDate}</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-2">
            Description
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="mt-auto">
          {state.success ? (
            <PurchaseSuccess paymentId={state.success.paymentId} />
          ) : (
            <form action={formAction}>
              <input type="hidden" name="listingId" value={listing.id} />
              {state.error && (
                <p className="text-xs text-red-500 mb-3">{state.error}</p>
              )}
              <Button
                type="submit"
                disabled={pending}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
              >
                {pending ? "Processing..." : `Buy Now - $${listing.price}`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
