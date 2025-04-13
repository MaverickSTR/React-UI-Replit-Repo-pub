# Next.js Migration Plan

## Directory Structure

Current React/Vite Structure:
```
/client
  /src
    /components
    /pages
    /lib
/server
  /routes.ts
  /storage.ts
  /db.ts
/shared
  /schema.ts
```

Target Next.js Structure:
```
/app (Next.js App Router)
  /page.tsx (Home)
  /search/page.tsx
  /city/[name]/page.tsx
  /property/[id]/page.tsx
/components
  /ui
  /layout
  /custom-search-bar.tsx
  /property-card.tsx
  /property-gallery.tsx
/lib
  /db.ts
  /schema.ts
  /utils.ts
  /api.ts
  /actions.ts (Server actions)
/public
  /assets
```

## Component Migration Map

| Current Path | Next.js Path | Changes Needed |
|--------------|--------------|----------------|
| client/src/pages/Home.tsx | app/page.tsx | Update to Server Component, move client parts to components, use metadata export |
| client/src/pages/PropertyDetail.tsx | app/property/[id]/page.tsx | Fetch with async/await at page level, client components for interactivity |
| client/src/pages/SearchResults.tsx | app/search/page.tsx | Convert to Server Component with search params |
| client/src/components/CustomSearchBar.tsx | components/custom-search-bar.tsx | Convert Wouter navigation to Next.js useRouter |
| client/src/components/MapView.tsx | components/map-view.tsx | Make sure it's a Client Component with "use client" |
| client/src/components/PropertyCard.tsx | components/property-card.tsx | Simple component migration |
| client/src/components/PropertyGallery.tsx | components/property-gallery.tsx | Make sure it's a Client Component |
| client/src/components/layout/Navbar.tsx | components/layout/navbar.tsx | Update navigation to use Next.js patterns |
| client/src/components/layout/Footer.tsx | components/layout/footer.tsx | Simple component migration |
| server/db.ts | lib/db.ts | Update for Next.js environment variables |
| shared/schema.ts | lib/schema.ts | Direct copy |
| server/routes.ts | app/api/[route]/route.ts | Convert to Next.js API Routes |

## API Routes Migration

| Current Express Route | Next.js API Route |
|----------------------|------------------|
| GET /api/properties | app/api/properties/route.ts |
| GET /api/properties/featured | app/api/properties/featured/route.ts |
| GET /api/properties/search | app/api/properties/search/route.ts |
| GET /api/properties/:id | app/api/properties/[id]/route.ts |
| GET /api/cities | app/api/cities/route.ts |
| GET /api/cities/featured | app/api/cities/featured/route.ts |
| GET /api/cities/:name | app/api/cities/[name]/route.ts |
| GET /api/cities/:name/properties | app/api/cities/[name]/properties/route.ts |

## Database Migration

1. Update connection in lib/db.ts
2. Create migration scripts using Drizzle
3. Ensure environment variables are correctly set up for Next.js

## Authentication & State Management

1. Convert existing auth to NextAuth.js
2. Move React Query setup to a provider in layout
3. Adjust form handling for Next.js

## Styling Migration

1. Copy tailwind.config.js with adjustments for Next.js paths
2. Move global styles to app/globals.css
3. Ensure all Shadcn UI components are properly set up

## Environment Variables

1. Rename client-side env vars with NEXT_PUBLIC_ prefix
2. Update .env.example and documentation
3. Configure for different environments (dev/prod)

## Build & Deployment

1. Set up GitHub Actions for CI/CD
2. Configure Vercel integration
3. Set up proper environment secrets