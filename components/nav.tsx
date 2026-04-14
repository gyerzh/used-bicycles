import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold uppercase tracking-widest">
          Used Bikes
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/check-listing"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Check Order
          </Link>
          <Button
            asChild
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm"
          >
            <Link href="/sell">Sell Bicycle</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
