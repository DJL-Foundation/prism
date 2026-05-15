# Prism Proof of Concept Plan

Date: 2026-05-15

## Ziel des PoC
In 10-14 Tagen validieren, ob Prism den Kernnutzen liefert:
- Upload in <2 Minuten
- Link auf fremdem Rechner sofort aufrufbar
- Nutzer verstehen das Produkt ohne Erklärung

## Scope (PoC)
In Scope:
- Login
- Projekt anlegen
- 1-3 Dateien hochladen (PDF/PPTX)
- Öffentliche URL öffnen
- Free-Tier URL-Schema `/:username/:slug`

Out of Scope:
- Custom Domains
- White Label
- Enterprise RBAC
- Vollständige Billing-Integration

## Tech PoC Setup
- Frontend/Hosting: bestehendes TanStack + Cloudflare Workers
- Backend: bestehendes Convex-Projekt (EU-West)
- Storage: Cloudflare R2 EU bucket
- Auth: WorkOS (für schnellsten PoC) oder Better Auth Spike parallel

## 14-Tage Plan
### Tag 1-2: Foundation
- Convex Schema für `users/projects/assets`
- R2 Bucket + Signed Upload Flow
- Basis-Routing für public page

Deliverable:
- Erstes Projekt kann manuell erzeugt und angezeigt werden

### Tag 3-5: Core Flow
- Dashboard: Projekt erstellen + Slug
- Datei-Upload mit Progress + Limits
- Public Page mit Asset-Liste

Deliverable:
- End-to-end "Create -> Upload -> Share"

### Tag 6-7: Tier Enforcement
- Free Limit (100 MB)
- URL policy checks
- Basic Analytics counter

Deliverable:
- Regeln greifen serverseitig reproduzierbar

### Tag 8-10: UX Polish
- Error states
- Mobile check (Schul-iPad/Handy)
- Simple onboarding copy

Deliverable:
- 5 Testnutzer kommen ohne Hilfe zum Share-Link

### Tag 11-12: DSGVO Minimum Pack
- Draft Privacy Notice
- Auflistung Subprozessoren
- Löschprozess für Projekte

Deliverable:
- "Good enough" Dokumentation für internen Start

### Tag 13-14: Pilot
- 3-5 echte Präsentationen hosten
- Feedback sammeln (TTFL, Reliability, UX)

Deliverable:
- Go/No-Go Entscheidung für MVP Build

## Success Metrics
- TTFL Median < 60s
- Upload success > 95%
- Public-link open success > 99%
- 80% Tester: "würde ich im echten Vortrag nutzen"

## Go/No-Go Kriterien
Go wenn:
- Kernflow stabil
- Keine kritischen Security- oder DSGVO-Blocker
- Positive Nutzersignale aus Pilot

No-Go wenn:
- Link-Öffnung unzuverlässig
- Upload-Flow zu fragil
- Rechts-/Compliance-Aufwand unverhältnismäßig für den Nutzen

## Parallel Spike: WorkOS vs Better Auth (2-3 Tage)
- Spike A: bestehendes WorkOS hardenen (DPA/Subprocessor check)
- Spike B: Better Auth mit Postgres-Minimalsetup
- Entscheidung nach Aufwand, Betriebslast, Datenhoheit

Entscheidungsregel:
- Wenn Time-to-Launch gewinnt: WorkOS
- Wenn Datenhoheit/DSGVO-Robustheit gewinnt: Better Auth (+ EU Postgres)
