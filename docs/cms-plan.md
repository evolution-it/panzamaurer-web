# CMS & Admin Content Management Plan

## Overview

This document describes the plan to introduce a full content management system (CMS) for the Panza Maurer website, enabling administrators to manage all site content without touching code. The approach replaces all hardcoded data (attorney records, locations, news articles, practice areas, and page content) with a database-backed CMS that supports in-context editing, draft preview, revision history, and image management.

---

## Current State

The site is a Next.js 15 App Router application with all content hardcoded:

- **Attorneys/Professionals** — defined as large TypeScript `Record` objects inside `src/app/attorneys/page.tsx` and `src/app/attorneys/[slug]/page.tsx`, with a separate duplicate subset in `src/components/Team.tsx`
- **Locations** — duplicated across five components (`locations/page.tsx`, `contact/page.tsx`, `Footer.tsx`, `Locations.tsx`, `LocationsSection.tsx`) with inconsistent field shapes
- **News** — stored in `src/data/news.json`, the only centralized data file; no admin interface
- **Practice Areas** — content defined as a `Record` in `src/app/practice-areas/[slug]/page.tsx`
- **Navigation** — hardcoded in `src/components/Navbar.tsx`
- **No admin interface, no auth, no database, no image hosting**

---

## Technology Stack

### CMS: Sanity.io

**Sanity.io** is the chosen CMS for the following reasons:

- **In-context editing** via the Sanity Presentation tool — admins navigate the live site within the Studio and click any piece of content to open its edit form inline
- **Draft/publish workflow** built-in — changes are saved as drafts and only go live when explicitly published
- **Full revision history** — every save is versioned with timestamp, user identity, and a full document snapshot; any version can be restored with one click
- **Managed auth** — Sanity user accounts with role-based access (admin, editor, viewer)
- **No separate database to provision** — Sanity's content lake is the database
- **Vercel compatible** — Sanity is entirely API-based; no server process required; integrates natively with Vercel deployments
- **Generous free tier** — 2 users, unlimited documents, 10 GB assets on the free plan

### Image Storage: Sanity Assets CDN

All images (attorney headshots, location photos, news images) are uploaded to and served from Sanity's built-in asset CDN. No separate image hosting service (e.g., Cloudinary, Vercel Blob) is needed. The `@sanity/image-url` package generates optimized, resized image URLs on demand.

### Preview: Next.js Draft Mode + Sanity Presentation

Next.js Draft Mode is used to serve draft content to authenticated editors. When an admin activates preview from within Sanity Studio, a secure token enables Draft Mode and the page re-renders using live draft data from Sanity instead of the published cache.

### Revision History & Audit Trail: Sanity Document History

Sanity automatically stores every version of every document. The Studio's History panel shows:
- Who made each change (by Sanity user account)
- When the change was made
- A field-level diff of what changed
- A "Restore" button to revert to any previous version

No custom audit logging code is needed.

---

## Packages to Add

| Package | Purpose |
|---|---|
| `sanity` | Sanity Studio (embedded in Next.js at `/studio`) |
| `next-sanity` | Official Next.js integration — client, Draft Mode helpers, live content |
| `@sanity/visual-editing` | In-context editing overlays (stega encoding) |
| `@sanity/image-url` | Build optimized image URLs from Sanity asset references |

---

## Sanity Schema Design

### `attorney` Document Type

Represents a professional listed on the site. Replaces the separate `partners`, `ofCounsel`, and `attorneyData` structures.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Full display name |
| `firstName` | string | Used for contextual display ("Meet [firstName]") |
| `slug` | slug | Auto-generated from `name`; used in `/attorneys/[slug]` |
| `type` | string (enum) | `"Our Attorneys"` or `"Of Counsel"` — controls which section the attorney appears in |
| `role` | string | Title/role (e.g., "Partner", "Associate") |
| `image` | image | Sanity asset reference |
| `order` | number | Display order within their `type` group |
| `status` | string (enum) | `"published"` or `"archived"` |
| `education` | array of string | |
| `barAdmissions` | array of string | |
| `courtAdmissions` | array of string | |
| `professionalMemberships` | array of string | |
| `intro` | text | Introductory paragraph |
| `sections` | array of `{title: string, content: string[]}` | Bio detail sections |

**Used by:** `/` (home Team component), `/attorneys`, `/attorneys/[slug]`, `/practice-areas/government-relations`

---

### `location` Document Type

