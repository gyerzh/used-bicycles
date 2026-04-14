# Used Bicycles

### [used-bicycles.vercel.app](https://used-bicycles.vercel.app)

A peer-to-peer marketplace for buying and selling used bicycles in Canada.

## What it does

Sellers list their bicycle with a title, description, price, and a short video showcase. The video is uploaded directly to Vercel Blob storage. On a successful listing the seller receives a **Listing ID** (e.g. `BCY-…`) which they keep to track their sale.

Buyers browse available listings, watch the video, and complete a purchase in one click. On success they receive a **Payment ID** (e.g. `PAY-…`) which acts as their proof of purchase.

Payment is held by the platform until the buyer confirms delivery. Once the buyer confirms, the seller can submit their Interac e-Transfer email through the **Check Order** page to receive their funds.

## User flows

| Who | Flow |
|-----|------|
| Seller | Browse → `/sell` → upload video → publish → save Listing ID |
| Buyer | Browse → pick listing → buy → save Payment ID |
| Buyer (follow-up) | `/check-listing` → enter Payment ID → confirm delivery |
| Seller (follow-up) | `/check-listing` → enter Listing ID → submit Interac email → get paid |

## Tech stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **PostgreSQL + Prisma** — hosted on Prisma Postgres
- **Vercel Blob** — client-side video uploads (bypasses serverless size limits)
- **Zod** — schema validation on all form inputs
- **shadcn/ui + Tailwind CSS** — UI components

## Development

```bash
npm install
npm run dev
```

Requires a `.env` file with:

```
DATABASE_URL="..."
BLOB_READ_WRITE_TOKEN="..."
```

## Testing

```bash
npm test
```

38 unit tests covering all Zod schemas and server actions. Coverage is enforced at 80% and runs automatically on every push via GitHub Actions.
