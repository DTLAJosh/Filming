-- =====================================================
-- El Dorado Lofts — Seed Data
-- Run AFTER schema.sql
-- NOTE: Unit seed data requires real auth user IDs.
-- Create a homeowner account first, then replace
-- the owner_id UUIDs below.
-- =====================================================

-- ─── BUILDING CONTACT ─────────────────────────────
INSERT INTO building_contact (contact_name, title, email, phone, preferred_contact_method, building_address, notes)
VALUES (
  'Sarah Mendez',
  'El Dorado Lofts Filming Coordinator',
  'film@eldoradolofts.com',
  '(213) 555-0100',
  'Email',
  '416 S. Spring Street, Los Angeles, CA 90013',
  'For general building questions, common area access, insurance requirements, and building-wide filming coordination, contact Sarah directly. For specific unit availability, please contact unit owners using the information on their listings.'
);

-- ─── FILMING GUIDELINES ───────────────────────────
INSERT INTO filming_guidelines (title, content, last_updated)
VALUES (
  'Filming Guidelines',
  E'## Building Contact\n\nFor all filming inquiries, contact the El Dorado Lofts filming coordinator before scheduling a scout or submitting an application.\n\n---\n\n## Building Approval Process\n\nAll filming at El Dorado Lofts requires written approval from the building management. Productions must submit a completed Application to Film at least **10 business days** before the desired filming date.\n\n---\n\n## Insurance Requirements\n\nAll productions must provide a Certificate of Insurance (COI) naming the El Dorado Homeowners Association as additionally insured. Minimum coverage requirements apply.\n\n---\n\n## COI Requirements\n\n- General Liability: $2,000,000 per occurrence / $4,000,000 aggregate\n- The El Dorado Lofts HOA must be named as Additional Insured\n- Certificate must be received and approved before access is granted\n\n---\n\n## Filming Hours\n\nStandard permitted filming hours are **7:00 AM – 10:00 PM**, Monday through Saturday. Sunday and holiday filming requires advance approval.\n\n---\n\n## Load-In & Load-Out\n\nAll equipment must be loaded in and out through the designated service entrance. Load-in and load-out may begin one hour before and extend one hour after permitted filming hours.\n\n---\n\n## Noise Rules\n\nProductions must keep noise to reasonable levels at all times. Generator use must comply with city noise ordinances.\n\n---\n\n## Parking & Loading\n\nStreet parking is subject to City of Los Angeles regulations. Productions requiring parking holds or loading zones must obtain proper city permits.\n\n---\n\n## Neighbor Notice\n\nProductions are responsible for distributing neighbor notice letters to all units in affected corridors at least **48 hours** before filming.\n\n---\n\n## Cleaning & Restoration\n\nThe location must be restored to its original condition immediately following filming.\n\n---\n\n## Contact for Questions\n\nContact the building filming coordinator for questions about guidelines, applications, and scheduling.',
  NOW()
);

-- ─── DOCUMENTS ────────────────────────────────────
INSERT INTO documents (title, description, file_url, category, last_updated, is_public) VALUES
(
  'Filming Guidelines',
  'Complete building filming guidelines for productions of all sizes. Required reading before submitting an application.',
  '#',
  'Guidelines',
  CURRENT_DATE,
  TRUE
),
(
  'Application to Film',
  'Submit this completed application at least 10 business days before your desired filming date.',
  '#',
  'Applications',
  CURRENT_DATE,
  TRUE
),
(
  'COI Requirements',
  'Certificate of Insurance requirements. The El Dorado Lofts HOA must be named as additionally insured.',
  '#',
  'Insurance',
  CURRENT_DATE,
  TRUE
),
(
  'Sample Location Agreement',
  'Standard location agreement template. Productions should review with their own legal counsel.',
  '#',
  'Templates',
  CURRENT_DATE,
  TRUE
),
(
  'Neighbor Notice Template',
  'Required neighbor notice template. Distribute to all affected units at least 48 hours before filming.',
  '#',
  'Templates',
  CURRENT_DATE,
  TRUE
),
(
  'Fee Schedule',
  'Current fee schedule for common area use, freight elevator, security requirements, and cleaning deposits.',
  '#',
  'Fees',
  CURRENT_DATE,
  TRUE
);

-- ─── TESTIMONIALS ─────────────────────────────────
INSERT INTO testimonials (quote, person_name, title, company_or_production, is_featured, is_public) VALUES
(
  'El Dorado gave us everything we needed in one address. The lobby alone saved us a full day of additional shooting. The building coordinator made it the easiest location we''ve ever worked with.',
  'Marcus Chen',
  'Location Manager',
  'Paramount Television',
  TRUE,
  TRUE
),
(
  'We''ve been scouting DTLA residential for fifteen years. Nothing else compares to the range of looks you can find in one building. We came back three times on the same production.',
  'Julia Hartmann',
  'Senior Location Scout',
  NULL,
  TRUE,
  TRUE
),
(
  'The homeowners were prepared, professional, and easy to work with. The building''s historic character is genuinely irreplaceable — you can''t fake 1928.',
  'Damon Price',
  'Production Designer',
  'HBO',
  FALSE,
  TRUE
),
(
  'From our first scout call to wrap day, El Dorado delivered exactly what we needed. The filming coordinator''s responsiveness made a real difference on a tight schedule.',
  'Rosa Villanueva',
  'Production Coordinator',
  'Netflix Feature',
  FALSE,
  TRUE
),
(
  'The raw loft we used had incredible natural light and bones. Our director of photography was thrilled. We booked a second shoot before we even wrapped the first.',
  'Kevin O''Brien',
  'Location Manager',
  'Amazon Studios',
  FALSE,
  TRUE
);

-- ─── EXAMPLE UNITS ────────────────────────────────
-- IMPORTANT: Replace 'YOUR-USER-UUID-HERE' with a real
-- profile ID after creating a homeowner account.
-- You can find the UUID in Supabase > Authentication > Users

-- Example unit 1
-- INSERT INTO units (
--   owner_id, title, unit_number, hide_unit_number, description,
--   square_feet, bedrooms, bathrooms, floor,
--   furnishing_status, furnishing_notes,
--   features, filming_notes, restrictions,
--   contact_name, contact_email, contact_phone, preferred_contact_method,
--   status, is_featured
-- ) VALUES (
--   'YOUR-USER-UUID-HERE',
--   'Industrial Loft with Downtown Skyline Views',
--   '704', TRUE,
--   'A dramatic seventh-floor loft with original concrete ceilings, 11-foot industrial windows, and unobstructed views of the DTLA skyline. This open-plan space has a raw, editorial quality that works beautifully for fashion, commercial, and dramatic productions. The exposed ductwork, polished concrete floors, and steel window frames create a strong industrial character that requires minimal dressing.',
--   1450, 1, 1, 7,
--   'unfurnished', 'Completely clear of furniture. Owner can arrange for minimal staging props on request.',
--   '["Industrial", "Concrete Floors", "Skyline Views", "High Ceilings", "Historic Windows", "Natural Light", "Open Floor Plan"]',
--   'Full blackout capability with existing window coverings. Three-phase power available. Large freight elevator access. Ideal for high-fashion, architecture, and dramatic productions.',
--   'No wet work. No smoking on premises. Equipment must use building freight entrance.',
--   'James Whitmore', 'jwhitmore@email.com', '(213) 555-0142', 'Email',
--   'published', TRUE
-- );
