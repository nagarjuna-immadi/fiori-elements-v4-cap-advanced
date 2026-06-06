# CDS Annotation Structure

Annotations for a Fiori Elements / CAP service are typically organized into three blocks.

> **Note — this is a simplification, not a CDS rule.** "Three blocks" is just a
> convenient way to *think about* Fiori Elements annotations by purpose. CDS
> itself does not limit annotations to three scopes (see
> [What CDS actually allows](#what-cds-actually-allows) below).

## 1. Entity-level

Annotations that describe the entity as a whole and drive the overall page layout.

- `@UI.HeaderInfo` — title, description, type name (singular/plural)
- `@UI.SelectionFields` — filter bar fields (List Report)
- `@UI.PresentationVariant` — default sort order and visualizations
- `@UI.LineItem` — table columns (List Report / table sections)
- `@UI.Facets` — sections/tabs on the Object Page
- `@Capabilities` — Insertable / Updatable / Deletable, search, filter restrictions

## 2. Field block

Annotations applied to individual properties.

- `@title` / `@Common.Label` — field labels
- `@Common.Text` + `@Common.TextArrangement` — descriptive text and how it's shown
- `@Common.ValueList` — value help
- `@UI.Hidden` / `@UI.HiddenFilter` — visibility control
- `@Measures.ISOCurrency` / `@Measures.Unit` — currency/unit association
- `@readonly`, `@mandatory` — field-level constraints

## 3. Actions block

Annotations for bound/unbound actions and their presentation.

- `@Common.SideEffects` — fields/entities to refresh after an action
- `@UI.LineItem` / `@UI.Identification` with `Data​FieldForAction` — placing action buttons
- `@Core.OperationAvailable` — enable/disable an action dynamically
- `@cds.odata.bindingparameter` — bound action configuration

---

**Convention in this project:** labels live in their own annotation file, all other
annotations in a second file (see commit history).

---

## What CDS actually allows

The "three blocks" above are a **conceptual grouping by purpose** — a mental
model for organizing Fiori Elements annotations. They are *not* a CDS language
rule. The extended `annotate` syntax can target more than three scopes:

```cds
annotate Service.Entity with @(...)   // entity itself
{
  field @(...) {                       // element
    subField @(...)                    // nested / sub-element (structured types)
  }
}
actions {
  doThing @(...) (
    param @(...)                       // action parameters
  );
};
```

So the syntactic targets include **entity, elements, sub-elements, actions, and
action parameters** — at least five, not three.

Beyond a single entity, annotations also apply at other levels that don't fit
the three buckets at all:

- **Service-level** — `@path`, `@requires`, `@restrict`
- **Type-level** — e.g. `@assert.range` on a reusable type
- **Functions** — bound/unbound functions, like actions

The three blocks remain a useful way to *think about* a Fiori service's UI
annotations; just don't read them as an exhaustive taxonomy.

See also: [cds-extended-annotate-syntax.md](cds-extended-annotate-syntax.md).

---

## Example 1 — `TravelService.Travel` (root entity)

The three blocks combined for `TravelService.Travel`:

```cds
using { TravelService } from '../../srv/travel-service';

annotate TravelService.Travel with @UI: {

  // ── Entity-level ──────────────────────────────────────────────
  HeaderInfo          : {
    TypeName      : '{i18n>Travel}',
    TypeNamePlural: '{i18n>Travels}',
    Title         : { $Type: 'UI.DataField', Value: Description },
    Description   : { $Type: 'UI.DataField', Value: TravelID }
  },
  SelectionFields     : [ to_Agency_AgencyID, to_Customer_CustomerID, BeginDate ],
  PresentationVariant : {
    Text          : 'Default',
    Visualizations: ['@UI.LineItem'],
    SortOrder     : [{ $Type: 'Common.SortOrderType', Property: TravelID, Descending: true }]
  },
  LineItem            : [
    { $Type: 'UI.DataField', Value: TravelID },
    { $Type: 'UI.DataField', Value: Description },
    { $Type: 'UI.DataField', Value: TotalPrice },
    // ── Actions block (table toolbar buttons) ──────────────────
    { $Type: 'UI.DataFieldForAction', Action: 'TravelService.acceptTravel', Label: '{i18n>AcceptTravel}' },
    { $Type: 'UI.DataFieldForAction', Action: 'TravelService.rejectTravel', Label: '{i18n>RejectTravel}' }
  ]
};

// ── Field block ───────────────────────────────────────────────
annotate TravelService.Travel with {
  TravelID    @title: '{i18n>TravelID}'    @readonly;
  Description @title: '{i18n>Description}' @mandatory;
  TotalPrice  @title: '{i18n>TotalPrice}'  @Measures.ISOCurrency: CurrencyCode_code;
  BeginDate   @title: '{i18n>BeginDate}';
};

// ── Actions block (dynamic enablement + side effects) ─────────
annotate TravelService.Travel with @Common.SideEffects #acceptTravel: {
  SourceProperties: [ TravelStatus_code ],
  TargetProperties: [ 'TotalPrice' ]
};
annotate TravelService.acceptTravel with @(
  Core.OperationAvailable: in.TravelStatus_code <> 'A'
);
```

## Example 2 — `TravelService.Booking` (child entity)

The same three blocks apply to a sub-entity. Here the field and action
control is driven by the *parent* travel's status via path expressions.

```cds
using { TravelService } from '../../srv/travel-service';

annotate TravelService.Booking with @UI: {

  // ── Entity-level ──────────────────────────────────────────────
  HeaderInfo          : {
    TypeName      : '{i18n>Bookings}',
    TypeNamePlural: '{i18n>Bookings}',
    Title         : { Value: to_Customer.LastName },
    Description   : { Value: BookingID }
  },
  PresentationVariant : {
    Visualizations: ['@UI.LineItem'],
    SortOrder     : [{ $Type: 'Common.SortOrderType', Property: BookingID, Descending: false }]
  },
  LineItem            : [
    { Value: BookingID },
    { Value: BookingDate },
    { Value: to_Customer_CustomerID },
    { Value: ConnectionID, Label: '{i18n>FlightNumber}' },
    { Value: FlightPrice },
    { Value: BookingStatus_code }
  ],
  Facets              : [
    { $Type: 'UI.ReferenceFacet', ID: 'BookingData', Target: '@UI.FieldGroup#GeneralInformation', Label: '{i18n>Booking}' }
  ]
};

// ── Field block (control inherited from the parent Travel) ────
annotate TravelService.Booking {
  BookingDate   @Core.Computed;
  ConnectionID  @Common.FieldControl: to_Travel.TravelStatus.fieldControl;
  FlightPrice   @Common.FieldControl: to_Travel.TravelStatus.fieldControl;
  BookingStatus @Common.FieldControl: to_Travel.TravelStatus.fieldControl;
};

// ── Actions block (restrict create/delete on child collection) ─
annotate TravelService.Booking with @(
  Capabilities.NavigationRestrictions: {
    RestrictedProperties: [{
      NavigationProperty: to_BookSupplement,
      InsertRestrictions: { Insertable: to_Travel.TravelStatus.insertDeleteRestriction },
      DeleteRestrictions: { Deletable : to_Travel.TravelStatus.insertDeleteRestriction }
    }]
  }
);
```
