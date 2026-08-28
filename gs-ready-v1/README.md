# GS Ready V1 — Complete Runnable Project

A mobile-friendly GS interview preparation web app with:

- Register / Login (JWT)
- Interview details
- Certificate/document upload
- Required document checklist
- Estimated marks calculator
- Readiness percentage
- Missing-item warnings
- Printable final summary / Save as PDF
- PWA manifest + production service worker

> Important: Marks are estimates for preparation only. Final acceptance and marks are decided by the official interview board.

## 1) Requirements

- Node.js 20+ (Node 22 is fine)
- MongoDB local **or** MongoDB Atlas

## 2) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gs_ready
JWT_SECRET=put_a_long_random_secret_here
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Backend health check:

```text
http://localhost:5000/api/health
```

## 3) Frontend setup

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 4) First use

1. Create account.
2. Open **Interview** and save date/time/venue/DS/reference.
3. Open **Documents** and upload certificates/evidence.
4. Open **Checklist** and mark originals/copies ready.
5. Open **Marks** and enter evidence-based estimated values.
6. Open **Summary** and use **Print / Save PDF**.

## Mark category limits used in V1

The app uses these configurable caps based on the supplied official marking scheme structure:

- Leadership / Social Activities: 15
- Sports: 5
- Language Ability: 10
- Computer / ICT: 10
- Interview Performance: 10
- Total: 50

The app does **not** promise that a particular certificate will receive a particular score. Exact eligibility and final scoring remain subject to official verification.

## Folder structure

```text
gs-ready-v1/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    ├── .env.example
    ├── index.html
    └── package.json
```

## Security notes before public deployment

For a real public deployment, add cloud object storage, encryption-at-rest, rate limiting, HTTPS, upload malware scanning, stronger file validation, password reset/email verification, audit logging, and a clear retention/deletion policy for identity documents.

## V1.0.1 frontend startup fix
If you previously saw `Uncaught ReferenceError: React is not defined` in `AuthContext.jsx`, this package includes the fix:
- React imports are present in JSX files.
- `vite.config.js` enables `@vitejs/plugin-react`.
- A favicon is included to avoid the browser 404 warning.

After replacing the frontend files, stop the old Vite process and start it again with `npm run dev`.


## V1.1 Documents page fix
- Rebuilt the Documents page with safe API response handling.
- Added loading and error states so the page cannot silently become blank.
- Added a route-level Error Boundary.
- Disabled API ETag/304 caching during local development to keep JSON responses consistent.
- Document upload, open and delete actions remain supported.
