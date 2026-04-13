"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  checkBuyerOrder,
  confirmBikeReceived,
  checkSellerListing,
  requestPayout,
  type BuyerCheckState,
  type SellerCheckState,
} from "@/app/check-listing/actions"

export function CheckListingClient() {
  const [buyerState, buyerCheckAction, buyerCheckPending] =
    useActionState<BuyerCheckState, FormData>(checkBuyerOrder, {})

  const [confirmState, confirmAction, confirmPending] =
    useActionState<BuyerCheckState, FormData>(confirmBikeReceived, {})

  const [sellerState, sellerCheckAction, sellerCheckPending] =
    useActionState<SellerCheckState, FormData>(checkSellerListing, {})

  const [payoutState, payoutAction, payoutPending] =
    useActionState<SellerCheckState, FormData>(requestPayout, {})

  const activeBuyerTx = confirmState.transaction ?? buyerState.transaction
  const activeSellerListing = payoutState.listing ?? sellerState.listing

  return (
    <div className="px-4 pt-5 pb-12">
      {/* Back nav */}
      <div className="pb-4 mb-6 border-b border-zinc-100">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Back to Search
        </Link>
      </div>

      <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">
        Check Listing
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        Enter your Buyer ID or Seller ID to check the status of a transaction.
      </p>

      <div className="space-y-10">
        {/* ── Buyer section ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-700">
            I am a Buyer
          </h2>

          <form action={buyerCheckAction} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="paymentId">Payment ID</Label>
              <Input
                id="paymentId"
                name="paymentId"
                placeholder="PAY-0000000000000-XXXXXXXX"
              />
            </div>
            {buyerState.error && (
              <p className="text-xs text-red-500">{buyerState.error}</p>
            )}
            <Button
              type="submit"
              disabled={buyerCheckPending}
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              {buyerCheckPending ? "Checking..." : "Check Status"}
            </Button>
          </form>

          {activeBuyerTx && (
            <div className="rounded-xl border border-zinc-200 p-4 space-y-4">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                  Order
                </p>
                <p className="font-bold text-sm">{activeBuyerTx.listingTitle}</p>
                <p className="text-sm text-zinc-500">${activeBuyerTx.price}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {activeBuyerTx.buyerConfirmed ? (
                  <>
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span className="text-green-700 font-medium">
                      You confirmed receiving the bicycle.
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="size-4 text-amber-500" />
                    <span className="text-zinc-600">
                      Awaiting your delivery confirmation.
                    </span>
                  </>
                )}
              </div>

              {!activeBuyerTx.buyerConfirmed && (
                <form action={confirmAction}>
                  <input
                    type="hidden"
                    name="paymentId"
                    value={activeBuyerTx.paymentId}
                  />
                  <Button
                    type="submit"
                    disabled={confirmPending}
                    className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {confirmPending
                      ? "Confirming..."
                      : "I Received the Bicycle"}
                  </Button>
                </form>
              )}
            </div>
          )}
        </section>

        <div className="h-px bg-zinc-100" />

        {/* ── Seller section ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-700">
            I am a Seller
          </h2>

          <form action={sellerCheckAction} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="listingId">Listing ID</Label>
              <Input
                id="listingId"
                name="listingId"
                placeholder="BCY-0000000000000-XXXXXXXX"
              />
            </div>
            {sellerState.error && (
              <p className="text-xs text-red-500">{sellerState.error}</p>
            )}
            <Button
              type="submit"
              disabled={sellerCheckPending}
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              {sellerCheckPending ? "Checking..." : "Check Status"}
            </Button>
          </form>

          {activeSellerListing && (
            <div className="rounded-xl border border-zinc-200 p-4 space-y-4">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                  Listing
                </p>
                <p className="font-bold text-sm">{activeSellerListing.title}</p>
                <p className="text-sm text-zinc-500">${activeSellerListing.price}</p>
              </div>

              {/* Status rows */}
              <div className="space-y-2">
                <StatusRow
                  done={activeSellerListing.paymentReceived}
                  label="Payment received by platform"
                />
                <StatusRow
                  done={activeSellerListing.buyerConfirmed}
                  label="Buyer confirmed delivery"
                />
                <StatusRow
                  done={activeSellerListing.sellerPaid}
                  label="Funds released to seller"
                />
              </div>

              {/* Payout form: both conditions met, not yet paid */}
              {activeSellerListing.paymentReceived &&
                activeSellerListing.buyerConfirmed &&
                !activeSellerListing.sellerPaid && (
                  <form action={payoutAction} className="space-y-3 pt-1">
                    <input
                      type="hidden"
                      name="transactionId"
                      value={activeSellerListing.transactionId}
                    />
                    <div className="space-y-1.5">
                      <Label htmlFor="interacEmail">
                        Your Interac e-Transfer email
                      </Label>
                      <Input
                        id="interacEmail"
                        name="interacEmail"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                    {payoutState.error && (
                      <p className="text-xs text-red-500">{payoutState.error}</p>
                    )}
                    <Button
                      type="submit"
                      disabled={payoutPending}
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {payoutPending ? "Submitting..." : "Receive My Payment"}
                    </Button>
                  </form>
                )}

              {(payoutState.payoutSuccess || activeSellerListing.sellerPaid) && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="size-4 text-green-500" />
                  Payment will be sent to your Interac email shortly.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatusRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="size-4 text-green-500 shrink-0" />
      ) : (
        <XCircle className="size-4 text-zinc-300 shrink-0" />
      )}
      <span className={done ? "text-zinc-800" : "text-zinc-400"}>{label}</span>
    </div>
  )
}
