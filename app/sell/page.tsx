"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Upload, X, CheckCircle2 } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createListing, type ListingState } from "./actions"
import { ListingSuccess } from "@/components/listing-success"

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; url: string; name: string }
  | { status: "error"; message: string }

export default function SellPage() {
  const [formState, formAction, pending] = useActionState<ListingState, FormData>(
    createListing,
    {}
  )
  const [uploadState, setUploadState] = React.useState<UploadState>({
    status: "idle",
  })
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadState({ status: "uploading", progress: 0 })
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) =>
          setUploadState({ status: "uploading", progress: percentage }),
      })
      setUploadState({ status: "done", url: blob.url, name: file.name })
    } catch (err) {
      setUploadState({
        status: "error",
        message: (err as Error).message,
      })
    }
  }

  function clearVideo() {
    setUploadState({ status: "idle" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-lg bg-white min-h-screen">
        {/* Back nav */}
        <div className="px-4 pt-5 pb-4 border-b border-zinc-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900"
          >
            <ArrowLeft className="size-4" />
            Back to Search
          </Link>
        </div>

        <div className="px-4 pt-6 pb-10">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">
            Sell Your Bicycle
          </h1>
          <p className="text-sm text-zinc-500 mb-8">
            Fill out the form below to list your bicycle for sale. Make sure to
            provide accurate details and a video showcase.
          </p>

          {formState.success ? (
            <ListingSuccess listingId={formState.success.listingId} />
          ) : (
          <form action={formAction} className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Bicycle Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Trek Mountain Bike - Excellent Condition"
              />
              {formState.errors?.title && (
                <p className="text-xs text-red-500">{formState.errors.title[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe your bicycle's condition, features, and any included accessories..."
                className="resize-none"
              />
              {formState.errors?.description && (
                <p className="text-xs text-red-500">
                  {formState.errors.description[0]}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Price (USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
              {formState.errors?.price && (
                <p className="text-xs text-red-500">{formState.errors.price[0]}</p>
              )}
            </div>

            {/* Video */}
            <div className="space-y-1.5">
              <Label>
                Video <span className="text-red-500">*</span>
              </Label>

              {uploadState.status === "idle" || uploadState.status === "error" ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 flex flex-col items-center gap-3 hover:border-zinc-300 hover:bg-zinc-100 transition-colors"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-zinc-200">
                    <Upload className="size-5 text-zinc-500" />
                  </span>
                  <span className="text-sm font-bold">Click to upload video</span>
                  <span className="text-xs text-zinc-400">
                    MP4, MOV, AVI up to 100MB
                  </span>
                  {uploadState.status === "error" && (
                    <span className="text-xs text-red-500">
                      {uploadState.message}
                    </span>
                  )}
                </button>
              ) : uploadState.status === "uploading" ? (
                <div className="w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-10 flex flex-col items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                    <Upload className="size-5 text-blue-500 animate-pulse" />
                  </span>
                  <span className="text-sm font-bold text-blue-700">
                    Uploading... {uploadState.progress}%
                  </span>
                  <div className="w-full max-w-xs h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-xl border-2 border-dashed border-green-200 bg-green-50 px-4 py-6 flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                  <span className="flex-1 text-sm text-zinc-700 truncate">
                    {uploadState.name}
                  </span>
                  <button
                    type="button"
                    onClick={clearVideo}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Hidden field carries the Vercel Blob URL into the server action */}
              {uploadState.status === "done" && (
                <input type="hidden" name="videoUrl" value={uploadState.url} />
              )}

              {formState.errors?.videoUrl && (
                <p className="text-xs text-red-500">
                  {formState.errors.videoUrl[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={pending || uploadState.status === "uploading"}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
            >
              {pending ? "Publishing..." : "Publish Listing"}
            </Button>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
