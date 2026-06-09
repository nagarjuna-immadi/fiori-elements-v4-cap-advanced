# Sharing XML Annotations Across Multiple Projects

The XML/EDMX counterpart of [sharing CDS annotations](share-cds-annotations.md).
XML annotations have **no `using`/import system** like CDS — so "sharing" means
pointing multiple apps at **one physical source** rather than copying the file
around. Three mechanisms, best first.

See [xml-annotations-structure.md](xml-annotations-structure.md) for the file
format itself.

## 1. Push them into the backend `$metadata` (the natural sharing point)

The cleanest XML-level analog of "annotate the base entity." If the annotations
live in the service metadata, **every app consuming that service inherits them
automatically** — no per-app file at all.

- **CAP / ABAP backend you own** → author in CDS and let it compile to EDMX.
  (That's the [CDS sharing note](share-cds-annotations.md).)
- **External service** → the backend team registers the annotations server-side.

This is the only option where apps share annotations *without each app declaring
anything*.

## 2. Reference one remote annotation file by URI

Each app's manifest declares an `ODataAnnotation` data source pointing at the
**same hosted URL**. The file lives in one place; every app references it.

```jsonc
// each app's manifest.json — same uri everywhere
"dataSources": {
  "mainService": {
    "uri": "/processor/",
    "settings": { "annotations": ["sharedAnno"] }
  },
  "sharedAnno": {
    "type": "ODataAnnotation",
    "uri": "/sap/opu/odata/.../Annotations(TechnicalName='ZSHARED',Version='0001')/$value"
  }
}
```

On **SAP Gateway** you register the annotation file once in the annotation
repository and reference it by technical name; multiple services/apps bind to
that one registered model. On CAP / standalone you can host the `.xml` anywhere
reachable and point every app's `uri` at it.

## 3. Package the `annotation.xml` as a shared artifact

When the annotations must ship *inside* each app (local file, offline, no shared
host), keep the source of truth in **one repo/package** and pull it into each
app at build time:

- a **reusable UI5 library** containing the annotation file, or
- an **npm package / git submodule** plus a build step that copies it into each
  app's `webapp/annotations/`.

This shares the *source*, but each app still bundles its own physical copy — so
versioning/drift is on you (npm semver or submodule pinning).

## Rule of thumb

Prefer **#1 (backend metadata)** for genuinely common annotations — labels,
value helps, text/units, semantics — exactly like the CDS note. Use **#2 / #3**
only for shared *presentation* XML that can't live in the backend.

See also:
[share-cds-annotations.md](share-cds-annotations.md) ·
[isolate-cds-annotations.md](isolate-cds-annotations.md) ·
[xml-annotations-structure.md](xml-annotations-structure.md)
