# SideEffects Annotation — Multiple Source & Target Properties

Both `SourceProperties` and `TargetProperties` are arrays. The semantics:

> A change to **any** property listed in `SourceProperties` triggers recomputation / re-fetch of **all** properties in `TargetProperties`.

There is **no** per-source → per-target mapping inside a single SideEffects annotation. It is a many-to-many block: the union of sources is watched, and when any one of them changes, the entire set of targets is requested again from the backend.

### Example — many-to-many within one annotation

```cds
annotate TravelService.Travel with @(Common.SideEffects #recalcPrice: {
  SourceProperties: [BookingFee, CurrencyCode_code],
  TargetProperties: ['TotalPrice', 'BookingFee']
});
```

→ Editing **either** `BookingFee` or `CurrencyCode_code` causes Fiori Elements to PATCH and re-read **both** `TotalPrice` and `BookingFee`.

## Practical notes

1. **Name your SideEffects qualifier** (the `#recalcPrice` above). On the same entity you can only have one *unqualified* `@Common.SideEffects`. If you need genuinely independent trigger → target groupings (source A refreshes only target X, source B refreshes only target Y), split them into **separate qualified annotations**, because within one annotation everything is coupled:

   ```cds
   annotate TravelService.Travel with @(
     Common.SideEffects #fee   : { SourceProperties: [BookingFee],
                                   TargetProperties: ['TotalPrice'] },
     Common.SideEffects #dates : { SourceProperties: [BeginDate, EndDate],
                                   TargetProperties: ['Duration'] }
   );
   ```

2. **`SourceEntities`** is also available if a change to a whole navigation / association should trigger the targets (not just a scalar field).

3. **`TargetProperties` strings are path-based:**
   - use `'in/...'` prefixes for action parameters (e.g. `'in/TravelStatus_code'`)
   - use `'to_Nav/Property'` for targets across associations.

## Summary

Keep multiple sources/targets in **one** annotation only if you genuinely want every source to refresh every target. Otherwise split into **qualified annotations** for independent groupings.
