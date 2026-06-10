# Annotations Used in This Project

This document lists every annotation used across the CDS files of the
`fiori-elements-v4-cap-advanced` project, grouped by annotation vocabulary /
type, with the file and line number where each occurrence appears.

## File path abbreviations used below

| Abbreviation | Path |
| --- | --- |
| `labels.cds` | `app/travel_processor/labels.cds` |
| `value-helps.cds` | `app/travel_processor/value-helps.cds` |
| `capabilities.cds` | `app/travel_processor/capabilities.cds` |
| `layouts.cds` | `app/travel_processor/layouts.cds` |
| `field-control.cds` | `app/travel_processor/field-control.cds` |
| `customer.cds` | `app/customer/annotations.cds` |
| `schema.cds` | `db/schema.cds` |
| `master-data.cds` | `db/master-data.cds` |
| `travel-service` | `srv/travel-service.cds` |
| `v2-service` | `srv/v2-travel-service.cds` |

## UI Annotations (`@UI.*`)

These drive how Fiori Elements renders list reports, object pages, charts and
data points.

### `@UI` (block assignment of multiple UI terms)

Convenience block form that assigns several `@UI.*` terms (HeaderInfo,
LineItem, Facets, etc.) to one entity in a single annotate statement.

- `layouts.cds:10` — `annotate TravelService.Travel with @UI: { ... }`
- `layouts.cds:169` — `annotate TravelService.Booking with @UI: { ... }`
- `layouts.cds:249` — `annotate TravelService.BookingSupplement with @UI: { ... }`
- `layouts.cds:279` — `annotate TravelService.Flight with @UI: { PresentationVariant ... }`
- `layouts.cds:337` — `annotate TravelService.Travel with @UI: { ... }`

### `@UI.HeaderInfo`

Defines the object page header — the entity's title, type name and
description shown at the top of the detail view.

- `layouts.cds:29`
- `layouts.cds:171`
- `layouts.cds:251`
- `customer.cds:99`

### `@UI.Identification`

Declares the primary set of fields/actions identifying a record; used
for the general header section and quick-view content.

- `layouts.cds:12`
- `layouts.cds:170`
- `layouts.cds:250`

### `@UI.SelectionFields`

Specifies which properties appear as filter bar fields in the list
report, so users can filter the table by them.

- `layouts.cds:50`
- `layouts.cds:185`
- `customer.cds:61`

### `@UI.LineItem`

Defines the columns (and inline actions) of a table / list report.

- `layouts.cds:43` — `Visualizations: ['@UI.LineItem']`
- `layouts.cds:55`
- `layouts.cds:178` — `Visualizations: ['@UI.LineItem']`
- `layouts.cds:186`
- `layouts.cds:259` — `Visualizations: ['@UI.LineItem']`
- `layouts.cds:266`
- `customer.cds:4`

### `UI.DataField`

A `$Type` record — the default field record inside `LineItem`/`FieldGroup`/
`Identification` collections that binds a column/form field to a property.

- `layouts.cds:33, 37, 79, 147, 152, 159, 163, 478, 482, 486`
- `customer.cds:6, 9, 12, 15, 18, 21, 30, 34, 38, 42, 46, 86, 90, 93, 103`

### `UI.DataFieldForAction`

A `$Type` record used inside `Identification`/`LineItem` collections to render
an action (bound/unbound operation) as a button rather than a data field.

- `layouts.cds:14`
- `layouts.cds:19`
- `layouts.cds:24`
- `layouts.cds:57`
- `layouts.cds:62`
- `layouts.cds:85` — `Action: 'TravelService.deductDiscount'`

### `UI.DataFieldForAnnotation`

A `$Type` record that embeds another annotation target (e.g. a `DataPoint`,
`Chart` or `Contact`) as a field within a collection.

- `layouts.cds:90` — `Target: '@UI.DataPoint#Progress'`
- `layouts.cds:95` — `Target: 'to_Agency/@Communication.Contact#contact'`
- `layouts.cds:203`

### `UI.DataFieldForIntentBasedNavigation`

A `$Type` record that renders a button/link triggering intent-based
(cross-app) navigation to a semantic object and action.

- `layouts.cds:100`

### Other `UI.DataField*` record types (not used in this project)

These derive from the abstract base `UI.DataFieldAbstract` and share common
members (`Label`, `Criticality`, `![@UI.Importance]`, `![@UI.Hidden]`). Listed
here for reference — none currently appear in this project's CDS files.

