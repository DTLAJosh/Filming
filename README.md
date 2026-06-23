# El Dorado Lofts Film Locations

A production-ready website for El Dorado Lofts, promoting the building as a film-friendly residential location in Downtown Los Angeles.

**Stack:** React + Vite · Tailwind CSS · Supabase (Postgres + Auth + Storage + RLS) · Netlify

---

## Project Structure

```
el-dorado-lofts/
├── src/
│   ├── components/
│   │   ├── layout/        # Navbar, Footer, PublicLayout, DashboardLayout, AdminLayout
│   │   ├── ui/            # FurnishingBadge
│   │   └── units/         # UnitCard, UnitForm
│   ├── lib/
│   │   ├── supabase.js    # Supabase client
│   │   └── AuthContext.jsx # Auth state + profile
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── UnitsPage.jsx
│   │   ├── UnitDetailPage.jsx
│   │   ├── GuidelinesPage.jsx
│   │   ├── DocumentsPage.jsx
│   │   ├── TestimonialsPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── dashboard/     # Homeowner portal
│   │   └── admin/         # Admin dashboard
│   └── styles/globals.css
├── supabase/
│   ├── schema.sql         # All tables + RLS policies
│   └── seed.sql           # Sample data
├── netlify.toml
└── .env.example
```

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to Los Angeles (e.g., US West)
3. Save your project URL and anon key

### 2. Run the Schema

1. In Supabase, go to **SQL Editor**
2. Open `supabase/schema.sql` and run it entirely
3. Then open `supabase/seed.sql` and run it to insert sample content (testimonials, guidelines, documents, and building contact)

### 3. Create a Storage Bucket

1. In Supabase, go to **Storage**
2. Create a new bucket named `unit-photos`
3. Set it to **Public**
4. Add these storage policies in the SQL editor:

```sql
-- Allow authenticated users to upload
INSERT INTO storage.buckets (id, name, public) VALUES ('unit-photos', 'unit-photos', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "auth_upload_photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'unit-photos' AND auth.role() = 'authenticated');

CREATE POLICY "public_read_photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'unit-photos');

CREATE POLICY "owner_delete_photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'unit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Set Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase: **Settings > API**.

### 5. Run Locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`.

### 6. Create Your First Admin Account

1. Go to `/signup` and create a homeowner account
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Log in and visit `/admin`

### 7. Add Sample Unit Listings

After creating your admin account:
1. Create a second account as a homeowner (or use the same account)
2. Copy the user UUID from Supabase > Authentication > Users
3. In `supabase/seed.sql`, uncomment the example unit inserts and replace `YOUR-USER-UUID-HERE`
4. Run the INSERT statements

---

## Deploying to Netlify

### Option A: Via Netlify UI (Recommended)

1. Push your project to GitHub
2. Log in to [netlify.com](https://netlify.com)
3. Click **Add new site > Import an existing project**
4. Connect your GitHub repo
5. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in **Site settings > Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy

### Option B: Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify deploy --prod
```

---

## Key Features

### Public Site
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, building overview, featured units, testimonials |
| `/units` | Browsable unit grid with search + filters |
| `/units/:id` | Unit detail page with gallery, specs, contact info |
| `/guidelines` | Filming guidelines (admin-editable) |
| `/documents` | Downloadable documents (admin-managed) |
| `/testimonials` | All testimonials |
| `/contact` | Building manager contact (no form) |

### Homeowner Portal
| Route | Description |
|-------|-------------|
| `/signup` | Create homeowner account |
| `/login` | Sign in |
| `/dashboard` | Manage listings |
| `/dashboard/units/new` | Create new unit listing |
| `/dashboard/units/:id/edit` | Edit existing listing |

### Admin Dashboard
| Route | Description |
|-------|-------------|
| `/admin` | Stats overview |
| `/admin/units` | Hide/unhide/feature/delete all units |
| `/admin/documents` | Manage downloadable documents |
| `/admin/guidelines` | Edit filming guidelines (Markdown) |
| `/admin/testimonials` | Manage testimonials |
| `/admin/contact` | Edit building contact info |
| `/admin/users` | View users, grant/revoke admin |

---

## Design System

**Palette:**
- `ed-black` `#0D0C0A` — primary dark
- `ed-cream` `#F2EDE4` — warm background
- `ed-gold` `#B8972A` — brass accent
- `ed-stone` `#8C8578` — secondary text

**Typography:**
- Display: Cormorant Garamond (historic, cinematic)
- Body: DM Sans (clean, readable)
- Utility: DM Mono (labels, metadata)

**Furnishing badge colors:**
- Furnished → emerald
- Unfurnished → stone
- Partially Furnished → amber
- Flexible → sky

---

## Security Model

- **Public users** — read-only: published, non-hidden units; public documents/testimonials/guidelines/contact
- **Homeowners** — CRUD on their own units and photos only
- **Admins** — full access to all content, can hide/unhide/delete any unit, manage all admin tables
- All enforced via Supabase Row Level Security (RLS)

---

## Features Needing Follow-Up

These were intentionally excluded from the MVP scope but are natural next steps:

1. **Email notifications** — Consider Supabase Edge Functions + Resend to notify homeowners when a scout views their listing, or notify admins of new listings
2. **Image reordering** — Add drag-to-reorder for unit photos (sortable library)
3. **Image deletion** — Currently new photos are additive; add delete-individual-photo capability
4. **Photo compression** — Resize/compress uploads client-side before upload (browser-image-compression library)
5. **Document file uploads** — Currently documents use external URLs; add direct file upload to Supabase Storage
6. **Availability calendar** — Optional: let homeowners block out unavailable dates (no booking needed, just a visual indicator)
7. **Custom domain** — Set a custom domain in Netlify dashboard
8. **Analytics** — Add Plausible or Fathom for privacy-friendly traffic analytics
9. **SEO meta tags** — Add per-page meta titles and descriptions using react-helmet-async
10. **Google Maps embed** — Add a map on the Contact page showing the building location