Represents a single office location. Replaces five separate hardcoded copies.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name (e.g., "Fort Lauderdale") |
| `slug` | slug | Auto-generated from `name` |
| `image` | image | Sanity asset reference |
| `address` | array of string | Street address lines |
| `city` | string | City name |
| `phone` | string | |
| `fax` | string | Optional |
| `building` | string | Optional building/suite descriptor |
| `order` | number | Display order |

**Used by:** `/` (home Locations component), `/about` (LocationsSection), `/locations`, `/contact`, `Footer`

---

### `newsArticle` Document Type

Represents a single news post. Replaces `src/data/news.json`.

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `slug` | slug | Auto-generated from `title` |
| `date` | date | ISO date; formatted for display on the frontend |
| `author` | string | Optional |
| `excerpt` | text | Short summary for listing cards |
| `content` | Portable Text | Rich text body (replaces markdown string) |
| `images` | array of image | Article images (Sanity assets) |
| `listingImages` | array of image | Thumbnail images for listing cards |
| `categories` | array of string | |
| `status` | string (enum) | `"published"`, `"archived"`, or `"deleted"` |

**Archive behavior:** Articles with `status = "archived"` appear on `/news/archive` but not on the main `/news` page. Articles with `status = "deleted"` are hidden from all public pages but remain in Sanity for history/audit purposes. Hard-deleting a document is always available via Sanity Studio.

**Used by:** `/` (home News component), `/news`, `/news/archive`, `/news/[slug]`

---

### `practiceArea` Document Type

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `slug` | slug | Auto-generated |
| `heading` | string | Sub-headline on the practice area page |
| `content` | array of text | Paragraphs |
| `featuredAttorneys` | array of references to `attorney` | Attorneys to highlight on this practice area page |
| `status` | string (enum) | `"published"` or `"archived"` |

---

### `page` Document Type

Represents any manageable page not covered by the structured types above (e.g., About, Contact, and any future pages). Enables adding, archiving, and deleting pages tied to navigation.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Page `<title>` tag |
| `navigationLabel` | string | Label shown in the nav bar |
| `slug` | slug | URL path (e.g., `about`, `contact`) |
| `showInNavigation` | boolean | Whether to include in the nav bar |
| `navigationOrder` | number | Position in the nav bar |
| `sections` | array of block content | Flexible page sections |
| `status` | string (enum) | `"published"` or `"archived"` |

Archived pages return a 404 and are removed from navigation. A catch-all route (`/src/app/[slug]/page.tsx`) renders any published `page` document.

---

### `siteSettings` Singleton

A single document (not an array) for global site configuration.

| Field | Type | Notes |
|---|---|---|
| `siteName` | string | |
| `navItems` | array of nav item | Ordered list of nav entries; each references a `page`, `practiceArea`, or has a hardcoded path |
| `footerTagline` | string | |
| `footerLocations` | array of references to `location` | Which locations appear in the footer and in what order |
| `contactEmail` | string | |
| `contactPhone` | string | |

---

## Data Migration

A one-time migration script (`scripts/migrate-to-sanity.ts`) will populate Sanity with the existing hardcoded content before the site is switched over.

### Migration Steps

1. **Attorneys** — Merge the `partners` and `ofCounsel` arrays from `attorneys/page.tsx` with the full `attorneyData` map from `attorneys/[slug]/page.tsx` into unified `attorney` documents. Assign `type = "Our Attorneys"` or `"Of Counsel"` accordingly. Upload images from `public/images/attorneys/` to Sanity Assets.

2. **Locations** — Use the `offices` array from `locations/page.tsx` (most complete shape with image, address, city, phone, fax). Upload images from `public/images/` to Sanity Assets.

3. **News Articles** — Parse `src/data/news.json`, convert markdown `content` strings to Portable Text blocks, create `newsArticle` documents. Upload images from `public/images/news/` to Sanity Assets.

4. **Practice Areas** — Extract the `practiceAreaData` map from `practice-areas/[slug]/page.tsx`, create `practiceArea` documents.

5. **Pages** — Create `page` documents for `/about` and `/contact` with their current content, configuring `showInNavigation` appropriately.

---

## In-Context Editing

Sanity's Presentation tool provides the in-context editing experience:

1. Admin opens Sanity Studio at `[domain]/studio`
2. Admin navigates to the Presentation tool
3. The live site renders inside an iframe within the Studio
4. Content elements on the page are overlaid with click targets (powered by stega encoding in the fetched data)
5. Clicking any content element opens the corresponding Sanity document and field in the Studio sidebar
6. Changes are saved as drafts; the preview updates in real time

