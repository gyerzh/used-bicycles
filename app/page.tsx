"use client"

import * as React from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const BICYCLES = [
  {
    id: 1,
    title: "Trek Mountain Bike - Excellent Condition",
    description:
      "Lightly used Trek mountain bike with 21-speed Shimano gears. Perfect for trails and city riding...",
    price: 450,
    date: "4/10/2026",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
  },
  {
    id: 2,
    title: "Specialized Road Bike - Like New",
    description:
      "Barely used Specialized Allez road bike, carbon fork, 105 groupset. Great for long rides...",
    price: 850,
    date: "4/9/2026",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
  },
  {
    id: 3,
    title: "Vintage Schwinn Cruiser",
    description:
      "Classic 1970s Schwinn cruiser in great shape. New tires and fresh tune-up. Beach ready...",
    price: 200,
    date: "4/8/2026",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80",
  },
  {
    id: 4,
    title: "Giant Hybrid Commuter Bike",
    description:
      "Giant Escape 3 hybrid, perfect for commuting. Front suspension, 24 speeds, rear rack included...",
    price: 320,
    date: "4/7/2026",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80",
  },
  {
    id: 5,
    title: "Kids BMX Bike - 20 inch",
    description:
      "24 inch kids BMX in good condition, minor scratches. Suitable for ages 8-12. Includes helmet...",
    price: 95,
    date: "4/6/2026",
    image: "https://images.unsplash.com/photo-1544191696-102dbeb5d99a?w=800&q=80",
  },
]

const MAX_PRICE = 2000

export default function Home() {
  const [query, setQuery] = React.useState("")
  const [priceRange, setPriceRange] = React.useState([0, MAX_PRICE])

  const filtered = BICYCLES.filter((b) => {
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
              max={MAX_PRICE}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">$0</span>
              <span className="text-xs text-zinc-400">${MAX_PRICE.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-100 mt-4" />

        {/* Results */}
        <div className="px-4 py-4 space-y-4">
          <p className="text-sm text-zinc-500">{filtered.length} bicycles found</p>

          {filtered.map((bike) => (
            <Card key={bike.id} className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bike.image}
                alt={bike.title}
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
                <span className="text-sm text-zinc-400">{bike.date}</span>
              </CardFooter>
            </Card>
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
