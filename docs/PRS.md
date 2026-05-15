# Prism PRS (Product Requirements Specification)

Version: v0.1  
Date: 2026-05-15  
Owner: DJL Foundation

## 1) Product Summary
Prism ist eine Presentation Hosting Platform für Schule/Uni/kleine Teams: Inhalte hochladen (Slides, Handout, Research Paper) und am Präsentationstag per einfacher URL ohne Login auf Fremdrechnern öffnen.

Kernversprechen:
- "Open anywhere" Zugriff über Browser
- Stabiler, merkbarer Link pro Präsentation
- Zero-friction Präsentationstag

## 2) Goals / Non-Goals
Goals (MVP):
- Upload und Hosting von Präsentationsmaterial
- Öffentliche Slug-URLs mit Tier-abhängigem Routing
- Sehr schneller Publish-Flow (Upload -> Link)
- Basis-Analytics (Views)

Non-Goals (MVP):
- Vollwertige Live-Collaboration in Slides
- In-App Slide-Editor
- Komplexes LMS-Feature-Set

## 3) Target Users
- Schüler:innen, Studierende
- Lehrkräfte
- Kleine Teams/Initiativen

## 4) Tiers & Entitlements
### Free
- URL: `/:username/:slug`
- Storage: max. 100 MB pro Account
- Prism Branding
- Öffentliche Projekte

### Pro
- URL: `/:slug`
- Keine harte Storage-Grenze (fair-use policy)
- Priorisierte Verarbeitung/Delivery
- Optional: unlisted/private Links

### Enterprise
- Custom Domains
- White Label
- Custom Branding
- Team/Rollen/Rechte
- Erweiterte Support-Optionen

## 5) Functional Requirements
### FR-1 Auth & Accounts
- Registrierung/Login
- Session-Management
- Benutzerprofil mit `username` (slug-sicher)

Acceptance:
- Nutzer kann sich einloggen, Dashboard öffnen, ausloggen
- `username` ist eindeutig und URL-kompatibel

### FR-2 Project Lifecycle
- Projekt anlegen: Titel, Beschreibung, Slug
- Projekt bearbeiten/löschen/archivieren

Acceptance:
- Slug-Kollisionen werden sauber abgefangen
- Soft-delete oder Archive-Status vorhanden

### FR-3 File Upload & Asset Types
- Unterstützte Asset-Typen: `presentation`, `handout`, `paper`, `misc`
- Mehrere Dateien pro Projekt
- File Validation (MIME/Size)

Acceptance:
- Upload mit Progress + Fehlerzuständen
- Free-Limit von 100 MB wird serverseitig erzwungen

### FR-4 Public Presentation Page
- Öffentliche Route rendert Projektmetadaten + Download/Preview
- Optional sortierte Materialliste

Acceptance:
- URL-Aufruf funktioniert ohne Login
- Dateien sind abrufbar mit korrekten Content-Type Headers

### FR-5 Tier-based Routing
- Free: `/:username/:slug`
- Pro: `/:slug`
- Enterprise: custom-domain routing

Acceptance:
- Routing-Regeln sind eindeutig, keine Ambiguität bei Slugs

### FR-6 Analytics (Basic)
- Page Views je Projekt
- Last Viewed Timestamp

Acceptance:
- Projektowner sieht View-Zahlen im Dashboard

## 6) Non-Functional Requirements
- Availability: Ziel 99.5% (MVP-Bereich)
- Time-to-First-Link (TTFL): < 60 Sekunden bei kleiner Datei
- Sicherheit: TLS-only, sichere Sessions, serverseitige Authorization
- Observability: Error Logging + Basis-Metriken

## 7) Current Tech Stack (aus Repo)
- Runtime/Build: Bun, Vite
- Frontend: React 19 + TanStack Start/Router/Query
- Hosting/Edge: Cloudflare Workers (`wrangler`)
- Data Layer (aktuell im Repo): Convex
- Auth (aktuell im Repo): WorkOS AuthKit
- Analytics: PostHog
- Styling: Tailwind CSS v4 + shadcn/ui patterns
- i18n: Paraglide

## 8) Architecture Decision (MVP)
### Empfohlene Zielarchitektur
- Frontend + Edge: Cloudflare Workers (beibehalten)
- DB/App Backend: Convex in EU-West (Ireland) nur, wenn usage-based Betrieb akzeptiert wird; Free-Tier ist dafür nicht ausreichend
- Object Storage: Cloudflare R2 mit EU-Jurisdiction-Bucket
- Auth: Better Auth (self-managed) ODER WorkOS (managed), siehe DSGVO-Teil

## 9) DSGVO / Compliance Decision Notes (praktisch, kein Rechtsrat)
Wichtig: Das ist keine Rechtsberatung, sondern technische Entscheidungsgrundlage.