This requires:
- Using `createClient({ stega: true })` in the draft-mode-aware Sanity client
- Wrapping page content with `VisualEditing` from `@sanity/visual-editing` (rendered only when Draft Mode is active)
- Configuring Presentation tool with the site's base URL and route-to-document mappings

---

## Preview Workflow

```
Admin edits document in Studio
  → Content saved as draft (not live)
    → Admin clicks "Open Preview" (or uses Presentation tool)
      → Studio opens the page URL with a Draft Mode token
        → Next.js Draft Mode activates
          → Page fetches draft content from Sanity (bypasses cache)
            → Admin reviews the page with draft content
              → Admin clicks "Publish" in Studio
                → Document goes live
                  → Vercel webhook triggers on-demand ISR revalidation
                    → Published page is live to public visitors
```

Draft Mode is activated via a secure API route (`/api/draft-mode/enable`) that validates a secret token before setting the Draft Mode cookie. This prevents unauthorized preview access.

---

## Navigation Management

- The `siteSettings` singleton contains an ordered array of navigation items
- Each nav item references either a `page` document, a `practiceArea` document, or a fixed path (for structured routes like `/attorneys`, `/news`, `/locations`)
- To **add a page to navigation**: create a `page` document with `showInNavigation = true` and set `navigationOrder`
- To **remove a page from navigation**: set `showInNavigation = false` or archive the document
- To **reorder navigation**: drag items in the `siteSettings` nav array in Studio
- `Navbar.tsx` fetches nav configuration from Sanity at build time; in Draft Mode it fetches live

---

## Site Pages & Content Sources (After Migration)

| Page | Sanity Query | Notes |
|---|---|---|
| `/` | `siteSettings`, `attorney` (top N by `order`), `newsArticle` (latest 3), `location` (all) | |
| `/attorneys` | `attorney` where `status == "published"`, sorted by `type` then `order` | Two sections: "Our Attorneys" and "Of Counsel" |
| `/attorneys/[slug]` | `attorney` by `slug` | Full profile |
| `/practice-areas` | All `practiceArea` where `status == "published"` | |
| `/practice-areas/[slug]` | `practiceArea` by `slug` + referenced `attorney` docs | |
| `/practice-areas/government-relations` | `practiceArea` by slug `government-relations` | Attorneys from referenced `attorney` docs |
| `/locations` | `location` (all, ordered) | |
| `/contact` | `page` by slug `contact` | Migrated from hardcoded |
| `/about` | `page` by slug `about` | Migrated from hardcoded |
| `/news` | `newsArticle` where `status == "published"`, latest 6 | |
| `/news/archive` | `newsArticle` where `status == "published"` or `"archived"`, paginated | |
| `/news/[slug]` | `newsArticle` by `slug` | |
| `/[slug]` (catch-all) | `page` by `slug` where `status == "published"` | Future dynamic pages |

---

## Revision History & Revert

Every time a document is saved in Sanity (whether as a draft or on publish), a new version is recorded in the document history. The History panel in the Studio document editor shows:

- A chronological list of all versions
- The Sanity user who made each change
- The exact fields that changed (diff view)
- A "Restore this version" action that creates a new draft from any historical snapshot

This satisfies the requirement to track updates by admin user and revert to previous changes without any custom implementation.

---

## Implementation Phases

### Phase 1 — Foundation

**Goal:** Sanity project is initialized and the Studio is accessible at `/studio`.

