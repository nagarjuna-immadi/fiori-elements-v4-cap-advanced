# Important Points

## 1. Compilation Scope — `using` Imports in Annotation Files

`using from '../../db/master-data';` in [layouts.cds](../app/travel_processor/layouts.cds) brings **all master-data entities into the compilation scope**.

A `using from '<file>'` with no alias and no name list does not import a *specific* name — it pulls the whole referenced `.cds` file into the model being compiled, so every definition in it (and everything *it* imports transitively) becomes available to the compiler.

```cds
using from '../../db/schema';        // Travel, Booking, ... in scope
using from '../../db/master-data';   // Airline, Airport, TravelAgency, ... in scope
```

### Why it usually isn't strictly needed here

`using TravelService from '../../srv/travel-service';` already pulls the service in, and the service transitively imports `schema` → `master-data` → `common`. So those entities are **already** in scope. The explicit `using from '../../db/master-data'` is redundant when the file only annotates `TravelService.*` entities — but it's harmless and makes the file's dependencies explicit / lets it compile standalone.

### Summary

A bare `using from '<file>'` is a *scope* directive, not a name import: it guarantees the file (and its transitive imports) is part of the model. Master-data entities become visible to the compiler this way — useful when an annotation references them directly, redundant when the service projection already brings them in.

## 2. `![ ]` — Delimited Identifiers (e.g. `![@UI.Importance]`)

The `!` in `![@UI.Importance]: #High` is **not** an operator or a negation — it's part of CDS's `![ ]` **delimited-identifier** syntax. The `!` introduces it and the `[ ]` wrap the actual name.

It lets you use a name that contains characters not allowed in a plain identifier (here `@` and `.`). Since `@UI.Importance` starts with `@`, it can't be written bare as a property name, so it must be delimited: `![@UI.Importance]`.

### Why an `@`-name appears as a record *property*

This sits inside a record — typically a `UI.DataField` inside `UI.LineItem`. Annotations applied *to* that record are written as members of the record, using their fully-qualified annotation name:

```cds
{
    $Type: 'UI.DataField',
    Value: BookingDate,
    ![@UI.Importance]: #High   // annotate THIS field with high importance
}
```

This attaches `@UI.Importance = #High` to that individual column, telling Fiori Elements to keep the column visible (high priority) when the table responsively collapses on smaller screens.

### Summary — `![ ]`

`![ ]` escapes any identifier with special characters; `![@...]` is the common case — applying a nested annotation to a record entry inside an array (columns, facets, actions, etc.).

## 3. Same Action Record in `Identification` vs `LineItem`

The **same** `UI.DataFieldForAction` record can appear under different annotation terms. The record is identical — what differs is the *term it belongs to*, which decides **where the button renders**.

```cds
// in UI.Identification → Object Page header action area
{ $Type: 'UI.DataFieldForAction', Action: 'TravelService.acceptTravel', Label: '{i18n>AcceptTravel}' }

// in UI.LineItem → List Report table toolbar (acts on selected rows)
{ $Type: 'UI.DataFieldForAction', Action: 'TravelService.acceptTravel', Label: '{i18n>AcceptTravel}' }
```

| Term | Where it renders | Acts on |
| --- | --- | --- |
| `UI.Identification` | Object Page header action area | The currently-open record |
| `UI.LineItem` | List Report table toolbar | Selected row(s) in the table |

It's intentional duplication: surfacing the same action in both terms lets the user trigger it from the list (without drilling in) **and** from the detail page. The record definition is the same; only the hosting term — and therefore the rendering location — changes.
