"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar (filters) ── */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-[57px] lg:self-start">
          <h1 className="text-xl font-bold uppercase tracking-wide hidden lg:block">
            Browse Listings
          </h1>

          <div className="bg-white rounded-2xl p-4 space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
              <Search className="size-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search bicycles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Price Range</span>
                <span className="text-sm font-semibold">
                  ${priceRange[0]} – ${priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">${minPrice}</span>
                <span className="text-xs text-zinc-400">${maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Listings ── */}
        <section className="flex-1 min-w-0">
          {/* Mobile heading */}
          <h1 className="text-xl font-bold uppercase tracking-wide mb-4 lg:hidden">
            Browse Listings
          </h1>

          <p className="text-sm text-zinc-500 mb-4">{filtered.length} bicycles found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((bike) => (
              <Link key={bike.id} href={`/buy/${bike.id}`}>
                <Card className="overflow-hidden rounded-2xl h-full hover:shadow-md transition-shadow">
                  <video
                    src={bike.videoUrl}
                    muted
                    playsInline
                    className="w-full h-44 object-cover"
                  />
                  <CardContent className="pt-3 space-y-1">
                    <h2 className="font-black text-sm uppercase tracking-wide leading-snug">
                      {bike.title}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
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
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-zinc-400 py-16 text-sm">
              No bicycles match your search.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
