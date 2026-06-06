# CDS Extended Annotate Syntax

A single `annotate` statement can target three scopes at once — the entity
itself, its individual elements, and its bound actions. The CDS docs call this
the **extended (nested) annotate syntax**. It is *not* "annotation chaining".

## The three scopes in one statement

```cds
annotate TravelService.Travel with @( ... )   // 1. entity-level annotations
{
  BookingFee @Common.FieldControl: ...         // 2. element / field annotations
}
actions {
  rejectTravel @( ... )                        // 3. bound-action annotations
};
```

| Part | Scope | What it annotates |
| --- | --- | --- |
| `with @(...)` | entity | annotations on the entity itself |
| `{ ... }` | element block | individual fields/properties |
| `actions { ... }` | action block | the entity's bound actions |

## The `@( ... )` grouped form

Wrapping several terms in `@( ... )` separated by commas is just the
**grouped/parenthesized form** — a convenience so you don't repeat `@` on every
term. It is a plain comma-separated annotation list, not "chaining".

```cds
// grouped form
annotate TravelService.Travel with @(
  Common.SideEffects: { SourceProperties: [BookingFee], TargetProperties: ['TotalPrice'] },
  UI.HeaderInfo     : { ... }
);

// equivalent repeated form
annotate TravelService.Travel with @Common.SideEffects: { ... };
annotate TravelService.Travel with @UI.HeaderInfo     : { ... };
```

## It is purely syntactic — annotations merge across statements

The extended form is a convenience only. You can equally split the same
annotations across multiple `annotate` statements (and across multiple files):
CDS merges all annotations targeting the same entity, regardless of how many
`annotate` blocks they are spread across.

This project uses both styles:

- [field-control.cds:10](../app/travel_processor/field-control.cds#L10) — one
  extended statement covering entity + elements + actions in a single block.
- [layouts.cds](../app/travel_processor/layouts.cds) — annotates the same
  `TravelService.Travel` entity in a separate file, and CDS merges the two.

## Full example (from this project)

```cds
annotate TravelService.Travel with @(Common.SideEffects: {
  SourceProperties: [BookingFee],
  TargetProperties: ['TotalPrice']
}){
  BookingFee  @Common.FieldControl: TravelStatus.fieldControl;
  BeginDate   @Common.FieldControl: TravelStatus.fieldControl;
  EndDate     @Common.FieldControl: TravelStatus.fieldControl;
  to_Agency   @Common.FieldControl: TravelStatus.fieldControl;
  to_Customer @Common.FieldControl: TravelStatus.fieldControl;
} actions {
  rejectTravel @(
    Core.OperationAvailable             : { $edmJson: { $Ne: [{ $Path: 'in/TravelStatus_code'}, 'X']}},
    Common.SideEffects.TargetProperties : ['in/TravelStatus_code'],
  );
  acceptTravel @(
    Core.OperationAvailable             : { $edmJson: { $Ne: [{ $Path: 'in/TravelStatus_code'}, 'A']}},
    Common.SideEffects.TargetProperties : ['in/TravelStatus_code'],
  );
  deductDiscount @(
    Core.OperationAvailable             : { $edmJson: { $Eq: [{ $Path: 'in/TravelStatus_code'}, 'O']}}
  );
};
```

See also: [cds-annotations-structure.md](cds-annotations-structure.md) for the
entity / field / actions block breakdown.
