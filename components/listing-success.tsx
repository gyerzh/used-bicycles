"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ListingSuccessProps {
  listingId: string
}

export function ListingSuccess({ listingId }: ListingSuccessProps) {
  const [copied, setCopied] = React.useState(false)

  async function copyId() {
    await navigator.clipboard.writeText(listingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-green-50 border border-green-100 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-7 text-green-600 shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wide text-green-700">
              Listing Published!
            </p>
            <p className="text-sm text-green-600">
              Your bicycle has been successfully listed.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-zinc-700">Your Listing ID</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono text-zinc-800 truncate">
              {listingId}
            </div>
            <button
              type="button"
              onClick={copyId}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4 text-zinc-500" />
              )}
            </button>
          </div>
          <p className="text-xs text-green-600">
            Save this ID to track or manage your listing later.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1 h-12 rounded-xl">
          <Link href="/">View All Listings</Link>
        </Button>
        <Button
          asChild
          className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <a href="/sell">List Another Bicycle</a>
        </Button>
      </div>
    </div>
  )
}