| Record type | Purpose |
| --- | --- |
| `UI.DataFieldWithAction` | A value that is also clickable to trigger an action (text + action combined). |
| `UI.DataFieldWithIntentBasedNavigation` | A value rendered as a link performing intent-based (cross-app) navigation. |
| `UI.DataFieldWithNavigationPath` | A value rendered as a link following an OData navigation property (in-app, to a related entity). |
| `UI.DataFieldWithUrl` | A value rendered as a hyperlink to an external/absolute `Url`. |
| `UI.DataFieldWithActionGroup` | Groups multiple actions/IBNs under a single menu button. |
| `UI.DataFieldForActionGroup` | Menu-button grouping of actions (FE support varies by floorplan/version). |
| `UI.DataFieldForIntentBasedNavigationGroup` | Menu-button grouping of IBN targets (FE support varies). |

Note: `UI.DataFieldAbstract` is the abstract base type and is never instantiated
directly. The `With…` variants display a value *as* a link; the `For…` variants
render a standalone button/link with no underlying property value.

### `@UI.PresentationVariant`

Bundles a default sort order and the visualization(s) (table/chart) to
present, e.g. for a list or for the table shown in a value help.

- `layouts.cds:41`
- `layouts.cds:137` — `Target: 'to_Booking/@UI.PresentationVariant'`
- `layouts.cds:177`
- `layouts.cds:230` — `Target: 'to_BookSupplement/@UI.PresentationVariant'`
- `layouts.cds:257`
- `layouts.cds:279` — `#SortOrderPV`

### `@UI.Facets`

Structures the object page body into sections/tabs by referencing
field groups, tables and other facets.

- `layouts.cds:114`
- `layouts.cds:119`
- `layouts.cds:208`
- `layouts.cds:213`
- `customer.cds:51`

### `@UI.HeaderFacets`

Defines the content blocks (data points, charts, contact) shown in the
object page header area.

- `layouts.cds:404`
- `layouts.cds:462`
- `customer.cds:68`

### `@UI.FieldGroup`

Groups a set of related fields under a common label, reused inside
facets to lay out forms.

- `layouts.cds:123` — `Target: '@UI.FieldGroup#TravelData'`
- `layouts.cds:130` — `Target: '@UI.FieldGroup#i18nTravelAdministrativeData'`
- `layouts.cds:217` — `Target: '@UI.FieldGroup#GeneralInformation'`
- `layouts.cds:223` — `Target: '@UI.FieldGroup#Flight'`
- `layouts.cds:474` — `UI.FieldGroup #i18nTravelAdministrativeData`
- `customer.cds:56` — `Target: '@UI.FieldGroup#GeneratedGroup1'`
- `customer.cds:73` — `Target: '@UI.FieldGroup#ContactDetails1'`

### `@UI.DataPoint`

Defines a single key figure (value, target, criticality) used in
headers, KPIs and as the data behind a chart measure.

- `layouts.cds:91` — `Target: '@UI.DataPoint#Progress'`
- `layouts.cds:285` — `UI.DataPoint #Progress`
- `layouts.cds:312` — `DataPoint: '@UI.DataPoint#TotalSupplPrice'`
- `layouts.cds:408` — `Target: '@UI.DataPoint#TravelStatus_code'`
- `layouts.cds:413` — `Target: '@UI.DataPoint#TotalPrice'`
- `layouts.cds:418` — `Target: '@UI.DataPoint#progress'`
- `layouts.cds:423` — `UI.DataPoint #TotalPrice`
- `layouts.cds:429` — `UI.DataPoint #progress`
- `layouts.cds:457` — `DataPoint: '@UI.DataPoint#TotalSupplPrice1'`

### `@UI.Chart`

Configures an analytical chart (type, dimensions, measures), used in
object pages and as visual filters in the filter bar.

- `layouts.cds:204` — `Target: '@UI.Chart#TotalSupplPrice'`
- `layouts.cds:465` — `Target: '@UI.Chart#TotalSupplPrice1'`
- `layouts.cds:516`
- `layouts.cds:545` — `'@UI.Chart#visualFilter'`
- `layouts.cds:577` — `'@UI.Chart#visualFilter1'`
- `layouts.cds:609` — `'@UI.Chart#visualFilter2'`

### `@UI.Criticality`

Colors a value/state (e.g. red/amber/green) based on a criticality
code, used on data points and line item fields.

- `layouts.cds:81`
- `layouts.cds:298`
- `layouts.cds:402`
- `layouts.cds:444`

### `@UI.Importance`

Marks how important a column/field is (`#High`), controlling which fields
stay visible when the table is shrunk on small screens.

- `layouts.cds:68` — `![@UI.Importance]: #High`
- `layouts.cds:72` — `![@UI.Importance]: #High`
- `layouts.cds:82` — `![@UI.Importance]: #High`

### `@UI.Hidden`