### 9.1 Rechtlicher Rahmen EU<->US
- Seit 10. Juli 2023 existiert ein EU-Angemessenheitsbeschluss zum EU-US Data Privacy Framework (DPF).
- Datenübermittlung in die USA ist damit grundsätzlich möglich, wenn Voraussetzungen erfüllt sind.
- Trotzdem bleiben DPIA, TOMs, Vertragskette (DPA/SCC), Datenminimierung und Transparenzpflichten relevant.

### 9.2 WorkOS vs Better Auth
WorkOS:
- Pro: schnell integrierbar, fertige Features, DPA/SCC vorhanden
- Contra: typischerweise US-Subprozessor-Kette; zusätzliche Drittland-Thematik
- Fit: wenn du Geschwindigkeit und wenig Eigenbetrieb priorisierst

Better Auth:
- Pro: auth läuft in deiner Infrastruktur + deiner DB; maximal Datenkontrolle
- Contra: mehr Setup/Verantwortung für Security/Operations
- Fit: wenn du DSGVO-Risiko/Komplexität reduzieren willst und technisch selbst betreiben kannst

Empfehlung für Prism (dein Kontext "klein, nützlich, low-profit"):
- Kurzfristig PoC: WorkOS weiter möglich (weil bereits integriert)
- Produktionsnah und DSGVO-robuster: Better Auth + EU-Postgres oder EU-Convex + eigene Datenhoheit

### 9.3 Convex Free-Tier mit US-Daten
- Convex unterstützt Regionen inkl. EU West (Ireland) und US East, aber EU-Deployments sind an usage-based Betrieb gekoppelt.
- Für dein Setup heißt das: Mit reinem Convex Free-Tier kannst du kein EU-Deployment anlegen.
- Ein Free-Tier-Setup landet damit praktisch eher bei einer US-Region und bleibt DSGVO-pflichtig (Drittlandtransfer), sofern personenbezogene Daten verarbeitet werden.
- Technisch machbar, aber du brauchst dann klare Rechtsgrundlage, Transparenz im Privacy Notice und saubere DPA/Transfer-Bewertung.

Pragmatische Empfehlung:
- Nicht nach Tier trennen, sondern die Produktionsumgebung klar festlegen: entweder EU-Convex als bezahltes Setup oder eine andere EU-hosted Datenlösung.
- Falls US unvermeidbar: nur mit dokumentierter Transfer-Logik und klaren Nutzerinfos.

### 9.4 Convex vs Postgres
Convex:
- Pro: sehr schnell für Realtime + Produktivität
- Contra: weitere Plattformabhängigkeit

Postgres (z. B. EU-hosted Managed Postgres):
- Pro: maximale Portabilität/Kontrolle, breite Tooling-Landschaft
- Contra: mehr Backend- und Query-Aufwand

Empfehlung:
- Für schnellen Launch mit deinem bestehenden Code: Convex Free-Tier nur für einen PoC; für EU-konformen Betrieb brauchst du ein bezahltes EU-Deployment oder alternativ Postgres in der EU
- Für langfristige Datenportabilität/Enterprise-Story: Migrationspfad zu Postgres offenhalten

### 9.5 Upload Provider
MVP-Empfehlung: Cloudflare R2 (EU Jurisdiction)
- passt zu deinem Cloudflare-Setup
- sehr gutes Kostenprofil für kleine/unklare Monetarisierung
- Jurisdiction-Option unterstützt Datenlokalisierung

Alternative (mehr Enterprise-Features): S3/Backblaze + CDN, aber für Prism aktuell unnötig komplex.

## 10) Data Model (MVP)
- `users`: id, email, username, tier, createdAt
- `projects`: id, ownerId, title, slug, visibility, createdAt
- `assets`: id, projectId, kind, fileKey, fileName, mime, sizeBytes, createdAt
- `domains` (enterprise): id, ownerId, hostname, status, createdAt
- `viewEvents`: id, projectId, viewedAt, referrer

## 11) User Stories
1. Als Schüler möchte ich eine PDF hochladen und sofort einen Link teilen, damit ich im Unterricht direkt starten kann.
2. Als Student möchte ich zu einer Präsentation ein Handout und Paper bündeln, damit alles an einer Stelle liegt.
3. Als Pro-User möchte ich eine kurze URL ohne Username, damit der Link leichter merkbar ist.
4. Als Enterprise-Admin möchte ich eine eigene Domain nutzen, damit Branding konsistent ist.

## 12) Rollout Plan
- Milestone A: Auth + Projekt CRUD + Upload + Public URL
- Milestone B: Tier Enforcement + Analytics + Limits
- Milestone C: Custom Domains + Branding

## 13) Risks
- Abusive Uploads / illegale Inhalte
- Storage-Kosten bei "unlimited" Pro
- Rechtsunsicherheit bei Drittlandtransfer wenn schlecht dokumentiert

Mitigation:
- MIME/size checks, abuse reporting, optional takedown workflow
- Fair-use policy + observability + quotas
- DPA/SCC-Doku + Privacy Notice + AVV-Prozesse
