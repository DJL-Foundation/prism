# The Presentation Foundation — Archive

> **This project is archived.** The original backend and authentication may no
> longer be available. The interface is preserved as part of Jack Ruder's
> project archive.

The Presentation Foundation (later presented as **Prism**) explored a lightweight
way to share presentations and their related materials. A presenter could put
slides, a handout, a paper, and an interactive link behind one short, memorable
URL that opened in any browser.

This repository is now a static product exhibit rather than a functioning SaaS
application. The landing page and a representative public presentation flow are
preserved with clearly identified local demo content.

## Preserved routes

- `/` — archived product landing page and retrospective
- `/presentation/demo` — representative public presentation and resource page

## Local development

No production secrets or service accounts are required.

```bash
bun install
bun run dev
```

To create a production build:

```bash
bun run build
```

## Disabled integrations

- **WorkOS AuthKit:** authentication is unavailable and its provider is no
  longer mounted.
- **Convex:** the archived pages use static demo data and do not mount the
  database client.
- **PostHog:** analytics is not mounted; the archive does not collect visitor
  events.
- **Uploads and downloads:** controls are retained as recognizable UI states but
  deliberately disabled because their backing storage is not part of the
  archive.

The old integration modules remain in the source tree as implementation
reference, but none are needed to render or build the archive.

## Retrospective

### Problem

Presentation-day materials were commonly scattered across storage products,
messages, and difficult-to-type URLs.

### Approach

Reduce publishing to a focused flow: collect the material once and share one
durable link.

### What was built

A product concept and frontend for presentation pages, supporting resources,
account-based publishing, and lightweight viewing analytics.

### What was learned

The core value was confidence and low friction at the moment of presenting—not
storage by itself.

### Status

The service is archived and its public experience is represented by static demo
content. Some concepts later informed a new confidential project.