Hides a property from the UI — either always (technical keys) or
dynamically via a path expression.

- `labels.cds:8, 25, 26, 43, 44, 45`
- `layouts.cds:149` — `![@UI.Hidden]: TravelStatus.cancelRestrictions`
- `layouts.cds:154` — `![@UI.Hidden]: TravelStatus.cancelRestrictions`

### `@UI.CreateHidden`

Dynamically hides the Create action/button depending on a path value,
here on the parent travel's status.

- `field-control.cds:34`

### `@UI.DeleteHidden`

Dynamically hides the Delete action/button depending on a path value,
here on the parent travel's status.

- `field-control.cds:35`

### `@UI.PartOfPreview`

Controls whether a facet is shown in the initial (collapsed) object page
preview; `false` moves it behind "Show More".

- `layouts.cds:131` — `![@UI.PartOfPreview]: false`

### `@UI.MultiLineText`

Renders a string field as a multi-line text area instead of a single
line input.

- `layouts.cds:470`

### `@UI.Placeholder`

Provides placeholder/hint text shown inside an empty input field.

- `layouts.cds:471`

### `@UI.IsImageURL`

Tells the UI the string holds an image URL so it is rendered as a
picture instead of plain text.

- `master-data.cds:11` — `@UI : {IsImageURL : true}`

### `@UI.ParameterDefaultValue`

Supplies a default value for an action parameter dialog field (here the
discount percent defaults to 5).

- `travel-service:45` — `@(UI.ParameterDefaultValue : 5)`
- `v2-service:40` — `@(UI.ParameterDefaultValue : 5)`

## Common Annotations (`@Common.*`)

SAP Common vocabulary — texts, labels, value helps, semantics, side effects.

### `@Common.Label`

Provides a human-readable label for an element, overriding the default
technical name in the UI.

- `layouts.cds:514` — `![@Common.Label] : '{i18n>Travels}'`
- `layouts.cds:529`
- `schema.cds:110, 111, 112, 113, 114`

### `@Common.Text`

Associates a code/ID field with a descriptive text field so the UI can
show a readable description instead of the raw key.

- `labels.cds:9, 21, 33, 34, 35, 39, 46, 53, 65, 78, 95`
- `travel-service:20, 24, 29, 34, 39, 60, 63`
- `v2-service:19, 22, 26, 30, 34, 54, 57`

### `@Common.TextArrangement`

Controls how the `@Common.Text` description and its key are displayed
together (here `#TextOnly` — show only the text).

- `labels.cds:21, 33, 39`

### `@Common.SemanticKey`

Marks the business key fields (e.g. TravelID) that identify a row to
users and keep draft rows stable in tables.

- `capabilities.cds:4` — `TravelService.Travel`
- `capabilities.cds:5` — `TravelService.Booking`
- `capabilities.cds:6` — `TravelService.BookingSupplement`

### `@Common.ValueList`

Defines a value help (F4) dialog for a field, mapping it to a lookup
entity and its display/filter columns.

- `value-helps.cds:11, 27, 44, 63, 80, 90, 107, 123, 140, 151, 167, 177, 198, 209, 221, 238, 253`
- `layouts.cds:550` — `#visualFilter`
- `layouts.cds:582` — `#visualFilter`
- `layouts.cds:614` — `#visualFilter`

### `@Common.ValueListWithFixedValues`

Marks a field whose allowed values are a small fixed set, rendered as a
dropdown rather than a value help dialog.

- `value-helps.cds:9` — `TravelStatus`
- `value-helps.cds:61` — `BookingStatus`

### `@Common.FieldControl`

Dynamically controls a field's state (read-only / mandatory / hidden)
based on a value, here the travel status.

- `field-control.cds:14, 15, 16, 17, 18` — `Travel`
- `field-control.cds:39, 40, 41, 42, 43, 44` — `Booking`
- `field-control.cds:65, 66, 67, 68` — `BookingSupplement`

### `@Common.SideEffects`

Tells the UI that changing source properties/actions invalidates target
properties so they are re-fetched from the server.

- `field-control.cds:10` — `Travel - SourceProperties/TargetProperties`
- `field-control.cds:23` — `rejectTravel action`
- `field-control.cds:27` — `acceptTravel action`
- `layouts.cds:492` — `#ReactonItemCreationOrDeletion`

### `@Common.UnitSpecificScale`

Makes the number of decimal places of an amount depend on the currency
(e.g. JPY 0, EUR 2, BHD 3).

- `field-control.cds:72` — `annotate Currency`

## Measures Annotations (`@Measures.*`)

### `@Measures.ISOCurrency`

Links an amount field to its currency code so the UI formats it as a
currency with the right symbol and scale.

