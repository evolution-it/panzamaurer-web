# Panza Maurer Law Firm — Website

The official public website for **Panza Maurer**, a full-service law firm based in New Jersey. The site serves as the firm's primary web presence, providing information about attorneys, practice areas, news, office locations, and contact details.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4

## Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/about` | Firm overview and history |
| `/attorneys` | Attorney directory listing |
| `/attorneys/[slug]` | Individual attorney profile |
| `/practice-areas` | Full list of practice areas |
| `/practice-areas/[slug]` | Individual practice area detail |
| `/news` | News and updates listing |
| `/news/[slug]` | Individual news article |
| `/locations` | Office locations |
| `/contact` | Contact form and info |

## Practice Areas

The site covers 16 practice areas including Administrative/Regulatory Law, Healthcare, Compliance, Corporate/Transactional, Litigation, Land Use/Environmental, Estate Planning/Probate, Technology/IT, Education Law, Gaming/Hospitality, Strategic Planning, Labor/Employment, Procurement, Real Property, Receivership/Conservatorship, and Medical Marijuana.

---

## Running Locally

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start the production server
npm run lint    # Run ESLint
```

end
