-- =====================================================
-- El Dorado Lofts Film Locations — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ─────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'homeowner' CHECK (role IN ('homeowner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── UNITS ────────────────────────────────────────
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unit_number TEXT,
  hide_unit_number BOOLEAN DEFAULT TRUE,
  description TEXT,
  square_feet INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  floor INTEGER,
  furnishing_status TEXT CHECK (furnishing_status IN ('furnished', 'unfurnished', 'partially_furnished', 'flexible')),
  furnishing_notes TEXT,
  features JSONB DEFAULT '[]',
  filming_notes TEXT,
  restrictions TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  preferred_contact_method TEXT DEFAULT 'Email',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  admin_hidden BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UNIT PHOTOS ──────────────────────────────────
CREATE TABLE unit_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DOCUMENTS ────────────────────────────────────
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  category TEXT DEFAULT 'General',
  last_updated DATE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TESTIMONIALS ─────────────────────────────────
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  person_name TEXT NOT NULL,
  title TEXT,
  company_or_production TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FILMING GUIDELINES ───────────────────────────
CREATE TABLE filming_guidelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Filming Guidelines',
  content TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUILDING CONTACT ─────────────────────────────
CREATE TABLE building_contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  preferred_contact_method TEXT DEFAULT 'Email',
  building_address TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE filming_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_contact ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── PROFILES RLS ─────────────────────────────────
-- Users can read/update their own profile; admins can read all
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());

-- ─── UNITS RLS ────────────────────────────────────
-- Public: can see published, non-hidden units
CREATE POLICY "units_public_read" ON units
  FOR SELECT USING (
    status = 'published' AND admin_hidden = FALSE
    OR owner_id = auth.uid()
    OR is_admin()
  );

-- Homeowners: insert own units
CREATE POLICY "units_owner_insert" ON units
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Homeowners: update own units; admins update any
CREATE POLICY "units_owner_update" ON units
  FOR UPDATE USING (owner_id = auth.uid() OR is_admin());

-- Homeowners: delete own units; admins delete any
CREATE POLICY "units_owner_delete" ON units
  FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- ─── UNIT PHOTOS RLS ──────────────────────────────
CREATE POLICY "unit_photos_public_read" ON unit_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      WHERE u.id = unit_id
      AND (u.status = 'published' AND u.admin_hidden = FALSE OR u.owner_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "unit_photos_owner_insert" ON unit_photos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM units WHERE id = unit_id AND owner_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "unit_photos_owner_delete" ON unit_photos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM units WHERE id = unit_id AND owner_id = auth.uid())
    OR is_admin()
  );

-- ─── DOCUMENTS RLS ────────────────────────────────
CREATE POLICY "documents_public_read" ON documents
  FOR SELECT USING (is_public = TRUE OR is_admin());

CREATE POLICY "documents_admin_all" ON documents
  FOR ALL USING (is_admin())
  WITH CHECK (is_admin());

-- ─── TESTIMONIALS RLS ─────────────────────────────
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_public = TRUE OR is_admin());

CREATE POLICY "testimonials_admin_all" ON testimonials
  FOR ALL USING (is_admin())
  WITH CHECK (is_admin());

-- ─── FILMING GUIDELINES RLS ───────────────────────
CREATE POLICY "guidelines_public_read" ON filming_guidelines
  FOR SELECT USING (TRUE);

CREATE POLICY "guidelines_admin_all" ON filming_guidelines
  FOR ALL USING (is_admin())
  WITH CHECK (is_admin());

-- ─── BUILDING CONTACT RLS ─────────────────────────
CREATE POLICY "contact_public_read" ON building_contact
  FOR SELECT USING (TRUE);

CREATE POLICY "contact_admin_all" ON building_contact
  FOR ALL USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
-- Run in Supabase dashboard: Storage > New Bucket
-- Name: unit-photos
-- Public: true
--
-- Or via SQL (requires Supabase storage extension):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('unit-photos', 'unit-photos', true);
--
-- Storage policy (allows authenticated users to upload):
-- CREATE POLICY "auth_upload" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'unit-photos' AND auth.role() = 'authenticated');
-- CREATE POLICY "public_read" ON storage.objects FOR SELECT
--   USING (bucket_id = 'unit-photos');

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER filming_guidelines_updated_at BEFORE UPDATE ON filming_guidelines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