- `labels.cds:13, 14` — `BookingFee, TotalPrice`
- `labels.cds:32` — `FlightPrice`
- `labels.cds:47` — `Price - BookingSupplement`
- `labels.cds:88` — `Price - Flight`
- `labels.cds:96` — `Price - Supplement`

## Core Annotations (`@Core.*`)

### `@Core.Computed`

Marks a field as server-computed and therefore read-only / not required
on input (e.g. generated keys, dates).

- `field-control.cds:8` — `annotate cds.UUID`
- `field-control.cds:38` — `BookingDate`
- `schema.cds:37` — `BookingID`
- `schema.cds:56` — `BookingSupplementID`

### `@Core.OperationAvailable`

Enables/disables an action's button dynamically via an expression on the
bound instance (e.g. reject only if not already rejected).

- `field-control.cds:22` — `rejectTravel`
- `field-control.cds:26` — `acceptTravel`
- `field-control.cds:30` — `deductDiscount`

## Communication Annotations (`@Communication.*`)

### `@Communication.Contact`

Describes a contact (name, phone, email, address) so the UI can render a
contact quick view / card, here for the agency.

- `layouts.cds:96` — `Target: 'to_Agency/@Communication.Contact#contact'`
- `layouts.cds:319` — `Communication.Contact #contact`

## Analytics / Aggregation Annotations

### `@Aggregation.ApplySupported`

Declares which grouping/aggregation operations the entity supports,
enabling analytical (ALP) tables and charts.

- `travel-service:72` — `TravelService.Travel`
- `v2-service:66` — `V2TravelService.Travel`

### `@Analytics.AggregatedProperty`

Defines a reusable aggregated measure (e.g. count distinct of TravelID)
referenced by charts and presentation variants.

- `layouts.cds:523` — `'@Analytics.AggregatedProperty#TravelID_countdistinct'`
- `layouts.cds:539`
- `layouts.cds:571`
- `layouts.cds:603`

## OData Annotations (`@odata.*`)

### `@odata.draft.enabled`

Turns on SAP Fiori draft handling for the entity, enabling editable
drafts with save/activate and concurrent-edit safety.

- `capabilities.cds:3` — `TravelService.Travel`
- `v2-service:64` — `V2TravelService.Travel`

### `@odata.Type`

Overrides the OData EDM type exposed for a field (e.g. UUID as
Edm.String, byte field as Edm.Byte) for client compatibility.

- `field-control.cds:8` — `cds.UUID -> 'Edm.String'`
- `schema.cds:85` — `fieldControl -> 'Edm.Byte'`

### `@odata.singleton`

Exposes the entity as an OData singleton — a single, keyless instance
accessed directly without a key.

- `schema.cds:108`

## Validation / Assertion Annotations (`@assert.*`)

### `@assert.target`

Validates on save that a managed association points to an existing
target record (referential integrity check).

- `schema.cds:30` — `to_Agency`

### `@assert.range`

Enforces that a value lies within the given numeric range (here a
percentage between 1 and 100).

- `travel-service:70` — `type Percentage : Integer @assert.range: [1,100]`

### `@assert.unique.email`

Declares a named uniqueness constraint across the listed fields (here
shown as a commented-out example).

- `master-data.cds:70` — commented-out example: `@assert.unique.email`

## Persistence / Service-level Annotations

### `@cds.autoexpose`

Automatically exposes referenced (master-data) entities in the service
so value helps and text lookups resolve.

- `travel-service:67` — `my.MasterData`
- `v2-service:61` — `my.MasterData`

### `@readonly`

Marks a field or entity as non-writable, so it cannot be edited/created
through the service.

- `schema.cds:21, 25, 27, 29` — `TravelID, TotalPrice, Progress, TravelStatus`
- `travel-service:20, 67`
- `v2-service:19, 61`

### `@mandatory`

Marks a field/parameter as required input, enforced both in the UI and
on the server.

- `travel-service:45` — `percent parameter of deductDiscount`
- `v2-service:40` — `percent parameter of deductDiscount`

### `@title`

Sets the (i18n) label/heading for an entity or field shown in the UI.

- `labels.cds:7, 9-17, 24, 27-35, 42, 46-49, 52-61, 64-74, 77-80, 83-91, 94-98` — entity & field titles, i18n keys
- `travel-service:48, 54` — `FullName`
- `v2-service:48, 54` — `FullName`

### `@restrict` (authorization)

Defines role-based access rules (which roles may read/write/run actions)
at service or entity level.

- `travel-service:5` — service-level restrict
- `travel-service:6` — entity-level restrict
- `v2-service:6` — entity-level restrict
