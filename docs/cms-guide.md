# Panza Maurer CMS Guide

This guide explains how to use the Sanity Studio content management system to edit the Panza Maurer website. The Studio is available at `/studio` on the website.

---

## Table of Contents

1. [Getting Around](#getting-around)
2. [Publishing & Version History](#publishing--version-history)
3. [Site Settings](#site-settings)
4. [News Articles](#news-articles)
5. [Attorneys](#attorneys)
6. [Practice Areas](#practice-areas)
7. [Locations](#locations)
8. [Pages](#pages)
   - [Page Sections](#page-sections)
9. [Unpublished Changes](#unpublished-changes)

---

## Getting Around

The left sidebar lists all content sections. Click any item to open its list or editor. The main area shows the document form. Changes are saved as drafts automatically — nothing goes live until you click **Publish**.

---

## Publishing & Version History

Every document type (Pages, News Articles, Attorneys) has a **Version History** tab alongside the main edit form. Click it to browse past published snapshots and restore any previous version if needed.

Clicking **Publish** saves a new snapshot and makes the content live on the website immediately.

---

## Site Settings

**One document — controls global site-wide values.**

| Field | Purpose |
|-------|---------|
| Site Name | The name of the firm used in metadata and the browser tab title |
| Footer Tagline | Short tagline shown in the website footer |
| Contact Email | Firm-wide contact email displayed on the site (currently unused) |
| Contact Phone | Firm-wide phone number displayed on the site |
| Navigation Items | Ordered list of links in the top navigation bar (see below) |
| Footer Locations | Which office locations appear in the footer, and in what order |

### Navigation Items

Each nav item has:
- **Label** — the text shown in the nav bar
- **Path** — the URL path it links to (e.g. `/attorneys`, `/practice-areas/government-relations`)
- **Has Dropdown** — when enabled, hovering this link reveals the Practice Areas sub-menu

Drag nav items to reorder them.

---

## News Articles

News articles appear on the `/news` listing page and have individual detail pages at `/news/[slug]`.

| Field | Purpose |
|-------|---------|
| Title | The article headline (required) |
| Slug | URL path auto-generated from the title — edit if needed |
| Publication Date | The date shown on the article and used for sorting (required) |
| Author | Byline text |
| Excerpt | Short summary shown on the listing card |
| Article Body | Full article content — rich markdown editor supporting headings, bold, italic, lists, and links |
| Article Images | Images displayed within the article body |
| Listing / Thumbnail Image | The image shown on the news listing card |
| Categories | Free-text tags for categorizing articles |
| Status | `Published` = visible on `/news`; `Archived` = visible on `/news/archive` only; `Deleted` = hidden from all public pages |

Articles are listed newest-first by Publication Date.

---

## Attorneys

Attorneys are divided into three categories, each with its own drag-and-drop sorted list. To change the display order within a category, drag the attorney cards up or down.

### Our Attorneys
Attorneys who appear on the main `/attorneys` listing page in the "Our Attorneys" section.

### Of Counsel
Attorneys who appear on the main `/attorneys` listing page in the "Of Counsel" section.

### Featured Only
Attorneys who do **not** appear on the main `/attorneys` listing but still have a public profile page at `/attorneys/[slug]` and can be featured in a **Team / Attorneys** section on any page, or as a Featured Attorney on a Practice Area.

---

### Attorney Fields

| Field | Purpose |
|-------|---------|
| Full Name | The attorney's full display name (required) |
| First Name | Used for the "About [First Name]" heading on the profile page |
| Slug | URL path auto-generated from the name — edit if needed |
| Attorney Type | Which category this attorney belongs to: **Our Attorneys**, **Of Counsel**, or **Featured Only** (required) |
| Role / Title | Job title shown on cards and the profile page (e.g. "Partner", "Associate") |
| Headshot | Profile photo. Use the hotspot tool to set the focal point for cropping |
| Status | `Published` = visible on the site; `Archived` = hidden from all public pages |
| Introduction | Rich text intro paragraph shown at the top of the profile page |
| Education | List of degrees and institutions — add one entry per line |
| Bar Admissions | List of state bar admissions — add one entry per line |
| Court Admissions | List of court admissions — add one entry per line |
| Professional Memberships | List of professional memberships — add one entry per line |
| Bio Sections | Additional freeform sections (e.g. "Areas of Focus", "Speaking Engagements") — each has a title and rich text content |

> **Changing an attorney's category:** Edit the attorney document and change the **Attorney Type** radio selection. The attorney will then appear in the new category list. You may need to drag them into the correct position after reassigning.

---

## Practice Areas

Practice areas are drag-and-drop sortable. The order set here controls both the `/practice-areas` listing page and the navigation dropdown order.

| Field | Purpose |
|-------|---------|
| Title | The practice area name (required) |
| Slug | URL path auto-generated from the title |
| Content Heading | Sub-headline shown above the body text on the practice area detail page |
| Summary | Brief description shown on the `/practice-areas` listing card |
| Content | Rich text body for the practice area detail page |
| Featured Attorneys | Attorneys highlighted on this practice area page — pick and drag to order |
| Show on Practice Areas Page | When enabled, this practice area appears on `/practice-areas` |
| Show in Navigation Dropdown | When enabled, this practice area appears in the nav bar dropdown |
| Status | `Published` = live; `Archived` = hidden from all public pages |

---

## Locations

Office locations used in the footer and on any page that includes a **Locations** section.

| Field | Purpose |
|-------|---------|
| City / Name | The display name for this office (required) |
| Slug | URL path auto-generated from the name |
| Photo | Office photo |
| Building Name | Optional building or suite descriptor (e.g. "Coastal Tower") |
| Address Lines | Street address lines, not including city — add one line per entry |
| City, State, Zip | City, state, and zip code as a single string |
| Phone | Office phone number |
| Fax | Office fax number |
| Display Order | Lower numbers appear first in location lists |

> The footer location order is controlled separately in **Site Settings → Footer Locations**.

---

## Pages

Pages are the full-page documents that make up the website (Home, About, Attorneys, Contact, etc.).

| Field | Purpose |
|-------|---------|
| Page Title | Used as the browser tab `<title>` tag |
| Navigation Label | Label shown in the nav bar — leave blank to use the Page Title |
| URL Slug | The URL path for the page (e.g. `about`, `contact`). Use `home` for the homepage |
| SEO Description | The meta description tag used by search engines |
| Show in Navigation | Whether this page appears in the nav bar |
| Navigation Order | Position in the nav bar; lower numbers appear first |
| Status | `Published` = live; `Archived` = returns a 404 and is removed from navigation |
| Page Sections | The visual content blocks that make up the page body (see below) |

### Page Sections

Each page is built from one or more **sections**. Sections can be added, removed, and reordered by dragging. The available section types are:

#### Hero Banner
The large full-screen banner at the top of a page.

| Field | Purpose |
|-------|---------|
| Heading | The main large headline |
| Bold Prefix | Optional bold text shown before the subtitle (e.g. "For more than five decades,") |
| Subtitle / Body | Supporting text shown below the heading |
| Button Label | Text on the call-to-action button |
| Button URL | Where the button links to |
| Background Videos | Upload `.mp4` files to cycle as the hero background video. If left empty, the built-in default videos are used |

#### About / Intro
The firm introduction block, typically used on the homepage.

| Field | Purpose |
|-------|---------|
| Heading | Section heading (default: "About Our Firm") |
| Image | A photo displayed alongside the text |
| Mission Statement / Quote | A highlighted pull-quote or mission statement |
| Body Text | Rich text body supporting headings, bold, italic, lists, and links |

#### Call to Action
A prominent prompt section, typically used to drive visitors to contact the firm or meet the team.

| Field | Purpose |
|-------|---------|
| Heading | Section heading (default: "Get in Touch") |
| Subtitle (large) | Large supporting text shown below the heading |
| Body Text | Smaller body text |
| Button Label | Text on the button (default: "Meet Our Team") |
| Button URL | Where the button links to (default: `/attorneys`) |

#### Text Block
A simple heading + rich text block for general content.

| Field | Purpose |
|-------|---------|
| Heading | Optional section heading |
| Body | Rich text supporting headings, bold, italic, lists, and links |

#### Team / Attorneys
Displays a grid of attorney cards. Use this to feature specific attorneys on any page.

| Field | Purpose |
|-------|---------|
| Section Heading | Heading shown above the attorney grid (default: "Our Team") |
| Attorneys | Pick and order specific attorneys to display. Drag to reorder within this section |

> Any attorney — including **Featured Only** attorneys — can be added to this section regardless of their category.

#### Locations
Displays a grid of office location cards.

| Field | Purpose |
|-------|---------|
| Section Heading | Heading shown above the locations grid (default: "Our Locations") |
| Office Locations | Pick and order the offices to display. Drag to reorder |

#### Practice Areas
Displays a grid of practice area cards.

| Field | Purpose |
|-------|---------|
| Section Heading | Heading shown above the grid (default: "Practice Areas") |
| Practice Areas | Pick and order the practice areas to display. Drag to reorder |

#### News / Articles
Automatically displays the most recent published news articles.

| Field | Purpose |
|-------|---------|
| Section Heading | Heading shown above the articles (default: "Latest News") |
| Number of Articles to Show | How many articles to display (1–20, default: 3) |

---

## Unpublished Changes

This view lists all documents that have a draft (unpublished) version — meaning they have been edited but not yet published. Use this as a quick audit to see what is pending review before going live.