1. Create a Sanity project at [sanity.io](https://sanity.io), obtain `projectId` and `dataset`
2. Add environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`
3. Install packages: `sanity`, `next-sanity`, `@sanity/visual-editing`, `@sanity/image-url`
4. Create Sanity Studio route: `src/app/studio/[[...tool]]/page.tsx`
5. Define all schemas in `src/sanity/schemas/` (`attorney.ts`, `location.ts`, `newsArticle.ts`, `practiceArea.ts`, `page.ts`, `siteSettings.ts`)
6. Configure `src/sanity/schema.ts`, `src/sanity/env.ts`, `src/sanity/client.ts` (with draft-aware client)
7. Configure Draft Mode API route: `src/app/api/draft-mode/enable/route.ts`
8. Verify Studio loads and schemas are correct

### Phase 2 — Data Migration

**Goal:** All existing content is in Sanity.

1. Write `scripts/migrate-to-sanity.ts` using the `@sanity/client` mutations API
2. Upload images from `public/` to Sanity Assets, map old paths to new asset references
3. Run migration script against the Sanity dataset
4. Verify all documents appear correctly in Studio
5. Cross-check attorney count, location count, news article count

### Phase 3 — Page Rewiring

**Goal:** Every page fetches from Sanity; hardcoded data is removed.

1. Create GROQ query helpers in `src/sanity/queries/` for each content type
2. Rewire `src/app/attorneys/page.tsx` — replace `partners`/`ofCounsel` arrays with Sanity query
3. Rewire `src/app/attorneys/[slug]/page.tsx` — replace `attorneyData` map with Sanity query; update `generateStaticParams`
4. Rewire `src/app/news/page.tsx`, `news/archive/page.tsx`, `news/[slug]/page.tsx` — replace `news.json` with Sanity queries
5. Rewire `src/app/practice-areas/[slug]/page.tsx` — replace `practiceAreaData` map with Sanity query
6. Rewire `src/app/locations/page.tsx` and `contact/page.tsx` — replace hardcoded offices with Sanity query
7. Update `src/components/Navbar.tsx` to fetch nav from `siteSettings`
8. Update `src/components/Footer.tsx` to fetch footer locations from `siteSettings`
9. Update `src/components/Team.tsx` to fetch top attorneys from Sanity
10. Update `src/components/Locations.tsx` and `LocationsSection.tsx` to fetch from Sanity
11. Add `VisualEditing` component to root layout (rendered only in Draft Mode)
12. Add `@sanity/visual-editing` `setServerClient` call to `instrumentation.ts`

### Phase 4 — Admin Polish

**Goal:** Preview, revalidation, and Presentation tool are fully configured.

1. Configure Presentation tool in `src/sanity/sanity.config.ts` with base URL and route-to-document mappings for all content types
2. Add `resolve` functions so the Presentation tool knows which document to open for each page
3. Create Vercel webhook (`/api/revalidate/route.ts`) that triggers on-demand ISR revalidation when Sanity documents are published
4. Register the webhook in Sanity project settings (pointing at the Vercel deployment URL)
5. Configure `next.config.ts` image domains to allow Sanity CDN (`cdn.sanity.io`)
6. Test full workflow: edit → preview → publish → verify live page updates

---

## File Structure (New Files)

```
src/
  sanity/
    schemas/
      attorney.ts
      location.ts
      newsArticle.ts
      practiceArea.ts
      page.ts
      siteSettings.ts
      index.ts
    queries/
      attorneys.ts
      locations.ts
      news.ts
      practiceAreas.ts
      pages.ts
      siteSettings.ts
    client.ts          — draft-aware Sanity client
    env.ts             — typed env var exports
    sanity.config.ts   — Studio configuration (schemas, Presentation tool)
    image.ts           — @sanity/image-url builder instance
  app/
    studio/
      [[...tool]]/
        page.tsx       — embedded Sanity Studio route
    api/
      draft-mode/
        enable/
          route.ts     — activates Next.js Draft Mode
        disable/
          route.ts     — deactivates Draft Mode
      revalidate/
        route.ts       — Vercel ISR webhook from Sanity

scripts/
  migrate-to-sanity.ts — one-time data migration script
```

---

## Vercel Deployment Considerations

- All Sanity environment variables must be added to the Vercel project settings (Settings → Environment Variables)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are exposed to the browser (needed for Studio)
- `SANITY_API_READ_TOKEN` is server-only (for draft content fetching)
- `SANITY_WEBHOOK_SECRET` is server-only (for revalidation webhook validation)
- The Studio route (`/studio`) should be protected; Sanity handles auth internally — only users added to the Sanity project can log in
- On-demand ISR (`revalidatePath` / `revalidateTag`) requires a Vercel deployment (does not work in `next dev` the same way)

---

## Summary of Requirements → Implementation

| Requirement | Implementation |
|---|---|
| DB & image storage compatible with Vercel | Sanity content lake (API-based) + Sanity Assets CDN |
| Edit every page in context | Sanity Presentation tool with stega-encoded visual editing |
| Attorneys/Professionals from single schema with type | `attorney` document with `type` field (`"Our Attorneys"` / `"Of Counsel"`) |
| Locations from single schema | `location` document type; all 5 components query Sanity |
| News add/edit/archive/delete | `newsArticle` document with `status` field; full Studio CRUD |
| Add/archive/delete pages tied to navigation | `page` document with `showInNavigation` + `siteSettings` nav array |
| Preview before publishing | Next.js Draft Mode + Sanity Presentation live preview |
| Track updates by user, revert to previous | Sanity built-in document history with per-user attribution and restore |

Initial Implementation: 03/27/2026
