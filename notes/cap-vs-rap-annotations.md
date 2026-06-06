# CAP vs RAP — Structure & Annotations

Both CAP and RAP produce an OData service consumed by a Fiori Elements app, and
both annotate the UI with **CDS-style annotations that compile to EDMX XML**.
What differs is *where the code lives* and *which CDS dialect you author*.

## Project structure

**CAP is a monorepo** — backend and frontend are files in one project folder,
one build, one `cds watch`:

```
project/
  db/     ← data model (CDS)
  srv/    ← service + logic (CDS / JS / Java)
  app/    ← Fiori Elements app(s)
```

**RAP is not a monorepo.** The backend is a set of **ABAP repository objects**
living inside an ABAP system (S/4HANA or BTP ABAP / "Steampunk"), edited in ADT
(Eclipse) and moved via transports or abapGit:

- CDS data definitions (`.ddls`)
- Behavior definition (`.bdef`) + behavior implementation class
- Service definition (`.srvd`) + service binding

The Fiori Elements app is a **separate UI5 project**, generated from the service
binding and then either deployed *into the same ABAP system* (as a BSP/UI5
repository app) or run standalone. There is no single source repo with a unified
build, and no RAP equivalent of `cds watch` serving `app/` + `srv/` together.

## Where annotations live

| | CAP | RAP |
| --- | --- | --- |
| UI annotation **source language** | CDS (`.cds`) | **ABAP CDS** — Metadata Extensions (`.ddlx`) + inline `@UI` in the CDS view |
| **Compiles to** | OData EDMX XML | OData EDMX XML |
| **App-side XML layer** | `annotation.xml` in the app | `annotation.xml` in the app |
| **Where backend code lives** | files in `srv/`, `db/` | objects in an ABAP system |

Key points:

- RAP **also uses CDS-style annotations** (`@UI.lineItem`, `@UI.selectionField`,
  `@UI.facet`, …) — just authored in *ABAP* CDS rather than CAP CDS, often
  separated into a **Metadata Extension** (`.ddlx`) the same way this project
  splits annotations out of the main model.
- In both worlds, **everything is XML at the OData wire level** (`$metadata`),
  and a standalone Fiori app can layer a local `annotation.xml` on top. The
  two-layer story in [xml-annotations-structure.md](xml-annotations-structure.md)
  applies to RAP too.

## Bottom line

- The **annotation model** carries over: CDS source → EDMX XML, plus an optional
  app-side XML layer.
- The **monorepo** does not: RAP backend objects live in an ABAP system, not as
  files alongside the frontend.

See also:
[cds-annotations-structure.md](cds-annotations-structure.md) ·
[xml-annotations-structure.md](xml-annotations-structure.md)
