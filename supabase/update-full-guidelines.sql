-- Updates the live editable guidelines row with the full public copy.
-- Run in Supabase SQL Editor for the Film El Dorado project.

UPDATE filming_guidelines
SET
  title = 'Filming Guidelines',
  content = $guidelines$
## Building Contact

For all filming inquiries, contact the El Dorado Lofts filming coordinator before scheduling a scout or submitting an application.

---

## Building Approval Process

All filming at El Dorado Lofts requires written approval from the building management. Productions must submit a completed Application to Film at least **10 business days** before the desired filming date. Rush applications may be considered on a case-by-case basis.

---

## Insurance Requirements

All productions must provide a Certificate of Insurance (COI) naming the El Dorado Homeowners Association as additionally insured. Minimum coverage requirements apply. See the COI Requirements document for specifics.

---

## COI Requirements

- General Liability: $2,000,000 per occurrence / $4,000,000 aggregate
- The El Dorado Lofts HOA must be named as Additional Insured
- Certificate must be received and approved before access is granted

---

## Permits

Productions are responsible for obtaining all required City of Los Angeles filming permits. A copy of all permits must be provided to building management before filming begins.

---

## Filming Hours

Standard permitted filming hours are **7:00 AM - 10:00 PM**, Monday through Saturday. Sunday and holiday filming requires advance approval and may be subject to additional fees. No filming is permitted before 7:00 AM without written exception.

---

## Load-In & Load-Out

All equipment must be loaded in and out through the designated service entrance. Load-in and load-out may begin one hour before and extend one hour after permitted filming hours. Advance coordination with building management is required for equipment moves.

---

## Elevator Use

Use of the main passenger elevator for equipment is restricted during peak morning hours (7:00-9:00 AM) and evening hours (5:00-7:00 PM). A freight or service elevator may be available; contact building management to confirm.

---

## Common Area Use

Use of lobbies, hallways, stairwells, rooftop, and exterior areas requires separate approval from building management and is subject to availability and additional fees. Common area filming does not grant access to individual units.

---

## Noise Rules

Productions must keep noise to reasonable levels at all times. Generator use must comply with city noise ordinances. Loud equipment, pyrotechnics, and amplified sound require advance written approval.

---

## Parking & Loading

Street parking is subject to City of Los Angeles regulations. Productions requiring parking holds or loading zones must obtain proper city permits. Building management can provide information on nearby production parking facilities.

---

## Security Requirements

Productions filming after 8:00 PM or with crew exceeding 20 persons must provide on-site licensed security. Security requirements are specified in the Location Agreement.

---

## Neighbor Notice

Productions are responsible for distributing neighbor notice letters to all units in affected corridors. A template is available on the Documents page. Notices must be distributed at least **48 hours** before filming.

---

## Cleaning & Restoration

The location must be restored to its original condition immediately following filming. Any damage to common areas or individual units is the responsibility of the production company. A refundable cleaning deposit may be required.

---

## Fees & Deposits

Location fees vary based on scope, crew size, duration, and areas used. A refundable security deposit is required for all productions. Fee schedules are available on the Documents page.

---

## HOA Requirements

All productions are subject to El Dorado Lofts HOA rules and regulations. Productions must cooperate with building management and security at all times.

---

## Contact for Questions

Contact the building filming coordinator for questions about guidelines, applications, COI requirements, and scheduling.
$guidelines$,
  last_updated = NOW(),
  updated_at = NOW()
WHERE id = (
  SELECT id
  FROM filming_guidelines
  ORDER BY created_at
  LIMIT 1
);
