"use client"

import * as React from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  videoUrl: string
  createdAt: string
}

interface Props {
  listings: Listing[]
  minPrice: number
  maxPrice: number
}

export function ListingSearch({ listings, minPrice, maxPrice }: Props) {
  const [query, setQuery] = React.useState("")
  const [priceRange, setPriceRange] = React.useState([minPrice, maxPrice])

  const filtered = listings.filter((b) => {
    const matchesQuery =
      query.trim() === "" ||
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.description.toLowerCase().includes(query.toLowerCase())
    const matchesPrice = b.price >= priceRange[0] && b.price <= priceRange[1]
    return matchesQuery && matchesPrice
  })

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-lg bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold tracking-wide uppercase">
            Buy/Sell Bikes
          </h1>
          <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 h-10">
            <Link href="/sell">Sell Bicycle</Link>
          </Button>
        </div>

        <div className="px-4 space-y-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
            <Search className="size-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Search bicycles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <SlidersHorizontal className="size-4 text-zinc-400 shrink-0" />
          </div>

          {/* Price Range */}
          <div className="rounded-xl bg-zinc-100 px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Price Range</span>
              <span className="text-sm font-semibold">
                ${priceRange[0]} - ${priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              min={0}
              max={maxPrice}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">$0</span>
              <span className="text-xs text-zinc-400">${maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-100 mt-4" />

        {/* Results */}
        <div className="px-4 py-4 space-y-4">
          <p className="text-sm text-zinc-500">{filtered.length} bicycles found</p>

          {filtered.map((bike) => (
            <Link key={bike.id} href={`/buy/${bike.id}`}>
              <Card className="overflow-hidden rounded-2xl">
                <video
                  src={bike.videoUrl}
                  muted
                  playsInline
                  className="w-full h-48 object-cover"
                />
                <CardContent className="pt-4 space-y-1">
                  <h2 className="font-black text-sm uppercase tracking-wide leading-snug">
                    {bike.title}
                  </h2>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {bike.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-2 flex items-center justify-between bg-white border-0">
                  <span className="text-sm font-bold">${bike.price}</span>
                  <span className="text-sm text-zinc-400">
                    {new Date(bike.createdAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-zinc-400 py-12 text-sm">
              No bicycles match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
