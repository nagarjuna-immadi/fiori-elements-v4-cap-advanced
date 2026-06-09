# Sharing CDS Annotations Across Multiple Projects

The reverse of [isolating annotations](isolate-cds-annotations.md): when several
Fiori projects **depend on the same annotations**, you want to define them once
and have every project apply them identically.

The mechanism depends on whether "multiple projects" means apps inside one CAP
monorepo or separate repos.

## Within one CAP project (multiple apps in `app/`)

Sharing is essentially free — everything compiles into one CSN model. Two
patterns:

### 1. Annotate the base entity, let projections inherit

Put shared annotations on the `db/schema` entities. Every service projection and
every app inherits them automatically — define once.

```cds
// db/schema.cds (or a db/annotations.cds)
annotate sap.fe.cap.travel.Travel with {
  TravelID @title: '{i18n>TravelID}' @Common.Text: Description;
};
```

### 2. Shared annotation file consumed by each app

Keep a common `.cds` and `using` it from each app's annotation file:

```cds
// app/_shared/common-annotations.cds  → using-ed by both apps
```

## Across separate CAP projects / repos (the real cross-project answer)

Package the shared model as a **reusable CDS npm module** — CAP's official
"reuse & compose" mechanism.

### 1. Create the reusable package

```
shared-travel-model/
  package.json        ← name: "@myorg/travel-model"
  index.cds           ← re-exports the model
  db/schema.cds
  srv/common-annotations.cds
  _i18n/i18n.properties
```

```json
// package.json
{ "name": "@myorg/travel-model", "version": "1.0.0", "main": "index.cds" }
```

### 2. Each consuming project adds it as a dependency

```bash
npm add @myorg/travel-model          # from npm registry / GitHub / git url
# or for local dev: "file:../shared-travel-model" or an npm workspace link
```

### 3. Import with `using` — CAP resolves from `node_modules`

```cds
using { sap.fe.cap.travel } from '@myorg/travel-model';
// service projections + annotations come in; project locally as needed
```

CAP merges the imported CSN into each project's model, so the shared annotations
apply identically across all of them. Ship the package's `_i18n` bundles
alongside so labels resolve too.

## Things to watch

- **Annotations need a target.** An annotation only takes effect if the
  entity/service it references exists in the consuming model. So share the
  **base data model + common annotations** (labels, `@Common.Text`, value helps,
  units, semantics) on reusable entities, and let each project project them.
  Keep **app-specific UI** (`UI.LineItem`, facets, layouts) local.
- **Versioning** is plain npm semver — bump the package, re-`npm install` in
  consumers.
- This is symmetric with the isolation note: *base/shared lives in the reusable
  package; presentation stays per-app.*
