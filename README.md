# Sigit Faces

Sigit Faces is a simple internal app for Sigit course commanders and instructors to remember trainee names and faces. Commanders pick their name, upload trainee photos, enter names manually, and practice until the association sticks.

It does not perform facial recognition, call biometric APIs, or infer identity from images. The app is intentionally lightweight and does not require complex authentication.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn-style reusable UI primitives
- Prisma ORM with PostgreSQL or Supabase Postgres
- Zustand for lightweight session state
- Recharts for analytics

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` to a local PostgreSQL or Supabase Postgres connection string.

4. Create tables and start with an empty database:

```bash
npm run prisma:migrate
npm run db:seed
```

`npm run db:seed` intentionally clears all tables and does not create default commanders or example trainees. Commanders are created from the login screen.

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/login`.

## Docker Compose

Local container testing includes Postgres, a one-shot database setup service, and the Sigit Faces web container:

```bash
docker compose up --build
```

Open `http://localhost:3000/login`.

The `db-setup` service runs:

```bash
npm run prisma:push && npm run db:seed
```

This creates the schema and leaves the database empty by default.
Uploaded trainee images are persisted in the `sigit-faces-uploads` Docker volume.

## Docker Image

Build the production image:

```bash
docker build -t sigit-faces:local .
```

Run it against an existing Postgres database:

```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/sigit_faces?schema=public" \
  sigit-faces:local
```

## Helm

The chart lives in `charts/sigit-faces`.

Render it locally:

```bash
helm template sigit-faces ./charts/sigit-faces
```

Install with an image you pushed to your registry:

```bash
helm upgrade --install sigit-faces ./charts/sigit-faces \
  --set image.repository=ghcr.io/your-org/sigit-faces \
  --set image.tag=0.1.0 \
  --set database.url="postgresql://user:password@postgres:5432/sigit_faces?schema=public"
```

### OpenShift Route

The chart enables an OpenShift `Route` by default and keeps Kubernetes Ingress disabled.

Let OpenShift generate a route host:

```bash
helm upgrade --install sigit-faces ./charts/sigit-faces \
  --set image.repository=your-registry/sigit-faces \
  --set image.tag=0.1.0 \
  --set database.url="postgresql://user:password@postgres:5432/sigit_faces?schema=public"
```

Use a specific route host:

```bash
helm upgrade --install sigit-faces ./charts/sigit-faces \
  --set image.repository=your-registry/sigit-faces \
  --set image.tag=0.1.0 \
  --set route.host=sigit-faces.apps.example.com \
  --set env.NEXT_PUBLIC_APP_URL=https://sigit-faces.apps.example.com \
  --set database.url="postgresql://user:password@postgres:5432/sigit_faces?schema=public"
```

Disable Route and use Ingress instead:

```bash
--set route.enabled=false --set ingress.enabled=true
```

Use an existing Kubernetes secret instead of creating one:

```bash
helm upgrade --install sigit-faces ./charts/sigit-faces \
  --set database.createSecret=false \
  --set database.existingSecret=sigit-faces-database \
  --set database.existingSecretKey=DATABASE_URL
```

Optional Helm hooks:

```bash
--set migrations.enabled=true
--set seed.enabled=true
```

`seed.enabled=true` clears all app data and leaves the database empty.

## Demo Notes

- Login includes simple commander selection and one-field commander creation backed by the database.
- The trainee library imports image files directly. The image file name becomes the trainee name, for example `יובל כהן.jpg`.
- Imported trainee images are stored under `public/uploads` and trainee records are stored in Postgres.
- The library includes a delete-all button for clearing all trainee records and uploaded image files.
- `/train/session/demo` runs a working training loop with scoring and feedback.
- `/results/demo` summarizes score, accuracy, speed, mastery progress, and missed people.
- Admin/library screens are functional demo management surfaces wired to shared typed fixtures and ready to connect to Prisma queries/server actions.

## Privacy

Only upload trainee photos you have permission to use in the course context. Sigit Faces stores manually uploaded images and manually entered names. It does not derive biometric data.
