# Build Constraints

## Deployment Environment

The application will be hosted on Vercel.

It must function entirely as a frontend application.

No backend persistence is allowed.

---

## Storage Constraints

All structured data must use localStorage.

Large files must use IndexedDB.

No external database services are allowed.

---

## Security Model

The application uses a single local login.

Credentials are hardcoded.

This is not intended for public multi-user access.

---

## Performance Constraints

The application must remain responsive even with years of stored data.

Charts and queries must operate efficiently on local datasets.

---

## Media Constraints

Photos and videos will be stored locally using IndexedDB.

The system must:

compress images when possible
prevent excessively large uploads

---

## Data Durability

Because data is stored locally, a backup system is required.

The application must support:

JSON export
JSON restore

---

## Offline Capability

The system must work entirely without network connectivity after initial load.

All features must function locally.

---

## Maintainability

The system must include internal documentation.

Documentation must describe:

architecture
schema
data flow
storage strategy

---

## Testing Requirements

The system must include verification routines.

These should check:

data schema validity
storage integrity
component functionality

---

## Future Expansion

The architecture should allow future expansion such as:

AI progress analysis
automated progress reports
advanced training analytics
