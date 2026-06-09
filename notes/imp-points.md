# Important Points

## Compilation Scope — `using` Imports in Annotation Files

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
