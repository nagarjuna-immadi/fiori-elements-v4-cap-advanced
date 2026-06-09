# Isolating CDS Annotations Across Multiple Apps

When two Fiori apps need to annotate the **same entity in different ways**, the
challenge is keeping each app's annotations from leaking into the other.

## The root problem

In CAP, **every `.cds` file in the project is compiled into one CSN model.** Any
annotation on a service entity is merged into that service's single metadata
document. So if two apps target the **same entity + same term**, they collide —
last one wins, and *both* apps see the merged result because they hit the same
OData endpoint.

In this repo, both apps consume the **same service** (`/processor/` =
`TravelService`):

- `app/customer/annotations.cds` → `annotate service.Passenger with @UI.LineItem …`
- `app/travel_processor/labels.cds` (+ siblings) → `annotate TravelService.Travel / Booking / Passenger …`

Because the customer app and travel_processor app both bind to `TravelService`,
any annotation either one places on `TravelService.Passenger` is shared. That's
the collision risk.

## Option A — One service projection per app (recommended, true isolation)

The canonical CAP pattern: **one service per UI consumer.** Create a dedicated
service for each app that projects the same underlying data.

```cds
// srv/customer-service.cds
using { sap.fe.cap.travel as my } from '../db/schema';

service CustomerService @(path:'/customer') {
  entity Customers as projection on my.Passenger;  // same data, separate exposure
}
```

Then point the customer annotations and manifest at *that* service:

```cds
// app/customer/annotations.cds
using CustomerService as service from '../../srv/customer-service';
annotate service.Customers with @UI.LineItem : [ … ];   // isolated
```

`CustomerService.Customers` and `TravelService.Passenger` are now different
entities in different metadata documents. Annotate each however you like — zero
cross-impact. The travel_processor app stays entirely on `TravelService`.

## Option B — App-local annotations (keep them out of the shared model)

Put app-specific presentation annotations **inside the app** as a local
`annotation.xml`, referenced via the manifest:

```json
"dataSources": {
  "mainService": {
    "uri": "/processor/",
    "settings": { "annotations": ["annotation"] }
  }
}
```

(The customer app already wires this up.) Local annotations layer only at that
app's runtime and never enter the backend service metadata, so the other app
never sees them.

**Limitation:** you still can't have two *different* backend defaults for the
same term — a local annotation only overrides for that one app.

## Option C — Qualifiers within one service

Use qualified terms — `UI.LineItem #customer` vs `UI.LineItem #processor` — and
have each app select its qualifier via page settings /
`SelectionPresentationVariant`. Works for variant-able terms but gets messy, and
the *unqualified* default can still only be one thing.

## Recommended split

Use **Option A**, and divide annotations by scope:

| Scope            | Examples                                              | Where                                                                     |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| **Shared**       | labels, `@Common.Text`, value helps, units, semantics | on the underlying `db/schema` entities — inherited by every projection    |
| **App-specific** | `UI.LineItem`, `UI.Facets`, layouts, field groups     | on each app's own service projection                                      |
